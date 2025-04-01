import React from 'react';
import PropTypes from 'prop-types';

const EmployerBenefitForm = ({
  data,
  handleChange,
  handleCheckboxChange,
  title = "Employer Benefits Details",
  isMainForm = true,
  prefix = ""
}) => {
  // Helper function to generate prefixed names
  const prefixedName = (name) => prefix ? `${prefix}_${name}` : name;

  return (
    <div className="employer-benefit-form">
      <h3>{title}</h3>

      {/* Sick Pay Question */}
      <div className="form-group">
        <label>Does your employer provide sick pay other than SSP?</label>
        <div>
          <label>
            <input
              type="radio"
              name={prefixedName("sickPayOtherThanSSP")}
              value="Yes"
              checked={data.sickPayOtherThanSSP === 'Yes'}
              onChange={() => handleChange('sickPayOtherThanSSP', 'Yes')}
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              name={prefixedName("sickPayOtherThanSSP")}
              value="No"
              checked={data.sickPayOtherThanSSP === 'No'}
              onChange={() => handleChange('sickPayOtherThanSSP', 'No')}
            />
            No
          </label>
          <label>
            <input
              type="radio"
              name={prefixedName("sickPayOtherThanSSP")}
              value="Don't know"
              checked={data.sickPayOtherThanSSP === "Don't know"}
              onChange={() => handleChange('sickPayOtherThanSSP', "Don't know")}
            />
            Don't Know
          </label>
        </div>
      </div>

      {/* Employer Benefits (Checkboxes) */}
      <div className="form-group">
        <label>Please select any of the following benefits provided by your employer (if any):</label>
        <div className='employer-check-box'>
          {['Health Insurance', 'Life Insurance', 'Pension Scheme', 'Company Car'].map((benefit) => (
            <label key={benefit}>
              <input
                type="checkbox"
                value={benefit}
                checked={data.employerBenefits.includes(benefit)}
                onChange={() => handleCheckboxChange(benefit)}
              />
              {benefit}
            </label>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>If yes, please provide further details for each benefit</label>
        <textarea 
          name={prefixedName("furtherDetails")}
          value={data.furtherDetails} 
          onChange={(e) => handleChange('furtherDetails', e.target.value)}
        />
      </div>

      {/* Other Flexible Benefits */}
      <div className="form-group">
        <label>Do you have any other flexible benefits?</label>
        <div>
          <label>
            <input
              type="radio"
              name={prefixedName("otherFlexibleBenefits")}
              value="Yes"
              checked={data.otherFlexibleBenefits === 'Yes'}
              onChange={() => handleChange('otherFlexibleBenefits', 'Yes')}
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              name={prefixedName("otherFlexibleBenefits")}
              value="No"
              checked={data.otherFlexibleBenefits === 'No'}
              onChange={() => handleChange('otherFlexibleBenefits', 'No')}
            />
            No
          </label>
        </div>
      </div>

      {/* Include Benefits in Shortfall Calculation */}
      {isMainForm && (
        <div className="form-group">
          <label>Do you wish to include employer benefits as part of any shortfall calculations?</label>
          <div>
            <label>
              <input
                type="radio"
                name={prefixedName("includeInShortfall")}
                value="Yes"
                checked={data.includeInShortfall === 'Yes'}
                onChange={() => handleChange('includeInShortfall', 'Yes')}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name={prefixedName("includeInShortfall")}
                value="No"
                checked={data.includeInShortfall === 'No'}
                onChange={() => handleChange('includeInShortfall', 'No')}
              />
              No
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

EmployerBenefitForm.propTypes = {
  data: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleCheckboxChange: PropTypes.func.isRequired,
  title: PropTypes.string,
  isMainForm: PropTypes.bool,
  prefix: PropTypes.string
};

export default EmployerBenefitForm;