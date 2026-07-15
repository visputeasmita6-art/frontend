import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const API = `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/products`;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: ""
  });
  const [editId, setEditId] = useState(null);

  // Get all products
  const getProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("📡 Fetching from:", API);
      const res = await axios.get(API);
      console.log("✅ Products received:", res.data);
      setProducts(res.data);
    } catch (err) {
      console.error("❌ Error fetching:", err);
      setError("Failed to fetch products. Is backend running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Add or Update product
  const saveProduct = async () => {
    if (!form.name || !form.price || !form.category) {
      alert("Please fill all fields!");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      console.log("📤 Sending product data:", form);
      
      if (editId === null) {
        const res = await axios.post(API, form);
        console.log("✅ Product added:", res.data);
        setSuccess("Product added successfully!");
      } else {
        const res = await axios.put(`${API}/${editId}`, form);
        console.log("✅ Product updated:", res.data);
        setSuccess("Product updated successfully!");
        setEditId(null);
      }

      setForm({
        name: "",
        price: "",
        category: ""
      });

      await getProducts();

    } catch (err) {
      console.error("❌ Error saving product:", err);
      
      if (err.response) {
        setError(`Server error: ${err.response.status}`);
      } else if (err.request) {
        setError("No response from server. Is backend running?");
      } else {
        setError("Error: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    setLoading(true);
    try {
      await axios.delete(`${API}/${id}`);
      setSuccess("Product deleted successfully!");
      await getProducts();
    } catch (err) {
      console.error("❌ Error deleting:", err);
      setError("Failed to delete product");
    } finally {
      setLoading(false);
    }
  };

  // Edit product
  const editProduct = (product) => {
    setEditId(product.id);
    setForm({
      name: product.name,
      price: product.price,
      category: product.category
    });
  };

  return (
    <div className="container">
      <h1>🛍️ Product CRUD App</h1>
      
      {error && (
        <div className="message error">
          ❌ {error}
        </div>
      )}
      
      {success && (
        <div className="message success">
          ✅ {success}
        </div>
      )}
      
      {loading && <div className="loading">⏳ Loading...</div>}

      <div className="form">
        <input
          type="text"
          placeholder="📝 Product Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          disabled={loading}
        />
        <input
          type="number"
          placeholder="💰 Price"
          name="price"
          value={form.price}
          onChange={handleChange}
          disabled={loading}
        />
        <input
          type="text"
          placeholder="📂 Category"
          name="category"
          value={form.category}
          onChange={handleChange}
          disabled={loading}
        />
        <button onClick={saveProduct} disabled={loading}>
          {loading ? "⏳ Processing..." : (editId ? "✏️ Update Product" : "➕ Add Product")}
        </button>
        {editId && (
          <button 
            className="cancel" 
            onClick={() => {
              setEditId(null);
              setForm({ name: "", price: "", category: "" });
            }} 
            disabled={loading}
          >
            ❌ Cancel
          </button>
        )}
      </div>

      <hr />

      <div className="products-header">
        <h2>📦 Products</h2>
        <span>{products.length} items</span>
      </div>

      {products.length === 0 && !loading && (
        <div className="no-products">
          📭 No products yet. Add one above!
        </div>
      )}

      {products.map((product) => (
        <div className="card" key={product.id}>
          <div className="card-info">
            <h3>{product.name}</h3>
            <p className="price">₹{product.price}</p>
            <p className="category">{product.category}</p>
          </div>
          <div className="card-actions">
            <button className="update" onClick={() => editProduct(product)} disabled={loading}>
              ✏️ Update
            </button>
            <button className="delete" onClick={() => deleteProduct(product.id)} disabled={loading}>
              🗑️ Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;