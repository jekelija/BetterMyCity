var app = angular.module('app', [/*'ngRoute', */'ui.bootstrap', 'duScroll', 'ngDialog', 'ngCookies']).value('duScrollOffset', 30);
 
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