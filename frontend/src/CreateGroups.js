import React, { useEffect, useState } from "react";
import "./style.css";
import "bootstrap/dist/css/bootstrap.css";
import axios from "axios";
import debounce from "lodash/debounce";
import { Navigate, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
// import { FaChessKing } from "react-icons/fa6";

function CreateGroups() {
  // const location = useLocation();
  const { state } = useLocation();
  const cur_id = state.cur_id;
  const pName = state.pName;
  // console.log(pName, "from the create groups");
  const [current, setCurrent] = useState(1);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [file, setFile] = useState(null);
  const [adminId, setAdminId] = useState([cur_id]);
  const [adminNames, setAdminNames] = useState([pName]);
  const [users, setUsers] = useState([]);
  const [userNames, setUserNames] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // people(search);
    // console.log(adminId);
    // console.log(adminNames);
    // console.log(users);
    // console.log(userNames);
    console.log(cur_id, "this is current users id");
  }, [search]);

  const people = async () => {
    try {
      const res = await axios.post("http://localhost:8000/home", {
        search: search,
        cur_id: cur_id,
      });
      console.log("came to seach");
      console.log(res);
      setSearchResult(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const next = () => {
    setSearch("");
    setSearchResult([]);
    setCurrent((prevDiv) => (prevDiv < 3 ? prevDiv + 1 : prevDiv));
  };
  const prev = () => {
    setSearch("");
    setSearchResult([]);
    setCurrent((prevDiv) =>
      prevDiv > 1 && prevDiv <= 3 ? prevDiv - 1 : prevDiv
    );
  };

  const debouncedSearch = debounce((search) => {
    console.log("came to debounce");
    people(search);
  });
  const searchDefault = async (e) => {
    console.log("came to search block");
    setSearch(e.target.value);
    console.log(search);
    debouncedSearch(search);
    // people(search);
  };

  const handleSearch = async () => {
    try {
      const res = await axios.post("http://localhost:8000/searchUsers", {
        search: search,
        cur_id: cur_id,
      });
      if (res.data.length === 0) {
        setSearchResult(["No user found"]);
      }
      setSearchResult(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const searchUser = async (e) => {
    console.log("came to search user block");
    setSearch(e.target.value);
    console.log(search);
    handleSearch();
    // people(search);
  };
  const add = (user_id, userName) => {
    setAdminId((current) => [...current, user_id]);
    setAdminNames((current) => [...current, userName]);
    console.log("this are admins", adminId);
  };

  const addUser = (user_id, user_name) => {
    setUsers((current) => [...current, user_id]);
    setUserNames((current) => [...current, user_name]);
    console.log(users);
  };

  const removeAdmin = (userId, user_name) => {
    const updatedAdmins = adminId.filter((id) => id !== userId);
    const updateNames = adminNames.filter((names) => names !== user_name);
    setAdminNames(updateNames);
    setAdminId(updatedAdmins);
  };

  const removeUser = (userId, user_name) => {
    const updatedIds = users.filter((id) => id !== userId);
    const updateNames = userNames.filter((names) => names !== user_name);
    setUserNames(updateNames);
    setUsers(updatedIds);
  };

  const submit = async () => {
    // setAdminId((current) => [...current, cur_id]);
    // setAdminNames((current) => [...current, pName]);
    console.log(adminId, "fianl");
    console.log(adminNames, "fianl");

    if (file) {
      if (groupName !== "") {
        if (adminId.length > 0) {
          if (adminNames.length > 0) {
            if (users.length > 0) {
              if (userNames.length > 0) {
                console.log("can proceed");
                const formData = new FormData();
                formData.append("file", file);
                formData.append("groupname", groupName);
                try {
                  const res = await axios.post(
                    "http://localhost:8000/creategroup",

                    formData,
                    {
                      headers: {
                        "Content-Type": "multipart/form-data",
                      },
                    }
                  );
                  try {
                    const secondres = await axios.post(
                      "http://localhost:8000/addgroupmembers",
                      {
                        groupName: groupName,
                        admin: [adminId, adminNames],
                        users: [users, userNames],
                        cur_id: cur_id,
                        // userNames: userNames,
                      }
                    );
                    if (secondres === "ok") {
                      console.log("go");
                      navigate("/home", {
                        state: { receivedId: cur_id, presentName: pName },
                      });
                    }
                  } catch (err) {
                    console.log(err);
                  }
                } catch (err) {
                  console.log(err);
                }
              }
            } else {
              console.log("problem in users id");
            }
          } else {
            console.log("admin names");
          }
        } else {
          console.log("admin id");
        }
      } else {
        console.log("groupname");
      }
    } else {
      console.log("error in file");
    }
  };

  const depromote = (userId, userName) => {
    const updatedAdmins = adminId.filter((id) => id !== userId);
    const updateNames = adminNames.filter((names) => names !== userName);
    setAdminNames(updateNames);
    setAdminId(updatedAdmins);

    setUsers((current) => [...current, userId]);
    setUserNames((current) => [...current, userName]);
    console.log(users);
  };

  const promote = (userId, userName) => {
    const updatedIds = users.filter((id) => id !== userId);
    const updateNames = userNames.filter((names) => names !== userName);
    setUserNames(updateNames);
    setUsers(updatedIds);

    setAdminId((current) => [...current, userId]);
    setAdminNames((current) => [...current, userName]);
    console.log("this are admins", adminId);
  };
  return (
    <div className="maincreate">
      <div className="imagecreate"></div>
      <div className="mainform">
        <div
          className="one"
          style={{ display: current === 1 ? "block" : "none" }}
        >
          <form className="createform">
            <h1>enter the name of the group</h1>
            <input
              type="text"
              className="name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            ></input>
            <h1>upload the dp</h1>
            <input
              type="file"
              // value={file}
              onChange={(e) => setFile(e.target.files[0])}
            ></input>
          </form>
        </div>
        <div
          className="two p-3"
          style={{ display: current === 2 ? "block" : "none" }}
        >
          <div className="secondeInner">
            <h1> choose the admins</h1>
            <input
              type="text"
              value={search}
              className="mb-4"
              // onChange={(e) => setSearch(e.target.value)}
              onChange={searchDefault}
            ></input>
            <div className="res">
              {searchResult &&
                searchResult.map((sea) => (
                  <li key={sea.id}>
                    {sea.user_id !== cur_id && (
                      <div className="d-flex">
                        <p>{sea.user_name}</p>
                        {/* <button
                      className="mx-2 rounded-3 mb-2 addBTN"
                      onClick={() => add(sea.user_id)}
                    >
                      add to group
                    </button> */}
                        {adminId.includes(sea.user_id) ? (
                          <button
                            className="mx-2 rounded-3 mb-2 bg-danger addBTN "
                            onClick={(e) =>
                              removeAdmin(sea.user_id, sea.user_name)
                            }
                          >
                            remove
                          </button>
                        ) : users.includes(sea.user_id) ? (
                          <div>
                            <div>
                              <button
                                className="mx-2 rounded-3 mb-2 addBTN "
                                onClick={() =>
                                  promote(sea.user_id, sea.user_name)
                                }
                              >
                                Promote to admin
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            className="mx-2 rounded-3 mb-2 addBTN"
                            onClick={() => add(sea.user_id, sea.user_name)}
                          >
                            add to group
                          </button>
                        )}
                      </div>
                    )}
                  </li>
                ))}
            </div>
          </div>
        </div>
        <div
          className="three"
          style={{ display: current === 3 ? "block" : "none" }}
        >
          <h1>choose the other users</h1>
          <input
            type="text"
            value={search}
            className="searchuser"
            // onChange={(e) => setSearch(e.target.value)}
            onChange={searchUser}
          ></input>
          <div className="res">
            {searchResult &&
              searchResult?.map((sea) => (
                <li key={sea.id}>
                  {sea.user_id !== cur_id && (
                    <div className="d-flex">
                      <p>{sea.user_name}</p>
                      {users.includes(sea.user_id) ? (
                        <button
                          onClick={(e) =>
                            removeUser(sea.user_id, sea.user_name)
                          }
                          className="mx-2 rounded-3 mb-2 addBTN bg-danger"
                        >
                          remove
                        </button>
                      ) : adminId.includes(sea.user_id) ? (
                        <div>
                          <div>
                            <button
                              className="mx-2 rounded-3 mb-2 addBTN "
                              onClick={() =>
                                depromote(sea.user_id, sea.user_name)
                              }
                            >
                              Depromote to normal user
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          className="mx-2 rounded-3 mb-2 addBTN"
                          onClick={() => addUser(sea.user_id, sea.user_name)}
                        >
                          add to groups
                        </button>
                      )}
                      {/* {adminId.includes(sea.user_id) ? (
                      <div>
                        <button className="mx-2 rounded-3 mb-2 addBTN">
                          remove from admin
                        </button>
                      </div>
                    ) : (
                      <div></div>
                    )} */}
                    </div>
                  )}
                </li>
              ))}
          </div>
          <button className="mt-2 submitBTN" onClick={submit}>
            Submit
          </button>
        </div>
        <div className="prevNext">
          <button onClick={prev}>PREV</button>
          <button onClick={next}>NEXT</button>
        </div>
      </div>
    </div>
  );
}

export default CreateGroups;
