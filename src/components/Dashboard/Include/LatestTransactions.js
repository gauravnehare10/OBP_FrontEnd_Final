import React from "react";

const LatestTransactions = ({ transactions }) => {
  return (
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
          {transactions?.map((tx) => (
            <tr key={tx.TransactionId}>
              <td>{new Date(tx.Date).toLocaleDateString()}</td>
              <td>£{tx.Amount}</td>
              <td style={{ color: tx.Type.toLowerCase() === "debit" ? "red" : "green" }}>
                {tx.Type}
              </td>
              <td>{tx.Bank}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LatestTransactions;