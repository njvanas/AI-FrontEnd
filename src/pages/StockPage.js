import React, { useState, useEffect } from 'react';
import axios from 'axios';

function StockPage() {
  const [stock, setStock] = useState([]);
  const [newStock, setNewStock] = useState({
    name: '',
    quantity: '',
    price_per_unit: '',
    low_stock_threshold: '',
  });
  const [editStock, setEditStock] = useState(null);

  useEffect(() => {
    fetchStock();
  }, []);

  const fetchStock = () => {
    axios.get('http://localhost:3000/stock')
      .then((response) => setStock(response.data))
      .catch((error) => console.error(error));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editStock) {
      setEditStock({ ...editStock, [name]: value });
    } else {
      setNewStock({ ...newStock, [name]: value });
    }
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3000/stock', newStock)
      .then(() => {
        fetchStock();
        setNewStock({ name: '', quantity: '', price_per_unit: '', low_stock_threshold: '' });
      })
      .catch((error) => console.error(error));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:3000/stock/${editStock.id}`, editStock)
      .then(() => {
        fetchStock();
        setEditStock(null);
      })
      .catch((error) => console.error(error));
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:3000/stock/${id}`)
      .then(() => fetchStock())
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <h2>Stock Management</h2>

      {!editStock && (
        <form onSubmit={handleAddSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={newStock.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={newStock.quantity}
            onChange={handleInputChange}
            required
          />
          <input
            type="number"
            name="price_per_unit"
            placeholder="Price Per Unit"
            value={newStock.price_per_unit}
            onChange={handleInputChange}
            required
          />
          <input
            type="number"
            name="low_stock_threshold"
            placeholder="Low Stock Threshold"
            value={newStock.low_stock_threshold}
            onChange={handleInputChange}
            required
          />
          <button type="submit">Add Stock</button>
        </form>
      )}

      {editStock && (
        <form onSubmit={handleEditSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={editStock.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={editStock.quantity}
            onChange={handleInputChange}
            required
          />
          <input
            type="number"
            name="price_per_unit"
            placeholder="Price Per Unit"
            value={editStock.price_per_unit}
            onChange={handleInputChange}
            required
          />
          <input
            type="number"
            name="low_stock_threshold"
            placeholder="Low Stock Threshold"
            value={editStock.low_stock_threshold}
            onChange={handleInputChange}
            required
          />
          <button type="submit">Save Changes</button>
          <button type="button" onClick={() => setEditStock(null)}>Cancel</button>
        </form>
      )}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Quantity</th>
            <th>Price Per Unit</th>
            <th>Low Stock Threshold</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stock.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>{item.price_per_unit}</td>
              <td>{item.low_stock_threshold}</td>
              <td>
                <button onClick={() => setEditStock(item)}>Edit</button>
                <button onClick={() => handleDelete(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StockPage;
