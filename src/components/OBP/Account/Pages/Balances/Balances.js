import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAuthStore from "../../../../../utils/authStore";
import "./Balances.css";
import { useNavigate } from 'react-router-dom';

export default function Balances({ bank, accountId }) {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBalances, setShowBalances] = useState(false);
  const { getAccessToken } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const access_token = getAccessToken();
        const response = await axios.get(
          `http://localhost:8000/${bank}/accounts/${accountId}`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        setAccount(response.data);
      } catch (err) {
        setError('Failed to fetch account details. Please try again later.');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAccount();
  }, [bank, accountId, getAccessToken]);

  const formatBalance = (amount) => {
    return parseFloat(amount).toLocaleString('en-GB', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const toggleBalances = () => {
    setShowBalances(!showBalances);
  };

  if (loading) return <div className="loading">Loading account details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!account) return <div className="no-account">No account found</div>;

  return (
    <div className="account-container">
      <button className="back-btn" onClick={ () => navigate(-1) }>Go Back</button>
      <h2 align="center">Balance Information</h2>
      
      <div className="account-card">
        <div className="account-header">
          <div>
            <h3>{account.Nickname}</h3>
            <p className="account-description">{account.Description}</p>
          </div>
          <span className={`account-type ${account.AccountSubType.toLowerCase()}`}>
            {account.AccountSubType}
          </span>
        </div>

        <div className="account-details-grid">
          <div className="detail-section">
            <h4>Account Information</h4>
            <div className="detail-row">
              <span className="detail-label">Account Number:</span>
              <span className="detail-value">{account.AccountDetails[0]?.Identification}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Bank:</span>
              <span className="detail-value">{account.Bank}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Account Type:</span>
              <span className="detail-value">{account.AccountType}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Currency:</span>
              <span className="detail-value">{account.Currency}</span>
            </div>
          </div>

          <div className="detail-section">
            <div className="balances-header">
              <h4>Balances</h4>
              <button onClick={toggleBalances} className="toggle-balances">
                {showBalances ? 'Hide' : 'Show'} Details
              </button>
            </div>
            
            {showBalances && account.Balances?.map((balance, index) => (
              <div key={index} className="balance-row">
                <div className="balance-type">{balance.Type}</div>
                <div className={`balance-amount ${balance.CreditDebitIndicator.toLowerCase()}`}>
                  {account.Currency} {formatBalance(balance.Amount)}
                </div>
                <div className="balance-date">
                  {new Date(balance.DateTime).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}