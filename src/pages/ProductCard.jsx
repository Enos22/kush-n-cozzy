import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
    return (
        <article className="product-card">
            <img src={product.image} alt={product.name} />
            <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
                <div>
                    <span className="tag" style={{ display: 'inline-block', marginBottom: 8 }}>{product.category}</span>
                    <h3 style={{ margin: '0 0 8px', fontSize: '1.2rem' }}>{product.name}</h3>
                    <p style={{ margin: 0, color: 'var(--ink-soft)' }}>{product.description}</p>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '1.05rem' }}>KES {Number(product.price).toLocaleString()}</strong>
                    <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'var(--navy)', fontWeight: 700 }}>
                        View details
                    </Link>
                </div>
            </div>
        </article>
    );
}
