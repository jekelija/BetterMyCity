app.controller('CityController', function($scope, $state, $stateParams, $http, AuthenticationService, ngDialog){
        
    if($stateParams.city == null) {
        $http.get('/cities/' + $stateParams.cityId).then(
            function successCallback(response) {
                if(response.data.success) {
                    $scope.city = response.data.city;
                    //the list of items currently being displayed defaults to requets
                    $scope.currentItems = $scope.city.requests;
                }
                else {
                    $state.go('error', {errorText : "Error Received From Server: " + response.data.message});
                }
            },
            function errorCallback(response) {
                $state.go('error', {errorText : "Error Code " + response.status + ": " + response.statusText});
            }
        );
    }
    else {
        $scope.city = $stateParams.city;
        //the list of items currently being displayed defaults to requets
        $scope.currentItems = $scope.city.requests;
    }
    
    $scope.mode = 'Requests';
    $scope.loggedIn = AuthenticationService.isLoggedIn();
    $scope.openCreateDialog = function() {
        ngDialog.open({
            template: 'dialogs/createDialog.html',
            controller: 'CreateController',
            className: 'ngdialog-theme-default'
        });
    };
    
    //watch the mode (toggled by radio buttons)
    $scope.$watch('mode', function(value) {
        //check for null b/c even though we change state if city would be null, it seems like we still finish out the script and this still gets called
        if($scope.city != null) {
            if(value == 'Offers') {
                $scope.currentItems = $scope.city.offers;
            }
            else {
                $scope.currentItems = $scope.city.requests;
            } 
        }
    });
    
    
});