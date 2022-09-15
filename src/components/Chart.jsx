import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import React, { useState, useEffect } from "react";
 
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Chart = ({data, create, read}) => {
  const [chartData, setChartData] = useState({
    datasets: [],
  });
 
  const [chartOptions, setChartOptions] = useState({});
 
  useEffect(() => {
    setChartData({
      labels: ['Teachnologies', 'Learning', 'Job and Recruitment', 'Company Review', 'Others'],
      datasets: [
        {
          label: 'amount',
          data: data.map(i=>i.count),
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.4)",
        },
      ],
    });
    setChartOptions({
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: create ? "Created Articles" : "Read Articles",
        },
      },
    });
  }, []);
 
  return (
    <div className="mt-10">
      <Bar options={chartOptions} data={chartData} />
    </div>
  );
}

export default Chart