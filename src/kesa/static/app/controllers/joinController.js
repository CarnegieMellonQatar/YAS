(function () {
    "use strict";

    angular.module('storyTeller')
        .controller('joinController', function (MiscService, $location, storyService, $scope) {
            var id = location.pathname.substring(1, location.pathname.indexOf("story") - 1);

            var ctrl = this;

            ctrl.joinID = id;
            ctrl.title = "";
            ctrl.canAdd = true;
            ctrl.profile = null;
            var root, currentNode, tree, diagonal, svg;

            var peer = null;
            var conn = [];
            var index = -1;
            var closed = false;
            var editMode = false;

            var i = 0,
                duration = 750;

            storyService.getUserByRequest(function (err, data) {
                if (err) {
                    console.log("error in getting data");
                } else {
                    ctrl.profile = data[0];
                }
            });

            this.join = function () {
                peer = new Peer({host: 'storypeerserver.herokuapp.com', secure: true, port: 443});

                peer.on('open', function (id) {
                    ctrl.connect(ctrl.joinID);
                });

                peer.on('connection', function (connec) {
                    conn.push(connec);
                    index = index + 1;
                });

            };

            this.applyChanges = function (response) {
                var contact;
                switch (response.action) {
                    case 0:
                        // Add a branch
                        var newBranch =
                        {
                            "name": response.name,
                            "body": response.body
                        };
                        MiscService.addRemoteBranchr(root, newBranch, response.parentid);
                        contact = MiscService.findContactNoder(root, response.parentid);

                        if (contact.some) {
                            ctrl.update(contact.obj, false, false, 0, null);
                        } else {
                            console.log("should not be here");
                        }
                        break;
                    case 1:
                        // Delete a branch
                        contact = MiscService.findContactNoder(root, response.currentid);
                        ctrl.deleteBranchr(null, root, response.currentid);

                        if (contact.some) {
                            if (contact.obj.id == currentNode.id) {
                                MiscService.customAlert("Master has deleted your current node, sorry");
                                ctrl.update(contact.obj.parent, false, false, 1, null);
                                ctrl.click(currentNode.parent);
                            } else {
                                ctrl.update(contact.obj.parent, false, false, 1, null);
                            }
                        } else {
                            console.log("should not be here");
                        }
                        break;
                    case 2:
                        // Edit a branch
                        contact = MiscService.findContactNoder(root, response.currentid);
                        contact.obj.name = response.name;
                        contact.obj.body = response.body;

                        if (contact.some) {
                            ctrl.update(contact.obj, false, false, 0, null);
                            console.log(root);
                        } else {
                            console.log("should not be here");
                        }
                        break;
                    case 3:
                        // Init connection, startup the tree
                        var treeData = response.initRoot;
                        $scope.title = response.title;
                        $scope.$apply();
                        ctrl.initTree(treeData);
                        conn.forEach(function (element) {
                            var toSend = MiscService.createPacket(3, null, null);
                            toSend.myid = peer.id;
                            toSend.user = ctrl.profile.pk;
                            element.send(MiscService.stringify(toSend));
                        });
                        break;
                    case 4:
                        currentNode.branchid = response.branchid;
                        ctrl.canAdd = !ctrl.canAdd;
                        break;
                    case 5:
                        peer.disconnect();
                        MiscService.customAlertJumbo("Master has disconnected. Redirecting!");
                        setTimeout(function () {
                            location.pathname = "/stories";
                        }, 3500);
                        break;
                    case 6:
                        peer.disconnect();
                        MiscService.customAlertJumbo("Master published the story. Redirecting!");
                        setTimeout(function () {
                            location.pathname = "/"+ctrl.joinID+"/story";
                        }, 3500);
                        break;
                    default:
                        console.log("Block code unrecognized, doing nothing");
                }

            };

            this.connect = function (id) {
                conn.push(peer.connect(id));
                index = index + 1;

                conn[index].on('open', function () {

                    conn[index].on('data', function (data) {
                        var response = JSON.parse(data);
                        ctrl.applyChanges(response);
                    });

                    conn[index].on('disconnected', function (data){
                        console.log("random");
                    });

                    conn[index].on('destroyed', function (data){
                        console.log("random1");
                    });

                    conn[index].on('close', function (data){
                        console.log("random2");
                    });
                });
            };

            this.update = function (source, sendToPeers, changeCurrentNode, action, specialNode) {

                var cont = d3.select(".story-container");

                if (closed) {
                    cont.classed("col-xs-4", true)
                        .classed("animated", true)
                        .classed("fadeInRightBig", true);
                }

                d3.select(".tree-container").classed("col-xs-7", true);

                // Compute the new tree layout.
                var nodes = tree.nodes(root),
                    links = tree.links(nodes);

                // Normalize for fixed-depth.
                nodes.forEach(function (d) {
                    d.y = d.depth * 180;
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
                    })
                    .on("click", ctrl.click);

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
                        return d._children ? "#D11C24" : "#fff";
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

                if (changeCurrentNode) {

                    cont.html("");

                    cont.append("div")
                        .classed("close-story-button", true)
                        .text("x")
                        .on("click", ctrl.removeSide);

                    if (editMode === true) {
                        cont.append("textarea")
                            .classed("expanding", true)
                            .classed("title-edit", true)
                            .text(source.name);

                        cont.append("textarea")
                            .classed("expanding", true)
                            .classed("body-edit", true)
                            .text(source.body);

                        cont.append("div")
                            .classed("save-branch-button", true)
                            .classed("col-xs-5", true)
                            .text("save")
                            .on("click", ctrl.saveBranch);

                        cont.append("div")
                            .classed("edit-branch-button", true)
                            .classed("col-xs-5", true)
                            .text("cancel")
                            .on("click", ctrl.editBranch);

                        ctrl.addTextArea();

                    } else {
                        cont.append("div")
                            .classed("story-section-title", true)
                            .text(source.name);

                        cont.append("div")
                            .classed("story-section-body", true)
                            .text(source.body);
                        cont.append("div")
                            .classed("add-branch-button", true)
                            .text("add branch")
                            .on("click", ctrl.addBranch);

                        cont.append("div")
                            .classed("edit-branch-button-full", true)
                            .text("edit branch")
                            .on("click", ctrl.editBranch);
                    }


                    currentNode = source;
                    closed = false;
                }

                if (sendToPeers) {
                    conn.forEach(function (element) {
                        console.log(specialNode);
                        console.log(root);
                        console.log(source.id);
                        var toSend = MiscService.createPacket(action, specialNode, source.id);
                        toSend.myid = peer.id;
                        toSend.user = ctrl.profile.pk;
                        element.send(MiscService.stringify(toSend));
                    });
                }

            };

            // Toggle children on click.
            this.click = function (d) {
                currentNode._children = null;
                if (d.children) {
                    d._children = [{"somev": "hello"}];
                    //d.children = [{"somev":"hello"}];
                } else {
                    //d.children = d._children;
                    d._children = [{"somev": "hello"}];
                }
                window.scroll(0, ctrl.findPos(d));
                ctrl.update(d, false, true, 4, null);
            };

            this.addBranch = function () {
                // If not leaf
                var obj = {};
                if (ctrl.canAdd) {
                    ctrl.canAdd = !ctrl.canAdd;
                    if (currentNode.children) {
                        obj = {
                            "name": "Empty Branch",
                            "body": "Add something here!"
                        };
                        currentNode.children.push(obj);
                    } else {
                        obj = {
                            "name": "Empty Branch",
                            "body": "Add something here!"
                        };
                        currentNode.children = [];
                        currentNode.children.push(obj);
                    }
                    var specialNode = {"name": obj.name, "body": obj.body, "parentid": currentNode.id, "action": 0};
                    ctrl.update(currentNode, true, true, 0, specialNode);
                }
            };

            this.deleteBranchr = function (parent, branch, id) {
                if (branch.id == id) {
                    for (var i = 0; i < parent.children.length; i++) {
                        if (parent.children[i].id == id) {
                            parent.children.splice(i, 1);
                        }
                    }
                    return 1;
                } else if (branch.children) {
                    branch.children.forEach(function (d) {
                        ctrl.deleteBranchr(branch, d, id);
                    });
                    return 0;
                } else {
                    // Didn't find anything
                    return 0;
                }
            };

            this.editBranch = function () {
                editMode = !editMode;
                ctrl.update(currentNode, false, true, 3, null);
            };

            this.saveBranch = function () {
                currentNode.name = angular.element(".title-edit").val();
                currentNode.body = angular.element(".body-edit").val();
                var specialNode = {
                    "name": currentNode.name,
                    "body": currentNode.body,
                    "currentid": currentNode.id,
                    "action": 2
                };
                editMode = false;
                ctrl.update(currentNode, true, true, 2, specialNode);
            };

            //Finds y value of given object
            this.findPos = function (obj) {
                var curtop = 0;
                if (obj.offsetParent) {
                    do {
                        curtop += obj.offsetTop;
                    } while (obj = obj.offsetParent);
                    return [curtop];
                }
            };

            this.removeSide = function () {
                closed = true;
                d3.select(".story-container").html("")
                    .classed("col-xs-4", false)
                    .classed("animated", false)
                    .classed("fadeInRightBig", false);
                d3.select(".tree-container").classed("col-xs-7", false);
            };

            //Source - http://jsfiddle.net/bgrins/UA7ty/
            this.addTextArea = function () {

                var cloneCSSProperties = [
                    'lineHeight', 'textDecoration', 'letterSpacing',
                    'fontSize', 'fontFamily', 'fontStyle',
                    'fontWeight', 'textTransform', 'textAlign',
                    'direction', 'wordSpacing', 'fontSizeAdjust',
                    'whiteSpace', 'wordWrap'
                ];

                var textareaCSS = {
                    overflow: "hidden",
                    position: "absolute",
                    top: "0",
                    left: "0",
                    height: "100%",
                    resize: "none"
                };

                var preCSS = {
                    display: "block",
                    visibility: "hidden"
                };

                var containerCSS = {
                    position: "relative"
                };

                var initializedDocuments = {};

                function resize(textarea) {
                    $(textarea).parent().find("span").text(textarea.value);
                }

                function initialize(document) {
                    // Only need to initialize events once per document
                    if (!initializedDocuments[document]) {
                        initializedDocuments[document] = true;

                        $(document).delegate(
                            ".expandingText textarea",
                            "input onpropertychange",
                            function () {
                                resize(this);
                            }
                        );
                    }
                }

                $.fn.expandingTextarea = function () {

                    return this.filter("textarea").each(function () {

                        initialize(this.ownerDocument || document);

                        var textarea = $(this);

                        textarea.wrap("<div class='expandingText'></div>");
                        textarea.after("<pre class='textareaClone'><span></span><br /></pre>");

                        var container = textarea.parent().css(containerCSS);
                        var pre = container.find("pre").css(preCSS);

                        textarea.css(textareaCSS);

                        $.each(cloneCSSProperties, function (i, p) {
                            pre.css(p, textarea.css(p));
                        });

                        resize(this);
                    });
                };

                $.fn.expandingTextarea.initialSelector = "textarea.expanding";

                $(function () {
                    $($.fn.expandingTextarea.initialSelector).expandingTextarea();
                });

            };


            this.initTree = function (treeData) {
                // Source http://bl.ocks.org/d3noob/8375092

                // Setting up the graph canvas
                var w = d3.select(".tree-container").style("width");
                var widthlen = w.length;

                d3.select(".tree-container").style("height", screen.height + "px");

                var margin = {top: 20, right: 120, bottom: 20, left: -20},
                    width = parseInt(w.slice(0, widthlen - 2)) - margin.right - margin.left,
                    height = 3000 - margin.top - margin.bottom;

                tree = d3.layout.tree()
                    .size([width, height]);

                diagonal = d3.svg.diagonal()
                    .projection(function (d) {
                        return [d.x, d.y];
                    });

                svg = d3.select(".tree-container").append("svg")
                    .attr("width", width + margin.right + margin.left)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                root = treeData;
                root.x0 = height / 2;
                root.y0 = 0;
                currentNode = root;

                ctrl.click(root);
                ctrl.update(root, false, true, -1, null);

                // TODO: Not certain what this is, figure it out
                d3.select(self.frameElement).style("height", "500px");
            };

            // The following should be made in a form of promises,
            // after the join is done then we should init the tree... it's a bit messy, let's see
            ctrl.join();
            //setTimeout(ctrl.initTree, 3000);

            window.addEventListener("beforeunload", function (e) {
                var toSend = MiscService.createPacket(5, null, null);
                toSend.myid = peer.id;
                for (var i = 0; i < conn.length; i++) {
                    conn[i].send(MiscService.stringify(toSend));
                }
                peer.disconnect();
            });
        });
})();