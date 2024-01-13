import React from "react";
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import Home from "./Home";
function Sign() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [usersid, setUsersid] = useState("");
  const navigate = useNavigate();
  const [file, setFile] = useState();

  const newuser = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("email", email);
    formData.append("username", username);
    formData.append("password", password);

    if (email === "" || username === "" || password === "" || confirm === "") {
      alert("insufficient details can't signup");
    } else if (password !== confirm) {
      alert("confirm password and password entered did not match");
    } else {
      try {
        const response = await axios.post(
          "http://localhost:8000/signup",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.data.length > 0) {
          navigate("/", { state: email, username, file });
          // try {
          //   const id = await axios.post("http://localhost:8000/getIdsign", {
          //     email: email,
          //     username: username,
          //   });
          //   setUsersid(id);
          //   console.log(id.data);
          //   // navigate("/selectDp", { state: usersid });
          //   console.log("insert ayindhi ra");
          //   console.log(id.data);
          //   console.log(id);
          //   try{

          //   }catch(err){
          //     console.log(err,"error in ")
          //   }
          // } catch (err) {
          //   console.log("error in getting the id", err);
          // }
          // navigate("/selectDp", { state: usersid });
        }
      } catch (err) {
        console.log(err);
      }
    }
  };
  const dp = () => {};
  return (
    <div className="bg-primary d-flex justify-content-center align-items-center vh-100 signup">
      <div className=" p-3 rounded w-25 transparent">
        <form>
          <h1>Email</h1>
          <input
            className="form-control rounded-3"
            type="email"
            placeholder="enter your email address"
            onChange={(e) => setEmail(e.target.value)}
          ></input>
          <h1>username</h1>
          <input
            className="form-control rounded-3"
            type="text"
            placeholder="enter your user name"
            onChange={(e) => setUsername(e.target.value)}
          ></input>
          <h1>password</h1>
          <input
            className="form-control rounded-3"
            type="password"
            placeholder="enter your password"
            onChange={(e) => setPassword(e.target.value)}
          ></input>
          <h1>confirm password </h1>
          <input
            className="form-control rounded-3"
            type="password"
            placeholder="enter your password"
            onChange={(e) => setConfirm(e.target.value)}
          ></input>
          <br />
          <div>
            <h5 className="text-white">choose the dp</h5>
            <input
              type="file"
              className="rounded-3 mb-2 text-white"
              onChange={(e) => setFile(e.target.files[0])}
            ></input>
          </div>
          <button onClick={newuser} className="btn btn-info mb-3">
            Signup
          </button>
        </form>
      </div>
    </div>
  );
}

export default Sign;
