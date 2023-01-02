import React from "react";

const Dish = () => {
  return <>
  <div className="grid lg:grid-cols-3 grid-cols-2 gap-3 w-full p-4 lg:py-20">
        <div className="stats shadow bg-primary text-white">
          <div className="stat">
            <div className="stat-title">Total User</div>
            <div className="stat-value"></div>
            <div className="stat-desc">21% more than last month</div>
          </div>
        </div>

        <div className="stats shadow bg-primary text-white">
          <div className="stat">
            <div className="stat-title">Total Order</div>
            <div className="stat-value"></div>
            <div className="stat-desc">21% more than last month</div>
          </div>
        </div>

        <div className="stats shadow bg-primary text-white">
          <div className="stat">
            <div className="stat-title">Total Revenue</div>
            <div className="stat-value"></div>
            <div className="stat-desc">21% more than last month</div>
          </div>
        </div>
      </div></>;
};

export default Dish;
