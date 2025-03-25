import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const ProcessBar = ({ categories }) => {
  const categoryColors = {
    Other: "#FF6384",         // Red
    Rent: "#36A2EB",          // Blue
    Entertainment: "rgb(130, 10, 171);",
    "Monthly Savings": "#FFCE56" // Yellow
  };

  const totalPercentage = Object.values(categories).reduce((a, b) => a + b, 0);
  let currentPercentage = 0;

  return (
    <div style={{ width: 200, height: 200, position: "relative" }}>
      {Object.keys(categories).map((category, index) => {
        const value = categories[category];

        return (
          <CircularProgressbar
            key={index}
            value={currentPercentage + value}
            text={`${totalPercentage.toFixed(0)}%`}
            styles={buildStyles({
              pathTransitionDuration: 0.5,
              pathColor: categoryColors[category],
              trailColor: "transparent",
              textColor: "#000",
              strokeLinecap: "round",
            })}
          />
        );
      })}
    </div>
  );
};

export default ProcessBar;