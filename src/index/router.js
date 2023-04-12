import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Router} from "react-router-dom";
import Home from "../homepage/homepage";
import Header from "../header/header";
import Footer from "../footer/footer";
import Category from "../categoryAndSubcategory/category";
import Subcategory from "../categoryAndSubcategory/subcategory";
import ProductDetailPage from "../categoryAndSubcategory/productDetailPage";
import { History } from "../header/purchaseHistory";
import ProductPublished from "../categoryAndSubcategory/productPublished";

import { database } from "../firebaseAndStripe/firebase";
import { ref as databaseRef, onValue } from "firebase/database";
import Marketplace from "../categoryAndSubcategory/marketplace";
import Account from "../header/account";


const RouteSwitch = () => {

    /* 
    All the states, functions and useEffects in this component are used to create a Route path for all the individual products on my ecommerce store
    There is always the possiblity that a new product is added to my ecommerce store (for example users can add their own products), so I have to retrieve data from the database to get the latest 'category'.
    And then use this data to create a Path in the function mapProductRoutes. The data is a JSON Object with many nestings so I need to take intermediate steps to extract the correct data.
    */

    // the first state is used for retrieving the initial JSON object in the state. The second state is used to store the final product: all the individual products with their own paths.
    // You can see that I return productRoutes at the end of this component.
    const [databaseInformation, setDatabaseInformation] = useState()
    const [productRoutes, setProductRoutes] = useState()


    // function to get the intial JSON Object. The JSON Object is layered like this (1. products 2.books 2. electronics, and then it divides even further to subcategories (books genres for example))
    async function fetchProductInformation() {
        const dbRef = databaseRef(database, 'products/');
        const getData = new Promise((resolve) => {
            onValue(dbRef, (snapshot) => {
                const data = snapshot.val()
                resolve(data)
            }) 
        })
        return getData
    }

    useEffect(() => { 
        fetchProductInformation().then((data) => {
            setDatabaseInformation(data)
        })
    }, [])

    useEffect(() => {
        RouteTheProducts(databaseInformation)
    }, [databaseInformation])



    function RouteTheProducts(databaseInformation) { // I loop through all the nested layers to get to the individual products and then push it to the productArray

        let productArray = []

        for(let i in databaseInformation) {
            for(let j in databaseInformation[i]) {
                for(let k in databaseInformation[i][j]) {
                    
                    productArray.push(databaseInformation[i][j][k]) 
                }
            }
        }
        // all products have their metaData stored in the database. I pass all the right props here.
        // as you can see, I pass all possible information to the product even if that information is not available. For example: books have no brands and electronic devices have no authors.
        // On the product pages, I set the logic to only render the information that is applicable to the product.
        const mapProductRoutes = productArray.map(({ID, title, category, subcategory, price, description, reviews, deliveryTime, author, brand, screenSize, chipSet, memorySize, publisher, imageUrl1, imageUrl2, imageUrl3, imageUrl4, imageUrl5, stripePriceID, stripeProductID}) => {

            return (
                <Route key={ID}
                path={`/${title}${ID}`}
                element={
                    <ProductDetailPage
                    ID={ID}
                    title={title}
                    category={category}
                    subcategory={subcategory}
                    price={price}
                    description={description}
                    reviews={reviews}
                    deliveryTime={deliveryTime}
                    author={author}
                    brand={brand}
                    screenSize={screenSize}
                    chipSet={chipSet}
                    memorySize={memorySize}
                    publisher={publisher}
                    imageUrl1={imageUrl1}
                    imageUrl2={imageUrl2}
                    imageUrl3={imageUrl3}
                    imageUrl4={imageUrl4}
                    imageUrl5={imageUrl5}
                    stripePriceID={stripePriceID}
                    stripeProductID={stripeProductID}
                    />
                }
                />
            )
        }) 
        setProductRoutes(mapProductRoutes)
    }

    return(
        <BrowserRouter >
        <Header/>
            <Routes>
                <Route path='/' element={<Home/>} />
                <Route path='/purchaseHistory' element={<History/>} />
                <Route path='/account' element={<Account/>} />
                <Route path='/marketplace' element={<Marketplace/>} />
                <Route path='/productPublished' element={<ProductPublished/>}/>
                <Route path='/categoryElectronics' element={<Category category='categoryElectronics'/>} />
                <Route path='/categoryBooks' element={<Category category='categoryBooks'/>} />

                <Route path='/subcategoryPhones' element={<Subcategory category={'categoryElectronics'} subcategory={'subcategoryPhones'}/>} />
                <Route path='/subcategoryTelevisions' element={<Subcategory category={'categoryElectronics'} subcategory={'subcategoryTelevisions'}/>} />
                <Route path='/subcategoryGameConsoles' element={<Subcategory category={'categoryElectronics'} subcategory={'subcategoryGameConsole'}/>} />

                <Route path='/subcategoryHistory' element={<Subcategory category={'categoryBooks'} subcategory={'subcategoryHistory'}/>} />
                <Route path='/subcategoryScience' element={<Subcategory category={'categoryBooks'} subcategory={'subcategoryScience'}/>} />
                <Route path='/subcategoryBiography' element={<Subcategory category={'categoryBooks'} subcategory={'subcategoryBiography'}/>} />
                {productRoutes}
            </Routes>
            <Footer/>
        </BrowserRouter>
    )
}

export default RouteSwitch