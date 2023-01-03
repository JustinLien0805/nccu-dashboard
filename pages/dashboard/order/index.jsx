import { useState, useEffect } from "react";
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
const Order = ({ orders, countsByDate, totalIncome }) => {
  const selectOptions = ["All Time", "Last 7 Day", "Last Month"];
  const [select, setselect] = useState(selectOptions[0]);

  const [ordersState, setOrdersState] = useState(orders);
  const [countsByDateState, setCountsByDateState] = useState(countsByDate);
  const [newIncome, setNewIncome] = useState(totalIncome);
  const [planCount, setPlanCount] = useState({ mainDish: 0, noMainDish: 0 });

  useEffect(() => {
    // calculate plans count
    const planCounts = calculatePlanCounts();
    console.log(planCounts);
    setPlanCount({
      mainDish: planCounts.mainDish,
      noMainDish: planCounts.noMainDish,
    });
    // calculate total income
    const totalIncome = ordersState.reduce((acc, order) => {
      if (order.Dish_id === 2) {
        return acc + 50;
      } else {
        return acc + 90;
      }
    }, 0);
    setNewIncome(totalIncome);
  }, [ordersState]);

  // loop through the order data to get the total revenue and get plans count

  const calculatePlanCounts = () => {
    let mainDishCount = 0;
    let noMainDishCount = 0;
    ordersState.forEach((order) => {
      if (order.Dish_id === 2) {
        noMainDishCount += 1;
      } else {
        mainDishCount += 1;
      }
    });
    return { mainDish: mainDishCount, noMainDish: noMainDishCount };
  };

  // when select option change, update the data
  useEffect(() => {
    if (select === "All Time") {
      setCountsByDateState(countsByDate);
      setOrdersState(orders);
    }
    if (select === "Last 7 Day") {
      // filter orders to only show last 7 days to another useEffect
      const last7Days = orders.filter((order) => {
        const orderDate = new Date(order.date);
        const today = new Date();
        const diffTime = Math.abs(today - orderDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
      });
      // filter countsByDate to only show last 7 days for line chart
      const last7DaysCounts = Object.keys(countsByDate).filter((date) => {
        const orderDate = new Date(date);
        const today = new Date();
        const diffTime = Math.abs(today - orderDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
      });

      console.log(last7DaysCounts);
      const last7DaysCountsObj = {};
      last7DaysCounts.forEach((date) => {
        last7DaysCountsObj[date] = countsByDateState[date];
      });
      setCountsByDateState(last7DaysCountsObj);
      setOrdersState(last7Days);
    }
    if (select === "Last Month") {
      // filter orders to only show last month to another useEffect
      const lastMonth = orders.filter((order) => {
        const orderDate = new Date(order.date);
        const today = new Date();
        const diffTime = Math.abs(today - orderDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 30;
      });
      // filter countsByDate to only show last month for line chart
      const lastMonthCounts = Object.keys(countsByDate).filter((date) => {
        const orderDate = new Date(date);
        const today = new Date();
        const diffTime = Math.abs(today - orderDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 30;
      });
      const lastMonthCountsObj = {};
      lastMonthCounts.forEach((date) => {
        lastMonthCountsObj[date] = countsByDateState[date];
      });
      setCountsByDateState(lastMonthCountsObj);
      setOrdersState(lastMonth);
    }
  }, [select]);

  // line chart
  const data = {
    labels: Object.keys(countsByDateState),
    datasets: [
      {
        label: "Order",
        data: Object.values(countsByDateState),
        fill: false,
        backgroundColor: "#e879f999",
        borderColor: "#e879f9",
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    // plugins: {
    //   title: {
    //     display: true,
    //     text: "Order per Day",
    //     color: "#a5adba",
    //     font: {
    //       size: 20,
    //     },
    //   },
    // },
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

  // generate pie chart using plans
  const labels = ["Main Dish", "No Main Dish"];

  const data2 = {
    labels,
    datasets: [
      {
        label: "Plans",
        data: [planCount.mainDish, planCount.noMainDish],
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
      // title: {
      //   display: true,
      //   text: "Plans distribution",
      //   color: "#a5adba",
      //   font: {
      //     size: 20,
      //   },
      // },
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
      <div className="grid  grid-cols-2 gap-3 w-full p-4 lg:pt-20">
        <div className="col-span-2 flex items-center">
          <h2 className="text-5xl font-bold mr-auto">Order Stats</h2>
          <select
            className="select select-bordered w-full max-w-xs"
            defaultValue={select}
            onChange={(e) => {
              setselect(e.target.value);
            }}
          >
            {selectOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="stats shadow bg-primary text-white">
          <div className="stat">
            <div className="stat-title">Total Order</div>
            <div className="stat-value">{ordersState.length}</div>
            <div className="stat-desc">21% more than last month</div>
          </div>
        </div>
        <div className="stats shadow bg-primary text-white">
          <div className="stat">
            <div className="stat-title">Total Revenue</div>
            <div className="stat-value">${newIncome}</div>
            <div className="stat-desc">21% more than last month</div>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-start flex-col items-start">
          <div className="md:w-[60vw] w-[80vw] h-[50vh] my-16">
            <div className="flex items-center mb-4">
              <h3 className="font-bold text-3xl mr-auto">Order Count</h3>
            </div>
            <Line data={data} options={options} />
          </div>
          <div className="md:w-[60vw] w-[80vw] h-[50vh] my-16">
            <div className="flex items-center mb-4">
              <h3 className="font-bold text-3xl mr-auto">Plan Distribution</h3>
            </div>
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

  const totalIncome = orders.reduce((acc, order) => {
    if (order.Dish_id === 2) {
      return acc + 50;
    } else {
      return acc + 90;
    }
  }, 0);

  return {
    props: { orders, countsByDate, totalIncome },
  };
}
