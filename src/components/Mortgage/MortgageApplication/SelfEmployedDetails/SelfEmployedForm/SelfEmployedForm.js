import React from 'react';

const SelfEmployedFields = ({ 
  selfEmployedData, 
  handleChange, 
  handleAddressChange, 
  findAddress, 
  useResidentialAddress,
  formData
}) => {
  return (
    <>
      {/* Business Name */}
      <div className="form-group">
        <label>Name of Business:</label>
        <input
          type="text"
          value={selfEmployedData.businessName}
          onChange={(e) => handleChange('businessName', e.target.value)}
        />
      </div>

      {/* Business Address */}
      <div className="form-group">
        <label>Address of Business:</label>
        <input
          type="text"
          value={selfEmployedData.businessPostcode}
          onChange={(e) => handleChange('businessPostcode', e.target.value)}
          placeholder="Postcode"
        />
      </div>
      <div className="form-group">
        <button className="address-button" type="button" onClick={() => findAddress(selfEmployedData.businessPostcode)}>
          Find Address
        </button>
      </div>

      {(selfEmployedData.businessAddress || ['', '', '', '', '']).map((addr, index) => (
        <div key={index} className="form-group">
          <label>Address {index + 1}:</label>
          <input
            type="text"
            value={addr}
            onChange={(e) => handleAddressChange(index, e.target.value)}
          />
        </div>
      ))}

      <div className="form-group">
        <button className="address-button" type="button" onClick={useResidentialAddress}>
            Use Residential Address
        </button>
      </div>

      {/* Position in Business */}
      <div className="form-group">
        <label>What is your position within the business?</label>
        <input
          type="text"
          value={selfEmployedData.positionInBusiness}
          onChange={(e) => handleChange('positionInBusiness', e.target.value)}
        />
      </div>

      {/* Start Date of the Business */}
      <div className="form-group">
        <label>Start Date of the Business:</label>
        <input
          type="date"
          value={selfEmployedData.startDate}
          onChange={(e) => handleChange('startDate', e.target.value)}
        />
      </div>

      {/* Years of Accounts */}
      <div className="form-group">
        <label>How many years of accounts do you have?</label>
        <input
          type="number"
          value={selfEmployedData.yearsOfAccounts}
          onChange={(e) => handleChange('yearsOfAccounts', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Details of Accountant (Name, Address, Type)</label>
        <textarea 
          value={selfEmployedData.accountantDetails} 
          onChange={(e) => handleChange("accountantDetails", e.target.value)} >
        </textarea>
      </div>
    </>
  );
};

export default SelfEmployedFields;