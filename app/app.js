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

app.run(function($http, $rootScope){
  $http.defaults.headers.post["Content-Type"] = "application/json";
  $rootScope.serverURL = "http://dudj-jasbar.rhcloud.com";
});
