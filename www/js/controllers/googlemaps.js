angular.module('starter.controllers')
.controller('GoogleMapsCtrl', 
//inject any instance
['$scope' , 'GoogleMapService' , 'ModalService' ,  '$cordovaGeolocation',
function($scope , GoogleMapService , ModalService , $cordovaGeolocation) {
    
    //create a instance of modal
    ModalService.appendModal($scope);
    
    //setup the geolocation
    var options = {timeout: 10000, enableHighAccuracy: true};
                                   
    //get the initial position
    $cordovaGeolocation.getCurrentPosition(options)
    .then(function(position){
        GoogleMapService.initMap($scope , position);
        GoogleMapService.addInitialMarker($scope);
    }, function(error){
        $scope.openModal("Por favor, verifique sua internet!");
    });
                               

    $scope.openModal = function(message) {
      ModalService.setMessage($scope, message);
      $scope.modal.show();
    };

    $scope.closeModal = function() {
      ModalService.setMessage($scope, "");
      $scope.modal.hide();
    };
                                   
    //local to search                            
    $scope.searchLocal = "";
    $scope.lastLocation = null; //the last search location
    
    //set the new local on click in search button
    $scope.applySearch = function(searchLocal){
        console.log("local" , searchLocal);
        
        if(!searchLocal){ 
            $scope.openModal("Digite uma localidade a ser pesquisada!");
            return;
        }
        
        if(searchLocal.length == 0){
            $scope.openModal("Digite uma localidade a ser pesquisada!");
            return;
        }
        
        if(searchLocal){
            //showTooltip("O campo de localidade não pode ser vazio.");
            GoogleMapService.travelTo($scope, searchLocal);
            return;
        }
    }
    
    //save new local to 
    $scope.saveLocal = function(){
        GoogleMapService.saveCurrentLocal($scope);
    }
}])
