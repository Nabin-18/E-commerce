import React from 'react'
import './Offer.css'
import exclusive_image from '../Assets/exclusive_image.png'


function Offers() {
    return (
        <div className="offers">
            <div className="offers-left">
                <h1>Exclusive</h1>
                <h1>Offers for You</h1>
                <p>ONLY FOR BEST SELLERS PRODUCTS</p>
                <button>Check Now</button>
            </div>
            <div className="offers-right">
            </div>
            <div className="offers-right">
                <img src={exclusive_image} alt="" />
                </div>

        </div>
    )
}

export default Offers