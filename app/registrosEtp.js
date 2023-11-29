(function () {
    "use strict";
    angular.module("seguimientopedidos").controller("RegistrosEtpCtrl", RegistrosEtpCtrl);
    RegistrosEtpCtrl.$inject = ["$scope", "$rootScope", "services", "$route", "$sce", "$cookies", "$location", "$uibModal", "$log", "$interval"];

    function RegistrosEtpCtrl($scope, $rootScope, services, $route, $sce, $cookies, $location, $uibModal, $log, $interval) {
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
        console.log('pepino')
        function init() {
            gestionETPTerminado();
        }

        $scope.loading = false;

        function gestionETP(data) {
            if (data === '' || data === undefined) {
                /*$scope.currentPage = 1;
                $scope.totalItems = 0;
                $scope.pageSize = 15;
                $scope.searchText = '';*/
                data = {'page': '', 'size': '', 'data': $scope.ETP}
            }
            services.myService('', 'etpCtrl.php', 'datos').then((data) => {
                if (data.data.state) {
                    $scope.datos = data.data.data;
                    $scope.Items = data.data.counter;


                } else {
                    Swal({
                        type: 'error',
                        title: 'Opps..',
                        text: data.data.msj,
                        timer: 4000
                    })
                }
            }).catch((e) => {
                console.log(e)
            })
        }

        function gestionETPTerminado(data) {
            let datos = '';
            if (!data) {
                $scope.currentPage = 1;
                $scope.totalItems = 0;
                $scope.pageSize = 15;
                $scope.searchText = '';
                datos = {'page': $scope.currentPage, 'size': $scope.pageSize, 'data': $scope.ETP}
            } else {
                datos = data;
            }
            $scope.loading = 1;
            services.myService(datos, 'etpCtrl.php', 'datosTerminados').then((data) => {
                $scope.loading = false;
                if (data.data.state) {
                    $scope.datosTerminados = data.data.data;

                    $scope.totalItems = data.data.counter;
                    $scope.startItem = ($scope.currentPage - 1) * $scope.pageSize + 1;
                    $scope.endItem = $scope.currentPage * $scope.pageSize;
                    if ($scope.endItem > data.data.counter) {
                        $scope.endItem = data.data.counter;
                    }
                } else {
                    Swal({
                        type: 'error',
                        title: 'Opps..',
                        text: data.data.msj,
                        timer: 4000
                    })
                }
            }).catch((e) => {
                console.log(e)
            })
        }

        $scope.marcarEngestion = (data) => {
            let user = $rootScope.login;
            let datos = {usuario: user, id: data.id_soporte}

            services.myService(datos, 'etpCtrl.php', 'marca').then((data) => {
                console.log(data)
                if (data.data.state) {
                    Swal({
                        type: 'success',
                        title: 'Bien',
                        text: data.data.msj,
                        timer: 4000
                    }).then(() => {
                        gestionETP();
                    })
                } else {
                    Swal({
                        type: 'error',
                        title: 'Opps..',
                        text: data.data.msj,
                        timer: 4000
                    })
                }
            }).catch((e) => {
                console.log(e)
            });
        }

        $scope.registrosETP = (data) => {
            if (!data) {
                Swal({
                    type: 'error',
                    title: 'Oppss',
                    text: 'Debes seleccionar un rango de fecha',
                    timer: 4000
                })
                return;
            }
            if (data.fechaini > data.fechafin) {
                Swal({
                    type: 'error',
                    title: 'Oppss',
                    text: 'La fecha inicial no puede ser mayor a la fecha final',
                    timer: 4000
                })
                return;
            }

            let datos = {'page': $scope.currentPage, 'size': $scope.pageSize, 'data': data}
            gestionETPTerminado(datos);
        }

        $scope.detallePedido = (data) => {
            if (!data) {
                Swal({
                    type: 'error',
                    title: 'Oppss',
                    text: 'Debes ingresar un pedido',
                    timer: 4000
                })
                return;
            }
            let datos = {'page': $scope.currentPage, 'size': $scope.pageSize, 'data': data}
            gestionETPTerminado(datos);
        }

        $scope.recargaPage = () => {
            let datos = {'page': $scope.currentPage, 'size': $scope.pageSize}
            gestionETPTerminado(datos);
        }

        $scope.recargaPageGestion = () => {
            gestionETP();
        }

        $scope.pageChanged = function () {
            let data = {'page': $scope.currentPage, 'size': $scope.pageSize, 'data': $scope.toip}
            gestionETPTerminado(data);
        }
        $scope.pageSizeChanged = function () {
            let data = {'page': $scope.currentPage, 'size': $scope.pageSize, 'data': $scope.toip}
            gestionETP(data);
        }

        $scope.csvETP = (data) => {
            if (!data) {
                Swal({
                    type: 'error',
                    title: 'Oppss',
                    text: 'Debes seleccionar un rango de fecha'
                })
                return;
            }
            if (data.fechaini > data.fechafin) {
                Swal({
                    type: 'error',
                    title: 'Oppss',
                    text: 'La fecha inicial no puede ser mayor a la fecha final',
                    timer: 4000
                })
                return;
            }
            let datos = {'page': $scope.currentPage, 'size': $scope.pageSize, 'data': data, 'export' : 1}
            services.myService(datos, 'etpCtrl.php', 'datosTerminados').then((data) => {
                $scope.loading = false;
                if (data.data.state) {
                    var wb = XLSX.utils.book_new();
                    var ws = XLSX.utils.json_to_sheet(data.data.data);
                    XLSX.utils.book_append_sheet(wb, ws, 'ETP');
                    XLSX.writeFile(wb, 'ETP_' + tiempo + '.xlsx');
                } else {
                    Swal({
                        type: 'error',
                        title: 'Opps..',
                        text: data.data.msj,
                        timer: 4000
                    })
                }
            }).catch((e) => {
                console.log(e)
            })
        }

        $scope.ver_masss = (data) => {
            $scope.dataContent = $sce.trustAsHtml('<div class="table-responsive" style="max-width: 380px;"><table class="table table-bordered table-hover table-condensed small" style="max-width: 350px;">' +
                '<tbody><tr><td style="min-width: 80px">Pedido</td><td>' + data.unepedido + '</td></tr>' +
                '<tr><td style="min-width: 80px">Categoría</td><td>' + data.tasktypecategory + '</td></tr>' +
                '<tr><td style="min-width: 80px">Municipio</td><td>' + data.unemunicipio + '</td></tr>' +
                '<tr><td style="min-width: 80px">Productos</td><td>' + data.uneproductos + '</td></tr>' +
                '<tr><td style="min-width: 80px">Datos cola</td><td>' + data.datoscola + '</td></tr>' +
                '<tr><td style="min-width: 80px">Mac</td><td>' + data.mac + '</td></tr>' +
                '<tr><td style="min-width: 80px">Serial</td><td>' + data.serial.replace(/,/g, '\n') + '</td></tr>' +
                '<tr><td style="min-width: 80px">Sistema</td><td>' + data.uneSourceSystem + '</td></tr>' +
                '<tr><td style="min-width: 80px">Observación</td><td>' + data.observacion_terreno + '</td></tr>' +
                '<tr><td style="min-width: 80px">Fecha solicitud</td><td>' + data.fecha_creado + '</td></tr>' +
                '</tbody></table></div>');
        }

        $scope.ver_mas2 = (data)  => {
            $scope.dataContent = $sce.trustAsHtml('<div class="table-responsive" style="max-width: 380px;"><table class="table table-bordered table-hover table-condensed small" style="max-width: 350px;">' +
                '<tbody><tr><td style="min-width: 80px">Pedido</td><td>' + data.unepedido + '</td></tr>' +
                '<tr><td style="min-width: 80px">Categoría</td><td>' + data.tasktypecategory + '</td></tr>' +
                '<tr><td style="min-width: 80px">Municipio</td><td>' + data.unemunicipio + '</td></tr>' +
                '<tr><td style="min-width: 80px">Productos</td><td>' + data.uneproductos + '</td></tr>' +
                '<tr><td style="min-width: 80px">Datos cola</td><td>' + data.datoscola + '</td></tr>' +
                '<tr><td style="min-width: 80px">Mac</td><td>' + data.mac + '</td></tr>' +
                '<tr><td style="min-width: 80px">Serial</td><td>' + data.serial.replace(/,/g, '\n') + '</td></tr>' +
                '<tr><td style="min-width: 80px">Sistema</td><td>' + data.uneSourceSystem + '</td></tr>' +
                '<tr><td style="min-width: 80px">Observación</td><td>' + data.observacion_terreno + '</td></tr>' +
                '<tr><td style="min-width: 80px">Fecha solicitud</td><td>' + data.fecha_creado + '</td></tr>' +
                '</tbody></table></div>');
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
    }

})();
