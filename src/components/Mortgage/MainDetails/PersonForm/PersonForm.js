const PersonForm = ({ person, onChange, onDelete, title, showDeleteButton }) => {
    return (
      <div className="form-section">
        <h3>{title}</h3>
        <div className="form-group-container">
          <div className="form-group">
            <label>Title:</label>
            <select
              name="title"
              value={person.title}
              onChange={onChange}
              className="form-input"
            >
              <option value="">Select</option>
              <option value="Mr">Mr</option>
              <option value="Mrs">Mrs</option>
              <option value="Miss">Miss</option>
              <option value="Dr">Dr</option>
            </select>
          </div>
          <div className="form-group">
            <label>Informal Salutation:</label>
            <input
              type="text"
              name="informalSalutation"
              value={person.informalSalutation}
              onChange={onChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Forename:</label>
            <input
              type="text"
              name="forename"
              value={person.forename}
              onChange={onChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Middle Name:</label>
            <input
              type="text"
              name="middleName"
              value={person.middleName}
              onChange={onChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Surname:</label>
            <input
              type="text"
              name="surname"
              value={person.surname}
              onChange={onChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Date of Birth:</label>
            <input
              type="date"
              name="dateOfBirth"
              value={person.dateOfBirth}
              onChange={onChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Age:</label>
            <input
              type="number"
              name="age"
              value={person.age}
              onChange={onChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Gender at Birth:</label>
            <select
              name="genderAtBirth"
              value={person.genderAtBirth}
              onChange={onChange}
              className="form-input"
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Identifies As:</label>
            <select
              name="identifiesAs"
              value={person.identifiesAs}
              onChange={onChange}
              className="form-input"
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Smoker:</label>
            <select
              name="smoker"
              value={person.smoker}
              onChange={onChange}
              className="form-input"
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          <div className="form-group">
            <label>Nationality:</label>
            <input
              type="text"
              name="nationality"
              value={person.nationality}
              onChange={onChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Client Occupation:</label>
            <input
              type="text"
              name="clientOccupation"
              value={person.clientOccupation}
              onChange={onChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Provider Occupation:</label>
            <input
              type="text"
              name="providerOccupation"
              value={person.providerOccupation}
              onChange={onChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Occupation Status:</label>
            <select
              name="occupationStatus"
              value={person.occupationStatus}
              onChange={onChange}
              className="form-input"
            >
              <option value="">Select</option>
              <option value="Employed">Employed</option>
              <option value="Self-Employed">Self-Employed</option>
              <option value="Unemployed">Unemployed</option>
            </select>
          </div>
          <div className="form-group">
            <label>Basic Annual Salary:</label>
            <input
              type="number"
              name="basicAnnualSalary"
              value={person.basicAnnualSalary}
              onChange={onChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>NI Number:</label>
            <input
              type="text"
              name="niNumber"
              value={person.niNumber}
              onChange={onChange}
              className="form-input"
            />
          </div>
        </div>
  
        {/* Delete Button for Partners */}
        {showDeleteButton && (
          <div className="form-group">
            <button
              type="button"
              className="delete-button"
              onClick={onDelete}
            >
              Delete Partner
            </button>
          </div>
        )}
      </div>
    );
  };

  export default PersonForm;