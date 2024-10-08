import React from "react";
import logo from "../Assets/logo.png";
import cart_icon from "../Assets/cart_icon.png";
import "./Navbar.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useContext } from "react";
import { ShopContext } from "../../context/Context";

const Navbar = () => {
  const [menu, setMenu] = useState("shop");
  const { getTotalItem } = useContext(ShopContext);
  const location = useLocation();
  console.log(location);
  return (
    <div className="navbar">
      <div className="nav-logo">
        <Link to="/" style={{ textDecoration: "none" }}>
          <div className="logo-container">
            <img src={logo} alt="logo" className="logo-image" />
            <p className="logo-text">SHOPPER</p>
          </div>
        </Link>
      </div>
      <ul className="nav-menu">
        <li>
          <Link to="/" style={{ textDecoration: "none" }}>
          Shop</Link>
          {location.pathname === "/shop" && <hr />}
        </li>
        <li>
          <Link to="/men" style={{ textDecoration: "none" }}>Men</Link>
          {location.pathname === "/men" && <hr />}
        </li>
        <li>
          <Link to="/women" style={{ textDecoration: "none" }}>Women</Link>
          {location.pathname === "/women" && <hr />}
        </li>
        <li>
          <Link to="/kid" style={{ textDecoration: "none" }}>Kid</Link>
          {location.pathname === "/kid" && <hr />}
        </li>
      </ul>

      <div className="nav-login-cart">
        {localStorage.getItem("auth-token") ? (
          <button onClick={() => {
            localStorage.removeItem("auth-token");
            window.location.replace("/");
          }}>
            Log out
          </button>
        ) : (
          <Link to="/login" style={{ textDecoration: "none" }}>
            <button>Login</button>
          </Link>
        )}

        <Link to="/cart" style={{ textDecoration: "none" }} className="cart-icon-container">
          <img src={cart_icon} alt="cart" />
          <div className="nav-cart-count">{getTotalItem()}</div>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
