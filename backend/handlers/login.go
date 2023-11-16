package handlers

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"social-network/pkg/db/sqlite"
)

type loginResponse struct {
	Message string `json:"message"`
}

var (
	ErrUserNotFound      = errors.New("user not found")
	ErrIncorrectPassword = errors.New("incorrect password")
)

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	type loginUser struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	var user loginUser
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		http.Error(w, "Error decoding JSON", http.StatusBadRequest)
		return
	}

	err2, userId := sqlite.Login(user.Email, user.Password)
	if err2 != nil {
		// Handle different error cases
		var status int
		var message string

		switch err2 {
		case ErrUserNotFound:
			status = http.StatusNotFound
			message = "User not found"
		case ErrIncorrectPassword:
			status = http.StatusUnauthorized
			message = "Incorrect password"
		default:
			status = http.StatusInternalServerError
			message = "Internal server error"
		}

		response := loginResponse{
			Message: message,
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(status)
		json.NewEncoder(w).Encode(response)
		return
	}
	cookieId := sqlite.AddNewCookie(userId)

	// Login successful
	w.WriteHeader(http.StatusOK)
	resp := make(map[string]string)
	resp["Name"] = "sessionId"
	resp["Value"] = cookieId
	jsonResp, err := json.Marshal(resp)
	if err != nil {
		log.Fatalf("Error happened in JSON marshal. Err: %s", err)
	}
	w.Write(jsonResp)
	return
}

func LogoutHandler(w http.ResponseWriter, r *http.Request) {
	value := r.URL.Query().Get("value")
	sqlite.Logout(value)
	w.WriteHeader(http.StatusOK)
}
