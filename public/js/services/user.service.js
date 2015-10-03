(function () {
    'use strict';

    angular
        .module('app')
        .factory('UserService', function($http, $q, $timeout) {
            var service = {};

            service.create = function(user, callback) {
                //user as a 'promise' that can halt a request
                var deferred = $q.defer();

                /* Create user on server TODO password should not be plain text */
                $http.post('/users/', user, { timeout: deferred.promise }).then
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
            };

            return service;
        });

})();