package sqlite

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"social-network/pkg"
	"time"

	"github.com/google/uuid"
	_ "github.com/mattn/go-sqlite3"
	"golang.org/x/crypto/bcrypt"
)

var sql_file_names = []string{
	"users_table.sql",
	"comments.sql",
	"posts.sql",
	"post_likes.sql",
	"comment_likes.sql",
	"messages.sql",
	"cookies.sql",
	"groups.sql",
	"group_relations.sql",
	"follow_relations.sql",
	"notifications.sql",
	"events.sql",
	"attendees.sql"}

var Db *sql.DB

func Init() {
	var err error
	Db, err = sql.Open("sqlite3", "pkg/db/databs.db")
	if err != nil {
		fmt.Println(err)
	}
	/*
		checker, err := os.ReadFile("./backend/pkg/db/databs.db")
		if err != nil {
			fmt.Println(err)
		}
		if len(checker) == 0 {
			for _, fileName := range sql_file_names {

				migrationPath := filepath.Join("backend","pkg", "db", "migrations", fileName)
				sqlScript, err := os.ReadFile(migrationPath)
				if err != nil {
					fmt.Println(err)
				}

				_, err = Db.Exec(string(sqlScript))
				if err != nil {
					fmt.Printf("failed to execute SQL script '%s': %v\n", migrationPath, err)
				}
			}
		}
	*/
}

func AddNewUser(userID string, user pkg.User) error {
	statement := `INSERT INTO users (User_id, Email, "Password", First_name, Last_name, Date_of_birth, Image, Nickname, About_me, Followers, Created_at, Staatus)
				  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
	currentTime := time.Now()

	// Generate a bcrypt hash of the password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return fmt.Errorf("failed to generate password hash: %w", err)
	}

	_, err = Db.Exec(statement, userID, user.Email, hashedPassword, user.FirstName, user.LastName, user.DateOfBirth, "", "", "", 0, currentTime, "online")
	if err != nil {
		fmt.Println(err)
		return fmt.Errorf("failed to insert new user: %w", err)
	}

	return nil
}
func AddUsername(username string, userID string) error {
	statement := `UPDATE users SET Nickname = ? WHERE User_id = ?`

	_, err := Db.Exec(statement, username, userID)
	if err != nil {
		fmt.Println(err)
		return fmt.Errorf("failed to update username: %w", err)
	}
	return nil
}
func AddAvatar(userID string, avatar string) error {
	statement := `UPDATE users SET Image = ? WHERE User_id = ?`
	_, err := Db.Exec(statement, avatar, userID)
	if err != nil {
		fmt.Println(err)
		return fmt.Errorf("failed to update username: %w", err)
	}
	return nil
}

func AddAboutme(aboutme string, userID string) error {
	statement := `UPDATE users SET About_me = ? WHERE User_id = ?`
	_, err := Db.Exec(statement, aboutme, userID)
	if err != nil {
		fmt.Println(err)
		return fmt.Errorf("failed to update username: %w", err)
	}
	return nil
}
func Login(email string, password string) (error, string) {
	// Query the database to find the user by username
	row := Db.QueryRow("SELECT User_id, Password FROM users WHERE Email = ?", email)

	var hashedPassword string
	var userId string
	err := row.Scan(&userId, &hashedPassword)
	if err != nil {
		fmt.Println(err)
		// User not found
		if err == sql.ErrNoRows {
			return fmt.Errorf("user not found"), ""
		}
		return fmt.Errorf("failed to query user: %w", err), ""
	}

	// Compare the provided password with the stored hashed password
	err = bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	fmt.Println(err)
	if err != nil {
		fmt.Println(err)
		//case for test users
		if password == hashedPassword {
			return nil, userId
		}
		// Incorrect password
		return fmt.Errorf("incorrect password"), ""
	}
	AddNewCookie(userId)
	// Password is correct, proceed with login

	return nil, userId
}

func EmailAvailable(email string) error {
	row := Db.QueryRow("SELECT User_id FROM users WHERE Email = ?", email)
	dbResult := ""
	if err := row.Scan(&dbResult); err != nil {
		return nil
	}
	return fmt.Errorf("user already exists")
}

func AddNewPost(post pkg.Post) error {

	statement := ""
	if post.New == 1 {
		statement = `INSERT INTO posts (Id, User_id, Nickname, Content, Created_at, Number_of_likes, Number_of_comments, Type, Target_id, PrivacyId, AllowedUsers, Images)
				  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
	} else {
		statement = `UPDATE posts SET Id = ?, User_id = ?, Nickname = ?, Content = ?, Created_at = ?, Number_of_likes = ?, Number_of_comments = ?, Type = ?, Target_id = ?, PrivacyId = ?, AllowedUsers = ?, Images = ?
		WHERE Id = ?`
	}

	_, err := Db.Exec(statement, post.ID, post.UserID, post.UserDisplayName, post.Content, post.Timestamp, post.Likes, post.Comments, post.Type, post.TargetId, post.PrivacyId, post.AllowedUsers, post.Images, post.ID)
	if err != nil {
		fmt.Println(err)
		return fmt.Errorf("failed to insert new post: %w", err)
	}

	return nil
}

