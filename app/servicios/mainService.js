(function () {
    "use strict";
    angular.module("seguimientopedidos").factory("MainService", MainService);
    MainService.$inject = ["$http", "$q"];

    function MainService($http, $q) {
        var serviceBase = "api/controller/";
        var dataFactory = {};
        dataFactory.myService = function (datos, method, controller) {
            var data = {
                data: datos,
                method: method
            };
            return $http.post(serviceBase + controller, data).then(complete).catch(failed);

            function complete(response) {
                return $q.when(response.data)
            }

            function failed(response) {
                return $q.reject(response.data)
            }
        };
/*        dataFactory.windowsBridge = function (datos, method, controller) {
            var data = {
                data: datos,
                method: method
            };
            return $http.post(serviceBase + controller, data).then(complete).catch(failed);

            function complete(response) {
                return $q.when(response.data)
            }

            function failed(response) {
                return $q.reject(response.data)
            }
        }*/

        return dataFactory
    }
})();

