angular.module('starter.services')
.service('LocalStorageService', function(){
    
    //get the saved data
    this.getData  = function(local){
        return JSON.parse(localStorage.getItem(local));
    }
    
    this.updateData = function(local, newdata){
        localStorage.setItem(local,JSON.stringify(newdata));
    }
    
    this.saveData = function(_rootScope, _scope , local, showMessage){
        //the object localstorage dont exist
        if(!localStorage){
            _scope.openModal("Houve um problema ao tentar salvar sua localidade!");
            return;
        }
        
        //there are nothing to be saved
        if(!_scope.couldSave){
            _scope.openModal("Não há nada a ser salvo. Todas as rodas já foram salvas!");
            return;
        }
        
        //reset to test, comment if necessary
        //localStorage.setItem(local,"[]");
        
        //restore the saved local from local storage and parse the value from string
        var value = JSON.parse(localStorage.getItem(local));
        
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
        
        
        var latlngA = {
              lat: parseFloat(start.position.lat()),
              lng: parseFloat(start.position.lng()),
              routerInfo: start.routerInfo
        };
        
        var latlngB = null;
        
        if(end){
            latlngB = {
              lat: parseFloat(end.position.lat()),
              lng: parseFloat(end.position.lng()),
              routerInfo: end.routerInfo
            }
        }
        
        //store new value
        //console.dir(value)
        
        //value = JSON.parse(value);
        if(typeof value == 'string'){
            value = JSON.parse(value);
        }
        value.push({start: latlngA, end: latlngB , newData: true});
        
        //save string value to restore in future
        localStorage.setItem(local,JSON.stringify(value));
        
        //emit the change to other controller
        if(showMessage) _rootScope.$broadcast("savedItemChange", { newData: value });
        else _rootScope.$broadcast("historyItemChange", { newData: value });
        
        if(showMessage) { 
            
            //there are nothing to be saved
            _scope.couldSave = false;
            
            _scope.openModal("Mapa atual salvo com sucesso!"); 
        }
        
        //console.log(local , localStorage.getItem(local))
    }

})