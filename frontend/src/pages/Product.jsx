import React from 'react'
import { useContext } from 'react'
import { useParams } from 'react-router-dom'
import Breadcrum from '../components/Breadcrum/Breadcrum';
import ProductDisplay from '../components/ProductDisplay/ProductDisplay';
import { ShopContext } from '../context/Context';
import DescriptionBox from '../components/DescriptionBox/DescriptionBox';
import RelatedProduct from '../components/RelatedProducts/RelatedProduct';

function Product() {
  const {all_product}=useContext(ShopContext)
  const {productId}=useParams();
  const product=all_product.find((e)=>e.id==Number(productId))
  return (
    <div>
    <Breadcrum  product={product} />
    <ProductDisplay product={product}/>
    <DescriptionBox  />
    <RelatedProduct />
    
    </div>
  )
}

export default Product