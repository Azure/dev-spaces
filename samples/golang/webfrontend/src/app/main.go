package main

import (
	"fmt"
	"html/template"
	"log"
	"net/http"
	"strconv"
	"sync"
)

// ServerMessage is a representation of a message from server
type ServerMessage struct {
	Value string
}

// PageVariables is a representation of a server page
type PageVariables struct {
	PageTitle   string
	PageMessage ServerMessage
	PageButton  string
}

var counter int
var mutex = &sync.Mutex{}

func main() {
	http.HandleFunc("/", HomePage)
	http.HandleFunc("/api", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Hello from webfrontend")
	})
	log.Fatal(http.ListenAndServe(":80", nil))
}

// HomePage is triggered on load of the server
func HomePage(w http.ResponseWriter, r *http.Request) {
	Title := "Server"
	MyButton := "Click Me (Reload)"
	mutex.Lock()
	counter++
	MyMessage := ServerMessage{strconv.Itoa(counter)}
	mutex.Unlock()

	MyPageVariables := PageVariables{
		PageTitle:   Title,
		PageMessage: MyMessage,
		PageButton:  MyButton,
	}

	t, err := template.ParseFiles("index.html") //parse the html file homepage.html
	if err != nil {                             // if there is an error
		log.Print("template parsing error: ", err) // log it
	}
	err = t.Execute(w, MyPageVariables) //execute the template and pass it the MyPageVariables struct to fill in the gaps
	if err != nil {                     // if there is an error
		log.Print("template executing error: ", err) //log it
	}
}
