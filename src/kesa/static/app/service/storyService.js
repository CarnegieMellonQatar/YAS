(function () {
    "use strict";

    angular.module('storyTeller')
        .service('storyService', function ($http, $location) {

            var service = this;

            // Get's the first 10 completed story objects
            // and first 10 active stories
            service.getfirst = function (callback) {
                $http.get('/api/getInit/')
                    .success(function (data, status) {
                        callback(null, data);
                    })
                    .error(function (error, status) {
                        callback(error, null);
                    });
            };

            // Gets like objects for a story
            service.getLikes = function (story, callback) {
                $http.get('/api/getLikesStory/' + story.pk + '/')
                    .success(function (data, status) {
                        callback(null, data, story);
                    })
                    .error(function (error, status) {
                        callback(error, null, story);
                    });
            };

            // Gets back like objects
            service.getLikesUser = function (uid, callback) {
                $http.get('/api/getLikesUser/' + uid + '/')
                    .success(function (data, status) {
                        callback(null, data);
                    })
                    .error(function (error, status) {
                        callback(error, null);
                    });
            };

            // Gets back the user objects that have contributed to a story
            service.getContributors = function (story, callback) {
                $http.get('/api/getContributors/' + story.pk + '/')
                    .success(function (data, status) {
                        callback(null, data, story);
                    })
                    .error(function (error, status) {
                        callback(error, null, story);
                    });
            };

            // Gets back the user objects that have contributed to a story
            service.getReadLaterStory = function (story, callback) {
                $http.get('/api/getReadLaterStory/' + story.pk + '/')
                    .success(function (data, status) {
                        callback(null, data, story);
                    })
                    .error(function (error, status) {
                        callback(error, null, story);
                    });
            };

            // Gets the story objects for a user
            service.getUserStories = function (uid, sid, number, callback) {
                $http.get('/api/' + uid + '/getUserStories/' + sid + '/' + number + '/')
                    .success(function (data, status) {
                        callback(null, data);
                    })
                    .error(function (error, status) {
                        callback(error, null);
                    });
            };

            // Gets the story objects for a user
            service.getReadLater = function (uid, rlid, number, callback) {
                $http.get('/api/' + uid + '/getReadLater/' + rlid + '/' + number + '/')
                    .success(function (data, status) {
                        callback(null, data);
                    })
                    .error(function (error, status) {
                        callback(error, null);
                    });
            };

            // Gets a number of completed story objects given a number as input
            service.getCompleted = function (id, number, callback) {
                $http.get('/api/getCompleted/' + id + '/' + number + '/')
                    .success(function (data, status) {
                        callback(null, data);
                    })
                    .error(function (error, status) {
                        callback(error, null);
                    });
            };

            // Gets a number of active story objects given a number as input
            service.getActive = function (id, number, callback) {
                $http.get('/api/getActive/' + id + '/' + number + '/')
                    .success(function (data, status) {
                        callback(null, data);
                    })
                    .error(function (error, status) {
                        callback(error, null);
                    });
            };

            // Gets a number of incompleted story objects given a number as input
            service.getIncompleted = function (id, number, callback) {
                $http.get('/api/getIncompleted/' + id + '/' + number + '/')
                    .success(function (data, status) {
                        callback(null, data);
                    })
                    .error(function (error, status) {
                        callback(error, null);
                    });
            };

            // Get user object for a story given a user pk and story pk
            service.getUser = function (story, callback) {
                $http.get('/api/' + story.fields.user + '/getUser/' + story.pk + '/')
                    .success(function (data, status) {
                        callback(null, data, story);
                    })
                    .error(function (error, status) {
                        callback(error, null, story);
                    });
            };

            // Get user object by username
            service.getUserByName = function (username, callback) {
                $http.get('/api/' + username + '/getUserByName/')
                    .success(function (data, status) {
                        callback(null, data);
                    })
                    .error(function (error, status) {
                        callback(error, null);
                    });
            };

            // Get user object by username
            service.getUserByID = function (uid, callback) {
                $http.get('/api/' + uid + '/getUserByID/')
                    .success(function (data, status) {
                        callback(null, data);
                    })
                    .error(function (error, status) {
                        callback(error, null);
                    });
            };

            // Get user object
            service.getUserByRequest = function (callback) {
                $http.get('/api/getUserByRequest/')
                    .success(function (data, status) {
                        callback(null, data);
                    })
                    .error(function (error, status) {
                        callback(error, null);
                    });
            };

            // Get number of contributions for a user
            service.getNumContributors = function (id, callback) {
                $http.get('/api/' + id + '/getNumContributions/')
                    .success(function (data, status) {
                        callback(null, data);
                    })
                    .error(function (error, status) {
                        callback(error, null);
                    });
            };

            // Get number of stories created by a user
            service.getNumStories = function (id, callback) {
                $http.get('/api/' + id + '/getNumStories/')
                    .success(function (data, status) {
                        callback(null, data);
                    })
                    .error(function (error, status) {
                        callback(error, null);
                    });
            };

            // Get the story's graph
            service.getStory = function (sid, callback) {
                $http.get('/api/getStory/' + sid + '/')
                    .success(function (data, status) {
                        callback(null, data);
                    })
                    .error(function (error, status) {
                        callback(error, null);
                    });
            };

            // Get a branch of the story graph
            service.getBranch = function (bid, callback) {
                $http.get('/api/getStory/' + bid + '/')
                    .success(function (data, status) {
                        callback(null, data);
                    })
                    .error(function (error, status) {
                        callback(error, null);
                    });
            };

            // Set a story writing session to open (users can join)
            service.setOpen = function (sid, callback) {
                $http.post('/api/setOpen/' + sid + '/')
                    .success(function (data, status) {
                        callback(null, data);
                    })
                    .error(function (error, status) {
                        callback(error, null);
                    });
            };

            // Set a story writing session to be closed (users cannot join)
            service.setClosed = function (sid, callback) {
                $http.post('/api/setClosed/' + sid + '/')
                    .success(function (data, status) {
                        callback(null, data);
                    })
                    .error(function (error, status) {
                        callback(error, null);
                    });
            };

            // Set a story to be completed and published
            service.setComplete = function (sid, callback) {
                $http.post('/api/setComplete/' + sid + '/')
                    .success(function (data, status) {
                        callback(null, data);
                    })
                    .error(function (error, status) {
                        callback(error, null);
                    });
            };

            // Set a story to be incomplete
            service.setIncomplete = function (sid, callback) {
                $http.post('/api/setIncComplete/' + sid + '/')
                    .success(function (data, status) {
                        callback(null, data);
                    })
                    .error(function (error, status) {
                        callback(error, null);
                    });
            };

            // Like a story

            service.Like = function (uid, story, callback) {
                $http.post('/api/' + uid + '/like/' + story.pk + '/')
                    .success(function (data, status) {
                        callback(null, data, story);
                    })
                    .error(function (error, status) {
                        callback(error, null, story);
                    });
            };

            // Like a story
            service.Unlike = function (uid, story, callback) {
                $http.post('/api/' + uid + '/unlike/' + story.pk + '/')
                    .success(function (data, status) {
                        callback(null, data, story);
                    })
                    .error(function (error, status) {
                        callback(error, null, story);
                    });
            };

            // Delete branch given story id and branch id
            service.deleteBranch = function (sid, bid, callback) {
                $http.post('/api/deleteBranch/' + sid + '/' + bid + '/')
                    .success(function (data, status) {
                        callback(null, data);
                    })
                    .error(function (error, status) {
                        callback(error, null);
                    });
            };

            // Delete a story given a story id
            service.deleteStory = function (sid, callback) {
                $http.post('/api/deleteStory/' + sid + '/')
                    .success(function (data, status) {
                        callback(null, data);
                    })
                    .error(function (error, status) {
                        callback(error, null);
                    });
            };

            // Increment the number of readers given story id
            service.addSReads = function (sid, callback) {
                $http.post('/api/addSReads/' + sid + '/')
                    .success(function (data, status) {
                        callback(null, data);
                    })
                    .error(function (error, status) {
                        callback(error, null);
                    });
            };

            // Increment the number of readers given branch id
            service.addBReads = function (bid, callback) {
                $http.post('/api/addBReads/' + bid + '/')
                    .success(function (data, status) {
                        callback(null, data);
                    })
                    .error(function (error, status) {
                        callback(error, null);
                    });
            };

            service.addImage = function (image, callback) {
                var formdata = new FormData();
                for (var key in image) {
                    formdata.append(key, image[key]);
                }
                var request = {
                    method: 'POST',
                    url: '/api/addImage/',
                    data: formdata,
                    headers: {
                        'Content-Type': undefined
                    }
                };
                $http(request)
                    .success(function (data, status) {
                        callback(null, data);
                    })
                    .error(function (error, status) {
                        callback(error, null);
                    });
            };

            service.addToStory = function (sid, length, bid, contact, callback) {
                $http.post('/api/addToStory/' + sid + '/' + bid + '/')
                    .success(function (data, status) {
                        callback(null, data, length, contact);
                    })
                    .error(function (error, status) {
                        callback(error, null, null, contact);

                    });
            };

            service.addToReadLater = function (uid, story, callback) {
                $http.post('/api/' + uid + '/addToReadLater/' + story.pk + '/')
                    .success(function (data, status) {
                        callback(null, data, story);
                    })
                    .error(function (error, status) {
                        callback(error, null, story);
                    });
            };

            service.removeFromReadLater = function (uid, story, callback) {
                $http.post('/api/' + uid + '/removeFromReadLater/' + story.pk + '/')
                    .success(function (data, status) {
                        callback(null, data, story);
                    })
                    .error(function (error, status) {
                        callback(error, null, story);
                    });
            };

            service.getGraphAnalytics = function (uid, numDays, callback) {
                $http.post('/api/' + uid + '/analytics/' + numDays + '/graph/')
                    .success(function (data, status) {
                        callback(null, data);
                    })
                    .error(function (error, status) {
                        callback(error, null);
                    });
            };

            service.getStoryAnalytics = function (uid, callback) {
                $http.post('/api/' + uid + '/analytics/generic/')
                    .success(function (data, status) {
                        callback(null, data);
                    })
                    .error(function (error, status) {
                        callback(error, null);
                    });
            };

            service.getTotalLikes = function (uid, callback) {
                $http.post('/api/' + uid + '/analytics/totalLikes/')
                    .success(function (data, status) {
                        callback(null, data);
                    })
                    .error(function (error, status) {
                        callback(error, null);
                    });
            };

            service.getTotalContributors = function (uid, callback) {
                $http.post('/api/' + uid + '/analytics/totalContributors/')
                    .success(function (data, status) {
                        callback(null, data);
                    })
                    .error(function (error, status) {
                        callback(error, null);
                    });
            };

            service.getTotalContributions = function (uid, callback) {
                $http.post('/api/' + uid + '/analytics/contributedStories/')
                    .success(function (data, status) {
                        callback(null, data);
                    })
                    .error(function (error, status) {
                        callback(error, null);
                    });
            };

            service.getLikedStories = function (uid, callback) {
                $http.post('/api/' + uid + '/analytics/likedStories/')
                    .success(function (data, status) {
                        callback(null, data);
                    })
                    .error(function (error, status) {
                        callback(error, null);
                    });
            };

            service.getTotalReads = function (uid, callback) {
                $http.post('/api/' + uid + '/analytics/totalReads/')
                    .success(function (data, status) {
                        callback(null, data);
                    })
                    .error(function (error, status) {
                        callback(error, null);
                    });
            };

            service.editStory = function (sid, bid, node, response, callback) {
                var formdata = new FormData();

                formdata.append('name', node.name);
                formdata.append('body', node.body);

                var request = {
                    method: 'POST',
                    url: '/api/editStory/' + sid + "/" + bid + "/",
                    data: formdata,
                    headers: {
                        'Content-Type': undefined
                    }
                };

                $http(request)
                    .success(function (data, status) {
                        callback(null, data, response);
                    })
                    .error(function (error, status) {
                        callback(error, null, null);
                    });
            };

            service.addContribution = function (uid, sid, callback) {
                $http.post('/api/' + uid + '/addContribution/' + sid + '/')
                    .success(function (data, status) {
                        callback(null, data);
                    })
                    .error(function (error, status) {
                        callback(error, null);
                    });
            };

        });
})();