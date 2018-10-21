package main

import (
	"fmt"
	"log"
	"net/http"
)

func sayHelloHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello")
}

func pingHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Ping")
}

func main() {
	fmt.Println("Hello World!")
	http.HandleFunc("/", sayHelloHandler)
	http.HandleFunc("/api/ping", pingHandler)
	err := http.ListenAndServe(":80", nil)
	if err != nil {
		log.Fatal("ListenAndServe failed: ", err)
	}
}
