import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useSelector } from "react-redux";

ChartJS.register( CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend );

const BiddersAuctioneersGraph = () => {
  const { totalAuctioneers, totalBidders } = useSelector((state) => state.superAdmin);
  
  const data = {
    labels: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ],
    datasets: [
      {
        label: "Bidders",
        data: totalBidders,
        borderColor: "#4A90E2", // Our --brand blue
        backgroundColor: "#4A90E2",
        tension: 0.3,
      },
      {
        label: "Auctioneers",
        data: totalAuctioneers,
        borderColor: "#F5A623", // Our --accent gold
        backgroundColor: "#F5A623",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
        y: { beginAtZero: true }
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default BiddersAuctioneersGraph;