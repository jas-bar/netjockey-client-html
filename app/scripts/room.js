var app = angular.module("NETJOCKEY");

app.controller('RoomController', function($window, $location, $interval, $scope, $rootScope, $routeParams, $http){

  /*INIC variables*/
  $scope.playlist = [];
  $scope.videoUUID = 0;
  $scope.roomID = $routeParams.roomID;
  $scope.startSeconds = 0;

  /*ASK for room info*/
  $http({
    url: $rootScope.serverURL+'/v1/room/'+$scope.roomID+'?maxResults='+$rootScope.dudjRoomSongLimit,
    method: 'GET'
  }).then(function(response){
    $scope.roomInfo = response.data.roomInfo;
    $scope.startSeconds = response.data.currentSongTime;
    $scope.playlist = response.data.queue.playlist;
    $rootScope.currentRoomName = $scope.roomInfo.name;
  }, function(response){
    $location.path('/');
  });

  /*Creating YT player*/
  createPlayer = function(){
    $scope.player = new YT.Player('player', {
      playerVars: {
        origin: document.domain,
        enablejsapi: 1,
        controls: 1
      },
      events: {
        'onStateChange': function(event){
          switch(event.data){
            case YT.PlayerState.PAUSED:
              event.target.paused = true;
            break;
            case YT.PlayerState.PLAYING:
              if(event.target.paused) {
                event.target.paused = false;
                event.target.seekTo($scope.startSeconds, true);
              }
            break;
          }
        }
      }
    });
  };

  if(YT && YT.Player){
    createPlayer();
  } else {
    $window.onYouTubeIframeAPIReady = function(){
      createPlayer();
    };
  }

  /*Update player*/
  $interval(function(){
    if(($scope.playlist[0]) && ($scope.playlist[0].uuid != $scope.videoUUID)) {
      console.log("[DEBUG]: Changing song");
      $scope.videoUUID = $scope.playlist[0].uuid;
      $scope.player.loadVideoById($scope.playlist[0].id, $scope.startSeconds);
    }
  }, 1000);

  /*Update playlist*/
  $interval(function(){
    $http({
      method: 'GET',
      url: $rootScope.serverURL+'/v1/room/'+$scope.roomID+'/queue?maxResults='+$rootScope.dudjRoomSongLimit
    }).then(function(response){
      $scope.playlist = response.data.playlist;
    });
    $http({
      method: 'GET',
      url: $rootScope.serverURL+'/v1/room/'+$scope.roomID+'/time'
    }).then(function(response){
      $scope.startSeconds = response.data.currentSongTime;
    });
  }, 1000);
});

app.controller('SubmitSongController', function($http, $scope, $rootScope){
  $scope.submitSong = function(){
    console.log("[DEBUG]: Submitting song: " + $scope.songURL);
    $http({
      url: $rootScope.serverURL+'/v1/room/'+$scope.roomID+'/add-song',
      method: 'POST',
      data: JSON.stringify({url: $scope.songURL})
    });
    $scope.songURL = "";
  }
});
