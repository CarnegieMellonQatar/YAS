(function () {
    "use strict";

    angular.module('storyTeller')
        .controller('readController', function (storyService, $scope) {
            var id = location.pathname.substring(1, location.pathname.indexOf("story") - 1);
            console.log("Read controller initialized to the ID " + id);
            var ctrl = this;

            ctrl.readID = id;

            ctrl.storyTree = [];

            ctrl.currentChoices = [];
            ctrl.currentNodes = [];

            ctrl.currentNode = "";
            ctrl.currentIndex = 0;

            ctrl.loaded = false;


            $scope.animating = true;
            var hold = false;

            storyService.getStory(id, function (err, data) {
                if (err) {
                    console.log(err);
                }
                else {
                    ctrl.storyTree = data;
                    ctrl.updateCurrentChoices(ctrl.storyTree);
                    storyService.addSReads(data.id, function (err, data) {
                        if (err) {
                            console.log(err);
                        }
                    });
                    ctrl.loaded = true;
                }
            });

            ctrl.accumNodes = function (node) {
                if (node.children) {
                    if (node.children.length === 1) {
                        ctrl.currentNodes.push(node.body);
                        ctrl.accumNodes(node.children[0]);
                    } else if (node.children.length > 1) {
                        ctrl.updateCurrentChoicesr(node);
                    }
                } else {
                    //ctrl.currentNodes.push(node.body);
                    ctrl.updateCurrentChoicesr(node);
                }
            };

            ctrl.updateCurrentChoicesr = function (node) {
                if (node.children) {
                    if (node.children.length === 1) {
                        ctrl.currentChoices = [];
                        ctrl.accumNodes(node);
                    } else if (node.children.length > 1) {
                        ctrl.currentChoices = [];

                        node.children.forEach(function (d) {
                            ctrl.currentChoices.push(d);
                        });

                        ctrl.currentNodes.push(node.body);
                        console.log(ctrl.currentNodes);
                    } else {
                        ctrl.currentChoices = null;
                    }
                } else {
                    ctrl.currentChoices = [];
                    ctrl.currentNodes.push(node.body);
                }

                storyService.addBReads(node.id, function (err, data) {
                    if (err) {
                        console.log(err);
                    }
                });
            };

            ctrl.updateCurrentChoices = function (node) {
                ctrl.updateCurrentChoicesr(node);
                ctrl.currentNode = ctrl.currentNodes[ctrl.currentIndex];
                console.log(ctrl.currentNode);

                var check = ctrl.currentIndex + 1;
                if (ctrl.currentNodes[check]) {
                    ctrl.nextNode = true;
                } else {
                    ctrl.nextNode = false;
                }
                $(".story-node").last().after('<div class="story-node"></div>');

                ctrl.injectCurrentNode(ctrl.currentNode, 50);
            };

            ctrl.updateCurrentNode = function () {
                ctrl.currentIndex++;
                ctrl.currentNode = ctrl.currentNodes[ctrl.currentIndex];
            };

            ctrl.currentChoicesIsEmpty = function () {
                if (ctrl.currentChoices.length === 0) {
                    return true;
                } else {
                    return false;
                }
            };

            ctrl.injectCurrentNode = function (body, delay) {
                var delayInit = 200;
                var charList = [];

                for (var i = 0; i < body.length; i++) {
                    charList.push(body.charAt(i));
                }

                charList.forEach(function (c) {
                    setTimeout(function () {
                        if ($scope.animating == true) {
                            console.log("true");
                            $(".story-node").last().append(c);
                        }
                    }, delayInit);
                    delayInit += delay;
                });
            };

            //var body = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam in orci vel tellus ullamcorper mollis. Sed eget tincidunt ex, in elementum risus. In vel velit quam. Proin nec augue venenatis, condimentum libero quis, tristique lectus. Fusce varius, dui id eleifend dignissim, ligula massa ullamcorper augue, ut ultrices tortor arcu eget nibh. Maecenas massa nunc, pharetra sed dolor a, blandit tempus enim. Fusce maximus est et odio elementum pellentesque. Curabitur mollis quis eros vel consequat. Vestibulum nec feugiat orci. Donec sit amet volutpat lectus";
            //
            //ctrl.injectCurrentNode(body, 50);

            $scope.$on("spacePressed", function (event, args) {
                console.log($scope.animating);

                if ($scope.animating == true) {
                    // Skip the animation and load the choice buttons
                    $scope.animating = false;
                    $scope.$apply();

                    $(".story-node").last().html('').append(ctrl.currentNode);
                    ctrl.currentIndex++;
                } else if ($scope.animating == false && ctrl.nextNode == true) {
                    // Go to the next node if any exists
                    $scope.animating = true;
                    $scope.$apply();

                    ctrl.updateCurrentNode();

                    $(".story-node").last().after('<div class="story-node"></div>');

                    console.log(ctrl.currentNodes);
                    ctrl.injectCurrentNode(ctrl.currentNode, 50);
                }
            });

            // http://stackoverflow.com/questions/9098901/how-to-disable-repetitive-keydown-in-jquery
            // http://stackoverflow.com/questions/2249203/check-if-the-spacebar-is-being-pressed-and-the-mouse-is-moving-at-the-same-time
            $(function () {
                $(document).keyup(function (evt) {
                    if (evt.keyCode == 32) {
                        hold = false;
                    }
                }).keydown(function (evt) {
                    if (evt.keyCode == 32) {
                        if (hold == false) { // first press
                            $scope.$broadcast("spacePressed");
                            hold = true;
                        }
                    }
                });
            });

        });
})();