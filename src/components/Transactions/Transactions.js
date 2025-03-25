import React, { useEffect, useState } from "react";
import axios from "axios";
import "../AllTransactions/AllTransactions.css";
import { useParams, Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../utils/authStore";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const { bank, accountId } = useParams();
  const { getAccessToken } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const access_token = getAccessToken();
    axios
      .get(`http://localhost:8000/${bank}/transactions/${accountId}`,
        {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        }
      )
      .then((response) => {
        const sortedTransactions = response.data.sort(
          (a, b) => new Date(b.BookingDateTime) - new Date(a.BookingDateTime)
        );
        setTransactions(sortedTransactions);
      })
      .catch((error) => {
        console.error("Error fetching transactions:", error);
      });
  }, [accountId, bank, getAccessToken]);

  return (
    <div className="transactions-container">
      <button className="back-btn" onClick={ () => navigate(-1) }>Go Back</button>
      <h2>Transactions</h2>
      <table className="transactions-table">
        <thead>
          <tr>
            <th>Booking Date</th>
            <th>Amount</th>
            <th>Currency</th>
            <th>Balance</th>
            <th>Status</th>
            <th>Bank</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.TransactionId}>
              <td>{new Date(transaction.BookingDateTime).toLocaleString()}</td>
              <td>{transaction.Amount.Amount}</td>
              <td>{transaction.Amount.Currency}</td>
              <td>{transaction.Balance.Amount.Amount}</td>
              <td>{transaction.Status}</td>
              <td>{transaction.bank}</td>
              <td>
                <Link
                  to={`/${bank}/accounts/${accountId}/transactions/${transaction.TransactionId}`}
                  className="view-details-button"
                >
                  View Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Transactions;
