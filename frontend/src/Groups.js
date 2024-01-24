import React, { useState, Component } from "react";
import { useContext } from "react";
import { ThemeContext } from "./ThemeContext";
import { useEffect } from "react";
import axios from "axios";
import { MdOutlineManageAccounts } from "react-icons/md";
import "./style.css";
import "./App.css";
import { FaPaperclip } from "react-icons/fa6";
import { IoIosSend } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { CiLight } from "react-icons/ci";

function Groups(props) {
  const { grpId } = useContext(ThemeContext);
  console.log(grpId, "from the groups");
  const pId = props.id;
  const [groupDetails, setGroupDetails] = useState([]);
  const [grpMessages, setGrpMessages] = useState([]);
  const [file, setFile] = useState(null);
  const [enteredMessage, setEnteredMessage] = useState("");
  const [edit, setEdit] = useState(false);
  const [search, setSearch] = useState("");
  const [searchToggle, setSearchToggle] = useState(false);

  const [searchRes, setSearchRes] = useState([]);
  const [adminId, setAdminId] = useState([]);
  const [adminNames, setAdminNames] = useState([]);
  const [users, setUsers] = useState([]);
  const [userNames, setUserNames] = useState([]);

  const [members, setMembers] = useState([]);

  useEffect(() => {
    console.log(grpId);
    getGroup(grpId);
    getMes(grpId);
    getMembers(grpId);
  }, [grpId]);
  const getGroup = async (grpId) => {
    try {
      console.log("calling get group");
      const res = await axios.post("http://localhost:8000/getGroups", {
        grpId: grpId,
        pId: pId,
      });
      setGroupDetails(res.data);
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };
  const getMembers = async (grpId) => {
    try {
      console.log("came to get members");
      const res = await axios.post("http://localhost:8000/getMembers", {
        grpId: grpId,
      });
      setMembers(res.data);

      console.log(res.data, "from get members");
    } catch (err) {
      console.log(err);
    }
  };
  const getMes = async (grpId) => {
    try {
      console.log("came to get messages");
      const res = await axios.post("http://localhost:8000/getGroupMes", {
        grpId: grpId,
      });
      setGrpMessages(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const fromattedData = grpMessages.map((item) => {
    const dataobject = new Date(item.sent_at);
    const date = dataobject.getDate();
    const month = dataobject.getMonth() + 1;
    const year = dataobject.getFullYear();
    const hours = dataobject.getHours();
    const min = dataobject.getMinutes();
    // const seconds = dataobject.getSeconds();
    const formattedTime = `${hours}:${min}`;
    const formattedDate = `${date}:${month}:${year}`;
    return {
      ...item,
      time: formattedTime,
      date: formattedDate,
    };
  });
  const sendMessage = async () => {
    const formData = new FormData();
    if (file) {
      formData.append("file", file);
      formData.append("pId", pId);
      formData.append("grpId", grpId);
      try {
        const res = await axios.post(
          "http://localhost:8000/sendFileGrp",
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
        const res = await axios.post("http://localhost:8000/sendGrpMessage", {
          messages: enteredMessage,
          pId: pId,
          grpId: grpId,
        });
      } catch (err) {
        console.log(err);
      }
    }
    setEnteredMessage("");
    setFile(null);
    getMes(grpId);
  };

  const searchTog = async (e) => {
    setSearch(e.target.value);
    if (search.length > 1) {
      setSearchToggle(true);
      try {
        const res = await axios.post("http://localhost:8000/searchUsers", {
          search: search,
          cur_id: pId,
          grpId: grpId,
        });
        console.log(res.data);
        setSearchRes(res.data);
      } catch (err) {
        console.log(err);
      }
    } else {
      setSearchToggle(false);
    }
  };
  const delMessage = async (msgId) => {
    try {
      const res = await axios.post("http://localhost:8000/delGrpMsg", {
        msgId: msgId,
      });
      console.log("successfully deleted message");
    } catch (err) {
      console.log(err);
    }
    getMes(pId);
  };

  const editChey = () => {
    setEdit(!edit);
  };

  const addUser = async (id, name, grpName) => {
    setUsers((prev) => [...prev, id]);
    console.log(users, "this is users from add user");
    try {
      const res = await axios.post("http://localhost:8000/addusers", {
        grpId: grpId,
        grpName: grpName,
        id: id,
        name: name,
      });
    } catch (err) {
      console.log(err);
    }
  };
  const removeUser = async (id) => {
    try {
      console.log("came to remove user");
      const res = await axios.post("http://localhost:8000/removeUser", {
        id: id,
        grpId: grpId,
      });
      getMembers();
    } catch (err) {
      console.log(err);
    }
  };

  const depromote = async (id) => {
    try {
      console.log("came to depromote user");
      const res = await axios.post("http://localhost:8000/depromoteUser", {
        id: id,
        grpId: grpId,
      });
      getMembers();
    } catch (err) {
      console.log(err);
    }
  };

  const promote = async (id) => {
    try {
      console.log("came to promote user");
      const res = await axios.post("http://localhost:8000/promoteUser", {
        id: id,
        grpId: grpId,
      });
      getMembers();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="mainGroups">
      <div className="upnavbar">
        {groupDetails.map((grp) => (
          <div className="upperbar">
            <div className="upperbarLeft">
              <img src={`http://localhost:8000/images/${grp.group_dp}`}></img>
              <h5>{grp.group_name}</h5>
            </div>
            <div className="upRight">
              {grp.member_pos === "ADMIN" && (
                <MdOutlineManageAccounts
                  className="manageIcon"
                  onClick={editChey}
                />
              )}
            </div>
          </div>
        ))}
      </div>
      {!edit && (
        <div>
          <div className="messages">
            {fromattedData.map((mes) => (
              <div className="prevent">
                {mes.user_id === pId && (
                  <div className="sended">
                    <div className="del" onClick={() => delMessage(mes.msgId)}>
                      <MdDelete />
                    </div>
                    <div className="message">
                      {mes.files && (
                        <img
                          src={`http://localhost:8000/images/${mes.files}`}
                        ></img>
                      )}
                      <h6> {mes.message_text}</h6>
                      <p>{mes.date}</p>
                      <p>{mes.time}</p>
                    </div>
                    <img src={`http://localhost:8000/images/${mes.dp}`}></img>
                  </div>
                )}
                {mes.user_id !== pId && (
                  <div className="recieved">
                    <img src={`http://localhost:8000/images/${mes.dp}`}></img>
                    <div className="message">
                      {mes.files && (
                        <img
                          src={`http://localhost:8000/images/${mes.files}`}
                        ></img>
                      )}
                      <h6> {mes.message_text}</h6>
                      <p>{mes.date}</p>
                      <p>{mes.time}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
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
      )}
      {edit && (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="inneredit">
            <input
              type="text"
              placeholder="search people"
              onChange={searchTog}
            ></input>
            {searchToggle && (
              <div>
                {searchRes.map((sea) => (
                  <div>
                    {sea.use_id !== pId && !users.includes(sea.user_id) && (
                      <div className="d-flex m-1">
                        <p>{sea.user_name}</p>
                        <button
                          onClick={() =>
                            addUser(sea.user_id, sea.user_name, sea.club_name)
                          }
                        >
                          Add to Group
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {!searchToggle && (
              <div>
                members
                {members.map((mem) => (
                  <div className="d-flex">
                    {mem.Status != "PENDING" && (
                      <div className="d-flex m-1">
                        <img
                          src={`http://localhost:8000/images/${mem.dp}`}
                        ></img>
                        <p>{mem.member_name}</p>
                        <button
                          className="bg-danger"
                          onClick={() => removeUser(mem.memberId)}
                        >
                          remove
                        </button>

                        {mem.member_pos === "ADMIN" && (
                          <button
                            className="bg-danger"
                            onClick={() => depromote(mem.memberId)}
                          >
                            depromote
                          </button>
                        )}
                        {mem.member_pos === "USER" && (
                          <button
                            className="bg-success"
                            onClick={() => promote(mem.memberId)}
                          >
                            promote
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Groups;
