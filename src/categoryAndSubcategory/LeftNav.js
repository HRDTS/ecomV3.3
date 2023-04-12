import React, { useEffect, useState, useRef } from "react";
import reviewStar from '../img/reviewStar.png'
import reviewStarEmpty from '../img/emptyStar2.png'
import filters from "./filters";
import { keys } from "lodash";
import filterIcon from '../img/filterIcon.png'
import closeIcon from '../img/closeIcon.png'


/* 
this leftNav (which is a filter bar) is a component used in the category.js. It does two things:
1. render all the appropriate filter options. As you can see down below, this file contains every filter option, but we only need to display the appropriate filters.
It renders the appropriate filters by checking the content of filters.js. Based on filter.js, it knows what to render and what not to.
2. When the user clicks on a filter (for example the user clicks on 'free delivery'), this change will be controlled by the function handleFilter.
the handlefilter passes the right information to the category.js state. This state will then render the filtered products
*/

/*
Since this application is mobile optimized, I needed to hide the leftNav because it's too big for mobile screens.
I added a button that will display the leftNav when clicked on. This leftNav on the mobile will have an absolute position in contrast to having a default position on desktop screens.
I gave the leftNav on mobile screen this position so that it overlaps the screen and not push away anything, which would happen in the default position.
The logic for this is pretty straightforward: if screen is smaller than 1024px width, hide navbar and show filter button. If filter button clicked, show navbar with absolute position.
The only thing that is not straightforward is the unwanted consequences of 'position: absolute' of the leftNav. This 'position:absolute' puts the leftNav out of the flow, which makes
 it overflow the footer as well. This is not what I want, so I fixed that issue by putting the leftnav in a parent container 'leftNavOuter'. I set the height of leftNavOuter to the height of leftNav (the child element).
 Since leftNavOuter has a default position, it pushes the footer down, whilst the leftNav behaves as if it were not out of the flow. So everything is pushed down on the vertical axis but not on the horizontal axis.
*/

