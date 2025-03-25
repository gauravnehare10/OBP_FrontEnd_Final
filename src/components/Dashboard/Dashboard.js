import React, { useRef, useState, useEffect } from "react";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import axios from "axios";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../utils/authStore";
import Home from "../inc/Home/Home";

Chart.register(...registerables);

const Dashboard = () => {
  const [accounts, setAccounts] = useState([]);
  const [latestTransactions, setLatestTransactions] = useState(null);
  const [barData, setBarData] = useState(null);
  const [lineData, setLineData] = useState(null);
  const [doughnutData, setDoughnutData] = useState(null);
  
  const { isAuthenticated, getAccessToken } = useAuthStore();

  const bankRef = useRef(null);

  const navigate = useNavigate();

  const scrollLeft = () => {
    if (bankRef.current) {
      bankRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (bankRef.current) {
      bankRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  useEffect(() => {
    if (isAuthenticated){
    const fetchChartData = async () => {
      try {
        const access_token = getAccessToken();
        const response = await axios.get(
          `http://127.0.0.1:8000/dashboard`,
          {
            headers: {Authorization: `Bearer ${access_token}`}
          }
        );
        const data = response.data;

        setAccounts(data.Accounts);
        setBarData(data.TransactionOverview);
        setLineData(data.MonthlyTrends);
        setDoughnutData(data.BankTransactions);
        setLatestTransactions(data.LatestTransactions);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchChartData();
  }}, [isAuthenticated, getAccessToken]);

  return (
    <div className="dashboard-container">
      {isAuthenticated?(
        <>
        <div className="bank-accounts-details">
          <div className="bank-details" ref={bankRef}>
            <div>
              <h1>My Accounts</h1>
            </div>
            {accounts.length > 0 ? (
              accounts.map((account, index) => (
                <div key={account.AccountId}
                onClick={() => navigate(`/${account.bank}/account/?accountId=${account.AccountId}`)}
                style={{ cursor: "pointer" }}
                className="bank-card">
                  <h3>{account.bank}</h3>
                  <span>{account.Nickname}</span>
                  <span>**** {account.Account[0].Identification.slice(-4)}</span>
                  <span>{account.AccountType} ({account.AccountSubType})</span>
                </div>
              ))
            ) : (
              <>
                <p>No authorized bank accounts found.</p>
                
              </>
            )}
          </div>
          <div className="auth-btn">
            <button className="bank-auth-btn" onClick={()=>navigate("/authorize")}>Add your bank</button>
          </div>
        </div>
      <span className="scroll-btn left" onClick={scrollLeft}>‹</span>
      <span className="scroll-btn right" onClick={scrollRight}>›</span>

      <div className="grid-container">
        <div className="latest-transactions">
          <h2>Latest Transactions</h2>
          <table className="transaction-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Bank</th>
              </tr>
            </thead>
            <tbody>
              {latestTransactions?.map((tx) => (
                <tr key={tx.TransactionId}>
                  <td>{new Date(tx.Date).toLocaleDateString()}</td>
                  <td>£{tx.Amount}</td>
                  <td style={{ color: tx.Type.toLowerCase() === "debit" ? "red" : "green" }}>{tx.Type}</td>
                  <td>{tx.Bank}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="chart-container">
          <h2>Transaction Overview</h2>
          <div className="chart-wrapper">
            {barData ? <Bar data={barData} options={chartOptions} /> : <p>Loading...</p>}
          </div>
        </div>

        <div className="chart-container">
          <h2>Monthly Trend</h2>
          <div className="chart-wrapper">
            {lineData ? <Line data={lineData} options={chartOptions} /> : <p>Loading...</p>}
          </div>
        </div>
        
        <div className="chart-container">
          <h2>Bank Transactions</h2>
          <div className="chart-wrapper">
            {doughnutData ? <Doughnut data={doughnutData} options={chartOptions} /> : <p>Loading...</p>}
          </div>
        </div>
      </div>
      </>
      ):(
        <Home />
      )}
      
    </div>
  );
};

export default Dashboard;
