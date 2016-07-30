//Create posting/request Controller-----------------------------------------------------------------------------
app.controller('CreateController', function($scope, $state, $stateParams, ngDialog, FlashService, AuthenticationService, ItemService) {
    $scope.dataLoading = false; 
    //default to a request type
    $scope.type = 'Requests';
    
    $scope.create = function() {
        var username = AuthenticationService.isLoggedIn();
        if(username) {
            $scope.dataLoading = true;
            $scope.item.poster_id = username;
            console.log("LOADING");
            console.log($scope.type);
            console.log($scope.item);
            
            var isOffers = false;
            if($scope.type == 'Offers') {
                isOffers = true;
            }
            
            ItemService.create($stateParams.cityId, $scope.item, isOffers, function(response){
                if (response.data.success) {
                    $scope.dataLoading = false;
                    FlashService.Success('Creation successful', true);
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