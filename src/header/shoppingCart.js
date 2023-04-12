import React from "react";
import { useState, useEffect } from "react";
import { create } from "zustand";
import { user } from "./header";
import { auth, database } from "../firebaseAndStripe/firebase";
import { getDatabase, set, ref as databaseRef, onValue } from "firebase/database";
import { loadStripe } from "@stripe/stripe-js";
import Stripe from "stripe";
import { persist } from 'zustand/middleware'
import { Link } from "react-router-dom";


const stripeAPI = require('stripe')(process.env.REACT_APP_stripeAPI);

// This Zustand useCart state is where all the shopping cart items are stored and removed.
// This state uses 'persist' which allows the shopping cart to be stored up in the local storage.
// This is useful for when the user for example refreshes the page and still wants to keep his/her items in the shopping cart.
export const useCart = create(
    persist(
        (set) => ({
            items: [],
            addItems: (item) => {
                set((state) => ({
                    items: [...item]
                }))
            },
            resetCart: () => {
                set((state) => ({items: []}))
            }
        }), {
            name: 'cart-storage',
            storage: sessionStorage
        }
    )
);



function Cart (props) {

    const cart = useCart((state) => state.items)
    const addItems = useCart((state) => state.addItems)
    const resetCart = useCart((state) => state.resetCart)
    const toggleCart = props.toggleCart
    const showCart = props.showCart
    const userInfo = user((state) => state.userInfo) // user authentication is stored here.

    const [totalPrice, setTotalPrice] = useState(0)
    const [paymentClicked, setPaymentClicked] = useState(false)



    function changeQuantity (data, index) { // change product quantity in shopping cart
        if(data.target.value >= 0) {

            let items = cart
            let item = {...cart[index]}
            item.quantity = data.target.value
            items[index] = item
            addItems(items)
        }
        removeEmptyObject()
    }

    const minus = (data, index) => { // decrease product quantity in shopping cart. 
        data.preventDefault()
        if(cart[index].quantity > 0) {
            let items = cart
            let item = {...cart[index]}
            item.quantity --
            items[index] = item
            addItems([...items])
            }
            removeEmptyObject()
    }


    const plus = (data, index) => { // add product quantity in shooping cart
        data.preventDefault()
            let items = cart
            let item = {...cart[index]}
            item.quantity ++
            items[index] = item
            addItems([...items])
            removeEmptyObject()
    }
    

    const removeEmptyObject = () => { // When quantity hits 0, remove item as a whole from cart. This can be done by either pressing on minus or entering 0 in the quantity field.
        let newObject = cart.filter(element => (
            element.quantity > 0
        ))
        addItems(newObject)
    }

    

    const cartContent = cart.map((element, index) => { //Render the shopping cart by mapping through the Zustand useCart state.
        //Every indvididual item in the shopping cart has the specifications: item price and total item price. 
        return <div key={element.ID} className='item'> 

            <div className="imageAndTitle">
            {element.title} <img className="cartImages" src={element.imageUrl1}/>
            <div className="buttonsAndInput">
                <button onClick={(data) => minus(data, index)}>-</button>
                <input
                onChange={(data) => changeQuantity(data, index)}
                value={cart[index].quantity}
                type='number'
                id="quantity"
                />
                <button onClick={(data) => plus(data, index)}>+</button>
            </div>
            </div>

            <div className="itemPrices"> 
            <div className="itemPrice"><p>Item Price:</p> {'€' + element.price}</div>
            <div className="itemPrice"><p>Item Price Total:</p> { '€' +  (parseInt(element.price) * element.quantity)} </div>
            </div>
            </div>

})

const totalContent = () => { // There is a total price and a total quantity at the bottom for all the products combined.

    let price = 0
    let quantity = 0

    cart.map((element) => {
        price += (totalPrice + (element.price * element.quantity)) 
        quantity += element.quantity
    })
    let priceWithEuroSign = '€' + price
    return <div className="totalPriceAndQuantityOuter">

        <div className="totalPriceDiv"><div>Total Price:</div> <div>{priceWithEuroSign}</div></div>
        <div className="totalQuantityDiv"><div>Total Quantity:</div> <div>{parseInt(quantity)}</div></div>

        </div>
}

function cartRendering () { // Only render the shopping cart contents if the user has clicked on the shopping cart icon.
    if(toggleCart) {
        return <div className="cart-items">
        <div className="shoppingCartPage">
        <div className="upperSideShoppingCart">
        <div></div>
        <h1 className="shoppingCartTitle">Shopping Cart</h1>
        <div className="closeCart" onClick={showCart}>X</div>
        </div>
        {cart.length > 0 ?
        <div className="shoppingCartContent">
            <form>
                {cartContent}
             </form>
             <div>{totalContent()}</div>
             <p style={{color: 'red'}}>Use this card number for a test payment: <br></br> 4242 4242 4242 4242 <br></br></p>
             {!userInfo ? <div > <Link to='/account' className="cartButton"> <button onClick={showCart}>Login to make a purchase</button> </Link> </div> : <div className="cartButton" ><button onClick={() => checkOut()} disabled={paymentClicked}>Proceed to Payment</button></div> } 
             <div className="cartButton" ><button onClick={() => resetCart()} disabled={paymentClicked}>reset cart</button></div>
             
        </div>
         : <div className="emptyCart">Your cart is empty </div>}

        
    </div>
    </div>
    }
    }
    

    const getStripeInfo = async () => {
        const starCountRef = databaseRef(database, 'customers/' + `${userInfo.uid}/`);
        const stripeCustomerID = await new Promise((resolve) => {
            onValue(starCountRef, (snapshot) => {
                const data = snapshot.val()
                const stripeCustomerID = data.stripeCustomerID
                resolve(stripeCustomerID)
            })
        })

        try {
            const charges = await stripeAPI.charges.list({ customer: stripeCustomerID });
            // charges.data contains an array of charge objects
            console.log(charges.data)
            //window.open(charges.data[0].receipt_url)
            return charges.data;
          } catch (error) {
            console.error(error);
            throw error;
          }
    }
        

    // The checkout is connected to Stripe Payment, so I need to set that up here.
    // I take the shopping cart content and map through the items. Every item has a quantity (depending on how many items in the cart) and a unique stripe price ID.
    // I set this price ID up for every product. Even the user published products get their own stripe price ID.
    // I also take the Stripe Customer ID from the Firebase User. With the gathered information I can make a Stripe Session
    // This Stripe session will return a session ID which I can then use to redirect the customer to the Stripe Checkout.
    // This Stripe checkout will contain the user email and all the products in the shopping cart (price, quantity and description).
    // Test payments can be made with card number: 4242 4242 4242 4242.
    const checkOut = async () => {
        setPaymentClicked(true)
        const lineItems = cart.map((item) => {
            return {
                price: item.stripePriceID,
                quantity: item.quantity,
            }
        })

        const starCountRef = databaseRef(database, 'customers/' + `${userInfo.uid}/`);
        const stripeCustomerID = await new Promise((resolve) => {
            onValue(starCountRef, (snapshot) => {
                const data = snapshot.val()
                const stripeCustomerID = data.stripeCustomerID
                resolve(stripeCustomerID)
            })
        })
        

        try {
            const session = await stripeAPI.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: window.location.origin,
            cancel_url: window.location.origin,
            customer: stripeCustomerID,
        })
        console.log(stripeCustomerID)
            const stripe = await loadStripe(process.env.REACT_APP_stripe)
            stripe.redirectToCheckout({  sessionId: session.id })
            resetCart()
        } catch (error) {
            setPaymentClicked(false)
            console.log('hmm')
            alert('something went wrong with your Stripe payment')
        }
    }

    return (
        <div>
            {cartRendering()}
        </div>
    )
}

export default Cart;