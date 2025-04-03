import React, { useState, useEffect, useRef } from 'react';
import './MainDetails.css';
import PersonForm from './PersonForm/PersonForm';
import ContactForm from './ContactForm/ContactForm';
import useFormStore from '../store';
import { validateMainDetails } from './Validations';

const MainDetails = () => {
  // State for Main Details
  const [mainDetails, setMainDetails] = useState({
    title: '',
    informalSalutation: '',
    forename: '',
    middleName: '',
    surname: '',
    dateOfBirth: '',
    age: '',
    genderAtBirth: '',
    identifiesAs: '',
    smoker: '',
    nationality: '',
    clientOccupation: '',
    providerOccupation: '',
    occupationStatus: '',
    basicAnnualSalary: '',
    niNumber: '',
    postcode: '',
    daytimePhone: '',
    eveningPhone: '',
    mobilePhone: '',
    preferredContact: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    county: '',
    country: '',
    email: '',
    contactType: '',
    emails: [],
  });

  const [errors, setErrors] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const errorRef = useRef(null);
  const successRef = useRef(null);
  // State for Partners (initialize as an empty array)
  const [partners, setPartners] = useState([]);

  // Access the store
  const { formData, fetchFormData, updateFormData } = useFormStore();

  // Fetch initial form data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchFormData('mainDetails');
      } catch (error) {
        console.error('Failed to fetch form data:', error);
      }
    };
    fetchData();
  }, [fetchFormData]);

  // Update state when formData changes
  useEffect(() => {
    if (formData?.mainDetails) {
      setMainDetails({
        ...formData.mainDetails.mainDetails,
        emails: formData.mainDetails.mainDetails?.emails || [],
      });
      setPartners(formData.mainDetails.partners || []);
    }
  }, [formData]);

  // Handler for Main Details
  const handleMainDetailsChange = (e) => {
    const { name, value } = e.target;
    setMainDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handler for Partner Details
  const handlePartnerChange = (index, e) => {
    const { name, value } = e.target;
    const updatedPartners = partners.map((partner, i) =>
      i === index ? { ...partner, [name]: value } : partner
    );
    setPartners(updatedPartners);
  };

  // Add a New Partner
  const addNewPartner = () => {
    if (partners.length >= 1) {
      setError("Only one partner is allowed.");
      setTimeout(() => {
        if (errorRef.current) {
          errorRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
      return;
    }
    const newPartner = {
      title: '',
      informalSalutation: '',
      forename: '',
      middleName: '',
      surname: '',
      dateOfBirth: '',
      age: '',
      genderAtBirth: '',
      identifiesAs: '',
      smoker: '',
      nationality: '',
      clientOccupation: '',
      providerOccupation: '',
      occupationStatus: '',
      basicAnnualSalary: '',
      niNumber: '',
      postcode: '',
      daytimePhone: '',
      eveningPhone: '',
      mobilePhone: '',
      preferredContact: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      county: '',
      country: '',
      email: '',
      contactType: '',
      emails: [],
    };
    setPartners((prev) => [...prev, newPartner]);
  };

  // Delete a Partner
  const deletePartner = (index) => {
    setPartners((prev) => prev.filter((_, i) => i !== index));
  };

  // Add Email for Main Details
  const handleAddEmail = () => {
    if (mainDetails.email && mainDetails.contactType) {
      const newEmail = {
        email: mainDetails.email,
        type: mainDetails.contactType,
      };
      setMainDetails((prev) => ({
        ...prev,
        emails: [...prev.emails, newEmail],
        email: '',
        contactType: '',
      }));
    }
  };

  // Delete Email for Main Details
  const handleDeleteEmail = (index) => {
    setMainDetails((prev) => ({
      ...prev,
      emails: prev.emails.filter((_, i) => i !== index),
    }));
  };

  // Add Email for Partner
  const handlePartnerAddEmail = (partnerIndex) => {
    const partner = partners[partnerIndex];
    if (partner.email && partner.contactType) {
      const newEmail = {
        email: partner.email,
        type: partner.contactType,
      };
      const updatedPartners = partners.map((p, i) =>
        i === partnerIndex
          ? { ...p, emails: [...p.emails, newEmail], email: '', contactType: '' }
          : p
      );
      setPartners(updatedPartners);
    }
  };

  // Delete Email for Partner
  const handlePartnerDeleteEmail = (partnerIndex, emailIndex) => {
    const updatedPartners = partners.map((p, i) =>
      i === partnerIndex
        ? { ...p, emails: p.emails.filter((_, j) => j !== emailIndex) }
        : p
    );
    setPartners(updatedPartners);
  };

  // Validate Form
  const validateForm = () => {
    const errors = validateMainDetails(mainDetails, partners);
    setErrors(errors);
    if (Object.keys(errors).length > 0) {
      setTimeout(() => {
        if (errorRef.current) {
          errorRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
      return false;
    }
    
    return true;
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Combine main details and partner details into a single object
    const data = {
      mainDetails,
      partners,
    };

    try {
      await updateFormData('mainDetails', data);
      setSuccess("Data Submitted!");
      console.log('Form Data Submitted:', data);
      setTimeout(() => {
        if (successRef.current) {
          successRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    } catch (error) {
      console.error('Failed to update form data:', error);
    }
  };

  return (
    <form className="main-details-form" onSubmit={handleSubmit}>
      <div className="form-group">
        {Object.keys(errors).length > 0 && (
          <div ref={errorRef} className="error-message">
            {Object.values(errors).join(", ")}
          </div>
        )}
      </div>
      <div className="success-div">
        { success && (
          <div ref={successRef} className="success-message">
            {success}
          </div>
        )}
      </div>
      {/* Main User Form */}
      <PersonForm
        person={mainDetails}
        onChange={handleMainDetailsChange}
        title="Main Details"
        showDeleteButton={false}
      />
  
      {/* Contact Details Section for Main User */}
      <ContactForm
        contactDetails={mainDetails}
        onChange={handleMainDetailsChange}
        onAddEmail={handleAddEmail}
        onDeleteEmail={handleDeleteEmail}
      />
  
      {/* Partners Section */}
      {partners?.map((partner, index) => (
        <div key={index}>
          <PersonForm
            person={partner}
            onChange={(e) => handlePartnerChange(index, e)}
            onDelete={() => deletePartner(index)}
            title={`Partner ${index + 1}`}
            showDeleteButton={true}
          />
  
          {/* Contact Details Section for Partner */}
          <ContactForm
            contactDetails={partner}
            onChange={(e) => handlePartnerChange(index, e)}
            onAddEmail={() => handlePartnerAddEmail(index)}
            onDeleteEmail={(emailIndex) =>
              handlePartnerDeleteEmail(index, emailIndex)
            }
          />
        </div>
      ))}
      { error && (
        <div className="error-message">
          {error}
        </div>
      )}
      <div className="form-buttons">
        <div className="form-buttons-card">
          <button type="button" onClick={addNewPartner} className="calc-button">
            Add New Partner
          </button>
        </div>
        <div className="form-buttons-card">
          <button type="submit" className="form-submit">
            Submit
          </button>
        </div>
      </div>
    </form>
  );
};

export default MainDetails;