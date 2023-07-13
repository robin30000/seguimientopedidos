(function () {
    "use strict";
    angular.module("seguimientopedidos").controller("turnosCtrl", turnosCtrl);
    turnosCtrl.$inject = ["$scope", "$rootScope", "services"];

    function turnosCtrl($scope, $rootScope, services) {
        $scope.errorDatos = null;
        $scope.turnos = [
            {
                id: "1",
                fecha: "",
                horaInicio: "",
                horaFin: "",
                usuariocrea: $rootScope.galletainfo.login,
            },
        ];
        $scope.cumple = {};
        $scope.editar = false;
        var tiempo = new Date().getTime();
        var date1 = new Date();
        var year = date1.getFullYear();
        var month =
            date1.getMonth() + 1 <= 9
                ? "0" + (date1.getMonth() + 1)
                : date1.getMonth() + 1;
        var day = date1.getDate() <= 9 ? "0" + date1.getDate() : date1.getDate();

        $scope.fechaIni = year + "-" + month + "-" + day;
        $scope.fechaFin = year + "-" + month + "-" + day;
        $scope.cumple.fechaIni = year + "-" + month + "-" + day;

        $scope.ingresoTurnos = function () {
            services.getguardarTurnos($scope.turnos).then(function (data) {
                $scope.turnos = [
                    {
                        id: "1",
                        fecha: "",
                        horaInicio: "",
                        horaFin: "",
                        usuariocrea: $rootScope.galletainfo.login,
                    },
                ];
                $scope.obtenerlistaTurnos();
            });
        };

        $scope.obtenercumplmientoTurnos = function () {
            services.getcumplmientoTurnos($scope.cumple).then(
                function (data) {
                    $scope.cumplimientoTurno = data.data[0];
                    $scope.nohaycumplimiento = null;
                    return data.data;
                },
                function errorCallback(response) {
                    $scope.nohaycumplimiento = "No hay datos!!";
                }
            );
        };

        $scope.obtenerlistaTurnos = function () {
            services.getlistaTurnos($scope.fechaIni, $scope.fechaFin).then(
                function (data) {
                    $scope.historicoturnos = data.data[0];
                    $scope.errorDatos = null;
                    return data.data;
                },
                function errorCallback(response) {
                    $scope.errorDatos = "No hay datos!!";
                    $scope.historicoturnos = {};
                }
            );
        };

        $scope.desacargarAdherencia = function () {
            services
                .csvAdherenciaTurnos(
                    $scope.fechaIni,
                    $scope.fechaFin,
                    $rootScope.galletainfo
                )
                .then(function (data) {
                    if (data.data[0] !== undefined) {
                        window.location.href = "tmp/" + data.data[0];
                        $scope.csvPend = true;
                        $scope.counter = "Se exportaron: " + data.data[1] + " Registros";
                        return data.data;
                    } else {
                        $scope.counter = "No hay datos para exportar";
                    }
                });
        };

        $scope.borrarTurno = function (idturno) {
            services.borrarTurno(idturno).then(function (data) {
                $scope.obtenerlistaTurnos();
            });
        };

        $scope.usuariosTurnosSeguimiento = function () {
            services.getusuariosTurnos().then(function (data) {
                $scope.usuarios = data.data[0];
                return data.data;
            });
        };

        $scope.addNuevaNovedad = function (usuario) {
            var newItemNo = $scope.turnos.length + 1;

            $scope.turnos.push({
                id: +newItemNo,
                fecha: "",
                horaIni: "",
                horaFin: "",
                usuariocrea: $rootScope.galletainfo.login,
            });
        };

        $scope.updateStatus = function (data) {
            services.updateTurnos(data).then(function (data) {
                $scope.obtenerlistaTurnos();
            });
        };

        $scope.statuses = [
            {value: "Turno", novedades: "Turno"},
            {value: "Vacaciones", novedades: "Vacaciones"},
            {value: "Licencia", novedades: "Licencia"},
            {value: "Incapacidad", novedades: "Incapacidad"},
        ];

        $scope.removeNuevaNovedad = function () {
            var lastItem = $scope.turnos.length - 1;
            if (lastItem != 0) {
                $scope.turnos.splice(lastItem);
            }
        };

        $scope.usuariosTurnosSeguimiento();
        $scope.obtenerlistaTurnos();
        $scope.obtenercumplmientoTurnos();
    }
})()
