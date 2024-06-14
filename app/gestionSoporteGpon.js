(function () {
    "use strict";
    angular.module("seguimientopedidos").controller("GestionsoportegponCtrl", GestionsoportegponCtrl);
    GestionsoportegponCtrl.$inject = ["$scope", "$rootScope", "services", "$route", "$sce", "$cookies", "$location", "$timeout"];

    function GestionsoportegponCtrl($scope, $rootScope, services, $route, $sce, $cookies, $location, $timeout) {
        $scope.isSoporteGponFromField = false;
        $scope.isSoporteGponFromIntranet = false;
        $scope.isLoadingData = true;
        $scope.dataSoporteGpon = [];

        init()

        function init() {
            datosGpon();
            datosEtb();
        }

        function datosGpon() {
            services
                .myService('', 'soporteGponCtrl.php', 'datosGpon')
                .then(function (data) {
                    if (data.data.state) {
                        $scope.dataGpon = data.data.data;
                        $scope.Items = data.data.counter;
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }

        function datosEtb() {
            services
                .myService('', 'soporteGponCtrl.php', 'datosEtb')
                .then(function (data) {
                    console.log(data.data.data)
                    if (data.data.state) {
                        $scope.dataEtb = data.data.data;
                        $scope.Items1 = data.data.counter;
                        $scope.tipificaciones = data.data.data[0].respuesta_tipificaciones
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }

        $scope.contadorGpon = () => {
            let counter = $scope.datacount;
            let x = [];
            let finalizado = $scope.finalizado;
            let devuelto = $scope.devuelto;
            let incompleto = $scope.incompleto;
            let sinrespuesta = $scope.sinrespuesta;
            let tabla = '<table class="table small table-bordered">' + '<tbody>' + '<tr class="success"><td>Finalizados</td><td>' + finalizado + '</td></tr>' + '<tr class="danger"><td>Devueltos al técnico</td><td>' + devuelto + '</td></tr>' + '<tr class="info"><td>Incompletos</td><td>' + incompleto + '</td></tr>' + '<tr class="warning"><td>Sin respuesta:</td><td>' + sinrespuesta + '</td></tr>' + '</tbody>' + '</table>';
            $scope.contadorGpon = $sce.trustAsHtml(tabla);
        }

        $scope.ver_masss = (data) => {
            $scope.dataContent = $sce.trustAsHtml('<div class="table-responsive" style="max-width: 380px;"><table class="table table-bordered table-hover table-condensed small" style="max-width: 350px;">' + '<tbody><tr><td style="min-width: 80px">Pedido</td><td>' + data.unepedido + '</td></tr>' + '<tr><td style="min-width: 80px">Categoría</td><td>' + data.tasktypecategory + '</td></tr>' + '<tr><td style="min-width: 80px">Area</td><td>' + data.area + '</td></tr>' + '<tr><td style="min-width: 80px">Region</td><td>' + data.region + '</td></tr>' + '<tr><td style="min-width: 80px">Municipio</td><td>' + data.unemunicipio + '</td></tr>' + '<tr><td style="min-width: 80px">Productos</td><td>' + data.uneproductos + '</td></tr>' + '<tr><td style="min-width: 80px">Datos cola</td><td>' + data.datoscola + '</td></tr>' + '<tr><td style="min-width: 80px">Mac</td><td>' + data.mac + '</td></tr>' + '<tr><td style="min-width: 80px">Serial</td><td>' + data.serial.replace(/,/g, '\n') + '</td></tr>' + '<tr><td style="min-width: 80px">Sistema</td><td>' + data.uneSourceSystem + '</td></tr>' + '<tr><td style="min-width: 80px">Tipo equipo</td><td>' + data.tipo_equipo.replace(/,/g, '\n') + '</td></tr>' + '<tr><td style="min-width: 80px">Velocidad navegación</td><td>' + data.velocidad_navegacion + '</td></tr>' + '<tr><td style="min-width: 80px">Observación</td><td>' + data.observacion_terreno + '</td></tr>' + '<tr><td style="min-width: 80px">Tecnologia</td><td>' + data.task_type + '</td></tr>' + '<tr><td style="min-width: 80px">Proveedor</td><td>' + data.proveedor + '</td></tr>' + '</tbody></table></div>');
        }

        $scope.marcarEngestionGpon = (data, n) => {
            services
                .marcarEngestionGpon(data, $rootScope.galletainfo)
                .then(function (data) {
                    console.log(data, ' ', n)
                    if (data.data.state === 99) {
                        swal({
                            type: "error", title: data.data.title, text: data.data.msg, timer: 4000,
                        }).then(function () {
                            $cookies.remove("usuarioseguimiento");
                            $location.path("/");
                            $rootScope.galletainfo = undefined;
                            $rootScope.permiso = false;
                            $route.reload();
                        });
                    } else if (data.data.state) {
                        swal({
                            title: "muy Bien", type: "success", text: data.data.msj, timer: 4000,
                        }).then(function () {
                            switch (n) {
                                case 1:
                                    datosGpon();
                                    break;
                                case 2:
                                    datosEtb();
                                    break;
                            }
                        })
                    } else if (data.data.state) {
                        swal({
                            title: "Ops...", type: "info", text: data.data.msj, timer: 4000,
                        })
                    }
                })
                .catch((err) => console.log(err));
        };

        $scope.gestionarSoporteGpon = (data, n) => {
            let tipificacion = $("#tipificacion" + data.id_soporte).val();
            let tipificaciones = $("#tipificaciones" + data.id_soporte).val();

            if (!data.login) {
                Swal({
                    title: "Error", text: "Debes marcar la tarea", type: "error",
                });
                return false;
            }

            if (tipificaciones === "") {
                Swal({
                    title: "Error", text: "Debes de seleccionar tipificaciónes.", type: "error",
                });
                return false;
            }

            if (tipificacion === "") {
                Swal({
                    title: "Error", text: "Debes de seleccionar una tipificación.", type: "error",
                });
                return false;
            }

            Swal.fire({
                title: "Gestión Soporte GPON", input: "textarea", inputPlaceholder: "Gestion...", inputAttributes: {
                    "aria-label": "Gestion",
                }, showCancelButton: true,
            }).then((result) => {
                if (result.value) {
                    let observacion = result.value;
                    if (observacion === "") {
                        Swal({
                            title: "Error", text: "Debes ingresar una observación.", type: "error",
                        });
                        return false;
                    }

                    let datos = {
                        id_soporte: data.id_soporte,
                        tipificacion: tipificacion,
                        tipificaciones: tipificaciones,
                        observacion: observacion,
                        login: data.login
                    }
                    services
                        .myService(datos, "soporteGponCtrl.php", "gestionarSoporteGpon")
                        .then(function (data) {
                            if (data.data.state) {
                                Swal({
                                    type: "success", title: "Muy bien", text: data.data.msg, timer: 4000,
                                }).then(function () {
                                    console.log(n)
                                    switch (n) {
                                        case 1:
                                            datosGpon();
                                            break;
                                        case 2:
                                            datosEtb();
                                            break;
                                    }
                                })
                            } else {
                                Swal({
                                    type: "info", title: "Ops...", text: data.data.msg, timer: 4000,
                                });
                            }
                        })
                        .catch((err) => {
                            console.log("err", err);
                        });
                } else {
                    console.log("Request cancelado por el usuario");
                }
            });
        };

        $scope.recargaGpon = () => {
            datosGpon()
        }

        $scope.recargaEtb = () => {
            datosEtb()
        }
    }
})();
