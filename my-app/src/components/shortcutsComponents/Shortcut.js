import React from "react";

export default function Shortcut({img, name, func}) {
    return (
        <div className="shortcut-item" onClick={func}>
            <div style={{width:40,padding:5, display:"flex", justifyContent:"center", top:2, position:"relative", overflow:"hidden", borderRadius:"50%"}}>
                <img src={img} height="30"/>
            </div>
            <div style={{width:260, marginTop:10, fontWeight:600}}>
                <div style={{fontWeight:600}}>{name}</div>
            </div>
        </div>
    )
}