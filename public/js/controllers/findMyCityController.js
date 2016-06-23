

// Service to retrieve cities
app.factory('FindMyCityFactory', ['$http', function($http){
  return $http.get('/cities');
}]);
//include that factory in the scope of the main controller
app.controller('FindMyCityController', function($scope, $state, FindMyCityFactory, ngDialog){

    //attempt to retrieve the current cities from the DB
    FindMyCityFactory.success(function(data){
        $scope.cities = data;
    }).error(function(data, status){
        console.log(data, status);
        $scope.cities = [];
    });

    $scope.openCity = function(city) {
        $state.go('city', {city : city});
    };

    $scope.openAddCity = function() {
        ngDialog.open({
            template: 'dialogs/addCityDialog.html',
            className: 'ngdialog-theme-default'
        });
    };
});
