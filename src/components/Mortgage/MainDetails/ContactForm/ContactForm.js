import React from 'react';

const ContactForm = ({ contactDetails, onChange, onAddEmail, onDeleteEmail }) => {
  return (
    <div className="form-section">
      <h3>Contact Details</h3>
      <div className="form-group">
        <label>Postcode:</label>
        <input
          type="text"
          name="postcode"
          value={contactDetails.postcode}
          onChange={onChange}
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label>Daytime Telephone Number:</label>
        <input
          type="text"
          name="daytimePhone"
          value={contactDetails.daytimePhone}
          onChange={onChange}
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label>Evening Telephone Number:</label>
        <input
          type="text"
          name="eveningPhone"
          value={contactDetails.eveningPhone}
          onChange={onChange}
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label>Mobile Telephone Number:</label>
        <input
          type="text"
          name="mobilePhone"
          value={contactDetails.mobilePhone}
          onChange={onChange}
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label>Preferred Method of Contact:</label>
        <select
          name="preferredContact"
          value={contactDetails.preferredContact}
          onChange={onChange}
          className="form-input"
        >
          <option value="">Select</option>
          <option value="email">Email</option>
          <option value="daytimePhone">Daytime Phone</option>
          <option value="eveningPhone">Evening Phone</option>
          <option value="mobilePhone">Mobile Phone</option>
        </select>
      </div>
      <div className="form-group">
        <label>Address Line 1:</label>
        <input
          type="text"
          name="addressLine1"
          value={contactDetails.addressLine1}
          onChange={onChange}
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label>Address Line 2:</label>
        <input
          type="text"
          name="addressLine2"
          value={contactDetails.addressLine2}
          onChange={onChange}
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label>City:</label>
        <input
          type="text"
          name="city"
          value={contactDetails.city}
          onChange={onChange}
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label>County:</label>
        <input
          type="text"
          name="county"
          value={contactDetails.county}
          onChange={onChange}
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label>Country:</label>
        <input
          type="text"
          name="country"
          value={contactDetails.country}
          onChange={onChange}
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label>Email Address:</label>
        <input
          type="email"
          name="email"
          value={contactDetails.email}
          onChange={onChange}
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label>Email Type:</label>
        <select
          name="contactType"
          value={contactDetails.contactType}
          onChange={onChange}
          className="form-input"
        >
          <option value="">Select</option>
          <option value="personal">Personal</option>
          <option value="work">Work</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div className='form-group'>
        <button
          type="button"
          onClick={onAddEmail}
          className="calc-button"
        >
          Add Email Address
        </button>
      </div>
      {/* Display Added Emails */}
      <div className="form-group">
        <h4>Added Emails:</h4>
        <table>
          {contactDetails?.emails?.map((emailObj, index) => (
            <tr key={index}>
                <td>{emailObj.email} ({emailObj.type})</td>
                <td>
                <button
                    type="button"
                    onClick={() => onDeleteEmail(index)}
                    className="delete-email-button"
                    >
                    Delete
                </button>
                </td>
                
              
            </tr>
          ))}
        </table>
      </div>
    </div>
  );
};

export default ContactForm;