package pkg

type Post struct {
	ID              string `json:"id"`
	UserID          string `json:"userId"`
	UserDisplayName string `json:"userDisplayName"`
	Content         string `json:"content"`
	Timestamp       string `json:"timestamp"`
	Likes           int    `json:"likes"`
	Comments        int    `json:"comments"`
	Image           string `json:"image"`
	Type            string `json:"type"`
	TargetId        string `json:"targetId"`
	GroupID         string `json:"groupId"`
	GroupName       string `json:"groupName"`
	PrivacyId       int    `json:"privacyId"`
	AllowedUsers    string `json:"allowedUsers"`
	New             int    `json:"new"`
	Images          string `json:"images"`
}

type PostFilter struct {
	Filter string `json:"filter"`
	Id     string `json:"id"`
}

type User struct {
	Id            string `json:"user_id`
	Email         string `json:"email"`
	Password      string `json:"password"`
	FirstName     string `json:"first_name"`
	LastName      string `json:"last_name"`
	DateOfBirth   string `json:"date_of_birth"`
	Image         string `json:"image"`
	Nickname      string `json:"nickname"`
	AboutMe       string `json:"about_me"`
	Followers     string `json:"followers"`
	Public        bool   `json:"public"`
	FollowRequest bool   `json:"follow_request"`
}

type SearchUser struct {
	FirstName string
	LastName  string
	UserId    string
	UserImg   string
	Nickname  string
}

type Comment struct {
	Id        string `json:"id"`
	PostId    string `json:"postId"`
	Content   string `json:"content"`
	Likes     int    `json:"likes"`
	UserId    string `json:"userId"`
	Timestamp string `json:"timestamp"`
	UserName  string `json:"userName"`
	UserImage string `json:"userImage"`
	Image     string `jsion:"commentImage"`
}

type NewComment struct {
	PostId  string `json:"postId"`
	Comment string `json:"comment"`
	Likes   int    `json:"likes"`
	UserId  string `json:"userId"`
	Image   string `json:"image`
}

type Message struct {
	Id        int    `json:"id"`
	Message   string `json:"message"`
	FromUser  string `json:"fromUser"`
	ToUser    string `json:"toUser"`
	Timestamp string `json:"timestamp"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
}

type SingleMessage struct {
	Id        string `json:"id"`
	Message   string `json:"message"`
	FromUser  string `json:"fromUser"`
	ToUser    string `json:"toUser"`
	Timestamp string `json:"timestamp"`
}

type MessagePayload struct {
	ToUserID   string `json:"toUserId"`
	FromUserID string `json:"fromUserId"`
	Message    string `json:"message"`
	TimeSent   string `json:"timeSent"`
}

// SendMessageEvent is the payload sent in the
// send_message event
type SendMessageEvent struct {
	Message string `json:"message"`
	From    string `json:"from"`
	To      string `json:"to"`
	Sent    string `json:"sent"`
	GroupId string `json:"groupId"`
}

type TypingInProgressEvent struct {
	From   string `json:"from"`
	To     string `json:"to"`
	Active bool   `json:"active"`
}

// NewMessageEvent is returned when responding to send_message
type NewMessageEvent struct {
	SendMessageEvent
	Sent string `json:"sent"`
}

type SendStatusEvent struct {
	UserId string `json:"userId"`
	Status string `json:"status"`
}

type Group struct {
	GroupId     string `json:"group_id"`
	GroupName   string `json:"group_name"`
	Creator     string `json:"creator"`
	Description string `json:"description"`
	Image       string `json:"image"`
}

type GroupRelations struct {
	UserId  string `json:"user_id"`
	GroupId string `json:"group_id"`
}

type UserID struct {
	ID string `json:"userID"`
}

type GroupData struct {
	GroupId string `json:"groupId"`
	GroupName string `json:"groupName"`
	Image string `json:"image"`
}

type GroupID struct {
	ID string `json:"groupID"`
}

type GroupAction struct {
	UserID  string `json:"userID"`
	GroupID string `json:"groupID"`
}

type FollowAction struct {
	FollowerID string `json:"followerID"`
	FollowedID string `json:"followedID"`
}

type PostLike struct {
	UserId string `json:"userId"`
	PostId string `json:"postId"`
}

type PostLiked struct {
	Liked string `json:"liked"`
}

type Notification struct {
	Id         string `json:"id"`
	SenderName string `json:"senderName"`
	GroupName  string `json:"groupName"`
	GroupId    string `json:"groupId"`
	Type       string `json:"type"`
	Message    string `json:"message"`
	Unread     int    `json:"unread"`
	Link       string `json:"link"`
	Time       string `json:"time"`
	FromId     string `json:"fromId"`
}

type Count struct {
	Count int `json:"count"`
}

type Event struct {
	Id          string `json:"id"`
	Title       string `json:"title"`
	Desc        string `json:"desc"`
	Date        string `json:"date"`
	GroupId     string `json:"groupId"`
	Creator     string `json:"creator"`
	CreatorName string `json:"creatorName"`
}

type EventGoing struct {
	GroupId string `json:"groupID"`
	EventId string `json:"eventId"`
	UserId  string `json:"userId"`
	Going   bool   `json:"going"`
}

type LastGroupMessage struct {
	Message   string `json:"message"`
	GroupId   string `json:"groupId"`
	GroupName string `json:"groupName"`
	Timestamp string `json:"timestamp"`
}
