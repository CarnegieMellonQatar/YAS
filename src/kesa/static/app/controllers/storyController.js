(function() {
    "use strict";

    angular.module('storyTeller')
        .controller('storyController', function(storyService) {

            var story = this;
            var isLiked = null;
            story.profile = null;
            story.uncompleteStories = [];
            story.haveMoreComplete = true;
            story.haveMoreIncomplete = true;
            story.completeStories = [];
            story.enabled = true;

            /************* CallBack Functions ***************/
            story.gI = function(err, data, allstories) {
                if (err) {
                    console.log("error in getting data");
                } else {
                    var i = 0;
                    var datalist = data;
                    for (i = 0; i < datalist.length; i++) {
                        var data = datalist[i];
                        var stories = allstories[i];

                        stories.fields.userInfo = JSON.parse(data['u'])[0];

                        if (data['rl'] === 'true') {
                            stories.fields.isBookmarked = true;
                        } else {
                            stories.fields.isBookmarked = false;
                        }

                        stories.fields.likes = JSON.parse(data['l']);

                        if (data['liked'] === 'true'){
                            stories.fields.isLiked = true;
                        } else {
                            stories.fields.isLiked = false;
                        }

                        stories.fields.contributors = JSON.parse(data['c']);

                        if (stories.fields.is_complete) {
                            story.completeStories.push(stories);
                        } else {
                            story.uncompleteStories.push(stories);
                        }
                    }

                    if (story.completeStories.length < 10) {
                        story.haveMoreComplete = false;
                    }

                    if (story.uncompleteStories.length < 10) {
                        story.haveMoreIncomplete = false;
                    }
                }
            };
            /**************************************************/

            storyService.getUserByRequest(function(err, data) {
                if (err) {
                    console.log("error in getting data");
                } else {
                    story.profile = data[0];
                    storyService.getfirst(function(err, data) {
                        if (err) {
                            console.log("error in getting data");
                        } else {
                            var i = data.length - 1;
                            storyService.getInfo(data[0].pk, data[i].pk, 2, data, "None", story.gI);
                        }
                    });
                }
            });

            story.changeTabs = function(type) {
                if (type) {
                    story.enabled = true;
                } else {
                    story.enabled = false;
                }
            };

            story.getMoreCompleteStories = function() {
                var last = story.completeStories[story.completeStories.length - 1];
                storyService.getCompleted(last.pk, 10, function(err, data) {
                    if (err) {
                        console.log("error in getting data");
                    } else {
                        var i = data.length - 1;

                        if (data.length < 10) {
                            story.haveMoreComplete = false;
                        }

                        storyService.getInfo(data[0].pk, data[i].pk, 1, data, "None", story.gI);
                    }
                });
            };

            story.getMoreInCompleteStories = function() {
                var last = story.uncompleteStories[story.uncompleteStories.length - 1];
                storyService.getIncompleted(last.pk, 10, function(err, data) {
                    if (err) {
                        console.log("error in getting data");
                    } else {
                      var i = data.length - 1;

                      if (data.length < 10) {
                          story.haveMoreComplete = false;
                      }

                      storyService.getInfo(data[0].pk, data[i].pk, 0, data, "None", story.gI);
                    }
                });
            };

            story.getStatus = function(data) {
                if (data.is_complete) {
                    return "Complete";
                } else {
                    if (data.is_open) {
                        return "Active";
                    } else {
                        return "Closed";
                    }

                }
            };

            story.like = function(data) {
                storyService.Like(story.profile.pk, data, function(err, data, cstory) {
                    if (err) {
                        console.log("error in getting data");
                    } else {
                        if (data["result"] === "true") {
                            cstory.fields.isLiked = true;
                            cstory.fields.likes = cstory.fields.likes + 1;
                        }
                    }
                });
            };

            story.unlike = function(data) {
                storyService.Unlike(story.profile.pk, data, function(err, data, cstory) {
                    if (err) {
                        console.log("error in getting data");
                    } else {
                        if (data["result"] === "true") {
                            cstory.fields.isLiked = false;
                            cstory.fields.likes = cstory.fields.likes - 1;
                        }
                    }
                });
            };

            story.bookmark = function(data) {
                storyService.addToReadLater(story.profile.pk, data, function(err, data, cstory) {
                    if (err) {
                        console.log("error in getting data");
                    } else {
                        if (data["result"] === "true") {
                            cstory.fields.isBookmarked = true;
                        }
                    }
                });
            };

            story.unbookmark = function(data) {
                storyService.removeFromReadLater(story.profile.pk, data, function(err, data, cstory) {
                    if (err) {
                        console.log("error in getting data");
                    } else {
                        if (data["result"] === "true") {
                            cstory.fields.isBookmarked = false;
                        }
                    }
                });
            };

        });
})();
