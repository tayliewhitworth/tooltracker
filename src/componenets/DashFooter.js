import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

import useAuth from "../hooks/useAuth";

// material ui
import { HomeOutlined } from '@mui/icons-material'
import { IconButton } from "@mui/material";

const DashFooter = () => {
  const { username, status } = useAuth();

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const onGoHomeClicked = () => navigate("/dash");

  let goHomeButton = null;

  if (pathname !== "/dash") {
    goHomeButton = (
      <IconButton
        title="Home"
        onClick={onGoHomeClicked}
      >
        <HomeOutlined />
      </IconButton>
    );
  }

  return (
    <footer className="dash-footer">
      {goHomeButton}
      <p>Current User: {username}</p>
      <p>Status: {status}</p>
    </footer>
  );
};

export default DashFooter;
