import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard/Dashboard';
import Navbar from './components/inc/Navbar/Navbar';
import Login from './components/auth/Login/Login';
import Register from './components/auth/Register/Register';
import AllTransactions from './components/AllTransactions/AllTransactions';
import PispPayments from './components/PispPayments/PispPayments';
import Callback from './components/Callback/Callback';
import BankAuth from './components/BankAuth/BankAuth';
import PaymentStatus from './components/PaymentStatus/PaymentStatus';
import Accounts from './components/Account/Account';
import Transactions from './components/Transactions/Transactions';
import PrivateRoute from './utils/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<Dashboard />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/register' element={<Register />}></Route>
        <Route path='/authorize' element={
          <PrivateRoute>
            <BankAuth />
          </PrivateRoute>
        }></Route>
        <Route path='/callback' element={
          <PrivateRoute>
            <Callback />
          </PrivateRoute>
        }></Route>
        <Route path='/transactions' element={
          <PrivateRoute>
            <AllTransactions />
          </PrivateRoute>
        }></Route>
        <Route path='/payments' element={
          <PrivateRoute>
            <PispPayments />
          </PrivateRoute>
        }></Route>
        <Route path='/:bank/payment-status' element={
          <PrivateRoute>
            <PaymentStatus />
          </PrivateRoute>
        }></Route>
        <Route path='/:bank/account/' element={
          <PrivateRoute>
            <Accounts />
          </PrivateRoute>
        }></Route>
        <Route path='/:bank/transaction/:accountId' element={
          <PrivateRoute>
            <Transactions />
          </PrivateRoute>
        }></Route>
      </Routes>
    </ BrowserRouter>
  );
}

export default App;
