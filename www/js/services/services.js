angular.module('starter.services', [])


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
              animation: google.maps.Animation.DROP,
              position: _scope.latLng
          });      

        });
    }
    
})

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
