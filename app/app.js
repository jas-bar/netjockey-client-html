var app = angular.module("DUDJ", ['ngRoute']);

app.config(function($routeProvider){
  $routeProvider.when('/', {
    templateUrl: 'app/views/home.html',
    css: 'css/home.css'
  });
  $routeProvider.when('/room/:roomID', {
    templateUrl: 'app/views/room.html',
    controller: 'RoomController',
    css: 'css/room.css'
  });
  $routeProvider.otherwise({
    redirectTo: '/'
  });
});

dudjMOTDS = ["Uz bez tresy.. :(",
"Dizajner by sa zisiel!",
"Dudududududu dudududu...",
"Vyrobene 100% na slove.... v cesku!",
"Chat spam ka... aha chat tu neni",
"Niekdo by povedal ze sa tento nadpis stale meni"];

app.run(function($http, $rootScope){
  $http.defaults.headers.post["Content-Type"] = "application/json";
  $rootScope.serverURL = "http://dudj-jasbar.rhcloud.com";
  $rootScope.dudjHeader = "DUDJ pre-alpha";
  $rootScope.dudjMOTD = dudjMOTDS[Math.floor(Math.random() * dudjMOTDS.length)];
});
