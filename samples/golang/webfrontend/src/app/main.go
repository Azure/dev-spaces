package main

import (
	"fmt"
	"html/template"
	"log"
	"net"
	"net/http"
	"strconv"
)

// serverMessage is a representation of a message from server
type serverMessage struct {
	Value string
}

// pageVariables is a representation of a server page
type pageVariables struct {
	PageTitle   string
	PageMessage serverMessage
	PageButton  string
}

var counter int

func main() {
	http.HandleFunc("/", HomePage)
	http.HandleFunc("/api", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Hello from webfrontend")
	})
	listener, err := net.Listen("tcp", ":80")
	if err != nil {
		log.Fatal("Listen failed: ", err)
	}
	fmt.Println("Server is listening on port", listener.Addr().(*net.TCPAddr).Port)
	fmt.Println("press Ctrl+C to detach")
	log.Fatal(http.Serve(listener, nil))
}

// HomePage is triggered on load of the server
func HomePage(w http.ResponseWriter, r *http.Request) {
	title := "Server"
	myButton := "Click Me (Reload)"
	messages := make(chan string)
	go func() {
		counter++
		messages <- strconv.Itoa(counter)
	}()
	myMessage := serverMessage{<-messages}

	myPageVariables := pageVariables{
		PageTitle:   title,
		PageMessage: myMessage,
		PageButton:  myButton,
	}

	t, err := template.ParseFiles("index.html") //parse the html file homepage.html
	if err != nil {                             // if there is an error
		log.Print("template parsing error: ", err) // log it
	}
	err = t.Execute(w, myPageVariables) //execute the template and pass it the myPageVariables struct to fill in the gaps
	if err != nil {                     // if there is an error
		log.Print("template executing error: ", err) //log it
	}
}
