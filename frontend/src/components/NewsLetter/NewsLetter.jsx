import React from 'react'
import './NewsLetter.css'

function NewsLetter() {
  return (
    <div className="start">
    <div className='newsletter'>
    <h1>Get Exclusive Offers On Your Email</h1>
    <p>Subscribe to our newsletter and stay Up</p>
    <div>
    <input type="email" placeholder='Your email Id' />
    <button>Subscribe</button>
    </div>
    
    </div>
    </div>
  )
}

export default NewsLetter