import React from "react";
import { prisma } from "../../../lib/prisma";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
const Order = ({ orders, countsByDate }) => {
  // loop through the order data to get the total revenue and get plans count
  let totalRevenue = 0;
  const plans = {
    mainDish: 0,
    noMainDish: 0,
  };
  orders.forEach((order) => {
    if (order.Dish_id === 2) {
      totalRevenue += 50;
      plans.noMainDish++;
    } else {
      totalRevenue += 90;
      plans.mainDish++;
    }
  });

  // generate line chart using date and order
  const data = {
    labels: Object.keys(countsByDate),
    datasets: [
      {
        label: "Order",
        data: Object.values(countsByDate),
        fill: false,
        backgroundColor: "#e879f999",
        borderColor: "#e879f9",
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Order per Day",
        color: "#a5adba",
        font: {
          size: 20,
        },
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

  const labels = ["Main Dish", "No Main Dish"];

  const data2 = {
    labels,
    datasets: [
      {
        label: "Plans",
        data: [plans.mainDish, plans.noMainDish],
        backgroundColor: ["#2dd4bf99", "#fbbf2499"],
        borderColor: ["#2dd4bf", "#fbbf24"],
        borderWidth: 1,
      },
    ],
  };

  const options2 = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Plans distribution",
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

  return (
    <>
      <div className="grid lg:grid-cols-3 grid-cols-2 gap-3 w-full p-4 lg:pt-20">
        <h2 className="text-5xl font-bold col-span-3">Order Stats</h2>
        <div className="stats shadow bg-primary text-white">
          <div className="stat">
            <div className="stat-title">Total Order</div>
            <div className="stat-value">{orders.length}</div>
            <div className="stat-desc">21% more than last month</div>
          </div>
        </div>
        <div className="stats shadow bg-primary text-white">
          <div className="stat">
            <div className="stat-title">Total Revenue</div>
            <div className="stat-value">${totalRevenue}</div>
            <div className="stat-desc">21% more than last month</div>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-center flex-col items-center">
          <div className="md:w-[60vw] w-[80vw] h-[50vh]">
            <Line data={data} options={options} />
          </div>
          <div className="md:w-[60vw] w-[80vw] h-[50vh]">
            <Bar data={data2} options={options2} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Order;

export async function getServerSideProps() {
  const orders = await prisma.order.findMany();
  // group the order by date and count the number of order
  const result = await prisma.order.findMany({
    select: {
      date: true,
    },
    orderBy: {
      date: "asc",
    },
  });
  const countsByDate = result.reduce((counts, record) => {
    const date = record.date;
    counts[date] = (counts[date] || 0) + 1;
    return counts;
  }, {});

  return {
    props: { orders, countsByDate },
  };
}
