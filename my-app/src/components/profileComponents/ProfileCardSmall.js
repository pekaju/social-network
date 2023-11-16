import React from "react";
import "../Components.css"
import { useNavigate } from "react-router-dom";

export default function ProfileCardSmall({profileData}) {

    const navigate = useNavigate()

    const goToProfile = () => {
        navigate("/profile?id=" + profileData.Id)
    }

    return (
        <div className="profile-card-small" onClick={goToProfile}>
            <div className="profile-card-small-img">
                <div className="profile-card-small-img-inner">
                    <img src={(profileData.image === "" ? "img/user.png" : window.location.protocol + "//" + window.location.hostname + ":3001/" + profileData.image)} alt="profile-img" height="70" />
                </div>
            </div>
            <p className="profile-card-small-name">{profileData.first_name + " " + profileData.last_name}</p>
        </div>
    )
}