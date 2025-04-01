import React, { useEffect, useState } from "react";
import "./Navbar.css";
import { NavLink } from "react-router-dom";
import useFormStore from "../store";

const mortgageNav = [
  { path: "/mortgage/add-details/application-type", label: "Application Type" },
  { path: "/mortgage/add-details/early-repayment", label: "Early Repayment/Moving Home/Product Types" },
  { path: "/mortgage/add-details/prioritise-your-needs", label: "Prioritise Your Needs" },
  { path: "/mortgage/add-details/establish-budget", label: "Establishing a Budget" },
  { path: "/mortgage/add-details/mortgage-details", label: "Mortgage Details" },
  { path: "/mortgage/add-details/repaying-mortgage", label: "Repaying Mortgage" },
  { path: "/mortgage/add-details/solicitor-estate-agent", label: "Solicitor/Estate Agent Details" },
  { path: "/mortgage/add-details/declaration", label: "Declaration" }
]

const NavItem = ({ path, label }) => (
  <li style={{ paddingLeft: "20px" }}>
    <NavLink to={path} className={({ isActive }) => (isActive ? "active-link" : "")}>
      {label}
    </NavLink>
  </li>
);

const Navbar = () => {
  const { formData, fetchFormData } = useFormStore();
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => setIsOpen((prev) => !prev);

  useEffect(()=>{
    fetchFormData("occupationData")
  },[fetchFormData])

  const baseNav = [
    { path: "/mortgage/add-details/personal-details", label: "Main Details" },
    { path: "/mortgage/add-details/residential", label: "Residential Details" },
    { path: "/mortgage/add-details/occupation", label: "Occupation Details" },
    { path: "/mortgage/add-details/employer-benefit", label: "Employer Benefit" },
    { path: "/mortgage/add-details/secondary-occupation", label: "Secondary Occupation Details" },
    { path: "/mortgage/add-details/other-monthly-income", label: "Other Monthly Income" },
    { path: "/mortgage/add-details/other-income-source", label: "Non-Working - Other Income Source" },
    { path: "/mortgage/add-details/total-income", label: "Total Income Details" },
    { path: "/mortgage/add-details/existing-credit-commits", label: "Liabilities - Credit Commitments" },
    { path: "/mortgage/add-details/existing-mortgage", label: "Liabilities - Existing Mortgage" },
    { path: "/mortgage/add-details/monthly-expenditure", label: "Monthly Expenditure Details" },
    { path: "/mortgage/add-details/emergency-fund", label: "Emergency Fund/Health & Will Detail" },
  ];

  const employerBenefitIndex = baseNav.findIndex(
    (item) => item.label === "Employer Benefit"
  );

  const mainDetails = [
    { path: "/mortgage/add-details/main-details", label: "Main Details" },
  ]

  const personalNav = [
    ...baseNav.slice(0, employerBenefitIndex + 1),
    ...(formData.occupationData?.status === "Self-Employed"
      ? [
          { path: "/mortgage/add-details/self-employed-details", label: "Self Employed Details" },
          { path: "/mortgage/add-details/self-employed-income-details", label: "Self Employed Income Details" },
        ]
      : []),
    ...baseNav.slice(employerBenefitIndex + 1),
  ];

  return (
    <>
      {/* Toggle Button */}
      <button
        className="nav-toggle"
        onClick={toggleNavbar}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? "←" : "→"}
      </button>

      {/* Left Fixed Navbar */}
      <nav className={`mortgage-navbar ${isOpen ? "open" : ""}`}>
        <details open>
          <summary>Main Details</summary>
          <ul className="mort-nav-links">
            {mainDetails.map((item) => (
              <NavItem key={item.path} path={item.path} label={item.label} />
            ))}
          </ul>
        </details>
        <details open>
          <summary>Personal Details</summary>
          <ul className="mort-nav-links">
            {personalNav.map((item) => (
              <NavItem key={item.path} path={item.path} label={item.label} />
            ))}
          </ul>
        </details>
        <details open>
          <summary>Mortage</summary>
          <ul className="mort-nav-links">
            {mortgageNav.map((item) => (
              <NavItem key={item.path} path={item.path} label={item.label} />
            ))}
          </ul>
        </details>
      </nav>
    </>
  );
};

export default Navbar;
