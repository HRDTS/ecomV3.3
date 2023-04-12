import React, { useEffect, useRef, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebaseAndStripe/firebase";
import logo from '../img/logo.png'
import icon from '../img/icon.png'
import cart from '../img/shoppingCart.png'
import { Link, useNavigate } from "react-router-dom";
import Cart from "./shoppingCart";
import { useCart } from "./shoppingCart";
import { create } from "zustand";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import Searchbar from "./searchbar";
import Marketplace from "../img/marketplace.png";
import hamburgerMenu from '../img/hamburgerMenu.png'

import phonesFront from '../img/phonesFront.png'
import televisionFront from '../img/televisionFront.png'
import gameConsoleFront from '../img/gameConsoleFront.png'
import scienceFront from '../img/scienceFront.png'
import historyFront from '../img/historyFront.png'
import biographyFront from '../img/biographyFront.png'
import { toInteger } from "lodash";

// I created a state with Zustand and not a normal React state because I pass this state to multiple components throughout my project.
// This Zustand state contains userInfo (which will hold all the information about the currently logged in user, if user is logged in of course) and changeUserInfo
// changeUserInfo is used to change the userInfo state with new information (if the user logs in)
export const user = create((set) => ({
  userInfo: false,
  changeUserInfo: (newInfo) => set(() => ({ userInfo: newInfo}))
}))




function Header(props) {

  // this code block calculates the quantity of the shopping cart so it can be displayed in the header.
  const cartForQuantity = useCart((state) => state.items)
  const calculateCartQuantity = () => {
    let quantity = 0
  console.log(quantity)
  cartForQuantity.map((element) => {
      quantity += element.quantity
  })

  if (toInteger(quantity) >= 500) {
    return '500+'
  } else {
    return toInteger(quantity)
  }
  }

  // this is syntax to use the Zustand state.
  const userInfo = user((state) => state.userInfo)
  const change = user((state) => state.changeUserInfo)

  //these states are used for the header menu. If menu is clicked, the respective state is change to 'true' which renders the correct div.
  const [toggleCart, setToggleCart] = useState(false)
  const [toggleUserIcon, setToggleUserIcon] = useState(false)
  const [toggleUserIconResponsive, setToggleUserIconResponsive] = useState(false)
  const [toggleElectronics, setToggleElectronics] = useState(false)
  const [toggleBooks, setToggleBooks] = useState(false)

  const [hamburgerMenuActive, setHamburgerMenuActive] = useState(false)

  // this ref is used in tandem with closeOpenMenus. If the user clicks on the user icon on the header, It basically closes the user icon when user clicks anywhere else on the screen.
  const userIconRef = useRef(null)

  const closeOpenMenus = (e)=>{
    if(userIconRef.current && toggleUserIcon && !userIconRef.current.contains(e.target)){
      setToggleUserIcon(false)
    }
}

document.addEventListener('mousedown',closeOpenMenus)

const userIconRefResponsive = useRef(null)

const closeOpenMenusResponsive = (e)=>{
  if(userIconRefResponsive.current && toggleUserIcon && !userIconRefResponsive.current.contains(e.target)){
    console.log(userIconRefResponsive.current)
    console.log(toggleUserIcon)
    console.log(!userIconRefResponsive.current.contains(e.target))
    setToggleUserIconResponsive(false)
  }
}

document.addEventListener('mousedown', closeOpenMenusResponsive)

  const showCart = () => {
    toggleCart ? setToggleCart(false) : setToggleCart(true)

}

  useEffect(() => { // this useEffect runs once when the header is loaded (and the header loads only once, unless user reloads the page). 
    // This async function checks if user is logged in, if so, it passes the userInfo to the state so that it can render account/user specific information: welcome [username], see receipts and logout.

    async function getUserData () {
        onAuthStateChanged(auth, (user) => {
            if(user) {
                const uid = user.uid;
                const uemail = user.email
                change(user)
            }
        })
    }
    getUserData()
}, [])
  

  const navigate = useNavigate()
  async function signUserOut () {
    try {
      signOut(userInfo.auth)
      navigate('/')
      window.location.reload()
    }    catch (error) {
      console.log('something went wrong with logging out', (error))
    }
  }

  function userIconHandler () {
    console.log(toggleUserIcon)
    toggleUserIcon ? setToggleUserIcon(false) : setToggleUserIcon(true)
  }

  function userIconHandlerResponsive () {
    console.log(toggleUserIconResponsive)
    toggleUserIconResponsive ? setToggleUserIconResponsive(false) : setToggleUserIconResponsive(true)
    console.log(toggleUserIconResponsive)
  }

  return (
    <header className="header" >


          <div className="whiteSpaceAboveHeader">
          <div className="upperPartHeaderLeftResponsive">
          <img onClick={() => setHamburgerMenuActive(true)} src={hamburgerMenu} className='hamburgerMenu'/>
            <Link to='/'><img src={logo} alt="LOGO" className="logo"/></Link> 
          </div>

          <div className="hamburgerMenuUnfolded" style={ hamburgerMenuActive ? {display: "flex"}  : {display:"none"}}>
            <div onClick={() => setHamburgerMenuActive(false)} className='closeHamburgerMenu'>X</div>
            <ul className="hamburgerMenuUnfoldedUL1">
            <Link to='/categoryElectronics' onClick={() => setHamburgerMenuActive(false)}> <li className="hamburgerMenuUnfoldedLI">See all electronics</li> </Link>
            <Link to='/categoryBooks' onClick={() => setHamburgerMenuActive(false)}> <li className="hamburgerMenuUnfoldedLI">See all books</li> </Link> 
            </ul>

            <ul className="hamburgerMenuUnfoldedUL2">
            <Link to='/subcategoryPhones' onClick={() => setHamburgerMenuActive(false)}> <img className='hamburgerContentImage' src={phonesFront} /> <li className="hamburgerMenuUnfoldedLI">Phones</li>   </Link>
            <Link to='/subcategoryTelevisions' onClick={() => setHamburgerMenuActive(false)}>  <img className='hamburgerContentImage' src={televisionFront} /> <li className="hamburgerMenuUnfoldedLI">Televisions</li>  </Link>
            <Link to='/subcategoryGameconsoles' onClick={() => setHamburgerMenuActive(false)}> <img className='hamburgerContentImage' src={gameConsoleFront} /> <li className="hamburgerMenuUnfoldedLI">Game consoles</li>  </Link>
            <Link to='/subcategoryScience' onClick={() => setHamburgerMenuActive(false)}> <img className='hamburgerContentImage' src={scienceFront} /> <li className="hamburgerMenuUnfoldedLI">Science books</li>  </Link>
            <Link to='/subcategoryHistory' onClick={() => setHamburgerMenuActive(false)}> <img className='hamburgerContentImage' src={historyFront} />  <li className="hamburgerMenuUnfoldedLI">History books</li>  </Link>
            <Link to='/subcategoryBiography' onClick={() => setHamburgerMenuActive(false)}> <img className='hamburgerContentImage' src={biographyFront} /> <li className="hamburgerMenuUnfoldedLI">Biographies</li>  </Link> 
            </ul>
          </div>

            <p>free delivery</p>
            <p>next day delivery, every day</p>
            <p>free returns</p>
            <div className="iconsGroupedUpResponsive">
             <div onClick={userIconHandlerResponsive} ref={userIconRefResponsive} className="userIcon">
            <img  src={icon} alt="userIcon" className="icon"/>
            {toggleUserIconResponsive ?
                        <div className="accountInformation">
            {userInfo ? <Link to='/purchaseHistory'>Purchase history</Link> : null}
            {userInfo ?  <div onClick={() => signUserOut()}> log out</div>:
            <Link to ='/account'><div> Log in</div></Link> }
            </div>
            : null}
            </div>
              <Link to='/marketplace'>
              <div className="marketplaceDiv">
                <img className="icon" src={Marketplace} /> 
              </div>
              </Link>
                        <div className="shopingCartAndCounter" onClick={() => showCart()}><img src={cart} alt="shoppingCart" className="shoppingCart"/>  <div className="counter"> {calculateCartQuantity()} </div>  </div>
                        </div>
          </div>
          




          <div className="upperPartHeader">
          <div className="upperPartHeaderLeft">
            <Link to='/'><img src={logo} alt="LOGO" className="logo"/></Link> 

          </div>
          <div className="upperPartHeaderMiddle">
            <Searchbar/>
          </div>
            
          <div className="upperPartHeaderRight">

            {userInfo ? <div className="welcomeText">Welcome {userInfo.displayName} </div> : null} 
            <div className="iconsGroupedUp">
             <div onClick={userIconHandler} ref={userIconRef} className="userIcon">
            <img  src={icon} alt="userIcon" className="icon"/>
            {toggleUserIcon ?
              <div >
            {userInfo ? <div className="accountInformation" style={{height: '200%'}}> 
            <Link to='/purchaseHistory'>Purchase history</Link>
            <div onClick={() => signUserOut()}> log out</div>
            </div> :
            <div className="accountInformation" style={{height: '100%'}}> 
            <Link to ='/account'><div> Log in</div></Link>
            </div>}
            
            </div>
            : null}
            </div>
              <Link to='/marketplace'>
              <div className="marketplaceDiv">
                <img className="icon" src={Marketplace} /> 
              </div>
              </Link>
                        <div className="shopingCartAndCounter" onClick={() => showCart()}><img src={cart} alt="shoppingCart" className="shoppingCart"/><div className="counter"> {calculateCartQuantity()} </div></div>
                        </div>
          </div>
          </div>

          <div className="lowerPartHeader">
            <nav className="navigationBar">
            <ul className="navigationBarUL">
              <Link to='/categoryElectronics' className="electronicsDiv" onMouseEnter={() => setToggleElectronics(true)} onMouseLeave={() => setToggleElectronics(false)}>
                  <div className="menuListHeader"><li>Electronics</li></div>
                  {toggleElectronics ? <div  className="electronicsUnfolded"> 
                  <Link to='/subcategoryPhones' className="menuList">Phones</Link>
                  <Link to='/subcategoryTelevisions' className="menuList">Televisions</Link>
                  <Link to='/subcategoryGameconsoles' className="menuList">Game consoles</Link>
                  </div> : null}
              </Link>


              <Link to='/categoryBooks' className="booksDiv" onMouseEnter={() => setToggleBooks(true)} onMouseLeave={() => setToggleBooks(false)}>
              <div ><li className="menuListHeader">Books</li></div>
                  {toggleBooks ? <div className="booksUnfolded">
                  <Link to='/subcategoryScience' className="menuList">Science</Link>
                  <Link to='/subcategoryHistory' className="menuList">History</Link>
                  <Link to='/subcategoryBiography' className="menuList">Biography</Link>
                    </div> : null}
              </Link>

              <div className="additionDiv">
                              <li className="menuListHeader">Our newest addition</li>
              </div>

              <div className="discountDiv">
                <li className="menuListHeader">Discounts</li>
              </div>

            </ul>
            </nav>
          </div>
          <Cart toggleCart={toggleCart} showCart={showCart}/>
    </header>
  );
}

export default Header;
