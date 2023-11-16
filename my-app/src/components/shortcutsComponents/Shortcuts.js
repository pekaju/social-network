import React, { useState, useEffect } from 'react';
import { getUserData, getUserId } from '../../data/getData';
import "../Components.css"
import Shortcut from './Shortcut';
import { useNavigate } from "react-router-dom";

export default function Shortcuts({hideMenu}) {

    const navigate = useNavigate()

    const [userId, setUserId] = useState("")
    const [data, setData] = useState({})
    const [dataLoaded, setDataLoaded] = useState(false)

    useEffect(() => {
        async function getUserIdData() {
            await getUserId().then(d => {
                setUserId(d)
            })
        }
        getUserIdData()
    }, [])

    // useEffect is used to fetch user data and save it to state
    useEffect(() => {
        async function getData() {
            await getUserData(userId).then(d => {
                setData(d)
                setDataLoaded(true)
            })
        }
        if (userId !== "") {
            getData()
        }
    }, [userId])

    const goToProfile = () => {
        hideMenu()
        navigate("/profile?id=" + data.Id)
    }

    const goToFeed = () => {
        hideMenu()
        navigate("/feed")
    }

    const goToFollowers = () => {
        hideMenu()
        navigate("/followers")
    }

    const goToGroups = () => {
        hideMenu()
        navigate("/groups")
    }


    return (
        <div className="shortcuts-list">
            {dataLoaded && <Shortcut img={(data.image === "" ? "img/user.png" : window.location.protocol + "//" + window.location.hostname + ":3001/" + data.image)} name={data.first_name + " " + data.last_name} func={goToProfile}/>}
            <Shortcut img={"img/feed.png"} name="Feed" func={goToFeed} />
            <Shortcut img={"img/followers.png"} name="Followers" func={goToFollowers} />
            <Shortcut img={"img/groups.png"} name="Groups" func={goToGroups} />
        </div>
    )
}