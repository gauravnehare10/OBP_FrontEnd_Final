export const validateTotalIncome = (incomeData, hasPartner) => {
    let errors = {};
  
    // Utility function to validate income amounts
    const isValidIncome = (value) => {
      if (value === '' || value === null || value === undefined) return false;
      const num = parseFloat(value);
      return !isNaN(num) && num >= 0;
    };
  
    // Validate a single person's income data
    const validatePersonIncome = (personData, prefix) => {
      const personLabel = prefix === 'applicant_' ? 'You' : 'Your partner';
  
      // Validate main income fields
      const incomeFields = [
        { field: 'annualGrossMainIncome', name: 'annual gross main income' },
        { field: 'netProfitBeforeTax', name: 'net profit before tax' },
        { field: 'annualOtherIncome', name: 'annual other income' },
      ];
  
      incomeFields.forEach(({ field, name }) => {
        if (!isValidIncome(personData[field])) {
          errors[`${prefix}${field}`] = `${personLabel} must enter valid ${name}`;
        }
      });
  
      // Validate calculated fields
      if (!isValidIncome(personData.totalAnnualIncome)) {
        errors[`${prefix}totalAnnualIncome`] = `${personLabel} must calculate total annual income`;
      }
  
      if (!isValidIncome(personData.totalNetMonthlyIncome)) {
        errors[`${prefix}totalNetMonthlyIncome`] = `${personLabel} must calculate net monthly income`;
      }
    };
  
    // Validate applicant income
    validatePersonIncome(incomeData.applicant, 'applicant_');
  
    // Validate partner income if exists
    if (hasPartner) {
      validatePersonIncome(incomeData.partner, 'partner_');
    }
  
    return errors;
  };