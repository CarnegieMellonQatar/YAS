(function(){
    "use strict";

    angular.module('storyTeller')
        .service('storyService',function($http,$location){

            var service = this;

            // Get's the first 10 completed story objects
            // and first 10 active stories
            service.getfirst = function(callback){
                $http.get('/api/getInit/')
                    .success(function (data,status){
                        callback(null,data);
                    })
                    .error(function(error,status){
                        callback(error,null);
                    });
            };

            // Gets like objects for a story
            service.getLikes = function(story, callback){
                $http.get('/api/getLikesStory/'+story.pk+'/')
                    .success(function (data, status){
                        callback(null,data,story);
                    })
                    .error(function(error,status){
                       callback(error,null,story);
                    });
            };

            // Gets back like objects
            service.getLikesUser = function(uid, callback){
                $http.get('/api/getLikesUser/'+uid+'/')
                    .success(function (data, status){
                        callback(null,data);
                    })
                    .error(function(error,status){
                       callback(error,null);
                    });
            };

            // Gets back the user objects that have contributed to a story
            service.getContributors = function(story, callback){
                $http.get('/api/getContributors/'+story.pk+'/')
                    .success(function (data, status){
                        callback(null,data,story);
                    })
                    .error(function(error,status){
                       callback(error,null,story);
                    });
            };

            // Gets the story objects for a user
            service.getUserStories = function(uid, sid, number, callback){
                $http.get('/api/'+uid+'/getUserStories/'+sid+'/'+number+'/')
                    .success(function (data, status){
                        callback(null,data);
                    })
                    .error(function(error,status){
                       callback(error,null);
                    });
            };

            // Gets a number of completed story objects given a number as input
            service.getCompleted = function(id, number, callback){
                $http.get('/api/getCompleted/'+id+'/'+number+'/')
                    .success(function (data,status){
                        callback(null,data);
                    })
                    .error(function(error,status){
                        callback(error,null);
                    });
            };

            // Gets a number of active story objects given a number as input
            service.getActive = function(id, number, callback){
                $http.get('/api/getActive/'+id+'/'+number+'/')
                    .success(function (data,status){
                        callback(null,data);
                    })
                    .error(function(error,status){
                        callback(error,null);
                    });
            };

            // Gets a number of incompleted story objects given a number as input
            service.getIncompleted = function(id, number, callback){
                $http.get('/api/getIncompleted/'+id+'/'+number+'/')
                    .success(function (data,status){
                        callback(null,data);
                    })
                    .error(function(error,status){
                        callback(error,null);
                    });
            };

            // Get user object for a story given a user pk and story pk
            service.getUser = function(story, callback){
                $http.get('/api/'+story.fields.user+'/getUser/'+story.pk+'/')
                    .success(function (data,status){
                        callback(null,data,story);
                    })
                    .error(function(error,status){
                        callback(error,null,story);
                    });
            };

            // Get user object by username
            service.getUserByName = function(username, callback){
                $http.get('/api/'+username+'/getUserByName/')
                    .success(function (data,status){
                        callback(null,data);
                    })
                    .error(function(error,status){
                        callback(error,null);
                    });
            };

            // Get number of contributions for a user
            service.getNumContributors = function(id, callback){
                $http.get('/api/'+id+'/getNumContributions/')
                    .success(function(data,status){
                        callback(null,data);
                    })
                    .error(function(error,status){
                        callback(error,null);
                    });
            };

            // Get
            service.getNumStories = function(id, callback){
                $http.get('/api/'+id+'/getNumStories/')
                    .success(function(data,status){
                        callback(null,data);
                    })
                    .error(function(error,status){
                        callback(error,null);
                    });
            };

            // Set a story writing session to open (users can join)
            service.setOpen = function(uid, sid, callback){
                $http.post('/api/'+uid+'/setOpen/'+sid+'/')
                    .success(function(data,status){
                        callback(null,data);
                    })
                    .error(function(error,status){
                        callback(error,null);
                    });
            };

            // Set a story writing session to be closed (users cannot join)
            service.setClosed = function(uid, sid, callback){
                $http.post('/api/'+uid+'/setClosed/'+sid+'/')
                    .success(function(data,status){
                        callback(null,data);
                    })
                    .error(function(error,status){
                        callback(error,null);
                    });
            };

            // Set a story to be completed and published
            service.setComplete = function(uid, sid, callback){
                $http.post('/api/'+uid+'/setComplete/'+sid+'/')
                    .success(function(data,status){
                        callback(null,data);
                    })
                    .error(function(error,status){
                        callback(error,null);
                    });
            };

            // Set a story to be incomplete
            service.setIncomplete = function(uid, sid, callback){
                $http.post('/api/'+uid+'/setIncComplete/'+sid+'/')
                    .success(function(data,status){
                        callback(null,data);
                    })
                    .error(function(error,status){
                        callback(error,null);
                    });
            };

            // Like a story
            service.Like = function(uid, sid, callback){
                $http.post('/api/'+uid+'/like/'+sid+'/')
                    .success(function(data,status){
                        callback(null,data);
                    })
                    .error(function(error,status){
                        callback(error,null);
                    });
            };

            // Delete branch given story id and branch id
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