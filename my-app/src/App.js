import React, { useState, useEffect } from "react";
import "./App.css";
import Landing from "./pages/Landing";
import MyContext from "./MyContext";
import WebSocketConnectedApp from "./components/messagesComponents/WebSocketConnectedApp"

function App({ view }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [freshlyRegistered, setIsFreshlyRegistered] = useState(false);
  const webSocketURL = "ws://localhost:3001/ws";

  useEffect(() => {
    if (document.cookie) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <div className="App">
      <MyContext.Provider value={{ freshlyRegistered, setIsFreshlyRegistered }}>
        {!isLoggedIn ? (
          <Landing setIsLoggedIn={setIsLoggedIn} />
        ) : (
          <WebSocketConnectedApp
            view={view}
            freshlyRegistered={freshlyRegistered}
            setIsFreshlyRegistered={setIsFreshlyRegistered}
            webSocketURL={webSocketURL}
          />
        )}
      </MyContext.Provider>
    </div>
  );
}

export default App;
