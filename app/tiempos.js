(function () {
    "use strict";
    angular.module("seguimientopedidos").controller("tiemposCtrl", tiemposCtrl);
    tiemposCtrl.$inject = ["$scope", "$http", "$rootScope", "$route", "services", "$uibModal", "$log"];


    function tiemposCtrl($scope, $http, $rootScope, $route, services, $uibModal, $log) {
        init();
        $scope.listado_gestionUser = {};

        function init() {
            consultaContingenciaDiario();
            consultaContingenciaAgente();
        }

        function consultaContingenciaDiario(data) {
            services.contigenciaDiario(data).then(function (data) {
                $scope.datosContingenciaDiario = data.data.data;
                $scope.labels = [];
                $scope.acepta20 = [];
                $scope.acepta21 = [];
                $scope.colors = [];
                $scope.series = ["Internet+Toip", "TV"];
                angular.forEach($scope.datosContingenciaDiario, function (value, key) {
                    if (value.Internet) {
                        $scope.acepta20.push(value.Internet);
                        $scope.colors.push("#a34242");
                    }
                    if (value.TV) {
                        $scope.acepta21.push(value.TV);
                        $scope.colors.push("#b4c250");
                    }
                    $scope.labels.push(value.Fecha);
                });

                $scope.data = [$scope.acepta20, $scope.acepta21];
            });
        }

        function consultaContingenciaAgente(data) {
            services.contigenciaAgente(data).then(function (data) {
                $scope.contingenciaAgente = data.data.data;
                $scope.labels1 = [];
                $scope.aceptaInternet = [];
                $scope.aceptaTv = [];
                $scope.colors1 = [];
                $scope.series1 = ["Internet+Toip", "TV"];
                angular.forEach($scope.contingenciaAgente, function (value, key) {
                    if (value.Internet) {
                        $scope.aceptaInternet.push(value.Internet);
                        $scope.colors1.push("#803690");
                    }
                    if (value.TV) {
                        $scope.aceptaTv.push(value.TV);
                        $scope.colors1.push("#DCDCDC");
                    }

                    $scope.labels1.push(value.agente);
                });
                $scope.data1 = [$scope.aceptaInternet, $scope.aceptaTv];
            });
        }
    }
})();
