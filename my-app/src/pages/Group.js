import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import FeedList from "../components/feedComponents/FeedList";
import ProfileCardSmall from "../components/profileComponents/ProfileCardSmall";
import { useNavigate } from "react-router-dom";
import {
  getGroupData,
  getGroupFollowers,
  getUserId,
  unfollowGroup,
  getIsRequestSent,
  sendGroupRequest,
  sendGroupInvites,
  deleteGroupHandler,
  getEvents,
  sendRequest
} from "../data/getData";
import SelectUsers from "../components/feedComponents/SelectUsers";
import CreateEventElem from "../components/feedComponents/CreateEventElem";
import EventCard from "../components/groupComponents/eventCard";
import "./Group.css";

export default function Group() {
  const [searchParams] = useSearchParams();
  const [groupId, setGroupId] = useState("");
  const [groupData, setGroupData] = useState({});
  const [backgroundImage, setBackgroundImage] = useState("");
  const [userFollows, setUserFollows] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [userId, setUserId] = useState("");
  const [isCreator, setIsCreator] = useState(false);
  const [creatorData, setCreatorData] = useState(null);
  const [isRequestSent, setIsRequestSent] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [selectInvites, setSelectInvites] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userFollowings, setUserFollowings] = useState([]);
  const [possibleInvites, setPossibleInvites] = useState([]);
  const [followers2, setFollowers2] = useState([]);
  const [createEvent, setCreateEvent] = useState(false)
  const [events, setEvents] = useState([]);
  const [eventsElems, setEventsElems] = useState([]);

  const navigate = useNavigate();

  function handleRefresh() {
    setRefresh(refresh + 1);
  }

  useEffect(() => {
    setGroupId(searchParams.get("id"));
    getGroupDataHandler(searchParams.get("id"));
    getGroupFollowershandler(searchParams.get("id"));
    (async () => {
      setUserId(await getUserId());
      setEvents(await getEvents(searchParams.get("id")))
    })();
  }, [searchParams.get("id"), refresh]);

  useEffect(() => {
   if( events.length > 0 ) {
    const eventElements = events.map((event) => (
      <EventCard
        key={event.id}
        title={event.title}
        creator={event.creator}
        date={event.date}
        desc={event.desc}
        id={event.id}
        groupId={groupId}
        creatorName={event.creatorName}
      />
    ));
    setEventsElems(eventElements);
   }
    
  }, [events])
  useEffect(() => {
    console.log("eventselems: ", eventsElems)
    console.log("events: ", events)
  }, [eventsElems])

  useEffect(() => {
    getGroupFollowershandler(searchParams.get("id"));
  }, [userFollows]);

  useEffect(() => {
    if (Object.keys(groupData).length > 0) {
      setUserFollows(groupData.userFollows);
      setBackgroundImage(window.location.protocol + "//" + window.location.hostname + ":3001/" + groupData.image);
    }
  }, [groupData]);

  useEffect(() => {
    setIsCreator(userId == groupData.creator);
  }, [userId, groupData]);

  useEffect(() => {
    (async () => {
      setIsRequestSent(await getIsRequestSent(userId));
      setUserFollowings(await sendRequest("userFollowings", "POST", JSON.stringify({"userID": userId})));
    })();
  }, [userId]);
  async function getGroupDataHandler(id) {
    await getGroupData(id).then((d) => setGroupData(d));
  }

  async function getGroupFollowershandler(id) {
    await getGroupFollowers(id).then((d) => {
      setFollowers2(d);
      setFollowers(generateFollowers(d));
    });
  }
  useEffect(() => {
    // Filter out elements from userFollowings that are not in followers2
    const newInvites = userFollowings.filter(
      (element) =>
        !followers2.includes(element) && !possibleInvites.includes(element)
    );

    // Combine the newInvites with the current possibleInvites
    const updatedPossibleInvites = [...possibleInvites, ...newInvites];

    // Set the updated array as the new state
    setPossibleInvites(updatedPossibleInvites);
  }, [userFollowings, followers2]);

  const generateFollowers = (data) => {
    let result = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].Id == groupData.creator) {
        console.log(i, data[i].Id)
        setCreatorData(
          <ProfileCardSmall key={data[i].Id} profileData={data[i]} />
        );
      } else {
        result.push(
          <ProfileCardSmall key={data[i].Id} profileData={data[i]} />
        );
      }
    }
    if (result.length === 0) {
      result.push(
        <div
          style={{
            fontStyle: "italic",
            color: "gray",
            marginLeft: 13,
            fontSize: 14,
          }}
        >
          No followers found
        </div>
      );
    }
    return result.slice(0, 16);
  };
  async function handleClick() {
    if (userFollows) {
      await unfollowGroup(groupId);
      setUserFollows(false);
    } else {
      await sendGroupRequest(userId, groupId);
      setIsRequestSent(true);
    }
    handleRefresh();
  }
  async function handleHideSelectUsers() {
    setSelectInvites(false);
    await sendGroupInvites(selectedUsers, groupId);
  }
  
  async function handleHideCreateEvent() {
    setCreateEvent(false);
    handleRefresh();
  }

  async function deleteGroup() {
    await deleteGroupHandler(groupId)
    navigate("/groups");
  }

  return (
    <div id="group-container">
      <div
        id="group-header"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundPositionY: "center",
        }}
      >
        {1 == 2 && <div id="group-name">{groupData.group_name}</div>}
        {userFollows && !isCreator && 
        <div>
          <button id="invite-users-button-follower"
            onClick={() => setCreateEvent(true)}
          >
            Create event
          </button>
          <button id="create-event-button-follower"
            onClick={() => {
              setSelectInvites(true);
            }}
          >
            Invite users
          </button>
        </div>
        }
        {isCreator ? (
          <div>
            <button
              id="invite-users-button"
              onClick={() => {
                  setSelectInvites(true);
              }}
            >
              Invite users
            </button>
            <button id="create-event-button"
              onClick={() => setCreateEvent(true)}
            >Create event</button>
            <button id="delete-group-button" onClick={() => deleteGroup()}>Delete group</button>
          </div>
        ) : (
          <button
            id="join-group-button"
            disabled={isRequestSent}
            onClick={!isRequestSent && handleClick}
          >
            {userFollows
              ? "Unfollow"
              : isRequestSent
              ? "Request Sent"
              : "+ Follow"}
          </button>
        )}
      </div>
      {isCreator || userFollows ? (
        <div>
          <p id="group-description">{groupData.description}</p>
          <div id="group-followers">
            <div style={{ display: "flex" }}>
              <h3 style={{ marginLeft: 20 }}>Creator</h3>
              <h3 style={{ marginLeft: 34 }}>Followers</h3>
            </div>
            <div id="group-followers-list">
              {creatorData}
              {followers.length > 1 ? followers : followers[0]}
            </div>
          </div>
          <h3 style={{marginLeft: 50}}>Events</h3>
            <div style={{
              borderBottom: "1px solid lightgray",
              height: events.length === 0 ? 100 : 500,
              display: "flex",
              overflowX: "scroll",
            }}>
              { events.length > 0 ? eventsElems : <p style={{marginLeft:50}}>No events created</p>}
            </div>
          <div id="group-posts">
            <h3 style={{ marginLeft: 20 }}>Group feed</h3>
            <div id="group-posts-list">
              <FeedList filter={"groupFeed"} type={"2"} id={groupId} />
            </div>
          </div>
        </div>
      ) : (
        <p style={{ marginLeft: 20, marginTop: 50, fontSize: 16 }}>
          You need to be a follower to see group content
        </p>
      )}
      {selectInvites && (
        <SelectUsers
          hideSelectUsers={() => handleHideSelectUsers()}
          followers={possibleInvites}
          setSelectedUsers={setSelectedUsers}
          selectedUsers={selectedUsers}
          text="group"
        ></SelectUsers>
      )}
      {createEvent && (
        <CreateEventElem
          hideCreateEvent={() => handleHideCreateEvent()} groupId={groupId} creator={userId}
        ></CreateEventElem>
      )}
    </div>
  );
}
