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
 
  const fields = ['Technologies', 'Learning', 'Job and Recruitment', 'Company Reviews', 'Others']
  const infomation = data ? fields.map((i)=>{
    if(data[i]) {
      return data[i];
    } else {
      return 0;
    }
  }) : [0,0,0,0,0]

  useEffect(() => {
    setChartData({
      labels: fields,
      datasets: [
        {
          label: 'amount',
          data: infomation,
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