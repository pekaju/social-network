import React, { useState, useEffect } from "react";
import SearchBar from "../components/headerComponents/SearchBar.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faUser, faMessage, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import Notifications from "../components/headerComponents/Notifications";
import Messages from "../components/messagesComponents/Messages.js";
import { useNavigate } from "react-router-dom";
import { getUnreadNotificationsCount, getUserId } from "../data/getData.js";

export default function Header({freshlyRegistered,
openMessageBubble, setOpenMessageUserId, newOtherMsg, setNewOtherMsg}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      getUnreadNotificationsCountHandler()
    }, 1000);
    return () => clearInterval(timer);
  }, [])

  async function getUnreadNotificationsCountHandler() {
    await getUnreadNotificationsCount().then(d => setUnreadNotificationsCount(d.count))
  }

  return (
    <div className={`header ${freshlyRegistered.freshlyRegistered ? "blur" : ""}`} style={{ zIndex: 1, position: "relative", width: "100vw", height: "80px" }}>
      <HeaderTopLeft />
      <HeaderMiddle />
      <HeaderTopRight
        setShowNotifications={setShowNotifications}
        showNotifications={showNotifications}
        showMessages={showMessages}
        setShowMessages={setShowMessages}
        unreadNotificationsCount={unreadNotificationsCount}
      />
      {showNotifications && <Notifications setShowNotifications={setShowNotifications} getUnreadNotificationsCountHandler={getUnreadNotificationsCountHandler}/>}
      {showMessages && <Messages setShowMessages={setShowMessages} setOpenMessageUserId={setOpenMessageUserId}
      newOtherMsg={newOtherMsg} setNewOtherMsg={setNewOtherMsg} />}
      {openMessageBubble}
    </div>
  );
}

function HeaderTopRight({setShowNotifications, showNotifications, showMessages, 
  setShowMessages, unreadNotificationsCount}) {
    const [userId, setUserId] = useState("")
  const navigate = useNavigate();
  (async () => {
    let id = await getUserId()
    setUserId(id)
  })()
  function showNotificationsHandler() {
    setShowNotifications(!showNotifications)
  }

  function showMessagesHandler() {
    setShowMessages(!showMessages)
  }

  async function logout() {
    let elements = document.cookie.split('=')
    let value = elements[1]
    const url = window.location.protocol + "//" + window.location.hostname + ":3001/logout?value="+value
    await fetch(url, {
      method: "GET"
    })
    document.cookie = 'sessionId=; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    navigate("/")
    window.location.reload()
  }

  return (
    <div id="header-icons">
      <div className="notification-icon" onClick={showNotificationsHandler}>
        <FontAwesomeIcon icon={faBell} />
        <div id="unread-notifications-count" style={{visibility: unreadNotificationsCount > 0 ? "visible" : "hidden"}}>{unreadNotificationsCount}</div>
      </div>
      <div className="notification-icon" onClick={() => navigate(`/profile?id=${userId}`)}>
        <FontAwesomeIcon icon={faUser} />
      </div>
      <div className="notification-icon">
        <FontAwesomeIcon icon={faMessage} onClick={showMessagesHandler} />
      </div>
      <div className="notification-icon">
        <FontAwesomeIcon icon={faRightFromBracket} onClick={logout} />
      </div>
    </div>
  );
}
function HeaderTopLeft() {

  const navigate = useNavigate();

  function returnHome() {
    navigate("/")
  }

  return (
    <div style={{
      position: "relative",
    }}>
      <div id="s-logo" onClick={returnHome}>SN</div>
      <div id="header-search-bar">
        <SearchBar defaultText="Search for posts/users etc"/>
      </div>
    </div>
  );
}

function HeaderMiddle() {
  return (
    <h1 style={{position:"absolute", left: "43vw"}}>Social media</h1>
  )
}


