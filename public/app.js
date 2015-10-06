'use strict'

var artemis = angular.module('artemis', [
  'ngRoute',
  'ngResource',
  'artemis.game',
  'artemis.setup',
  'artemis.navbar',
  'artemis.score'
])

artemis.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
  // Just for Kurt
  $locationProvider.hashPrefix('!')
  $routeProvider.otherwise({redirectTo: '/'})
}])
