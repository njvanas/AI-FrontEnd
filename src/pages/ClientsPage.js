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

function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [editClient, setEditClient] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = () => {
    axios.get('http://localhost:3000/clients')
      .then((response) => setClients(response.data))
      .catch((error) => console.error(error));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editClient) {
      setEditClient({ ...editClient, [name]: value });
    } else {
      setNewClient({ ...newClient, [name]: value });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!newClient.name) newErrors.name = "Name is required";
    if (!newClient.email) newErrors.email = "Email is required";
    if (!newClient.phone) newErrors.phone = "Phone is required";
    if (!newClient.address) newErrors.address = "Address is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    axios.post('http://localhost:3000/clients', newClient)
      .then(() => {
        fetchClients();
        setNewClient({ name: '', email: '', phone: '', address: '' });
        setErrors({});
      })
      .catch((error) => console.error(error));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:3000/clients/${editClient.id}`, editClient)
      .then(() => {
        fetchClients();
        setEditClient(null);
      })
      .catch((error) => console.error(error));
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:3000/clients/${id}`)
      .then(() => fetchClients())
      .catch((error) => console.error(error));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Client Management</h2>

      {!editClient && (
        <form onSubmit={handleAddSubmit} style={{ marginBottom: '20px' }}>
          <TextField
            label="Name"
            name="name"
            value={newClient.name}
            onChange={handleInputChange}
            fullWidth
            style={{ marginBottom: '15px' }}
            error={!!errors.name}
            helperText={errors.name}
            required
          />
          <TextField
            label="Email"
            type="email"
            name="email"
            value={newClient.email}
            onChange={handleInputChange}
            fullWidth
            style={{ marginBottom: '15px' }}
            error={!!errors.email}
            helperText={errors.email}
            required
          />
          <TextField
            label="Phone"
            name="phone"
            value={newClient.phone}
            onChange={handleInputChange}
            fullWidth
            style={{ marginBottom: '15px' }}
            error={!!errors.phone}
            helperText={errors.phone}
            required
          />
          <TextField
            label="Address"
            name="address"
            value={newClient.address}
            onChange={handleInputChange}
            fullWidth
            style={{ marginBottom: '15px' }}
            error={!!errors.address}
            helperText={errors.address}
            required
          />
          <Button variant="contained" color="primary" type="submit">
            Add Client
          </Button>
        </form>
      )}

      {editClient && (
        <form onSubmit={handleEditSubmit} style={{ marginBottom: '20px' }}>
          <TextField
            label="Name"
            name="name"
            value={editClient.name}
            onChange={handleInputChange}
            fullWidth
            style={{ marginBottom: '15px' }}
            required
          />
          <TextField
            label="Email"
            type="email"
            name="email"
            value={editClient.email}
            onChange={handleInputChange}
            fullWidth
            style={{ marginBottom: '15px' }}
            required
          />
          <TextField
            label="Phone"
            name="phone"
            value={editClient.phone}
            onChange={handleInputChange}
            fullWidth
            style={{ marginBottom: '15px' }}
            required
          />
          <TextField
            label="Address"
            name="address"
            value={editClient.address}
            onChange={handleInputChange}
            fullWidth
            style={{ marginBottom: '15px' }}
            required
          />
          <Button variant="contained" color="success" type="submit" style={{ marginRight: '10px' }}>
            Save Changes
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => setEditClient(null)}>
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
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>{client.id}</TableCell>
                <TableCell>{client.name}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.phone}</TableCell>
                <TableCell>{client.address}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => setEditClient(client)}
                    style={{ marginRight: '10px' }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => handleDelete(client.id)}
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

export default ClientsPage;
