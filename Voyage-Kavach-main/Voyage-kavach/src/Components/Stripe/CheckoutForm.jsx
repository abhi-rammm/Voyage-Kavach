import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "../PaymentForm";

const CheckoutForm = () => {
  const { fare } = useParams();
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize Stripe
    const initializeStripe = async () => {
      try {
        const stripe = await loadStripe("PUBLISHABLE KEy");
        setStripePromise(stripe);
      } catch (err) {
        setError("Failed to load Stripe");
        console.error("Stripe initialization error:", err);
      }
    };
    initializeStripe();
  }, []);

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      if (!fare) return;

      try {
        setLoading(true);
        const response = await fetch("http://localhost:5001/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: Math.round(parseFloat(fare) * 100), // Convert to cents
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }

        setClientSecret(data.clientSecret);
      } catch (err) {
        setError(`Payment setup failed: ${err.message}`);
        console.error("Payment intent error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (fare) {
      fetchPaymentIntent();
    }
  }, [fare]);

  const options = {
    clientSecret,
    appearance: {
      // theme: "night",

      variables: {
        colorPrimary: '#0570de',
        colorBackground: '#ffffff',
        colorText: 'black',
        colorDanger: '#df1b41',
      }
    },
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (loading) {
    return <div className="loading">Loading payment details...</div>;
  }

  if (!clientSecret || !stripePromise) {
    return <div>Initializing payment...</div>;
  }

  return (
    <div className="checkout-form" >
      <div className="payment-container m-5 pt-5">
        <h2>Complete Your Payment</h2>
        <p>Amount to pay: ${parseFloat(fare).toFixed(2)}</p>
        <Elements stripe={stripePromise} options={options}>
          <PaymentForm clientSecret={clientSecret} />
        </Elements>
      </div>
    </div>
  );
};

export default CheckoutForm;