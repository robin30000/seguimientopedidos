(function () {
        "use strict";
        angular.module("seguimientopedidos").controller("validacionesAppCtrl", validacionesAppCtrl);
        validacionesAppCtrl.$inject = ["$scope", "$http", "$rootScope", "$route", "services"];

        function validacionesAppCtrl($scope, $http, $rootScope, $route, services) {
            estadoActual();

            function estadoActual() {
                services.myService('', 'validacionesAppCtrl.php', 'estadoActualValidacionApp').then((data) =>{
                    $scope.contingenciaSara = data.data.data[0].valida;
                    $scope.contingenciaEquipo = data.data.data[1].valida;
                    $scope.gponInfraestructura = data.data.data[2].valida;
                    $scope.codigoIncompleto = data.data.data[3].valida;
                    $scope.Encuesta = data.data.data[4].valida;
                    $scope.gponEquipo = data.data.data[5].valida;
                    $scope.etpEquipo = data.data.data[6].valida;
                    $scope.etpInfraestructura = data.data.data[7].valida;
                    $scope.multiTarea = data.data.data[8].valida;
                }).catch((e) => {
                    console.log(e)
                })
            }

            $scope.cambiaEstado = function (data, value) {
                data = {'tipo': data, 'valor': value}
                services.myService(data, 'validacionesAppCtrl.php', 'cambiaValidacionApp').then((response) => {
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
                }).catch((e) => {
                    console.log(e)
                })
            }
        }
    }
)()
