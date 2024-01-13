import React, { useContext } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Side from "./Side";
import "./style.css";
import { ThemeContext } from "./ThemeContext";
import { useLocation } from "react-router-dom";
import Empty from "./Empty";
import Requests from "./Requests";
import Message from "./Message";
import Groups from "./Groups";

function Home() {
  // const location = useLocation();
  const { state } = useLocation();
  console.log(state.email);
  console.log(state.receivedId);
  const id = state.receivedId;
  const pName = state.presentName;
  console.log(pName, "from home js");
  console.log(id);
  const { darkMode } = useContext(ThemeContext);
  const { request } = useContext(ThemeContext);
  const { frdId } = useContext(ThemeContext);
  // console.log(request[0].empty);
  const reque = () => {
    console.log("came to if");
    if (request && request.length > 0) {
      if (request[0].empty) {
        return <Empty id={id} />;
      } else if (request[0].req) {
        return <Requests id={id} />;
      } else if (request[0].messegaes) {
        return <Message id={id} />;
      } else if (request[0].groups) {
        return <Groups />;
      }
    }

    return null;
  };
  return (
    <div className="home">
      <div className="sidebar">
        <Side details={{ cur_id: id, name: pName }} />
      </div>
      <div className="border rounded-4 min main">{reque()}</div>
    </div>
  );
}

export default Home;
