import React from 'react'
import { useContext } from 'react'
import { ShopContext } from '../context/Context'
import dropdown_icon from '../components/Assets/dropdown_icon.png'
import Item from '../components/Item/Item'
import './CSS/ShopCategory.css'
import Product from './Product'

function ShopCatergory(props) {
  const { all_product } = useContext(ShopContext)
  return (
    <>
    <div className='shop-category'>

      <img className='shopcategory-banner' src={props.banner} />

      <div className="shopcatergory-indexSort">
        <p>
          <span>Showing 1-12 </span>Out of 36 products
        </p>
        <div className='shopCatergory-sort'>
          Sort by <img src={dropdown_icon} />

        </div>

      </div>
      <div className="shopcategory-product">
        {
          all_product?.map((item, index) => {
            if (props.category === item.category) {
              return <Item key={index} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price} />
            }
          }

          )
        }
      </div>
      <div className="shopcategory-loadmore">
      Explore More</div>
    </div>
    
    </>
  )
}

export default ShopCatergory