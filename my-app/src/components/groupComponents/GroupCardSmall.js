import React from "react";
import "../Components.css"
import { useNavigate } from "react-router-dom";

export default function GroupCardSmall({groupData}) {

    const navigate = useNavigate()

    const goToGroup = () => {
        navigate("/group?id=" + groupData.group_id)
    }

    return (
        <div className="group-card-small" onClick={goToGroup}>
            <div className="group-card-small-img">
                <div className="group-card-small-img-inner">
                    <img src={window.location.protocol + "//" + window.location.hostname + ":3001/" + groupData.image} alt="group-img" height="70" />
                </div>
            </div>
            <div>
                <p className="group-card-small-name">{groupData.group_name}</p>
                <p className="group-card-small-description">{groupData.description}</p>
            </div>
        </div>
    )
}