import React, { useEffect, useState } from "react";
import ProductGridLayout from "./productGridLayout";
import ProductGridLayoutCategoryOnly from "./productGridLayoutCategoryOnly";
import LeftNav from "./LeftNav";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import televisions from '../img/television2.png'
import phones from '../img/phone.png'
import gameConsoles from '../img/ps5.png'
import science from '../img/scienceFront.png'
import history from '../img/historyFront.png'
import biography from '../img/biographyFront.png'

import apple from '../img/brands/apple.png'
import microsoft from '../img/brands/microsoft.png'
import nintendo from '../img/brands/nintendo.svg'
import philips from '../img/brands/philips.png'
import samsung from '../img/brands/samsung.png'
import sony from '../img/brands/sony.png'

import bantam from '../img/publishers/bantam.png'
import penguin from '../img/publishers/penguin.png'
import simonandschuster from '../img/publishers/simonandschuster.png'

// To avoid confusion I'd like to clarify how I define a category and a subcategory in this project and what the implications of the differences are.
// A category is overarching. It is the first layer before the category is divided into subcategories (second layer). The only two categories in this project are Electronics and Books.
// There is a distinct category page for each category where all the category specific props are rendered. So the Electronics category page will display Brands, whereas the Books category page will display Authors.
// There are 6 subcategories in total (3 subcategories in each of the 2 categories). The 6 subcategories are: Phones, Televisions, Game Consoles, Science, History and Biography.
// The subcategories have no distinct pages, unlike the categories. 

// So far I have mentioned that categories have distinct pages and subcategories not. The other difference is that categories have category specific filters and subcategories have subcategory specific filters.
// This distinction between category filters and subcategory filters is very useful, because it gives the customer the liberty to filter at category (for example: all electronics for with 4+ star rating) but they can also
// filter at subcategory level (for example: history books by the publisher Penguin). This system is also used at Amazon.com.
// There is a file called filters.js where I decide which filters all of the categories and subcategories should get.
// All the correct filters are then shown in the leftNavBar (which is where all the filters are positioned).

// This categoryArray is used to render the subcategory images with the correct titles at the category page. 
const categoryArray = {
    'categoryElectronics' : [{'Televisions' : televisions} , {'Phones' : phones}, {'Game consoles' : gameConsoles}],
    'categoryBooks' : [{'Science' : science}, {'History' : history}, {'Biography' : biography}]
}

// This filtersBasedOnCategory object is used to render the category specific filters. So for example the Electronics category page will have all the brands displayed
const filtersBasedOnCategory = {
    'categoryElectronics' : {
        'brands': [{'Apple' : apple}, {'Samsung' : samsung}, {'Philips' : philips}, {'Sony' : sony}, {'Microsoft' : microsoft}, {'Nintendo': nintendo}], 
        'Phones' : ['Bionic', 'Snapdragon'],
    },
    'categoryBooks' : {
        'publisher' : [{'Simon and Schuster' : simonandschuster}, {'Penguin' : penguin}, {'Bantam' : bantam}],
        'author' : ['Walter Isaacson', 'Ashle Vance', 'Greg Brooks']
    }
}


function Category (props) {

    // all the filters in the category pages are controlled by this state. These are also the only filters available at the category level.
const [filter, setFilter] = useState({
    'subcategories': false,
    'delivery': false,
    'brands': false,
    'review': false
})

// the activateFilter is by default false. But when the user clicks on a filter, this state turns 'true', and through conditional rendering, the filtered products are shown.
const [activateFilter, setActivateFilter] = useState(false)



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

    useEffect(() => { // this useEffect listens for any filter changes so it can display the filtered products through activateFilter
        if(
            filter['subcategories'] || 
            filter['delivery'] || 
            filter['brands'] || 
            filter['review']
        ) {
            setActivateFilter(true)
        } else {
            setActivateFilter(false)
        }
    }, [filter])
    let location = useLocation()

    useEffect(() => { // this useEffect defaults the state so changing pages between category and subcategory won't cause bugs in the filter
        setFilter({
            'subcategories': false,
            'delivery': false,
            'brands': false,
            'review': false
        })
      }, [location]);


const category = props.category
const title = category.slice(8)



function RenderSubcategoriesWithLinks (props) {
// this code parses the categoryArray. This array has all the category names and images stored.
// this code does three things: it grabs the category name, which is needed to make Links. It also grabs the image variables, so it can display it.
    const elementsToRender = props.elementsToRender

    const renderedElements = elementsToRender.map((element, index) => {
        const categoryName = Object.keys(element)
        const categoryImage = Object.values(element)
// here is where the category string name is stored. This will be used to create the link



        let elementLink = `/subcategory${categoryName}`
        if(elementLink === `/subcategoryGame consoles`) {
            elementLink = '/subcategoryGameConsoles'
        }
        return (
            <Link to={elementLink} key={index} className='subcategoryInner'><div className="subcategoryInnerText">{categoryName}</div><img src={categoryImage} className='categoryImage'/></Link>
        )
    })
    return renderedElements
}

function RenderBrands (props) {

    const elementsToRender = props.elementsToRender
    const renderedElements = elementsToRender.map((element, index) => {
        const brandName = Object.keys(element)
        const brandImage = Object.values(element)
        return (
            <div key={index} className='brandsInner' onClick={() => setFilter({...filter, 'brands': brandName})}> <img src={brandImage} className='brandsImage' />  </div>
        )
    })
    return renderedElements
}

function RenderPublishers (props) {

    const elementsToRender = props.elementsToRender
    const renderedElements = elementsToRender.map((element, index) => {
        const publisherName = Object.keys(element)
        const publisherImage = Object.values(element)
        return (
            <div key={index} className="publisherInner"> <img src={publisherImage} className='publisherImage'/>  </div>
        )
    })
    return renderedElements
}

// This return segment does the following:
// 1. render the correct leftNav for the category (as each category has different filters)
// 2. Check if activateFilter is true, if so, render the filtered products on the page.
// 3. If activateFilter is false, render the category specific information.
    return (
        <div className="categoryPage">
            <LeftNav category={category} categoryArray={categoryArray} filtersBasedOnCategory={filtersBasedOnCategory} changeFilter={changeFilter} filter={filter}/>
            
            
            
            {activateFilter ? <ProductGridLayoutCategoryOnly filter={filter} category={category}/> : // you need to give this a category and subcategory

                        <div className="categoryPageRight">
                        <div className="categoryUpper" >
                            <p className="titleCategoryPage">{title}</p>
                            <div className="subcategories"> 
                                <RenderSubcategoriesWithLinks elementsToRender={categoryArray[category]}/>
                            </div>
                            
                        </div>
                        {category != 'categoryBooks' ?
                        <div className="categoryLower" >
                            <p className="titleCategoryPage">Brands</p>
                            <div className="brands">
                                <RenderBrands elementsToRender={filtersBasedOnCategory[category]['brands']}/>
                            </div>
                            
                        </div> :
                        <div className="categoryLower">
                            <p className="titleCategoryPage">Publishers</p>
                            <div className="publishers">
                                <RenderPublishers elementsToRender={filtersBasedOnCategory[category]['publisher']}/>
                            </div>
                            
                            </div>
                        }
                    </div>
            }

        </div>
    )
}

export default Category;