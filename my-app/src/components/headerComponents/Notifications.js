import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faThumbsUp,
  faComment,
  faCircleCheck,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import {
  acceptFollowRequest,
  deleteFollowRequest,
  getNotifications,
  acceptGroupInviteHandler,
  deleteGroupInviteHandler,
  acceptGroupRequestHandler,
  deleteGroupRequestHandler
} from "../../data/getData";
import { useNavigate } from "react-router-dom";
import { setNotificationRead } from "../../data/postData";

const notificationIcons = {
  new_following: faUserPlus,
  like: faThumbsUp,
  group_post: faComment,
  post_comment: faComment,
  follow_request: faUserPlus,
  group_invite: faComment,
  group_request: faUserPlus
};

export default function Notifications({
  setShowNotifications,
  getUnreadNotificationsCountHandler,
}) {
  const [rows, setRows] = useState([]);
  const [data, setData] = useState([]);
  const [refreshId, setRefreshId] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    async function getData() {
      await getNotifications().then((d) => setData(d));
    }
    getData();
  }, [refreshId]);

  function refresh() {
    setRefreshId(refreshId + 1);
  }

  useEffect(() => {
    generateRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  function generateRows() {
    let r = [];
    for (let i = 0; i < data.length; i++) {
      r.push(
        <NotificationRow
          key={i}
          data={data[i]}
          notificationClick={notificationClick}
          refresh={refresh}
        />
      );
    }
    setRows(r);
  }

  async function notificationClick(id) {
    const objIndex = data.findIndex((obj) => obj.id === id);
    navigate(data[objIndex].link);
    await setNotificationRead(data[objIndex].id);
    getUnreadNotificationsCountHandler();
    setShowNotifications(false);
  }

  return (
    <div style={{ position: "absolute", zIndex: 1 }}>
      <div
        id="notification-overlay"
        onClick={() => setShowNotifications(false)}
      ></div>
      <div id="notifications-container">
        <h3 id="notifications-header">NOTIFICATIONS</h3>
        <div
          id="notification-rows-container"
          style={{ height: `${Math.max(1, rows.length) * 60}px` }}
        >
          {data.length === 0 ? (
            <div style={{ margin: 20, color: "gray", fontStyle: "italic" }}>
              No notifications found
            </div>
          ) : (
            rows
          )}
        </div>
      </div>
    </div>
  );
}

function NotificationRow({ data, notificationClick, refresh }) {
  let notificationText = "";
  switch (data.message) {
    case "followed_user":
      notificationText = data.senderName + " started following you.";
      break;
    case "posted_in_group":
      notificationText =
        data.senderName + " posted in group: " + data.groupName;
      break;
    case "liked_post":
      notificationText = data.senderName + " liked your post.";
      break;
    case "follow_request":
      notificationText = data.senderName + " wants to follow you.";
      break;
    case "group_invite":
      notificationText = "Invitation to join group " + data.groupName + ".";
      break;
    case "group_request":
      notificationText =
        data.senderName + " has requested to join group " + data.groupName;
  }
  async function acceptFollow(sender) {
    await acceptFollowRequest(sender);
    refresh();
  }
  async function deleteFollow(sender) {
    await deleteFollowRequest(sender);
    refresh();
  }
  async function deleteGroupInvite(sender) {
    await deleteGroupInviteHandler(sender, data.groupId);
    refresh();
  }
  async function acceptGroupInvite(sender) {
    console.log("groupid: ", data.groupId);
    console.log("data: ", data);
    await acceptGroupInviteHandler(sender, data.groupId);
    refresh();
  }
  async function acceptGroupRequest(sender) {
    await acceptGroupRequestHandler(sender, data.groupId);
    refresh();
  }

  async function deleteGroupRequest(sender) {
    await deleteGroupRequestHandler(sender, data.groupId);
    refresh();
  }

  return (
    <div className="notification-row">
      <div className="notification-row-icon">
        <FontAwesomeIcon icon={notificationIcons[data.type]} />
      </div>
      <div
        className={
          "notification-message" + (Number(data.unread) === 1 ? " unread" : "")
        }
        title={notificationText}
      >
        <div
          style={{
            maxWidth: 270,
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            overflow: "hidden",
            cursor: "pointer",
          }}
          onClick={() => notificationClick(data.id)}
        >
          {notificationText}
        </div>
        {data.message == "follow_request" && (
          <div>
            <div
              style={{ width: "fit-content", cursor: "pointer" }}
              onClick={() => acceptFollow(data.fromId)}
            >
              <FontAwesomeIcon
                icon={faCircleCheck}
                style={{
                  color: "#40b828",
                  height: 27,
                  position: "absolute",
                  right: 55,
                  top: 10,
                }}
              />
            </div>
            <div
              style={{ width: "fit-content", cursor: "pointer" }}
              onClick={() => deleteFollow(data.fromId)}
            >
              <FontAwesomeIcon
                icon={faCircleXmark}
                style={{
                  color: "#d91c1c",
                  height: 27,
                  position: "absolute",
                  right: 20,
                  top: 10,
                }}
              />
            </div>
          </div>
        )}
        {data.message == "group_invite" && (
          <div>
            <div
              style={{ width: "fit-content", cursor: "pointer" }}
              onClick={() => acceptGroupInvite(data.fromId)}
            >
              <FontAwesomeIcon
                icon={faCircleCheck}
                style={{
                  color: "#40b828",
                  height: 27,
                  position: "absolute",
                  right: 55,
                  top: 10,
                }}
              />
            </div>
            <div
              style={{ width: "fit-content", cursor: "pointer" }}
              onClick={() => deleteGroupInvite(data.fromId)}
            >
              <FontAwesomeIcon
                icon={faCircleXmark}
                style={{
                  color: "#d91c1c",
                  height: 27,
                  position: "absolute",
                  right: 20,
                  top: 10,
                }}
              />
            </div>
          </div>
        )}
        {data.message == "group_request" && (
          <div>
            <div
              style={{ width: "fit-content", cursor: "pointer" }}
              onClick={() => acceptGroupRequest(data.fromId)}
            >
              <FontAwesomeIcon
                icon={faCircleCheck}
                style={{
                  color: "#40b828",
                  height: 27,
                  position: "absolute",
                  right: 55,
                  top: 10,
                }}
              />
            </div>
            <div
              style={{ width: "fit-content", cursor: "pointer" }}
              onClick={() => deleteGroupRequest(data.fromId)}
            >
              <FontAwesomeIcon
                icon={faCircleXmark}
                style={{
                  color: "#d91c1c",
                  height: 27,
                  position: "absolute",
                  right: 20,
                  top: 10,
                }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="notification-time">{convertDate(data.time)}</div>
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
