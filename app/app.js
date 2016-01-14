app = angular.module("DUDJ", ['ngRoute', 'youtube-embed']);

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

app.run(function($rootScope, $window, $http){
  $http.defaults.headers.post["Content-Type"] = "application/json";
});

app.controller('RoomController', function($rootScope, $scope, $routeParams, $http){
  $rootScope.playlist = [];
  $rootScope.videoUUID = 0;
  $rootScope.roomID = $routeParams.roomID;
  $http({
    url: 'http://192.168.0.15:9000/v1/room/'+$rootScope.roomID,
    method: 'GET'
  }).then(function(response){
    $rootScope.room = response.data.roomInfo;
    $rootScope.startSeconds = response.data.currentSongTime;
    $rootScope.playlist = response.data.queue.playlist;
    $rootScope.playerVars = {
      origin: document.domain,
      start: $rootScope.startSeconds,
      enablejsapi: 1,
      controls: 0
    };
    $rootScope.videoID = $rootScope.playlist[0].id;
    $scope.videoID = $rootScope.videoID;
  });
  console.log("RoomController: "+$rootScope.videoID+" "+$rootScope.startSeconds);
});

app.controller('PlayerController', function($rootScope, $interval, $scope){
  $scope.$on('youtube.player.ready', function ($event, player) {
    player.seekTo($rootScope.startSeconds, false);
    player.playVideo();
  });
  $scope.$on('youtube.player.ended', function ($event, player) {
    //player.loadVideoById($scope.videoID, $scope.startSeconds);
  });
  $interval(function(){
    if(($rootScope.playlist[0]) && ($rootScope.playlist[0].uuid != $rootScope.videoUUID)) {
      console.log("[DEBUG]: Changing song");
      $rootScope.videoUUID = $rootScope.playlist[0].uuid;
      $rootScope.playerVars = {
        origin: document.domain,
        start: $rootScope.startSeconds,
        enablejsapi: 1,
        controls: 0
      };
      $rootScope.videoID = $rootScope.playlist[0].id;
      $scope.videoID = '';
      $scope.videoID = $rootScope.videoID;
    }
    console.log("PlayerController: "+$rootScope.videoID+" "+$rootScope.startSeconds);
  }, 1000);
});

app.controller('PlaylistController', function($rootScope, $http, $scope, $interval){
  $interval(function(){
    $http({
      method: 'GET',
      url: 'http://192.168.0.15:9000/v1/room/'+$scope.roomID+'/queue'
    }).then(function(response){
      $rootScope.playlist = response.data.playlist;
    });
    $http({
      method: 'GET',
      url: 'http://192.168.0.15:9000/v1/room/'+$scope.roomID+'/time'
    }).then(function(response){
      $rootScope.startSeconds = response.data.currentSongTime;
    });
    console.log("PlaylistController: "+$rootScope.videoID+" "+$rootScope.startSeconds);
  }, 1000);
});

app.controller('SubmitSongController', function($rootScope, $http, $scope){
  $scope.submitSong = function(){
    console.log("[DEBUG]: Submitting song: " + $rootScope.songURL);
    $http({
      url: 'http://192.168.0.15:9000/v1/room/'+$rootScope.roomID+'/add-song',
      method: 'POST',
      data: JSON.stringify({url: $scope.songURL})
    });
  }
});
