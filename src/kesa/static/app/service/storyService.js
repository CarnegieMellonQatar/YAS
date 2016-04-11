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

            service.getLikesUser = function(uid, callback){
                $http.get('/api/getLikesUser/'+uid+'/')
                    .success(function (data, status){
                        callback(null,data);
                    })
                    .error(function(error,status){
                       callback(error,null);
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

            service.getActive = function(id, number, callback){
                $http.get('/api/getActive/'+id+'/'+number+'/')
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


            service.setOpen = function(uid, sid, callback){
                $http.post('/api/'+uid+'/setOpen/'+sid+'/')
                    .success(function(data,status){
                        callback(null,data);
                    })
                    .error(function(error,status){
                        callback(error,null);
                    });
            };

            service.setClosed = function(uid, sid, callback){
                $http.post('/api/'+uid+'/setClosed/'+sid+'/')
                    .success(function(data,status){
                        callback(null,data);
                    })
                    .error(function(error,status){
                        callback(error,null);
                    });
            };

            service.setComplete = function(uid, sid, callback){
                $http.post('/api/'+uid+'/setComplete/'+sid+'/')
                    .success(function(data,status){
                        callback(null,data);
                    })
                    .error(function(error,status){
                        callback(error,null);
                    });
            };

            service.setIncomplete = function(uid, sid, callback){
                $http.post('/api/'+uid+'/setIncComplete/'+sid+'/')
                    .success(function(data,status){
                        callback(null,data);
                    })
                    .error(function(error,status){
                        callback(error,null);
                    });
            };

            service.Like = function(uid, sid, callback){
                $http.post('/api/'+uid+'/like/'+sid+'/')
                    .success(function(data,status){
                        callback(null,data);
                    })
                    .error(function(error,status){
                        callback(error,null);
                    });
            };

            service.deleteBranch = function(uid, sid, bid, callback){
                $http.post('/api/'+uid+'/deleteBranch/'+sid+'/'+bid+'/')
                    .success(function(data,status){
                        callback(null,data);
                    })
                    .error(function(error,status){
                        callback(error,null);
                    });
            };

            service.deleteStory = function(uid, sid, callback){
                $http.post('/api/'+uid+'/deleteStory/'+sid+'/')
                    .success(function(data,status){
                        callback(null,data);
                    })
                    .error(function(error,status){
                        callback(error,null);
                    });
            };

            service.addSReads = function(uid, sid, callback){
                $http.post('/api/'+uid+'/addSReads/'+sid+'/')
                    .success(function(data,status){
                        callback(null,data);
                    })
                    .error(function(error,status){
                        callback(error,null);
                    });
            };

            service.addBReads = function(uid, bid, callback){
                $http.post('/api/'+uid+'/addBReads/'+bid+'/')
                    .success(function(data,status){
                        callback(null,data);
                    })
                    .error(function(error,status){
                        callback(error,null);
                    });
            };
        });
})();