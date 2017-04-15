angular.module('starter.controllers', [])

/*.controller('GoogleMapsCtrl', ['$scope' , 'GoogleMapService' ,  '$cordovaGeolocation',  
                               function($scope , GoogleMapService , $cordovaGeolocation) {
    
    var options = {timeout: 10000, enableHighAccuracy: true};
                                   
    //get the initial position
    $cordovaGeolocation.getCurrentPosition(options)
    .then(function(position){
        GoogleMapService.initMap($scope , position);
        GoogleMapService.addInitialMarker($scope);
    }, function(error){
        console.log("Could not get location");
    });
    
}])*/

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
