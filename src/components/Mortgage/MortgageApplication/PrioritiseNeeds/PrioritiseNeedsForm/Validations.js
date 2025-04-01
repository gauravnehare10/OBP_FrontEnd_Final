export const validatePrioritiseNeeds = (prioritiseNeedsData, hasPartner) => {
    let errors = {};
  
    // Utility functions
    const isValidText = (value, minLength = 20) => 
      typeof value === 'string' && value.trim().length >= minLength;
  
    // Validate a single person's prioritise needs data
    const validatePersonData = (personData, prefix) => {
      const personLabel = prefix === 'applicant_' ? 'You' : 'Your partner';
  
      // Important features validation
      if (!isValidText(personData.importantFeatures, 50)) {
        errors[`${prefix}importantFeatures`] = 
          `${personLabel} must specify important features (minimum 50 characters)`;
      }
  
      // Importance reason validation
      if (!isValidText(personData.importanceReason, 50)) {
        errors[`${prefix}importanceReason`] = 
          `${personLabel} must explain why these features are important (minimum 50 characters)`;
      }
    };
  
    // Validate applicant data
    validatePersonData(prioritiseNeedsData.applicant, 'applicant_');
  
    // Validate partner data if exists
    if (hasPartner) {
      validatePersonData(prioritiseNeedsData.partner, 'partner_');
    }
  
    return errors;
  };