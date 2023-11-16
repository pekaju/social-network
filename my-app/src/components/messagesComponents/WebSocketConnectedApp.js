import { useEffect, useState } from "react";
import React from "react";
import MessageBubble from "./MessageBubble";
import Header from "../../layouts/Header";
import ProfileOptions from "../profileComponents/ProfileOptions";
import Main from "../../layouts/Main";
import useWebSocket from "react-use-websocket";
import { getUserId } from "../../data/getData";


class Event {
  constructor(type, payload) {
    this.type = type;
    this.payload = payload;
  }
}
class SendMessageEvent {
  constructor(message, from, to) {
    this.message = message;
    this.from = from;
    this.to = to;
  }
}
class NewMessageEvent {
  constructor(message, from, sent) {
    this.message = message;
    this.from = from;
    this.sent = sent;
  }
}

class ChangeRecipientIdEvent {
  constructor(recipient) {
    this.recipient = recipient;
  }
}

function WebSocketConnectedApp({
  view,
  freshlyRegistered,
  setIsFreshlyRegistered,
  webSocketURL,
}) {
  const [openMessageUserId, setOpenMessageUserId] = useState(null);
  const [openMessageBubble, setOpenMessageBubble] = useState(null);
  const [sendMsg, setSendMsg] = useState({});
  const [newOpenMsg, setNewOpenMsg] = useState(null);
  const [newOtherMsg, setNewOtherMsg] = useState(null);
  const [openChat, setOpenChat] = useState([]);
  const [myUserId, setMyUserId] = useState("")
  const [isNewChat, setIsNewChat] = useState(false)
  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(
    webSocketURL,
    {
      onOpen: () => {
        console.log("WebSocket connection opened");
      },
      onClose: () => {
        console.log("WebSocket connection closed");
      },
      onError: () => {
        console.error("WebSocket error");
      },
    }
  );
  useEffect(() => {
    (async () => {
      const uid = await getUserId();
      setMyUserId(uid);
    })();
  }, []);
  useEffect(() => {
    if (openMessageUserId !== null) {
      let changeEvent = new ChangeRecipientIdEvent(openMessageUserId);
      sendJsonMessage({ type: "change_recipient", payload: changeEvent });
    } else {
      setOpenMessageBubble(null);
    }
  }, [openMessageUserId]);

  useEffect(() => {
    if (lastMessage) {
      const eventData = JSON.parse(lastMessage.data);
      const event = new Event(eventData.type, eventData.payload);
      if (event.type === undefined) {
        alert("no 'type' field in event");
      }
      switch (event.type) {
        case "chat_data":
          setOpenChat(event.payload);
          setIsNewChat(true);
          console.log(event.payload)
          break;
        case "new_message":
          console.log("newmessage: ", event.payload);
          console.log(openMessageUserId === event.payload.from && event.payload.groupId === "")
          if (
            openMessageUserId === event.payload.to ||
            openMessageUserId === event.payload.from && event.payload.groupId === "" ||
            openMessageUserId === event.payload.groupId
          ) {
            setOpenChat(prevChat => [event.payload, ...prevChat]);
        } else {
            setNewOtherMsg(event.payload);
          }
          break;
      }
    }
  }, [lastMessage]);
  useEffect(() => {
    if (isNewChat) {
        setOpenMessageBubble(
            <MessageBubble
              key={openMessageUserId}
              userId={openMessageUserId}
              setOpenMessageUserId={setOpenMessageUserId}
              data={openChat}
              setSendMsg={setSendMsg}
              myUserId={myUserId}
            />
          );
    }
  }, [openChat, isNewChat]);
  useEffect(() => {
    let messageEvent = new SendMessageEvent(
      sendMsg.msg,
      sendMsg.myUserId,
      sendMsg.otherUserId
    );
    if (
      messageEvent.from !== undefined &&
      messageEvent.to !== undefined &&
      messageEvent.message !== undefined
    ) {
      sendJsonMessage({ type: "send_message", payload: messageEvent });
    }
  }, [sendMsg]);

  useEffect(() => {
    if (readyState === 1) {
      console.log("WebSocket connection established");
    }
  }, [readyState]);

  return (
    <div>
      <Header
        freshlyRegistered={freshlyRegistered}
        sendJsonMessage={sendJsonMessage}
        openMessageBubble={openMessageBubble}
        openMessageUserId={openMessageUserId}
        setOpenMessageBubble={setOpenMessageBubble}
        setOpenMessageUserId={setOpenMessageUserId}
        newOtherMsg={newOtherMsg}
        setNewOtherMsg={setNewOtherMsg}
      />
      {freshlyRegistered ? (
        <ProfileOptions setIsFreshlyRegistered={setIsFreshlyRegistered} />
      ) : (
        <Main view={view}
              setOpenMessageUserId={setOpenMessageUserId} />
      )}
    </div>
  );
}

export default WebSocketConnectedApp;
