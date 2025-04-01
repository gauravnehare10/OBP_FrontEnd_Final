export const validateExistingMortgages = (mortgageData, hasPartner) => {
    let errors = {};
  
    // Utility functions
    const isValidText = (value) => value && value.trim().length > 0;
    const isValidNumber = (value) => !isNaN(parseFloat(value)) && parseFloat(value) >= 0;
    const isValidSelection = (value, options) => options.includes(value);
    const isValidDate = (value) => !value || !isNaN(Date.parse(value));
    const isValidAddress = (address) => address && address.length >= 5 && address[4] === 'United Kingdom';
  
    // Validate a single person's mortgages
    const validatePersonMortgages = (personData, prefix) => {
      const personLabel = prefix === 'applicant_' ? 'You' : 'Your partner';
  
      // Validate the initial Yes/No selection
      if (!isValidSelection(personData.hasMortgage, ['Yes', 'No'])) {
        errors[`${prefix}hasMortgage`] = `${personLabel} must select if you have existing mortgages`;
      }
  
      // Validate each mortgage if they exist
      if (personData.hasMortgage === 'Yes') {
        if (personData.mortgages.length === 0) {
          errors[`${prefix}mortgages`] = `${personLabel} must add at least one mortgage`;
        }
  
        personData.mortgages.forEach((mortgage, index) => {
          const mortgagePrefix = `${prefix}mortgage_${index}_`;
  
          // Required fields for all mortgages
          if (!isValidSelection(mortgage.mortgageType, ['Fixed', 'Tracker', 'Variable'])) {
            errors[`${mortgagePrefix}mortgageType`] = `${personLabel}: Mortgage type is required`;
          }
  
          if (!isValidNumber(mortgage.currentValue)) {
            errors[`${mortgagePrefix}currentValue`] = `${personLabel}: Valid current value is required`;
          }
  
          if (!isValidText(mortgage.lenderName)) {
            errors[`${mortgagePrefix}lenderName`] = `${personLabel}: Lender name is required`;
          }
  
          if (!isValidText(mortgage.accountNumber)) {
            errors[`${mortgagePrefix}accountNumber`] = `${personLabel}: Account number is required`;
          }
  
          if (!isValidNumber(mortgage.currentBalance)) {
            errors[`${mortgagePrefix}currentBalance`] = `${personLabel}: Valid current balance is required`;
          }
  
          if (!isValidNumber(mortgage.remainingTerm)) {
            errors[`${mortgagePrefix}remainingTerm`] = `${personLabel}: Valid remaining term is required`;
          }
  
          if (!isValidNumber(mortgage.monthlyRepayment)) {
            errors[`${mortgagePrefix}monthlyRepayment`] = `${personLabel}: Valid monthly repayment is required`;
          }
  
          if (!isValidSelection(mortgage.repaymentType, ['Repayment', 'Interest Only'])) {
            errors[`${mortgagePrefix}repaymentType`] = `${personLabel}: Repayment type is required`;
          }
  
          if (!isValidSelection(mortgage.willRedeemNow, ['Yes', 'No'])) {
            errors[`${mortgagePrefix}willRedeemNow`] = `${personLabel}: Must specify if redeeming now`;
          }
  
          // Conditional validation based on willRedeemNow
          if (mortgage.willRedeemNow === 'Yes') {
            if (!isValidSelection(mortgage.interestRateType, ['Fixed', 'Variable'])) {
              errors[`${mortgagePrefix}interestRateType`] = `${personLabel}: Interest rate type is required when redeeming`;
            }
  
            if (!isValidNumber(mortgage.currentInterestRate)) {
              errors[`${mortgagePrefix}currentInterestRate`] = `${personLabel}: Valid current interest rate is required when redeeming`;
            }
  
            if (!isValidDate(mortgage.rateEndDate) && mortgage.interestRateType !== 'Variable') {
              errors[`${mortgagePrefix}rateEndDate`] = `${personLabel}: Valid rate end date is required when redeeming`;
            }
  
            if (!isValidNumber(mortgage.revertRate)) {
              errors[`${mortgagePrefix}revertRate`] = `${personLabel}: Valid revert rate is required when redeeming`;
            }
  
            if (!isValidSelection(mortgage.hasEarlyRepaymentCharges, ['Yes', 'No'])) {
              errors[`${mortgagePrefix}hasEarlyRepaymentCharges`] = `${personLabel}: Must specify early repayment charges when redeeming`;
            }
  
            if (!isValidSelection(mortgage.isPortable, ['Yes', 'No', 'N/A'])) {
              errors[`${mortgagePrefix}isPortable`] = `${personLabel}: Must specify if mortgage is portable when redeeming`;
            }
          }
  
          // Address validation
          if (!isValidText(mortgage.postcode)) {
            errors[`${mortgagePrefix}postcode`] = `${personLabel}: Postcode is required`;
          }
  
          if (!isValidAddress(mortgage.propertyAddress)) {
            errors[`${mortgagePrefix}propertyAddress`] = `${personLabel}: Valid UK address is required`;
          }
        });
      }
    };
  
    // Validate applicant mortgages
    validatePersonMortgages(mortgageData.applicant, 'applicant_');
  
    // Validate partner mortgages if exists
    if (hasPartner) {
      validatePersonMortgages(mortgageData.partner, 'partner_');
    }
  
    return errors;
  };