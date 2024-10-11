package routes

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/selcukatav/scrum-point/api/handlers"
)

func New() *echo.Echo {
	e := echo.New()

	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:5173"},
		AllowMethods: []string{http.MethodGet, http.MethodPost},
	}))

	//open channel for ws
	go handlers.HandleBroadcast()

	//POST
	e.POST("/vote", handlers.CastVote)
	e.POST("/create-session", handlers.CreateSession)
	e.POST("/export", handlers.ExportExcel)
	//e.POST("/clear-votes", handlers.ClearVotes)

	//GET
	e.GET("/join-session", handlers.JoinSession)
	//e.GET("/results", handlers.GetResults)
	e.GET("/ws/:sessionId", handlers.HandleConnections)

	return e
}
