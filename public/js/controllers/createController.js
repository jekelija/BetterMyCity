//Create posting/request Controller-----------------------------------------------------------------------------
app.controller('CreateController', function($scope, $state, $stateParams, $timeout, 
                                             ngDialog, FlashService, AuthenticationService, ItemService) {
    $scope.dataLoading = false; 
    //default to a request type
    $scope.type = 'Requests';
    
    $scope.create = function() {
        var username = AuthenticationService.isLoggedIn();
        if(username) {
            $scope.dataLoading = true;
            $scope.item.poster_id = username;
            
            var isOffers = false;
            if($scope.type == 'Offers') {
                isOffers = true;
            }
            
            ItemService.create($stateParams.cityId, $scope.item, isOffers, function(response){
                if (response.data.success) {
                    $scope.dataLoading = false;
                    FlashService.Success('Creation successful', true);
                    
                    //after 1 second, close dialog
                    $timeout(function() {
                        FlashService.clearFlashMessage();
                        //update the city item in the parent scope
                        if(response.data.city) {
                            $scope.$parent.city = response.data.city;
                        }
                        else {
                            $state.go('error', {errorText : "Uh oh... something went wrong and we couldn't find your city to update with new item"});
                        }
                        ngDialog.close();
                    }, 1000);
                } else {
                    console.log(response.data.message);
                    FlashService.Error(response.data.message);
                    $scope.dataLoading = false;
                }
            });
        }
        else {
            $state.go('error', {errorText : "Cannot create new item, no longer logged in"});
        }
    }
});