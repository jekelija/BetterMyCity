

// Service to retrieve cities
app.factory('CityFactory', ['$http', function($http){
  return $http.get('/cities');
}]);
//include that factory in the scope of the main controller
app.controller('CityController', ['$scope', 'CityFactory', 'ngDialog', function($scope, CityFactory, ngDialog){

    //attempt to retrieve the current cities from the DB
    CityFactory.success(function(data){
        console.log(data);
        $scope.cities = data;
    }).error(function(data, status){
        console.log(data, status);
        $scope.cities = [];
    });

    $scope.openCity = function(city) {
        ngDialog.open({
            template: 'dialogs/cityDialog.html',
            className: 'ngdialog-theme-default',
            data:city
        });
    };

    $scope.openAddCity = function() {
        ngDialog.open({
            template: 'dialogs/addCityDialog.html',
            className: 'ngdialog-theme-default'
        });
    };
}]);
