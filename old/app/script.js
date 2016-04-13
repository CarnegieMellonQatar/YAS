/** Simple Bar graph example made using D3 **/

//var bardata = [];
//
//for (var i = 0; i < 30; i++) {
//    bardata.push(Math.random()*100);
//}
//
////bardata.sort(function(a,b) {
////    return a - b;
////});
//
//var margin = {top: 30, right: 30, bottom: 40, left: 50};
//
//var height = 600 - margin.top - margin.bottom,
//    width = 1200 - margin.left - margin.right,
//    barWidth = 50,
//    barOffset = 10,
//    radius = 200;
//
//var piecolors = d3.scale.category20c();
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
//    .domain([0, d3.max(bardata)])
//    .range([0, height]);
//
//var xScale = d3.scale.ordinal()
//    .domain(d3.range(0, bardata.length))
//    .rangeBands([0, width], 0.1, 1);
//
//var colors = d3.scale.linear()
//    .domain([0, d3.max(bardata)])
//    .range(['#FFB832', '#C61C6F']);
//
//
//var chart = d3.select('#barchart')
//    .append('svg')
//    .style('background', '#E7E0CB')
//    .attr('width', width + margin.right + margin.left)
//    .attr('height', height + margin.top + margin.bottom)
//    .append('g')
//    .attr('transform', 'translate(' + margin.left + ', ' + margin.top+ ')')
//    .selectAll('rect').data(bardata)
//    .enter().append('rect')
//        .style('fill', colors)
//        .attr('width', xScale.rangeBand())
//        .attr('height', 0)
//        .attr('x', function(d,i) {
//            return xScale(i);
//        })
//        .attr('y', height)
//    .on('mouseover', function(d) {
//
//        tooltip.transition()
//            .style('opacity', 0.9);
//
//        tooltip.html(d)
//            .style({
//                'left': (d3.event.pageX - 35) + 'px',
//                'top': (d3.event.pageY -30) + 'px'
//            });
//
//        d3.select(this)
//            .transition().duration(100)
//            .style('opacity', 0.5);
//    })
//    .on('mouseout', function(d) {
//        d3.select(this)
//            .transition().duration(100)
//            .style('opacity', 1);
//
//    });
//chart.transition()
//    .attr('height', function(d) {
//        return yScale(d);
//    })
//    .attr('y', function(d) {
//        return height - yScale(d);
//    })
//    .delay(function(d,i) {
//        return i*10;
//    })
//    .duration(1000)
//    .ease('elastic');
//
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
//    .tickValues(xScale.domain().filter(function(d,i) {
//        return !(i % (bardata.length/5));
//    }));
//
//var guide = d3.select('svg').append('g');
//
//axis(guide);
//
//guide
//    .attr('transform', 'translate('+margin.left+', ' + margin.top + ')')
//    .selectAll('path')
//        .style({'fill':'none', 'stroke': '#000'});
//    guide.selectAll('line')
//        .style({'stroke': '#000'});
//
//var hGuide = d3.select('svg').append('g');
//
//hAxis(hGuide);
//
//hGuide
//    .attr('transform', 'translate(' + margin.left + ', ' + (height + margin.top) + ')')
//    .selectAll('path')
//        .style({'fill':'none', 'stroke': '#000'});
//    hGuide.selectAll('line')
//        .style({'stroke': '#000'});
//
//var piedata =
//    [
//        {
//            label: 'Barot',
//            value: 60
//        },
//        {
//            label: 'Gerard',
//            value: 30
//        },
//        {
//            label: 'Jenni',
//            value: 10
//        }
//    ];
//
//
//var pheight = 600 - margin.top - margin.bottom,
//    pwidth = 600 - margin.left - margin.right;
//
//var pielayout = d3.layout.pie()
//    .value(function(d) {
//        return d.value;
//    });
//
//var arc = d3.svg.arc()
//    .outerRadius(radius);
//
//var piechart = d3.select('#piechart')
//    .append('svg')
//    .style('background', '#E7E0CB')
//    .attr('width', pwidth + margin.right + margin.left)
//    .attr('height', pheight + margin.top + margin.bottom)
//    .append('g')
//    .attr('transform', 'translate( ' + (pwidth - radius) + ',' + (pheight - radius) + ')')
//    .selectAll('path').data(pielayout(piedata))
//    .enter().append('path')
//    .attr('fill', function(d, i) {
//        return piecolors(i);
//    })
//    .attr('d', arc);
//

