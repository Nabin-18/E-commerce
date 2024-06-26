import React, { useEffect } from "react";
import { createContext } from "react";
import all_product from "../components/Assets/all_product";
import { useState } from "react";

export const ShopContext = createContext(null);
const getDefaultCart = () => {
  let cart = {};
  for (let index = 0; index < 300 + 1; index++) {
    cart[index] = 0;
  }
  return cart;
};

// shop context provider

const ShopContextProvider = (props) => {
  const [all_product, setAll_Product] = useState([]);
  const [cartItems, setCartItems] = useState(getDefaultCart());
  // console.log(cartItems)

  useEffect(() => {
    fetch("http://localhost:4000/allproduct")
      .then((response) => response.json())
      .then((data) => setAll_Product(data));
   
      if(localStorage.getItem('auth-token'))
        {
          fetch('http://localhost:4000/getcart',{
            method: 'POST',
            headers:{
              Accept: 'application/from-data',
              'auth-token': `${localStorage.getItem('auth-token')}`,
              'Content-Type': 'application/json',
            },
            body: "",

          }).then((response) => response.json())
          .then((data) =>setCartItems(data));
        }
  }, []);

  const addToCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    if(localStorage.getItem(' auth-token')) {
      fetch('http://localhost:4000/addtocart',{
        method: 'POST',
        headers:{
          Accept: 'application/from-data',
          'auth-token': `${localStorage.getItem('auth-token')}`,
          'Content-Type': 'application/json'

        },
        body:JSON.stringify({"itemId":itemId}),
      })
      .then((response) => response.json())
      .then((data) => console.log(data));
    }
  }

  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if(localStorage.getItem('auth-token')){
      fetch('http://localhost:4000/removefromcard',{
        method: 'POST',
        headers:{
          Accept: 'application/from-data',
          'auth-token': `${localStorage.getItem('auth-token')}`,
          'Content-Type': 'application/json'

        },
        body:JSON.stringify({"itemId":itemId}),
      })
      .then((response) => response.json())
      .then((data) => console.log(data));
    }
  };

  const getTotalCartAmount = () => {
    let totalamount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = all_product.find(
          (product) => product.id === Number(item)
        );

        totalamount += itemInfo.new_price * cartItems[item];
      }
    }
    return totalamount;
  };
  const getTotalItem = () => {
    let totalItem = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        totalItem += cartItems[item];
      }
    }
    return totalItem;
  };

  const contextValue = {
    getTotalItem,
    all_product,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};
export default ShopContextProvider;
