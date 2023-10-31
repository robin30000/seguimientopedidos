(function () {
    "use strict";
    angular.module("seguimientopedidos").controller("etpCtrl", etpCtrl);
    etpCtrl.$inject = ["$scope", "$rootScope", "services", "$route", "$sce", "$cookies", "$location", "$uibModal", "$log", "$interval"];

    function etpCtrl($scope, $rootScope, services, $route, $sce, $cookies, $location, $uibModal, $log, $interval) {



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
            gestionETP();
            gestionETPTerminado();
            gestionETPTerminadoGestion();
            //reloadPage();
        }

       /* var reloadMinutes = [601, 731, 801, 831, 901, 931, 1001, 1031, 1101, 1131, 1201, 1231, 1301, 1331, 1401, 1431, 1501, 1531, 1601, 1631, 1701, 1731, 1801, 1831, 1901, 1931, 2001, 2031, 2101, 2131];

        function reloadPage() {
            location.reload();
        }

        function checkReloadTime() {
            var now = new Date();
            var currentMinute = now.getHours() * 60 + now.getMinutes();

            if (reloadMinutes.includes(currentMinute)) {
                reloadPage();
            }
        }

        var intervalPromise = $interval(checkReloadTime, 60000);

        $scope.$on('$destroy', function() {
            $interval.cancel(intervalPromise);
        });*/

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

        };

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

        };

        $scope.marcarEngestion = (data) => {
            console.log(data, ' TTTTT');
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
            });
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

        $scope.GuardarETP = (data) => {
            console.log(data);
            if (data.status_soporte == 0) {
                Swal({
                    type: 'error',
                    title: 'Oppss..',
                    text: 'Debes marcar el pedido',
                    timer: 4000
                })
                return;
            }

            if (data.tipificaciones == '' ||data.tipificaciones == null) {
                Swal({
                    type: 'error',
                    title: 'Oppss..',
                    text: 'Debes seleccionar alguna tipificación 1',
                    timer: 4000
                })
                return;
            }

            if (data.tipificaciones2 == '' ||data.tipificaciones2 == null  ) {
                Swal({
                    type: 'error',
                    title: 'Oppss..',
                    text: 'Debes seleccionar alguna tipificación 2',
                    timer: 4000
                })
                return;
            }


            $scope.d = data;
            let modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'partial/modals/etp.html',
                controller: 'ModalActivacionETPCtrl',
                controllerAs: '$ctrl',
                size: 'md',
                resolve: {
                    items: function () {
                        return $scope.d;
                    }
                }
            });

            modalInstance.result.then(function () {
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }

    }

    angular.module("seguimientopedidos").controller("ModalActivacionETPCtrl", ModalActivacionETPCtrl);
    ModalActivacionETPCtrl.$inject = ["$uibModalInstance", "items", "services", "$route", "$scope", "$timeout"];

    function ModalActivacionETPCtrl($uibModalInstance, items, services, $route, $scope, $timeout) {
        var $ctrl = this;
        $ctrl.items = items;
        console.log(items)

        $ctrl.guardar = (data) => {
            if (!data) {
                Swal({
                    type: 'error',
                    title: 'Opps..',
                    text: 'Debes ingresar observaciones',
                    timer: 4000
                })
                return;
            }
            $ctrl.items.observacion = data;
            let datos = $ctrl.items;
            services.myService(datos, 'etpCtrl.php', 'guarda').then((data) => {

                if (data.data.state) {
                    $uibModalInstance.dismiss('cancel');
                    Swal({
                        type: 'success',
                        title: 'Bien',
                        text: data.data.msj,
                        timer: 4000
                    }).then(() => {
                        $route.reload();
                    })
                } else {
                    Swal({
                        type: 'error',
                        title: 'Oppss',
                        text: data.data.msj,
                        timer: 4000
                    })
                }
            }).catch((e) => {
                console.log(e)
            })
        }

        $ctrl.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    }
})();
