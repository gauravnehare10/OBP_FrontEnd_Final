import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFormStore from '../../store';

const SelfEmpIncomeDetails = () => {
  const { formData, fetchFormData, updateFormData } = useFormStore();
  const [selfEmpIncomeData, setSelfEmpIncomeData] = useState({
    isDirector: '',
    shareholdingPercentage: '',
    annualNetProfitLastYear: '',
    annualNetProfit2YearsAgo: '',
    annualNetProfit3YearsAgo: '',
    dividendsLastYear: '',
    dividends2YearsAgo: '',
    dividends3YearsAgo: '',
    payeSalaryLastYear: '',
    payeSalary2YearsAgo: '',
    payeSalary3YearsAgo: '',
    currentNetMonthlyIncome: '',
  });

  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setSelfEmpIncomeData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    fetchFormData("selfEmployedIncomeData")
  }, [fetchFormData]);
  
  useEffect(() => {
    if (formData.selfEmployedIncomeData) {
      setSelfEmpIncomeData(formData.selfEmployedIncomeData);
    }
  }, [formData.selfEmployedIncomeData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateFormData("selfEmployedIncomeData", selfEmpIncomeData);
    navigate('/mortgage/add-details/secondary-occupation');
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className='form-buttons'>
        <div className='form-buttons-card'>
          <button className="back-button" type="button" onClick={() => navigate(-1)}>Back</button>
        </div>
        <div className='form-buttons-card'>
          <button className="form-submit" type="submit">Save</button>
          <button className="next-button" type="button" onClick={() => navigate('/mortgage/add-details/secondary-occupation')}>Next</button>
        </div>
      </div>
      <h3>Self Employed or Director/Shareholder Income Details</h3>

      {/* Are you a limited company director? */}
      <div className="form-group">
        <label>Are you a limited company director?</label>
        <div>
          <label>
            <input
              type="radio"
              name="isDirector"
              value="Yes"
              checked={selfEmpIncomeData.isDirector === 'Yes'}
              onChange={(e) => handleChange('isDirector', e.target.value)}
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              name="isDirector"
              value="No"
              checked={selfEmpIncomeData.isDirector === 'No'}
              onChange={(e) => handleChange('isDirector', e.target.value)}
            />
            No
          </label>
        </div>
      </div>

      {/* Conditional Fields for Directors */}
      {selfEmpIncomeData.isDirector === 'Yes' && (
        <>
          <div className="form-group">
            <label>What percentage of shareholding do you have?</label>
            <input
              type="number"
              value={selfEmpIncomeData.shareholdingPercentage}
              onChange={(e) => handleChange('shareholdingPercentage', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Annual Net Profit Last Year:</label>
            <input
              type="number"
              value={selfEmpIncomeData.annualNetProfitLastYear}
              onChange={(e) => handleChange('annualNetProfitLastYear', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Annual Net Profit 2 Years Ago:</label>
            <input
              type="number"
              value={selfEmpIncomeData.annualNetProfit2YearsAgo}
              onChange={(e) => handleChange('annualNetProfit2YearsAgo', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Annual Net Profit 3 Years Ago:</label>
            <input
              type="number"
              value={selfEmpIncomeData.annualNetProfit3YearsAgo}
              onChange={(e) => handleChange('annualNetProfit3YearsAgo', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Dividends Last Year:</label>
            <input
              type="number"
              value={selfEmpIncomeData.dividendsLastYear}
              onChange={(e) => handleChange('dividendsLastYear', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Dividends 2 Years Ago:</label>
            <input
              type="number"
              value={selfEmpIncomeData.dividends2YearsAgo}
              onChange={(e) => handleChange('dividends2YearsAgo', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Dividends 3 Years Ago:</label>
            <input
              type="number"
              value={selfEmpIncomeData.dividends3YearsAgo}
              onChange={(e) => handleChange('dividends3YearsAgo', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>PAYE Salary Last Year:</label>
            <input
              type="number"
              value={selfEmpIncomeData.payeSalaryLastYear}
              onChange={(e) => handleChange('payeSalaryLastYear', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>PAYE Salary 2 Years Ago:</label>
            <input
              type="number"
              value={selfEmpIncomeData.payeSalary2YearsAgo}
              onChange={(e) => handleChange('payeSalary2YearsAgo', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>PAYE Salary 3 Years Ago:</label>
            <input
              type="number"
              value={selfEmpIncomeData.payeSalary3YearsAgo}
              onChange={(e) => handleChange('payeSalary3YearsAgo', e.target.value)}
            />
          </div>
        </>
      )}

      {/* Fields for Non-Directors */}
      {selfEmpIncomeData.isDirector === 'No' && (
        <>
          <div className="form-group">
            <label>Annual Net Profit Last Year:</label>
            <input
              type="number"
              value={selfEmpIncomeData.annualNetProfitLastYear}
              onChange={(e) => handleChange('annualNetProfitLastYear', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Annual Net Profit 2 Years Ago:</label>
            <input
              type="number"
              value={selfEmpIncomeData.annualNetProfit2YearsAgo}
              onChange={(e) => handleChange('annualNetProfit2YearsAgo', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Annual Net Profit 3 Years Ago:</label>
            <input
              type="number"
              value={selfEmpIncomeData.annualNetProfit3YearsAgo}
              onChange={(e) => handleChange('annualNetProfit3YearsAgo', e.target.value)}
            />
          </div>
        </>
      )}

      {/* Common Field for All */}
      <div className="form-group">
        <label>Current Net Monthly Income:</label>
        <input
          type="number"
          value={selfEmpIncomeData.currentNetMonthlyIncome}
          onChange={(e) => handleChange('currentNetMonthlyIncome', e.target.value)}
        />
      </div>
      { selfEmpIncomeData.isDirector === "Yes" && (
        <div className='form-buttons'>
            <div className='form-buttons-card'>
            <button className="back-button" type="button" onClick={() => navigate(-1)}>Back</button>
            </div>
            <div className='form-buttons-card'>
            <button className="form-submit" type="submit">Save</button>
            <button className="next-button" type="button" onClick={() => navigate('/mortgage/add-details/secondary-occupation')}>Next</button>
            </div>
        </div>
      )}
    </form>
  );
};

export default SelfEmpIncomeDetails;