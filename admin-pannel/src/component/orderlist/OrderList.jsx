import React, { useEffect, useState } from "react";
import "./OrderList.css";
import check_icon from "../../assests/check.png";
import Sidebar from "../sidebar/Sidebar";

function OrderList() {
    const [OrderProducts, setOrderProducts] = useState([]);

  return (
    <>
    <div className="container">
    <Sidebar />
    <div className="list-product">
      <h1>All Product List</h1>

      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Category</p>
        <p>Paid By</p>
        <p>Payment Id</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />

        {OrderProducts.map((product, index) => {
          return (
            <div key={index} className="listproduct-format-main1 ">
              <img src={product.image} className="listproduct-image" />

              <p>{product.name}</p>
              <p>{product.category}</p>
              <img
                src={check_icon}
                className="listproduct-tickmark"
              />
            </div>
          );
        })}
      </div>
    </div>
    </div>
    </>
  );
}

export default OrderList;
