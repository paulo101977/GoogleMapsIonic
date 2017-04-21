angular.module('starter.services')
.service('GoogleMapService' , function(LocalStorageService){
    
    //get custom style
    function getCustomMapStyle(){
        return [
          {
            "featureType": "administrative",
            "elementType": "geometry.fill",
            "stylers": [
              {
                "color": "#7563d8"
              }
            ]
          },
          {
            "featureType": "landscape",
            "elementType": "geometry.fill",
            "stylers": [
              {
                "color": "#465cf4"
              }
            ]
          },
          {
            "featureType": "road.arterial",
            "elementType": "geometry.fill",
            "stylers": [
              {
                "color": "#4fb093"
              },
              {
                "weight": 3.5
              }
            ]
          },
          {
            "featureType": "road.arterial",
            "elementType": "geometry.stroke",
            "stylers": [
              {
                "color": "#0ef1f1"
              },
              {
                "visibility": "on"
              },
              {
                "weight": 5.5
              }
            ]
          },
          {
            "featureType": "road.arterial",
            "elementType": "labels.text",
            "stylers": [
              {
                "visibility": "on"
              }
            ]
          },
          {
            "featureType": "road.arterial",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#fa0530"
              }
            ]
          },
          {
            "featureType": "road.arterial",
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#22ddca"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry.fill",
            "stylers": [
              {
                "color": "#00ffff"
              },
              {
                "weight": 3.5
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [
              {
                "color": "#5533cc"
              },
              {
                "visibility": "on"
              },
              {
                "weight": 2.5
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "labels.text",
            "stylers": [
              {
                "visibility": "on"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#80ffff"
              },
              {
                "weight": 0.5
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#7511ee"
              },
              {
                "visibility": "on"
              },
              {
                "weight": 4
              }
            ]
          }
        ]
    }
    
    //return a custom icon
    function getIconPath(){
        var image = {
            url: 'img/Icon-Small.png',
            size: new google.maps.Size(40, 40)
        };
        return image;
    }
    
    //create a info window template
    function getContentString(formatted_address){
        
        if(formatted_address){
            var content = '<div>',
                splitedString = formatted_address.split(','),
                child = '<span>',
                childClose = '</span>',
                contentClose = '</div>';

            if(splitedString){
                splitedString.forEach(function(value){
                    content += child + value + childClose + "<br/>";
                })                
                
                content += contentClose;
                
                return content;
            }
        
            return "";
        } 
        
        return "";
    }
    
    //add a infowindow to marker
    function addInfoWindow(_scope, marker , contentString){
        
        //append property to the marker
        if(marker.infoIsOpen === undefined){
            marker.infoIsOpen = true;
        }
        
        //new instance of the infowindow render
        var infowindow = new google.maps.InfoWindow({
          content: contentString
        });
        
        //the initial state is open
        infowindow.open(_scope.map, marker); 

        //toogle the window on click in the marker
        marker.addListener('click', function() {
            
            marker.infoIsOpen ?  infowindow.close() : infowindow.open(_scope.map, marker);
            
            marker.infoIsOpen = !marker.infoIsOpen;
        });
    }
    
    //aditional function to draw the route
    function calculateAndDisplayRoute(_scope,directionsService, directionsDisplay, pointA, pointB) {
    
      //directionsDisplay.setMap(_scope.map);
    
      directionsService.route({
        origin: pointA,
        destination: pointB,
        travelMode: google.maps.TravelMode.DRIVING
      }, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        } else {
          //window.alert('Directions request failed due to ' + status);
            
          if(status == google.maps.DirectionsStatus.ZERO_RESULTS)
            _scope.openModal("Nenhuma localidade encontrada, tente novamente!");
          else
            _scope.openModal("Houve um problema ao achar sua localidade, tente novamente!");
        }
      });
    }
    
    /* setup the google map */
    this.initMap = function(_scope,position){
        
        if(!google){
            alert('Google dont load!')
        }
        
        if(!google.maps){
            alert('Google maps dont load!')
        }
        
        //get initial coordinates
        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        
        //set latLng in context of the scope
        _scope.latLng = latLng;

        //initial map options
        var mapOptions = {
            center: latLng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP,//map type
            mapTypeControl: false, //hide controls,
            draggable: true,
            zoomControl: true,
            scrollwheel: false, 
            disableDoubleClickZoom: true,
            styles: getCustomMapStyle()
        };
 
        //the map
        _scope.map = new google.maps.Map(document.getElementById("google-maps"), mapOptions);
        
        //create one instance of direction render
        var directionsDisplay = new google.maps.DirectionsRenderer({
              map: _scope.map
        });
        
        //from the scope, setup the direction display
        _scope.directionsDisplay = directionsDisplay;
        
    }
    
    //add the initial marker
    this.addInitialMarker = function(_scope){
        //Wait until the map is loaded
        google.maps.event.addListenerOnce(_scope.map, 'idle', function(){
            
          //get the geocoder
          var geocoder = new google.maps.Geocoder();

          //create a object marker
          var marker = new google.maps.Marker({
              map: _scope.map,
              animation: null,
              position: _scope.latLng,
              icon: getIconPath()
          });  
            
        
          //extract info about that position and add a infowindow:
          var latlng = {
              lat: parseFloat(marker.position.lat()),
              lng: parseFloat(marker.position.lng())
          };
          
          //the geocode request for info about this coordinate
          geocoder.geocode({'location': latlng}, function(results, status) {
            if (status === 'OK') {
              if (results[1]) {
                //add info to markerB
                addInfoWindow(_scope, marker, results[1].formatted_address);
                  
                //append the router info to the initial marker
                marker.routerInfo = results[1].formatted_address;
              } else {
                //window.alert('No results found');
                _scope.openModal("Nenhum resultado encontrado, tente novamente!");
              }
            } else {
              //window.alert('Geocoder failed due to: ' + status);
              _scope.openModal("Houve um problema ao achar sua localidade, tente novamente!");
            }
          });
            
        
          //add ther initial to scope
          _scope.initialMarker = marker;

        });
    }
    
    //travel to point in map
    this.travelTo = function(_rootScope, _scope, stringToTravel){
        
        //get the geocoder to convert the location string in position
        var geocoder = new google.maps.Geocoder(),
            //get the direction service
            directionsService = new google.maps.DirectionsService,

            //get one instance of direction render
            directionsDisplay =  _scope.directionsDisplay;
        
        geocoder.geocode( { 'address': stringToTravel}, function(results, status) {
          if (status == 'OK') {
            //_scope.map.setCenter(results[0].geometry.location);
              
            
            //remove last marker if it exist
            if(_scope.lastLocation){
                _scope.lastLocation.setMap(null);
            }
              
            //create or get the two markers
            var markerA = _scope.initialMarker,
                markerB = new google.maps.Marker({
                    map: _scope.map,
                    animation: null,
                    icon: getIconPath(),
                    position: results[0].geometry.location
                }),
                
                //extract a point from the markers
                pointA = new google.maps.LatLng(markerA.position.lat(), markerA.position.lng()),
                pointB = new google.maps.LatLng(markerB.position.lat(), markerB.position.lng())
              
            
            
            //add info to markerB
            addInfoWindow(_scope, markerB, getContentString(results[0].formatted_address));
              
            //trace the route from pointA to pointB
            calculateAndDisplayRoute(_scope,directionsService, directionsDisplay, pointA, pointB);
              
            //append the router info to the marker
            markerB.routerInfo = results[0].formatted_address;
              
            _scope.lastLocation = markerB;//last travel
            
            //after add new router, enable save
            _scope.couldSave = true;
              
             //automatic save the last search data
             //request save in localstorage
             LocalStorageService.saveData(_rootScope , _scope , 'saveHistoricalLocal', false);
          } else {
            //alert('Geocode was not successful for the following reason: ' + status);
            _scope.openModal("Houve um problema ao achar sua localidade, tente novamente!");
          }
        });
    }
    
    this.saveCurrentLocal = function(_rootScope , _scope){
        
        //request save in localstorage
        LocalStorageService.saveData(_rootScope , _scope , 'savedLocal' , true);
    }
    
})
