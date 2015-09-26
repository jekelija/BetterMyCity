// Service to retrieve cities
app.factory('cities', ['$http', function($http){
  return $http.get('/cities');
}]);
//include that factory in the scope of the main controller
app.controller('CityController', ['$scope', 'cities', 'ngDialog', function($scope, cities, ngDialog){

    //attempt to retrieve the current cities from the DB
    cities.success(function(data){
        console.log(data);
        $scope.cities = data;
    }).error(function(data, status){
        console.log(data, status);
        $scope.cities = [];
    });

    $scope.openCity = function(city) {
        ngDialog.open({
            template: 'cityDialog',
            //controller: 'CityDialogController',
            className: 'ngdialog-theme-default',
            data:city
        });
    };

    $scope.openAddCity = function() {
        ngDialog.open({
            template: 'addCityDialog',
            //controller: 'CityDialogController',
            className: 'ngdialog-theme-default'
        });
    };
}]);
