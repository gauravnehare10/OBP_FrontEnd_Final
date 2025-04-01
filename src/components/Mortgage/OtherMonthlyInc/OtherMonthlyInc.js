import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../PersonalDetails/PersonalDetails.css';
import useFormStore from '../store';
import { validateOtherMonthlyIncome } from './OtherMonthlyIncForm/Validations';

const initialIncomeData = {
  occupationalPension: '',
  personalPension: '',
  statePension: '',
  investments: '',
  maintenance: '',
  rentalIncome: '',
  receivesStateBenefits: '',
  totalOtherIncome: '',
  stateBenefits: {
    childBenefit: '',
    childTaxCredits: '',
    workingTaxCredits: '',
    disabilityLivingAllowance: '',
    attendanceAllowance: '',
    housingBenefit: '',
    employmentSupportAllowance: '',
    other: '',
  },
};

const OtherMonthlyInc = () => {
  const navigate = useNavigate();
  const { formData, fetchFormData, updateFormData } = useFormStore();

  const [errors, setErrors] = useState({})
  const errorRef = useRef();

  const [hasPartner, setHasPartner] = useState(false);
  const [incomeData, setIncomeData] = useState({
    applicant: { ...initialIncomeData },
    partner: { ...initialIncomeData }
  });

  const handleChange = (field, value, person = 'applicant') => {
    setIncomeData(prev => ({
      ...prev,
      [person]: {
        ...prev[person],
        [field]: value
      }
    }));
  };

  const handleStateBenefitsChange = (field, value, person = 'applicant') => {
    setIncomeData(prev => ({
      ...prev,
      [person]: {
        ...prev[person],
        stateBenefits: {
          ...prev[person].stateBenefits,
          [field]: value
        }
      }
    }));
  };

  const calculateTotalIncome = (person = 'applicant') => {
    const personData = incomeData[person];
    const total = [
      personData.occupationalPension,
      personData.personalPension,
      personData.statePension,
      personData.investments,
      personData.maintenance,
      personData.rentalIncome,
      ...(personData.receivesStateBenefits === 'Yes'
        ? Object.values(personData.stateBenefits)
        : []),
    ].reduce((sum, val) => sum + (parseFloat(val) || 0), 0);

    handleChange('totalOtherIncome', total.toFixed(2), person);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateOtherMonthlyIncome(incomeData, hasPartner);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setTimeout(() => {
        if (errorRef.current) {
          errorRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
      return;
    }
    const updatedData = { ...incomeData };
    
    ['applicant', 'partner'].forEach(person => {
      if (updatedData[person].receivesStateBenefits === "No") {
        updatedData[person] = {
          ...updatedData[person],
          stateBenefits: { ...initialIncomeData.stateBenefits }
        };
      }
    });

    setIncomeData(updatedData);
    updateFormData('otherMonthlyIncome', updatedData);
    console.log(updatedData);
    navigate('/mortgage/add-details/other-income-source');
  };

  useEffect(() => {
    fetchFormData("mainDetails");
    fetchFormData("otherMonthlyIncome");
  }, [fetchFormData]);

  useEffect(() => {
    if (formData.mainDetails) {
      setHasPartner(formData.mainDetails.partners?.length > 0);
    }
    
    if (formData.otherMonthlyIncome) {
      // Ensure we have both applicant and partner data, fallback to initial if missing
      setIncomeData({
        applicant: {
          ...initialIncomeData,
          ...(formData.otherMonthlyIncome.applicant || {})
        },
        partner: {
          ...initialIncomeData,
          ...(formData.otherMonthlyIncome.partner || {})
        }
      });
    }
  }, [formData]);

  const renderIncomeForm = (person, title) => {
    const personData = incomeData[person] || { ...initialIncomeData };
    
    return (
      <>
        <h4>{title}</h4>
        {[
          'occupationalPension',
          'personalPension',
          'statePension',
          'investments',
          'maintenance',
          'rentalIncome',
        ].map((field, idx) => (
          <div key={idx} className="form-group">
            <label>{field.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}:</label>
            <input
              type="number"
              value={personData[field]}
              onChange={(e) => handleChange(field, e.target.value, person)}
            />
          </div>
        ))}

        <div className="form-group">
          <label>Do you receive any State Benefits?</label>
          <div>
            <label>
              <input
                type="radio"
                name={`stateBenefits-${person}`}
                value="Yes"
                checked={personData.receivesStateBenefits === 'Yes'}
                onChange={(e) => handleChange('receivesStateBenefits', e.target.value, person)}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name={`stateBenefits-${person}`}
                value="No"
                checked={personData.receivesStateBenefits === 'No'}
                onChange={(e) => handleChange('receivesStateBenefits', e.target.value, person)}
              />
              No
            </label>
          </div>
        </div>

        {personData.receivesStateBenefits === 'Yes' && (
          <>
            <h5>State Benefits Details</h5>
            {[
              'childBenefit',
              'childTaxCredits',
              'workingTaxCredits',
              'disabilityLivingAllowance',
              'attendanceAllowance',
              'housingBenefit',
              'employmentSupportAllowance',
              'other',
            ].map((field, idx) => (
              <div key={idx} className="form-group">
                <label>
                  {field
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, (str) => str.toUpperCase())}:
                </label>
                <input
                  type="number"
                  value={personData.stateBenefits?.[field] || 0}
                  onChange={(e) => handleStateBenefitsChange(field, e.target.value, person)}
                />
              </div>
            ))}
          </>
        )}
        <div className="form-group">
          <button 
            type="button" 
            className="calc-button"
            onClick={() => calculateTotalIncome(person)}
          >
            Calculate Total Income
          </button>
        </div>

        <div className="form-group">
          <label>Total of Other Monthly Income:</label>
          <input type="number" value={personData.totalOtherIncome} readOnly />
        </div>
      </>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-buttons">
        <div className="form-buttons-card">
          <button className="back-button" type="button" onClick={() => navigate(-1)}>Back</button>
        </div>
        <div className="form-buttons-card">
          <button className="form-submit" type="submit">Save</button>
          <button className="next-button" type="button" onClick={() => navigate('/mortgage/add-details/other-income-source')}>Next</button>
        </div>
      </div>

      <div className="form-group">
        {Object.keys(errors).length > 0 && (
          <div ref={errorRef} className="error-message">
            {Object.values(errors).join(", ")}
          </div>
        )}  
      </div>

      <h3>Other Monthly Income Details</h3>

      {renderIncomeForm('applicant', 'Your Income')}

      {hasPartner && renderIncomeForm('partner', "Partner's Income")}

      <div className="form-buttons">
        <div className="form-buttons-card">
          <button className="back-button" type="button" onClick={() => navigate(-1)}>Back</button>
        </div>
        <div className="form-buttons-card">
          <button className="form-submit" type="submit">Save</button>
          <button className="next-button" type="button" onClick={() => navigate('/mortgage/add-details/other-income-source')}>Next</button>
        </div>
      </div>
    </form>
  );
};

export default OtherMonthlyInc;