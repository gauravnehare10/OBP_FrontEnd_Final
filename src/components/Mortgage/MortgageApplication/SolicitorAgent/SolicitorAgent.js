import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useFormStore from '../../store';
import { validateSolicitorAgent } from './SolicitorAgentForm/Validations';

const SolicitorAgent = () => {
  const { formData, fetchFormData, updateFormData } = useFormStore();
  const [solicitorAndAgentInfo, setSolicitorAndAgentInfo] = useState(formData.solicitorAndAgentData || {
    solicitorFirmName: '',
    solicitorPostcode: '',
    solicitorAddresses: ['', '', '', '', ''],
    solicitorContactName: '',
    solicitorContactNumber: '',
    estateAgentName: '',
    estateAgentPostcode: '',
    estateAgentAddresses: ['', '', '', '', ''],
    estateAgentContactName: '',
    estateAgentContactNumber: '',
  });

  const [ errors, setErrors ] = useState([]);
  const errorRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSolicitorAndAgentInfo((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    fetchFormData("solicitorAndAgentData");
  }, [fetchFormData]);

  useEffect(() => {
    if (formData.solicitorAndAgentData) {
      setSolicitorAndAgentInfo(formData.solicitorAndAgentData)
    }
  }, [formData.solicitorAndAgentData]);

  const handleAddressChange = (type, index, value) => {
    const updatedAddresses = [...solicitorAndAgentInfo[type]];
    updatedAddresses[index] = value;
    setSolicitorAndAgentInfo((prev) => ({ ...prev, [type]: updatedAddresses }));
  };

  const fetchAddress = async (postcode, type) => {
    try {
      const response = await axios.get(`https://api.postcodes.io/postcodes/${postcode}`);
      const { admin_district, admin_ward } = response.data.result;

      const newAddresses = ['', admin_district || '', admin_ward || '', '', 'United Kingdom'];

      setSolicitorAndAgentInfo((prev) => ({
        ...prev,
        [type]: [...newAddresses, ...Array(5 - newAddresses.length).fill('')],
      }));
    } catch (error) {
      alert('Invalid postcode or address not found.');
      console.error('Address lookup error:', error);
    }
  };

  const handleFindAddress = (type, postcode) => {
    if (!postcode) return alert('Please enter a postcode.');
    fetchAddress(postcode, type);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateSolicitorAgent(solicitorAndAgentInfo);
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
    
    updateFormData('solicitorAndAgentData', solicitorAndAgentInfo);
    navigate('/mortgage/add-details/declaration');
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className='form-buttons'>
        <div className='form-buttons-card'>
          <button className="back-button" type="button" onClick={() => navigate(-1)}>Back</button>
        </div>
        <div className='form-buttons-card'>
          <button className="form-submit" type="submit">Save</button>
          <button className="next-button" type="button" onClick={() => navigate('/mortgage/add-details/declaration')}>Next</button>
        </div>
      </div>

        <div className="form-group">
          {Object.keys(errors).length > 0 && (
            <div ref={errorRef} className="error-message">
              {Object.values(errors).join(", ")}
            </div>
          )}
        </div>
     
      <h3>Solicitor and/or Estate Agent Details</h3>

      {/* Solicitor Section */}
      <div className="form-group">
        <label>Solicitor Firm Name</label>
        <input
          type="text"
          name="solicitorFirmName"
          value={solicitorAndAgentInfo.solicitorFirmName}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Address Search</label>
        <input
          type="text"
          name="solicitorPostcode"
          placeholder="Address Postcode"
          value={solicitorAndAgentInfo.solicitorPostcode}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <button className="address-button" type="button" onClick={() => handleFindAddress('solicitorAddresses', solicitorAndAgentInfo.solicitorPostcode)}>Find Address</button>
      </div>

      {(solicitorAndAgentInfo?.solicitorAddresses || ['', '', '', '', '']).map((address, index) => (
        <div className="form-group" key={index}>
          <label>Address {index + 1}</label>
          <input
            type="text"
            value={address}
            onChange={(e) => handleAddressChange('solicitorAddresses', index, e.target.value)}
          />
        </div>
      ))}

      <div className="form-group">
        <label>Contact Name</label>
        <input
          type="text"
          name="solicitorContactName"
          value={solicitorAndAgentInfo.solicitorContactName}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Contact Number</label>
        <input
          type="number"
          name="solicitorContactNumber"
          value={solicitorAndAgentInfo.solicitorContactNumber}
          onChange={handleChange}
        />
      </div>
      <hr />
      {/* Estate Agent Section */}
      <div className="form-group">
        <label>Estate Agent Name</label>
        <input
          type="text"
          name="estateAgentName"
          value={solicitorAndAgentInfo.estateAgentName}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Address Search</label>
        <input
          type="text"
          name="estateAgentPostcode"
          placeholder="Address Postcode"
          value={solicitorAndAgentInfo.estateAgentPostcode}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <button className="address-button" type="button" onClick={() => handleFindAddress('estateAgentAddresses', solicitorAndAgentInfo.estateAgentPostcode)}>Find Address</button>
      </div>

      {(solicitorAndAgentInfo?.estateAgentAddresses || ['', '', '', '', '']).map((address, index) => (
        <div className="form-group" key={index}>
          <label>Address {index + 1}</label>
          <input
            type="text"
            value={address}
            onChange={(e) => handleAddressChange('estateAgentAddresses', index, e.target.value)}
          />
        </div>
      ))}

      <div className="form-group">
        <label>Contact Name</label>
        <input
          type="text"
          name="estateAgentContactName"
          value={solicitorAndAgentInfo.estateAgentContactName}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Contact Number</label>
        <input
          type="number"
          name="estateAgentContactNumber"
          value={solicitorAndAgentInfo.estateAgentContactNumber}
          onChange={handleChange}
        />
      </div>

      <div className='form-buttons'>
        <div className='form-buttons-card'>
          <button className="back-button" type="button" onClick={() => navigate(-1)}>Back</button>
        </div>
        <div className='form-buttons-card'>
          <button className="form-submit" type="submit">Save</button>
          <button className="next-button" type="button" onClick={() => navigate('/mortgage/add-details/declaration')}>Next</button>
        </div>
      </div>
    </form>
  );
};

export default SolicitorAgent;
