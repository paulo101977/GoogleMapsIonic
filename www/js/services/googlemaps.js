angular.module('starter.services')
.service('GoogleMapService' , function(){
    
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
            disableDoubleClickZoom: true
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
    this.travelTo = function(_scope, stringToTravel){
        
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
              
            _scope.lastLocation = markerB;//last travel
          } else {
            //alert('Geocode was not successful for the following reason: ' + status);
            _scope.openModal("Houve um problema ao achar sua localidade, tente novamente!");
          }
        });
    }
    
    this.saveCurrentLocal = function(_scope){
        
        //the object localstorage dont exist
        if(!localStorage){
            _scope.openModal("Houve um problema ao tentar salvar sua localidade!");
            return;
        }
        
        //reset to test, comment if necessary
        localStorage.setItem('savedLocal',"[]");
        
        //restore the saved local from local storage and parse the value from string
        var value = JSON.parse(localStorage.getItem('savedLocal'));
        
        //first local to save
        if(!value){
            value = [];
        }
        
        var start = _scope.initialMarker; //first marker
        var end = _scope.lastLocation; //end marker
        
        if(!start){
            _scope.openModal("Erro! Posição inicial inexistente!");
            return;
        }
        
        if(!end){
            //_scope.openModal("Erro! Posição final inexistente!");
            //do nothing, save initial state any way
        }
        
        console.log(start)
        
        var latlngA = {
              lat: parseFloat(start.position.lat()),
              lng: parseFloat(start.position.lng())
        };
        
        var latlngB = null;
        
        if(end){
            latlngB = {
              lat: parseFloat(end.position.lat()),
              lng: parseFloat(end.position.lng())
            }
        }
        
        //store new value
        value.push({start: latlngA, end: latlngB , newData: true});
        
        //save string value to restore in future
        localStorage.setItem('savedLocal',JSON.stringify(value));
        
        _scope.openModal("Mapa atual salvo com sucesso!");
        
        console.log('savedLocal' , localStorage.getItem('savedLocal'))
    }
    
})
