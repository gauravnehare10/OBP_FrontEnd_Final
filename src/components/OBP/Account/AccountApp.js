import React from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import AccountNavbar from '../Account/AccountNavbar/AccountNavbar';
import Account from './Pages/Overview/Account';
import Transactions from './Pages/Transactions/Transactions';
import Transaction from './Pages/Transaction/Transaction';
import Beneficiaries from './Pages/Beneficiaries/Beneficiaries';
import Balances from './Pages/Balances/Balances';
import DirectDebits from './Pages/DirectDebits/DirectDebits';
import StandingOrders from './Pages/StandingOrders/StandingOrders';
import './AccountApp.css';
import Product from './Pages/Product/Product';
import ScheduledPayments from './Pages/ScheduledPayments/ScheduledPayments';

export default function AccountApp() {
  const { bank, accountId } = useParams();

  return (
    <div className="account-container">
      <AccountNavbar />
      <div className="account-content">
        <div className="account-content-inner">
          <Routes>
            <Route path='/' element={<Navigate to={`/${bank}/account/${accountId}/overview`} />} />
            <Route path='/overview' element={<Account bank={bank} accountId={accountId} />} />
            <Route path='/transactions' element={<Transactions bank={bank} accountId={accountId} />} />
            <Route path='/transactions/:transactionId' element={<Transaction bank={bank} accountId={accountId} />} />
            <Route path='/beneficiaries' element={<Beneficiaries bank={bank} accountId={accountId} />} />
            <Route path='/balances' element={<Balances bank={bank} accountId={accountId} />} />
            <Route path='/direct-debits' element={<DirectDebits bank={bank} accountId={accountId} />} />
            <Route path='/standing-orders' element={<StandingOrders bank={bank} accountId={accountId} />} />
            <Route path='/product' element={<Product bank={bank} accountId={accountId} />} />
            <Route path='/scheduled-payments' element={<ScheduledPayments bank={bank} accountId={accountId} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}