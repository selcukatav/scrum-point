package handlers

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

type Vote struct {
	Size string `json:"size"`
}

func HandleVote(c echo.Context) error {

	vote := new(Vote)
	if err := c.Bind(vote); err != nil {
		return err
	}

	return c.JSON(http.StatusOK, map[string]string{
		"message": "Vote succeed!",
	})

}
