import React, {useState, useEffect} from 'react';
import { useSearchParams } from 'react-router-dom';
import GroupCardSmall from '../components/groupComponents/GroupCardSmall';
import ProfileCardSmall from '../components/profileComponents/ProfileCardSmall';
import UserDataField from '../components/profileComponents/UserDataField';
import { checkIfUserIsFollowed, followUser, getPosts, getUserData, getUserId, unfollowUser, sendRequest } from '../data/getData';
import Error404 from './404';
import Post from '../components/feedComponents/Post';
import "./Profile.css"
import SinglePost from '../components/feedComponents/SinglePost';

export default function Profile({setOpenMessageUserId}) {
    const [searchParams] = useSearchParams();
    const [userId, setUserId] = useState("")
    const [data, setData] = useState({})
    const [dataLoaded, setDataLoaded] = useState(false)
    const [userGroups, setUserGroups] = useState([])
    const [userFollowers, setUserFollowers] = useState([])
    const [userFollowings, setUserFollowings] = useState([])
    const [userPosts, setUserPosts] = useState([])
    const [displayPost, setDisplayPost] = useState([false, {}]);
    const [userIsFollowed, setUserIsFollowed] = useState(false)
    const [showButtons, setShowButtons] = useState(true)
    const [refreshId, setRefreshId] = useState(0);

    useEffect(() => {
        setUserId(searchParams.get("id"))
        document.getElementById("main-center").scrollTop = 0
    }, [searchParams.get("id")])

    // useEffect is used to fetch user data and save it to state
    useEffect(() => {
        async function getData() {
            await getUserData(userId).then(d => {
                setData(d)
                setDataLoaded(true)
            })
            // hide buttons when user is on own profile
            let currentUserId = await getUserId()
            if (currentUserId === userId) {
                setShowButtons(false)
            } else {
                setShowButtons(true)
            }
            await checkIfUserIsFollowed(userId).then(d => setUserIsFollowed(d))
            await sendRequest("userGroups", "POST", JSON.stringify({"userID": userId})).then(d => setUserGroups(d))
            await sendRequest("userFollowers", "POST", JSON.stringify({"userID": userId})).then(d => setUserFollowers(d))
            await sendRequest("userFollowings", "POST", JSON.stringify({"userID": userId})).then(d => setUserFollowings(d))
            await getUserPosts(userId)
            
        }
        if (userId !== "") {
            getData()
        }
    }, [userId, refreshId])

    async function getUserPosts(userId) {
        await getPosts("userFeed", userId).then((d) => {
            let userPostsData = d.filter(post => post.userId === userId)
            userPostsData.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
            setUserPosts(userPostsData);
        });
      }

    const generateGroups = (data) => {
        let result = []
        for (let i = 0; i < data.length; i++) {
            result.push(<GroupCardSmall key={i} groupData={data[i]}/>)
        }
        if (result.length === 0) {
            return <div style={{fontStyle:"italic", color:"gray", marginLeft:20, fontSize:14}}>No groups found</div>
        }
        return result.slice(0, 9)
    }

    const generateFollowers = (data) => {
        let result = []
        for (let i = 0; i < data.length; i++) {
            result.push(<ProfileCardSmall key={i} profileData={data[i]}/>)
        }
        if (result.length === 0) {
            return <div style={{fontStyle:"italic", color:"gray", marginLeft:20, fontSize:14}}>No followers found</div>
        }
        return result.slice(0, 16)
    }

    const generateFollowings = (data) => {
        let result = []
        for (let i = 0; i < data.length; i++) {
            result.push(<ProfileCardSmall key={i} profileData={data[i]}/>)
        }
        if (result.length === 0) {
            return <div style={{fontStyle:"italic", color:"gray", marginLeft:20, fontSize:14}}>No followings found</div>
        }
        return result.slice(0, 16)
    }

    const generatePosts = (data) => {
        let r = [];
        for (let i = 0; i < data.length; i++) {
          r.push(<Post key={i+ "-" + refreshId} data={data[i]} setDisplayPost={setDisplayPost} refresh={refresh}/>);
        }
        if (r.length === 0) {
            return <div style={{fontStyle:"italic", color:"gray", marginLeft:40, fontSize:14}}>No posts found</div>
        }
        return r
      }

    const handleFollow = () => {
        if (userIsFollowed) {
            unfollowUser(userId)
            setUserIsFollowed(false)
        } else {
            followUser(userId)
            setUserIsFollowed(true)
        }
    }

    function refresh() {
        setRefreshId(refreshId + 1);
      }

    return (
        <div>
            {(dataLoaded && (data.Id !== "" ?
            <div style={{width:1000, margin:"auto", minHeight:900, backgroundColor:"aliceblue", marginTop:20, marginBottom:20, paddingBottom:20}}>
                <div style={{display:"flex", height:300, padding:20, borderBottom: "1px solid lightgray", position:"relative"}}>
                    <div style={{width:200, margin:50, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden"}}>
                        <img src={process.env.PUBLIC_URL + (data.image === "" ? "img/user.png" : window.location.protocol + "//" + window.location.hostname + ":3001/" + data.image)} alt="user-img" height="200"/>
                    </div>
                    <div style={{width:660, marginTop:40, marginLeft:20}} id="user-data">
                        <h2>{data.nickname !== "" ? data.nickname : data.first_name}</h2>
                        <div style={{display:"flex"}}>
                            <div style={{width:250}}>
                                <UserDataField label="Name" data={data.first_name + " " + data.last_name} />
                                <UserDataField label="Email" data={data.email}/>
                            </div>
                            <div style={{width:250}}>
                                <UserDataField label="Followers" data={userFollowers.length}/>
                                <UserDataField label="Birthdate" data={data.date_of_birth}/>
                            </div>
                        </div> 
                        {showButtons ? <div>
                            <button id="user-message-btn" onClick={() => setOpenMessageUserId(data.Id)}>Message</button>
                            <button id="user-follow-btn" onClick={handleFollow}>{userIsFollowed? "Unfollow" : "+ Follow"}</button>
                        </div>
                        : null}
                    </div>
                </div>
                <div id="user-bio">
                    <div style={{marginLeft:30, marginTop:20}}>
                        <h3>Bio</h3>
                        <p>{data.about_me}</p>
                    </div>
                </div>
                <div id="user-followings">
                    <h3 style={{marginLeft:20}}>Followings</h3>
                    <div id="user-followings-list">
                        {generateFollowings(userFollowings)}
                    </div>
                </div>
                <div id="user-followers">
                    <h3 style={{marginLeft:20}}>Followers</h3>
                    <div id="user-followers-list">
                        {generateFollowers(userFollowers)}
                    </div>
                </div>
                <div id="user-groups">
                    <h3 style={{marginLeft:20}}>Groups</h3>
                    <div id="user-groups-list">
                        {generateGroups(userGroups)}
                    </div>
                </div>
                <div id="user-posts">
                    <h3 style={{marginLeft:20}}>User Posts</h3>
                    <div id="user-posts-list">
                        {generatePosts(userPosts)}
                    </div>
                </div>
                {displayPost[0] === true && <SinglePost data={displayPost[1]} setDisplayPost={setDisplayPost} refresh={refresh}/>}
            </div>
            : <Error404 />))}
        </div>
    )
}