import React, { useEffect, useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getUserData, getUserId, sendRequest } from '../../data/getData';
import SelectUsers from './SelectUsers';

export default function AddPost({refresh, type, targetId}) {
    
    const [data, setData] = useState("")
    const [inputHeight, setInputHeight] = useState(20)
    const privacyValues = ["Public", "Private", "Custom"]
    const [privacy, setPrivacy] = useState(privacyValues[0])
    const [followers, setFollowers] = useState([])
    const [userId, setUserId] = useState(null)
    const [showSelectUsers, setShowSelectUsers] = useState(false)
    const [selectedUsers, setSelectedUsers] = useState([])
    const [images, setImages] = useState([])
    const [imageElements, setimageElements] = useState([])
    const [showImage, setShowImage] = useState(false)
    const [imageToShow, setImageToShow] = useState(null)

    const ref = useRef()

    useEffect(() => {
        (async () => {
            let uid = await getUserId()
            let k = await sendRequest("userFollowers", "POST", JSON.stringify({"userID": uid}));
            setUserId(uid);
            setFollowers(k);
        })();
    },[showSelectUsers])

  useEffect(() => {
    let elems = []
    for (let img of images) {
      elems.push(
      <div style={{position:"relative"}}>
        <img height="40" 
             style={{width: 40, height: 40, border: "1px solid gray", marginRight:10, marginTop:10, objectFit: "cover", cursor: "pointer"}} 
             key={uuidv4()} 
             src={URL.createObjectURL(img)} 
             alt="post image"
             onClick={() => openImage(URL.createObjectURL(img))}
             onMouseEnter={() => showImageHandler(img)}
             onMouseLeave={hideImageHandler}></img>
         <button className="delete-post-image" 
                style={{backgroundColor:"white", borderRadius:"50%", width:20, height:20, fontSize:14, padding:0, position:"absolute", right: 3, top:3}}
                onClick={() => deleteImage(img)}>×</button>
      </div>)
    }
    setimageElements(elems)
  }, [images])

  const deleteImage = (file) => {
    if (file !== undefined) {
      let temp = [...images]
      let index = temp.indexOf(file)
      temp.splice(index, 1)
      setImages(temp)
    }
  }

  const handlePrivacyChange = (value) => {
    setPrivacy(value);
    if (value === "Custom") setShowSelectUsers(true);
  };

  const openImage = (image) => {
    window.open(image, '_blank')
  }

  const addImage = (file) => {
    if (file !== undefined) {
      let temp = [...images]
      temp.push(file)
      setImages(temp)
    }
  }

  const openImgSelector = () => { 
    ref.current.click()
  }
  
  const showImageHandler = (image) => {
    setShowImage(true)
    setImageToShow(image)
  }

  const hideImageHandler = () => {
    setShowImage(false)
    setImageToShow(null)
  }

  const handlePost = async () => {
    if (data !== "") {
        const id = uuidv4();
        const userId = await getUserId()
        const userData = await getUserData(userId)
        const post = {
            "id": id,
            "userId": userId,
            "userDisplayName": userData.nickname,
            "content": data,
            "timestamp": new Date().toISOString(),
            "likes": 0,
            "comments": 0,
            "type": type,
            "targetId": targetId,
            "privacyId": privacyValues.indexOf(privacy) + 1,
            "allowedUsers": (privacy === "Custom" ? selectedUsers.join("|") : ""),
            "new": 1,
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
      setData("");
      setInputHeight(20);
      refresh();
    }
  };

  const blur = () => {
    setInputHeight(data.length > 0 ? 80 : 20);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "20px",
        marginBottom: "20px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", marginLeft:10 }}>
        <h2
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          Add a new post
        </h2>
        <textarea
          placeholder="What's on your mind"
          style={{
            width: 630,
            height: inputHeight,
            resize: "none",
            padding: 10,
          }}
          onChange={(e) => setData(e.target.value)}
          value={data}
          id="new-post"
          onFocus={() => setInputHeight(80)}
          onBlur={blur}
        />
        {(images.length > 0 && data.length > 0) && <div style={{width: 652}}>
           <p style={{marginBottom:3, marginTop: 5}}>Images:</p>
           <div style={{display:"flex",  flexDirection: "row", flexWrap: "wrap", marginBottom:10}}>
            {imageElements}
           </div>
           <div style={{position:"relative"}}>
              {showImage && <div style={{position:"absolute", zIndex:10, boxShadow: "1px 0 15px 2px gray"}}>
                <img height="300" style={{backgroundColor:"white", height:300}} src={URL.createObjectURL(imageToShow)} ></img>
              </div>}
            </div>
          </div>}
        {type=="1" ? (
             <div
             style={{
               display: "flex",
               justifyContent: "space-between",
               marginTop: 0,
             }}
           >
             <div
               style={{
                 width: "fit-content",
                 whiteSpace: "nowrap",
                 display: "flex",
                 visibility: data.length > 0 ? "visible" : "hidden",
               }}
             >
               <p style={{ marginRight: 10 }}>Set the privacy:</p>
               <select
                 style={{ height: 40, width: 100, marginTop: 8, padding: 5 }}
                 onChange={(e) => handlePrivacyChange(e.target.value)}
               >
                 {privacyValues.map((e) => (
                   <option value={e}>{e}</option>
                 ))}
               </select>
               {privacy === "Custom" && (
                 <button
                   onClick={() => setShowSelectUsers(true)}
                   className="btn1"
                   style={{
                     width: 100,
                     height: 40,
                     marginTop: 8,
                     marginLeft: 10,
                     visibility: data.length > 0 ? "visible" : "hidden",
                   }}
                 >
                   Edit users
                 </button>
               )}
             </div>
             <div>
             <button
                 className="btn1"
                 style={{
                   width: 100,
                   height: 40,
                   marginTop: 8,
                   fontSize: 14,
                   fontWeight: 600,
                   marginRight:20,
                   visibility: data.length > 0 ? "visible" : "hidden",
                  }}
                  onClick={openImgSelector}>
                  Insert image</button>
               <button
                 onClick={handlePost}
                 className="btn1"
                 style={{
                   width: 100,
                   height: 40,
                   marginTop: 8,
                   fontSize: 14,
                   fontWeight: 600,
                   visibility: data.length > 0 ? "visible" : "hidden",
                 }}
               >
                 Post
               </button>
              </div>
           </div>
        ):(<div style={{display: "flex", justifyContent: "right", marginTop: 0}}>
          <div>
            <button
              className="btn1"
              style={{
                width: 100,
                height: 40,
                marginTop: 8,
                fontSize: 14,
                fontWeight: 600,
                marginRight:20,
                visibility: data.length > 0 ? "visible" : "hidden",
                }}
                onClick={openImgSelector}>
            Insert image</button>
            <button
                 onClick={handlePost}
                 className="btn1"
                 style={{
                   width: 100,
                   height: 40,
                   marginTop: 8,
                   fontSize: 14,
                   fontWeight: 600,
                   visibility: data.length > 0 ? "visible" : "hidden",
                 }}
               >
                 Post
               </button>
            </div>
        </div>)}
        
      </div>
      {type=="1" &&
      showSelectUsers && (
        <SelectUsers
          hideSelectUsers={() => setShowSelectUsers(false)}
          followers={followers}
          setSelectedUsers={setSelectedUsers}
          selectedUsers={selectedUsers}
          text="post"
        />
      )}
      <input type="file"
             accept="image/*"
             ref={ref}
             style={{display:"none"}}
             onChange={(event) => {addImage(event.target.files[0]);}}/>
    </div>
  );
}