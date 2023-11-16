import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import "./NewGroup.css"
import { useNavigate } from "react-router-dom";
import {getUserId} from "../../data/getData.js"

export default function NewGroup({close}) {

    const [newGroupImg, setNewGroupImg] = useState(null)
    const [groupName, setGroupName] = useState("")
    const [groupDescription, setGroupDescription] = useState("")
    const [showError, setShowError] = useState(false)
    const [errorText, setErrorText] = useState("")

    const ref = useRef()
    const navigate = useNavigate();

    const openImgSelector = () => { 
        ref.current.click()
    }

    const addGroup = async (event) => {
        event.preventDefault();
        const userId = await getUserId()
        if (newGroupImg === null) {
            setShowError(true)
            setErrorText("Please select group image")
        } else if (groupDescription === "" || groupName === "") {
            setShowError(true)
            setErrorText("Please check inputs")
            return
        } else {
            setShowError(false)
        }
        if (newGroupImg) {
            const formData = new FormData();
            formData.append("groupImg", newGroupImg);
            formData.append("groupName", groupName);
            formData.append("groupDescription", groupDescription);
            formData.append("creator", userId)
            const url = window.location.protocol + "//" + window.location.hostname + ":3001/addGroup";
              fetch(url, {
                method: "POST",
                body: formData,
              })
              .then(async (response) => {
                return response.json()
              })
              .then(d => {
                navigate("/group?id=" + d.groupId);
                close()
              })
              .catch((error) => {
                console.log("ERROR:", error);
              });
        }
      };

    return (
        <div>
            <div id="new-group-overlay"></div>
            <div id="new-group-container">
                <FontAwesomeIcon icon={faXmark} 
                                style={{color: "#b0b9c9", height: "35px", position: "absolute", top: 15, right: 20, cursor: "pointer"}}
                                onClick={close}/>
                <h2 style={{textAlign:"center"}}>Create new group</h2>
                    <div style={{display:"flex", justifyContent:"center"}}>
                        <div id="new-group-img" style={{display:"flex", justifyContent:"center", width:205, borderRadius:"50%", border:"1px solid black", overflow:"hidden"}}>
                            {newGroupImg ? (<img
                                alt="not found"
                                height={"200px"}
                                src={URL.createObjectURL(newGroupImg)}
                            />) : <img alt="placeholder-img" src="img/placeholder-img.jpeg" height="200"/>}
                        </div>
                        <button id="img-selector-btn" onClick={openImgSelector}>+</button>
                    </div>


                <div style={{marginTop:20, marginLeft:85}}> 
                    <label className="new-group-labels" htmlFor="new-group-name">Group name</label>
                    <input id="new-group-name"
                        className="new-group-inputs"
                        placeholder="The name of the group"
                        type="text"
                        onChange={(e) => setGroupName(e.target.value)}>
                    </input>
                </div>
                <div style={{marginTop:30, marginLeft:85}}>
                    <label className="new-group-labels" htmlFor="new-group-description">Group description</label>
                    <input id="new-group-description"
                        className="new-group-inputs"
                        type="text" 
                        placeholder="A short description of the group"
                        onChange={(e) => setGroupDescription(e.target.value)}>
                    </input>
                </div>
                <input type="file"
                    ref={ref}
                    style={{display:"none"}}
                    onChange={(event) => {setNewGroupImg(event.target.files[0]);}}/>
                {showError ? <p style={{backgroundColor:"red", color:"white", textAlign:"center", padding:"8px 0px"}}>{errorText}</p> : <p style={{minHeight:20}}></p>}
                <button id="create-group-btn"
                        onClick={addGroup}>
                            Create group
                </button>
            </div>
        </div>
    )
}