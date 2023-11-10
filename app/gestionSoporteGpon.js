(function () {
    "use strict";
    angular.module("seguimientopedidos").controller("GestionsoportegponCtrl", GestionsoportegponCtrl);
    GestionsoportegponCtrl.$inject = ["$scope", "$rootScope", "services", "$route", "$sce", "$cookies", "$location"];

    function GestionsoportegponCtrl($scope, $rootScope, services, $route, $sce, $cookies, $location) {
        $scope.isSoporteGponFromField = false;
        $scope.isSoporteGponFromIntranet = false;
        $scope.isLoadingData = true;
        $scope.dataSoporteGpon = [];
        $scope.listarsoportegpon = () => {
            $scope.isLoadingData = true;

            services
                .getListaPendientesSoporteGpon()
                .then(function (data) {
                    if (data.data.length > 0) {
                        $scope.dataSoporteGpon = data.data[0];
                        $scope.datacount = data.data[1];
                        $scope.datacoun2 = data.data[2];

                        $scope.finalizado = $scope.datacoun2[0]["Finalizado"];
                        $scope.devuelto = $scope.datacoun2[0]["Devuelto al tecnico"];
                        $scope.incompleto = $scope.datacoun2[0]["Incompleto"];
                        $scope.sinrespuesta = $scope.datacoun2[0]["sinrespuesta"];
                        $scope.isLoadingData = false;
                    } else {
                        $scope.flagOnlyPSData = true;
                    }

                    return data;
                })
                .catch((err) => {
                    console.log(err);
                });

            $scope.isLoadingData = false;
        };

        $scope.contadorGpon = () => {
            let counter = $scope.datacount;
            let x = [];
            let finalizado = $scope.finalizado;
            let devuelto = $scope.devuelto;
            let incompleto = $scope.incompleto;
            let sinrespuesta = $scope.sinrespuesta;
            var tabla = '<table class="table table-striped small">' +
                '<thead>' +
                '<tr>' +
                '<th>Login Analista</th>' +
                '<th>Cantidad Marcadas</th>' +
                '</tr>' +
                '</thead>' +
                '<tbody>';

            for (var i = 0; i < counter.length; i++) {
                tabla += '<tr>' +
                    '<td class="filterable-cell"><i class="fa fa-user" aria-hidden="true"></i>  ' + counter[i]['login'] + '</td>' +
                    '<td class="filterable-cell">  ' + counter[i]['Conteo'] + '</td>' +
                    '</tr>';
            }
            tabla += '</tbody>' +
                '</table>' +
                '<div style="text-align: center"><b>Detalles hoy</b></div>' +
                '<ul style="list-style: none;">' +
                '<li>' +
                '<span class="label label-success">Finalizados: ' + finalizado + '</span>' +
                '</li>' +
                '<li>' +
                '<span class="label label-warning">Devueltos al técnico: ' + devuelto + '</span>' +
                '</li>' +
                '<li>' +
                '<span class="label label-danger">Incompletos: ' + incompleto + '</span>' +
                '</li>' +
                '<li>' +
                '<span class="label label-info">Sin respuesta: ' + sinrespuesta + '</span>' +
                '</li>' +
                '</ul>';
            $scope.contadorGpon = $sce.trustAsHtml(tabla);
        }


        $scope.ver_masss = (data) => {
            $scope.dataContent = $sce.trustAsHtml('<div class="table-responsive" style="max-width: 380px;"><table class="table table-bordered table-hover table-condensed small" style="max-width: 350px;">' +
                '<tbody><tr><td style="min-width: 80px">Pedido</td><td>' + data.unepedido + '</td></tr>' +
                '<tr><td style="min-width: 80px">Categoría</td><td>' + data.tasktypecategory + '</td></tr>' +
                '<tr><td style="min-width: 80px">Municipio</td><td>' + data.unemunicipio + '</td></tr>' +
                '<tr><td style="min-width: 80px">Productos</td><td>' + data.uneproductos + '</td></tr>' +
                '<tr><td style="min-width: 80px">Datos cola</td><td>' + data.datoscola + '</td></tr>' +
                '<tr><td style="min-width: 80px">Mac</td><td>' + data.mac + '</td></tr>' +
                '<tr><td style="min-width: 80px">Serial</td><td>' + data.serial.replace(/,/g, '\n') + '</td></tr>' +
                '<tr><td style="min-width: 80px">Sistema</td><td>' + data.uneSourceSystem + '</td></tr>' +
                '<tr><td style="min-width: 80px">Tipo equipo</td><td>' + data.tipo_equipo.replace(/,/g, '\n') + '</td></tr>' +
                '<tr><td style="min-width: 80px">Velocidad navegación</td><td>' + data.velocidad_navegacion + '</td></tr>' +
                '<tr><td style="min-width: 80px">Observación</td><td>' + data.observacion_terreno + '</td></tr>' +
                '<tr><td style="min-width: 80px">Fecha solicitud</td><td>' + data.fecha_creado + '</td></tr>' +
                '</tbody></table></div>');
        }


        $scope.marcarEngestionGpon = (data) => {
            services
                .marcarEngestionGpon(data, $rootScope.galletainfo)
                .then(function (data) {
                    if (data.data.state == 99) {
                        swal({
                            type: "error",
                            title: data.data.title,
                            text: data.data.msg,
                            timer: 4000,
                        }).then(function () {
                            $cookies.remove("usuarioseguimiento");
                            $location.path("/");
                            $rootScope.galletainfo = undefined;
                            $rootScope.permiso = false;
                            $route.reload();
                        });
                    } else if (data.data.state == 1) {
                        swal({
                            title: "muy Bien",
                            type: "success",
                            text: data.data.msj,
                            timer: 4000,
                        }).then(function () {
                            $scope.listarsoportegpon();
                        })
                    } else if (data.data.state == 0) {
                        swal({
                            title: "Ops...",
                            type: "info",
                            text: data.data.msj,
                            timer: 4000,
                        })
                    }
                })
                .catch((err) => console.log(err));
        };

        $scope.abreTipificacion = (id) => {
            var el = document.getElementById("optionTipificacion_" + id);
            el.style.display = el.style.display == "none" ? "block" : "none";
        };

        $scope.gestionarSoporteGpon = async (id_soporte, id_firebase) => {
            let tipificacion = $("#tipificacion" + id_soporte).val();
            let tipificaciones = $("#tipificaciones" + id_soporte).val();

            const {value: observacion} = await Swal({
                title: "Gestión Soporte GPON",
                input: "textarea",
                inputPlaceholder: "Gestion...",
                inputAttributes: {
                    "aria-label": "Gestion",
                },
                showCancelButton: true,
            });

            if (observacion) {
                Swal("Cargando...");

                if (tipificaciones == "") {
                    Swal({
                        title: "Error",
                        text: "Debes de seleccionar tipificaciónes.",
                        type: "error",
                    });
                    return false;
                }

                if (tipificacion == "") {
                    Swal({
                        title: "Error",
                        text: "Debes de seleccionar una tipificación.",
                        type: "error",
                    });
                    return false;
                }

                services
                    .gestionarSoporteGpon(
                        id_soporte,
                        tipificacion,
                        tipificaciones,
                        observacion,
                        $rootScope.galletainfo
                    )
                    .then(function (data) {
                        if (data.data.state == 99) {
                            swal({
                                type: "error",
                                title: data.data.title,
                                text: data.data.msg,
                                timer: 4000,
                            }).then(function () {
                                $cookies.remove("usuarioseguimiento");
                                $location.path("/");
                                $rootScope.galletainfo = undefined;
                                $rootScope.permiso = false;
                                $route.reload();
                            });
                        } else if (data.data.state == 1) {
                            Swal({
                                type: "success",
                                title: "Muy bien",
                                text: data.data.msg,
                                timer: 4000,
                            }).then(function () {
                                $route.reload();
                            })

                        } else if (data.data.state == 0 || data.data.state == 3) {
                            Swal({
                                type: "info",
                                title: "Ops...",
                                text: data.data.msg,
                                timer: 4000,
                            });
                        }
                    })
                    .catch((err) => {
                        console.log("err", err);
                    });
            } else {
                Swal({
                    title: "Error",
                    text: "Debes ingresar una observacion.",
                    type: "error",
                });
                return false;
            }
        };

        $scope.listarsoportegpon();
    }
})();