func GetAllPosts(filters pkg.PostFilter) ([]pkg.Post, error) {
	posts := []pkg.Post{}
	query := ``
	switch filters.Filter {
	case "userFeed":
		query = `select DISTINCT posts.Id, posts.user_id, 
			CASE WHEN users.Nickname != '' THEN users.Nickname ELSE users.First_name END,  
			Content, posts.Created_at, Number_of_likes, Number_of_comments, 
			CASE WHEN posts.Target_id IS NULL THEN '' ELSE posts.Target_id END,
			CASE WHEN group_relations.group_id IS NOT NULL THEN  groups.Image ELSE users.Image END  as Image, 
			CASE WHEN groups.group_id IS NULL THEN '' ELSE groups.group_id END, 
			CASE WHEN groups.group_name IS NULL THEN '' ELSE groups.group_name END,
			PrivacyId,
			AllowedUsers,
			CASE WHEN Images IS NULL THEN '' ELSE Images END
			from posts 
			left join users on posts.User_id = users.User_id
			left join follow_relations on follow_relations.followed_id = posts.user_id
			left join group_relations on group_relations.group_id = posts.Target_id
			left join groups on groups.group_id = group_relations.group_id
		where users.user_id = ? OR PrivacyId = '1' OR (follow_relations.follower_id = ? AND PrivacyId = '2')  OR (group_relations.user_id = ? AND posts.Type = '2') 
			OR (follow_relations.follower_id = ? AND PrivacyId = '3' AND AllowedUsers LIKE ?)
		ORDER BY posts.Created_at DESC`
	case "groupFeed":
		query = `select DISTINCT posts.Id, posts.User_id, CASE WHEN users.Nickname != '' THEN users.Nickname ELSE users.First_name END,  Content, posts.Created_at, Number_of_likes, 
			Number_of_comments, Target_id, users.Image, 
			'', '', 2, '', 
			CASE WHEN Images IS NULL THEN '' ELSE Images END
			from posts 
			left join group_relations on group_relations.group_id = posts.Target_id
			left join groups on groups.group_id = group_relations.group_id
			left join users on posts.User_id = users.User_id where Type = '2' AND Target_id = ? 
		ORDER BY posts.Created_at DESC`
	case "userPosts":
		query = `select DISTINCT posts.Id, posts.user_id, 
			CASE WHEN users.Nickname != '' THEN users.Nickname ELSE users.First_name END,  
			Content, posts.Created_at, Number_of_likes, 
			Number_of_comments, 
			CASE WHEN posts.Target_id IS NULL THEN '' ELSE posts.Target_id END,
			CASE WHEN group_relations.group_id IS NOT NULL THEN  groups.Image ELSE users.Image END  as Image,
			CASE WHEN groups.group_id IS NULL THEN '' ELSE groups.group_id END, 
			CASE WHEN groups.group_name IS NULL THEN '' ELSE groups.group_name END,
			PrivacyId,
			AllowedUsers,
			CASE WHEN Images IS NULL THEN '' ELSE Images END
			from posts 
			left join users on posts.User_id = users.User_id
			left join group_relations on group_relations.group_id = posts.Target_id
			left join groups on groups.group_id = group_relations.group_id
			WHERE users.user_id = ?
		ORDER BY posts.Created_at DESC`
	}
	rows, err := Db.Query(query, filters.Id, filters.Id, filters.Id, filters.Id, "%"+filters.Id+"%")
	if err != nil {
		fmt.Println(err)
	}
	defer rows.Close()
	for rows.Next() {
		post := new(pkg.Post)
		err = rows.Scan(&post.ID, &post.UserID, &post.UserDisplayName, &post.Content, &post.Timestamp, &post.Likes, &post.Comments, &post.TargetId, &post.Image, &post.GroupID, &post.GroupName, &post.PrivacyId, &post.AllowedUsers, &post.Images)
		if err != nil {
			fmt.Println(err)
			return nil, err
		} else {
			posts = append(posts, *post)
		}
	}
	return posts, nil

}

