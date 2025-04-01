// FormButtons.jsx
import React from 'react';

const FormButtons = ({ onBack, onSave, onNext }) => {
  return (
    <div className="form-buttons">
      <div className="form-buttons-card">
        <button className="back-button" type="button" onClick={onBack}>
          Back
        </button>
      </div>
      <div className="form-buttons-card">
        <button className="form-submit" type="submit" onClick={onSave}>
          Save
        </button>
        <button className="next-button" type="button" onClick={onNext}>
          Next
        </button>
      </div>
    </div>
  );
};

export default FormButtons;