angular.module('starter.controllers')
.controller('GoogleMapsCtrl', 
//inject any instance
['$rootScope' , '$scope' , 'GoogleMapService' , 'ModalService' ,  '$cordovaGeolocation',
function($rootScope , $scope , GoogleMapService , ModalService , $cordovaGeolocation) {
    
    //create a instance of modal
    ModalService.appendModal($scope);
    
    //setup the geolocation
    var options = {timeout: 10000, enableHighAccuracy: true};
    
    //there are nothing to be saved
    $scope.couldSave = false;
                                   
    //get the initial position
    $cordovaGeolocation.getCurrentPosition(options)
    .then(function(position){
        GoogleMapService.initMap($scope , position);
        GoogleMapService.addInitialMarker($scope);
        $scope.couldSave = true; //if could or not save (modal and other purpose)
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
            GoogleMapService.travelTo($rootScope , $scope, searchLocal);
            return;
        }
    }
    
    //save new local to 
    $scope.saveLocal = function(){
        GoogleMapService.saveCurrentLocal($rootScope, $scope);
    }
}])