var treeData = [
    {
        "name": "Sadly So",
        "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus egestas mauris neque, sit amet vestibulum enim pulvinar sit amet. Donec mattis a est at commodo. Suspendisse potenti. Maecenas vitae lectus sed enim euismod fringilla rutrum ut dui. Nam tortor quam, condimentum vitae aliquam sed, volutpat id turpis. Proin purus metus, tincidunt nec tellus id, tincidunt luctus lectus. Suspendisse vitae semper felis. Etiam ac molestie nisi. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Duis a scelerisque purus. Ut eu laoreet massa. In hac habitasse platea dictumst. Proin hendrerit erat vitae vehicula finibus. Curabitur viverra fringilla neque, ac imperdiet lectus. Pellentesque nisi neque, posuere feugiat nulla sed, gravida pharetra lectus.",
        "children": [
            {
                "name": "What happened next...",
                "body": "Quisque sodales sed arcu a posuere. Mauris malesuada, turpis et fringilla efficitur, quam purus ullamcorper sem, nec blandit magna erat quis eros. Aenean eleifend neque tempus metus lacinia venenatis. Vestibulum non quam ac augue volutpat imperdiet. Nam tristique, nibh sed tincidunt bibendum, dui nisi iaculis sem, in venenatis risus nisi nec dui. Nam elementum, mi sed imperdiet gravida, risus ligula finibus lorem, eu venenatis ligula arcu fringilla mi. Nam id mattis erat. Maecenas rhoncus egestas enim, vel rutrum sapien bibendum eu. Interdum et malesuada fames ac ante ipsum primis in faucibus. Suspendisse sed cursus arcu.",
                "children": [
                    {
                        "name": "Then suddenly...",
                        "body": "Vivamus ac velit tellus. Cras lacinia dictum laoreet. Etiam auctor turpis ut eleifend iaculis. Nunc rutrum augue leo, ornare hendrerit felis lacinia id. In pulvinar imperdiet convallis. Praesent augue tellus, ultricies id fermentum malesuada, sodales non tortor. Sed ac pulvinar erat. Morbi vel consectetur arcu, vel posuere magna. Sed sit amet dictum lacus. Donec porttitor a leo non commodo. Proin nec est lacinia, fringilla felis quis, luctus leo."
                    },
                    {
                        "name": "Once, twice and now thrice",
                        "body": "Integer malesuada augue in elit lobortis porta. Curabitur suscipit nisl in egestas dignissim. Suspendisse ut mauris ut nisi lacinia volutpat. Sed aliquet tempus dui, vel dapibus ante blandit eget. Aliquam erat volutpat. Aenean convallis mauris non neque mattis consectetur. Nunc commodo eleifend pretium. Vivamus ipsum ligula, imperdiet vitae placerat quis, vehicula vitae nulla. Cras dapibus iaculis mauris, nec fringilla nisi congue at. Nullam fermentum scelerisque odio non volutpat. Proin malesuada erat a lorem sollicitudin mollis. Donec nec sodales est, ut pharetra ipsum. Proin semper blandit fermentum."
                    }
                ]
            },
            {
                "name": "Et tu, Brute?",
                "body": "Curabitur viverra libero dolor, id rhoncus felis sagittis nec. Donec est dui, placerat non quam quis, dictum imperdiet libero. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ac ultrices purus, non semper mi. Phasellus blandit eleifend mauris, ut cursus diam. Fusce consequat lectus sed efficitur efficitur. Ut eros augue, tempus ut rhoncus non, suscipit quis lorem. Aenean purus quam, ullamcorper nec ullamcorper vel, placerat et purus. Aliquam congue nec nibh et commodo. Phasellus eget dapibus urna. Morbi eu euismod dolor."
            }
        ]
    }
];

