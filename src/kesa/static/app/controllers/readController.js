(function () {
    "use strict";

    angular.module('storyTeller')
        .controller('readController', function (storyService, $location) {
            var id = location.pathname.substring(1, location.pathname.indexOf("story")-1);
            console.log("Read controller initialized to the ID " + id);
            var ctrl = this;

            ctrl.readID = id;

            ctrl.storyTree = [];

            ctrl.currentChoices = [];
            ctrl.currentNodes = [];


            storyService.getStory(id, function(err,data) {
                if (err) {
                    console.log(err);
                }
                else {
                    ctrl.storyTree = data;
                    ctrl.updateCurrentChoices(ctrl.storyTree);
                    storyService.addSReads(data.id, function(err,data){
                       if (err) {
                           console.log(err);
                       }
                    });
                }
            });

            ctrl.accumNodes = function (node) {
                if (node.children) {
                    if (node.children.length === 1) {
                        ctrl.currentNodes.push(node.body);
                        ctrl.accumNodes(node.children[0]);
                    } else if (node.children.length > 1) {
                        ctrl.updateCurrentChoices(node);
                    }
                } else {
                    //ctrl.currentNodes.push(node.body);
                    ctrl.updateCurrentChoices(node);
                }
            };

            ctrl.updateCurrentChoices = function (node) {
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

                storyService.addBReads(node.id, function(err,data){
                    if (err) {
                        console.log(err);
                    }
                });
            };



        });
})();