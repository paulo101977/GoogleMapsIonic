angular.module('starter.services')
.service('ModalService', function($ionicModal){
    
    //append modal to scope
    this.appendModal = function(_scope){
        //modal to show error messages:
        $ionicModal.fromTemplateUrl('templates/modal-message.html', {
          scope: _scope,
          animation: 'fade-in'
        }).then(function(modal) {
          _scope.modal = modal;
            //modal.show();
        });
    }
    
    //set the modal message
    this.setMessage = function(_scope , message){
        _scope.message = message;
    }
})
