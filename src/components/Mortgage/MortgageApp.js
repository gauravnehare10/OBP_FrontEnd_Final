import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Navbar/Navbar';
import "./MortgageApp.css";
import PersonalDetails from './PersonalDetails/PersonalDetails';
import Residential from './Residential/Residential';
import OccupationDetails from './OccupationDetails/OccupationDetails';
import EmployerBenefit from './EmployerBenefit/EmployerBenefit';
import SecOccupation from './Details/SecOccupation';
import OtherMonthlyInc from './OtherMonthlyInc/OtherMonthlyInc';
import NonWorking from './NonWorking/NonWorking';
import TotalIncome from './TotalIncome/TotalIncome';
import ExCreditCommits from './ExCreditCommits/ExCreditCommits';
import ExMortgage from './ExMortgage/ExMortgage';
import MonthlyExpenditure from './MonthlyExpenditure/MonthlyExpenditure';
import EmergencyFund from './EmergencyFund/EmergencyFund';
import ApplicationType from './MortgageApplication/ApplicationType/ApplicationType';
import EarlyRepayment from './MortgageApplication/EarlyRepayment/EarlyRepayment';
import PrioritiseNeeds from './MortgageApplication/PrioritiseNeeds/PrioritiseNeeds';
import EstablishBudget from './MortgageApplication/EstablishBudget/EstablishBudget';
import MortgageDetails from './MortgageApplication/MortgageDetails/MortgageDetails';
import RepayingMortgage from './MortgageApplication/RepayingMortgage/RepayingMortgage';
import SolicitorAgent from './MortgageApplication/SolicitorAgent/SolicitorAgent';
import Declaration from './MortgageApplication/Declaration/Declaration';
import SelfEmployedDetails from './MortgageApplication/SelfEmployedDetails/SelfEmployedDetails';
import SelfEmpIncomeDetails from './MortgageApplication/SelfEmpIncomeDetails/SelfEmpIncomeDetails';
import MainDetails from './MainDetails/MainDetails';

export default function MortgageDataApp() {
  return (
    <div className="mortgage-container">
      <Navbar />
      <div className="main-content">
        <Routes>
          {/* Relative Routing for Nested Paths */}
          <Route path='/' element={<Navigate to="/mortgage/add-details/main-details" />} />
          <Route path='/main-details' element={<MainDetails />} />
          <Route path='/personal-details' element={<PersonalDetails />} />
          <Route path='/residential' element={<Residential />} />
          <Route path="/occupation" element={<OccupationDetails />} />
          <Route path="/employer-benefit" element={<EmployerBenefit />} />
          <Route path='self-employed-details' element={<SelfEmployedDetails />} />
          <Route path='self-employed-income-details' element={<SelfEmpIncomeDetails />} />
          <Route path='/secondary-occupation' element={<SecOccupation />} />
          <Route path='/other-monthly-income' element={<OtherMonthlyInc />} />
          <Route path='/other-income-source' element={<NonWorking />} />
          <Route path='/total-income' element={<TotalIncome />} />
          <Route path='/existing-credit-commits' element={<ExCreditCommits />} />
          <Route path='/existing-mortgage' element={<ExMortgage />} />
          <Route path='/monthly-expenditure' element={<MonthlyExpenditure />} />
          <Route path='/emergency-fund' element={<EmergencyFund />} />
          <Route path='/application-type' element={<ApplicationType />} />
          <Route path='/early-repayment' element={<EarlyRepayment />} />
          <Route path='/prioritise-your-needs' element={<PrioritiseNeeds />} />
          <Route path='/establish-budget' element={<EstablishBudget />} />
          <Route path='/mortgage-details' element={<MortgageDetails />} />
          <Route path='/repaying-mortgage' element={<RepayingMortgage />} />
          <Route path='/solicitor-estate-agent' element={<SolicitorAgent />} />
          <Route path='/declaration' element={<Declaration />} />
        </Routes>
      </div>
    </div>
  );
}
