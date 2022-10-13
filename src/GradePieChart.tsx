import calcUnitsPerGrades from "./calcUnitsPerGrades";
import Course from "./Course";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

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
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
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
