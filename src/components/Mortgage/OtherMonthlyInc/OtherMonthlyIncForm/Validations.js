export const validateOtherMonthlyIncome = (incomeData, hasPartner) => {
    let errors = {};
  
    // Utility function to validate income amounts
    const isValidIncome = (value) => {
      if (value === '' || value === null || value === undefined) return false;
      const num = parseFloat(value);
      return !isNaN(num) && num >= 0;
    };
  
    // Validate a single person's income data
    const validatePersonIncome = (personData, prefix) => {
      const personLabel = prefix === 'applicant_' ? 'You' : 'Your partner';
  
      // Validate main income fields
      const incomeFields = [
        { field: 'occupationalPension', name: 'occupational pension' },
        { field: 'personalPension', name: 'personal pension' },
        { field: 'statePension', name: 'state pension' },
        { field: 'investments', name: 'investments' },
        { field: 'maintenance', name: 'maintenance' },
        { field: 'rentalIncome', name: 'rental income' },
      ];
  
      incomeFields.forEach(({ field, name }) => {
        if (!isValidIncome(personData[field])) {
          errors[`${prefix}${field}`] = `${personLabel} must enter valid ${name}`;
        }
      });
  
      // Validate state benefits selection
      if (personData.receivesStateBenefits === undefined || personData.receivesStateBenefits === '') {
        errors[`${prefix}receivesStateBenefits`] = `${personLabel} must select state benefits option`;
      }
  
      // Validate state benefits amounts if applicable
      if (personData.receivesStateBenefits === 'Yes') {
        const benefitFields = [
          { field: 'childBenefit', name: 'child benefit' },
          { field: 'childTaxCredits', name: 'child tax credits' },
          { field: 'workingTaxCredits', name: 'working tax credits' },
          { field: 'disabilityLivingAllowance', name: 'disability living allowance' },
          { field: 'attendanceAllowance', name: 'attendance allowance' },
          { field: 'housingBenefit', name: 'housing benefit' },
          { field: 'employmentSupportAllowance', name: 'employment support allowance' },
          { field: 'other', name: 'other benefits' },
        ];
  
        benefitFields.forEach(({ field, name }) => {
          if (!isValidIncome(personData.stateBenefits?.[field])) {
            errors[`${prefix}stateBenefits_${field}`] = `${personLabel} must enter valid ${name} amount`;
          }
        });
  
        // Check if at least one benefit has value > 0
        const hasBenefits = benefitFields.some(
          ({ field }) => parseFloat(personData.stateBenefits?.[field]) > 0
        );
        
        if (!hasBenefits) {
          errors[`${prefix}stateBenefits`] = `${personLabel} must enter at least one benefit amount`;
        }
      }
  
      // Validate total income calculation
      if (!isValidIncome(personData.totalOtherIncome)) {
        errors[`${prefix}totalOtherIncome`] = `${personLabel} must calculate total income`;
      }
    };
  
    // Validate applicant income
    validatePersonIncome(incomeData.applicant, 'applicant_');
  
    // Validate partner income if exists
    if (hasPartner) {
      validatePersonIncome(incomeData.partner, 'partner_');
    }
  
    return errors;
  };