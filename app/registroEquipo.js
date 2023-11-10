(function () {
    "use strict";
    angular.module("seguimientopedidos").controller("registroEquipoCtrl", registroEquipoCtrl);
    registroEquipoCtrl.$inject = ["$scope", "$http", "$rootScope", "$location", "$route", "$routeParams", "$cookies", "$timeout", "services", "cargaRegistros"];
    function registroEquipoCtrl($scope, $http, $rootScope, $location, $route, $routeParams, $cookies, $timeout, services, cargaRegistros) {
        var tiempo = new Date().getTime();
        var date1 = new Date();
        var year = date1.getFullYear();
        var month =
            date1.getMonth() + 1 <= 9
                ? "0" + (date1.getMonth() + 1)
                : date1.getMonth() + 1;
        var day = date1.getDate() <= 9 ? "0" + date1.getDate() : date1.getDate();

        tiempo = year + "-" + month + "-" + day;
        init();

        function init() {
            registroEquipos();
        }


        function registroEquipos(data) {

            if (data === '' || data === undefined) {
                $scope.currentPage = 1;
                $scope.totalItems = 0;
                $scope.pageSize = 15;
                $scope.searchText = '';
                data = {'page': $scope.currentPage, 'size': $scope.pageSize, 'datos': $scope.Registros}
            }

            services.registroEquipos(data).then(
                function (data) {
                    if (data.data.state == 1) {
                        $scope.registroEquipos = data.data.data;

                        $scope.cantidad = data.data.length;
                        $scope.counterpag = data.data.counter;

                        $scope.counter = data.data.counter;

                        $scope.totalItems = data.data.counter;
                        $scope.startItem = ($scope.currentPage - 1) * $scope.pageSize + 1;
                        $scope.endItem = $scope.currentPage * $scope.pageSize;
                        if ($scope.endItem > data.data.counter) {
                            $scope.endItem = data.data.counter;
                        }
                    }

                },

                function errorCallback(response) {
                    console.log(response);
                });
        }


        $scope.pageChanged = function () {
            data = {'page': $scope.currentPage, 'size': $scope.pageSize, 'datos': $scope.Registros}
            registroEquipos(data);
        }
        $scope.pageSizeChanged = function () {
            data = {'page': $scope.currentPage, 'size': $scope.pageSize, 'datos': $scope.Registros}
            registroEquipos(data);
        }

        $scope.recargaPage = function () {
            init();
        }

        $scope.buscarPedido = (data) => {
            if (!data) {
                Swal({
                    type: 'error',
                    title: 'Oops...',
                    text: 'Ingresa el pedido',
                    timer: 4000
                })
                return;
            }
            data = {
                page: $scope.currentPage,
                size: $scope.pageSize,
                buscar: data
            };
            registroEquipos(data);
        }

        $scope.registrosEq = (data) => {
            if (!data) {
                Swal({
                    type: 'error',
                    title: 'Oops...',
                    text: 'Ingresa un rango de fecha',
                    timer: 4000
                })
                return;
            }
            data = {
                page: $scope.currentPage,
                size: $scope.pageSize,
                fecha: data
            };
            registroEquipos(data);
        }

        $scope.csvRegistroEquipos = (data) => {


            if (data == '' || data == undefined) {
                Swal({
                    type: 'error',
                    title: 'Oops...',
                    text: 'Seleccione un rango de fecha valido',
                    timer: 4000
                })
                return;
            }

            var fechaini = new Date(data.fechaini);
            var fechafin = new Date(data.fechafin);
            var diffMs = (fechafin - fechaini);
            var diffDays = Math.round(diffMs / 86400000);

            if (data.fechaini == '' || data.fechaini == undefined) {
                Swal({
                    type: 'error',
                    title: 'Oops...',
                    text: 'La fecha inicial es requerida',
                    timer: 4000
                })
            } else if (data.fechafin == '' || data.fechafin == undefined) {
                Swal({
                    type: 'error',
                    title: 'Oops...',
                    text: 'La fecha final es requerida',
                    timer: 4000
                })
            } else if (data.fechaini > data.fechafin) {
                Swal({
                    type: 'error',
                    title: 'Oops...',
                    text: 'La fecha final no puede ser menor a la inicial',
                    timer: 4000
                })
            } else {
                data = {'page': $scope.currentPage, 'size': $scope.pageSize, 'fecha': data}
                services.csvRegistroEquipos(data)
                    .then(function (data) {
                        if (data.data.state == 1) {
                            var wb = XLSX.utils.book_new();
                            var ws = XLSX.utils.json_to_sheet(data.data.data);
                            XLSX.utils.book_append_sheet(wb, ws, 'RegistroEquipos');
                            XLSX.writeFile(wb, 'registro_quipos_' + tiempo + '.xlsx'); // Descarga el a
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
            }
        }

    }
})();
