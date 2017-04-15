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
        console.log("Could not get location");
    });
                               

    $scope.openModal = function() {
      $scope.modal.show();
    };

    $scope.closeModal = function() {
      $scope.modal.hide();
    };
                                   
    //local to search                            
    $scope.searchLocal = "";
    $scope.lastLocation = null; //the last search location
    
    //set the new local on click in search button
    $scope.applySearch = function(searchLocal){
        console.log("local" , searchLocal);
        
        if(!searchLocal){ 
            $scope.openModal();
            return;
        }
        
        if(searchLocal.length == 0){
            $scope.openModal();
            return;
        }
        
        if(searchLocal){
            //showTooltip("O campo de localidade não pode ser vazio.");
            GoogleMapService.travelTo($scope, searchLocal);
            return;
        }
    }
}])

function showTooltip(){
    
}