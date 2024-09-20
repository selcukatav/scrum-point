package server

import "github.com/selcukatav/scrum-point/api/routes"

func Run() {
	e := routes.New()

	e.Logger.Fatal(e.Start(":3000"))
}
