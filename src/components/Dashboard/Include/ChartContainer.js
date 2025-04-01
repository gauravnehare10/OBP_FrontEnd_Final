import React from "react";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import { 
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
  } from 'chart.js';
  
  // Register all required components
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
  );

const ChartContainer = ({ title, data, chartType }) => {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return <Bar data={data} options={chartOptions} />;
      case "line":
        return <Line data={data} options={chartOptions} />;
      case "doughnut":
        return <Doughnut data={data} options={chartOptions} />;
      default:
        return <p>Unsupported chart type</p>;
    }
  };

  return (
    <div className="chart-container">
      <h2>{title}</h2>
      <div className="chart-wrapper">
        {data ? renderChart() : <p>Loading...</p>}
      </div>
    </div>
  );
};

export default ChartContainer;