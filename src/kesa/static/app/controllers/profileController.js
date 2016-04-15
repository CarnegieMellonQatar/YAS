(function(){
    "use strict";

    angular.module('storyTeller')
        .controller('profileController',function(storyService,$location,$scope){

            var profile = this;
            profile.url = location.pathname;
            profile.stories = [];
            profile.haveMore = true;
            profile.user = "";
            profile.image = {};

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

            Dropzone.autoDiscover = false;

            $scope.dropzoneConfig = {
                'options': { // passed into the Dropzone constructor
                    url: 'notNeeded',
                    autoProcessQueue: false,
                    maxFiles: 1,
                    addRemoveLinks: true,
                    acceptedFiles: 'image/*',
                    accept: function(file, done){
                        profile.file = file;
                        done();
                    }
                },
                'eventHandlers': {
                    'thumbnail': function(file, dataUrl){
                        profile.currSource = dataUrl;
                    },
                    'sending': function (file, xhr, formData) {
                    },
                    'success': function (file, response) {
                    }
                }
            };

            profile.addImageDND = function(){
                profile.image.img_file = profile.file;
                storyService.addImage(profile.image,function(err, data){
                    if(err){
                        console.log("Image from DND failed");
                    }
                    else{
                        if(data.result != 'false'){
                            profile.image = {};
                            $scope.add_image_form2.$setPristine();
                        }
                        else{
                            alert("Not Authorized");
                        }
                    }
                });
            };



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