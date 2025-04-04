import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAuthStore from "../../../../../utils/authStore";
import "./Beneficiaries.css";

export default function Beneficiaries({ bank, accountId }) {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getAccessToken } = useAuthStore();

  useEffect(() => {
    const fetchBeneficiaries = async () => {
      try {
        const access_token = getAccessToken();
        const response = await axios.get(
          `http://localhost:8000/${bank}/accounts/${accountId}/beneficiaries`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        setBeneficiaries(response.data || []);
      } catch (err) {
        setError('Failed to fetch beneficiaries. Please try again later.');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBeneficiaries();
  }, [bank, accountId, getAccessToken]);

  if (loading) return <div className="loading">Loading beneficiaries...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="beneficiaries-container">
      <h2>Beneficiaries</h2>
      
      <div className="table-responsive">
        <table className="beneficiaries-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Type</th>
              <th>Account Details</th>
              <th>Agent Details</th>
              <th>Reference</th>
            </tr>
          </thead>
          <tbody>
            {beneficiaries.length > 0 ? (
              beneficiaries.map((beneficiary, index) => (
                <tr key={beneficiary.BeneficiaryId}>
                  <td>{index + 1}</td>
                  <td>{beneficiary.BeneficiaryType}</td>
                  <td>
                    <div>
                      <strong>Scheme:</strong> {beneficiary.CreditorAccount.SchemeName}
                    </div>
                    <div>
                      <strong>Number:</strong> {beneficiary.CreditorAccount.Identification}
                    </div>
                    {beneficiary.CreditorAccount.Name && (
                      <div><strong>Name:</strong> {beneficiary.CreditorAccount.Name}</div>
                    )}
                  </td>
                  <td>
                    {beneficiary.CreditorAgent ? (
                      <>
                        <div>
                          <strong>Scheme:</strong> {beneficiary.CreditorAgent.SchemeName}
                        </div>
                        <div>
                          <strong>ID:</strong> {beneficiary.CreditorAgent.Identification}
                        </div>
                        <div>
                          <strong>Name:</strong> {beneficiary.CreditorAgent.Name}
                        </div>
                      </>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td>{beneficiary.Reference || 'N/A'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data">No beneficiaries found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}