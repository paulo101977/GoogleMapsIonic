angular.module('starter.controllers')

.controller('HistoryCtrl', function($rootScope , $scope , LocalStorageService) {
  $scope.allHistory = LocalStorageService.getData('saveHistoricalLocal');
    
  $scope.clear = function(){
    LocalStorageService.updateData('saveHistoricalLocal' , []);
    $scope.allHistory = [];
  }
  
  //receive new data from localstorageservice
  $rootScope.$on("historyItemChange", function(event , args){
      $scope.allHistory = args.newData;
  });
});
