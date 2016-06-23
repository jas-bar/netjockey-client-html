var app = angular.module("NETJOCKEY", ['ngRoute']);

app.config(function($routeProvider){
  $routeProvider.when('/', {
    templateUrl: 'app/views/home.html'
  });
  $routeProvider.when('/room/:roomID', {
    templateUrl: 'app/views/room.html',
    controller: 'RoomController'
  });
  $routeProvider.otherwise({
    redirectTo: '/'
  });
});

app.run(function($http, $rootScope, $window){
  $http.defaults.headers.post["Content-Type"] = "application/json";
  $rootScope.serverURL = config.serverUrl;
  $rootScope.Header = config.header;
  $rootScope.MOTD = motds[Math.floor(Math.random() * motds.length)];
  $rootScope.RoomSongLimit = config.roomSongLimit;
  
  console.log("[DEBUG]: Server url: " + config.serverUrl);
});
