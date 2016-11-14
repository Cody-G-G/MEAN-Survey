'use strict';

var angular = require('angular');
var logger = require('./logger.js');

angular
    .module('surveyApp')
    .controller('registerController', ['$scope', '$http', '$location', function ($scope, $http, $location) {
        $scope.username = '';
        $scope.password = '';
        $scope.passwordConfirm = '';
        // used for positive / negative alerts on registration attempt
        $scope.registerAlertColor = '#ffffff';
        $scope.registerMessage = '';

        // form submission function, calling registerUser() if the password fields coincide, or alerting user if not
        $scope.submit = function () {
            $scope.password === $scope.passwordConfirm ? registerUser() : styleRegisterAlert(false);
        };

        // User registration function calling '/api/register' POST endpoint exposed on server, with username / password
        //  as arguments, and callbacks for success / failure, alerting user appropriately
        function registerUser() {
            logger.log('Register POST !');
            $http
                .post('/api/register', JSON.stringify({'username': $scope.username, 'password': $scope.password}))
                .then(
                    function successCallback(response) {
                        logger.log('Register response : ' + response.status);
                        styleRegisterAlert(true);
                        $location.path('/survey');
                    },
                    function errorCallback(response) {
                        logger.log('Error: response with status ' + response.status);
                        styleRegisterAlert(false)
                    });
        }

        // function for modifying styling & text in registration form to alert user of success / failure
        function styleRegisterAlert(success) {
            if (success) {
                logger.log('User ' + $scope.username + ' registered!');
                $scope.registerAlertColor = '#1DC91D';
                $scope.registerMessage = 'Registration success!'
            } else {
                logger.log('Invalid registration attempt for user ' + $scope.username);
                $scope.registerAlertColor = '#ff0000';
                $scope.registerMessage = 'Username taken or passwords don\'t match';
            }
        }

    }]);
