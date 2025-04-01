export const validateMortgageDetails = (mortgageDetails, hasPartner) => {
    let errors = {};
  
    // Utility functions
    const isValidNumber = (value) => !isNaN(parseFloat(value)) && parseFloat(value) >= 0;
    const isValidSelection = (value, options) => options.includes(value);
    const isValidDate = (value) => !value || !isNaN(Date.parse(value));
    const isValidAddress = (address) => address && address.length >= 5 && address[4] === 'United Kingdom';
    const isValidText = (value) => typeof value === 'string' && value.trim().length > 0;
  
    // Validate a single person's mortgage details
    const validatePersonData = (personData, prefix) => {
      const personLabel = prefix === 'applicant_' ? 'You' : 'Your partner';
  
      // Found property validation
      if (!isValidSelection(personData.foundProperty, ['Yes', 'No'])) {
        errors[`${prefix}foundProperty`] = `${personLabel} must specify if property is found`;
      }
  
      // Property details validation (if property found)
      if (personData.foundProperty === 'Yes') {
        if (!isValidAddress(personData.address)) {
          errors[`${prefix}address`] = `${personLabel} must provide a valid property address`;
        }
  
        if (!isValidText(personData.propertyAddress)) {
          errors[`${prefix}propertyAddress`] = `${personLabel} must provide property address details`;
        }
      }
  
      // Financial validation
      if (!isValidNumber(personData.purchasePrice)) {
        errors[`${prefix}purchasePrice`] = `${personLabel} must enter a valid purchase price`;
      }
  
      if (!isValidNumber(personData.depositAmount)) {
        errors[`${prefix}depositAmount`] = `${personLabel} must enter a valid deposit amount`;
      }
  
      if (parseFloat(personData.depositAmount) > parseFloat(personData.purchasePrice)) {
        errors[`${prefix}depositAmount`] = `${personLabel} deposit cannot exceed purchase price`;
      }
  
      if (!isValidSelection(personData.depositSource, ['Savings', 'Gift', 'Builder', 'Equity', ''])) {
        errors[`${prefix}depositSource`] = `${personLabel} must select a valid deposit source`;
      }
  
      // Term validation
      if (!isValidNumber(personData.preferredTermYears) || parseInt(personData.preferredTermYears) < 1) {
        errors[`${prefix}preferredTermYears`] = `${personLabel} must enter valid term years (minimum 1)`;
      }
  
      if (!isValidNumber(personData.preferredTermMonths) || 
          parseInt(personData.preferredTermMonths) < 0 || 
          parseInt(personData.preferredTermMonths) > 11) {
        errors[`${prefix}preferredTermMonths`] = `${personLabel} must enter valid term months (0-11)`;
      }
  
      if (!isValidNumber(personData.mortgageFreeAge)) {
        errors[`${prefix}mortgageFreeAge`] = `${personLabel} must enter valid mortgage-free age`;
      }
  
      // Retirement validation
      if (!isValidNumber(personData.plannedRetirementAge)) {
        errors[`${prefix}plannedRetirementAge`] = `${personLabel} must enter valid planned retirement age`;
      }
  
      if (!isValidDate(personData.dateOfBirth)) {
        errors[`${prefix}dateOfBirth`] = `${personLabel} must enter valid date of birth`;
      }
  
      if (!isValidSelection(personData.termBeyondRetirement, ['Yes', 'No'])) {
        errors[`${prefix}termBeyondRetirement`] = `${personLabel} must specify if term extends past retirement`;
      }
  
      // New build validation
      if (!isValidSelection(personData.newBuild, ['Yes', 'No'])) {
        errors[`${prefix}newBuild`] = `${personLabel} must specify if property is new build`;
      }
  
      if (personData.newBuild === 'Yes' && !isValidSelection(personData.builderIncentives, ['Yes', 'No'])) {
        errors[`${prefix}builderIncentives`] = `${personLabel} must specify if builder incentives exist`;
      }
  
      // Government scheme validation
      if (!isValidSelection(personData.governmentScheme, ['Yes', 'No'])) {
        errors[`${prefix}governmentScheme`] = `${personLabel} must specify if government scheme is used`;
      }
  
      // Fees validation
      if (personData.increaseLoanAmount && !personData.confirmFeesInterest) {
        errors[`${prefix}confirmFeesInterest`] = `${personLabel} must confirm understanding of interest on fees`;
      }
    };
  
    // Validate applicant data
    validatePersonData(mortgageDetails.applicant, 'applicant_');
  
    // Validate partner data if exists
    if (hasPartner) {
      validatePersonData(mortgageDetails.partner, 'partner_');
    }
  
    return errors;
  };