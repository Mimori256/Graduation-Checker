import React from "npm:react";

import calcUnitsPerGrades from "./calcUnitsPerGrades.ts";
import Course from "./Course.ts";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "npm:chart.js";
import { Pie } from "npm:react-chartjs-2";

const targetGrades: Grade[] = ["A+", "A", "B", "C", "D", "P", "F", "認"];

type PiechartComponentProps = {
  courseList: Course[] | null;
};

export const GradePieChart: React.FC<PiechartComponentProps> = ({
  courseList,
}) => {
  if (!courseList) return <></>;

  const unitsPerGrades: number[] = Object.values(
    calcUnitsPerGrades(courseList, targetGrades)
  );

  ChartJS.register(ArcElement, Tooltip, Legend);

  const data = {
    labels: targetGrades,
    datasets: [
      {
        label: "# of Votes",
        data: unitsPerGrades,
        backgroundColor: [
          "rgba(255, 99, 99, 0.5)",
          "rgba(255, 159, 64, 0.5)",
          "rgba(54, 152, 255, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgb(255, 182, 193, 0.5)",
          "rgba(153, 102, 255, 0.5)",
          "rgb(131, 67, 51, 0.5)",
        ],
        borderColor: [
          "rgba(255, 99, 99, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(54, 152, 255, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgb(255, 182, 193)",
          "rgba(153, 102, 255, 1)",
          "rgb(131, 67, 51, 1)",
        ],
        borderWidth: 1,
      },
    ],
    options: {
      responsive: true,
    },
  };

  return (
    <>
      <div id="ratio">
        <h3>取得科目の成績内訳</h3>
        <small>取得科目数を単位数で重み付けしています。</small>
        <Pie data={data} />
      </div>
    </>
  );
};
