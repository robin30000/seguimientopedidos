(function () {
    "use strict";
    angular.module("seguimientopedidos").controller("saraCtrl", saraCtrl);
    saraCtrl.$inject = ["$scope", "$http", "$rootScope", "services"];
    function saraCtrl($scope, $http, $rootScope, services) {
        $scope.rutaConsultaSara = "partial/consultaSara/consulSara.html";
        $scope.dataSara = {};
        $scope.horasTranscurridas = 0;
        $scope.minutosTranscurridos = 0;
        $scope.segundosTranscurridos = 0;

        $scope.buscarDataSara = function (datos) {
            services.windowsBridge("SARA/Buscar/" + tareaSara)
                .then(
                    function (data) {
                        $scope.dataSara = data.data;

                        if ($scope.dataSara.Error == "No hay datos para mostrar") {
                            $scope.horasTranscurridas = 0;
                            $scope.minutosTranscurridos = 0;
                            $scope.segundosTranscurridos = 0;

                            /*Swal({
                                type: "error",
                                title: "Oops...",
                                text: "Aún no se hace la solicitud a SARA",
                            });*/
                        }

                        $scope.indiceSara =
                            Object.keys($scope.dataSara.SolicitudesSara).length - 1;
                        var tiempoSara =
                            $scope.dataSara.SolicitudesSara[$scope.indiceSara].TiempoRespuesta;
                        $scope.horasTranscurridas = tiempoSara.substr(0, 2);
                        $scope.minutosTranscurridos = tiempoSara.substr(3, 2);
                        $scope.segundosTranscurridos = tiempoSara.substr(6, 2);
                        return data.data;
                    },

                    function (Error) {
                        console.log(Error)
                    }
                );
        };

        $scope.csvexportarRRHH = function () {
            services.windowsBridge("api/exportrrhh")
                .then(function (data) {
                    console.log(data)
                    if (data){
                        var wb = XLSX.utils.book_new();
                        var ws = XLSX.utils.json_to_sheet(data);
                        XLSX.utils.book_append_sheet(wb, ws, 'exportrrhh');
                        XLSX.writeFile(wb, 'exportrrhh_' + '.xlsx');
                    } else {
                        Swal({
                            type: 'error',
                            text: 'No se encontraron registros',
                            timer: 4000
                        })
                    }
                })
                .catch((error) => {
                    console.log(error);
                })
        }
    }

})();
