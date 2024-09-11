import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Breadcrum from "../components/Breadcrum/Breadcrum";
import ProductDisplay from "../components/ProductDisplay/ProductDisplay";
import { ShopContext } from "../context/Context";
import DescriptionBox from "../components/DescriptionBox/DescriptionBox";
import RelatedProduct from "../components/RelatedProducts/RelatedProduct";

function Product() {
  const { all_product } = useContext(ShopContext);
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = () => {
      try {
        const foundProduct = all_product.find((e) => e.id == productId);
        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          setError("Product not found");
        }
      } catch (err) {
        setError("Error fetching product");
      } finally {
        setLoading(false);
      }
    };

    if (all_product.length > 0) {
      fetchProduct();
    } else {
      setLoading(true);
    }
  }, [all_product, productId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <Breadcrum product={product} />
      <ProductDisplay product={product} />
      <DescriptionBox />
      <RelatedProduct />
    </div>
  );
}

export default Product;