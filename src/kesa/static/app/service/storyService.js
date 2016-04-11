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

            service.getLikes = function(story, callback){
                $http.get('/api/getLikesStory/'+story.pk+'/')
                    .success(function (data, status){
                        callback(null,data,story);
                    })
                    .error(function(error,status){
                       callback(error,null,story);
                    });
            };

            service.getContributors = function(story, callback){
                $http.get('/api/getContributors/'+story.pk+'/')
                    .success(function (data, status){
                        callback(null,data,story);
                    })
                    .error(function(error,status){
                       callback(error,null,story);
                    });
            };

            service.getUserStories = function(uid, sid, number, callback){
                $http.get('/api/'+uid+'/getUserStories/'+sid+'/'+number+'/')
                    .success(function (data, status){
                        callback(null,data);
                    })
                    .error(function(error,status){
                       callback(error,null);
                    });
            };

            service.getCompleted = function(id, number, callback){
                $http.get('/api/getCompleted/'+id+'/'+number+'/')
                    .success(function (data,status){
                        callback(null,data);
                    })
                    .error(function(error,status){
                        callback(error,null);
                    });
            };

            service.getIncompleted = function(id, number, callback){
                $http.get('/api/getIncompleted/'+id+'/'+number+'/')
                    .success(function (data,status){
                        callback(null,data);
                    })
                    .error(function(error,status){
                        callback(error,null);
                    });
            };

            service.getUser = function(story, callback){
                $http.get('/api/'+story.fields.user+'/getUser/'+story.pk+'/')
                    .success(function (data,status){
                        callback(null,data,story);
                    })
                    .error(function(error,status){
                        callback(error,null,story);
                    });
            };

            service.getUserByName = function(username, callback){
                $http.get('/api/'+username+'/getUserByName/')
                    .success(function (data,status){
                        callback(null,data);
                    })
                    .error(function(error,status){
                        callback(error,null);
                    });
            };

            service.getNumContributors = function(id, callback){
                $http.get('/api/'+id+'/getNumContributions/')
                    .success(function(data,status){
                        callback(null,data);
                    })
                    .error(function(error,status){
                        callback(error,null);
                    });
            };

            service.getNumStories = function(id, callback){
                $http.get('/api/'+id+'/getNumStories/')
                    .success(function(data,status){
                        callback(null,data);
                    })
                    .error(function(error,status){
                        callback(error,null);
                    });
            };



        });
})();