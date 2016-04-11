(function () {
    "use strict";

    angular.module('kesaApp')
        .controller('readController', function ($route, $routeParams) {
            console.log("Read controller initialized to the ID " + $routeParams.storyID);
            var ctrl = this;

            ctrl.readID = $routeParams.storyID;

            ctrl.storyTree =
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
                        "body": "Curabitur viverra libero dolor, id rhoncus felis sagittis nec. Donec est dui, placerat non quam quis, dictum imperdiet libero. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ac ultrices purus, non semper mi. Phasellus blandit eleifend mauris, ut cursus diam. Fusce consequat lectus sed efficitur efficitur. Ut eros augue, tempus ut rhoncus non, suscipit quis lorem. Aenean purus quam, ullamcorper nec ullamcorper vel, placerat et purus. Aliquam congue nec nibh et commodo. Phasellus eget dapibus urna. Morbi eu euismod dolor.",
                        "children": [
                            {
                                "name": "Then suddenly...",
                                "body": "Vivamus ac velit tellus. Cras lacinia dictum laoreet. Etiam auctor turpis ut eleifend iaculis. Nunc rutrum augue leo, ornare hendrerit felis lacinia id. In pulvinar imperdiet convallis. Praesent augue tellus, ultricies id fermentum malesuada, sodales non tortor. Sed ac pulvinar erat. Morbi vel consectetur arcu, vel posuere magna. Sed sit amet dictum lacus. Donec porttitor a leo non commodo. Proin nec est lacinia, fringilla felis quis, luctus leo."
                            }
                        ]
                    }
                ]
            };

            ctrl.currentChoices = [];
            ctrl.currentNodes = [];

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
            };

            ctrl.updateCurrentChoices(ctrl.storyTree);

        });
})();