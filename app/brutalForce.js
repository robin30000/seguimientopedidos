(function () {
    "use strict";
    angular.module("seguimientopedidos").controller("brutalForceCtrl", brutalForceCtrl);
    brutalForceCtrl.$inject = ["$scope", "$rootScope", "services"];

    function brutalForceCtrl($scope, $rootScope, services) {
        $scope.formularioBrutal = {};
        $scope.pedidoexiste = false;
        $scope.pedidoNoexiste = false;

        $scope.validaTrans = function () {
            if (
                $scope.formularioBrutal.tipoTrans === "Reconfigurar" &&
                $scope.formularioBrutal.accion === "Gestión AAA"
            ) {
                $scope.vernumSape = true;
            } else {
                $scope.vernumSape = false;
            }
        };

        $scope.buscarObservaciones = function () {
            services.Verobservacionasesor($scope.formularioBrutal.pedido).then(
                function (data) {
                    if (data.data.state !== 1) {
                        Swal({
                            type: 'error',
                            text: data.data.msj,
                            timer: 4000
                        })
                    } else {
                        $scope.observacion = data.data.data;
                        if ($scope.observacion.ObservacionAsesor === "") {
                            Swal({
                                type: 'info',
                                text: "El pedido se encuentra en gestión",
                                timer: 4000
                            })
                            return;
                        } else {
                            Swal({
                                type: 'info',
                                text: $scope.observacion.ObservacionAsesor,
                                timer: 4000
                            })
                            return;
                        }
                    }

                },
                function errorCallback(response) {
                    console.log(response);
                }
            );
        };

        $scope.ruta = "actividades";

        $scope.validarHorarioBF = function (pedido = "") {
            if (window.location.hash != "brutalForce") {
                return;
            }

            var tiempo = new Date();
            var hora = tiempo.getHours();
            var dia = tiempo.getDay();
            if (hora >= 7 && hora < 19) {
                if ($rootScope.galleta.perfil == 7) {
                    return;
                }
                services.contadorPendientesBrutalForce().then(
                    function (data) {
                        $scope.respuesta = data.data[0][0];
                        if (pedido != "") {
                            services.windowsBridge(`HCHV/Buscar/${pedido}`).then((data) => data.json()).then((response) => {
                                if (response) {
                                    if (
                                        response.taskType.indexOf("Cambio_Domicilio") !== -1 ||
                                        response.uNERutaTrabajo.indexOf("NUEVO CON TRASLADO") !== -1
                                    ) {
                                        swal({
                                            title: "El pedido corresponde a la categoría priorizada",
                                            type: "success",
                                            position: "top-end",
                                            showConfirmButton: false,
                                            timer: 3000,
                                        });
                                    } else {
                                        swal({
                                            title:
                                                "Tu pedido no corresponde a la categoría priorizada:",
                                            html: "<div>Solo se reciben solicitudes de traslado</div>",
                                            type: "warning",
                                        });
                                        window.location = "actividades";
                                    }
                                }
                            })
                                .catch((err) => {
                                    console.warn(err);
                                });
                        } else {
                            Swal.fire({
                                title:
                                    "Los tiempos de atención son altos, procede con el pendiente que corresponda:",
                                html: '<div><font size=4><div class="label-premisas" style="text-align: left; padding-top: 20px;">Si tienes un pedido prioritario por favor valida tu ingreso especial.</div></font></div>',
                                type: "warning",
                                customClass: "custom-sweet-alert",
                                input: "text",
                                inputPlaceholder: "Introduzca el pedido a comprobar",
                                showCancelButton: true,
                                confirmButtonText: "Comprobar",
                                cancelButtonText: "Cancelar",
                                showLoaderOnConfirm: true,
                                preConfirm: (pedido) => {
                                    services.windowsBridge(`HCHV/Buscar/${pedido}`).then((response) => {
                                        if (!response.ok) {
                                            throw new Error(response.statusText);
                                        }
                                        return response.json();
                                    })
                                        .catch((error) => {
                                            Swal.showValidationMessage(`Petición Fallida: ${error}`);
                                        });
                                },
                                allowOutsideClick: () => !Swal.isLoading(),
                            }).then((result) => {
                                if (result.value != undefined) {
                                    let tasktype =
                                        result.value.taskType == null ? "" : result.value.taskType;
                                    let unerutatrabajo =
                                        result.value.uNERutaTrabajo == null
                                            ? ""
                                            : result.value.uNERutaTrabajo;

                                    if (
                                        tasktype.indexOf("Cambio_Domicilio") !== -1 ||
                                        unerutatrabajo.indexOf("NUEVO CON TRASLADO") !== -1
                                    ) {
                                        swal({
                                            title: "El pedido corresponde a la categoría priorizada",
                                            type: "success",
                                            position: "top-end",
                                            showConfirmButton: false,
                                            timer: 3000,
                                        });
                                    } else {
                                        swal({
                                            title:
                                                "Tu pedido no corresponde a la categoría priorizada:",
                                            html: "<div>Solo se reciben solicitudes de traslado</div>",
                                            type: "warning",
                                        });
                                        window.location = "actividades";
                                    }
                                } else {
                                    window.location = "actividades";
                                }
                            });
                        }
                    },
                    function errorCallback(response) {
                        console.log(response);
                    }
                );
            } else {
                Swal(
                    "El ingreso de solicitudes solo esta disponible entre las 7 a.m. y las 7 p.m."
                );
                window.location = "actividades";
            }
        };

        $scope.GuardarGestion = async function () {
            let emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
            let celRegex = /^3[\d]{9}$/;
            let tiempo = new Date();
            let hora = tiempo.getHours();
            let dia = tiempo.getDay();

            let pedido = $scope.formularioBrutal.pedido;

            let filtersEx = [
                "1 - B2B",
                "B2B",
                "C2",
                "C3",
                "CORPORATE",
                "Corporativo",
                "CORPORATIVO GOBIERNO",
                "CORPORATIVO PRIVADO",
                "Pymes",
                "PYMES",
            ];
            var countFilterEx = null;

            try {
                var prioridadBFQuery = await services.windowsBridge(`HCHV/Buscar/${pedido}`);
                /* var prioridadBFQuery = await fetch(
                     `http://10.100.66.254:8080/HCHV/Buscar/${pedido}`
                 );*/
                var prioridadBF = await prioridadBFQuery.json();
                countFilterEx = filtersEx.indexOf(prioridadBF.uNEUENcalculada);
                if (countFilterEx != -1) {
                    $scope.formularioBrutal.prioridad = prioridadBF.uNEUENcalculada;
                } else if (
                    prioridadBF.uNERutaTrabajo == "PREMISAS" ||
                    prioridadBF.uNERutaTrabajo == "YAYA"
                ) {
                    $scope.formularioBrutal.prioridad = prioridadBF.uNERutaTrabajo;
                } else {
                    $scope.formularioBrutal.prioridad = "Otro Concepto";
                }
            } catch (error) {
                console.log(error);
                swal({
                    title: "Tu pedido esta presentando inconvenientes",
                    type: "warning",
                    showConfirmButton: false,
                    timer: 3000,
                });
                return;
            }

            if (hora >= 7 && hora < 19 && dia != 7) {
                if (emailRegex.test($scope.formularioBrutal.correo)) {
                    if (celRegex.test($scope.formularioBrutal.celular)) {
                        services
                            .getGuardargestiodespachoBrutal(
                                $scope.formularioBrutal,
                                $rootScope.galletainfo
                            )
                            .then(
                                function (data) {
                                    if (data.status == "200") {
                                        $scope.formularioBrutal = {};
                                        $scope.pedidoexiste = false;
                                        $scope.mensaje = "Gestión guardada correctamente";
                                        $scope.pedidoNoexiste = true;
                                    }
                                },
                                function errorCallback(response) {
                                    $scope.mensaje =
                                        "El pedido ya existe, no es posible guardar nueva gestión.";
                                    $scope.pedidoexiste = true;
                                    $scope.pedidoNoexiste = false;
                                }
                            );
                    } else {
                        Swal({
                            type: 'error',
                            title: 'Opsss...',
                            text: 'El Número celular del técnico debe ser formato de celular',
                            timer: 4000
                        })
                    }
                } else {
                    Swal({
                        type: 'error',
                        title: 'Opsss...',
                        text: 'El correo debe tener el formato de E-mail: correo@dominio.com',
                        timer: 4000
                    })
                }
            } else {
                Swal({
                    type: 'error',
                    title: 'Opsss...',
                    text: 'El ingreso de solicitudes solo esta disponible de lunes a sábado entre las 7 a.m. y las 7 p.m.',
                    timer: 4000
                })
            }
        };

        $scope.ObservacionesBF = function () {
            services.ObsPedidosBF($rootScope.galletainfo).then(
                function (data) {
                    $scope.haypedido = true;
                    $scope.datosBF = data.data[0];

                    return data.data;
                },
                function errorCallback(response) {
                    $scope.haypedido = false;
                    $scope.mensaje = "No tiene pedidos pendientes!!!";
                }
            );
        };

        $scope.ObservacionesBF();
    }
})();
