import React from "react";
import "./Item.css";
import { Link } from "react-router-dom";
function Item(props) {
  return (
    <div className="item">
      <Link to={`/product/${props.id}`}>
        <img onClick={window.scrollTo(0, 0)} src={props.image} alt="" />
      </Link>
      <p>{props.name}</p>
      <div className="item-prices">
        <div className="item-price-old"> Old Price ${props.old_price}</div>
        <div className="item-price-new"> New Price ${props.new_price}</div>
      </div>
    
      <div className="item-description">
        <h5>{props.description}</h5>
      </div>
    </div>
  );
}

export default Item;
