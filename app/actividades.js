(function () {
    "use strict";
    angular.module("seguimientopedidos").controller("actividadesCtrl", actividadesCtrl);
    actividadesCtrl.$inject = ["$scope", "$http", "$rootScope", "$location", "$route", "$routeParams", "$cookies", "$timeout", "services"];

    function actividadesCtrl($scope, $http, $rootScope, $location, $route, $routeParams, $cookies, $timeout, services) {
        $scope.iniciaGestion = true;
        $scope.plantillaReparaciones = 0;
        $scope.selectSubAccion = false;
        $scope.errorconexion = "";
        $scope.registrocreado = false;
        $scope.myWelcome = {};
        $scope.listadoSubAcciones = {};
        $scope.planRescate = false;
        $scope.TVdigital1 = false;
        $scope.TVdigital2 = false;
        $scope.TVdigital3 = false;
        $scope.TVdigital4 = false;
        $scope.TVdigital5 = false;
        $scope.TVdigital6 = false;
        $scope.Internet = false;
        $scope.ToIP = false;
        $scope.verplantilla = false;
        $scope.ipServer = "10.100.66.254";
        var timer;
        $scope.inicio = 0;

        $scope.usuarios = function (editarUser) {
            $scope.update = false;
            if (editarUser.PASSWORD == "") {
                Swal({
                    type: 'error',
                    title: 'Opsss...',
                    text: 'Por favor ingrese la contraseña.',
                    timer: 4000
                })
            } else {
                services.editarUsuario(editarUser).then(
                    function (data) {
                        $scope.respuesta = "Usuario " + editarUser.LOGIN + " actualizado exitosamente";
                        $scope.update = true;
                        return data.data;
                    },
                    function errorCallback(response) {
                        console.log(response);
                    }
                )
            }
        }

        $scope.editarModal = function () {
            $scope.errorDatos = null;
            $scope.Tecnico = {};
            $scope.idUsuario = $rootScope.galletainfo.id;
            $scope.UsuarioNom = $rootScope.galletainfo.nombre;
            $scope.TituloModal = "Editar Usuario con el ID:";
        }

        $scope.procesos = function () {
            $scope.validaraccion = false;
            $scope.validarsubaccion = false;
            services.getProcesos().then(function (data) {
                $scope.listadoProcesos = data.data.data;
                $scope.listadoAcciones = {};
                return data.data;
            });
        }

        $scope.calcularAcciones = function () {

            if ($scope.gestionmanual.proceso == 'Plan rescate') {
                $scope.planRescate = 1;
            } else {
                $scope.planRescate = 0;
            }

            if ($scope.gestionmanual.proceso == 'Reparaciones') {
                $scope.plantillaReparaciones = 1;
            } else {
                $scope.plantillaReparaciones = 0;
                $scope.gestionmanual.cod_familiar = "";
                $scope.gestionmanual.prueba_integra = "";
                $scope.gestionmanual.telefonia_tdm = "";
                $scope.gestionmanual.telev_hfc = "";
                $scope.gestionmanual.iptv = "";
                $scope.gestionmanual.internet = "";
                $scope.gestionmanual.toip = "";
                $scope.gestionmanual.smartPlay = "";
            }

            $scope.listadoAcciones = {};

            services.getAcciones($scope.gestionmanual.proceso).then(function (data) {
                $scope.listadoAcciones = data.data.data;
                $scope.validaraccion = true;
                $scope.validarsubaccion = false;
            })
        }

        $scope.calcularSubAcciones = function () {
            $scope.listadoSubAcciones = {};
            if ($scope.gestionmanual.proceso == "Plan rescate" && ($scope.gestionmanual.accion == "Pendiente" || $scope.gestionmanual.accion == "Incompleto")) {
                $scope.validarsubaccion = true;
                $scope.listadoSubAcciones = [
                    {ID: '1011 - Fuera de cobertura', SUBACCION: '1011 - Fuera de cobertura'},
                    {ID: '1019 - Mala asesoria', SUBACCION: '1019 - Mala asesoria'},
                    {ID: '1020 - Incumplimiento contratista', SUBACCION: '1020 - Incumplimiento contratista'},
                    {ID: '1021 - Imposibilidad técnica', SUBACCION: '1021 - Imposibilidad técnica'},
                    {ID: '1022 - Tap copado', SUBACCION: '1022 - Tap copado'},
                    {ID: '1025 - Cliente no desea', SUBACCION: '1025 - Cliente no desea'},
                    {ID: '1026 - Casa sola', SUBACCION: '1026 - Casa sola'},
                    {ID: '1028 - Aplazada por cliente', SUBACCION: '1028 - Aplazada por cliente'},
                    {ID: '1209 - Zona de invasión', SUBACCION: '1209 - Zona de invasión'},
                    {ID: '1217 - Equipo no engancha', SUBACCION: '1217 - Equipo no engancha'},
                    {ID: '1505 - Dirección errada', SUBACCION: '1505 - Dirección errada'},
                    {ID: '1506 - Cliente solicitó otro producto', SUBACCION: '1506 - Cliente solicitó otro producto'},
                    {ID: '1508 - Ductos obstruídos', SUBACCION: '1508 - Ductos obstruídos'},
                    {ID: '1510 - Cliente no contactado', SUBACCION: '1510 - Cliente no contactado'},
                    {ID: '2898 - Requiere visita supervisor ETP', SUBACCION: '2898 - Requiere visita supervisor ETP'},
                    {ID: '2899 - Aplazada por lluvia', SUBACCION: '2899 - Aplazada por lluvia'},
                    {ID: '8383 - Problemas plataformas', SUBACCION: '8383 - Problemas plataformas'},
                    {
                        ID: 'O-01 - Red pendiente en edificios y urbanizaciones',
                        SUBACCION: 'O-01 - Red pendiente en edificios y urbanizaciones'
                    },
                    {ID: 'O-02 - Pendiente cliente no autoriza', SUBACCION: 'O-02 - Pendiente cliente no autoriza'},
                    {ID: 'O-06 - Gestión de instalaciones', SUBACCION: 'O-06 - Gestión de instalaciones'},
                    {ID: 'O-09 - Pendiente por porteria madera', SUBACCION: 'O-09 - Pendiente por porteria madera'},
                    {
                        ID: 'O-11 - Pend tiene línea con otro operador',
                        SUBACCION: 'O-11 - Pend tiene línea con otro operador'
                    },
                    {ID: 'O-13 - Red pendiente en exteriores', SUBACCION: 'O-13 - Red pendiente en exteriores'},
                    {ID: 'O-14 - Ped solicitud repetida', SUBACCION: 'O-14 - Ped solicitud repetida'},
                    {ID: 'O-15 - Pendiente por mala asignación', SUBACCION: 'O-15 - Pendiente por mala asignación'},
                    {
                        ID: 'O-20 - Pendi inconsistencias infraestructura',
                        SUBACCION: 'O-20 - Pendi inconsistencias infraestructura'
                    },
                    {
                        ID: 'O-40 - Pendiente x orden público y/o factores climát',
                        SUBACCION: 'O-40 - Pendiente x orden público y/o factores climát'
                    },
                    {ID: 'O-48 - Red mal estado', SUBACCION: 'O-48 - Red mal estado'},
                    {ID: 'O-49 - No desea el servicio', SUBACCION: 'O-49 - No desea el servicio'},
                    {ID: 'O-50 - Cliente ilocalizado', SUBACCION: 'O-50 - Cliente ilocalizado'},
                    {
                        ID: 'O-51 - Pend tiene línea con otro operador',
                        SUBACCION: 'O-51 - Pend tiene línea con otro operador'
                    },
                    {ID: 'O-53 - Inconsistencia información', SUBACCION: 'O-53 - Inconsistencia información'},
                    {ID: 'O-69 - Pen cliente no contactado', SUBACCION: 'O-69 - Pen cliente no contactado'},
                    {ID: 'O-85 - Red externa pendiente', SUBACCION: 'O-85 - Red externa pendiente'},
                    {ID: 'O-86 - Pendiente por nodo xdsl', SUBACCION: 'O-86 - Pendiente por nodo xdsl'},
                    {
                        ID: 'O-100 - Pendiente solución con proyecto',
                        SUBACCION: 'O-100 - Pendiente solución con proyecto'
                    },
                    {
                        ID: 'O-101 - Renumerar o reconfigurar oferta',
                        SUBACCION: 'O-101 - Renumerar o reconfigurar oferta'
                    },
                    {
                        ID: 'O-103 - Pendiente por autorización de terceros',
                        SUBACCION: 'O-103 - Pendiente por autorización de terceros'
                    },
                    {
                        ID: 'O-112 - Pendiente por reparación de red',
                        SUBACCION: 'O-112 - Pendiente por reparación de red'
                    },
                    {ID: 'OT-C01 - Cliente no autoriza', SUBACCION: 'OT-C01 - Cliente no autoriza'},
                    {ID: 'OT-C04 - Orden público', SUBACCION: 'OT-C04 - Orden público'},
                    {ID: 'OT-C08 - Reconfigurar pedido', SUBACCION: 'OT-C08 - Reconfigurar pedido'},
                    {ID: 'OT-C10 - Validar condición instalación', SUBACCION: 'OT-C10 - Validar condición instalación'},
                    {ID: 'OT-C12 - Reconfigurar motivo técnico', SUBACCION: 'OT-C12 - Reconfigurar motivo técnico'},
                    {ID: 'OT-C14 - Orden del suscriptor', SUBACCION: 'OT-C14 - Orden del suscriptor'},
                    {ID: 'OT-C17 - Autorización de terceros', SUBACCION: 'OT-C17 - Autorización de terceros'},
                    {ID: 'OT-C19 - Factores climáticos', SUBACCION: 'OT-C19 - Factores climáticos'},
                    {ID: 'OT-T01 - Red pendiente edif y urb', SUBACCION: 'OT-T01 - Red pendiente edif y urb'},
                    {ID: 'OT-T04 - Red externa', SUBACCION: 'OT-T04 - Red externa'},
                    {ID: 'OT-T05 - Mala asignación', SUBACCION: 'OT-T05 - Mala asignación'},
                    {ID: 'OT-T10 - Reparación de red externa', SUBACCION: 'OT-T10 - Reparación de red externa'},
                    {ID: 'P-CRM - Reagendado', SUBACCION: 'P-CRM - Reagendado'},
                    {
                        ID: 'O-08 - Pendiente por orden del suscriptor',
                        SUBACCION: 'O-08 - Pendiente por orden del suscriptor'
                    },
                    {ID: 'O-23 - Pendiente no contestan', SUBACCION: 'O-23 - Pendiente no contestan'},
                    {ID: 'OT-C02 - Cliente ilocalizado', SUBACCION: 'OT-C02 - Cliente ilocalizado'},
                    {ID: 'OT-C06 - Inconsistencia información', SUBACCION: 'OT-C06 - Inconsistencia información'},
                    {ID: 'OT-T02 - Gestión de instalaciones', SUBACCION: 'OT-T02 - Gestión de instalaciones'},
                    {
                        ID: 'O-34 - Pendiente por factores climáticos',
                        SUBACCION: 'O-34 - Pendiente por factores climáticos'
                    },
                    {ID: 'OT-C15 - Por agendar', SUBACCION: 'OT-C15 - Por agendar'},
                    {ID: 'OT-T19 - Plataforma caída', SUBACCION: 'OT-T19 - Plataforma caída'},
                    {ID: '1014 - Poste averiado', SUBACCION: '1014 - Poste averiado'},
                    {ID: 'O-24 - Pendi postería', SUBACCION: 'O-24 - Pendi postería'},
                    {ID: 'OT-C05 - Gestión fraudes instalaciones', SUBACCION: 'OT-C05 - Gestión fraudes instalaciones'},
                    {ID: 'OT-C11 - Cancelar motivo técnico', SUBACCION: 'OT-C11 - Cancelar motivo técnico'},
                    {ID: 'OT-T17 - Solución con proyecto', SUBACCION: 'OT-T17 - Solución con proyecto'}
                ];
            } else {
                services.getSubAcciones($scope.gestionmanual.proceso, $scope.gestionmanual.accion).then(function (data) {
                    $scope.listadoSubAcciones = data.data.data;
                    $scope.validarsubaccion = true;
                }, function errorCallback(response) {

                    if (response.status == "200") {
                        $scope.validarsubaccion = false;
                    }
                    var subAccion = "";
                    $scope.mostrarModal();
                });
            }
        }

        $scope.calcularCodigos = function () {

            $scope.listadocodigos = {};
            services.getCodigos($scope.gestionmanual.proceso, $scope.gestionmanual.UNESourceSystem).then(function (data) {
                $scope.listadocodigos = data.data[0];
            }, function errorCallback(response) {
                console.log(response);
            });
        }

        $scope.calcularDiagnostico = function (producto, accion) {

            if (accion == 'Enrutar') {
                $scope.listadodiagnosticos = {};
                services.getDiagnosticos($scope.gestionmanual.producto, $scope.gestionmanual.accion).then(function (data) {
                    $scope.listadodiagnosticos = data.data.data;
                }, function errorCallback(response) {
                    if (response.status == "200") {

                    }
                });
            }
        }

        $scope.mostrarModal = function () {
            if ($scope.infopedido == true) {
                var producto = $scope.myWelcome.uNETecnologias;

                if ($scope.gestionmanual.producto != "" && $scope.gestionmanual.producto != undefined) {
                    producto = $scope.gestionmanual.producto;
                }
            } else if ($scope.gestionmanual.producto == undefined) {
                Swal({
                    type: 'error',
                    title: 'Opsss...',
                    text: 'Por favor seleccione el producto',
                    timer: 4000
                })
            } else {
                var producto = $scope.gestionmanual.producto;
            }

            if (producto.indexOf("HFC") !== -1) {
                var tecnologia = "HFC";
            } else if (producto.indexOf("ADSL") !== -1 || producto.indexOf("REDCO") !== -1 || producto.indexOf("Telefonia_Basica") !== -1) {
                var tecnologia = "ADSL";
            } else if (producto.indexOf("GPON") !== -1) {
                var tecnologia = "GPON";
            } else if (producto.indexOf("DTH") !== -1) {
                var tecnologia = "DTH";
            } else if (producto.indexOf("LTE") !== -1) {
                var tecnologia = "LTE";
            }

            if ($scope.gestionmanual.accion == "Registrar materiales") {
                $scope.materiales = [{id: '1', tipoCable: 'No uso', inicio: '', fin: ''}];
                $('#Registrarmateriales').modal('show');
                $scope.OpenModal = "Registrarmateriales";
            }


            if (tecnologia == "HFC" && ($scope.gestionmanual.subAccion == "INFRAESTRUCTURA HFC" || $scope.gestionmanual.subAccion == "O-112 Pendiente Por Reparacion de Red")) {
                if (producto == undefined) {
                    Swal({
                        type: 'error',
                        title: 'Opsss...',
                        text: 'Por favor seleccione el producto',
                        timer: 4000
                    })
                } else {
                    $('#PendiInfraHFC').modal('show');
                    $scope.OpenModal = "PendiInfraHFC";
                }
            } else if (tecnologia == "ADSL" && ($scope.gestionmanual.subAccion == "INFRAESTRUCTURA COBRE" || $scope.gestionmanual.subAccion == "O-112 Pendiente Por Reparacion de Red")) {
                $('#PendiInfraADSL').modal('show');
                $scope.OpenModal = "PendiInfraADSL";
            }


            if ($scope.gestionmanual.subAccion == "Contingencia(solo en NCA)") {
                if (tecnologia == "DTH") {
                    $('#ContingenciaDTH').modal('show');
                    $scope.OpenModal = "ContingenciaDTH";
                } else {
                    $('#ContingenciaOtros').modal('show');
                    $scope.OpenModal = "ContingenciaOtros";
                }
            }


            if ($scope.gestionmanual.subAccion == "Normal") {
                $('#ContingenciaNormal').modal('show');
                $scope.OpenModal = "ContingenciaNormal";
            } else if ($scope.gestionmanual.subAccion == "Contingencia Cambio") {
                $('#ContingenciaCambio').modal('show');
                $scope.OpenModal = "ContingenciaCambio";
            } else if ($scope.gestionmanual.subAccion == "Contingencia Nuevo") {
                $('#ContingenciaNuevo').modal('show');
                $scope.OpenModal = "ContingenciaNuevo";
            } else if ($scope.gestionmanual.subAccion == "Contingencia Reuso") {
                $('#ContingenciaReuso').modal('show');
                $scope.OpenModal = "ContingenciaReuso";
            }

            if ($scope.gestionmanual.subAccion == "Cumple parametros de instalacion" || $scope.gestionmanual.subAccion == "Cumple parametros de reparacion") {
                if (tecnologia == "LTE" || tecnologia == "DTH") {
                    Swal({
                        type: 'error',
                        title: 'Opsss...',
                        text: 'Para los productos DTH y LTE no aplica cumplir con parametros',
                        timer: 4000
                    })
                } else if ($scope.gestionmanual.CIUDAD == "MESA DE AYUDA" || $scope.gestionmanual.CIUDAD == "MIGRACIONES" || $scope.gestionmanual.CIUDAD == "TECNICOS DE APOYO") {
                    Swal({
                        type: 'error',
                        title: 'Opsss...',
                        text: 'Para los despachos Mesa, migraciones y técnicos de apoyo no aplica cumplir con parametros',
                        timer: 4000
                    })
                } else {
                    if ($scope.gestionmanual.subAccion == "Cumple parametros de instalacion") {
                        $scope.cumplirproceso = "Cumplir instalacion";
                    } else {
                        $scope.cumplirproceso = "Cumplir reparacion";
                    }
                    var tech = '';
                    if ($scope.myWelcome.uNETecnologias != '' && $scope.myWelcome.uNETecnologias != undefined) {
                        tech = $scope.myWelcome.uNETecnologias;
                    } else {
                        tech = $scope.gestionmanual.producto;
                    }

                    tech = tech.toUpperCase();

                    if (tech.includes("HFC")) {
                        $('#cumplirInstalacionHFC').modal('show');
                        $scope.OpenModal = "cumplirInstalacionHFC";
                    }
                    if (tech.includes("ADSL")) {
                        $('#cumplirInstalacionADSL').modal('show');
                        $scope.OpenModal = "cumplirInstalacionADSL";
                    }
                }

            }

            if ($scope.gestionmanual.accion == "Cumplir" && $scope.gestionmanual.subAccion == "Recoger Equipos") {
                $scope.equiposRecoger = [{
                    id: '1',
                    pedido: $scope.pedido,
                    mac: '',
                    serial: '',
                    ciudad: $scope.gestionmanual.CIUDAD,
                    CedTecnico: $scope.gestionmanual.tecnico,
                    NomTecnico: $scope.tecnico,
                    contratista: $scope.empresa
                }];
                $('#recogerEquipos').modal('show');
                $scope.OpenModal = "recogerEquipos";
            }


            if (tecnologia == "HFC" && ($scope.gestionmanual.subAccion == "OT-T10-Reparacion de red externa")) {
                if (producto == undefined) {
                    Swal({
                        type: 'error',
                        title: 'Opsss...',
                        text: 'Por favor seleccione el producto',
                        timer: 4000
                    })
                } else {
                    $('#PendiInstaHFC-OT-T10').modal('show');
                    $scope.OpenModal = "PendiInstaHFC-OT-T10";
                }
            }
        }

        $scope.addNuevoMaterial = function () {
            var newItemNo = $scope.materiales.length + 1;
            $scope.materiales.push({'id': +newItemNo, tipoCable: 'No uso'});
        }

        $scope.addEquipoRecoger = function () {
            var newEquiporecoger = $scope.equiposRecoger.length + 1;
            $scope.equiposRecoger.push({
                'id': +newEquiporecoger,
                pedido: $scope.pedido,
                ciudad: $scope.gestionmanual.CIUDAD,
                CedTecnico: $scope.gestionmanual.tecnico,
                NomTecnico: $scope.tecnico,
                contratista: $scope.empresa,
                celular: $scope.celular
            });
        }

        $scope.removeNuevoMaterial = function () {
            var lastItem = $scope.materiales.length - 1;
            if (lastItem != 0) {
                $scope.materiales.splice(lastItem);
            }
        }

        $scope.removeEquipoRecoger = function () {
            var lastEquipoRecoger = $scope.equiposRecoger.length - 1;
            if (lastEquipoRecoger != 0) {
                $scope.equiposRecoger.splice(lastEquipoRecoger);
            }
        }

        $scope.guardarModal = function (materiales) {
            $scope.verplantilla = true;
            if ($scope.OpenModal == "Registrarmateriales") {
                var total = materiales.length;
                $scope.observacion = "";
                for (var i = 0; i < total; i++) {
                    $scope.observacion = $scope.observacion + "Tipo cable: " + materiales[i].tipoCable + ", Inicio: " + materiales[i].inicio + ", Fin: " + materiales[i].fin + "/";
                }
            }

            if ($scope.OpenModal == "CambioEquipoDTH") {
                $scope.observacion = "Cuenta Domiciliaria: " + $scope.equipoDTH.cuenta + ", ID Cuenta: " + $scope.equipoDTH.IdCuenta + ", Motivo: " + $scope.equipoDTH.motivoCambio + ", Chip ID Entra: " + $scope.equipoDTH.chipEntra + ", Chip ID Sale: " + $scope.equipoDTH.chipSale + ", SmartCard Entra: " + $scope.equipoDTH.SmartEntra + ", SmartCard Sale: " + $scope.equipoDTH.SmartSale

                services.insertarCambioEquipo('DTH', $scope.equipoDTH, $scope.pedido).then(
                    function (data) {
                        $scope.datoscambioEquipo = data.data[0];
                        console.log("id cambio equipo DTH: " + $scope.datoscambioEquipo);
                    }
                );

            }

            if ($scope.OpenModal == "CambioEquipoHFC") {
                $scope.observacion = "Cuenta Domiciliaria: " + $scope.equipoHFC.cuenta + ", ID Cuenta: " + $scope.equipoHFC.IdCuenta + ", Servicio: " + $scope.equipoHFC.servicio + ", Motivo: " + $scope.equipoHFC.motivoCambio + ", Equipo Entra: " + $scope.equipoHFC.equipoEntra + ", Equipo Sale: " + $scope.equipoHFC.equipoSale + ", MAC Entra: " + $scope.equipoHFC.macEntra + ", MAC Sale: " + $scope.equipoHFC.macSale

                services.insertarCambioEquipo('HFC', $scope.equipoHFC, $scope.pedido).then(
                    function (data) {
                        $scope.datoscambioEquipo = data.data[0];
                    }
                );
            }

            if ($scope.OpenModal == "CambioEquipoOtros") {
                $scope.observacion = "Motivo del cambio: " + $scope.equipoOtros.motivoCambio + ", Serial sale: " + $scope.equipoOtros.Serialsale + ", Serial entra: " + $scope.equipoOtros.Serialentra + ", Marca sale: " + $scope.equipoOtros.Marcasale + ", Marca entra: " + $scope.equipoOtros.Marcaentra + ", Referencia sale: " + $scope.equipoOtros.Refentra + ", Referencia entra: " + $scope.equipoOtros.Refsale

                services.insertarCambioEquipo('ADSL', $scope.equipoOtros, $scope.pedido).then(x |
                    function (data) {
                        $scope.datoscambioEquipo = data.data[0];
                    }
                );
            }

            if ($scope.OpenModal == "PendiInfraADSL") {

                $scope.observacion = "";
                if ($scope.gestionmanual.NomTec == undefined) {
                    $scope.NombreTecnico = $scope.tecnico;
                } else {
                    $scope.NombreTecnico = $scope.gestionmanual.NomTec;
                }

                var label = [
                    'Daño: ',
                    ', Prod: ',
                    ', Sape Dist pri: ',
                    ', Smpro Dist pri: ',
                    ', VAC AT Dist pri: ',
                    ', VDC AT Dist pri: ',
                    ', Resist AT Dist pri: ',
                    ', Cap AT Dist pri: ',
                    ', VAC BT Dist pri: ',
                    ', VDC BT Dist pri: ',
                    ', Resist BT Dist pri: ',
                    ', Cap BT Dist pri: ',
                    ', VAC AB Dist pri: ',
                    ', VDC AB Dist pri: ',
                    ', Resist AB Dist pri: ',
                    ', Cap AB Dist pri: ',
                    ', Sape Arm pri: ',
                    ', Smpro Arm pri: ',
                    ', VAC AT Arm pri: ',
                    ', VDC AT Arm pri: ',
                    ', Resist AT Arm pri: ',
                    ', Cap AT Arm pri: ',
                    ', VAC BT Arm pri: ',
                    ', VDC BT Arm pri: ',
                    ', Resist BT Arm pri: ',
                    ', Cap BT Arm pri: ',
                    ', VAC AB Arm pri: ',
                    ', VDC AB Arm pri: ',
                    ', Resist AB Arm pri: ',
                    ', Cap AB Arm pri: ',
                    ', Sape caja sec: ',
                    ', Smpro caja sec: ',
                    ', VAC AT caja sec: ',
                    ', VDC AT caja sec: ',
                    ', Resist AT caja sec: ',
                    ', Cap AT caja sec: ',
                    ', VAC BT caja sec: ',
                    ', VDC BT caja sec: ',
                    ', Resist BT caja sec: ',
                    ', Cap BT caja sec: ',
                    ', VAC AB caja sec: ',
                    ', VDC AB caja sec: ',
                    ', Resist AB caja sec: ',
                    ', Cap AB caja sec: ',
                    ', Sape Arm sec: ',
                    ', Smpro Arm sec: ',
                    ', VAC AT Arm sec: ',
                    ', VDC AT Arm sec: ',
                    ', Resist AT Arm sec: ',
                    ', Cap AT Arm sec: ',
                    ', VAC BT Arm sec: ',
                    ', VDC BT Arm sec: ',
                    ', Resist BT Arm sec: ',
                    ', Cap BT Arm sec: ',
                    ', VAC AB Arm sec: ',
                    ', VDC AB Arm sec: ',
                    ', Resist AB Arm sec: ',
                    ', Cap AB Arm sec: ',
                    ', Tec: ',
                    ', Cel: ',
                    ', Ciud: ',
                    ', Eq med: ',
                    ', Observaciones: '
                ];

                var value = [
                    $scope.pendiInfraCobre.IdDano,
                    $scope.pendiInfraCobre.producto,

                    $scope.pendiInfraCobre.priSapeDis,
                    $scope.pendiInfraCobre.priSmproDis,

                    $scope.pendiInfraCobre.priDisVACAT,
                    $scope.pendiInfraCobre.priDisVDCAT,
                    $scope.pendiInfraCobre.priDisResisAT,
                    $scope.pendiInfraCobre.priDisCapaAT,

                    $scope.pendiInfraCobre.priDisVACBT,
                    $scope.pendiInfraCobre.priDisVDCBT,
                    $scope.pendiInfraCobre.priDisResisBT,
                    $scope.pendiInfraCobre.priDisCapaBT,

                    $scope.pendiInfraCobre.priDisVACAB,
                    $scope.pendiInfraCobre.priDisVDCAB,
                    $scope.pendiInfraCobre.priDisResisAB,
                    $scope.pendiInfraCobre.priDisCapaAB,

                    $scope.pendiInfraCobre.priSapeArm,
                    $scope.pendiInfraCobre.priSmproArm,

                    $scope.pendiInfraCobre.priArmVACAT,
                    $scope.pendiInfraCobre.priArmVDCAT,
                    $scope.pendiInfraCobre.priArmResisAT,
                    $scope.pendiInfraCobre.priArmCapaAT,

                    $scope.pendiInfraCobre.priArmVACBT,
                    $scope.pendiInfraCobre.priArmVDCBT,
                    $scope.pendiInfraCobre.priArmResisBT,
                    $scope.pendiInfraCobre.priArmCapaBT,

                    $scope.pendiInfraCobre.priArmVACAB,
                    $scope.pendiInfraCobre.priArmVDCAB,
                    $scope.pendiInfraCobre.priArmResisAB,
                    $scope.pendiInfraCobre.priArmCapaAB,

                    $scope.pendiInfraCobre.SecSapeDis,
                    $scope.pendiInfraCobre.SecSmproDis,

                    $scope.pendiInfraCobre.SecDisVACAT,
                    $scope.pendiInfraCobre.SecDisVDCAT,
                    $scope.pendiInfraCobre.SecDisResisAT,
                    $scope.pendiInfraCobre.SecDisCapaAT,

                    $scope.pendiInfraCobre.SecDisVACBT,
                    $scope.pendiInfraCobre.SecDisVDCBT,
                    $scope.pendiInfraCobre.SecDisResisBT,
                    $scope.pendiInfraCobre.SecDisCapaBT,

                    $scope.pendiInfraCobre.SecDisVACAB,
                    $scope.pendiInfraCobre.SecDisVDCAB,
                    $scope.pendiInfraCobre.SecDisResisAB,
                    $scope.pendiInfraCobre.SecDisCapaAB,

                    $scope.pendiInfraCobre.SecSapeArm,
                    $scope.pendiInfraCobre.SecSmproArm,

                    $scope.pendiInfraCobre.SecArmVACAT,
                    $scope.pendiInfraCobre.SecArmVDCAT,
                    $scope.pendiInfraCobre.SecArmResisAT,
                    $scope.pendiInfraCobre.SecArmCapaAT,

                    $scope.pendiInfraCobre.SecArmVACBT,
                    $scope.pendiInfraCobre.SecArmVDCBT,
                    $scope.pendiInfraCobre.SecArmResisBT,
                    $scope.pendiInfraCobre.SecArmCapaBT,

                    $scope.pendiInfraCobre.SecArmVACAB,
                    $scope.pendiInfraCobre.SecArmVDCAB,
                    $scope.pendiInfraCobre.SecArmResisAB,
                    $scope.pendiInfraCobre.SecArmCapaAB,

                    $scope.NombreTecnico,
                    $scope.pendiInfraCobre.CelTec,
                    $scope.gestionmanual.CIUDAD,
                    $scope.pendiInfraCobre.EqMedicion,
                    $scope.pendiInfraCobre.observaciones
                ];

                for (var i = 0; i < value.length; i += 1) {
                    if (value[i] != undefined) {
                        $scope.observacion += label[i] + value[i];
                    }
                }
                $scope.observacion = $scope.observacion.replace(/undefined/g, "");

            }

            if ($scope.OpenModal == "PendiInfraHFC") {

                if ($scope.gestionmanual.producto == 'HFC-Internet' || $scope.gestionmanual.producto == 'HFC-ToIP' || $scope.gestionmanual.producto == 'HFC-TV_Digital') {
                    var CMobsoleto = document.getElementById("CMobsoleto").value;
                    if (CMobsoleto == "Si") {
                        $scope.modal = ""
                        Swal(
                            'No se puede guardar la plantilla!',
                            'Se requiere cambiar el equipo ya que es obsoleto'
                        );
                    } else {
                        $scope.modal = "modal"
                    }

                    var label = [
                        'Señal: ',
                        ', v tap: ',
                        ', Marcación TAP: ',
                        ', Dir TAP:',
                        ', Id pru: ',
                        ', Mac CM: ',
                        ', Mac DSAM: ',
                        ', Técnico:  ',
                        ', Cel: ',
                        ', City: ',
                        ', Id p vecinos: ',
                        '/',
                        '/',
                        ', T Red: ',
                        ', RF-14: ',
                        ' dBm, RF-120: ',
                        ' dBm, RF-135: ',
                        ' dBm, RF-157: ',
                        ' dBm, CH: ',
                        ', CH: ',
                        ', RF 1: ',
                        ' dBm, RF 2: ',
                        ' dBm, Perdida de pq 1: ',
                        ', Perdida de pq 2: ',
                        ', MER 1: ',
                        ' dB, MER 2: ',
                        ' dB, BER 1: ',
                        ', BER 2: ',
                        ', P UP 1: ',
                        ' dB, P UP 2: ',
                        ' dB, P DOWN 1: ',
                        ' dB, P DOWN 2: ',
                        ' dB, RF CH 89: ',
                        ', MER 89: ',
                        ', BER 89: ',
                        ', RF CH 73: ',
                        ' dBm, MER 73: ',
                        ', BER 73: ',
                        ', CH: ',
                        ', RF: ',
                        ' dBm, MER: ',
                        ', BER: ',
                        ', CH: ',
                        ', RF: ',
                        ' dBm, MER: ',
                        ', BER: ',
                        ', # sin enlace en der: ',
                        ', # sin enlace en amp: ',
                        ', # afect en der: ',
                        ', # afect en amp: ',
                        ', # cltes TDR amp: ',
                        ', Img adj PNM CRM: ',
                        ', Img adj falla CRM: ',
                        ', Ruido: ',
                        ', Marquilla: ',
                        ', Nodo/Cmts: ',
                        ', Observaciones: '
                    ];

                    var value = [
                        $scope.pendiInfraInternet.repaProvisional,
                        $scope.pendiInfraInternet.valortab,
                        $scope.pendiInfraInternet.MarcacionTap,
                        $scope.pendiInfraInternet.DireccionTap,
                        $scope.pendiInfraInternet.idPrueba,
                        $scope.pendiInfraInternet.macEquipo,
                        $scope.pendiInfraInternet.macDsam,
                        $scope.tecnico,
                        $scope.pendiInfraInternet.Celular,
                        $scope.gestionmanual.CIUDAD,
                        $scope.pendiInfraInternet.idVecinos,
                        $scope.pendiInfraInternet.idVecinos1,
                        $scope.pendiInfraInternet.idVecinos2,
                        $scope.pendiInfraInternet.tipored,
                        $scope.pendiInfraInternet.RF14,
                        $scope.pendiInfraInternet.RF120,
                        $scope.pendiInfraInternet.RF135,
                        $scope.pendiInfraInternet.RF157,
                        $scope.pendiInfraInternet.Ch1,
                        $scope.pendiInfraInternet.Ch2,
                        $scope.pendiInfraInternet.RF1,
                        $scope.pendiInfraInternet.RF22,
                        $scope.pendiInfraInternet.PerdidaPaquete1,
                        $scope.pendiInfraInternet.PerdidaPaquete2,
                        $scope.pendiInfraInternet.Mer1,
                        $scope.pendiInfraInternet.Mer2,
                        $scope.pendiInfraInternet.Ber1,
                        $scope.pendiInfraInternet.Ber2,
                        $scope.pendiInfraInternet.PotenciaUp1,
                        $scope.pendiInfraInternet.PotenciaUp2,
                        $scope.pendiInfraInternet.PotenciaDW1,
                        $scope.pendiInfraInternet.PotenciaDW2,
                        $scope.pendiInfraInternet.RFCH89,
                        $scope.pendiInfraInternet.Mer89,
                        $scope.pendiInfraInternet.Ber89,
                        $scope.pendiInfraInternet.RFCH73,
                        $scope.pendiInfraInternet.Mer73,
                        $scope.pendiInfraInternet.Ber73,
                        $scope.pendiInfraInternet.CHMalo1,
                        $scope.pendiInfraInternet.RFMalo1,
                        $scope.pendiInfraInternet.MerMalo1,
                        $scope.pendiInfraInternet.BerMalo1,
                        $scope.pendiInfraInternet.CHMalo2,
                        $scope.pendiInfraInternet.RFMalo2,
                        $scope.pendiInfraInternet.MerMalo2,
                        $scope.pendiInfraInternet.BerMalo2,
                        $scope.pendiInfraInternet.NroCliSinEnlace,
                        $scope.pendiInfraInternet.NroCliSinAmplificador,
                        $scope.pendiInfraInternet.NroCliAfecDerivador,
                        $scope.pendiInfraInternet.NroCliAfecAmplificador,
                        $scope.pendiInfraInternet.NroCliTDRAmplificador,
                        $scope.pendiInfraInternet.ImgPnm,
                        $scope.pendiInfraInternet.IMGFallaSiebel,
                        $scope.pendiInfraInternet.ProbRuido,
                        $scope.pendiInfraInternet.InstCorreaPlastica,
                        $scope.pendiInfraInternet.NodoAAA,
                        $scope.pendiInfraInternet.observaciones
                    ];

                    $scope.observacion = "";

                    if (CMobsoleto != "Si") {
                        for (var i = 0; i < value.length; i += 1) {
                            if (value[i] != undefined) {
                                $scope.observacion += label[i] + value[i];
                            }
                        }
                    } else {
                        $scope.observacion = "";
                    }

                    $scope.observacion = $scope.observacion.replace(/undefined/g, "");

                } else if ($scope.gestionmanual.producto == 'HFC-TV_Basica') {
                    $scope.observacion = "reparación provisional?: " + $scope.pendiInfraTvBas.repaProvisional + ", RF canal 2: " + $scope.pendiInfraTvBas.RF2 + ", RF canal 110: " + $scope.pendiInfraTvBas.RF110 + ", Ciudad: " + $scope.pendiInfraTvBas.Ciudad + ", Celular: " + $scope.pendiInfraTvBas.Celular + ", Técnico: " + $scope.pendiInfraTvBas.nomTecnico + ", Observaciones: " + $scope.pendiInfraTvBas.observaciones
                }
            }

            if ($scope.OpenModal == "ContingenciaDTH") {

                $scope.observacion = "Se aprovisiona ";

                if ($scope.contingenciaDTH.aprovi != undefined) {
                    $scope.observacion += "-Deco TV Digital por " + $scope.contingenciaDTH.aprovi + " con el Chip ID " + $scope.contingenciaDTH.chip + " y SmartCard " + $scope.contingenciaDTH.smart;
                }

                if ($scope.contingenciaDTH.aprovi2 != undefined) {
                    $scope.observacion += "-Deco TV Digital por " + $scope.contingenciaDTH.aprovi2 + " con el Chip ID " + $scope.contingenciaDTH.chip2 + " y SmartCard " + $scope.contingenciaDTH.smart2;
                }

                if ($scope.contingenciaDTH.aprovi3 != undefined) {
                    $scope.observacion += "-Deco TV Digital por " + $scope.contingenciaDTH.aprovi3 + " con el Chip ID " + $scope.contingenciaDTH.chip3 + " y SmartCard " + $scope.contingenciaDTH.smart3;
                }

                if ($scope.contingenciaDTH.aprovi4 != undefined) {
                    $scope.observacion += "-Deco TV Digital por " + $scope.contingenciaDTH.aprovi4 + " con el Chip ID " + $scope.contingenciaDTH.chip4 + " y SmartCard " + $scope.contingenciaDTH.smart4;
                }

                if ($scope.contingenciaDTH.observaciones != undefined) {
                    $scope.observacion += "-Queda en pediente: " + $scope.contingenciaDTH.observaciones + "--";
                }
            }

            if ($scope.OpenModal == "ContingenciaOtros") {

                $scope.observacion = "Se aprovisiona ";

                if ($scope.contingenciaNCA.aproviInternet != undefined) {
                    $scope.observacion += "-Internet por " + $scope.contingenciaNCA.aproviInternet + " con la MAC " + $scope.contingenciaNCA.MACinternet;
                }

                if ($scope.contingenciaNCA.aproviToIP != undefined) {
                    $scope.observacion += "-ToIP por " + $scope.contingenciaNCA.aproviToIP + " con la MAC " + $scope.contingenciaNCA.MACToIP;
                }

                if ($scope.contingenciaNCA.aprovi1 != undefined) {
                    $scope.observacion += "-Deco TV Digital por " + $scope.contingenciaNCA.aprovi1 + " con la MAC " + $scope.contingenciaNCA.MACTV1;
                }

                if ($scope.contingenciaNCA.aprovi2 != undefined) {
                    $scope.observacion += "-Deco TV Digital por " + $scope.contingenciaNCA.aprovi2 + " con la MAC " + $scope.contingenciaNCA.MACTV2;
                }

                if ($scope.contingenciaNCA.aprovi3 != undefined) {
                    $scope.observacion += "-Deco TV Digital por " + $scope.contingenciaNCA.aprovi3 + " con la MAC " + $scope.contingenciaNCA.MACTV3;
                }

                if ($scope.contingenciaNCA.aprovi4 != undefined) {
                    $scope.observacion += "-Deco TV Digital por " + $scope.contingenciaNCA.aprovi4 + " con la MAC " + $scope.contingenciaNCA.MACTV4;
                }

                if ($scope.contingenciaNCA.aprovi5 != undefined) {
                    $scope.observacion += "-Deco TV Digital por " + $scope.contingenciaNCA.aprovi5 + " con la MAC " + $scope.contingenciaNCA.MACTV5;
                }

                if ($scope.contingenciaNCA.aprovi6 != undefined) {
                    $scope.observacion += "-Deco TV Digital por " + $scope.contingenciaNCA.aprovi6 + " con la MAC " + $scope.contingenciaNCA.MACTV6;
                }

                if ($scope.contingenciaNCA.observaciones != undefined) {
                    $scope.observacion += "-Queda en pediente: " + $scope.contingenciaNCA.observaciones + "--";
                }
            }

            if ($scope.OpenModal == "cumplirInstalacionHFC") {

                var diagnostico = "";

                if ($scope.cumplir.sinalarmas != undefined && $scope.cumplir.sinalarmas) {
                    diagnostico = "0";
                } else {
                    if ($scope.cumplir.potenciaup != undefined && $scope.cumplir.potenciaup) diagnostico = "1";
                    if ($scope.cumplir.snrup != undefined && $scope.cumplir.snrup) diagnostico = diagnostico + "/2";
                    if ($scope.cumplir.potenciadown != undefined && $scope.cumplir.potenciadown) diagnostico = diagnostico + "/3";
                    if ($scope.cumplir.snrdown != undefined && $scope.cumplir.snrdown) diagnostico = diagnostico + "/4";
                    if ($scope.cumplir.paquetesnocorregidosup != undefined && $scope.cumplir.paquetesnocorregidosup) diagnostico = diagnostico + "/5";
                    if ($scope.cumplir.paquetesnocorregidosdown != undefined && $scope.cumplir.paquetesnocorregidosdown) diagnostico = diagnostico + "/6";
                    if ($scope.cumplir.modoparcialenportadoras != undefined && $scope.cumplir.modoparcialenportadoras) diagnostico = diagnostico + "/7";
                    if ($scope.cumplir.ajustesdepotencia != undefined && $scope.cumplir.ajustesdepotencia) diagnostico = diagnostico + "/8";
                    if ($scope.cumplir.porcentajemiss != undefined && $scope.cumplir.porcentajemiss) diagnostico = diagnostico + "/9";
                }

                $scope.observacion = "*TID : " + $scope.cumplir.transaccionid +
                    "*LDAP : " + $scope.cumplir.validacionldap +
                    "*Estado CM : " + $scope.cumplir.estadocm +
                    "*IP Navegación : " + $scope.cumplir.tieneipnavegacion +
                    "*Diagnostico: {" + diagnostico + "}" +
                    "*IP EMTA : " + $scope.cumplir.tieneipemta +
                    "*Archivo de Config : " + $scope.cumplir.tienearchivoconfiguracion +
                    "*Linea registrada : " + $scope.cumplir.registradaims +
                    "*ID Llamada : " + $scope.cumplir.idllamadaentrante +
                    "*Config. Plataforma : " + $scope.cumplir.configuradoplataformatv +
                    "*ONETV : " + $scope.cumplir.esonetv +
                    "*Estado CM Deco : " + $scope.cumplir.estadocmembebido;
            }

            if ($scope.OpenModal == "cumplirInstalacionADSL") {

                $scope.observacion = "*PI: " + $scope.cumplir.pruebaintegrada +
                    "*Est. OSS: " + $scope.cumplir.oss +
                    "*Est. Acce: " + $scope.cumplir.acceso +
                    "*Est. CPE: " + $scope.cumplir.cpe +
                    "*Est. Plata: " + $scope.cumplir.plataformas;
            }


            if ($scope.OpenModal == "ContingenciaNormal") {
                $scope.observacion = "Reutilizó equipos? " + $scope.contingenciaNormal.reuEquipos + ", Equipo aprovisionado: " + $scope.contingenciaNormal.equipo
            }

            if ($scope.OpenModal == "ContingenciaCambio") {
                var producto = "";
                var puertos = "";
                if ($scope.contingenciaCambio.BA == true) {
                    producto = producto + "-BA-";
                }
                if ($scope.contingenciaCambio.ToIP == true) {
                    producto = producto + "-ToIP-";
                }
                if ($scope.contingenciaCambio.TV == true) {
                    producto = producto + "-TV-";
                }
                ;
                if ($scope.contingenciaCambio.puerto1 == true) {
                    puertos = puertos + "-1-";
                }
                if ($scope.contingenciaCambio.puerto2 == true) {
                    puertos = puertos + "-2-";
                }
                if ($scope.contingenciaCambio.puerto3 == true) {
                    puertos = puertos + "-3-";
                }
                if ($scope.contingenciaCambio.puerto4 == true) {
                    puertos = puertos + "-4-";
                }
                ;

                $scope.observacion = "Productos: " + producto + ", CR o Autoriza: " + $scope.contingenciaCambio.autoriza + ", MAC de datos entra: " + $scope.contingenciaCambio.MacdatosEntra + ", MAC de datos sale: " + $scope.contingenciaCambio.MacdatosSale + ", Línea: " + $scope.contingenciaCambio.linea + ", MAC de voz entra: " + $scope.contingenciaCambio.MacvozEntra + ", MAC de voz sale: " + $scope.contingenciaCambio.MacvozSale + ", Deco(s) entra: " + $scope.contingenciaCambio.decoEntra + ", Deco(s) Sale: " + $scope.contingenciaCambio.decoSale + ", Puertos: " + puertos
            }

            if ($scope.OpenModal == "ContingenciaNuevo") {
                var producto = "";
                if ($scope.contingenciaNuevo.BA == true) {
                    producto = producto + "-BA-";
                }
                if ($scope.contingenciaNuevo.ToIP == true) {
                    producto = producto + "-ToIP-";
                }
                if ($scope.contingenciaNuevo.TV == true) {
                    producto = producto + "-TV-";
                }


                $scope.observacion = "Productos: " + producto + ", CR o Autoriza: " + $scope.contingenciaNuevo.autoriza + ", Decos: " + $scope.contingenciaNuevo.Decos + ", línea: " + $scope.contingenciaNuevo.linea + ", MAC de datos: " + $scope.contingenciaNuevo.MacDatos + ", MAC de voz: " + $scope.contingenciaNuevo.MacVoz
            }

            if ($scope.OpenModal == "ContingenciaReuso") {
                var producto = "";
                var puertos = "";
                if ($scope.contingenciaReuso.BA == true) {
                    producto = producto + "-BA-";
                }
                if ($scope.contingenciaReuso.ToIP == true) {
                    producto = producto + "-ToIP-";
                }
                if ($scope.contingenciaReuso.TV == true) {
                    producto = producto + "-TV-";
                }
                ;
                if ($scope.contingenciaReuso.puerto1 == true) {
                    puertos = puertos + "-1-";
                }
                if ($scope.contingenciaReuso.puerto2 == true) {
                    puertos = puertos + "-2-";
                }
                if ($scope.contingenciaReuso.puerto3 == true) {
                    puertos = puertos + "-3-";
                }
                if ($scope.contingenciaReuso.puerto4 == true) {
                    puertos = puertos + "-4-";
                }

                $scope.observacion = "Productos: " + producto + ", CR o Autoriza: " + $scope.contingenciaReuso.autoriza + ", MAC de datos: " + $scope.contingenciaReuso.Macdatos + ", MAC de voz: " + $scope.contingenciaReuso.Macvoz + ", Decos: " + $scope.contingenciaReuso.decos + ", Línea: " + $scope.contingenciaReuso.linea + ", Puertos: " + puertos
            }

            if ($scope.OpenModal == "formaDsam") {
                $scope.observacion = "ID SMNET: " + $scope.DSAM.idSmnet + ", DQI: " + $scope.DSAM.DQI + ", DS SNR: " + $scope.DSAM.SNR + ", CH 2: " + $scope.DSAM.CH2 + ", BER: " + $scope.DSAM.BER + ", POT UP: " + $scope.DSAM.POTUP + ", CH 119: " + $scope.DSAM.CH119 + ", MER: " + $scope.DSAM.MER + ", POTDOWN: " + $scope.DSAM.POTDOWN
            }

            if ($scope.OpenModal == "PendiInstaHFC-OT-T10") {

                if ($scope.gestionmanual.producto == 'HFC-Internet' || $scope.gestionmanual.producto == 'HFC-ToIP' || $scope.gestionmanual.producto == 'HFC-TV_Digital') {
                    var CMobsoleto = document.getElementById("CMobsoleto2").value;
                    if (CMobsoleto == "Si") {
                        $scope.modal = ""
                        Swal(
                            'No se puede guardar la plantilla!',
                            'Se requiere cambiar el equipo ya que es obsoleto'
                        )
                    } else {
                        $scope.modal = "modal"
                    }

                    var label = [
                        'Señal: ',
                        ', v tap: ',
                        ', Marcación TAP: ',
                        ', Dir TAP:',
                        ', Id pru: ',
                        ', Mac CM: ',
                        ', Técnico:  ',
                        ', Cel: ',
                        ', City: ',
                        ', Id p vecinos: ',
                        '/',
                        '/',
                        ', T Red: ',
                        ', RF-14: ',
                        ' dBm, RF-120: ',
                        ' dBm, RF-135: ',
                        ' dBm, RF-157: ',
                        ' dBm, CH: ',
                        ', CH: ',
                        ', RF 1: ',
                        ' dBm, RF 2: ',
                        ' dBm, MER 1: ',
                        ' dB, MER 2: ',
                        ' dB, BER 1: ',
                        ', BER 2: ',
                        ', P DOWN 1: ',
                        ' dB, P DOWN 2: ',
                        ' dB, RF CH 89: ',
                        ', MER 89: ',
                        ', BER 89: ',
                        ', RF CH 73: ',
                        ' dBm, MER 73: ',
                        ', BER 73: ',
                        ', CH: ',
                        ', RF: ',
                        ' dBm, MER: ',
                        ', BER: ',
                        ', CH: ',
                        ', RF: ',
                        ' dBm, MER: ',
                        ', BER: ',
                        ', # sin enlace en der: ',
                        ', # sin enlace en amp: ',
                        ', # afect en der: ',
                        ', # afect en amp: ',
                        ', # cltes TDR amp: ',
                        ', Img adj PNM CRM: ',
                        ', Img adj falla CRM: ',
                        ', Ruido: ',
                        ', Marquilla: ',
                        ', Nodo/Cmts: ',
                        ', Observaciones: '
                    ];

                    var value = [
                        $scope.PendiInstaHFCOTT10.repaProvisional,
                        $scope.PendiInstaHFCOTT10.valortab,
                        $scope.PendiInstaHFCOTT10.MarcacionTap,
                        $scope.PendiInstaHFCOTT10.DireccionTap,
                        $scope.PendiInstaHFCOTT10.idPrueba,
                        $scope.PendiInstaHFCOTT10.macEquipo,
                        $scope.tecnico,
                        $scope.PendiInstaHFCOTT10.Celular,
                        $scope.gestionmanual.CIUDAD,
                        $scope.PendiInstaHFCOTT10.idVecinos,
                        $scope.PendiInstaHFCOTT10.idVecinos1,
                        $scope.PendiInstaHFCOTT10.idVecinos2,
                        $scope.PendiInstaHFCOTT10.tipored,
                        $scope.PendiInstaHFCOTT10.RF14,
                        $scope.PendiInstaHFCOTT10.RF120,
                        $scope.PendiInstaHFCOTT10.RF135,
                        $scope.PendiInstaHFCOTT10.RF157,
                        $scope.PendiInstaHFCOTT10.Ch1,
                        $scope.PendiInstaHFCOTT10.Ch2,
                        $scope.PendiInstaHFCOTT10.RF1,
                        $scope.PendiInstaHFCOTT10.RF22,
                        $scope.PendiInstaHFCOTT10.Mer1,
                        $scope.PendiInstaHFCOTT10.Mer2,
                        $scope.PendiInstaHFCOTT10.Ber1,
                        $scope.PendiInstaHFCOTT10.Ber2,
                        $scope.PendiInstaHFCOTT10.PotenciaDW1,
                        $scope.PendiInstaHFCOTT10.PotenciaDW2,
                        $scope.PendiInstaHFCOTT10.RFCH89,
                        $scope.PendiInstaHFCOTT10.Mer89,
                        $scope.PendiInstaHFCOTT10.Ber89,
                        $scope.PendiInstaHFCOTT10.RFCH73,
                        $scope.PendiInstaHFCOTT10.Mer73,
                        $scope.PendiInstaHFCOTT10.Ber73,
                        $scope.PendiInstaHFCOTT10.CHMalo1,
                        $scope.PendiInstaHFCOTT10.RFMalo1,
                        $scope.PendiInstaHFCOTT10.MerMalo1,
                        $scope.PendiInstaHFCOTT10.BerMalo1,
                        $scope.PendiInstaHFCOTT10.CHMalo2,
                        $scope.PendiInstaHFCOTT10.RFMalo2,
                        $scope.PendiInstaHFCOTT10.MerMalo2,
                        $scope.PendiInstaHFCOTT10.BerMalo2,
                        $scope.PendiInstaHFCOTT10.NroCliSinEnlace,
                        $scope.PendiInstaHFCOTT10.NroCliSinAmplificador,
                        $scope.PendiInstaHFCOTT10.NroCliAfecDerivador,
                        $scope.PendiInstaHFCOTT10.NroCliAfecAmplificador,
                        $scope.PendiInstaHFCOTT10.NroCliTDRAmplificador,
                        $scope.PendiInstaHFCOTT10.ImgPnm,
                        $scope.PendiInstaHFCOTT10.IMGFallaSiebel,
                        $scope.PendiInstaHFCOTT10.ProbRuido,
                        $scope.PendiInstaHFCOTT10.InstCorreaPlastica,
                        $scope.PendiInstaHFCOTT10.NodoAAA,
                        $scope.PendiInstaHFCOTT10.observaciones
                    ];

                    $scope.observacion = "";

                    if (CMobsoleto != "Si") {
                        for (var i = 0; i < value.length; i += 1) {
                            if (value[i] != undefined) {
                                $scope.observacion += label[i] + value[i];
                            }
                        }
                    } else {
                        $scope.observacion = "";
                    }

                    $scope.observacion = $scope.observacion.replace(/undefined/g, "");
                }
            }
        }

        $scope.guardarModalRecogerEq = function (equiposRecoger) {
            if ($scope.gestionmanual.tecnico == "" || $scope.gestionmanual.tecnico == undefined) {
                Swal({
                    type: 'error',
                    title: 'Opsss...',
                    text: 'Por favor ingresar el técnico.',
                    timer: 4000
                })
            }

            if ($scope.gestionmanual.producto == "" || $scope.gestionmanual.producto == undefined) {
                Swal({
                    type: 'error',
                    title: 'Opsss...',
                    text: 'Por favor ingresar el producto.',
                    timer: 4000
                })
            }

            services.recogidaEquipos(equiposRecoger).then(
                function (respuesta) {
                    if (respuesta.status == '201' || respuesta.status == '200') {
                        Swal({
                            type: 'success',
                            title: 'Muy bien.',
                            text: 'Los equipos a recoger fueron guardados!',
                            timer: 4000
                        })
                    }
                    $("#recogerEquipos").modal('hide');
                    $scope.equipo = {};
                },
                function errorCallback(response) {
                    if (response.status == '400') {
                        Swal({
                            type: 'error',
                            title: 'Oops...',
                            text: 'Este pedido ya está registrado!'
                        })
                    }
                }
            )
        }

        $scope.selectProductoHFC = function (producto) {
            if (producto == 'Internet-ToIP') {
                $scope.gestionmanual.producto = 'HFC-Internet';
            } else {
                $scope.gestionmanual.producto = producto;
            }
        }

        $(".mi-hover").hover(
            function () {
                $(this).addClass("panel-primary");
            },
            function () {
                $(this).removeClass("panel-primary");
            }
        )

        $scope.selectProductocontingencia = function (producto) {
            if (producto == 'TV digital 1') {
                $scope.TVdigital1 = true;
                $scope.TVdigital2 = false;
                $scope.TVdigital3 = false;
                $scope.TVdigital4 = false;
                $scope.TVdigital5 = false;
                $scope.TVdigital6 = false;
                $scope.Internet = false;
                $scope.ToIP = false;
            } else if (producto == 'TV digital 2') {
                $scope.TVdigital1 = false;
                $scope.TVdigital2 = true;
                $scope.TVdigital3 = false;
                $scope.TVdigital4 = false;
                $scope.TVdigital5 = false;
                $scope.TVdigital6 = false;
                $scope.Internet = false;
                $scope.ToIP = false;
            } else if (producto == 'TV digital 3') {
                $scope.TVdigital1 = false;
                $scope.TVdigital2 = false;
                $scope.TVdigital3 = true;
                $scope.TVdigital4 = false;
                $scope.TVdigital5 = false;
                $scope.TVdigital6 = false;
                $scope.Internet = false;
                $scope.ToIP = false;
            } else if (producto == 'TV digital 4') {
                $scope.TVdigital1 = false;
                $scope.TVdigital2 = false;
                $scope.TVdigital3 = false;
                $scope.TVdigital4 = true;
                $scope.TVdigital5 = false;
                $scope.TVdigital6 = false;
                $scope.Internet = false;
                $scope.ToIP = false;
            } else if (producto == 'TV digital 5') {
                $scope.TVdigital1 = false;
                $scope.TVdigital2 = false;
                $scope.TVdigital3 = false;
                $scope.TVdigital4 = false;
                $scope.TVdigital5 = true;
                $scope.TVdigital6 = false;
                $scope.Internet = false;
                $scope.ToIP = false;
            } else if (producto == 'TV digital 6') {
                $scope.TVdigital1 = false;
                $scope.TVdigital2 = false;
                $scope.TVdigital3 = false;
                $scope.TVdigital4 = false;
                $scope.TVdigital5 = false;
                $scope.TVdigital6 = true;
                $scope.Internet = false;
                $scope.ToIP = false;
            } else if (producto == 'Internet') {
                $scope.TVdigital1 = false;
                $scope.TVdigital2 = false;
                $scope.TVdigital3 = false;
                $scope.TVdigital4 = false;
                $scope.TVdigital5 = false;
                $scope.TVdigital6 = false;
                $scope.Internet = true;
                $scope.ToIP = false;
            } else if (producto == 'ToIP') {
                $scope.TVdigital1 = false;
                $scope.TVdigital2 = false;
                $scope.TVdigital3 = false;
                $scope.TVdigital4 = false;
                $scope.TVdigital5 = false;
                $scope.TVdigital6 = false;
                $scope.Internet = false;
                $scope.ToIP = true;
            }
        }

        function bb8(pedido) {
            $scope.bb8Internet = 0;
            $scope.bb8Telefonia = 0;
            $scope.bb8Television = 0;

            services.windowsBridge("BB8/contingencias/Buscar/GetClick/" + pedido)
                .then(function (data) {
                    $scope.clic = data.data[0];
                    $scope.UNEPedido = $scope.clic.UNEPedido;
                    $scope.Estado = $scope.clic.Estado;
                    $scope.TipoEquipo = $scope.clic.TipoEquipo;
                    $scope.Categoria = $scope.clic.TT;
                    $scope.UNEMunicipio = $scope.clic.UNEMunicipio;
                    $scope.UNENombreCliente = $scope.clic.UNENombreCliente;
                    $scope.UNEIdCliente = $scope.clic.UNEIdCliente;
                    $scope.ID_GIS = $scope.clic.UNECodigoDireccionServicio;
                    $scope.Estado = $scope.clic.Estado;
                    $scope.CRM = $scope.clic.TTC;
                    $scope.Sistema = $scope.clic.UNESourceSystem;
                    $scope.Duration = parseInt($scope.clic.Duration);
                    $scope.Duration = ($scope.Duration / 60);
                    services.windowsBridge("BB8/contingencias/Buscar/GetPlanBaMSS/" + pedido)
                        .then(function (data) {
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
                                services.windowsBridge("BB8/contingencias/Buscar/GetPlanBaMSS/" + $scope.clic.UNECodigoDireccionServicio)
                                    .then(function (data) {
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
                                        }
                                    });
                            }
                            services.windowsBridge("BB8/contingencias/Buscar/GetPlanTOMSS/" + pedido)
                                .then(function (data) {
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
                                        services.windowsBridge("BB8/contingencias/Buscar/GetPlanTOMSS/" + $scope.clic.UNECodigoDireccionServicio)
                                            .then(function (data) {
                                                if (data.data.length > 0) {
                                                    $scope.bb8Telefonia = 1;
                                                    $scope.recorretelefonia = data.data;
                                                    $scope.Linea = recorretelefonia[0].LINEA;
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
                                                        $scope.paquete = $scope.recore[i].VALID_VALUE;
                                                        $scope.paquete1 = $scope.recore[i].VALUE_LABEL;
                                                    }

                                                }
                                            } else {
                                                services.windowsBridge("BB8/contingencias/Buscar/GetPlanTVMSS/" + $scope.clic.UNECodigoDireccionServicio)
                                                    .then(function (data) {
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
                                                                    $scope.paquete = $scope.recore[i].VALID_VALUE;
                                                                    $scope.paquete1 = $scope.recore[i].VALUE_LABEL;
                                                                }

                                                            }
                                                        }
                                                    });
                                            }
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
        }

        function actividades(pedido) {

            $scope.plantillaReparaciones = 0;
            $scope.iniciaGestion = false;
            $scope.errorconexion1 = false;
            $scope.gestionmanual = {};
            $scope.pedido = pedido;
            $scope.gestionmanual.producto = "";
            $scope.collapse = 0;
            $scope.counter = 0;

            $scope.startCounter = function () {
                if (timer === null) {
                    updateCounter();
                }
            };
            var updateCounter = function () {
                $scope.counter++;
                timer = $timeout(updateCounter, 1000);
            };
            updateCounter();

            if (pedido == "" || pedido == undefined) {
                Swal({
                    type: 'info',
                    title: 'Opsss....',
                    text: 'Ingrese un pedido para buscar',
                    timer: 4000
                })
            } else {

                $scope.sininfopedido = true;
                services.windowsBridge("HCHV/Buscar/" + pedido)
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
                        },

                        function (err) {
                            console.log(err)
                        }
                    );
            }

        }

        function buscarDataSara(pedido) {
            services.windowsBridge("SARA/Buscar/" + pedido)
                .then(function (data) {
                        $scope.dataSara = data.data;

                        if ($scope.dataSara.Error == "No hay datos para mostrar") {

                            $scope.horasTranscurridas = 0;
                            $scope.minutosTranscurridos = 0;
                            $scope.segundosTranscurridos = 0;

                        }

                        $scope.indiceSara = (Object.keys($scope.dataSara.SolicitudesSara).length) - 1;
                        var tiempoSara = $scope.dataSara.SolicitudesSara[$scope.indiceSara].TiempoRespuesta;
                        $scope.horasTranscurridas = tiempoSara.substr(0, 2);
                        $scope.minutosTranscurridos = tiempoSara.substr(3, 2);
                        $scope.segundosTranscurridos = tiempoSara.substr(6, 2);
                        return data.data;
                    },

                    function (Error) {
                        console.log(errro);
                    });
        }

        $scope.BuscarPedido = function (pedido) {
            if (!pedido) {
                Swal({
                    type: 'error',
                    title: 'Oops...',
                    text: 'Ingrese el pedido a buscar',
                    timer: 4000
                })
                return;
            }
            $scope.inicio = 1;
            bb8(pedido);
            actividades(pedido);
            buscarDataSara(pedido);
        }

        $scope.BuscarTecnico = function () {

            if ($scope.gestionmanual.tecnico == undefined || $scope.gestionmanual.tecnico == "") {
                $scope.gestionmanual.tecnico = $scope.myWelcome.engineerID;
            }

            if ($scope.gestionmanual.tecnico == undefined || $scope.gestionmanual.tecnico == "") {
                return;
            }
            let data = {'buscar': 'identificacion', 'variable': $scope.gestionmanual.tecnico, 'page': 1, 'size': 15}

            services.listadoTecnicos(data).then(
                function (data) {
                    $scope.Tecnico = data.data.data;
                    $scope.tecnico = $scope.Tecnico[0].NOMBRE;
                    $scope.empresa = $scope.Tecnico[0].NOM_EMPRESA;
                    if ($scope.Tecnico[0].CELULAR == "") {
                        Swal({
                            type: 'info',
                            title: 'Opsss....',
                            text: 'El número de celular del técnico no existe!',
                            timer: 4000
                        })
                        $scope.celular = "0000000000";
                    } else {
                        $scope.celular = $scope.Tecnico[0].CELULAR;
                    }
                    $scope.creaTecnico = true;
                },
                function errorCallback(response) {
                    $('#NuevoTecnico').modal('show');
                    $scope.creaTecnico = false;
                }
            )
        }

        $scope.createTecnico = function () {
            services.creaTecnico($scope.crearTecnico, $scope.gestionmanual.tecnico).then(
                function (data) {
                    $scope.BuscarTecnico();
                    return data.data;
                },
                function errorCallback(response) {
                    console.log($scope.errorDatos);
                }
            )
        }


        $scope.guardarPedido = function () {
            if ($scope.gestionmanual.interaccion == "" || $scope.gestionmanual.interaccion == undefined) {
                Swal({
                    type: 'info',
                    title: 'Opsss....',
                    text: 'Debe seleccionar el tipo de interacción.',
                    timer: 4000
                })
                return;
            }

            if (($scope.gestionmanual.interaccion == "llamada" && $scope.gestionmanual.id_llamada == "") || ($scope.gestionmanual.interaccion == "llamada" && $scope.gestionmanual.id_llamada == undefined)) {
                Swal({
                    type: 'info',
                    title: 'Opsss....',
                    text: 'Por favor ingresar el ID de llamada.',
                    timer: 4000
                })
                return;
            }

            if ($scope.gestionmanual.interaccion == "llamada" && $scope.gestionmanual.id_llamada.length > 40) {
                Swal({
                    type: 'info',
                    title: 'Opsss....',
                    text: 'Por favor ingrese un Id de Llamada válido.',
                    timer: 4000
                })
                return;
            }

            if ($scope.gestionmanual.tecnico == "" || $scope.gestionmanual.tecnico == undefined) {
                Swal({
                    type: 'info',
                    title: 'Opsss....',
                    text: 'Por favor ingresar el tecnico.',
                    timer: 4000
                })
                return;
            }

            if ($scope.gestionmanual.producto == "" || $scope.gestionmanual.producto == undefined) {
                Swal({
                    type: 'info',
                    title: 'Opsss....',
                    text: 'Por favor ingresar un producto.',
                    timer: 4000
                })
                return;
            }

            if ($scope.gestionmanual.proceso == "" || $scope.gestionmanual.proceso == undefined) {
                Swal({
                    type: 'info',
                    title: 'Opsss....',
                    text: 'Por favor ingresar el proceso.',
                    timer: 4000
                })
                return;
            }

            if ($scope.gestionmanual.accion == "" || $scope.gestionmanual.accion == undefined) {
                Swal({
                    type: 'info',
                    title: 'Opsss....',
                    text: 'Por favor ingresar una acción.',
                    timer: 4000
                })
                return;
            }

            if ($scope.gestionmanual.accion == "Soporte GPON" && ($scope.gestionmanual.subAccion == "" || $scope.gestionmanual.subAccion == undefined)) {
                Swal({
                    type: 'info',
                    title: 'Opsss....',
                    text: 'Por favor ingresar una subacción.',
                    timer: 4000
                })
                return;
            }

            if ($scope.gestionmanual.observaciones == "" || $scope.gestionmanual.observaciones == undefined) {
                Swal({
                    type: 'info',
                    title: 'Opsss....',
                    text: 'Debes documentar bien ingresa observaciones.',
                    timer: 4000
                })
                return;
            }

            $timeout.cancel(timer);
            timer = null;

            var hours = Math.floor($scope.counter / 3600),
                minutes = Math.floor(($scope.counter % 3600) / 60),
                seconds = Math.floor($scope.counter % 60);

            if (hours < 10) {
                hours = "0" + hours;
            }

            if (minutes < 10) {
                minutes = "0" + minutes;
            }

            if (seconds < 10) {
                seconds = "0" + seconds;
            }

            $scope.counter = hours + ":" + minutes + ":" + seconds;

            services.ingresarPedidoAsesor(
                $scope.gestionmanual,
                $scope.pedido,
                $scope.empresa,
                $scope.counter,
                $rootScope.galletainfo,
                $scope.myWelcome,
                $scope.observacion,
                $scope.datoscambioEquipo = 0
            ).then((data) => {
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
                        type: "success",
                        title: 'Bien',
                        text: data.data.msj,
                        timer: 4000,
                    }).then(() => {
                        $route.reload();
                    })
                } else if (data.data.state == 0) {
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

        $scope.limpiar = function () {
            location.reload();
        }

        $scope.procesos();
    }
})();
