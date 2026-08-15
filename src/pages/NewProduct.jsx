import { useState, useMemo } from 'react';
import { useProducts } from '../context/ProductContext';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import ProductCard from '../components/ProductCard';

export default function ProductList() {
  const { products, categories, status, error } = useProducts();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const matchesQuery = !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
      const matchesCategory = category === 'All' || p.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [products, query, category]);

  return (
    <section className="container" style={{ paddingTop: 40, paddingBottom: 64 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
        <div>
          <span className="tag">Catalog</span>
          <h1 style={{ fontSize: '1.8rem', marginTop: 10 }}>Product list</h1>
        </div>
        <SearchBar value={query} onChange={setQuery} />
      </div>

      <div style={{ marginBottom: 28 }}>
        <CategoryFilter categories={categories} active={category} onSelect={setCategory} />
      </div>

      {status === 'loading' && <p style={{ color: 'var(--ink-soft)' }}>Loading products…</p>}
      {status === 'error' && <p className="field-error">Couldn't load products: {error}</p>}

      {status === 'ready' && filtered.length === 0 && (
        <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--ink-soft)' }}>
          No products match "{query}"{category !== 'All' ? ` in ${category}` : ''}. Try a different search or category.
        </div>
      )}

      {status === 'ready' && filtered.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 20,
          }}
        >
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}