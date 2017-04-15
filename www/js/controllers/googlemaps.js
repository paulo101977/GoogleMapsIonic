angular.module('starter.controllers')
.controller('GoogleMapsCtrl', ['$scope' , 'GoogleMapService' ,  '$cordovaGeolocation',  
function($scope , GoogleMapService , $cordovaGeolocation) {
    
    //start the map
    var options = {timeout: 10000, enableHighAccuracy: true};
                                   
    //get the initial position
    $cordovaGeolocation.getCurrentPosition(options)
    .then(function(position){
        GoogleMapService.initMap($scope , position);
        GoogleMapService.addInitialMarker($scope);
    }, function(error){
        console.log("Could not get location");
    });
                                   
    //local to search                            
    $scope.searchLocal = "";
    $scope.lastLocation = null; //the last search location
    
    //set the new local
    $scope.applySearch = function(searchLocal){
        console.log("local" , searchLocal);
        
        if(!searchLocal){ 
            showTooltip("Houve um erro inesperado. Por favor tente novamente");
            return;
        }
        
        if(searchLocal.length == 0){
            showTooltip("O campo de localidade não pode ser vazio.");
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