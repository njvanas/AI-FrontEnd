import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [clients, setClients] = useState([]);
  const [newInvoice, setNewInvoice] = useState({
    clientId: '',
    amount: '',
    due_date: '',
    status: 'Pending',
  });
  const [editInvoice, setEditInvoice] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchInvoices();
    fetchClients();
  }, []);

  const fetchInvoices = () => {
    axios.get('http://localhost:3000/invoices')
      .then((response) => setInvoices(response.data))
      .catch((error) => console.error(error));
  };

  const fetchClients = () => {
    axios.get('http://localhost:3000/clients')
      .then((response) => setClients(response.data))
      .catch((error) => console.error(error));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editInvoice) {
      setEditInvoice({ ...editInvoice, [name]: value });
    } else {
      setNewInvoice({ ...newInvoice, [name]: value });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!newInvoice.clientId) newErrors.clientId = "Client is required";
    if (!newInvoice.amount || newInvoice.amount <= 0) newErrors.amount = "Amount must be greater than 0";
    if (!newInvoice.due_date) newErrors.due_date = "Due date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    axios.post('http://localhost:3000/invoices', {
      client: { id: newInvoice.clientId },
      amount: newInvoice.amount,
      due_date: newInvoice.due_date,
      status: newInvoice.status,
    })
      .then(() => {
        fetchInvoices();
        setNewInvoice({ clientId: '', amount: '', due_date: '', status: 'Pending' });
        setErrors({});
      })
      .catch((error) => console.error(error));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:3000/invoices/${editInvoice.id}`, {
      client: { id: editInvoice.clientId },
      amount: editInvoice.amount,
      due_date: editInvoice.due_date,
      status: editInvoice.status,
    })
      .then(() => {
        fetchInvoices();
        setEditInvoice(null);
      })
      .catch((error) => console.error(error));
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:3000/invoices/${id}`)
      .then(() => fetchInvoices())
      .catch((error) => console.error(error));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Invoice Management</h2>

      {!editInvoice && (
        <form onSubmit={handleAddSubmit} style={{ marginBottom: '20px' }}>
          <FormControl fullWidth style={{ marginBottom: '15px' }}>
            <InputLabel>Client</InputLabel>
            <Select
              value={newInvoice.clientId}
              name="clientId"
              onChange={handleInputChange}
              required
            >
              {clients.map((client) => (
                <MenuItem key={client.id} value={client.id}>
                  {client.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Amount"
            type="number"
            name="amount"
            value={newInvoice.amount}
            onChange={handleInputChange}
            fullWidth
            style={{ marginBottom: '15px' }}
            error={!!errors.amount}
            helperText={errors.amount}
            required
          />
          <TextField
            label="Due Date"
            type="date"
            name="due_date"
            value={newInvoice.due_date}
            onChange={handleInputChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            style={{ marginBottom: '15px' }}
            error={!!errors.due_date}
            helperText={errors.due_date}
            required
          />
          <FormControl fullWidth style={{ marginBottom: '15px' }}>
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={newInvoice.status}
              onChange={handleInputChange}
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Paid">Paid</MenuItem>
              <MenuItem value="Overdue">Overdue</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" color="primary" type="submit">
            Add Invoice
          </Button>
        </form>
      )}

      {editInvoice && (
        <form onSubmit={handleEditSubmit} style={{ marginBottom: '20px' }}>
          <FormControl fullWidth style={{ marginBottom: '15px' }}>
            <InputLabel>Client</InputLabel>
            <Select
              value={editInvoice.clientId}
              name="clientId"
              onChange={handleInputChange}
              required
            >
              {clients.map((client) => (
                <MenuItem key={client.id} value={client.id}>
                  {client.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Amount"
            type="number"
            name="amount"
            value={editInvoice.amount}
            onChange={handleInputChange}
            fullWidth
            style={{ marginBottom: '15px' }}
            required
          />
          <TextField
            label="Due Date"
            type="date"
            name="due_date"
            value={editInvoice.due_date}
            onChange={handleInputChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            style={{ marginBottom: '15px' }}
            required
          />
          <FormControl fullWidth style={{ marginBottom: '15px' }}>
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={editInvoice.status}
              onChange={handleInputChange}
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Paid">Paid</MenuItem>
              <MenuItem value="Overdue">Overdue</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" color="success" type="submit" style={{ marginRight: '10px' }}>
            Save Changes
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => setEditInvoice(null)}>
            Cancel
          </Button>
        </form>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>{invoice.id}</TableCell>
                <TableCell>{invoice.client.name}</TableCell>
                <TableCell>{invoice.amount}</TableCell>
                <TableCell>{invoice.due_date}</TableCell>
                <TableCell>{invoice.status}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => setEditInvoice(invoice)}
                    style={{ marginRight: '10px' }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => handleDelete(invoice.id)}
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

export default InvoicesPage;
