(function () {
    "use strict";
    angular.module("seguimientopedidos").controller("contingenciasCtrl", contingenciasCtrl);
    contingenciasCtrl.$inject = ["$scope", "$rootScope", "$timeout", "services", "$route", "$cookies", "$location", "$http"];

    function contingenciasCtrl($scope, $rootScope, $timeout, services, $route, $cookies, $location, $http) {
        $scope.contingencias = {};
        $scope.pedidoexiste = false;
        $scope.pedidoguardado = false;
        $scope.haypedido = false;
        $scope.equiposEntran = [];
        $scope.equiposEntran.push({});
        $scope.equiposSalen = [];
        $scope.equiposSalen.push({});


        $scope.producto = [
            {id: "TV", producto: "TV"},
            {id: "Internet", producto: "Internet"},
            {id: "ToIP", producto: "ToIP"},
            {id: "Internet+ToIP", producto: "Internet+ToIP"}
        ]

        $scope.buscarPedidoAprovisionamiento = (pedido) => {
            if (!pedido) {
                Swal({
                    type: 'error',
                    title: 'Error',
                    text: 'Ingrese el pedido',
                    timer: 4000
                })
                return;
            }

            /* function actividades(pedido) {

                $scope.sininfopedido = true;
                $scope.url = "http://" + $scope.ipServer + ":8080/HCHV/Buscar/" + pedido;
                $http.get($scope.url, { timeout: 2000 })
                    .then(function (data) {
                        $scope.myWelcome = data.data;
                        $scope.equipos = $scope.myWelcome.Equipos;
                        if ($scope.myWelcome.pEDIDO_UNE == null) {
                            $scope.infopedido = false;
                            $scope.errorconexion1 = false;
                            $scope.myWelcome = {};
                        } else if ($scope.myWelcome.engineerID == null) {
                            $scope.infopedido = false;
                            $scope.errorconexion1 = false;
                            $scope.myWelcome = {};
                        } else if ($scope.myWelcome.pEDIDO_UNE == "TIMEOUT") {
                            $scope.infopedido = false;
                            $scope.errorconexion1 = true;
                            $scope.myWelcome = {};
                            $scope.errorconexion = "No hay conexión con Click, ingrese datos manualmente";
                        } else {
                            $scope.infopedido = true;
                            $scope.gestionmanual.tecnico = $scope.myWelcome.engineerID;
                            $scope.gestionmanual.CIUDAD = $scope.myWelcome.uNEMunicipio.toUpperCase();
                            $scope.BuscarTecnico();
                        }

                        return data.data;
                    },

                        function (err) {
                            $scope.ipServer = "10.100.66.254";
                            $scope.url = "http://" + $scope.ipServer + ":8080/HCHV/Buscar/" + pedido;
                            $http.get($scope.url, { timeout: 2000 })
                                .then(function (data) {
                                    $scope.myWelcome = data.data;
                                    if ($scope.myWelcome.pEDIDO_UNE == null) {
                                        $scope.infopedido = false;
                                        $scope.errorconexion1 = false;
                                        $scope.myWelcome = {};
                                    } else if ($scope.myWelcome.pEDIDO_UNE == "TIMEOUT") {
                                        $scope.infopedido = false;
                                        $scope.errorconexion1 = true;
                                        $scope.myWelcome = {};
                                        $scope.errorconexion = "No hay conexión con Click, ingrese datos manualmente";
                                    } else {
                                        $scope.infopedido = true;
                                        $scope.gestionmanual.tecnico = $scope.myWelcome.engineerID;
                                        $scope.gestionmanual.CIUDAD = $scope.myWelcome.uNEMunicipio.toUpperCase();
                                        $scope.BuscarTecnico();
                                    }
                                    ;
                                    return data.data;
                                }, function (err) {
                                    console.log("ERROR DE CONEXION: NO PUEDO ALCANZAR EL SERVIDOR!!!");
                                    $scope.infopedido = false;
                                    $scope.errorconexion1 = true;
                                    $scope.myWelcome = {};
                                    $scope.errorconexion = "No hay conexión con Web Service, ingrese datos manualmente";
                                });
                        },
                        function errorCallback(response) {
                            console.log("ERRORRRR");
                        }
                    );
            } */

            $scope.consulta = {};
            $scope.url = "http://10.100.66.254:8080/BB8/contingencias/Buscar/";

            Promise.all([
                $http.get($scope.url + "GetClick/" + pedido, {timeout: 4000}),
                $http.get($scope.url + "GetPlanBaMSS/" + pedido, {timeout: 4000}),
                $http.get($scope.url + "GetPlanTOMSS/" + pedido, {timeout: 4000}),
                $http.get($scope.url + "GetPlanTVMSS/" + pedido, {timeout: 4000}),
                $http.get("http://10.100.66.254:8080/HCHV/Buscar/" + pedido, {timeout: 4000})
            ]).then(function (responses) {
                $scope.consulta.click = responses[0].data;
                $scope.consulta.bb8plan = responses[1].data;
                $scope.consulta.bb8Telefonia = responses[2].data;
                $scope.consulta.bb8Television = responses[3].data;
                $scope.consulta.actividades = responses[4].data;
                console.log($scope.consulta);

                if ($scope.consulta.click[0].EQProducto === 'Telefonía') {
                    $scope.consulta.click[0].EQProducto = "ToIP";
                }

                if ($scope.consulta.actividades.uNETecnologias == 'HFC-HFC') {
                    $scope.consulta.actividades.uNETecnologias = 'HFC';
                }

                if ($scope.consulta.actividades.uNEProductos == 'Internet-Telefonía') {
                    $scope.consulta.actividades.uNEProductos = 'Internet+ToIP';
                } else if ($scope.consulta.actividades.uNEProductos == 'Televisión Hogares') {
                    $scope.consulta.actividades.uNEProductos = 'TV';
                }

                if ($scope.consulta.actividades.Type == 'Install') {
                    $scope.consulta.actividades.Type = 'Instalación'
                } else {
                    $scope.consulta.actividades.Type = 'Reparación'
                }

                if ($scope.consulta.actividades.uNEDepartamento == 'Bogotá D.C.') {
                    $scope.consulta.actividades.uNEDepartamento = 'BOGOTA'
                }

                $scope.contingencias.producto = $scope.consulta.actividades.uNEProductos;
                $scope.contingencias.tecnologia = $scope.consulta.actividades.uNETecnologias;
                $scope.contingencias.proceso = $scope.consulta.actividades.Type;
                $scope.contingencias.ciudad = $scope.consulta.actividades.uNEDepartamento;
                $scope.contingencias.uen = $scope.consulta.actividades.uNEUENcalculada

            }).catch(function (error) {
                console.log(error);
            });
        }

        $scope.BuscarPedidoContingencia = function () {
            services
                .buscarPedidoSeguimiento(
                    $scope.contingencias.pedido,
                    $scope.contingencias.producto,
                    $scope.contingencias.remite
                )
                .then(
                    function (data) {
                        $scope.GuardarContingencia($scope.contingencias);
                    },
                    function errorCallback(response) {
                        console.log(response);
                    }
                );
        };

        $scope.buscarhistoricoPedidoContingencia = function (pedido) {
            if (pedido == undefined || pedido == "") {
                Swal({
                    type: 'error',
                    text: 'Ingrese un pedido',
                    timer: 4000
                })
            } else {
                services.getbuscarPedidoContingencia(pedido).then(
                    function (data) {
                        console.log(data);
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
                        } else if (data.data.state != 1) {
                            Swal({
                                type: 'error',
                                text: data.data.msj,
                                timer: 4000
                            })
                        } else {
                            $scope.databsucarPedido = data.data.data;
                            $("#modalHistoricoContingencias").modal('show');
                        }
                    },
                    function errorCallback(response) {
                        console.log(response);
                    }
                );
            }
        };

        $scope.muestraModalObservacion = (data) => {
            $scope.observacionContingencia = data;
            $("#modalObservaciones").modal('show');
        }

        $scope.addEquipoEntra = function () {
            $scope.equiposEntran.push({});
        };

        $scope.addEquipoSale = function () {
            $scope.equiposSalen.push({});
        };

        $scope.updateEnGestion = function () {
            services.UpdatePedidosEngestion($rootScope.galletainfo).then(
                function (data) {
                    if (data.data.state != 1) {
                        console.log(data);
                    } else {
                        console.log(data);
                        $scope.haypedido = true;
                        $scope.pedidosEngestion = data.data.data;

                        var tam = $scope.pedidosEngestion.length;
                        $scope.contingenciaOK = 0;
                        $scope.contingenciaPend = 0;
                        $scope.contingenciaNO = 0;
                        $scope.contingenciaNOCP = 0;

                        for (var i = 0; i < tam; i++) {
                            if ($scope.pedidosEngestion[i].acepta == "Acepta") {
                                $scope.contingenciaOK = +$scope.contingenciaOK + 1;
                            }
                            if ($scope.pedidosEngestion[i].acepta == "Rechaza") {
                                $scope.contingenciaNO = +$scope.contingenciaNO + 1;
                            }
                            if ($scope.pedidosEngestion[i].aceptaPortafolio == "Rechaza") {
                                $scope.contingenciaNOCP = +$scope.contingenciaNOCP + 1;
                            }
                            if (
                                $scope.pedidosEngestion[i].acepta == "Pendiente" &&
                                $scope.pedidosEngestion[i].aceptaPortafolio == "Pendiente"
                            ) {
                                $scope.contingenciaPend = +$scope.contingenciaPend + 1;
                            }
                            if (
                                $scope.pedidosEngestion[i].acepta == "Pendiente" &&
                                $scope.pedidosEngestion[i].aceptaPortafolio == "Acepta"
                            ) {
                                $scope.contingenciaOK = +$scope.contingenciaOK + 1;
                            }
                        }
                    }

                },
                function errorCallback(response) {
                    console.log(response);
                }
            );
        };

        $scope.GuardarContingencia = function (contingencias) {
            $("#guardaPedidoContingencia").attr("disabled", true);

            $scope.pedidoguardado = true;
            $scope.pedidoexiste = false;
            $scope.mensaje = "Pedido guardado con exito.";

            var equiposIn = "";

            var sep = "";

            for (var equipo of $scope.equiposEntran) {
                if (equipo.value == undefined || equipo.value == "undefined") continue;
                else {
                    equiposIn = equiposIn + sep + equipo.value;
                    sep = "-";
                }
            }
            contingencias.macEntra = equiposIn;
            $scope.equiposEntran = [];
            $scope.equiposEntran.push({});

            var equiposOut = "";

            sep = "";
            for (var equipo of $scope.equiposSalen) {
                if (equipo.value == undefined || equipo.value == "undefined") continue;
                else {
                    equiposOut = equiposOut + sep + equipo.value;
                    sep = "-";
                }
            }
            contingencias.macSale = equiposOut;
            $scope.equiposSalen = [];
            $scope.equiposSalen.push({});

            services
                .guardarContingencia(contingencias, $rootScope.galletainfo)
                .then(function (data) {
                    if (data.data.state === 99) {
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
                        Swal({
                            type: "success",
                            title: "Bien",
                            text: data.data.msj,
                            timer: 4000
                        }).then(() => {
                            $route.reload();
                        })
                    } else if (data.data.state == 0) {
                        Swal({
                            type: "error",
                            title: "Opss...",
                            text: data.data.msj,
                            timer: 4000
                        });
                    }
                });

            $scope.updateEnGestion();
        };

        $scope.CancelarContingencia = function (data) {
            Swal.fire({
                title: "¿Está seguro que desea cancelar la contigencia?",
                text: "no prodrás revertir esto!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Sí, Borrar Ahora!",
            }).then((result) => {
                if (result.value) {
                    services.CancelContingencia(data, $rootScope.galletainfo).then(
                        function (respuesta) {
                            if (respuesta.status == 201) {
                                Swal.fire(
                                    "Cancelada!",
                                    "La contingencia ha sido Cancelada. Actualiza la página",
                                    "success"
                                );
                            } else if (respuesta.status == 200) {
                                Swal({
                                    type: "error",
                                    title: "La Contigencia no se puede cancelar",
                                    text: "Ya se inicio gestión por parte del personal encargado",
                                    footer: "Debes esperar que finalice la gestión",
                                });
                            }
                        },
                        function errorCallback(response) {
                            if (response.status == 400) {
                                Swal({
                                    type: "error",
                                    title: "Oops...",
                                    text: "La Contingencia no se Canceló",
                                    footer:
                                        "¡Intenta de nuevo si persiste falla reporta con el administrador!",
                                });
                            }
                        }
                    );
                }
            });
        };

        $scope.updateContingencias = setInterval(function () {
            $scope.updateEnGestion();
        }, 300000);

        $scope.$on("$destroy", function (event) {
            $timeout.cancel();
            clearInterval($scope.updateContingencias);
        });

        $scope.updateEnGestion();
    }
})();
