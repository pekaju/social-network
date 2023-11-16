import { useEffect, useState } from "react";
import React from "react";
import "./profileOptions.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { getUserId } from "../../data/getData";
export default function ProfileOptions({ setIsFreshlyRegistered }) {
  const [idOfUser, setIdOfUser] = useState("");
  const [firstName, setFirstName] = useState("");
  const [skip1Clicked, setSkip1Clicked] = useState(false); 
  const [skip2Clicked, setSkip2Clicked] = useState(false); 
  const [selectedFile, setSelectedFile] = useState(null);
  const [nickname, setNickname] = useState("");
  const [description, setDescription] = useState(""); 
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };
  const removeSelectedFile = () => {
    setSelectedFile(null);
    const fileInput = document.getElementById("avatar");
    fileInput.value = null;
  };
  const postRequest = async (url, body) => {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
  
      if (response.ok) {
      }else {
        throw new Error("Network response was not ok.");
      }
    } catch (error) {
      console.log("Error:", error);
      throw error;
    }
  };
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const userID = await getUserId();
        setIdOfUser(userID);
        const response = await fetch("http://localhost:3001/profileOptions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userID: userID }),
        });

        if (response.ok) {
          const fName = await response.json();
          setFirstName(fName);
        }
      } catch (error) {
        console.log("Error:", error);
      }
    };

    fetchProfileData();
  }, []);
  const handleSkip1Click = () => {
    setSkip1Clicked(true);
  };
  const handleSkip2Click = () => {
    setSkip1Clicked(false)
    setSkip2Clicked(true);
  };
  const handleSkip3Click = () => {
    setIsFreshlyRegistered(false);
  };
  const addUserName = (event) => {
    event.preventDefault();
    const nicknameValue = nickname;
    // Perform your fetch request with the username value
    const handleAddUsername = () => {
      const url =
        window.location.protocol +
        "//" +
        window.location.hostname +
        ":3001/addUsername";
      postRequest(url, { Nickname: nicknameValue, UserId: idOfUser })
      setSkip1Clicked(true);
    };
    if (nicknameValue.trim() !== "") {
      handleAddUsername();
    } else {
      document.getElementById("nickname-error").style.display = "block";
    }
  };
  const addAvatar = (event) => {
    event.preventDefault();
    if (selectedFile) {
        const formData = new FormData();
        formData.append("avatar", selectedFile);
        formData.append("UserId", idOfUser);
        const url =
          window.location.protocol +
          "//" +
          window.location.hostname +
          ":3001/addAvatar";
          fetch(url, {
            method: "POST",
            body: formData,
          })
          .then((response) => {
            if (response.ok) {
              handleSkip2Click();
            } else {
              console.log("error from file sending");
            }
          })
          .catch((error) => {
            console.log("ERROR:", error);
          });
    }
  };
  const addAboutMe = (event) => {
    event.preventDefault();
    const descriptionValue = description;
    // Perform your fetch request with the username value
    const handleAddAboutMe = () => {
      const url =
        window.location.protocol +
        "//" +
        window.location.hostname +
        ":3001/addAboutme";
      postRequest(url, {Description: descriptionValue, UserId: idOfUser})
      handleSkip3Click();
    };
    if (descriptionValue.trim() !== "") {
      handleAddAboutMe();
    } else {
      document.getElementById("description-error").style.display = "block";
    }
  };
  const checkError = () => {
    const errorElement = document.getElementById("nickname-error");
    if (errorElement.style.display === "block") {
      errorElement.style.display = "none";
    }
  };
  const checkDescriptionError = () => {
    const errorElement = document.getElementById("description-error");
    if (errorElement.style.display === "block") {
      errorElement.style.display = "none";
    }
  }
  return (
    <div className="profile-options-background">
      <h1 style={{ marginBottom: "50px" }}>
        Welcome to the Social Network, {firstName}!
      </h1>
      <div className="profile-options-main">
        {skip2Clicked ? (
            <>
              <h3>Would you like to add a little description about yourself?</h3>
              <textarea
                id="description"
                rows="10"
                maxLength="200"
                placeholder=""
                style={{ marginBottom: "10px", resize: "none", width: "400px" }}
                onInput={checkDescriptionError}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
              <p
                id="description-error"
                style={{ color: "red", display: "none", marginTop: "10px" }}
              >
                You cannot submit an empty field
              </p>
              <div>
              <button
                className="button-4"
                style={{ marginRight: "20px" }}
                onClick={addAboutMe}
              >
                Add
              </button>
              <button
                className="button-4"
                onClick={handleSkip3Click}
              >
                Skip
              </button>
              </div>
            </>
      ) : skip1Clicked && !skip2Clicked ? (
          <>
            <h3>Would you like to add an avatar?</h3>
            {selectedFile ? (
              <p>
                Selected file: {selectedFile.name}
                <FontAwesomeIcon
                  icon={faTimes}
                  className="remove-icon"
                  onClick={removeSelectedFile}
                />
              </p>
            ) : (
              <p>No file selected</p>
            )}
            <form style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <label
                  htmlFor="avatar"
                  className="button-4"
                  style={{
                    height: "35px",
                    width: "100px",
                    marginRight: "20px",
                  }}
                >
                  Choose file
                </label>
                <input
                  id="avatar"
                  type="file"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                <button
                  onClick={addAvatar}
                  style={{
                    width: "80px",
                    alignItems: "center",
                  }}
                  className="button-4"
                >
                  Add file
                </button>
              </div>
            </form>
            <button
              className="button-4"
              style={{ marginTop: "20px" }}
              onClick={handleSkip2Click}
            >
              Skip
            </button>
          </>
        ) : (
          <>
            <h3>Would you like to set a nickname?</h3>
            <p
              id="nickname-error"
              style={{ color: "red", display: "none", marginTop: "0px" }}
            >
              You cannot submit an empty field
            </p>
            <form>
              <label htmlFor="username" style={{ marginRight: "20px" }}>
                Nickname:
              </label>
              <input 
              id="username" 
              type="text" 
              onInput={checkError}
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              />
              <button
                onClick={addUserName}
                style={{ marginLeft: "10px" }}
                className="button-4"
              >
                Add
              </button>
            </form>
            <button
              className="button-4"
              style={{ marginTop: "20px" }}
              onClick={handleSkip1Click}
            >
              Skip
            </button>
          </>
        )}
      </div>
    </div>
  );
}