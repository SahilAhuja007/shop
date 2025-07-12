import axios from "axios";
import React, { useEffect, useState } from "react";
import { useFirebase } from "../../context/firebase";
import ProductCard from "../../component/productCard";

const Home = () => {
  const [products, setProducts] = useState([]);
  const firebase = useFirebase();

  const loadProducts = async () => {
    try {
      const token = await firebase.generateToken();
      const p = await axios.get(
        "http://localhost:3000/riwaz/product/getAllProducts",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProducts(p.data.data);
    } catch (error) {
      console.log("issue while fetching products :- ", error.message);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div>
      <h2>Products</h2>
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        products.map((product, idx) => <ProductCard key={idx} {...product} />)
      )}
    </div>
  );
};

export default Home;
