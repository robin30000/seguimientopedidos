(function () {
    "use strict";
    angular.module("seguimientopedidos").controller("quejasGoCtrl", quejasGoCtrl);
    quejasGoCtrl.$inject = ["$scope", "$rootScope", "$timeout", "services", "$route", "$cookies", "$location", "$interval"];

    function quejasGoCtrl(
        $scope,
        $rootScope,
        $timeout,
        services,
        $route,
        $cookies, $location, $interval
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

        $scope.listaQuejasGo = {};
        $scope.Registros = {};
        $scope.quejasGoSel = {};
        var timer;
        var idqueja;

        $scope.validarDatos = function (datos) {
            if (datos.columnaBusqueda == undefined || datos.valorBusqueda == undefined) {
                datos.columnaBusqueda = "";
                datos.valorBusqueda = "";
            }

            if (datos.fechaini == undefined || datos.fechafin == undefined) {
                Swal({
                    type: "error",
                    title: "Oops...",
                    text: "Debe seleccionar un rango de fecha!",
                });
            } else {
                data = {
                    page: $scope.currentPage,
                    size: $scope.pageSize,
                    datos
                };
                LoadQuejasGo(data);
            }
        };

        LoadQuejasGo();

        function iniciarTiempo() {
            var segundos = 0;
            var minutos = 0;
            var horas = 0;
            //var tiempo = 0;

            $interval(function () {
                segundos++;
                if (segundos === 60) {
                    segundos = 0;
                    minutos++;
                }
                if (minutos === 60) {
                    minutos = 0;
                    horas++;
                }

                $scope.tiempo = pad(horas) + ":" + pad(minutos) + ":" + pad(segundos);
            }, 1000);
        };

        function pad(numero) {
            return numero < 10 ? "0" + numero : numero;
        }

        function LoadQuejasGo(data) {
            if (data === '' || data === undefined) {
                $scope.currentPage = 1;
                $scope.totalItems = 0;
                $scope.pageSize = 15;
                $scope.searchText = '';
                data = {'page': $scope.currentPage, 'size': $scope.pageSize, 'datos': $scope.Registros}
            }

            services.extraeQuejasGoDia(data).then((data) => {
                if (data.data.state == 99) {
                    swal({
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
                } else if (data.data.state == 1) {
                    $scope.listaQuejasGo = data.data.data;
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

            }).catch((e) => {
                console.log(e)
            });
        };

        $scope.pageChanged = function () {
            data = {'page': $scope.currentPage, 'size': $scope.pageSize, 'datos': $scope.Registros}
            LoadQuejasGo(data);
        }
        $scope.pageSizeChanged = function () {
            data = {'page': $scope.currentPage, 'size': $scope.pageSize, 'datos': $scope.Registros}
            $scope.currentPage = 1;
            LoadQuejasGo(data);
        }


        $scope.mostraModal = function () {
            iniciarTiempo();
            $scope.quejasGoSel.observacion = "";
            angular.copy();
            $("#modalQuejasGo").modal();
        };

        $scope.ciudadesQuejasGo = function () {
            services.getCiudadesQuejasGo().then(function (data) {
                if (data.data.state != 1) {
                    Swal({
                        type: 'error',
                        text: data.data.msj,
                        timer: 4000
                    })
                } else {
                    $scope.listadoCiudadesQGo = data.data.data;
                }
            });
        };

        $scope.BuscarTecnico = function () {
            var cedula = $scope.quejasGoSel.cedtecnico;

            if (cedula == undefined) {
                Swal({
                    type: "error",
                    title: "Oops...",
                    text: "Debe ingresar la cédula del técnico!",
                });

                return;
            }

            services.traerTecnico(cedula).then(
                function (data) {
                    if (data.data.state != 1) {
                        $scope.ciudadesQuejasGo();
                        $('#crearTecnicoQuejasGo').modal('show');
                        $scope.infoTecnico = false;
                    } else {
                        $scope.Tecnico = data.data.data;
                        $scope.quejasGoSel.tecnico = $scope.Tecnico[0].nombre;
                        $scope.quejasGoSel.region = $scope.Tecnico[0].ciudad;
                        $scope.infoTecnico = true;
                    }
                },
                function errorCallback(data) {
                    console.log(data);
                }
            );
        };

        $scope.crearTecQuejasGo = function (
            crearTecnicoquejasGoSel,
            frmCrearTecnicoQuejasGo
        ) {
            services.creaTecnicoQuejasGo(crearTecnicoquejasGoSel).then(
                function (data) {
                    if (data.data.state == 1) {
                        $("#crearTecnicoQuejasGo").modal("hide");
                        frmCrearTecnicoQuejasGo.autoValidateFormOptions.resetForm();
                        Swal({
                            type: 'success',
                            title: 'Bien',
                            text: data.data.msj,
                            timer: 4000
                        })
                    } else {
                        Swal({
                            type: 'success',
                            title: 'Bien',
                            text: 'data.data.msj',
                            timer: 4000
                        })
                    }
                },

                function errorCallback(response) {
                    console.log(response)
                }
            );
        };

        $scope.guardar = function (quejasGoSel, frmQuejasGo) {
            services
                .guardarQuejaGo(quejasGoSel, $scope.tiempo, $rootScope.galletainfo.login)
                .then(
                    function (respuesta) {
                        if (respuesta.data.state == 1) {
                            $("#modalQuejasGo").modal("hide");
                            Swal({
                                type: "success",
                                title: "Bien",
                                text: "Datos guardados correctamente",
                                timer: 4000
                            }).then(() => {
                                setTimeout(() => {
                                    $route.reload();
                                }, 500);

                            })

                        } else {
                            Swal({
                                type: "error",
                                title: "Oops...",
                                text: "No fue posible guardar la queja!",
                                timer: 4000
                            });
                        }
                    },
                    function errorCallback(response) {
                        console.log(response);
                    }
                );

        };

        $scope.csvQuejasGo = function () {
            $scope.csvPend = false;

            if (
                $scope.Registros.columnaBusqueda == undefined ||
                $scope.Registros.valorBusqueda == undefined
            ) {
                $scope.Registros.columnaBusqueda = "";
                $scope.Registros.valorBusqueda = "";
            }

            if (
                $scope.Registros.fechaini == undefined ||
                $scope.Registros.fechafin == undefined
            ) {
                $scope.Registros.fechaini = "";
                $scope.Registros.fechafin = "";
            }

            if ($scope.Registros.fechaini > $scope.Registros.fechafin) {
                Swal({
                    type: 'error',
                    text: 'La fecha inicial no puede ser mayor que la final',
                    timer: 4000
                })
            } else {
                services.expCsvQuejasGo($scope.Registros, $rootScope.galletainfo)
                    .then(function (data) {
                        if (data.data.state == 1) {
                            var wb = XLSX.utils.book_new();
                            var ws = XLSX.utils.json_to_sheet(data.data.data);
                            XLSX.utils.book_append_sheet(wb, ws, 'QuejasGo');
                            XLSX.writeFile(wb, 'QuejasGo_' + tiempo + '.xlsx');
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

        $scope.abrirModalModificarObs = function (id, observacion) {
            $scope.quejasGoSel.observacion = observacion;
            idqueja = id;
            angular.copy();
            $("#modObserQuejasGo").modal();
        };

        $scope.modificarObservacionQuejasGo = function (
            quejasGoSel,
            frmModObserQuejasGo,
            id
        ) {
            services.modiObserQuejasGo(quejasGoSel, idqueja).then(
                function (data) {
                    if (data.data.state == 99) {
                        swal({
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
                    } else if (data.data.state == 1) {
                        $("#modObserQuejasGo").modal("hide");
                        $scope.quejasGoSel = {};
                        Swal({
                            type: "success",
                            title: "Bien",
                            text: data.data.msj,
                            timer: 4000
                        }).then(() => {
                            setTimeout(() => {
                                $route.reload();
                            }, 500);
                        })
                    } else if (data.data.state == 0) {
                        Swal({
                            type: "error",
                            title: "Oops...",
                            text: data.data.msj,
                            timer: 4000
                        });
                    }

                },
                function errorCallback(response) {
                    console.log(response);
                }
            );
        };
    }

})();
