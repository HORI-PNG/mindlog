"use client";

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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

interface ConcentrationChartProps {
  labels: string[];
  scores: number[];
}

export const ConcentrationChart: React.FC<ConcentrationChartProps> = ({
  labels,
  scores,
}) => {
  const data = {
    labels,
    datasets: [
      {
        label: "集中度スコア",
        data: scores,
        borderColor: "rgba(99, 102, 241, 1)",
        backgroundColor: "rgba(99, 102, 241, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "過去7日間の集中度トレンド",
      },
    },
    scales: {
      y: {
        min: 0,
        max: 5,
      },
    },
  };

  return <Line options={options} data={data} />;
};
