import React from 'react';
import './Cancel.css';

const Cancel = () => {
  return (
    <div className="cancel-container">
      <div className="cancel-content">
        <h1 className="cancel-title">Payment Canceled</h1>
        <p className="cancel-message">
          Your payment has been canceled. Please try again or contact our support team if you need assistance.
        </p>
        <p className="support-info">
          <strong>Support:</strong> Call us at <a href="tel:+989XXXXXXXX">98XXXXXXXX</a> or email us at <a href="mailto:abc@shopper.com">abc@shopper.com</a>
        </p>
        <a className="cancel-link" href="/">Return to Home</a>
      </div>
    </div>
  );
};

export default Cancel;
