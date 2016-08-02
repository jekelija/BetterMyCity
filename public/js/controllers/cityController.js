app.controller('CityController', function($scope, $state, $stateParams, $http, AuthenticationService, FavoritesService, ngDialog){
    
    //based on current mode, refresh current items from city
    function refreshItems() {
        if($scope.mode == 'Offers') {
            $scope.currentItems = $scope.city.offers;
        }
        else {
            $scope.currentItems = $scope.city.requests;
        }
    }
    
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
    $scope.username = AuthenticationService.isLoggedIn();
    $scope.openCreateDialog = function() {
        var dialog = ngDialog.open({
            template: 'dialogs/createDialog.html',
            controller: 'CreateController',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
        //when the dialog closes, then refresh the list
        dialog.closePromise.then(function(res) {
            refreshItems();
        });
    };
    
    //watch the mode (toggled by radio buttons)
    $scope.$watch('mode', function(value) {
        //check for null b/c even though we change state if city would be null, it seems like we still finish out the script and this still gets called
        if($scope.city != null) {
            refreshItems();
        }
    });
    
    //function to add/remove item as a favorite
    $scope.favorite = function(itemId) {
        if(!$scope.username) {
            ngDialog.open({
                template: '<h4>Please Log In To Save Items</h4>',
                plain: true
            });
        }
        else {
            FavoritesService.get($scope.username, function(response) {
                if(response.success) {
                    console.log(response.data);
                } 
                else {
                    $state.go('error', {errorText : "Error adding favorite " + response.message});
                }
            });
        }
    }
    
});