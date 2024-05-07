import React from 'react'
import logo from '../Assets/logo.png'
import cart_icon from '../Assets/cart_icon.png'
import './Navbar.css'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'


const Navbar = () => {
    const [menu, setMenu] = useState("shop")
    const location = useLocation()
    console.log(location)
    return (
        <div className='navbar'>
            <div className='nav-logo'>
                <img src={logo} alt="logo" />
                <p>SHOPPER</p>

            </div>
            <ul className='nav-menu'>
                <li  ><Link to="/" style={{ textDecoration: 'none' }}>Shop</Link> {location.pathname === "shop" ? <hr /> : <></>} </li>
                <li ><Link to='/men' style={{ textDecoration: 'none' }} >Men</Link>{location.pathname === "/men" ? <hr /> : <></>}</li>
                <li > <Link to='/women' style={{ textDecoration: 'none' }}>Women</Link>{location.pathname === "/women" ? <hr /> : <></>}</li>
                <li > <Link to='kid' style={{ textDecoration: 'none' }}>Kid</Link> {location.pathname === "/kid" ? <hr /> : <></>}</li>

            </ul>
            <div className='nav-login-cart'>
                <Link to='/login' style={{ textDecoration: 'none' }}> <button>Login</button></Link>
                <Link to='/cart' style={{ textDecoration: 'none' }}>
                    <img src={cart_icon} alt="" />
                </Link>

                <div className="nav-cart-count">0</div>


            </div>

        </div>
    )
}

export default Navbar