import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch('/db.json')
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch product');
        return response.json();
      })
      .then((data) => {
        const foundProduct = data.products.find((p) => p.id === String(id));
        if (foundProduct) {
          setProduct(foundProduct);
          setQuantity(1);
        } else {
          throw new Error('Product not found');
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleQuantityChange = (type) => {
    if (type === 'increment') setQuantity((prev) => prev + 1);
    if (type === 'decrement' && quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleAddToCart = () => {
    alert(`Added to cart!\nProduct: ${product.name}\nQuantity: ${quantity}\nTotal: KES ${(product.price * quantity).toLocaleString()}`);
  };

  if (loading) return <p>Loading product details...</p>;

  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        <Link to="/">Back to Marketplace</Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/">&larr; Back to Marketplace</Link>
      
      <div>
        <div>
          <img src={product.image} alt={product.name} />
        </div>

        <div>
          <div>
            <span>{product.category}</span>
            <h1>{product.name}</h1>
            <p>KES {product.price.toLocaleString()}</p>
            <hr />
            <p>{product.description}</p>
          </div>

          <div>
            <div>
              <span>Quantity:</span>
              <div>
                <button onClick={() => handleQuantityChange('decrement')}>-</button>
                <span>{quantity}</span>
                <button onClick={() => handleQuantityChange('increment')}>+</button>
              </div>
            </div>

            <button onClick={handleAddToCart}>Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  );
}
