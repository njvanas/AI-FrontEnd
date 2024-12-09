import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    contact: '',
    address: '',
  });
  const [editSupplier, setEditSupplier] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = () => {
    axios.get('http://localhost:3000/suppliers')
      .then((response) => setSuppliers(response.data))
      .catch((error) => console.error(error));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editSupplier) {
      setEditSupplier({ ...editSupplier, [name]: value });
    } else {
      setNewSupplier({ ...newSupplier, [name]: value });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!newSupplier.name) newErrors.name = "Name is required";
    if (!newSupplier.contact) newErrors.contact = "Contact is required";
    if (!newSupplier.address) newErrors.address = "Address is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    axios.post('http://localhost:3000/suppliers', newSupplier)
      .then(() => {
        fetchSuppliers();
        setNewSupplier({ name: '', contact: '', address: '' });
        setErrors({});
      })
      .catch((error) => console.error(error));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:3000/suppliers/${editSupplier.id}`, editSupplier)
      .then(() => {
        fetchSuppliers();
        setEditSupplier(null);
      })
      .catch((error) => console.error(error));
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:3000/suppliers/${id}`)
      .then(() => fetchSuppliers())
      .catch((error) => console.error(error));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Supplier Management</h2>

      {!editSupplier && (
        <form onSubmit={handleAddSubmit} style={{ marginBottom: '20px' }}>
          <TextField
            label="Name"
            name="name"
            value={newSupplier.name}
            onChange={handleInputChange}
            fullWidth
            style={{ marginBottom: '15px' }}
            error={!!errors.name}
            helperText={errors.name}
            required
          />
          <TextField
            label="Contact"
            name="contact"
            value={newSupplier.contact}
            onChange={handleInputChange}
            fullWidth
            style={{ marginBottom: '15px' }}
            error={!!errors.contact}
            helperText={errors.contact}
            required
          />
          <TextField
            label="Address"
            name="address"
            value={newSupplier.address}
            onChange={handleInputChange}
            fullWidth
            style={{ marginBottom: '15px' }}
            error={!!errors.address}
            helperText={errors.address}
            required
          />
          <Button variant="contained" color="primary" type="submit">
            Add Supplier
          </Button>
        </form>
      )}

      {editSupplier && (
        <form onSubmit={handleEditSubmit} style={{ marginBottom: '20px' }}>
          <TextField
            label="Name"
            name="name"
            value={editSupplier.name}
            onChange={handleInputChange}
            fullWidth
            style={{ marginBottom: '15px' }}
            required
          />
          <TextField
            label="Contact"
            name="contact"
            value={editSupplier.contact}
            onChange={handleInputChange}
            fullWidth
            style={{ marginBottom: '15px' }}
            required
          />
          <TextField
            label="Address"
            name="address"
            value={editSupplier.address}
            onChange={handleInputChange}
            fullWidth
            style={{ marginBottom: '15px' }}
            required
          />
          <Button variant="contained" color="success" type="submit" style={{ marginRight: '10px' }}>
            Save Changes
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => setEditSupplier(null)}>
            Cancel
          </Button>
        </form>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {suppliers.map((supplier) => (
              <TableRow key={supplier.id}>
                <TableCell>{supplier.id}</TableCell>
                <TableCell>{supplier.name}</TableCell>
                <TableCell>{supplier.contact}</TableCell>
                <TableCell>{supplier.address}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => setEditSupplier(supplier)}
                    style={{ marginRight: '10px' }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => handleDelete(supplier.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default SuppliersPage;
