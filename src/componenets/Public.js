import React from "react";
import { Link } from "react-router-dom";
import { RiToolsFill } from "react-icons/ri";
import { FiMoreVertical } from "react-icons/fi";
import { TbTruckReturn } from "react-icons/tb";
import { BsBarChartFill } from "react-icons/bs";

const Public = () => {
  return (
    <section className="public-section">
      <header className="public-header">
        <h1>Tool Tracker</h1>
        <Link className="public-login" to="/login">
          Login
        </Link>
      </header>
      <main className="public-main">
        <div>
          <p className="main-header">
            Keep track of your business in just one application
          </p>
          <p className="desc">Built to manage inventory and organize your belongings</p>
        </div>
        <div className="main-toolcard">
          <div className="toolcard-header">
            <p>Overview</p>
            <FiMoreVertical />
          </div>
          <div className="toolcards">
            <div className="toolcard">
              <div className="toolcard-icon">
                <BsBarChartFill />
              </div>
              <div>
                <p>Total Tools</p>
                <span>786</span>
              </div>
            </div>
            <div className="toolcard">
              <div className="toolcard-icon">
                <BsBarChartFill />
              </div>
              <div>
                <p>Total Items</p>
                <span>5097</span>
              </div>
            </div>
            <div className="toolcard">
              <div className="toolcard-icon tools">
                <RiToolsFill />
              </div>
              <div>
                <p>Checked Out</p>
                <span>468</span>
              </div>
            </div>
            <div className="toolcard">
              <div className="toolcard-icon truck">
                <TbTruckReturn />
              </div>
              <div>
                <p>Returned</p>
                <span>224</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
};

export default Public;
