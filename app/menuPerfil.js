(function () {
    "use strict";
    angular.module("seguimientopedidos").controller("MenuPerfilCtrl", MenuPerfilCtrl);
    MenuPerfilCtrl.$inject = ["$scope", "$http", "services", "$route", "$uibModal", "$log"];
    function MenuPerfilCtrl($scope, $http, services, $route, $uibModal, $log) {
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
            getMenu();
            getSubmenu();
            getPerfil();
        }

        function getMenu() {
            services.getMenu()
                .then((data) => {
                    $scope.datosMenu = data.data.data;
                })
                .catch((error) => {
                    console.log(error);
                })
        }


        function getSubmenu() {
            services.getSubmenu()
                .then((data) => {
                    $scope.datosSubmenu = data.data.data;
                })
                .catch((error) => {
                    console.log(error);
                })
        }

        function getPerfil() {
            services.getPerfil()
                .then((data) => {
                    $scope.datosPerfil = data.data.data;
                })
                .catch((error) => {
                    console.log(error);
                })
        }

        $scope.showPerfilMenu = (perfil, nombre) => {
            services.verMenuPerfil(perfil)
                .then((data) => {
                    if (data.data.state == 1) {
                        $scope.nombre = nombre;
                        $scope.perfil_cambio = perfil;
                        $scope.datosDetalles = data.data.data;
                        $scope.estaEnDetalles = function (menu) {
                            for (var i = 0; i < $scope.datosDetalles.length; i++) {
                                if ($scope.datosDetalles[i].nombre == menu.nombre) {
                                    return true;
                                }
                            }
                            return false;
                        }
                        $("#modalDetalles").modal('show');
                    } else {
                        Swal({
                            type: 'error',
                            title: 'Oppsss..',
                            text: data.data.msj,
                            timer: 4000
                        })
                    }

                })
                .catch((error) => {
                    console.log(error);
                })
        }

        $scope.exportarPerfiles = () => {
            services.myService('', 'MenuPerfilCtrl.php', 'exportePerfil').then((data) => {
                if (data.data.state) {
                    var wb = XLSX.utils.book_new();
                    var ws = XLSX.utils.json_to_sheet(data.data.data);
                    XLSX.utils.book_append_sheet(wb, ws, 'Perfiles_seguimiento');
                    XLSX.writeFile(wb, 'Perfiles_' + tiempo + '.xlsx');
                } else {
                    Swal({
                        type: 'error',
                        title: 'Oppsss..',
                        text: data.data.msj,
                        timer: 4000
                    })
                }
            }).catch((e) => {
                console.log(e)
            })

        }

        $scope.cambioMenu = function (id, perfil, estado) {
            Swal({
                title: "Está seguro?",
                text: "Algunos datos pueden perderse.",
                type: "warning",
                showCancelButton: true,
                confirmButtonClass: "btn-danger",
                confirmButtonText: "Sí, estoy seguro",
                cancelButtonText: "Cancelar",
                allowOutsideClick: () => !Swal.isLoading(),
            }).then((result) => {
                if (result.value) {
                    let data = {id: id, perfil: perfil, estado: estado}
                    services.cambioMenu(data)
                        .then((data) => {
                            if (data.data.state == 1) {
                                Swal({
                                    type: 'success',
                                    title: 'Bien',
                                    text: data.data.msj,
                                    timer: 4000
                                }).then(function () {
                                    $("#modalDetalles").modal('hide');
                                    setTimeout(() => {
                                        $route.reload();
                                    }, 400);

                                })
                            } else {
                                Swal({
                                    type: 'error',
                                    title: 'Oppsss..',
                                    text: data.data.msj,
                                    timer: 4000
                                })
                            }
                        }).catch((error) => {
                            console.log(error);
                        })
                } else {
                    Swal("Cancelado", "Los datos están seguros :)", "error");
                    $("#modalDetalles").modal('hide');
                    setTimeout(() => {
                        $route.reload();
                    }, 400);
                }
            });
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.AgregarSubmenu = () => {
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'partial/modals/agregarSubmenu.html',
                controller: 'ModalInstanceCtrl',
                controllerAs: '$ctrl',
                size: 'md',
                resolve: {
                    items: function () {
                        return $scope.datosMenu;
                    }
                }
            });

            modalInstance.result.then(function () {
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }

        $scope.cambiaEstadoSubmenu = (id, estado) => {
            Swal({
                title: "Está seguro que quiere cambiar el estado de este menu?",
                text: "Algunos datos pueden perderse.",
                type: "warning",
                showCancelButton: true,
                confirmButtonClass: "btn-danger",
                confirmButtonText: "Sí, estoy seguro",
                cancelButtonText: "Cancelar",
                allowOutsideClick: () => !Swal.isLoading(),
            }).then((result) => {
                if (result.value) {
                    let data = {id: id, estado: estado}
                    services.cambiaEstadoSubmenu(data)
                        .then((data) => {
                            if (data.data.state == 1) {
                                Swal({
                                    type: 'success',
                                    title: 'Bien',
                                    text: data.data.msj,
                                    timer: 4000
                                }).then(function () {
                                    $("#modalDetalles").modal('hide');
                                    setTimeout(() => {
                                        $route.reload();
                                    }, 400);

                                })
                            } else {
                                Swal({
                                    type: 'error',
                                    title: 'Oppsss..',
                                    text: data.data.msj,
                                    timer: 4000
                                })
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                        })
                } else {
                    $("#modalDetalles").modal('hide');
                }
            });
        }

        $scope.AgregarPerfil = () => {
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'partial/modals/agregarPerfil.html',
                controller: 'ModalInstancePerfilCtrl',
                controllerAs: '$ctrl',
                size: 'md',

            });

            modalInstance.result.then(function () {
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }
    }

    angular.module("seguimientopedidos").controller("ModalInstanceCtrl", ModalInstanceCtrl);
    ModalInstanceCtrl.$inject = ["$uibModalInstance", "items", "services", "$route"];
    function ModalInstanceCtrl($uibModalInstance, items, services, $route) {
        var $ctrl = this;
        $ctrl.items = items;
        $ctrl.ok = function () {
            $uibModalInstance.close($ctrl.selected.item);
        };

        $ctrl.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $ctrl.guarda = (data) => {
            services.guardaNuevoSubmenu(data)
                .then((data) => {
                    if (data.data.state == 1) {
                        Swal({
                            type: 'success',
                            title: 'Bien',
                            text: data.data.msj,
                            timer: 4000
                        }).then(() => {
                            $uibModalInstance.dismiss('cancel');
                            setTimeout(() => {
                                $route.reload();
                            }, 400);
                        })
                    } else {
                        Swal({
                            type: 'error',
                            title: 'Opss...',
                            text: data.data.msj,
                            timer: 4000
                        })
                    }
                })
                .catch((data) => {
                    console.log(data);
                })
        }

        $ctrl.guardaPerfil = (data) => {
            services.guardaPerfil(data)
                .then((data) => {
                    if (data.data.state == 1) {
                        Swal({
                            type: 'success',
                            title: 'Bien',
                            text: data.data.msj,
                            timer: 4000
                        }).then(() => {
                            $uibModalInstance.dismiss('cancel');
                            setTimeout(() => {
                                $route.reload();
                            }, 400);
                        })
                    } else {
                        Swal({
                            type: 'error',
                            title: 'Opss...',
                            text: data.data.msj,
                            timer: 4000
                        })
                    }
                })
                .catch((data) => {
                    console.log(data);
                })
        }
    }

    angular.module("seguimientopedidos").controller("ModalInstancePerfilCtrl", ModalInstancePerfilCtrl);
    ModalInstancePerfilCtrl.$inject = ["$uibModalInstance", "services", "$route"];
    function ModalInstancePerfilCtrl($uibModalInstance, services, $route) {
        var $ctrl = this;
        $ctrl.nuevoPerfil = {};

        $ctrl.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $ctrl.guardaPerfil = (data) => {
            services.myService(data,'MenuPerfilCtrl.php','guardaPerfil').then((data) => {
                if (data.data.state) {
                    Swal({
                        type: 'success',
                        title: 'Bien',
                        text: data.data.msj,
                        timer: 4000
                    }).then(() => {
                        $uibModalInstance.dismiss('cancel');
                        setTimeout(() => {
                            $route.reload();
                        }, 400);
                    })
                } else {
                    Swal({
                        type: 'error',
                        title: 'Opss...',
                        text: data.data.msj,
                        timer: 4000
                    })
                }
            }).catch((e) => {
                console.log(e);
            })
        }
    }
})();
