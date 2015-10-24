(function () {
    'use strict';

    angular
        .module('app')
        .factory('AuthenticationService', AuthenticationService);

    AuthenticationService.$inject = ['$http', '$q', '$rootScope', '$timeout'];
    function AuthenticationService($http,  $q, $rootScope, $timeout) {
        var service = {};

        service.Login = Login;

        return service;

        function Login(username, password, callback) {
            //user as a 'promise' that can halt a request
            var deferred = $q.defer();

            /* Create user on server TODO password should not be plain text */
            $http.post('/users/authenticate', { username: username, password: password }, { timeout: deferred.promise }).then
                (function (response) {
                    $timeout.cancel(reqTimeout);
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
    
    };

})();