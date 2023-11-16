package main

import (
	"log"
	"net/http"
	"social-network/handlers"
	"social-network/helpers"
	"social-network/pkg/db/sqlite"

	"github.com/rs/cors"
)

func main() {
	corsHandler := cors.Default().Handler(http.DefaultServeMux)
	sqlite.Init()
	manager := helpers.NewManager()

	//fs := http.FileServer(http.Dir("my-app/build"))
	filesHandler := http.StripPrefix("/files/", http.FileServer(http.Dir("files")))
	http.Handle("/files/", filesHandler)
	http.HandleFunc("/groupData", handlers.GroupDataHandler)
	http.HandleFunc("/getLastGroupMessages", handlers.GetLastGroupMessagesHandler)
	http.HandleFunc("/handleGoing", handlers.HandleGoingHandler)
	http.HandleFunc("/getEvents", handlers.GetEventsHandler)
	http.HandleFunc("/createEvent", handlers.CreateEventHandler)
	http.HandleFunc("/deleteGroup", handlers.DeleteGroupHandler)
	http.HandleFunc("/acceptGroupRequest", handlers.AcceptGroupRequestHandler)
	http.HandleFunc("/deleteGroupRequest", handlers.DeleteGroupRequestHandler)
	http.HandleFunc("/deleteGroupInvitation", handlers.DeleteGroupInvitationHandler)
	http.HandleFunc("/acceptGroupInvitation", handlers.AcceptGroupInvitationHandler)
	http.HandleFunc("/sendGroupInvite", handlers.SendGroupInviteHandler)
	http.HandleFunc("/sendGroupRequest", handlers.SendGroupRequestHandler)
	http.HandleFunc("/isGroupRequestSent", handlers.IsGroupRequestSentHandler)
	http.HandleFunc("/deleteFollowRequest", handlers.DeleteFollowRequestHandler)
	http.HandleFunc("/acceptFollowRequest", handlers.AcceptFollowRequestHandler)
	http.HandleFunc("/followRequest", handlers.FollowRequestHandler)
	http.HandleFunc("/changePublicStatus", handlers.ChangePublicStatusHandler)
	http.HandleFunc("/posts", handlers.GetPosts)
	http.HandleFunc("/newPost", handlers.NewPostHandler)
	http.HandleFunc("/register", handlers.RegisterHandler)
	http.HandleFunc("/profileOptions", handlers.ProfileOptionsHandler)
	http.HandleFunc("/addUsername", handlers.AddUsernameHandler)
	http.HandleFunc("/addAvatar", handlers.AddAvatarHandler)
	http.HandleFunc("/getUser", handlers.GetUserData)
	http.HandleFunc("/addAboutme", handlers.AddAboutmeHandler)
	http.HandleFunc("/login", handlers.LoginHandler)
	http.HandleFunc("/emailAvailable", handlers.EmailAvailableHandler)
	http.HandleFunc("/searchUsers", handlers.SearchUsersHandler)
	http.HandleFunc("/searchPosts", handlers.SearchPostsHandler)
	http.HandleFunc("/getComments", handlers.GetCommentsHandler)
	http.HandleFunc("/addComment", handlers.AddCommentHandler)
	http.HandleFunc("/likePost", handlers.PostLikeHandler)
	http.HandleFunc("/likedByUser", handlers.PostLikedByUserHandler)
	http.HandleFunc("/getLastMessages", handlers.GetLastMessagesHandler)
	//http.HandleFunc("/getSingleChatData", handlers.GetSingleChatDataHandler)
	http.HandleFunc("/groups", handlers.GetGroupsHandler)
	http.HandleFunc("/userGroups", handlers.GetUserFollowedGroups)
	http.HandleFunc("/otherGroups", handlers.GetUserUnfollowedGroups)
	http.HandleFunc("/groups/unfollow", handlers.UnfollowGroupHandler)
	http.HandleFunc("/groupFollowers", handlers.GetGroupFollowers)
	http.HandleFunc("/addGroup", handlers.AddGroupHandler)
	http.HandleFunc("/userFollowings", handlers.GetUserFollowings)
	http.HandleFunc("/userFollowers", handlers.GetUserFollowers)
	http.HandleFunc("/user/follow", handlers.FollowUserHandler)
	http.HandleFunc("/user/unfollow", handlers.UnfollowUserHandler)
	http.HandleFunc("/notifications", handlers.GetUserNotifications)
	http.HandleFunc("/notifications/read", handlers.SetNotificationReadHandler)
	http.HandleFunc("/notifications/unreadCount", handlers.UnreadNotificationsCountHandler)
	http.HandleFunc("/getUserId", handlers.GetUserIdHandler)
	http.HandleFunc("/logout", handlers.LogoutHandler)
	http.HandleFunc("/ws", manager.ServeWS)

	log.Println("Listening on :3001")
	err := http.ListenAndServe(":3001", corsHandler)
	if err != nil {
		log.Fatal(err)
	}
}
