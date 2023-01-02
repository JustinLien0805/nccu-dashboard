import React from "react";
import Navbar from "../../components/Navbar";
import { prisma } from "../../lib/prisma";

// use Pie chart to show the gender ratio
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = ({ user, order }) => {
  // count the number of gender in user data
  const genderCounts = {
    male: 0,
    female: 0,
    other: 0,
  };
  const occupationCounts = {
    student: 0,
    teacher: 0,
  };
  user.forEach((user) => {
    if (user.gender === "male") {
      genderCounts.male++;
    } else if (user.gender === "female") {
      genderCounts.female++;
    } else if (user.gender === "other") {
      genderCounts.other++;
    }
    if (user.occupation === "student") {
      occupationCounts.student++;
    } else if (user.occupation === "teacher") {
      occupationCounts.teacher++;
    }
  });

  const data = {
    labels: ["male", "female", "other"],
    datasets: [
      {
        label: "Gender ratio",
        data: [genderCounts.male, genderCounts.female, genderCounts.other],
        backgroundColor: ["#2dd4bf50", "#fbbf2450", "#f8717150"],
        borderColor: ["#2dd4bf", "#fbbf24", "#f87171"],
        borderWidth: 1,
      },
    ],
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  };
  const data2 = {
    labels: ["student", "teacher"],
    datasets: [
      {
        label: "Occupation ratio",
        data: [occupationCounts.student, occupationCounts.teacher],
        backgroundColor: ["#e879f950", "#60a5fa50"],
        borderColor: ["#e879f9", "#60a5fa"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <Navbar>
        <div className="grid lg:grid-cols-3 grid-cols-2 gap-3 w-full p-4 lg:py-20">
          <div className="stats shadow bg-base-300 hover:bg-primary hover:text-white">
            <div className="stat">
              <div className="stat-title">Total User</div>
              <div className="stat-value">{user.length}</div>
              <div className="stat-desc">21% more than last month</div>
            </div>
          </div>

          <div className="stats shadow bg-base-300 hover:bg-primary hover:text-white">
            <div className="stat">
              <div className="stat-title">Total Order</div>
              <div className="stat-value">{order.length}</div>
              <div className="stat-desc">21% more than last month</div>
            </div>
          </div>

          <div className="stats shadow bg-base-300 hover:bg-primary hover:text-white">
            <div className="stat">
              <div className="stat-title">Total Revenue</div>
              <div className="stat-value">{order.length * 90}</div>
              <div className="stat-desc">21% more than last month</div>
            </div>
          </div>
        </div>
        <div className="p-4">
          <h2 className="font-bold text-3xl">User Stat</h2>
          <div className="grid lg:grid-cols-2 gap-4 w-full">
            <div>
              <Pie
                data={data}
                height="350px"
                width="350px"
                options={{ maintainAspectRatio: false }}
              />
            </div>
            <div>
              <Pie
                data={data2}
                height="350px"
                width="350px"
                options={{ maintainAspectRatio: false }}
              />
            </div>
          </div>
        </div>
      </Navbar>
    </>
  );
};

export default Dashboard;

export async function getServerSideProps() {
  // count how many users and order are in the database
  const user = await prisma.user.findMany();
  const order = await prisma.order.findMany();
  return {
    props: {
      user,
      order,
    },
  };
}
