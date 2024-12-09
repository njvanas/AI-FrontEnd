import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function BillsPage() {
  const [bills, setBills] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [newBill, setNewBill] = useState({
    supplierId: '',
    amount: '',
    due_date: '',
    status: 'Pending',
  });
  const [editBill, setEditBill] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchBills();
    fetchSuppliers();
  }, []);

  const fetchBills = () => {
    axios.get('http://localhost:3000/bills')
      .then((response) => setBills(response.data))
      .catch((error) => console.error(error));
  };

  const fetchSuppliers = () => {
    axios.get('http://localhost:3000/suppliers')
      .then((response) => setSuppliers(response.data))
      .catch((error) => console.error(error));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editBill) {
      setEditBill({ ...editBill, [name]: value });
    } else {
      setNewBill({ ...newBill, [name]: value });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!newBill.supplierId) newErrors.supplierId = "Supplier is required";
    if (!newBill.amount || newBill.amount <= 0) newErrors.amount = "Amount must be greater than 0";
    if (!newBill.due_date) newErrors.due_date = "Due date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    axios.post('http://localhost:3000/bills', {
      supplier: { id: newBill.supplierId },
      amount: newBill.amount,
      due_date: newBill.due_date,
      status: newBill.status,
    })
      .then(() => {
        fetchBills();
        setNewBill({ supplierId: '', amount: '', due_date: '', status: 'Pending' });
        setErrors({});
      })
      .catch((error) => console.error(error));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:3000/bills/${editBill.id}`, {
      supplier: { id: editBill.supplierId },
      amount: editBill.amount,
      due_date: editBill.due_date,
      status: editBill.status,
    })
      .then(() => {
        fetchBills();
        setEditBill(null);
      })
      .catch((error) => console.error(error));
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:3000/bills/${id}`)
      .then(() => fetchBills())
      .catch((error) => console.error(error));
  };

  return (
    <div className="container mt-4">
      <h2>Bill Management</h2>

      {/* Add New Bill Form */}
      {!editBill && (
        <form onSubmit={handleAddSubmit} className="mb-4">
          <div className="mb-3">
            <select
              name="supplierId"
              value={newBill.supplierId}
              onChange={handleInputChange}
              className={`form-select ${errors.supplierId ? 'is-invalid' : ''}`}
              required
            >
              <option value="" disabled>Select Supplier</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
            {errors.supplierId && <div className="invalid-feedback">{errors.supplierId}</div>}
          </div>
          <div className="mb-3">
            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={newBill.amount}
              onChange={handleInputChange}
              className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
              required
            />
            {errors.amount && <div className="invalid-feedback">{errors.amount}</div>}
          </div>
          <div className="mb-3">
            <input
              type="date"
              name="due_date"
              value={newBill.due_date}
              onChange={handleInputChange}
              className={`form-control ${errors.due_date ? 'is-invalid' : ''}`}
              required
            />
            {errors.due_date && <div className="invalid-feedback">{errors.due_date}</div>}
          </div>
          <div className="mb-3">
            <select
              name="status"
              value={newBill.status}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Add Bill</button>
        </form>
      )}

      {/* Edit Bill Form */}
      {editBill && (
        <form onSubmit={handleEditSubmit} className="mb-4">
          <div className="mb-3">
            <select
              name="supplierId"
              value={editBill.supplierId}
              onChange={handleInputChange}
              className="form-select"
              required
            >
              <option value="" disabled>Select Supplier</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={editBill.amount}
              onChange={handleInputChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="date"
              name="due_date"
              value={editBill.due_date}
              onChange={handleInputChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <select
              name="status"
              value={editBill.status}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
          <button type="submit" className="btn btn-success">Save Changes</button>
          <button type="button" className="btn btn-secondary" onClick={() => setEditBill(null)}>Cancel</button>
        </form>
      )}

      {/* Display Bills */}
      <table className="table table-striped table-hover">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Supplier</th>
            <th>Amount</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bills.map((bill) => (
            <tr key={bill.id}>
              <td>{bill.id}</td>
              <td>{bill.supplier.name}</td>
              <td>{bill.amount}</td>
              <td>{bill.due_date}</td>
              <td>{bill.status}</td>
              <td>
                <button className="btn btn-warning btn-sm" onClick={() => setEditBill(bill)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(bill.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BillsPage;
