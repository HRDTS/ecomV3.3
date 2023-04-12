import React, { useEffect, useState } from "react";
import backToSchool from '../img/backToSchool.jpg'
import sale from '../img/sale.jpg'
import sale2 from '../img/sale2.jpg'
import phonesFront from '../img/phonesFront.png'
import televisionFront from '../img/televisionFront.png'
import gameConsoleFront from '../img/gameConsoleFront.png'
import scienceFront from '../img/scienceFront.png'
import historyFront from '../img/historyFront.png'
import biographyFront from '../img/biographyFront.png'
import middleFront from '../img/middleFront.jpg'
import frontBanner from '../img/frontBannerTrimmed.png'
import bookSale from '../img/televisionFrontGrid2.jpg'

import { Link } from "react-router-dom";

function Home(props) {

    // All the functions in this homepage.js file are for my image slider. The images are set to slide every 10 secs.
    const [slideIndex, setSlideIndex] = useState(1)
    const [toggleSlide, setToggleSlide] = useState(false)
    
    useEffect(() => { // the showSlides state is either changed manually by clicking on next/previous arrows or by the toggleSlide function that changes it every 10 secs.
        showSlides(slideIndex)
    }, [slideIndex])

    useEffect(() => {
        const intervalID = setTimeout(() =>  {
            setToggleSlide((toggleSlide) => !toggleSlide) // this useEffect is initialized at the first render, and then it puts a 10 sec delay that changes the toggleSlide back and forth from true to false.
        }, 5000); // Each time the toggleSlide is changed, this useEffect will take place since its a dependency. So it's basically triggering itself.
        changeSlides(1)
        return () => clearInterval(intervalID);
    }, [toggleSlide]);

    function changeSlides(n) { // change the slide by adding -1 or +1 to the current image (slideIndex).
        setSlideIndex(slideIndex + n)
    }

    function showSlides(n) {
        let psuedoSlideIndex = slideIndex // I copy the content of slideIndex into a variable because I need to adjust the data in the variable. With slideIndex(which is a state), I don't have that liberty.
        let i;
        let slides = document.getElementsByClassName('mySlides');
        if (n > slides.length) { psuedoSlideIndex = 1; setSlideIndex(1)} // if n is more than there are images (so n = 3, and total images = 2), than the n will go back to the first image (by doig n = 1)
        if (n < 1) {psuedoSlideIndex = slides.length; setSlideIndex(slides.length)} // if n is lower than 1, it will go to the last image.
        for (i = 0; i < slides.length; i++) { // this code puts every images display to 'none' except the image slideIndex, which can be retrieved by doing slideIndex - 1 (index)
            slides[i].style.display = 'none';
        }
        slides[psuedoSlideIndex-1].style.display = "flex";
    }

    return (
        <div className="homeGridLayout">
            <div className="slideshow">
            <div className="slideshow-container">
                <div className="mySlides">
                    <img src={frontBanner} className='img1'/>
                </div>

                <div className="mySlides">
                    <img src={bookSale} className='img2'/>
                </div>

                <a className="prev" onClick={() =>changeSlides(-1)} >&#10094;</a>
                <a className="next" onClick={() =>changeSlides(1)} >&#10093;</a>
            </div>

            </div>
            <Link to='/subcategoryPhones' className="cat1"> <div className="tileImageText">Phones</div> <img className="tileImage" src={phonesFront}/>  </Link>
            <Link to='/subcategoryTelevisions'className="cat2"> <div className="tileImageText">Televisions</div> <img className="tileImage" src={televisionFront}/> </Link>
            <Link to='/subcategoryGameConsoles'className="cat3"> <div className="tileImageText">Game consoles</div> <img className="tileImage" src={gameConsoleFront}/> </Link>
            
            <div className="customerServiceDisplayAndDayDeal">
                <div className="customerServiceDisplay"> <img className="nonProductImage" src={backToSchool}/></div>
                <div className="dayDeal"><img className="nonProductImage" src={middleFront}/></div>
            </div>
            <Link to='/subcategoryScience' className="cat4"><div className="tileImageText">Science books</div> <img className="tileImage" src={scienceFront}/></Link>
            <Link to='/subcategoryHistory' className="cat5"><div className="tileImageText">History books</div> <img className="tileImage" src={historyFront}/></Link>
            <Link to='/subcategoryBiography' className="cat6"><div className="tileImageText">Biography books</div> <img className="tileImage" src={biographyFront}/></Link>
    
        </div>
    )
}

export default Home;
