import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";

const BankAccounts = ({ accounts }) => {
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

  return (
    <div className="bank-accounts-details">
      <div>
          <h2 align="center">Accounts</h2>
      </div>
      <div className="bank-details" ref={bankRef}>
        {accounts.length > 0 ? (
          accounts.map((account, index) => (
            <div
              key={account.AccountId}
              onClick={() => navigate(`/${account.bank}/account/?accountId=${account.AccountId}`)}
              style={{ cursor: "pointer" }}
              className="bank-card"
            >
              <h3>{account.bank}</h3>
              <span>{account.Nickname}</span>
              <span>**** {account.Account[0].Identification.slice(-4)}</span>
              <span>
                {account.AccountType} ({account.AccountSubType})
              </span>
            </div>
          ))
        ) : (
          <>
            <p>No authorized bank accounts found.</p>
          </>
        )}
      </div>
      <span className="scroll-btn left" onClick={scrollLeft}>
        ‹
      </span>
      <span className="scroll-btn right" onClick={scrollRight}>
        ›
      </span>
    </div>
  );
};

export default BankAccounts;