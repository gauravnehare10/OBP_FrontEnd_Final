import { useEffect, useState } from 'react';
import axios from 'axios';
import "../../PersonalDetails/PersonalDetails.css";
import { useNavigate } from 'react-router-dom';
import useFormStore from '../../store';
import SelfEmployedFields from './SelfEmployedForm/SelfEmployedForm';

const SelfEmployedDetails = () => {
  const { formData, fetchFormData, updateFormData } = useFormStore();
  const [selfEmployedData, setSelfEmployedData] = useState(formData.selfEmployedData || {
    businessName: '',
    businessAddress: ['', '', '', '', ''],
    businessPostcode: '',
    positionInBusiness: '',
    startDate: '',
    yearsOfAccounts: '',
    accountantDetails: '',
  });

  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setSelfEmployedData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    fetchFormData("selfEmployedData");
    fetchFormData("residentialHistory");
  }, [fetchFormData]);
  
  useEffect(() => {
    if (formData.selfEmployedData) {
      setSelfEmployedData(formData.selfEmployedData);
    }
  }, [formData.selfEmployedData]);

  const handleAddressChange = (index, value) => {
    const updatedAddress = [...selfEmployedData.businessAddress];
    updatedAddress[index] = value;
    setSelfEmployedData((prev) => ({ ...prev, businessAddress: updatedAddress }));
  };

  const findAddress = async (postcode) => {
    if (!postcode || typeof postcode !== 'string') {
      alert('Please enter a valid postcode.');
      return;
    }

    try {
      const response = await axios.get(
        `https://api.postcodes.io/postcodes/${postcode.trim()}`
      );
      const { admin_district, admin_ward } = response.data.result || {};
      const updatedAddress = [
        '',
        admin_district || '',
        admin_ward || '',
        '',
        'United Kingdom',
      ];
      setSelfEmployedData((prev) => ({ ...prev, businessAddress: updatedAddress }));
    } catch (error) {
      alert('Error fetching address. Please check the postcode.');
      console.error('Address lookup error:', error);
    }
  };

  const useResidentialAddress = () => {
    const residentialAddress = formData.residentialHistory[0].address;
    setSelfEmployedData((prev) => ({ ...prev, businessAddress: residentialAddress }));
    handleChange("businessPostcode", formData.residentialHistory[0].postcode);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateFormData('selfEmployedData', selfEmployedData);
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className='form-buttons'>
        <div className='form-buttons-card'>
          <button className="back-button" type="button" onClick={()=> {navigate(-1)}}>Back</button>
        </div>
        <div className='form-buttons-card'>
          <button className="form-submit" type="submit">Save</button>
          <button className="next-button" type="button" onClick={ () => navigate('/mortgage/add-details/self-employed-income-details')}>Next</button>
        </div>
      </div>
      
      <h3>Self Employed or Director/Shareholder Details</h3>
      
      <SelfEmployedFields 
        selfEmployedData={selfEmployedData}
        handleChange={handleChange}
        handleAddressChange={handleAddressChange}
        findAddress={findAddress}
        useResidentialAddress={useResidentialAddress}
        formData={formData}
      />

      <div className='form-buttons'>
        <div className='form-buttons-card'>
          <button className="back-button" type="button" onClick={()=> {navigate(-1)}}>Back</button>
        </div>
        <div className='form-buttons-card'>
          <button className="form-submit" type="submit">Save</button>
          <button className="next-button" type="button" onClick={ () => navigate('/mortgage/add-details/self-employed-income-details')}>Next</button>
        </div>
      </div>
    </form>
  );
};

export default SelfEmployedDetails;