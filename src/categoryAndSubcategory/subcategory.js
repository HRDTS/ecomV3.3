import { isInteger, toInteger } from "lodash";
import React, { useState } from "react";
import LeftNavSubcategory from "./leftNavSubcategory";
import ProductGridLayout from "./productGridLayout";

function Subcategory(props) {

    const subcategory = props.subcategory 
    const filtersBasedOnCategory = props.filtersBasedOnCategory
    const category = props.category
    
    const title = subcategory.slice(11)

    const productGridLayoutCategory = category.slice(8).toLowerCase()
    const productGridLayoutSubcategory= subcategory.slice(11).toLowerCase()

    // This is where users can set the filters through the leftNavSubcategory
    const [filter, setFilter] = useState({
        'priceBottom': false, 
        'priceTop': false, 
        'memoryBottom': false, 
        'memoryTop': false, 
        'chipSet': false, 
        'screenSizeBottom': false, 
        'screenSizeTop': false, 
        'author': false, 
        'publisher': false, 
        'delivery': false, 
        'brands': false, 
        'review': false  
    })

    function changeFilter(newValue, filterType) {
        // newValue is whatever the value of the clicked input is, e.g. 'electronics', 'samsung', '5 star review'
        // filterType is whatever the filter type is, e.g. 'subcategory', 'brands', 'reviews'
        if(filter[filterType] === newValue) {
            setFilter(prev => {
                return{...prev, [filterType] : false}
            }) 
        } else {
            setFilter(prev => {
                return{...prev, [filterType] : newValue}
            }) 
        }
    }

    function changeFilterTwoInputs (newValue, filterType1, filterType2) {
        
        if(newValue[1].value === '') {
            changeFilter(newValue[0].value, filterType1)
            return
        } 
        if(toInteger(newValue[0].value) >= toInteger(newValue[1].value)) {    
            alert(`Please check your filter settings: bottom value can't be higher than the top value`)
            return
        } 
            setFilter(prev => {
                return{...prev, [filterType1] : newValue[0].value, [filterType2]: newValue[1].value}
            }) 
        

    }


    return (
        <div className="subcategoryPage">
            <LeftNavSubcategory category={category} subcategory={subcategory} filtersBasedOnCategory={filtersBasedOnCategory} changeFilter={changeFilter} changeFilterTwoInputs={changeFilterTwoInputs} filter={filter} />
            <div className="subcategoryPageRight">
                <h1>{title}</h1>
                 <ProductGridLayout filter={filter} category={productGridLayoutCategory} subcategory={productGridLayoutSubcategory}/>
            </div>
        </div>
    )
}

export default Subcategory;