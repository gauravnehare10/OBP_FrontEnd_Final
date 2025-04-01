const validateEmployerBenefit = (benefitData, hasPartner) => {
  let errors = [];

  const validateFields = (clientType, data) => {
    if (!data.sickPayOtherThanSSP) {
      errors.push(`${clientType} - Sick Pay Other Than SSP is required.`);
    }

    if (!data.employerBenefits || data.employerBenefits.length === 0) {
      errors.push(`${clientType} - At least one Employer Benefit must be selected.`);
    }

    if (data.employerBenefits.includes("Other") && !data.furtherDetails) {
      errors.push(`${clientType} - Further details are required for 'Other' benefits.`);
    }

    if (!data.otherFlexibleBenefits) {
      errors.push(`${clientType} - Other Flexible Benefits are required.`);
    }

    if (!data.includeInShortfall) {
      errors.push(`${clientType} - Include In Shortfall is required.`);
    }
  };

  validateFields("Client", benefitData.client);
  if (hasPartner) {
    validateFields("Partner", benefitData.partner);
  }

  return errors.length > 0 ? { generalErrors: errors } : {};
};

export default validateEmployerBenefit;
