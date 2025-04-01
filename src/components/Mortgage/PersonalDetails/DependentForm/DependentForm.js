import React from 'react';

const DependentForm = ({ dependent, index, handleDependentChange, deleteDependent, mainDetails, partners }) => {
  return (
    <div className="dependent-section">
      <h4>Dependent {index + 1}</h4>

      <div className="form-group">
        <label>Dependent of:</label>
        <select
          value={dependent.dependentOf}
          onChange={(e) => handleDependentChange(index, 'dependentOf', e.target.value)}
        >
          <option value="">Select</option>
          {[mainDetails, ...partners].map((person, idx) => (
            <option key={idx} value={`${person.forename} ${person.surname}`}>
              {`${person.forename} ${person.surname}`}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Dependent Name:</label>
        <input
          type="text"
          value={dependent.dependentName}
          onChange={(e) => handleDependentChange(index, 'dependentName', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Date of Birth:</label>
        <input
          type="date"
          value={dependent.dependentDateOfBirth}
          onChange={(e) => handleDependentChange(index, 'dependentDateOfBirth', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Age:</label>
        <input
          type="number"
          value={dependent.dependentAge}
          onChange={(e) => handleDependentChange(index, 'dependentAge', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Financial Dependent?</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name={`isFinancialDependent-${index}`}
              value="Yes"
              checked={dependent.isFinancialDependent === 'Yes'}
              onChange={(e) => handleDependentChange(index, 'isFinancialDependent', e.target.value)}
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              name={`isFinancialDependent-${index}`}
              value="No"
              checked={dependent.isFinancialDependent === 'No'}
              onChange={(e) => handleDependentChange(index, 'isFinancialDependent', e.target.value)}
            />
            No
          </label>
        </div>
      </div>

      <div className="form-group">
        <label>Who does the dependent reside with?</label>
        <select
          value={dependent.residesWith}
          onChange={(e) => handleDependentChange(index, 'residesWith', e.target.value)}
        >
          <option value="">Select</option>
          {[mainDetails, ...partners].map((person, idx) => (
            <option key={idx} value={`${person.forename} ${person.surname}`}>
              {`${person.forename} ${person.surname}`}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <button
          type="button"
          className="delete-button"
          onClick={() => deleteDependent(index)}
        >
          Delete Dependent
        </button>
      </div>
    </div>
  );
};

export default DependentForm;