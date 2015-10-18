var app = angular.module('app', [/*'ngRoute', */'ui.bootstrap', 'duScroll', 'ngDialog', 'ngCookies']).value('duScrollOffset', 30);
 

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

//custom http provider for adding our web token if we have one
//from http://www.toptal.com/web/cookie-free-authentication-with-json-web-tokens-an-example-in-laravel-and-angularjs
app.config(['$httpProvider', function($httpProvider) {  
    $httpProvider.interceptors.push(['$q', '$location', '$window', function ($q, $location, $window) {
        return {
            'request': function (config) {
                config.headers = config.headers || {};
                if ($window.localStorage['token']) {
                    config.headers.Authorization = 'Bearer ' + $window.localStorage['token'];
                }
                return config;
            },
            'responseError': function (response) {
                if (response.status === 401 || response.status === 403) {
                    $location.path('/error');
                }
                return $q.reject(response);
            }
        };
    }]);
}]);