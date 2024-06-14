(function () {
    "use strict";
    angular.module("seguimientopedidos").controller("loginCtrl", loginCtrl);
    loginCtrl.$inject = ["$scope", "$rootScope", "$location", "$cookies", "services", "$uibModal", "$log"];

    function loginCtrl($scope, $rootScope, $location, $cookies, services, $uibModal, $log,) {
        $scope.login = () => {
            services.myService($scope.autenticacion, 'authenticationCtrl.php', 'login').then((data) => {
                if (data.data.state === 1) {
                    const today = new Date();
                    $rootScope.year = today.getFullYear();
                    $rootScope.nombre = data.data.data.nombre;
                    $rootScope.login = data.data.data.login;
                    $rootScope.perfil = data.data.data.perfil;
                    $rootScope.identificacion = data.data.data.identificacion;
                    $rootScope.menu = data.data.data.menu;
                    $rootScope.authenticated = true;
                    $rootScope.permiso = true;
                    $location.path("/actividades");
                    $cookies.put("usuarioseguimiento", JSON.stringify(data.data.data));
                    $rootScope.galletainfo = JSON.parse($cookies.get("usuarioseguimiento"));
                } else if (data.data.state === 2) {
                    Swal({
                        title: "Oops...",
                        text: data.data.msj,
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonClass: "btn-info",
                        confirmButtonText: "Aceptar",
                        cancelButtonText: "Olvidé mi contraseña",
                        cancelButtonClass: "btn-success",
                        allowOutsideClick: () => !Swal.isLoading(),
                    }).then((result) => {
                        if (result.dismiss === Swal.DismissReason.cancel) {
                            window.open("https://gestionatucuenta.tigoune.com/sigma/app/index?breakGlass=true#/forgot-password", "_blank");
                        }
                    });
                } else if (data.data.state === 3) {
                    Swal({
                        title: "Oops...",
                        text: data.data.msj,
                        type: "info",
                        showCancelButton: true,
                        confirmButtonClass: "btn-info",
                        confirmButtonText: "Aceptar",
                        cancelButtonText: "Solicitar Acceso",
                        cancelButtonClass: "btn-success",
                        allowOutsideClick: () => !Swal.isLoading(),
                    }).then((result) => {
                        if (result.dismiss === Swal.DismissReason.cancel) {
                            let modalInstance = $uibModal.open({
                                ariaLabelledBy: 'modal-title',
                                ariaDescribedBy: 'modal-body',
                                templateUrl: 'partial/modals/solicitaAcceso.html',
                                controller: 'solicitaAccesoCtrl',
                                controllerAs: '$ctrl',
                                size: 'lg',
                                resolve: {
                                    items: function () {
                                        return $scope.autenticacion.username;
                                    }
                                }
                            });

                            modalInstance.result.then(function () {
                            }, function () {
                                $log.info('Modal dismissed at: ' + new Date());
                            });
                        }
                    });
                } else if (data.data.state === 4) {
                    Swal({
                        type: 'error',
                        title: data.data.msj,
                        //text: data.data.msj,
                        timer: 9000
                    })
                }
            }).catch((e) => {
                console.log(e)
            })
        };

        $rootScope.logout = () => {
            services.myService($rootScope.identificacion, 'authenticationCtrl.php', 'logout').then((data) => {
                if (data.data.state) {
                    $cookies.remove("usuarioseguimiento");
                    $rootScope.galletainfo = '';
                    $rootScope.authenticated = false;
                    $rootScope.permiso = false;
                    $rootScope = '';
                    $location.path("/");

                }
            }).catch((e) => {
                console.log(e)
            })
        };

        $rootScope.SuperB = (d) => {
            if (!d) {
                Swal({
                    type: 'error',
                    title: 'Opps..',
                    text: 'Ingrese la tarea',
                    timer: 4000
                })
                return;
            }

            services.myService(d, 'authenticationCtrl.php', 'SuperB').then((data) => {
                if (data.data.state) {
                    $scope.d = data.data.data;
                    let modalInstance = $uibModal.open({
                        ariaLabelledBy: 'modal-title',
                        ariaDescribedBy: 'modal-body',
                        templateUrl: 'partial/modals/superB.html',
                        controller: 'ModalSuperBCtrl',
                        controllerAs: '$ctrl',
                        size: 'lg',
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
                } else {
                    Swal({
                        type: 'error',
                        title: 'Oppss..',
                        text: data.data.msj,
                        timer: 4000
                    })
                }
            }).catch((e) => {
                console.log(e)
            })
        }
    }

    angular.module("seguimientopedidos").controller("ModalSuperBCtrl", ModalSuperBCtrl);
    ModalSuperBCtrl.$inject = ["$uibModalInstance", "items", "services", "$route", "$scope", "$timeout"];

    function ModalSuperBCtrl($uibModalInstance, items, services, $route) {
        var $ctrl = this;
        $ctrl.items = items;

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
            $ctrl.items = {};
            $uibModalInstance.dismiss('cancel');
        };

    }

    angular.module("seguimientopedidos").controller("solicitaAccesoCtrl", solicitaAccesoCtrl);
    solicitaAccesoCtrl.$inject = ["$uibModalInstance", "items", "services", "$route", "$scope", "$timeout"];

    function solicitaAccesoCtrl($uibModalInstance, items, services, $route) {
        var $ctrl = this;
        $ctrl.usuario = {};
        $ctrl.usuario.usuario = items;
        $ctrl.loading = false;

        $ctrl.guardaSolicitud = (data) => {

            if (!data.usuario) {
                Swal({
                    type: 'error',
                    title: 'Opps..',
                    text: 'Debes ingresar el usuario',
                    timer: 4000
                })
                return;
            }

            if (!data.cc) {
                Swal({
                    type: 'error',
                    title: 'Opps..',
                    text: 'Debes ingresar la identificación',
                    timer: 4000
                })
                return;
            }

            if (!data.nombre) {
                Swal({
                    type: 'error',
                    title: 'Opps..',
                    text: 'Debes ingresar el nombre',
                    timer: 4000
                })
                return;
            }

            if (!data.email) {
                Swal({
                    type: 'error',
                    title: 'Opps..',
                    text: 'Debes ingresar el email',
                    timer: 4000
                })
                return;
            }

            if (!data.observacion) {
                Swal({
                    type: 'error',
                    title: 'Opps..',
                    text: 'Debes ingresar observaciones',
                    timer: 4000
                })
                return;
            }
            $ctrl.loading = true;
            services.myService(data, 'userCtrl.php', 'guardaSolicitud').then((data) => {
                $ctrl.loading = false;
                console.log(data)
                if (data.data.state) {
                    $uibModalInstance.dismiss('cancel');
                    Swal({
                        type: 'success',
                        title: 'Bien',
                        text: data.data.msg,
                        timer: 6000
                    }).then((e) => {
                        $route.reload();
                    })
                } else {
                    Swal({
                        type: 'error',
                        title: 'Oppss',
                        text: data.data.msg,
                        timer: 4000
                    })
                }

            }).catch((e) => {
                console.log(e)
            })
        }

        $ctrl.cancel = function () {
            $ctrl.items = {};
            $uibModalInstance.dismiss('cancel');
        };

    }
})();
