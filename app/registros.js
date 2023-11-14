(function () {
    "use strict";
    angular.module("seguimientopedidos").controller("registrosCtrl", registrosCtrl);
    registrosCtrl.$inject = ["$scope", "$rootScope", "services", "cargaRegistros", "$route", "$cookies", "$location"];

    function registrosCtrl($scope, $rootScope, services, cargaRegistros, $route, $cookies, $location) {
        $scope.listaRegistros = {};
        $scope.Registros = {};
        $scope.listadoAcciones = {};
        $scope.datosRegistros = {};
        $scope.verplantilla = false;

        $scope.currentPage = 1;
        $scope.totalItems = 0;
        $scope.pageSize = 15;
        $scope.searchText = "";

        if ($scope.Registros.fechaini === undefined || $scope.Registros.fechafin === undefined) {
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

        BuscarRegistros();

        $scope.pageChanged = function () {
            data = {page: $scope.currentPage, size: $scope.pageSize, param: $scope.Registros};
            BuscarRegistros(data);
        };
        $scope.pageSizeChanged = function () {
            data = {page: $scope.currentPage, size: $scope.pageSize, param: $scope.Registros};
            $scope.currentPage = 1;
            BuscarRegistros(data);
        };

        function BuscarRegistros(data) {
            if (data === "" || data === undefined) {
                $scope.currentPage = 1;
                $scope.totalItems = 0;
                $scope.pageSize = 15;
                $scope.searchText = "";
                data = {page: $scope.currentPage, size: $scope.pageSize, param: $scope.Registros};
            }
            services.myService(data, 'formaAsesoresCtrl.php', 'registros').then((data) => {
                if (data.data.state === 99) {
                    Swal({
                        type: "error",
                        title: data.data.title,
                        text: data.data.text,
                        timer: 4000,
                    }).then(function () {
                        $cookies.remove("usuarioseguimiento");
                        $location.path("/");
                        $rootScope.galletainfo = undefined;
                        $rootScope.permiso = false;
                        $route.reload();
                    });
                } else {
                    $scope.listaRegistros = data.data.data;
                    $scope.cantidad = data.data.length;
                    $scope.counter = data.data.counter;

                    $scope.totalItems = data.data.counter;
                    $scope.startItem = ($scope.currentPage - 1) * $scope.pageSize + 1;
                    $scope.endItem = $scope.currentPage * $scope.pageSize;
                    if ($scope.endItem > data.data.counter) {
                        $scope.endItem = data.data.counter;
                    }
                }
            }).catch((e) => {
                console.log(e)
            });
        }

        $scope.buscarRegistro = (param) => {

            if (Object.entries(param).length === 0) {
                Swal({
                    type: "info",
                    title: "Oops...",
                    text: "Seleccione los concepto de búsqueda",
                    timer: 4000,
                });
                return;
            }

            if (param.concepto) {
                if (!param.buscar) {
                    Swal({
                        type: "info",
                        title: "Oops...",
                        text: "Ingrese el concepto a consultar",
                        timer: 4000,
                    }).then(() => {
                        angular.element('#btnSearch').blur();
                        setTimeout(() => {
                            angular.element('#buscar').focus();
                        }, 100);
                    })
                    return;
                }
            }

            if (param.buscar) {
                if (!param.concepto) {
                    Swal({
                        type: "info",
                        title: "Oops...",
                        text: "Seleccione el concepto a consultar",
                        timer: 4000,
                    }).then(() => {
                        angular.element('#btnSearch').blur();
                        setTimeout(() => {
                            angular.element('#concepto').focus();
                            //$("#concepto").focus();
                        }, 100);
                    })
                    return;
                }
            }
            let data = {
                page: $scope.currentPage,
                size: $scope.pageSize,
                param
            }

            BuscarRegistros(data);
        };

        $scope.muestraNotas = function (datos) {
            $scope.pedido = datos.pedido;
            $scope.TituloModal = "Observaciones para el pedido:";
            $scope.observaciones = datos.observaciones;
            $("#NotasModal").modal('show');
        }

        $scope.calcularSubAcciones = function (proceso, accion) {
            $scope.listadoSubAcciones = {};
            $scope.validarsubaccion = false;

            services.getSubAcciones(proceso, accion).then(
                function (data) {
                    if (data.data.state === 0) {
                        $scope.validarsubaccion = false;
                    } else {
                        $scope.validarsubaccion = true;
                        $scope.listadoSubAcciones = data.data.data;
                    }
                },
                function errorCallback(response) {
                    console.log(response);
                }
            );
        };

        $scope.calcularAcciones = function (proceso) {
            if (proceso === "") {
                $scope.validaraccion = false;
                $scope.validarsubaccion = false;
            } else {
                services.myService(proceso, 'otrosServiciosDosCtrl.php', 'acciones').then((data) => {
                    if (data.data.state === 0) {
                        $scope.validaraccion = false;
                    } else {
                        $scope.validaraccion = true;
                        $scope.listadoAcciones = data.data.data;
                    }
                }).catch((e) => {
                    console.log(e)
                })
            }
        };

        $scope.editarRegistros = function (datos) {
            $scope.datosRegistros = datos;
            $scope.verplantilla = $scope.datosRegistros.plantilla !== "";
            $scope.TituloModal = "Editar pedido:";
            $scope.pedido = datos.pedido;
            $scope.calcularAcciones($scope.datosRegistros.proceso);
            $scope.calcularSubAcciones(
                $scope.datosRegistros.proceso,
                $scope.datosRegistros.accion
            );
            $("#Editardato").modal('show');
        };

        $scope.editRegistro = function (datos) {
            $scope.errorDatos = null;
            $scope.respuestaupdate = null;
            $scope.respuestadelete = null;

            services.myService(datos, 'userCtrl.php', 'editarRegistro').then((data) => {
                if (data.data.state !== 1) {
                    Swal({
                        type: 'error',
                        text: data.data.msj,
                        timer: 4000
                    })
                } else {
                    Swal({
                        type: 'success',
                        text: data.data.msj,
                        timer: 4000
                    })
                    data = {
                        page: $scope.currentPage,
                        size: $scope.pageSize
                    };
                    BuscarRegistros(data);
                }
            }).catch((e) => {
                console.log(e)
            });
        };

        $scope.csvRegistros = function () {
            $scope.csvPend = false;
            if ($scope.Registros.fechaini > $scope.Registros.fechafin) {
                Swal({
                    type: 'error',
                    text: 'La fecha inicial no puede ser mayor a la final',
                    timer: 4000
                })
                return;
            }

            let date_1 = new Date($scope.Registros.fechaini);
            let date_2 = new Date($scope.Registros.fechafin);
            let diff = date_2 - date_1;

            let TotalDays = Math.ceil(diff / (1000 * 3600 * 24));

            if (TotalDays > 6) {
                Swal({
                    type: 'error',
                    title: 'Opss...',
                    text: 'por motivos de optimización el rango de búsqueda debe ser de 7 dias',
                    timer: 4000
                })
                return;
            }

            services.myService($scope.Registros, 'otherServicesDosCtrl.php','csvRegistros')
                .then(function (data) {
                    if (data.data.state === 1) {
                        var wb = XLSX.utils.book_new();
                        var ws = XLSX.utils.json_to_sheet(data.data.data);
                        XLSX.utils.book_append_sheet(wb, ws, 'registros');
                        XLSX.writeFile(wb, 'registros_' + tiempo + '.xlsx'); // Descarga el a
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

        $scope.csvtecnico = function () {
            let date_1 = new Date($scope.Registros.fechaini);
            let date_2 = new Date($scope.Registros.fechafin);
            let diff = date_2 - date_1;

            let TotalDays = Math.ceil(diff / (1000 * 3600 * 24));
            if (TotalDays > 8) {
                swal({
                    type: "error",
                    text: "Para optimizacion de los reportes estos no pueden sobrepasar los 8 dias",
                });
            } else if ($scope.Registros.fechafin < $scope.Registros.fechafin) {
                Swal({
                    type: "error",
                    text: "La fecha final no puede ser menor que la inicial",
                });
            } else {
                services.myService($scope.Registros, 'otherServicesDosCtrl.php', 'Csvtecnico')
                    .then(function (data) {
                        if (data.data.state === 1) {
                            var wb = XLSX.utils.book_new();
                            var ws = XLSX.utils.json_to_sheet(data.data.data);
                            XLSX.utils.book_append_sheet(wb, ws, 'registros-equipos');
                            XLSX.writeFile(wb, 'registros-equipos_' + tiempo + '.xlsx'); // Descarga el a
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

        $scope.uploadFile = function (data) {
            $("#cargarRegistros").attr("disabled", true);
            if (!data) {
                Swal({
                    type: 'error',
                    text: 'Seleccione el archivo',
                    timer: 4000,
                })
                $("#cargarRegistros").attr("disabled", false);
                return;
            }

            $scope.carga_ok = true;
            var file = data;
            $scope.user = $rootScope.galletainfo.LOGIN;
            $scope.name = "";
            $scope.delete_ok = false;

            var uploadUrl = "api/class/subeArchivo.php";
            cargaRegistros.uploadFileToUrl(file, uploadUrl).then((data) => {
                if (data.data.state === 1) {
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
                        title: 'Ops...',
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
