import React, { createContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Route,Routes  } from "react-router-dom";
import Navbar from './Components/Navbar';
import Ride from './Components/Stripe/Ride';
import Drive from './Components/Drive';
import SignUp from './Components/SignUp';
import Payment from './Components/Stripe/Payment';
import DriverSignup from './Components/DriverSignup';
import DriverUI from './Components/DriverUI';
import { auth, db } from './Components/Capstone'; // Firebase auth and Firestore imports
import { doc, getDoc } from 'firebase/firestore';
import PaymentForm from './Components/PaymentForm';
import CheckoutForm from './Components/Stripe/CheckoutForm';

import Sucessfull from './Components/Sucessfull';


export const UserContext = createContext(null);

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isDriver, setIsDriver] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          // Create references for both user and driver documents
          const userDocRef = doc(db, 'users', user.uid);
          const driverDocRef = doc(db, 'drivers', user.uid);

          // Fetch both documents in parallel
          const [userDoc, driverDoc] = await Promise.all([
            getDoc(userDocRef),
            getDoc(driverDocRef),
          ]);

          if (userDoc.exists()) {
            setCurrentUser(user); // Regular user detected
            setIsDriver(false);
          } else if (driverDoc.exists()) {
            setCurrentUser(null); // Don't show driver name in navbar
            setIsDriver(true); // Driver login detected
          } else {
            console.warn('No matching user or driver document found.');
            setCurrentUser(null);
            setIsDriver(false); // Guest state fallback
          }
        } catch (error) {
          console.error('Error checking user type:', error);
          setCurrentUser(null);
          setIsDriver(false); // Reset state on error
        }
      } else {
        // User is not logged in
        setCurrentUser(null);
        setIsDriver(false);
      }
    });

    return () => unsubscribe();
  }, []);


  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, isDriver, setIsDriver }}>
      <Router>
        <Navbar />
        <Routes>
         
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<Drive />} />
          <Route path="/ride" element={<Ride/>} />
          <Route path="/drive" element={<Drive />} />
          <Route path="/payment/:id/:fare" element={<Payment />} />
          <Route path="/driversignup" element={<DriverSignup />} />
          <Route path="/driverui" element={<DriverUI />} />
          <Route path="/payment" element={<PaymentForm />} />
          <Route path="/checkoutform/:id/:fare" element={<CheckoutForm />} />
          <Route path="/sucessfull" element={<Sucessfull />} />
         
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
