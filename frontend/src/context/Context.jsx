import React, { useEffect } from "react";
import { createContext } from "react";
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
    fetch("https://e-commerce-9u9h.onrender.com/allproduct")
      .then((response) => response.json())
      .then((data) => setAll_Product(data));

    if (localStorage.getItem("auth-token")) {
      fetch("https://e-commerce-9u9h.onrender.com/getcartdata", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": `${localStorage.getItem("auth-token")}`,
          accept: "application/form-data",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setCartItems(data);
          localStorage.setItem("cart", JSON.stringify(data));
        });
    }
  }, []);

  const addToCart = (itemId) => {
    console.log("Button clicked");
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    if (localStorage.getItem("auth-token")) {
      fetch("https://e-commerce-9u9h.onrender.com/addtocart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": `${localStorage.getItem("auth-token")}`,
          accept: "application/form-data",
        },
        body: JSON.stringify({ itemId: itemId }),
      })
        .then((response) => response.json())
        .then((data) => console.log(data));
    }
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if (localStorage.getItem("auth-token")) {
      fetch("https://e-commerce-9u9h.onrender.com/removefromcart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": `${localStorage.getItem("auth-token")}`,
          accept: "application/form-data",
        },
        body: JSON.stringify({ itemId: itemId }),
      })
        .then((response) => response.json())
        .then((data) => console.log(data));
    }
  };

  const clearCart = () => {
    setCartItems(getDefaultCart());
    if (localStorage.getItem("auth-token")) {
      fetch("https://e-commerce-9u9h.onrender.com/clearcart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": `${localStorage.getItem("auth-token")}`,
          accept: "application/form-data",
        },
      })
        .then((response) => response.json())
        .then((data) => console.log(data));
    }
  };

  const getTotalCartAmount = () => {
    let totalamount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const itemInfo = all_product.find((product) => product.id === item);
        if (itemInfo) {
          totalamount += itemInfo.new_price * cartItems[item];
        } else {
          console.warn(`Item with ID ${item} not found in all_product`);
        }
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
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    clearCart,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};
export default ShopContextProvider;
