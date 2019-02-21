var express = require('express');
var request = require('request');
var app = express();
app.use(express.static(__dirname + '/public'));

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
        res.send('Hello from webfrontend and ' + body);
    });
 });

var port = process.env.PORT || 80;
var server = app.listen(port, function () {
    console.log('Listening on port ' + port);
});

process.on("SIGINT", () => {
    process.exit(130 /* 128 + SIGINT */);
});

process.on("SIGTERM", () => {
    console.log("Terminating...");
});
