import React, { useState } from "react";
import { useContext } from "react";
import { ThemeContext } from "./ThemeContext";
import { useEffect } from "react";
import axios from "axios";
import { MdOutlineManageAccounts } from "react-icons/md";
import "./style.css";

function Groups(props) {
  const { grpId } = useContext(ThemeContext);
  const pId = props.id;
  const [grpMessages, setGrpMessages] = useState([]);
  useEffect(() => {
    const getGroup = async () => {
      try {
        const res = await axios.post("http://localhost:8000/getGroups", {
          grpId: grpId,
          pId: pId,
        });
        setGrpMessages(res.data);
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    };
    getGroup(grpId);
  }, [grpId]);
  return (
    <div className="upnavbar">
      {grpMessages.map((grp) => (
        <div className="upperbar">
          <div className="upperbarLeft">
            <img src={`http://localhost:8000/images/${grp.group_dp}`}></img>
            <h5>{grp.group_name}</h5>
          </div>
          <div className="upRight">
            {grp.member_pos === "ADMIN" && (
              <MdOutlineManageAccounts className="manageIcon" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Groups;
