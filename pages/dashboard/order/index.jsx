import React from "react";
import { prisma } from "../../../lib/prisma";
import { Line } from "react-chartjs-2";
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
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
const Order = ({ orders, countsByDate }) => {
  // loop through the order data to get the total revenue
  let totalRevenue = 0;

  orders.forEach((order) => {
    if (order.Dish_id === 2) {
      totalRevenue += 50;
    } else {
      totalRevenue += 90;
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
        backgroundColor: "#fff",
        borderColor: "#fff",
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };

  return (
    <>
      <div className="grid lg:grid-cols-3 grid-cols-2 gap-3 w-full p-4 lg:py-20">
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
      <div className="p-4 max-w-lg">
        <h2 className="font-bold text-3xl">Order Stats</h2>
        <div className="grid gap-4 w-full">
          <div>
            <Line data={data} height="350px" width="350px" options={options} />
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
