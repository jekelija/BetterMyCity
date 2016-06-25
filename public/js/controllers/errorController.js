app.controller('ErrorController', function($scope, $state, $stateParams){
    $scope.errorText = $stateParams.errorText;
});