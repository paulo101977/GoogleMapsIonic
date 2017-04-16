angular.module('starter.controllers')


.controller('SavedCtrl', function($rootScope , $scope, Chats , LocalStorageService) {
  
  //restore the locally saved
  $scope.allSaved = LocalStorageService.getData('savedLocal');
    
  //console.log('allsaved' , $scope.allSaved)

  $scope.remove = function(index) {
    $scope.allSaved.splice($scope.allSaved[index] , 1);
    
    LocalStorageService.updateData ('savedLocal', $scope.allSaved);
  };
    
  //receive new data from localstorageservice
  $rootScope.$on("savedItemChange", function(event , args){
      console.log('args' , args)
      $scope.allSaved = args.newData;
  });
})