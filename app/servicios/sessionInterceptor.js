(function () {
    "use strict";

    angular.module("seguimientopedidos").factory("sessionInterceptor", sessionInterceptor);
    sessionInterceptor.$inject = ['$rootScope', '$q', 'services', '$cookies'];

    function sessionInterceptor($rootScope, $q, services, $cookies) {
        let sessionInterceptor = {
            request: function (config) {
                // Realiza la comprobación de sesión antes de enviar la solicitud
                return services.checkSession().then(function (data) {
                    if (!data.data.login) {
                        // Aquí puedes manejar la lógica en caso de que la sesión haya caducado
                        // Por ejemplo, redirigir al usuario a la página de inicio de sesión
                        // o realizar otras acciones necesarias
                        $cookies.remove("usuarioseguimiento");
                        $rootScope.galletainfo = undefined;
                        $rootScope.permiso = false;
                        // Puedes personalizar la lógica aquí según tus necesidades
                    }
                    return config;
                });
            }
        };

        return sessionInterceptor;
    }
})();
