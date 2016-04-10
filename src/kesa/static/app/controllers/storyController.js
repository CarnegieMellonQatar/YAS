(function(){
    "use strict";

    angular.module('storyTeller')
        .controller('storyController',function(storyService){

            var story = this;
            story.uncompleteStories = [];
            story.completeStories = [];
            story.enabled = true

            storyService.getfirst(function(err, data) {
                if (err){
                    console.log(err);
                }
                else {
                    var i = 0;
                    for(i = 0; i < data.length; i++){
                        if(data[i].fields.is_complete){
                            story.completeStories.push(data[i]);
                        }
                        else {
                            story.uncompleteStories.push(data[i]);
                        }
                    }
                }
            });

            story.changeTabs = function(){
                story.enabled ^= true;
            }
            

        })
})();