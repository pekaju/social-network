import React, { useState, useEffect } from "react";
import Shortcuts from "../components/shortcutsComponents/Shortcuts";
import useWindowDimensions from "../components/useWindowDimensions.js";
import Feed from '../pages/Feed';
import Profile from '../pages/Profile';
import Followers from "../pages/Followers";
import Groups from "../pages/Groups";
import Group from "../pages/Group";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

function Main({ view, setOpenMessageUserId }) {
  const pages = {
    feed: <Feed />,
    profile: <Profile setOpenMessageUserId={setOpenMessageUserId}/>,
    followers: <Followers />,
    groups: <Groups />,
    group: <Group />
  };
  const [showLeftContainer, setShowLeftContainer] = useState(true);
  const [showLeftContainerPopup, setShowLeftContainerPopup] = useState(false)
  const [showRightContainer, setShowRightContainer] = useState(false);

  const { height, width } = useWindowDimensions();
  const headerHeight = 70;
  const feedWidth = 700;
  const leftContainerWidth = 330;
  const rightContainerWidth = 380;

  useEffect(() => {
    setShowLeftContainer(
      width >= feedWidth + leftContainerWidth
    );
    if (width >= feedWidth + leftContainerWidth) {
      setShowLeftContainerPopup(false)
    }
    //setShowRightContainer(width >= feedWidth + rightContainerWidth + leftContainerWidth);
  }, [width]);
  return (
    <div>
      {showLeftContainerPopup && <div style={{position:"absolute", top:0, left:0, width: "100vw", height:"100vh", zIndex:1}} onClick={() => setShowLeftContainerPopup(false)}></div>}
      <div style={{ display: "flex", overflow: "hidden", position:"relative" }}>
        {!showLeftContainer && <button id="menu-btn" onClick={() => setShowLeftContainerPopup(!showLeftContainerPopup)}><FontAwesomeIcon icon={faBars}/></button>}
        {showLeftContainerPopup && 
        <div
        style={{
          width: leftContainerWidth - 20,
          position:"absolute",
          top:10,
          left: 5,
          paddingLeft:30,
          height: `calc(100vh - ${(headerHeight + 70)}px)`,
          zIndex:1,
          backgroundColor: "white",
          borderRadius: 5,
          boxShadow: "0 0 15px 4px rgba(0, 0, 0, 0.5)"
        }}>
          <Shortcuts hideMenu={() => setShowLeftContainerPopup(false)}/>
        </div>}
        <div
          style={{
            width: leftContainerWidth,
            display: showLeftContainer ? "block" : "none",
            height: `calc(100vh - ${headerHeight}px)`,
          }}
        >
          <Shortcuts hideMenu={() => setShowLeftContainerPopup(false)}/>
        </div>
        <div
          id="main-center"
          style={{
            width: feedWidth,
            height: "calc(100vh - " + headerHeight + "px)",
            overflow: "scroll",
            width:
              "calc(100vw - " +
              ((showLeftContainer ? leftContainerWidth : 0) +
                (showRightContainer ? rightContainerWidth : 0)) +
              "px)",
          }}
        >
          {pages[view]}
        </div>
        <div
          style={{
            width: rightContainerWidth,
            marginLeft: "auto",
            height: `calc(100vh - ${headerHeight}px)`,
            overflowY: "scroll",
            overflowX:"hidden",
            display: showRightContainer ? "block" : "none",
          }}
        >
        </div>
      </div>
    </div>
  );
}

export default Main;
