(function () {
    "use strict";
    angular.module("seguimientopedidos").controller("AlarmasCtrl", AlarmasCtrl);
    AlarmasCtrl.$inject = ["$scope", "services"];

    function AlarmasCtrl($scope, services) {
        $scope.crearAlarma = {};
        $scope.listaAlarmas = {};

        $scope.listadoAlarmas = function () {
            services.listadoAlarmas().then(function (data) {
                $scope.listaAlarmas = data.data;
                return data.data;
            });
        };

        $scope.crearAlarma = function (info) {
            services.creaAlarma(info).then(
                function (data) {
                    $scope.respuestaupdate = "Alarma creado.";
                    services.listadoAlarmas().then(function (data) {
                        $scope.listaAlarmas = data.data;

                        return data.data;
                    });
                },
                function errorCallback(response) {
                    $scope.errorDatos = "Alarma no fue creada.";
                }
            );
            $scope.listadoAlarmas();
        };

        $scope.procesos = function () {
            $scope.validaraccion = false;
            $scope.validarsubaccion = false;
            services.getProcesos().then(function (data) {
                $scope.listadoProcesos = data.data[0];
                $scope.listadoAcciones = {};
            });
        };

        $scope.editarModal = function (datos) {
            $scope.datosAlarmas = datos;
        };

        $scope.EditarDatosAlarma = function () {
            $scope.errorDatos = null;
            $scope.respuestaupdate = null;
            $scope.respuestadelete = null;

            services.editAlarma($scope.datosAlarmas).then(
                function (data) {
                    $scope.respuestaupdate =
                        "Alarma " +
                        $scope.datosAlarmas.nombre_alarma +
                        " actualizado exitosamente";
                    services.listadoAlarmas().then(function (data) {
                        $scope.listaAlarmas = data.data;
                        return data.data;
                    });
                },
                function errorCallback(response) {
                }
            );
        };

        $scope.borrarAlarma = function (id) {
            $scope.idBorrar = id;
            $scope.errorDatos = null;
            $scope.respuestaupdate = null;
            $scope.respuestadelete = null;
            services.deleteAlarma($scope.idBorrar).then(
                function (data) {
                    $scope.respuestadelete = "Alarma eliminada exitosamente";
                    services.listadoAlarmas().then(function (data) {
                        $scope.listaAlarmas = data.data;

                        return data.data;
                    });
                },
                function errorCallback(response) {
                    $scope.errorDatos = "No se borro";
                }
            );
        };

        $scope.calcularAcciones = function (proceso) {
            $scope.listadoAcciones = {};
            $scope.validarsubaccion = false;
            if (proceso == "") {
                $scope.validaraccion = false;
                $scope.validarsubaccion = false;
            } else {
                services.getAcciones(proceso).then(function (data) {
                    $scope.listadoAcciones = data.data[0];
                    $scope.validaraccion = true;
                    $scope.validarsubaccion = false;
                });
            }
        };

        $scope.calcularSubAcciones = function (proceso, accion) {
            $scope.listadoSubAcciones = {};
            $scope.validarsubaccion = true;
            services.getSubAcciones(proceso, accion).then(
                function (data) {
                    console.log()
                    $scope.listadoSubAcciones = data.data[0];
                    $scope.validarsubaccion = true;
                },
                function errorCallback(response) {
                    $scope.validarsubaccion = false;
                }
            );
        };

        $scope.procesos();
        $scope.listadoAlarmas();
    }
})()
