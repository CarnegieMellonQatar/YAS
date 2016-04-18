(function () {
    angular.module('storyTeller').service('MiscService', function () {

        var srvc = this;

        this.customAlert = function (string) {
            $("body").append('<div class="custom-alert animated fadeInLeftBig">' + string + '</div>');
            setTimeout(function () {
                $(".custom-alert").remove();
            }, 3000);
        };

        this.customAlertJumbo = function (string) {
            $("body").append('<div class="custom-alert-jumbo animated fadeInLeftBig">' + string + '</div>');
            setTimeout(function () {
                //$(".custom-alert-jumbo").remove();
            }, 3000);
        };

        this.stringify = function (obj, replacer, spaces, cycleReplacer) {
            return JSON.stringify(obj, srvc.serializer(replacer, cycleReplacer), spaces);
        };

        this.serializer = function (replacer, cycleReplacer) {
            var stack = [], keys = [];

            if (cycleReplacer == null) cycleReplacer = function (key, value) {
                if (stack[0] === value) return "[Circular ~]";
                return "[Circular ~." + keys.slice(0, stack.indexOf(value)).join(".") + "]";
            };

            return function (key, value) {
                if (stack.length > 0) {
                    var thisPos = stack.indexOf(this);
                    ~thisPos ? stack.splice(thisPos + 1) : stack.push(this);
                    ~thisPos ? keys.splice(thisPos, Infinity, key) : keys.push(key);
                    if (~stack.indexOf(value)) value = cycleReplacer.call(this, key, value);
                }
                else stack.push(value);

                return replacer == null ? value : replacer.call(this, key, value);
            };
        };

        this.toJSONr = function (branch) {
            var obj = {};
            obj.name = branch.name;
            obj.body = branch.body;
            obj.branchid = branch.branchid;
            if (branch.children) {
                obj.children = [];
                branch.children.forEach(function (d) {
                    obj.children.push(srvc.toJSONr(d));
                });
            }
            return obj;
        };

        this.toJSON = function (root) {
            var retObj;
            retObj = srvc.toJSONr(root);
            return retObj;
        };

        this.addRemoteBranchr = function (branch, newBranch, id) {
            if (branch.branchid === id) {
                if (branch.children) {
                    branch.children.push(newBranch);
                } else {
                    branch.children = [];
                    branch.children.push(newBranch);
                }
                return 1;
            } else if (branch.children) {
                branch.children.forEach(function (d) {
                    srvc.addRemoteBranchr(d, newBranch, id);
                });
                return 0;
            } else {
                // Didn't find anything
                return 0;
            }
        };

        this.findContactNoder = function (branch, id) {
            if (branch.branchid === id) {
                return {"some": true, "obj": branch};
            } else if (branch.children) {
                var countFail = 0;
                var objFound = {};
                branch.children.forEach(function (d) {
                    var ret = srvc.findContactNoder(d, id);
                    if (ret.some === true) {
                        objFound = ret.obj;
                    } else {
                        countFail++;
                    }
                });

                if (countFail == branch.children.length) {
                    return {"some": false, "obj": null};
                } else {
                    return {"some": true, "obj": objFound};
                }
            } else {
                return {"some": false, "obj": null};
            }
        };

        this.createPacket = function (action, specialNode, id) {
            var toSend = {};

            toSend.action = action;

            switch (action) {
                case 0:
                    // Add a branch
                    toSend.name = specialNode.name;
                    toSend.body = specialNode.body;
                    toSend.parentid = id;
                    break;
                case 1:
                    toSend.currentid = id;
                    break;
                case 2:
                    // Edit a branch
                    toSend.name = specialNode.name;
                    toSend.body = specialNode.body;
                    toSend.currentid = id;
                    break;
                case 4:
                    toSend.branchid = id;
                    break;
                default:
                    //console.log("Cannot handle this case!!");
            }
            return toSend;
        };

    });
})();