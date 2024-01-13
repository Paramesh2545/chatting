import React, { useContext, useEffect, useRef, useState } from "react";
import "./App.css";
import { ThemeContext } from "./ThemeContext";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.css";
import { IoIosSend } from "react-icons/io";
import { FaPaperclip } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";

// let uid = "";
let frdDp = "";
let uname = "";
function Message(props) {
  const { frdId } = useContext(ThemeContext);
  const { frdName } = useContext(ThemeContext);
  const [messages, setMessages] = useState([]);
  const [enteredMessage, setEnteredMessage] = useState("");
  let uid = "";
  // let frdDp = "";
  // let uname = "";
  const [file, setFile] = useState(null);

  console.log(frdId);
  const pid = props.id;
  useEffect(() => {
    getMessages(pid, frdId);
    getDp(frdId);
    scrollToBottom();
  }, [pid, frdId]);

  // const delMessage = async (msgId) => {
  //   try {
  //     await axios.post("http://localhost:8000/delmsg", {
  //       msgId: msgId,
  //     });
  //     getMessages(pid, msgId);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const messageEndRef = useRef(null);
  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getDp = async (frdId) => {
    const res = await axios.post("http://localhost:8000/getDetails", {
      id: frdId,
    });
    console.log(res.data, "this is data from get Dp ra");
    frdDp = res.data.dp;
    uname = res.data.user_name;
    console.log(frdDp, "frdDp");
  };

  const getMessages = async (pid, frdId) => {
    console.log(frdId, "frd id");
    const res = await axios.post("http://localhost:8000/getmessages", {
      pId: pid,
      friend: frdId,
    });
    // console.log(res);
    setMessages(res.data);
    // getDp(msgId);
    // console.log(messages, "this is messages");
    // console.log(messages[0], "this is messages[0]");
  };

  const sendMessage = async () => {
    const formData = new FormData();
    if (file) {
      formData.append("file", file);
      formData.append("pid", pid);
      formData.append("friend", frdId);
      try {
        const res = await axios.post(
          "http://localhost:8000/sendFile",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } catch (err) {
        console.log(err);
      }
    }
    // formData.append("pid", pid);
    // formData.append("friend", msgId);
    formData.append("message", enteredMessage);
    if (enteredMessage.length > 0) {
      try {
        const res = await axios.post("http://localhost:8000/sendmessage", {
          messages: enteredMessage,
          pid: pid,
          friend: frdId,
        });
      } catch (err) {
        console.log(err);
      }
    }
    setEnteredMessage("");
    setFile(null);
    getMessages(pid, frdId);
  };

  const delMessage = async (msgId) => {
    try {
      const res = await axios.post("http://localhost:8000/delmsg", {
        msgId: msgId,
      });
      console.log("successfully deleted message");
    } catch (err) {
      console.log(err);
    }
    getMessages(pid, frdId);
  };

  console.log(messages, "this is messages");
  return (
    <div>
      <div className="messages_bg">
        <div className="uppernavbar">
          {messages && (
            <ul>
              {Array.from(messages).map((mes, index) => {
                if (mes.user_id !== pid) {
                  uid = mes.toId;
                  // frdDp = mes.dp;
                  // uname = mes.user_name;
                  console.log(uid, frdDp, "this is frdDp");
                }
                // return (
                // <li key={index} className="d-flex border rounded-3 bg-info">
                //   {uid === pid && (
                //     // <img
                //     //   src={`http://localhost:8000/images/${mes.dp}`}
                //     //   className="m-2"
                //     // ></img>
                //   )}
                //   {uid === pid && <h2>{mes.user_name}</h2>}
                // </li>
                // );
              })}
              {/* {getDp(msgId)} */}
              <div className="d-flex border rounded-3 bg-info">
                <img
                  src={`http://localhost:8000/images/${frdDp}`}
                  className="m-2"
                ></img>
                <h2 className="m-1">{uname}</h2>
              </div>
            </ul>
          )}
          {messages.length === 0 && (
            <h1 className="d-flex justify-content-center nodata">
              no messages with this person
            </h1>
          )}
        </div>
        <div className="inbox">
          {messages.map((mes) => {
            uid = mes.fromId;
            return (
              <li key={mes.id} className="prevent">
                {uid === pid && (
                  // <div className="preventOverflow">
                  <div className="sended">
                    <div className="del" onClick={() => delMessage(mes.msgId)}>
                      <MdDelete />
                    </div>
                    <div className="message">
                      {mes.files && (
                        <img
                          className="postedImage"
                          src={`http://localhost:8000/images/${mes.files}`}
                        ></img>
                      )}
                      <h5>{mes.msg}</h5>
                      <p>{mes.at_time}</p>
                    </div>
                    <img
                      src={`http://localhost:8000/images/${mes.dp}`}
                      className="image"
                    ></img>
                  </div>
                  // </div>
                )}
                {uid !== pid && (
                  // <div className="preventOverflow">
                  <div className="recieved">
                    <img
                      src={`http://localhost:8000/images/${mes.dp}`}
                      className="image"
                    ></img>
                    <div className="message">
                      {mes.files && (
                        <img
                          className="postedImage"
                          src={`http://localhost:8000/images/${mes.files}`}
                        ></img>
                      )}
                      <h5>{mes.msg}</h5>
                      <p>{mes.at_time}</p>
                    </div>
                    <div className="del">
                      <MdDelete />
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </div>
        {/* <div ref={messageEndRef}> */}
        <div ref={messageEndRef} />
        {/* </div> */}
        <div className="inputbox">
          <label for="file-upload" class="file-upload-label">
            <i class="fas fa-cloud-upload-alt"></i>
            <FaPaperclip />
          </label>
          <input
            // value={file}
            id="file-upload"
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          ></input>
          <input
            value={enteredMessage}
            type="text"
            placeholder="type message..."
            className="inpmsg border rounded-3"
            onChange={(e) => setEnteredMessage(e.target.value)}
          ></input>
          <button className="border rounded-3 p-1" onClick={sendMessage}>
            <IoIosSend />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Message;