func SearchUsersFromDatabase(value string, userId string) []pkg.SearchUser {
	query := `
        SELECT
            u.First_name AS FirstName,
            u.Last_name AS LastName,
            u.User_id AS UserId,
            u."Image" AS UserImg,
            u.Nickname
        FROM
            users u
        WHERE
            (
                (u.User_id IN (SELECT follower_id FROM follow_relations WHERE followed_id = ?))
                OR
                (u.User_id IN (SELECT followed_id FROM follow_relations WHERE follower_id = ?))
            )
            AND
            (
                u.First_name LIKE '%' || ? || '%' -- Partial match on first name
                OR
                u.Last_name LIKE '%' || ? || '%' -- Partial match on last name
                OR
                u.Nickname LIKE '%' || ? || '%' -- Partial match on nickname
            )
        UNION
        SELECT
            '' AS FirstName,
            '' AS LastName,
            g.group_id AS UserId, -- Use group_id as UserId
            g.image AS UserImg, -- Use group's image
            g.group_name AS Nickname -- Use group name as nickname
        FROM
            groups g
        WHERE
            g.group_id IN (SELECT group_id FROM group_relations WHERE user_id = ?)
            AND
            g.group_name LIKE '%' || ? || '%' -- Partial match on group name
    `
	rows, err := Db.Query(query, userId, userId, value, value, value, userId, value)
	if err != nil {
		fmt.Println(err)
	}
	defer rows.Close()

	var searchResults []pkg.SearchUser

	for rows.Next() {
		var searchResult pkg.SearchUser
		err := rows.Scan(
			&searchResult.FirstName,
			&searchResult.LastName,
			&searchResult.UserId,
			&searchResult.UserImg,
			&searchResult.Nickname,
		)
		if err != nil {
			fmt.Println(err)
		}
		searchResults = append(searchResults, searchResult)
	}

	if err := rows.Err(); err != nil {
		fmt.Println(err)
	}

	return searchResults
}

func GetComments(postId string) []pkg.Comment {
	comments := []pkg.Comment{}
	statement := `SELECT comments.Id, comments.Post_id, comments.Comment, comments.Likes, comments.Comment_user_id, comments.Created_at, 
                CASE
                    WHEN users.Nickname != '' THEN users.Nickname
                    ELSE users.First_name || ' ' || users.Last_name
                END AS UserName,
                users.Image AS UserImage,
				comments.Image as commentImage
                FROM comments
                LEFT JOIN users ON comments.Comment_user_id = users.User_id
                WHERE comments.Post_id = ?`
	rows, err := Db.Query(statement, postId)
	defer rows.Close()
	if err != nil {
		fmt.Println(err)
	}
	for rows.Next() {
		newComment := pkg.Comment{}
		err = rows.Scan(&newComment.Id, &newComment.PostId, &newComment.Content, &newComment.Likes, &newComment.UserId, &newComment.Timestamp, &newComment.UserName, &newComment.UserImage, &newComment.Image)
		if err != nil {
			fmt.Println(err)
		}
		comments = append(comments, newComment)
	}
	return comments
}

func PushComment(comment pkg.NewComment) error {
	_, err := Db.Exec("INSERT INTO comments (Post_id, Comment, Likes, Comment_user_id, Image) VALUES (?, ?, ?, ?, ?)", comment.PostId, comment.Comment, comment.Likes, comment.UserId, comment.Image)
	if err != nil {
		fmt.Println(err)
	}
	return nil
}

func GetLastMessages(userId string) []pkg.Message {
	messages := []pkg.Message{}
	statement := `
		SELECT COALESCE(messages.id, -1), messages.msg AS message, messages.from_user, messages.to_user, messages.created_at, other_user.First_name, other_user.Last_name
		FROM messages
			JOIN users AS current_user ON (current_user.User_id = ? AND (messages.from_user = current_user.User_id OR messages.to_user = current_user.User_id))
			JOIN users AS other_user ON (
				(messages.from_user = other_user.User_id AND messages.to_user = current_user.User_id)
				OR (messages.to_user = other_user.User_id AND messages.from_user = current_user.User_id)
			)
		WHERE (messages.from_user = ? AND messages.to_user = other_user.User_id)
			OR (messages.from_user = other_user.User_id AND messages.to_user = ?)
			AND messages.created_at IN (
				SELECT MAX(created_at)
				FROM messages
				WHERE (
					(messages.from_user = current_user.User_id AND messages.to_user = other_user.User_id)
					OR (messages.to_user = current_user.User_id AND messages.from_user = other_user.User_id)
				)
			)
	`
	rows, err := Db.Query(statement, userId, userId, userId)
	defer rows.Close()
	if err != nil {
		fmt.Println(err)
	}
	for rows.Next() {
		newMessage := pkg.Message{}
		err = rows.Scan(&newMessage.Id, &newMessage.Message, &newMessage.FromUser, &newMessage.ToUser, &newMessage.Timestamp, &newMessage.FirstName, &newMessage.LastName)
		if err != nil {
			fmt.Println(err)
		}
		match := false
		for i := 0; i < len(messages); i++ {
			if messages[i].FirstName == newMessage.FirstName && messages[i].LastName == newMessage.LastName {
				match = true
				if messages[i].Timestamp < newMessage.Timestamp {
					messages[i] = newMessage
				}
				break
			}
		}
		if !match {
			messages = append(messages, newMessage)
		}
	}
	return messages
}

