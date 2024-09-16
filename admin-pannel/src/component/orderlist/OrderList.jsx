import React, { useEffect, useState } from "react";
import "./OrderList.css";
import Sidebar from "../sidebar/Sidebar";

function OrderList() {
  const [orderProducts, setOrderProducts] = useState([]);

  useEffect(() => {
    fetch("https://e-commerce-9u9h.onrender.com/getpaymentdata")
      .then((response) => response.json())
      .then((data) => {
        // Sort orders by date in descending order
        const sortedOrders = data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setOrderProducts(sortedOrders);
      });
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
                <p className="order-card-payment-name">
                  User Name: {product.user}
                </p>
                <p className="order-card-payment-ph_num">
                  Contact Detail: {product.ph_num}
                </p>
                <hr />
                {product.items && product.items.length > 0 && (
                  <div className="order-card-items">
                    {product.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="order-item">
                        <p className="order-item-name">
                          Product Name: {item.description}
                        </p>
                        <p className="order-item-quantity">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                <p className="order-card-payment-id">
                  Payment ID: {product.paymentId}
                </p>
                <p className="order-card-payment-date">
                  Payment Date: {new Date(product.date).toLocaleDateString()}
                </p>
                <p className="order-card-payment-amount">
                  Payment Amount: ${product.amount}
                </p>
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
