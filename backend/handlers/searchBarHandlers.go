package handlers

import (
	"net/http"
	"encoding/json"
	"social-network/pkg/db/sqlite"
	"fmt"
)

func SearchUsersHandler(w http.ResponseWriter, r *http.Request) {
	type Value struct {
		Value string `json:"Value"`
		UserId string `json:"UserId"`
	}
	var value Value
	err := json.NewDecoder(r.Body).Decode(&value)
	if err != nil {
		http.Error(w, "Error decoding user search JSON", http.StatusBadRequest)
		return
	}
	users := sqlite.SearchUsersFromDatabase(value.Value, value.UserId)
	fmt.Println(users)
	jsonData, err := json.Marshal(users)
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonData)
}
func SearchPostsHandler(w http.ResponseWriter, r *http.Request) {
	type Value struct {
		Value string `json:"Value"`
	}
	var value Value
	err := json.NewDecoder(r.Body).Decode(&value)
	if err != nil {
		http.Error(w, "Error decoding user search JSON", http.StatusBadRequest)
		return
	}
	jsonData, err := json.Marshal(value)
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonData)
}