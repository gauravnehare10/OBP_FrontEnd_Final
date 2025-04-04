import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ScheduledPayments.css';
import useAuthStore from '../../../../../utils/authStore';

export default function ScheduledPayments({bank, accountId}) {
  const [scheduledPayments, setScheduledPayments] = useState([]);
  const [error, setError] = useState(null);
  const { getAccessToken } = useAuthStore();

  useEffect(() => {
    const access_token = getAccessToken();

    axios
      .get(`http://127.0.0.1:8000/${bank}/accounts/${accountId}/scheduled-payments`, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
      })
      .then((response) => {
        setScheduledPayments(response.data || []);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to fetch scheduled payments.');
      });
  }, [bank, accountId, getAccessToken]);


  return (
    <div className="scheduled-payments-container">
      <h1 className="heading-main">Scheduled Payments</h1>
      {error ? (
        <p className="error-message">{error}</p>
      ) : scheduledPayments.length > 0 ? (
        <div className="scheduled-payments-list">
          {scheduledPayments.map((payment, index) => (
            <div className="scheduled-payment-card" key={index}>
              <h3>Scheduled Payment {index + 1}</h3>
              <p>
                <strong>Account ID:</strong> {payment.AccountId}
              </p>
              <p>
                <strong>Scheduled Payment ID:</strong> {payment.ScheduledPaymentId}
              </p>
              <p>
                <strong>Instructed Amount:</strong> {payment.InstructedAmount?.Amount}{' '}
                {payment.InstructedAmount?.Currency}
              </p>
              <p>
                <strong>Creditor Account:</strong> {payment.CreditorAccount?.Name}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>No scheduled payments available.</p>
      )}
    </div>
  );
}
