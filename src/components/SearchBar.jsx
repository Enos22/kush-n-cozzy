import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function ProductSearchApp() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/db.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Check your network connection');
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filteredProducts = products.filter((product) => {
    const lowerQuery = query.toLowerCase();
    return (
      product.name?.toLowerCase().includes(lowerQuery) ||
      product.description?.toLowerCase().includes(lowerQuery) ||
      product.category?.toLowerCase().includes(lowerQuery)
    );
  });

  if (loading) return <p>Loading product database...</p>;
  if (error) return <p>Error loading products: {error}</p>;

  return (
    <div>
      <h2>Product Marketplace</h2>
      
      <input
        type="text"
        placeholder="Search by name, description, or category..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id}>
              <img src={product.image} alt={product.name} />
              <div>
                <span>{product.category}</span>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
              </div>
              <div>
                <span>KES {product.price?.toLocaleString()}</span>
                <Link to={`/product/${product.id}`}>View</Link>
              </div>
            </div>
          ))
        ) : (
          <p>No products match your search.</p>
        )}
      </div>
    </div>
  );
}
