(function () {
    'use strict';

    angular
        .module('app')
        .factory('AuthenticationService', AuthenticationService);

    AuthenticationService.$inject = ['$http', '$q', '$rootScope', '$timeout', '$window'];
    function AuthenticationService($http,  $q, $rootScope, $timeout, $window) {
        var service = {};

        service.Login = Login;
        service.isLoggedIn = isLoggedIn;
        service.Logout = Logout;

        return service;
        
        //function to determine if user is logged in. Either returns null if no one logged in or username if logged in
        function isLoggedIn() {
            if($window.localStorage['token']) {
                if($window.localStorage['username']) {
                    return $window.localStorage['username'];
                }
            }
            return null;
        }

        function Login(username, password, callback) {
            //user as a 'promise' that can halt a request
            var deferred = $q.defer();

            /* Create user on server TODO password should not be plain text */
            $http.post('/users/authenticate', { username: username, password: password }, { timeout: deferred.promise }).then
                (function (response) {
                    $timeout.cancel(reqTimeout);
                    //store our jwt token in local storage
                    $window.localStorage['token'] = response.data.token;
                    $window.localStorage['username'] = username;
                    callback(response);
                }),
                (function (response) {
                    $timeout.cancel(reqTimeout);
                    callback(response);
                })
            ;

            var reqTimeout = $timeout(function() {
                deferred.resolve(); // this aborts the request (see timeout promise on http.post)
                var msg = {};
                msg.data = {success : false, message: 'Error; request timed out'};
                callback(msg);
            }, 2000); //2 seconds
        }
        
        
        function Logout() {
            $window.localStorage.removeItem('token');
            $window.localStorage.removeItem('username');
        }
        
        //requires callback that take a response; response will have structure {success:bool, then data if success, or message if !success}
        function GetUser(callback) {
            var username = IsLoggedIn();
            if(username) {
                $http.get('/users/' + username, { timeout: deferred.promise }).then
                    (function (response) {
                        $timeout.cancel(reqTimeout);
                        callback(response);
                    }),
                    (function (response) {
                        $timeout.cancel(reqTimeout);
                        callback(response);
                    })
                ;
            }
            else {
                var response = {success : false, message : "No user logged in"};
                callback(response);
            }
        }
    
    };

})();