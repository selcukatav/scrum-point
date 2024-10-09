package handlers

import (
	"net/http"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

type SessionResponse struct {
	SessionId string `json:"sessionId"`
	Message string `json:"message"`
}

//creates a session with unique uuid to make the experience private 
func CreateSession(c echo.Context) error {
	sessionId := uuid.New().String()
	return c.JSON(http.StatusOK, SessionResponse{SessionId: sessionId})
}

//makes user join to others session
func JoinSession(c echo.Context) error {
	sessionId:=c.Param("sessionId")
	return c.JSON(http.StatusOK,SessionResponse{
		SessionId: sessionId,
		Message: "Joined to the session",
	})
}