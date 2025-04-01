const validateSecOccupation = (applicant, partner, hasPartner, shouldAskQuestions) => {
  const errors = {};

  const validatePerson = (personData, personType) => {
    if (personData?.hasAddEarnedIncome === 'Yes') {
      if (!personData.secondaryEmploymentStatus) {
        errors[`${personType}_secondaryEmploymentStatus`] = "Employment status is required.";
      }

      if (personData.secondaryEmploymentStatus === 'Self-Employed' && !personData.selfEmployedType) {
        errors[`${personType}_selfEmployedType`] = "Self-employed type is required.";
      }

      // Validate only if shouldAskQuestions returns true
      if (shouldAskQuestions(personData)) {
        if (!personData.occupationStatus) {
          errors[`${personType}_occupationStatus`] = "Occupation status is required.";
        }
        if (!personData.secondaryOccupationTitle) {
          errors[`${personType}_secondaryOccupationTitle`] = "Occupation title is required.";
        }
        if (!personData.hoursOfWork) {
          errors[`${personType}_hoursOfWork`] = "Hours of work are required.";
        } else if (isNaN(personData.hoursOfWork) || personData.hoursOfWork <= 0) {
          errors[`${personType}_hoursOfWork`] = "Enter a valid number of hours.";
        }
        if (!personData.secondaryEmployerName) {
          errors[`${personType}_secondaryEmployerName`] = "Employer name is required.";
        }
        if (!personData.secondaryEmployerPostcode) {
          errors[`${personType}_secondaryEmployerPostcode`] = "Postcode is required.";
        }
        if (!personData.secondaryEmployerAddress?.some((line) => line.trim() !== '')) {
          errors[`${personType}_secondaryEmployerAddress`] = "Employer address is required.";
        }
      }
    }
  };

  validatePerson(applicant, 'applicant');
  if (hasPartner) {
    validatePerson(partner, 'partner');
  }

  return errors;
};

export default validateSecOccupation;