import React, { createRef, useEffect, useRef, useState } from "react";
import testImage from '../img/cat.MacbookPro.jpg'
import uniqid from 'uniqid';
import { useCart } from "../header/shoppingCart";
import { create } from "zustand";
import { initial, omit } from "lodash";
import Cart from "../header/shoppingCart";
import reviewStar from '../img/reviewStar.png'
import reviewStarEmpty from '../img/emptyStar2.png'
import { DisplayReviewStars } from "../reviewSystem/displayStars";
import { user } from '../header/header'
import { auth, database } from "../firebaseAndStripe/firebase";
import { ref as databaseRef, onValue, update, child } from "firebase/database";
import { Link } from "react-router-dom";


/* 
This component is where all the product details are displayed. The details are passed on as props in the Route.js file.
Other things this component contains are: image slider (where you can hover and click on images), 
add to cart functionality with the option to add up to 10 quantities to the cart,
a rating system at the bottom. If you are logged in, you can click on 1 to 5 stars and it will submit this rating to the Firebase Database. 
The total product rating will then be recalculated.

Note that I am importing the Zustand state from the shoppingcart.js file.
*/
const useDropdown = create((set) => ({
    quantity: 1,
    changeQuantity: (amount) =>
    set(() => ({ quantity: amount}))
}))



