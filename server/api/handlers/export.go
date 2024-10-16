package handlers

import (
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
	"github.com/selcukatav/scrum-point/api/domains"
	"github.com/xuri/excelize/v2"
)

// exports the saved list to excel.

func ExportExcel(c echo.Context) error {

	var voteList []domains.VoteList

	if err := c.Bind(&voteList); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"message": "Unvalid Request",
		})
	}

	f := excelize.NewFile()

	boldStyle, err := f.NewStyle(&excelize.Style{
		Font: &excelize.Font{
			Bold: true,
		},
	})
	if err != nil {
		return err
	}
	f.SetCellValue("Sheet1", "A1", "Task Name")
	f.SetCellValue("Sheet1", "B1", "Size")

	f.SetCellStyle("Sheet1", "A1", "A1", boldStyle)
	f.SetCellStyle("Sheet1", "B1", "B1", boldStyle)

	for i, vote := range voteList {
		row := i + 2
		f.SetCellValue("Sheet1", "A"+strconv.Itoa(row), vote.TaskName)
		f.SetCellValue("Sheet1", "B"+strconv.Itoa(row), vote.Size)

	}

	c.Response().Header().Set(echo.HeaderContentType, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
	c.Response().Header().Set(echo.HeaderContentDisposition, `attachment; filename="votes.xlsx"`)

	return f.Write(c.Response().Writer)
}

func SaveVote(c echo.Context) error {
	var requestData struct {
		SessionId string           `json:"sessionId"`
		Vote      domains.VoteList `json:"vote"`
	}

	if err := c.Bind(&requestData); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"message": "Geçersiz veri formatı",
		})
	}
	savedVote := requestData.Vote
	c.Logger().Infof("Oylama kaydedildi: %v", savedVote)

	return c.JSON(http.StatusOK, map[string]string{
		"message": "Oylama başarıyla kaydedildi",
	})
}
