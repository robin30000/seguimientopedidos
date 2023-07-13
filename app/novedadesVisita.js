(function () {
    "use strict";
    angular.module("seguimientopedidos").controller("novedadesVisitaCtrl", novedadesVisitaCtrl);
    novedadesVisitaCtrl.$inject = ["$scope", "$http", "$rootScope", "services", "services", "$cookies", "$location", "$route"];
    function novedadesVisitaCtrl($scope, $http, $rootScope, services, $cookies, $location, $route) {

        var tiempo = new Date().getTime();
        var date1 = new Date();
        var year = date1.getFullYear();
        var month =
            date1.getMonth() + 1 <= 9
                ? "0" + (date1.getMonth() + 1)
                : date1.getMonth() + 1;
        var day = date1.getDate() <= 9 ? "0" + date1.getDate() : date1.getDate();

        tiempo = year + "-" + month + "-" + day;

        $scope.novedadesVisitasTecnicos = {};
        $scope.Registros = {};
        $scope.novedadesVisitasSel = {};
        $scope.observacionCCO = "";
        $scope.pedidoElegido = "";

        novedadesVisitas();

        function novedadesVisitas(data) {
            if (data === '' || data === undefined) {
                $scope.currentPage = 1;
                $scope.totalItems = 0;
                $scope.pageSize = 15;
                $scope.searchText = '';
                data = {'page': $scope.currentPage, 'size': $scope.pageSize}
            }
            services
                .novedadesTecnicoService(data)
                .then(
                    function (data) {
                        console.log(data);
                        $scope.novedadesVisitasTecnicos = data.data.data;
                        $scope.cantidad = $scope.novedadesVisitasTecnicos.length;
                        $scope.counter = data.data.contador;

                        $scope.totalItems = data.data.counter;
                        $scope.startItem = ($scope.currentPage - 1) * $scope.pageSize + 1;
                        $scope.endItem = $scope.currentPage * $scope.pageSize;
                        if ($scope.endItem > data.data.counter) {
                            $scope.endItem = data.data.counter;
                        }
                    },
                    function errorCallback(response) {
                        console.log(response);
                    }
                );
        }

        $scope.pageChanged = function () {
            data = {'page': $scope.currentPage, 'size': $scope.pageSize}
            console.log(data)
            novedadesVisitas(data);
        }
        $scope.pageSizeChanged = function () {
            console.log(data)
            data = {'page': $scope.currentPage, 'size': $scope.pageSize}
            $scope.currentPage = 1;
            novedadesVisitas(data);
        }

        $scope.buscarNovedades = function (data) {
            if (data === "" || data === undefined) {
                $scope.currentPage = 1;
                $scope.totalItems = 0;
                $scope.pageSize = 15;
                $scope.searchText = "";
                data = {page: $scope.currentPage, size: $scope.pageSize};
            }

            data = {page: $scope.currentPage, size: $scope.pageSize, data};
            novedadesVisitas(data);
        }

        $scope.mostraModal = function (registrosTenicos) {
            angular.copy(registrosTenicos, $scope.novedadesVisitasSel);

            $("#modalNovedadVisita").modal();
        };

        $scope.abrirAgregarObservacion = (pedido) => {
            $("#novedadesVisitaObservacion").modal();
            $scope.pedidoElegido = pedido;
        };

        $scope.agregarObservacion = (observacionCCO) => {
            services
                .updateNovedadesTecnico(observacionCCO, $scope.pedidoElegido)
                .then((res) => {
                    console.log(res);
                    Swal("Tu Novedad fue Actualizada!", "Bien Hecho");
                    $("#observacionCCO").val("");
                    $scope.pedidoElegido = "";
                    $scope.observacionCCO = "";
                })
                .catch((err) => {
                    console.log(err);
                    Swal("Tu Novedad tuvo un Error!", "Vuelve a intentar");
                    $("#observacionCCO").val("");
                    $scope.pedidoElegido = "";
                    $scope.observacionCCO = "";
                });
        };

        $scope.refrescarCamposNovedadesMotivos = () => {
            if (
                $scope.novedadesVisitasSel.situaciontriangulo ==
                "No cumple políticas de tiempos"
            ) {
                $scope.optionsMotivo = [
                    "Respuesta mesas de soporte",
                    "Retrasos premisas",
                    "Problemas en las plataformas",
                    "Fallas fisicas en la red",
                ];
            }
            if (
                $scope.novedadesVisitasSel.situaciontriangulo == "Malos procedimientos"
            ) {
                $scope.optionsMotivo = ["Logísticos", "Conocimiento"];
            }
            if (
                $scope.novedadesVisitasSel.situaciontriangulo ==
                "Riesgo incumplimiento AM" ||
                $scope.novedadesVisitasSel.situaciontriangulo ==
                "Riesgo incumplimiento PM"
            ) {
                $scope.optionsMotivo = ["Capacidad operativa", "Novedades Click"];
            }
        };

        $scope.refrescarCamposNovedadesSubmotivos = () => {
            if (
                $scope.novedadesVisitasSel.motivotriangulo ==
                "Respuesta mesas de soporte"
            ) {
                $scope.optionsSubmotivo = [
                    "Infraestructura AAA",
                    "Linea GPON",
                    "Linea Asignaciones",
                    "Linea Bloqueo y desbloqueo",
                    "Brutal Force",
                    "Contingencias",
                ];
            }
            if ($scope.novedadesVisitasSel.motivotriangulo == "Retrasos premisas") {
                $scope.optionsSubmotivo = [
                    "demora de escalera",
                    "distancia de la instalación",
                    "en actividades en bodega",
                    "demora auxiliar de distribuidor",
                    "técnico sin materiales",
                    "técnico sin herramienta",
                    "demoras por ubicación",
                    "demoras en aprovisionamiento de equipos",
                    "problemas dispositivo móvil o señal",
                    "técnico en espera de apoyo de supervisor",
                    "técnico sin equipos",
                    "técnico y supervisor no contestan",
                ];
            }
            if (
                $scope.novedadesVisitasSel.motivotriangulo ==
                "Problemas en las plataformas"
            ) {
                $scope.optionsSubmotivo = [];
            }
            if (
                $scope.novedadesVisitasSel.motivotriangulo == "Fallas fisicas en la red"
            ) {
                $scope.optionsSubmotivo = [];
            }
            if ($scope.novedadesVisitasSel.motivotriangulo == "Logísticos") {
                $scope.optionsSubmotivo = [
                    "técnico no marca estado",
                    "técnico no finaliza",
                    "técnico no está en sitio",
                    "abandono de pedido",
                    "no sigue ruta asignada",
                ];
            }
            if ($scope.novedadesVisitasSel.motivotriangulo == "Conocimiento") {
                $scope.optionsSubmotivo = [
                    "Mal aprovisionamiento",
                    "No usó el bot Sara",
                    "No adjuntó fotos requeridas",
                    "Mal uso de click mobile",
                ];
            }
            if ($scope.novedadesVisitasSel.motivotriangulo == "Capacidad operativa") {
                $scope.optionsSubmotivo = [
                    "Sin tecnicos con la habilidad",
                    "Supervisor no aprueba desplazamiento",
                    "Supervisor garantiza visita",
                ];
            }
            if ($scope.novedadesVisitasSel.motivotriangulo == "Novedades Click") {
                $scope.optionsSubmotivo = ["Cargado tarde", "Microzona errada"];
            }
        };

        $scope.regiones = function () {
            $scope.validaraccion = false;
            services.getRegiones().then(function (data) {
                if (data.data.state != 1) {
                    Swal({
                        type: 'error',
                        text: data.data.msj,
                        timer: 4000
                    })
                } else {

                    $scope.listadoRegiones = data.data.data;
                    $scope.listadoMunicipios = {};
                }

            });
        };

        $scope.calcularAcciones = function () {
            $scope.listadoMunicipios = {};
            services
                .getMunicipios($scope.novedadesVisitasSel.region)
                .then(function (data) {
                    if (data.data.state != 1) {
                        Swal({
                            type: 'error',
                            text: data.data.msj,
                            timer: 4000
                        })
                    } else {
                        $scope.listadoMunicipios = data.data.data;
                        $scope.validaraccion = true;
                    }

                });
        };

        $scope.situacion = function () {
            $scope.validaraccion = false;
            services.getSituacion().then(function (data) {
                if (data.data.state != 1) {
                    Swal({
                        type: 'error',
                        text: data.data.msj,
                        timer: 4000
                    })
                } else {
                    $scope.listadoSituacion = data.data.data;
                    $scope.listadoDetalle = {};
                }

            });
        };

        $scope.calcularDetalle = function () {
            $scope.listadoDetalle = {};
            services
                .getDetalle($scope.novedadesVisitasSel.situacion)
                .then(function (data) {
                    if (data.data.state != 1) {
                        Swal({
                            type: 'error',
                            text: data.data.msj,
                            timer: 4000
                        })
                    } else {
                        $scope.listadoDetalle = data.data.data;
                        $scope.validaraccion = true;
                    }

                });
        };

        $scope.BuscarPedidoNovedad = function (pedido) {
            $scope.errorconexion1 = false;
            $scope.gestionmanual = {};
            $scope.pedido = pedido;
            $scope.gestionmanual.producto = "";

            if (pedido == "" || pedido == undefined) {
                Swal({
                    type: 'info',
                    title: 'Opss...',
                    text: 'Ingrese un pedido para buscar',
                    timer: 4000
                })
                $scope.sininfopedido = false;
            } else {
                $scope.ipServer = "10.100.66.254";
                $scope.sininfopedido = true;
                $scope.url =
                    "http://" + $scope.ipServer + ":8080/HCHV/Buscar/" + pedido;
                $http.get($scope.url, {timeout: 2000}).then(
                    function (data) {
                        $scope.myWelcome = data.data;
                        if ($scope.myWelcome.pEDIDO_UNE == null) {
                            $scope.infopedido = false;
                            $scope.errorconexion1 = false;
                            $scope.myWelcome = {};
                        } else if ($scope.myWelcome.pEDIDO_UNE == "TIMEOUT") {
                            $scope.infopedido = false;
                            $scope.errorconexion1 = true;
                            $scope.myWelcome = {};
                            $scope.errorconexion =
                                "No hay conexión con Click, ingrese datos manualmente";
                        } else {
                            $scope.infopedido = true;
                            $scope.novedadesVisitasSel.contrato2 =
                                $scope.myWelcome.uNEProvisioner;
                            $scope.novedadesVisitasSel.cedulaTecnico2 =
                                $scope.myWelcome.engineerID;
                            $scope.novedadesVisitasSel.nombreTecnico2 =
                                $scope.myWelcome.engineerName;
                            $scope.novedadesVisitasSel.proceso2 =
                                $scope.myWelcome.engineer_Type;
                            $scope.novedadesVisitasSel.municipio2 =
                                $scope.myWelcome.uNEMunicipio;

                            $scope.novedadesVisitasSel.region =
                                $scope.myWelcome.uNEUen;
                        }
                        return data.data;
                    },
                    function (err) {
                        $scope.ipServer = "10.100.66.254";

                        $scope.url =
                            "http://" + $scope.ipServer + ":8080/HCHV/Buscar/" + pedido;
                        $http.get($scope.url, {timeout: 2000}).then(
                            function (data) {
                                $scope.myWelcome = data.data;
                                if ($scope.myWelcome.pEDIDO_UNE == null) {
                                    $scope.infopedido = false;
                                    $scope.errorconexion1 = false;
                                    $scope.myWelcome = {};
                                } else if ($scope.myWelcome.pEDIDO_UNE == "TIMEOUT") {
                                    $scope.infopedido = false;
                                    $scope.errorconexion1 = true;
                                    $scope.myWelcome = {};
                                    $scope.errorconexion =
                                        "No hay conexión con Click, ingrese los datos manualmente";
                                } else {
                                    $scope.infopedido = true;
                                    $scope.novedadesVisitasSel.contrato2 =
                                        $scope.myWelcome.uNEProvisioner;
                                    $scope.novedadesVisitasSel.cedulaTecnico2 =
                                        $scope.myWelcome.engineerID;
                                    $scope.novedadesVisitasSel.nombreTecnico2 =
                                        $scope.myWelcome.engineerName;
                                    $scope.novedadesVisitasSel.proceso2 =
                                        $scope.myWelcome.engineer_Type;
                                    $scope.novedadesVisitasSel.municipio2 =
                                        $scope.myWelcome.uNEMunicipio;
                                    $scope.novedadesVisitasSel.region =
                                        $scope.myWelcome.uNEUen;
                                }
                                return data.data;
                            },
                            function (err) {
                                $scope.infopedido = false;
                                $scope.errorconexion1 = true;
                                $scope.myWelcome = {};
                                $scope.errorconexion =
                                    "No hay conexión con el Web Service, ingrese los datos manualmente";
                            }
                        );
                    },
                    function errorCallback(response) {
                        console.log(response);
                    }
                );
            }
        };

        $scope.guardar = function (registrosTenicos, frmNovedadVisita) {
            services
                .guardarNovedadesTecnico(registrosTenicos, $rootScope.galletainfo)
                .then(
                    function (data) {
                        if (data.data.state == 99) {
                            swal({
                                type: "error",
                                title: data.data.title,
                                text: data.data.text,
                                timer: 4000,
                            }).then(function () {
                                $cookies.remove("usuarioseguimiento");
                                $location.path("/");
                                $rootScope.galletainfo = undefined;
                                $rootScope.permiso = false;
                                $route.reload();
                            });
                        } else if (data.data.state == 1) {
                            $("#modalNovedadVisita").modal("hide");
                            Swal({
                                type: 'success',
                                title: 'Bien',
                                text: data.data.text,
                                timer: 4000
                            }).then(() => {
                                setTimeout(() => {
                                    $route.reload();
                                }, 500);

                            })
                        } else if (data.data.state == 0) {
                            Swal({
                                type: 'error',
                                title: 'Ops...',
                                text: data.data.text,
                                timer: 4000
                            })
                        }
                        /* if (respuesta.status == "201") {
                            Swal("Tu Novedad fue Guardada!", "Bien Hecho");
                        }

                        $("#modalNovedadVisita").modal("hide");
                        $scope.novedadesVisitasSel = {};

                        frmNovedadVisita.autoValidateFormOptions.resetForm(); */
                    },
                    function errorCallback(response) {
                        console.log(response);
                    }
                );
            $scope.RegistrosTecnicos(registrosTenicos);
        };

        $scope.csvNovedadesTecnicos = function () {
            $scope.csvPend = false;
            if ($scope.Registros.fechaini > $scope.Registros.fechafin) {
                Swal({
                    type: 'info',
                    title: 'Opss...',
                    text: 'La fecha inicial debe ser menor que la inicial',
                    timer: 4000
                })
            } else {
                services
                    .expCsvNovedadesTecnico($scope.Registros, $rootScope.galletainfo)
                    .then(function (data) {
                        if (data.data.state == 1) {
                            var wb = XLSX.utils.book_new();
                            var ws = XLSX.utils.json_to_sheet(data.data.data);
                            XLSX.utils.book_append_sheet(wb, ws, 'nivedades_tecnico');
                            XLSX.writeFile(wb, 'Novedades_tecnico_' + tiempo + '.xlsx');
                        } else {
                            Swal({
                                type: 'error',
                                text: data.data.msj,
                                timer: 4000
                            })
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            }
        };

        $scope.regiones();
        $scope.situacion();
    }

})();
