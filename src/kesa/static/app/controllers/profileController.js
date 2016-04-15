(function(){
    "use strict";

    angular.module('storyTeller')
        .controller('profileController',function(storyService,$location){

            var profile = this;
            profile.url = location.pathname;
            profile.stories = [];
            profile.haveMore = true;
            profile.user = "";

            var username = profile.url.substring(1,profile.url.indexOf("profile")-1);

            storyService.getUserByName(username,function(err,data){
               if (err){
                   console.log(err);
               }
               else {
                   profile.user = data[0];
                   storyService.getUserStories(profile.user.pk,0,10,function(err, data){
                       if (err){
                        console.log(err);
                       }
                       else {
                           var i = 0;
                           if(data.length < 10){
                               profile.haveMore = false;
                           }
                           for(i = 0; i < data.length; i++){
                               profile.stories.push(data[i]);

                               storyService.getLikes(data[i], function(err, data, stories){
                                   if (err){
                                       console.log(err);
                                   }
                                   else {
                                       stories.fields.likes = data.length;
                                   }
                               });

                               storyService.getContributors(data[i], function(err, data, stories){
                                   if (err){
                                       console.log(err);
                                   }
                                   else {
                                       stories.fields.contributors = data.length;
                                   }
                               });
                           }
                       }
                   });

                   storyService.getNumContributors(profile.user.pk,function(err, data){
                       if (err){
                           console.log(err);
                       }
                       else {
                           profile.user.fields.contributions = data;
                       }
                   });

                   storyService.getNumStories(profile.user.pk,function(err, data){
                       if (err){
                           console.log(err);
                       }
                       else {
                           profile.user.fields.stories = data;
                       }
                   });
               }
            });



            profile.getMoreStories = function(){
                var last = profile.stories[profile.stories.length-1];
                storyService.getUserStories(profile.user.pk,last.pk,10,function(err, data){
                    if (err){
                        console.log(err);
                    }
                    else {
                        var i = 0;

                        if(data.length < 10){
                            profile.haveMore = false;
                        }

                        for(i = 0; i < data.length; i++){
                            profile.stories.push(data[i]);

                            storyService.getLikes(data[i], function(err, data, stories){
                                if (err){
                                    console.log(err);
                                }
                                else {
                                    stories.fields.likes = data.length;
                                }
                            });

                            storyService.getContributors(data[i], function(err, data, stories){
                                if (err){
                                    console.log(err);
                                }
                                else {
                                    stories.fields.contributors = data.length;
                                }
                            });
                        }
                    }
                });
            };


            profile.getStatus = function(data){
                if(data.is_complete){
                    return "Complete";
                } else {
                    if(data.is_open) {
                        return "Active";
                    }
                    else{
                        return "Closed";
                    }

                }
            };


        })
})();