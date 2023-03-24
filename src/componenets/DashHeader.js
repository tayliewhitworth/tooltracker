import { useEffect, useContext } from "react";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { ColorModeContext, tokens } from "../context/ThemeContext";

import { useSendLogoutMutation } from "../features/auth/authApiSlice";

// material UI
import { Box, IconButton, useTheme } from "@mui/material";
import { InputBase } from "@mui/material";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SearchIcon from "@mui/icons-material/Search";

import { PulseLoader } from "react-spinners";


const DashHeader = () => {
  // color theme functions
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);


  // logout functions
  const navigate = useNavigate();

  const [sendLogout, { isLoading, isSuccess, isError, error }] =
    useSendLogoutMutation();

  useEffect(() => {
    if (isSuccess) navigate("/");
  }, [isSuccess, navigate]);

  if (isLoading) return <PulseLoader color={'#868dfb'} />;

  if (isError) return <p>Error: {error?.data?.message}</p>;

  const logoutBtn = (
    <IconButton title="Logout" onClick={sendLogout}>
      <FiLogOut />
    </IconButton>
  );

  const content = (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* first section - search bar */}
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
        
      </Box>

      {/* icons */}

      <Box display="flex">
        <IconButton title="Toggle Mode" onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton title="Notifications">
          <NotificationsOutlinedIcon />
        </IconButton>
        {logoutBtn}
      </Box>
    </Box>
  );


  return content;
};

export default DashHeader;
