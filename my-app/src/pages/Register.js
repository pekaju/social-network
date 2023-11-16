import React, { useState } from "react";

export default function Register({ setIsLoggedIn, setIsFreshlyRegistered }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [DOB, setDOB] = useState("");
  const [error, setError] = useState("");

  const [showRegisterError, setRegisterError] = useState(false);
  const handleRegister = async () => {
    const userData = {
      email: email,
      password: password,
      first_name: firstName,
      last_name: lastName,
      date_of_birth: DOB,
    };
    const err = await checkErrors(userData);
    if (err !== "") {
      console.log(err)
      setRegisterError(true);
      setError(err);
      return
    }

    fetch("http://localhost:3001/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then(async (response) => {
        if (response.ok) {
          let data = await response.json()
          console.log("login success")
          const name = data.Name
          const value = data.Value
          document.cookie = `${name}=${value}`
          setIsLoggedIn(true)
          setIsFreshlyRegistered(true);
        } else {
          console.log("error registering")
        }
      })
      .catch((error) => {
        console.log("ERROR", error);
      });
  };
  async function checkErrors(userData) {
    const { email, password, date_of_birth, first_name, last_name } = userData;
    try {
      if (!isValidEmail(email)) {
        return "Invalid email format";
      }
      const isEmailTaken = await isTakenEmail(email);
      if (!isEmailTaken) {
        return "Email is already taken";
      }
      if (!isValidDateOfBirth(date_of_birth)) {
        return "Invalid date of birth format. Please use DD.MM.YYYY format";
      }
      if (!isValidPassword(password)) {
        return "Password must have at least 1 capital letter, one number, and be at least 8 characters long";
      }
      if (first_name === "") {
        return "Cannot submit an empty first name";
      }
      if (last_name === "") {
        return "Cannot submit an empty last name";
      }
      return "";
    } catch (error) {
      // Handle any errors that occurred during the process
      console.log("Error during registration:", error);
    }
  }
 
  // Helper function to validate email format
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  async function isTakenEmail(email) {
    try {
      const response = await fetch("http://localhost:3001/emailAvailable", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Email: email }),
      });
      if (response.ok) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log("ERROR: ", error);
      return false;
    }
  }
  // Helper function to validate password format
  function isValidPassword(password) {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  }
  
  // Helper function to validate date of birth format
  function isValidDateOfBirth(date_of_birth) {
    const dobRegex = /^\d{2}\.\d{2}\.\d{4}$/;
    return dobRegex.test(date_of_birth);
  }
  const onEnter = (e) => {
    if (e.keyCode === 13) {
      handleRegister();
    }
  };
  return (
    <div id="register-container">
      <div id="login-label">
        <h2>Social-network</h2>
        <h3>Register</h3>
      </div>
      <div className="login-field">
        <label className="login-input-label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          className="login-inputs"
          type="text"
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => onEnter(e)}
        ></input>
      </div>
      <div className="login-field">
        <label
          id="username-label"
          className="login-input-label"
          htmlFor="first-name"
        >
          First name
        </label>
        <input
          id="first-name"
          className="login-inputs"
          type="text"
          onChange={(e) => setFirstName(e.target.value)}
          onKeyDown={(e) => onEnter(e)}
        ></input>
      </div>
      <div className="login-field">
        <label
          id="username-label"
          className="login-input-label"
          htmlFor="username"
        >
          Last name
        </label>
        <input
          id="last-name"
          className="login-inputs"
          type="text"
          onChange={(e) => setLastName(e.target.value)}
          onKeyDown={(e) => onEnter(e)}
        ></input>
      </div>
      <div className="login-field">
        <label
          id="username-label"
          className="login-input-label"
          htmlFor="date-of-birth"
        >
          Date of birth
        </label>
        <input
          id="date-of-birth"
          className="login-inputs"
          type="text"
          placeholder="E.g. DD.MM.YYYY"
          onChange={(e) => setDOB(e.target.value)}
          onKeyDown={(e) => onEnter(e)}
        ></input>
      </div>

      <div className="login-field">
        <label
          id="password-label"
          className="login-input-label"
          htmlFor="password"
        >
          Password
        </label>
        <input
          id="password"
          className="login-inputs"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => onEnter(e)}
        ></input>
      </div>
      {showRegisterError && (
        <p id="login-error">{error}</p>
      )}
      <button id="login-btn" onClick={handleRegister}>
        Register
      </button>
    </div>
  );
}
