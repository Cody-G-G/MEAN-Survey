'use strict';

var angular = require('angular');
var logger = require('./logger.js');
var User = require('./data/models/user');

angular
    .module('surveyApp')
    .controller('loginController', ['$scope', '$http', '$location', function ($scope, $http, $location) {
        $scope.username = '';
        $scope.password = '';
        // used for positive / negative alerts on registration attempt
        $scope.loginAlertColor = '#ffffff';
        $scope.loginMessage = '';

        $scope.submit = function () {
            login();
        };

        // Function used to login user, calling '/api/login' endpoint exposed on server, with username and password as
        //  arguments, and callbacks for success / failure, alerting the user appropriately
        function login() {
            logger.log('Login POST !');
            $http
                .post('/api/login', JSON.stringify({'username': $scope.username, 'password': User.generateHash($scope.password)}))
                .then(
                    function successCallback(response) {
                        logger.log('Login response : ' + response.status);
                        styleLoginAlert(true);
                        $location.path('/survey');
                    },
                    function errorCallback(response) {
                        logger.log('Error: response with status ' + response.status);
                        styleLoginAlert(false);
                    });
        }

        // function for modifying styling & text in login form to alert user of success / failure
        function styleLoginAlert(success) {
            if (success) {
                logger.log('User ' + $scope.username + ' logged in!');
                $scope.loginAlertColor = '#1DC91D';
                $scope.loginMessage = 'Login success!'
            } else {
                logger.log('Invalid login attempt for user ' + $scope.username);
                $scope.loginAlertColor = '#ff0000';
                $scope.loginMessage = 'Invalid username and/or password!';
            }
        }

    }]);
