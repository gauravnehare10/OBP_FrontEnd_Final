export const validateMainDetails = (mainDetails, partners) => {
    let errors = {};
  
    // Utility functions
    const isValidName = (name) => /^[a-zA-Z\s\-']+$/.test(name);
    const isValidDate = (date) => /\d{4}-\d{2}-\d{2}/.test(date);
    const isValidPhone = (phone) => /^[\d\s\+\(\)]{10,15}$/.test(phone);
    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isValidNiNumber = (ni) => /^[A-Z]{2}\d{6}[A-Z]$/.test(ni);
    const isValidPostcode = (postcode) => /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i.test(postcode);
    const isValidSalary = (salary) => !isNaN(salary) && salary >= 0;
  
    // Main Details Validations
    if (!mainDetails.title) errors.title = "Title is required";
    
    if (!mainDetails.forename) {
      errors.forename = "Forename is required";
    } else if (!isValidName(mainDetails.forename)) {
      errors.forename = "Forename must contain only letters";
    }
  
    if (mainDetails.middleName && !isValidName(mainDetails.middleName)) {
      errors.middleName = "Middle name must contain only letters";
    }
  
    if (!mainDetails.surname) {
      errors.surname = "Surname is required";
    } else if (!isValidName(mainDetails.surname)) {
      errors.surname = "Surname must contain only letters";
    }
  
    if (!isValidDate(mainDetails.dateOfBirth)) {
      errors.dateOfBirth = "Invalid date format (YYYY-MM-DD)";
    }
  
    if (!mainDetails.age || isNaN(mainDetails.age)) {
      errors.age = "Age must be a number";
    }
  
    if (!mainDetails.genderAtBirth) {
      errors.genderAtBirth = "Gender at birth is required";
    }
  
    if (!mainDetails.identifiesAs) {
      errors.identifiesAs = "This field is required";
    }
  
    if (!mainDetails.niNumber) {
      errors.niNumber = "NI Number is required";
    } else if (!isValidNiNumber(mainDetails.niNumber)) {
      errors.niNumber = "Invalid NI Number format (AB123456C)";
    }
  
    if (!mainDetails.nationality) {
      errors.nationality = "Nationality is required";
    }
  
    if (!mainDetails.postcode) {
      errors.postcode = "Postcode is required";
    } else if (!isValidPostcode(mainDetails.postcode)) {
      errors.postcode = "Invalid postcode format";
    }
  
    if (!mainDetails.mobilePhone) {
      errors.mobilePhone = "Mobile number is required";
    } else if (!isValidPhone(mainDetails.mobilePhone)) {
      errors.mobilePhone = "Invalid phone number";
    }
  
    if (!mainDetails.addressLine1) {
      errors.addressLine1 = "Address line 1 is required";
    }
  
    if (!mainDetails.city) {
      errors.city = "City is required";
    }
  
    if (!mainDetails.country) {
      errors.country = "Country is required";
    }
  
    if (mainDetails.emails.length === 0) {
      errors.emails = "At least one email is required";
    } else {
      mainDetails.emails.forEach((email, index) => {
        if (!isValidEmail(email.email)) {
          errors[`email_${index}`] = "Invalid email format";
        }
        if (!email.type) {
          errors[`emailType_${index}`] = "Email type is required";
        }
      });
    }
  
    // Partner Validations
    partners.forEach((partner, partnerIndex) => {
      const prefix = `partner_${partnerIndex}_`;
  
      if (!partner.title) errors[`${prefix}title`] = "Title is required";
      
      if (!partner.forename) {
        errors[`${prefix}forename`] = "Forename is required";
      } else if (!isValidName(partner.forename)) {
        errors[`${prefix}forename`] = "Forename must contain only letters";
      }
  
      if (!partner.surname) {
        errors[`${prefix}surname`] = "Surname is required";
      } else if (!isValidName(partner.surname)) {
        errors[`${prefix}surname`] = "Surname must contain only letters";
      }
  
      if (!isValidDate(partner.dateOfBirth)) {
        errors[`${prefix}dateOfBirth`] = "Invalid date format (YYYY-MM-DD)";
      }
  
      if (!partner.age || isNaN(partner.age)) {
        errors[`${prefix}age`] = "Age must be a number";
      }
  
      if (!partner.niNumber) {
        errors[`${prefix}niNumber`] = "NI Number is required";
      } else if (!isValidNiNumber(partner.niNumber)) {
        errors[`${prefix}niNumber`] = "Invalid NI Number format (AB123456C)";
      }
  
      if (partner.emails.length === 0) {
        errors[`${prefix}emails`] = "At least one email is required";
      } else {
        partner.emails.forEach((email, emailIndex) => {
          if (!isValidEmail(email.email)) {
            errors[`${prefix}email_${emailIndex}`] = "Invalid email format";
          }
          if (!email.type) {
            errors[`${prefix}emailType_${emailIndex}`] = "Email type is required";
          }
        });
      }
    });
  
    return errors;
  };