import React, { useRef, useEffect, useState } from "react";
import {storage, database} from '../firebaseAndStripe/firebase'
import { getDownloadURL, getMetadata, ref, } from "firebase/storage";
import { ref as databaseRef, set, push, onValue } from "firebase/database";
import uniqid from 'uniqid';
import { Link } from "react-router-dom";
import { DisplayReviewStars } from "../reviewSystem/displayStars";

// this is where the products are mapped and filtered.
// I need to call the database for the product information, and then I need to make sure to only retrieve the products that meet the filter criteria
// There are two functions in this file: getAverageOfRating and fetchProductInformationAndFilter
// getAverageRating is a function I created so I can filter the ratings correctly. The ratings aren't stored as averages in the database, but as individual ratings. So thats why I need to convert it to averages first.
// fetchProductInformationAndFilter fetches products from database IF they meet my filter criteria.
// All the products that meet the filter criteria are stored in an array, that array is passed to the fetchedData state, and based on that fetchedData I render the products and store it in the render state.


function ProductGridLayout(props) {

    const [fetchedData, setFetchedData] = useState([])
    const [render, setRender] = useState()

    const imgRef = useRef()
    // pas the right prop here. I am using a static variable for now as default value
    const category = props.category
    const subcategory = props.subcategory
    const filter = props.filter
    
    let categoryDatabase = category + '/'
    let subcategoryDatabase = subcategory + '/'

    if(subcategoryDatabase === 'gameconsole/') { //gaming consoles are not stored in the folder 'gameconsole/', but 'gameConsoles/'. This adjustment ensures correct fetching.
        subcategoryDatabase = 'gameConsoles/'
    }

    function getAverageOfRating(reviews) {
        let score;
        if(reviews === '0') {
            score = 0
        } else {
            let array = Object.values(reviews).map((obj) => {
            return(
            obj
            )
            })
            let sum = array.reduce((accumulator, currentValue) => {
                return accumulator + currentValue
                }, 0)
            score = sum / array.length
        }
    
        Math.round(score)
        return score
    }


    async function fetchProductInformationAndFilter() {

        const starCountRef = databaseRef(database, 'products/' + categoryDatabase + subcategoryDatabase);
        const getData = new Promise((resolve) => { // comment for future async headache: getData expects a promise in the form of resolve. So I return data to resolve in my code. Now, when I call getData, I can use whatever is in that resolve
            onValue(starCountRef, (snapshot) => {
                const data = snapshot.val();

                let array = [] // changing the nested objects into an array so I can map through it later on
                for(let i in data) {

                    if(filter['priceBottom'] && filter['priceBottom'] != '') {
                        if(parseInt(data[i]. price) < parseInt(filter['priceBottom'])) {
                            continue
                        }
                    }
                    if(filter['priceTop'] && filter['priceTop'] !== '') {
                        if(data[i]. price > filter['priceTop']) {
                            continue
                        }
                    }

                    if(filter['memoryBottom'] && filter['memoryBottom'] != '') {
                        if(data[i]. memory < filter['memoryBottom']) {
                            continue
                        }
                    }

                    if(filter['memoryTop'] && filter['memoryTop'] != '') {
                        if(data[i]. memory > filter['memoryTop']) {
                            continue
                        }
                    }

                    if(filter['screenSizeBottom'] && filter['screenSizeBottom'] != '') {
                        if(data[i]. screenSize < filter['screenSizeBottom']) {
                            continue
                        }
                    }

                    if(filter['screenSizeTop'] && filter['screenSizeTop'] != '') {
                        if(data[i]. screenSize > filter['screenSizeTop']) {
                            continue
                        }
                    }

                    if(filter['chipSet']) {
                        if(data[i].chipSet != filter['chipSet']) {
                            continue
                        }
                    }

                    if(filter['publisher']) {
                        if(data[i].publisher != filter['publisher']) {
                            continue
                        }
                    }

                    if(filter['author']) {
                        if(data[i].author != filter['author']) {
                            continue
                        }
                    }


                    if(filter['brands']) {
                        if(data[i].brand != filter['brands']) {
                            continue
                        }
                    }

                    if(filter['delivery']) {
                        if(data[i].price < 20) {
                            continue
                        }
                    } 

                    if(filter['review']) {
                        const averageRating = getAverageOfRating(data[i].reviews)
                        if(averageRating < parseInt(filter['review'])) {
                            continue
                        }
                    } 

                    array.push(data[i]) 
                }

                resolve(array)
            })
        })
        return getData
    }

    useEffect(() => {
        fetchProductInformationAndFilter()
        .then(data => setFetchedData(data))
    }, [filter, subcategory])

    
    useEffect(() => {
        const product = fetchedData.map((product, index) => 
        <Link key={index} to={`/${product.title}${product.ID}`}>
        <div key={index} className="productGrid">
            <div className="productGridImageDiv">
                <img src={product.imageUrl1}/>
            </div>
            <div className="productGridTitleAndReview">
                            <h1 className="productGridTitle">{product.title}</h1>
            <div className="productGridReviews"><DisplayReviewStars reviews={product.reviews}/></div>
            </div>

            <h2 className="productGridPrice">€ {product.price}</h2>
            <p className="productGridDelivery">delivery time: {product.deliveryTime} day(s)</p>
        </div>
        </Link>
        )

        setRender(product)
    }, [fetchedData])


    return (
        <div className="productGridParent">
            {render}
        </div>

        
    )
}

export default ProductGridLayout;