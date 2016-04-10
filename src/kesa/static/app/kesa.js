(function(){
     "use strict";

     angular.module('storyTeller',[])
         .config(function($interpolateProvider) {
             //http://django-angular.readthedocs.org/en/latest/integration.html
             $interpolateProvider.startSymbol('{$');
             $interpolateProvider.endSymbol('$}');
         });
 })();