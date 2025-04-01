import React from 'react';

const PersonalDetailsForm = ({ personalDetails, handleChange, prefix = '', showDependentsSection = true }) => {
  return (
    <div>
      <div className="form-group">
        <label>Title:</label>
        <select name={`${prefix}title`} value={personalDetails.title} onChange={handleChange}>
          <option value="">Select</option>
          <option value="Mr">Mr</option>
          <option value="Ms">Ms</option>
          <option value="Mrs">Mrs</option>
        </select>
      </div>

      <div className="form-group">
        <label>Forename:</label>
        <input type="text" name={`${prefix}forename`} value={personalDetails.forename} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Middle Name:</label>
        <input type="text" name={`${prefix}middleName`} value={personalDetails.middleName} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Surname:</label>
        <input type="text" name={`${prefix}surname`} value={personalDetails.surname} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Previous Name (if applicable):</label>
        <input type="text" name={`${prefix}previousName`} value={personalDetails.previousName} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Date of Name Change (if applicable):</label>
        <input type="date" name={`${prefix}dateOfNameChange`} value={personalDetails.dateOfNameChange} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Mother's Maiden Name (if known):</label>
        <input type="text" name={`${prefix}mothersMaidenName`} value={personalDetails.mothersMaidenName} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Date of Birth:</label>
        <input type="date" name={`${prefix}dateOfBirth`} value={personalDetails.dateOfBirth} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Age:</label>
        <input type="number" name={`${prefix}age`} value={personalDetails.age} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Gender at Birth:</label>
        <select name={`${prefix}genderAtBirth`} value={personalDetails.genderAtBirth} onChange={handleChange}>
          <option value="">Select</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>

      <div className="form-group">
        <label>Identifies as:</label>
        <select name={`${prefix}identifiesAs`} value={personalDetails.identifiesAs} onChange={handleChange}>
          <option value="">Select</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>

      <div className="form-group">
        <label>NI Number:</label>
        <input type="text" name={`${prefix}niNumber`} value={personalDetails.niNumber} onChange={handleChange} />
      </div>
      
      <div className="form-group">
        <label>Relationship Status:</label>
        <select name={`${prefix}relationshipStatus`} value={personalDetails.relationshipStatus} onChange={handleChange}>
          <option value="">Select</option>
          <option value="Married">Married</option>
          <option value="Single">Single</option>
        </select>
      </div>

      <div className="form-group">
        <label>Nationality:</label>
        <select name={`${prefix}nationality`} value={personalDetails.nationality} onChange={handleChange}>
          <option value="">Select Nationality</option>
          <option value="Indian">Indian</option>
          <option value="American">American</option>
          <option value="British">British</option>
          <option value="Canadian">Canadian</option>
          <option value="Australian">Australian</option> 
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="form-group">
        <label>Are you an Ex-Patriate?</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name={`${prefix}isExPatriate`}
              value="Yes"
              checked={personalDetails.isExPatriate === 'Yes'}
              onChange={handleChange}
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              name={`${prefix}isExPatriate`}
              value="No"
              checked={personalDetails.isExPatriate === 'No'}
              onChange={handleChange}
            />
            No
          </label>
        </div>
      </div>
      
      <div className="form-group">
        <label>Are you or any of your family a public official?</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name={`${prefix}isPublicOfficial`}
              value="Yes"
              checked={personalDetails.isPublicOfficial === 'Yes'}
              onChange={handleChange}
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              name={`${prefix}isPublicOfficial`}
              value="No"
              checked={personalDetails.isPublicOfficial === 'No'}
              onChange={handleChange}
            />
            No
          </label>
        </div>
      </div>

      <div className="form-group">
        <label>Country of Residence:</label>
        <select name={`${prefix}countryOfResidence`} value={personalDetails.countryOfResidence} onChange={handleChange}>
          <option value="">Select Country</option>
          <option value="UK">UK</option>
          <option value="USA">USA</option>
          <option value="Canada">Canada</option>
          <option value="India">India</option>
          <option value="Australia">Australia</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="form-group">
        <label>If UK, Are you located temporarily outside of the UK?</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name={`${prefix}tempOutsideUK`}
              value="Yes"
              checked={personalDetails.tempOutsideUK === 'Yes'}
              onChange={handleChange}
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              name={`${prefix}tempOutsideUK`}
              value="No"
              checked={personalDetails.tempOutsideUK === 'No'}
              onChange={handleChange}
            />
            No
          </label>
        </div>
      </div>

      <div className="form-group">
        <label>Planned Retirement Age:</label>
        <input type="number" name={`${prefix}retirementAge`} value={personalDetails.retirementAge} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Mobile Telephone Number:</label>
        <input type="number" name={`${prefix}mobileNumber`} value={personalDetails.mobileNumber} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Daytime telephone number:</label>
        <input type="number" name={`${prefix}daytimeNumber`} value={personalDetails.daytimeNumber} onChange={handleChange} />
      </div>

      {showDependentsSection && (
        <div className="form-group">
          <label>Do you have any dependents?</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name={`${prefix}hasDependents`}
                value="Yes"
                checked={personalDetails.hasDependents === 'Yes'}
                onChange={handleChange}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name={`${prefix}hasDependents`}
                value="No"
                checked={personalDetails.hasDependents === 'No'}
                onChange={handleChange}
              />
              No
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalDetailsForm;