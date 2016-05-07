(function() {
    "use strict";

    angular.module('storyTeller')
        .controller('profileController', function(storyService, $location, $scope, $window) {

            var profile = this;
            profile.url = location.pathname;
            profile.profilePicText = "Change Profile Picture";
            profile.uploadPic = false;
            profile.stories = [];
            profile.haveMore = true;
            profile.user = "";
            profile.image = {};
            profile.uname = "";
            profile.me = "";
            profile.contName = "";
            profile.fanName = "";
            profile.graphAnalytics = {};
            profile.graph0 = {};
            profile.graph1 = {};
            profile.graph2 = {};
            profile.graphAnalytics1 = {};
            profile.graphAnalytics2 = {};
            profile.storyAnalytics = {};

            profile.totalReads = 0;
            profile.userLikes = 0;
            profile.userCount = 0;
            profile.userContStories = [];
            profile.likedList = [];

            profile.graphTab = 0;

            profile.firstTime = true;
            profile.firstTime1 = true;
            profile.firstTime2 = true;
            profile.currentTab = 0;

            var root, currentNode, tree, diagonal, svg;

            var i = 0,
                duration = 750;


            profile.showDropZone = function() {
                if (profile.uploadPic == false) {
                    profile.uploadPic = true;
                } else {
                    profile.uploadPic = false;
                }
            };

            profile.setGraph = function(i) {
                profile.graphTab = i;
                if (i == 0) {
                    if (profile.firstTime) {
                        storyService.getGraphAnalytics(profile.uname, 30, function(err, data) {
                            if (err) {
                                console.log("error in getting data")
                            } else {
                                profile.graph0 = data;
                                //console.log(profile.graph0);
                                profile.graphAnalytics = data;
                                $('#barGraph').html('');
                                profile.initBarGraph('#barGraph');
                            }
                        });
                        profile.firstTime = false;
                    } else {
                        profile.graphAnalytics = profile.graph0;
                        //console.log(profile.graph0);
                        $('#barGraph').html('');
                        profile.initBarGraph('#barGraph');
                    }
                } else if (i == 1) {
                    if (profile.firstTime1) {
                        storyService.getGraphAnalytics(profile.uname, 60, function(err, data) {
                            if (err) {
                                console.log("error in getting data")
                            } else {
                                profile.graph1 = data;
                                profile.graphAnalytics = data;
                                $('#barGraph').html('');
                                profile.initBarGraph('#barGraph');
                            }
                        });
                        profile.firstTime1 = false;
                    } else {
                        profile.graphAnalytics = profile.graph1;
                        $('#barGraph').html('');
                        profile.initBarGraph('#barGraph');
                    }
                } else if (i == 2) {
                    if (profile.firstTime2) {
                        storyService.getGraphAnalytics(profile.uname, 90, function(err, data) {
                            if (err) {
                                console.log("error in getting data")
                            } else {
                                profile.graph2 = data;
                                profile.graphAnalytics = data;
                                $('#barGraph').html('');
                                profile.initBarGraph('#barGraph');
                            }
                        });
                        profile.firstTime2 = false;
                    } else {
                        profile.graphAnalytics = profile.graph2;
                        $('#barGraph').html('');
                        profile.initBarGraph('#barGraph');
                    }
                }
            };

            /************* CallBack Functions ***************/
            profile.gI = function(err, data, allstories) {
                if (err) {
                    console.log("error in getting data");
                } else {
                    var i = 0;
                    var datalist = data;
                    for (i = 0; i < datalist.length; i++) {
                        var data = datalist[i];
                        var story = allstories[i];

                        story.fields.userInfo = JSON.parse(data['u'])[0];

                        if (data['rl'] === 'true') {
                            story.fields.isBookmarked = true;
                        } else {
                            story.fields.isBookmarked = false;
                        }

                        story.fields.likes = JSON.parse(data['l']);

                        if (data['liked'] === 'true') {
                            story.fields.isLiked = true;
                        } else {
                            story.fields.isLiked = false;
                        }

                        story.fields.contributors = JSON.parse(data['c']);

                        profile.stories.push(story);
                    }
                }
            };

            profile.gIM = function(err, data, allstories) {
                if (err) {
                    console.log("error in getting data");
                } else {
                    var i = 0;
                    var datalist = data;
                    for (i = 0; i < datalist.length; i++) {
                        var data = datalist[i];
                        var story = allstories[i];

                        story.fields.userInfo = JSON.parse(data['u'])[0];

                        if (data['rl'] === 'true') {
                            story.fields.isBookmarked = true;
                        } else {
                            story.fields.isBookmarked = false;
                        }

                        story.fields.likes = JSON.parse(data['l']);

                        if (data['liked'] === 'true') {
                            story.fields.isLiked = true;
                        } else {
                            story.fields.isLiked = false;
                        }

                        story.fields.contributors = JSON.parse(data['c']);
                    }
                }
            };
            /**************************************************/

            profile.set = function(i) {
                profile.currentTab = i;
                if (i == 1 && profile.firstTime && !profile.isEmpty()) {

                    profile.setGraph(0);

                    storyService.getUserByID(profile.storyAnalytics.contributor, function(err, data) {
                        if (err) {
                            console.log("error in getting data");
                        } else {
                            profile.contName = data;
                        }
                    });

                    storyService.getUserByID(profile.storyAnalytics.fan, function(err, data) {
                        if (err) {
                            console.log("error in getting data");
                        } else {
                            profile.fanName = data;
                        }
                    });

                    //profile.firstTime = false;
                } else if (i == 1 && !profile.firstTime && !profile.isEmpty()) {
                    profile.firstTime = true;
                    profile.setGraph(0);
                }
            };

            profile.isSet = function(i) {
                if (profile.currentTab == i) {
                    return true;
                } else {
                    return false;
                }
            };

            profile.isSetGraph = function(i) {
                if (profile.graphTab == i) {
                    return true;
                } else {
                    return false;
                }
            };

            var username = profile.url.substring(1, profile.url.indexOf("profile") - 1);
            profile.uname = username;

            storyService.getUserByRequest(function(err, data) {
                if (err) {
                    console.log("error in getting data");
                } else {
                    profile.me = data[0];
                }
            });

            storyService.getUserByName(username, function(err, data) {
                if (err) {
                    console.log("error in getting data");
                } else {
                    profile.user = data[0];
                    storyService.getUserStories(profile.user.pk, 0, 10, function(err, data) {
                        if (err) {
                            console.log("error in getting data");
                        } else {
                            if (data.length < 10) {
                                profile.haveMore = false;
                            }

                            var i = data.length - 1;
                            storyService.getInfo(data[i].pk, data[0].pk, 3, data, profile.uname, profile.gI);
                        }
                    });

                    storyService.getNumContributors(profile.user.pk, function(err, data) {
                        if (err) {
                            console.log("error in getting data");
                        } else {
                            profile.user.fields.contributions = data;
                        }
                    });

                    storyService.getNumStories(profile.user.pk, function(err, data) {
                        if (err) {
                            console.log("error in getting data");
                        } else {
                            profile.user.fields.stories = data;
                        }
                    });
                }
            });

            storyService.getStoryAnalytics(profile.uname, function(err, data) {
                if (err) {
                    console.log("error in getting data");
                } else {
                    profile.storyAnalytics = data;
                    profile.set(0);

                }
            });

            storyService.getTotalLikes(profile.uname, function(err, data) {
                if (err) {
                    console.log("error in getting data");
                } else {
                    profile.userLikes = data;
                }
            });

            storyService.getTotalContributors(profile.uname, function(err, data) {
                if (err) {
                    console.log("error in getting data");
                } else {
                    profile.userCount = data;
                }
            });

            storyService.getTotalContributions(profile.uname, function(err, data) {
                if (err) {
                    console.log("error in getting data");
                } else {
                    profile.userContStories = data;
                    var i = data.length - 1;
                    storyService.getInfo(data[0].pk, data[i].pk, 5, data, profile.uname, profile.gIM);
                }
            });

            storyService.getLikedStories(profile.uname, function(err, data) {
                if (err) {
                    console.log("error in getting data");
                } else {
                    profile.likedList = data;
                    var i = data.length - 1;
                    storyService.getInfo(data[0].pk, data[i].pk, 4, data, profile.uname, profile.gIM);
                }
            });

            storyService.getTotalReads(profile.uname, function(err, data) {
                if (err) {
                    console.log("error in getting data");
                } else {
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
                    accept: function(file, done) {
                        profile.file = file;
                        done();
                    }
                },
                'eventHandlers': {
                    'thumbnail': function(file, dataUrl) {
                        profile.currSource = dataUrl;
                    },
                    'sending': function(file, xhr, formData) {},
                    'success': function(file, response) {}
                }
            };

            profile.addImageDND = function() {
                profile.image.img_file = profile.file;
                storyService.addImage(profile.image, function(err, data) {
                    if (err) {
                        console.log("Image from DND failed");
                    } else {
                        if (data.result != 'false') {
                            profile.image = {};
                            profile.uploadPic = false;
                            $window.location.href = profile.url;
                        } else {
                            alert("Not Authorized");
                        }
                    }
                });
            };


            profile.getMoreStories = function() {
                var last = profile.stories[profile.stories.length - 1];
                storyService.getUserStories(profile.user.pk, last.pk, 10, function(err, data) {
                    if (err) {
                        console.log("error in getting data");
                    } else {
                        if (data.length < 10) {
                            profile.haveMore = false;
                        }

                        var i = data.length - 1;

                        storyService.getInfo(data[0].pk, data[i].pk, 3, data, profile.uname, profile.gI);
                    }
                });
            };

            profile.getStatus = function(data) {
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

            profile.deleteStory = function(element) {
                storyService.deleteStory(element.pk, function(err, data) {
                    if (err) {
                        console.log("error in getting data");
                    } else {
                        if (data["result"] === "true") {
                            var index = profile.stories.indexOf(element);
                            profile.stories = profile.stories.splice(0, index).concat(profile.stories.splice(index + 1, profile.stories.length));
                        }
                    }
                });
            };

            profile.bookmark = function(data) {
                storyService.addToReadLater(profile.me.pk, data, function(err, data, cstory) {
                    if (err) {
                        console.log("error in getting data");
                    } else {
                        if (data["result"] === "true") {
                            cstory.fields.isBookmarked = true;
                        }
                    }
                });
            };

            profile.unbookmark = function(data) {
                storyService.removeFromReadLater(profile.me.pk, data, function(err, data, cstory) {
                    if (err) {
                        console.log("error in getting data");
                    } else {
                        if (data["result"] === "true") {
                            cstory.fields.isBookmarked = false;
                        }
                    }
                });
            };

            profile.like = function(data) {
                storyService.Like(profile.me.pk, data, function(err, data, cstory) {
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

            profile.unlike = function(data) {
                storyService.Unlike(profile.me.pk, data, function(err, data, cstory) {
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

            profile.changeToWriting = function(story) {
                //console.log(story);
                storyService.setIncomplete(story, function(err, data, story) {
                    if (err) {
                        console.log(err);
                    } else {
                        location.pathname = "/" + story.pk + "/story";
                    }
                });
            };

            profile.initBarGraph = function(elemName) {

                var bardata = [];

                profile.graphAnalytics.forEach(function(d, i) {
                    var e = {};
                    e.date = d.date;
                    e.total = d.total;
                    e.index = i + 1;
                    bardata.push(e);
                });

                var domainData = [];

                profile.graphAnalytics.forEach(function(d) {
                    var e = "";
                    e = d.date;
                    domainData.push(e);
                });

                var w = d3.select(elemName).style("width");
                var widthlen = w.length;

                var margin = {
                    top: 70,
                    right: 70,
                    bottom: 70,
                    left: 70
                };

                var height = 600 - margin.top - margin.bottom,
                    width = parseInt(w.slice(0, widthlen - 2)) - margin.right - margin.left,
                    barWidth = 50,
                    barOffset = 10;

                var tooltip = d3.select('body')
                    .append('div')
                    .classed('d3-tooltip', true)
                    .style({
                        'position': 'absolute',
                        'padding': '0 10px',
                        'background': 'white',
                        'opacity': 0
                    });

                var yScale = d3.scale.linear()
                    .domain([0, d3.max(bardata, function(d) {
                        return d.total;
                    })])
                    .range([0, height]);

                var xScale = d3.scale.ordinal()
                    .domain(bardata.map(function(d) {
                        return d.date;
                    }))
                    .rangeBands([0, width], 0.1, 1);

                var chart = d3.select(elemName)
                    .append('svg')
                    .style('background', '#fff')
                    .attr('width', width + margin.right + margin.left)
                    .attr('height', height + margin.top + margin.bottom)
                    .append('g')
                    .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
                    .selectAll('rect').data(bardata)
                    .enter().append('rect')
                    .style('fill', "#fb5e58")
                    .attr('width', xScale.rangeBand())
                    .attr('height', 0)
                    .attr('x', function(d, i) {
                        return xScale(d.date);
                    })
                    .attr('y', height)
                    .on('mouseover', function(d) {

                        setTimeout(function() {
                            tooltip.transition()
                                .style('opacity', 0);
                        }, 3000);

                        tooltip.transition()
                            .style('opacity', 0.9);

                        tooltip.html(d.total)
                            .style({
                                'left': (d3.event.pageX - 35) + 'px',
                                'top': (d3.event.pageY - 30) + 'px'
                            });

                        d3.select(this)
                            .transition().duration(100)
                            .style('opacity', 0.5);
                    })
                    .on('mouseout', function(d) {
                        d3.select(this)
                            .transition().duration(100)
                            .style('opacity', 1);

                        tooltip.style('visibility', 'none');

                    });
                chart.transition()
                    .attr('height', function(d) {
                        return yScale(d.total);
                    })
                    .attr('y', function(d) {
                        return height - yScale(d.total);
                    })
                    .delay(function(d, i) {
                        return i * 10;
                    })
                    .duration(1000)
                    .ease('elastic');


                var guideScale = d3.scale.linear()
                    .domain([0, d3.max(bardata, function(d) {
                        return d.total;
                    })])
                    .range([height, 0]);

                var axis = d3.svg.axis()
                    .scale(guideScale)
                    .orient('left')
                    .ticks(10);

                var hAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient('bottom')
                    .ticks(30);

                var guide = d3.select('svg').append('g');

                axis(guide);

                guide
                    .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
                    .selectAll('path')
                    .style({
                        'fill': 'none',
                        'stroke': '#000'
                    });
                guide.selectAll('line')
                    .style({
                        'stroke': '#000'
                    });

                var hGuide = d3.select('svg').append('g');

                hAxis(hGuide);

                hGuide
                    .attr('transform', 'translate(' + margin.left + ', ' + (height + margin.top) + ')')
                    .selectAll('path')
                    .style({
                        'fill': 'none',
                        'stroke': '#000'
                    });
                hGuide.selectAll('line')
                    .style({
                        'stroke': '#000'
                    });


            };

            this.update = function(sid, source, elem) {

                //console.log(source);
                //console.log(elem);

                // Compute the new tree layout.
                var nodes = tree.nodes(root),
                    links = tree.links(nodes);

                // Normalize for fixed-depth.
                nodes.forEach(function(d) {
                    profile.storyAnalytics.stories.forEach(function(d1) {
                        if (d1.sid === sid) {
                            var most = [];
                            var least = [];
                            least = d1["l_brach"];
                            least.forEach(function(d2) {
                                if (d.branchid == d2) {
                                    //console.log('light branch found');
                                    //console.log(d2);
                                    d.color = 'pink';
                                }
                            });
                            most = d1["m_brach"];
                            most.forEach(function(d2) {
                                if (d.branchid == d2) {
                                    //console.log('heavy branch found');
                                    //console.log(d2);
                                    d.color = 'red';
                                }
                            });
                        }
                    });
                    d.y = d.depth * 90;
                });

                // Update the nodes…
                var node = svg.selectAll("g.node")
                    .data(nodes, function(d) {
                        return d.id || (d.id = ++i);
                    });

                // Enter any new nodes at the parent's previous position.
                var nodeEnter = node.enter().append("g")
                    .attr("class", "node")
                    .attr("transform", function(d) {
                        return "translate(" + source.x0 + "," + source.y0 + ")";
                    });

                nodeEnter.append("circle")
                    .attr("r", 1e-6)
                    .style("fill", function(d) {
                        return d.color;
                    });

                nodeEnter.append("text")
                    .attr("x", function(d) {
                        return d.children || d._children ? -13 : 13;
                    })
                    .attr("dy", ".35em")
                    .attr("text-anchor", function(d) {
                        return d.children || d._children ? "end" : "start";
                    })
                    .text(function(d) {
                        return d.name;
                    })
                    .style("fill-opacity", 1e-6);

                // Transition nodes to their new position.
                var nodeUpdate = node.transition()
                    .duration(duration)
                    .attr("transform", function(d) {
                        return "translate(" + d.x + "," + d.y + ")";
                    });

                nodeUpdate.select("circle")
                    .attr("r", 10)
                    .style("fill", function(d) {
                        return d.color;
                    });

                nodeUpdate.select("text")
                    .style("fill-opacity", 1)
                    .text(function(d) {
                        return d.name;
                    });

                // Transition exiting nodes to the parent's new position.
                var nodeExit = node.exit().transition()
                    .duration(duration)
                    .attr("transform", function(d) {
                        return "translate(" + source.x + "," + source.y + ")";
                    })
                    .remove();

                nodeExit.select("circle")
                    .attr("r", 1e-6);

                nodeExit.select("text")
                    .style("fill-opacity", 1e-6);

                // Update the links…
                var link = svg.selectAll("path.link")
                    .data(links, function(d) {
                        return d.target.id;
                    });

                // Enter any new links at the parent's previous position.
                link.enter().insert("path", "g")
                    .attr("class", "link")
                    .attr("d", function(d) {
                        var o = {
                            x: source.x0,
                            y: source.y0
                        };
                        return diagonal({
                            source: o,
                            target: o
                        });
                    });

                // Transition links to their new position.
                link.transition()
                    .duration(duration)
                    .attr("d", diagonal);

                // Transition exiting nodes to the parent's new position.
                link.exit().transition()
                    .duration(duration)
                    .attr("d", function(d) {
                        var o = {
                            x: source.x,
                            y: source.y
                        };
                        return diagonal({
                            source: o,
                            target: o
                        });
                    })
                    .remove();

                // Stash the old positions for transition.
                nodes.forEach(function(d) {
                    d.x0 = d.x;
                    d.y0 = d.y;
                });

            };

            profile.findPos = function(obj) {
                var curtop = 0;
                if (obj.offsetParent) {
                    do {
                        curtop += obj.offsetTop;
                    } while (obj = obj.offsetParent);
                    return [curtop];
                }
            };

            profile.click = function(sid, d, elem) {
                currentNode._children = null;
                if (d.children) {
                    d._children = [{
                        "somev": "hello"
                    }];
                } else {
                    d._children = [{
                        "somev": "hello"
                    }];
                }
                window.scroll(0, profile.findPos(d));
                profile.update(sid, d, elem);
            };


            profile.initTree = function(sid, treeData, elem) {
                // Source http://bl.ocks.org/d3noob/8375092

                var margin = {
                        top: 150,
                        right: 80,
                        bottom: 80,
                        left: 80
                    },
                    width = 900 - margin.right - margin.left,
                    height = 800 - margin.top - margin.bottom;

                tree = d3.layout.tree()
                    .size([width, height]);

                diagonal = d3.svg.diagonal()
                    .projection(function(d) {
                        return [d.x, d.y];
                    });

                svg = d3.select(elem).append("svg")
                    .attr("width", width + margin.right + margin.left)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                root = treeData[0];
                root.x0 = height / 2;
                root.y0 = 0;
                currentNode = root;

                profile.click(sid, root, elem);
                profile.update(sid, root, elem);

                // TODO: Not certain what this is, figure it out
                d3.select(self.frameElement).style("height", "500px");
            };

            $scope.revealTree = function(sid) {
                $('.modal').modal('show');
                $('.modal').on('hidden.bs.modal', function(e) {
                    $('.modal-content').html('');
                });
                storyService.getStory(sid, function(err, data) {
                    if (err) {
                        console.log(err);
                    } else {
                        var treeData = [data];
                        //console.log(treeData);
                        profile.initTree(sid, treeData, ".modal-content");
                    }
                });
            };

            profile.isEmpty = function() {
                if (profile.stories.length === 0) {
                    return true;
                } else {
                    return false;
                }
            };


        });
})();