function ProductDetailPage (props) {

    const userInfo = user((state) => state.userInfo)

    const ID = props.ID
    const title = props.title
    const category= props.category
    const subcategory = props.subcategory
    const price = props.price
    const description = props.description
    const reviews = props.reviews
    const deliveryTime = props.deliveryTime
    const author = props.author
    const brand = props.brand
    const screenSize = props.screenSize
    const chipSet = props.chipSet
    const memorySize = props.memorySize
    const publisher = props.publisher
    const imageUrl1 = props.imageUrl1
    const imageUrl2 = props.imageUrl2
    const imageUrl3 = props.imageUrl3
    const imageUrl4 = props.imageUrl4
    const imageUrl5 = props.imageUrl5
    const stripePriceID = props.stripePriceID
    const stripeProductID = props.stripeProductID

    

    const items = useCart((state) => state.items)
    const addItems = useCart((state) => state.addItems);

    const quantity = useDropdown((state) => parseInt(state.quantity))
    const changeQuantity = useDropdown((state) => state.changeQuantity);

    const [clickedImage, setClickedImage] = useState(imageUrl1)
    const [highlightedImage, setHighlightedImage] = useState(clickedImage)
    const [IDOfClickedImage, setIDOfClickedImage] = useState('imageSmall1')
    const [instantRatingFeedback, setInstantRatingFeedback] = useState(false)
    const [addedToCart, setAddedToCart] = useState(false)

    function addToCart () {

        const intialCart = items
        let itemIsPresentInCart = false;
        intialCart.map((element) => {
        if(element.ID === ID) {
                element.quantity += quantity
                itemIsPresentInCart = true
            }
        }) 
        if(itemIsPresentInCart === false) {
            intialCart.push({ID, title, price, imageUrl1, quantity, stripePriceID, stripeProductID })
        }
        addItems(intialCart)
        changeQuantity(1)
        buttonEffect()
    }

    function buttonEffect () {
        setAddedToCart(true)
        const timeoutId = setTimeout(() => {
            setAddedToCart(false);
          }, 100); // Reset the clicked state variable after 500ms
          return () => clearTimeout(timeoutId);
    }

    function changeImageByHoveringEnter(event) {
        console.log(event.target)
        let string;
        if(event.target.className === 'divImageSmall') {
            string = event.target.querySelector('img').src
        } else if (event.target.className === 'imageSmall') {
            string = event.target.src
        }

        console.log(string)
            setHighlightedImage(string)
    }

    function changeImageByHoveringLeave(event) {
            setHighlightedImage(clickedImage)
    }

    function changeImageByClicking(event) {
        setIDOfClickedImage(event.target.id)
        let string;
        if(event.target.className === 'divImageSmall') {
            string = event.target.querySelector('img').src
        } else if (event.target.className === 'imageSmall') {
            string = event.target.src
        }
            setClickedImage(string)
    }








    const [hoveredStar, setHoveredStar] = useState(0)
    const [clickedStar, setClickedStar] = useState()

    useEffect(() => {
        if(clickedStar != undefined) {
            setInstantRatingFeedback(true)
        }
    }, [clickedStar])

    function checkDatabaseForUserRating () { // check if the user has submitted a rating earlier. This is important because we don't want a user to submit ratings multiple times
        if(reviews[userInfo.uid]) { // there is no need to fetch anything here yet, because the information is available as a prop.
            return  reviews[userInfo.uid] // check if the user has a rating between all the ratings, if so, return that rating. This rating can be rendered with a later function.
        } else {
            return false // if no rating from the user is found, return false
        }
    }

    function renderUserRating (stars) { // 
        let array = []
        const star = <img src={reviewStar}/>            
        const emptyStar = <img src={reviewStarEmpty}/>
    
        for(let i = 0; i < stars; i++) {
            array.push(star)
        }
        
        for(let i = 0; i < (5 - stars); i++) {
            array.push(emptyStar)
        }

        const reviewStars = array.map((element, index) => {
            return (
                <li key={index} className='stars'>{element}</li>
            )
        })

        return(
            <ul>
                {reviewStars}
            </ul>
        )
    }

    async function transferRatingToDatabase(rating) { // this function calls the Firebase Database of the product, loops to the review object, and then adds the users rating to that review object.

        let categoryDatabase = category + '/'
        let subcategoryDatabase = subcategory + '/'
    
        if(subcategoryDatabase === 'gameconsole/') { //gaming consoles are not stored in the folder 'gameconsole/', but 'gameConsoles/'. This adjustment ensures correct fetching.
            subcategoryDatabase = 'gameConsoles/'
        }


        const dbRef = databaseRef(database, 'products/' + categoryDatabase + subcategoryDatabase);
        let productObject;
        let productKey;
        const reviewData = new Promise((resolve) => {
            onValue(dbRef, (snapshot) => {
                const data = snapshot.val()
                console.log(data)
                for (let key in data) {
                    console.log(data[key].ID)
                    if(data[key].ID === ID) {
                        productObject = data[key]
                        productKey = key
                        break
                    }
                }
                if(!productObject) {
                    console.log('could not find product review key in database')
                    return;
                }

                resolve(productObject)
            }) 
        })
        console.log(productObject)
        
        let newReviewData = productObject['reviews']

        if(newReviewData === '0') {
            newReviewData = {[userInfo.uid] : rating}
        } else {
            newReviewData[userInfo.uid] = rating
        }
        await update(child(dbRef, productKey), { reviews: newReviewData });

        console.log('updated product reviews!')
    }

    function transferRatingToDatabaseIntermediary(rating) { // this function stores the rating in the database and it stores the rating in the state (so it can be displayed on the product page)
        if(!clickedStar) { //this if condition prevents potential bugs when user rapidly clicks on ratings
            transferRatingToDatabase(rating)
        }
        setClickedStar(rating)

    }

    function SubmitRating() { 
        // If the user is logged in and has not given a rating yet, there will be 5 empty stars on the product page.
        // If the user then hovers over these stars, they turn into 'full' stars. So if you hover over the 3rd star, the 1st, 2nd and 3rd star will be full, and 4th and 5th empty.
        // If user stops hovering the stars, the stars will appear as 5 empty stars once again. When the user clicks on a star, it will activate the onClick function.
        // This onclick function submits the score to the Firebase Database AND it will 'freeze' the rating you submitted. So if you submitted 3/5 stars, it will be frozen at 3/5 stars.
        let score;
        if(clickedStar === undefined) {
            score = hoveredStar
        } else {
            score = clickedStar
        }
        let array = []
        const star = <img src={reviewStar}/>            
        const emptyStar = <img src={reviewStarEmpty}/>
    
        for(let i = 0; i < score; i++) {
            array.push(star)
        }
        
        for(let i = 0; i < (5 - score); i++) {
            array.push(emptyStar)
        }
    
        const reviewStars = array.map((element, index) => {
            return (
                <li
                key={index} 
                className='stars' 
                onMouseEnter={() => setHoveredStar(index + 1)} 
                onMouseLeave={() => setHoveredStar(0)} 
                onClick={() => transferRatingToDatabaseIntermediary(index + 1)} 
                >{element}</li>
            )
            
        })

        return (
            <ul>
                {reviewStars}
            </ul>
        )
    }

    return (
        <div className="detailPageOuterLayer">
            <div className="responsiveTitleSegment">
                <div className="informationTitleResponsive"><h1 className="informationTitleResponsiveInner">{title}</h1></div>
            </div>
            <div className="detailPageGridLayout">
                <div className="detailPageImage">
                    <div className="detailPageImageSmall">
                    {imageUrl1 != undefined ?
                        <div id="divImageSmall1" 
                        className="divImageSmall" 
                        onClick={(event) => changeImageByClicking(event)} 
                        onMouseEnter={(event) => changeImageByHoveringEnter(event)} 
                        onMouseLeave={(event) => changeImageByHoveringLeave(event)} 
                        style={{border : (IDOfClickedImage === 'imageSmall1' || IDOfClickedImage === 'divImageSmall1') ? '2px solid #76f7bf' : 'none'}}>
                              <img  
                                className="imageSmall"
                                id="imageSmall1"
                                src={imageUrl1}
                                onClick={(event) => changeImageByClicking(event)} 
                                onMouseEnter={(event) => changeImageByHoveringEnter(event)} 
                                onMouseLeave={(event) => changeImageByHoveringLeave(event)} 
                              /> 
                        </div>
                    :null} 

                    {imageUrl2 != undefined ?
                        <div id="divImageSmall2" 
                        className="divImageSmall" 
                        onClick={(event) => changeImageByClicking(event)} 
                        onMouseEnter={(event) => changeImageByHoveringEnter(event)} 
                        onMouseLeave={(event) => changeImageByHoveringLeave(event)} 
                        style={{border : (IDOfClickedImage === 'imageSmall2' || IDOfClickedImage === 'divImageSmall2') ? '2px solid #76f7bf' : 'none'}}>
                              <img  
                                className="imageSmall"
                                id="imageSmall2"
                                src={imageUrl2}
                                onClick={(event) => changeImageByClicking(event)} 
                                onMouseEnter={(event) => changeImageByHoveringEnter(event)} 
                                onMouseLeave={(event) => changeImageByHoveringLeave(event)} 
                              /> 
                        </div>
                    :null} 

                    {imageUrl3 != undefined ?
                        <div id="divImageSmall3" 
                        className="divImageSmall" 
                        onClick={(event) => changeImageByClicking(event)} 
                        onMouseEnter={(event) => changeImageByHoveringEnter(event)} 
                        onMouseLeave={(event) => changeImageByHoveringLeave(event)} 
                        style={{border : (IDOfClickedImage === 'imageSmall3' || IDOfClickedImage === 'divImageSmall3') ? '2px solid #76f7bf' : 'none'}}>
                              <img  
                                className="imageSmall"
                                id="imageSmall3"
                                src={imageUrl3}
                                onClick={(event) => changeImageByClicking(event)} 
                                onMouseEnter={(event) => changeImageByHoveringEnter(event)} 
                                onMouseLeave={(event) => changeImageByHoveringLeave(event)} 
                              /> 
                        </div>
                    :null} 

                    {imageUrl4 != undefined ?
                        <div id="divImageSmall4" 
                        className="divImageSmall" 
                        onClick={(event) => changeImageByClicking(event)} 
                        onMouseEnter={(event) => changeImageByHoveringEnter(event)} 
                        onMouseLeave={(event) => changeImageByHoveringLeave(event)} 
                        style={{border : (IDOfClickedImage === 'imageSmall4' || IDOfClickedImage === 'divImageSmall4') ? '2px solid #76f7bf' : 'none'}}>
                              <img  
                                className="imageSmall"
                                id="imageSmall4"
                                src={imageUrl4}
                                onClick={(event) => changeImageByClicking(event)} 
                                onMouseEnter={(event) => changeImageByHoveringEnter(event)} 
                                onMouseLeave={(event) => changeImageByHoveringLeave(event)} 
                              /> 
                        </div>
                    :null} 

                    {imageUrl5 != undefined ?
                        <div id="divImageSmall5" 
                        className="divImageSmall" 
                        onClick={(event) => changeImageByClicking(event)} 
                        onMouseEnter={(event) => changeImageByHoveringEnter(event)} 
                        onMouseLeave={(event) => changeImageByHoveringLeave(event)} 
                        style={{border : (IDOfClickedImage === 'imageSmall5' || IDOfClickedImage === 'divImageSmall5') ? '2px solid #76f7bf' : 'none'}}>
                              <img  
                                className="imageSmall"
                                id="imageSmall5"
                                src={imageUrl5}
                                onClick={(event) => changeImageByClicking(event)} 
                                onMouseEnter={(event) => changeImageByHoveringEnter(event)} 
                                onMouseLeave={(event) => changeImageByHoveringLeave(event)} 
                              /> 
                        </div>
                    :null} 

                    </div>
                    <div className="detailPageImageBigContainer">
                    <img className="detailPageImageBig" src={highlightedImage} />
                    </div>
                </div>
                <div className="detailPageInformation">
                    <div className="informationTitle"><h1>{title}</h1></div>
                    <div className="informationBrand"> {brand != undefined ? <div className="productDetailPageUnderTitle"><b>Brand: </b><div className="productDetailPageBrand">{brand}</div></div> : <div className="productDetailPageUnderTitle"><b>Author:</b><div className="productDetailPageAuthor">{author}</div></div> }</div>
                    <div className="informationReview"> <DisplayReviewStars reviews={reviews}/></div>
                    <div className="informationDescription"><div className="aboutThisItem"><b>About this item</b></div>{description}</div>
                    <div className="detailPageAdditionalInformation">
                <div><b>Additional info</b></div>
                    {screenSize ? <div>- Screen size: {screenSize}</div> : null}
                    {chipSet ? <div>- Chipset: {chipSet}</div> : null}
                    {memorySize ? <div>- Memory size: {memorySize}</div> : null}
                    {publisher ? <div>- Publisher: {publisher}</div> : null}
                </div>
                </div>
                <div className="detailPagePurchase">
                <div><h2>€ {price}</h2></div>
                <div className="freeDelivery">Free delivery on orders over €20 shipped by Ecom</div>
                <div className="quantity">
                    Quantity: 
                    <form>
                        <select value={quantity} onChange={(event) => changeQuantity(event.target.value)}>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                            <option>6</option>
                            <option>7</option>
                            <option>8</option>
                            <option>9</option>
                            <option>10</option>
                        </select>
                    </form>
                </div>
                <div className="addToCartButtonAndDelivery">
                    <button onClick={() => addToCart()} className='addToCartButton' style={ addedToCart ? {transform : 'scale(1.1)'} : null}>Add to cart</button>
                                    <div>Delivery time: {deliveryTime} day</div>
                    </div>

                </div>
            </div>

            <div className="userReview"><b>Your rating:</b>
            {userInfo && !checkDatabaseForUserRating() && !clickedStar ? <SubmitRating/> : null}
            {instantRatingFeedback ? <p>Thank for your rating!</p> : null}
            {userInfo && checkDatabaseForUserRating() ? <p>Your rating has been submitted already!</p> : null}
            {userInfo && checkDatabaseForUserRating() ? renderUserRating(checkDatabaseForUserRating()) : null}
            {!userInfo ? <Link to='/account'><p>Please log in or create an account to leave a rating</p></Link> : null}
            </div>
        </div>
    )
}

export default ProductDetailPage;