import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './StandingOrders.css';
import useAuthStore from '../../../../../utils/authStore';
import { useNavigate } from 'react-router-dom';

export default function StandingOrders({bank, accountId}) {
  const [standingOrders, setStandingOrders] = useState([]);
  const [error, setError] = useState(null);
  const { getAccessToken } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const access_token = getAccessToken();

    axios
      .get(`http://127.0.0.1:8000/${bank}/accounts/${accountId}/standing-orders`, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
      })
      .then((response) => {
        setStandingOrders(response.data || []);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to fetch standing orders.');
      });
  },[getAccessToken, bank, accountId]);

  return (
    <div className="standing-order-container">
      <button className="back-btn" onClick={ () => navigate(-1) }>Go Back</button>
      <h2 className="heading-main">Standing Orders</h2>
      {error ? (
        <p className="error-message">{error}</p>
      ) : standingOrders.length > 0 ? (
        <div className="standing-orders-list">
          {standingOrders.map((order, index) => (
            <div className="standing-order-card" key={index}>
              <h3>Standing Order {index + 1}</h3>
              <p>
                <strong>Frequency:</strong> {order.Frequency}
              </p>
              {order.Reference && (
                <p>
                  <strong>Reference:</strong> {order.Reference}
                </p>
              )}
              {order.FirstPaymentDateTime && (
                <p>
                  <strong>First Payment Date:</strong>{' '}
                  {new Date(order.FirstPaymentDateTime).toLocaleString()}
                </p>
              )}
              {order.NextPaymentDateTime && (
                <p>
                  <strong>Next Payment Date:</strong>{' '}
                  {new Date(order.NextPaymentDateTime).toLocaleString()}
                </p>
              )}
              {order.FinalPaymentDateTime && (
                <p>
                  <strong>Final Payment Date:</strong>{' '}
                  {new Date(order.FinalPaymentDateTime).toLocaleString()}
                </p>
              )}
              {order.StandingOrderStatusCode && (
                <p>
                  <strong>Status:</strong> {order.StandingOrderStatusCode}
                </p>
              )}
              <div className="payment-amounts">
                {order.FirstPaymentAmount && (
                  <p>
                    <strong>First Payment Amount:</strong>{' '}
                    {order.FirstPaymentAmount.Amount}{' '}
                    {order.FirstPaymentAmount.Currency}
                  </p>
                )}
                {order.NextPaymentAmount && (
                  <p>
                    <strong>Next Payment Amount:</strong>{' '}
                    {order.NextPaymentAmount.Amount}{' '}
                    {order.NextPaymentAmount.Currency}
                  </p>
                )}
                {order.FinalPaymentAmount && (
                  <p>
                    <strong>Final Payment Amount:</strong>{' '}
                    {order.FinalPaymentAmount.Amount}{' '}
                    {order.FinalPaymentAmount.Currency}
                  </p>
                )}
              </div>
              <div className="creditor-account">
                <h4>Creditor Account:</h4>
                <p>
                  <strong>Scheme Name:</strong> {order.CreditorAccount.SchemeName}
                </p>
                <p>
                  <strong>Identification:</strong>{' '}
                  {order.CreditorAccount.Identification}
                </p>
                {order.CreditorAccount.Name && (
                  <p>
                    <strong>Name:</strong> {order.CreditorAccount.Name}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No standing orders available.</p>
      )}
    </div>
  );
}
