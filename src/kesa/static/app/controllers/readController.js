(function () {
    "use strict";

    angular.module('storyTeller')
        .controller('readController', function (storyService, $scope) {
            var id = location.pathname.substring(1, location.pathname.indexOf("story") - 1);

            var ctrl = this;

            ctrl.readID = id;

            ctrl.storyTree = [];

            ctrl.currentChoices = [];
            ctrl.currentNodes = [];

            ctrl.currentNode = "";
            ctrl.animatedIndex = 0;
            ctrl.currentAnimation = 0;

            ctrl.loaded = false;
            $scope.nochoices = true;
            $scope.animating = true;
            $scope.finalNode = false;

            var hold = false;

            storyService.getStory(id, function (err, data) {
                if (err) {
                    console.log("error in getting data");
                }
                else {
                    ctrl.storyTree = data;
                    ctrl.updateCurrentChoices(ctrl.storyTree);
                    storyService.addSReads(ctrl.readID, function (err, data) {
                        if (err) {
                            console.log("error in getting data");
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
                    } else {
                        ctrl.currentChoices = null;
                    }
                } else {
                    ctrl.currentChoices = [];
                    ctrl.currentNodes.push(node.body);
                    $scope.finalNode = true;
                }

                storyService.addBReads(node.branchid, function (err, data) {
                    if (err) {
                        console.log("error in getting data");
                    }
                });
            };

            ctrl.updateLastNode = function () {
                if (ctrl.currentNodes[ctrl.animatedIndex + 1]) {
                    $scope.lastNode = false;
                } else {
                    $scope.lastNode = true;
                }
            };

            ctrl.updateCurrentChoices = function (node) {

                ctrl.currentNodes = [];
                ctrl.updateCurrentChoicesr(node);
                $scope.animating = true;
                ctrl.currentNode = ctrl.currentNodes[0];

                ctrl.animatedIndex = 0;

                ctrl.updateLastNode();
                ctrl.currentChoicesIsEmpty();

                ctrl.currentAnimation = Math.floor((Math.random() * 1000000000000) + 1);

                ctrl.injectCurrentNode(ctrl.currentNode, 50, ctrl.currentAnimation);
                ctrl.loaded = true;

            };

            ctrl.currentChoicesIsEmpty = function () {
                if (ctrl.currentChoices.length === 0) {
                    $scope.nochoices = true;
                } else {
                    $scope.nochoices = false;
                }
            };

            ctrl.injectCurrentNode = function (body, delay, currentAni) {
                var delayInit = 200;
                var charList = [];

                for (var i = 0; i < body.length; i++) {
                    charList.push(body.charAt(i));
                }
                charList.forEach(function (c, i) {
                    setTimeout(function () {
                        if ($scope.animating === true && currentAni === ctrl.currentAnimation) {
                            $('.story-center-container').children().last().append(c);
                            if (i == (body.length - 1)) {
                                $scope.animating = false;
                                $scope.$apply();
                                $('.story-center-container').children().last().append("<hr class='small'>");
                            }
                        }
                    }, delayInit);
                    delayInit += delay;
                });
            };

            $scope.$on("spacePressed", function (event, args) {
                var storyDiv = $('.story-center-container');
                if ($scope.animating === true) {
                    // Skip the animation and load the choice buttons
                    $scope.animating = false;
                    $scope.$apply();
                    storyDiv.children().last().html('').append(ctrl.currentNode);
                    storyDiv.children().last().append("<hr class='small'>");
                    storyDiv.append("<div class='story-node'></div>");
                } else if ($scope.animating === false) {
                    if (!$scope.lastNode) {
                        ctrl.animatedIndex++;
                        ctrl.currentNode = ctrl.currentNodes[ctrl.animatedIndex];
                        ctrl.updateLastNode();
                        storyDiv.append("<div class='story-node'></div>");
                        ctrl.currentAnimation = Math.floor((Math.random() * 1000000000000) + 1);
                        ctrl.injectCurrentNode(ctrl.currentNode, 50, ctrl.currentAnimation);
                        $scope.animating = true;
                        $scope.$apply();
                    }
                }
                if (!ctrl.currentNode.children) {
                    $scope.finalNode = true;
                    $scope.$apply();
                }
            });


            // http://stackoverflow.com/questions/9098901/how-to-disable-repetitive-keydown-in-jquery
            // http://stackoverflow.com/questions/2249203/check-if-the-spacebar-is-being-pressed-and-the-mouse-is-moving-at-the-same-time
            $(function () {
                $(document).mouseup(function (evt) {
                    hold = false;
                }).mousedown(function (evt) {
                    if (hold === false) { // first press
                        $scope.$broadcast("spacePressed");
                        hold = true;
                    }
                }).keyup(function (evt) {
                    if (evt.keyCode === 32) {
                        hold = false;
                    }
                }).keydown(function (evt) {
                    if (evt.keyCode === 32) {
                        if (hold === false) { // first press
                            $scope.$broadcast("spacePressed");
                            hold = true;
                        }
                    }
                });
            });

        });
})();