import React from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <nav>
      <ul>
        <li><Link to="/stock">Stock</Link></li>
        <li><Link to="/clients">Clients</Link></li>
        <li><Link to="/suppliers">Suppliers</Link></li>
        <li><Link to="/bills">Bills</Link></li>
        <li><Link to="/invoices">Invoices</Link></li>
      </ul>
    </nav>
  );
}

export default NavBar;
