import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useFormStore from '../store';
import EmployerBenefitForm from './EmployerBenefitForm/EmployerBenefitForm';
import FormButtons from '../inc/FormButtons/FormButton';
import validateEmployerBenefit from './EmployerBenefitForm/Validations';

const EmployerBenefit = () => {
  const navigate = useNavigate();
  const { formData, fetchFormData, updateFormData } = useFormStore();
  const errorRef = useRef(null);
  const [errors, setErrors] = useState({});
  

  const initialBenefitData = {
    sickPayOtherThanSSP: '',
    employerBenefits: [],
    furtherDetails: "",
    otherFlexibleBenefits: '',
    includeInShortfall: '',
  };

  // State for both client and partner
  const [benefitData, setBenefitData] = useState({
    client: { ...initialBenefitData },
    partner: { ...initialBenefitData }
  });

  const [occupationData, setOccupationData] = useState({
    client: {},
    partner: {}
  });

  // Check if partner exists
  const hasPartner = formData?.mainDetails?.partners?.length > 0;

  // Generic change handler for both clients
  const handleChange = (clientType) => (field, value) => {
    setBenefitData(prev => ({
      ...prev,
      [clientType]: {
        ...prev[clientType],
        [field]: value
      }
    }));
  };

  // Generic checkbox handler for both clients
  const handleCheckboxChange = (clientType) => (value) => {
    setBenefitData(prev => {
      const updatedBenefits = prev[clientType].employerBenefits.includes(value)
        ? prev[clientType].employerBenefits.filter(b => b !== value)
        : [...prev[clientType].employerBenefits, value];
      
      return {
        ...prev,
        [clientType]: {
          ...prev[clientType],
          employerBenefits: updatedBenefits
        }
      };
    });
  };

  // Fetch all required data
  useEffect(() => {
    fetchFormData("employerBenefitData");
    fetchFormData("occupationData");
    fetchFormData("mainDetails");
  }, [fetchFormData]);
  
  // Initialize benefit data
  useEffect(() => {
    if (formData.employerBenefitData) {
      setBenefitData(prev => ({
        client: { ...initialBenefitData, ...formData.employerBenefitData.client },
        partner: { 
          ...initialBenefitData, 
          ...formData.employerBenefitData.partner,
          // Only include shortfall question for main client
          includeInShortfall: prev.partner.includeInShortfall || ''
        }
      }));
    }
  }, [formData.employerBenefitData]);

  // Initialize occupation data
  useEffect(() => {
    if (formData.occupationData) {
      setOccupationData({
        client: { ...formData.occupationData.client },
        partner: { ...formData.occupationData.partner }
      });
    }
  }, [formData.occupationData]);

  // Handle navigation based on occupation status
  const handleNext = () => {
    if (occupationData.client.status === "Self-Employed") {
      navigate('/mortgage/add-details/self-employed-details');
    } else {
      navigate('/mortgage/add-details/secondary-occupation');
    }
  };

  // Submit both client and partner data
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateEmployerBenefit(benefitData, hasPartner);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      setTimeout(() => {
        if (errorRef.current) {
          errorRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
      return;
    }
    await updateFormData("employerBenefitData", benefitData);
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <FormButtons
        onBack={() => navigate(-1)}
        onNext={handleNext}
      />
      <div className="form-group">
        {Object.keys(errors).length > 0 && (
          <div ref={errorRef} className="error-message">
            {Object.values(errors).join(", ")}
          </div>
        )}
      </div>
      {/* Main Client Form */}
      <EmployerBenefitForm
        data={benefitData.client}
        handleChange={handleChange('client')}
        handleCheckboxChange={handleCheckboxChange('client')}
        isMainForm={true}
        title="Client 1 Employer Benefits Details"
        prefix="client1_"
      />

      {/* Partner Form (conditionally rendered) */}
      {hasPartner && (
        <EmployerBenefitForm
          data={benefitData.partner}
          handleChange={handleChange('partner')}
          handleCheckboxChange={handleCheckboxChange('partner')}
          isMainForm={false}
          title="Client 2 Employer Benefits Details"
          prefix="client2_"
        />
      )}

      <FormButtons
        onBack={() => navigate(-1)}
        onNext={handleNext}
      />
    </form>
  );
};

export default EmployerBenefit;