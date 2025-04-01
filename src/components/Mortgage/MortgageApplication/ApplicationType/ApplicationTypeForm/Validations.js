import { loanTypes } from "../ApplicationType";

export const validateApplicationType = (applicationTypeData, hasPartner) => {
    let errors = {};
  
    // Utility functions
    const isSelected = (array) => array && array.length > 0;
    const isValidSelection = (value, options) => options.includes(value);
  
    // Validate a single person's application type
    const validatePersonData = (personData, prefix) => {
      const personLabel = prefix === 'applicant_' ? 'You' : 'Your partner';
  
      // Loan purpose validation
      if (!isSelected(personData.loanPurpose)) {
        errors[`${prefix}loanPurpose`] = `${personLabel} must select at least one loan purpose`;
      }
  
      // Loan type validation
      if (!isValidSelection(personData.loanType, loanTypes)) {
        errors[`${prefix}loanType`] = `${personLabel} must select a valid loan type`;
      }
    };
  
    // Validate applicant data
    validatePersonData(applicationTypeData.applicant, 'applicant_');
  
    // Validate partner data if exists
    if (hasPartner) {
      validatePersonData(applicationTypeData.partner, 'partner_');
    }
  
    return errors;
  };