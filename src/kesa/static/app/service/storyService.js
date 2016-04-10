(function(){
    "use strict";

    angular.module('storyTeller')
        .service('storyService',function($http,$location){

            var service = this;

            service.getfirst = function(callback){
                $http.get('/api/getInit/')
                    .success(function (data,status){
                        callback(null,data);
                    })
                    .error(function(error,status){
                        callback(error,null);
                    });
            };


        });
})();