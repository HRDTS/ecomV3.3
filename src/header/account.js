import React, { useEffect, useRef, useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, updateProfile, getAuth, getUserByEmail, } from "firebase/auth";
import { auth } from "../firebaseAndStripe/firebase";
import { database } from "../firebaseAndStripe/firebase";
import { set, ref as DBRef } from "firebase/database";
import logo from '../img/logo.png'
import Stripe from 'stripe';
import { Navigate, useNavigate } from "react-router-dom";


const stripe = require('stripe')('***REMOVED***');


/*
This component contains 4 items: creating an account, loging in, rendering login component and rendering account creation component.
The account creation is done with Firebase Authentication. Every user needs an email, password and a username.
I also create a Stripe account for every customer that creates an account. This Stripe account is linked to the Firebase Auth account. 
Having the Firebase Auth and Stripe account connect, I can then do things like create a payment link on Stripe for a specific Firebase Auth user AND save the Stripe receipts in the Firebase Database.
*/
function Account(props) {

    const navigate = useNavigate()
    const [alreadyRegistered, setAlreadyRegistered] = useState(false)
    const [userInfo, setUserInfo] = useState()
    const [emailInvalid, setEmailInvalid] = useState()

    const emailRef = useRef(null)
    const nameRef = useRef(null)
    const passwordRef = useRef(null)
    const [name, setName] = useState("");
    const auth = getAuth();
    
  
      function createAccount (event) {
        event.preventDefault();
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        const displayName = nameRef.current.value;
      
            createUserWithEmailAndPassword(auth, email, password)
              .then((userCredential) => {
                const user = userCredential.user;
                updateProfile(user, {
                  displayName: displayName
                }).then(() => {
                  console.log('successfully added username to profile')
                }).catch((error) => {
                  console.log('something went wrong with adding the username to profile')
                });
          
                const customerPromise = stripe.customers.create({
                  email: email,
                  source: 'tok_visa',
                }).then((customer) => {
                  const customerID = customer.id;
                  return set(DBRef(database, `customers/${user.uid}`), {
                    stripeCustomerID: customerID,
                  });
                });
                
                const signInPromise = signInWithEmailAndPassword(auth, email, password)
                
                
                return Promise.all([customerPromise, signInPromise]);
              })
              .then(() => {
                navigate('/')
              })
              .catch((error) => {
                console.log(error)
                setEmailInvalid('Email is already taken')
              })

              .catch(() => {
                console.log('something went wrong')
              })
          };
      
        

    

    function loginAccount (event) {
        event.preventDefault();
        signInWithEmailAndPassword(auth, event.target.email.value, event.target.password.value)
        .then((userCredential) => {
            const user = userCredential.user;
            navigate('/')
            //window.location.reload();
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });
    }    

    function loginAccountGuest (event) {
      event.preventDefault();
      signInWithEmailAndPassword(auth, 'guest@hotmail.com', '123123')
      .then((userCredential) => {
          const user = userCredential.user;
          navigate('/')
          //window.location.reload();
      })
      .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
      });
  }    


    useEffect(() => {

        async function getUserData () {
            onAuthStateChanged(auth, (user) => {
                if(user) {
                    const uid = user.uid;
                    const uemail = user.email
                    setUserInfo(uemail)
                }
            })
        }
        getUserData()
    }, [])

    function handleNameChange(event) {
      setName(event.target.value);
      event.target.setCustomValidity('');
    }

    function handleNameInvalid(event) {
      event.target.setCustomValidity("Please enter only letters.");

    }
    
    function registrationRender () {
        return (
            <div className="registration">
                <img src={logo} className='logo' id="loginLogo"/>
                <h3>Create your account</h3>
                <form onSubmit={createAccount}>

                <label>Name:</label>
                <input
                required
                ref={nameRef}
                pattern="[A-Za-z]+"
                onChange={handleNameChange}
                onInvalid={handleNameInvalid}
                type='text'
                maxLength={20}
                id="name"/> 

                <label>Email adress:</label>
                <p style={{color: 'red', margin: '0px'}}>{emailInvalid}</p>
                <input
                required
                ref={emailRef}
                type='email'
                id="email"
                />
                

                <label>Password:</label>
                <input
                required
                ref={passwordRef}
                type='password'
                id="password"/> 

                <button type="submit"> Create account</button>
            </form>
            <p onClick={() => setAlreadyRegistered(true)} className='loginPageQuestion'>Already registered?</p>
            <button className="guestLogin" onClick={(event) => loginAccountGuest(event)}>Guest Login (no register required)</button>
            </div>
        )
    }    

    function loginRender () {
        return (
            <div className="login">
                <img src={logo} className='logo' id="loginLogo"/>
                <h3>Login to your account</h3>
                <form onSubmit={loginAccount}>
                <label>Email adress:</label>
                <input
                type='email'
                id="email"
                />

                <label>Password:</label>
                <input
                type='password'
                id="password"/> 
                <button type="submit"> Login</button>
            </form>
            <p onClick={() => setAlreadyRegistered(false)} className='loginPageQuestion'>Create an account</p>
            <button className="guestLogin" onClick={(event) => loginAccountGuest(event)}>Guest Login (no register required)</button>
            </div>
        )
    }
    

    return (
        <div className="loginPage"> 
            {alreadyRegistered ? loginRender() : registrationRender()}
        </div>
    )
}

export default Account;