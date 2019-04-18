// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

package main

import (
	"fmt"
	"html/template"
	"log"
	"net"
	"net/http"
	"strconv"
)

// pageVariables is a representation of a server page
type pageVariables struct {
	PageTitle      string
	PageButton     string
	DefaultCounter int
}

var counter int

func main() {
	counter = 0
	http.HandleFunc("/", HomePage)
	http.HandleFunc("/counter", ManageCounter)
	http.HandleFunc("/api", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Hello from webfrontend")
	})

	// Start the server at http://localhost:80
	listener, err := net.Listen("tcp", ":80")
	if err != nil {
		log.Fatal("Listen failed: ", err)
	}
	fmt.Println("Server is listening on port", listener.Addr().(*net.TCPAddr).Port)
	log.Fatal(http.Serve(listener, nil))
}

// HomePage is triggered on load of the server
func HomePage(w http.ResponseWriter, r *http.Request) {
	title := "Server"
	myButton := "Click Me"
	myPageVariables := pageVariables{
		PageTitle:      title,
		PageButton:     myButton,
		DefaultCounter: counter,
	}

	// Load the index.html template.
	t, err := template.ParseFiles("index.html") //parse the html file index.html
	if err != nil {                             // if there is an error
		log.Print("template parsing error: ", err) // log it
	}
	err = t.Execute(w, myPageVariables) //execute the template and pass it the myPageVariables struct to fill in the gaps
	if err != nil {                     // if there is an error
		log.Print("template executing error: ", err) //log it
	}
}

// ManageCounter is triggered on click of the button
func ManageCounter(w http.ResponseWriter, r *http.Request) {
	messages := make(chan string)
	go func() {
		counter++
		messages <- strconv.Itoa(counter)
	}()
	myMessage := <-messages
	fmt.Fprintln(w, myMessage)
}
