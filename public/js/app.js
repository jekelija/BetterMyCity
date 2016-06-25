var app = angular.module('app', ['ui.router', 'ui.bootstrap', 'duScroll', 'ngDialog']).value('duScrollOffset', 30);

//add state provider for SPA
app.config(function($stateProvider, $urlRouterProvider) {
    // For any unmatched url, redirect to /main
    $urlRouterProvider.otherwise("/");
    
    //now set up the various states
    $stateProvider
        .state('index',
            {
                url:'/',
                onEnter: function($state, $window){
                    //if there is a user already logged in, go to portal
                    if($window.localStorage['username'] && $window.localStorage['token']){
                        $state.go('portal');
                    }
                    else {
                        $state.go('main');
                    }
                },
            }   
        )
        .state('main', 
            {
                url:'/main',
                templateUrl:'partials/main.html'
            }
        )
        .state('error', 
            {
                url:'/error',
                templateUrl:'partials/error.html',
                //use Not a valid URL as default error text in case someone tries to navigate here directly
                params:{errorText:"Not a valid URL"}, 
                controller:'ErrorController'
            }
        )
        .state('whoWeAre', 
            {
                url:'/who-we-are',
                templateUrl:'partials/who-we-are.html'
            }
        )
        .state('findMyCity', 
            {
                url:'/find-my-city',
                templateUrl:'partials/find-my-city.html',
                controller:'FindMyCityController'
            }
        )
        .state('contact', 
            {
                url:'/contact',
                templateUrl:'partials/contact.html'
            }
        )
        .state('portal', 
            {
                url:'/portal',
                templateUrl:'partials/portal.html',
                controller:'UserController'
            }
        )
        .state('city', 
            {
                //need both city ID in url and city in params
                //this allows us to do the following:
                // 1) if we navigate directly from find-my-cities, we can just directly pass the city in, saving us a DB lookup
                // 2) we always populate the unique city ID into the URL, so that if the user re-loads, since the city isnt cached, we just do a DB lookup
                url:'/city/:cityId',
                params:{city:null}, 
                templateUrl:'partials/city.html',
                controller:'CityController'
            }
        )
    ;
        
});
 

//custom directive for equality in passwords
app.directive('equal', [
    function() {
        var link = function($scope, $element, $attrs, ctrl) {
            ctrl.$validators.equal = function(modelValue, viewValue) {
                //dont bother doing comparison if password hasnt been entered or if length is less than 6; 
                //if we end up using the generically then may need to take out the < 6 part...
                if(!$attrs.equal || $attrs.equal.length < 6) {
                    return true;
                }
                var value = modelValue || viewValue;
                var valid = !value || !$attrs.equal || value === $attrs.equal;
                return valid;
            };

            $attrs.$observe('equal', function(comparisonModel){
                ctrl.$validate();
            });
        };

        return {
            require: 'ngModel',
            link: link
        };

    }
]);

app.factory('authInterceptor', function ($q, $location, $window) {
        return {
            request: function (config) {
                config.headers = config.headers || {};
                if ($window.localStorage['token']) {
                    config.headers['x-access-token'] = $window.localStorage['token'];
                }
                return config;
            },
            responseError: function (response) {
                if (response.status === 401 || response.status === 403) {
                    $location.path('/error');
                }
                return $q.reject(response);
            }
        };
    });

//custom http provider for adding our web token if we have one
//from http://www.toptal.com/web/cookie-free-authentication-with-json-web-tokens-an-example-in-laravel-and-angularjs
app.config(function($httpProvider) {  
    $httpProvider.interceptors.push('authInterceptor');
});