var app = angular.module('myApp', ['ngRoute']);

app.controller('MainController', function($scope, $http) {

    $scope.messages = [];
    $scope.sayHelloToServer = function() {
        $http.get("/greeting?_=" + Date.now(), {responseType: 'text'}).then(function(response) {
            $scope.messages.push(response.data);
        }, function(error) {
            cosnole.log(error);
        });
    };
    
    $scope.sayHelloToServer();
});