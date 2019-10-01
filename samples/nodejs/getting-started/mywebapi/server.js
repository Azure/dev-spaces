// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

var express = require('express');
var app = express();

app.get('/', function (req, res) {
    res.send('Hello from mywebapi');
});

var port = process.env.PORT || 3001;
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