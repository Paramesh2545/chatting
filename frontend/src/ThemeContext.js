// import React, { createContext, useState, useContext } from "react";

// const ThemeContext = createContext();

// const ThemeProvider = ({ children }) => {
//   const [darkMode, setDarkMode] = useState(false);
//   const toggleDarkMode = () => {
//     setDarkMode((prevMode) => !prevMode);
//   };
//   return (
//     <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };

// const useTheme = () => {
//   const context = useContext(ThemeContext);
//   if (!context) {
//     throw new Error("useTheme must be used within a ThemeProvider puka");
//   }
//   return context;
// };

// export { ThemeProvider, useTheme };
// export default ThemeContext;

import { createContext } from "react";

export const ThemeContext = createContext({});
