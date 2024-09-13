import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Success.css";

const Success = () => {
  const navigate = useNavigate();

  // Handle button click to navigate to home or any other route
  const handleGoHome = () => {
    navigate("/");
  };

  //get the payment details from backend
  const [paymentData, setPaymentData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/getpaymentdata")
      .then((res) => res.json())
      .then((data) => setPaymentData(data));
    console.log(paymentData);
  }, []);

  return (
    <>
      <div className="payment-success-container">
        <div className="payment-success-card">
          <h1 className="success-title">Payment Successful!</h1>
          <p className="success-message">
            Thank you for your purchase! Your payment has been processed
            successfully.
          </p>

          <div className="payment-details">
            <h2>Payment Details</h2>
            <p>Payment ID: {paymentData.paymentId}</p>
            <p>Payment Date: {paymentData.date}</p>
            <p>Payment Amount: ${paymentData.amount}</p>
            {/* <p>Product Item:{paymentData.items.description}</p> */}
          </div>
          <button className="go-home-button" onClick={handleGoHome}>
            Go to Home
          </button>
        </div>
      </div>
    </>
  );
};

export default Success;