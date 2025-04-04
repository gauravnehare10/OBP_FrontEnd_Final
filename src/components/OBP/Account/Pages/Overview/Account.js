import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAuthStore from "../../../../../utils/authStore";
import "./Account.css";

export default function Account({ bank, accountId }) {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getAccessToken } = useAuthStore();

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
        console.log(response.data);
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

  if (loading) return <div className="loading">Loading account details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!account) return <div className="no-account">No account found</div>;

  return (
    <div className="account-container">
      <h2>Account Details</h2>
      
      <div className="account-card">
        <div className="account-header">
          <h3>{account.Nickname || account.AccountDetails[0]?.Name}</h3>
          <span className={`account-type ${account.AccountSubType.toLowerCase()}`}>
            {account.AccountSubType}
          </span>
        </div>

        <div className="account-details">
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
          
          <div className="detail-row">
            <span className="detail-label">Description:</span>
            <span className="detail-value">{account.Description}</span>
          </div>
        </div>
      </div>
    </div>
  );
}