func GetLastGroupMessages(userId string) []pkg.LastGroupMessage {

	// Query to retrieve the latest message from each group the user is a part of
	query := `
		SELECT gm.msg, gm.groupId, g.group_name, gm.created_at
		FROM groupMessages gm
		JOIN (
			SELECT groupId, MAX(created_at) AS max_created_at
			FROM groupMessages
			WHERE groupId IN (
				SELECT group_id FROM group_relations WHERE user_id = ?
			)
			GROUP BY groupId
		) latest ON gm.groupId = latest.groupId AND gm.created_at = latest.max_created_at
		JOIN groups g ON gm.groupId = g.group_id
		ORDER BY gm.created_at DESC
	`

	rows, err := Db.Query(query, userId)
	if err != nil {
		fmt.Println(err)
		return []pkg.LastGroupMessage{}
	}
	defer rows.Close()

	var messages []pkg.LastGroupMessage

	for rows.Next() {
		var message pkg.LastGroupMessage
		var timestamp time.Time
		err := rows.Scan(&message.Message, &message.GroupId, &message.GroupName, &timestamp)
		if err != nil {
			fmt.Println(err)
			return messages
		}
		message.Timestamp = timestamp.Format(time.RFC3339)
		messages = append(messages, message)
	}

	if err := rows.Err(); err != nil {
		fmt.Println(err)
		return messages
	}

	return messages
}

func ChangePublicStatus(userId string, status bool) string {
	statement := `UPDATE users SET Public = ? WHERE User_id = ?`
	_, err := Db.Exec(statement, !status, userId)
	if err != nil {
		fmt.Println(err)
		return "Not Success"
	}
	return "Success"
}

func GetGroupData(groupId string) pkg.GroupData {
	statement := `SELECT group_id, group_name, image FROM groups WHERE group_id = ?`
	rows, err := Db.Query(statement, groupId)
	if err != nil {
		fmt.Println(err)
	}
	defer rows.Close()
	var group pkg.GroupData
	for rows.Next() {
		err := rows.Scan(&group.GroupId, &group.GroupName, &group.Image)
		if err != nil {
			fmt.Println(err)
		}
	}
	return group
}

func GetSingleChatData(myUserId string, otherUserId string, chatRowsPerFetch int) []byte {
	singleMessages := []pkg.NewMessageEvent{}
	statement := `
        SELECT msg AS 'Message', from_user AS 'From', to_user AS 'To', created_at AS 'Sent'
        FROM messages
        WHERE (from_user = ? AND to_user = ?) OR (from_user = ? AND to_user = ?)
        UNION
        SELECT msg AS 'Message', from_user AS 'From', groupId AS 'To', created_at AS 'Sent'
        FROM groupMessages
        WHERE (groupId = ?)
    `
	rows, err := Db.Query(statement, myUserId, otherUserId, otherUserId, myUserId, otherUserId)
	defer rows.Close()
	if err != nil {
		fmt.Println(err)
	}
	for rows.Next() {
		newMessage := pkg.NewMessageEvent{}
		err = rows.Scan(&newMessage.Message, &newMessage.From, &newMessage.To, &newMessage.Sent)
		if err != nil {
			fmt.Println(err)
		}
		singleMessages = append(singleMessages, newMessage)
	}
	singleMessages = reverseChatData(singleMessages)
	jsonMessages, err := json.Marshal(singleMessages)
	if err != nil {
		fmt.Println(err)
	}
	return jsonMessages
}

func reverseChatData(input []pkg.NewMessageEvent) []pkg.NewMessageEvent {
	if len(input) == 0 {
		return input
	}
	return append(reverseChatData(input[1:]), input[0])
}

func GetProfileOptionsFromDatabase(userID string) string {
	rows, err := Db.Query("SELECT First_name FROM users WHERE User_id = ?", userID)
	if err != nil {
		fmt.Println(err)
	}
	defer rows.Close()
	for rows.Next() {
		var firstName string
		rows.Scan(&firstName)
		return firstName
	}
	return ""
}

func PushMessageToDatabaseNew(payload pkg.NewMessageEvent) {
	toUserIsUser := false

	// Check if the "to_user" exists in the "users" table
	var userId string
	err := Db.QueryRow("SELECT user_id FROM users WHERE user_id = ?", payload.To).Scan(&userId)
	if err == nil {
		toUserIsUser = true
	}

	if toUserIsUser {
		// If "to_user" is a user, insert the message into the "messages" table
		_, err := Db.Exec("INSERT INTO messages(msg, from_user, to_user, created_at) VALUES (?, ?, ?, ?)", payload.Message, payload.From, payload.To, payload.Sent)
		if err != nil {
			fmt.Println(err)
		}
	} else {
		// If "to_user" is not a user, assume it's a group and insert the message into the "groupMessages" table
		_, err := Db.Exec("INSERT INTO groupMessages(msg, from_user, groupId, created_at) VALUES (?, ?, ?, ?)", payload.Message, payload.From, payload.To, payload.Sent)
		if err != nil {
			fmt.Println(err)
		}
	}
}
func SetUserStatus(userId, status string) {
	_, err := Db.Exec(`UPDATE users SET Staatus = ? WHERE User_id = ?`, status, userId)
	if err != nil {
		fmt.Println(err)
	}
}

