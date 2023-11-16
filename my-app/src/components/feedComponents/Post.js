import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser, faThumbsUp, faComment, faPencil } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "./Post.css";
import { likePost } from "../../data/postData";
import { getUserId, postLikedByUser } from "../../data/getData";
import { v4 as uuidv4 } from 'uuid';

export default function Post({ data, setDisplayPost='', refresh }) {

  const [postLiked, setPostLiked] = useState(false)
  const [userId, setUserId] = useState("")
  const [imageElements, setimageElements] = useState([])
  const [showImage, setShowImage] = useState(false)
  const [imageToShow, setImageToShow] = useState(null)

  const navigate = useNavigate();
  const display = (edit) => {
      let d = data
      d.edit = edit
      setDisplayPost([true, d])
  }

  useState(() => {
    async function checkIfUserHasLikedPost() {
      await postLikedByUser(data.id).then(d => setPostLiked(d.liked === "1"))
      await getUserId().then(d => setUserId(d))
    }
    checkIfUserHasLikedPost()
  }, [data])

  useEffect(() => {

    if (data.images.split("|").length > 0 && data.images !== "") {
      let elems = []
      for (let img of data.images.split("|")) {
        elems.push(
        <div style={{position:"relative"}}>
          <img height="40" 
               style={{width: 40, height: 40, border: "1px solid gray", marginRight:10, marginTop:10, objectFit: "cover", cursor: "pointer"}} 
               key={uuidv4()} 
               src={window.location.protocol + "//" + window.location.hostname + ":3001/" + img} 
               alt="post image"
               onClick={() => openImage(window.location.protocol + "//" + window.location.hostname + ":3001/" + img)}
               onMouseEnter={() => showImageHandler(window.location.protocol + "//" + window.location.hostname + ":3001/" + img)}
               onMouseLeave={hideImageHandler}></img>
        </div>)
      }
      setimageElements(elems)
    }
  }, [data.images])

  const showImageHandler = (image) => {
    setShowImage(true)
    setImageToShow(image)
  }

  const openImage = (image) => {
    window.open(image, '_blank')
  }

  const hideImageHandler = () => {
    setShowImage(false)
    setImageToShow(null)
  }

  const showUser = () => {
    navigate("/profile?id=" + data.userId);
  };
  const showGroup = () => {
    navigate("/group?id=" + data.groupId);
  };

  const likeHandler = async () => {
    if (!postLiked) {
      // setLikes(likes + 1)
      await likePost(data.id)
      refresh()
      setPostLiked(true)
    }
  }

  return (
    <div style={{maxWidth:800, margin:"auto"}}>
      <div style={{ margin:"20px 50px", border: "1px solid lightblue" }} >
        <div style={{ display: "flex", padding: 15, backgroundColor: "#add8e687" }}>
          <div style={{ width: 60 }}>
            {data.image === "" ? (
              <div style={{ opacity: 0.7, fontSize: 50 }}>
                <FontAwesomeIcon icon={faCircleUser} />
              </div>
            ) : (
              <div style={{ overflow: "hidden", display: "flex", justifyContent: "center", borderRadius: "100%", width: 50, height: 50 }}>
                <img src={window.location.protocol + "//" + window.location.hostname + ":3001/" + data.image}
                     height="50"
                     alt="user-img"/>
              </div>
            )}
          </div>
          <div style={{width:"90%"}}>
            <div style={{height:50}}>
              {(data.groupId !== "" ? <div>
                <p className="post-group" 
                   style={{ margin: 0, marginTop: -2, fontSize: 16, fontWeight: 600 }} 
                   onClick={showGroup}>
                  {data.groupName}
                </p>
                <p  className="post-nickname"
                  style={{ margin: 0, marginTop: 2, fontSize: 12, fontWeight: 600 }}
                  onClick={showUser}>
                  {data.userDisplayName}
              </p>
              </div>
              : <p  className="post-nickname"
                  style={{ margin: 0, marginTop: 8, fontSize: 16, fontWeight: 600 }}
                  onClick={showUser}>
                  {data.userDisplayName}
              </p>)}
              <p style={{ margin: 0, marginTop: 5, fontSize: 12 }}>
              {convertDate(data.timestamp)}
            </p>
            </div>
          </div>
          <div>
          {userId === data.userId && <FontAwesomeIcon icon={faPencil} className="edit-post" onClick={() => display(true)}/>}
          </div>
        </div>
        <div style={{ padding: "30px 25px 20px 25px", backgroundColor: "aliceblue" }}>
          <pre>{data.content}</pre>
          <div style={{display:"flex",  flexDirection: "row", flexWrap: "wrap", marginTop:20}}>
            {imageElements}
          </div>
          <div style={{position:"relative"}}>
             {showImage && <div style={{position:"absolute", zIndex:10, boxShadow: "1px 0 15px 2px gray"}}>
               <img height="300" style={{backgroundColor:"white", height:300}} src={imageToShow} ></img>
             </div>}
           </div>
        </div>
        <div style={{ display: "flex", justifyContent:"space-between", padding: "5px" }}>
          <div style={{ padding: "10px 20px" }}>
            <FontAwesomeIcon icon={faThumbsUp} /> <span id={data.id + "-like-count"}>{data.likes}</span></div>
          <div style={{ padding: "10px 20px", marginRight: "30px" }}>
            <FontAwesomeIcon icon={faComment} style={{color: "#a6badd"}} /> <span id={data.id + "-comment-count"}>{data.comments}</span>
          </div>
        </div>
        <div style={{ content: "", left: 100, bottom: 0, height: "1px", width: "95%", borderBottom: "1px solid lightgray", marginLeft: "15px"}}></div>
          <div style={{ display: "flex", padding: "5px" }}>
              <div id={postLiked ? "" : "add-like"}
                   style={{ padding: "10px 20px", borderRadius: "5px", color:(postLiked ? "#0a85f1" : "black") }} 
                   onClick={likeHandler}>
                <FontAwesomeIcon icon={faThumbsUp} style={{marginRight: "5px"}} />
                Like
              </div>
              <div id="add-comment" onClick={() => display(false)} style={{ padding: "10px 20px", borderRadius: "5px" }}><FontAwesomeIcon icon={faComment} style={{marginRight: "5px"}} />Comment</div>
          </div>
      </div>
    </div>
  );
}

export function convertDate(date) {
  let d = new Date(date);
  return `${formatDateValue(d.getHours())}:${formatDateValue(
    d.getMinutes()
  )} ${formatDateValue(d.getDate())}.${formatDateValue(
    d.getMonth() + 1
  )}.${d.getFullYear()}`;
}

export function formatDateValue(value) {
  if (value < 10) {
    return "0" + value;
  } else {
    return value;
  }
}
