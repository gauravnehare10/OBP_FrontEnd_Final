import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import useAuthStore from "../../../utils/authStore";
import { useParams, useSearchParams } from 'react-router-dom';
import './Account.css';
import AccountNav from "../../inc/AccountNav/AccountNav";

const Accounts = () => {
  const [showBalances, setShowBalances] = useState(false);
  const [accountData, setAccountData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { bank } = useParams();
  const [searchParams] = useSearchParams();
  const accountId = searchParams.get('accountId');
  const { getAccessToken } = useAuthStore();

  const balanceRef = useRef(null); // Reference for balance section

  const toggleBalances = () => {
    setShowBalances(prev => !prev);
  };

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        const access_token = getAccessToken();
        const response = await axios.get(
          `http://localhost:8000/${bank}/accounts/${accountId}`,
          {
            headers: { Authorization: `Bearer ${access_token}` },
          }
        );
        setAccountData(response.data);
      } catch (err) {
        setError("Failed to fetch account data");
      } finally {
        setLoading(false);
      }
    };
    fetchAccountData();
  }, [bank, accountId]);

  useEffect(() => {
    if (showBalances && balanceRef.current) {
      balanceRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [showBalances]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
    <div className="account-container">
        {/* Account Header */}
        <div className="account-header">
            <h2>{accountData.Nickname}'s Account</h2>
            <p className="bank-name">{accountData.Bank}</p>
        </div>

        {/* Account Details */}
        <div className="account-details">
            <p><strong>Type:</strong> {accountData.AccountType} ({accountData.AccountSubType})</p>
            <p><strong>Currency:</strong> {accountData.Currency}</p>
            <p><strong>Description:</strong> {accountData.Description}</p>
            <div className="account-number">
              <p><strong>Account No:</strong> {accountData.AccountDetails[0].Identification}</p>
            </div>
            <div ref={balanceRef} className={`balances ${showBalances ? "show" : "hide"}`}>
            {accountData.Balances.map((balance, index) => (
            <div key={index} className="balance-card">
                <p><strong>Type:</strong> {balance.Type}</p>
                <p><strong>Amount:</strong> {balance.Amount} {balance.Currency}</p>
            </div>
            ))}
        </div>
        </div>

        {/* Toggle Balance Button */}
        <button className="toggle-btn" onClick={toggleBalances}>
            {showBalances ? "Hide Balances" : "View Balances"}
        </button>
        
        {/* Balance Section */}
        
    </div>
    </>
  );
};

export default Accounts;
