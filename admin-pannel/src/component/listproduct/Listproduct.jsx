import React, { useEffect, useState } from "react";
import "./Listproduct.css";
import cross_icon from "../../assests/cross_icon.png";
import Sidebar from "../sidebar/Sidebar";

function Listproduct() {
  const [allProducts, setAllProducts] = useState([]);
  const fetchAllProducts = async () => {
    const response = await fetch(
      "https://e-commerce-9u9h.onrender.com/allproduct"
    );
    const result = await response.json();
    setAllProducts(result);
  };
  useEffect(() => {
    fetchAllProducts();
  }, []);

  const deleteProduct = async (id) => {
    const response = await fetch(
      "https://e-commerce-9u9h.onrender.com/deleteproduct",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
      }
    );

    const result = await response.json();
    console.log(result);
    await fetchAllProducts();
  };

  return (
    <>
      <div className="container">
        <Sidebar />
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
                <div key={index} className="listproduct-format-main1 ">
                  <img src={product.image} className="listproduct-image" />

                  <p>{product.name}</p>
                  <p>${product.old_price}</p>
                  <p>${product.new_price}</p>
                  <p>{product.category}</p>
                  <img
                    src={cross_icon}
                    onClick={() => {
                      deleteProduct(product.id);
                    }}
                    className="listproduct-remove-icon"
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

export default Listproduct;