function LeftNav(props) {   


    const category = props.category
    const categoryArray = props.categoryArray
    const filtersBasedOnCategory = props.filtersBasedOnCategory
    const changeFilter = props.changeFilter
    const filter = props.filter

    //this isWindowNarrow state constantly checks if the screen width is < 1024px. It is used to hide/show the leftNav.
    const [isWindowNarrow, setIsWindowNarrow] = useState(window.innerWidth <= 1024);
    const [heightLeftNav, setHeightLeftNav] = useState('900px')

    useEffect(() => {
        const handleResize = () => setIsWindowNarrow(window.innerWidth <= 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize)
      }, []);

    useEffect(() => {
        setHideFilterMenu(true)
    }, [isWindowNarrow])


    const [hideFilterMenu, setHideFilterMenu] = useState(true)

    function handleFilterHide() {
        hideFilterMenu ? setHideFilterMenu(false) : setHideFilterMenu(true)

    }

    const hideFilterRef = useRef(null)
    const leftNavHeight = useRef(null)

    useEffect(() => {
        setHeightLeftNav(leftNavHeight.current.offsetHeight)
    }, [hideFilterMenu])

    function handleFilter (event, filterType) {
        changeFilter(event.target.value, filterType)
    }


    const Rendersubcategory = ()  => {
        const list = categoryArray[category].map((element, index) => {
            const categoryName = Object.keys(element)
            return(
                <div key={index} className="leftNavSubcategoryAndInput">
                <input checked={filter['subcategories'] === categoryName[0]} value={categoryName} onChange={(event) => handleFilter(event, 'subcategories')} type='checkbox'/>
                <li>
                {categoryName}
                </li>
                </div>  
            )
        })
        return(
            <ul className="leftNavSubcategoryUL">
                {list}
            </ul>
        )
    }
    
    const RenderBrands = ()  => {
        const list = filtersBasedOnCategory[category]['brands'].map((element, index) => {
                const brandsName = Object.keys(element)
            return(
                <div  key={index} className="leftNavBrandAndInput">
                <input checked={filter['brands'] === brandsName[0]} value={brandsName} onChange={(event) => handleFilter(event, 'brands')} type='checkbox'/>
                <li>
                {brandsName}
                </li>
                </div>
            )
        })
        return(
            <ul className="leftNavBrandUL">
                {list}
            </ul>
        )
    }

    const RenderReviewStars = (amount) => {
        let array = []
        const star = <img src={reviewStar}/>
        const emptyStar = <img src={reviewStarEmpty}/>

        for(let i = 0; i < amount; i++) {
            array.push(star)
        }
        
        for(let i = 0; i < (5 - amount); i++) {
            array.push(emptyStar)
        }

        const reviewStars = array.map((element, index) => {
            return (
                <li key={index}>{element}</li>
            )
            
        })

        return (
            <ul className="leftNavReviewUL">
                {reviewStars}  or more
            </ul>
        )
    }

    const RenderPrice = () => {
        
        return (
            <div>
                <form>
                from<input type='number' placeholder="e.g. 10" />
                to <input type='number' placeholder="e.g. 50"/>
                <button>Search price range</button>
                </form>
            </div>
        )
    }

    const RenderPublisher = () => { // not a generic filter => database input required to set this ()
        const list = filtersBasedOnCategory[category]['publisher'].map((element, index) => {
            const publisherName = Object.keys(element)
            return(
                <div  key={index} className="leftNavAuthorAndInput">
                <input value={publisherName} onChange={(event) => handleFilter(event, 'publisher')} type='checkbox'/>
                <li key={index}>
                {publisherName}
                </li>
                </div>

            )
        })
        return(
            <ul className="leftNavAuthorUL">
                
                {list}
            </ul>
            
        )
    }


    const RenderScreenSize = () => { // not a generic filter => database input required to set this ()
            return (
            <div>
                <form>
                from<input type='number' placeholder="e.g. 10"/>
                to <input type='number' placeholder="e.g. 50"/>
                <button>Search screen size (in inch)</button>
                </form>
            </div>
        )
    }

    const RenderChipset = () => { // not a generic filter => database input required to set this ()
        
                const list = filtersBasedOnCategory[category]['phones'].map((element, index) => {
            return(
                <div  key={index} className="leftNavChipsetAndInput">
                <input type='checkbox'/>
                <li key={index}>
                {element}
                </li>
                </div>
            )
        })
        return(
            <ul className="leftNavChipsetUL">
                
                {list}
            </ul>
            
        )
    }
    

    const RenderMemorySize = () => { // not a generic filter => database input required to set this ()
            return (
            <div>
                <form>
                from<input type='number' placeholder="e.g. 10"/>
                to <input type='number' placeholder="e.g. 50"/>
                <button>Search screen size (in inch)</button>
                </form>
            </div>
        )
    }

    const RenderAuthor = () => { // not a generic filter => database input required to set this ()
        const list = filtersBasedOnCategory[category]['author'].map((element, index) => {
            return(
                <div  key={index} className="leftNavAuthorAndInput">
                <input value={element} onChange={(event) => handleFilter(event, 'author')} type='checkbox'/>
                <li key={index}>
                {element}
                </li>
                </div>
            )
        })
        return(
            <ul className="leftNavAuthorUL">
                {list}
            </ul>
        )
    }

    return (
        <div className="leftNavOuter" style={hideFilterMenu === false ? {height: heightLeftNav} : null && hideFilterMenu === true ? {height: 'none'} : null}>
            <button style={isWindowNarrow && hideFilterMenu === true ? {display : "block"} : {display: 'none'} || isWindowNarrow === false ? {display: 'none'} : {display:'block'}} ref={hideFilterRef} onClick={handleFilterHide} className="showLeftNavButton">  <img src={filterIcon} className='filterIcon'/></button>

        <div className="leftNav" ref={leftNavHeight} style={ isWindowNarrow && hideFilterMenu === false ? {display: 'flex'} : {display: 'none'} && isWindowNarrow === false ? {display: 'flex'} : {display: 'none'}}>
            <img style={isWindowNarrow ? {display : 'flex'}  : {display: 'none'}} onClick={() => setHideFilterMenu(true)} className="closeIconNav" src={closeIcon}/>
            {filters[category].RenderSubcategory ?  
            <div className="leftNavSubcategory">
            <p><b>Subcategories</b></p>
                    <Rendersubcategory/>
            </div>
            :null}

            {filters[category].RenderDeliveryOption ? 
                        <div className="leftNavFreeDelivery">
                <p><b>Delivery options</b></p>
                <div className="deliveryInnerDiv">
                <input checked={filter['delivery'] === 'true'} value={true} onChange={(event) => handleFilter(event, 'delivery')} type='checkbox'/>
                <div>
                <label className="deliveryText">Free delivery by Ecom</label>
                </div>
                </div>
            </div>
            :null}

            {filters[category].RenderPrice ? 
                        <div className="leftNavPrice">
                    <p><b>Price</b></p>
                    <RenderPrice/>
            </div>
            :null}

            { filters[category].RenderScreenSize ? 
            <div className="leftNavScreenSize">
            <p><b>Screen size</b></p>
            <RenderScreenSize/>
            </div> : null}

            {filters[category].RenderChipset ? 
                        <div className="leftNavChipset">
                            <p><b>Chipset</b></p>
            <RenderChipset/>
            </div>
            : null}


            {filters[category].RenderMemorySize ?
            <div className="leftNavMemorySize">
                <p><b>Memory Size</b></p>
            <RenderMemorySize/>
            </div>
            :null}


            {filters[category].RenderAuthor ?
            <div className="leftNavAuthor">
                <p><b>Author</b></p>
            <RenderAuthor/>
            </div>
            :null}

            {filters[category].RenderPublisher ?
                        <div className="leftNavAuthor">
                            <p><b>Publisher</b></p>
                        <RenderPublisher/>
                        </div>
                        :null}


            {filters[category].RenderBrands ?
                        <div className="leftNavBrand">
            <p><b>Brands</b></p>
                <RenderBrands/>
            </div>
            :null}

            {filters[category].RenderReviewStars ?
                        <div className="leftNavReviews">
                <p><b>Customer review</b></p>
                <div className="leftNavStarsAndInput">
                    <input checked={filter['review'] === '4'} value={4} onChange={(event) => handleFilter(event, 'review')} type='checkbox'/>
                    {RenderReviewStars(4)}
                </div>

                <div className="leftNavStarsAndInput">
                    <input checked={filter['review'] === '3'} value={3} onChange={(event) => handleFilter(event, 'review')} type='checkbox'/>
                    {RenderReviewStars(3)}
                </div>

                <div className="leftNavStarsAndInput">
                    <input checked={filter['review'] === '2'} value={2} onChange={(event) => handleFilter(event, 'review')} type='checkbox'/>
                    {RenderReviewStars(2)}
                </div>

                <div className="leftNavStarsAndInput">
                    <input checked={filter['review'] === '1'} value={1} onChange={(event) => handleFilter(event, 'review')} type='checkbox'/>
                    {RenderReviewStars(1)}
                </div>

            </div>
            :null}



        </div>
    </div>
    )
}

export default LeftNav