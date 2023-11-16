import React, { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleUser,
  faThumbsUp,
  faComment,
  faPaperPlane,
  faXmark,
  faImage
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { convertDate } from "./Post.js";
import Comment from "./Comment.js";
import "../Components.css";
import { likePost, submitComment } from "../../data/postData.js";
import { getUserData, getUserId, postLikedByUser, sendRequest } from "../../data/getData.js";
import SelectUsers from "./SelectUsers.js";
import { v4 as uuidv4 } from 'uuid';

function SinglePost({ filter, data, setDisplayPost, refresh }) {
  const [comments, setComments] = useState([]);
  const [render, setNewRender] = useState(0);
  const [postLiked, setPostLiked] = useState(false)
  const [userId, setUserId] = useState("")
  const privacyValues = ["Public", "Private", "Custom"]
  const [privacy, setPrivacy] = useState(privacyValues[data.privacyId - 1])
  const [followers, setFollowers] = useState([])
  const [showSelectUsers, setShowSelectUsers] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState(data.allowedUsers.split("|"))
  const [postText, setPostText] = useState(data.content)
  const [images, setImages] = useState([])
  const [imageElements, setimageElements] = useState([])
  const [commentImage, setCommentImage] = useState(null)
  
  const ref1 = useRef()
  const commentRef = useRef()
  const commentInputRef = useRef(null);
  const handleCloseClick = () => {
    setDisplayPost(false, {})
  };

  useState(() => {
    async function checkIfUserHasLikedPost() {
      await postLikedByUser(data.id).then(d => setPostLiked(d.liked === "1"))
    }
    checkIfUserHasLikedPost()
  }, [])

  useEffect(() => {
    (async () => {
        let uid = await getUserId()
        let k = await sendRequest("userFollowers", "POST", JSON.stringify({"userID": userId}));
        setUserId(uid);
        setFollowers(k);
    })();
  },[])

  useEffect(() => {
    const adjustTextareaHeight = () => {
      const textarea = commentInputRef.current;
      textarea.style.height = "auto"; // Reset the height first
      textarea.style.height = `${textarea.scrollHeight}px`; // Set the height based on the content
    };

    // Attach event listeners for input and resize
    const textarea = commentInputRef.current;
    textarea.addEventListener("input", adjustTextareaHeight);
    window.addEventListener("resize", adjustTextareaHeight);

    // Cleanup the event listeners
    return () => {
      textarea.removeEventListener("input", adjustTextareaHeight);
      window.removeEventListener("resize", adjustTextareaHeight);
    };
  }, []);

  const navigate = useNavigate();
  const showUser = () => {
    navigate("/profile?id=" + data.userId);
  };
  useEffect(() => {
    const getComments = async () => {
      const url =
        window.location.protocol +
        "//" +
        window.location.hostname +
        `:3001/getComments?id=${data.id}`;
      await fetch(url, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((commentData) => {
          let r = [];
          console.log(commentData)
          for (let i = 0; i < commentData.length; i++) {
            let newComment = <Comment key={i} data={commentData[i]} />;
            r.push(newComment);
          }
          setComments(r);
        })
        .catch((error) => console.log("error", error));

      return data;
    };
    getComments();
  }, [data, render]);

  useEffect(() => {
    if (data.images.split("|").length > 0 && data.images !== "") {
      setImages(data.images.split("|"))
    }
  }, [data.images])

  useEffect(() => {

    if (images.length > 0) {
      let elems = []
      for (let img of images) {
        const isFile = img instanceof File
        elems.push(
        <div style={{position:"relative"}}>
          <img height="40" 
               style={{width: 40, height: 40, border: "1px solid gray", marginRight:10, marginTop:10, objectFit: "cover", cursor: "pointer"}} 
               key={uuidv4()} 
               src={(isFile ? URL.createObjectURL(img) : window.location.protocol + "//" + window.location.hostname + ":3001/" + img)} 
               alt="post image"
               onClick={() => openImage((isFile ? URL.createObjectURL(img) : window.location.protocol + "//" + window.location.hostname + ":3001/" + img))}
               ></img>
               {(data.edit) && <button className="delete-post-image" 
                style={{backgroundColor:"white", borderRadius:"50%", width:20, height:20, fontSize:14, padding:0, position:"absolute", right: 3, top:3}}
                onClick={() => deleteImage(img)}>×</button>}
        </div>)
        
      }
      setimageElements(elems)
    } else {
      setimageElements([])
    }
  }, [images])

  const deleteImage = (file) => {
    if (file !== undefined) {
      let temp = [...images]
      let index = temp.indexOf(file)
      temp.splice(index, 1)
      setImages(temp)
    }
  }

  const openImgSelector = () => { 
    ref1.current.click()
  }

  const openCommentImgSelector = () => { 
    commentRef.current.click()
  }


  const addImage = (file) => {
    if (file !== undefined) {
      let temp = [...images]
      temp.push(file)
      setImages(temp)
    }
  }

  const addCommentImage = (file) => {
    if (file === undefined) {
      setCommentImage(null)
    } else {
      setCommentImage(file)
    }

  }

  const handleCommentSubmit = async () => {
    const newComment = commentInputRef.current.value;

    if (newComment.trim() === "") {
      return;
    }

    await submitComment(newComment, data.id, commentImage); // Assuming this function makes the API request to submit the comment
    data.comments = data.comments + 1
    document.getElementById(data.id + "-comment-count").innerHTML = data.comments
    // Update the comments state by fetching the latest comments again
    setNewRender((prev) => prev + 1);

    // Clear the comment input
    commentInputRef.current.value = "";
    setCommentImage(null)
  };

  const likeHandler = async () => {
    if (!postLiked) {
      data.likes = data.likes + 1
      await likePost(data.id)
      refresh()
      setPostLiked(true)
      setNewRender((prev) => prev + 1); 
    }
  }

  const openImage = (image) => {
    window.open(image, '_blank')
  }

  const handlePrivacyChange = (value) => {
    setPrivacy(value);
    if (value === "Custom") setShowSelectUsers(true)
  };

  const handlePost = async () => {
  if (data !== "") {
      const id = uuidv4();
      let type = "";
      data.type == "" && filter=="groupFeed" ? type="2":type=data.type
      const userId = await getUserId()
      const userData = await getUserData(userId)
      const post = {
          "id": data.id,
          "userId": userId,
          "userDisplayName": userData.nickname,
          "content": postText,
          "timestamp": data.timestamp,
          "likes": data.likes,
          "comments": data.comments,
          "type": type,
          "targetId": data.targetId,
          "privacyId": privacyValues.indexOf(privacy) + 1,
          "allowedUsers": (privacy === "Custom" ? selectedUsers.join("|") : null),
          "new": 0,
          "imageCount": images.length
      }
      const formData = new FormData();
        for (let i = 0; i < images.length; i++) {
          formData.append("img" + i, images[i])
        }
        for (let [key, value] of Object.entries(post)) {
          formData.append(key, value)
        }
        const url = window.location.protocol + "//" + window.location.hostname + ":3001/newPost";
          await fetch(url, {
            method: "POST",
            body: formData,
          })
          .then(async (response) => {
            return response.json()
          })
          .catch((error) => {
            console.log("ERROR:", error);
          });
      refresh()
      handleCloseClick()
  }
  };

  return (
    <div style={{ position: "absolute", left: "0", top: "0", width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.2)", backdropFilter: "blur(3px)"}}>
      <div style={{ position: "absolute", top: "10%", left: "30%", width: "40%", height: "auto", zIndex: "1000", backgroundColor: "white", borderRadius: "10px"}}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "center"}}>
          <p style={{ fontWeight: "700", fontSize: "20px", justifyContent: "center", display: "flex", position: "sticky", top: 0, 
                      backgroundColor: "white", borderRadius: "10px 10px 0 0", padding: "10px", marginBottom: "10px",}}>
            Post by user {data.userDisplayName}
          </p>
          <FontAwesomeIcon icon={faXmark} 
                           style={{ color: "#b0b9c9", height: "35px", position: "absolute", top: 5, right: 10, cursor: "pointer" }}
                           onClick={() => {handleCloseClick()}}
          />
        </div>

        {/* Inner section */}

        <div
          style={{ minWidth: "40%", maxHeight: "600px", marginTop: 20, borderTop: "1px solid lightblue", marginBottom: "10px", overflowY: "auto",}}>
          {/* Post author section */}
          <div style={{ display: "flex", padding: 15, backgroundColor: "#add8e687",}}>
            <div style={{ width: 60 }}>
              {data.image === "" ? (
                <div style={{ opacity: 0.7, fontSize: 50 }}>
                  <FontAwesomeIcon icon={faCircleUser} />
                </div>
              ) : (
                <div style={{ overflow: "hidden", display: "flex", justifyContent: "center", borderRadius: "100%", width: 50, height: 50,}}>
                  <img
                    src={data.image !== "" && window.location.protocol + "//" + window.location.hostname + ":3001/" + data.image}
                    height="50"
                    alt="user-img"
                  />
                </div>
              )}
            </div>
            <div>
              <p className="post-nickname"
                 style={{ margin: 0, marginTop: 8, fontSize: 16, fontWeight: 600 }}
                 onClick={showUser}>
                {data.userDisplayName}
              </p>
              <p style={{ margin: 0, marginTop: 5, fontSize: 12 }}>
                {convertDate(data.timestamp)}
              </p>
            </div>
          </div>

          {/* Post content section */}

          {(data.userId === userId && data.edit) ? 
          <div>
            <textarea rows='4' style={{width:"97%", resize:"none", padding:10}} value = {postText} onChange={(e) => setPostText(e.target.value)}></textarea>
            {imageElements.length > 0 && <div>
              <p style={{margin: "5px 20px"}}>Images:</p>
              <div style={{display:"flex",  flexDirection: "row", flexWrap: "wrap", margin: "5px 20px"}}>
                {imageElements}
             </div>
            </div>}
            <div style={{display:"flex", justifyContent:"space-between", marginTop:0, padding:"0 10px"}}>
              <div style={{width: "96%", display: "flex", visibility:(postText.length > 0 && filter !== "groupFeed" ? "visible": "hidden")}}>
                <p style={{marginRight: 10}}>Set the privacy:</p>
                <select style={{height:40, width:100, marginTop:8, padding:5}} onChange={(e) => handlePrivacyChange(e.target.value)} value={privacy}>
                    {privacyValues.map(e => <option value={e}>{e}</option>)}
                </select>
                {privacy === "Custom" && <button onClick={() => setShowSelectUsers(true)} className='btn1'
                    style={{width:100, height:40, marginTop:8, marginLeft:10, visibility:(postText.length > 0 ? "visible": "hidden")}}>
                    Edit users
                </button>}
              </div> 
              <button
                 className="btn1"
                 style={{
                   width: 150,
                   height: 40,
                   marginTop: 8,
                   fontSize: 13,
                   fontWeight: 500,
                   marginRight:20,
                  }}
                  onClick={openImgSelector}>
                  Insert image</button>
              <button onClick={handlePost} className='btn1'
                      style={{width:100, height:40, marginTop:8, fontSize:14, fontWeight:600, visibility:(postText.length > 0 ? "visible": "hidden"), marginRight:20}}>
                  Save
              </button>
            </div>
            {showSelectUsers && <SelectUsers hideSelectUsers={() => setShowSelectUsers(false)} followers={followers} setSelectedUsers={setSelectedUsers} selectedUsers={selectedUsers}/>}
          </div>
          :
          <div style={{ padding: "30px 25px", backgroundColor: "aliceblue" }}>
            <pre>{data.content}</pre>
            <div style={{display:"flex",  flexDirection: "row", flexWrap: "wrap", marginTop:20}}>
              {imageElements}
            </div>
          </div>
          }
          <div style={{ display: "flex", justifyContent: "space-between", padding: "5px" }}>
            <div style={{ padding: "10px 20px" }}>
              <FontAwesomeIcon icon={faThumbsUp} /> {data.likes}
            </div>
            <div style={{ padding: "10px 20px", marginRight: "30px" }}>
              Comments: {data.comments}
            </div>
          </div>
          <div style={{ content: "", left: 100, bottom: 0, height: "1px", width: "95%", borderBottom: "1px solid lightgray", marginLeft: "15px"}}></div>
          <div style={{ display: "flex", padding: "5px" }}>
            <div id={postLiked ? "" : "add-like"}
                 style={{ padding: "10px 20px", borderRadius: "5px", color:(postLiked ? "#0a85f1" : "black") }}
                 onClick={likeHandler}>
              <FontAwesomeIcon
                icon={faThumbsUp}
                style={{ marginRight: "5px" }}/>
              Like
            </div>
            <div id="add-comment"
                 style={{ padding: "10px 20px", borderRadius: "5px" }}>
              <FontAwesomeIcon icon={faComment}
                               style={{ marginRight: "5px" }}/>
              Comment
            </div>
          </div>

          {/* Comments section */}
          <div>{comments}</div>
        </div>
        {/* New comment section*/}

        <div style={{ width: "100%", height: "50px", marginTop: "5px", marginBottom: "10px", display: "flex", flexDirection: "column-reverse" }}>
          <div style={{ position: "relative", marginLeft: "10px", borderRadius: "12px", backgroundColor: "#F0F2F5", width: "calc(100% - 20px)", height: "60px", display: "flex", flexDirection: "column-reverse" }}>
            <textarea ref={commentInputRef}
                      style={{  borderRadius: "12px", backgroundColor: "#F0F2F5",  width: "calc(100% - 40px)", border: "none",  outline: "none",  resize: "none", minHeight: "30px", maxHeight: "200px",  
                                overflowY: "auto",  flexGrow: "1",  zIndex: 1000, marginLeft: "10px",  marginTop: "5px", height: "30px", visibility: (showSelectUsers ? "hidden" : "visible") }}
                      placeholder="Write your comment here...">
            </textarea>
            <div style={{ position: "absolute", bottom: "5px", right: "8px", height:40 }}>
              {/* Icon for sending the comment */}
              <div style={{display: "block"}}>
              {commentImage === null ?
              <FontAwesomeIcon className="send-comment-icon comment-btn"
                                 icon={faImage}
                                 style={{display:"block", marginBottom:5 }}
                                 onClick={openCommentImgSelector}/>
              : 
              <img src ={URL.createObjectURL(commentImage)} 
                   alt="comment-image" 
                   width= '15' 
                  height='auto' 
                  className="comment-btn"
                  onClick={openCommentImgSelector}
                  style={{width: 15, height: 15, border: "1px solid gray", marginBottom:5, objectFit: "cover", cursor: "pointer", display:"block"}} />}
                <FontAwesomeIcon className="send-comment-icon comment-btn"
                                 icon={faPaperPlane}
                                 onClick={() => commentInputRef.current.value !== "" && handleCommentSubmit(commentInputRef.current.value, data.id)}/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <input type="file"
             accept="image/*"
             ref={ref1}
             style={{display:"none"}}
             onChange={(event) => {addImage(event.target.files[0]);}}/>
      <input type="file"
             accept="image/*"
             ref={commentRef}
             style={{display:"none"}}
             onChange={(event) => {addCommentImage(event.target.files[0]);}}/>
    </div>
  );
}

export default SinglePost;
