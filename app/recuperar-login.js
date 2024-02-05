(function () {
    "use strict";
    angular.module("seguimientopedidos").controller("recuperarLoginCtrl", recuperarLoginCtrl);
    recuperarLoginCtrl.$inject = ["$scope", "services", "$routeParams", "$route"];

    function recuperarLoginCtrl($scope, services, $routeParams, $route) {

        let id = $routeParams.mail;
        $scope.data = {};
        $scope.loading = 0;
        let patron = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
        $scope.guardarForm = (data) => {
            $scope.loading = 1;

            if (!patron.test($scope.data.login)) {
                Swal({
                    type: 'error',
                    title: 'Bien',
                    text: 'La contraseña debe contener al menos 6 caracteres, una letra mayúscula y una letra minúscula.',
                    timer: 4000
                });
                return;
            }

            if (data.login !== data.confirmLogin) {
                Swal({
                    type: 'error',
                    title: 'Bien',
                    text: 'El campo contraseña y confirmar contraseña no son iguales',
                    timer: 4000
                });
                return;
            }

            data.id = id;
            services.myService(data, 'userCtrl.php', 'restauraPassword').then((res) => {
                $scope.loading = 0;
                if (res.data.state) {
                    Swal({
                        type: 'success',
                        title: 'Bien',
                        text: res.data.msg,
                        timer: 4000
                    }).then(() => {
                        $route.reload();
                    })
                } else {
                    Swal({
                        type: 'error',
                        title: 'Oppsss...',
                        text: res.data.msg,
                        timer: 4000
                    });
                }
            }).catch((e) => {
                console.log(e);
            });
        };

    }
})()
