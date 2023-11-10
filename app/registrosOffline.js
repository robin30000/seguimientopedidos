(function () {
    "use strict";
    angular.module("seguimientopedidos").controller("registrosOfflineCtrl", registrosOfflineCtrl);
    registrosOfflineCtrl.$inject = ["$scope", "services"];

    function registrosOfflineCtrl($scope, services) {
        $scope.listaRegistrosOffline = {};
        RegistrosOffline();

        $scope.pageChanged = function () {
            let data = {page: $scope.currentPage, size: $scope.pageSize};
            RegistrosOffline(data);
        };
        $scope.pageSizeChanged = function () {
            let data = {page: $scope.currentPage, size: $scope.pageSize};
            $scope.currentPage = 1;
            RegistrosOffline(data);
        };

        function RegistrosOffline(data) {
            if (data === "" || data === undefined) {
                $scope.currentPage = 1;
                $scope.totalItems = 0;
                $scope.pageSize = 8;
                $scope.searchText = "";
                data = {page: $scope.currentPage, size: $scope.pageSize};
            }
            services.registrosOffline(data).then(
                function (data) {
                    $scope.listaRegistrosOffline = data.data.data;
                    $scope.cantidad = data.data.counter;
                    $scope.counter = data.data.data;

                    $scope.totalItems = data.data.counter;
                    $scope.startItem = ($scope.currentPage - 1) * $scope.pageSize + 1;
                    $scope.endItem = $scope.currentPage * $scope.pageSize;
                    if ($scope.endItem > data.data.totalCount) {
                        $scope.endItem = data.data.totalCount;
                    }
                },
                function errorCallback(response) {
                    console.log(response);
                }
            );
        }
    }
})();