var root, currentNode;

function stringify(obj, replacer, spaces, cycleReplacer) {
    return JSON.stringify(obj, serializer(replacer, cycleReplacer), spaces)
}

function serializer(replacer, cycleReplacer) {
    var stack = [], keys = [];

    if (cycleReplacer == null) cycleReplacer = function (key, value) {
        if (stack[0] === value) return "[Circular ~]";
        return "[Circular ~." + keys.slice(0, stack.indexOf(value)).join(".") + "]"
    };

    return function (key, value) {
        if (stack.length > 0) {
            var thisPos = stack.indexOf(this);
            ~thisPos ? stack.splice(thisPos + 1) : stack.push(this);
            ~thisPos ? keys.splice(thisPos, Infinity, key) : keys.push(key);
            if (~stack.indexOf(value)) value = cycleReplacer.call(this, key, value)
        }
        else stack.push(value);

        return replacer == null ? value : replacer.call(this, key, value)
    }
}

var peer = null;
var conn = [];
var index = -1;
var leader = false;
var closed = false;
var editMode = false;

function createSession() {
    peer = new Peer('111111', {key: 'b6lunl4jlb4kj4i'});

    leader = true;
    peer.on('open', function (id) {
        console.log("My id is: " + id);
        $("#main_page").css("display", "none");
        $("#next_page").css("display", "block");
        update(root);
    });

    peer.on('connection', function (connec) {
        conn.push(connec);
        index = index + 1;
        console.log(conn);

        conn[index].on('data', function (data) {
            root = JSON.parse(data);
            currentNode = root;
            conn.forEach(function (element) {
                if (element.peer != conn[index].peer) {
                    element.send(stringify(root))
                }
            });
        });

        setTimeout(function () {
            conn[index].send(stringify(root));
        }, 2000);
    })
}

function join() {
    peer = new Peer({key: 'b6lunl4jlb4kj4i'});

    peer.on('open', function (id) {
        console.log("My id is: " + id);
        $("#main_page").css("display", "none");
        $("#next_page").css("display", "block");
        connect('111111');
    });

    peer.on('connection', function (connec) {
        conn.push(connec);
        index = index + 1;

        conn[index].on('data', function (data) {
            console.log(data);
            root = JSON.parse(data);
            currentNode = root;
            update(root);
        });

    });

}

function connect(id) {
    conn.push(peer.connect(id));
    index = index + 1;

    conn[index].on('open', function () {

        conn[index].on('data', function (data) {
            console.log(data);
            root = JSON.parse(data);
            console.log(root);
            update(root);
        });
    });
}


// Source http://bl.ocks.org/d3noob/8375092

if (treeData === undefined || treeData === null ||
    (Object.keys(treeData).length === 0
    && (JSON.stringify(treeData) === JSON.stringify({})
    || JSON.stringify(treeData) === JSON.stringify([])))) {

    treeData =
        [
            {
                "name": "Start writing your story!",
                "body": "C'mon bruv you can do it."
            }
        ];

    console.log("JSON object is undefined or null or is empty");
}


// Setting up the graph canvas
var w = d3.select(".tree-container").style("width");
var widthlen = w.length;

d3.select(".tree-container").style("height", screen.height + "px");

var margin = {top: 20, right: 120, bottom: 20, left: -20},
    width = parseInt(w.slice(0, widthlen - 2)) - margin.right - margin.left,
    height = 3000 - margin.top - margin.bottom;


var i = 0,
    duration = 750;

