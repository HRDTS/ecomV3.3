import React, { useEffect } from "react";
import { useState } from "react";
import { user } from "./header";
import { database } from "../firebaseAndStripe/firebase";
import { getDatabase, set, ref as databaseRef, onValue } from "firebase/database";
import { loadStripe } from "@stripe/stripe-js";
import Stripe from "stripe";

const stripeAPI = require('stripe')(process.env.REACT_APP_stripeAPI);

//This is the component where I render the customer receipts in a table.
// I achieve this by grabbing the user id from Firebase Auth (when the user is logged in), and then I grab the Stripe customer ID from the database.
// Now, with this Stripe Customer ID I can retrieve the receipts list with an API call.
// This receipts list is then mapped and displayed in a table format.
export function History (props) {
    
    const [tableRows, setTableRows] = useState([]);
    const [userInfoLoaded, setUserInfoLoaded] = useState(false);
    const userInfo = user((state) => state.userInfo);

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
            //window.open(charges.data[0].receipt_url)
            return charges.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async function RenderTable() {
        const object = await getStripeInfo()
        const tableRows = object.map((order, index) => {
            return(
                <tr key={order.receipt_number}>
                    <td>{index + 1}</td>
                <td>${order.amount / 100}</td>
                <td>{ new Date(order.created * 1000).toLocaleString()}</td>
                <td><a href={order.receipt_url}>show receipt</a></td>
            </tr>
            )

        })
        if(object.length > 0 ) {    
            setTableRows(tableRows)
        } else{
            setTableRows(<td colSpan={4}>No purchase history yet</td>)
        }
        
    }

    useEffect(() => {
        if (!userInfoLoaded && userInfo) {
          setUserInfoLoaded(true);
        }
        if (userInfoLoaded) {
          RenderTable();
        }
      }, [userInfo, userInfoLoaded]);


      return(
        <div>
            <h1>Purchase history</h1>
            <h2>Receipt links older than 30 days are set to inactive by Stripe.</h2>
            <table style={{ border: "1px solid black"}}>
                <thead>
                    <tr >
                        <th >Order</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Receipt</th>
                    </tr>
                </thead>
                <tbody >
                    {tableRows}
                </tbody>
            </table>
        </div>

    )
}