import { useState, useEffect } from 'react';
import { createProduct, deleteProduct, getProducts } from '../../public/products';

function NewProduct() {
    const [products, setProducts] = useState([]);
    const [name, setName] = useState('');
    const [category, setCategory] = useState('electronics');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');

    useEffect(() => {
        getProducts()
            .then((data) => setProducts(data))
            .catch((err) => console.error('Failed to fetch products:', err));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newProduct = {
            name,
            category,
            price: Number(price),
            description,
            image,
        };

        try {
            const savedProduct = await createProduct(newProduct);
            setProducts((current) => [...current, savedProduct]);
            setName('');
            setCategory('electronics');
            setPrice('');
            setDescription('');
            setImage('');
        } catch (err) {
            console.error('Failed to add product:', err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteProduct(id);
            setProducts((current) => current.filter((product) => product.id !== id));
        } catch (err) {
            console.error('Failed to delete product:', err);
        }
    };

    return (
        <div className="new-product-container">
            <h1 className="brand-mark" style={{ fontSize: '1.6rem' }}>
                Add a New <span>Product</span>
            </h1>
            <p className="brand-subtitle">admin · inventory desk</p>

            <div className="tag-card tilt">
                <form onSubmit={handleSubmit}>
                    <label>Product Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

                    <label>Category</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="electronics">Electronics</option>
                        <option value="clothes">Clothes</option>
                        <option value="beauty products">Beauty Products</option>
                        <option value="gift products">Gift Products</option>
                        <option value="furniture">Furniture</option>
                    </select>

                    <label>Price (KES)</label>
                    <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />

                    <label>Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />

                    <label>Image URL</label>
                    <input type="text" value={image} onChange={(e) => setImage(e.target.value)} />

                    <button type="submit">Add Product</button>
                </form>
            </div>

            <h3 style={{ marginTop: 40 }}>Current Products</h3>
            <ul className="product-list">
                {products.map((product) => (
                    <li key={product.id} className="product-item">
                        <img src={product.image} alt={product.name} />
                        <div>
                            <strong>{product.name}</strong>
                            <p>{product.description}</p>
                            <span className="price-tag">KES {product.price}</span>
                        </div>
                        <button className="delete-btn" onClick={() => handleDelete(product.id)}>
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default NewProduct;