func GetUserStatus(userId string) []byte {

	rows, err := Db.Query(`SELECT User_id, staatus FROM users WHERE User_id = ?`, userId)
	if err != nil {
		fmt.Println(err)
	}
	sse := pkg.SendStatusEvent{}
	for rows.Next() {
		rows.Scan(&sse.UserId, &sse.Status)

	}
	jsonData, err := json.Marshal(sse)
	if err != nil {
		fmt.Println(err)
	}
	return jsonData
}

func GetUserId(value string) string {
	rows, err := Db.Query(`SELECT userId FROM cookies WHERE cookieId = ?`, value)
	if err != nil {
		fmt.Println("in getuserid function", err)
	}
	defer rows.Close()
	for rows.Next() {
		var userId string
		rows.Scan(&userId)
		return userId
	}
	return ""
}

func Logout(value string) {
	_, err := Db.Exec(`DELETE FROM cookies WHERE cookieId = ?`, value)
	if err != nil {
		fmt.Println(err)
	}
}

func GetGroups() []pkg.Group {

	groups := []pkg.Group{}
	rows, err := Db.Query(`SELECT * FROM groups`)
	defer rows.Close()
	if err != nil {
		fmt.Println(err)
	}
	for rows.Next() {
		group := pkg.Group{}
		err = rows.Scan(&group.GroupId, &group.GroupName, &group.Creator, &group.Description, &group.Image)
		if err != nil {
			fmt.Println(err)
		}
		groups = append(groups, group)
	}
	return groups
}

func GetUserFollowedGroups(userId string) []pkg.Group {

	groups := []pkg.Group{}
	rows, err := Db.Query(`select groups.group_id, group_name, creator, description, image from group_relations 
	LEFT JOIN groups on groups.group_id = group_relations.group_id WHERE user_id = ?`, userId)
	defer rows.Close()
	if err != nil {
		fmt.Println(err)
	}
	for rows.Next() {
		group := pkg.Group{}
		err = rows.Scan(&group.GroupId, &group.GroupName, &group.Creator, &group.Description, &group.Image)
		if err != nil {
			fmt.Println(err)
		}
		groups = append(groups, group)
	}
	return groups
}

func GetUserUnfollowedGroups(userId string) []pkg.Group {

	groups := []pkg.Group{}
	rows, err := Db.Query(`select groups.* FROM groups WHERE group_id NOT IN  (SELECT group_id FROM group_relations WHERE user_id = ?)`, userId)
	defer rows.Close()
	if err != nil {
		fmt.Println(err)
	}
	for rows.Next() {
		group := pkg.Group{}
		err = rows.Scan(&group.GroupId, &group.GroupName, &group.Creator, &group.Description, &group.Image)
		if err != nil {
			fmt.Println(err)
		}
		groups = append(groups, group)
	}
	return groups
}

func UnfollowGroup(userId, group string) {
	_, err := Db.Exec(`DELETE FROM group_relations WHERE user_id = ? AND group_id = ?`, userId, group)
	if err != nil {
		fmt.Println(err)
	}
}

func GetUserFollowings(userId string) []pkg.User {

	followers := []pkg.User{}
	rows, err := Db.Query(`select DISTINCT user_id, First_name, Last_name, image from users left join follow_relations on follow_relations.followed_id = users.user_id where follower_id = ?`, userId)
	defer rows.Close()
	if err != nil {
		fmt.Println(err)
	}
	for rows.Next() {
		follower := pkg.User{}
		err = rows.Scan(&follower.Id, &follower.FirstName, &follower.LastName, &follower.Image)
		if err != nil {
			fmt.Println(err)
		}
		followers = append(followers, follower)
	}
	return followers
}

func GetUserFollowers(userId string) []pkg.User {

	followers := []pkg.User{}
	rows, err := Db.Query(`select  DISTINCT user_id, First_name, Last_name, image from users left join follow_relations on follow_relations.follower_id = users.user_id where followed_id = ?`, userId)
	defer rows.Close()
	if err != nil {
		fmt.Println(err)
	}
	for rows.Next() {
		follower := pkg.User{}
		err = rows.Scan(&follower.Id, &follower.FirstName, &follower.LastName, &follower.Image)
		if err != nil {
			fmt.Println(err)
		}
		followers = append(followers, follower)
	}
	return followers
}

func AcceptFollowRequest(followerId, followedId string) {
	_, err := Db.Exec(`DELETE FROM notifications WHERE toUser = ? AND fromId = ? AND type = ?`, followedId, followerId, "follow_request")
	if err != nil {
		fmt.Println(err)
	}
	_, err = Db.Exec("INSERT INTO follow_relations (follower_id, followed_id) VALUES (?, ?)", followerId, followedId)
	if err != nil {
		fmt.Println(err)
	}
	notificationUUID := uuid.New().String()
	notificationURL := "/profile?id=" + followerId
	_, err = Db.Exec(`INSERT INTO notifications (id, toUser, fromId, groupId, type, message, unread, link, time)
		VALUES
		(?,?, ?, '', 'new_following', 'followed_user', 1, ?, CURRENT_TIMESTAMP)`, notificationUUID, followedId, followerId, notificationURL)

}

