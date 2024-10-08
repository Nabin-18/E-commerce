import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Success.css";
import { ShopContext } from "../../context/Context";

const Success = () => {
  const navigate = useNavigate();
  const { clearCart } = useContext(ShopContext);

  // Handle button click to navigate to home or any other route
  const handleGoHome = () => {
    navigate("/");
  };

  //get the payment details from backend
  const [paymentData, setPaymentData] = useState([]);

  useEffect(() => {
    fetch("https://e-commerce-9u9h.onrender.com/getpaymentdata")
      .then((res) => res.json())
      .then((data) => setPaymentData(data));
    console.log(paymentData);
    clearCart();
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
          <button className="go-home-button" onClick={handleGoHome}>
            Go to Home
          </button>
        </div>
      </div>
    </>
  );
};

export default Success;
