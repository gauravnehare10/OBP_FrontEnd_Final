import { expenditureCategories } from "../MonthlyExpenditure";
export const validateMonthlyExpenditure = (expenditureData, hasPartner) => {
    let errors = {};
  
    // Utility function to validate expenditure amounts
    const isValidExpenditure = (value) => {
      if (value === '' || value === null || value === undefined) return false;
      const num = parseFloat(value);
      return !isNaN(num) && num >= 0;
    };
  
    // Validate a single person's expenditure
    const validatePersonExpenditure = (personData, prefix) => {
      const personLabel = prefix === 'applicant_' ? 'You' : 'Your partner';
  
      // Validate all expenditure categories
      const allCategories = [
        ...expenditureCategories.committedExpend,
        ...expenditureCategories.utilities,
        ...expenditureCategories.creditCommits,
        ...expenditureCategories.insurances,
        ...expenditureCategories.genLivingCosts,
        ...expenditureCategories.savingInvest,
        ...expenditureCategories.nonCommitExpend
      ];
  
      allCategories.forEach(({ key }) => {
        if (!isValidExpenditure(personData[key])) {
          errors[`${prefix}${key}`] = `${personLabel} must enter a valid amount for ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`;
        }
      });
  
      // Validate total expenditure calculation
      if (!isValidExpenditure(personData.totalExpenditure)) {
        errors[`${prefix}totalExpenditure`] = `${personLabel} must calculate total expenditure`;
      }
  
      // Additional validation: Check if total seems reasonable
      const calculatedTotal = allCategories.reduce((sum, { key }) => sum + (parseFloat(personData[key]) || 0), 0);
      if (Math.abs(calculatedTotal - parseFloat(personData.totalExpenditure)) > 1) {
        errors[`${prefix}totalMismatch`] = `${personLabel}: Calculated total doesn't match individual amounts`;
      }
    };
  
    // Validate applicant expenditure
    validatePersonExpenditure(expenditureData.applicant, 'applicant_');
  
    // Validate partner expenditure if exists
    if (hasPartner) {
      validatePersonExpenditure(expenditureData.partner, 'partner_');
    }
  
    return errors;
  };