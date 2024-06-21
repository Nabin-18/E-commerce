import "./Addproduct.css";
import upload_area from "../../assests/upload_area.svg";
import { useState } from "react";
// import { response } from "express";

function Addproduct() {
  const [image, setImage] = useState(false);
  // const [productDetails, setProductDetails] = useState({
  //   name: "",
  //   category: "",
  //   image: "",
  //   new_price: "",
  //   old_price: "",
  //   description: "",
  // });
  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  };
  // const changeHandler = (e) => {
  //   setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  //   // console.log(productDetails);
  // };

  const addProduct = async (data) => {
    // console.log(productDetails);

    //when we click add btn , it will communicate with backend
    // let responseData;
    // let product = productDetails;

    // let formData = new FormData();
    // formData.append("product", image);

    // now send data to api

    // const response = await fetch("http://localhost:4000/upload", {
    //   method: "POST",
    //   headers: {
    //     accept: "application/json",
    //   },
    //   body: formData,
    // }).then((response) =>
    //   response.json().then((data) => {
    //     responseData = data;
    //   })
    // );
    //this is the response from the server

    // if (responseData.success) {
    //   product.image = responseData.image_url;
    //   console.log(product);
    //for addproduct details

    await fetch("http://localhost:4000/addproduct", {
      method: "POST",

      body: data,
    }).then((response) =>
      response.json().then((data) => {
        data.success
          ? alert("Product added successfully")
          : alert("Failed to add product");
      })
    );
    // }
  };

  return (
    <form
      className="add-product"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        addProduct(data);
        e.target.reset();
        setImage(false);
      }}
    >
      <div className="addproduct-itemfield">
        <p>Product title</p>
        <input
          // onChange={changeHandler}
          type="text"
          name="name"
          placeholder="Type here"
        />
      </div>
      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input
            // onChange={changeHandler}
            type="text"
            name="old_price"
            placeholder="Type here"
          />
        </div>
        <div className="addproduct-itemfield">
          <p>Offer Price</p>
          <input
            // onChange={changeHandler}
            type="text"
            name="new_price"
            placeholder="Type here"
          />
        </div>
      </div>
      <div className="addproduct-itemfield">
        <p>Product Category</p>
        <select
          // onChange={changeHandler}
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
          onChange={imageHandler}
          type="file"
          name="image"
          id="file-input"
          hidden
        />
      </div>

      <button className="addproduct-btn">ADD</button>
    </form>
  );
}

export default Addproduct;
