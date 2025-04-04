import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './DirectDebits.css';
import useAuthStore from '../../../../../utils/authStore';

export default function DirectDebits({bank, accountId}) {
    const [directDebits, setDirectDebits] = useState([]);
    const [error, setError] = useState(null);
    const { getAccessToken } = useAuthStore();
  
    useEffect(() => {
        const access_token = getAccessToken();

        axios
            .get(`http://127.0.0.1:8000/${bank}/accounts/${accountId}/direct-debits`, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            })
            .then((response) => {
            setDirectDebits(response.data || []);
            })
            .catch((err) => {
            console.error(err);
            setError('Failed to fetch direct debits details.');
            });
    }, [bank, accountId, getAccessToken]);
  
    return (
      <div className="direct-debits-container">
        <h2 className="heading-main">Direct Debits</h2>
        {error ? (
          <p className="error-message">{error}</p>
        ) : directDebits.length > 0 ? (
          <div className="direct-debits-list">
            {directDebits.map((debit, index) => (
              <div className="direct-debit-card" key={index}>
                <h3>Direct Debit {index + 1}</h3>
                <p>
                  <strong>Mandate Identification:</strong> {debit.MandateIdentification}
                </p>
                <p>
                  <strong>Name:</strong> {debit.Name}
                </p>
                {debit.DirectDebitStatusCode && (
                  <p>
                    <strong>Status:</strong> {debit.DirectDebitStatusCode}
                  </p>
                )}
                {debit.PreviousPaymentDateTime && (
                  <div className="previous-payment">
                    <h4>Previous Payment Details:</h4>
                    <p>
                      <strong>Payment Date:</strong> {new Date(debit.PreviousPaymentDateTime).toLocaleString()}
                    </p>
                    <p>
                      <strong>Amount:</strong> {debit.PreviousPaymentAmount.Amount} {debit.PreviousPaymentAmount.Currency}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No direct debit data available.</p>
        )}
      </div>
    );
  }
  
