export const validateEmergencyFund = (emergencyFundData, hasPartner) => {
    let errors = {};
  
    // Utility functions
    const isValidNumber = (value) => !isNaN(parseFloat(value)) && parseFloat(value) >= 0;
    const isValidSelection = (value, options) => options.includes(value);
    const isRequired = (value) => value !== undefined && value !== null && value !== '';
  
    // Validate a single person's emergency fund data
    const validatePersonData = (personData, prefix) => {
      const personLabel = prefix === 'applicant_' ? 'You' : 'Your partner';
  
      // Emergency capital validation
      if (!isValidNumber(personData.emergencyCapital)) {
        errors[`${prefix}emergencyCapital`] = `${personLabel} must enter a valid emergency fund amount`;
      }
  
      // Medical issues validation
      if (!isValidSelection(personData.medicalIssues, ['Yes', 'No'])) {
        errors[`${prefix}medicalIssues`] = `${personLabel} must specify medical history`;
      }
  
      // Smoker status validation
      if (!isValidSelection(personData.smokerStatus, ['Current Smoker', 'Former Smoker', 'Never Smoked'])) {
        errors[`${prefix}smokerStatus`] = `${personLabel} must specify smoking status`;
      }
  
      // Will details validation
      if (!isValidSelection(personData.hasWill, ['Yes', 'No'])) {
        errors[`${prefix}hasWill`] = `${personLabel} must specify will status`;
      }
  
      // Refer for will validation (conditional)
      if (personData.hasWill === 'No' && !isValidSelection(personData.referForWill, ['Yes', 'No'])) {
        errors[`${prefix}referForWill`] = `${personLabel} must specify if you want referral`;
      }
  
      // Power of attorney validation
      if (!isValidSelection(personData.powerOfAttorney, ['Yes', 'No'])) {
        errors[`${prefix}powerOfAttorney`] = `${personLabel} must specify power of attorney status`;
      }
    };
  
    // Validate applicant data
    validatePersonData(emergencyFundData.applicant, 'applicant_');
  
    // Validate partner data if exists
    if (hasPartner) {
      validatePersonData(emergencyFundData.partner, 'partner_');
    }
  
    return errors;
  };