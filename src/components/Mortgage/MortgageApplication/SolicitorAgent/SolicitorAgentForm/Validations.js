export const validateSolicitorAgent = (data) => {
    const errors = {};
    const ukPostcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;
    const ukPhoneRegex = /^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/;
  
    // Helper to check if any solicitor fields are filled
    const hasSolicitorData = 
      data.solicitorFirmName || 
      data.solicitorPostcode || 
      data.solicitorAddresses.some(a => a) || 
      data.solicitorContactName || 
      data.solicitorContactNumber;
  
    // Validate solicitor section if any data exists
    if (hasSolicitorData) {
      if (!data.solicitorFirmName) {
        errors.solicitorFirmName = 'Solicitor firm name is required';
      }
  
      if (data.solicitorPostcode && !ukPostcodeRegex.test(data.solicitorPostcode)) {
        errors.solicitorPostcode = 'Please enter a valid UK postcode';
      }
  
      if (data.solicitorPostcode && !data.solicitorAddresses.some(a => a)) {
        errors.solicitorAddresses = 'At least one address line is required';
      }
  
      if (!data.solicitorContactName) {
        errors.solicitorContactName = 'Solicitor contact name is required';
      }
  
      if (data.solicitorContactNumber && !ukPhoneRegex.test(data.solicitorContactNumber)) {
        errors.solicitorContactNumber = 'Please enter a valid UK phone number';
      }
    }
  
    // Helper to check if any estate agent fields are filled
    const hasEstateAgentData = 
      data.estateAgentName || 
      data.estateAgentPostcode || 
      data.estateAgentAddresses.some(a => a) || 
      data.estateAgentContactName || 
      data.estateAgentContactNumber;
  
    // Validate estate agent section if any data exists
    if (hasEstateAgentData) {
      if (!data.estateAgentName) {
        errors.estateAgentName = 'Estate agent name is required';
      }
  
      if (data.estateAgentPostcode && !ukPostcodeRegex.test(data.estateAgentPostcode)) {
        errors.estateAgentPostcode = 'Please enter a valid UK postcode';
      }
  
      if (data.estateAgentPostcode && !data.estateAgentAddresses.some(a => a)) {
        errors.estateAgentAddresses = 'At least one address line is required';
      }
  
      if (!data.estateAgentContactName) {
        errors.estateAgentContactName = 'Estate agent contact name is required';
      }
  
      if (data.estateAgentContactNumber && !ukPhoneRegex.test(data.estateAgentContactNumber)) {
        errors.estateAgentContactNumber = 'Please enter a valid UK phone number';
      }
    }
  
    return errors;
  };