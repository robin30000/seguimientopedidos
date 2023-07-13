(function () {
    "use strict";
    angular.module("seguimientopedidos").controller("registroscodigoincompletoCtrl", registroscodigoincompletoCtrl);
    registroscodigoincompletoCtrl.$inject = ["$scope", "$rootScope", "services"];

    function registroscodigoincompletoCtrl($scope, $rootScope, services) {
        $scope.listaRegistros = {};
        $scope.RegistrosCodigoIncompleto = {};
        $scope.listadoAcciones = {};
        $scope.datosRegistros = {};
        $scope.verplantilla = false;

        if (
            $scope.RegistrosCodigoIncompleto.fechaini == undefined ||
            $scope.RegistrosCodigoIncompleto.fechafin == undefined
        ) {
            var tiempo = new Date().getTime();
            var date1 = new Date();
            var year = date1.getFullYear();
            var month =
                date1.getMonth() + 1 <= 9
                    ? "0" + (date1.getMonth() + 1)
                    : date1.getMonth() + 1;
            var day = date1.getDate() <= 9 ? "0" + date1.getDate() : date1.getDate();

            tiempo = year + "-" + month + "-" + day;

            $scope.fechaini = tiempo;
            $scope.fechafin = tiempo;
        }

        BuscarRegistrosCodigoIncompleto();

        function BuscarRegistrosCodigoIncompleto(data) {
            if (data === '' || data === undefined) {
                $scope.currentPage = 1;
                $scope.totalItems = 0;
                $scope.pageSize = 15;
                $scope.searchText = '';
                data = {'page': $scope.currentPage, 'size': $scope.pageSize}
            }
            services
                .registroscodigoincompleto(data)
                .then(
                    function (data) {
                        $scope.listaRegistros = data.data.data;
                        $scope.cantidad = data.data.totalItems;
                        $scope.counter = data.data.total_pages;

                        $scope.totalItems = data.data.totalItems;
                        $scope.startItem = ($scope.currentPage - 1) * $scope.pageSize + 1;
                        $scope.endItem = $scope.currentPage * $scope.pageSize;
                        if ($scope.endItem > data.data.totalItems) {
                            $scope.endItem = data.data.totalItems;
                        }
                    },

                    function errorCallback(response) {
                        console.log(response);
                    }
                );

        };

        $scope.recargaPage = () => {
            BuscarRegistrosCodigoIncompleto();
            $scope.tarea = '';
        }

        $scope.CopyPortaPapeles = function (data) {
            var copyTextTV = document.createElement("input");
            copyTextTV.value = data;
            document.body.appendChild(copyTextTV);
            copyTextTV.select();
            document.execCommand("copy");
            document.body.removeChild(copyTextTV);
            Swal({
                type: 'info',
                title: 'Aviso',
                text: "El texto seleccionado fue copiado",
                timer: 2000
            });
        }

        $scope.Buscartarea = (tarea) => {
            if (tarea == '' || tarea == undefined) {
                Swal({
                    type: 'info',
                    title: 'Aviso',
                    text: "Debes ingresar la tarea",
                    timer: 4000
                });
                return
            }
            data = {'page': $scope.currentPage, 'size': $scope.pageSize, 'data': $scope.RegistrosCodigoIncompleto, 'tarea': tarea}
            BuscarRegistrosCodigoIncompleto(data);
        }


        $scope.pageChanged = function (tarea) {
            data = {'page': $scope.currentPage, 'size': $scope.pageSize, 'data': $scope.RegistrosCodigoIncompleto}
            console.log(data)
            BuscarRegistrosCodigoIncompleto(data);
        }
        $scope.pageSizeChanged = function () {
            console.log(data)
            data = {'page': $scope.currentPage, 'size': $scope.pageSize, 'data': $scope.RegistrosCodigoIncompleto}
            $scope.currentPage = 1;
            BuscarRegistrosCodigoIncompleto(data);
        }

        $scope.muestraNotas = function (datos) {
            $scope.TituloModal = "Detalle código incompleto";
            $scope.pedido = datos.unepedido;
            $scope.observaciones = datos.observacion;
            $("#NotasModal").modal('show');
        };

        $scope.buscarRegistrosCodigoIncompleto = function (param) {
            if (param.fechaini == undefined) {
                Swal({
                    title: "Error",
                    text: "Ingresa la fecha inicial",
                    type: "error",
                });
            } else if (param.fechafin == undefined) {
                Swal({
                    title: "Error",
                    text: "Ingresa la fecha Final",
                    type: "error",
                });
            } else if (param.fechaini > param.fechafin) {
                Swal({
                    title: "Error",
                    text: "La fecha inicial no puede ser mayor que la final",
                    type: "error",
                });
            } else {
                data = {'page': $scope.currentPage, 'size': $scope.pageSize, data: param}
                BuscarRegistrosCodigoIncompleto(data)
            }

        }

        $scope.csvRegistros = function () {
            $scope.csvPend = false;
            if (
                $scope.RegistrosCodigoIncompleto.fechaini >
                $scope.RegistrosCodigoIncompleto.fechafin
            ) {
                Swal({
                    type: 'error',
                    text: 'La fecha inicial no puede ser mayor a la final',
                    timer: 4000
                })
            } else {
                services
                    .expCsvRegistrosCodigoIncompleto(
                        $scope.RegistrosCodigoIncompleto,
                        $rootScope.galletainfo
                    )
                    .then((data) => {
                        if (data.data.state == 1) {
                            var wb = XLSX.utils.book_new();
                            var ws = XLSX.utils.json_to_sheet(data.data.data);
                            XLSX.utils.book_append_sheet(wb, ws, 'codigo_incompleto');
                            XLSX.writeFile(wb, 'Codigo_incompleto_' + tiempo + '.xlsx'); // Descarga el a
                        } else {
                            Swal({
                                type: 'error',
                                text: data.data.msj,
                                timer: 4000
                            })
                        }
                    })
                    .catch((error) => {
                        console.log(console.error());
                    })
            }
        };
    }
})();