func DeleteFollowRequest(followerId, followedId string) {
	fmt.Println("followed: ", followedId, "follower: ", followerId)
	_, err := Db.Exec(`DELETE FROM notifications WHERE toUser = ? AND fromId = ? AND type = 'follow_request'`, followedId, followerId)
	if err != nil {
		fmt.Println(err)
	}
}

func FollowRequest(followerId, followedId string) {
	fmt.Println("followed: ", followedId, "follower: ", followerId)
	var row string
	err := Db.QueryRow(`SELECT id FROM notifications WHERE type = ? AND toUser = ? AND fromId = ?`, "follow_request", followedId, followerId).Scan(&row)
	if err != nil {
		if err == sql.ErrNoRows {
			notificationUUID := uuid.New().String()
			notificationURL := "/profile?id=" + followerId
			_, err = Db.Exec(`INSERT INTO notifications (id, toUser, fromId, groupId, type, message, unread, link, time)
			VALUES 
			(?,?, ?, '', 'follow_request', 'follow_request', 1, ?, CURRENT_TIMESTAMP)`, notificationUUID, followedId, followerId, notificationURL)
			if err != nil {
				fmt.Println(err)
			}
		} else {
			// Other error occurred, handle it
			fmt.Println("Error:", err)
		}
	}
}

func FollowUser(followerId, followedId string) {
	_, err := Db.Exec("INSERT INTO follow_relations (follower_id, followed_id) VALUES (?, ?)", followerId, followedId)
	if err != nil {
		fmt.Println(err)
	}
	notificationUUID := uuid.New().String()
	notificationURL := "/profile?id=" + followerId
	_, err = Db.Exec(`INSERT INTO notifications (id, toUser, fromId, groupId, type, message, unread, link, time)
		VALUES
		(?,?, ?, '', 'new_following', 'followed_user', 1, ?, CURRENT_TIMESTAMP)`, notificationUUID, followedId, followerId, notificationURL)
}

func UnfollowUser(followerId, followedId string) {
	_, err := Db.Exec("DELETE FROM follow_relations WHERE follower_id = ? AND followed_id = ?", followerId, followedId)
	if err != nil {
		fmt.Println(err)
	}
}

func GetGroupFollowers(groupId string) []pkg.User {

	followers := []pkg.User{}
	rows, err := Db.Query(`select  DISTINCT users.user_id, First_name, Last_name, image from users left join group_relations on group_relations.user_id = users.user_id where group_id = ?`, groupId)
	defer rows.Close()
	if err != nil {
		fmt.Println(err)
	}
	for rows.Next() {
		follower := pkg.User{}
		err = rows.Scan(&follower.Id, &follower.FirstName, &follower.LastName, &follower.Image)
		if err != nil {
			fmt.Println(err)
		}
		followers = append(followers, follower)
	}
	return followers
}

func IsGroupRequestSent(groupId, userId string) bool {
	var count int
	err := Db.QueryRow(`SELECT COUNT(*) FROM notifications WHERE type='group_request' AND fromId = ? AND groupId = ?`, userId, groupId).Scan(&count)
	if err != nil {
		fmt.Println(err)
	}
	return count > 0
}

func SendGroupRequest(userId, groupId string) bool {
	creatorId := ""
	statement := `SELECT creator FROM groups WHERE group_id = ?`
	rows, err := Db.Query(statement, groupId)
	defer rows.Close()
	if err != nil {
		fmt.Println(err)
		return false
	}
	for rows.Next() {
		err = rows.Scan(&creatorId)
		if err != nil {
			fmt.Println(err)
			return false
		}
	}
	statement = `INSERT INTO notifications (id, toUser, fromId, groupId, type, message, unread, link, time) 
				VALUES 
				(?, ?, ?, ?, 'group_request', 'group_request', 1, ?, CURRENT_TIMESTAMP)`
	notificationUUID := uuid.New().String()
	notificationURL := "/profile?id=" + userId
	_, err = Db.Exec(statement, notificationUUID, creatorId, userId, groupId, notificationURL)
	if err != nil {
		fmt.Println(err)
		return false
	}
	return true
}

func AcceptGroupRequest(userId, groupId string) error {
	fmt.Println("userId: ", userId, "groupId: ", groupId)
	creatorId := ""
	statement := (`SELECT creator FROM groups WHERE group_id = ?`)
	err := Db.QueryRow(statement, groupId).Scan(&creatorId)
	if err != nil {
		fmt.Println(err)
		return err
	}
	_, err = Db.Exec(`DELETE FROM notifications WHERE toUser = ? AND fromId = ? AND groupId = ? AND type = 'group_request'`, creatorId, userId, groupId)
	if err != nil {
		fmt.Println(err)
		return err
	}
	_, err = Db.Exec(`INSERT INTO group_relations (user_id, group_id) VALUES (?, ?)`, userId, groupId)
	if err != nil {
		fmt.Println(err)
		return err
	}
	return nil
}

