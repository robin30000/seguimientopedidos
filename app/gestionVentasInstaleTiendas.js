(function () {
    "use strict";
    angular.module("seguimientopedidos").controller("gestionVentasInstaleTiendasCtrl", gestionVentasInstaleTiendasCtrl);
    gestionVentasInstaleTiendasCtrl.$inject = ["$scope", "$http", "$rootScope", "$route", "services", "$cookies", "$location"];

    function gestionVentasInstaleTiendasCtrl($scope, $http, $rootScope, $route, services, $cookies, $location) {

        var tiempo = new Date().getTime();
        var date1 = new Date();
        var year = date1.getFullYear();
        var month =
            date1.getMonth() + 1 <= 9
                ? "0" + (date1.getMonth() + 1)
                : date1.getMonth() + 1;
        var day = date1.getDate() <= 9 ? "0" + date1.getDate() : date1.getDate();

        tiempo = year + "-" + month + "-" + day;

        $scope.ventaIstale = {};
        init();

        function init() {
            data();
            dataVentaTerminado();
        }

        function data() {
            services.datosVentas().then(function (data) {
                $scope.dataVentas = data.data.data;
            });
        }

        $scope.currentPage = 1;
        $scope.totalItems = 0;
        $scope.pageSize = 15;
        $scope.searchText = "";

        function dataVentaTerminado(data) {
            if (data === "" || data === undefined) {
                $scope.currentPage = 1;
                $scope.totalItems = 0;
                $scope.pageSize = 15;
                $scope.searchText = "";
                data = {page: $scope.currentPage, size: $scope.pageSize};
            }
            services.datosVentasInstaleTerminado(data).then(function (data) {
                $scope.dataVentasTerminado = data.data.data;

                $scope.activity = [];
                $scope.totalItems = data.data.totalCount;
                $scope.startItem = ($scope.currentPage - 1) * $scope.pageSize + 1;
                $scope.endItem = $scope.currentPage * $scope.pageSize;
                if ($scope.endItem > data.data.totalCount) {
                    $scope.endItem = data.data.totalCount;
                }
            });
        }

        $scope.pageChanged = function () {
            data = {page: $scope.currentPage, size: $scope.pageSize};
            dataVentaTerminado(data);
        };
        $scope.pageSizeChanged = function () {
            data = {page: $scope.currentPage, size: $scope.pageSize};
            $scope.currentPage = 1;
            dataVentaTerminado(data);
        };

        $scope.marcarEngestion = function (id) {
            let d = {id: id, login_gestion: $rootScope.galletainfo.LOGIN};
            services.marcarEnGestionVentaInstale(d).then(function (d) {
                if (d.data.state == 1) {
                    Swal({
                        type: "success",
                        title: "Bien",
                        text: d.data.msj,
                        timer: 4000,
                    }).then(() => {
                        data();
                    });
                } else {
                    Swal({
                        type: "info",
                        title: "Oops...",
                        text: data.data.msj,
                        timer: 4000,
                    })
                }
            });
        };

        $scope.recargaVentas = function () {
            init();
        };

        $scope.detalleVentaPedido = (pedido) => {
            if (pedido == "" || pedido == undefined) {
                Swal({
                    type: "error",
                    title: "Oops...",
                    text: "Debes ingresar un pedido",
                    timer: 4000,
                });
            } else {
                data = {pedido: pedido};
                services.detallePedidoVenta(data).then((data) => {
                    if (data.data.state == 1) {
                        $scope.detallePedidoVenta = data.data.data;
                        $("#detallePedidoVentaInstale").modal("show");
                    } else {
                        Swal({
                            type: "error",
                            title: "Oops...",
                            text: data.data.msj,
                            timer: 4000,
                        });
                    }
                });
            }
        };

        $scope.registrosVentaInstale = () => {
            if ($scope.ventaIstale.fechaini > $scope.ventaIstale.fechaFin) {
                Swal({
                    type: "error",
                    title: "Oops...",
                    text: "La fecha final no puede ser menor a la inicial",
                    timer: 4000,
                });
            } else if (
                $scope.ventaIstale.fechaini == "" ||
                $scope.ventaIstale.fechaini == undefined
            ) {
                Swal({
                    type: "error",
                    title: "Oops...",
                    text: "La fecha inicial es requerida",
                    timer: 4000,
                });
            } else {
                services.detalleVentaRagoFecha($scope.ventaIstale).then((data) => {
                    if (data.data.state == 1) {
                        $scope.detallePedidoVenta = data.data.data;
                        $("#detallePedidoVentaInstale").modal("show");
                    } else {
                        Swal({
                            type: "error",
                            title: "Oops...",
                            text: data.data.msj,
                            timer: 4000,
                        });
                    }
                });
            }
        };

        $scope.CopyPortaPapeles = function (data) {
            var copyTextTV = document.createElement("input");
            copyTextTV.value = data;
            document.body.appendChild(copyTextTV);
            copyTextTV.select();
            document.execCommand("copy");
            document.body.removeChild(copyTextTV);
            Swal({
                type: "info",
                title: "Aviso",
                text: "El texto seleccionado fue copiado",
                timer: 2000,
            });
        };

        $scope.csvVentaInstale = function () {
            console.log($scope.ventaIstale);
            var fechaini = new Date($scope.ventaIstale.fechaini);
            var fechafin = new Date($scope.ventaIstale.fechafin);
            var diffMs = fechafin - fechaini;
            var diffDays = Math.round(diffMs / 86400000);

            if ($scope.ventaIstale.fechaini > $scope.ventaIstale.fechaFin) {
                Swal({
                    type: "error",
                    title: "Oops...",
                    text: "La fecha final no puede ser menor a la inicial",
                    timer: 4000,
                });
            } else if (
                $scope.ventaIstale.fechaini == "" ||
                $scope.ventaIstale.fechaini == undefined
            ) {
                Swal({
                    type: "error",
                    title: "Oops...",
                    text: "La fecha inicial es requerida",
                    timer: 4000,
                });
            } else {
                services.csvVentaInstale($scope.ventaIstale)
                    .then((data) => {
                        if (data.data.state == 1) {
                            var wb = XLSX.utils.book_new();
                            var ws = XLSX.utils.json_to_sheet(data.data.data);
                            XLSX.utils.book_append_sheet(wb, ws, 'venta_instale');
                            XLSX.writeFile(wb, 'Venta_instale_' + tiempo + '.xlsx');
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
        };

        $scope.observacionParaVenta = () => {
            $("#observacionParaVentaModal").modal("show");
        };

        $scope.guardaObservacionVentaInstale = (data) => {
            if (data == undefined) {
                Swal({
                    type: "error",
                    title: "Oops...",
                    text: "Dedes ingresar la observacion",
                    timer: 4000,
                });
            } else {
                data = {observacion: data, usuario: $rootScope.galletainfo.LOGIN};
                services.guardaObservacionParaVentaInstale(data).then(function (data) {
                    if (data.data.state != 1) {
                        Swal({
                            type: "error",
                            title: "Oops...",
                            text: data.data.msj,
                            timer: 4000,
                        });
                    } else {
                        setTimeout(() => {
                            $("#observacionParaVentaModal").modal("hide");
                        }, 500);
                        Swal({
                            type: "success",
                            title: "Bien",
                            text: data.data.msj,
                            timer: 4000,
                        }).then(function () {
                            $route.reload();
                        });
                    }
                });
            }
        };

        $scope.verObservaciones = () => {
            services.observacionDetalleVentaModal().then(function (data) {
                if (data.data.state != 1) {
                    Swal({
                        type: "error",
                        title: "Oops...",
                        text: data.data.msj,
                        timer: 4000,
                    });
                } else {
                    $scope.datosVentaInstale = data.data.data;
                    $("#observacionDetalleVentaModal").modal("show");
                }
            });
        };

        $scope.EliminaObservacion = (data) => {
            services.eliminaObservacion(data).then(function (data) {
                if (data.data.state != 1) {
                    Swal({
                        type: "error",
                        title: "Oops...",
                        text: data.data.msj,
                        timer: 4000,
                    });
                } else {
                    setTimeout(() => {
                        $("#observacionDetalleVentaModal").modal("hide");
                    }, 500);

                    Swal({
                        type: "success",
                        title: "Bien",
                        text: data.data.msj,
                        timer: 3000,
                    }).then(function () {
                        $route.reload();
                    });
                }
            });
        };

        $scope.consolidadoZona = () => {
            services.consolidadoZona().then(function (data) {
                if (data.data.state == 1) {
                    $scope.apr = 0;
                    $scope.rech = 0;
                    $scope.pend = 0;
                    $scope.consolidadosZona = data.data.data;
                    angular.forEach($scope.consolidadosZona, function (value, key) {
                        if (value.aprobada) {
                            $scope.apr = parseInt($scope.apr) + parseInt(value.aprobada);
                        }
                        if (value.rechazada) {
                            $scope.rech = parseInt($scope.rech) + parseInt(value.rechazada);
                        }
                        if (value.pendiente) {
                            $scope.pend = parseInt($scope.pend) + parseInt(value.pendiente);
                        }
                    });
                    $("#consolidadoZona").modal("show");
                } else {
                    Swal({
                        type: "error",
                        title: "Oops...",
                        text: data.data.msj,
                        timer: 4000,
                    });
                }
            });
        };

        $scope.abreModal = function (data) {
            if (data.en_gestion != "1") {
                Swal({
                    type: "error",
                    title: "Oops...",
                    text: "Debes Marcar el pedido",
                    timer: 4000,
                });
            } else if (data.tipificacion == "" || data.tipificacion == undefined) {
                Swal({
                    type: "error",
                    title: "Oops...",
                    text: "Debes Seleccionar la tipificacion",
                    timer: 4000,
                });
            } else if (
                data.obs_tipificacion == "" ||
                data.obs_tipificacion == undefined
            ) {
                Swal({
                    type: "error",
                    title: "Oops...",
                    text: "Debes Seleccionar un detalle de la tipificacion",
                    timer: 4000,
                });
            } else if (data.tipificacion == "Ok" && data.obs_tipificacion != "Ok") {
                Swal({
                    type: "error",
                    title: "Oops...",
                    text: "Si la tipificacion es Ok el detalle debe ser Ok",
                    timer: 4000,
                });
            } else if (
                data.tipificacion == "Rechazada" &&
                data.obs_tipificacion == "Ok"
            ) {
                Swal({
                    type: "error",
                    title: "Oops...",
                    text: "Si la tipificacion es Rechazada el detalle no debe ser Ok",
                    timer: 4000,
                });
            } else {
                data = {
                    tipificacion: data.tipificacion,
                    obs_tipificacion: data.obs_tipificacion,
                    id: data.id,
                    login_gestion: $rootScope.galletainfo.LOGIN,
                };
                $("#modalVentaInstale").modal("show");

                $scope.guardaSolicitud = function (obs) {
                    if (obs == "" || obs == undefined) {
                        Swal({
                            type: "error",
                            title: "Oops...",
                            text: "Recuerda documentar observaciones",
                            timer: 4000,
                        });
                    } else {
                        data.observacion_seguimiento = obs.observacion_gestion;
                        services.guardaVentaInstale(data).then(function (data) {
                            if (data.data.state == 99) {
                                swal({
                                    type: "error",
                                    title: data.data.title,
                                    text: data.data.msg,
                                    timer: 4000,
                                }).then(function () {
                                    $cookies.remove("usuarioseguimiento");
                                    $location.path("/");
                                    $rootScope.galletainfo = undefined;
                                    $rootScope.permiso = false;
                                    $route.reload();
                                });
                            } else if (data.data.state == 1) {
                                setTimeout(() => {
                                    $("#modalVentaInstale").modal("hide");
                                }, 500);

                                Swal({
                                    type: "success",
                                    title: "Bien",
                                    text: data.data.msj,
                                    timer: 3000,
                                }).then(function () {
                                    $route.reload();
                                });
                            } else {
                                Swal({
                                    type: "error",
                                    title: "Oops...",
                                    text: data.data.msj,
                                    timer: 4000,
                                });
                            }
                        });
                    }
                };
            }
        };

    }
})();
