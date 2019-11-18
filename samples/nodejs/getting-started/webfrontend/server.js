// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));

var request = require('request');

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/api', function (req, res) {
    request({
       uri: 'http://mywebapi',
       headers: {
          /* propagate the dev space routing header */ 
          'azds-route-as': req.headers['azds-route-as']
       }
    }, function (error, response, body) {
        res.send('Hello from webfrontend again and  ' + body);
    });
 });

 app.get('/long', function(req, res) {
     request({
         uri: 'http://longrunning'
     }, function(errors, response, body) {
         if(!errors && response.statusCode == 200)
            res.send('Done');
        else
            res.send("ERROR");
     });
 });

var port = process.env.PORT || 3000;
var server = app.listen(port, function () {
    console.log('Listening on port ' + port);
});

process.on("SIGINT", () => {
    process.exit(130 /* 128 + SIGINT */);
});

process.on("SIGTERM", () => {
    console.log("Terminating...");
    server.close();
});
