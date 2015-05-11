angular.module('ng-lightdm',[])
.factory('LightDM', ['$window','$rootScope', '$q', '$timeout',function($window, $rootScope, $q, $timeout){
    var LightDM = $window.lightdm
    
    $window.show_prompt = function(text){	   
        $rootScope.$emit('lightdm:show:prompt', text)
    }
    
    $window.authentication_complete = function(){
        LightDM = $window.lightdm
        if($window.lightdm.is_authenticated){           
            $rootScope.$emit('lightdm:auth:ok')
        } else {
            $rootScope.$emit('lightdm:auth:error')
        }
    }

    $window.show_message = function(text){
        $rootScope.$emit('lightdm:show:message', text)
    }

    $window.show_error = function(text){
        $rootScope.$emit('lightdm:show:error', text)
    }
    
    LightDM.nglogin = function(username, password, session){
        var deferred = $q.defer();        
        $window.lightdm.start_authentication(username)
        
        $timeout(function(){
           $window.lightdm.provide_secret(password)
        },50)
        
        $rootScope.$on('lightdm:auth:ok', function(){
            $window.lightdm.login($window.lightdm.authentication_user, session)
        })
        $rootScope.$on('lightdm:auth:error', function(){
            deferred.reject('auth:error')
        })
        
        return deferred.promise
    }
    
    return LightDM
}])
