import React from 'react'
import hand_icon from '../Assets/hand_icon.png'
import hero_image from '../Assets/banner1.png'
import arrow_icon from '../Assets/arrow.png'
import './Hero.css'


function Hero() {
    return (
        <div className='hero'>
            <div className="hero-left">
                <h2>NEW ARRIVALS ONLY</h2>
                <div>
                    <div className="hand-icon">
                        <p>New</p>
                        <img src={hand_icon} alt="" />

                    </div>
                    <p>Collection</p>
                    <p>for everyone</p>

                </div>
                <div className="hero-latest-btn">
                    <div>Latest Collection</div>
                    <img src={arrow_icon} alt="" />
                </div>

            </div>
            <div className="hero-right">
                <img src={hero_image} />
            </div>
        </div>

    )
}

export default Hero