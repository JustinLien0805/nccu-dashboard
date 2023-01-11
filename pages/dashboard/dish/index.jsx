import React from "react";
import { prisma } from "../../../lib/prisma";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
const Dish = ({ top3, records }) => {
  const options = {
    indexAxis: "y",
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Order Distribution",
        color: "#a5adba",
        font: {
          size: 20,
        },
      },
      labels: {
        color: "#a5adba",
      },
    },
    scales: {
      y: {
        // not 'yAxes: [{' anymore (not an array anymore)
        ticks: {
          color: "#a5adba", // not 'fontColor:' anymore
          beginAtZero: true,
        },
      },
      x: {
        // not 'xAxes: [{' anymore (not an array anymore)
        ticks: {
          color: "#a5adba", // not 'fontColor:' anymore

          beginAtZero: true,
        },
      },
    },
  };

  const labels = records.map((record) => record.name);

  const data = {
    labels,
    datasets: [
      {
        label: "Dataset 1",
        data: records.map((record) => parseInt(record.num_orders)),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };
  return (
    <>
      <div className="grid lg:grid-cols-3 grid-cols-2 gap-3 w-full p-4 lg:py-20 lg:mt-0 mt-16">
        <h2 className="text-5xl font-bold col-span-2 lg:col-span-3">
          Top Sellers
        </h2>
        <div className="stats shadow bg-primary text-white">
          <div className="stat">
            <div className="stat-title font-bold text-xl">1st</div>
            <div className="stat-value">{top3[0].name}</div>
            <div className="stat-desc">21% more than last month</div>
          </div>
        </div>

        <div className="stats shadow bg-primary text-white">
          <div className="stat">
            <div className="stat-title font-bold text-xl">2nd</div>
            <div className="stat-value"> {top3[1].name}</div>
            <div className="stat-desc">21% more than last month</div>
          </div>
        </div>

        <div className="stats shadow bg-primary text-white">
          <div className="stat">
            <div className="stat-title font-bold text-xl">3rd</div>
            <div className="stat-value">{top3[2].name}</div>
            <div className="stat-desc">21% more than last month</div>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-center">
          <div className="md:w-[70vw] w-[80vw] h-[50vh]">
            <Bar data={data} options={options} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dish;

export async function getServerSideProps() {
  // get top3 selling dishes
  const records =
    await prisma.$queryRaw`SELECT d.name, CAST(COUNT(*) as CHAR) as num_orders FROM railway.Order o JOIN railway.Dish d ON o.Dish_id = d.id GROUP BY o.Dish_id ORDER BY num_orders DESC;`;

  // change num_orders to int
  records.forEach((record) => {
    record.num_orders = parseInt(record.num_orders);
  });
  // order the records by num_orders
  records.sort((a, b) => b.num_orders - a.num_orders);
  // get top 3
  const top3 = records.slice(0, 3);
  return {
    props: {
      top3,
      records,
    },
  };
}
