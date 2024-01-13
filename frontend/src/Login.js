import React from "react";
import { useState } from "react";
import axios from "axios";
import Sign from "./Sign";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
// import Spline from "@splinetool/react-spline";

function Login() {
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const goto = () => {
    navigate("/sign");
  };

  const navigate = useNavigate();
  const check = async (e) => {
    e.preventDefault();
    if (email === "") {
      alert("enter the email address");
      return;
    }
    if (password === "") {
      alert("enter the email address");
      return;
    }
    try {
      const response = await axios.post("http://localhost:8000/usersdata/", {
        email: email,
        password: password,
      });
      if (response.data.length === 0) {
        alert("user not found");
      } else {
        const receivedId = response.data.user_id;
        const presentName = response.data.user_name;
        console.log(response.data.user_name, "from the login js");
        console.log("this is users id");
        console.log(response.data.user_id);
        console.log(receivedId);
        // setUserId(receivedId);
        console.log("this is email");
        console.log(email);
        console.log("this is id");
        console.log(userId);
        navigate("/Home", { state: { email, receivedId, presentName } });
        // navigate("/selectDp");
        setLoggedIn(true);
      }
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="bg-primary d-flex  justify-content-center align-items-center vh-100 parent">
      <div className=" p-3 rounded w-25 transparent">
        <form>
          <div className="mb-3 no">
            <h1>Email</h1>
            <input
              className="form-control rounded-3"
              type="email"
              placeholder="enter your email address"
              onChange={(e) => setEmail(e.target.value)}
            ></input>
          </div>
          <div className="no">
            <h1>Password</h1>
            <input
              type="password"
              placeholder="enter the password"
              className="mb-3 form-control rounded-3"
              onChange={(e) => setPassword(e.target.value)}
            ></input>
          </div>
          {/* <link to="/Sign"> */}
          <button onClick={goto} className="btn btn-info mb-3">
            new user ? signup
          </button>
          {/* </link> */}
          {/* <Link to="/home"> */}
          <button onClick={check} className=" mx-2 btn btn-info mb-3">
            login
          </button>
          {/* </Link> */}
        </form>
      </div>
      {/* <img src="./images/login.jpg" className="loginphoto"></img >*/}
    </div>
  );
}

export default Login;
