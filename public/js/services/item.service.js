(function () {
    'use strict';

    angular
        .module('app')
        .factory('ItemService', function($http, $q, $timeout) {
            var service = {};

            service.create = function(cityId, item, isOffer, callback) {
                //user as a 'promise' that can halt a request
                var deferred = $q.defer();

                /* Create item on server in appropriate location */
                var postUrl = "cities/" + cityId + "/";
                if(isOffer) {
                    postUrl += "offers";
                }
                else {
                    postUrl += "requests";
                }
                //use same function for success and error since success/error is in the response object
                $http.post(postUrl, item, { timeout: deferred.promise }).then
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