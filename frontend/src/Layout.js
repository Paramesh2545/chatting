import React from "react";
import { Outlet } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "./ThemeContext";
const Layout = () => {
  const { darkMode } = useContext(ThemeContext);
  console.log(darkMode);
  return (
    <div className={darkMode ? "dark-mode" : "light-mode"}>
      <Outlet />
    </div>
  );
};

export default Layout;