var tree = d3.layout.tree()
    .size([width, height]);

var diagonal = d3.svg.diagonal()
    .projection(function (d) {
        return [d.x, d.y];
    });

var svg = d3.select(".tree-container").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

root = treeData[0];
root.x0 = height / 2;
root.y0 = 0;
currentNode = root;

click(root);
update(root);

// TODO: Not certain what this is, figure it out
d3.select(self.frameElement).style("height", "500px");

function update(source) {

    //console.log(root);

    var cont = d3.select(".story-container");

    //console.log(closed);
    if (closed) {
        cont.classed("col-xs-4", true)
            .classed("animated", true)
            .classed("fadeInRightBig", true);
    }

    d3.select(".tree-container").classed("col-xs-7", true);

    // Compute the new tree layout.
    var nodes = tree.nodes(root),
        links = tree.links(nodes);

    //console.log(nodes);
    //console.log(links);

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
        .on("click", click);

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

    cont.html("");

    cont.append("div")
        .classed("close-story-button", true)
        .text("x")
        .on("click", removeSide);

    if (editMode == true) {
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
            .on("click", saveBranch);

        cont.append("div")
            .classed("edit-branch-button", true)
            .classed("col-xs-5", true)
            .text("cancel")
            .on("click", editBranch);

        addTextArea();

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
            .on("click", addBranch);

        cont.append("div")
            .classed("delete-branch-button", true)
            .classed("col-xs-5", true)
            .text("delete branch")
            .on("click", deleteBranch);

        cont.append("div")
            .classed("edit-branch-button", true)
            .classed("col-xs-5", true)
            .text("edit branch")
            .on("click", editBranch);
    }


    currentNode = source;
    //console.log(source);
    closed = false;

    conn.forEach(function (element) {
        element.send(stringify(root))
    });
}

// Toggle children on click.
function click(d) {
    currentNode._children = null;
    if (d.children) {
        d._children = [{"somev": "hello"}];
        //d.children = [{"somev":"hello"}];
    } else {
        //d.children = d._children;
        d._children = [{"somev": "hello"}];
    }
    window.scroll(0, findPos(d));
    update(d);
}

function addBranch() {
    // If not leaf
    var obj = {};
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
        //console.log(obj);
        currentNode.children = [];
        currentNode.children.push(obj);
    }
    update(currentNode);
    console.log(currentNode.children);
}

function deleteBranchr(parent, branch, id) {
    if (branch.id == id) {
        for (var i = 0; i < parent.children.length; i++) {
            if (parent.children[i].id == id) {
                parent.children.splice(i, 1);
            }
        }
        return 1;
    } else if (branch.children) {
        branch.children.forEach(function (d) {
            deleteBranchr(branch, d, id);
        });
        return 0;
    } else {
        // Didn't find anything
        return 0;
    }
}

function deleteBranch() {
    if (currentNode === root) {
        customAlert("<strong>Node is the root,</strong> cannot delete the root");
        console.log("Node is the root, cannot delete the root");
    } else {
        deleteBranchr(null, root, currentNode.id);
        click(currentNode.parent);
        update(currentNode.parent);
    }
}

function editBranch() {
    editMode = !editMode;
    update(currentNode);
}

function saveBranch() {
    currentNode.name = $(".title-edit").val();
    currentNode.body = $(".body-edit").val();
    editMode = false;
    update(currentNode);
}

//Finds y value of given object
function findPos(obj) {
    var curtop = 0;
    if (obj.offsetParent) {
        do {
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return [curtop];
    }
}

function removeSide() {
    closed = true;
    d3.select(".story-container").html("")
        .classed("col-xs-4", false)
        .classed("animated", false)
        .classed("fadeInRightBig", false);
    d3.select(".tree-container").classed("col-xs-7", false);
}

//Source - http://jsfiddle.net/bgrins/UA7ty/
function addTextArea() {

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

}


