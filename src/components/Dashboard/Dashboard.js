import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";
import useAuthStore from "../../utils/authStore";
import Home from "../inc/Home/Home";
import BankAccounts from "./Include/BankAccounts";
import LatestTransactions from "./Include/LatestTransactions";
import ChartContainer from "./Include/ChartContainer";

const Dashboard = () => {
  const [accounts, setAccounts] = useState([]);
  const [latestTransactions, setLatestTransactions] = useState(null);
  const [barData, setBarData] = useState(null);
  const [lineData, setLineData] = useState(null);
  const [doughnutData, setDoughnutData] = useState(null);
  
  const { isAuthenticated, getAccessToken } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      const fetchChartData = async () => {
        try {
          const access_token = getAccessToken();
          const response = await axios.get(`http://127.0.0.1:8000/dashboard`, {
            headers: { Authorization: `Bearer ${access_token}` }
          });
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
    }
  }, [isAuthenticated, getAccessToken]);

  return (
    <div className="dashboard-container">
      {isAuthenticated ? (
        <>
          <div className="user-bank-accounts">
            <BankAccounts accounts={accounts} />
          </div>
          
          <div className="grid-container">
            <LatestTransactions transactions={latestTransactions} />
            
            <ChartContainer 
              title="Transaction Overview" 
              data={barData} 
              chartType="bar" 
            />
            
            <ChartContainer 
              title="Monthly Trend" 
              data={lineData} 
              chartType="line" 
            />
            
            <ChartContainer 
              title="Bank Transactions" 
              data={doughnutData} 
              chartType="doughnut" 
            />
          </div>
        </>
      ) : (
        <Home />
      )}
    </div>
  );
};

export default Dashboard;