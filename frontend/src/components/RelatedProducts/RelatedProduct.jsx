import React from 'react'
import '../RelatedProducts/RelatedProduct.css'
import Item from '../Item/Item'
import data_product from '../Assets/all_product'


function RelatedProduct() {
    return (
        <div className='relatedproducts'>
            <h1>Related Products</h1>
            <hr />
            <div className="relatedproduct-item">
                {
                    data_product.map((item, index) => {

                        return <Item key={index} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price} />

                    })
                }

            </div>

        </div>
    )
}

export default RelatedProduct