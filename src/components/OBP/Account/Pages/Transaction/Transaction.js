import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useAuthStore from '../../../../../utils/authStore';
import axios from 'axios';
import './Transaction.css';
import { useNavigate } from 'react-router-dom';

export default function Transaction({bank, accountId}) {
    const { transactionId } = useParams();
    const { getAccessToken } = useAuthStore();
    const [transaction, setTransaction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
    useEffect(() => {
        const access_token = getAccessToken();
        setLoading(true);
        axios
          .get(`http://localhost:8000/${bank}/accounts/${accountId}/transactions/${transactionId}`,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            }
          )
          .then((response) => {
            setTransaction(response.data);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching transactions:", error);
            setError('Failed to fetch transaction details');
            setLoading(false);
          });
      }, [getAccessToken, accountId, bank, transactionId]);

  if (loading) {
    return <div className="transaction-loading">Loading transaction details...</div>;
  }

  if (error) {
    return <div className="transaction-error">{error}</div>;
  }

  if (!transaction) {
    return <div className="transaction-not-found">Transaction not found</div>;
  }

  return (
    <div className="transaction-container">
      <button className="back-btn" onClick={ () => navigate(-1) }>Go Back</button>
      <h2 className="transaction-header">Transaction Details</h2>
      
      <div className="transaction-card">
        <div className="transaction-section">
          <h2>Basic Information</h2>
          <div className="transaction-row">
            <span className="transaction-label">Bank:</span>
            <span className="transaction-value">{bank}</span>
          </div>
          <div className="transaction-row">
            <span className="transaction-label">Booking Date:</span>
            <span className="transaction-value">
              {new Date(transaction.BookingDateTime).toLocaleString()}
            </span>
          </div>
          <div className="transaction-row">
            <span className="transaction-label">Status:</span>
            <span className="transaction-value">{transaction.Status}</span>
          </div>
        </div>

        <div className="transaction-section">
          <h2>Amount Details</h2>
          <div className="transaction-row">
            <span className="transaction-label">Amount:</span>
            <span className="transaction-value">
              {transaction.Amount.Amount} {transaction.Amount.Currency}
            </span>
          </div>
          <div className="transaction-row">
            <span className="transaction-label">Type:</span>
            <span className="transaction-value">
              {transaction.CreditDebitIndicator === 'Credit' ? 'Credit' : 'Debit'}
            </span>
          </div>
          {transaction.Balance && (
            <div className="transaction-row">
              <span className="transaction-label">Balance:</span>
              <span className="transaction-value">
                {transaction.Balance.Amount?.Amount} {transaction.Balance.Amount?.Currency}
              </span>
            </div>
          )}
        </div>

        <div className="transaction-section">
          <h2>Additional Information</h2>
          <div className="transaction-row">
            <span className="transaction-label">Description:</span>
            <span className="transaction-value">{transaction.TransactionInformation}</span>
          </div>
          <div className="transaction-row">
            <span className="transaction-label">Transaction Code:</span>
            <span className="transaction-value">
              {transaction.ProprietaryBankTransactionCode?.Code}
            </span>
          </div>
          <div className="transaction-row">
            <span className="transaction-label">User ID:</span>
            <span className="transaction-value">{transaction.UserId}</span>
          </div>
        </div>
      </div>
    </div>
  );
}