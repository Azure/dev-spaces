package main

import (
	"fmt"
	"log"
	"net"
	"net/http"
)

func sayHelloHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello World")
}

func pingHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Ping")
}

func main() {
	http.HandleFunc("/", sayHelloHandler)
	http.HandleFunc("/healthz", pingHandler)
	listener, err := net.Listen("tcp", ":80")
	if err != nil {
		log.Fatal("Listen failed: ", err)
	}
	fmt.Println("Server is listening on port", listener.Addr().(*net.TCPAddr).Port)
	fmt.Println("press Ctrl+C to detach")
	log.Fatal(http.Serve(listener, nil))
}
