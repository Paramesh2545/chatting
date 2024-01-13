import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Layout from "./Layout";
import Sign from "./Sign";
import Home from "./Home";
import { ThemeContext } from "./ThemeContext";
import { useState } from "react";
import CreateGroups from "./CreateGroups";
function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [request, setRequests] = useState([
    {
      empty: true,
      req: false,
      messegaes: false,
      groups: false,
    },
  ]);
  const [frdId, setFrdId] = useState("");
  const [frdName, setFrdName] = useState("");
  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        setDarkMode,
        request,
        setRequests,
        frdId,
        setFrdId,
        frdName,
        setFrdName,
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Login />} />
            <Route path="sign" element={<Sign />} />
            <Route path="home" element={<Home />} />
            <Route path="creategroup" element={<CreateGroups />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeContext.Provider>
  );
}

export default App;
