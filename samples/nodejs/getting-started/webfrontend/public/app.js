// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

var app = angular.module('myApp', ['ngRoute']);

app.controller('MainController', function($scope, $http) {

    $scope.messages = [];
    $scope.sayHelloToServer = function() {
        $http.get("/api?_=" + Date.now()).then(function(response) {
            $scope.messages.push(response.data);
        });
    };
    
    $scope.sayHelloToServer();

    $scope.longRunningStatus = [];
    $scope.longRunningCount = 2;
    $scope.launchLongRunning = function() {
        $scope.longRunningCount = angular.element(document.querySelector('#longRunning')).val();
        console.log($scope.longRunningCount);
        $scope.longRunningStatus = [];
        for(var i=0; i < $scope.longRunningCount; ++i) {
            $http.get("/long").then(function(response){
                $scope.longRunningStatus.push(response.data);
            });
        }
    }
});