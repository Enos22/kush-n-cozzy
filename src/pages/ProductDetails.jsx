import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProduct } from '../api/products';
import { useCart } from '../CartContext';

export default function ProductDetails() {
    const { id } = useParams();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        getProduct(id)
            .then((data) => {
                setProduct(data);
                setQuantity(1);
                setError(null);
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [id]);

    const handleQuantityChange = (type) => {
        if (type === 'increment') setQuantity((prev) => prev + 1);
        if (type === 'decrement' && quantity > 1) setQuantity((prev) => prev - 1);
    };

    const handleAddToCart = () => {
        addToCart(product, quantity);
        alert(`Added to cart!\nProduct: ${product.name}\nQuantity: ${quantity}\nTotal: KES ${(product.price * quantity).toLocaleString()}`);
    };

    if (loading) return <p>Loading product details...</p>;

    if (error) {
        return (
            <div style={{ padding: 20 }}>
                <p>Error: {error}</p>
                <Link to="/">Back to Marketplace</Link>
            </div>
        );
    }

    if (!product) return null;

    return (
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px 16px 48px' }}>
            <Link to="/" style={{ display: 'inline-block', marginBottom: 24, color: 'var(--navy)', fontWeight: 700 }}>
                &larr; Back to Marketplace
            </Link>

            <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 32, alignItems: 'center' }}>
                <div style={{ background: 'var(--white)', border: '3px solid var(--ink)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                    <img src={product.image} alt={product.name} style={{ width: '100%', height: 520, objectFit: 'cover', display: 'block' }} />
                </div>

                <div style={{ background: 'var(--white)', border: '3px solid var(--ink)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-tag)', padding: 28 }}>
                    <span className="tag">{product.category}</span>
                    <h1 style={{ margin: '12px 0 10px', fontSize: '2.2rem' }}>{product.name}</h1>
                    <p style={{ fontSize: '1.8rem', margin: '0 0 16px', fontWeight: 700 }}>KES {Number(product.price).toLocaleString()}</p>
                    <hr style={{ borderColor: 'var(--navy-muted)', margin: '18px 0' }} />
                    <p style={{ lineHeight: 1.7, color: 'var(--navy-muted)' }}>{product.description}</p>

                    <div style={{ marginTop: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18 }}>
                            <span style={{ fontWeight: 700 }}>Quantity:</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, border: '2px solid var(--navy-muted)', borderRadius: 999, padding: '6px 10px' }}>
                                <button type="button" onClick={() => handleQuantityChange('decrement')} style={{ border: 'none', background: 'transparent', fontSize: '1.3rem', cursor: 'pointer' }}>-</button>
                                <span>{quantity}</span>
                                <button type="button" onClick={() => handleQuantityChange('increment')} style={{ border: 'none', background: 'transparent', fontSize: '1.3rem', cursor: 'pointer' }}>+</button>
                            </div>
                        </div>

                        <button type="button" onClick={handleAddToCart} style={{ width: '100%', marginTop: 8 }}>
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
