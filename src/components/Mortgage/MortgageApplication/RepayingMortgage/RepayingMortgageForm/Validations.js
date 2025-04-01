export const validateRepayingMortgage = (repaymentData, hasPartner) => {
    let errors = {};
  
    // Utility function to validate a person's repayment data
    const validatePersonRepayment = (personData, prefix) => {
      const personLabel = prefix === 'applicant_' ? 'You' : 'Your partner';
  
      // Validate mortgage repayment certainty
      if (!personData.mortgageRepaymentCertainty) {
        errors[`${prefix}mortgageRepaymentCertainty`] = 
          `${personLabel} must select whether mortgage repayment certainty is important`;
      }
  
      // Validate repayment method
      if (!personData.repaymentMethod) {
        errors[`${prefix}repaymentMethod`] = 
          `${personLabel} must select an intended repayment method`;
      }
    };
  
    // Validate applicant repayment data
    validatePersonRepayment(repaymentData.applicant, 'applicant_');
  
    // Validate partner repayment data if exists
    if (hasPartner) {
      validatePersonRepayment(repaymentData.partner, 'partner_');
    }
  
    return errors;
  };