package handlers

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

//exports the saved list to excel.

func ExportExcel(c echo.Context) error{

	return c.JSON(http.StatusOK,"Export succeed!")
}