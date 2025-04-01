const validateNonWorking = (applicant, partner, hasPartner) => {
    const errors = {};
  
    const validatePerson = (personData, personType) => {
      if (!personData.recOtherIncome) {
        errors[`${personType}_recOtherIncome`] = "This field is required.";
      }
  
      if (personData.recOtherIncome === "Yes") {
        if (!personData.monthlyAmount) {
          errors[`${personType}_monthlyAmount`] = "Monthly amount is required.";
        } else if (isNaN(personData.monthlyAmount) || personData.monthlyAmount <= 0) {
          errors[`${personType}_monthlyAmount`] = "Enter a valid positive number.";
        }
  
        if (!personData.moneyOriginatedFrom.trim()) {
          errors[`${personType}_moneyOriginatedFrom`] = "Please provide details about the money source.";
        }
      }
    };
  
    validatePerson(applicant, "applicant");
    if (hasPartner) {
      validatePerson(partner, "partner");
    }
  
    return errors;
  };
  
  export default validateNonWorking;
  