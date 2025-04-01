const validateOccupationData = (data, isPartner) => {
  let errors = {};

  const validateFields = (key, clientData) => {
    const { status, selfEmployedType, previousEmployment } = clientData;

    if (['Retired', 'Unemployed', 'Houseperson'].includes(status)) {
      return;
    }
    
    if (!status) errors[`${key}-status`] = "Employment status is required.";

    if (status === "Self-Employed" && !selfEmployedType) {
      errors[`${key}-selfEmployedType`] = "Self-employed type is required.";
    }

    // Skip validation if Self-Employed but NOT a Director (<20% shareholding)
    const skipEmploymentValidation =
      status === "Self-Employed" &&
      selfEmployedType !== "Director (less than 20% shareholding)" &&
      previousEmployment.length === 0;

    if (!skipEmploymentValidation) {
      if (!clientData.jobTitle) errors[`${key}-jobTitle`] = "Job title is required.";
      if (!clientData.employmentType) errors[`${key}-employmentType`] = "Employment type is required.";

      if (!clientData.employerName) errors[`${key}-employerName`] = "Employer name is required.";

      if (!clientData.employerAddress || clientData.employerAddress.length < 5) {
        errors[`${key}-employerAddress`] = "Complete employer address is required.";
      } else {
        clientData.employerAddress.forEach((line, index) => {
          if (!line.trim()) errors[`${key}-employerAddress-${index}`] = `Address line ${index + 1} is required.`;
        });
      }

      if (!clientData.employerPostcode) errors[`${key}-employerPostcode`] = "Employer postcode is required.";
      if (!clientData.annualIncome) errors[`${key}-annualIncome`] = "Annual income is required.";
      if (!clientData.totalGrossIncome) errors[`${key}-totalGrossIncome`] = "Total gross income is required.";
      if (!clientData.totalNetIncome) errors[`${key}-totalNetIncome`] = "Total net income is required.";
    }

    // Validate previous employment if applicable
    if (previousEmployment.length > 0) {
      previousEmployment.forEach((prevJob, index) => {
        if (!prevJob.jobTitle) errors[`${key}-previousEmployment-${index}-jobTitle`] = `Previous job title is required at entry ${index + 1}.`;
        if (!prevJob.employerName) errors[`${key}-previousEmployment-${index}-employerName`] = `Previous employer name is required at entry ${index + 1}.`;
        if (!prevJob.employerPostcode) errors[`${key}-previousEmployment-${index}-employerPostcode`] = `Previous employer postcode is required at entry ${index + 1}.`;
      });
    }
  };

  validateFields("client", data.client);
  if (isPartner) validateFields("partner", data.partner);

  return errors;
};

export default validateOccupationData;
