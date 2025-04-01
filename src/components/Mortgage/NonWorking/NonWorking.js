import { useState, useEffect, useRef } from 'react';
import '../PersonalDetails/PersonalDetails.css';
import { useNavigate } from 'react-router-dom';
import useFormStore from '../store';
import validateNonWorking from './NonWorkingForm/Validations';
import FormButtons from '../inc/FormButtons/FormButton';

const initialNonWorkingData = {
  recOtherIncome: '',
  monthlyAmount: '',
  moneyOriginatedFrom: '',
};

const NonWorking = () => {
  const { formData, fetchFormData, updateFormData } = useFormStore();
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const errorRef = useRef(null);

  const [hasPartner, setHasPartner] = useState(false);
  const [nonWorkingData, setNonWorkingData] = useState({
    applicant: { ...initialNonWorkingData },
    partner: { ...initialNonWorkingData }
  });

  useEffect(() => {
    fetchFormData("mainDetails");
    fetchFormData("nonWorkingData");
  }, [fetchFormData]);

  useEffect(() => {
    if (formData.mainDetails) {
      setHasPartner(formData.mainDetails.partners?.length > 0);
    }
    
    if (formData.nonWorkingData) {
      setNonWorkingData({
        applicant: {
          ...initialNonWorkingData,
          ...(formData.nonWorkingData.applicant || {})
        },
        partner: {
          ...initialNonWorkingData,
          ...(formData.nonWorkingData.partner || {})
        }
      });
    }
  }, [formData]);

  const handleChange = (e, person = 'applicant') => {
    const { name, value } = e.target;
    setNonWorkingData(prev => ({
      ...prev,
      [person]: {
        ...prev[person],
        [name]: value,
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationErrors = validateNonWorking(nonWorkingData.applicant, nonWorkingData.partner, hasPartner);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setTimeout(() => {
        if (errorRef.current) {
          errorRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
      return;
    }
    const updatedData = { ...nonWorkingData };
    
    ['applicant', 'partner'].forEach(person => {
      if (updatedData[person].recOtherIncome === "No") {
        updatedData[person] = {
          ...updatedData[person],
          monthlyAmount: '',
          moneyOriginatedFrom: ''
        };
      }
    });

    updateFormData('nonWorkingData', updatedData);
    navigate("/mortgage/add-details/total-income");
  };

  const renderNonWorkingForm = (person, title) => {
    const personData = nonWorkingData[person] || { ...initialNonWorkingData };
    
    return (
      <>
        <h4>{title}</h4>
        <div className="form-group">
          <label>Do you receive other income / does someone else cover your expenses?</label>
          <div>
            <label>
              <input
                type="radio"
                name="recOtherIncome"
                value="Yes"
                checked={personData.recOtherIncome === 'Yes'}
                onChange={(e) => handleChange(e, person)}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="recOtherIncome"
                value="No"
                checked={personData.recOtherIncome === 'No'}
                onChange={(e) => handleChange(e, person)}
              />
              No
            </label>
          </div>
        </div>

        {personData.recOtherIncome === "Yes" && (
          <>
            <div className="form-group">
              <label>Monthly Amount Received:</label>
              <input
                name='monthlyAmount'
                type="number"
                value={personData.monthlyAmount}
                onChange={(e) => handleChange(e, person)}
              />
            </div>

            <div className="form-group">
              <label>Please provide details i.e. where the money originated from /or who pays?</label>
              <input
                name='moneyOriginatedFrom'
                type="text"
                value={personData.moneyOriginatedFrom}
                onChange={(e) => handleChange(e, person)}
              />
            </div>
          </>
        )}
      </>
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
          <button className="next-button" type="button" onClick={() => navigate('/mortgage/add-details/total-income')}>Next</button>
        </div>
      </div>

      <div className="form-group">
        {Object.keys(errors).length > 0 && (
          <div ref={errorRef} className="error-message">
            {Object.values(errors).join(", ")}
          </div>
        )}
      </div>

      <h3>Non-Working - Other Income Source</h3>

      {renderNonWorkingForm('applicant', 'Your Details')}

      {hasPartner && renderNonWorkingForm('partner', "Partner's Details")}

      <FormButtons 
        onNext={() => navigate('/mortgage/add-details/total-income')}
        onBack={() => navigate(-1)}
      />
      
    </form>
  );
};

export default NonWorking;