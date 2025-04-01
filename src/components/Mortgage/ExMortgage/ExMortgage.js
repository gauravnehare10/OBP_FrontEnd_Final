import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../PersonalDetails/PersonalDetails.css';
import useFormStore from '../store';
import { validateExistingMortgages } from './ExMortgageForm/Validations';

const initialMortgage = {
  mortgageType: '',
  currentValue: '',
  lenderName: '',
  accountNumber: '',
  currentBalance: '',
  remainingTerm: '',
  monthlyRepayment: '',
  repaymentType: '',
  interestRateType: '',
  currentInterestRate: '',
  rateEndDate: '',
  revertRate: '',
  hasEarlyRepaymentCharges: '',
  isPortable: '',
  willRedeemNow: '',
  propertyAddress: ['', '', '', '', ''],
  postcode: ''
};

const ExMortgage = () => {
  const navigate = useNavigate();
  const [ errors, setErrors ] = useState([]);
  const errorRef = useRef();
  const { formData, fetchFormData, updateFormData } = useFormStore();
  const [hasPartner, setHasPartner] = useState(false);
  const [mortgageData, setMortgageData] = useState({
    applicant: {
      hasMortgage: '',
      mortgages: []
    },
    partner: {
      hasMortgage: '',
      mortgages: []
    }
  });

  const handleMortgageChange = (value, person = 'applicant') => {
    setMortgageData(prev => ({
      ...prev,
      [person]: {
        ...prev[person],
        hasMortgage: value,
        mortgages: value === 'Yes' && prev[person].mortgages.length === 0 
          ? [{ ...initialMortgage }] 
          : value === 'No' 
            ? [] 
            : prev[person].mortgages
      }
    }));
  };

  const addMortgage = (person = 'applicant') => {
    setMortgageData(prev => ({
      ...prev,
      [person]: {
        ...prev[person],
        mortgages: [
          ...prev[person].mortgages,
          { ...initialMortgage }
        ]
      }
    }));
  };

  const deleteMortgage = (index, person = 'applicant') => {
    setMortgageData(prev => ({
      ...prev,
      [person]: {
        ...prev[person],
        mortgages: prev[person].mortgages.filter((_, i) => i !== index)
      }
    }));
  };

  const handleChange = (index, field, value, person = 'applicant') => {
    setMortgageData(prev => ({
      ...prev,
      [person]: {
        ...prev[person],
        mortgages: prev[person].mortgages.map((mortgage, i) => 
          i === index ? { ...mortgage, [field]: value } : mortgage
        )
      }
    }));
  };

  useEffect(() => {
    fetchFormData("mainDetails");
    fetchFormData("existingMortgageData");
  }, [fetchFormData]);

  useEffect(() => {
    if (formData.mainDetails) {
      setHasPartner(formData.mainDetails.partners?.length > 0);
    }
    
    if (formData.existingMortgageData) {
      setMortgageData({
        applicant: {
          hasMortgage: formData.existingMortgageData.applicant?.hasMortgage || "",
          mortgages: formData.existingMortgageData.applicant?.mortgages || []
        },
        partner: {
          hasMortgage: formData.existingMortgageData.partner?.hasMortgage || "",
          mortgages: formData.existingMortgageData.partner?.mortgages || []
        }
      });
    }
  }, [formData.existingMortgageData, formData.mainDetails]);

  const handleAddressChange = async (index, person = 'applicant') => {
    const postcode = mortgageData[person].mortgages[index].postcode;
    if (!postcode.trim()) {
      alert('Please enter a postcode.');
      return;
    }

    try {
      const response = await axios.get(`https://api.postcodes.io/postcodes/${postcode}`);
      const { admin_district, admin_ward } = response.data.result || {};
      const updatedAddress = ['', admin_ward || '', admin_district || '', '', 'United Kingdom'];
      
      handleChange(index, 'propertyAddress', updatedAddress, person);
    } catch (error) {
      alert('Error fetching address. Please check the postcode.');
      console.error('Address lookup error:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateExistingMortgages(mortgageData, hasPartner);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length > 0) {
      setTimeout(() => {
        errorRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 100);
      return;
    }
    updateFormData('existingMortgageData', mortgageData);
    navigate('/mortgage/add-details/monthly-expenditure');
  };

  const renderMortgageForm = (person, title) => {
    const personData = mortgageData[person] || { hasMortgage: '', mortgages: [] };
    
    return (
      <>
        <h4>{title}</h4>
        <div className="form-group">
          <label>Do you have any existing mortgage?</label>
          <div>
            <label>
              <input
                type="radio"
                value="Yes"
                checked={personData.hasMortgage === 'Yes'}
                onChange={() => handleMortgageChange('Yes', person)}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                value="No"
                checked={personData.hasMortgage === 'No'}
                onChange={() => handleMortgageChange('No', person)}
              />
              No
            </label>
          </div>
        </div>

        {personData.mortgages.map((mortgage, index) => (
          <div key={index} className="mortgage-section">
            <div className="form-group">
              <label>Type of Mortgage:</label>
              <select 
                value={mortgage.mortgageType} 
                onChange={(e) => handleChange(index, 'mortgageType', e.target.value, person)}
              >
                <option value="">Select Type</option>
                <option value="Fixed">Fixed</option>
                <option value="Tracker">Tracker</option>
                <option value="Variable">Variable</option>
              </select>
            </div>

            <div className="form-group">
              <label>Current Value:</label>
              <input
                type="text"
                value={mortgage.currentValue}
                onChange={(e) => handleChange(index, 'currentValue', e.target.value, person)}
              />
            </div>

            <div className="form-group">
              <label>Name of Lender:</label>
              <input
                type="text"
                value={mortgage.lenderName}
                onChange={(e) => handleChange(index, 'lenderName', e.target.value, person)}
              />
            </div>

            <div className="form-group">
              <label>Account Number:</label>
              <input
                type="number"
                value={mortgage.accountNumber}
                onChange={(e) => handleChange(index, 'accountNumber', e.target.value, person)}
              />
            </div>

            <div className="form-group">
              <label>Current Balance:</label>
              <input
                type="number"
                value={mortgage.currentBalance}
                onChange={(e) => handleChange(index, 'currentBalance', e.target.value, person)}
              />
            </div>

            <div className="form-group">
              <label>Remaining Term:</label>
              <input
                type="number"
                value={mortgage.remainingTerm}
                onChange={(e) => handleChange(index, 'remainingTerm', e.target.value, person)}
              />
            </div>

            <div className="form-group">
              <label>Monthly Repayment Amount:</label>
              <input
                type="number"
                value={mortgage.monthlyRepayment}
                onChange={(e) => handleChange(index, 'monthlyRepayment', e.target.value, person)}
              />
            </div>

            <div className="form-group">
              <label>Repayment Type:</label>
              <select 
                value={mortgage.repaymentType} 
                onChange={(e) => handleChange(index, 'repaymentType', e.target.value, person)}
              >
                <option value="">Select Repayment Type</option>
                <option value="Repayment">Repayment</option>
                <option value="Interest Only">Interest Only</option>
              </select>
            </div>

            <div className="form-group">
              <label>Type of Interest Rate (require if mortgage to be redeemed or altered):</label>
              <select 
                value={mortgage.interestRateType} 
                onChange={(e) => handleChange(index, 'interestRateType', e.target.value, person)}
              >
                <option value="">Select Interest Rate Type</option>
                <option value="Fixed">Fixed</option>
                <option value="Variable">Variable</option>
              </select>
            </div>

            <div className="form-group">
              <label>Current Interest Rate (require if mortgage to be redeemed or altered):</label>
              <input 
                type="number" 
                value={mortgage.currentInterestRate} 
                onChange={(e) => handleChange(index, 'currentInterestRate', e.target.value, person)} 
              />
            </div>

            <div className="form-group">
              <label>Date existing rate ends (N/A if SVR or lifetime Tracker)(require to be redeemed or altered):</label>
              <input 
                type="date" 
                value={mortgage.rateEndDate} 
                onChange={(e) => handleChange(index, 'rateEndDate', e.target.value, person)} 
              />
            </div>

            <div className="form-group">
              <label>Revert Rate (required if mortgage to be redeemed or altered):</label>
              <input 
                type="number" 
                value={mortgage.revertRate} 
                onChange={(e) => handleChange(index, 'revertRate', e.target.value, person)} 
              />
            </div>

            <div className="form-group">
              <label>Are there any early repayment charges which apply? (required if mortgage to be redeemed or altered)</label>
              <div>
                <label>
                  <input 
                    type="radio" 
                    value="Yes" 
                    checked={mortgage.hasEarlyRepaymentCharges === 'Yes'} 
                    onChange={(e) => handleChange(index, 'hasEarlyRepaymentCharges', e.target.value, person)} 
                  /> 
                  Yes
                </label>
                <label>
                  <input 
                    type="radio" 
                    value="No" 
                    checked={mortgage.hasEarlyRepaymentCharges === 'No'} 
                    onChange={(e) => handleChange(index, 'hasEarlyRepaymentCharges', e.target.value, person)} 
                  /> 
                  No
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>Is the existing mortgage portable to the new property? (required if mortgage to be redeemed or altered)</label>
              <div>
                <label>
                  <input 
                    type="radio" 
                    value="Yes" 
                    checked={mortgage.isPortable === 'Yes'} 
                    onChange={(e) => handleChange(index, 'isPortable', e.target.value, person)} 
                  /> 
                  Yes
                </label>
                <label>
                  <input 
                    type="radio" 
                    value="No" 
                    checked={mortgage.isPortable === 'No'} 
                    onChange={(e) => handleChange(index, 'isPortable', e.target.value, person)} 
                  /> 
                  No
                </label>
                <label>
                  <input 
                    type="radio" 
                    value="N/A" 
                    checked={mortgage.isPortable === 'N/A'} 
                    onChange={(e) => handleChange(index, 'isPortable', e.target.value, person)} 
                  /> 
                  N/A
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>Will the mortgage be redeemed now?</label>
              <div>
                <label>
                  <input 
                    type="radio" 
                    value="Yes" 
                    checked={mortgage.willRedeemNow === 'Yes'} 
                    onChange={(e) => handleChange(index, 'willRedeemNow', e.target.value, person)} 
                  /> 
                  Yes
                </label>
                <label>
                  <input 
                    type="radio" 
                    value="No" 
                    checked={mortgage.willRedeemNow === 'No'} 
                    onChange={(e) => handleChange(index, 'willRedeemNow', e.target.value, person)} 
                  /> 
                  No
                </label>
              </div>
            </div>

            <strong>Address Search</strong>
            <div className="form-group">
              <label>Postcode:</label>
              <input
                type="text"
                value={mortgage.postcode}
                onChange={(e) => handleChange(index, 'postcode', e.target.value, person)}
              />
            </div>
            <div className="form-group">
              <button 
                className="address-button" 
                type="button" 
                onClick={() => handleAddressChange(index, person)}
              >
                Find Address
              </button>
            </div>
            {[1, 2, 3, 4, 5].map((num) => (
              <div className="form-group" key={num}>
                <label>Address {num}:</label>
                <input
                  type="text"
                  value={mortgage.propertyAddress[num - 1] || ''}
                  onChange={(e) => {
                    const updatedAddress = [...mortgage.propertyAddress];
                    updatedAddress[num - 1] = e.target.value;
                    handleChange(index, 'propertyAddress', updatedAddress, person);
                  }}
                />
              </div>
            ))}
            <div className='form-group'>
              <button 
                className="delete-button" 
                type="button" 
                onClick={() => deleteMortgage(index, person)}
              >
                Delete Mortgage
              </button>
            </div>
          </div>
        ))}

        {personData.hasMortgage === 'Yes' && (
          <div className='form-group'>
            <button 
              className="calc-button" 
              type="button" 
              onClick={() => addMortgage(person)}
            >
              Add Another Existing Mortgage for {title}
            </button>
          </div>
        )}
      </>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-buttons">
        <div className="form-buttons-card">
          <button className="back-button" type="button" onClick={() => navigate(-1)}>Back</button>
        </div>
        <div className="form-buttons-card">
          <button className="form-submit" type="submit">Save</button>
          <button className="next-button" type="button" onClick={() => navigate('/mortgage/add-details/monthly-expenditure')}>Next</button>
        </div>
      </div>

      <div className="form-group">
        {Object.keys(errors).length > 0 && (
          <div ref={errorRef} className="error-message">
            {Object.values(errors).join(", ")}
          </div>
        )}
      </div>

      <h3>Existing Mortgage Details</h3>

      {renderMortgageForm('applicant', 'Your Mortgages')}

      {hasPartner && renderMortgageForm('partner', "Partner's Mortgages")}

      <div className="form-buttons">
        <div className="form-buttons-card">
          <button className="back-button" type="button" onClick={() => navigate(-1)}>Back</button>
        </div>
        <div className="form-buttons-card">
          <button className="form-submit" type="submit">Save</button>
          <button className="next-button" type="button" onClick={() => navigate('/mortgage/add-details/monthly-expenditure')}>Next</button>
        </div>
      </div>
    </form>
  );
};

export default ExMortgage;