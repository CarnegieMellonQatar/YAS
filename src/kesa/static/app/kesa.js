(function () {
    "use strict";

     angular.module('dropzone', []).directive('dropzone', function () {
      return function (scope, element, attrs) {
        var config, dropzone;

        config = scope[attrs.dropzone];

        // create a Dropzone for the element with the given options
        dropzone = new Dropzone(element[0], config.options);

        // bind the given event handlers
        angular.forEach(config.eventHandlers, function (handler, event) {
          dropzone.on(event, handler);
        });

        dropzone.on('thumbnail', function(file, dataUrl){
            element[0].children[1].children[2].remove();
        });

        /*
        code taken from:
            http://stackoverflow.com/questions/28219338/dropzone-js-rejected-files-in-file-previews
        */

        dropzone.on('error', function(file){
            if (!file.accepted){
                alert("Invalid File");
                dropzone.removeFile(file);
            }
        });
      };
    });

     angular.module('storyTeller', ['dropzone'])
         .config(function($interpolateProvider) {
             //http://django-angular.readthedocs.org/en/latest/integration.html
             $interpolateProvider.startSymbol('{$');
             $interpolateProvider.endSymbol('$}');
         })
         .config(function($httpProvider) {
            $httpProvider.defaults.xsrfCookieName = 'csrftoken';
            $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
         })
         .run(function () {
            $(".story-reader-container").keydown(function (e) {
                if (e.which == 32) {
                    return false;
                }
            });
        });
 })();
