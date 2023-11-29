(function () {
    "use strict";
    angular.module("seguimientopedidos").controller("novedadesVisitaCtrl", novedadesVisitaCtrl);
    novedadesVisitaCtrl.$inject = ["$scope", "$http", "$rootScope", "services", "services", "$cookies", "$location", "$route"];

    function novedadesVisitaCtrl(
        $scope,
        $http,
        $rootScope,
        services,
        $cookies, $location, $route
    ) {

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

        function novedadesVisitas(d) {
            if (d === '' || d === undefined) {
                $scope.currentPage = 1;
                $scope.totalItems = 0;
                $scope.pageSize = 15;
                $scope.searchText = '';
            }
            let data = {'page': $scope.currentPage, 'size': $scope.pageSize}
            services
                .novedadesTecnicoService(data)
                .then((data) => {
                    if (data.data.state) {
                        $scope.novedadesVisitasTecnicos = data.data.data;
                        $scope.cantidad = $scope.novedadesVisitasTecnicos.length;
                        $scope.counter = data.data.contador;

                        $scope.totalItems = data.data.counter;
                        $scope.startItem = ($scope.currentPage - 1) * $scope.pageSize + 1;
                        $scope.endItem = $scope.currentPage * $scope.pageSize;
                        if ($scope.endItem > data.data.counter) {
                            $scope.endItem = data.data.counter;
                        }
                    } else {
                        Swal({
                            type: 'error',
                            title: 'Oppss...',
                            text: data.data.msj,
                            timer: 4000
                        })
                    }
                }).catch((e) => {
                console.log(e)
            })
        }

        $scope.pageChanged = function () {
            let data = {'page': $scope.currentPage, 'size': $scope.pageSize}
            novedadesVisitas(data);
        }
        $scope.pageSizeChanged = function () {
            let data = {'page': $scope.currentPage, 'size': $scope.pageSize}
            $scope.currentPage = 1;
            novedadesVisitas(data);
        }

        $scope.buscarNovedades = function (d) {
            if (d === "" || d === undefined) {
                $scope.currentPage = 1;
                $scope.totalItems = 0;
                $scope.pageSize = 15;
                $scope.searchText = "";
            }

            let data = {page: $scope.currentPage, size: $scope.pageSize, d};
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
            let data = {'observacion': observacionCCO, 'pedido': $scope.pedidoElegido}
            services.myService(data, 'novedadesTecnicoCtrl.php', 'updateNovedadesTecnico')
                .then((data) => {
                    if (data.data.state) {
                        $("#observacionCCO").val("");
                        $scope.pedidoElegido = "";
                        $scope.observacionCCO = "";
                        Swal({
                            type: 'success',
                            title: 'Muy Bien!',
                            text: data.data.msj,
                            timer: 4000
                        }).then(() => {
                            $route.reload();
                        })
                    } else {
                        Swal({
                            type: 'error',
                            title: 'Oppss...',
                            text: data.data.msj,
                            timer: 4000
                        })
                    }
                })
                .catch((err) => {
                    console.log(err)
                });
        };

        $scope.refrescarCamposNovedadesMotivos = () => {
            if (
                $scope.novedadesVisitasSel.situaciontriangulo === "No cumple políticas de tiempos") {
                $scope.optionsMotivo = [
                    "Respuesta mesas de soporte",
                    "Retrasos premisas",
                    "Problemas en las plataformas",
                    "Fallas fisicas en la red",
                ];
            }
            if ($scope.novedadesVisitasSel.situaciontriangulo === "Malos procedimientos") {
                $scope.optionsMotivo = ["Logísticos", "Conocimiento"];
            }
            if ($scope.novedadesVisitasSel.situaciontriangulo === "Riesgo incumplimiento AM" || $scope.novedadesVisitasSel.situaciontriangulo === "Riesgo incumplimiento PM") {
                $scope.optionsMotivo = ["Capacidad operativa", "Novedades Click"];
            }
        };

        $scope.refrescarCamposNovedadesSubmotivos = () => {
            if ($scope.novedadesVisitasSel.motivotriangulo === "Respuesta mesas de soporte") {
                $scope.optionsSubmotivo = [
                    "Infraestructura AAA",
                    "Linea GPON",
                    "Linea Asignaciones",
                    "Linea Bloqueo y desbloqueo",
                    "Brutal Force",
                    "Contingencias",
                ];
            }
            if ($scope.novedadesVisitasSel.motivotriangulo === "Retrasos premisas") {
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
            if ($scope.novedadesVisitasSel.motivotriangulo === "Problemas en las plataformas") {
                $scope.optionsSubmotivo = [];
            }
            if (
                $scope.novedadesVisitasSel.motivotriangulo === "Fallas fisicas en la red") {
                $scope.optionsSubmotivo = [];
            }
            if ($scope.novedadesVisitasSel.motivotriangulo === "Logísticos") {
                $scope.optionsSubmotivo = [
                    "técnico no marca estado",
                    "técnico no finaliza",
                    "técnico no está en sitio",
                    "abandono de pedido",
                    "no sigue ruta asignada",
                ];
            }
            if ($scope.novedadesVisitasSel.motivotriangulo === "Conocimiento") {
                $scope.optionsSubmotivo = [
                    "Mal aprovisionamiento",
                    "No usó el bot Sara",
                    "No adjuntó fotos requeridas",
                    "Mal uso de click mobile",
                ];
            }
            if ($scope.novedadesVisitasSel.motivotriangulo === "Capacidad operativa") {
                $scope.optionsSubmotivo = [
                    "Sin tecnicos con la habilidad",
                    "Supervisor no aprueba desplazamiento",
                    "Supervisor garantiza visita",
                ];
            }
            if ($scope.novedadesVisitasSel.motivotriangulo === "Novedades Click") {
                $scope.optionsSubmotivo = ["Cargado tarde", "Microzona errada"];
            }
        };

        $scope.regiones = function () {
            $scope.validaraccion = false;
            services.getRegiones().then(function (data) {
                if (data.data.state !== 1) {
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
                    if (data.data.state !== 1) {
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
                if (!data.data.state) {
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
                    if (data.data.state !== 1) {
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

            if (pedido === "" || pedido === undefined) {
                Swal({
                    type: 'info',
                    title: 'Opss...',
                    text: 'Ingrese un pedido para buscar',
                    timer: 4000
                })
                $scope.sininfopedido = false;
            } else {
                $scope.sininfopedido = true;
                services.windowsBridge("HCHV/Buscar/" + pedido).then((data) => {
                    $scope.myWelcome = data.data;
                    if ($scope.myWelcome.pEDIDO_UNE == null) {
                        $scope.infopedido = false;
                        $scope.errorconexion1 = false;
                        $scope.myWelcome = {};
                    } else if ($scope.myWelcome.pEDIDO_UNE === "TIMEOUT") {
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
                }).catch((e) => {
                    console.log(e)
                });
            }
        };

        $scope.guardar = function (registrosTenicos) {

            registrosTenicos.login = $rootScope.galletainfo.login;
            services.myService(registrosTenicos, 'novedadesTecnicoCtrl.php', 'guardarNovedadesTecnico')
                .then((data) => {
                    if (data.data.state) {
                        $("#modalNovedadVisita").modal("hide");
                        Swal({
                            type: 'success',
                            title: 'Bien',
                            text: data.data.text,
                            timer: 4000
                        }).then(() => {
                            $route.reload();
                        });
                    } else {
                        Swal({
                            type: 'error',
                            title: 'Ops...',
                            text: data.data.text,
                            timer: 4000
                        })
                    }
                }).catch((e) => {
                console.log(e)
            })

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
                        if (data.data.state === 1) {
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
