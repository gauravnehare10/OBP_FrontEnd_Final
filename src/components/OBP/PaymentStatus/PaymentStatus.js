import './PaymentStatus.css';
import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuthStore from "../../../utils/authStore";
import { useNavigate, useParams } from "react-router-dom";

const PaymentStatus = () => {
  const { getAccessToken } = useAuthStore();

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { bank } = useParams();
  const [paymentId, setPaymentId] = useState();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const navigate = useNavigate();

  const fetchPaymentStatus = async (paymentId) => {
    try {
      const token = getAccessToken("access_token");
      if (!token) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `http://localhost:8000/pisp/get-payment-status?bank=${bank}&payment_id=${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPaymentStatus(response.data);
    } catch (err) {
      setError("Failed to fetch payment status");
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    const handlePayment = async () => {
      try {
        const token = getAccessToken();
        if (!token) {
          alert("User not authenticated");
          return;
        }
  
        const response = await axios.get(
          `http://localhost:8000/pisp/create-payment-order?bank=${bank}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const response_data = response.data;
        setPaymentId(response_data);
        setMessage("Transaction successful!");
        fetchPaymentStatus(response_data);
      } catch (err) {
        setMessage("Transaction Failed!");
        setLoading(false);
      }
    };

    handlePayment();
  }, [bank, getAccessToken, paymentId]);

  

    const handlePrint = () => {
      window.print();
    };

  return (
    <div>
      { message ? (
        <>
            <h5 align="center">{message}</h5>
            <div className="payment-status-container">
            {loading && <p className="loading">Loading payment status...</p>}
            {error && <p className="error">{error}</p>}
            
            { paymentStatus && (
              <div id="receipt-container" className="payment-status-card">
                <h3>Payment Status</h3>
                <p><strong>Domestic Payment ID:</strong> {paymentStatus.Data?.DomesticPaymentId}</p>
                <p><strong>Status:</strong> {paymentStatus.Data?.Status}</p>
                <p><strong>Status Updated:</strong> {paymentStatus.Data?.StatusUpdateDateTime}</p>

                <h4>Initiation Details</h4>
                <p><strong>Amount:</strong> {paymentStatus.Data?.Initiation?.InstructedAmount?.Amount} {paymentStatus.Data?.Initiation?.InstructedAmount?.Currency}</p>

                <h4>Creditor Account</h4>
                <p><strong>Name:</strong> {paymentStatus.Data?.Initiation?.CreditorAccount?.Name}</p>
                <p><strong>Identification:</strong> {paymentStatus.Data?.Initiation?.CreditorAccount?.Identification}</p>

                <h4>Debtor Details</h4>
                <p><strong>Name:</strong> {paymentStatus.Data?.Debtor?.Name}</p>
                <p><strong>Identification:</strong> {paymentStatus.Data?.Debtor?.Identification}</p>
              </div>
            )}
            <button onClick={handlePrint} className="print-btn">Print Receipt</button>
          </div>
        </>
      ):(
        <>
          <h5 align="center">Processing transaction...</h5>
        </>
      )
      }
    </div>
  );
};

export default PaymentStatus;