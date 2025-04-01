import { useState, useEffect, useRef } from 'react';
import '../../PersonalDetails/PersonalDetails.css';
import { useNavigate } from 'react-router-dom';
import useFormStore from '../../store';

const Declaration = () => {
  const { formData, fetchFormData, updateFormData } = useFormStore();
  const [error, setError] = useState();
  const errorRef = useRef(null);
  const [declaration, setDeclaration] = useState({
    confirmInformation: false,
    understandLimitedAdvice: false,
    understandFalseRepresentation: false,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setDeclaration((prev) => ({ ...prev, [name]: checked }));
  };

  useEffect(() => {
      fetchFormData("declaration");
    }, [fetchFormData]);
  
    useEffect(() => {
      if (formData.declaration) {
        setDeclaration({
          confirmInformation: formData.declaration?.confirmInformation || false,
          understandLimitedAdvice: formData.declaration?.understandLimitedAdvice || false,
          understandFalseRepresentation: formData.declaration?.understandFalseRepresentation || false,
        });
      }
    }, [formData.declaration]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const allDeclarationsChecked = Object.values(declaration).every((value) => value === true);

    if (!allDeclarationsChecked) {
      setError("Please confirm all declarations before submitting.");
      
      setTimeout(() => {
        errorRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 100);
      return;
    }
    setError('');
    updateFormData("declaration", declaration)
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className='form-buttons'>
        <div className='form-buttons-card'>
          <button className="back-button" type="button" onClick={() => navigate(-1)}>Back</button>
        </div>
        <div className='form-buttons-card'>
          <button className="form-submit" type="submit">Submit</button>
        </div>
      </div>

      {error && (
        <div ref={errorRef} className="error-message">
          {error}
        </div>
      )}

      <h2>Declaration</h2>

      <div className="form-group">
        <label htmlFor='confirmInformation'>
            I/we confirm that the information detailed on this form is accurate and complete. I/we understand that advice and recommendations will be made based on this information.
        </label>
        <div>
          <input
            type="checkbox"
            name="confirmInformation"
            checked={declaration.confirmInformation}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor='understandLimitedAdvice'>
            • My/our adviser will be unable to take into account all of my/our personal circumstances when giving advice or making recommendations. This will restrict the ability of my/our adviser to provide the most appropriate advice or recommendations.
        </label>
        <div>
          <input
            type="checkbox"
            name="understandLimitedAdvice"
            checked={declaration.understandLimitedAdvice}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor='understandFalseRepresentation'>
            • Where I have knowingly made false or misleading representations to my advisor or provided information which is subsequently found to be false, this may mean that my transaction will not proceed, notwithstanding any costs I have incurred and/or that my adviser may be required to disclose that I have made such false representations. Such disclosure may be made to any provider who may consider my application or any regulatory or supervising authority.
        </label>
        <div>
          <input
            type="checkbox"
            name="understandFalseRepresentation"
            checked={declaration.understandFalseRepresentation}
            onChange={handleChange}
          />
        </div>
      </div>

      <button className="form-submit" type="submit">Submit</button>
    </form>
  );
};

export default Declaration;
