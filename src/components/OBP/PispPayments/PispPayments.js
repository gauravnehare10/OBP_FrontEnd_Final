import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../../utils/authStore";
import "./PispPayments.css";

export default function PispPayments() {
    const { isAuthenticated, getAccessToken } = useAuthStore();

    const navigate = useNavigate();
    const [banks, setBanks] = useState([]);
    const [selectedBank, setSelectedBank] = useState("");
    const [beneficiaries, setBeneficiaries] = useState([]);
    
    const [selectedBeneficiary, setSelectedBeneficiary] = useState("");

    const [amount, setAmount] = useState("");
    const [schemeName, setSchemeName] = useState("");
    const [identification, setIdentification] = useState("");
    const [name, setName] = useState("");
    const [secIdentif, setSecIdentif] = useState("");

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            const fetchAuthorizedBanks = async () => {
                try {
                  const access_token = getAccessToken();
                  const response = await axios.get("http://127.0.0.1:8000/get-banks", {
                    headers: { Authorization: `Bearer ${access_token}`},
                  });
            
                  if (response.data.length > 0) {
                    setBanks(response.data);
                  }
                } catch (error) {
                  console.error("Error fetching authorized banks:", error);
                }
              };

        fetchAuthorizedBanks();
    }
    }, [isAuthenticated, getAccessToken]);

    useEffect(() => {
        if (selectedBank) {
            console.log(selectedBank);
            const fetchAllBeneficiaries = async () => {
                try {
                    const access_token = getAccessToken();
                    const response = await axios.get(`http://127.0.0.1:8000/${selectedBank}/beneficiaries`, {
                        headers: { Authorization: `Bearer ${access_token}` }
                    });
    
                    setBeneficiaries(response.data);
                } catch (error) {
                    console.error("Error fetching beneficiaries:", error);
                }
            };
    
            fetchAllBeneficiaries();
        }
    }, [selectedBank, getAccessToken]);


    const handleSelectBeneficiary = (beneficiaryId) => {
        setSelectedBeneficiary(beneficiaryId);
        const selected = beneficiaries.find((b) => b.BeneficiaryId === beneficiaryId);
        if (selected) {
            setSchemeName(selected.CreditorAccount?.SchemeName || "");
            setIdentification(selected.CreditorAccount?.Identification || "");
            setName(selected.CreditorAccount?.Name || "");
            setSecIdentif(selected.CreditorAgent?.Identification || "");
        }
    };

    const handleTransfer = async () => {
        if (!amount || !schemeName || !identification) {
            alert("Please enter the amount and creditor's details or select a beneficiary.");
            return;
        }

        setLoading(true);
        const accountDetails = {
            amount,
            schemeName,
            identification,
            name,
            secIdentif,
        };

        try {
            const access_token = getAccessToken();
            const response = await axios.post(
                `http://127.0.0.1:8000/pisp/authorize?bank=${selectedBank}`,
                accountDetails,
                {
                    headers: { Authorization: `Bearer ${access_token}` },
                    "Content-Type": "application/json"
                }
            );

            if (response.data) {
                localStorage.setItem("bank_name", selectedBank);
                window.location.href = response.data;
            } else {
                console.error("Authorization URL not received from backend.");
              }
            } catch (error) {
              console.error("Error redirecting to authorization:", error.response?.data || error.message);
            } finally {
                setLoading(false);
            }
    };

    return (
        <div className="transfer-money-container">
            <div className="paymentbox-left">
                <h2 align="center">Payments</h2>
                <select className="transfer-money-input" value={selectedBank} onChange={(e) => setSelectedBank(e.target.value)}>
                    <option value="">-- Select Bank --</option>
                    {banks.map((bank) => (
                        <option key={bank} value={bank}>{bank}</option>
                    ))}
                </select>
                { selectedBank && (
                    <>
                    <h3>Select Beneficiary</h3>
                    <select className="transfer-money-input" value={selectedBeneficiary} onChange={(e) => handleSelectBeneficiary(e.target.value)}>
                        <option value="">-- Select a Beneficiary --</option>
                        {beneficiaries.map((beneficiary) => (
                            <option key={beneficiary.BeneficiaryId} value={beneficiary.BeneficiaryId}>
                                {beneficiary.CreditorAccount?.Name} ({beneficiary.CreditorAccount?.Identification})
                            </option>
                        ))}
                    </select>
                    </>
                )}
            </div>
            <div className="paymentbox-right">
                <h3>Creditor's Account Details</h3>
                <table className="transfer-money-table">
                    <tbody>
                        <tr>
                            <th>Scheme Name</th>
                            <td><input className="transfer-money-input" type="text" placeholder="Scheme Name" required value={schemeName} onChange={(e)=>setSchemeName(e.target.value)} /></td>
                        </tr>
                        <tr>
                            <th>Identification</th>
                            <td><input className="transfer-money-input" type="text" placeholder="Identification" required value={identification} onChange={(e)=>setIdentification(e.target.value)} /></td>
                        </tr>
                        <tr>
                            <th>Name</th>
                            <td><input className="transfer-money-input" type="text" placeholder="Name" required value={name} onChange={(e)=>setName(e.target.value)} /></td>
                        </tr>
                        <tr>
                            <th>Secondary Identification</th>
                            <td><input className="transfer-money-input" type="text" placeholder="Secondary Identification" value={secIdentif} onChange={(e)=>setSecIdentif(e.target.value)} /></td>
                        </tr>
                        <tr>
                            <th>Amount</th>
                            <td><input className="transfer-money-input" type="number" placeholder="Amount" required value={amount} onChange={(e) => setAmount(e.target.value)} /></td>
                        </tr>
                    </tbody>
                </table>
                <input type="submit" className="transfer-money-btn" onClick={handleTransfer} value={ loading ? "Redirecting..." : "Make a payment"} />
                <button className="cancel-btn" onClick={ () => navigate(-1) } style={{width: "100%", fontSize: "0.9rem"}}>Cancel</button>
            </div>
        </div>
    );
}
