import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useFormStore from '../store';
import PersonalDetailsForm from './PersonalDetailsForm/PersonalDetailsForm';
import DependentForm from './DependentForm/DependentForm';
import FormButtons from '../inc/FormButtons/FormButton';
import { validatePersonalDetails } from './PersonalDetailsForm/Validations';

const PersonalDetails = () => {
  const navigate = useNavigate();
  const { formData, fetchFormData, updateFormData } = useFormStore();
  const [errors, setErrors] = useState({});
  const errorRef = useRef(null);

  // Main client state
  const [mainClientDetails, setMainClientDetails] = useState({
    title: '',
    forename: '',
    middleName: '',
    surname: '',
    previousName: '',
    dateOfNameChange: '',
    mothersMaidenName: '',
    dateOfBirth: '',
    age: '',
    genderAtBirth: '',
    identifiesAs: '',
    niNumber: '',
    relationshipStatus: '',
    nationality: '',
    isExPatriate: '',
    isPublicOfficial: '',
    countryOfResidence: '',
    tempOutsideUK: '',
    retirementAge: '',
    mobileNumber: '',
    daytimeNumber: '',
    hasDependents: '',
    dependents: [],
  });

  // Partner state
  const [partnerDetails, setPartnerDetails] = useState({
    title: '',
    forename: '',
    middleName: '',
    surname: '',
    previousName: '',
    dateOfNameChange: '',
    mothersMaidenName: '',
    dateOfBirth: '',
    age: '',
    genderAtBirth: '',
    identifiesAs: '',
    niNumber: '',
    relationshipStatus: '',
    nationality: '',
    isExPatriate: '',
    isPublicOfficial: '',
    countryOfResidence: '',
    tempOutsideUK: '',
    retirementAge: '',
    mobileNumber: '',
    daytimeNumber: '',
  });

  const hasPartner = formData?.mainDetails?.partners?.length > 0;
  const partners = formData?.mainDetails?.partners || [];
  const mainDetails = formData?.mainDetails?.mainDetails || {};

  // Handler for main client fields
  const handleMainClientChange = (e) => {
    const { name, value } = e.target;

    if (name === 'hasDependents' && value === 'Yes') {
      setMainClientDetails((prev) => ({
        ...prev,
        hasDependents: value,
        dependents: [
          {
            dependentOf: 'Main Client',
            dependentName: '',
            dependentDateOfBirth: '',
            dependentAge: '',
            isFinancialDependent: '',
            residesWith: hasPartner ? 'Partner' : 'Main Client',
          },
        ],
      }));
    } else if (name === 'hasDependents' && value === 'No') {
      setMainClientDetails((prev) => ({
        ...prev,
        hasDependents: value,
        dependents: [],
      }));
    } else {
      setMainClientDetails((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handler for partner fields
  const handlePartnerChange = (e) => {
    const { name, value } = e.target;
    const fieldName = name.replace(/^partner_/, '');
    
    setPartnerDetails(prev => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  // Handler for dependents
  const handleDependentChange = (index, field, value) => {
    setMainClientDetails((prev) => {
      const updatedDependents = [...prev.dependents];
      updatedDependents[index] = {
        ...updatedDependents[index],
        [field]: value,
      };
      return { ...prev, dependents: updatedDependents };
    });
  };

  // Add a dependent
  const addDependent = () => {
    setMainClientDetails((prev) => ({
      ...prev,
      dependents: [
        ...prev.dependents,
        {
          dependentOf: 'Main Client',
          dependentName: '',
          dependentDateOfBirth: '',
          dependentAge: '',
          isFinancialDependent: '',
          residesWith: hasPartner ? 'Partner' : 'Main Client',
        },
      ],
    }));
  };

  // Delete a dependent
  const deleteDependent = (index) => {
    setMainClientDetails((prev) => ({
      ...prev,
      dependents: prev.dependents.filter((_, i) => i !== index),
    }));
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchFormData('personalDetails');
    fetchFormData('mainDetails');
  }, [fetchFormData]);

  useEffect(() => {
    if (formData?.personalDetails) {
      setMainClientDetails(prev => ({
        ...prev,
        ...(formData.personalDetails.mainClientDetails || {}),
        dependents: formData.personalDetails.mainClientDetails?.dependents || []
      }));
      
      if (formData.personalDetails.partnerDetails) {
        const { dependents, ...partnerData } = formData.personalDetails.partnerDetails;
        setPartnerDetails(prev => ({
          ...prev,
          ...partnerData
        }));
      }
    }
  }, [formData]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validatePersonalDetails(mainClientDetails, partnerDetails, hasPartner);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        setTimeout(() => {
          if (errorRef.current) {
            errorRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 100);
        return;
      }
    updateFormData('personalDetails', {
      mainClientDetails,
      partnerDetails: hasPartner ? partnerDetails : null,
    });
    navigate('/mortgage/add-details/residential');
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      
      <FormButtons
        onBack={() => navigate(-1)}
        onNext={() => navigate('/mortgage/add-details/residential')}
      />

      {/* Main Client Fields */}
      <h3>Main Client Details</h3>
      <div className="form-group">
        {Object.keys(errors).length > 0 && (
          <div ref={errorRef} className="error-message">
            {Object.values(errors).join(", ")}
          </div>
        )}
      </div>
      <PersonalDetailsForm
        personalDetails={mainClientDetails}
        handleChange={handleMainClientChange}
        prefix=""
      />

      {/* Partner Fields */}
      {hasPartner && (
        <>
          <h3>Partner Details</h3>
          <PersonalDetailsForm
            personalDetails={partnerDetails}
            handleChange={handlePartnerChange}
            prefix="partner_"
            showDependentsSection={false}
          />
        </>
      )}

      {/* Dependents Section */}
      {mainClientDetails.hasDependents === 'Yes' && (
        <>
          <h4>Dependents</h4>
          {mainClientDetails.dependents.map((dependent, index) => (
            <DependentForm
              key={`dependent-${index}`}
              dependent={dependent}
              index={index}
              handleDependentChange={handleDependentChange}
              deleteDependent={deleteDependent}
              hasPartner={hasPartner}
              partnerName={hasPartner ? `${partnerDetails.forename} ${partnerDetails.surname}` : null}
              mainDetails={mainDetails}
              partners={partners}
            />
          ))}

          <div className="form-group">
            <button type="button" className="calc-button" onClick={addDependent}>
              Add Another Dependent
            </button>
          </div>
        </>
      )}

      <FormButtons
        onBack={() => navigate(-1)}
        onNext={() => navigate('/mortgage/add-details/residential')}
      />
    </form>
  );
};

export default PersonalDetails;