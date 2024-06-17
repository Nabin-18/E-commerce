import React, { useEffect, useState } from "react";
import "./Listproduct.css";
import cross_icon from "../../assests/cross_icon.png";


function Listproduct() {
  const [allProducts, setAllProducts] = useState([]);
const fetchAllProducts = async () => {
const response = await fetch("http://localhost:4000/allproduct");
const result = await response.json();
setAllProducts(result);

  
}
useEffect(() => {
  fetchAllProducts();
 }, []);

const deleteProduct =async()=>{
  const response = await fetch("http://localhost:4000/deleteproduct", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: allProducts.id}),
  });
  const result = await response.json();
  console.log(result);
  await fetchAllProducts();
}


  return (
    <div className="list-product">
      <h1>All Product List</h1>

      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>
      <div className="listproduct-allproducts">
     
        <hr />

        {allProducts.map((product, index) => {
         
          return (
            <div
              key={index}
              className="listproduct-format-main1 "
            >
              <img src={product.image} className="listproduct-image" />
            
              <p>{product.name}</p>
              <p>${product.old_price}</p>
              <p>${product.new_price}</p>
              <p>{product.category}</p>
              <img src={cross_icon} onClick={()=>{deleteProduct()}}className="listproduct-remove-icon" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Listproduct;
