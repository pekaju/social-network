package helpers

import (
	"encoding/json"
	"fmt"
	"social-network/pkg"
	"social-network/pkg/db/sqlite"
	"time"
)

// Event is the Messages sent over the websocket
// Used to differ between different actions
type Event struct {
	// Type is the message type sent
	Type string `json:"type"`
	// Payload is the data Based on the Type
	Payload json.RawMessage `json:"payload"`
}

// EventHandler is a function signature that is used to affect messages on the socket and triggered
// depending on the type
type EventHandler func(event Event, c *Client) error

const (
	// EventSendMessage is the event name for new chat messages sent
	EventSendMessage = "send_message"
	// EventNewMessage is a response to send_message
	EventNewMessage = "new_message"
	// EventChangeRecipient is event when switching recipient
	EventChangeRecipient = "change_recipient"
	// EventGetUsers gets the users for the chat
	EventGetUsers = "get_users"
	// EventSetStatus gets the users for the chat
	EventSetStatus = "set_status"
	// EventCloseConnection closes the client connection
	EventCloseConnection = "close_connection"
	// LoadMoreRows loads more rows to the chat
	LoadMoreRows = "load_more_rows"
	// TypingInProgress is used to digess when typing is in progress
	TypingInProgress = "typing_in_progress"
)

const ChatRowsPerFetch = 15

// SendMessageHandler will send out a message to recipient in the chat
func SendMessageHandler(event Event, c *Client) error {
	// Marshal Payload into wanted format
	var chatevent pkg.SendMessageEvent
	if err := json.Unmarshal(event.Payload, &chatevent); err != nil {
		return fmt.Errorf("bad payload in request: %v", err)
	}

	// Prepare an Outgoing Message to others
	var broadMessage pkg.NewMessageEvent

	broadMessage.Sent = time.Now().Format("2006-01-02 15:04:05")
	broadMessage.Message = chatevent.Message
	broadMessage.From = chatevent.From
	broadMessage.To = chatevent.To
	sqlite.PushMessageToDatabaseNew(broadMessage)
	groups := sqlite.GetGroups()
	isGroup := false
	for _, group := range groups {
		if group.GroupId == chatevent.To {
			isGroup = true
			followers := sqlite.GetGroupFollowers(group.GroupId)
			for _, follower := range followers {
				for client := range c.manager.clients {
					if client.user.Id == follower.Id {
						broadMessage.From = chatevent.From
						broadMessage.To = follower.Id
						broadMessage.GroupId = chatevent.To
						data, err := json.Marshal(broadMessage)
						if err != nil {
							return fmt.Errorf("failed to marshal broadcast message: %v", err)
						}

						// Place payload into an Event
						var outgoingEvent Event
						outgoingEvent.Payload = data
						outgoingEvent.Type = EventNewMessage
						client.egress <- outgoingEvent
					}
				}
			}
			break;
		}
	}
	if isGroup {
		return nil;
	}
	data, err := json.Marshal(broadMessage)
	if err != nil {
		return fmt.Errorf("failed to marshal broadcast message: %v", err)
	}

	// Place payload into an Event
	var outgoingEvent Event
	outgoingEvent.Payload = data
	outgoingEvent.Type = EventNewMessage

	for client := range c.manager.clients {
		fmt.Println(client.user.Id)
	}
	for client := range c.manager.clients {
		if client.user.Id == c.recipientId {
			client.egress <- outgoingEvent
		}
	}
	for client := range c.manager.clients {
		if client.user.Id == c.user.Id {
			client.egress <- outgoingEvent
		}
	}
	return nil
}

func TypingInProgressHandler(event Event, c *Client) error {
	// Place payload into an event

	var typingEvent pkg.TypingInProgressEvent
	if err := json.Unmarshal(event.Payload, &typingEvent); err != nil {
		return fmt.Errorf("failed to marshal typing in progress event: %v", err)
	}
	data, err := json.Marshal(typingEvent)
	if err != nil {
		return fmt.Errorf("failed to marshal broadcast message: %v", err)
	}

	// Place payload into an Event
	var outgoingEvent Event
	outgoingEvent.Payload = data
	outgoingEvent.Type = TypingInProgress
	for client := range c.manager.clients {
		// Only send to recipient
		if client.user.Id == c.recipientId {
			client.egress <- outgoingEvent
		}

	}
	return nil
}

type ChangeRecipientEvent struct {
	RecipientId string `json:"recipient"`
}

// ChangeRecipientHandler will handle switching of different users
func ChangeRecipientHandler(event Event, c *Client) error {
	// Marshal Payload into wanted format
	var changeRecipientEvent ChangeRecipientEvent
	if err := json.Unmarshal(event.Payload, &changeRecipientEvent); err != nil {
		return fmt.Errorf("bad payload in request: %v", err)
	}
	// Add Client to chat room
	c.recipientId = changeRecipientEvent.RecipientId

	// Place payload into an Event
	var outgoingEvent Event
	outgoingEvent.Payload = sqlite.GetSingleChatData(c.user.Id, changeRecipientEvent.RecipientId, ChatRowsPerFetch)
	outgoingEvent.Type = "chat_data"
	c.egress <- outgoingEvent

	return nil
}

type LoadMoreRowsEvent struct {
	RecipientId string `json:"recipientId"`
	Rows        int    `json:"rows"`
}

func LoadMoreRowsHandler(event Event, c *Client) error {
	// Marshal Payload into wanted format
	var loadMorerowsEvent LoadMoreRowsEvent
	if err := json.Unmarshal(event.Payload, &loadMorerowsEvent); err != nil {
		return fmt.Errorf("bad payload in request: %v", err)
	}

	// Place payload into an Event
	var outgoingEvent Event
	outgoingEvent.Payload = sqlite.GetSingleChatData(c.user.Id, loadMorerowsEvent.RecipientId, loadMorerowsEvent.Rows)
	outgoingEvent.Type = "chat_extra_data"
	c.egress <- outgoingEvent

	return nil
}

func reverseChatData(input []pkg.NewMessageEvent) []pkg.NewMessageEvent {
	if len(input) == 0 {
		return input
	}
	return append(reverseChatData(input[1:]), input[0])
}

// SendStatusHandler broadcasts a message to users that the user status has changed
func SendStatusHandler(c *Client) error {
	// Place payload into an Event
	var outgoingEvent Event
	rawMessage := sqlite.GetUserStatus(c.user.Id)

	outgoingEvent.Payload = rawMessage
	outgoingEvent.Type = "user_status_change"

	for client := range c.manager.clients {
		client.egress <- outgoingEvent
	}
	return nil
}
func CloseConnectionHandler(event Event, c *Client) error {
	fmt.Println("CLOSE CONNECTION:")
	c.manager.removeClient(c)
	return nil
}
