import React, { useState, useContext } from "react";
import "./Landing.css"
import Login from "./Login";
import Register from "./Register.js";
import MyContext from "../MyContext";

export default function Landing({setIsLoggedIn}) {
    
    const { freshlyRegistered, setIsFreshlyRegistered } = useContext(MyContext);

    const [showLogin, setShowLogin] = useState(false)
    const [showRegister, setShowRegister] = useState(false)

    return (
    <div>
        <div id="landing-header" style={{display: "flex"}}>
            <div id="landing-label">
                SOCIAL_NETWORK
            </div>
            <div>
                <button className="landing-button" onClick={() => {
                    setShowRegister(!showRegister)
                    if (showLogin) {
                        setShowLogin(false);
                    }
                    }}>Register</button>
                <button className="landing-button" onClick={() => {
                    setShowLogin(!showLogin)
                    if(showRegister) {
                        setShowRegister(false);
                    }
                    }}>Login</button>
            </div>
        </div>
        <div id="landing-main" style={{position:"relative", overflow:"scroll"}}>
            <div id="landing-bg"></div>
            <div style={{fontSize:28, marginTop:50, marginLeft:100, backgroundColor: "#ffffffa6", padding:40, minHeight:"100vh", overflow:"scroll"}}>
                <span style={{fontWeight:"bold", color:"green",fontSize:40}}>Connect</span> <span style={{fontWeight:500, color:"#0565de", fontSize:57}}>Share</span> <span style={{fontSize:47, fontWeight:600, color:"red"}}>Thrive</span><span style={{fontStyle:"italic", fontWeight:600}}> - Unleash the Power of Social Networking!</span>
                <p style={{width:950, marginTop: "10vh", marginLeft:40}}><strong>Connect. Share. Inspire.</strong> Join our vibrant social-network community and redefine the way you connect with others. 
                Discover new followerships, share your passions, and be inspired by diverse perspectives. 
                With a user-friendly interface and advanced features, our platform offers an immersive social experience tailored to your needs. 
                Connect with like-minded individuals, foster meaningful connections, and unleash your creativity. 
                Experience the power of social networking today!</p>
            </div>
            {showLogin && <div style={{position:"absolute", width:"100vw", backdropFilter:"blur(3px)", top:0}}><Login setIsLoggedIn={setIsLoggedIn} /></div>}
            {showRegister && <div style={{position: "absolute", width:"100vw", backdropFilter:"blur(3px)", top:10}}> < Register setIsLoggedIn={setIsLoggedIn} setIsFreshlyRegistered={setIsFreshlyRegistered}/> </div>}
        </div>
    </div>
    )
}