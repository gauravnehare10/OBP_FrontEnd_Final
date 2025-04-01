import React from 'react';
import "./Mortgage.css";
import { useNavigate } from 'react-router-dom';

export default function Mortgage() {
  const navigate = useNavigate();
  return (
    <div className='main-mortgage-container'>
      <div className="aai-financials-info">
        <h2>Welcome to AAI Financials</h2>
        <div className='aai-financials-details'>
          <p>
            Where we prioritize your financial journey with trust, transparency, and expertise.
          </p>
          <p>
            As independent mortgage advisors, we have a holistic view of the mortgage market, giving us access to a wide range of lenders and products. This allows us to tailor solutions that best fit your unique needs.
          </p>
          <p>
            Whether you're buying your first home, remortgaging, or exploring investment opportunities, we are here to secure the best deal for you. Our commitment is to guide you every step of the way, making the process smooth and stress-free while ensuring you achieve your homeownership goals with confidence. Let's build your future together.
          </p>
        </div>
      </div>
      <div className="add-mortgage-details">
        <div className="navigation-buttons">
          <button className="edit-resp" onClick={()=>navigate("/mortgage/add-details")}>Add Details</button>
          <button className="view-resp">View Details</button>
        </div>
      </div>
    </div>
  );
}
