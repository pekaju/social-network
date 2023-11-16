import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";

function Comment(data) {
  data = data.data
  const [width, setWidth] = useState(null);
  const commentRef = useRef(null);

  useEffect(() => {
    if (commentRef.current) {
      setWidth(commentRef.current.offsetWidth);
    }
  }, []);

  const openImage = (image) => {
    window.open(image, '_blank')
  }

  return (
    <div>
      <div style={{ display: "flex", marginLeft: "10px", height: "auto", marginTop: "10px" }} id="single-comment"
        ref={commentRef}
      >
        <div style={{ width: 40, }}>
          {data.userImage === "" ? (
            <div style={{ opacity: 0.7, fontSize: 35, zIndex: -10, position: "relative" }}>
              <FontAwesomeIcon icon={faCircleUser} />
            </div>
          ) : (
            <div
              style={{ overflow: "hidden", display: "flex", justifyContent: "center", width: 35, height: 35, borderRadius: "100%" }}
            >
              <img src={window.location.protocol + "//" + window.location.hostname + ":3001/" + data.userImage}
                height="35"
                alt="user-img"
              />
            </div>
          )}
        </div>
        <div style={{ backgroundColor: "#F0F2F5", borderRadius: "18px", display: "flex", flexDirection: "column", fontSize: "14px" }}>
          <div>
            <p style={{ fontWeight: "550", marginLeft: "12px", marginRight: "10px", marginTop: "8px" }}>
              {data.userName}
            </p>
          </div>
          <div style={{ minHeight: "20px", width: "auto" }}>
            <p style={{ marginLeft: "12px", marginRight: "10px", marginTop: "0px" }}>
              {data.content}
            </p>
          </div>
        </div>
      </div>
      <div style={{position:"relative", display: "block"}}>
        {data.Image !== "" && <img width="120" 
           style={{maxWidth: "60%", maxHeight:200, border: "1px solid gray", marginLeft:50, marginTop:5, objectFit: "cover", cursor: "pointer"}} 
           src={window.location.protocol + "//" + window.location.hostname + ":3001/" + data.Image} 
           alt="comment image"
           onClick={() => openImage(window.location.protocol + "//" + window.location.hostname + ":3001/" + data.Image)}
           >
        </img>}
      </div>
    </div>
  )
}

export default Comment;