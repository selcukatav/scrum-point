package handlers

import (
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
	"github.com/labstack/echo/v4"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

var clients = make(map[*websocket.Conn]bool)
var broadcast = make(chan VoteMessage)

type VoteMessage struct {
	Type string `json:"type"`
	Size string `json:"size,omitempty"`
}

var userVotes = make(map[*websocket.Conn]string)
var votes = make(map[string]int)
var mutex = &sync.Mutex{}

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

func HandleBroadcast() {
	for {
		msg := <-broadcast
		mutex.Lock()

		switch msg.Type {
		case "vote":
			
			for client := range clients {
				if userVotes[client] != "" {
					votes[userVotes[client]]--
				}
				userVotes[client] = msg.Size
				votes[msg.Size]++
			}
		case "clear-votes":

			votes = make(map[string]int)
			userVotes = make(map[*websocket.Conn]string)

			for client := range clients {
				err := client.WriteJSON(map[string]interface{}{
					"type":            "clear",
					"votes":           votes,
					"highlightedCard": "",
				})
				if err != nil {
					client.Close()
					delete(clients, client)
				}
			}
			broadcastVotes()
		case "show-results":
			mostVotedCard := getMostVotedCard()
			for client := range clients {
				err := client.WriteJSON(map[string]interface{}{
					"type":          "highlight",
					"mostVotedCard": mostVotedCard,
				})
				if err != nil {
					client.Close()
					delete(clients, client)
				}
			}
		}

		mutex.Unlock()
	}
}

func broadcastVotes() {
	for client := range clients {
		err := client.WriteJSON(map[string]interface{}{
			"type":  "votes",
			"votes": votes,
		})
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
