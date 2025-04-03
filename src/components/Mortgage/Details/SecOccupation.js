import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useFormStore from '../store';
import FormButtons from '../inc/FormButtons/FormButton';
import validateSecOccupation from './SecOccupationForm/Validations';

const initialSecondaryOccupation = {
  hasAddEarnedIncome: '',
  secondaryEmploymentStatus: '',
  selfEmployedType: '',
  occupationStatus: '',
  secondaryOccupationTitle: '',
  hoursOfWork: '',
  secondaryEmployerName: '',
  secondaryEmployerPostcode: '',
  secondaryEmployerAddress: ['', '', '', '', ''],
};

const SecOccupation = () => {
  const navigate = useNavigate();
  const { formData, fetchFormData, updateFormData } = useFormStore();
  const [errors, setErrors] = useState({});
  const errorRef = useRef(null);
  
  const [hasPartner, setHasPartner] = useState(false);
  const [secondaryOccupation, setSecondaryOccupation] = useState({
    applicant: { ...initialSecondaryOccupation },
    partner: { ...initialSecondaryOccupation }
  });

  useEffect(() => {
    fetchFormData("mainDetails");
    fetchFormData("secondaryOccupationData"); // This should contain both applicant and partner data
  }, [fetchFormData]);
  
  useEffect(() => {
    if (formData.mainDetails) {
      setHasPartner(formData.mainDetails.partners?.length > 0);
    }
    
    if (formData.secondaryOccupationData) {
      setSecondaryOccupation({
        applicant: {
          ...initialSecondaryOccupation,
          ...(formData.secondaryOccupationData.applicant || {})
        },
        partner: {
          ...initialSecondaryOccupation,
          ...(formData.secondaryOccupationData.partner || {})
        }
      });
    }
  }, [formData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationErrors = validateSecOccupation(secondaryOccupation.applicant, secondaryOccupation.partner, hasPartner, shouldAskQuestions);
  
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setTimeout(() => {
        if (errorRef.current) {
          errorRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
      return;
    }
  
    updateFormData("secondaryOccupationData", secondaryOccupation);
    navigate('/mortgage/add-details/other-monthly-income');
  };
  

  const handleAddressChange = (index, value, person = 'applicant') => {
    const updatedAddress = [...(secondaryOccupation[person].secondaryEmployerAddress || ['', '', '', '', ''])];
    updatedAddress[index] = value;
    
    setSecondaryOccupation(prev => ({
      ...prev,
      [person]: {
        ...prev[person],
        secondaryEmployerAddress: updatedAddress,
      }
    }));
  };

  const findAddress = async (postcode, person = 'applicant') => {
    if (!postcode || typeof postcode !== 'string') {
      alert('Please enter a valid postcode.');
      return;
    }

    try {
      const response = await axios.get(
        `https://api.postcodes.io/postcodes/${postcode.trim()}`
      );
      const { admin_district, admin_ward } = response.data.result || {};
      const updatedAddress = [
        '',
        admin_district || '',
        admin_ward || '',
        '',
        'United Kingdom',
      ];
      
      setSecondaryOccupation(prev => ({
        ...prev,
        [person]: {
          ...prev[person],
          secondaryEmployerAddress: updatedAddress,
        }
      }));
    } catch (error) {
      alert('Error fetching address. Please check the postcode.');
      console.error('Address lookup error:', error);
    }
  };

  const shouldAskQuestions = (data) => {
    return data?.hasAddEarnedIncome === 'Yes' &&
      (data?.secondaryEmploymentStatus === 'Employed' ||
        (data?.secondaryEmploymentStatus === 'Self-Employed' &&
          data?.selfEmployedType === 'Director (less than 20% shareholding)') ||
        data?.secondaryEmploymentStatus === 'Temporary');
  };

  const renderSecondaryOccupationForm = (person, title) => {
    const data = secondaryOccupation[person] || { ...initialSecondaryOccupation };
    
    return (
      <>
        <div className="form-group">
          {Object.keys(errors).length > 0 && (
            <div ref={errorRef} className="error-message">
              {Object.values(errors).join(", ")}
            </div>
          )}
        </div>

        <h4>{title}</h4>
        <div className="form-group">
          <label>Do you have any additional Earned income?</label>
          <div>
            <label>
              <input
                type="radio"
                name={`hasAddEarnedIncome-${person}`}
                value="Yes"
                checked={data.hasAddEarnedIncome === 'Yes'}
                onChange={(e) =>
                  setSecondaryOccupation(prev => ({
                    ...prev,
                    [person]: {
                      ...prev[person],
                      hasAddEarnedIncome: e.target.value,
                    }
                  }))
                }
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name={`hasAddEarnedIncome-${person}`}
                value="No"
                checked={data.hasAddEarnedIncome === 'No'}
                onChange={(e) =>
                  setSecondaryOccupation(prev => ({
                    ...prev,
                    [person]: {
                      ...prev[person],
                      hasAddEarnedIncome: e.target.value,
                    }
                  }))
                }
              />
              No
            </label>
          </div>
        </div>

        {data.hasAddEarnedIncome === 'Yes' && (
          <>
            <div className="form-group">
              <label>Secondary Employment Status:</label>
              <select
                value={data.secondaryEmploymentStatus || ''}
                onChange={(e) =>
                  setSecondaryOccupation(prev => ({
                    ...prev,
                    [person]: {
                      ...prev[person],
                      secondaryEmploymentStatus: e.target.value,
                    }
                  }))
                }
              >
                <option value="">Select Status</option>
                <option value="Employed">Employed</option>
                <option value="Self-Employed">Self-Employed</option>
                <option value="Temporary">Temporary</option>
              </select>
            </div>

            {data.secondaryEmploymentStatus === 'Self-Employed' && (
              <div className="form-group">
                <label>Self-Employed Type:</label>
                <select
                  value={data.selfEmployedType || ''}
                  onChange={(e) =>
                    setSecondaryOccupation(prev => ({
                      ...prev,
                      [person]: {
                        ...prev[person],
                        selfEmployedType: e.target.value,
                      }
                    }))
                  }
                >
                  <option value="">Select Type</option>
                  <option value="Director (20% shareholding +)">
                    Director (20% shareholding +)
                  </option>
                  <option value="Director (less than 20% shareholding)">
                    Director (less than 20% shareholding)
                  </option>
                  <option value="Sole Trader">Sole Trader</option>
                  <option value="Partnership">Partnership</option>
                </select>
              </div>
            )}

            {shouldAskQuestions(data) && (
              <>
                <div className="form-group">
                  <label>Occupation Status:</label>
                  <select
                    value={data.occupationStatus || ''}
                    onChange={(e) =>
                      setSecondaryOccupation(prev => ({
                        ...prev,
                        [person]: {
                          ...prev[person],
                          occupationStatus: e.target.value,
                        }
                      }))
                    }
                  >
                    <option value="">Select Status</option>
                    <option value="Permanent">Permanent</option>
                    <option value="Contract">Contract</option>
                    <option value="Part-Time">Part-Time</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Secondary Occupation Title:</label>
                  <input
                    type="text"
                    value={data.secondaryOccupationTitle || ''}
                    onChange={(e) =>
                      setSecondaryOccupation(prev => ({
                        ...prev,
                        [person]: {
                          ...prev[person],
                          secondaryOccupationTitle: e.target.value,
                        }
                      }))
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Hours of Work:</label>
                  <input
                    type="number"
                    value={data.hoursOfWork || ''}
                    onChange={(e) =>
                      setSecondaryOccupation(prev => ({
                        ...prev,
                        [person]: {
                          ...prev[person],
                          hoursOfWork: e.target.value,
                        }
                      }))
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Name of Secondary Employer:</label>
                  <input
                    type="text"
                    value={data.secondaryEmployerName || ''}
                    onChange={(e) =>
                      setSecondaryOccupation(prev => ({
                        ...prev,
                        [person]: {
                          ...prev[person],
                          secondaryEmployerName: e.target.value,
                        }
                      }))
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Address Search (Postcode):</label>
                  <input
                    type="text"
                    value={data.secondaryEmployerPostcode || ''}
                    onChange={(e) =>
                      setSecondaryOccupation(prev => ({
                        ...prev,
                        [person]: {
                          ...prev[person],
                          secondaryEmployerPostcode: e.target.value,
                        }
                      }))
                    }
                  />
                </div>

                <div className="form-group">
                  <button
                    type="button"
                    className='address-button'
                    onClick={() =>
                      findAddress(data.secondaryEmployerPostcode, person)
                    }
                  >
                    Find Address
                  </button>
                </div>
                {(data.secondaryEmployerAddress || ['', '', '', '', '']).map(
                  (addr, addrIdx) => (
                    <div key={addrIdx} className="form-group">
                      <label>Address {addrIdx + 1}:</label>
                      <input
                        type="text"
                        value={addr || ''}
                        onChange={(e) =>
                          handleAddressChange(addrIdx, e.target.value, person)
                        }
                      />
                    </div>
                  )
                )}
              </>
            )}
          </>
        )}
      </>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <FormButtons
        onBack={() => navigate(-1)}
        onNext={() => navigate('/mortgage/add-details/other-monthly-income')}
      />

      <h3>Secondary Occupation Details</h3>
      
      {renderSecondaryOccupationForm('applicant', 'Your Secondary Occupation')}

      {hasPartner && renderSecondaryOccupationForm('partner', "Partner's Secondary Occupation")}

      
      <FormButtons
        onBack={() => navigate(-1)}
        onNext={() => navigate('/mortgage/add-details/other-monthly-income')}
      />
    </form>
  );
};

export default SecOccupation;