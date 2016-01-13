app = angular.module("DUDJ", []);

app.run(function($rootScope, $window, $http){
  $http.defaults.headers.post["Content-Type"] = "application/json";
  $rootScope.vidoeUUID = 0;
  $rootScope.playlist = [];
  $window.onYouTubeIframeAPIReady = function(){
    $rootScope.player = new YT.Player('player', {
      showinfo: 0,
      disablekb: 0
    });
  };
});

app.controller('PlayerController', function($rootScope, $scope, $interval){
  $scope.$on('youtube.player.ready', function ($event, player) {
    $rootScope.player = player;
    player.playVideo();
  });
  $interval(function(){
    console.log("[DEBUG]: Refreshing player");
    if(($rootScope.playlist[0]) && ($rootScope.playlist[0].uuid != $rootScope.videoUUID)) {
      console.log("[DEBUG]: Changing song");
      $rootScope.player.loadVideoById($rootScope.playlist[0].id, $rootScope.startSeconds);
      $rootScope.videoUUID = $rootScope.playlist[0].uuid;
    }
  }, 3000);
});

app.controller('PlaylistController', function($http, $rootScope, $scope, $interval){
  $interval(function(){
    console.log("[DEBUG]: Refreshing playlist");
    $http({
      method: 'GET',
      url: 'http://192.168.0.15:9000/v1/room/a/queue'
    }).then(function(response){
      $rootScope.playlist = response.data.playlist;
      console.log($rootScope.playlist);
    });
    $http({
      method: 'GET',
      url: 'http://192.168.0.15:9000/v1/room/a/time'
    }).then(function(response){
      $rootScope.startSeconds = response.data.currentSongTime;
    });
  }, 3000);
});

app.controller('SubmitSongController', function($http, $scope){
  $scope.submitSong = function(){
    console.log("[DEBUG]: Submitting song: " + $scope.songURL);
    $http({
      url: 'http://192.168.0.15:9000/v1/room/a/add-song',
      method: 'POST',
      data: JSON.stringify({url: $scope.songURL})
    });
  }
});
