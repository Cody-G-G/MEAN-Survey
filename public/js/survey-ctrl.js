'use strict';

var angular = require('angular');
var logger = require('./logger.js');

angular
    .module('surveyApp')
    .controller('surveyController', ['$scope', '$http', '$location', function ($scope, $http, $location) {
        $scope.$http = $http;
        $scope.$location = $location;
        $scope.answers = [];

        checkUserSubmission();

        // setting up the survey questions, in an array
        $scope.questions = [];
        $scope.questions[0] = "What is your favorite food?";
        $scope.questions[1] = "How old were you when you first saw a shooting star?";
        $scope.questions[2] = "Why is the sky blue";
        $scope.questions[3] = "Is there a God?";
        $scope.questions[4] = "Are there any aliens?";
        $scope.questions[5] = "What is your phone number?";

        // setting up the survey answer options, in a 2D array (matrix)
        $scope.answerOptions = [];
        $scope.answerOptions[0] = [];
        $scope.answerOptions[1] = [];
        $scope.answerOptions[2] = [];
        $scope.answerOptions[0][0] = "Pasta";
        $scope.answerOptions[0][1] = "Pizza";
        $scope.answerOptions[0][2] = "Eggs & Bacon";
        $scope.answerOptions[1][0] = "Because molecules in the air scatter blue light from the sun more than they scatter red light";
        $scope.answerOptions[1][1] = "Aliens made it so";
        $scope.answerOptions[1][2] = "I have no idea";
        $scope.answerOptions[2][0] = "Yes";
        $scope.answerOptions[2][1] = "Maybe";
        $scope.answerOptions[2][2] = "No";
        $scope.answerOptions[2][3] = "Obviously. Who else would have built the pyramids?";

        // function used to log the user out, calling the '/api/logout/' endpoint exposed on the server
        $scope.logOut = function () {
            $http.get('/api/logout').then($location.path('/login'));
        };

        // function for form submission, calling '/api/survey'/ endpoint exposed on the server, with entries object as argument
        $scope.submitForm = function () {
            var entries = constructSubmission();
            $http.post('/api/survey', entries);
            $scope.userSubmissionExists = true;
        };

        // constructs the entries array with questions / answers currently in the form
        function constructSubmission() {
            var entries = [];

            for (var i = 0; i < $scope.questions.length; i++) {
                entries[i] = {};
                entries[i].question = $scope.questions[i];
                entries[i].answer = $scope.answers[i];
            }
            return entries;
        }

        // checks whether logged in user has already submitted survey --> if so, then populate the form answers
        function checkUserSubmission() {
            $http.get('/api/submissionexists').then(function (response) {
                $scope.userSubmissionExists = response.data;
                if ($scope.userSubmissionExists) populateAnswers();
            });
        }

        // gets survey answers previously submitted by user, populating in the form
        function populateAnswers() {
            $http.get('/api/survey').then(function (response) {
                var entries = response.data.entries;
                for (var i = 0; i < entries.length; i++) {
                    $scope.answers[i] = entries[i].answer;
                }
            });
        }
    }]);