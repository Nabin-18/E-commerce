import React from 'react';
import './Error.css';

const ErrorPage = () => {
  return (
    <div className="error-container">
      <div className="error-content">
        <h1 className="error-title">Oops!</h1>
        <p className="error-message">Something went wrong. Please try again later.</p>
        <a className="error-link" href="/">Go Back to Home</a>
      </div>
    </div>
  );
};

export default ErrorPage;