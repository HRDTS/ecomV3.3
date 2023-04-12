import React, { useRef, useEffect, useState, createRef, useLayoutEffect } from "react";
import {storage, database} from '../firebaseAndStripe/firebase'
import { getDownloadURL, getMetadata, ref, } from "firebase/storage";
import { ref as databaseRef, set, push, onValue, off } from "firebase/database";
import { Link } from "react-router-dom";
import uniqid from 'uniqid';
import { DisplayReviewStars } from "../reviewSystem/displayStars";
import { isEqual } from "lodash";
import { useCallback } from "react";


// this is where the products are mapped and filtered.
// I need to call the database for the product information, and then I need to make sure to only retrieve the products that meet the filter criteria
// There are two functions in this file: getAverageOfRating and fetchProductInformationFromCategoryAndFilter
// getAverageRating is a function I created so I can filter the ratings correctly. The ratings aren't stored as averages in the database, but as individual ratings. So thats why I need to convert it to averages first.
// fetchProductInformationFromCategoryAndFilter fetches products from database IF they meet my filter criteria.
// All the products that meet the filter criteria are stored in an array, that array is passed to the fetchedData state, and based on that fetchedData I render the products and store it in the render state.

function ProductGridLayoutCategoryOnly(props) {
    const [overflowDetection, setOverflowDetection] = useState()

    const [fetchedData, setFetchedData] = useState([])
    const [render, setRender] = useState()

    const imgRef = useRef()
    const category = props.category
    const filter = props.filter
    const subcategory = filter['subcategories']

    // I need these variables to be able to fetch products from the database. 
    let categoryDatabase =   category.slice(8).toLowerCase() + '/'
    let subcategoryDatabase;
    if (subcategory != false) {
        subcategoryDatabase = subcategory.toLowerCase() + '/'
    } else {
        subcategoryDatabase = ''
    } 

    if(subcategoryDatabase === 'game consoles/') { //gaming consoles are not stored in the folder 'gameconsole/', but 'gameConsoles/'. This adjustment ensures correct fetching.
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
            console.log(score)
        }
    
        Math.round(score)
        return score
    }

    async function fetchProductInformationFromCategoryAndFilter() {

        const categoryRef = databaseRef(database, 'products/' + categoryDatabase + subcategoryDatabase)
        
        const getDatafromCategory = new Promise((resolve) => { 
            onValue(categoryRef, (snapshot) => {
                const data = snapshot.val();
                console.log(data)

                let array = [] // changing the nested objects into an array so I can map through it later on
                
                if(subcategoryDatabase != '') { // if there is a subcategory selected in the filter, use this loop to filter. This loop will only traverse the selected subcategory.
                    for(let i in data) {

                        if(filter['delivery']) {
                            if(data[i].price < 20) {
                                continue
                            }
                        } 
                        console.log('1')
                        if(filter['brands']) {
                            if(data[i].brand != filter['brands']) {
                                continue
                            }
                        } 
                        console.log('2')
                        if(filter['review']) {
                            if(parseInt(data[i].reviews) < parseInt(filter['review'])) {
                                continue
                            }
                        } 
                        array.push(data[i]) 
                    }
                } else if (subcategoryDatabase === '') { //if there is NO subcategory selected, use this loop. This is a nested loop that will traverse every subcategory.
                    for(let i in data) {
                        for(let j in data[i]) {
                            
                            if(filter['delivery']) {
                                if(data[i][j].price < 20) {
                                    continue
                                }
                            } 
                            console.log('1')
                            if(filter['brands']) {
                                if(data[i][j].brand != filter['brands']) {
                                    continue
                                }
                            } 
                            console.log('2')
                            if(filter['review']) {
                                const averageRating = getAverageOfRating(data[i][j].reviews)
                                if(averageRating < parseInt(filter['review'])) {
                                    continue
                                }
                            } 
                            array.push(data[i][j]) 

                        }
                    }
                } 


                resolve(array)
            })
        })


        return getDatafromCategory
    }

    useEffect(() => {
        fetchProductInformationFromCategoryAndFilter()
        .then(data => setFetchedData(data))
    }, [filter])



    useEffect(() => { 
        const product = fetchedData.map((product, index) => 
        <Link to={`/${product.title}${product.ID}`}>
        <div key={index} className="productGrid">
            <div className="productGridImageDiv">
                <img src={product.imageUrl1}/>
            </div>
            <div className="productGridTitleAndReview">
                            <h1 className="productGridTitle" >{product.title}</h1>
            <p className="productGridReviews"><DisplayReviewStars reviews={product.reviews}/></p>
            </div>

            <h2 className="productGridPrice">€ {product.price}</h2>
            <p className="productGridDelivery">delivery time: {product.deliveryTime} day(s)</p>
        </div>
        </Link>
        )
        setRender(product)
        setOverflowDetection(true)
    }, [fetchedData, overflowDetection])


    return (
        <div className="productGridParent">
            {render}
        </div>

        
    )
}

export default ProductGridLayoutCategoryOnly;