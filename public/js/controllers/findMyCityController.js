

// Service to retrieve cities
app.factory('FindMyCityFactory', ['$http', function($http){
  return $http.get('/cities');
}]);
//include that factory in the scope of the main controller
app.controller('FindMyCityController', function($scope, $state, FindMyCityFactory, ngDialog){

    //attempt to retrieve the current cities from the DB
    FindMyCityFactory.then(
        function successCallback(response) {
            $scope.cities = response.data;
        },
        function errorCallback(response) {
            $scope.cities = [];
            $state.go('error', {errorText : "Error Code " + response.status + ": " + response.statusText});
        }
    );

    $scope.openCity = function(city) {
        $state.go('city', {cityId : city._id, city : city});
    };

    $scope.openAddCity = function() {
        ngDialog.open({
            template: 'dialogs/addCityDialog.html',
            className: 'ngdialog-theme-default'
        });
    };
});
