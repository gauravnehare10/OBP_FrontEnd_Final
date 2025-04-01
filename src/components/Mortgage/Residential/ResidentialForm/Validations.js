export const validateResidentialDetails = (residentialData, hasPartner) => {
    let errors = {};
  
    // Utility functions
    const isValidDate = (date) => date && /^\d{4}-\d{2}-\d{2}$/.test(date);
    const isValidPostcode = (postcode) => postcode && /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i.test(postcode);
    const isPastDate = (date) => date && new Date(date) <= new Date();
  
    // Validate client residences
    residentialData.client?.forEach((residence, index) => {
      const prefix = `client_${index}_`;
  
      if (!residence.status) {
        errors[`${prefix}status`] = "Residential status is required";
      }
  
      if (!isValidDate(residence.dateMovedIn)) {
        errors[`${prefix}dateMovedIn`] = "Valid date moved in is required (YYYY-MM-DD)";
      } else if (!isPastDate(residence.dateMovedIn)) {
        errors[`${prefix}dateMovedIn`] = "Date moved in cannot be in the future";
      }
  
      if (!residence.postcode) {
        errors[`${prefix}postcode`] = "Postcode is required";
      } else if (!isValidPostcode(residence.postcode)) {
        errors[`${prefix}postcode`] = "Invalid postcode format";
      }
  
      // Address validation
      if (!residence.address?.[0]?.trim()) {
        errors[`${prefix}addressLine1`] = "Address line 1 is required";
      }
      if (!residence.address?.[1]?.trim()) {
        errors[`${prefix}city`] = "City is required";
      }
      if (!residence.address?.[4]?.trim()) {
        errors[`${prefix}country`] = "Country is required";
      }
    });
  
    // Validate partner residences if exists
    if (hasPartner) {
      residentialData.partner?.forEach((residence, index) => {
        const prefix = `partner_${index}_`;
  
        if (!residence.status) {
          errors[`${prefix}status`] = "Residential status is required";
        }
  
        if (!isValidDate(residence.dateMovedIn)) {
          errors[`${prefix}dateMovedIn`] = "Valid date moved in is required (YYYY-MM-DD)";
        } else if (!isPastDate(residence.dateMovedIn)) {
          errors[`${prefix}dateMovedIn`] = "Date moved in cannot be in the future";
        }
  
        if (!residence.postcode) {
          errors[`${prefix}postcode`] = "Postcode is required";
        } else if (!isValidPostcode(residence.postcode)) {
          errors[`${prefix}postcode`] = "Invalid postcode format";
        }
  
        // Address validation
        if (!residence.address?.[0]?.trim()) {
          errors[`${prefix}addressLine1`] = "Address line 1 is required";
        }
        if (!residence.address?.[1]?.trim()) {
          errors[`${prefix}city`] = "City is required";
        }
        if (!residence.address?.[4]?.trim()) {
          errors[`${prefix}country`] = "Country is required";
        }
      });
    }
  
    return errors;
  };