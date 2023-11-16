import React, { useState, useEffect } from "react";
import GroupCard from "../components/groupComponents/GroupCard";
import NewGroup from "../components/groupComponents/NewGroup";
import { getUserId, sendRequest} from "../data/getData";
import "./Groups.css"

export default function Groups() {

    const [userGroups, setUserGroups] = useState([])
    const [otherGroups, setOtherGroups] = useState([])
    const [showNewGroup, setShowNewGroup] = useState(false)

    useEffect(() => {
        getData()
    }, [])

    const generateGroups = (data) => {
        let result = []
        for (let i = 0; i < data.length; i++) {
            result.push(<GroupCard key={i} groupData={data[i]}/>)
        }
        if (result.length === 0) {
            return <div style={{fontStyle:"italic", color:"gray", marginLeft:30, padding:10}}>You haven't followed any groups</div>
        }
        return result
    }

    const getData = async() => {
        const userId = await getUserId()
        await sendRequest("userGroups", "POST", JSON.stringify({"userID": userId})).then(d => setUserGroups(d))
        await sendRequest("otherGroups", "POST", JSON.stringify({"userID": userId})).then(d => setOtherGroups(d))

      //  await getUserGroups(userId).then(d => setUserGroups(d))
        //await getOtherGroups(userId).then(d => setOtherGroups(d))
    }
    
    const closeNewGroupPopup = () => {
        setShowNewGroup(false)
    }

    return (
        <div>
             <div id="groups-container">
                <button id="create-group-button" onClick={() => setShowNewGroup(true)}>+ New group</button>
                <div id="my-groups">
                    <h2 style={{marginLeft:40, marginTop:30, marginBottom:10}}>My groups</h2>
                    <div id="my-groups-list">
                        {generateGroups(userGroups)}
                    </div>
                </div>
                <div id="other-groups">
                    <p style={{borderBottom:"1px solid lightgray"}}></p>
                    <h2 style={{marginLeft:40, marginTop:30, marginBottom:10}}>Explore groups</h2>
                    <div id="other-groups-list">
                        {generateGroups(otherGroups)}
                    </div>
                </div>
            </div>
            {showNewGroup && <NewGroup close={closeNewGroupPopup} />}
        </div>
    )
}