package handlers

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/selcukatav/scrum-point/api/domains"
)

// handles casting vote from user. blocks multiple casts in one vote
var (
	votes       = make(map[string]int)
	clientVotes = make(map[string]string)
)

func CastVote(c echo.Context) error {

	req := new(domains.VoteMessage)
	if err := c.Bind(req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Invalid Request",
		})
	}
	mutex.Lock()
	defer mutex.Unlock()

	clientId := req.ClientId
	selectedSize := req.Size

	if previousVote, ok := clientVotes[clientId]; ok {

		if previousVote == selectedSize {
			return c.JSON(http.StatusConflict, map[string]string{
				"message": "You have already choose this size.",
			})
		}

		votes[previousVote]--
	}
	clientVotes[clientId] = selectedSize
	votes[selectedSize]++

	return c.JSON(http.StatusOK, map[string]string{
		"selectedSize": selectedSize,
	})
}
