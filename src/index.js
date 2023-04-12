import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index/index.css';
import RouteSwitch from './index/router';
import { BrowserRouter, Routes, Route, Router} from "react-router-dom";
import { database } from './firebaseAndStripe/firebase';
import { getDatabase, ref, onValue } from 'firebase/database';
import { Helmet } from 'react-helmet';
import { History } from './header/purchaseHistory';
import { RiseLoader } from 'react-spinners';
import { useState } from 'react';
import {load} from 'google-fonts-loader';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [shouldRenderMyComponent, setShouldRenderMyComponent] = useState(false);

  // I set a little widget spinner that spins for 2 seconds on initial load. This loading screen gives my code the time to check if user is logged in. 
  // It then renders the abilities logged in users have, like: welcome [username], see receipts and logout.
  useEffect(() => {
    setTimeout(() => {
      setShouldRenderMyComponent(true);
      setIsLoading(false);
    }, 2000);
  }, []);

  load({'Roboto': ['400', '400i', '700', '700i']});
  load({'Bungee': ['400', '400i', '700', '700i']});

  //I added some inline styline to the app div to center the spinner widget.
  return (
    <div className='app' style={isLoading ? {display: 'flex', justifyContent: 'center', alignItems:'center'} : null}>

      {isLoading ? (
          <RiseLoader color="#36d7b7" className='spinner' />
      ) : shouldRenderMyComponent ? (
        <RouteSwitch />
      ) : (
        <div>Default Value</div>
      )}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App/>
);


