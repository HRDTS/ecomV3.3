import reviewStar from '../img/reviewStar.png'
import reviewStarEmpty from '../img/emptyStar2.png'
import { useEffect, useState } from 'react'
import { uniqueId } from 'lodash'


export function DisplayReviewStars (props) {

    const reviews = props.reviews
    
    const [propsRendered, setPropsRendered] = useState(false)
    const [rating, setRating] = useState()

    useEffect(() => {
        if (!propsRendered && reviews) {
            setPropsRendered(true)
        }
        if(propsRendered) {
            calculateReviewScore()
        }
        
    }, [reviews, propsRendered])

    

function calculateReviewScore () { 
    //Every product has a review object. This object contains every review/rating, in this format: user1: 5, user2: 4...
    // this function gets the average rating so that it can be displayed in stars. 
    // every product with no rating starts with '0'.
    let score;
    if(reviews === '0') {
        score = 0
    } else {
        let array = Object.values(reviews).map((obj) => { // we fetch all the ratings here
        return(
        obj
        )
        })
        let sum = array.reduce((accumulator, currentValue) => { // calculate the averate of the ratings here
            return accumulator + currentValue
            }, 0)
        score = sum / array.length
    }

    Math.round(score)

    let array = [] // this is where we display the average score in full and empty stars which will be displayed on the website product pages/category etc.
    const star = <img src={reviewStar}/>            
    const emptyStar = <img src={reviewStarEmpty}/>

    for(let i = 0; i < score; i++) {
        array.push(star)    
    }
    
    for(let i = 0; i <= (4 - score); i++) {
        array.push(emptyStar)
    }

    const reviewStars = array.map((element, index) => {
        return (
            <li key={index} className='stars'>{element}</li>
        )
        
    })

    setRating(reviewStars)




}

function countTotalRating (stars) {
    if(stars === '0') {
        return 0
    } else {
        let totalRatings = Object.keys(reviews).length
        return totalRatings
    }
}

    return (
        <div className='starsInCategoryAndSubcategoryDiv'>
        <ul key={uniqueId} className='starsInCategoryAndSubcategory'>
            {rating}
        </ul>
        ({countTotalRating(reviews)})
        </div>

    )
}