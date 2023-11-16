import React from "react";

export default function MessageRow({data}) {

    return (
        <div className="message-list-item">
            <div style={{width:40,padding:5, display:"flex", justifyContent:"center", top:2, position:"relative", overflow:"hidden", borderRadius:"50%", zIndex: -10}}>
                <img src={window.location.protocol + "//" + window.location.hostname + ":3001/" + data.userImg} height="25"/>
            </div>
            <div style={{width:260}}>
                <div style={{fontWeight:600}}>{data.from}</div>
                <div className={"message-list-message" + (data.unread ? " unread" : "")}>{(data.direction === "outbound" ? "Me: ": "") + data.message}</div>
            </div>
        </div>
    )
}