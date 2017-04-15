angular.module('starter.services')
.service('GoogleMapService' , function(){
    
    /* setup the google map */
    this.initMap = function(_scope,position){
        
        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        
        _scope.latLng = latLng;

        var mapOptions = {
          center: latLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          mapTypeControl: false //hide controls
        };
 
        _scope.map = new google.maps.Map(document.getElementById("google-maps"), mapOptions);
        
        _scope.map.setOptions({ //disable other features
           draggable: false,
           zoomControl: false,
           scrollwheel: false, 
           disableDoubleClickZoom: true
        });
        
    }
    
    this.addInitialMarker = function(_scope){
        //Wait until the map is loaded
        google.maps.event.addListenerOnce(_scope.map, 'idle', function(){

          var marker = new google.maps.Marker({
              map: _scope.map,
              animation: google.maps.Animation.BOUNCE,
              position: _scope.latLng,
              label: 'Você está aqui:',
              title: 'Você está aqui:'
          });      

        });
    }
    
    this.travelTo = function(_scope, stringToTravel){
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode( { 'address': stringToTravel}, function(results, status) {
          if (status == 'OK') {
            _scope.map.setCenter(results[0].geometry.location);
              
            console.log('result' , results[0].formatted_address);
              
            //remove last marker
            if(_scope.lastLocation){
                _scope.lastLocation.setMap(null);
            }
            
            //set marker to travel
            var marker = new google.maps.Marker({
                map: _scope.map,
                animation: google.maps.Animation.BOUNCE,
                position: results[0].geometry.location,
                title: results[0].formatted_address
            });
              
            _scope.lastLocation = marker;
          } else {
            alert('Geocode was not successful for the following reason: ' + status);
          }
        });
    }
    
})
