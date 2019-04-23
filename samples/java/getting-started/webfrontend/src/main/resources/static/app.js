// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

var app = angular.module('myApp', ['ngRoute']);

app.controller('MainController', function($scope, $http) {

    $scope.messages = [];
    $scope.sayHelloToServer = function() {
        $http.get("/greeting?_=" + Date.now()).then(function(response) {
            $scope.messages.push(response.data);
        });
    };
    
    $scope.sayHelloToServer();
});