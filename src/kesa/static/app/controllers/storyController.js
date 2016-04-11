(function(){
    "use strict";

    angular.module('storyTeller')
        .controller('storyController',function(storyService){

            var story = this;
            story.uncompleteStories = [];
            story.haveMoreComplete = true;
            story.haveMoreIncomplete = true;
            story.completeStories = [];
            story.enabled = true;

            storyService.getfirst(function(err, data) {
                if (err){
                    console.log(err);
                }
                else {
                    var i = 0;
                    for(i = 0; i < data.length; i++){
                        if(data[i].fields.is_complete){
                            story.completeStories.push(data[i]);
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

                            storyService.getUser(data[i], function(err, data, stories){
                                if (err){
                                    console.log(err);
                                }
                                else {
                                    stories.fields.userInfo = data[0];
                                }
                            });
                        }
                        else {
                            story.uncompleteStories.push(data[i]);
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

                            storyService.getUser(data[i], function(err, data, stories){
                                if (err){
                                    console.log(err);
                                }
                                else {
                                    stories.fields.userInfo = data[0];
                                }
                            });
                        }
                    }

                    if(story.completeStories.length < 10){
                        story.haveMoreComplete = false;
                    }

                    if(story.uncompleteStories.length < 10){
                        story.haveMoreIncomplete = false;
                    }
                }
            });

            story.changeTabs = function(type){
                if(type){
                    story.enabled = true;
                } else {
                    story.enabled = false;
                }
            };

            story.getMoreCompleteStories = function(){
                var last = story.completeStories[story.completeStories.length-1];
                storyService.getCompleted(last.pk, 10, function(err, data){
                    if (err){
                        console.log(err);
                    }
                    else {
                        var i = 0;

                        if(data.length < 10){
                            story.haveMoreComplete = false;
                        }

                        for(i = 0; i < data.length; i++){
                            story.completeStories.push(data[i]);

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

                            storyService.getUser(data[i], function(err, data, stories){
                                if (err){
                                    console.log(err);
                                }
                                else {
                                    stories.fields.userInfo = data[0];
                                }
                            });
                        }
                    }
                });
            };

            story.getMoreInCompleteStories = function(){
                var last = story.uncompleteStories[story.uncompleteStories.length-1];
                storyService.getIncompleted(last.pk, 10, function(err, data){
                    if (err){
                        console.log(err);
                    }
                    else {
                        var i = 0;

                        if(data.length < 10){
                            story.haveMoreIncomplete = false;
                        }

                        for(i = 0; i < data.length; i++){
                            story.uncompleteStories.push(data[i]);

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

                            storyService.getUser(data[i], function(err, data, stories){
                                if (err){
                                    console.log(err);
                                }
                                else {
                                    stories.fields.userInfo = data[0];
                                }
                            });
                        }
                    }
                });
            };

            story.isComplete = function(is_complete){
                if(is_complete){
                    return "Complete";
                } else {
                    return "Active";
                }
            };

        })
})();