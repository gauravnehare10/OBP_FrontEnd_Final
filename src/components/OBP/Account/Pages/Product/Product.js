import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Product.css';
import useAuthStore from '../../../../../utils/authStore';
import { useNavigate } from 'react-router-dom';

export default function Product({bank, accountId}) {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const { getAccessToken } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const access_token = getAccessToken();

    axios
      .get(`http://127.0.0.1:8000/${bank}/accounts/${accountId}/product`, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
      })
      .then((response) => {
        setProducts(response.data || []);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to fetch products.');
      });
  }, [getAccessToken, bank, accountId]);

  return (
    <div className="product-container">
      <button className="back-btn" onClick={ () => navigate(-1) }>Go Back</button>
      <h2 className="heading-main">Products</h2>
      {error ? (
        <p className="error-message">{error}</p>
      ) : products.length > 0 ? (
        <div className="products-list">
          {products.map((product, index) => (
            <div className="product-card" key={index}>
              <h3>Product {index + 1}</h3>
              <p>
                <strong>Product Name:</strong> {product.ProductName}
              </p>
              <p>
                <strong>Product ID:</strong> {product.ProductId}
              </p>
              <p>
                <strong>Account ID:</strong> {product.AccountId}
              </p>
              <p>
                <strong>Product Type:</strong> {product.ProductType}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>No products available.</p>
      )}
    </div>
  );
}
