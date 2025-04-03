import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useFormStore from '../../store';
import { validatePrioritiseNeeds } from './PrioritiseNeedsForm/Validations';

const initialPrioritiseNeeds = {
  importantFeatures: '',
  importanceReason: '',
};

const PrioritiseNeeds = () => {
  const [ errors, setErrors ] = useState([]);
  const errorRef = useRef(null);
  const { formData, fetchFormData, updateFormData } = useFormStore();
  const navigate = useNavigate();
  const [hasPartner, setHasPartner] = useState(false);
  const [prioritiseNeedsData, setPrioritiseNeedsData] = useState({
    applicant: { ...initialPrioritiseNeeds },
    partner: { ...initialPrioritiseNeeds }
  });

  const handleChange = (e, person = 'applicant') => {
    const { name, value } = e.target;
    setPrioritiseNeedsData(prev => ({
      ...prev,
      [person]: {
        ...prev[person],
        [name]: value,
      }
    }));
  };

  useEffect(() => {
    fetchFormData("mainDetails");
    fetchFormData("prioritiseNeedsData");
  }, [fetchFormData]);

  useEffect(() => {
    if (formData.mainDetails) {
      setHasPartner(formData.mainDetails.partners?.length > 0);
    }
    
    if (formData.prioritiseNeedsData) {
      setPrioritiseNeedsData({
        applicant: {
          ...initialPrioritiseNeeds,
          ...(formData.prioritiseNeedsData.applicant || {})
        },
        partner: {
          ...initialPrioritiseNeeds,
          ...(formData.prioritiseNeedsData.partner || {})
        }
      });
    }
  }, [formData.prioritiseNeedsData, formData.mainDetails]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validatePrioritiseNeeds(prioritiseNeedsData, hasPartner);
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
    updateFormData('prioritiseNeedsData', prioritiseNeedsData);
    navigate('/mortgage/add-details/establish-budget');
  };

  const renderPrioritiseNeedsForm = (person, title) => {
    const personData = prioritiseNeedsData[person] || { ...initialPrioritiseNeeds };
    
    return (
      <>
        <h4>{title}</h4>

        {/* Question 1 */}
        <div className="form-group">
          <label>Which of the following features are important to you and why?</label>
          <textarea
              name="importantFeatures"
              value={personData.importantFeatures}
              onChange={(e) => handleChange(e, person)}
              rows="4"
          />
        </div>
        <div className='form-group'>
          <label>
              <ul>
              <li>No up-front costs (Free Legal, Free Lender Fees and Free Valuation)</li>
              <li>Cashback</li>
              <li>Portable</li>
              <li>Guarantor Acceptable</li>
              <li>Offset Mortgage</li>
              <li>Ability to make overpayments</li>
              <li>Ability to make Repayment Holidays</li>
              <li>No Higher Lending Charges</li>
              <li>No Early Repayment Charges</li>
              <li>No Early Repayment Charges on Partial Repayments</li>
              <li>No Early Repayment Charges payable at the end of the incentive period</li>
              <li>Speed of Completion</li>
              <li>The ability to add fees to your mortgage (extra interest will be payable)</li>
              <li>To minimise any lender arrangement costs (No Booking Fees and No Arrangement Fees)</li>
              </ul>
          </label>
        </div>

        {/* Question 2 */}
        <div className="form-group">
          <label>Please tell me why they are important to you?</label>
          <textarea
            name="importanceReason"
            value={personData.importanceReason}
            onChange={(e) => handleChange(e, person)}
            rows="4"
          />
        </div>
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
          <button className="next-button" type="button" onClick={() => navigate('/mortgage/add-details/establish-budget')}>Next</button>
        </div>
      </div>

      <div className="form-group">
          {Object.keys(errors).length > 0 && (
            <div ref={errorRef} className="error-message">
              {Object.values(errors).join(", ")}
            </div>
          )}
        </div>

      <h3>Prioritise Your Needs</h3>

      {renderPrioritiseNeedsForm('applicant', 'Your Priorities')}

      {hasPartner && renderPrioritiseNeedsForm('partner', "Partner's Priorities")}

      <div className='form-buttons'>
        <div className='form-buttons-card'>
          <button className="back-button" type="button" onClick={() => navigate(-1)}>Back</button>
        </div>
        <div className='form-buttons-card'>
          <button className="form-submit" type="submit">Save</button>
          <button className="next-button" type="button" onClick={() => navigate('/mortgage/add-details/establish-budget')}>Next</button>
        </div>
      </div>
    </form>
  );
};

export default PrioritiseNeeds;