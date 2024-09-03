import React from "react";
import "./ProductDisplay.css";
import star_icon from "../Assets/star_dull_icon.png";
import { useContext } from "react";
import { ShopContext } from "../../context/Context";

function ProductDisplay(props) {
  const { product } = props;
  
  const { addToCart } = useContext(ShopContext);
  return (
    <div className="productdisplay">
      <div className="productdisplay-left">
        <div className="productdisplay-img-list">
          <img src={product.image} />
          <img src={product.image} />
          <img src={product.image} />
          <img src={product.image} />
        </div>
        <div className="productdisplay-img">
          <img src={product.image} alt="" className="productdisplay-main-img" />
        </div>
      </div>
      <div className="productdisplay-right">
        <h1>{product.name}</h1>
        <div className="productdisplay-right-star">
          <img src={star_icon} />
          <img src={star_icon} />
          <img src={star_icon} />
          <img src={star_icon} />
          <img src={star_icon} />

          <p>(122)</p>
        </div>
        <div className="productdisplay-right-prices">
          <div className="productdisplay-right-price-old">
          Old Price:
            ${product.old_price}
          </div>
          <div className="productdisplay-right-price-new">
          New Price:
            ${product.new_price}
          </div>
        </div>
        <div className="productdisplay-right-description">
          <h1>Description</h1>
          <p>{product.description}</p>
        </div>
        <div className="productdisplay-right-size">
          <h1>Select Size</h1>
          <div className="productdisplay-right-sizes">
            <div>S</div>
            <div>M</div>
            <div>L</div>
            <div>XL</div>
            <div>XXL</div>
          </div>
        </div>
        <button
          onClick={() => {
            addToCart(product.id);
          }}
        >
          ADD TO CART
        </button>
        <p className="productdisplay-right-category">
          <span>Category:{product.category}</span>
        </p>
        <p className="productdisplay-right-category">
          <span>Tags:</span>Morden ,Latest
        </p>
      </div>
    </div>
  );
}

export default ProductDisplay;
