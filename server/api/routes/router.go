package routes

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func New() *echo.Echo {
	e := echo.New()
	e.GET("/", mainPage)
	
	return e
}
func mainPage(c echo.Context) error {
	return c.String(http.StatusOK, "Hello, World!")
}
