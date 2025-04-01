import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './Callback.css'
import useAuthStore from "../../../utils/authStore";

const Callback = () => {
  const navigate = useNavigate();
  const hasFetched = useRef(false);
  const { getAccessToken } = useAuthStore();

  useEffect(() => {
    if (hasFetched.current) 
        return;
    hasFetched.current = true;

    const fetchData = async () => {
      // Parse the hash fragment
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const code = hashParams.get("code");
      const idToken = hashParams.get("id_token");
      const state = hashParams.get("state");
      const bank = localStorage.getItem("bank_name");

      const access_token = getAccessToken();

      if (!bank) {
        console.error("Bank name not found in localStorage");
        return;
      }

      if (code) {
        try {
          const response = await axios.post(
            `http://127.0.0.1:8000/exchange-token?bank=${bank}`,
            {
              code,
              idToken,
              state,
            },
            {
              headers: {
                Authorization: `Bearer ${access_token}`,
              },
            }
          );
          if (state === "aisp") {
            navigate("/");
          } else if(state === "pisp") {
            navigate(`/${bank}/payment-status/`)}
          
          } catch (error) {
            console.error("Token exchange failed:", error);
            navigate('/');
          }
        } else {
          console.error("Authorization code not found in URL");
          navigate('/');
        }
      };

    fetchData();
  }, [navigate, getAccessToken]);

  return <div className="callback-container">Processing authorization...</div>;
};

export default Callback;