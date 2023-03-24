import React from "react";
import DashFooter from "./DashFooter";
import DashHeader from "./DashHeader";
import { Outlet } from "react-router-dom";

import DashSidebar from "./DashSidebar";

import { ColorModeContext, useMode } from "../context/ThemeContext";
import { ThemeProvider, CssBaseline } from "@mui/material";

const DashLayout = () => {
  const [theme, colorMode] = useMode();
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="dash-grid">
          <div className="sidebar">
            <DashSidebar />
          </div>
          <div className="hero-padding">
            <DashHeader />

            <div className="dash-main-layout">
              <Outlet />
            </div>
            <DashFooter />
          </div>

        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default DashLayout;
