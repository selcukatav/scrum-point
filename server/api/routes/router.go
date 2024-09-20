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

	e.GET("/", mainPage)
	e.POST("/vote", handlers.HandleVote)

	return e
}
func mainPage(c echo.Context) error {
	return c.String(http.StatusOK, "Hello, World!")
}
