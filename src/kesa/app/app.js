(function () {

    angular.module('kesaApp', ['ngRoute'])
        .config(function ($routeProvider) {
            // configure routes
            $routeProvider
                .when('/', {
                    templateUrl: './static/includes/main.html',
                    controller: 'mainController',
                    controllerAs: 'mc',
                    title: ''
                })
                .when('/create/:createID', {
                    templateUrl: './static/includes/create.html',
                    controller: 'createController',
                    controllerAs: 'cc',
                    title: 'Create'
                })
                .when('/join/:joinID', {
                    templateUrl: './static/includes/join.html',
                    controller: 'joinController',
                    controllerAs: 'jc',
                    title: 'Join'
                })
                .when('/story/:storyID', {
                    templateUrl: './static/includes/read.html',
                    controller: 'readController',
                    controllerAs: 'rc',
                    title: 'Read'
                })
                .otherwise({redirectTo: '/'});
        })
        .run(function (MiscService) {
            // detect url change
            console.log("Kesa is running");
            //StoryService.init();
        });
})();