(function () {
    "use strict";

    angular.module('storyTeller')
        .controller('profileController', function (storyService, $location, $scope) {

            var profile = this;
            profile.url = location.pathname;
            profile.stories = [];
            profile.haveMore = true;
            profile.user = "";
            profile.image = {};
            profile.uname = "";
            profile.graphAnalytics = {};
            profile.storyAnalytics = {};

            profile.totalReads = 0;
            profile.userLikes = 0;
            profile.userCount = 0;
            profile.userContStories = [];
            profile.likedList = [];

            profile.firstTime = true;
            profile.currentTab = 0;

            profile.set = function (i) {
                profile.currentTab = i;
                if (i == 1 && profile.firstTime) {
                    storyService.getGraphAnalytics(profile.uname, 30, function (err, data) {
                        if (err) {
                            console.log("error in getting data")
                        }
                        else {
                            console.log(data);
                            profile.graphAnalytics = data;
                            profile.initBarGraph('#barGraph', profile.graphAnalytics);
                        }
                    });
                    profile.firstTime = false;
                }
            };

            profile.isSet = function (i) {
                if (profile.currentTab == i) {
                    return true;
                } else {
                    return false;
                }
            };

            var username = profile.url.substring(1, profile.url.indexOf("profile") - 1);
            profile.uname = username;

            var username = profile.url.substring(1, profile.url.indexOf("profile") - 1);

            storyService.getUserByName(username, function (err, data) {
                if (err) {
                    console.log(err);
                }
                else {
                    profile.user = data[0];
                    storyService.getUserStories(profile.user.pk, 0, 10, function (err, data) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            var i = 0;
                            if (data.length < 10) {
                                profile.haveMore = false;
                            }
                            for (i = 0; i < data.length; i++) {
                                profile.stories.push(data[i]);

                                storyService.getLikes(data[i], function (err, data, stories) {
                                    if (err) {
                                        console.log(err);
                                    }
                                    else {
                                        stories.fields.likes = data.length;
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
                            }
                        }
                    });

                    storyService.getNumContributors(profile.user.pk, function (err, data) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            profile.user.fields.contributions = data;
                        }
                    });

                    storyService.getNumStories(profile.user.pk, function (err, data) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            profile.user.fields.stories = data;
                        }
                    });
                }
            });

            storyService.getStoryAnalytics(profile.uname, function (err, data) {
                if (err) {
                    console.log("error in getting data")
                }
                else {
                    profile.storyAnalytics = data;
                }
            });

            storyService.getTotalLikes(profile.uname, function (err, data) {
                if (err) {
                    console.log("error in getting data")
                }
                else {
                    profile.userLikes = data;
                }
            });

            storyService.getTotalContributors(profile.uname, function (err, data) {
                if (err) {
                    console.log("error in getting data")
                }
                else {
                    profile.userCount = data;
                }
            });

            storyService.getTotalContributions(profile.uname, function (err, data) {
                if (err) {
                    console.log("error in getting data")
                }
                else {
                    profile.userContStories = data;
                }
            });

            storyService.getLikedStories(profile.uname, function (err, data) {
                if (err) {
                    console.log("error in getting data")
                }
                else {
                    profile.likedList = data;
                }
            });

            storyService.getLikedStories(profile.uname, function (err, data) {
                if (err) {
                    console.log("error in getting data")
                }
                else {
                    profile.likedList = data;
                }
            });

            storyService.getTotalReads(profile.uname, function (err, data) {
                if (err) {
                    console.log("error in getting data")
                }
                else {
                    profile.totalReads = data;
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
                    accept: function (file, done) {
                        profile.file = file;
                        done();
                    }
                },
                'eventHandlers': {
                    'thumbnail': function (file, dataUrl) {
                        profile.currSource = dataUrl;
                    },
                    'sending': function (file, xhr, formData) {
                    },
                    'success': function (file, response) {
                    }
                }
            };

            profile.addImageDND = function () {
                profile.image.img_file = profile.file;
                storyService.addImage(profile.image, function (err, data) {
                    if (err) {
                        console.log("Image from DND failed");
                    }
                    else {
                        if (data.result != 'false') {
                            profile.image = {};
                            $scope.add_image_form2.$setPristine();
                        }
                        else {
                            alert("Not Authorized");
                        }
                    }
                });
            };


            profile.getMoreStories = function () {
                var last = profile.stories[profile.stories.length - 1];
                storyService.getUserStories(profile.user.pk, last.pk, 10, function (err, data) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        var i = 0;

                        if (data.length < 10) {
                            profile.haveMore = false;
                        }

                        for (i = 0; i < data.length; i++) {
                            profile.stories.push(data[i]);

                            storyService.getLikes(data[i], function (err, data, stories) {
                                if (err) {
                                    console.log(err);
                                }
                                else {
                                    stories.fields.likes = data.length;
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
                        }
                    }
                });
            };

            profile.getStatus = function (data) {
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

            profile.deleteStory = function (element) {
                storyService.deleteStory(element.pk, function (err, data) {
                    if (err) {
                        console.log(err)
                    } else {
                        if (data["result"] === "true") {
                            var index = profile.stories.indexOf(element);
                            profile.stories = profile.stories.splice(0, index).concat(profile.stories.splice(index + 1, profile.stories.length));
                        }
                    }
                });
            };

            profile.initBarGraph = function (elemName) {
                var data = [];

                //for (var i = 0; i < 30; i++) {
                //    bardata.push(Math.random() * 100);
                //}

                //bardata.sort(function(a,b) {
                //    return a - b;
                //});


                //var parseDate = d3.time.format("%Y-%m-%d").parse;
                //
                //profile.graphAnalytics.forEach(function(d) {
                //    var e = {};
                //    e.date = parseDate(d.date);
                //    e.total = +d.total;
                //    bardata.push(e);
                //});
                //
                //console.log(bardata);
                //
                //var w = d3.select(elemName).style("width");
                //var widthlen = w.length;
                //
                //var margin = {top: 70, right: 70, bottom: 70, left: 70};
                //
                //var height = 600 - margin.top - margin.bottom,
                //    width = parseInt(w.slice(0, widthlen - 2)) - margin.right - margin.left;
                //
                //var tooltip = d3.select('body')
                //    .append('div')
                //    .style(
                //        {
                //            'position': 'absolute',
                //            'padding': '0 10px',
                //            'background': 'white',
                //            'opacity': 0
                //        });
                //
                //var yScale = d3.scale.linear()
                //    .domain([0, d3.max(bardata, function(d) { return d.total; })])
                //    .range([0, height]);
                //
                //var xScale = d3.scale.ordinal()
                //    .domain(bardata.map(function(d) { return d.date; }))
                //    .rangeRoundBands([0, width], .05);
                //
                //var colors = d3.scale.linear()
                //    .domain([0, d3.max(bardata, function(d) { return d.total; })])
                //    .range(['#FFB832', '#C61C6F']);
                //
                //
                //var chart = d3.select(elemName)
                //    .append('svg')
                //    .style('background', '#fff')
                //    .attr('width', width + margin.right + margin.left)
                //    .attr('height', height + margin.top + margin.bottom)
                //    .append('g')
                //    .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
                //    .selectAll('rect').data(bardata)
                //    .enter().append('rect')
                //    .style('fill', colors)
                //    .attr('width', xScale.rangeBand())
                //    .attr('height', function(d) { return height - yScale(d.total); })
                //    .attr('x', function (d, i) {
                //        return xScale(i);
                //    })
                //    .attr('y', function(d) { return yScale(d.total); })
                //    .on('mouseover', function (d) {
                //
                //        d3.select(this)
                //            .transition().duration(100)
                //            .style('opacity', 0.5);
                //    })
                //    .on('mouseout', function (d) {
                //        d3.select(this)
                //            .style('opacity', 1);
                //
                //    });
                //chart.transition()
                //    .attr('height', function (d) {
                //        return yScale(d.total);
                //    })
                //    .attr('y', function (d) {
                //        return height - yScale(d.total);
                //    })
                //    .delay(function (d, i) {
                //        return i * 10;
                //    })
                //    .duration(1000)
                //    .ease('elastic');
                //
                //var guideScale = d3.scale.linear()
                //    .domain([0, d3.max(bardata)])
                //    .range([height, 0]);
                //
                //var axis = d3.svg.axis()
                //    .scale(guideScale)
                //    .orient('left')
                //    .ticks(10);
                //
                //var hAxis = d3.svg.axis()
                //    .scale(xScale)
                //    .orient('bottom')
                //    .tickFormat(d3.time.format("%Y-%m-%d"));
                //
                //var guide = d3.select('svg').append('g');
                //
                //axis(guide);
                //
                //guide
                //    .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
                //    .selectAll('path')
                //    .style({'fill': 'none', 'stroke': '#000'});
                //guide.selectAll('line')
                //    .style({'stroke': '#000'});
                //
                //var hGuide = d3.select('svg').append('g');
                //
                //hAxis(hGuide);
                //
                //hGuide
                //    .attr('transform', 'translate(' + margin.left + ', ' + (height + margin.top) + ')')
                //    .selectAll('path')
                //    .style({'fill': 'none', 'stroke': '#000'});
                //hGuide.selectAll('line')
                //    .style({'stroke': '#000'});
                var margin = {top: 20, right: 20, bottom: 70, left: 40},
                    width = 600 - margin.left - margin.right,
                    height = 300 - margin.top - margin.bottom;

// Parse the date / time
                var parseDate = d3.time.format("%Y-%m").parse;

                var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

                var y = d3.scale.linear().range([height, 0]);

                var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom")
                    .tickFormat(d3.time.format("%Y-%m"));

                var yAxis = d3.svg.axis()
                    .scale(y)
                    .orient("left")
                    .ticks(10);

                var svg = d3.select(elemName).append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform",
                        "translate(" + margin.left + "," + margin.top + ")");
                
                profile.graphAnalytics.forEach(function (d) {
                    var e = {};
                    e.date = parseDate(d.date);
                    e.value = +d.total;
                    data.push(e);
                });

                x.domain(data.map(function (d) {
                    return d.date;
                }));
                y.domain([0, d3.max(data, function (d) {
                    return d.value;
                })]);

                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis)
                    .selectAll("text")
                    .style("text-anchor", "end")
                    .attr("dx", "-.8em")
                    .attr("dy", "-.55em")
                    .attr("transform", "rotate(-90)");

                svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis)
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text("Value ($)");

                svg.selectAll("bar")
                    .data(data)
                    .enter().append("rect")
                    .style("fill", "steelblue")
                    .attr("x", function (d) {
                        return x(d.date);
                    })
                    .attr("width", x.rangeBand())
                    .attr("y", function (d) {
                        return y(d.value);
                    })
                    .attr("height", function (d) {
                        return height - y(d.value);
                    });

            };

            profile.set(1);

        })
})();