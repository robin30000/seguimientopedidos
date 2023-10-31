(function () {
    "use strict";
    angular.module("seguimientopedidos").controller("loginCtrl", loginCtrl);
    loginCtrl.$inject = ["$scope", "$rootScope", "$location", "$cookies", "services", "$uibModal", "$log"];

    function loginCtrl($scope, $rootScope, $location, $cookies, services, $uibModal, $log) {
        $scope.login = function () {
            services.loginUser($scope.autenticacion).then(complete).catch(failed);

            function complete(data) {
                if (data.data.state != 1) {
                    Swal({
                        type: "error",
                        title: "Oops...",
                        text: data.data.msj,
                        timer: 4000,
                    });
                } else {
                    var today = new Date();
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

                    //console.log($cookies.get("usuarioseguimiento"));

                    var galleta = JSON.parse($cookies.get("usuarioseguimiento"));
                    //var galleta = $cookies.get("usuarioseguimiento");
                    $rootScope.galletainfo = galleta;
                    $rootScope.permiso = true;
                }
            }

            function failed(response) {
                console.log(response);
            }
        };

        $rootScope.SuperB = (d) => {
            if (!d){
                Swal({
                    type:'error',
                    title: 'Opps..',
                    text: 'Ingrese la tarea',
                    timer:4000
                })
                return;
            }

            services.myService(d,'authenticationCtrl.php', 'SuperB').then((data) => {
                if (data.data.state){
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
                }else{
                    Swal({
                        type:'error',
                        title:'Oppss..',
                        text:data.data.msj,
                        timer:4000
                    })
                }
            }).catch((e) => {
                console.log(e)
            })
        }
    }

    angular.module("seguimientopedidos").controller("ModalSuperBCtrl", ModalSuperBCtrl);
    ModalSuperBCtrl.$inject = ["$uibModalInstance", "items", "services", "$route", "$scope", "$timeout"];

    function ModalSuperBCtrl($uibModalInstance, items, services, $route, $scope, $timeout) {
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
})();
