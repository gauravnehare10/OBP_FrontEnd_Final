export const validateCreditCommitments = (creditData, hasPartner) => {
    let errors = {};
  
    // Utility functions
    const isValidText = (value) => value && value.trim().length > 0;
    const isValidNumber = (value) => !isNaN(parseFloat(value)) && parseFloat(value) >= 0;
    const isValidSelection = (value) => ['Yes', 'No'].includes(value);
  
    // Validate a single person's credit commitments
    const validatePersonCommitments = (personData, prefix) => {
      const personLabel = prefix === 'applicant_' ? 'You' : 'Your partner';
  
      // Validate the initial Yes/No selection
      if (!isValidSelection(personData.hasExCreditCommit)) {
        errors[`${prefix}hasExCreditCommit`] = `${personLabel} must select if you have credit commitments`;
      }
  
      // Validate each credit commitment if they exist
      if (personData.hasExCreditCommit === 'Yes') {
        if (personData.creditCommitments.length === 0) {
          errors[`${prefix}creditCommitments`] = `${personLabel} must add at least one credit commitment`;
        }
  
        personData.creditCommitments.forEach((commitment, index) => {
          const commitmentPrefix = `${prefix}commitment_${index}_`;
  
          if (!isValidText(commitment.creditType)) {
            errors[`${commitmentPrefix}creditType`] = `${personLabel}: Credit type is required for commitment ${index + 1}`;
          }
  
          if (!isValidText(commitment.lenderName)) {
            errors[`${commitmentPrefix}lenderName`] = `${personLabel}: Lender name is required for commitment ${index + 1}`;
          }
  
          if (!isValidNumber(commitment.amountOutstanding)) {
            errors[`${commitmentPrefix}amountOutstanding`] = `${personLabel}: Valid amount outstanding is required for commitment ${index + 1}`;
          }
  
          if (!isValidNumber(commitment.monthlyRepayment)) {
            errors[`${commitmentPrefix}monthlyRepayment`] = `${personLabel}: Valid monthly repayment is required for commitment ${index + 1}`;
          }
  
          if (!isValidText(commitment.monthsOutstanding)) {
            errors[`${commitmentPrefix}monthsOutstanding`] = `${personLabel}: Months outstanding is required for commitment ${index + 1}`;
          }
  
          if (!isValidSelection(commitment.consideringConsolidation)) {
            errors[`${commitmentPrefix}consideringConsolidation`] = `${personLabel}: Consolidation selection is required for commitment ${index + 1}`;
          }
  
          if (commitment.consideringConsolidation === 'No' && !isValidSelection(commitment.repayBeforeMortgage)) {
            errors[`${commitmentPrefix}repayBeforeMortgage`] = `${personLabel}: Repayment selection is required for commitment ${index + 1}`;
          }
        });
      }
    };
  
    // Validate applicant commitments
    validatePersonCommitments(creditData.applicant, 'applicant_');
  
    // Validate partner commitments if exists
    if (hasPartner) {
      validatePersonCommitments(creditData.partner, 'partner_');
    }
  
    return errors;
  };