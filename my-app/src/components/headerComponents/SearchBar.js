import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faCircleUser } from '@fortawesome/free-solid-svg-icons'
import { searchInputHandler, getUserId } from "../../data/getData";
import { useNavigate } from "react-router-dom";


const SearchBar = ({ defaultText, onSearch = false, onPost = false, message=false, setOpenMessageUserId, setShowMessages }) => {
  const navigate = useNavigate()
  const search =
    window.location.protocol + "//" + window.location.hostname + ":3001/search";

  const [searchInput, setSearchInput] = useState("");
  const [usersOutput, setUsersOutput] = useState([]);
  const [postsOutput, setPostsOutput] = useState("");
  const [timeoutId, setTimeoutId] = useState(null);
  const resultsRef = useRef(null);

  useEffect(() => {
    // Add event listener to handle click outside search results
    const handleOutsideClick = (event) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target)) {
        setUsersOutput([]);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      // Clean up event listener on component unmount
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);


  const handleChange = (e) => {
    e.preventDefault();
    setSearchInput(e.target.value);
    clearTimeout(timeoutId);
    const newTimeoutId = setTimeout(() => {
      if (e.target.value !== "") {
        handleInputOnChange(e.target.value);
      }else {
        setUsersOutput([])
      }
    }, 500);
    setTimeoutId(newTimeoutId);
  };

  async function handleInputOnChange(value) {
    const userId = await getUserId()
    const body = { Value: value, userId: userId};
    setUsersOutput(await searchInputHandler(search + "Users", body));
  }

  const handleSearch = () => {
    onSearch(searchInput);
  };

  const handlePost = () => {
    onPost(searchInput);
    setSearchInput("");
  };
  const showUser = (userId) => {
    navigate("/profile?id=" + userId);
    setSearchInput("")
    setUsersOutput([])
    setPostsOutput([])
}

const displayMessage = (userId) => {
  setShowMessages(false);
  setOpenMessageUserId(userId);
};

  return (
    <div>
      <input
        type="search"
        style={{
          padding: "8px 10px",
          width: 250,
          marginLeft: "55px",
          position: "relative",
          top: -3,
        }}
        placeholder={defaultText}
        onChange={handleChange}
        value={searchInput}
      />
      {onSearch && (
        <button
          onClick={handleSearch}
          className="searchBar-button"
          style={{
            backgroundColor: "transparent",
            border: "1px solid lightgray",
            height: 36,
            width: 36,
            textAlign: "center",
            cursor: "pointer",
            fontSize: 18,
            position: "relative",
            top: -1,
          }}
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
      )}
      {onPost && (
        <button onClick={handlePost} className="searchBar-button">
          Post
        </button>
      )}
      {usersOutput.length > 0 && (
        <div 
          ref={resultsRef}
          style={{
            position:"absolute",
            width: "300px",
            left: "80px",
            boxShadow: "3px 3px 5px #7e8185",
            fontSize: "14px",
            zIndex: 1
          }}
        >
          {usersOutput.map((user) => (
            <div key={user.UserId} onClick={() => {
              if (message) {
                displayMessage(user.UserId)
              }else {
                showUser(user.UserId)
              }
            }}
              style={{
                height:"40px",
                display: "flex",
                alignItems: "center",
                backgroundColor: "white",
                borderBottom: "1px solid lightblue",
                cursor: "pointer"
                
              }}
            >
              {user.UserImg !== "" ? <img 
                src={user.FirstName != "" ? window.location.protocol + "//" + window.location.hostname + ":3001/" + user.UserImg:
                window.location.protocol + "//" + window.location.hostname + ":3001/" + user.UserImg} 
                alt="User Icon" 
                style={{
                  height:"30px",
                  marginLeft: "5px",
                  marginRight: "20px"
                }}/>
              :
              <FontAwesomeIcon icon={faCircleUser} 
              style={{
                height: "30px",
                marginRight: "20px",
                marginLeft: "5px"
              }} />}
              <span>{user.FirstName != "" ? user.FirstName + " " + user.LastName + " " + "(" + user.Nickname + ")" : user.Nickname}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


export default SearchBar;
