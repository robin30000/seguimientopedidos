(function () {
    "use strict";
    angular.module("seguimientopedidos").controller("loginCtrl", loginCtrl);
    loginCtrl.$inject = ["$scope", "$rootScope", "$location", "$cookies", "services", "$uibModal", "$log", "jwtHelper"];

    function loginCtrl($scope, $rootScope, $location, $cookies, services, $uibModal, $log, jwtHelper) {
        $scope.login = () => {
            services.myService($scope.autenticacion, 'authenticationCtrl.php', 'login').then((data) => {
                if (data.data.state) {
                    let token = data.data.jwt;
                    localStorage.setItem('jwtToken', token);
                    let decodedToken = jwtHelper.decodeToken(token);
                    $rootScope.login = decodedToken.data.login;
                    $rootScope.perfil = decodedToken.data.perfil;
                    $rootScope.identificacion = decodedToken.data.identificacion;
                    $rootScope.menu = decodedToken.data.menu;
                    $rootScope.authenticated = true;
                    $rootScope.permiso = true;
                    const today = new Date();
                    $rootScope.year = today.getFullYear();
                    $location.path("/actividades");

                    /*$rootScope.login = data.data.data.login;
                    $rootScope.perfil = data.data.data.perfil;
                    $rootScope.identificacion = data.data.data.identificacion;
                    $rootScope.menu = data.data.data.menu;
                    $rootScope.authenticated = true;
                    $rootScope.permiso = true;
                    $location.path("/actividades");
                    $cookies.put("usuarioseguimiento", JSON.stringify(data.data.data));

                    $rootScope.galletainfo = JSON.parse($cookies.get("usuarioseguimiento"));*/

                } else {
                    Swal({
                        title: "Oops...",
                        text: "Usuario y/o contraseña no validos",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonClass: "btn-danger",
                        confirmButtonText: "Ha olvidado su contraseña?",
                        cancelButtonText: "Cancelar",
                        allowOutsideClick: () => !Swal.isLoading(),
                    }).then((result) => {
                        if (result.value) {
                            let modalInstance = $uibModal.open({
                                ariaLabelledBy: 'modal-title',
                                ariaDescribedBy: 'modal-body',
                                templateUrl: 'partial/modals/olvidaPassword.html',
                                controller: 'forgetPasswordController',
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
                    });
                }
            }).catch((e) => {
                console.log(e)
            })
        };

        $rootScope.logout = () => {
            services.myService($rootScope.identificacion, 'authenticationCtrl.php', 'logout').then((data) => {
                $cookies.remove("usuarioseguimiento");
                $location.path("/");
                $rootScope.galletainfo = undefined;
                $rootScope.permiso = false;
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

    angular.module("seguimientopedidos").controller("forgetPasswordController", forgetPasswordController);
    forgetPasswordController.$inject = ["$uibModalInstance", "items", "services", "$route", "$scope", "$timeout", "REST", "vcRecaptchaService"];

    function forgetPasswordController($uibModalInstance, items, services, $route, $scope, $timeout, REST, vcRecaptchaService) {
        var $ctrl = this;
        $ctrl.response = null;
        $ctrl.widgetId = null;
        $scope.loading = 0;
        $ctrl.model = {key: REST.KEY};
        $ctrl.setResponse = function (response) {
            $ctrl.response = response
        };
        $ctrl.setWidgetId = function (widgetId) {
            $ctrl.widgetId = widgetId
        };
        $ctrl.cbExpiration = function () {
            vcRecaptchaService.reload(vm.widgetId);
            $ctrl.response = null
        };

        $ctrl.submit = function () {
            $scope.loading = 1;
            let captcha = vcRecaptchaService.getResponse();
            let data = {captcha: captcha, email: $ctrl.email}
            services.myService(data, 'userCtrl.php', 'recuperaPassword').then((res) => {
                $scope.loading = 0;
                if (res.data.state) {
                    $uibModalInstance.dismiss('cancel');
                    Swal({
                        type: 'success',
                        title: 'Bien',
                        text: res.data.msg,
                        timer: 5000
                    }).then(() => {
                        $route.reload();
                    })
                } else {
                    Swal({
                        type: 'error',
                        title: 'Oppss',
                        text: res.data.msg,
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
