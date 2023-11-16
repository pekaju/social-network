import React, {useEffect, useState} from "react";
import ProfileCard from "../components/profileComponents/ProfileCard";
import { sendRequest, getUserId } from "../data/getData";
import "./Followers.css"

export default function Followers() {


    const [followers, setFollowers] = useState([])
    const [followings, setFollowings] = useState([])

    useEffect(() => {
        generateData()
    }, [])

    const generateData = async () => {
        const userId = await getUserId()
        await sendRequest("userFollowings", "POST", JSON.stringify({"userID": userId})).then(d => setFollowings(d))
        await sendRequest("userFollowers", "POST", JSON.stringify({"userID": userId})).then(d => setFollowers(d))

      //  await getUserFollowers(userId).then(d => setFollowers(d))
      //  await getUserFollowings(userId).then(d => setFollowings(d))
    }

    const generateProfiles = (data) => {
        let result = []
        for (let i = 0; i < data.length; i++) {
            result.push(<ProfileCard key={i} profileData={data[i]}/>)
        }
        return result
    }

    return (
        <div id="followings-container">
            <div id="my-followings">
                <h2 style={{marginLeft:40, marginTop:30, marginBottom:10}}>My followings</h2>
                <div id="my-followings-list">
                    {followings.length === 0 ? <p style={{color:"gray", fontStyle:"italic", marginLeft:40}}>You don't follow anyone</p>
                    :
                    generateProfiles(followings)}
                </div>
            </div>
            <div id="my-followers">
                <p style={{borderBottom:"1px solid lightgray"}}></p>
                <h2 style={{marginLeft:40, marginTop:30, marginBottom:10}}>Your followers</h2>
                <div id="my-followers-list">
                    {followers.length === 0 ? <p style={{color:"gray", fontStyle:"italic", marginLeft:40}}>Seems that you're not very interesting, no one follows you</p>
                    :
                    generateProfiles(followers)}
                </div>
            </div>
        </div>
    )
}