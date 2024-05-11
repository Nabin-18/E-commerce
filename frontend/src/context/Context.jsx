import React from 'react'
import { createContext } from 'react'
import all_product from '../components/Assets/all_product'
import { useState } from 'react';


export const ShopContext = createContext(null);
const getDefaultCart = () => {
    let cart = {}
    for (let index = 0; index < all_product.length + 1; index++) {
        cart[index] = 0;

    }
    return cart
}


// shop context provider

const ShopContextProvider = (props) => {
    const [cartItems, setCartItems] = useState(getDefaultCart());
    // console.log(cartItems)

    const addToCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }))
        // this clg is used to check the add to cart cartItems
    }

    const removeFromCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))
    }

    const getTotalCartAmount = () => {
        let totalamount = 0;
        for (const item in cartItems)
         {
            if (cartItems[item] > 0) {
       
                let itemInfo = all_product.find((product) => product.id === Number(item))
               
                // totalamount += itemInfo.new_price * cartItems[item];
                
            }
            console.log(totalamount)
            return totalamount;
        }
    }



    const contextValue = { all_product, cartItems, addToCart, removeFromCart, getTotalCartAmount };




    return (
        <ShopContext.Provider value={contextValue} >
            {props.children}

        </ShopContext.Provider>
    )


}
export default ShopContextProvider;