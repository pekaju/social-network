import React, { useState, useEffect, useRef } from "react";
import { getUserData } from "../../data/getData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faWindowMinimize } from "@fortawesome/free-solid-svg-icons";
import AddMessage from "./AddMessage";

function MessageBubble({
  userId,
  setOpenMessageUserId,
  data,
  setSendMsg,
  myUserId
  }) {
  const [userData, setUserData] = useState(null);
  const [displayCross, setDisplayCross] = useState(false);
  const [chatData, setChatData] = useState([]);
  const [rows, setRows] = useState([]);
  const [displayBox, setDisplayBox] = useState(true);
  useEffect(() => {
    if (myUserId) {
      (async () => {
        try {
          const usrdata = await getUserData(userId);
          setUserData(usrdata);
          data.sort((a, b) => b.sent.localeCompare(a.sent));
        } catch (err) {
          console.log("ERR: ", err);
        }
      })();
    }
  }, [myUserId]);

  useEffect(() => {
    if (data) {
      createMessageRows();
    }
  }, [data]);

  const handleCrossClick = (event) => {
    event.stopPropagation();
    setOpenMessageUserId(null);
  };
  function createMessageRows() {
    let newrows = [];
    for (let i = 0; i < data.length; i++) {
      let isMe = data[i].from === myUserId ? true : false;
      let newRow = (
        <SingleBubbleMessage key={i} data={data[i]} isMe={isMe} />
      );
      newrows.push(newRow);
    }
    setRows(newrows);
  }

  /*useEffect(() => {
    if (myUserId !== null) {
      if (newOpenMsg !== null) {
        let isMe = newOpenMsg.from === myUserId ? true : false;
        setRows(...rows, <SingleBubbleMessage
          key={rows.length + 1}
          data={newOpenMsg}
          isMe={isMe}
        />);
      }
    }
  }, [newOpenMsg, myUserId])*/
 
  return (
    <div>
      {displayBox &&
        userData &&
        chatData !== null && ( // Check if userData is available
          <div
            style={{
              position: "fixed",
              bottom: "20px",
              right: "80px",
              width: "350px",
              height: "400px",
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.16)",
              zIndex: 2, // Ensure the message bubble appears on top of other elements
            }}
          >
            {/* Content of the message bubble */}
            <div style={{ pointerEvents: "auto" }}>
              {/* Messages bubble header content*/}
              <div
                style={{
                  display: "flex",
                  marginBottom: "60px",
                  borderBottom: "1px solid lightgray"
                }}
              >
                <h3
                  style={{
                    marginTop: "0px",
                    marginBottom: "0px",
                    position: "absolute",
                    left: "60px",
                    top: "15px",
                  }}
                >
                  {userData.first_name} {userData.last_name} {userData.groupName}
                </h3>
                <FontAwesomeIcon
                  icon={faWindowMinimize}
                  style={{
                    position: "absolute",
                    right: "40px",
                    top: "15px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setDisplayBox(false);
                  }}
                />
                <FontAwesomeIcon
                  icon={faTimes}
                  style={{
                    position: "absolute",
                    top: "18px",
                    right: "15px",
                    fontSize: "20px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setOpenMessageUserId(null);
                  }}
                />
              </div>

              {/* Messages content */}
              <div
                style={{
                  overflow: "scroll",
                  display: "flex",
                  flexDirection: "column-reverse",
                  maxHeight: "300px",
                  position: "relative",
                  bottom: "16px"
                }}
              >
                {rows}
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: "10px",
                  left: "10px",
                  width: "96%",
                  zIndex: 5,
                  backgroundColor: "white",
                  minHeight: "50px"
                }}
              >
                <AddMessage
                  setSendMsg={setSendMsg}
                  myUserId={myUserId}
                  otherUserId={userId}
                />
              </div>
            </div>
          </div>
        )}
      <div
        style={{
          bottom: "15px",
          right: "15px",
          position: "fixed",
          padding: "5px",
          borderRadius: "100%",
          border: "solid 1px",
        }}
        onClick={(event) => {
          event.stopPropagation();
          setDisplayBox((prev) => !prev);
        }}
        onMouseOver={() => {
          setDisplayCross(true);
        }}
        onMouseLeave={() => {
          setDisplayCross(false);
        }}
      >
        <img
          style={{
            height: "40px",
            width: "40px",
            overflow: "hidden",
            display:"flex",
            justifyContent: "center"
          }}
          src={
            process.env.PUBLIC_URL +
            (userData
              ? userData.image === ""
                ? "img/user.png"
                : window.location.protocol + "//" + window.location.hostname + ":3001/" + userData.image
              : "img/user.png")
          }
          alt="user-img"
          height="200"
        />
        {displayCross && (
          <FontAwesomeIcon
            id="cross-icon"
            icon={faTimes}
            style={{
              position: "absolute",
              top: "-5px",
              right: "-5px",
              color: "gray",
              fontSize: "17px",
              backgroundColor: "white",
              borderRadius: "100%",
              border: "solid 1px",
              paddingRight: "3px",
              paddingLeft: "3px",
              zIndex: 1,
              cursor: "pointer",
            }}
            onClick={handleCrossClick}
          />
        )}
      </div>
    </div>
  );
}

function SingleBubbleMessage({ data, isMe }) {
  return (
    <>
      {isMe ? (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "6px",
          }}
        >
          <div
            style={{
              backgroundColor: "rgb(0, 132, 255)",
              padding: "10px",
              borderRadius: "15px",
              color: "white",
              fontSize: "14px",
              marginRight: "5px",
              maxWidth: "260px",
              height: "auto",
              wordWrap: "break-word",
            }}
          >
            {data.message}
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            marginBottom: "6px",
          }}
        >
          <div
            style={{
              backgroundColor: "#E4E6EB",
              padding: "10px",
              borderRadius: "15px",
              color: "black",
              fontSize: "14px",
              marginLeft: "5px",
              maxWidth: "260px",
              height: "auto",
              wordWrap: "break-word",
            }}
          >
            {data.message}
          </div>
        </div>
      )}
    </>
  );
}

export default MessageBubble;
