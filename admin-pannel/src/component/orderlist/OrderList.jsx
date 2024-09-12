import React, { useEffect, useState } from "react";
import "./OrderList.css";
import Sidebar from "../sidebar/Sidebar";

function OrderList() {
    const [OrderProducts, setOrderProducts] = useState([]);
    useEffect(() => {
      fetch("http://localhost:4000/getpaymentdata")
        .then((response) => response.json())
        .then((data) => setOrderProducts(data));
        console.log(OrderProducts);
    }
    , []);

  return (
    <>
      <div className="container">
        <Sidebar />
        <div className="list-product">
          <h1>Order Product List</h1>
          {OrderProducts.map((product, index) => (
  <div key={index} className="product-card">
    <div className="product-details">
      {product.items && product.items.length > 0 && (
        <>
          {product.items.map((item, itemIndex) => (
            <div key={itemIndex}>
              <p>Product Name: {item.description}</p>
              <p>Quantity: {item.quantity}</p>
            </div>
          ))}
        </>
      )}
      <p>Payment ID: {product.paymentId}</p>
      <p>Payment Date: {new Date(product.date).toLocaleDateString()}</p>
      <p>Payment Amount: ${product.amount}</p>
    </div>
    <hr />
  </div>
))}

        </div>
      </div>
    </>
  );
}

export default OrderList;