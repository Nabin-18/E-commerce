import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log('PaymentSuccess component mounted');
    const checkPaymentStatus = async () => {
      const sessionId = new URLSearchParams(window.location.search).get('session_id');
      
      try {
        const response = await axios.get(`http://localhost:4000/success?session_id=${sessionId}`);
        
        if (response.data.success) {
          // Redirect to success page
          navigate('/success');
        } else {
          // Handle failure or error cases
          console.error('Error fetching payment details:', response.data.message);
          navigate('/cancel');  // Redirect to an error page if needed
        }
      } catch (error) {
        console.error('Error retrieving payment status:', error);
        navigate('/error');
      }
    };

    checkPaymentStatus();
  }, [navigate]);

  return (
    <div>
      <h1>Processing Payment...</h1>
    </div>
  );
};

export default PaymentSuccess;
