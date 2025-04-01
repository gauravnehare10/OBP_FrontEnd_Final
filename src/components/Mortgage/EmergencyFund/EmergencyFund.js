import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useFormStore from '../store';
import { validateEmergencyFund } from './EmergencyFundForm/Validations';

const initialEmergencyFund = {
  emergencyCapital: '',
  medicalIssues: '',
  smokerStatus: '',
  hasWill: '',
  referForWill: '',
  powerOfAttorney: '',
};

const EmergencyFund = () => {
  const [ errors, setErrors ] = useState([]);
  const errorRef = useRef();

  const navigate = useNavigate();
  const { formData, fetchFormData, updateFormData } = useFormStore();
  const [hasPartner, setHasPartner] = useState(false);
  const [emergencyFundData, setEmergencyFundData] = useState({
    applicant: { ...initialEmergencyFund },
    partner: { ...initialEmergencyFund }
  });

  const handleChange = (field, value, person = 'applicant') => {
    setEmergencyFundData(prev => {
      const updatedData = { 
        ...prev,
        [person]: {
          ...prev[person],
          [field]: value
        }
      };
      
      if (field === 'hasWill' && value === 'Yes') {
        updatedData[person].referForWill = 'No';
      }
  
      return updatedData;
    });
  };

  useEffect(() => {
    fetchFormData("mainDetails");
    fetchFormData("emergenyFundData");
  }, [fetchFormData]);

  useEffect(() => {
    if (formData.mainDetails) {
      setHasPartner(formData.mainDetails.partners?.length > 0);
    }
    
    if (formData.emergenyFundData) {
      setEmergencyFundData({
        applicant: {
          ...initialEmergencyFund,
          ...(formData.emergenyFundData.applicant || {})
        },
        partner: {
          ...initialEmergencyFund,
          ...(formData.emergenyFundData.partner || {})
        }
      });
    }
  }, [formData.emergenyFundData, formData.mainDetails]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateEmergencyFund(emergencyFundData, hasPartner);
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
    updateFormData('emergenyFundData', emergencyFundData);
    navigate('/mortgage/add-details/application-type');
  };

  const renderEmergencyFundForm = (person, title) => {
    const personData = emergencyFundData[person] || { ...initialEmergencyFund };
    
    return (
      <>
        <h4>{title}</h4>
        
        <div className="form-group">
          <label>How much capital would you need to provide for potential emergencies?</label>
          <input
            type="number"
            value={personData.emergencyCapital}
            onChange={(e) => handleChange('emergencyCapital', e.target.value, person)}
          />
        </div>

        <h5>Health Details</h5>
        <div className="form-group">
          <label>Have you ever experienced any medical health issues?</label>
          <div>
            <label>
              <input
                type="radio"
                value="Yes"
                checked={personData.medicalIssues === 'Yes'}
                onChange={() => handleChange('medicalIssues', 'Yes', person)}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                value="No"
                checked={personData.medicalIssues === 'No'}
                onChange={() => handleChange('medicalIssues', 'No', person)}
              />
              No
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Are you or have you ever been a smoker?</label>
          <select 
            value={personData.smokerStatus} 
            onChange={(e) => handleChange('smokerStatus', e.target.value, person)}
          >
            <option value="">Select an option</option>
            <option value="Current Smoker">Current Smoker</option>
            <option value="Former Smoker">Former Smoker</option>
            <option value="Never Smoked">Never Smoked</option>
          </select>
        </div>

        <h5>Will Details</h5>
        <div className="form-group">
          <label>Do you have a will?</label>
          <div>
            <label>
              <input
                type="radio"
                value="Yes"
                checked={personData.hasWill === 'Yes'}
                onChange={() => handleChange('hasWill', 'Yes', person)}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                value="No"
                checked={personData.hasWill === 'No'}
                onChange={() => handleChange('hasWill', 'No', person)}
              />
              No
            </label>
          </div>
        </div>

        {personData.hasWill === 'No' && (
          <div className="form-group">
            <label>If No, would you like to be referred?</label>
            <div>
              <label>
                <input
                  type="radio"
                  value="Yes"
                  checked={personData.referForWill === 'Yes'}
                  onChange={() => handleChange('referForWill', 'Yes', person)}
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  value="No"
                  checked={personData.referForWill === 'No'}
                  onChange={() => handleChange('referForWill', 'No', person)}
                />
                No
              </label>
            </div>
          </div>
        )}

        <div className="form-group">
          <label>Have you granted Power Of Attorney?</label>
          <div>
            <label>
              <input
                type="radio"
                value="Yes"
                checked={personData.powerOfAttorney === 'Yes'}
                onChange={() => handleChange('powerOfAttorney', 'Yes', person)}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                value="No"
                checked={personData.powerOfAttorney === 'No'}
                onChange={() => handleChange('powerOfAttorney', 'No', person)}
              />
              No
            </label>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div className="form-buttons">
          <div className="form-buttons-card">
            <button className="back-button" type="button" onClick={() => navigate(-1)}>Back</button>
          </div>
          <div className="form-buttons-card">
            <button className="form-submit" type="submit">Save</button>
            <button className="next-button" type="button" onClick={() => navigate('/mortgage/add-details/application-type')}>Next</button>
          </div>
        </div>

        <div className="form-group">
          {Object.keys(errors).length > 0 && (
            <div ref={errorRef} className="error-message">
              {Object.values(errors).join(", ")}
            </div>
          )}
        </div>
        
        <h3>Emergency Fund</h3>

        {renderEmergencyFundForm('applicant', 'Your Details')}

        {hasPartner && renderEmergencyFundForm('partner', "Partner's Details")}

        <div className="form-buttons">
          <div className="form-buttons-card">
            <button className="back-button" type="button" onClick={() => navigate(-1)}>Back</button>
          </div>
          <div className="form-buttons-card">
            <button className="form-submit" type="submit">Save</button>
            <button className="next-button" type="button" onClick={() => navigate('/mortgage/add-details/application-type')}>Next</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EmergencyFund;