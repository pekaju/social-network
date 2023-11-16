import React from "react";
import "../Components.css"
import { useNavigate } from "react-router-dom";

export default function ProfileCard({profileData}) {

    const navigate = useNavigate()

    const goToProfile = () => {
        navigate("/profile?id=" + profileData.Id)
    }

    return (
        <div className="profile-card" onClick={goToProfile}>
            <div className="profile-card-img">
                <div className="profile-card-img-inner">
                    <img src={(profileData.image === "" ? "img/user.png" : window.location.protocol + "//" + window.location.hostname + ":3001/" + profileData.image)} alt="profile-img" height="110" />
                </div>
            </div>
            <p className="profile-card-name">{profileData.first_name + " " + profileData.last_name}</p>
        </div>
    )
}