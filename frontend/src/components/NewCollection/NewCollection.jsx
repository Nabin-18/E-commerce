import React, { useEffect, useState } from "react";
import "./NewCollection.css";

import Item from "../Item/Item";

function NewCollection() {
  const [newcollection, setNewcollection] = useState([]);
  useEffect(() => {
    fetch("http://localhost:4000/newcollection")
      .then((res) => res.json())
      .then((data) => setNewcollection(data));
    
      
  }, []);
  //    when we add a new product to admin pannel , collection will be occcur on newcollection section
  return (
    <div className="new-collections">
      <h1>NEW COLLECTIONS</h1>
      <hr />
      <div className="collections">
        {newcollection.map((item, index) => {
          return (
            <Item
              key={index}
              id={item.id}
              name={item.name}
              image={item.image}
              new_price={item.new_price}
              old_price={item.old_price}
              description={item.description}
            />
          );
        })}
      </div>
    </div>
  );
}

export default NewCollection;
