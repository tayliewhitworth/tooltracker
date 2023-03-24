import React, { useState } from "react";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../context/ThemeContext";
import {
  Sidebar,
  Menu,
  MenuItem,
  useProSidebar,
  sidebarClasses,
  menuClasses,
} from "react-pro-sidebar";
import { Link } from "react-router-dom";
import { FiUserPlus, FiUser, FiUsers, FiTool, FiMenu } from "react-icons/fi";
import { FaToolbox, FaTools, FaClipboardCheck } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
// material icons
import { HomeOutlined, CalendarTodayOutlined } from "@mui/icons-material";
// authorization and users
import useAuth from "../hooks/useAuth";
import { useGetUsersQuery } from "../features/users/usersApiSlice";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      rootStyles={{
        color: colors.grey[100],
        "&:hover": {
          backgroundColor: "#868dfb !important",
        },
        ["." + menuClasses.button]: {
          "&:hover": {
            backgroundColor: '#868dfb !important'
          }
        }
      }}
      onClick={() => setSelected(title)}
      icon={icon}
      component={<Link to={to} />}
    >
      <Typography>{title}</Typography>
    </MenuItem>
  );
};

const DashSidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { collapseSidebar, collapsed } = useProSidebar();

  const [selected, setSelected] = useState("Dashboard");

  const { username, isManager, isAdmin } = useAuth();

  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery(null, {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  let content;

  if (isLoading) content = <p>Loading...</p>;

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>;
  }

  if (isSuccess) {
    const { ids, entities } = users;

    const searchId = ids.find((id) => entities[id].username === username);
    const userId = entities[searchId]._id;

    content = (
      <Box height="100%" bgcolor={colors.primary[400]}>
        <IconButton
          onClick={() => collapseSidebar()}
          style={{ padding: "1rem 1.5rem" }}
        >
          {collapsed ? <FiMenu /> : <AiOutlineClose />}
        </IconButton>
        <Sidebar
          rootStyles={{
            [`.${sidebarClasses.container}`]: {
              backgroundColor: "transparent",
            },
          }}
        >
          <Menu
            menuItemStyles={{
              button: ({ active, level }) => {
                if (level === 0) {
                  return {
                    color: active ? "#6870fa" : undefined,
                  };
                }
              },
            }}
          >
            <Box>
              <Item
                title="DashBoard"
                to="/dash"
                icon={<HomeOutlined />}
                selected={selected}
                setSelected={setSelected}
              />

              <Item
                title="Tool Status"
                to="/dash/notes"
                icon={<FaTools />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Tool Checkout"
                to="/dash/notes/new"
                icon={<FaClipboardCheck />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Calendar"
                to="/dash/calendar"
                icon={<CalendarTodayOutlined />}
                selected={selected}
                setSelected={setSelected}
              />

              {(isManager || isAdmin) && (
                <>
                  <Item
                    title="Manage Tools"
                    to="/dash/tools"
                    icon={<FaToolbox />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  <Item
                    title="Add New Tool"
                    to="/dash/tools/new"
                    icon={<FiTool />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  <Item
                    title="Manage Users"
                    to="/dash/users"
                    icon={<FiUsers />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  <Item
                    title="Add New User"
                    to="/dash/users/new"
                    icon={<FiUserPlus />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  <Item
                    title="Profile"
                    to={`/dash/users/${userId}`}
                    icon={<FiUser />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                </>
              )}
            </Box>
          </Menu>
        </Sidebar>
      </Box>
    );
  }

  return content;
};

export default DashSidebar;
