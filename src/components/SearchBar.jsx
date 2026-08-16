import React, { useState, useEffect } from 'react';

export default function ProductSearchApp() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/products')
      .then((response) => {
        if (!response.ok) {
          throw new Error('check your network');
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data);
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
                <div>KES {product.price?.toLocaleString()}</div>
              </div>
            </div>
          ))
        ) : (
          <p>No products matches your search.</p>
        )}
      </div>
    </div>
  );
}
