(function () {
    "use strict";
    angular.module("seguimientopedidos").controller("mesaofflineCtrl", mesaofflineCtrl);
    mesaofflineCtrl.$inject = ["$scope", "$rootScope", "services"];

    function mesaofflineCtrl($scope, $rootScope, services) {
        $scope.validarproducto = false;
        $scope.validaractividad = false;

        $scope.calcularAccionOffline = function () {
            var producto = $scope.offline.PRODUCTO;
            $scope.validarproducto = true;
            services.getAccionesoffline(producto).then(function (data) {
                if (data.data.state != 1) {
                    Swal({
                        type: 'error',
                        text: data.data.msj,
                        timer: 4000
                    })
                } else {
                    $scope.listadoAcciones = data.data.data;
                }
            });
        };

        $scope.calcularActividad2offline = function () {
            if ($scope.offline.ACTIVIDAD == "Patinaje") {
                $scope.validaractividad = true;
                $scope.actividades2 = [
                    {ID: "Asesor reiterativo", ACTIVIDAD2: "Asesor reiterativo"},
                    {ID: "Asesor AHT alto", ACTIVIDAD2: "Asesor AHT alto"},
                    {
                        ID: "Requiere intervencion - Supervisor",
                        ACTIVIDAD2: "Requiere intervencion - Supervisor",
                    },
                    {
                        ID: "Requiere intervención – Formacion ",
                        ACTIVIDAD2: "Requiere intervención – Formacion ",
                    },
                ];
            } else $scope.validaractividad = false;
        };

        $scope.guardarPedidoOffline = function () {
            services.pedidoOffline($scope.offline, $rootScope.galletainfo).then(
                function (data) {
                    $scope.respuestaupdate = "Pedido creado.";
                    return data.data;
                },
                function errorCallback(response) {
                    $scope.errorDatos = "Pedido no fue creado.";
                }
            );
        };
    }
})();
