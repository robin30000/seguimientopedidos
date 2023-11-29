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

        var tiempo = new Date().getTime();
        var date1 = new Date();
        var year = date1.getFullYear();
        var month =
            date1.getMonth() + 1 <= 9
                ? "0" + (date1.getMonth() + 1)
                : date1.getMonth() + 1;
        var day = date1.getDate() <= 9 ? "0" + date1.getDate() : date1.getDate();

        tiempo = year + "-" + month + "-" + day;

        $scope.buscarDataSara = function (datos) {
            $scope.loading = 1;
            let tareaSara = datos.tarea;
            services.windowsBridge("SARA/Buscar/" + tareaSara)
                .then((data) => {
                    $scope.loading = 0;
                    $scope.dataSara = data.data;

                    if ($scope.dataSara.Error === "No hay datos para mostrar") {
                        $scope.horasTranscurridas = 0;
                        $scope.minutosTranscurridos = 0;
                        $scope.segundosTranscurridos = 0;

                        Swal({
                            type: "error",
                            title: "Oops...",
                            text: "Aún no se hace la solicitud a SARA",
                        });
                        return;
                    }

                    $scope.indiceSara =
                        Object.keys($scope.dataSara.SolicitudesSara).length - 1;
                    var tiempoSara =
                        $scope.dataSara.SolicitudesSara[$scope.indiceSara].TiempoRespuesta;
                    $scope.horasTranscurridas = tiempoSara.substr(0, 2);
                    $scope.minutosTranscurridos = tiempoSara.substr(3, 2);
                    $scope.segundosTranscurridos = tiempoSara.substr(6, 2);
                    return data.data;
                }).catch((e) => {
                console.log(e)
            })
        };

        $scope.csvexportarRRHH = async function () {
            try {
                const data = await services.windowsBridge("RRHH/Exporte/1");
                if (data.data) {
                    var wb = XLSX.utils.book_new();
                    var ws = XLSX.utils.json_to_sheet(data.data);
                    XLSX.utils.book_append_sheet(wb, ws, 'exportrrhh');
                    XLSX.writeFile(wb, 'exportrrhh_' + tiempo + '.xlsx');
                } else {
                    Swal({
                        type: 'error',
                        text: 'No se encontraron registros',
                        timer: 4000
                    });
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

})();
