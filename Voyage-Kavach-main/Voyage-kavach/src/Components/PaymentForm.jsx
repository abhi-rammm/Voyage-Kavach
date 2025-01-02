import React from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import Sucessfull from "./Sucessfull";
const PaymentForm = ({ clientSecret }) => { // Expecting clientSecret as a prop
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error, paymentIntent } = await stripe.confirmPayment({
     
      elements,
      confirmParams: {
        return_url: "http://localhost:5173/successfull", // Redirect URL after payment
      },
    });

    if (error) {
      console.error("Payment error:", error);
      
    } else if (paymentIntent.status === "succeeded") {
      console.log("Payment succeeded:", paymentIntent);
      
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button type="submit" disabled={!stripe}>
        Pay
      </button>
    </form>
  );
};

export default PaymentForm;
