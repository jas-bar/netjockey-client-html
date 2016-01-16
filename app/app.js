var app = angular.module("DUDJ", ['ngRoute']);

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

dudjMOTDS = ["Uz bez tresy.. :(",
"Dizajner by sa zisiel!",
"Dudududududu dudududu...",
"Vyrobene 100% na slove.... v cesku!",
"Chat spam ka... aha chat tu neni",
"Niekdo by povedal ze sa tento nadpis stale meni",
"Credits: CEO - Dusan Baran, Programmer - Dusan Baran, Designer - Dusan Baran, ... no a Jasek",
"¯\\_(ツ)_/¯",
"ヽ༼ຈل͜ຈ༽ﾉＳＬＡＭ ＹＯＵＲ ＪＡＭヽ༼ຈل͜ຈ༽ﾉ"];

app.run(function($http, $rootScope){
  $http.defaults.headers.post["Content-Type"] = "application/json";
  $rootScope.serverURL = "http://dudj-jasbar.rhcloud.com";
  $rootScope.dudjHeader = "DUDJ pre-alpha";
  $rootScope.dudjMOTD = dudjMOTDS[Math.floor(Math.random() * dudjMOTDS.length)];
});
