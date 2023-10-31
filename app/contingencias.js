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
        ciudadadesContingencia();


        $scope.producto = [
            {id: "TV", producto: "TV"},
            {id: "Internet", producto: "Internet"},
            {id: "ToIP", producto: "ToIP"},
            {id: "Internet+ToIP", producto: "Internet+ToIP"},
            {id: "BA", producto: "BA"}
        ]

        function ciudadadesContingencia() {
            services.myService('', 'otherServicesCtrl.php', 'ciudades').then((data) => {
                $scope.ciudadesCont = data.data.data;
            }).catch((e) => {
                console.log(e)
            })
        }

        $scope.detalleTarea = (f) => {
            if (!f) {
                Swal({
                    type: 'error',
                    title: 'Opss...',
                    text: 'Ingrese la tarea para buscar su historial',
                    timer: 4000
                })
                return;
            }

            services.myService(f, 'otrosServiciosCtrl.php', 'buscarPedidoContingencias').then((data) => {
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
            }).catch((e) => {
                console.log(e)
            });

        }

        $scope.autoCompletaTarea = function (pedido) {
            if (!pedido) {
                Swal({
                    type: 'error',
                    title: 'Oops...',
                    text: 'Ingrese el pedido a buscar',
                    timer: 4000
                })
                return;
            }

            services.windowsBridge("HCHV/Buscar/" + pedido)
                .then((f) => {
                    let data = f.data
                    console.log(data.uNEProductos)
                    let productoSplit = data.uNEProductos.split(/\s|-/);
                    let tecnologiaSplit = data.uNETecnologias.split('-');
                    $scope.contingencias.prod = productoSplit[0];

                    //let producto = (productoSplit[0].toLowerCase() === 'internet' || productoSplit[0].toLowerCase() === 'inter' || productoSplit[0].toLowerCase() === 'toip' || productoSplit[0].toLowerCase() === 'internet+toip') ? 'INTER' : 'TV';
                    let producto = (productoSplit[0].toLowerCase() === 'internet' || productoSplit[0].toLowerCase() === 'inter' || productoSplit[0].toLowerCase() === 'toip' || productoSplit[0].toLowerCase() === 'internet+toip' || productoSplit[0].toLowerCase() === 'to') ? 'Internet' : (productoSplit[0].toLowerCase() === 'televisión' || productoSplit[0].toLowerCase() === 'television' || productoSplit[0].toLowerCase() === 'tv') ? 'TV' : 'Otro';

                    let proceso = '';

                    if (data.taskType.indexOf('Reparacion') !== -1) {
                        proceso = 'Reparacion'
                    } else {
                        proceso = 'Instalación'
                    }

                    $scope.contingencias.pedido = data.pEDIDO_UNE;
                    //$scope.contingencias.producto = producto;
                    $scope.contingencias.producto = producto;
                    $scope.contingencias.uen = data.uNEUENcalculada;
                    $scope.contingencias.proceso = proceso;
                    $scope.contingencias.ciudad = data.uNEMunicipio;
                    $scope.contingencias.tecnologia = tecnologiaSplit[0] ?? tecnologiaSplit;
                    $scope.contingencias.uneSourceSystem = data.sistema;
                    $scope.contingencias.tarea = data.tAREA_ID;

                    services.windowsBridge("BB8/contingencias/Buscar/GetClick/" + pedido).then((d) => {
                        $scope.contingencias.contrato = d.data[0].EQIdentificadorServicio;
                        let direccion = d.data[0].UNECodigoDireccionServicio;
                        services.windowsBridge("BB8/contingencias/Buscar/GetPlanBaMSS/" + direccion).then((data) => {
                            let d = data.data;

                            if (d.length !== 0) {
                                for (let i = 0; i < d.length; i++) {
                                    if (d[i].VALUE_LABEL == 'Plan') {
                                        $scope.contingencias.perfil = d[i].VALID_VALUE;
                                    }
                                }
                            } else {
                                $scope.contingencias.perfil = 'N/A';
                            }

                        })
                    })

                }).catch((e) => {
                    console.log(e)
                }
            );
        }

        $scope.guardaContingencia = (f) => {
            if (f.accion == 'mesaOffline') {
                f.motivo = 'N/A';
                f.tipoEquipo = 'N/A';
            }

            console.log(f)

            if (!f) {
                Swal({
                    type: 'error',
                    title: 'Opss..',
                    text: 'Ingresa todos los datos',
                    timer: 4000
                })
                return;
            }

            if (!f.pedido) {
                Swal({
                    type: 'error',
                    title: 'Opss..',
                    text: 'Ingrese el pedido',
                    timer: 4000
                })
                return;
            }

            if (!f.producto) {
                Swal({
                    type: 'error',
                    title: 'Opss..',
                    text: 'Seleccione el producto',
                    timer: 4000
                })
                return;
            }
            if (!f.contrato) {
                Swal({
                    type: 'error',
                    title: 'Opss..',
                    text: 'Ingrese el identificador de servicio',
                    timer: 4000
                })
                return;
            }
            if (!f.perfil) {
                Swal({
                    type: 'error',
                    title: 'Opss..',
                    text: 'Ingrese el perfil, plan o Equipment ID',
                    timer: 4000
                }).then(() => {
                    $("#perfil").focus();
                })
                return;
            }

            if (!f.uen) {
                Swal({
                    type: 'error',
                    title: 'Opss..',
                    text: 'Seleccione el UEN',
                    timer: 4000
                })
                return;
            }

            if (!f.proceso) {
                Swal({
                    type: 'error',
                    title: 'Opss..',
                    text: 'Seleccione el proceso',
                    timer: 4000
                }).then(() => {
                    $("#proceso").focus();
                })
                return;
            }

            if (!f.tecnologia) {
                Swal({
                    type: 'error',
                    title: 'Opss..',
                    text: 'Seleccione la tecnología',
                    timer: 4000
                }).then(() => {
                    $("#tecnologia").focus();
                })
                return;
            }

            if (!f.accion) {
                Swal({
                    type: 'error',
                    title: 'Opss..',
                    text: 'Seleccione la acción',
                    timer: 4000
                }).then(() => {
                    $("#accion").focus();
                })
                return;
            }

            if (!f.motivo) {
                Swal({
                    type: 'error',
                    title: 'Opss..',
                    text: 'Seleccione la motivo',
                    timer: 4000
                }).then(() => {
                    $("#motivo").focus();
                })
                return;
            }

            if (!f.tipoEquipo) {
                Swal({
                    type: 'error',
                    title: 'Opss..',
                    text: 'Seleccione el tipo de equipo',
                    timer: 4000
                }).then(() => {
                    $("#tipoEquipo").focus();
                })
                return;
            }

            if (!f.remite) {
                Swal({
                    type: 'error',
                    title: 'Opss..',
                    text: 'Seleccione el remitente',
                    timer: 4000
                }).then(() => {
                    $("#remite").focus();
                })
                return;
            }

            if (!f.observacion) {
                Swal({
                    type: 'error',
                    title: 'Opss..',
                    text: 'Ingrese la observación',
                    timer: 4000
                }).then(() => {
                    $("#observacion").focus();
                })
                return;
            }

            f.usuario_guarda = $rootScope.login;
            f.id = $rootScope.galletainfo.id;

            let equiposIn = "";
            let equiposOut = "";
            let sep = "";
            for (var equipo of $scope.equiposEntran) {
                if (equipo.value == undefined || equipo.value == "undefined") continue;
                else {
                    equiposIn = equiposIn + sep + equipo.value;
                    sep = "-";
                }
            }
            sep = "";
            for (var equipo of $scope.equiposSalen) {
                if (equipo.value == undefined || equipo.value == "undefined") continue;
                else {
                    equiposOut = equiposOut + sep + equipo.value;
                    sep = "-";
                }
            }

            f.macEntra = equiposIn;
            f.macSale = equiposOut;

            services.myService(f, 'contingenciaCtrl.php', 'savecontingencia').then((data) => {
                if (data.data.state) {
                    Swal({
                        type: 'success',
                        title: 'Muy Bien',
                        text: data.data.msj,
                        timer: 4000
                    }).then(() => {
                        $route.reload();
                    })
                } else {
                    Swal({
                        type: 'error',
                        title: 'Opss...',
                        text: data.data.msj,
                        timer: 4000
                    })
                }
            }).catch((e) => {
                console.log(e)
            })

        }

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

        /*$scope.updateEnGestion = function () {
            services.UpdatePedidosEngestion($rootScope.galletainfo).then(
                function (data) {
                    if (data.data.state != 1) {

                    } else {

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
        };*/

        /*$scope.GuardarContingencia = function (contingencias) {
            contingencias.usuario_guarda = $rootScope.login;
            console.log(contingencias);
            return;
            $("#guardaPedidoContingencia").attr("disabled", true);

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
        };*/

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

        /*$scope.updateContingencias = setInterval(function () {
            $scope.updateEnGestion();
        }, 300000);

        $scope.$on("$destroy", function (event) {
            $timeout.cancel();
            clearInterval($scope.updateContingencias);
        });

        $scope.updateEnGestion();*/
    }
})();
