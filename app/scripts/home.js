var app = angular.module("NETJOCKEY");

app.controller('CreateRoomController', function($scope, $rootScope, $http, $location){
  $scope.submitRoomInfo = function(){
    $http({
      method: 'POST',
      url: $rootScope.serverURL+'/v1/rooms/add'
    }).then(function(response){
      $scope.roomInfo = response.data.roomInfo;
      $http({
        method: 'POST',
        url: $rootScope.serverURL+'/v1/room/'+$scope.roomInfo.id+'/rename',
        data: JSON.stringify({name: $scope.roomName})
      }).then(function(response){
        $location.path('/room/'+$scope.roomInfo.id);
      });
    });
  };
});

app.controller('RoomListController', function($scope, $rootScope, $http){
  $scope.roomList = [];
  $http({
    method: 'GET',
    url: $rootScope.serverURL+'/v1/rooms'
  }).then(function(response){
    $scope.roomList = response.data.rooms;
  });
});
