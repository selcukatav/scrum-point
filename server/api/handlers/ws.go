package handlers

import (
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
	"github.com/labstack/echo/v4"
)

type Client struct {
	Id   string
	Conn *websocket.Conn
}

type VoteMessage struct {
	Type     string `json:"type"`
	Size     string `json:"size,omitempty"`
	ClientId string `json:"clientId"`
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}
var (
	clients     = make(map[*websocket.Conn]bool)
	broadcast   = make(chan VoteMessage)
	votes       = make(map[string]int)
	clientVotes = make(map[string]string)
	mutex       = &sync.Mutex{}
)

// opens websocket connection with clients that want to connect
func HandleConnections(c echo.Context) error {
	ws, err := upgrader.Upgrade(c.Response(), c.Request(), nil)
	if err != nil {
		return err
	}
	defer ws.Close()

	clients[ws] = true
	defer func() {
		delete(clients, ws)
	}()
	for {
		var msg VoteMessage
		err := ws.ReadJSON(&msg)
		if err != nil {
			break
		}
		broadcast <- msg
	}

	return nil
}

// handles the message coming from clients thru ws
func HandleBroadcast() {
	for {
		msg := <-broadcast

		switch msg.Type {
		case "clear-votes":

			votes = make(map[string]int)
			clientVotes = make(map[string]string)

			data := map[string]interface{}{
				"votes": votes,
			}

			broadcastToClients("clear", data)

		case "show-results":
			mostVotedCard := getMostVotedCard()
			allVotes := votes
			data := map[string]interface{}{

				"mostVotedCard": mostVotedCard,
				"votes":         allVotes,
			}

			broadcastToClients("highlight", data)

		case "save-vote":
			vote := getMostVotedCard()
			data := map[string]interface{}{
				"vote": vote,
			}
			broadcastToClients("save-vote", data)

		}
	}
}

func broadcastToClients(messageType string, data map[string]interface{}) {

	for client := range clients {
		data["type"] = messageType
		err := client.WriteJSON(data)
		if err != nil {
			client.Close()
			delete(clients, client)
		}
	}
}

func getMostVotedCard() string {
	maxVotes := 0
	mostVotedCard := ""
	for size, count := range votes {
		if count > maxVotes {
			maxVotes = count
			mostVotedCard = size
		}
	}
	return mostVotedCard
}
