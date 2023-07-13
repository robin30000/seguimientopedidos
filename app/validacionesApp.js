(function () {
    "use strict";
    angular.module("seguimientopedidos").controller("validacionesAppCtrl", validacionesAppCtrl);
    validacionesAppCtrl.$inject = ["$scope", "$http", "$rootScope", "$route", "services"];

    function validacionesAppCtrl($scope, $http, $rootScope, $route, services) {

        estadoActual();

        function estadoActual() {
            services.estadoActualValidacionApp().then(function (data) {
                $scope.contingenciaSara = data.data.data[0].valida;
                $scope.contingenciaEquipo = data.data.data[1].valida;
                $scope.gponInfraestructura = data.data.data[2].valida;
            })
        }

        $scope.cambiaEstado = function (data, value) {
            data = {'tipo': data, 'valor': value}
            services.cambiaValidacionApp(data).then(function (response) {
                if (response.data.state == 1) {
                    Swal({
                        type: 'success',
                        text: response.data.msj,
                        timer: 4000
                    }).then(function () {
                        $route.reload();
                    })
                } else {
                    Swal({
                        type: 'error',
                        text: response.data.msj,
                        timer: 4000
                    }).then(function () {
                        $route.reload();
                    })
                }
            })
        }
    }
})()
