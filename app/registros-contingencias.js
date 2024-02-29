(function () {
    "use strict";
    angular.module("seguimientopedidos").controller("RegistroContingenciasCtrl", RegistroContingenciasCtrl);
    RegistroContingenciasCtrl.$inject = ["$scope", "$rootScope", "services"];

    function RegistroContingenciasCtrl($scope, $rootScope, services) {
        var tiempo = new Date().getTime();
        var date1 = new Date();
        var year = date1.getFullYear();
        var month =
            date1.getMonth() + 1 <= 9
                ? "0" + (date1.getMonth() + 1)
                : date1.getMonth() + 1;
        var day = date1.getDate() <= 9 ? "0" + date1.getDate() : date1.getDate();

        tiempo = year + "-" + month + "-" + day;

        datosContingenciaTerminado();
        $scope.buscar = {};

        function datosContingenciaTerminado(data) {
            let datos = '';
            if (!data) {
                $scope.currentPage = 1;
                $scope.totalItems = 0;
                $scope.pageSize = 15;
                $scope.searchText = '';
                datos = {'page': $scope.currentPage, 'size': $scope.pageSize, 'data': $scope.buscar}
            } else {
                datos = data;
            }
            $scope.loadingData = true;

            services.myService(datos, 'contingenciaCtrl.php', 'datosContingenciaTerminado').then((data) => {
                console.log(`aca ${data.data.data}`)
                $scope.loadingData = false;
                $scope.registroContingencia = data.data.data;
                $scope.totalItems = data.data.counter;
                $scope.startItem = ($scope.currentPage - 1) * $scope.pageSize + 1;
                $scope.endItem = $scope.currentPage * $scope.pageSize;
                if ($scope.endItem > data.data.counter) {
                    $scope.endItem = data.data.counter;
                }
            }).catch((e) => {
                console.log(e)
            })
        }

        $scope.recargaPage = () => {
            let datos = {'page': $scope.currentPage, 'size': $scope.pageSize, 'data': ''}
            datosContingenciaTerminado(datos);
        }

        $scope.buscaDetalle = (data) => {
            let datos = '';
            if (!data) {
                $scope.currentPage = 1;
                $scope.totalItems = 0;
                $scope.pageSize = 15;
                $scope.searchText = '';
                datos = {'page': $scope.currentPage, 'size': $scope.pageSize, 'data': ''}
            } else {
                datos = {'page': $scope.currentPage, 'size': $scope.pageSize, data}
            }
            services.myService(datos, 'contingenciaCtrl.php', 'datosContingenciaTerminado').then((data) => {
                $scope.loadingData = false;
                $scope.registroContingencia = data.data.data;
                $scope.totalItems = data.data.counter;
                $scope.startItem = ($scope.currentPage - 1) * $scope.pageSize + 1;
                $scope.endItem = $scope.currentPage * $scope.pageSize;
                if ($scope.endItem > data.data.counter) {
                    $scope.endItem = data.data.counter;
                }
            }).catch((e) => {
                console.log(e)
            })
        }

        $scope.pageChanged = function () {
            let data = {page: $scope.currentPage, size: $scope.pageSize, data: $scope.buscar};
            datosContingenciaTerminado(data);
        };
        $scope.pageSizeChanged = function () {
            let data = {page: $scope.currentPage, size: $scope.pageSize, data: $scope.buscar};
            datosContingenciaTerminado(data);
        };

        $scope.descargarContingencias = function (data) {
            if (!data) {
                Swal({
                    type: 'error',
                    title: 'Oppss...',
                    text: 'Ingresa la fecha inicial',
                    timer: 4000
                })
                return;
            }
            if (!data.fechaupdateFinal) {
                Swal({
                    type: 'error',
                    title: 'Oppss...',
                    text: 'Ingresa la fecha final',
                    timer: 4000
                })
                return;
            }
            if (data.fechaupdateFinal < data.fechaupdateInical) {
                Swal({
                    type: 'error',
                    title: 'Oppss...',
                    text: 'La fecha inicial no puede ser mayor que la fecha final',
                    timer: 4000
                })
                return;
            }
            $scope.loading = true;
            services
                .myService(data, 'contingenciaCtrl.php', 'csvContingencias')
                .then(function (data) {
                    if (data.data.state) {
                        $scope.loading = false;
                        var wb = XLSX.utils.book_new();
                        var ws = XLSX.utils.json_to_sheet(data.data.data);
                        XLSX.utils.book_append_sheet(wb, ws, 'contingencias');
                        XLSX.writeFile(wb, 'Contingencias_' + tiempo + '.xlsx'); // Descarga el a
                    } else {
                        Swal({
                            type: 'error',
                            text: data.data.msj,
                            timer: 4000
                        })
                    }
                })
                .catch((error) => {
                    console.log(error);
                })
        };
    }
})();
