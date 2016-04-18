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
            profile.contName = "";
            profile.fanName = "";
            profile.graphAnalytics = {};
            profile.storyAnalytics = {};

            profile.totalReads = 0;
            profile.userLikes = 0;
            profile.userCount = 0;
            profile.userContStories = [];
            profile.likedList = [];

            profile.firstTime = true;
            profile.currentTab = 0;

            var root, currentNode, tree, diagonal, svg;

            var i = 0,
                duration = 750;


            profile.set = function (i) {
                profile.currentTab = i;
                if (i == 1 && profile.firstTime) {
                    storyService.getGraphAnalytics(profile.uname, 30, function (err, data) {
                        if (err) {
                            console.log("error in getting data")
                        }
                        else {
                            profile.graphAnalytics = data;
                            profile.initBarGraph('#barGraph', profile.graphAnalytics);
                        }
                    });

                    storyService.getUserByID(profile.storyAnalytics.contributor, function (err, data) {
                        if (err) {
                            console.log("error in getting data")
                        }
                        else {
                            profile.contName = data;
                        }
                    });

                    storyService.getUserByID(profile.storyAnalytics.fan, function (err, data) {
                        if (err) {
                            console.log("error in getting data")
                        }
                        else {
                            profile.fanName = data;
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
                            console.log(data);
                            var i = 0;
                            for (i = 0; i < data.length; i++) {
                                profile.stories.push(data[i]);

                                storyService.getContributors(data[i], function (err, data, stories) {
                                    if (err) {
                                        console.log(err);
                                    }
                                    else {
                                        stories.fields.contributors = data.length;
                                    }
                                });

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
                                                    return (cV.fields.user === profile.user.pk);
                                                }
                                            }, false);
                                        stories.fields.isLiked = isLiked;
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
                    profile.set(0);

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
                    console.log(profile.userCount);
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

            profile.bookmark = function (data) {
                storyService.addToReadLater(profile.user.pk, data, function (err, data, cstory) {
                    if (err) {
                        console.log(err);
                    } else {
                        if (data["result"] === "true") {
                            cstory.fields.isBookmarked = true;
                        }
                    }
                });
            };

            profile.unbookmark = function (data) {
                storyService.removeFromReadLater(profile.user.pk, data, function (err, data, cstory) {
                    if (err) {
                        console.log(err);
                    } else {
                        if (data["result"] === "true") {
                            cstory.fields.isBookmarked = false;
                        }
                    }
                });
            };

            profile.like = function (data) {
                storyService.Like(profile.user.pk, data, function (err, data, cstory) {
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

            profile.unlike = function (data) {
                storyService.Unlike(profile.user.pk, data, function (err, data, cstory) {
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

            profile.initBarGraph = function (elemName) {

                var bardata = [];

                //for (var i = 0; i < 30; i++) {
                //    bardata.push(Math.random() * 100);
                //}

                profile.graphAnalytics.forEach(function (d, i) {
                    var e = {};
                    e.date = d.date;
                    e.total = d.total;
                    e.index = i + 1;
                    bardata.push(e);
                });

                var domainData = [];

                profile.graphAnalytics.forEach(function (d) {
                    var e = "";
                    e = d.date;
                    domainData.push(e);
                });

                var w = d3.select(elemName).style("width");
                var widthlen = w.length;

                var margin = {top: 70, right: 70, bottom: 70, left: 70};

                var height = 600 - margin.top - margin.bottom,
                    width = parseInt(w.slice(0, widthlen - 2)) - margin.right - margin.left,
                    barWidth = 50,
                    barOffset = 10;

                var tooltip = d3.select('body')
                    .append('div')
                    .classed('d3-tooltip', true)
                    .style(
                        {
                            'position': 'absolute',
                            'padding': '0 10px',
                            'background': 'white',
                            'opacity': 0
                        });

                var yScale = d3.scale.linear()
                    .domain([0, d3.max(bardata, function (d) {
                        return d.total;
                    })])
                    .range([0, height]);

                var xScale = d3.scale.ordinal()
                    .domain(bardata.map(function (d) {
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
                    .attr('x', function (d, i) {
                        return xScale(d.date);
                    })
                    .attr('y', height)
                    .on('mouseover', function (d) {

                        setTimeout(function () {
                            tooltip.transition()
                                .style('opacity', 0)
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
                    .on('mouseout', function (d) {
                        d3.select(this)
                            .transition().duration(100)
                            .style('opacity', 1);

                        tooltip.style('visibility', 'none');

                    });
                chart.transition()
                    .attr('height', function (d) {
                        return yScale(d.total);
                    })
                    .attr('y', function (d) {
                        return height - yScale(d.total);
                    })
                    .delay(function (d, i) {
                        return i * 10;
                    })
                    .duration(1000)
                    .ease('elastic');


                var guideScale = d3.scale.linear()
                    .domain([0, d3.max(bardata, function (d) {
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
                    .style({'fill': 'none', 'stroke': '#000'});
                guide.selectAll('line')
                    .style({'stroke': '#000'});

                var hGuide = d3.select('svg').append('g');

                hAxis(hGuide);

                hGuide
                    .attr('transform', 'translate(' + margin.left + ', ' + (height + margin.top) + ')')
                    .selectAll('path')
                    .style({'fill': 'none', 'stroke': '#000'});
                hGuide.selectAll('line')
                    .style({'stroke': '#000'});


            };

            this.update = function (source, elem) {


                // Compute the new tree layout.
                var nodes = tree.nodes(root),
                    links = tree.links(nodes);

                // Normalize for fixed-depth.
                nodes.forEach(function (d) {
                    d.y = d.depth * 90;
                });

                // Update the nodes…
                var node = svg.selectAll("g.node")
                    .data(nodes, function (d) {
                        return d.id || (d.id = ++i);
                    });

                // Enter any new nodes at the parent's previous position.
                var nodeEnter = node.enter().append("g")
                    .attr("class", "node")
                    .attr("transform", function (d) {
                        return "translate(" + source.x0 + "," + source.y0 + ")";
                    });

                nodeEnter.append("circle")
                    .attr("r", 1e-6)
                    .style("fill", function (d) {
                        return d._children ? "lightsteelblue" : "#fff";
                    });

                nodeEnter.append("text")
                    .attr("x", function (d) {
                        return d.children || d._children ? -13 : 13;
                    })
                    .attr("dy", ".35em")
                    .attr("text-anchor", function (d) {
                        return d.children || d._children ? "end" : "start";
                    })
                    .text(function (d) {
                        return d.name;
                    })
                    .style("fill-opacity", 1e-6);

                // Transition nodes to their new position.
                var nodeUpdate = node.transition()
                    .duration(duration)
                    .attr("transform", function (d) {
                        return "translate(" + d.x + "," + d.y + ")";
                    });

                nodeUpdate.select("circle")
                    .attr("r", 10)
                    .style("fill", function (d) {
                        return d._children ? "#fb5e58" : "#fff";
                    });

                nodeUpdate.select("text")
                    .style("fill-opacity", 1)
                    .text(function (d) {
                        return d.name;
                    });

                // Transition exiting nodes to the parent's new position.
                var nodeExit = node.exit().transition()
                    .duration(duration)
                    .attr("transform", function (d) {
                        return "translate(" + source.x + "," + source.y + ")";
                    })
                    .remove();

                nodeExit.select("circle")
                    .attr("r", 1e-6);

                nodeExit.select("text")
                    .style("fill-opacity", 1e-6);

                // Update the links…
                var link = svg.selectAll("path.link")
                    .data(links, function (d) {
                        return d.target.id;
                    });

                // Enter any new links at the parent's previous position.
                link.enter().insert("path", "g")
                    .attr("class", "link")
                    .attr("d", function (d) {
                        var o = {x: source.x0, y: source.y0};
                        return diagonal({source: o, target: o});
                    });

                // Transition links to their new position.
                link.transition()
                    .duration(duration)
                    .attr("d", diagonal);

                // Transition exiting nodes to the parent's new position.
                link.exit().transition()
                    .duration(duration)
                    .attr("d", function (d) {
                        var o = {x: source.x, y: source.y};
                        return diagonal({source: o, target: o});
                    })
                    .remove();

                // Stash the old positions for transition.
                nodes.forEach(function (d) {
                    d.x0 = d.x;
                    d.y0 = d.y;
                });

            };

            profile.findPos = function (obj) {
                var curtop = 0;
                if (obj.offsetParent) {
                    do {
                        curtop += obj.offsetTop;
                    } while (obj = obj.offsetParent);
                    return [curtop];
                }
            };

            profile.click = function (d, elem) {
                currentNode._children = null;
                if (d.children) {
                    d._children = [{"somev": "hello"}];
                } else {
                    d._children = [{"somev": "hello"}];
                }
                window.scroll(0, profile.findPos(d));
                profile.update(d, elem);
            };


            profile.initTree = function (treeData, elem) {
                // Source http://bl.ocks.org/d3noob/8375092

                var margin = {top: 50, right: 80, bottom: 80, left: 80},
                    width = 900 - margin.right - margin.left,
                    height = 800 - margin.top - margin.bottom;

                tree = d3.layout.tree()
                    .size([width, height]);

                diagonal = d3.svg.diagonal()
                    .projection(function (d) {
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

                profile.click(root, elem);
                profile.update(root, elem);

                // TODO: Not certain what this is, figure it out
                d3.select(self.frameElement).style("height", "500px");
            };

            $scope.revealTree = function (sid) {
                $('.modal').modal('show');
                $('.modal').on('hidden.bs.modal', function (e) {
                   $('.modal-content').html('');
                });
                storyService.getStory(sid, function (err, data) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        var treeData = [data];
                        console.log(treeData);
                        profile.initTree(treeData, ".modal-content");
                    }
                });
            };

        })
})();