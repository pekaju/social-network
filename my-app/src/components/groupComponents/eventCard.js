import "../../pages/Group.css";
import { getUserId, sendRequest } from "../../data/getData";

export default function EventCard({
  title,
  creator,
  desc,
  date,
  groupId,
  id,
  creatorName,
}) {
  async function handleGoing() {
    const body = JSON.stringify({
        "groupID": groupId,
        "eventId": id,
        "userId": await getUserId(),
        "going": true
    })
    await sendRequest("handleGoing", "POST", body);
  }
  async function handleNotGoing() {
    const body = JSON.stringify({
        "groupID": groupId,
        "eventId": id,
        "userId": await getUserId(),
        "going": false
    })
    await sendRequest("handleGoing", "POST", body);
  }
  return (
    <div
      style={{
        border: "1px solid gray",
        minWidth: 315,
        width: 315,
        display: "flex",
        flexDirection: "column",
        marginLeft: 30,
        marginBottom: 10,
        overflowY: "scroll",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <h3>{title}</h3>
      </div>
      <div>
        <h4 style={{ marginLeft: 20 }}>Description of event:</h4>
        <div
          style={{
            border: "1px solid lightgray",
            margin: 20,
          }}
        >
          <p
            style={{
              paddingLeft: 10,
              paddingRight: 20,
              overflow: "hidden",
              wordWrap: "break-word",
            }}
          >
            {desc}
          </p>
        </div>
        <h4 style={{ marginLeft: 20 }}>Date:</h4>
        <p style={{ marginLeft: 20 }}>{date}</p>
      </div>
      <div>
        <h4 style={{ marginLeft: 20 }}>Event creator:</h4>
        <p
          style={{
            marginLeft: 20,
          }}
        >
          {creatorName}
        </p>
      </div>
      <div>
        <h4 style={{ marginLeft: 20 }}>Set status:</h4>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <button
            id="set-going-button"
            style={{
              marginRight: 10,
            }}
            onClick={() => handleGoing()}
          >
            Going
          </button>
          <button
            id="set-not-going-button"
            style={{
              marginLeft: 10,
            }}
            onClick={() => handleNotGoing()}
          >
            Not going
          </button>
        </div>
      </div>
    </div>
  );
}