func DeleteGroup(groupId string) error {
	_, err := Db.Exec(`DELETE FROM groups WHERE group_id = ?`, groupId)
	if err != nil {
		fmt.Println(err)
		return err
	}
	_, err = Db.Exec(`DELETE FROM group_relations WHERE group_id = ?`, groupId)
	if err != nil {
		fmt.Println(err)
		return err
	}
	_, err = Db.Exec(`DELETE FROM notifications WHERE groupId = ?`, groupId)
	if err != nil {
		fmt.Println(err)
		return err
	}
	_, err = Db.Exec(`DELETE FROM posts WHERE group_id = ?`, groupId)
	return nil
}

func CreateEvent(event pkg.Event) error {
	name := ""
	err := Db.QueryRow(`SELECT COALESCE("Nickname", "First_name" || ' ' || "Last_name") AS "display_name" FROM "users" WHERE user_id = ?`, event.Creator).Scan(&name)
	if err != nil {
		fmt.Println(err)
	}
	eventId := uuid.New().String()
	_, err = Db.Exec(`INSERT INTO events (id, title, description, date, groupId, creator, creatorName) VALUES (?, ?, ?, ?, ?, ?, ?)`, eventId, event.Title, event.Desc, event.Date, event.GroupId, event.Creator, name)
	if err != nil {
		fmt.Println(err)
		return err
	}
	return nil
}

func HandleGoing(temp pkg.EventGoing) error {
	id := uuid.New().String()
	var goingVar string
	err := Db.QueryRow(`SELECT going FROM attendees WHERE userId = ? AND eventId = ?`, temp.UserId, temp.EventId).Scan(&goingVar)
	if err != nil {
		if err == sql.ErrNoRows {
			_, err = Db.Exec(`INSERT INTO attendees VALUES (?, ?, ?, ?)`, id, temp.UserId, temp.EventId, temp.Going)
			if err != nil {
				fmt.Println(err)
				return err
			}
		} else {
			fmt.Println(err)
			return err
		}
	}
	if temp.Going == false && goingVar == "false" || temp.Going == true && goingVar == "true" {
		return nil
	} else {
		_, err = Db.Exec(`UPDATE attendees SET going = ? WHERE userId = ? AND eventId = ?`, temp.Going, temp.UserId, temp.EventId)
		if err != nil {
			fmt.Println(err)
			return err
		}
	}
	return nil
}

func GetEvents(groupId string) []pkg.Event {
	events := []pkg.Event{}
	rows, err := Db.Query(`SELECT id, title, description, date, creator, creatorName FROM events WHERE groupId = ?`, groupId)
	defer rows.Close()
	if err != nil {
		fmt.Println(err)
	}
	for rows.Next() {
		event := pkg.Event{}
		err = rows.Scan(&event.Id, &event.Title, &event.Desc, &event.Date, &event.Creator, &event.CreatorName)
		if err != nil {
			fmt.Println(err)
		}
		events = append(events, event)
	}
	return events
}

func DeleteGroupRequest(userId, groupId string) error {
	creatorId := ""
	statement := (`SELECT creator FROM groups WHERE group_id = ?`)
	err := Db.QueryRow(statement, groupId).Scan(&creatorId)
	if err != nil {
		fmt.Println(err)
		return err
	}
	_, err = Db.Exec(`DELETE FROM notifications WHERE toUser = ? AND fromId = ? AND groupId = ? AND type = 'group_request'`, creatorId, userId, groupId)
	if err != nil {
		fmt.Println(err)
	}
	return nil
}

func AcceptGroupInvitation(inviter, invitee, groupId string) error {
	_, err := Db.Exec(`DELETE FROM notifications WHERE toUser = ? AND fromId = ? AND type = ?`, invitee, inviter, "group_invite")
	if err != nil {
		fmt.Println(err)
	}
	_, err = Db.Exec("INSERT INTO group_relations (user_id, group_id) VALUES (?, ?)", invitee, groupId)
	if err != nil {
		fmt.Println(err)
	}
	return nil
}

func DeleteGroupInvitation(inviter, invitee, groupId string) error {
	_, err := Db.Exec(`DELETE FROM notifications WHERE toUser = ? AND fromId = ? AND type = 'group_invite'`, invitee, inviter)
	if err != nil {
		fmt.Println(err)
	}
	return nil
}

