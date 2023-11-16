import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import SearchBar from "../headerComponents/SearchBar";
import { getUserId } from "../../data/getData";
import { getMessagesData, getLastGroupMsgData } from "../../data/getData";

export default function Messages({ setShowMessages, setOpenMessageUserId, newOtherMsg, setNewOtherMsg }) {
  const [rows, setRows] = useState([]);
  const [lastGroupMsgData, setLastGroupMsgData] = useState([])
  let data;
  let userId;
  let groupChatData;

  const getMsg = async () => {
    userId = await getUserId();
    data = await getMessagesData(userId);
    groupChatData = await getLastGroupMsgData(userId);
    console.log("groupchatdata: ", groupChatData)
    if (groupChatData !== null) {
      for(const chat of groupChatData) {
        data.push({
          "firstName": chat.groupName,
          "fromUser": chat.groupId,
          "id": Math.random().toString(36).substring(2,8),
          "lastName": "",
          "message": chat.message,
          "timestamp": chat.timestamp,
          "toUser": userId
        })
      }
      data.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
    }
  };
  useEffect(() => {
    if (newOtherMsg !== null) {
      const funct = async () => {
        await getMsg()
        createMessageRows();
      };
      funct();
      setNewOtherMsg(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newOtherMsg]);

  useEffect(() => {
    const funct = async () => {
      await getMsg()
      createMessageRows();
    };
    funct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function createMessageRows() {
    let messageArray = [];
    for (let i = 0; i < data.length; i++) {
      let newMsg = (
        <SingleMessage key={i} data={data[i]} messageClick={messageClick} />
      );
      messageArray.push(newMsg);
    }
    setRows(messageArray);
  }
  useEffect(() => {
    setNewOtherMsg(null);
  }, [rows])
  function messageClick(toUser, fromUser) {
    let recipientId;
    if (toUser === userId) {
      recipientId = fromUser
    }else {
      recipientId = toUser
    }
    setShowMessages(false);
    setOpenMessageUserId(recipientId);
    //createMessageRows();
  }
  return (
    <div style={{ position: "absolute" }}>
      <div
        id="notification-overlay"
        onClick={() => setShowMessages(false)}
      ></div>
      <div id="notifications-container" style={{
        zIndex: 3,
        background: "white"
      }}>
        <h3 id="notifications-header">MESSAGES</h3>
        <div
          style={{
            background: "white",
            paddingTop: "10px",
          }}
        >
          <SearchBar
            style={{
              marginLeft: "70px",
            }}
            defaultText="Search for followers/group name"
            message={true}
            setShowMessages={setShowMessages}
            setOpenMessageUserId={setOpenMessageUserId}
          />
        </div>
        <div
          id="notification-rows-container"
          style={{ height: `${Math.max(61, rows.length * 61)}px` }}
          >
          {(rows.length > 0 ? rows : <p style={{marginLeft:60, color: "gray", fontStyle:"italic"}}>No messages</p>)}
        </div>
      </div>
    </div>
  );
}

function SingleMessage({ data, messageClick }) {
  return (
    <div className="chat-row" onClick={() => messageClick(data.toUser, data.fromUser)}>
      <div className="message-row-icon">
        <FontAwesomeIcon icon={faCircleUser} />
      </div>
      <div style={{
        position: "absolute", 
        left: "55px", 
        top: "8px", 
        fontSize: "15px",
        fontWeight: "600"
        }}>
        {data.firstName} {data.lastName}
      </div>
      <div
        className={"chat-message-inner"}
        title={data.message}
      >
        {data.message}
      </div>
      <div className="notification-time">{convertDate(data.timestamp)}</div>
    </div>
  );
}

function convertDate(date) {
  let d = new Date(date);
  return `${formatDateValue(d.getHours())}:${formatDateValue(
    d.getMinutes()
  )} ${formatDateValue(d.getDate())}.${formatDateValue(
    d.getMonth() + 1
  )}.${d.getFullYear()}`;
}

function formatDateValue(value) {
  if (value < 10) {
    return "0" + value;
  } else {
    return value;
  }
}
