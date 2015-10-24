// Service to retrieve cities
app.factory('UserFactory', function($http){
    //define the UserFactory function
    var User = function(username) {
        //define the initialization function
        this.initialize = function() {
            // Fetch the user
            var url = 'users/' + username;
            var userData = $http.get(url);
            var self = this;
            
            // When our $http promise resolves
            // Use angular.extend to extend 'this'
            // with the properties of the response
            userData.then(
                //success
                function(response) {
                    //adds properties of response to the User object
                    angular.extend(self, response.data);  
                },
                //error
                function(response) {
                    //TODO display dialog?
                    console.log('Cannot go to portal until logging in');
                    //redirect to main page
                    $state.go('main');
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
app.controller('UserController', function($scope, $window, $state, UserFactory, AuthenticationService){
    if(AuthenticationService.isLoggedIn()) {
        console.log('attempting log in');
        $scope.user = new UserFactory($window.localStorage['username']);
    }
    else {
        $state.go('main');
    }
    
});
