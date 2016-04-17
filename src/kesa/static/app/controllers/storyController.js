(function () {
    "use strict";

    angular.module('storyTeller')
        .controller('storyController', function (storyService) {

            var story = this;
            story.profile = null;
            story.uncompleteStories = [];
            story.haveMoreComplete = true;
            story.haveMoreIncomplete = true;
            story.completeStories = [];
            story.enabled = true;

            storyService.getUserByRequest(function (err, data) {
                    if (err) {
                        console.log(err);
                    } else {
                        story.profile = data[0];
                        storyService.getfirst(function (err, data) {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                var i = 0;
                                for (i = 0; i < data.length; i++) {
                                    if (data[i].fields.is_complete) {
                                        story.completeStories.push(data[i]);
                                        storyService.getLikes(data[i], function (err, data, stories) {
                                            if (err) {
                                                console.log(err);
                                            }
                                            else {
                                                stories.fields.likes = data.length;
                                                var isLiked = data.reduce(
                                                    function (pV, cV, cI, array) {
                                                        if (pV) {
                                                            return pV;
                                                        } else {
                                                            return (cV.fields.user === story.profile.pk);
                                                        }
                                                    }, false);
                                                stories.fields.isLiked = isLiked;
                                            }
                                        });

                                        storyService.getContributors(data[i], function (err, data, stories) {
                                            if (err) {
                                                console.log(err);
                                            }
                                            else {
                                                stories.fields.contributors = data.length;
                                            }
                                        });

                                        storyService.getUser(data[i], function (err, data, stories) {
                                            if (err) {
                                                console.log(err);
                                            }
                                            else {
                                                stories.fields.userInfo = data[0];
                                            }
                                        });

                                        storyService.getReadLaterStory(data[i], function (err, data, stories) {
                                            if (err) {
                                                console.log(err);
                                            }
                                            else {
                                                if (data['result'] === 'true') {
                                                    stories.fields.isBookmarked = true;
                                                } else {
                                                    stories.fields.isBookmarked = false;
                                                }
                                            }
                                        });
                                    }
                                    else {
                                        story.uncompleteStories.push(data[i]);
                                        storyService.getLikes(data[i], function (err, data, stories) {
                                            if (err) {
                                                console.log(err);
                                            }
                                            else {
                                                stories.fields.likes = data.length;
                                                var isLiked = data.reduce(
                                                    function (pV, cV, cI, array) {
                                                        if (pV) {
                                                            return pV;
                                                        } else {
                                                            return (cV.fields.user === story.profile.pk);
                                                        }
                                                    }, false);
                                                stories.fields.isLiked = isLiked;
                                            }
                                        });

                                        storyService.getContributors(data[i], function (err, data, stories) {
                                            if (err) {
                                                console.log(err);
                                            }
                                            else {
                                                stories.fields.contributors = data.length;
                                            }
                                        });

                                        storyService.getUser(data[i], function (err, data, stories) {
                                            if (err) {
                                                console.log(err);
                                            }
                                            else {
                                                stories.fields.userInfo = data[0];
                                            }
                                        });

                                        storyService.getReadLaterStory(data[i], function (err, data, stories) {
                                            if (err) {
                                                console.log(err);
                                            }
                                            else {
                                                if (data['result'] === 'true') {
                                                    stories.fields.isBookmarked = true;
                                                } else {
                                                    stories.fields.isBookmarked = false;
                                                }
                                            }
                                        });
                                    }
                                }

                                if (story.completeStories.length < 10) {
                                    story.haveMoreComplete = false;
                                }

                                if (story.uncompleteStories.length < 10) {
                                    story.haveMoreIncomplete = false;
                                }
                            }
                        });
                    }
                }
            )
            ;

            story.changeTabs = function (type) {
                if (type) {
                    story.enabled = true;
                } else {
                    story.enabled = false;
                }
            };

            story.getMoreCompleteStories = function () {
                var last = story.completeStories[story.completeStories.length - 1];
                storyService.getCompleted(last.pk, 10, function (err, data) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        var i = 0;

                        if (data.length < 10) {
                            story.haveMoreComplete = false;
                        }

                        for (i = 0; i < data.length; i++) {
                            story.completeStories.push(data[i]);

                            storyService.getLikes(data[i], function (err, data, stories) {
                                if (err) {
                                    console.log(err);
                                }
                                else {
                                    stories.fields.likes = data.length;
                                    var isLiked = data.reduce(
                                        function (pV, cV, cI, array) {
                                            if (pV) {
                                                return pV;
                                            } else {
                                                return (cV.fields.user === story.profile.pk);
                                            }
                                        }, false);
                                    stories.fields.isLiked = isLiked;
                                }
                            });

                            storyService.getContributors(data[i], function (err, data, stories) {
                                if (err) {
                                    console.log(err);
                                }
                                else {
                                    stories.fields.contributors = data.length;
                                }
                            });

                            storyService.getUser(data[i], function (err, data, stories) {
                                if (err) {
                                    console.log(err);
                                }
                                else {
                                    stories.fields.userInfo = data[0];
                                }
                            });

                            storyService.getReadLaterStory(data[i], function (err, data, stories) {
                                if (err) {
                                    console.log(err);
                                }
                                else {
                                    if (data['result'] === 'true') {
                                        stories.fields.isBookmarked = true;
                                    } else {
                                        stories.fields.isBookmarked = false;
                                    }
                                }
                            });
                        }
                    }
                });
            };

            story.getMoreInCompleteStories = function () {
                var last = story.uncompleteStories[story.uncompleteStories.length - 1];
                storyService.getIncompleted(last.pk, 10, function (err, data) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        var i = 0;

                        if (data.length < 10) {
                            story.haveMoreIncomplete = false;
                        }

                        for (i = 0; i < data.length; i++) {
                            story.uncompleteStories.push(data[i]);

                            storyService.getLikes(data[i], function (err, data, stories) {
                                if (err) {
                                    console.log(err);
                                }
                                else {
                                    stories.fields.likes = data.length;
                                    var isLiked = data.reduce(
                                        function (pV, cV, cI, array) {
                                            if (pV) {
                                                return pV;
                                            } else {
                                                return (cV.fields.user === story.profile.pk);
                                            }
                                        }, false);
                                    stories.fields.isLiked = isLiked;
                                }
                            });

                            storyService.getContributors(data[i], function (err, data, stories) {
                                if (err) {
                                    console.log(err);
                                }
                                else {
                                    stories.fields.contributors = data.length;
                                }
                            });

                            storyService.getUser(data[i], function (err, data, stories) {
                                if (err) {
                                    console.log(err);
                                }
                                else {
                                    stories.fields.userInfo = data[0];
                                }
                            });

                            storyService.getReadLaterStory(data[i], function (err, data, stories) {
                                if (err) {
                                    console.log(err);
                                }
                                else {
                                    if (data['result'] === 'true') {
                                        stories.fields.isBookmarked = true;
                                    } else {
                                        stories.fields.isBookmarked = false;
                                    }
                                }
                            });
                        }
                    }
                });
            };

            story.getStatus = function (data) {
                if (data.is_complete) {
                    return "Complete";
                } else {
                    if (data.is_open) {
                        return "Active";
                    }
                    else {
                        return "Closed";
                    }

                }
            };

            story.like = function (data) {
                storyService.Like(story.profile.pk, data, function (err, data, cstory) {
                    if (err) {
                        console.log(err);
                    } else {
                        if (data["result"] === "true") {
                            cstory.fields.isLiked = true;
                            cstory.fields.likes = cstory.fields.likes + 1;
                        }
                    }
                });
            };

            story.unlike = function (data) {
                storyService.Unlike(story.profile.pk, data, function (err, data, cstory) {
                    if (err) {
                        console.log(err);
                    } else {
                        if (data["result"] === "true") {
                            cstory.fields.isLiked = false;
                            cstory.fields.likes = cstory.fields.likes - 1;
                        }
                    }
                });
            };

            story.bookmark = function (data) {
                storyService.addToReadLater(story.profile.pk, data,function (err, data, cstory) {
                    if (err) {
                        console.log(err);
                    } else {
                        if (data["result"] === "true") {
                            cstory.fields.isBookmarked = true;
                        }
                    }
                });
            };

            story.unbookmark = function (data) {
                storyService.removeFromReadLater(story.profile.pk, data,function (err, data, cstory) {
                    if (err) {
                        console.log(err);
                    } else {
                        if (data["result"] === "true") {
                            cstory.fields.isBookmarked = false;
                        }
                    }
                });
            };

        })
})();