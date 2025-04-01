export const validateEarlyRepayment = (earlyRepaymentData, hasPartner) => {
    let errors = {};
  
    // Utility functions
    const isValidSelection = (value, options) => options.includes(value);
    const isValidText = (value) => typeof value === 'string' && value.trim().length > 0;
  
    // Validate a single person's early repayment data
    const validatePersonData = (personData, prefix) => {
      const personLabel = prefix === 'applicant_' ? 'You' : 'Your partner';
  
      // Repayment plans validation
      if (!isValidSelection(personData.repayPlans, ['Yes', 'No'])) {
        errors[`${prefix}repayPlans`] = `${personLabel} must specify repayment plans`;
      }
  
      // Move home validation
      if (!isValidSelection(personData.moveHome, ['Yes', 'No'])) {
        errors[`${prefix}moveHome`] = `${personLabel} must specify likelihood of moving home`;
      }
  
      // ERC explanation validation
      if (!isValidText(personData.ercExplanation)) {
        errors[`${prefix}ercExplanation`] = `${personLabel} must provide ERC explanation`;
      } else if (personData.ercExplanation.length < 50) {
        errors[`${prefix}ercExplanation`] = `${personLabel} ERC explanation must be of minimum 50 characters`;
      }
  
      // Preferred reason validation
      if (!isValidText(personData.preferredReason)) {
        errors[`${prefix}preferredReason`] = `${personLabel} must provide preferred reason`;
      } else if (personData.preferredReason.length < 50) {
        errors[`${prefix}preferredReason`] = `${personLabel} preferred reason must be of minimum 50 characters`;
      }
    };
  
    // Validate applicant data
    validatePersonData(earlyRepaymentData.applicant, 'applicant_');
  
    // Validate partner data if exists
    if (hasPartner) {
      validatePersonData(earlyRepaymentData.partner, 'partner_');
    }
  
    return errors;
  };