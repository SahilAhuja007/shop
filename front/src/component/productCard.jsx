import axios from "axios";
import React from "react";
import { useFirebase } from "../context/firebase";

const ProductCard = (product) => {
  const firebase = useFirebase();
  const handleAddition = async () => {
    try {
      const token = await firebase.generateToken();
      const additionresponse = await axios.post(
        "http://localhost:3000/riwaz/cart/addProduct",
        {
          product_id: product._id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("addtionresponse:- ", additionresponse);
    } catch (error) {}
  };
  console.log("product :- ", product);
  return (
    <div style={{ margin: 10, padding: 0, border: 1 }}>
      <img src={`${product.image}`} alt="product product" />
      <p>Name:- {product.name}</p>
      <p>Type:- {product.type}</p>
      <p>Price:- {product.price}</p>
      <p>Description:- {product.description}</p>
      <button onClick={handleAddition}>Add</button>
    </div>
  );
};

export default ProductCard;
