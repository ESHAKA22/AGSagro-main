import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Status.css'; // Add your styling here
import Nav from "../Nav/Nav";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLowStockProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8070/api/products/lowstock');
        setProducts(response.data.products);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching low stock products:", error);
        setLoading(false);
      }
    };

    fetchLowStockProducts();
  }, []);

  const outOfStockProducts = products.filter(product => product.Quantity === 0);
  const lowStockProducts = products.filter(product => product.Quantity > 0 && product.Quantity < 16);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Nav/>
      <div className="product-status">
    
    {/* Out of Stock Section */}
    <h2>Out of Stock</h2>
    {outOfStockProducts.length === 0 ? (
      <p>No out of stock products found.</p>
    ) : (
      <table className="product-table">
        <thead>
          <tr>
            <th>Product Image</th>
            <th>Name</th>
            <th>ID</th>
            <th>Category</th>
            <th>Manufacturer</th>
            <th>Supplier ID</th>
          </tr>
        </thead>
        <tbody>
          {outOfStockProducts.map(product => (
            <tr key={product._id}>
              <td><img src={product.P_Image} alt={product.P_name} className="product-image" /></td>
              <td>{product.P_name}</td>
              <td>{product._id}</td>
              <td>{product.Category}</td>
              <td>{product.Manufacture}</td>
              <td>{product.Supplier_ID}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}

    {/* Low Stock Section */}
    <h2>Low Stock</h2>
    {lowStockProducts.length === 0 ? (
      <p>No low stock products found.</p>
    ) : (
      <table className="product-table">
        <thead>
          <tr>
            <th>Product Image</th>
            <th>Name</th>
            <th>ID</th>
            <th>Category</th>
            <th>Manufacturer</th>
            <th>Supplier ID</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {lowStockProducts.map(product => (
            <tr key={product._id}>
              <td><img src={product.P_Image} alt={product.P_name} className="product-image" /></td>
              <td>{product.P_name}</td>
              <td>{product._id}</td>
              <td>{product.Category}</td>
              <td>{product.Manufacture}</td>
              <td>{product.Supplier_ID}</td>
              <td>{product.Quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
  </div>
    
  );
};

export default Home;
