import React from 'react';
import PropTypes from 'prop-types';

const ResidenceForm = ({ 
  residence, 
  index, 
  handleChange, 
  findAddress 
}) => {
  return (
    <div className="residence-section">
      <h4>Residence {index > 0 ? index + 1 : ''}</h4>

      <div className="form-group">
        <label>Address Search:</label>
        <input
          type="text"
          placeholder="Postcode"
          value={residence.postcode}
          onChange={(e) => handleChange(index, 'postcode', e.target.value)}
        />
      </div>

      <div className="form-group">
        <button 
          type="button" 
          className="address-button"
          onClick={() => findAddress(index)}
        >
          Find Address
        </button>
      </div>
      
      {[1, 2, 3, 4, 5].map((num) => (
        <div key={num} className="form-group">
          <label>Address {num}{num > 3 ? ' (Optional)' : ''}:</label>
          <input
            type="text"
            value={residence.address[num - 1]}
            onChange={(e) => {
              const newAddress = [...residence.address];
              newAddress[num - 1] = e.target.value;
              handleChange(index, 'address', newAddress);
            }}
          />
        </div>
      ))}

      <div className="form-group">
        <label>Present Residential Status:</label>
        <select
          value={residence.status}
          onChange={(e) => handleChange(index, 'status', e.target.value)}
        >
          <option value="">Select Status</option>
          <option value="Owner">Owner</option>
          <option value="Rented">Rented</option>
          <option value="Living with Family">Living with Family</option>
        </select>
      </div>

      <div className="form-group">
        <label>Date Moved In:</label>
        <input
          type="date"
          value={residence.dateMovedIn}
          onChange={(e) => handleChange(index, 'dateMovedIn', e.target.value)}
        />
      </div>
    </div>
  );
};

ResidenceForm.propTypes = {
  residence: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  handleChange: PropTypes.func.isRequired,
  findAddress: PropTypes.func.isRequired
};

export default ResidenceForm;