import React from "react";
import "./Addproduct.css";
import upload_area from "../../assests/upload_area.svg";
import { useState } from "react";
// import { response } from "express";

function Addproduct() {
  const [image, setImage] = useState(false);
  const [productDetails, setProductDetails] = useState({
    name: "",
    category: "",
    image: "",
    new_price: "",
    old_price: "",
    description:""
  
  });
  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  };
  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
    // console.log(productDetails);
  };

  const addProduct = async () => {
    console.log(productDetails);

    //when we click add btn , it will communicate with backend
    let responseData;
    let product = productDetails;

    let formData = new FormData();
    formData.append("product", image);

    // now send data to api

    const response = await fetch("http://localhost:4000/upload", {
      method: "POST",
      headers: {
        accpet: "application/json",
      },
      body: formData,
    }).then((response) =>
      response.json().then((data) => {
        responseData = data;
      })
    );
    //this is the response from the server

    if (responseData.success) {
      product.image = responseData.image_url;
      console.log(product);
      //for addproduct details

      await fetch("http://localhost:4000/addproduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify(product),
      }).then((response) =>
        response.json().then((data) => {
          data.success
            ? alert("Product added successfully")
            : alert("Failed to add product");
        })
      );
    }
  };

  return (
    <div className="add-product">
      <div className="addproduct-itemfield">
        <p>Product title</p>
        <input
          value={productDetails.name}
          onChange={changeHandler}
          type="text"
          name="name"
          placeholder="Type here"
        />
      </div>
      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input
            value={productDetails.old_price}
            onChange={changeHandler}
            type="text"
            name="old_price"
            placeholder="Type here"
          />
        </div>
        <div className="addproduct-itemfield">
          <p>Offer Price</p>
          <input
            value={productDetails.new_price}
            onChange={changeHandler}
            type="text"
            name="new_price"
            placeholder="Type here"
          />
        </div>
      </div>
      <div className="addproduct-itemfield">
        <p>Product Category</p>
        <select
          value={productDetails.category}
          onChange={changeHandler}
          name="category"
          className="add-product-selector"
        >
          <option value="women">Women</option>
          <option value="men">Men</option>

          <option value="kid">Kid</option>
        </select>
      </div>
      <div className="addproduct-itemfield">
        <label htmlFor="file-input">
          <img
            src={image ? URL.createObjectURL(image) : upload_area}
            className="addproduct-thumbnail-img"
          />
        </label>
        <input
          value={productDetails.image}
          onChange={imageHandler}
          type="file"
          name="image"
          id="file-input"
          hidden
        />
      </div>
      

      <button onClick={() => addProduct()} className="addproduct-btn">
        ADD
      </button>
    </div>
  );
}

export default Addproduct;
