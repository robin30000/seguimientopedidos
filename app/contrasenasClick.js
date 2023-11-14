(function () {
        "use strict";
        angular.module("seguimientopedidos").controller("contrasenasClickCtrl", contrasenasClickCtrl);
        contrasenasClickCtrl.$inject = ["$scope", "$rootScope", "$location", "services", "$route", "$cookies"];

        function contrasenasClickCtrl($scope, $rootScope, $location, services, $route, $cookies) {
            $scope.listaTecnicos = {};
            $scope.tecnico = null;
            $scope.concepto = null;
            $scope.crearTecnico = {};
            buscarTecnico();

            $scope.tecnicos = () => {
                $scope.loading = 1;
                services.windowsBridge("HCHV_DEV/tecnicos/s").then((data) => {
                    services.acualizaTecnicos(data).then((data) => {
                        if (data.data.state === 1) {
                            Swal({
                                type: "success",
                                title: 'Bien',
                                text: data.data.msj,
                                timer: 4000,
                            }).then(function () {
                                $route.reload();
                            });
                        } else {
                            Swal({
                                type: "info",
                                title: 'Ops..',
                                text: data.data.msj,
                                timer: 4000,
                            }).then(function () {
                                $route.reload();
                            });
                        }

                    }).catch((e) => {
                        console.log(e)
                    });
                }).catch((e) => {
                    console.log(e)
                })
            };

            $scope.pageChanged = function () {
                let data = {
                    page: $scope.currentPage,
                    size: $scope.pageSize,
                    buscar: $scope.concepto,
                    variable: $scope.tecnico
                };
                buscarTecnico(data);
            };
            $scope.pageSizeChanged = function () {
                let data = {
                    page: $scope.currentPage,
                    size: $scope.pageSize,
                    buscar: $scope.concepto,
                    variable: $scope.tecnico
                };
                $scope.currentPage = 1;
                buscarTecnico(data);
            };

            function buscarTecnico(data) {
                if (data === "" || data === undefined) {
                    $scope.currentPage = 1;
                    $scope.totalItems = 0;
                    $scope.pageSize = 15;
                    $scope.searchText = "";
                    data = {
                        page: $scope.currentPage,
                        size: $scope.pageSize,
                        buscar: $scope.concepto,
                        variable: $scope.tecnico
                    };
                }
                services.listadoTecnicos(data).then((data) => {
                    if (data.data.state === 99) {
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
                    } else {
                        $scope.listaTecnicos = data.data.data;
                        $scope.cantidad = data.data.data.length;
                        $scope.counter = data.data.counter;

                        $scope.totalItems = data.data.counter;
                        $scope.startItem = ($scope.currentPage - 1) * $scope.pageSize + 1;
                        $scope.endItem = $scope.currentPage * $scope.pageSize;
                        if ($scope.endItem > data.data.counter) {
                            $scope.endItem = data.data.counter;
                        }
                    }

                }).catch((response) => {
                    console.log(response);
                })
            }

            $scope.buscarTec = function (param, dato) {
                if (param === undefined) {
                    Swal({
                        type: "info",
                        title: "Oops...",
                        text: "seleccione parametro a buscar",
                        timer: 4000,
                    });
                } else if (dato === undefined) {
                    Swal({
                        type: "info",
                        title: "Oops...",
                        text: "Ingrese el valor a buscar",
                        timer: 4000,
                    });
                } else {
                    let data = {
                        page: $scope.currentPage,
                        size: $scope.pageSize,
                        buscar: param,
                        variable: dato
                    };
                    buscarTecnico(data);
                }
            };

            $scope.createTecnico = function () {
                var id_tecnico = "";
                $scope.errorDatos = null;
                $scope.respuestaupdate = null;
                $scope.respuestadelete = null;
                services.creaTecnico($scope.crearTecnico, id_tecnico).then((data) => {
                    $scope.respuestaupdate = "Técnico creado.";
                    return data.data;
                }).catch((e) => {
                    console.log(e)
                });
            };

            $scope.editarModal = function (datos) {
                $rootScope.datos = datos;
                $scope.idTecnico = datos.ID;
                $scope.TecnicoNom = datos.NOMBRE;
                $scope.UsuarioLog = datos.LOGIN;
                $rootScope.TituloModal = "Editar Técnico con el ID:";
            };

            $scope.edittecnico = (datos) => {
                $scope.errorDatos = null;
                $scope.respuestaupdate = null;
                $scope.respuestadelete = null;
                services.editarTecnico(datos).then((data) => {
                    $scope.respuestaupdate = "Técnico " + datos.NOMBRE + " actualizado exitosamente";

                }).catch((e) => {
                    console.log(e)
                });
            };

            $scope.borrarTecnico = (id) => {
                $scope.idBorrar = id;
                $scope.Tecnico = {};
                $scope.errorDatos = null;
                $scope.respuestaupdate = null;
                $scope.respuestadelete = null;
                services.deleteTecnico($scope.idBorrar).then((data) => {
                    $scope.respuestadelete =
                        "Técnico " + $rootScope.datos.NOMBRE + " eliminado exitosamente";
                }).catch((e) => {
                    console.log(e)
                })

            };
        }
    }
)();
