package main

import (
	"log"
	"net/http"
	"os"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	srv := NewServer(NewOrderStore())
	log.Printf("🍕 Awesome Pizza API server running on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, srv.Handler()))
}
