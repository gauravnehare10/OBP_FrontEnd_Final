import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useFormStore from '../../store';
import { validateEarlyRepayment } from './EarlyRepaymentForm/Validations';

const initialEarlyRepayment = {
  repayPlans: '',
  moveHome: '',
  ercExplanation: '',
  preferredReason: '',
};

const EarlyRepayment = () => {
  const [ errors, setErrors ] = useState([]);
  const errorRef = useRef(null);
  const navigate = useNavigate();
  const { formData, fetchFormData, updateFormData } = useFormStore();
  const [hasPartner, setHasPartner] = useState(false);
  const [earlyRepaymentData, setEarlyRepaymentData] = useState({
    applicant: { ...initialEarlyRepayment },
    partner: { ...initialEarlyRepayment }
  });

  const handleChange = (e, person = 'applicant') => {
    const { name, value } = e.target;
    // Remove the person prefix if present
    const fieldName = name.replace(`${person}-`, '');
    setEarlyRepaymentData(prev => ({
      ...prev,
      [person]: {
        ...prev[person],
        [fieldName]: value,
      }
    }));
  };  

  useEffect(() => {
    fetchFormData("mainDetails");
    fetchFormData("earlyRepaymentData");
  }, [fetchFormData]);

  useEffect(() => {
    if (formData.mainDetails) {
      setHasPartner(formData.mainDetails.partners?.length > 0);
    }
    
    if (formData.earlyRepaymentData) {
      setEarlyRepaymentData({
        applicant: {
          ...initialEarlyRepayment,
          ...(formData.earlyRepaymentData.applicant || {})
        },
        partner: {
          ...initialEarlyRepayment,
          ...(formData.earlyRepaymentData.partner || {})
        }
      });
    }
  }, [formData.earlyRepaymentData, formData.mainDetails]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateEarlyRepayment(earlyRepaymentData, hasPartner);
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
    updateFormData('earlyRepaymentData', earlyRepaymentData);
    navigate('/mortgage/add-details/prioritise-your-needs');
  };

  const renderEarlyRepaymentForm = (person, title) => {
    const personData = earlyRepaymentData[person] || { ...initialEarlyRepayment };
    
    return (
      <>
        <h4>{title}</h4>

        {/* Question 1 */}
        <div className="form-group">
          <label>Do you have any plans to repay part or all of the mortgage in the foreseeable future?</label>
          <div>
            <label>
              <input
                type="radio"
                name={`${person}-repayPlans`}  // Changed to include person prefix
                value="Yes"
                checked={personData.repayPlans === 'Yes'}
                onChange={(e) => handleChange(e, person)}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name={`${person}-repayPlans`}  // Changed to include person prefix
                value="No"
                checked={personData.repayPlans === 'No'}
                onChange={(e) => handleChange(e, person)}
              />
              No
            </label>
          </div>
        </div>

        {/* Question 2 */}
        <div className="form-group">
          <label>Are you likely to move home within the foreseeable future (other than this transaction)?</label>
          <div>
            <label>
              <input
                type="radio"
                name={`${person}-moveHome`}  // Changed to include person prefix
                value="Yes"
                checked={personData.moveHome === 'Yes'}
                onChange={(e) => handleChange(e, person)}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name={`${person}-moveHome`}  // Changed to include person prefix
                value="No"
                checked={personData.moveHome === 'No'}
                onChange={(e) => handleChange(e, person)}
              />
              No
            </label>
          </div>
        </div>

        {/* Question 3 */}
        <div className="form-group">
          <label>Please explain to your customer what an ERC is and in the Customer's Own Words, record the customer's attitude in terms of preferences and trade-offs between improved rate and potential ERC</label>
          <textarea
            name="ercExplanation"
            value={personData.ercExplanation}
            onChange={(e) => handleChange(e, person)}
            rows="4"
          />
        </div>

        <h5>Product Types</h5>

        {/* Question 4 */}
        <label>Please tell me:</label>
        <div className="form-group">
          <label>
              <ul>
              <li>
                  What is your preference?
              </li>
              <li>
                  Why? Please note the reason for this preference.
              </li>
              <li>
                  Having explained the available terms and taking into account your future anticipated plans, what term would you prefer to be tied in for and why?
              </li>
              </ul>
          </label>
          <textarea
              name="preferredReason"
              value={personData.preferredReason}
              onChange={(e) => handleChange(e, person)}
              rows="3"
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
          <button className="next-button" type="button" onClick={() => navigate('/mortgage/add-details/prioritise-your-needs')}>Next</button>
        </div>
      </div>

      <div className="form-group">
        {Object.keys(errors).length > 0 && (
          <div ref={errorRef} className="error-message">
            {Object.values(errors).join(", ")}
          </div>
        )}
      </div>

      <h3>Early Replacement and Moving Home</h3>

      {renderEarlyRepaymentForm('applicant', 'Your Details')}

      {hasPartner && renderEarlyRepaymentForm('partner', "Partner's Details")}

      <div className='form-buttons'>
        <div className='form-buttons-card'>
          <button className="back-button" type="button" onClick={() => navigate(-1)}>Back</button>
        </div>
        <div className='form-buttons-card'>
          <button className="form-submit" type="submit">Save</button>
          <button className="next-button" type="button" onClick={() => navigate('/mortgage/add-details/prioritise-your-needs')}>Next</button>
        </div>
      </div>
    </form>
  );
};

export default EarlyRepayment;