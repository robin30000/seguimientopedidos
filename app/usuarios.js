(function () {
    "use strict";
    angular.module("seguimientopedidos").controller("usuariosCtrl", usuariosCtrl);
    usuariosCtrl.$inject = ["$scope", "$rootScope", "services", "$route"];

    function usuariosCtrl($scope, $rootScope, services, $route) {
        $scope.listaUsuarios = {};
        $scope.Usuarios = {};
        $scope.creaUser = {};
        $scope.datosEditar = {};
        $scope.datosDelete = {};

        $scope.currentPage = 1;
        $scope.totalItems = 0;
        $scope.pageSize = 15;
        $scope.searchText = "";
        $scope.con = {};
        listadoUsuarios();

        function listadoUsuarios(data) {
            if (!data) {
                $scope.currentPage = 1;
                $scope.totalItems = 0;
                $scope.pageSize = 15;
                $scope.searchText = "";
                data = {page: $scope.currentPage, size: $scope.pageSize};
            }
            services.listadoUsuarios(data).then(
                function (data) {
                    if (data.data.state) {
                        $scope.listaUsuarios = data.data.data;
                        $scope.cantidad = data.data.length;
                        $scope.counter = data.data.counter;

                        /*$scope.crearuser.NOMBRE = data.data.data[0].NOMBRE;
                        $scope.crearuser.PASSWORD = data.data.data[0].PASSWORD;
                        $scope.crearuser.IDENTIFICACION = data.data.data[0].IDENTIFICACION;
                        $scope.crearuser.PERFIL = data.data.data[0].perfil;*/

                        $scope.totalItems = data.data.counter;
                        $scope.startItem = ($scope.currentPage - 1) * $scope.pageSize + 1;
                        $scope.endItem = $scope.currentPage * $scope.pageSize;
                        if ($scope.endItem > data.data.counter) {
                            $scope.endItem = data.data.counter;
                        }
                    } else {
                        Swal({
                            type: 'error',
                            title: 'Opss..',
                            text: data.data.msj,
                            timer: 4000
                        })
                    }

                },
                function errorCallback(response) {
                    $scope.errorDatos = concepto + " " + usuario + " no existe.";
                }
            );
        }

        $scope.pageChanged = function () {
            let data = {page: $scope.currentPage, size: $scope.pageSize};
            listadoUsuarios(data);
        };
        $scope.pageSizeChanged = function () {
            console.log(data);
            let data = {page: $scope.currentPage, size: $scope.pageSize};
            $scope.currentPage = 1;
            listadoUsuarios(data);
        };

        $scope.buscarUsuario = (d) => {
            console.log(d)
            if (!d) {
                Swal({
                    type: 'error',
                    title: 'Opss..',
                    text: 'Ingrese los detalles de la busqueda',
                    timer: 4000
                })
                return;
            }

            if (!d.concepto) {
                Swal({
                    type: 'error',
                    title: 'Opss..',
                    text: 'Ingrese concepto de la busqueda',
                    timer: 4000
                })
                return;
            }
            if (!d.usuario) {
                Swal({
                    type: 'error',
                    title: 'Opss..',
                    text: 'Ingrese el login o la identificación del usuario',
                    timer: 4000
                })
                return;
            }

            listadoUsuarios(d);
        };

        $scope.editarUser = function (datos) {
            console.log(datos)
            $scope.datosEditar = datos;
            $scope.datosEditar.PASSWORDC = datos.PASSWORD;
            $scope.datosEditar.perfil = parseInt(datos.perfil);
            console.log($scope.datosEditar.perfil, ' kkkk')
        };

        $scope.editUserSave = (data) => {
            if (data.PASSWORDC != data.PASSWORD) {
                swal({
                    title: "Opps..",
                    text: "El campo Contraseña y Confirmar contraseña no son iguales.",
                    type: "error",
                    timer: 4000
                });
                return;
            }

            data.usuario_crea = $rootScope.login;
            services.myService(data, 'userCtrl.php', 'editarUsuario').then((data) => {
                if (data.data.state) {
                    $("#editarModal").modal("hide");
                    Swal({
                        type: 'success',
                        title: 'Bien',
                        text: data.data.msj,
                        timer: 4000
                    }).then(() => {
                        $route.reload();
                    })
                } else {
                    swal({
                        title: "Opps..",
                        text: data.data.msj,
                        type: "error",
                        timer: 4000
                    });
                }
            }).catch((e) => {
                console.log(e)
            })
        }

        $scope.deleteUser = function (data) {
            $scope.datosDelete.login = data.LOGIN;
            $scope.datosDelete.nombre = data.NOMBRE;
            $scope.datosDelete.perfil = data.PERFIL;
            $scope.datosDelete.identificacion = data.IDENTIFICACION;

        };

        $scope.deleteUserC = (data) => {
            console.log(data);
            swal({
                title: "Esta seguro?",
                text: "que desea eliminar este usuario?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Si, continuar",
            }).then((d) => {
                if (d) {
                    services.myService(data, 'userCtrl.php', 'borrarUsuario').then((data) => {
                        if (data.data.state) {
                            swal({
                                title: "Bien",
                                text: data.data.msj,
                                type: "success",
                                timer: 4000
                            }).then(() => {
                                $route.reload();
                            })
                        } else {
                            swal({
                                title: "Opps..",
                                text: data.data.msj,
                                type: "error",
                                timer: 4000
                            });
                        }
                    }).catch((e) => {
                        console.log(e)
                    })
                }
            })

        }

        $scope.creaUser = (data) => {
            console.log(data)
            if (!data.identificacion) {
                swal({
                    title: "Opps..",
                    text: "El campo Identificación es obligatorio.",
                    type: "error",
                    timer: 4000
                });
                return;
            }

            if (!data.login) {
                swal({
                    title: "Opps..",
                    text: "El campo Login es obligatorio.",
                    type: "error",
                    timer: 4000
                });
                return;
            }

            if (!data.nombre) {
                swal({
                    title: "Opps..",
                    text: "El campo Nombre es obligatorio.",
                    type: "error",
                    timer: 4000
                });
                return;
            }

            if (!data.password) {
                swal({
                    title: "Opps..",
                    text: "El campo Contraseña es obligatorio es obligatorio.",
                    type: "error",
                    timer: 4000
                });
                return;
            }

            if (!data.passwordc) {
                swal({
                    title: "Opps..",
                    text: "El campo Confirmar contraseña es obligatorio es obligatorio.",
                    type: "error",
                    timer: 4000
                });
                return;
            }

            if (data.passwordc !== data.password) {
                swal({
                    title: "Opps..",
                    text: "El campo Contraseña y Confirmar contraseña no son iguales.",
                    type: "error",
                    timer: 4000
                });
                return;
            }

            data.usuario_crea = $rootScope.login;
            services.myService(data, 'userCtrl.php', 'creaUsuario').then((data) => {
                if (data.data.state) {
                    $("#createUser").modal("hide");
                    Swal({
                        type: 'success',
                        title: 'Bien',
                        text: data.data.msj,
                        timer: 4000
                    }).then(() => {
                        $route.reload();
                    })
                } else {
                    swal({
                        title: "Opps..",
                        text: data.data.msj,
                        type: "error",
                        timer: 4000
                    });
                }
            }).catch((e) => {
                console.log(e);
            })
        }

    }

})()
