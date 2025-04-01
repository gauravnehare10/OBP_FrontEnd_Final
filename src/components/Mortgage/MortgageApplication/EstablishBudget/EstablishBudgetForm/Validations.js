export const validateEstablishBudget = (budgetData, hasPartner) => {
    let errors = {};
  
    // Utility functions
    const isValidAmount = (value) => {
      const num = parseFloat(value);
      return !isNaN(num) && num >= 0;
    };
    const isReasonableAllocation = (netIncome, allocation) => {
      return parseFloat(allocation) <= parseFloat(netIncome) * 1.1;
    };
  
    // Validate a single person's budget data
    const validatePersonData = (personData, prefix) => {
      const personLabel = prefix === 'applicant_' ? 'You' : 'Your partner';
  
      // Net disposable income validation
      if (!isValidAmount(personData.netDisposableIncome)) {
        errors[`${prefix}netDisposableIncome`] = 
          `${personLabel} must enter a valid net disposable income (≥ 0)`;
      }
  
      // Monthly mortgage allocation validation
      if (!isValidAmount(personData.monthlyMortgageAllocation)) {
        errors[`${prefix}monthlyMortgageAllocation`] = 
          `${personLabel} must enter a valid monthly allocation (≥ 0)`;
      } else if (!isReasonableAllocation(
        personData.netDisposableIncome,
        personData.monthlyMortgageAllocation
      )) {
        errors[`${prefix}monthlyMortgageAllocation`] = 
          `${personLabel} allocation cannot exceed net income by more than 10%`;
      }
    };
  
    // Validate applicant data
    validatePersonData(budgetData.applicant, 'applicant_');
  
    // Validate partner data if exists
    if (hasPartner) {
      validatePersonData(budgetData.partner, 'partner_');
    }
  
    return errors;
  };