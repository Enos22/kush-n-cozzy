import { useState, useEffect } from "react";

function NewProduct() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    fetch("http://localhost:3001/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Failed to fetch products:", err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProduct = { name, price: Number(price), description, image };

    fetch("http://localhost:3001/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct),
    })
      .then((res) => res.json())
      .then((savedProduct) => {
        setProducts([...products, savedProduct]);
        setName("");
        setPrice("");
        setDescription("");
        setImage("");
      })
      .catch((err) => console.error("Failed to add product:", err));
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:3001/products/${id}`, { method: "DELETE" })
      .then(() => setProducts(products.filter((product) => product.id !== id)))
      .catch((err) => console.error("Failed to delete product:", err));
  };

  return (
    <div className="new-product-container">
      <h1 className="brand-mark" style={{ fontSize: "1.6rem" }}>
        Add a New <span>Product</span>
      </h1>
      <p className="brand-subtitle">admin · inventory desk</p>

      <div className="tag-card tilt">
        <form onSubmit={handleSubmit}>
          <label>Product Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

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
