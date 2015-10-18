// Service to retrieve cities
app.factory('UserFactory', function($http){
    //define the UserFactory function
    var User = function(username) {
        //define the initialization function
        this.initialize = function() {
            // Fetch the user
            var url = 'users/' + username;
            var playerData = $http.jsonp(url);
            var self = this;
            
            // When our $http promise resolves
            // Use angular.extend to extend 'this'
            // with the properties of the response
            playerData.then(
                //success
                function(response) {
                    //adds properties of response to the User object
                    angular.extend(self, response.data);  
                },
                //error
                function(response) {
                    throw 'Error: could not retrieve user from server'; 
                }
            );
        };
        
        
        //call the initialization function for every new instance
        this.initialize();  
    };
    
    //return a reference to the function
    return (User);
});

//include that factory in the scope of the main controller
app.controller('UserController', function($scope, $location, UserFactory){
    console.log($location.search());
    console.log($location.url());
    $scope.user = new UserFactory($location.search());
    
});
