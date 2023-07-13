(function () {
    "use strict";
    angular.module("seguimientopedidos").controller("usuariosCtrl", usuariosCtrl);
    usuariosCtrl.$inject = ["$scope", "$rootScope", "services"];
    function usuariosCtrl($scope, $rootScope, services) {
        $scope.listaUsuarios = {};
        $scope.Usuarios = {};
        $scope.crearuser = {};

        $scope.currentPage = 1;
        $scope.totalItems = 0;
        $scope.pageSize = 15;
        $scope.searchText = "";

        listadoUsuarios();

        function listadoUsuarios(data) {
            if (data === "" || data === undefined) {
                $scope.currentPage = 1;
                $scope.totalItems = 0;
                $scope.pageSize = 15;
                $scope.searchText = "";
                data = {page: $scope.currentPage, size: $scope.pageSize};
            }
            services.listadoUsuarios(data).then(
                function (data) {
                    $scope.listaUsuarios = data.data.data;
                    $scope.cantidad = data.data.data.length;
                    $scope.counter = data.data.counter;

                    $scope.totalItems = data.data.counter;
                    $scope.startItem = ($scope.currentPage - 1) * $scope.pageSize + 1;
                    $scope.endItem = $scope.currentPage * $scope.pageSize;
                    if ($scope.endItem > data.data.counter) {
                        $scope.endItem = data.data.counter;
                    }
                },
                function errorCallback(response) {
                    $scope.errorDatos = concepto + " " + usuario + " no existe.";
                }
            );
        }

        $scope.pageChanged = function () {
            data = {page: $scope.currentPage, size: $scope.pageSize};
            listadoUsuarios(data);
        };
        $scope.pageSizeChanged = function () {
            console.log(data);
            data = {page: $scope.currentPage, size: $scope.pageSize};
            $scope.currentPage = 1;
            listadoUsuarios(data);
        };

        $scope.buscarUsuario = function (concepto, usuario) {
            data = {concepto: concepto, usuario: usuario};
            listadoUsuarios(data);
        };

        $scope.editarModal = function (datos) {
            $rootScope.datos = datos;
            $scope.idUsuario = datos.ID;
            $scope.UsuarioNom = datos.NOMBRE;
            $rootScope.TituloModal = "Editar Usuario con el ID:";
        };

        $scope.createUser = function (concepto, tecnico) {
            $scope.errorDatos = null;
            $scope.respuestaupdate = null;
            $scope.respuestadelete = null;
            services.creaUsuario($scope.crearuser).then(
                function (data) {
                    $scope.respuestaupdate = "Usuario creado.";
                    return data.data;
                },
                function errorCallback(response) {
                    $scope.errorDatos = "Usuario no fue creado.";
                }
            );
        };

        $scope.editUser = function (datos) {
            $scope.errorDatos = null;
            $scope.respuestaupdate = null;
            $scope.respuestadelete = null;
            if (datos.PASSWORD == "") {
                Swal({
                    type: 'error',
                    title: 'Opsss...',
                    text: 'Por favor ingrese la contraseña.',
                    timer: 4000
                })
            } else {
                services.editarUsuario(datos).then(
                    function (data) {
                        $scope.respuestaupdate =
                            "Usuario " + datos.LOGIN + " actualizado exitosamente";
                        return data.data;
                    },
                    function errorCallback(response) {
                    }
                );
            }
        };

        $scope.borrarUsuario = function (id) {
            $scope.idBorrar = id;
            $scope.Usuarios = {};
            $scope.errorDatos = null;
            $scope.respuestaupdate = null;
            $scope.respuestadelete = null;
            swal({
                title: "Aviso",
                text: "Esta función ha sido deshabilitada, para eliminar usuarios de la plataforma debe comunicarse con desarrollo.",
                type: "error",
                confirmButtonClass: "btn-danger",
                confirmButtonText: "Aceptar",
                closeOnConfirm: false,
            });
        };
    }
})()
