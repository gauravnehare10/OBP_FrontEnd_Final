import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../PersonalDetails/PersonalDetails.css';
import useFormStore from '../store';
import OccupationForm from './OccupationForm/OccupationForm';
import FormButtons from '../inc/FormButtons/FormButton';
import validateOccupationData from './OccupationForm/Validations';

const Occupation = () => {
  const navigate = useNavigate();
  const { formData, fetchFormData, updateFormData } = useFormStore();
  const [errors, setErrors] = useState({});
  const errorRef = useRef(null);

  const initialEmploymentData = {
    status: '',
    jobTitle: '',
    employmentType: '',
    selfEmployedType: '',
    employerName: '',
    employerAddress: ['', '', '', '', ''],
    employerPostcode: '',
    annualIncome: '',
    totalGrossIncome: '',
    totalNetIncome: '',
  };

  // Single state object for both clients
  const [occupationData, setOccupationData] = useState({
    client: {
      ...initialEmploymentData,
      previousEmployment: [],
    },
    partner: {
      ...initialEmploymentData,
      previousEmployment: [],
    }
  });

  const hasPartner = formData?.mainDetails?.partners?.length > 0;

  // Generic change handler
  const handleChange = (clientType) => (e, prevIndex = null) => {
    const { name, value } = e.target;
  
    setOccupationData(prev => {
      const updatedData = { ...prev };
      
      if (prevIndex !== null) {
        updatedData[clientType].previousEmployment = [
          ...updatedData[clientType].previousEmployment
        ];
        updatedData[clientType].previousEmployment[prevIndex] = {
          ...updatedData[clientType].previousEmployment[prevIndex],
          [name]: value,
        };
      } else {
        updatedData[clientType] = {
          ...updatedData[clientType],
          [name]: value,
        };
      }
      
      return updatedData;
    });
  };

  // Generic address change handler
  const handleAddressChange = (clientType) => (index, value, prevIndex = null) => {
    setOccupationData(prev => {
      const updatedData = { ...prev };
      
      if (prevIndex !== null) {
        updatedData[clientType].previousEmployment = [
          ...updatedData[clientType].previousEmployment
        ];
        updatedData[clientType].previousEmployment[prevIndex].employerAddress[index] = value;
      } else {
        updatedData[clientType].employerAddress = [
          ...updatedData[clientType].employerAddress
        ];
        updatedData[clientType].employerAddress[index] = value;
      }
      
      return updatedData;
    });
  };

  useEffect(() => {
    fetchFormData("occupationData");
    fetchFormData("mainDetails");
  }, [fetchFormData]);
  
  useEffect(() => {
    if (formData.occupationData) {
      setOccupationData({
        client: {
          ...initialEmploymentData,
          ...formData.occupationData.client,
          previousEmployment: formData.occupationData.client?.previousEmployment || [],
        },
        partner: {
          ...initialEmploymentData,
          ...formData.occupationData.partner,
          previousEmployment: formData.occupationData.partner?.previousEmployment || [],
        }
      });
    }
  }, [formData]);

  // Generic address finder
  const findAddress = async (clientType, postcode, index = null) => {
    if (!postcode || typeof postcode !== "string") {
      alert("Please enter a valid postcode.");
      return;
    }
  
    try {
      const response = await axios.get(`https://api.postcodes.io/postcodes/${postcode.trim()}`);
      const { admin_district, admin_ward } = response.data.result || {};
      const updatedAddress = ["", admin_district || "", admin_ward || "", "", "United Kingdom"];
  
      setOccupationData(prev => {
        const updatedData = { ...prev };
        
        if (index !== null) {
          updatedData[clientType].previousEmployment = [
            ...updatedData[clientType].previousEmployment
          ];
          updatedData[clientType].previousEmployment[index].employerAddress = updatedAddress;
        } else {
          updatedData[clientType].employerAddress = updatedAddress;
        }
        
        return updatedData;
      });
    } catch (error) {
      alert("Error fetching address. Please check the postcode.");
      console.error("Address lookup error:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateOccupationData(occupationData, hasPartner);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setTimeout(() => {
        if (errorRef.current) {
          errorRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
      return;
    }
    updateFormData("occupationData", occupationData);
    navigate('/mortgage/add-details/employer-benefit');
  };

  // Generic function to add previous employment
  const addPreviousEmployment = (clientType) => {
    setOccupationData(prev => ({
      ...prev,
      [clientType]: {
        ...prev[clientType],
        previousEmployment: [
          ...prev[clientType].previousEmployment,
          { ...initialEmploymentData }
        ]
      }
    }));
  };

  // Generic function to delete previous employment
  const deletePreviousEmployment = (clientType) => (index) => {
    setOccupationData(prev => ({
      ...prev,
      [clientType]: {
        ...prev[clientType],
        previousEmployment: prev[clientType].previousEmployment.filter((_, i) => i !== index)
      }
    }));
  };

  // Determine if navigation buttons should be shown
  const shouldShowButtons = (data) => (
    (!['', 'Retired', 'Unemployed', 'Houseperson'].includes(data.status) &&
    (data.status !== 'Self-Employed' ||
      data.selfEmployedType === 'Director (less than 20% shareholding)')) ||
      data.previousEmployment.length > 0
  );

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <FormButtons
        onBack={() => navigate(-1)}
        onNext={() => navigate('/mortgage/add-details/employer-benefit')}
      />

      {/* Main Client Occupation */}
      <div className="form-group">
        {Object.keys(errors).length > 0 && (
          <div ref={errorRef} className="error-message">
            {Object.values(errors).join(", ")}
          </div>
        )}
      </div>
      <OccupationForm
        data={occupationData.client}
        handleChange={handleChange('client')}
        handleAddressChange={handleAddressChange('client')}
        findAddress={(postcode, index) => findAddress('client', postcode, index)}
        isMainForm={true}
      />

      {/* Previous Employment for Main Client */}
      {occupationData.client.previousEmployment.map((prev, idx) => (
        <OccupationForm
          key={`client-prev-${idx}`}
          data={prev}
          index={idx}
          handleChange={handleChange('client')}
          handleAddressChange={handleAddressChange('client')}
          findAddress={(postcode, index) => findAddress('client', postcode, index)}
          onDelete={deletePreviousEmployment('client')}
        />
      ))}
      <div className="form-group">
        <button 
          className="calc-button" 
          type="button" 
          onClick={() => addPreviousEmployment('client')}
        >
          Add Previous Employment
        </button>
      </div>

      {/* Partner Occupation (if exists) */}
      {hasPartner && (
        <>
          <h3>Client 2 Occupation Details</h3>
          <OccupationForm
            data={occupationData.partner}
            handleChange={handleChange('partner')}
            handleAddressChange={handleAddressChange('partner')}
            findAddress={(postcode, index) => findAddress('partner', postcode, index)}
            isMainForm={true}
          />

          {/* Previous Employment for Partner */}
          {occupationData.partner.previousEmployment.map((prev, idx) => (
            <OccupationForm
              key={`partner-prev-${idx}`}
              data={prev}
              index={idx}
              handleChange={handleChange('partner')}
              handleAddressChange={handleAddressChange('partner')}
              findAddress={(postcode, index) => findAddress('partner', postcode, index)}
              onDelete={deletePreviousEmployment('partner')}
            />
          ))}
          <div className="form-group">
            <button 
              className="calc-button" 
              type="button" 
              onClick={() => addPreviousEmployment('partner')}
            >
              Add Previous Employment (Client 2)
            </button>
          </div>
        </>
      )}

      {(shouldShowButtons(occupationData.client) || (hasPartner && shouldShowButtons(occupationData.partner))) && (
        <FormButtons
        onBack={() => navigate(-1)}
        onNext={() => navigate('/mortgage/add-details/employer-benefit')}
      />
      )}
    </form>
  );
};

export default Occupation;