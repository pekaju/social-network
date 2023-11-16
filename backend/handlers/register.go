package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"social-network/pkg"
	"social-network/pkg/db/sqlite"
	"time"

	uuid "github.com/google/uuid"
)

func RegisterHandler(w http.ResponseWriter, r *http.Request) {
	var user pkg.User
	//body, _ := ioutil.ReadAll(r.Body)
	//fmt.Println("Raw Request Body:", string(body))
	// Decode the request body
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		http.Error(w, "Error decoding JSON", http.StatusBadRequest)
		return
	}
	// Generate a new UUID for the user ID
	userID := uuid.New().String()

	// Add the user to the database
	if err := sqlite.AddNewUser(userID, user); err != nil {
		http.Error(w, "Error adding user", http.StatusInternalServerError)
		return
	}
	cookieId := sqlite.AddNewCookie(userID)
	resp := make(map[string]string)
	resp["Name"] = "sessionId"
	resp["Value"] = cookieId
	jsonResp, err := json.Marshal(resp)
	if err != nil {
		fmt.Println("Error happened in JSON marshal. Err: ", err)
	}
	w.Write(jsonResp)
	return
}
func AddUsernameHandler(w http.ResponseWriter, r *http.Request) {
	type Username struct {
		Nickname string `json:"nickname"`
		UserId   string `json:"UserId"`
	}
	usrname := Username{}
	err := json.NewDecoder(r.Body).Decode(&usrname)
	if err != nil {
		http.Error(w, "Error decoding username JSON", http.StatusBadRequest)
		return
	}
	if err := sqlite.AddUsername(usrname.Nickname, usrname.UserId); err != nil {
		http.Error(w, "Error adding username", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}

func AddAvatarHandler(w http.ResponseWriter, r *http.Request) {
	// Parse the multipart form data
	err := r.ParseMultipartForm(10 << 20) // Limit the maximum file size to 10MB
	if err != nil {
		fmt.Println("error parsing muulti", err)
		http.Error(w, "Error parsing multipart form data", http.StatusBadRequest)
		return
	}

	// Get the user ID from the request
	userID := r.FormValue("UserId")

	// Get the uploaded file
	file, handler, err := r.FormFile("avatar")
	if err != nil {
		fmt.Println("error in first part")
		http.Error(w, "Error retrieving uploaded file", http.StatusBadRequest)
		return
	}
	defer file.Close()
	avatarFileName := fmt.Sprintf("%s_%d%s", userID, time.Now().Unix(), filepath.Ext(handler.Filename))
	avatarFilePath := filepath.Join("files", avatarFileName)
	// Create a new file in the desired location
	avatarFile, err := os.Create(avatarFilePath)
	if err != nil {
		http.Error(w, "Error creating avatar file", http.StatusInternalServerError)
		return
	}
	defer avatarFile.Close()

	// Copy the uploaded file data to the new file
	_, err = io.Copy(avatarFile, file)
	if err != nil {
		http.Error(w, "Error copying file data", http.StatusInternalServerError)
		return
	}

	// Save the avatar file path in your database or perform any additional processing
	if err := sqlite.AddAvatar(userID, avatarFilePath); err != nil {
		http.Error(w, "Error adding avatar", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func AddAboutmeHandler(w http.ResponseWriter, r *http.Request) {
	type Aboutme struct {
		Description string `json:"Description"`
		UserId      string `json:"UserId"`
	}
	aboutme := Aboutme{}
	err := json.NewDecoder(r.Body).Decode(&aboutme)
	if err != nil {
		http.Error(w, "Error decoding aboutme JSON", http.StatusBadRequest)
		return
	}
	if err := sqlite.AddAboutme(aboutme.Description, aboutme.UserId); err != nil {
		http.Error(w, "Error adding aboutme", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}

func EmailAvailableHandler(w http.ResponseWriter, r *http.Request) {
	type Email struct {
		Email string `json:"Email"`
	}
	email := Email{}
	err := json.NewDecoder(r.Body).Decode(&email)
	if err != nil {
		http.Error(w, "Error decoding email JSON", http.StatusBadRequest)
		return
	}
	if err := sqlite.EmailAvailable(email.Email); err != nil {
		http.Error(w, "Email exists", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}