func SendGroupInvite(toUsers []string, groupId string, fromId string) error {
	// Retrieve the group name from the database.
	statement := `SELECT group_name FROM groups WHERE group_id = ?`
	groupName := ""
	err := Db.QueryRow(statement, groupId).Scan(&groupName)
	if err != nil {
		fmt.Println(err)
		return err // Handle the error or return it as appropriate.
	}
	usersToRemove := []string{}
	for _, toUser := range toUsers {
		var temp string

		// Execute the SQL query.
		if err := Db.QueryRow(statement, fromId, groupId, toUser).Scan(&temp); err != nil {
			// If there's an error (e.g., no matching notification found), add the user to the list of users to remove.
			if err == sql.ErrNoRows {
				usersToRemove = append(usersToRemove, toUser)
			}
		}
	}
	// Define the notification insert statement.
	statement = `INSERT INTO notifications (id, toUser, fromId, groupId, type, message, unread, link, time)
				VALUES (?, ?, ?, ?, 'group_invite', 'group_invite', 1, ?, CURRENT_TIMESTAMP)`

	// Create a transaction to ensure all notifications are inserted or none if an error occurs.
	tx, err := Db.Begin()
	if err != nil {
		fmt.Println(err)
		return err // Handle the error or return it as appropriate.
	}
	// Iterate through each user and insert a notification.
	for _, toUser := range usersToRemove {
		notificationUUID := uuid.New().String()
		notificationURL := "/group?id=" + groupId

		_, err := tx.Exec(statement, notificationUUID, toUser, fromId, groupId, notificationURL)
		if err != nil {
			fmt.Println(err)
			tx.Rollback() // Rollback the transaction if an error occurs.
			return err
		}
	}

	// Commit the transaction if all notifications were inserted successfully.
	err = tx.Commit()
	if err != nil {
		fmt.Println(err)
		tx.Rollback() // Rollback the transaction if there's an error during commit.
		return err
	}

	return nil
}

func AddGroup(groupId, groupName, groupDescription, groupImage, groupCreator string) error {
	statement := `INSERT INTO groups VALUES (?, ?, ?, ?, ?)`
	_, err := Db.Exec(statement, groupId, groupName, groupCreator, groupDescription, groupImage)
	if err != nil {
		fmt.Println(err)
		return fmt.Errorf("failed to create group: %w", err)
	}
	statement = `INSERT INTO group_relations VALUES (?, ?)`
	_, err = Db.Exec(statement, groupCreator, groupId)
	if err != nil {
		fmt.Println(err)
		return fmt.Errorf("failed to create group: %w", err)
	}
	return nil
}

func LikePost(userId, postId string) {
	_, err := Db.Exec("INSERT INTO post_likes (User_id, Post_id) VALUES (?, ?)", userId, postId)
	if err != nil {
		fmt.Println(err)
	}
	rows, err := Db.Query("select posts.user_id from posts WHERE posts.Id = ?", postId)
	if err != nil {
		fmt.Println(err)
	}
	postUser := pkg.UserID{}
	for rows.Next() {
		rows.Scan(&postUser.ID)
	}
	notificationUUID := uuid.New().String()
	notificationURL := "/feed?id=" + postId
	_, err = Db.Exec(`INSERT INTO notifications (id, toUser, fromId, groupId, type, message, unread, link, time)
		VALUES
		(?,?, ?, '', 'like', 'liked_post', 1, ?, CURRENT_TIMESTAMP)`, notificationUUID, postUser.ID, userId, notificationURL)

}

func PostLikedByUser(userId, postId string) pkg.PostLiked {

	rows, err := Db.Query("SELECT COUNT(*) AS LIKED FROM post_likes WHERE User_Id = ? AND Post_Id = ? ", userId, postId)
	if err != nil {
		fmt.Println(err)
	}
	liked := pkg.PostLiked{}
	for rows.Next() {
		rows.Scan(&liked.Liked)

	}
	return liked
}

func GetUserNotifications(userId string) []pkg.Notification {

	notifications := []pkg.Notification{}
	rows, err := Db.Query(`SELECT id, 
		CASE WHEN users.Nickname IS NULL THEN '' ELSE users.Nickname END as senderName, 
		CASE WHEN group_name IS NULL THEN '' ELSE group_name END as groupName, 
		CASE WHEN groupId IS NULL THEN '' ELSE groupId END as groupId,
		type, message, unread, link, time, fromId FROM notifications 
		LEFT JOIN users on notifications.fromId = users.user_id
		LEFT JOIN groups on notifications.groupId = groups.group_id WHERE toUser = ? ORDER BY time DESC`, userId)
	defer rows.Close()
	if err != nil {
		fmt.Println(err)
	}
	for rows.Next() {
		notification := pkg.Notification{}
		err = rows.Scan(&notification.Id, &notification.SenderName, &notification.GroupName, &notification.GroupId, &notification.Type, &notification.Message, &notification.Unread, &notification.Link, &notification.Time, &notification.FromId)
		if err != nil {
			fmt.Println(err)
		}
		notifications = append(notifications, notification)
	}
	return notifications
}

func SetNotificationRead(notificationId string) error {
	_, err := Db.Exec(`UPDATE notifications SET unread = 0 WHERE id = ?`, notificationId)
	if err != nil {
		fmt.Println(err)
		return err
	}
	return nil
}

func UnreadNotificationsCount(userId string) pkg.Count {

	rows, err := Db.Query(`SELECT COUNT(*) AS COUNT FROM notifications
		LEFT JOIN users on notifications.fromId = users.user_id
		LEFT JOIN groups on notifications.groupId = groups.group_id WHERE toUser = ? AND Unread = '1'`, userId)
	if err != nil {
		fmt.Println(err)
	}
	count := pkg.Count{}
	for rows.Next() {
		rows.Scan(&count.Count)

	}
	return count
}
