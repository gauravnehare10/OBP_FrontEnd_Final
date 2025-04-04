import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import "./AccountNavbar.css";

export default function AccountNavbar() {
  const { bank, accountId } = useParams();

  const navItems = [
    { path: 'overview', label: 'Overview' },
    { path: 'transactions', label: 'Transactions' },
    { path: 'beneficiaries', label: 'Beneficiaries' },
    { path: 'balances', label: 'Balances' },
    { path: 'direct-debits', label: 'Direct Debits' },
    { path: 'standing-orders', label: 'Standing Orders' },
    { path: 'product', label: "Product"},
    { path: 'scheduled-payments', label: "Scheduled Payments" }
  ];

  return (
    <nav className="account-navbar">
      <ul>
        {navItems.map((item) => (
          <li key={item.path}>
            <NavLink 
              to={`/${bank}/account/${accountId}/${item.path}`}
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}