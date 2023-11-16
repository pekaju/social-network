import React from "react";
import "../Components.css"
import { useNavigate } from "react-router-dom";

export default function GroupCard({groupData}) {

    const navigate = useNavigate()

    const goToGroup = () => {
        navigate("/group?id=" + groupData.group_id)
    }

    return (
        <div className="group-card" onClick={goToGroup}>
            <div className="group-card-img">
                <div className="group-card-img-inner">
                    <img src={window.location.protocol + "//" + window.location.hostname + ":3001/" + groupData.image} alt="group-img" height="150" />
                </div>
            </div>
            <p className="group-card-name">{groupData.group_name}</p>
            <p className="group-card-description">{groupData.description}</p>
        </div>
    )
}