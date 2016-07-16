//Create posting/request Controller-----------------------------------------------------------------------------
app.controller('CreateController', function($scope, ngDialog, FlashService) {
    $scope.dataLoading = false; 
    //default to a request type
    $scope.type = 'Requests';
    
    $scope.create = function() {
        $scope.dataLoading = true;
        console.log("LOADING");
        console.log($scope.type);
        console.log($scope.item);

//        UserService.create($scope.user, function(response){
//            if (response.data.success) {
//                $scope.dataLoading = false;
//                FlashService.Success('Registration successful', true);
//            } else {
//                console.log(response.data.message);
//                FlashService.Error(response.data.message);
//                $scope.dataLoading = false;
//            }
//        });
    }
});