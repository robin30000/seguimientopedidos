(function () {
    "use strict";
    angular.module("seguimientopedidos").controller("loginCtrl", loginCtrl);
    loginCtrl.$inject = ["$scope", "$rootScope", "$location", "$cookies", "MainService"];

    function loginCtrl($scope, $rootScope, $location, $cookies, MainService) {
        $scope.login = function () {
            MainService.myService($scope.autenticacion, "login", "authenticationCtrl.php").then((data) =>{
                if (data.state != 1) {
                    Swal({
                        type: "error",
                        title: "Oops...",
                        text: data.data.msj,
                        timer: 4000,
                    });
                } else {
                    var today = new Date();
                    $rootScope.year = today.getFullYear();
                    $rootScope.nombre = data.data.nombre;
                    $rootScope.login = data.data.login;
                    $rootScope.perfil = data.data.perfil;
                    $rootScope.identificacion = data.data.identificacion;
                    $rootScope.menu = data.data.menu;
                    $rootScope.authenticated = true;
                    $rootScope.permiso = true;
                    $location.path("/actividades");
                    $cookies.put("usuarioseguimiento", JSON.stringify(data.data));

                    var galleta = JSON.parse($cookies.get("usuarioseguimiento"));
                    $rootScope.galletainfo = galleta;
                    $rootScope.permiso = true;
                }
            }).catch((e) => {
                console.log(e)
            })
        };
    }
})();
