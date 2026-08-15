import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

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
    alert(`Added to cart!\nProduct: ${product.name}\nQuantity: ${quantity}\nTotal: $${(product.price * quantity).toLocaleString()}`);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', padding: '32px', alignItems: 'center', justifyContent: 'center', minHeight: '400px', fontFamily: 'sans-serif' }}>
        <p style={{ color: '#6b7280', fontWeight: '500' }}>Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', padding: '32px', alignItems: 'center', justifyContent: 'center', minHeight: '400px', fontFamily: 'sans-serif' }}>
        <p style={{ color: '#ef4444', fontWeight: '600' }}>Error: {error}</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '896px', width: '100%', margin: '0 auto', padding: '24px', backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #f3f4f6', fontFamily: 'sans-serif', boxSizing: 'border-box' }}>

      <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth > 768 ? '1fr 1fr' : '1fr', gap: '40px' }}>
        
        
        <div style={{ width: '100%', aspectRatio: '1/1', overflow: 'hidden', backgroundColor: '#f9fafb', borderRadius: '16px', border: '1px solid #f3f4f6' }}>
          <img 
            src={product.image} 
            alt={product.name} 
            style={{ width: '100%', hieght: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'col', justifyContent: 'space-between', padding: '8px 0' }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.1em', backgroundColor: '#e0e7ff', padding: '4px 10px', borderRadius: '9999px' }}>
              {product.category}
            </span>
            
            <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#111827', marginTop: '16px', marginBottom: '8px', letterSpacing: '-0.025em' }}>
              {product.name}
            </h1>
            
            <p style={{ fontSize: '20px', fontWeight: '700', color: '#1f2937', marginBottom: '16px' }}>
              ${product.price.toLocaleString()}
            </p>
            
            <hr style={{ border: '0', borderTop: '1px solid #f3f4f6', marginBottom: '16px' }} />
            
            <p style={{ color: '#4b5563', lineHeight: '1.6', fontSize: '14px' }}>
              {product.description}
            </p>
          </div>

          <div style={{ marginTop: '24px', borderTop: '1px solid #f3f4f6', paddingTop: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Quantity:</span>
              
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: '#f9fafb', overflow: 'hidden' }}>
                <button 
                  onClick={() => handleQuantityChange('decrement')}
                  style={{ padding: '6px 12px', border: '0', backgroundColor: 'transparent', cursor: 'pointer', color: '#4b5563', fontWeight: 'bold' }}
                >
                  -
                </button>
                <span style={{ padding: '0 12px', color: '#111827', fontWeight: 'bold', fontSize: '14px', width: '32px', textAlign: 'center', display: 'inline-block' }}>
                  {quantity}
                </span>
                <button 
                  onClick={() => handleQuantityChange('increment')}
                  style={{ padding: '6px 12px', border: '0', backgroundColor: 'transparent', cursor: 'pointer', color: '#4b5563', fontWeight: 'bold' }}
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              style={{ width: '100%', backgroundColor: '#4f46e5', color: '#ffffff', padding: '14px 24px', borderRadius: '12px', border: '0', fontWeight: '700', textAlign: 'center', cursor: 'pointer', fontSize: '16px', transition: 'background-color 0.15s ease' }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4338ca'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4f46e5'}
            >
              Add to Cart
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
