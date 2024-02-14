(function () {
    "use strict";
    angular.module("seguimientopedidos").controller("ActivacionToipCtrl", ActivacionToipCtrl);
    ActivacionToipCtrl.$inject = ["$scope", "$rootScope", "services", "$route", "$sce", "$cookies", "$location", "$uibModal", "$log", "$interval", "$timeout"];

    function ActivacionToipCtrl($scope, $rootScope, services, $route, $sce, $cookies, $location, $uibModal, $log, $interval, $timeout) {
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
            gestionToip();
            gestionToipTerminado();
        }

        $scope.loading = false;

        function gestionToip(data) {
            if (data === '' || data === undefined) {
                data = {'page': '', 'size': '', 'data': $scope.toip}
            }
            services.myService('', 'toipCtrl.php', 'datos').then((data) => {
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

        function gestionToipTerminado(data) {
            let datos = '';
            if (!data) {
                $scope.currentPage = 1;
                $scope.totalItems = 0;
                $scope.pageSize = 15;
                $scope.searchText = '';
                datos = {'page': $scope.currentPage, 'size': $scope.pageSize, 'data': $scope.toip}
            } else {
                datos = data;
            }
            if (datos['recargar'] == 1) {
                $scope.toip = null;
            }
            $scope.loading = 1;
            services.myService(datos, 'toipCtrl.php', 'datosTerminados').then((data) => {
                $scope.loading = false;
                if (data.data.state) {
                    $scope.datosTerminados = data.data.data;

                    $scope.totalItems = data.data.counter;
                    $scope.startItem = ($scope.currentPage - 1) * $scope.pageSize + 1;
                    $scope.endItem = $scope.currentPage * $scope.pageSize;
                    if ($scope.endItem > data.data.counter) {
                        $scope.endItem = data.data.counter;
                    }
                } /*else {
                    Swal({
                        type: 'error',
                        title: 'Opps..',
                        text: data.data.msj,
                        timer: 4000
                    })
                }*/
            }).catch((e) => {
                console.log(e)
            })
        }

        $scope.marcarEngestion = (data) => {
            let user = $rootScope.login;
            let datos = {usuario: user, id: data.id, gestion: data.bloqueo}

            services.myService(datos, 'toipCtrl.php', 'marca').then((data) => {
                if (data.data.state) {
                    if (data.data.alerta === '1') {
                        if (data.data.msj === "Pedido bloqueado correctamente") {
                            $timeout(function () {
                                mostrarSweetAlert();
                            }, 600000);
                        }
                        swal({
                            type: "warning",
                            title: "Atención",
                            text: "esta tarea ha ingresado mas de una vez a este modulo, por favor validar la solicitud en detalle, observaciones, interacción(es) anterior(es) para evitar que ingrese de nuevo. si crees pertinente escala a tu supervisor",
                            showCancelButton: false,
                            confirmButtonText: "Aceptar",
                        }).then(() => {
                            Swal({
                                type: 'success',
                                title: 'Bien',
                                text: data.data.msj,
                                timer: 4000
                            }).then(() => {
                                gestionToip();
                            })
                        })
                    } else {
                        if (data.data.msj === "Pedido bloqueado correctamente") {
                            $timeout(function () {
                                mostrarSweetAlert();
                            }, 600000);
                        }
                        Swal({
                            type: 'success',
                            title: 'Bien',
                            text: data.data.msj,
                            timer: 4000
                        }).then(() => {
                            gestionToip();
                        })
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
            });
        }

        $scope.registrosToip = (data) => {
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
            gestionToipTerminado(datos);
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
            gestionToipTerminado(datos);
        }

        $scope.recargaPage = () => {
            let datos = {'page': $scope.currentPage, 'size': $scope.pageSize, 'recargar': 1}
            $scope.loading = true;
            gestionToipTerminado(datos);
            $scope.loading = false;
        }

        $scope.recargaPageGestion = () => {
            gestionToip();
        }

        $scope.pageChanged = function () {
            let data = {'page': $scope.currentPage, 'size': $scope.pageSize, 'data': $scope.toip}
            gestionToipTerminado(data);
        }
        $scope.pageSizeChanged = function () {
            let data = {'page': $scope.currentPage, 'size': $scope.pageSize, 'data': $scope.toip}
            gestionToip(data);
        }

        $scope.csvToip = (data) => {

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
            let datos = {'page': $scope.currentPage, 'size': $scope.pageSize, 'data': data, 'export': 1}
            $scope.loading = 1;
            services.myService(datos, 'toipCtrl.php', 'datosTerminados').then((data) => {
                $scope.loading = 0;
                if (data.data.state) {
                    var wb = XLSX.utils.book_new();
                    var ws = XLSX.utils.json_to_sheet(data.data.data);
                    XLSX.utils.book_append_sheet(wb, ws, 'activacion_toip');
                    XLSX.writeFile(wb, 'activacion_toip_' + tiempo + '.xlsx');
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
            $(".popover").css('display', 'none !importan');
            $scope.dataContent = $sce.trustAsHtml('<div class="table-responsive" style="max-width: 380px;"><table class="table table-bordered table-hover table-condensed small" style="max-width: 350px;">' +
                '<tbody><tr><td style="min-width: 80px">Hora cierre click</td><td>' + data.hora_cierre_click + '</td></tr>' +
                '<tbody><tr><td style="min-width: 80px">Respuesta aprov</td><td>' + data.respuesta_aprov + '</td></tr>' +
                '<tr><td style="min-width: 80px">Eq producto</td><td>' + data.eq_producto + '</td></tr>' +
                '<tr><td style="min-width: 80px">Categoría</td><td>' + data.categoria + '</td></tr>' +
                '<tr><td style="min-width: 80px">Task type</td><td>' + data.task_type + '</td></tr>' +
                '<tr><td style="min-width: 80px">Equipment id</td><td>' + data.equipment_id + '</td></tr>' +
                '<tr><td style="min-width: 80px">Tipo equipo</td><td>' + data.tipo_equipo + '</td></tr>' +
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

        $scope.GuardarActivacionToip = (data) => {

            if (data.en_gestion == 0) {
                Swal({
                    type: 'error',
                    title: 'Oppss..',
                    text: 'Debes marcar el pedido',
                    timer: 4000
                })
                return;
            }

            if (data.tipificacion == null) {
                Swal({
                    type: 'error',
                    title: 'Oppss..',
                    text: 'Debes seleccionar alguna tipificación',
                    timer: 4000
                })
                return;
            }

            if (data.subtipificacion == null) {
                Swal({
                    type: 'error',
                    title: 'Oppss..',
                    text: 'Debes seleccionar alguna subtipificación',
                    timer: 4000
                })
                return;
            }

            if (data.verifica_tono == null) {
                Swal({
                    type: 'error',
                    title: 'Oppss..',
                    text: 'Debes seleccionar si verifica tono',
                    timer: 4000
                })
                return;
            }

            /*if ((data.tipificacion == 'Aprovisionado por contingencia') && (data.subtipificacion == '' || data.subtipificacion == null)) {
                Swal({
                    type: 'error',
                    title: 'Oppss..',
                    text: 'Debes seleccionar alguna subtipificacion para Aprovisionado por contingencia',
                    timer: 4000
                })
                return;
            }*/

            if (data.cerrado_gtc == null) {
                Swal({
                    type: 'error',
                    title: 'Oppss..',
                    text: 'Debes seleccionar algun Cerrado GTC',
                    timer: 4000
                })
                return;
            }

            $scope.d = data;
            let modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'partial/modals/activacionToip.html',
                controller: 'ModalActivacionToipCtrl',
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

    angular.module("seguimientopedidos").controller("ModalActivacionToipCtrl", ModalActivacionToipCtrl);
    ModalActivacionToipCtrl.$inject = ["$uibModalInstance", "items", "services", "$route", "$scope", "$timeout"];

    function ModalActivacionToipCtrl($uibModalInstance, items, services, $route, $scope, $timeout) {
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
            services.myService(datos, 'toipCtrl.php', 'guarda').then((data) => {
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
