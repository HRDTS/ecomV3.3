import React, { useEffect, useState } from "react";
import { storage, database } from "../firebaseAndStripe/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getDatabase, set, ref as DBRef } from "firebase/database";
import filters from "./filters";
import uniqid from 'uniqid';
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Stripe from "stripe";
import { user } from '../header/header';
import { Link } from "react-router-dom";

const stripe = require('stripe')('***REMOVED***');

// This marketplace.js file is where I allow the user to publish his/her product on the website.
// I am basically getting all the required information from the user to publish the product, including atleast 1 image. This is done by using a simple form and states.
// Users can upload up to 3 images.

// Perhaps the most important part here is to create a special Stripe Product for the published product (this will be used for checkouts) and add the item to Firebase Database
// Adding the product to Firebase allows it to be shown on the page since all the products are dynamically rendered from the Firebase Database.
// After the product is submitted, I require the user to reload the page.
// The page reload is necessary because the new product requires a Route Path. This Route Path can only be generated when the page is reloaded.
// If you look at Route.js, you will see that the Route Paths are dynamically rendered from the Database. 

function Marketplace (props) {
    const userInfo = user((state) => state.userInfo) // user authentication is stored here.

    const [category, setCategory] = useState()
    const [subcategory, setSubcategory] = useState()
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [brand, setBrand] = useState('')
    const [price, setPrice] = useState('')
    const [screenSize, setScreenSize] = useState('')
    const [chipset, setChipset] = useState('')
    const [memorySize, setMemorySize] = useState('')
    const [author, setAuthor] = useState('')
    const [publisher, setPublisher] = useState('')
    const [ID, setID] = useState(uniqid())
    const [image1, setImage1] = useState(false)
    const [image2, setImage2] = useState(false)
    const [image3, setImage3] = useState(false)

    const [image1Url, setImage1Url] = useState(false)
    const [image2Url, setImage2Url] = useState(false)
    const [image3Url, setImage3Url] = useState(false)

    const [submitted, setSubmitted] = useState(false)

 
async function handleImage1(event) {
    if (event.target.files[0]) {
        const selectedImage = await event.target.files[0];
        setImage1(selectedImage)
        const imageRef1 = ref(storage, `userUpload/${title}${ID}-image1`);
        const uploadImage = await uploadBytes(imageRef1, selectedImage); //upload image to firebase
        const urlForUploadedImage = await getDownloadURL(imageRef1); //get download url from firebase
        setImage1Url(urlForUploadedImage);
    }
}

async function handleImage2(event) {
    if (event.target.files[0]) {
        const selectedImage = await event.target.files[0];
        setImage2(selectedImage)
        const imageRef2 = ref(storage, `userUpload/${title}${ID}-image2`);
        const uploadImage = await uploadBytes(imageRef2, selectedImage); //upload image to firebase
        const urlForUploadedImage = await getDownloadURL(imageRef2); //get download url from firebase
        if(image1Url === false) {
            setImage1Url(urlForUploadedImage);
        } else {
            setImage2Url(urlForUploadedImage);
        }

    }
}

async function handleImage3(event) {
    if (event.target.files[0]) {
        const selectedImage = await event.target.files[0];
        setImage3(selectedImage)
        const imageRef3 = ref(storage, `userUpload/${title}${ID}-image3`);
        const uploadImage = await uploadBytes(imageRef3, selectedImage); //upload image to firebase
        const urlForUploadedImage = await getDownloadURL(imageRef3); //get download url from firebase
        if(image1Url === false) {
            setImage1Url(urlForUploadedImage);
        } else if (image2Url === false) {
            setImage2Url(urlForUploadedImage);
        } else {
            setImage3Url(urlForUploadedImage);
        }

    }
}    

    let productID;
    let priceID;
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        setSubmitted(true)
        console.log(event)
        event.preventDefault() 

        let categoryNameForDatabase = category.slice(8).toLowerCase()
        let subcategoryNameForDatabase = subcategory.slice(11).toLowerCase()
        if(subcategoryNameForDatabase === 'gameconsoles') {
            subcategoryNameForDatabase = 'gameConsoles'
        }  

        addProductsToStripe(title, description, ID, price, image1Url)
        .then( () => {
            set(DBRef(database, 'products/' + `${categoryNameForDatabase}/` + `${subcategoryNameForDatabase}/` + `${title}${ID}`), {
                ID: ID,
                category: category,
                subcategory: subcategory,
                title: title,
                description: description,
                brand: brand,
                price: Number(price),
                screenSize: Number(screenSize),
                chipSet: Number(chipset),
                memory: Number(memorySize),
                author: author,
                publisher: publisher,
                imageUrl1: image1Url,
                imageUrl2: image2Url,
                imageUrl3: image3Url,
                deliveryTime: 1,
                reviews: '0',
                stripeProductID: productID,
                stripePriceID: priceID
            })
        })
        .then(() => {
            return navigate('/productPublished')
        })
        
    }

    async function addProductsToStripe (title, description, id, pricing, image) {
        try {
          const product = await stripe.products.create({
            name: title,
            type: 'good',
            description: description,
            images: [image],
            metadata: {
              firebaseID: id
            }
            })
    
            const price = await stripe.prices.create({
              unit_amount: (pricing * 100),
              currency: 'usd',
              product: product.id,
            })
            console.log(product.id, price.id)
          console.log('Products added to Stripe successfully.');
          productID = product.id;
          priceID = price.id
          } catch (error) {
            console.error(error);
          } 
        }    
    
    return (
        <div className="marketplaceOuterDiv">
            {!userInfo ? <Link to='/account' className="cartButton"> <button>Login to publish products</button> </Link> :
            <div> 
            <h1 className="welcomeToMarketplace">Welcome to the marketplace!</h1>
            <h2>This is where you add your products to the Ecom Marketplace.</h2>
            <h3>All published products require atleast 1 image*</h3>
            <form className="marketplaceForm" onSubmit={(event) =>  handleSubmit(event)}>
                <div>
                <label htmlFor='category'> Choose your category</label>
                <select required name="category" onChange={(event) => setCategory(event.target.value)}>
                    <option value='' hidden>category</option>
                    <option value='categoryElectronics'>Electronics</option>
                    <option value='categoryBooks'>Books</option>
                </select>
                </div>

                <div>
                <label htmlFor='subcategory'> Choose your subcategory</label>
                <select required name="subcategory" onChange={(event) => setSubcategory(event.target.value)}>
                    <option value='' hidden>subcategory</option>
                    {category === undefined ? <option value='' disabled>choose a category first</option> : null}
                    {category === 'categoryElectronics' ? <option value='subcategoryTelevisions'>Televisions</option> : null}
                    {category === 'categoryElectronics' ? <option value='subcategoryPhones'>Phones</option> : null}
                    {category === 'categoryElectronics' ? <option value='subcategoryGameConsole'>Game Consoles</option> : null}
                    {category === 'categoryBooks' ? <option value='subcategoryScience'>Science</option> : null}
                    {category === 'categoryBooks' ? <option value='subcategoryHistory'>History</option> : null}
                    {category === 'categoryBooks' ? <option value='subcategoryBiography'>Biography</option> : null}
                </select>
                </div>

                {subcategory != undefined ?
                <div>
                    <label htmlFor="title">Title of your product</label>
                    <textarea className="formTextArea" required name="title" type='text' maxLength={50} onChange={(event) => setTitle(event.target.value)} ></textarea>
                </div>
                : null}

                {subcategory != undefined ?
                <div>
                    <label htmlFor="description">Short description</label>
                    <textarea className="formTextAreaDescription" required name="description" type='text' maxLength={100} onChange={(event) => setDescription(event.target.value)}></textarea>
                </div>
                : null}


                {subcategory != undefined && filters[subcategory]['RenderBrands'] ? 
                <div>
                <label htmlFor='brand'>What is the brand?</label>
                <select required name="brand" onChange={(event) => setBrand(event.target.value)}>
                    <option value='' hidden>brand</option>
                    <option value='Samsung'>Samsung</option>
                    <option value='Apple'>Apple</option>
                    <option value='Philips'>Philips</option>
                    <option value='Sony'>Sony</option>
                    <option value='Microsoft'>Microsoft</option>
                    <option value='Nintendo'>Nintendo</option>
                    <option value='other'>Other</option>
                </select>
                </div>
                : null}

                {subcategory != undefined && filters[subcategory]['RenderPrice'] ? 
                <div>
                <label htmlFor='price'>Choose your price</label>
                <input className="formInput" required name="price" type='number' min={0} max={10000} onChange={(event) => setPrice(event.target.value)}></input>
                </div>
                : null}

                {subcategory != undefined && filters[subcategory]['RenderScreenSize'] ? 
                <div>
                <label htmlFor='screenSize'>What is the screen size in inches?</label>
                <input className="formInput" required name="screenSize" type='number' min={0} max={500} onChange={(event) => setScreenSize(event.target.value)}></input>
                </div>
                : null}

                {subcategory != undefined && filters[subcategory]['RenderChipset'] ? 
                <div>
                <label htmlFor='chipset'>What is the chipset?</label>
                <textarea className="formTextArea" required name="chipset" maxLength={50} type='text'onChange={(event) => setChipset(event.target.value)}></textarea>
                </div>
                : null}

                {subcategory != undefined && filters[subcategory]['RenderMemorySize'] ? 
                <div>
                <label htmlFor='memorySize'>What is the memory size?</label>
                <input className="formInput" required name="memorySize" type='number' max={5} onChange={(event) => setMemorySize(event.target.value)}></input>
                </div>
                : null}

                {subcategory != undefined && filters[subcategory]['RenderAuthor'] ? 
                <div>
                <label htmlFor='author'>Who is the author?</label>
                <textarea className="formTextArea" required name="author" type='text' maxLength={50} onChange={(event) => setAuthor(event.target.value)}></textarea>
                </div>
                : null}

                {subcategory != undefined && filters[subcategory]['RenderPublisher'] ? 
                <div>
                <label htmlFor='publisher'>Who is the publisher?</label>
                <textarea className="formTextArea" required name="publisher" type='text' maxLength={50} onChange={(event) => setPublisher(event.target.value)}></textarea>
                </div>
                : null}

            <div className="previewImage">
                <h3>image 1</h3>
                {image1Url ? <img src={image1Url} /> : null }
                <label className="image1Label" htmlFor="image1">upload image 1* (png/jpeg format/max 2mb)</label>
                <input className="input1" name="image1" type='file' accept="image/png, image/jpeg" max="153600" onChange={handleImage1} required ></input>
            </div>

            
            <div className="previewImage">
                <h3>image 2</h3>
                {image2Url ? <img src={image2Url} /> : null}
                <label className="image2Label" htmlFor="image2">upload image 2 (png/jpeg format/max 2mb)</label>
                <input className="input2" name="image2" type='file' accept="image/png, image/jpeg" onChange={handleImage2} disabled={image1Url === false}></input>
            </div>

            <div className="previewImage">
                <h3>image 3</h3>
                {image3Url ? <img src={image3Url} /> : null}
                <label className="image3Label" htmlFor="image3">upload image 3 (png/jpeg format/max 2mb)</label>
                <input className="input3" name="image3" type='file' accept="image/png, image/jpeg" onChange={handleImage3} disabled={image2Url === false}></input>
            </div>



            <button className="marketplaceButton" type="submit"  disabled={image1Url === false || submitted === true}>Publish my product</button>
            </form>




        </div>
        }
        </div>
    )
}

export default Marketplace;