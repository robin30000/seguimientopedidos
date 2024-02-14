(function () {
    "use strict";
    angular.module("seguimientopedidos").controller("GestioncontingenciasCtrl", GestioncontingenciasCtrl);
    GestioncontingenciasCtrl.$inject = ["$scope", "$rootScope", "services", "$http", "$route", "$cookies", "$location", "$timeout"];

    function GestioncontingenciasCtrl(
        $scope,
        $rootScope,
        services,
        $http,
        $route,
        $cookies,
        $location,
        $timeout
    ) {
        $scope.rutaCierreMasivoContin =
            "partial/modals/cierreMasivoContingencias.html";
        $scope.haypedidoOtros = false;
        $scope.haypedidoTV = false;
        $scope.loadingData = false;
        $scope.haypedidoPortafolio = false;
        $scope.haypedidoCEQPortafolio = false;
        $scope.status = true;
        $scope.sinPedido = false;
        $scope.isContingenciesFromField = false;
        $scope.contingenciesDataTV = [];
        $scope.contingenciesDataInternetToIP = [];
        $scope.contingenciasTV = [];
        $scope.contingenciasOTROS = [];
        $scope.cantidadContingenciasTV = 0;
        $scope.cantidadContingenciasINT = 0;
        $scope.tipoTarea = 'Todos'

        resumenContingencias();


        $scope.bb8 = function (pedido) {
            $scope.bb8Internet = 0;
            $scope.bb8Telefonia = 0;
            $scope.bb8Television = 0;

            console.log(pedido);
            services.windowsBridge("BB8/contingencias/Buscar/GetClick/" + pedido)
                //"http://10.100.66.254:8080/BB8/contingencias/Buscar/GetClick/" + pedido;

                .then(function (data) {
                    console.log('bb8', data);
                    $scope.clic = data.data[0];
                    $scope.UNEPedido = $scope.clic.UNEPedido;
                    $scope.Estado = $scope.clic.Estado;
                    $scope.TipoEquipo = $scope.clic.TipoEquipo;
                    $scope.Categoria = $scope.clic.TTC;
                    $scope.Sistema = $scope.clic.UNESourceSystem;
                    $scope.UNEMunicipio = $scope.clic.UNEMunicipio;
                    $scope.UNENombreCliente = $scope.clic.UNENombreCliente;
                    $scope.UNEIdCliente = $scope.clic.UNEIdCliente;
                    $scope.ID_GIS = $scope.clic.UNECodigoDireccionServicio;
                    $scope.Estado = $scope.clic.Estado;
                    $scope.CRM = $scope.clic.TT;
                    $scope.paquete = '';

                    services.windowsBridge("BB8/contingencias/Buscar/GetPlanBaMSS/" + pedido)
                        // "http://10.100.66.254:8080/BB8/contingencias/Buscar/GetPlanBaMSS/" +
                        // pedido;

                        .then(function (data) {
                            console.log('internet', data)
                            if (data.data.length > 0) {
                                $scope.NAT = 'SI';
                                $scope.bb8Internet = 1;
                                $scope.recorreinternet = data.data;

                                for (let i = 0; i < $scope.recorreinternet.length; i++) {
                                    if ($scope.recorreinternet[i].VALUE_LABEL == 'Qty') {
                                        $scope.Velocidad = $scope.recorreinternet[i].VALID_VALUE;
                                    }
                                    if ($scope.recorreinternet[i].VALUE_LABEL == 'IdServicio') {
                                        $scope.IDServicioInternet = $scope.recorreinternet[i].VALID_VALUE;
                                    }
                                }

                            } else {
                                services.windowsBridge("BB8/contingencias/Buscar/GetPlanBaMSS/" + $scope.ID_GIS)
                                    .then(function (data) {
                                        console.log(data, " internet2 ");
                                        if (data.data.length > 0) {
                                            $scope.NAT = 'SI';
                                            $scope.bb8Internet = 1;
                                            $scope.recorreinternet = data.data;

                                            for (let i = 0; i < $scope.recorreinternet.length; i++) {
                                                if ($scope.recorreinternet[i].VALUE_LABEL == 'Qty') {
                                                    $scope.Velocidad = $scope.recorreinternet[i].VALID_VALUE;
                                                }
                                                if ($scope.recorreinternet[i].VALUE_LABEL == 'IdServicio' || $scope.recorreinternet[i].VALUE_LABEL == 'IdServicioRel') {
                                                    $scope.IDServicioInternet = $scope.recorreinternet[i].VALID_VALUE;
                                                }
                                            }
                                        }
                                    });
                            }
                            services.windowsBridge("BB8/contingencias/Buscar/GetPlanTOMSS/" + pedido)
                                .then(function (data) {
                                    console.log(data, " telefonia");
                                    if (data.data.length > 0) {
                                        $scope.bb8Telefonia = 1;
                                        $scope.recorretelefonia = data.data;
                                        $scope.Linea = $scope.recorretelefonia[0].LINEA;
                                        for (let i = 0; i < $scope.recorretelefonia.length; i++) {
                                            if ($scope.recorretelefonia[i].VALUE_LABEL == 'IdServicio') {
                                                $scope.IDServicioTele = $scope.recorretelefonia[i].VALID_VALUE;
                                            }
                                            if ($scope.recorretelefonia[i].VALUE_LABEL == 'PlataformaTOIP') {
                                                $scope.Plataforma = $scope.recorretelefonia[i].VALID_VALUE;
                                            }
                                        }
                                    } else {
                                        services.windowsBridge("BB8/contingencias/Buscar/GetPlanTOMSS/" + $scope.ID_GIS)
                                            .then(function (data) {
                                                console.log(data, " telefonia2");
                                                if (data.data.length > 0) {
                                                    $scope.bb8Telefonia = 1;
                                                    $scope.recorretelefonia = data.data;
                                                    $scope.Linea = $scope.recorretelefonia[0].LINEA;
                                                    for (let i = 0; i < $scope.recorretelefonia.length; i++) {

                                                        if ($scope.recorretelefonia[i].VALUE_LABEL == 'IdServicio') {
                                                            $scope.IDServicioTele = $scope.recorretelefonia[i].VALID_VALUE;
                                                        }
                                                        if ($scope.recorretelefonia[i].VALUE_LABEL == 'PlataformaTOIP') {
                                                            $scope.Plataforma = $scope.recorretelefonia[i].VALID_VALUE;
                                                        }
                                                    }
                                                }
                                            });
                                    }
                                    services.windowsBridge("BB8/contingencias/Buscar/GetPlanTVMSS/" + pedido)
                                        .then(function (data) {
                                            console.log(data, " tv");
                                            if (data.data.length > 0) {
                                                $scope.bb8Television = 1;
                                                $scope.recore = data.data;
                                                for (let i = 0; i < $scope.recore.length; i++) {
                                                    if ($scope.recore[i].VALUE_LABEL == 'IdServicio') {
                                                        $scope.IDServicioTV = $scope.recore[i].VALID_VALUE;
                                                    }
                                                    if ($scope.recore[i].VALUE_LABEL == 'productId') {
                                                        $scope.productIdTV = $scope.recore[i].VALID_VALUE;
                                                    }
                                                    if ($scope.recore[i].ITEM_ALIAS == 'PaqueteTV') {

                                                        $scope.paquete += $scope.recore[i].VALUE_LABEL + '|' + $scope.recore[i].VALID_VALUE + '\n\n';
                                                    }

                                                }
                                                $scope.paquete = $scope.paquete.replace('undefined', '');

                                            } else {
                                                services.windowsBridge("BB8/contingencias/Buscar/GetPlanTVMSS/" + $scope.ID_GIS)
                                                    .then(function (data) {
                                                        console.log(data, " tv2");
                                                        if (data.data.length > 0) {
                                                            $scope.bb8Television = 1;
                                                            $scope.recore = data.data;
                                                            for (let i = 0; i < $scope.recore.length; i++) {
                                                                if ($scope.recore[i].VALUE_LABEL == 'IdServicio') {
                                                                    $scope.IDServicioTV = $scope.recore[i].VALID_VALUE;
                                                                }
                                                                if ($scope.recore[i].VALUE_LABEL == 'productId') {
                                                                    $scope.productIdTV = $scope.recore[i].VALID_VALUE;
                                                                }

                                                                if ($scope.recore[i].ITEM_ALIAS == 'PaqueteTV') {
                                                                    $scope.paquete += $scope.recore[i].VALUE_LABEL + '|' + $scope.recore[i].VALID_VALUE + '\n\n';
                                                                }

                                                            }
                                                            $scope.paquete = $scope.paquete.replace('undefined', '');

                                                        }
                                                    });
                                            }
                                            $("#modalbb8").modal("show");
                                        })
                                        .catch(function (error) {
                                            console.log(error);
                                        });
                                })
                                .catch(function (error) {
                                    console.log(error);
                                });
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                })
                .catch(function (error) {
                    console.log(error);
                });
        };

        var tiempo = new Date().getTime();
        var date1 = new Date();
        var year = date1.getFullYear();
        var month =
            date1.getMonth() + 1 <= 9
                ? "0" + (date1.getMonth() + 1)
                : date1.getMonth() + 1;
        var day = date1.getDate() <= 9 ? "0" + date1.getDate() : date1.getDate();

        tiempo = year + "-" + month + "-" + day;

        $scope.fechaupdateInical = tiempo;
        $scope.fechaupdateFinal = tiempo;

        $scope.damePedido = () => {
            services.myService($rootScope.login, 'contingenciaCtrl.php', 'damePedido').then((data) => {
                console.log(data.data.reiterativo)
                if (data.data.state) {
                    if (data.data.reiterativo === 'TRUE') {
                        swal({
                            type: "warning",
                            title: "Atención",
                            text: "esta tarea ha ingresado mas de una vez a este modulo, por favor validar la solicitud en detalle, observaciones, interacción(es) anterior(es) para evitar que ingrese de nuevo. si crees pertinente escala a tu supervisor",
                            showCancelButton: false,
                            confirmButtonText: "Aceptar",
                        }).then(() => {

                            swal({
                                type: "success",
                                title: data.data.title,
                                text: data.data.text,
                                timer: 4000,
                            }).then(() => {
                                $scope.gestioncontingencias();
                            })
                        })
                    } else {
                        let indice = data.data.text.indexOf("Se le asigna la tarea");
                        if (indice === 0) {
                            $timeout(function () {
                                mostrarSweetAlert();
                            }, 600000);
                        }
                        swal({
                            type: "success",
                            title: data.data.title,
                            text: data.data.text,
                            timer: 4000,
                        }).then(() => {
                            $scope.gestioncontingencias();
                        })
                    }
                } else {
                    swal({
                        type: "error",
                        title: data.data.title,
                        text: data.data.text,
                        timer: 4000,
                    })
                }
            }).catch((e) => {
                console.log(e)
            })
        }

        $scope.gestioncontingencias = () => {
            $scope.loadingData = true;

            services
                .datosgestioncontingencias()
                .then(function (data) {
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
                    } else {
                        $scope.loadingData = false;
                        //console.log(data.data.data, ' pepe')
                        $scope.contingenciasTV = data.data.data
                        console.log($scope.contingenciasTV)

                        /*$scope.contingenciasOTROS =
                            $scope.contingenciesDataInternetToIP.concat(data.data.data[1]);

                        $scope.contingenciasPortafolio = data.data.data[2];*/

                        var TV = $scope.contingenciasTV.map((doc) => doc.horagestion);

                        /*var OTROS = $scope.contingenciasOTROS.map((doc) => doc.horagestion);
                        var CPORTAFOLIO = $scope.contingenciasPortafolio.map(
                            (doc) => doc.horagestion
                        );*/

                        function js_yyyy_mm_dd_hh_mm_ss() {
                            let now = new Date();
                            year = "" + now.getFullYear();
                            month = "" + (now.getMonth() + 1);
                            if (month.length == 1) {
                                month = "0" + month;
                            }
                            day = "" + now.getDate();
                            if (day.length == 1) {
                                day = "0" + day;
                            }
                            let hour = "" + now.getHours();
                            if (hour.length == 1) {
                                hour = "0" + hour;
                            }
                            let minute = "" + now.getMinutes();
                            if (minute.length == 1) {
                                minute = "0" + minute;
                            }
                            let second = "" + now.getSeconds();
                            if (second.length == 1) {
                                second = "0" + second;
                            }
                            return (
                                year +
                                "-" +
                                month +
                                "-" +
                                day +
                                " " +
                                hour +
                                ":" +
                                minute +
                                ":" +
                                second
                            );
                        }

                        $scope.hora_sistema = js_yyyy_mm_dd_hh_mm_ss();

                        TV.forEach(function (valor, indice) {
                            $scope.diferencia =
                                new Date(js_yyyy_mm_dd_hh_mm_ss()) - new Date(TV[indice]);

                            if ($scope.diferencia > 900000) {
                                $scope.indice = indice;
                                $scope.quinceminutos = [];
                                $scope.quinceminutos[$scope.indice] = TV[$scope.indice];
                            }
                        });

                        /*OTROS.forEach(function (valor, indice) {
                            $scope.diferencia =
                                new Date(js_yyyy_mm_dd_hh_mm_ss()) - new Date(OTROS[indice]);

                            if ($scope.diferencia > 900000) {
                                $scope.indice = indice;
                                $scope.quinceminutos = new Array();
                                $scope.quinceminutos[$scope.indice] = OTROS[$scope.indice];
                            }
                        });

                        CPORTAFOLIO.forEach(function (valor, indice) {
                            $scope.diferencia =
                                new Date(js_yyyy_mm_dd_hh_mm_ss()) -
                                new Date(CPORTAFOLIO[indice]);

                            if ($scope.diferencia > 900000) {
                                $scope.indice = indice;
                                $scope.quinceminutos = new Array();
                                $scope.quinceminutos[$scope.indice] = CPORTAFOLIO[$scope.indice];
                            }
                        });*/

                        if ($scope.contingenciasTV.length !== 0) {
                            $scope.haypedidoTV = true;
                        } else {
                            $scope.haypedidoTV = false;
                            $scope.mensaje = "No hay pedidos para gestionar!!!";
                        }

                        /*if ($scope.contingenciasOTROS.length !== 0) {
                            $scope.haypedidoOtros = true;
                        } else {
                            $scope.haypedidoOtros = false;
                            $scope.mensajeotros = "No hay pedidos para gestionar!!!";
                        }

                        if ($scope.contingenciasPortafolio.length !== 0) {
                            $scope.haypedidoPortafolio = true;
                        } else {
                            $scope.haypedidoPortafolio = false;
                            $scope.mensajeotros = "No hay pedidos prioritarios!!!";
                        }*/

                        return data.data;
                    }

                })
                .catch(function (err) {
                    console.log(err);
                });
        };

        $scope.muestraModalObservacion = (data) => {
            $scope.observacionContingencia = data;
            $("#modalObservaciones").modal('show');
        }

        $scope.consultaTipoTarea = (d) => {
            services.myService(d, 'contingenciaCtrl.php', 'consultaTipoTarea').then((data) => {
                $scope.taskType = data.data;
            }).catch((e) => {
                console.log(e)
            })
        }

        $scope.CopyPortaPapeles = function (data) {
            var copyTextTV = document.createElement("input");
            copyTextTV.value = data;
            document.body.appendChild(copyTextTV);
            copyTextTV.select();
            document.execCommand("copy");
            document.body.removeChild(copyTextTV);
            Swal({
                type: "info",
                title: "Aviso",
                text: "El texto seleccionado fue copiado",
                timer: 2000,
            });
        };

        $scope.autocompletarContingencia = async (data) => {
            var contingencia = {};
            try {
                var autocompleteQuery = await services.windowsBridge("HCHV_DEV/BuscarB/" + data.references);
                //fetch(
                //    "http://10.100.66.254:8080/HCHV_DEV/BuscarB/" + data.references
                //);
                var autocompleteData = await autocompleteQuery.json();
                var equiposIn = "";
                var equiposOut = "";
                var sep = "";

                contingencia.accion = data.contingencies_Type;
                contingencia.ciudad = autocompleteData.uNEMunicipio
                    ? autocompleteData.uNEMunicipio.toUpperCase()
                    : "";
                contingencia.correo = data.user_email;
                contingencia.fecha = data.contingencies_Date.toDate();
                contingencia.macEntra = data.macIn;
                contingencia.macSale = data.macOut;
                contingencia.observacion = data.details;
                contingencia.pedido = data.references;
                contingencia.proceso = autocompleteData.TaskType;
                contingencia.remite = data.remite;

                contingencia.producto = data.product;
                contingencia.uen = autocompleteData.uNEUen;
                contingencia._id = data._id;

                for (var equipo of contingencia.macEntra) {
                    if (equipo.name == undefined || equipo.name == "undefined") continue;
                    else {
                        equiposIn = equiposIn + sep + equipo.name;
                        sep = "-";
                    }
                }
                sep = "";
                contingencia.macEntra = equiposIn;

                for (var equipo of contingencia.macSale) {
                    if (equipo.name == undefined || equipo.name == "undefined") continue;
                    else {
                        equiposOut = equiposOut + sep + equipo.name;
                        sep = "-";
                    }
                }
                contingencia.macSale = equiposOut;

                if (data.remite != "Teléfonos Públicos") {
                    if (
                        (autocompleteData.Type == "Install" ||
                            autocompleteData.Type == "Traslado") &&
                        (autocompleteData.RTA == "NA" || autocompleteData.RTA == "N")
                    ) {
                        if (data.user_identification != autocompleteData.engineerID) {
                            swal({
                                title: "Aviso Importante: ",
                                html: "El pedido no concuerda con el técnico que solicita su gestión ni tampoco ha sido gestionado a través de Click.",
                                type: "warning",
                                showCancelButton: false,
                                confirmButtonColor: "#3085d6",
                                confirmButtonText: "Sí, Lo tengo presente!",
                            });
                        } else {
                            swal({
                                title: "Aviso Importante: ",
                                html: "El pedido no ha sido gestionado a través Click.",
                                type: "warning",
                                showCancelButton: false,
                                confirmButtonColor: "#3085d6",
                                confirmButtonText: "Sí, Lo tengo presente!",
                            });
                        }
                    } else if (
                        autocompleteData.Type == "Repair" &&
                        (autocompleteData.MAC == "" || autocompleteData.MAC == null) &&
                        autocompleteData.RTA3 == null
                    ) {
                        if (data.user_identification != autocompleteData.engineerID) {
                            swal({
                                title: "Aviso Importante: ",
                                html: "El pedido no concuerda con el técnico que solicita su gestión ni tampoco ha sido gestionado a través de Click.",
                                type: "warning",
                                showCancelButton: false,
                                confirmButtonColor: "#3085d6",
                                confirmButtonText: "Sí, Lo tengo presente!",
                            });
                        } else {
                            swal({
                                title: "Aviso Importante: ",
                                html: "El pedido no ha sido gestionado a través Click.",
                                type: "warning",
                                showCancelButton: false,
                                confirmButtonColor: "#3085d6",
                                confirmButtonText: "Sí, Lo tengo presente!",
                            });
                        }
                    } else {
                        if (
                            autocompleteData.Description == null ||
                            autocompleteData.LaborType == "1166073856"
                        ) {
                            if (data.user_identification != autocompleteData.engineerID) {
                                swal({
                                    title: "Aviso Importante: ",
                                    html: "El pedido no concuerda con el técnico que solicita su gestión ni tampoco ha sido gestionado a través de Sara.",
                                    type: "warning",
                                    showCancelButton: false,
                                    confirmButtonColor: "#3085d6",
                                    confirmButtonText: "Sí, Lo tengo presente!",
                                });
                            } else {
                                swal({
                                    title: "Aviso Importante: ",
                                    html: "El pedido no ha sido gestionado a través de Sara.",
                                    type: "warning",
                                    showCancelButton: false,
                                    confirmButtonColor: "#3085d6",
                                    confirmButtonText: "Sí, Lo tengo presente!",
                                });
                            }
                        } else if (
                            data.user_identification != autocompleteData.engineerID
                        ) {
                            swal({
                                title: "Aviso Importante: ",
                                html: "El pedido no concuerda con el técnico que solicita su gestión.",
                                type: "warning",
                                showCancelButton: false,
                                confirmButtonColor: "#3085d6",
                                confirmButtonText: "Sí, Lo tengo presente!",
                            });
                        }
                    }

                    if (autocompleteData.Type == null) {
                        if (data.user_identification != autocompleteData.engineerID) {
                            swal({
                                title: "Aviso Importante: ",
                                html: "El pedido no concuerda con el técnico que solicita su gestión y no ha sido diligenciado en click.",
                                type: "warning",
                                showCancelButton: false,
                                confirmButtonColor: "#3085d6",
                                confirmButtonText: "Sí, Lo tengo presente!",
                            });
                        } else {
                            swal({
                                title: "Aviso Importante: ",
                                html: "El pedido no ha sido diligenciado en click.",
                                type: "warning",
                                showCancelButton: false,
                                confirmButtonColor: "#3085d6",
                                confirmButtonText: "Sí, Lo tengo presente!",
                            });
                        }
                    }
                }

                var queryIsAlreadyToken = database
                    .collection("contingencies")
                    .doc(data._id);
                var querySnapshotAT = await queryIsAlreadyToken.get();
                if (querySnapshotAT.data().status == 1) {
                    swal({
                        title: "Este pedido ya ha sido tomado: ",
                        html: `El pedido ${data.pedido} que ha seleccionado, ya ha sido tomado.`,
                        type: "warning",
                    });
                } else {
                    var queryUpdateStatus = await database
                        .collection("contingencies")
                        .doc(data._id)
                        .update({status: 1});
                    var querySaveContingency = await services.guardarContingencia(
                        contingencia,
                        $rootScope.galletainfo
                    );
                    $scope.contingenciasTV = [];
                    $scope.contingenciasOTROS = [];
                }
            } catch (error) {
                swal({
                    title: "Información Pedido: ",
                    html: "No encontrado",
                    type: "warning",
                });
                console.log(error);
                return;
            }
        };

        $scope.guardarcontingencia = function (data) {
            if (data.engestion == null) {
                Swal({
                    type: "error",
                    text: "Debes bloquear el pedido",
                });
            } else if (data.tipificacion == undefined) {
                Swal({
                    type: "error",
                    text: "Recuerda seleccionar todas las opciones!!",
                });
            } else {
                $scope.gestioncontin = data;
                $("#editarModal").modal("show");
                return data.data;
            }
        };

        $scope.guardarpedido = function (data) {
            if (data.logincontingencia == null) {
                Swal({
                    type: "error",
                    text: "Debes de marcar la contingencia, antes de guardar!",
                });
            } else if (!data.observacionescontingencia) {
                Swal({
                    type: "error",
                    text: "Debes ingresar las observaciones.",
                });
            } else if (data.observacionescontingencia.length < 30) {
                Swal({
                    type: "error",
                    text: "Debes documentar claramente la razon de la contingencia (minimo 30 caracteres)",
                });
            } else {
                data.login = $rootScope.galletainfo.login
                services
                    .editarregistrocontingencia(data)
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
                        } else if (data.data.state == 3 || data.data.state == 0) {
                            swal({
                                type: "info",
                                title: 'Ops...',
                                text: data.data.text,
                                timer: 4000,
                            })
                        } else if (data.data.state == 1) {
                            swal({
                                type: "success",
                                title: 'Muy bien',
                                text: data.data.text,
                                timer: 4000,
                            }).then(function () {
                                $scope.gestioncontingencias();
                            })
                        }
                    })
                    .catch((err) => alert(err));
                $scope.gestioncontingencias();
            }
        };

        $scope.marcarEngestion = (data) => {
            if (!data) {
                Swal({
                    type: 'info',
                    title: 'Opss...',
                    text: 'Debes marcar el pedido',
                    timer: 4000
                })
            }

            services
                .marcarengestion(data, $rootScope.galletainfo)
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
                    } else if (data.data.state != 1) {
                        swal({
                            type: "info",
                            title: data.data.title,
                            text: data.data.text,
                            timer: 4000,
                        }).then(() => {
                            $scope.gestioncontingencias();
                        })
                    } else if (data.data.state == 1) {
                        if (data.data.text === "El pedido se encuentra bloqueado") {
                            $timeout(function () {
                                mostrarSweetAlert();
                            }, 600000);
                        }
                        swal({
                            type: "success",
                            title: data.data.title,
                            text: data.data.text,
                            timer: 4000,
                        }).then(() => {
                            $scope.gestioncontingencias();
                        })
                    }

                })
                .catch((err) => console.log(err));
        };

        $scope.guardarContingenciaPortafolio = function (data) {
            if (data.enGestionPortafolio == 0) {
                Swal({
                    type: 'info',
                    title: 'Debes bloquear el pedido',
                    text: msg,
                    timer: 4000
                })
            } else if (data.tipificacionPortafolio == "") {
                Swal({
                    type: 'info',
                    title: 'Recuerda seleccionar todas las opciones!!',
                    text: msg,
                    timer: 4000
                })
            } else {
                $scope.gestioncontinPortafilio = data;
                $("#editarModalPortafolio").modal("show");
                return data.data;
            }
        };

        $scope.guardarpedidoPortafolio = function (data) {
            if (!data.observContingenciaPortafolio) {
                Swal({
                    type: 'info',
                    title: 'Debes ingresar las observaciones.',
                    text: msg,
                    timer: 4000
                })
            } else {
                Swal({
                    type: 'info',
                    title: 'Pedido guardado, recuerda actualizar!!',
                    text: msg,
                    timer: 4000
                })
                services
                    .editarRegistroContingenciaPortafolio(data, $rootScope.galletainfo)
                    .then(function (data) {
                    });
                $scope.gestioncontingencias();
            }
        };

        $scope.marcarEnGestionPortafolio = function (data) {
            services
                .marcarEnGestionPorta(data, $rootScope.galletainfo)
                .then(function (data) {
                    if (data.data !== "") {
                        if (data.data[0] == "desbloqueado") {
                            $scope.respuestaMarca = data.data[0][0];
                            Swal({
                                type: 'suceess',
                                title: 'Pedido desbloqueado!!',
                                text: msg,
                                timer: 4000
                            })
                            $scope.gestioncontingencias();
                        } else {
                            $scope.respuestaMarca = data.data[0][0];
                            if ($scope.respuestaMarca.logincontingencia) {
                                Swal({
                                    type: 'suceess',
                                    title: 'El pedido se encuentra bloqueado.',
                                    text: msg,
                                    timer: 4000
                                })
                            } else {
                                Swal({
                                    type: 'suceess',
                                    title: 'El pedido se encuentra bloqueado.',
                                    text: msg,
                                    timer: 4000
                                })
                            }

                            $scope.gestioncontingencias();
                            return;
                        }
                    } else if (data.data == "") {
                        $scope.respuestaMarca = "";
                        Swal({
                            type: 'suceess',
                            title: 'Pedido bloqueado!!!',
                            text: msg,
                            timer: 4000
                        })
                        $scope.gestioncontingencias();
                    }
                });
        };

        $scope.buscarPedidoContingencia = function (pedido) {
            if (!pedido) {
                Swal({
                    type: 'error',
                    title: 'Oppss...',
                    text: 'Debes ingresar una tarea',
                    timer: 4000
                })
            } else {
                services.myService(pedido, 'otrosServiciosCtrl.php', 'buscarPedidoContingencias').then((data) => {
                    if (data.data.state) {
                        $scope.databsucarPedido = data.data.data;
                        $scope.dataPedido = true;
                    } else {
                        swal({
                            type: "error",
                            title: 'Oppss...',
                            text: data.data.msj,
                            timer: 4000,
                        })
                    }
                }).catch((e) => {
                    console.log(e)
                })
            }
        };

        $scope.resumenContingencias = () => {
            $scope.fecha = {};
            resumenContingencias();
        }

        $scope.pageChanged = function () {
            let data = {page: $scope.currentPage, size: $scope.pageSize, fecha: $scope.resumen};
            resumenContingencias(data);
        };
        $scope.pageSizeChanged = function () {
            let data = {page: $scope.currentPage, size: $scope.pageSize, fecha: $scope.resumen};
            resumenContingencias(data);
        };

        function resumenContingencias(data) {
            if (data === "" || data === undefined) {
                $scope.currentPage = 1;
                $scope.totalItems = 0;
                $scope.pageSize = 15;
                $scope.searchText = "";
                data = {page: $scope.currentPage, size: $scope.pageSize, fecha: $scope.fecha};
            }
            services.getresumenContingencias(data).then(
                function (data) {
                    $scope.dataresumenContingencias = data.data[0];
                    $scope.dataresumenContingenciasTV = data.data[6];
                    $scope.dataresumenContingenciasInTo = data.data[7];
                    $scope.estados = data.data[1];
                    $scope.estadosCP = data.data[3];
                    $scope.dia = data.data[2];
                    $scope.diaCP = data.data[4];
                    $scope.taskType = data.data[9];

                    var tam = $scope.dataresumenContingencias.length;
                    $scope.Totaltotal_pedidos_aceptados = 0;
                    $scope.Totaltotal_pedidos_pendientes = 0;
                    $scope.Totaltotal_pedidos_rechazados = 0;

                    $scope.cantidad = data.data[0].length;
                    $scope.counter = data.data[8];

                    $scope.totalItems = data.data[8];
                    $scope.startItem = ($scope.currentPage - 1) * $scope.pageSize + 1;
                    $scope.endItem = $scope.currentPage * $scope.pageSize;
                    if ($scope.endItem > data.data.counter) {
                        $scope.endItem = data.data.counter;
                    }

                    for (var i = 0; i < tam; i++) {
                        if ($scope.dataresumenContingencias[i].estado == "Acepta") {
                            $scope.Totaltotal_pedidos_aceptados =
                                +$scope.Totaltotal_pedidos_aceptados + 1;
                        }
                        if ($scope.dataresumenContingencias[i].estado == "Rechaza") {
                            $scope.Totaltotal_pedidos_rechazados =
                                +$scope.Totaltotal_pedidos_rechazados + 1;
                        }
                        if ($scope.dataresumenContingencias[i].estado == "Pendiente") {
                            $scope.Totaltotal_pedidos_pendientes =
                                +$scope.Totaltotal_pedidos_pendientes + 1;
                        }
                    }

                    var tam1 = $scope.dataresumenContingenciasTV.length;
                    $scope.Totaltotal_pedidos_aceptadosTV = 0;
                    $scope.Totaltotal_pedidos_pendientesTV = 0;
                    $scope.Totaltotal_pedidos_rechazadosTV = 0;
                    $scope.Total_Personas_GestionandoTV = 0;
                    $scope.LoginsGestionandoTV = [];
                    var indiceTV = 0;

                    for (var i = 0; i < tam1; i++) {
                        if ($scope.dataresumenContingenciasTV[i].estado == "Acepta") {
                            $scope.Totaltotal_pedidos_aceptadosTV =
                                +$scope.Totaltotal_pedidos_aceptadosTV + 1;
                        }
                        if ($scope.dataresumenContingenciasTV[i].estado == "Rechaza") {
                            $scope.Totaltotal_pedidos_rechazadosTV =
                                +$scope.Totaltotal_pedidos_rechazadosTV + 1;
                        }
                        if ($scope.dataresumenContingenciasTV[i].estado == "Pendiente") {
                            $scope.Totaltotal_pedidos_pendientesTV =
                                +$scope.Totaltotal_pedidos_pendientesTV + 1;
                        }
                    }
                    $scope.Totaltotal_pedidos_pendientesTV +=
                        $scope.cantidadContingenciasTV;
                    for (var i = 0; i < tam1; i++) {
                        if (
                            $scope.dataresumenContingenciasTV[i].estado == "Pendiente" &&
                            $scope.dataresumenContingenciasTV[i].logincontingencia !== null &&
                            $scope.dataresumenContingenciasTV[i].estado == "Pendiente" &&
                            $scope.dataresumenContingenciasTV[i].logincontingencia !== ""
                        ) {
                            $scope.LoginsGestionandoTV[indiceTV] =
                                $scope.dataresumenContingenciasTV[i].logincontingencia;
                            indiceTV = indiceTV + 1;
                        }
                    }
                    $scope.Total_Personas_GestionandoTV =
                        $scope.LoginsGestionandoTV.filter(
                            (v, i, a) => a.indexOf(v) === i
                        ).length;

                    const cantAnalistasTV = $scope.LoginsGestionandoTV.reduce(
                        (contadorAnalistasTV, indiceTV) => {
                            contadorAnalistasTV[indiceTV] =
                                (contadorAnalistasTV[indiceTV] || 0) + 1;
                            return contadorAnalistasTV;
                        },
                        {}
                    );

                    $scope.cantidadAnalistasTV = cantAnalistasTV;

                    var tam2 = $scope.dataresumenContingenciasInTo.length;
                    $scope.Totaltotal_pedidos_aceptadosInTo = 0;
                    $scope.Totaltotal_pedidos_pendientesInTo = 0;
                    $scope.Totaltotal_pedidos_rechazadosInTo = 0;
                    $scope.Total_Personas_GestionandoInternet = 0;
                    $scope.LoginsGestionandoInternet = [];
                    var indiceInternet = 0;

                    for (var i = 0; i < tam2; i++) {
                        if ($scope.dataresumenContingenciasInTo[i].estado == "Acepta") {
                            $scope.Totaltotal_pedidos_aceptadosInTo =
                                +$scope.Totaltotal_pedidos_aceptadosInTo + 1;
                        }
                        if ($scope.dataresumenContingenciasInTo[i].estado == "Rechaza") {
                            $scope.Totaltotal_pedidos_rechazadosInTo =
                                +$scope.Totaltotal_pedidos_rechazadosInTo + 1;
                        }
                        if ($scope.dataresumenContingenciasInTo[i].estado == "Pendiente") {
                            $scope.Totaltotal_pedidos_pendientesInTo =
                                +$scope.Totaltotal_pedidos_pendientesInTo + 1;
                        }
                    }
                    $scope.Totaltotal_pedidos_pendientesInTo +=
                        $scope.cantidadContingenciasINT;
                    for (var i = 0; i < tam2; i++) {
                        if (
                            $scope.dataresumenContingenciasInTo[i].estado == "Pendiente" &&
                            $scope.dataresumenContingenciasInTo[i].logincontingencia !==
                            null &&
                            $scope.dataresumenContingenciasInTo[i].estado == "Pendiente" &&
                            $scope.dataresumenContingenciasInTo[i].logincontingencia !== ""
                        ) {
                            $scope.LoginsGestionandoInternet[indiceInternet] =
                                $scope.dataresumenContingenciasInTo[i].logincontingencia;
                            indiceInternet = indiceInternet + 1;
                        }
                    }
                    $scope.Total_Personas_GestionandoInternet =
                        $scope.LoginsGestionandoInternet.filter(
                            (v, i, a) => a.indexOf(v) === i
                        ).length;

                    const cantAnalistasInt = $scope.LoginsGestionandoInternet.reduce(
                        (contadorAnalistasInternet, indiceInternet) => {
                            contadorAnalistasInternet[indiceInternet] =
                                (contadorAnalistasInternet[indiceInternet] || 0) + 1;
                            return contadorAnalistasInternet;
                        },
                        {}
                    );

                    $scope.cantidadAnalistasInt = cantAnalistasInt;

                    return data.data;
                },
                function errorCallback(response) {
                }
            );
        };

        $scope.descargarContingencias = function (data) {
            if (!data) {
                Swal({
                    type: 'error',
                    title: 'Oppss...',
                    text: 'Ingresa la fecha inicial',
                    timer: 4000
                })
                return;
            }
            if (!data.fechaupdateFinal) {
                Swal({
                    type: 'error',
                    title: 'Oppss...',
                    text: 'Ingresa la fecha final',
                    timer: 4000
                })
                return;
            }
            if (data.fechaupdateFinal < data.fechaupdateInical) {
                Swal({
                    type: 'error',
                    title: 'Oppss...',
                    text: 'La fecha inicial no puede ser mayor que la fecha final',
                    timer: 4000
                })
                return;
            }
            $scope.loading = true;
            services
                .myService(data, 'contingenciaCtrl.php', 'csvContingencias')
                .then(function (data) {
                    if (data.data.state) {
                        $scope.loading = false;
                        var wb = XLSX.utils.book_new();
                        var ws = XLSX.utils.json_to_sheet(data.data.data);
                        XLSX.utils.book_append_sheet(wb, ws, 'contingencias');
                        XLSX.writeFile(wb, 'Contingencias_' + tiempo + '.xlsx'); // Descarga el a
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

        };

        $scope.callModalCierreMasivoConti = function () {
            angular.copy();
            $("#cierreMasivoContingencias").modal();
        };

        $scope.cierreMasivoContingencias = function (
            dataCierreMasivoContin,
            frmCierreMasivoContin
        ) {
            if (
                dataCierreMasivoContin.TV != true &&
                dataCierreMasivoContin.Internet != true &&
                dataCierreMasivoContin.ToIP != true &&
                dataCierreMasivoContin.InternetToIP != true
            ) {
                swal("Debe seleccionar mínimo un producto.");
                return;
            }

            if (
                dataCierreMasivoContin.Instalaciones != true &&
                dataCierreMasivoContin.Reparaciones != true
            ) {
                console.log("Punto " + dataCierreMasivoContin.Instalaciones);
                swal("Debe seleccionar mínimo un proceso.");
                return;
            }

            if (
                dataCierreMasivoContin.AprovisionarContin != true &&
                dataCierreMasivoContin.Refresh != true &&
                dataCierreMasivoContin.CambioEquipo != true &&
                dataCierreMasivoContin.CambioEID != true &&
                dataCierreMasivoContin.RegistrosToIP != true
            ) {
                swal("Debe seleccionar mínimo una acción.");
                return;
            }

            Swal.fire({
                title:
                    "¿Está seguro que desea cancelar de forma masiva las contigencias?",
                text: "no podrás revertir esto!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Sí, Ejecutar Ahora!",
            }).then((result) => {
                if (result.value) {
                    if (
                        frmCierreMasivoContin.TV.$modelValue == undefined ||
                        frmCierreMasivoContin.TV.$modelValue == false
                    ) {
                        dataCierreMasivoContin.TV = "Sin Informacion";
                        console.log("SIN SELECCIONAR: " + dataCierreMasivoContin.TV);
                    } else {
                        dataCierreMasivoContin.TV = $("#TV:checked").val();
                        console.log("SELECCIONADO: " + dataCierreMasivoContin.TV);
                    }

                    if (
                        frmCierreMasivoContin.Internet.$modelValue == undefined ||
                        frmCierreMasivoContin.Internet.$modelValue == false
                    ) {
                        dataCierreMasivoContin.Internet = "Sin Informacion";
                    } else {
                        dataCierreMasivoContin.Internet = $("#Internet:checked").val();
                    }

                    if (
                        frmCierreMasivoContin.ToIP.$modelValue == undefined ||
                        frmCierreMasivoContin.ToIP.$modelValue == false
                    ) {
                        dataCierreMasivoContin.ToIP = "Sin Informacion";
                    } else {
                        dataCierreMasivoContin.ToIP = $("#ToIP:checked").val();
                    }

                    if (
                        frmCierreMasivoContin.InternetToIP.$modelValue == undefined ||
                        frmCierreMasivoContin.InternetToIP.$modelValue == false
                    ) {
                        dataCierreMasivoContin.InternetToIP = "Sin Informacion";
                    } else {
                        dataCierreMasivoContin.InternetToIP = $(
                            "#InternetToIP:checked"
                        ).val();
                    }

                    if (
                        frmCierreMasivoContin.Instalaciones.$modelValue == undefined ||
                        frmCierreMasivoContin.Instalaciones.$modelValue == false
                    ) {
                        dataCierreMasivoContin.Instalaciones = "Sin Informacion";
                    } else {
                        dataCierreMasivoContin.Instalaciones = $(
                            "#Instalaciones:checked"
                        ).val();
                    }

                    if (
                        frmCierreMasivoContin.Reparaciones.$modelValue == undefined ||
                        frmCierreMasivoContin.Reparaciones.$modelValue == false
                    ) {
                        dataCierreMasivoContin.Reparaciones = "Sin Informacion";
                    } else {
                        dataCierreMasivoContin.Reparaciones = $(
                            "#Reparaciones:checked"
                        ).val();
                    }

                    if (
                        frmCierreMasivoContin.AprovisionarContin.$modelValue == undefined ||
                        frmCierreMasivoContin.AprovisionarContin.$modelValue == false
                    ) {
                        dataCierreMasivoContin.AprovisionarContin = "Sin Informacion";
                    } else {
                        dataCierreMasivoContin.AprovisionarContin = $(
                            "#AprovisionarContin:checked"
                        ).val();
                    }

                    if (
                        frmCierreMasivoContin.Refresh.$modelValue == undefined ||
                        frmCierreMasivoContin.Refresh.$modelValue == false
                    ) {
                        dataCierreMasivoContin.Refresh = "Sin Informacion";
                    } else {
                        dataCierreMasivoContin.Refresh = $("#Refresh:checked").val();
                    }

                    if (
                        frmCierreMasivoContin.CambioEquipo.$modelValue == undefined ||
                        frmCierreMasivoContin.CambioEquipo.$modelValue == false
                    ) {
                        dataCierreMasivoContin.CambioEquipo = "Sin Informacion";
                    } else {
                        dataCierreMasivoContin.CambioEquipo = $(
                            "#CambioEquipo:checked"
                        ).val();
                    }

                    if (
                        frmCierreMasivoContin.CambioEID.$modelValue == undefined ||
                        frmCierreMasivoContin.CambioEID.$modelValue == false
                    ) {
                        dataCierreMasivoContin.CambioEID = "Sin Informacion";
                    } else {
                        dataCierreMasivoContin.CambioEID = $("#CambioEID:checked").val();
                    }

                    if (
                        frmCierreMasivoContin.RegistrosToIP.$modelValue == undefined ||
                        frmCierreMasivoContin.RegistrosToIP.$modelValue == false
                    ) {
                        dataCierreMasivoContin.RegistrosToIP = "Sin Informacion";
                        console.log(
                            "SIN SELECCIONART: " + dataCierreMasivoContin.RegistrosToIP
                        );
                    } else {
                        dataCierreMasivoContin.RegistrosToIP = $(
                            "#RegistrosToIP:checked"
                        ).val();
                        console.log(
                            "SELECCIONADOT: " + dataCierreMasivoContin.RegistrosToIP
                        );
                    }

                    console.log(dataCierreMasivoContin);

                    services.cierreMasivoContingencia(dataCierreMasivoContin).then(
                        function (respuesta) {
                            $scope.counter = respuesta.data[0];

                            if (respuesta.status == "200") {
                                if ($scope.counter == 0) {
                                    Swal(
                                        "No se encontraron contingencias con esas condiciones para eliminar!",
                                        "Por favor revisar"
                                    );
                                } else {
                                    Swal(
                                        "Se rechazaron masivamente " +
                                        $scope.counter +
                                        " contingencias!",
                                        "Por favor actualizar"
                                    );
                                }
                            }

                            $("#cierreMasivoContingencias").modal("hide");
                            $scope.cierreMasivoSel = {};

                            frmCierreMasivoContin.autoValidateFormOptions.resetForm();
                        },
                        function errorCallback(response) {
                            if (response.status == "400") {
                                Swal({
                                    type: "error",
                                    title: "Oops...",
                                    text: "Hubo un error",
                                    footer: "¡Escalarlo al administrador!",
                                });
                            }
                        }
                    );
                    $scope.gestioncontingencias();
                }
            });
        };

        $scope.gestioncontingencias();
    }
})();
