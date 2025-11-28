import React from "react";
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
import { useSelector } from "react-redux";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PaymentGraph = () => {
  const { monthlyRevenue } = useSelector((state) => state.superAdmin);

  const data = {
    labels: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ],
    datasets: [
      {
        label: "Revenue ($)",
        data: monthlyRevenue,
        backgroundColor: "#4A90E2", // Our --brand blue
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
        y: { beginAtZero: true }
    },
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
  };

  return <Bar data={data} options={options} />;
};

export default PaymentGraph;