package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"reflect"
	"social-network/pkg"
	"social-network/pkg/db/sqlite"
	"strconv"
	"strings"

	uuid "github.com/google/uuid"
)

func NewPostHandler(w http.ResponseWriter, r *http.Request) {
	// Parse the multipart form data
	err := r.ParseMultipartForm(10 << 20) // Limit the maximum file size to 10MB
	if err != nil {
		fmt.Println("error parsing muulti", err)
		http.Error(w, "Error parsing multipart form data", http.StatusBadRequest)
		return
	}
	var post pkg.Post

	// Get the group data from the request
	post.ID = r.FormValue("id")
	post.UserID = r.FormValue("userId")
	post.UserDisplayName = r.FormValue("userDisplayName")
	post.Content = r.FormValue("content")
	post.Timestamp = r.FormValue("timestamp")
	likes, _ := strconv.ParseInt(r.FormValue("likes"), 10, 64)
	post.Likes = int(likes)
	comments, _ := strconv.ParseInt(r.FormValue("comments"), 10, 64)
	post.Comments = int(comments)
	post.Type = r.FormValue("type")
	post.TargetId = r.FormValue("targetId")
	privacyId, _ := strconv.ParseInt(r.FormValue("privacyId"), 10, 64)
	post.PrivacyId = int(privacyId)
	post.AllowedUsers = r.FormValue("allowedUsers")
	new, _ := strconv.ParseInt(r.FormValue("new"), 10, 64)
	post.New = int(new)
	imageCount, _ := strconv.ParseInt(r.FormValue("imageCount"), 10, 64)

	var images []string

	for i := 0; i < int(imageCount); i++ {
		// Get the uploaded file
		file, handler, err := r.FormFile("img" + strconv.Itoa(i))
		if err != nil {
			if reflect.TypeOf(r.FormValue("img"+strconv.Itoa(i))).Kind() == reflect.String {
				images = append(images, r.FormValue("img"+strconv.Itoa(i)))
				continue
			}
			http.Error(w, "Error retrieving uploaded file", http.StatusBadRequest)
			return
		}
		defer file.Close()
		filenameInput := post.ID + "_" + strconv.Itoa(i)
		filename := fmt.Sprintf("%s%s", filenameInput, filepath.Ext(handler.Filename))
		postFilePath := filepath.Join("files", "posts", filename)
		// Create a new file in the desired location
		postFile, err := os.Create(postFilePath)
		if err != nil {
			fmt.Println(err)
			http.Error(w, "Error creating post file", http.StatusInternalServerError)
			return
		}
		defer postFile.Close()

		// Copy the uploaded file data to the new file
		_, err = io.Copy(postFile, file)
		if err != nil {
			fmt.Println(err)
			http.Error(w, "Error copying file data", http.StatusInternalServerError)
			return
		}
		images = append(images, postFilePath)
	}

	post.Images = strings.Join(images, "|")
	// insert into db
	err = sqlite.AddNewPost(post)
	if err != nil {
		http.Error(w, "Error writing posts to file", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func GetPosts(w http.ResponseWriter, r *http.Request) {
	filters := pkg.PostFilter{}
	err := json.NewDecoder(r.Body).Decode(&filters)
	posts, err := sqlite.GetAllPosts(filters)
	if err != nil {
		fmt.Println(err)
	}
	jsonData, err := json.Marshal(posts)
	if err != nil {
		fmt.Println(err)
		return
	}
	// Set the Content-Type header to application/json
	w.Header().Set("Content-Type", "application/json")

	// Write the JSON response
	w.Write(jsonData)
}

func ProfileOptionsHandler(w http.ResponseWriter, r *http.Request) {
	userID := pkg.UserID{}
	err := json.NewDecoder(r.Body).Decode(&userID)
	if err != nil {
		fmt.Println(err)
	}
	firstName := sqlite.GetProfileOptionsFromDatabase(userID.ID)
	jsonResp, err := json.Marshal(firstName)
	if err != nil {
		fmt.Println(err)
	} else {
		w.Write(jsonResp)
	}
}

func ChangePublicStatusHandler(w http.ResponseWriter, r *http.Request) {
	type Temp struct {
		UserId string `json:"userId"`
		Status bool   `json:"status"`
	}
	var temp Temp

	err := json.NewDecoder(r.Body).Decode(&temp)
	if err != nil {
		fmt.Println(err)
	}
	result := sqlite.ChangePublicStatus(temp.UserId, temp.Status)
	jsonData, err := json.Marshal(result)
	if err != nil {
		fmt.Println(err)
	}
	// Set the Content-Type header to application/json
	w.Header().Set("Content-Type", "application/json")

	// Write the JSON response
	w.Write(jsonData)
}

func GroupDataHandler(w http.ResponseWriter, r *http.Request) {
	groupId := r.URL.Query().Get("groupId")
	groupData := sqlite.GetGroupData(groupId)
	jsonData, err := json.Marshal(groupData)
	if err != nil {
		fmt.Println(err)
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonData)
}

func GetUserData(w http.ResponseWriter, r *http.Request) {
	myId := r.URL.Query().Get("myId")
	userId := r.URL.Query().Get("userId")
	rows, err := sqlite.Db.Query(`select User_Id, Email, First_name, Last_name, Date_of_birth, Image, Nickname, About_me, Followers, Public from users where User_id = ?`, userId)
	user := &pkg.User{}

	defer rows.Close()

	if err != nil {
		fmt.Println(err)
	}
	found := false
	for rows.Next() {
		found = true
		rows.Scan(&user.Id, &user.Email, &user.FirstName, &user.LastName, &user.DateOfBirth, &user.Image, &user.Nickname, &user.AboutMe, &user.Followers, &user.Public)
	}
	if !found {
		// Return a JSON error response for "wrong id"
		errorMsg := map[string]string{"error": "no user found"}
		jsonData, _ := json.Marshal(errorMsg)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusAccepted)
		w.Write(jsonData)
		return
	}
	// Check for follow request notification
	var notificationCount int
	err = sqlite.Db.QueryRow(`SELECT COUNT(*) FROM notifications WHERE toUser = ? AND fromId = ? AND type = 'follow_request'`, userId, myId).Scan(&notificationCount)
	if err != nil {
		fmt.Println(err)
	}

	if notificationCount > 0 {
		user.FollowRequest = true
	}

	jsonData, err := json.Marshal(user)
	if err != nil {
		fmt.Println(err)
	}

	// remove password key
	var m map[string]json.RawMessage
	if err := json.Unmarshal([]byte(jsonData), &m); err != nil {
		panic(err)
	}

	if _, exists := m["password"]; exists {
		delete(m, "password")
		outputData, err := json.Marshal(m)
		if err != nil {
			panic(err)
		}
		jsonData = outputData
	}

	// Set the Content-Type header to application/json
	w.Header().Set("Content-Type", "application/json")

	// Write the JSON response
	w.Write(jsonData)
}

func GetCommentsHandler(w http.ResponseWriter, r *http.Request) {
	postId := r.URL.Query().Get("id")
	comments := sqlite.GetComments(postId)
	jsonData, err := json.Marshal(comments)
	if err != nil {
		fmt.Println(err)
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonData)
}

func AddCommentHandler(w http.ResponseWriter, r *http.Request) {
	// Parse the multipart form data
	err := r.ParseMultipartForm(10 << 20) // Limit the maximum file size to 10MB
	if err != nil {
		fmt.Println("error parsing muulti", err)
		http.Error(w, "Error parsing multipart form data", http.StatusBadRequest)
		return
	}
	comment := pkg.NewComment{}
	comment.Comment = r.FormValue("comment")
	comment.UserId = r.FormValue("userId")
	comment.PostId = r.FormValue("postId")
	likesCount, _ := strconv.ParseInt(r.FormValue("likes"), 10, 64)
	comment.Likes = int(likesCount)
	fileTest, _, _ := r.FormFile("image")
	if fileTest == nil {
		comment.Image = ""
	} else {
		// Get the uploaded file
		file, handler, err := r.FormFile("image")
		if err != nil {
			http.Error(w, "Error retrieving uploaded file", http.StatusBadRequest)
			return
		}
		defer file.Close()
		filenameInput := uuid.New().String()
		filename := fmt.Sprintf("%s%s", filenameInput, filepath.Ext(handler.Filename))
		commentFilePath := filepath.Join("files", "comments", filename)
		// Create a new file in the desired location
		postFile, err := os.Create(commentFilePath)
		if err != nil {
			fmt.Println(err)
			http.Error(w, "Error creating post file", http.StatusInternalServerError)
			return
		}
		defer postFile.Close()

		// Copy the uploaded file data to the new file
		_, err = io.Copy(postFile, file)
		if err != nil {
			fmt.Println(err)
			http.Error(w, "Error copying file data", http.StatusInternalServerError)
			return
		}
		comment.Image = commentFilePath
	}

	if err := sqlite.PushComment(comment); err != nil {
		http.Error(w, "Error writing posts to file", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}

func GetLastMessagesHandler(w http.ResponseWriter, r *http.Request) {
	userId := r.URL.Query().Get("userId")
	messages := sqlite.GetLastMessages(userId)
	jsonData, err := json.Marshal(messages)
	if err != nil {
		fmt.Println(err)
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonData)
}

func GetLastGroupMessagesHandler(w http.ResponseWriter, r *http.Request) {
	userId := r.URL.Query().Get("userId")
	messages := sqlite.GetLastGroupMessages(userId)
	jsonData, err := json.Marshal(messages)
	if err != nil {
		fmt.Println(err)
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonData)
}

func GetUserIdHandler(w http.ResponseWriter, r *http.Request) {
	value := r.URL.Query().Get("value")
	userId := sqlite.GetUserId(value)
	jsonData, err := json.Marshal(userId)
	if err != nil {
		fmt.Println(err)
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonData)
}

func GetGroupsHandler(w http.ResponseWriter, r *http.Request) {
	groups := sqlite.GetGroups()
	jsonData, err := json.Marshal(groups)
	if err != nil {
		fmt.Println(err)
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonData)
}

func GetUserFollowedGroups(w http.ResponseWriter, r *http.Request) {
	userID := pkg.UserID{}
	err := json.NewDecoder(r.Body).Decode(&userID)
	if err != nil {
		fmt.Println(err)
	}
	groups := sqlite.GetUserFollowedGroups(userID.ID)
	jsonData, err := json.Marshal(groups)
	if err != nil {
		fmt.Println(err)
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonData)
}

func GetUserUnfollowedGroups(w http.ResponseWriter, r *http.Request) {
	userID := pkg.UserID{}
	err := json.NewDecoder(r.Body).Decode(&userID)
	if err != nil {
		fmt.Println(err)
	}
	groups := sqlite.GetUserUnfollowedGroups(userID.ID)
	jsonData, err := json.Marshal(groups)
	if err != nil {
		fmt.Println(err)
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonData)
}

func UnfollowGroupHandler(w http.ResponseWriter, r *http.Request) {
	group := pkg.GroupAction{}
	err := json.NewDecoder(r.Body).Decode(&group)
	if err != nil {
		fmt.Println(err)
	}
	sqlite.UnfollowGroup(group.UserID, group.GroupID)
	w.WriteHeader(http.StatusOK)
}

func CreateEventHandler(w http.ResponseWriter, r *http.Request) {
	event := pkg.Event{}
	err := json.NewDecoder(r.Body).Decode(&event)
	if err != nil {
		fmt.Println(err)
	}
	err = sqlite.CreateEvent(event)
	if err != nil {
		http.Error(w, "Internal Server Error: "+err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}

func GetEventsHandler(w http.ResponseWriter, r *http.Request) {
	groupId := pkg.GroupID{}
	err := json.NewDecoder(r.Body).Decode(&groupId)
	if err != nil {
		fmt.Println(err)
	}
	events := sqlite.GetEvents(groupId.ID)
	jsonData, err := json.Marshal(events)
	if err != nil {
		fmt.Println(err)
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonData)
}

func DeleteGroupHandler(w http.ResponseWriter, r *http.Request) {
	type DeleteGroupRequest struct {
		GroupID string `json:"groupId"`
	}
	var groupId DeleteGroupRequest
	err := json.NewDecoder(r.Body).Decode(&groupId)
	if err != nil {
		fmt.Println(err)
	}
	sqlite.DeleteGroup(groupId.GroupID)
	w.WriteHeader(http.StatusOK)
}

func GetUserFollowings(w http.ResponseWriter, r *http.Request) {
	userID := pkg.UserID{}
	err := json.NewDecoder(r.Body).Decode(&userID)
	if err != nil {
		fmt.Println(err)
	}
	followings := sqlite.GetUserFollowings(userID.ID)
	jsonData, err := json.Marshal(followings)
	if err != nil {
		fmt.Println(err)
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonData)
}

func GetUserFollowers(w http.ResponseWriter, r *http.Request) {
	userID := pkg.UserID{}
	err := json.NewDecoder(r.Body).Decode(&userID)
	if err != nil {
		fmt.Println(err)
	}
	followings := sqlite.GetUserFollowers(userID.ID)
	jsonData, err := json.Marshal(followings)
	if err != nil {
		fmt.Println(err)
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonData)
}

func AcceptFollowRequestHandler(w http.ResponseWriter, r *http.Request) {
	follow := pkg.FollowAction{}
	err := json.NewDecoder(r.Body).Decode(&follow)
	if err != nil {
		fmt.Println(err)
	}
	sqlite.AcceptFollowRequest(follow.FollowerID, follow.FollowedID)
	w.WriteHeader(http.StatusOK)
}

func DeleteFollowRequestHandler(w http.ResponseWriter, r *http.Request) {
	follow := pkg.FollowAction{}
	err := json.NewDecoder(r.Body).Decode(&follow)
	if err != nil {
		fmt.Println(err)
	}
	sqlite.DeleteFollowRequest(follow.FollowerID, follow.FollowedID)
	w.WriteHeader(http.StatusOK)
}

func FollowRequestHandler(w http.ResponseWriter, r *http.Request) {
	follow := pkg.FollowAction{}
	err := json.NewDecoder(r.Body).Decode(&follow)
	if err != nil {
		fmt.Println(err)
	}
	sqlite.FollowRequest(follow.FollowerID, follow.FollowedID)
	w.WriteHeader(http.StatusOK)
}

func FollowUserHandler(w http.ResponseWriter, r *http.Request) {
	follow := pkg.FollowAction{}
	err := json.NewDecoder(r.Body).Decode(&follow)
	if err != nil {
		fmt.Println(err)
	}
	sqlite.FollowUser(follow.FollowerID, follow.FollowedID)
	w.WriteHeader(http.StatusOK)
}

func UnfollowUserHandler(w http.ResponseWriter, r *http.Request) {
	follow := pkg.FollowAction{}
	err := json.NewDecoder(r.Body).Decode(&follow)
	if err != nil {
		fmt.Println(err)
	}
	sqlite.UnfollowUser(follow.FollowerID, follow.FollowedID)
	w.WriteHeader(http.StatusOK)
}

func GetGroupFollowers(w http.ResponseWriter, r *http.Request) {
	groupID := pkg.GroupID{}
	err := json.NewDecoder(r.Body).Decode(&groupID)
	if err != nil {
		fmt.Println(err)
	}
	followings := sqlite.GetGroupFollowers(groupID.ID)
	jsonData, err := json.Marshal(followings)
	if err != nil {
		fmt.Println(err)
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonData)
}

func AddGroupHandler(w http.ResponseWriter, r *http.Request) {
	// Parse the multipart form data
	err := r.ParseMultipartForm(10 << 20) // Limit the maximum file size to 10MB
	if err != nil {
		fmt.Println("error parsing muulti", err)
		http.Error(w, "Error parsing multipart form data", http.StatusBadRequest)
		return
	}

	// Get the group data from the request
	groupName := r.FormValue("groupName")
	groupDescription := r.FormValue("groupDescription")
	groupId := uuid.New().String()
	groupCreator := r.FormValue("creator")

	// Get the uploaded file
	file, handler, err := r.FormFile("groupImg")
	if err != nil {
		fmt.Println("error in first part")
		http.Error(w, "Error retrieving uploaded file", http.StatusBadRequest)
		return
	}
	defer file.Close()
	groupNameForFilename := strings.ReplaceAll(groupName, " ", "_")
	groupFileName := fmt.Sprintf("%s%s", groupNameForFilename, filepath.Ext(handler.Filename))
	groupFilePath := filepath.Join("files", "groups", groupFileName)
	// Create a new file in the desired location
	groupFile, err := os.Create(groupFilePath)
	if err != nil {
		http.Error(w, "Error creating avatar file", http.StatusInternalServerError)
		return
	}
	defer groupFile.Close()

	// Copy the uploaded file data to the new file
	_, err = io.Copy(groupFile, file)
	if err != nil {
		http.Error(w, "Error copying file data", http.StatusInternalServerError)
		return
	}

	// Save the avatar file path in your database or perform any additional processing
	if err := sqlite.AddGroup(groupId, groupName, groupDescription, groupFilePath, groupCreator); err != nil {
		http.Error(w, "Error adding avatar", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/json")
	resp := make(map[string]string)
	resp["groupId"] = groupId
	jsonResp, err := json.Marshal(resp)
	if err != nil {
		log.Fatalf("Error happened in JSON marshal. Err: %s", err)
	}
	w.Write(jsonResp)
	return
}

func AcceptGroupRequestHandler(w http.ResponseWriter, r *http.Request) {
	type Temp struct {
		UserId  string
		GroupId string
	}
	temp := Temp{}
	err := json.NewDecoder(r.Body).Decode(&temp)
	if err != nil {
		fmt.Println(err)
	}
	response := sqlite.AcceptGroupRequest(temp.UserId, temp.GroupId)
	jsonData, err := json.Marshal(response)
	if err != nil {
		fmt.Println(err)
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonData)
}

func DeleteGroupRequestHandler(w http.ResponseWriter, r *http.Request) {
	type Temp struct {
		UserId  string
		GroupId string
	}
	temp := Temp{}
	err := json.NewDecoder(r.Body).Decode(&temp)
	if err != nil {
		fmt.Println(err)
	}
	response := sqlite.DeleteGroupRequest(temp.UserId, temp.GroupId)
	jsonData, err := json.Marshal(response)
	if err != nil {
		fmt.Println(err)
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonData)
}

func AcceptGroupInvitationHandler(w http.ResponseWriter, r *http.Request) {
	type Temp struct {
		InviterId string
		InviteeId string
		GroupId   string
	}
	temp := Temp{}
	err := json.NewDecoder(r.Body).Decode(&temp)
	if err != nil {
		fmt.Println(err)
	}
	response := sqlite.AcceptGroupInvitation(temp.InviterId, temp.InviteeId, temp.GroupId)
	jsonData, err := json.Marshal(response)
	if err != nil {
		fmt.Println(err)
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonData)
}
func DeleteGroupInvitationHandler(w http.ResponseWriter, r *http.Request) {
	type Temp struct {
		InviterId string
		InviteeId string
		GroupId   string
	}
	temp := Temp{}
	err := json.NewDecoder(r.Body).Decode(&temp)
	if err != nil {
		fmt.Println(err)
	}
	response := sqlite.DeleteGroupInvitation(temp.InviterId, temp.InviteeId, temp.GroupId)
	jsonData, err := json.Marshal(response)
	if err != nil {
		fmt.Println(err)
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonData)
}

func IsGroupRequestSentHandler(w http.ResponseWriter, r *http.Request) {
	type Temp struct {
		UserId  string
		GroupId string
	}
	temp := Temp{}
	err := json.NewDecoder(r.Body).Decode(&temp)
	if err != nil {
		fmt.Println(err)
	}
	response := sqlite.IsGroupRequestSent(temp.UserId, temp.GroupId)
	jsonData, err := json.Marshal(response)
	if err != nil {
		fmt.Println(err)
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonData)
}

func HandleGoingHandler(w http.ResponseWriter, r *http.Request) {

	temp := pkg.EventGoing{}
	err := json.NewDecoder(r.Body).Decode(&temp)
	if err != nil {
		fmt.Println(err)
	}
	response := sqlite.HandleGoing(temp)
	jsonData, err := json.Marshal(response)
	if err != nil {
		fmt.Println(err)
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonData)
}

func SendGroupInviteHandler(w http.ResponseWriter, r *http.Request) {
	type Temp struct {
		UserIds []string
		GroupId string
		FromId  string
	}
	temp := Temp{}
	err := json.NewDecoder(r.Body).Decode(&temp)
	if err != nil {
		fmt.Println(err)
	}
	response := sqlite.SendGroupInvite(temp.UserIds, temp.GroupId, temp.FromId)
	jsonData, err := json.Marshal(response)
	if err != nil {
		fmt.Println(err)
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonData)
}

func SendGroupRequestHandler(w http.ResponseWriter, r *http.Request) {
	type Temp struct {
		UserId  string
		GroupId string
	}
	temp := Temp{}
	err := json.NewDecoder(r.Body).Decode(&temp)
	if err != nil {
		fmt.Println(err)
	}
	response := sqlite.SendGroupRequest(temp.UserId, temp.GroupId)
	jsonData, err := json.Marshal(response)
	if err != nil {
		fmt.Println(err)
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonData)
}

func PostLikeHandler(w http.ResponseWriter, r *http.Request) {
	like := pkg.PostLike{}
	err := json.NewDecoder(r.Body).Decode(&like)
	if err != nil {
		fmt.Println(err)
	}
	sqlite.LikePost(like.UserId, like.PostId)
	w.WriteHeader(http.StatusOK)
}

func PostLikedByUserHandler(w http.ResponseWriter, r *http.Request) {
	like := pkg.PostLike{}
	err := json.NewDecoder(r.Body).Decode(&like)
	if err != nil {
		fmt.Println(err)
	}
	liked := sqlite.PostLikedByUser(like.UserId, like.PostId)
	jsonData, err := json.Marshal(liked)
	if err != nil {
		fmt.Println(err)
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonData)
}

func GetUserNotifications(w http.ResponseWriter, r *http.Request) {
	userId := pkg.UserID{}
	err := json.NewDecoder(r.Body).Decode(&userId)
	if err != nil {
		fmt.Println(err)
	}
	notifications := sqlite.GetUserNotifications(userId.ID)
	jsonData, err := json.Marshal(notifications)
	if err != nil {
		fmt.Println(err)
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonData)
}

func SetNotificationReadHandler(w http.ResponseWriter, r *http.Request) {
	notification := pkg.Notification{}
	err := json.NewDecoder(r.Body).Decode(&notification)
	if err != nil {
		fmt.Println(err)
	}
	if err := sqlite.SetNotificationRead(notification.Id); err != nil {
		http.Error(w, "Error adding username", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}

func UnreadNotificationsCountHandler(w http.ResponseWriter, r *http.Request) {
	userId := pkg.UserID{}
	err := json.NewDecoder(r.Body).Decode(&userId)
	if err != nil {
		fmt.Println(err)
	}
	count := sqlite.UnreadNotificationsCount(userId.ID)
	jsonData, err := json.Marshal(count)
	if err != nil {
		fmt.Println(err)
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonData)
}
