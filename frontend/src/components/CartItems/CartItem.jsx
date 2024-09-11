import React, {useEffect, useState} from "react";
import "../CartItems/CartItem.css";
import { useContext } from "react";
import { ShopContext } from "../../context/Context";
import remove_icon from "../Assets/cart_cross_icon.png";
import axios from "axios";
import {loadStripe} from "@stripe/stripe-js";

export const CartItem = () => {
  const {
    all_product,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
  } = useContext(ShopContext);

  //Cart items in array format
  const cartItemsArray = all_product.filter(item => cartItems[item.id]>0).map(item => ({
    ...item,
    quantity: cartItems[item.id],
  }));

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const res = await axios.get("http://localhost:4000/getcartdata", {
          headers: {
            "auth-token": `${localStorage.getItem("auth-token")}`,
          },
        });

        if (res && res.data) {
          setCartItems(res.data); // Update the context with fetched cart data
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, [setCartItems]);
  //payment integration
  const handlePayment = async () => {
    const stripe = await loadStripe ("pk_test_51PxtJ5RqdVllZqdPqsENBptu8e88VvJcCxEfVrdO7v1Ay3KNhyZisT0U6Z9VD3LgNLkgkelDva16sDEy6krC9VeN00nNHJ3jPI");

    const body = {
      products: cartItemsArray,
    }
    const headers = {
      "Content-Type": "application/json",
    }
    const response = await fetch("http://localhost:4000/api/create-checkout-session",{
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    });
    const session = await response.json();

    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    })
  };
  return (
    <div className="cartitems">
      <div className="cartitems-format-main">
        <p>Product</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />

      {all_product.map((item, index) => {
        if (cartItems[item.id] > 0) {
          return (
            <div className="cartitems-format" key={index}>
              <img src={item.image} alt="" className="carticon-product-icon" />
              <p>{item.name}</p>
              <p>${item.new_price}</p>
              <button className="cartitems-quantity">
                {cartItems[item.id]}
              </button>
              <p>${item.new_price * cartItems[item.id]}</p>
              <img
                className="cartitems-remove-icon"
                src={remove_icon}
                onClick={() => {
                  removeFromCart(item.id);
                }}
                alt=""
              />
              <hr />
            </div>
          );
        }
        return null;
      })}
      <div className="cartitems-down">
        <div className="cartitems-total">
          <h1>Cart total</h1>
          <div>
            <div className="cartitems-total-item">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <p>Shipping fee</p>
              <p>Free</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <h3>Total</h3>
              <h3>${getTotalCartAmount()}</h3>
            </div>
          </div>
          <button onClick={handlePayment}>Proceed to Payment</button>
        </div>
        <div className="cartitems-promocode">
          <p>If you have a promocode , Enter here</p>
          <div className="cartitems-promobox">
            <input type="sumbit" />
            <button>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};
