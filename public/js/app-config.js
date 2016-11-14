'use strict';

var angular = require('angular');

// configuration for 'surveyApp' angular module
angular
    .module('surveyApp')
    .config(['$routeProvider', '$locationProvider',
        function ($routeProvider, $locationProvider) {

            // setting up angular routes to get the respective static html files from appropriate server routes (on the client side)
            $routeProvider
                .when('/login', {
                    templateUrl: '/views/login.html',
                    controller: 'loginController'
                })
                .when('/register', {
                    templateUrl: '/views/registration.html'
                })
                .when('/survey', {
                    templateUrl: '/views/survey.html'
                })
                .when('/', {
                    templateUrl: '/views/login.html',
                    controller: 'loginController'
                });

            $locationProvider.html5Mode({enabled: true, requireBase: false});
        }
    ]);

