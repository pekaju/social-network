import React, {useRef} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

function AddMessage({setSendMsg, myUserId, otherUserId}) {
  const textareaRef = useRef(null);
  const handleInputChange = () => {
    const textarea = textareaRef.current;
    const lineHeight = parseInt(window.getComputedStyle(textarea).lineHeight, 10);
    const rows = Math.floor(textarea.scrollHeight / lineHeight);
    if (textarea.value.length > 43 ) {
      textarea.style.height = `${rows * lineHeight}px`;
    }
    if (textarea.value.trim() === "") {
      textarea.style.height = `${lineHeight}px`;
    }
  };
function sendNewMsg() {
  if (textareaRef.current.value.trim() !== "") {
    setSendMsg({msg: textareaRef.current.value,
    otherUserId: otherUserId, myUserId: myUserId
  })
    textareaRef.current.value = ""
    handleInputChange();
  }
}
function handleKeyDown(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendNewMsg();
  }else if (event.key === 'Enter' && event.shiftKey) {
    addNewRow();
  }
}
function addNewRow() {
  textareaRef.current.value += "\n";
  handleInputChange(); // Recalculate height
}
function handleEmojiClick(event) {
  textareaRef.current.value = textareaRef.current.value + event.target.innerHTML
}
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div>
        <div style={{width: "fit-content"}} onClick={(handleEmojiClick)}>
          <Emoji symbol="😄" label="smile" />
        </div>
      </div>
      <div>
      <textarea
        ref={textareaRef}
        style={{
          width: "300px",
          borderRadius: "15px",
          border: "0px",
          padding: "6px 8px",
          backgroundColor: "#E4E6EB",
          outline: "none",
          resize: "none", // Disable resizing
          overflow: "auto", // Enable vertical scrolling
          lineHeight: "15px",
          maxHeight: "160px", // Set maximum height for the textare
        }}
        placeholder="Aa"
        rows={1}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      ></textarea>
      <FontAwesomeIcon
        icon={faPaperPlane}
        style={{
          position: "absolute",
          right: "0px",
          bottom: "-2px",
          transform: "translateY(-50%)",
          cursor: "pointer",
        }}
        onClick={sendNewMsg}
      />
      </div>
      
    </div>
  );
}

export default AddMessage;

export const Emoji = props => (
  <span
      className="emoji"
      role="img"
      aria-label={props.label ? props.label : ""}
      aria-hidden={props.label ? "false" : "true"}
      style={{cursor: "pointer"}}
  >
      {props.symbol}
  </span>
);
