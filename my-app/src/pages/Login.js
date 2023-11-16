import React, {useState} from "react";
import "./Login.css"


export default function Login({setIsLoggedIn}) {

    const [showLoginError, setShowLoginError] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    function handleLogin() {
        fetch("http://localhost:3001/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({Email: email, Password: password}),
        })
        .then(async (response) => {
        if (response.ok) {
            let data = await response.json()
            const name = data.Name
            const value = data.Value
            document.cookie = `${name}=${value}`
            setIsLoggedIn(true)

        } else {
            setShowLoginError(true)
        }
        })
        .catch((error) => {
            console.log("ERROR: ", error)
            setShowLoginError(true)
        });  
    }

    function onEnter(event) {
        if (event.keyCode === 13) {
          handleLogin()
        }
    }

    return (
        <div id="login-container">
            <div id="login-label">
                <h2>Social-network</h2>
                <h3>Login</h3>
            </div>
            <div>
                <div className="login-field">
                    <label id="username-label" 
                           className="login-input-label" 
                           htmlFor="email">
                            Email
                    </label>
                    <input id="email" 
                           className="login-inputs" 
                           type="text" 
                           onChange={(e) => setEmail(e.target.value)} 
                           onKeyDown={(e) => onEnter(e)}>
                    </input>
                </div>
                <div className="login-field">
                    <label id="password-label" 
                           className="login-input-label" 
                           htmlFor="password">
                            Password
                    </label>
                    <input id="password" 
                           className="login-inputs" 
                           type="password" 
                           onChange={(e) => setPassword(e.target.value)}
                           onKeyDown={(e) => onEnter(e)}>
                    </input>
                </div>
                {showLoginError && <p id="login-error">Error: Invalid login credentials!</p>}
                <button id="login-btn" 
                        onClick={handleLogin}>
                            Login
                </button>
            </div>
        </div>
    )
}