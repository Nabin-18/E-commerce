import React, { useEffect, useState } from "react";
import "./OrderList.css";
import Sidebar from "../sidebar/Sidebar";

function OrderList() {
  const [orderProducts, setOrderProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/getpaymentdata")
      .then((response) => response.json())
      .then((data) => setOrderProducts(data));
  }, []);

  return (
    <div className="order-list-container">
      <Sidebar />
      <div className="order-list-content">
        <h1 className="order-list-title">Order Product List</h1>
        <div className="order-list-items">
          {orderProducts.length > 0 ? (
            orderProducts.map((product, index) => (
              <div key={index} className="order-card">
                <h2 className="order-card-title">Order #{index + 1}</h2>
                {product.items && product.items.length > 0 && (
                  <div className="order-card-items">
                    {product.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="order-item">
                        <p className="order-item-name">Product Name: {item.description}</p>
                        <p className="order-item-quantity">Quantity: {item.quantity}</p>
                      </div>
                    ))}
                  </div>
                )}
                <p className="order-card-payment-id">Payment ID: {product.paymentId}</p>
                <p className="order-card-payment-date">Payment Date: {new Date(product.date).toLocaleDateString()}</p>
                <p className="order-card-payment-amount">Payment Amount: ${product.amount}</p>
              </div>
            ))
          ) : (
            <p>No orders found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderList;
