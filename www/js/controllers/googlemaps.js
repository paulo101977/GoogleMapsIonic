angular.module('starter.controllers')
.controller('GoogleMapsCtrl', 
//inject any instance
['$rootScope' , '$scope' , 'GoogleMapService' , 'ModalService' ,  '$cordovaGeolocation', '$timeout',
function($rootScope , $scope , GoogleMapService , ModalService , $cordovaGeolocation , $timeout) {
    
    //create a instance of modal
    ModalService.appendModal($scope);
    
    //setup the geolocation
    var options = {
        maximumAge: 30000,
        timeout: 15000,
        enableHighAccuracy: false 
    };
    
    //there are nothing to be saved
    $scope.couldSave = false;
                                   
    //get the initial position
    /*$cordovaGeolocation.getCurrentPosition(options)
    .then(function(position){
        GoogleMapService.initMap($scope , position);
        GoogleMapService.addInitialMarker($scope);
        $scope.couldSave = true; //if could or not save (modal and other purpose)
    }, function(error){
        $scope.openModal("Por favor, verifique sua internet!<br>" + error.code + "<br>" + error.message);
        
        //lat: 40.674, lng: -73.945
        //fake, plugin fail
        var position = {
            coords: {latitude: 40.674 , longitude: -73.945}
        }
        
        GoogleMapService.initMap($scope , position);
        GoogleMapService.addInitialMarker($scope);
    });*/
    
    //lat: 40.674, lng: -73.945
        //fake, plugin fail
        var position = {
            coords: {latitude: 40.674 , longitude: -73.945}
        }
        
        $timeout(function(){
            GoogleMapService.initMap($scope , position);
            GoogleMapService.addInitialMarker($scope);
        })
        
                               

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
