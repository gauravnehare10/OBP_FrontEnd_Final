// validation.js

export const validatePersonalDetails = (mainClientDetails, partnerDetails, hasPartner) => {
    let errors = {};
  
    // Utility functions
    const isValidDate = (date) => /\d{4}-\d{2}-\d{2}/.test(date);
    const isValidName = (name) => /^[a-zA-Z\s]+$/.test(name);
    const isValidPhone = (phone) => /^\d{10,15}$/.test(phone);
    const isValidNiNumber = (ni) => /^[A-Z]{2}\d{6}[A-Z]$/.test(ni);
  
    // Main Client Validations
    if (!mainClientDetails.title) errors.title = "Title is required";
    if (!isValidName(mainClientDetails.forename)) errors.forename = "Forename must contain only letters";
    if (!isValidName(mainClientDetails.middleName) && mainClientDetails.middleName) errors.middleName = "Middle name must contain only letters";
    if (!isValidName(mainClientDetails.surname)) errors.surname = "Surname must contain only letters";
    if (mainClientDetails.previousName && !mainClientDetails.dateOfNameChange) errors.dateOfNameChange = "Date of name change is required if previous name exists";
    if (!isValidName(mainClientDetails.mothersMaidenName)) errors.mothersMaidenName = "Mother's maiden name must contain only letters";
    if (!isValidDate(mainClientDetails.dateOfBirth)) errors.dateOfBirth = "Invalid date format (YYYY-MM-DD)";
    if (!mainClientDetails.age || isNaN(mainClientDetails.age)) errors.age = "Age must be a number";
    if (!mainClientDetails.genderAtBirth) errors.genderAtBirth = "Gender at birth is required";
    if (!mainClientDetails.identifiesAs) errors.identifiesAs = "This field is required";
    if (!isValidNiNumber(mainClientDetails.niNumber)) errors.niNumber = "Invalid NI Number format (AB123456C)";
    if (!mainClientDetails.relationshipStatus) errors.relationshipStatus = "Relationship status is required";
    if (!mainClientDetails.nationality) errors.nationality = "Nationality is required";
    if (mainClientDetails.isExPatriate === '') errors.isExPatriate = "Ex-Patriate field is required";
    if (mainClientDetails.isPublicOfficial === '') errors.isPublicOfficial = "Public official field is required";
    if (!mainClientDetails.countryOfResidence) errors.countryOfResidence = "Country of residence is required";
    if (!mainClientDetails.tempOutsideUK) errors.tempOutsideUK = "Temporary stay outside UK information is required";
    if (!mainClientDetails.retirementAge || isNaN(mainClientDetails.retirementAge)) errors.retirementAge = "Retirement age must be a number";
    if (!isValidPhone(mainClientDetails.mobileNumber)) errors.mobileNumber = "Invalid mobile number";
    if (!isValidPhone(mainClientDetails.daytimeNumber)) errors.daytimeNumber = "Invalid daytime number";
  
    // Partner Validations (if exists)
    if (hasPartner) {
      if (!partnerDetails.title) errors.partner_title = "Title is required for partner";
      if (!isValidName(partnerDetails.forename)) errors.partner_forename = "Forename must contain only letters";
      if (!isValidName(partnerDetails.middleName) && partnerDetails.middleName) errors.partner_middleName = "Middle name must contain only letters";
      if (!isValidName(partnerDetails.surname)) errors.partner_surname = "Surname must contain only letters";
      if (partnerDetails.previousName && !partnerDetails.dateOfNameChange) errors.partner_dateOfNameChange = "Date of name change is required if previous name exists";
      if (!isValidName(partnerDetails.mothersMaidenName)) errors.partner_mothersMaidenName = "Mother's maiden name must contain only letters";
      if (!isValidDate(partnerDetails.dateOfBirth)) errors.partner_dateOfBirth = "Invalid date format (YYYY-MM-DD)";
      if (!partnerDetails.age || isNaN(partnerDetails.age)) errors.partner_age = "Age must be a number";
      if (!partnerDetails.genderAtBirth) errors.partner_genderAtBirth = "Gender at birth is required";
      if (!partnerDetails.identifiesAs) errors.partner_identifiesAs = "This field is required";
      if (!isValidNiNumber(partnerDetails.niNumber)) errors.partner_niNumber = "Invalid NI Number format (AB123456C)";
      if (!partnerDetails.relationshipStatus) errors.partner_relationshipStatus = "Relationship status is required";
      if (!partnerDetails.nationality) errors.partner_nationality = "Nationality is required";
      if (partnerDetails.isExPatriate === '') errors.partner_isExPatriate = "This field is required";
      if (partnerDetails.isPublicOfficial === '') errors.partner_isPublicOfficial = "This field is required";
      if (!partnerDetails.countryOfResidence) errors.partner_countryOfResidence = "Country of residence is required";
      if (!partnerDetails.tempOutsideUK) errors.partner_tempOutsideUK = "Temporary stay outside UK information is required";
      if (!partnerDetails.retirementAge || isNaN(partnerDetails.retirementAge)) errors.partner_retirementAge = "Retirement age must be a number";
      if (!isValidPhone(partnerDetails.mobileNumber)) errors.partner_mobileNumber = "Invalid mobile number";
      if (!isValidPhone(partnerDetails.daytimeNumber)) errors.partner_daytimeNumber = "Invalid daytime number";
    }
  
    // Dependent Validations
    mainClientDetails.dependents.forEach((dependent, index) => {
      if (!isValidName(dependent.dependentName)) errors[`dependentName_${index}`] = "Dependent name must contain only letters";
      if (!isValidDate(dependent.dependentDateOfBirth)) errors[`dependentDateOfBirth_${index}`] = "Invalid date format (YYYY-MM-DD)";
      if (!dependent.dependentAge || isNaN(dependent.dependentAge)) errors[`dependentAge_${index}`] = "Age must be a number";
      if (!dependent.isFinancialDependent) errors[`isFinancialDependent_${index}`] = "This field is required";
      if (!dependent.residesWith) errors[`residesWith_${index}`] = "This field is required";
    });
  
    return errors;
  };
  