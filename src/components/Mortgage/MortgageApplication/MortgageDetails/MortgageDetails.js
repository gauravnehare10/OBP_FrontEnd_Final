import { useState, useEffect, useRef } from 'react';
import '../../PersonalDetails/PersonalDetails.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useFormStore from '../../store';
import { validateMortgageDetails } from './MortgageDetailsForm/Validations';

const MortgageDetails = () => {
  const [ errors, setErrors ] = useState([]);
  const errorRef = useRef(null);
  const navigate = useNavigate();
  const { formData, fetchFormData, updateFormData } = useFormStore();
  const [hasPartner, setHasPartner] = useState(false);
  
  const initialMortgageDetails = {
    foundProperty: '',
    addressPostcode: '',
    address: ['', '', '', '', ''],
    purchasePrice: '',
    depositAmount: '',
    depositSource: '',
    totalLoanAmount: '',
    loanToValue: '',
    preferredTermYears: '',
    preferredTermMonths: '',
    mortgageFreeAge: '',
    termReason: '',
    propertyAddress: '',
    useDisposableIncome: '',
    plannedRetirementAge: '',
    dateOfBirth: '',
    termBeyondRetirement: '',
    newBuild: '',
    builderIncentives: '',
    governmentScheme: '',
    payFeesUpfront: false,
    increaseLoanAmount: false,
    payFeesPartly: false,
    confirmFeesInterest: false,
  };

  const [mortgageDetails, setMortgageDetails] = useState({
    applicant: { ...initialMortgageDetails },
    partner: { ...initialMortgageDetails }
  });

  const handleChange = (e, person = 'applicant') => {
    const { name, value, type, checked } = e.target;
    
    // Extract the base field name by removing person prefix if it exists
    const baseName = name.startsWith(`${person}-`) ? name.replace(`${person}-`, '') : name;
    
    if (baseName === 'foundProperty' && value === 'No') {
      setMortgageDetails(prev => ({
        ...prev,
        [person]: {
          ...prev[person],
          foundProperty: value,
          addressPostcode: '',
          address: ['', '', '', '', ''],
          propertyAddress: '',
        }
      }));
    } else if (baseName.startsWith('address') && baseName !== 'addressPostcode') {
      const index = parseInt(baseName.replace('address', ''), 10) - 1;
      setMortgageDetails(prev => {
        const updatedPersonData = { ...prev[person] };
        const updatedAddress = [...updatedPersonData.address];
        updatedAddress[index] = value;
        return {
          ...prev,
          [person]: {
            ...updatedPersonData,
            address: updatedAddress
          }
        };
      });
    } else {
      setMortgageDetails(prev => ({
        ...prev,
        [person]: {
          ...prev[person],
          [baseName]: type === 'checkbox' ? checked : value,
        }
      }));
    }
  };

  useEffect(() => {
    fetchFormData("mortgageDetails");
    fetchFormData("residentialData");
    fetchFormData("mainDetails");
  }, [fetchFormData]);

  useEffect(() => {
    if (formData.mainDetails) {
      setHasPartner(formData.mainDetails.partners?.length > 0);
    }
    
    if (formData.mortgageDetails) {
      setMortgageDetails({
        applicant: {
          ...initialMortgageDetails,
          ...(formData.mortgageDetails.applicant || {})
        },
        partner: {
          ...initialMortgageDetails,
          ...(formData.mortgageDetails.partner || {})
        }
      });
    }
  }, [formData.mortgageDetails, formData.mainDetails]);

  const calculateLoanDetails = (person = 'applicant') => {
    const personData = mortgageDetails[person];
    const purchasePrice = parseFloat(personData.purchasePrice) || 0;
    const depositAmount = parseFloat(personData.depositAmount) || 0;
    const loanAmount = purchasePrice - depositAmount;
    const ltv = purchasePrice > 0 ? ((loanAmount / purchasePrice) * 100).toFixed(2) : '0';
    
    setMortgageDetails(prev => ({
      ...prev,
      [person]: {
        ...prev[person],
        totalLoanAmount: loanAmount > 0 ? loanAmount : '',
        loanToValue: ltv,
      }
    }));
  };

  const findAddress = async (person = 'applicant') => {
    const postcode = mortgageDetails[person].addressPostcode.trim();
    if (!postcode) {
      alert('Please enter a postcode.');
      return;
    }

    try {
      const response = await axios.get(`https://api.postcodes.io/postcodes/${postcode}`);
      const { admin_district, admin_ward } = response.data.result || {};

      const updatedAddress = ['', admin_district || '', admin_ward || '', '', 'United Kingdom'];

      setMortgageDetails(prev => ({
        ...prev,
        [person]: {
          ...prev[person],
          address: updatedAddress,
        }
      }));
    } catch (error) {
      alert('Error fetching address. Please check the postcode and try again.');
      console.error('Address lookup error:', error);
    }
  };

  const handleUseResidentialAddress = (person = 'applicant') => {
    const residentialData = person === 'applicant' 
      ? formData.residentialData?.client 
      : formData.residentialData?.partner;
  
    if (!residentialData || !Array.isArray(residentialData) || residentialData.length === 0) {
      alert('No residential address history found');
      return;
    }
  
    const mostRecentAddress = residentialData[0]?.address || ['', '', '', '', ''];
    const postcode = residentialData[0]?.postcode || '';
  
    setMortgageDetails(prev => ({
      ...prev,
      [person]: {
        ...prev[person],
        address: [...mostRecentAddress],
        addressPostcode: postcode
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateMortgageDetails(mortgageDetails, hasPartner);
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
    updateFormData('mortgageDetails', mortgageDetails);
    navigate('/mortgage/add-details/repaying-mortgage');
  };

  const renderMortgageForm = (person, title) => {
    const personData = mortgageDetails[person] || { ...initialMortgageDetails };
    
    return (
      <div className="person-section">
        <h3>{title}</h3>

        <div className="form-group">
          <label>Have you found a property?</label>
          <div>
            <label>
              <input
                type="radio"
                name={`${person}-foundProperty`}  // Unique name per person
                value="Yes"
                checked={personData.foundProperty === 'Yes'}
                onChange={(e) => handleChange(e, person)}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name={`${person}-foundProperty`}  // Same unique name
                value="No"
                checked={personData.foundProperty === 'No'}
                onChange={(e) => handleChange(e, person)}
              />
              No
            </label>
          </div>
        </div>

        {personData.foundProperty === 'Yes' && (
          <>
            <div className="form-group">
              <label>Address of the property being Mortgaged/Re-mortgaged</label>
              <input
                type="text"
                name="propertyAddress"
                value={personData.propertyAddress}
                onChange={(e) => handleChange(e, person)}
                placeholder="Property address"
              />
            </div>

            <div className="form-group">
              <label>Postcode</label>
              <input
                type="text"
                name="addressPostcode"
                placeholder="Enter postcode"
                value={personData.addressPostcode}
                onChange={(e) => handleChange(e, person)}
              />
            </div>

            <div className="form-group">
              <button 
                type="button" 
                className="address-button" 
                onClick={() => findAddress(person)}
              >
                Find Address
              </button>
            </div>

            {personData.address.map((addr, index) => (
              <div className="form-group" key={index}>
                <label>Address Line {index + 1}</label>
                <input
                  type="text"
                  name={`address${index + 1}`}
                  value={addr}
                  onChange={(e) => handleChange(e, person)}
                />
              </div>
            ))}

            <div className="form-group">
              <button 
                type="button" 
                className="address-button" 
                onClick={() => handleUseResidentialAddress(person)}
                disabled={
                  !formData.residentialData?.[person === 'applicant' ? 'client' : 'partner'] ||
                  formData.residentialData[person === 'applicant' ? 'client' : 'partner'].length === 0
                }
              >
                Use Residential Address
              </button>
            </div>
          </>
        )}

        <div className="form-group">
          <label>Purchase price or estimated value (£)</label>
          <input
            type="number"
            name="purchasePrice"
            value={personData.purchasePrice}
            onChange={(e) => handleChange(e, person)}
            onBlur={() => calculateLoanDetails(person)}
          />
        </div>

        <div className="form-group">
          <label>Deposit amount or equity (£)</label>
          <input
            type="number"
            name="depositAmount"
            value={personData.depositAmount}
            onChange={(e) => handleChange(e, person)}
            onBlur={() => calculateLoanDetails(person)}
          />
        </div>

        <div className="form-group">
          <label>Source of deposit</label>
          <select
            name="depositSource"
            value={personData.depositSource}
            onChange={(e) => handleChange(e, person)}
          >
            <option value="">Select source</option>
            <option value="Savings">Savings</option>
            <option value="Gift">Gift</option>
            <option value="Builder">Builder</option>
            <option value="Equity">Equity</option>
          </select>
        </div>

        <div className="form-group">
          <button 
            type="button" 
            className="calc-button" 
            onClick={() => calculateLoanDetails(person)}
          >
            Calculate Loan
          </button>
        </div>

        <div className="form-group">
          <label>Total loan required (£)</label>
          <input
            type="number"
            name="totalLoanAmount"
            value={personData.totalLoanAmount}
            readOnly
          />
        </div>

        <div className="form-group">
          <label>Loan to Value (%)</label>
          <input
            type="number"
            name="loanToValue"
            value={personData.loanToValue}
            readOnly
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Preferred term (years)</label>
            <input
              type="number"
              name="preferredTermYears"
              value={personData.preferredTermYears}
              onChange={(e) => handleChange(e, person)}
              min="1"
              max="40"
            />
          </div>
          <div className="form-group">
            <label>Preferred term (months)</label>
            <input
              type="number"
              name="preferredTermMonths"
              value={personData.preferredTermMonths}
              onChange={(e) => handleChange(e, person)}
              min="0"
              max="11"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Age you want to be mortgage free</label>
          <input
            type="number"
            name="mortgageFreeAge"
            value={personData.mortgageFreeAge}
            onChange={(e) => handleChange(e, person)}
          />
        </div>

        <div className="form-group">
          <label>Reason for preferred term</label>
          <textarea
            name="termReason"
            value={personData.termReason}
            onChange={(e) => handleChange(e, person)}
            rows="3"
          />
        </div>

        <div className="form-group">
          <label>Thoughts on using disposable income to reduce term</label>
          <textarea
            name="useDisposableIncome"
            value={personData.useDisposableIncome}
            onChange={(e) => handleChange(e, person)}
            rows="3"
          />
        </div>

        <div className="form-group">
          <label>Planned retirement age</label>
          <input
            type="number"
            name="plannedRetirementAge"
            value={personData.plannedRetirementAge}
            onChange={(e) => handleChange(e, person)}
          />
        </div>

        <div className="form-group">
          <label>Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={personData.dateOfBirth}
            onChange={(e) => handleChange(e, person)}
          />
        </div>

        <div className="form-group">
          <label>Does term extend past retirement age?</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name={`${person}-termBeyondRetirement`}
                value="Yes"
                checked={personData.termBeyondRetirement === 'Yes'}
                onChange={(e) => handleChange(e, person)}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name={`${person}-termBeyondRetirement`}
                value="No"
                checked={personData.termBeyondRetirement === 'No'}
                onChange={(e) => handleChange(e, person)}
              />
              No
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Is this a new build?</label>
          <div>
            <label>
              <input
                type="radio"
                name={`${person}-newBuild`}
                value="Yes"
                checked={personData.newBuild === 'Yes'}
                onChange={(e) => handleChange(e, person)}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name={`${person}-newBuild`}
                value="No"
                checked={personData.newBuild === 'No'}
                onChange={(e) => handleChange(e, person)}
              />
              No
            </label>
          </div>
        </div>

        {personData.newBuild === 'Yes' && (
          <div className="form-group">
            <label>Are there builder incentives?</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  value="Yes"
                  name={`${person}-builderIncentives`}
                  checked={personData.builderIncentives === 'Yes'}
                  onChange={(e) => handleChange(e, person)}
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name={`${person}-builderIncentives`}
                  value="No"
                  checked={personData.builderIncentives === 'No'}
                  onChange={(e) => handleChange(e, person)}
                />
                No
              </label>
            </div>
          </div>
        )}

        <div className="form-group">
          <label>Is this a government scheme?</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name={`${person}-governmentScheme`}
                value="Yes"
                checked={personData.governmentScheme === 'Yes'}
                onChange={(e) => handleChange(e, person)}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name={`${person}-governmentScheme`}
                value="No"
                checked={personData.governmentScheme === 'No'}
                onChange={(e) => handleChange(e, person)}
              />
              No
            </label>
          </div>
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="payFeesUpfront"
              checked={personData.payFeesUpfront}
              onChange={(e) => handleChange(e, person)}
            />
            Pay fees upfront
          </label>
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="increaseLoanAmount"
              checked={personData.increaseLoanAmount}
              onChange={(e) => handleChange(e, person)}
            />
            Add fees to loan
          </label>
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="payFeesPartly"
              checked={personData.payFeesPartly}
              onChange={(e) => handleChange(e, person)}
            />
            Pay part fees upfront, part to loan
          </label>
        </div>

        {personData.increaseLoanAmount && (
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="confirmFeesInterest"
                checked={personData.confirmFeesInterest}
                onChange={(e) => handleChange(e, person)}
              />
              Customer understands interest will be paid on fees added to loan
            </label>
          </div>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className='form-buttons'>
        <div className='form-buttons-card'>
          <button className="back-button" type="button" onClick={() => navigate(-1)}>Back</button>
        </div>
        <div className='form-buttons-card'>
          <button className="form-submit" type="submit">Save</button>
          <button className="next-button" type="button" onClick={() => navigate('/mortgage/add-details/repaying-mortgage')}>Next</button>
        </div>
      </div>

      <div className="form-group">
        {Object.keys(errors).length > 0 && (
          <div ref={errorRef} className="error-message">
            {Object.values(errors).join(", ")}
          </div>
        )}
      </div>

      <h2>Mortgage/Remortgage Details</h2>

      {renderMortgageForm('applicant', 'Your Details')}

      {hasPartner && renderMortgageForm('partner', "Partner's Details")}

      <div className='form-buttons'>
        <div className='form-buttons-card'>
          <button className="back-button" type="button" onClick={() => navigate(-1)}>Back</button>
        </div>
        <div className='form-buttons-card'>
          <button className="form-submit" type="submit">Save</button>
          <button className="next-button" type="button" onClick={() => navigate('/mortgage/add-details/repaying-mortgage')}>Next</button>
        </div>
      </div>
    </form>
  );
};

export default MortgageDetails;