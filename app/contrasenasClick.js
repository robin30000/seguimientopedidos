(function () {
    "use strict";
    angular.module("seguimientopedidos").controller("contrasenasClickCtrl", contrasenasClickCtrl);
    contrasenasClickCtrl.$inject = ["$scope", "$rootScope", "$location", "services", "$route", "$cookies", "$uibModal", "$log"];

    function contrasenasClickCtrl($scope, $rootScope, $location, services, $route, $cookies, $uibModal, $log) {
        $scope.listaTecnicos = {};
        $scope.tecnico = null;
        $scope.concepto = null;
        $scope.crearTecnico = {};
        $scope.perfil = ''
        $scope.estado = 0;
        buscarTecnico();

        $scope.refleshPage = () => {
            $route.reload();
        }

        $scope.changePerfil = (p) => {
            let data = {
                page: $scope.currentPage,
                size: $scope.pageSize,
                buscar: $scope.concepto,
                variable: $scope.tecnico,
                perfil: p
            };
            $scope.currentPage = 1;
            buscarTecnico(data);
        }

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

        $scope.enviaForm = (t) => {
            console.log(t)
        }

        $scope.openModalTecnico = () => {
            let modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'partial/modals/crearTecnico.html',
                controller: 'creaTecnicoController',
                controllerAs: '$ctrl',
                size: 'lg',
            });

            modalInstance.result.then(function () {
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }

        $scope.pageChanged = function () {
            let data = {
                page: $scope.currentPage,
                size: $scope.pageSize,
                buscar: $scope.concepto,
                variable: $scope.tecnico,
                perfil: $scope.perfil
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

        $scope.editTecnico = (d) => {

            $scope.currentPage = 1;

            let modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'partial/modals/crearTecnico.html',
                controller: 'editTecnicoController',
                controllerAs: '$ctrl',
                size: 'lg',
                resolve: {
                    items: function () {
                        return d;
                    }
                }
            });

            modalInstance.result.then(function () {
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
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

    }

    angular.module("seguimientopedidos").controller("creaTecnicoController", creaTecnicoController);
    creaTecnicoController.$inject = ["$uibModalInstance", "services", "$route", "$scope", "$timeout", "$rootScope"];

    function creaTecnicoController($uibModalInstance, services, $route, $scope, $timeout, $rootScope) {
        $scope.botton = 'Guardar';
        $scope.perfilTecnico = [
            {
                value: "Supervisor",
                id: 'supervisor'
            },
            {
                value: "Técnico sin click",
                id: "tecnico_sin_click"
            }
        ]
        $scope.tecnicoGuarda = {}
        init();

        function init() {
            regiones();
            ciudades();
            empresas();
        }

        function empresas() {
            services.myService('', 'otrosServiciosCtrl.php', 'empresas').then((data) => {
                $scope.empresasT = data.data;
            }).catch((e) => {
                console.log(e)
            })
        }

        function regiones() {
            services.myService('', 'otrosServiciosCtrl.php', 'regiones').then((data) => {
                $scope.regionesT = data.data;
            }).catch((e) => {
                console.log(e)
            })
        }

        function ciudades() {
            services.myService('', 'otrosServiciosCtrl.php', 'ciudades').then((data) => {
                $scope.ciudadesT = data.data;
            }).catch((e) => {
                console.log(e)
            })
        }

        $scope.enviaForm = function (t) {

            if (!t) {
                Swal({
                    type: "info",
                    title: "Oops...",
                    text: "Ingresa los datos solicitados",
                    timer: 4000,
                });
                return;
            }

            if (!t.password) {
                Swal({
                    type: "info",
                    title: "Oops...",
                    text: "La contraseña es requerida",
                    timer: 4000,
                });
                return;
            }

            if (t.password.length < 6) {
                Swal({
                    type: "info",
                    title: "Oops...",
                    text: "La contraseña debe tener al menos 6 caracteres",
                    timer: 4000,
                });
                return;
            }

            if (!/[A-Z]/.test(t.password)) {
                Swal({
                    type: "info",
                    title: "Oops...",
                    text: "La contraseña debe contener al menos una mayúscula",
                    timer: 4000,
                });
                return;
            }

            if (!/[a-z]/.test(t.password)) {
                Swal({
                    type: "info",
                    title: "Oops...",
                    text: "La contraseña debe contener al menos una minúscula",
                    timer: 4000,
                });
                return;
            }

            if (!/\d/.test(t.password)) {
                Swal({
                    type: "info",
                    title: "Oops...",
                    text: "La contraseña debe contener al menos un número",
                    timer: 4000,
                });
                return;
            }

            if (t.password !== t.passwordc) {
                Swal({
                    type: "info",
                    title: "Oops...",
                    text: "El campo contraseña y confirmar contraseña no son iguales",
                    timer: 4000,
                });
                return;
            }

            t.usuario_crea = $rootScope.login
            services.myService(t, 'otrosServiciosCtrl.php', 'guardaTecnico').then((data) => {
                if (data.data.state) {
                    $uibModalInstance.dismiss('cancel');
                    swal({
                        type: "success",
                        title: "Muy bien",
                        text: data.data.msj,
                        timer: 5000,
                    }).then(function () {
                        $route.reload();
                    });
                } else {
                    swal({
                        type: "error",
                        title: "Oppss...",
                        text: data.data.msj,
                        timer: 5000,
                    })
                }
            }).catch((e) => {
                console.log(e)
            })

        }

        $scope.cancel = function () {
            $scope.tecnicoGuarda = {};
            $uibModalInstance.dismiss('cancel');
        };
    }

    angular.module("seguimientopedidos").controller("editTecnicoController", editTecnicoController);
    editTecnicoController.$inject = ["$uibModalInstance", "services", "$route", "$scope", "$timeout", "$rootScope", "items"];

    function editTecnicoController($uibModalInstance, services, $route, $scope, $timeout, $rootScope, items) {
        $scope.estadoA = 1;
        $scope.botton = 'Actualizar';
        $scope.perfilTecnico = [
            {
                value: "Supervisor",
                id: 'supervisor'
            },
            {
                value: "Técnico sin click",
                id: "tecnico_sin_click"
            },
            {
                value: "Técnico",
                id: "tecnico"
            }
        ]
        $scope.estado = [
            {
                value: "Activo",
                id: 'Activo'
            },
            {
                value: "Inactivo",
                id: "Inactivo"
            }
        ]
        $scope.tecnicoGuarda = {}
        init();

        function init() {
            regiones();
            empresas();
        }

        function regiones() {
            services.myService('', 'otrosServiciosCtrl.php', 'regiones').then((data) => {
                $scope.regionesT = data.data;
            }).catch((e) => {
                console.log(e)
            })
        }

        function empresas() {
            services.myService('', 'otrosServiciosCtrl.php', 'empresas').then((data) => {
                $scope.empresasT = data.data;
            }).catch((e) => {
                console.log(e)
            })
        }

        $scope.tecnicoGuarda.nombre = items.NOMBRE;
        $scope.tecnicoGuarda.identificacion = items.IDENTIFICACION;
        $scope.tecnicoGuarda.celular = items.CELULAR;
        $scope.tecnicoGuarda.empresa = items.NOM_EMPRESA;
        $scope.tecnicoGuarda.empresa = items.empresa;
        $scope.tecnicoGuarda.region = items.CIUDAD;
        $scope.tecnicoGuarda.login = items.login_Click;
        $scope.tecnicoGuarda.password = items.pass_apk;
        $scope.tecnicoGuarda.passwordc = items.pass_apk;
        $scope.tecnicoGuarda.psw_click = items.pass_clic;
        $scope.tecnicoGuarda.estado = items.estado;
        $scope.tecnicoGuarda.perfil = items.perfil;
        $scope.enviaForm = function (t) {

            if (!t) {
                Swal({
                    type: "info",
                    title: "Oops...",
                    text: "Ingresa los datos solicitados",
                    timer: 4000,
                });
                return;
            }

            if (!t.password) {
                Swal({
                    type: "info",
                    title: "Oops...",
                    text: "La contraseña es requerida",
                    timer: 4000,
                });
                return;
            }

            if (t.password.length < 6) {
                Swal({
                    type: "info",
                    title: "Oops...",
                    text: "La contraseña debe tener al menos 6 caracteres",
                    timer: 4000,
                });
                return;
            }

            if (!/[A-Z]/.test(t.password)) {
                Swal({
                    type: "info",
                    title: "Oops...",
                    text: "La contraseña debe contener al menos una mayúscula",
                    timer: 4000,
                });
                return;
            }

            if (!/[a-z]/.test(t.password)) {
                Swal({
                    type: "info",
                    title: "Oops...",
                    text: "La contraseña debe contener al menos una minúscula",
                    timer: 4000,
                });
                return;
            }

            if (!/\d/.test(t.password)) {
                Swal({
                    type: "info",
                    title: "Oops...",
                    text: "La contraseña debe contener al menos un número",
                    timer: 4000,
                });
                return;
            }

            if (t.password !== t.passwordc) {
                Swal({
                    type: "info",
                    title: "Oops...",
                    text: "El campo contraseña y confirmar contraseña no son iguales",
                    timer: 4000,
                });
                return;
            }

            t.usuario_crea = $rootScope.login
            services.myService(t, 'otrosServiciosCtrl.php', 'actualizaTecnico').then((data) => {
                if (data.data.state) {
                    $uibModalInstance.dismiss('cancel');
                    swal({
                        type: "success",
                        title: "Muy bien",
                        text: data.data.msj,
                        timer: 6000,
                    }).then(function () {
                        $route.reload();
                    });
                } else {
                    swal({
                        type: "error",
                        title: "Oppss...",
                        text: data.data.msj,
                        timer: 6000,
                    })
                }
            }).catch((e) => {
                console.log(e)
            })

        }

        $scope.cancel = function () {
            $scope.tecnicoGuarda = {};
            $uibModalInstance.dismiss('cancel');
        };
    }

})();
