import React from 'react';
import PropTypes from 'prop-types';

const OccupationForm = ({
  data,
  index = null,
  handleChange,
  handleAddressChange,
  findAddress,
  onDelete,
  isMainForm = false
}) => {
  const shouldShowQuestions = (status) => [
    'Employed',
    'Self-Employed',
    'Unemployed-Claiming-Benefits',
    'Temporary-Employed',
  ].includes(status);

  const isSelfEmployed = (status) => status === 'Self-Employed';
  const shouldAskExtraQuestions = (selfEmployedType) => 
    selfEmployedType === 'Director (less than 20% shareholding)';

  const currentIsSelfEmployed = isSelfEmployed(data.status);
  const currentShouldAskExtraQuestions = currentIsSelfEmployed && 
    shouldAskExtraQuestions(data.selfEmployedType);

  return (
    <div className="occupation-form">
      <h3>{isMainForm ? 'Occupation Details' : `Previous Employment ${index + 1}`}</h3>
      
      <div className="form-group">
        <label>Occupation Status:</label>
        <select
          name="status"
          value={data.status || ""}
          onChange={(e) => handleChange(e, index)}
        >    
          <option value="">Select Status</option>
          <option value="Employed">Employed</option>
          <option value="Self-Employed">Self-Employed</option>
          <option value="Retired">Retired</option>
          <option value="Unemployed">Unemployed</option>
          <option value="Unemployed-Claiming-Benefits">Unemployed Claiming Benefits</option>
          <option value="Temporary-Employed">Temporary Employed / Employed on a Contract</option>
          <option value="Houseperson">House Person</option>
        </select>
      </div>

      {currentIsSelfEmployed && (
        <div className='form-group'>
          <label>Self-Employed Type:</label>
          <select 
            name="selfEmployedType" 
            value={data.selfEmployedType} 
            onChange={(e) => handleChange(e, index)}
          >
            <option value="">Select Type</option>
            <option value="Director (20% shareholding +)">Director (20% shareholding +)</option>
            <option value="Director (less than 20% shareholding)">Director (less than 20% shareholding)</option>
            <option value="Sole Trader">Sole Trader</option>
            <option value="Partnership">Partnership</option>
          </select>
        </div>
      )}

      {shouldShowQuestions(data.status) && (!currentIsSelfEmployed || currentShouldAskExtraQuestions) && (
        <>
          <div className="form-group">
            <label>Main Job Title:</label>
            <input 
              name="jobTitle" 
              type="text" 
              value={data.jobTitle} 
              onChange={(e) => handleChange(e, index)} 
            />
          </div>

          <div className="form-group">
            <label>Type of Employment:</label>
            <select 
              name='employmentType' 
              value={data.employmentType} 
              onChange={(e) => handleChange(e, index)}
            >
              <option value="">Select Type</option>
              <option value="Permanent">Permanent</option>
              <option value="Contract">Contract</option>
              <option value="Part-Time">Part-Time</option>
            </select>
          </div>

          <div className="form-group">
            <label>Name of Main Employer:</label>
            <input 
              name='employerName' 
              type="text" 
              value={data.employerName} 
              onChange={(e) => handleChange(e, index)} 
            />
          </div>

          <div className="form-group">
            <label>Address Search (Postcode):</label>
            <input 
              name='employerPostcode' 
              type="text" 
              value={data.employerPostcode} 
              onChange={(e) => handleChange(e, index)} 
            />
          </div>

          <div className="form-group">
            <button 
              className="address-button" 
              type="button" 
              onClick={() => findAddress(data.employerPostcode, index)}
            >
              Find Address
            </button>
          </div>

          {(data?.employerAddress || []).map((addr, addrIdx) => (
            <div key={addrIdx} className="form-group">
              <label>Address {addrIdx + 1}:</label>
              <input
                type="text"
                value={addr}
                onChange={(e) =>
                  handleAddressChange(addrIdx, e.target.value, index)
                }
              />
            </div>
          ))}

          <h3>Main Employment Income Details:</h3>
          <div className="form-group">
            <label>Salary/Basic Income (Annual Gross):</label>
            <input 
              name='annualIncome' 
              type="number" 
              value={data.annualIncome}  
              onChange={(e) => handleChange(e, index)} 
            />
          </div>

          <div className='form-group'>
            <label>Total Gross Annual Income: </label>
            <input 
              name='totalGrossIncome' 
              type="number" 
              value={data.totalGrossIncome} 
              onChange={(e) => handleChange(e, index)} 
            />
          </div>

          <div className="form-group">
            <label>Total Net Monthly Income: </label>
            <input 
              name='totalNetIncome' 
              type="number" 
              value={data.totalNetIncome} 
              onChange={(e) => handleChange(e, index)} 
            />
          </div>
        </>
      )}

      {!isMainForm && (
        <div className='form-group'>
          <button 
            type="button" 
            className='delete-button' 
            onClick={() => onDelete(index)}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

OccupationForm.propTypes = {
  data: PropTypes.object.isRequired,
  index: PropTypes.number,
  handleChange: PropTypes.func.isRequired,
  handleAddressChange: PropTypes.func.isRequired,
  findAddress: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  isMainForm: PropTypes.bool
};

export default OccupationForm;