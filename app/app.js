var app = angular.module("seguimientopedidos", [
    "ngRoute",
    "ngCookies",
    "ng-fusioncharts",
    "ngAnimate",
    "ngTouch",
    "ui.bootstrap",
    "angularjs-datetime-picker",
    "angularFileUpload",
    "ui",
    "jcs-autoValidate",
    "ui.grid",
    "ui.grid.pagination",
    "ui.grid.selection",
    "ui.grid.edit",
    "ui.grid.cellNav",
    "ui.grid.exporter",
    "ui.grid.autoResize",
    "chart.js",
    "angular.filter",
]);

app.service("fileUpload", [
    "$http",
    "$cookieStore",
    function ($http, $cookieStore) {
        this.uploadFileToUrl = function (file, uploadUrl, login, tipocarga) {
            var fd = new FormData();
            var user = login;
            file["user"] = user + "6666666";

            fd.append("user", user);
            fd.append("tipocarga", tipocarga);

            fd.append("fileUpload", file);

            if (
                tipocarga == "vistaCliente" ||
                tipocarga == "alarmados" ||
                tipocarga == "SeguiClick"
            ) {
                $http.post("services/cargar_datos", fd, {
                    withCredentials: false,
                    transformRequest: angular.identity,
                    headers: {"Content-Type": undefined},
                    params: {user: user, tipocarga: tipocarga},
                    responseType: "arraybuffer",
                });
            } else {
                $http.post("services/cargar_datosNPS", fd, {
                    withCredentials: false,
                    transformRequest: angular.identity,
                    headers: {"Content-Type": undefined},
                    params: {user: user},
                    responseType: "arraybuffer",
                });
            }
        };
    },
]);

app.service("fileUploadrepa", [
    "$http",
    "$cookieStore",
    function ($http, $cookieStore) {
        this.uploadFileToUrl = function (file, uploadUrl, login) {
            var fd = new FormData();
            var user = login;
            file["user"] = user + "6666666";

            fd.append("user", user);
            fd.append("fileUpload", file);

            $http.post("services/cargar_datosNPSreparacion", fd, {
                withCredentials: false,
                transformRequest: angular.identity,
                headers: {"Content-Type": undefined},
                params: {user: user},
                responseType: "arraybuffer",
            });
        };
    },
]);

app.service("cargaRegistros", [
    "$http",
    "$cookieStore",
    "$q",
    function ($http, $cookieStore, $q) {
        this.uploadFileToUrl = function (file, uploadUrl, login) {
            var fd = new FormData();
            var user = login;
            file["user"] = user + "6666666";

            fd.append("user", user);
            fd.append("fileUpload", file);
            var deffered = $q.defer();
            $http
                .post("services/cargaRegistros", fd, {
                    withCredentials: false,
                    transformRequest: angular.identity,
                    headers: {"Content-Type": undefined},
                    params: {user: user},
                    responseType: "arraybuffer",
                })
                .then(function (response) {
                    deffered.resolve(response);
                })
                .catch(function (response) {
                    deffered.reject(response);
                });

            return deffered.promise;
        };
    },
]);

app.directive("fileModel", [
    "$parse",
    function ($parse) {
        return {
            restrict: "A",
            link: function (scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind("change", function () {
                    scope.$apply(function () {
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            },
        };
    },
]);

app.factory("services", [
    "$http",
    "$timeout",
    function ($http, $q, $timeout) {
        var serviceBase = "services/";
        var serviceBase1 =
            "http://netvm-ptctrl01a/seguimientopedidos/api/controller/";
        //var serviceBase1 = 'http://localhost/seguimientopedidos/api/controller/';
        var obj = {};

        /**
         * authentication
         */

        obj.loginUser = function (datosAutenticacion) {
            var data = {
                method: "login",
                data: datosAutenticacion,
            };
            return $http.post(serviceBase1 + "authenticationCtrl.php", data);
        };

        obj.cerrarsesion = function () {
            var data = {
                method: "logout",
            };
            return $http.post(serviceBase1 + "authenticationCtrl.php", data);
        };

        /**
         * Alarma
         */

        obj.creaAlarma = function (datosCrearAlarma) {
            var data = {
                method: "nuevaAlarma",
                data: datosCrearAlarma,
            };
            return $http.post(serviceBase1 + "alarmaCtrl.php", data);
        };

        obj.editAlarma = function (datosAlarma) {
            var data = {
                method: "editAlarma",
                data: datosAlarma,
            };
            return $http.post(serviceBase1 + "alarmaCtrl.php", data);
        };

        obj.listadoAlarmas = function () {
            var data = {
                method: "listadoAlarmas",
            };
            return $http.post(serviceBase1 + "alarmaCtrl.php", data);
        };

        obj.deleteAlarma = function (id) {
            var data = {
                method: "deleteAlarma",
                data: id,
            };
            return $http.post(serviceBase1 + "alarmaCtrl.php", data);
        };

        /**
         * usuario
         */

        obj.editarUsuario = function (datosEdicion) {
            var data = {
                method: "editarUsuario",
                data: datosEdicion,
            };
            return $http.post(serviceBase1 + "userCtrl.php", data);
        };

        obj.editarRegistro = function (datosEdicion) {
            var data = {
                method: "editarRegistro",
                data: {
                    datosEdicion: datosEdicion,
                },
            };
            return $http.post(serviceBase1 + "userCtrl.php", data);
        };

        obj.pedidoComercial = function (datospedidoComercial) {
            var data = {
                method: "CrearpedidoComercial",
                data: {
                    datospedidoComercial: datospedidoComercial,
                },
            };
            return $http.post(serviceBase1 + "userCtrl.php", data);
        };

        obj.getGuardarPlan = function (datosPlan) {
            var data = {
                method: "guardarPlan",
                data: datosPlan,
            };
            return $http.post(serviceBase1 + "userCtrl.php", data);
        };

        obj.pedidoOffline = function (datospedidoOffline) {
            var data = {
                method: "CrearpedidoOffline",
                data: datospedidoOffline,
            };
            return $http.post(serviceBase1 + "userCtrl.php", data);
        };

        obj.ingresarPedidoAsesor = function (
            datospedido,
            pedido,
            empresa,
            duracion_llamada,
            datosClick,
            plantilla,
            idcambioequipo
        ) {
            var data = {
                method: "ingresarPedidoAsesor",
                data: {
                    datospedido: datospedido,
                    pedido: pedido,
                    empresa: empresa,
                    duracion_llamada: duracion_llamada,
                    datosClick: datosClick,
                    plantilla: plantilla,
                    idcambioequipo: idcambioequipo,
                },
            };
            return $http.post(serviceBase1 + "userCtrl.php", data);
        };

        obj.creaUsuario = function (datosCrearUsuario) {
            var data = {
                method: "creaUsuario",
                data: datosCrearUsuario,
            };
            return $http.post(serviceBase1 + "userCtrl.php", data);
        };

        obj.creaTecnico = function (datosCrearTecnico, id_tecnico) {
            var data = {
                method: "creaTecnico",
                data: {
                    datosCrearTecnico: datosCrearTecnico,
                    id_tecnico: id_tecnico,
                },
            };
            return $http.post(serviceBase1 + "userCtrl.php", data);
        };

        obj.listadoUsuarios = function (datos) {
            var data = {
                method: "listadoUsuarios",
                data: datos,
            };
            return $http.post(serviceBase1 + "userCtrl.php", data);
        };

        obj.deleteUsuario = function (id) {
            var data = {
                method: "borrarUsuario",
                data: id,
            };
            return $http.post(serviceBase1 + "userCtrl.php", data);
        };

        obj.deleteTecnico = function (id) {
            var data = {
                method: "borrarTecnico",
                data: id,
            };
            return $http.post(serviceBase1 + "userCtrl.php", data);
        };

        obj.editarTecnico = function (datosTecnico) {
            var data = {
                method: "editarTecnico",
                data: datosTecnico,
            };
            return $http.post(serviceBase1 + "userCtrl.php", data);
        };

        /**
         * services por organizar
         */

        obj.insertarCambioEquipo = function (tecnologia, datoscambio, pedido) {
            var data = {
                method: "insertarCambioEquipo",
                data: {
                    tecnologia: tecnologia,
                    datoscambio: datoscambio,
                    pedido: pedido,
                },
            };
            return $http.post(serviceBase1 + "otherServicesCtrl.php", data);
        };

        obj.getGuardarPedidoEncuesta = function (
            infoPedidoEncuesta,
            gestionDolores,
            counter,
            fechaInicial,
            fechaFinal
        ) {
            var data = {
                method: "GuardarPedidoEncuesta",
                data: {
                    infoPedidoEncuesta: infoPedidoEncuesta,
                    gestionDolores: gestionDolores,
                    counter: counter,
                    fechaInicial: fechaInicial,
                    fechaFinal: fechaFinal,
                },
            };
            return $http.post(serviceBase1 + "otherServicesCtrl.php", data);
        };

        obj.getGuardargestiodespachoBrutal = function (datosguardar) {
            var data = {
                method: "gestiodespachoBrutal",
                data: datosguardar,
            };
            return $http.post(serviceBase1 + "otherServicesCtrl.php", data);
        };

        obj.datosGestionFinal = function () {
            var data = {
                method: "gestionFinal",
            };
            return $http.post(serviceBase1 + "otherServicesCtrl.php", data);
        };

        obj.getDashBoard = function () {
            var data = {
                method: "DashBoard",
            };
            return $http.post(serviceBase1 + "otherServicesCtrl.php", data);
        };

        obj.getGuardargestioAsesor = function (datosguardar, datosDespacho) {
            var data = {
                method: "gestionAsesorBrutal",
                data: {
                    datosguardar: datosguardar,
                    datosDespacho: datosDespacho,
                },
            };
            return $http.post(serviceBase1 + "otherServicesCtrl.php", data);
        };

        obj.guardarContingencia = function (datosguardar) {
            var data = {
                method: "savecontingencia",
                data: datosguardar,
            };
            return $http.post(serviceBase1 + "otherServicesCtrl.php", data);
        };

        obj.CancelContingencia = function (datoscancelar) {
            var data = {
                method: "CancelarContingencias",
                data: datoscancelar,
            };
            return $http.post(serviceBase1 + "otherServicesCtrl.php", data);
        };

        obj.getguardarEscalar = function (gestionescalado) {
            var data = {
                method: "guardarEscalar",
                data: gestionescalado,
            };
            return $http.post(serviceBase1 + "otherServicesCtrl.php", data);
        };

        obj.getGuardargestionFinal = function (datosFinal) {
            var data = {
                method: "gestionAsesorFinal",
                data: datosFinal,
            };
            return $http.post(serviceBase1 + "otherServicesCtrl.php", data);
        };

        obj.getpedidosPendientes = function () {
            var data = {
                method: "gestionPendientes",
            };
            return $http.post(serviceBase1 + "otherServicesCtrl.php", data);
        };

        obj.pedidopendientes = function (datos) {
            var data = {
                method: "Pendientesxestado",
                data: datos,
            };
            return $http.post(serviceBase1 + "otherServicesCtrl.php", data);
        };

        /**
         * otherServicesDos
         */

        obj.getBorrarRegistros = function (datosBorrar) {
            var data = {
                method: "gestionBorrar",
                data: datosBorrar,
            };
            return $http.post(serviceBase1 + "otherServicesDosCtrl.php", data);
        };

        obj.getDesbloquear = function (datos) {
            var data = {
                method: "desbloquear",
                data: datos,
            };
            return $http.post(serviceBase1 + "otherServicesDosCtrl.php", data);
        };

        obj.expCsvdatos = function (valor, datos) {
            var data = {
                method: "csvPreagen",
                data: {
                    valor: valor,
                    datos: datos,
                },
            };
            return $http.post(serviceBase1 + "otherServicesDosCtrl.php", data);
        };

        obj.getexporteContingencias = function (fechaIni, fechafin) {
            var data = {
                method: "csvContingencias",
                data: {
                    fechaIni: fechaIni,
                    fechafin: fechafin,
                },
            };
            return $http.post(serviceBase1 + "otherServicesDosCtrl.php", data);
        };

        obj.expCsvestados = function (datos) {
            var data = {
                method: "csvEstadosClick",
                data: datos,
            };
            return $http.post(serviceBase1 + "otherServicesDosCtrl.php", data);
        };

        obj.expCsvpeniInsta = function (regional) {
            var data = {
                method: "CsvpeniInsta",
                data: regional,
            };
            return $http.post(serviceBase1 + "otherServicesDosCtrl.php", data);
        };

        obj.getexpcsvRRHH = function () {
            return $http.get("http://10.100.66.254:7771/api/exportrrhh");
        };

        obj.expNpsSemana = function (semana) {
            var data = {
                method: "CsvNpsSemana",
                data: semana,
            };
            return $http.post(serviceBase1 + "otherServicesDosCtrl.php", data);
        };

        obj.buscarPedido = function (url, pedidos) {
            var data = {
                method: "buscarPedido",
                data: {
                    url: url,
                    pedidos: pedidos,
                },
            };
            return $http.post(serviceBase1 + "otherServicesDosCtrl.php", data);
        };

        obj.buscarPedidoSeguimiento = function (pedido, producto, remite) {
            var data = {
                method: "buscarPedidoSegui",
                data: {
                    pedido: pedido,
                    producto: producto,
                    remite: remite,
                },
            };
            return $http.post(serviceBase1 + "otherServicesDosCtrl.php", data);
        };

        obj.expCsvRegistros = function (datos) {
            var data = {
                method: "csvRegistros",
                data: datos,
            };
            return $http.post(serviceBase1 + "otherServicesDosCtrl.php", data);
        };

        obj.expBrutalForce = function (fechas) {
            var data = {
                method: "expBrutal",
                data: fechas,
            };
            return $http.post(serviceBase1 + "otherServicesDosCtrl.php", data);
        };

        obj.expCsvtecnico = function (datos) {
            var data = {
                method: "Csvtecnico",
                data: datos,
            };
            return $http.post(serviceBase1 + "otherServicesDosCtrl.php", data);
        };

        obj.getDiferenciasClick = function (fecha) {
            var data = {
                method: "diferenciasClick",
                data: fecha,
            };
            return $http.post(serviceBase1 + "otherServicesDosCtrl.php", data);
        };

        obj.Verobservacionasesor = function (pedido) {
            var data = {
                method: "observacionAsesor",
                data: pedido,
            };
            return $http.post(serviceBase1 + "otherServicesDosCtrl.php", data);
        };

        obj.contadorPendientesBrutalForce = function () {
            var data = {
                method: "contadorpedientesBF",
            };
            return $http.post(serviceBase1 + "otherServicesDosCtrl.php", data);
        };

        obj.getseguimientoClick = function (fecha) {
            var data = {
                method: "seguimientoClick",
                data: fecha,
            };
            return $http.post(serviceBase1 + "otherServicesDosCtrl.php", data);
        };

        obj.registrosComercial = function (page, concepto, dato, inicial, final) {
            var data = {
                method: "registrosComercial",
                data: {
                    page: page,
                    concepto: concepto,
                    dato: dato,
                    inicial: inicial,
                    final: final,
                },
            };
            return $http.post(serviceBase1 + "otherServicesDosCtrl.php", data);
        };

        /*
        infraestructura
        */
        obj.premisasInfraestructuras = function (page, datos) {
            var data = {
                method: "premisasInfraestructuras",
                data: {
                    page: page,
                    datos: datos,
                },
            };
            return $http.post(serviceBase1 + "generacionTtCtrl.php", data);
        };

        obj.guardar = function (registrostt) {
            var data = {
                method: "guardarGeneracionTT",
                data: registrostt,
            };
            return $http.post(serviceBase1 + "generacionTtCtrl.php", data);
        };

        obj.expCsvGeneracionTT = function (datos) {
            var data = {
                method: "csvGeneracionTT",
                data: {
                    datos,
                },
            };
            return $http.post(serviceBase1 + "generacionTtCtrl.php", data);
        };

        /*****SERVICIOS PARA EL MODULO DE ESCALAMIENTO*****/

        obj.premisasInfraestructurasEscalmiento = function (page, datos) {
            var data = {
                method: "escalamientoInfraestructura",
                data: {
                    page: page,
                    datos: datos,
                },
            };
            return $http.post(serviceBase1 + "escalamientoCtrl.php", data);
        };

        // SERVICIO PARA LLAMAR LA INFORMACION DE GRUPO COLA
        obj.getGrupoCola = function () {
            var data = {
                method: "GrupoCola",
            };
            return $http.post(serviceBase1 + "escalamientoCtrl.php", data);
        };

        // SERVICIO PARA LLAMAR LA INFORMACION DE GESTION DE ESCALAMIENTO
        obj.getGestion = function () {
            var data = {
                method: "gestionEscalimiento",
            };
            return $http.post(serviceBase1 + "escalamientoCtrl.php", data);
        };

        // SERVICIO PARA LLAMAR LA INFORMACION DE OBSERVACION DE ESCALAMIENTO
        obj.getObservacionesEscalamiento = function (gestion) {
            var data = {
                method: "observacionEscalimiento",
                data: gestion,
            };
            return $http.post(serviceBase1 + "escalamientoCtrl.php", data);
        };

        // SERVICIO PARA LLAMAR LA INFORMACION DE NOTAS DE ESCALAMIENTO
        obj.getNotasEscalamiento = function (observacion) {
            var data = {
                method: "notasEscalamiento",
                data: observacion,
            };
            return $http.post(serviceBase1 + "escalamientoCtrl.php", data);
        };

        obj.guardarFormEscalamiento = function (escalamiento) {
            var data = {
                method: "infoEscalamiento",
                data: escalamiento,
            };
            return $http.post(serviceBase1 + "escalamientoCtrl.php", data);
        };

        obj.expCsvEscalamiento = function (datos) {
            var data = {
                method: "csvEscalamientoExp",
                data: datos,
            };
            return $http.post(serviceBase1 + "escalamientoCtrl.php", data);
        };

        obj.guardarEscalamiento = function (datosguardar) {
            var data = {
                method: "saveescalamiento",
                data: datosguardar,
            };
            return $http.post(serviceBase1 + "escalamientoCtrl.php", data);
        };

        obj.exportEscalamientos = function () {
            var data = {
                method: "exportEscalamientos",
            };
            return $http.post(serviceBase1 + "escalamientoCtrl.php", data);
        };

        /*------>SERVICIOS PARA EL MODULO DE VISITAS EN CONJUNTO<------*/

        //Servivio para subir la informacion de la tabla a la vista
        obj.premisasVisitasEnConjunto = function (page, datos) {
            var data = {
                method: "visitasEnConjunto",
                data: {
                    page: page,
                    datos: datos,
                },
            };
            return $http.post(serviceBase1 + "visitasEnConjuntoCtrl.php", data);
        };

        // Servicio para llamar la informacion de grupo en las visitas en conjunto
        obj.getGrupoVisitasEnConjunto = function () {
            var data = {
                method: "GrupoVisitasEnConjunto",
            };
            return $http.post(serviceBase1 + "visitasEnConjuntoCtrl.php", data);
        };

        //servicio para guardar la información de visitas en conjunto
        obj.guardarFormVisitasEnConjunto = function (visitasEnConjunto) {
            var data = {
                method: "infoVisitasEnConjunto",
                data: visitasEnConjunto,
            };
            return $http.post(serviceBase1 + "visitasEnConjuntoCtrl.php", data);
        };

        //Servicio para exportar la información de las vistas en conjunto
        obj.expCsvVisitasEnConjunto = function (datos) {
            var data = {
                method: "csvVisitasEnConjuntoExp",
                data: datos,
            };
            return $http.post(serviceBase1 + "visitasEnConjuntoCtrl.php", data);
        };

        // Servicio para llamar las Regiones en visitas en conjunto
        obj.RegionesVisConj = function () {
            var data = {
                method: "RegionesVisConjunto",
            };
            return $http.post(serviceBase1 + "visitasEnConjuntoCtrl.php", data);
        };

        // Servicio para llamar las ciudades en vistas en conjunto, frm registro nuevo
        obj.MunicipiosVisConj = function (region) {
            var data = {
                method: "MunicipiosVisConjunto",
                data: region,
            };
            return $http.post(serviceBase1 + "visitasEnConjuntoCtrl.php", data);
        };

        // Servicio para llamar la ciudad en vistas en conjunto, frm update
        obj.municipiovisconjupdate = function (idregistro) {
            var data = {
                method: "MunicipioVisConjuntoUpdate",
                data: idregistro,
            };
            return $http.post(serviceBase1 + "visitasEnConjuntoCtrl.php", data);
        };

        /*===========================================================*/
        //INICIO SERVICIOS PARA CONTRASEÑAS TECNICOS
        /*===========================================================*/

        obj.registrosContrasenasTecnicos = function (datos) {
            var data = {
                method: "registrospwdTecnicos",
                data: datos,
            };
            return $http.post(serviceBase1 + "novedadesTecnicoCtrl.php", data);
        };

        obj.editarPasswordTecnicos = function (datosEdicion) {
            var data = {
                method: "editarPwdTecnicos",
                data: datosEdicion,
            };
            return $http.post(serviceBase1 + "novedadesTecnicoCtrl.php", data);
        };

        obj.expCsvContrasenasTecnicos = function () {
            var data = {
                method: "csvContrasenasTecnicos",
            };
            return $http.post(serviceBase1 + "novedadesTecnicoCtrl.php", data);
        };

        obj.novedadesTecnicoService = function (datos) {
            var data = {
                method: "novedadesTecnico",
                data: datos
            };
            return $http.post(serviceBase1 + "novedadesTecnicoCtrl.php", data);
        };

        obj.guardarNovedadesTecnico = function (registrosTenicos) {
            var data = {
                method: "guardarNovedadesTecnico",
                data: registrosTenicos,
            };
            return $http.post(serviceBase1 + "novedadesTecnicoCtrl.php", data);
        };

        obj.updateNovedadesTecnico = (observacionCCO, pedido) => {
            var data = {
                method: "updateNovedadesTecnico",
                data: {
                    observacionCCO: observacionCCO,
                    pedido: pedido,
                },
            };
            return $http.post(serviceBase1 + "novedadesTecnicoCtrl.php", data);
        };

        obj.expCsvNovedadesTecnico = function (datos) {
            var data = {
                method: "csvNovedadesTecnico",
                data: datos,
            };
            return $http.post(serviceBase1 + "novedadesTecnicoCtrl.php", data);
        };

        obj.getRegiones = function () {
            var data = {
                method: "Regiones",
            };
            return $http.post(serviceBase1 + "novedadesTecnicoCtrl.php", data);
        };

        obj.getMunicipios = function (region) {
            var data = {
                method: "Municipios",
                data: region,
            };
            return $http.post(serviceBase1 + "novedadesTecnicoCtrl.php", data);
        };

        obj.getSituacion = function () {
            var data = {
                method: "SituacionNovedadesVisitas",
            };
            return $http.post(serviceBase1 + "novedadesTecnicoCtrl.php", data);
        };

        obj.getDetalle = function (situacion) {
            var data = {
                method: "DetalleNovedadesVisitas",
                data: situacion,
            };
            return $http.post(serviceBase1 + "novedadesTecnicoCtrl.php" + data);
        };

        /*------------->INICIO SERVICIOS PARA QUEJASGO<------------*/

        obj.extraeQuejasGoDia = function (datos) {
            var data = {
                method: "extraeQuejasGoDia",
                data: datos

            };
            return $http.post(serviceBase1 + "quejasGoCtrl.php", data);
        };

        obj.expCsvQuejasGo = function (datos) {
            var data = {
                method: "csvQuejasGo",
                data: datos,
            };
            return $http.post(serviceBase1 + "quejasGoCtrl.php", data);
        };

        obj.traerTecnico = function (cedula) {
            var data = {
                method: "traerTecnico",
                data: cedula,
            };
            return $http.post(serviceBase1 + "quejasGoCtrl.php", data);
        };

        obj.creaTecnicoQuejasGo = function (crearTecnicoquejasGoSel) {
            var data = {
                method: "creaTecnicoQuejasGo",
                data: crearTecnicoquejasGoSel,
            };
            return $http.post(serviceBase1 + "quejasGoCtrl.php", data);
        };

        obj.getCiudadesQuejasGo = function () {
            var data = {
                method: "ciudadesQGo",
            };
            return $http.post(serviceBase1 + "quejasGoCtrl.php", data);
        };

        obj.guardarQuejaGo = function (dataquejago, duracion) {
            var data = {
                method: "registrarQuejaGo",
                data: {
                    dataquejago: dataquejago,
                    duracion: duracion,
                },
            };
            return $http.post(serviceBase1 + "quejasGoCtrl.php", data);
        };

        obj.modiObserQuejasGo = function (observacion, idqueja) {
            var data = {
                method: "ActualizarObserQuejasGo",
                data: {
                    observacion: observacion,
                    idqueja: idqueja,
                },
            };
            return $http.post(serviceBase1 + "quejasGoCtrl.php", data);
        };

        // /*RETORNO DE LA INFORMACION DEL APPI DE LA FUNCION datoscontingencias*/
        obj.datosgestioncontingencias = function () {
            var data = {
                method: "datoscontingencias",
            };
            return $http.post(serviceBase1 + "contingenciaCtrl.php", data);
        };

        obj.datosgestioncontingenciasTv = function (curPage, pageSize, sort) {
            var data = {
                method: "datosgestioncontingenciasTv",
                data: {
                    curPage: curPage,
                    pageSize: pageSize,
                    sort: sort,
                },
            };
            return $http.post(serviceBase1 + "contingenciaCtrl.php", data);
        };

        obj.datosgestioncontingenciasInternet = function (curPage, pageSize, sort) {
            var data = {
                method: "datosgestioncontingenciasInternet",
                data: {
                    curPage: curPage,
                    pageSize: pageSize,
                    sort: sort,
                },
            };
            return $http.post(serviceBase1 + "contingenciaCtrl.php", data);
        };

        obj.datosgestioncontingenciasPortafolio = function (
            curPage,
            pageSize,
            sort
        ) {
            var data = {
                method: "datosgestioncontingenciasPortafolio",
                data: {
                    curPage: curPage,
                    pageSize: pageSize,
                    sort: sort,
                },
            };
            return $http.post(serviceBase1 + "contingenciaCtrl.php", data);
        };

        obj.registrosContingenciasCsv = function (datos, param) {
            var data = {
                method: "registrosContingenciasCsv",
                data: {
                    datos: datos,
                    param: param,
                },
            };
            return $http.post(serviceBase1 + "contingenciaCtrl.php", data);
        };

        obj.datosgestionescalamientos = function () {
            var data = {
                method: "datosescalamientos",
            };
            return $http.post(serviceBase1 + "gestionEscalonamientoCtrl.php", data);
        };

        obj.datosgestionescalamientosprioridad2 = function () {
            var data = {
                method: "datosescalamientosprioridad2",
            };
            return $http.post(serviceBase1 + "gestionEscalonamientoCtrl.php", data);
        };

        obj.UpdatePedidosEngestion = function () {
            var data = {
                method: "updateEnGestion",
            };
            return $http.post(
                serviceBase1 + "gestionAprovisionamientoCtrl.php",
                data
            );
        };

        /*Servicio para traer el estado y las observaciones de los pedidos en BrutalForce*/
        obj.ObsPedidosBF = function () {
            var data = {
                method: "BFobservaciones",
            };
            return $http.post(serviceBase1 + "novedadesTecnicoCtrl.php", data);
        };

        obj.registrosOffline = function (datos) {
            var data = {
                method: "registrosOffline",
                data: datos,
            };
            return $http.post(serviceBase1 + "contingenciaCtrl.php", data);
        };

        obj.getgraficaDepartamento = function (mes) {
            var data = {
                method: "graficaDepartamento",
                data: mes,
            };
            return $http.post(serviceBase1 + "contingenciaCtrl.php", data);
        };

        obj.marcarengestion = function (datos, login) {
            var data = {
                method: "marcarengestion",
                data: {datos, login},
            };
            return $http.post(serviceBase1 + "contingenciaCtrl.php", data);
        };

        obj.marcarengestionescalamiento = function (datos, login) {
            return $http.post(serviceBase1 + "marcaescalamiento", {
                datos: datos,
                login: login,
            });
        };

        /*********NUEVO CONECTOR PARA LA APPI marcarEnGestionPorta*********/
        obj.marcarEnGestionPorta = function (datos) {
            var data = {
                method: "marcaPortafolio",
                data: datos,
            };
            return $http.post(serviceBase1 + "contingenciaCtrl.php", data);
        };

        obj.editarregistrocontingencia = function (datos) {
            var data = {
                method: "guardarpedidocontingencia",
                data: datos,
            };
            return $http.post(serviceBase1 + "contingenciaCtrl.php", data);
        };

        obj.editarregistroescalamiento = function (datos, login) {
            var data = {
                method: "guardarescalamiento",
                data: datos,
            };
            return $http.post(serviceBase1 + "contingenciaCtrl.php", data);
        };

        /*PARA CERRAR MASIVAMENTE LAS CONTINGENCIAS*/
        obj.cierreMasivoContingencia = function (dataCierreMasivoContin) {
            var data = {
                method: "cerrarMasivamenteContingencias",
                data: dataCierreMasivoContin,
            };
            return $http.post(serviceBase1 + "contingenciaCtrl.php", data);
        };

        /*********NUEVO CONECTOR PARA LA APPI editarRegistroContingenciaPortafolio*********/
        obj.editarRegistroContingenciaPortafolio = function (datos, login) {
            var data = {
                method: "guardarPedidoContingenciaPortafolio",
                data: datos,
            };
            return $http.post(serviceBase1 + "contingenciaCtrl.php", data);
        };

        obj.getgarantiasInstalaciones = function (mes) {
            var data = {
                method: "garantiasInstalaciones",
                data: mes,
            };
            return $http.post(serviceBase1 + "contingenciaCtrl.php", data);
        };

        obj.getgraficaAcumulados = function (pregunta, mes) {
            var data = {
                method: "graficaAcumulados",
                data: {
                    pregunta: pregunta,
                    mes: mes,
                },
            };
            return $http.post(serviceBase1 + "contingenciaCtrl.php", data);
        };

        //------------------reparacion----
        obj.getgraficaAcumuladosrepa = function (pregunta, mes) {
            var data = {
                method: "graficaAcumuladosrepa",
                data: {
                    pregunta: pregunta,
                    mes: mes,
                },
            };
            return $http.post(serviceBase1 + "contingenciaCtrl.php", data);
        };

        //-------------fin reparacion

        obj.getDepartamentosContratos = function (mes) {
            var data = {
                method: "DepartamentosContratos",
                data: mes,
            };
            return $http.post(serviceBase1 + "otrosServiciosCtrl.php", data);
        };

        obj.insertData = function (lista) {
            var data = {
                method: "insertData",
                data: lista,
            };
            return $http.post(serviceBase1 + "otrosServiciosCtrl.php", data);
        };

        obj.getRegistrosCarga = function () {
            var data = {
                method: "getRegistrosCarga",
            };
            return $http.post(serviceBase1 + "otrosServiciosCtrl.php", data);
        };

        obj.getDemePedidoEncuesta = function () {
            var data = {
                method: "getDemePedidoEncuesta",
            };
            return $http.post(serviceBase1 + "otrosServiciosCtrl.php", data);
        };

        obj.getresumenSemanas = function (pregunta, mes) {
            var data = {
                method: "resumenSemanas",
                data: {
                    pregunta: pregunta,
                    mes: mes,
                },
            };
            return $http.post(serviceBase1 + "otrosServiciosCtrl.php", data);
        };

        obj.listadoTecnicos = function (datos) {
            var data = {
                method: "listadoTecnicos",
                data: datos,
            };
            return $http.post(serviceBase1 + "otrosServiciosCtrl.php", data);
        };

        obj.getresumenContingencias = function (fechaini, fechafin) {
            var data = {
                method: "resumenContingencias",
                data: {
                    fechaini: fechafin,
                    fechafin: fechafin,
                },
            };
            return $http.post(serviceBase1 + "contingenciaCtrl.php", data);
        };

        obj.getbuscarPedidoContingencia = function (pedido) {
            var data = {
                method: "buscarPedidoContingencias",
                data: pedido,
            };
            return $http.post(serviceBase1 + "otrosServiciosCtrl.php", data);
        };

        obj.getCiudades = function () {
            var data = {
                method: "ciudades",
            };
            return $http.post(serviceBase1 + "formaAsesoresCtrl.php", data);
        };

        obj.getRegionesTip = function () {
            var data = {
                method: "regionesTip",
            };
            return $http.post(serviceBase1 + "formaAsesoresCtrl.php", data);
        };

        obj.getProcesos = function () {
            var data = {
                method: "procesos",
            };
            return $http.post(serviceBase1 + "formaAsesoresCtrl.php", data);
        };

        obj.registros = function (datos) {
            var data = {
                method: "registros",
                data: datos,
            };
            return $http.post(serviceBase1 + "formaAsesoresCtrl.php", data);
        };

        obj.registroscsv = function (sort) {
            var data = {
                method: "registroscsv",
                data: {
                    sort: sort,
                },
            };
            return $http.post(serviceBase1 + "formaAsesoresCtrl.php", data);
        };

        /**
         * otherServicesThree
         */

        obj.getpedidosGestionBrutal = function (accion) {
            var data = {
                method: "gestionBrutal",
                data: accion,
            };
            return $http.post(serviceBase1 + "otherServicesThreeCtrl.php", data);
        };

        obj.getBuscarPedidoBrutal = function (pedido) {
            var data = {
                method: "BuscarPedidoBrutal",
                data: pedido,
            };
            return $http.post(serviceBase1 + "otherServicesThreeCtrl.php", data);
        };

        obj.getCalcularMeses = function () {
            var data = {
                method: "meses",
            };
            return $http.post(serviceBase1 + "otherServicesThreeCtrl.php", data);
        };
        obj.getCalcularMesesrepa = function () {
            var data = {
                method: "mesesrepa",
            };
            return $http.post(serviceBase1 + "otherServicesThreeCtrl.php", data);
        };
        /**
         * TODO no existe
         * @returns {*}
         */
        obj.getactualizarregion = function () {
            var data = {
                method: "actualizarregion",
            };
            return $http.post(serviceBase1 + "otherServicesThreeCtrl.php", data);
        };

        obj.getdepartamentos = function () {
            var data = {
                method: "departamentos",
            };
            return $http.post(serviceBase1 + "otherServicesThreeCtrl.php", data);
        };

        obj.getConceptosPendientes = function (interfaz) {
            var data = {
                method: "conceptospendientes",
                data: interfaz,
            };
            return $http.post(serviceBase1 + "otherServicesThreeCtrl.php", data);
        };

        obj.getConceptosTotales = function (regional, interfaz) {
            var data = {
                method: "getConceptosTotales",
                data: {
                    regional: regional,
                    interfaz: interfaz,
                },
            };
            return $http.post(serviceBase1 + "otherServicesThreeCtrl.php", data);
        };

        obj.getResumenInsta = function (departamento) {
            var data = {
                method: "ResumenInsta",
                data: departamento,
            };
            return $http.post(serviceBase1 + "otherServicesThreeCtrl.php", data);
        };

        obj.gettipo_trabajoclick = function () {
            var data = {
                method: "tipo_trabajoclick",
            };
            return $http.post(serviceBase1 + "otherServicesThreeCtrl.php", data);
        };

        /**
         * otherServicesFour
         */

        obj.getUenCargada = function () {
            var data = {
                method: "UenCargada",
            };
            return $http.post(serviceBase1 + "otherServicesFourCtrl.php", data);
        };

        obj.getgestionComercial = function () {
            var data = {
                method: "gestionComercial",
            };
            return $http.post(serviceBase1 + "otherServicesFourCtrl.php", data);
        };
        /**
         * TODO service no existe
         */
        obj.getcausaRaiz = function () {
            var data = {
                method: "causaRaiz",
            };
            return $http.post(serviceBase1 + "otherServicesFourCtrl.php", data);
        };

        /**
         * TODO service no existe
         */

        obj.getResponsablePendiente = function (causaraiz) {
            var data = {
                method: "ResponsablePendiente",
                data: causaraiz,
            };
            return $http.post(serviceBase1 + "otherServicesFourCtrl.php", data);
        };

        /**
         * TODO service no existe
         */

        obj.getlistarPendientesCausaRaiz = function (causaRaiz, fecha) {
            var data = {
                method: "listaCausaRaiz",
                data: {
                    causaRaiz: causaRaiz,
                    fecha: fecha,
                },
            };
            return $http.post(serviceBase1 + "otherServicesFourCtrl.php", data);
        };

        /**
         * TODO service no existe
         */

        obj.getCausasraizinconsitencias = function () {
            var data = {
                method: "Causasraizinconsitencias",
            };
            return $http.post(serviceBase1 + "otherServicesFourCtrl.php", data);
        };

        obj.pendientesBrutalForce = function () {
            var data = {
                method: "pendiBrutal",
            };
            return $http.post(serviceBase1 + "otherServicesFourCtrl.php", data);
        };

        obj.getclasificacionComercial = function (gestion) {
            var data = {
                method: "clasificacionComercial",
                data: gestion,
            };
            return $http.post(serviceBase1 + "otherServicesFourCtrl.php", data);
        };

        obj.getbuscarpedidoRegistros = function (pedido, fecha) {
            var data = {
                method: "buscaregistros",
                data: {
                    pedido: pedido,
                    fecha: fecha,
                },
            };
            return $http.post(serviceBase1 + "otherServicesFourCtrl.php", data);
        };

        obj.recogidaEquipos = function (equiposRecoger) {
            var data = {
                method: "guardarRecogerEquipos",
                data: equiposRecoger,
            };
            return $http.post(serviceBase1 + "otherServicesFourCtrl.php", data);
        };

        obj.listadoEstadosClick = function (listaClick) {
            var data = {
                method: "listadoEstadosClick",
                data: listaClick,
            };
            return $http.post(serviceBase1 + "otrosServiciosDosCtrl.php", data);
        };

        obj.getGuardarPedidoPendiInsta = function (
            pedido,
            datosdelpedido,
            info,
            user
        ) {
            var data = {
                method: "GuardarPedidoPendiInsta",
                data: {
                    pedido: pedido,
                    datosdelpedido: datosdelpedido,
                    info: info,
                    user: user,
                },
            };
            return $http.post(serviceBase1 + "otrosServiciosDosCtrl.php", data);
        };

        obj.deleteregistrosCarga = function (idCarga) {
            var data = {
                method: "deleteregistrosCarga",
                data: idCarga,
            };
            return $http.post(serviceBase1 + "otrosServiciosDosCtrl.php", data);
        };

        obj.getAccionesoffline = function (producto) {
            var data = {
                method: "Accionesoffline",
                data: producto,
            };
            return $http.post(serviceBase1 + "otrosServiciosDosCtrl.php", data);
        };

        obj.getAcciones = function (proceso) {
            var data = {
                method: "acciones",
                data: proceso,
            };
            return $http.post(serviceBase1 + "otrosServiciosDosCtrl.php", data);
        };

        obj.getSubAcciones = function (proceso, accion) {
            var data = {
                method: "SubAcciones",
                data: {
                    proceso: proceso,
                    accion: accion,
                },
            };
            return $http.post(serviceBase1 + "subAccionesCtrl.php", data);
        };

        obj.getCodigos = function (proceso, UNESourceSystem) {
            var data = {
                method: "Codigos",
                data: {
                    proceso: proceso,
                    UNESourceSystem: UNESourceSystem,
                },
            };
            return $http.post(serviceBase1 + "otrosServiciosDosCtrl.php", data);
        };

        obj.getDiagnosticos = function (producto, accion) {
            var data = {
                method: "Diagnosticos",
                data: {
                    producto: producto,
                    accion: accion,
                },
            };
            return $http.post(serviceBase1 + "otrosServiciosDosCtrl.php", data);
        };

        //Turnos
        obj.getusuariosTurnos = function () {
            var data = {
                method: "usuariosTurnos",
            };
            return $http.post(serviceBase1 + "turnosCtrl.php", data);
        };

        obj.getlistaTurnos = function (fechaini, fechafin) {
            var data = {
                method: "listaTurnos",
                data: {
                    fechaini: fechaini,
                    fechafin: fechafin,
                },
            };
            return $http.post(serviceBase1 + "turnosCtrl.php", data);
        };

        obj.getcumplmientoTurnos = function (datos) {
            var data = {
                method: "cumpleTurnos",
                data: datos,
            };
            return $http.post(serviceBase1 + "turnosCtrl.php", data);
        };

        obj.getguardarTurnos = function (datosTurnos) {
            var data = {
                method: "guardarTurnos",
                data: datosTurnos,
            };
            return $http.post(serviceBase1 + "turnosCtrl.php", data);
        };

        obj.updateTurnos = function (datos) {
            var data = {
                method: "updateTurno",
                data: {
                    datos: datos,
                },
            };
            return $http.post(serviceBase1 + "updateTurno.php", data);
        };

        obj.csvAdherenciaTurnos = function (fechaIni, fechaFin) {
            var data = {
                method: "CsvExporteAdherencia",
                data: {
                    fechaIni: fechaIni,
                    fechaFin: fechaFin,
                },
            };
            return $http.post(serviceBase1 + "turnosCtrl.php", data);
        };

        obj.borrarTurno = function (idTurno) {
            var data = {
                method: "deleteTurno",
                data: idTurno,
            };
            return $http.post(serviceBase1 + "turnosCtrl.php", data);
        };

        /* -------------------------------- SOPORTE GPON -------------------------------- */

        obj.getPendientesSoporteGpon = function (task) {
            var data = {
                method: "getSoporteGponByTask",
                data: task,
            };
            return $http.post(serviceBase1 + "soporteGponCtrl.php", data);
        };

        obj.validarLlenadoSoporteGpon = function (task) {
            var data = {
                method: "validarLlenadoSoporteGpon",
                data: task,
            };
            return $http.post(serviceBase1 + "soporteGponCtrl.php", data);
        };

        obj.BuscarSoporteGpon = function (pedido) {
            var data = {
                method: "BuscarSoporteGpon",
                data: {pedido: pedido},
            };
            return $http.post(serviceBase1 + "soporteGponCtrl.php", data);
        };

        obj.postPendientesSoporteGpon = function (
            task,
            arpon,
            nap,
            hilo,
            internet1,
            internet2,
            internet3,
            internet4,
            television1,
            television2,
            television3,
            television4,
            numeroContacto,
            nombreContacto,
            user_id,
            request_id,
            user_identification,
            fecha_solicitud,
            unepedido,
            tasktypecategory,
            unemunicipio,
            uneproductos,
            datoscola,
            engineer_id,
            engineer_name,
            mobile_phone,
            serial,
            mac,
            tipo_equipo,
            velocidad_navegacion,
            observacionTerreno
        ) {
            var data = {
                method: "postPendientesSoporteGpon",
                data: {
                    task: task,
                    arpon: arpon,
                    nap: nap,
                    hilo: hilo,
                    internet1: internet1,
                    internet2: internet2,
                    internet3: internet3,
                    internet4: internet4,
                    television1: television1,
                    television2: television2,
                    television3: television3,
                    television4: television4,
                    numeroContacto: numeroContacto,
                    nombreContacto: nombreContacto,
                    user_id: user_id,
                    request_id: request_id,
                    user_identification: user_identification,
                    fecha_solicitud: fecha_solicitud,
                    unepedido: unepedido,
                    tasktypecategory: tasktypecategory,
                    unemunicipio: unemunicipio,
                    uneproductos: uneproductos,
                    datoscola: datoscola,
                    engineer_id: engineer_id,
                    engineer_name: engineer_name,
                    mobile_phone: mobile_phone,
                    serial: serial,
                    mac: mac,
                    tipo_equipo: tipo_equipo,
                    velocidad_navegacion: velocidad_navegacion,
                    observacionTerreno: observacionTerreno,
                },
            };
            return $http.post(serviceBase1 + "soporteGponCtrl.php", data);
        };

        obj.getListaPendientesSoporteGpon = function () {
            var data = {
                method: "getListaPendientesSoporteGpon",
            };
            return $http.post(serviceBase1 + "soporteGponCtrl.php", data);
        };

        obj.gestionarSoporteGpon = function (
            id_soporte,
            tipificacion,
            tipificaciones,
            observacion,
        ) {
            var data = {
                method: "gestionarSoporteGpon",
                data: {
                    id_soporte: id_soporte,
                    tipificacion: tipificacion,
                    tipificaciones: tipificaciones,
                    observacion: observacion,
                },
            };
            return $http.post(serviceBase1 + "soporteGponCtrl.php", data);
        };

        obj.registrossoportegpon = function (datos) {
            var data = {
                method: "registrossoportegpon",
                data: datos,
            };
            return $http.post(serviceBase1 + "soporteGponCtrl.php", data);
        };

        obj.expCsvRegistrosSoporteGpon = function (datos) {
            var data = {
                method: "csvRegistrosSoporteGpon",
                data: {
                    datos,
                },
            };
            return $http.post(serviceBase1 + "soporteGponCtrl.php", data);
        };

        obj.buscarhistoricoSoporteGpon = function (datos) {
            var data = {
                method: "buscarhistoricoSoporteGpon",
                data: datos,
            };
            return $http.post(serviceBase1 + "soporteGponCtrl.php", data);
        };

        /**
         * TODO no existe
         */

        obj.marcarEngestionGpon = function (datos, login) {
            var data = {
                method: "marcarEngestionGpon",
                data: {
                    datos: datos,
                    login: login,
                },
            };
            return $http.post(serviceBase1 + "soporteGponCtrl.php", data);
        };

        /* --------------- CODIGO INCOMPLETO ---------------- */

        obj.getListaCodigoIncompleto = function (datos) {
            var data = {
                method: "getListaCodigoIncompleto",
                data: datos,
            };
            return $http.post(serviceBase1 + "codigoIncompletoCtrl.php", data);
        };

        obj.gestionarCodigoIncompleto = function (
            id_codigo_incompleto,
            tipificacion,
            observacion
        ) {
            var data = {
                method: "gestionarCodigoIncompleto",
                data: {
                    id_codigo_incompleto: id_codigo_incompleto,
                    tipificacion: tipificacion,
                    observacion: observacion,
                },
            };
            return $http.post(serviceBase1 + "codigoIncompletoCtrl.php", data);
        };

        obj.registroscodigoincompleto = function (datos) {
            var data = {
                method: "registroscodigoincompleto",
                data: datos
            };
            return $http.post(serviceBase1 + "codigoIncompletoCtrl.php", data);
        };

        obj.expCsvRegistrosCodigoIncompleto = function (datos) {
            var data = {
                method: "csvRegistrosCodigoIncompleto",
                data: datos,
            };
            return $http.post(serviceBase1 + "codigoIncompletoCtrl.php", data);
        };

        /**
         * services nivelacion
         */

        obj.searchTicket = function (datos) {
            var data = {
                method: "saveTicket",
                data: datos,
            };
            return $http.post(serviceBase1 + "nivelacionCtrl.php", data);
        };

        obj.searchIdTecnic = function (datos) {
            var data = {
                method: "searchIdTecnic",
                data: datos,
            };
            return $http.post(serviceBase1 + "nivelacionCtrl.php", data);
        };

        obj.saveNivelation = function (datos) {
            var data = {
                method: "saveNivelation",
                data: datos,
            };
            return $http.post(serviceBase1 + "nivelacionCtrl.php", data);
        };

        obj.en_genstion_nivelacion = function () {
            var data = {
                method: "en_genstion_nivelacion",
            };
            return $http.post(serviceBase1 + "nivelacionCtrl.php", data);
        };

        obj.buscarhistoricoNivelacion = function (datos) {
            var data = {
                method: "buscarhistoricoNivelacion",
                data: datos,
            };
            return $http.post(serviceBase1 + "nivelacionCtrl.php", data);
        };

        obj.gestionarNivelacion = function (curPage, pageSize, sort) {
            var data = {
                method: "gestionarNivelacion",
                data: {
                    curPage: curPage,
                    pageSize: pageSize,
                    sort: sort,
                },
            };
            return $http.post(serviceBase1 + "nivelacionCtrl.php", data);
        };

        obj.gestionarRegistrosNivelacion = function (curPage, pageSize, sort) {
            var data = {
                method: "gestionarRegistrosNivelacion",
                data: {
                    curPage: curPage,
                    pageSize: pageSize,
                    sort: sort,
                },
            };
            return $http.post(serviceBase1 + "nivelacionCtrl.php", data);
        };

        obj.guardaNivelacion = function (datos) {
            var data = {
                method: "guardaNivelacion",
                data: datos,
            };
            return $http.post(serviceBase1 + "nivelacionCtrl.php", data);
        };

        obj.marcarEnGestionNivelacion = function (datos) {
            var data = {
                method: "marcarEnGestionNivelacion",
                data: datos,
            };
            return $http.post(serviceBase1 + "nivelacionCtrl.php", data);
        };

        obj.csvNivelacion = function (datos) {
            var data = {
                method: "csvNivelacion",
                data: {
                    datos: datos,
                },
            };
            return $http.post(serviceBase1 + "nivelacionCtrl.php", data);
        };

        /*
        kpi
        */

        obj.contigenciaDiario = function (datos) {
            var data = {
                method: "contigenciaDiario",
                data: datos,
            };
            return $http.post(serviceBase1 + "kpiCtrl.php", data);
        };

        obj.contigenciaAgente = function (datos) {
            var data = {
                method: "contigenciaAgente",
                data: datos,
            };
            return $http.post(serviceBase1 + "kpiCtrl.php", data);
        };

        obj.contigenciaHoraAgente = function (datos) {
            var data = {
                method: "contigenciaHoraAgente",
                data: datos,
            };
            return $http.post(serviceBase1 + "kpiCtrl.php", data);
        };

        obj.contigenciaHoraAgenteApoyo = function (datos) {
            var data = {
                method: "contigenciaHoraAgenteApoyo",
                data: datos,
            };
            return $http.post(serviceBase1 + "kpiCtrl.php", data);
        };

        obj.contigenciaHoraAgenteTiempoCompleto = function (datos) {
            var data = {
                method: "contigenciaHoraAgenteTiempoCompleto",
                data: datos,
            };
            return $http.post(serviceBase1 + "kpiCtrl.php", data);
        };

        obj.contigenciaHoraAgenteMmss = function (datos) {
            var data = {
                method: "contigenciaHoraAgenteMmss",
                data: datos,
            };
            return $http.post(serviceBase1 + "kpiCtrl.php", data);
        };

        obj.contigenciaHoraAgenteEmtelco = function (datos) {
            var data = {method: 'AgenteEmtelco', data: datos}
            return $http.post(serviceBase1 + 'kpiCtrl.php', data);

        }

        /**
         * services ventas instale
         */

        obj.datosVentas = function () {
            var data = {
                method: "datosVentas",
            };
            return $http.post(serviceBase1 + "ventaInstaleCtrl.php", data);
        };

        obj.datosVentasInstaleTerminado = function (datos) {
            var data = {
                method: "datosVentasTerminado",
                data: datos,
            };
            return $http.post(serviceBase1 + "ventaInstaleCtrl.php", data);
        };

        obj.marcarEnGestionVentaInstale = function (datos) {
            var data = {
                method: "marcarEnGestionVentaInstale",
                data: {
                    data: datos,
                },
            };
            return $http.post(serviceBase1 + "ventaInstaleCtrl.php", data);
        };

        obj.guardaVentaInstale = function (datos) {
            var data = {
                method: "guardaVentaInstale",
                data: {
                    data: datos,
                },
            };
            return $http.post(serviceBase1 + "ventaInstaleCtrl.php", data);
        };

        obj.detallePedidoVenta = function (datos) {
            var data = {
                method: "detallePedidoVenta",
                data: datos,
            };
            return $http.post(serviceBase1 + "ventaInstaleCtrl.php", data);
        };

        obj.detalleVentaRagoFecha = function (datos) {
            var data = {
                method: "detalleVentaRagoFecha",
                data: datos,
            };
            return $http.post(serviceBase1 + "ventaInstaleCtrl.php", data);
        };

        obj.csvVentaInstale = function (datos) {
            var data = {
                method: "csvVentaInstale",
                data: {
                    data: datos,
                },
            };
            return $http.post(serviceBase1 + "ventaInstaleCtrl.php", data);
        };

        obj.guardaObservacionParaVentaInstale = function (datos) {
            var data = {
                method: "guardaObservacionParaVentaInstale",
                data: {
                    data: datos,
                },
            };
            return $http.post(serviceBase1 + "ventaInstaleCtrl.php", data);
        };

        obj.observacionDetalleVentaModal = function (datos) {
            var data = {
                method: "observacionDetalleVentaModal",
            };
            return $http.post(serviceBase1 + "ventaInstaleCtrl.php", data);
        };

        obj.eliminaObservacion = function (datos) {
            var data = {
                method: "eliminaObservacion",
                data: {
                    data: datos,
                },
            };
            return $http.post(serviceBase1 + "ventaInstaleCtrl.php", data);
        };

        obj.consolidadoZona = function (datos) {
            var data = {
                method: "consolidadoZona",
                data: datos,
            };
            return $http.post(serviceBase1 + "ventaInstaleCtrl.php", data);
        };

        /**
         * !nuevo quejas go
         */

        obj.datosQuejasGo = function () {
            data = {method: 'datosQuejasGo'}
            return $http.post(serviceBase1 + 'gestionQuejasGoCtrl.php', data);
        }

        obj.datosQuejasGoTerminado = function (datos) {
            data = {method: 'datosQuejasGoTerminado', data: datos}
            return $http.post(serviceBase1 + 'gestionQuejasGoCtrl.php', data);
        }

        obj.marcarEnGestionQuejasGo = function (datos) {
            data = {method: 'marcarEnGestionQuejasGo', data: datos}
            return $http.post(serviceBase1 + 'gestionQuejasGoCtrl.php', data);
        }

        obj.guardaGestionQuejasGo = function (datos) {
            data = {method: 'guardaGestionQuejasGo', data: datos}
            return $http.post(serviceBase1 + 'gestionQuejasGoCtrl.php', data);
        }

        obj.detalleNumeroQuejaGo = function (datos) {
            data = {method: 'detalleNumeroQuejaGo', data: datos}
            return $http.post(serviceBase1 + 'gestionQuejasGoCtrl.php', data);
        }

        obj.csvQuejaGo = function (datos) {
            data = {method: 'csvQuejaGo', data: datos}
            return $http.post(serviceBase1 + 'gestionQuejasGoCtrl.php', data);
        }

        return obj;
    },
]);

app.service("LoadingInterceptor", [
    "$q",
    "$rootScope",
    "$log",
    function ($q, $rootScope, $log) {
        "use strict";

        var xhrCreations = 0;
        var xhrResolutions = 0;

        function isLoading() {
            return xhrResolutions < xhrCreations;
        }

        function updateStatus() {
            $rootScope.loading = isLoading();
        }

        return {
            request: function (config) {
                xhrCreations++;
                updateStatus();
                return config;
            },
            requestError: function (rejection) {
                xhrResolutions++;
                updateStatus();
                $log.error("Request error:", rejection);
                return $q.reject(rejection);
            },
            response: function (response) {
                xhrResolutions++;
                updateStatus();
                return response;
            },
            responseError: function (rejection) {
                xhrResolutions++;
                updateStatus();
                $log.error("Response error:", rejection);
                return $q.reject(rejection);
            },
        };
    },
]);

app.controller("loginCtrl", function ($scope, $rootScope, $location, $cookies, services) {
    $scope.login = function () {
        services.loginUser($scope.autenticacion).then(complete).catch(failed);

        function complete(data) {
            console.log(data, ' opop');
            if (data.data.state != 1) {
                Swal({
                    type: "error",
                    title: "Oops...",
                    text: data.data.msj,
                    timer: 4000,
                });
            } else {
                var today = new Date();
                $rootScope.year = today.getFullYear();
                $rootScope.nombre = data.data.data.nombre;
                $rootScope.login = data.data.data.login;
                $rootScope.perfil = data.data.data.perfil;
                $rootScope.identificacion = data.data.data.identificacion;
                $rootScope.authenticated = true;
                $rootScope.permiso = true;
                $location.path("/actividades/");
                $cookies.put("usuarioseguimiento", JSON.stringify(data.data.data));

                var galleta = JSON.parse($cookies.get("usuarioseguimiento"));

                $rootScope.galletainfo = galleta;
                $rootScope.permiso = true;
            }
        }

        function failed(response) {
            console.log(response);
        }
    };
});

app.controller('actividadesCtrl', function ($scope, $http, $rootScope, $location, $route, $routeParams, $cookies, $timeout, services) {
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

    $scope.usuarios = function (editarUser) {
        $scope.update = false;
        if (editarUser.PASSWORD == "") {
            alert("Por favor ingrese la contraseña");
            return;
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
        $scope.idUsuario = $rootScope.galletainfo.ID;
        $scope.UsuarioNom = $rootScope.galletainfo.NOMBRE;
        $scope.TituloModal = "Editar Usuario con el ID:";
    }

    $scope.procesos = function () {
        $scope.validaraccion = false;
        $scope.validarsubaccion = false;
        services.getProcesos().then(function (data) {
            console.log('lolo', data);
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
                {ID: 'O-01 - Red pendiente en edificios y urbanizaciones', SUBACCION: 'O-01 - Red pendiente en edificios y urbanizaciones'},
                {ID: 'O-02 - Pendiente cliente no autoriza', SUBACCION: 'O-02 - Pendiente cliente no autoriza'},
                {ID: 'O-06 - Gestión de instalaciones', SUBACCION: 'O-06 - Gestión de instalaciones'},
                {ID: 'O-09 - Pendiente por porteria madera', SUBACCION: 'O-09 - Pendiente por porteria madera'},
                {ID: 'O-11 - Pend tiene línea con otro operador', SUBACCION: 'O-11 - Pend tiene línea con otro operador'},
                {ID: 'O-13 - Red pendiente en exteriores', SUBACCION: 'O-13 - Red pendiente en exteriores'},
                {ID: 'O-14 - Ped solicitud repetida', SUBACCION: 'O-14 - Ped solicitud repetida'},
                {ID: 'O-15 - Pendiente por mala asignación', SUBACCION: 'O-15 - Pendiente por mala asignación'},
                {ID: 'O-20 - Pendi inconsistencias infraestructura', SUBACCION: 'O-20 - Pendi inconsistencias infraestructura'},
                {ID: 'O-40 - Pendiente x orden público y/o factores climát', SUBACCION: 'O-40 - Pendiente x orden público y/o factores climát'},
                {ID: 'O-48 - Red mal estado', SUBACCION: 'O-48 - Red mal estado'},
                {ID: 'O-49 - No desea el servicio', SUBACCION: 'O-49 - No desea el servicio'},
                {ID: 'O-50 - Cliente ilocalizado', SUBACCION: 'O-50 - Cliente ilocalizado'},
                {ID: 'O-51 - Pend tiene línea con otro operador', SUBACCION: 'O-51 - Pend tiene línea con otro operador'},
                {ID: 'O-53 - Inconsistencia información', SUBACCION: 'O-53 - Inconsistencia información'},
                {ID: 'O-69 - Pen cliente no contactado', SUBACCION: 'O-69 - Pen cliente no contactado'},
                {ID: 'O-85 - Red externa pendiente', SUBACCION: 'O-85 - Red externa pendiente'},
                {ID: 'O-86 - Pendiente por nodo xdsl', SUBACCION: 'O-86 - Pendiente por nodo xdsl'},
                {ID: 'O-100 - Pendiente solución con proyecto', SUBACCION: 'O-100 - Pendiente solución con proyecto'},
                {ID: 'O-101 - Renumerar o reconfigurar oferta', SUBACCION: 'O-101 - Renumerar o reconfigurar oferta'},
                {ID: 'O-103 - Pendiente por autorización de terceros', SUBACCION: 'O-103 - Pendiente por autorización de terceros'},
                {ID: 'O-112 - Pendiente por reparación de red', SUBACCION: 'O-112 - Pendiente por reparación de red'},
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
                {ID: 'O-08 - Pendiente por orden del suscriptor', SUBACCION: 'O-08 - Pendiente por orden del suscriptor'},
                {ID: 'O-23 - Pendiente no contestan', SUBACCION: 'O-23 - Pendiente no contestan'},
                {ID: 'OT-C02 - Cliente ilocalizado', SUBACCION: 'OT-C02 - Cliente ilocalizado'},
                {ID: 'OT-C06 - Inconsistencia información', SUBACCION: 'OT-C06 - Inconsistencia información'},
                {ID: 'OT-T02 - Gestión de instalaciones', SUBACCION: 'OT-T02 - Gestión de instalaciones'},
                {ID: 'O-34 - Pendiente por factores climáticos', SUBACCION: 'O-34 - Pendiente por factores climáticos'},
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
            $scope.listadocodigos = data.data.data;
        }, function errorCallback(response) {
            if (response.status == "200") {

            }
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
            alert("Por favor seleccione el producto");
            return;
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
                alert("Por favor seleccione el producto");
                return;
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
                alert("Para los productos DTH y LTE no aplica cumplir con parametros");
                return;
            } else if ($scope.gestionmanual.CIUDAD == "MESA DE AYUDA" || $scope.gestionmanual.CIUDAD == "MIGRACIONES" || $scope.gestionmanual.CIUDAD == "TECNICOS DE APOYO") {
                alert("Para los despachos Mesa, migraciones y técnicos de apoyo no aplica cumplir con parametros");
                return;
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
                alert("Por favor seleccione el producto");
                return;
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
            console.log($scope.observacion);
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
            ;

            $scope.observacion = "Productos: " + producto + ", CR o Autoriza: " + $scope.contingenciaNuevo.autoriza + ", Decos: " + $scope.contingenciaNuevo.Decos + ", línea: " + $scope.contingenciaNuevo.linea + ", MAC de datos: " + $scope.contingenciaNuevo.MacDatos + ", MAC de voz: " + $scope.contingenciaNuevo.MacVoz
            console.log($scope.observacion);
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
            ;

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
            alert("Por favor ingresar el tecnico.");
            return;
        }

        if ($scope.gestionmanual.producto == "" || $scope.gestionmanual.producto == undefined) {
            alert("Por favor ingresar el producto.");
            return;
        }

        services.recogidaEquipos(equiposRecoger).then(
            function (respuesta) {
                if (respuesta.status == '201' || respuesta.status == '200') {
                    Swal(
                        'Los equipos a recoger fueron guardados!',
                        'Bien Hecho'
                    )
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

        $scope.url =
            "http://10.100.66.254:8080/BB8/contingencias/Buscar/GetClick/" + pedido;
        $http
            .get($scope.url, {timeout: 4000})
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
                console.log($scope.clic.Duration);
                $scope.Duration = parseInt($scope.clic.Duration);
                $scope.Duration = ($scope.Duration / 60);
                $scope.url =
                    "http://10.100.66.254:8080/BB8/contingencias/Buscar/GetPlanBaMSS/" +
                    pedido;
                $http
                    .get($scope.url, {timeout: 4000})
                    .then(function (data) {
                        console.log(data, " internet ");
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
                            $scope.url =
                                "http://10.100.66.254:8080/BB8/contingencias/Buscar/GetPlanBaMSS/" +
                                $scope.clic.UNECodigoDireccionServicio;
                            $http.get($scope.url, {timeout: 4000}).then(function (data) {
                                console.log(data, " internet2 ");
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
                        $scope.url =
                            "http://10.100.66.254:8080/BB8/contingencias/Buscar/GetPlanTOMSS/" +
                            pedido;
                        $http
                            .get($scope.url, {timeout: 4000})
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
                                    $scope.url =
                                        "http://10.100.66.254:8080/BB8/contingencias/Buscar/GetPlanTOMSS/" +
                                        $scope.clic.UNECodigoDireccionServicio;
                                    $http
                                        .get($scope.url, {timeout: 4000})
                                        .then(function (data) {
                                            console.log(data, " telefonia2");
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
                                $scope.url =
                                    "http://10.100.66.254:8080/BB8/contingencias/Buscar/GetPlanTVMSS/" +
                                    pedido;
                                $http
                                    .get($scope.url, {timeout: 4000})
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
                                                    $scope.paquete = $scope.recore[i].VALID_VALUE;
                                                    $scope.paquete1 = $scope.recore[i].VALUE_LABEL;
                                                }

                                            }
                                        } else {
                                            $scope.url =
                                                "http://10.100.66.254:8080/BB8/contingencias/Buscar/GetPlanTVMSS/" +
                                                $scope.clic.UNECodigoDireccionServicio;
                                            $http
                                                .get($scope.url, {timeout: 4000})
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
                                                                $scope.paquete = $scope.recore[i].VALID_VALUE;
                                                                $scope.paquete1 = $scope.recore[i].VALUE_LABEL;
                                                            }

                                                        }
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
            alert("Ingrese un pedido para buscar");
            $scope.sininfopedido = false;
            return;
        } else {

            $scope.sininfopedido = true;
            $scope.url = "http://" + $scope.ipServer + ":8080/HCHV/Buscar/" + pedido;
            $http.get($scope.url, {timeout: 2000})
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
                        $http.get($scope.url, {timeout: 2000})
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
        }

    }

    function buscarDataSara(pedido) {

        var tareaSara = pedido;
        $scope.urlServicio = "http://10.100.66.254:8080/SARA/Buscar/" + tareaSara;

        $http.get($scope.urlServicio, {timeout: 8000}).then(function (data) {
                console.log(data, 'sara');
                $scope.dataSara = data.data;

                if ($scope.dataSara.Error == "No hay datos para mostrar") {

                    $scope.horasTranscurridas = 0;
                    $scope.minutosTranscurridos = 0;
                    $scope.segundosTranscurridos = 0;

                    Swal({
                        type: 'error',
                        title: 'Oops...',
                        text: 'Aún no se hace la solicitud a SARA',
                    })
                }

                $scope.indiceSara = (Object.keys($scope.dataSara.SolicitudesSara).length) - 1;
                var tiempoSara = $scope.dataSara.SolicitudesSara[$scope.indiceSara].TiempoRespuesta;
                $scope.horasTranscurridas = tiempoSara.substr(0, 2);
                $scope.minutosTranscurridos = tiempoSara.substr(3, 2);
                $scope.segundosTranscurridos = tiempoSara.substr(6, 2);
                return data.data;
            },

            function (Error) {

                Swal({
                    type: 'error',
                    title: 'Oops...',
                    text: 'Se presentan problemas con el Web Service, reporta con el administrador',
                })
            });
    }


    $scope.BuscarPedido = function (pedido) {
        if(!pedido){
            Swal({
                type: 'error',
                title: 'Oops...',
                text: 'Ingrese el pedido a buscar',
                timer: 4000
            })
            return;
        }
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
        data = {'buscar': 'identificacion', 'variable': $scope.gestionmanual.tecnico, 'page': 1, 'size': 15}

        services.listadoTecnicos(data).then(
            function (data) {

                $scope.Tecnico = data.data.data;
                $scope.tecnico = $scope.Tecnico[0].NOMBRE;
                $scope.empresa = $scope.Tecnico[0].NOM_EMPRESA;
                if ($scope.Tecnico[0].CELULAR == "") {
                    alert("El número de celular del tecnico no existe!");
                    $scope.celular = "0000000000";
                } else {
                    $scope.celular = $scope.Tecnico[0].CELULAR;
                }
                //   console.log($scope.Tecnico[0]);
                $scope.creaTecnico = true;
                return;
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
            alert("Debe seleccionar el tipo de interacción.");
            return;
        }

        if (($scope.gestionmanual.interaccion == "llamada" && $scope.gestionmanual.id_llamada == "") || ($scope.gestionmanual.interaccion == "llamada" && $scope.gestionmanual.id_llamada == undefined)) {
            alert("Por favor ingresar el ID de llamada.");
            return;
        }

        if ($scope.gestionmanual.interaccion == "llamada" && $scope.gestionmanual.id_llamada.length > 40) {
            alert("Por favor ingrese un Id de Llamada válido.");
            return;
        }

        if ($scope.gestionmanual.tecnico == "" || $scope.gestionmanual.tecnico == undefined) {
            alert("Por favor ingresar el tecnico.");
            return;
        }

        if ($scope.gestionmanual.producto == "" || $scope.gestionmanual.producto == undefined) {
            alert("Por favor ingresar un producto.");
            return;
        }

        if ($scope.gestionmanual.proceso == "" || $scope.gestionmanual.proceso == undefined) {
            alert("Por favor ingresar el proceso.");
            return;
        }

        if ($scope.gestionmanual.accion == "" || $scope.gestionmanual.accion == undefined) {
            alert("Por favor ingresar una accion.");
            return;
        }

        if ($scope.gestionmanual.accion == "Soporte GPON" && ($scope.gestionmanual.subAccion == "" || $scope.gestionmanual.subAccion == undefined)) {
            alert("Por favor ingresar una subaccion.");
            return;
        }

        //se quita validaciones requerimiento por carlos 3-04-2023
        /*if ($scope.gestionmanual.proceso == "Reparaciones" && $scope.gestionmanual.accion == "Cambio Equipo") {
            if ($scope.gestionmanual.macEntra == "" || $scope.gestionmanual.macEntra == undefined || $scope.gestionmanual.macSale == "" || $scope.gestionmanual.macSale == undefined) {
                alert("Debes de ingresar al menos una MAC Entra y una MAC Sale.");
                return;
            }
        }*/

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
        ).then(
            function (data) {
                $route.reload();
            },
            function errorCallback(response) {
                console.log(response);
            }
        )
    }

    $scope.limpiar = function () {
        location.reload();
    }

    $scope.procesos();
});

app.controller(
    "premisasInfraestructurasCtrl",
    function (
        $scope,
        $rootScope,
        $location,
        $route,
        $cookies,
        services
    ) {
        $scope.isInfraestructureFromField = false;
        $scope.isInfraestructureFromIntranet = false;
        $scope.isLoadingData = true;
        $scope.dataEscalamientoInfraestructura = [];
        $scope.dataEscalamientoInfraestructuraPrioridad2 = [];

        $scope.listarescalamientosinfraestructura = () => {
            database
                .collection("infraestructure")
                .where("status", "==", 0)
                .orderBy("dateCreated", "asc")
                .get()
                .then((querySnapshot) => {
                    $scope.isInfraestructureFromField = false;
                    $scope.listaEscalamientosInfraestructura = [];
                    querySnapshot.forEach((doc) => {
                        let dataQuerySnapshot = {};
                        dataQuerySnapshot = {
                            _id: doc.id,
                            addressTap: doc.data().addressTap,
                            observaciones: doc.data().comments,
                            dateCreated: doc.data().dateCreated,
                            correa_marcacion: doc.data().isMarkInstalledSif,
                            isPhoto: doc.data().isPhoto,
                            isSmnetTestSif: doc.data().isSmnetTestSif,
                            mac_real_cpe: doc.data().macRealCPE,
                            markTap: doc.data().markTap,
                            netType: doc.data().netType,
                            proceso: doc.data().process,
                            producto: doc.data().product,
                            motivo: doc.data().subject,
                            status: doc.data().status,
                            pedido: doc.data().task,
                            user_ID: doc.data().user_ID,
                            user_identification: doc.data().user_identification,
                            vTap: doc.data().vTap,
                            informacion_adicional: doc.data().concatData,
                        };

                        var date = dataQuerySnapshot.dateCreated.toDate();
                        var year = date.getFullYear();
                        var month = date.getMonth();
                        var day = "0" + date.getDate();
                        var hours = "0" + date.getHours();
                        var minutes = "0" + date.getMinutes();
                        var seconds = "0" + date.getSeconds();

                        var formattedTime =
                            year +
                            "-" +
                            (month + 1) +
                            "-" +
                            day.substr(-2) +
                            " " +
                            hours.substr(-2) +
                            ":" +
                            minutes.substr(-2) +
                            ":" +
                            seconds.substr(-2);

                        dataQuerySnapshot.fecha_solicitud = formattedTime;
                        $scope.listaEscalamientosInfraestructura.push(dataQuerySnapshot);
                    });

                    if ($scope.flagOnlyPSData) {
                        $scope.dataEscalamientoInfraestructura =
                            $scope.listaEscalamientosInfraestructura.concat(
                                $scope.dataGestionEscalamiento
                            );
                        $scope.isLoadingData = false;
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        };

        $scope.gestionescalamiento = () => {
            isLoadingData = true;
            $scope.flagOnlyPSData = false;
            $scope.dataGestionEscalamiento = [];

            services
                .datosgestionescalamientos()
                .then(function (data) {
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
                    } else {
                        $scope.listarescalamientosinfraestructura();
                        if (data.data.state != 1) {
                            Swal({
                                type: 'error',
                                text: data.data.msj,
                                timer: 4000
                            })
                        } else {
                            $scope.dataGestionEscalamiento = data.data.data;
                            if ($scope.listaEscalamientosInfraestructura) {
                                if ($scope.listaEscalamientosInfraestructura.length > 0) {
                                    $scope.dataEscalamientoInfraestructura =
                                        $scope.listaEscalamientosInfraestructura.concat(
                                            $scope.dataGestionEscalamiento
                                        );
                                    $scope.isLoadingData = false;
                                } else {
                                    $scope.flagOnlyPSData = true;
                                }
                            } else {
                                $scope.flagOnlyPSData = true;
                            }
                        }

                    }
                })
                .catch((err) => {
                    $scope.listarescalamientosinfraestructura();
                    console.log(err);
                });

            services
                .datosgestionescalamientosprioridad2()
                .then(function (data) {
                    if (data.data.state != 1) {
                        console.log(data.data.msj);
                    } else {
                        $scope.dataEscalamientoInfraestructuraPrioridad2 = data.data.data;
                    }

                })
                .catch((err) => {
                    console.log(err);
                });
        };

        $scope.exportarRegistros = () => {
            services.exportEscalamientos().then((res) => {
                var data = res.data[0];
                var array = typeof data != "object" ? JSON.parse(data) : data;
                var str = "";
                var column = `ID|| Pedido|| Tarea|| Tecnico|| ID Tecnico|| Fecha Solicitud|| Fecha Gestion|| Fecha Respuesta|| Login Gestion|| En Gestion|| Proceso|| Producto|| Motivo|| Area|| Region|| Tipo Tarea|| Tecnologia|| CRM|| Departamento|| Prueba SMNET|| Foto?|| Marcacion TAP|| Direccion TAP|| Valor TAP|| Informacion Adicional|| MAC Real CPE|| Correa Marcacion|| Observacion|| Respuesta|| ID Terreno|| Tipificacion|| Estado|| ANS \r\n`;
                str += column;
                for (var i = 0; i < array.length; i++) {
                    var line = "";
                    for (var index in array[i]) {
                        if (line != "") line += "||";
                        line += array[i][index];
                    }

                    str += line + "\r\n";
                }
                var dateCsv = new Date();
                var yearCsv = dateCsv.getFullYear();
                var monthCsv =
                    dateCsv.getMonth() + 1 <= 9
                        ? "0" + (dateCsv.getMonth() + 1)
                        : dateCsv.getMonth() + 1;
                var dayCsv =
                    dateCsv.getDate() <= 9 ? "0" + dateCsv.getDate() : dateCsv.getDate();
                var fullDateCsv = yearCsv + "-" + monthCsv + "-" + dayCsv;

                var blob = new Blob([str]);
                var elementToClick = window.document.createElement("a");
                elementToClick.href = window.URL.createObjectURL(blob, {
                    type: "text/csv",
                });
                elementToClick.download = "Escalamientos-" + fullDateCsv + ".csv";
                elementToClick.click();
            });
        };

        $scope.mostrarModalConcatenacion = (data) => {
            data = data.replaceAll("||", "<br>");
            Swal({
                type: "info",
                title: "Información Adicional",
                html:
                    '<div style="text-align:justify;font-size: 12px;">' + data + "</div>",
                footer: "Puedes copiar esta información si lo deseas",
            });
        };

        $scope.mostrarModalEscalamiento = function (data) {
            if (data.engestion == null || data.engestion == "0") {
                alert("Debes bloquear el pedido");
                return;
            } else if (data.tipificacion == undefined || data.tipificacion == "") {
                alert("Recuerda seleccionar todas las opciones!!");
                return;
            } else {
                $scope.gestionescala = data;
                $("#editarModal").modal("show");
                return data.data;
            }
        };

        $scope.marcarEngestionEscalamiento = async (data) => {
            if (data._id) {
                try {
                    await $scope.autocompletarEscalamiento(data);
                } catch (error) {
                    return swal({
                        title: "Aviso Importante: ",
                        html: "El pedido no fue desbloqueado.",
                        type: "error",
                    });
                }
            } else {
                services
                    .marcarengestionescalamiento(data, $rootScope.galletainfo)
                    .then(function (data) {
                        if (data.data.data != 1) {
                            Swal({
                                type: 'error',
                                text: data.data.msj,
                                timer: 4000
                            })
                        } else if (data.data == "") {
                            Swal({
                                type: 'success',
                                text: data.data.msj,
                                timer: 4000
                            })
                        }
                    })
                    .catch((err) => console.log(err));
            }
        };

        $scope.autocompletarEscalamiento = async (data) => {
            try {
                var autocompleteQuery = await fetch(
                    "http://10.100.66.254:8080/HCHV_DEV/Buscar/" + data.pedido
                );
                var autocompleteData = await autocompleteQuery.json();
                data.engineerID = autocompleteData.engineerID;
                data.engineer = autocompleteData.engineerName;
                data.dateCreated = data.dateCreated.toDate();
                data.area = autocompleteData.Area;
                data.taskType = autocompleteData.TaskType;
                data.region = autocompleteData.Region;
                data.task = autocompleteData.tAREA_ID;
                data.tech = autocompleteData.uNETecnologias;
                data.department = autocompleteData.uNEDepartamento;
                data.status = autocompleteData.Estado;
                data.crm = autocompleteData.Crm;
                data.ans = null;

                if (autocompleteData.TaskType == "Reparacion") {
                    var ansQuery = await fetch(
                        "http://10.100.66.254:7771/api/ans/" + data.pedido
                    );
                    var ansData = await ansQuery.json();
                    data.ans = ansData.horas;
                }

                if (
                    data.status == "" ||
                    data.status == undefined ||
                    data.status == null
                ) {
                    swal({
                        title: "El Pedido Debe Cancelarse: ",
                        html: `El pedido ${data.pedido} que ha seleccionado, no existe en click.`,
                        type: "warning",
                    });
                } else {
                    if (data.status != "En Sitio") {
                        swal({
                            title: "El Pedido Debe Cancelarse: ",
                            html: `El pedido ${data.pedido} que ha seleccionado, no se encuentra en sitio, proceda a cancelarlo.`,
                            type: "warning",
                        });
                    }

                    if (data.tech != "HFC") {
                        swal({
                            title: "El Pedido Debe Cancelarse: ",
                            html: `El pedido ${data.pedido} que ha seleccionado, no es de tecnología HFC.`,
                            type: "warning",
                        });
                    }
                }
                var queryIsAlreadyToken = database
                    .collection("infraestructure")
                    .doc(data._id);
                var querySnapshotAT = await queryIsAlreadyToken.get();
                if (querySnapshotAT.data().status == 1) {
                    swal({
                        title: "Este pedido ya ha sido tomado: ",
                        html: `El pedido ${data.pedido} que ha seleccionado, ya ha sido tomado.`,
                        type: "warning",
                    });
                } else {
                    await fetch(
                        "https://autogestionterreno.com.co/api/state-infraestructure/",
                        {
                            method: "PUT",
                            mode: "cors",
                            body: JSON.stringify({infraestructure_ID: data._id}),
                            headers: {"Content-type": "application/json;charset=UTF-8"},
                        }
                    );

                    var querySaveScale = await services.guardarEscalamiento(
                        data,
                        $rootScope.galletainfo
                    );
                    $scope.gestionescalamiento();
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

        $scope.guardarescalamiento = async function (data) {
            if (data.login_gestion == null) {
                alert("Debes de marcar la solicitud, antes de guardar!");
            } else {
                if (!data.observacionesescalamiento) {
                    alert("Debes ingresar las observaciones.");
                    return;
                } else {
                    try {
                        alert("Pedido guardado, recuerda actualizar!!");
                        var currentTimeDate = new Date().toLocaleString();
                        var statusInfraestructure =
                            data.tipificacion == "Escalamiento realizado ok" ||
                            data.tipificacion == "Escalamiento ok nivel 2" ||
                            data.tipificacion == "Escalamiento ok nivel 2 Prioridad"
                                ? "Aprobado"
                                : "Rechazado";

                        await fetch(
                            "https://autogestionterreno.com.co/api/update-infraestructure/",
                            {
                                method: "PUT",
                                mode: "cors",
                                body: JSON.stringify({
                                    infraestructure_ID: data.id_terreno,
                                    infraestructure_Status: statusInfraestructure,
                                    dateAswered: currentTimeDate,
                                }),
                                headers: {"Content-type": "application/json;charset=UTF-8"},
                            }
                        );

                        services
                            .editarregistroescalamiento(data, $rootScope.galletainfo)
                            .then(function (data) {
                            })
                            .catch((err) => alert(err));
                        $scope.gestionescalamiento();
                    } catch (error) {
                        swal({
                            title: "Hay problemas al almacenar la gestión ",
                            html: "Consulte con desarrollo para más información",
                            type: "warning",
                        });
                    }
                }
            }
        };

        $scope.CopyPortaPapelesEscalamientoInfraestructura = (data) => {
            var copyTextEI = document.createElement("input");
            copyTextEI.value = data;
            document.body.appendChild(copyTextEI);
            copyTextEI.select();
            document.execCommand("copy");
            document.body.removeChild(copyTextEI);
            Swal({
                type: "info",
                title: "Aviso",
                text: "El texto seleccionado fue copiado",
            });
        };

        $scope.gestionescalamiento();
    }
);

app.controller(
    "novedadesVisitaCtrl",
    function (
        $scope,
        $http,
        $rootScope,
        services
    ) {

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
                        $scope.novedadesVisitasTecnicos = data.data.data;
                        $scope.cantidad = data.data.data.length;
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
                alert("Ingrese un pedido para buscar");
                $scope.sininfopedido = false;
                return;
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
                    function (respuesta) {
                        if (respuesta.status == "201") {
                            Swal("Tu Novedad fue Guardada!", "Bien Hecho");
                        }

                        $("#modalNovedadVisita").modal("hide");
                        $scope.novedadesVisitasSel = {};

                        frmNovedadVisita.autoValidateFormOptions.resetForm();
                    },
                    function errorCallback(response) {
                        if (response.status == "400") {
                            Swal({
                                type: "error",
                                title: "Oops...",
                                text: "El formulario no se guardó",
                                footer: "¡Intenta de nuevo o reporta con el administrador!",
                            });
                        }
                    }
                );
            $scope.RegistrosTecnicos(registrosTenicos);
        };

        $scope.csvNovedadesTecnicos = function () {
            $scope.csvPend = false;
            if ($scope.Registros.fechaini > $scope.Registros.fechafin) {
                alert("La fecha inicial debe ser menor que la inicial");
                return;
            } else {
                services
                    .expCsvNovedadesTecnico($scope.Registros, $rootScope.galletainfo)
                    .then(
                        function (datos) {
                            if (datos.data.state != 1) {
                                Swal({
                                    type: 'error',
                                    text: datos.data.msj,
                                    timer: 4000
                                })
                            } else {
                                var data = datos.data.data;
                                var array = typeof data != 'object' ? JSON.parse(data) : data;
                                var str = '';
                                var column = `Fecha|| Despachador|| Municipio|| Region|| Proceso|| Hora marca en sitio|| Tipo de Novedad|| Pedido|| Cedula del Tecnico|| Nombre del Tecnico|| Contrato|| Situacion|| Motivo|| Submotivo|| Observaciones|| Observacion CCO|| ID Llamada \r\n`;
                                str += column;
                                for (var i = 0; i < array.length; i++) {
                                    var line = '';
                                    for (var index in array[i]) {
                                        if (line != '') line += '||'
                                        line += array[i][index];
                                    }

                                    str += line + '\r\n';
                                }
                                var dateCsv = new Date();
                                var yearCsv = dateCsv.getFullYear();
                                var monthCsv = (dateCsv.getMonth() + 1 <= 9) ? '0' + (dateCsv.getMonth() + 1) : (dateCsv.getMonth() + 1);
                                var dayCsv = (dateCsv.getDate() <= 9) ? '0' + dateCsv.getDate() : dateCsv.getDate();
                                var fullDateCsv = yearCsv + "-" + monthCsv + "-" + dayCsv;


                                var blob = new Blob([str]);
                                var elementToClick = window.document.createElement("a");
                                elementToClick.href = window.URL.createObjectURL(blob, {type: 'text/csv'});
                                elementToClick.download = "novedadades-tecnico-" + fullDateCsv + ".csv";
                                elementToClick.click();
                            }

                        },

                        function errorCallback(response) {
                            console.log(response);
                        }
                    );
            }
        };

        $scope.regiones();
        $scope.situacion();
    }
);

app.controller(
    "contrasenasClickCtrl",
    function ($scope, $rootScope, $location, services) {
        $scope.listaTecnicos = {};
        $scope.tecnico = null;
        $scope.concepto = null;
        $scope.crearTecnico = {};
        buscarTecnico();

        $scope.tecnicos = async () => {
            try {
                $scope.loading = 1;
                var autocompleteQuery = await fetch(
                    "http://10.100.66.254:8080/HCHV_DEV/tecnicos/s"
                );
                var autocompleteData = await autocompleteQuery.json();

                services.acualizaTecnicos(autocompleteData).then(
                    function (data) {
                        $scope.loading = 0;
                        Swal({
                            type: "success",
                            text: "Tecnicos acualizados correctamente.",
                            timer: 4000,
                        }).then(function () {
                            $location.reload();
                        });
                    },
                    function errorCallback(error) {
                        console.log(error);
                    }
                );
            } catch (error) {
                console.log(error);
            }
        };

        $scope.pageChanged = function () {
            data = {page: $scope.currentPage, size: $scope.pageSize};
            buscarTecnico(data);
        };
        $scope.pageSizeChanged = function () {
            data = {page: $scope.currentPage, size: $scope.pageSize};
            $scope.currentPage = 1;
            buscarTecnico(data);
        };

        function buscarTecnico(data) {
            if (data === "" || data === undefined) {
                $scope.currentPage = 1;
                $scope.totalItems = 0;
                $scope.pageSize = 15;
                $scope.searchText = "";
                data = {page: $scope.currentPage, size: $scope.pageSize};
            }
            services.listadoTecnicos(data).then(
                function (data) {
                    $scope.listaTecnicos = data.data.data;
                    $scope.cantidad = data.data.data.length;
                    $scope.counter = data.data.counter;

                    $scope.totalItems = data.data.counter;
                    $scope.startItem = ($scope.currentPage - 1) * $scope.pageSize + 1;
                    $scope.endItem = $scope.currentPage * $scope.pageSize;
                    if ($scope.endItem > data.data.counter) {
                        $scope.endItem = data.data.counter;
                    }
                },
                function errorCallback(response) {
                    $scope.errorDatos = concepto + " " + tecnico + " no existe.";
                }
            );
        }

        $scope.buscarTec = function (param, dato) {
            console.log(param);
            if (param == undefined) {
                Swal({
                    type: "info",
                    title: "Oops...",
                    text: "seleccione parametro a buscar",
                    timer: 4000,
                });
            } else if (dato == undefined) {
                Swal({
                    type: "info",
                    title: "Oops...",
                    text: "Ingrese el valor a buscar",
                    timer: 4000,
                });
            } else {
                data = {
                    page: $scope.currentPage,
                    size: $scope.pageSize,
                    buscar: param,
                    variable: dato
                };
                buscarTecnico(data);
            }
        };

        $scope.createTecnico = function () {
            var id_tecnico = "";
            $scope.errorDatos = null;
            $scope.respuestaupdate = null;
            $scope.respuestadelete = null;
            services.creaTecnico($scope.crearTecnico, id_tecnico).then(
                function (data) {
                    $scope.respuestaupdate = "Técnico creado.";
                    return data.data;
                },
                function errorCallback(response) {
                    console.log(response);
                }
            );
        };

        $scope.editarModal = function (datos) {
            $rootScope.datos = datos;
            $scope.idTecnico = datos.ID;
            $scope.TecnicoNom = datos.NOMBRE;
            $scope.UsuarioLog = datos.LOGIN;
            $rootScope.TituloModal = "Editar Técnico con el ID:";
        };

        $scope.edittecnico = function (datos) {
            $scope.errorDatos = null;
            $scope.respuestaupdate = null;
            $scope.respuestadelete = null;
            services.editarTecnico(datos).then(
                function (data) {
                    $scope.respuestaupdate =
                        "Técnico " + datos.NOMBRE + " actualizado exitosamente";

                    return data.data;
                },
                function errorCallback(response) {
                }
            );
        };

        $scope.borrarTecnico = function (id) {
            $scope.idBorrar = id;
            $scope.Tecnico = {};
            $scope.errorDatos = null;
            $scope.respuestaupdate = null;
            $scope.respuestadelete = null;
            services.deleteTecnico($scope.idBorrar).then(
                function (data) {
                    $scope.respuestadelete =
                        "Técnico " + $rootScope.datos.NOMBRE + " eliminado exitosamente";
                },
                function errorCallback(response) {
                    $scope.errorDatos = "No se borro";
                }
            );
        };
    }
);

app.controller(
    "quejasGoCtrl",
    function (
        $scope,
        $rootScope,
        $timeout,
        services
    ) {

        $scope.listaQuejasGo = {};
        $scope.Registros = {};
        $scope.quejasGoSel = {};
        var timer;
        var idqueja;

        $scope.validarDatos = function (datos) {
            if (datos.columnaBusqueda == undefined || datos.valorBusqueda == undefined) {
                datos.columnaBusqueda = "";
                datos.valorBusqueda = "";
            }

            if (datos.fechaini == undefined || datos.fechafin == undefined) {
                Swal({
                    type: "error",
                    title: "Oops...",
                    text: "Debe seleccionar un rango de fecha!",
                });
            } else {
                data = {
                    page: $scope.currentPage,
                    size: $scope.pageSize,
                    datos
                };
                LoadQuejasGo(data);
            }
        };

        LoadQuejasGo();

        function LoadQuejasGo(data) {
            if (data === '' || data === undefined) {
                $scope.currentPage = 1;
                $scope.totalItems = 0;
                $scope.pageSize = 15;
                $scope.searchText = '';
                data = {'page': $scope.currentPage, 'size': $scope.pageSize}
            }

            services.extraeQuejasGoDia(data).then(
                function (data) {
                    console.log(data.data.counter);
                    $scope.listaQuejasGo = data.data.data;
                    $scope.cantidad = data.data.length;
                    $scope.counterpag = data.data.counter;

                    $scope.counter = data.data.counter;

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
        };

        $scope.pageChanged = function () {
            data = {'page': $scope.currentPage, 'size': $scope.pageSize}
            LoadQuejasGo(data);
        }
        $scope.pageSizeChanged = function () {
            data = {'page': $scope.currentPage, 'size': $scope.pageSize}
            $scope.currentPage = 1;
            LoadQuejasGo(data);
        }


        $scope.mostraModal = function () {
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

            $scope.quejasGoSel.observacion = "";

            angular.copy();
            $("#modalQuejasGo").modal();
        };

        $scope.ciudadesQuejasGo = function () {
            services.getCiudadesQuejasGo().then(function (data) {
                if (data.data.state != 1) {
                    Swal({
                        type: 'error',
                        text: data.data.msj,
                        timer: 4000
                    })
                } else {
                    $scope.listadoCiudadesQGo = data.data.data;
                }
            });
        };

        $scope.BuscarTecnico = function () {
            var cedula = $scope.quejasGoSel.cedtecnico;

            if (cedula == undefined) {
                Swal({
                    type: "error",
                    title: "Oops...",
                    text: "Debe ingresar la cédula del técnico!",
                });

                return;
            }

            services.traerTecnico(cedula).then(
                function (data) {
                    if (data.data.state != 1) {
                        Swal({
                            type: 'error',
                            text: data.data.msj,
                            timer: 4000
                        })
                    } else {
                        $scope.Tecnico = data.data.data;
                        $scope.quejasGoSel.tecnico = $scope.Tecnico[0].nombre;
                        $scope.quejasGoSel.region = $scope.Tecnico[0].ciudad;
                        $scope.infoTecnico = true;
                    }
                },
                function errorCallback(data) {
                    console.log(data);
                }
            );
        };

        $scope.crearTecQuejasGo = function (
            crearTecnicoquejasGoSel,
            frmCrearTecnicoQuejasGo
        ) {
            services.creaTecnicoQuejasGo(crearTecnicoquejasGoSel).then(
                function (data) {
                    Swal("El técnico fue Creado!", "Bien Hecho");
                    $scope.LoadQuejasGo($scope.datapendientes.currentPage);
                    $("#crearTecnicoQuejasGo").modal("hide");
                    frmCrearTecnicoQuejasGo.autoValidateFormOptions.resetForm();
                    return data.data;
                },

                function errorCallback(response) {
                    Swal({
                        type: "error",
                        title: "Oops...",
                        text: "Debe seleccionar un rango de fecha!",
                    });
                }
            );
        };

        $scope.guardar = function (quejasGoSel, frmQuejasGo) {
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

            services
                .guardarQuejaGo(quejasGoSel, $scope.counter, $rootScope.galletainfo)
                .then(
                    function (respuesta) {
                        if (respuesta.status == "201") {
                            Swal("La Queja fue Guardada!", "Bien Hecho");
                        }
                        $scope.infoTecnico = false;

                        $("#modalQuejasGo").modal("hide");
                        $scope.quejasGoSel = {};

                        frmGenereacionTT.autoValidateFormOptions.resetForm();
                    },
                    function errorCallback(response) {
                        if (response.status == "400") {
                            Swal({
                                type: "error",
                                title: "Oops...",
                                text: "No fue posible guardar la queja!",
                                footer: "¡Reporta con el administrador!",
                            });
                        }
                    }
                );

        };

        $scope.csvQuejasGo = function () {
            $scope.csvPend = false;

            if (
                $scope.Registros.columnaBusqueda == undefined ||
                $scope.Registros.valorBusqueda == undefined
            ) {
                $scope.Registros.columnaBusqueda = "";
                $scope.Registros.valorBusqueda = "";
            }

            if (
                $scope.Registros.fechaini == undefined ||
                $scope.Registros.fechafin == undefined
            ) {
                $scope.Registros.fechaini = "";
                $scope.Registros.fechafin = "";
            }

            if ($scope.Registros.fechaini > $scope.Registros.fechafin) {
                Swal({
                    type: 'error',
                    text: 'La fecha inicial no puede ser mayor que la final',
                    timer: 4000
                })
            } else {
                services.expCsvQuejasGo($scope.Registros, $rootScope.galletainfo).then(
                    function (datos) {
                        if (datos.data.state != 1) {
                            Swal({
                                type: 'error',
                                text: datos.data.msj,
                                timer: 4000
                            })
                        } else {
                            var data = datos.data.data;
                            var array = typeof data != 'object' ? JSON.parse(data) : data;
                            var str = '';
                            var column = `CONSECUTIVO|| PEDIDO|| CLIENTE|| CEDULA_TECNICO|| TECNICO|| ACCION|| ASESOR|| FECHA|| DURACION|| CIUDAD|| ID_LLAMADA|| OBSERVACIONES \r\n`;
                            str += column;
                            for (var i = 0; i < array.length; i++) {
                                var line = '';
                                for (var index in array[i]) {
                                    if (line != '') line += '||'
                                    line += array[i][index];
                                }

                                str += line + '\r\n';
                            }
                            var dateCsv = new Date();
                            var yearCsv = dateCsv.getFullYear();
                            var monthCsv = (dateCsv.getMonth() + 1 <= 9) ? '0' + (dateCsv.getMonth() + 1) : (dateCsv.getMonth() + 1);
                            var dayCsv = (dateCsv.getDate() <= 9) ? '0' + dateCsv.getDate() : dateCsv.getDate();
                            var fullDateCsv = yearCsv + "-" + monthCsv + "-" + dayCsv;


                            var blob = new Blob([str]);
                            var elementToClick = window.document.createElement("a");
                            elementToClick.href = window.URL.createObjectURL(blob, {type: 'text/csv'});
                            elementToClick.download = "csv-quejasgo-" + fullDateCsv + ".csv";
                            elementToClick.click();
                        }

                    },

                    function errorCallback(response) {
                        console.log(response);
                    }
                );
            }
        };

        $scope.abrirModalModificarObs = function (id, observacion) {
            $scope.quejasGoSel.observacion = observacion;
            idqueja = id;

            angular.copy();
            $("#modObserQuejasGo").modal();
        };

        $scope.modificarObservacionQuejasGo = function (
            quejasGoSel,
            frmModObserQuejasGo,
            id
        ) {
            services.modiObserQuejasGo(quejasGoSel, idqueja).then(
                function (respuesta) {
                    if (respuesta.status == "201") {
                        Swal("Las observaciones fueron modificadas!", "Bien Hecho");
                    }
                    $scope.LoadQuejasGo($scope.datapendientes.currentPage);

                    $("#modObserQuejasGo").modal("hide");
                    $scope.quejasGoSel = {};

                    frmModObserQuejasGo.autoValidateFormOptions.resetForm();
                },
                function errorCallback(response) {
                    if (response.status == "400") {
                        Swal({
                            type: "error",
                            title: "Oops...",
                            text: "No fue posible actualizar las observaciones!",
                            footer: "¡Reporta con el administrador!",
                        });
                    }
                }
            );
        };
    }
);

app.controller('quejasGoCtrl2', function ($scope, $http, $rootScope, $location, $route, $routeParams, $cookies, $timeout, services, cargaRegistros) {

    init();

    function init() {
        dataQueja();
        dataQuejasGoTerminado();
    }

    function dataQueja() {
        $scope.listaQuejasGo = {};

        services.datosQuejasGo().then(
            function (data) {
                $scope.listaQuejasGo = data.data.data;
            },

            function errorCallback(response) {
                console.log(response);
            });
    }

    $scope.currentPage = 1;
    $scope.totalItems = 0;
    $scope.pageSize = 10;
    $scope.searchText = '';

    function dataQuejasGoTerminado(data) {
        $scope.dataQuejasTerminados = '';
        if (data === '' || data === undefined) {
            $scope.currentPage = 1;
            $scope.totalItems = 0;
            $scope.pageSize = 10;
            $scope.searchText = '';
            data = {'page': $scope.currentPage, 'size': $scope.pageSize}
        }

        services.datosQuejasGoTerminado(data).then(function (data) {
            $scope.dataQuejasTerminados = data.data.data;

            $scope.activity = [];
            $scope.totalItems = data.data.totalCount;
            $scope.startItem = ($scope.currentPage - 1) * $scope.pageSize + 1;
            $scope.endItem = $scope.currentPage * $scope.pageSize;
            if ($scope.endItem > data.data.totalCount) {
                $scope.endItem = data.data.totalCount;
            }

        })
    }

    $scope.pageChanged = function () {
        data = {'page': $scope.currentPage, 'size': $scope.pageSize}
        dataQuejasGoTerminado(data);
    }
    $scope.pageSizeChanged = function () {
        data = {'page': $scope.currentPage, 'size': $scope.pageSize}
        dataQuejasGoTerminado(data);
    }

    $scope.marcarEngestion = function (id) {
        console.log(id);
        data = {'id': id, 'login_gestion': $rootScope.galletainfo.LOGIN}
        services.marcarEnGestionQuejasGo(data).then(function (data) {
            if (data.data.state == 1) {
                Swal({
                    type: 'success',
                    title: 'Bien',
                    text: data.data.msj,
                    timer: 4000
                }).then(function () {
                    $route.reload();
                })
            } else {
                Swal({
                    type: 'info',
                    title: 'Oops...',
                    text: data.data.msj,
                    timer: 4000
                }).then(function () {
                    $route.reload();
                })
            }
        })
    }

    $scope.abreModal = function (data) {
        if (data.en_gestion != '1') {
            Swal({
                type: 'error',
                title: 'Oops...',
                text: 'Debes Marcar el pedido',
                timer: 4000
            })
        } else if (data.accion == '' || data.accion == undefined) {
            Swal({
                type: 'error',
                title: 'Oops...',
                text: 'Debes Seleccionar la accion',
                timer: 4000
            })
        } else if (data.gestion == '' || data.gestion == undefined) {
            Swal({
                type: 'error',
                title: 'Oops...',
                text: 'Debes Seleccionar la gestion',
                timer: 4000
            })
        } else {
            data = {'accion': data.accion, 'gestion': data.gestion, 'id': data.id, 'login_gestion': $rootScope.galletainfo.LOGIN}
            $('#modalQuejasGo').modal('show');

            $scope.guardaSolicitudQuejasGo = function (obs) {
                if (obs == '' || obs == undefined) {
                    Swal({
                        type: 'error',
                        title: 'Oops...',
                        text: 'Recuerda documentar observaciones',
                        timer: 4000
                    })
                } else {
                    data.observacion_seguimiento = obs.observacion_gestion
                    services.guardaGestionQuejasGo(data).then(function (data) {
                        console.log(data)
                        if (data.data.state == 1) {
                            setTimeout(() => {
                                $('#modalQuejasGo').modal('hide');
                            }, 500);

                            Swal({
                                type: 'success',
                                title: 'Bien',
                                text: data.data.msj,
                                timer: 3000
                            }).then(function () {
                                $route.reload();
                            })
                        } else {
                            Swal({
                                type: 'error',
                                title: 'Oops...',
                                text: data.data.msj,
                                timer: 4000
                            })
                        }
                    })
                }
            }
        }

    }

    $scope.recargaPage = function () {
        $scope.quejago = {};
        $scope.pedido = '';
        init();
    }

    $scope.detallePedidoQuejaGo = (pedido) => {
        if (pedido == '' || pedido == undefined) {
            Swal({
                type: 'error',
                title: 'Oops...',
                text: 'Debes ingresar un pedido',
                timer: 4000
            })
        } else {
            data = {'page': $scope.currentPage, 'size': $scope.pageSize, 'pedido': pedido}
            dataQuejasGoTerminado(data);
        }
    }

    $scope.registrosQuejasGo = (data) => {
        if (data == '' || data == undefined) {
            Swal({
                type: 'error',
                title: 'Oops...',
                text: 'Seleccione un rango de fecha valido',
                timer: 4000
            })
        } else if (data.fechaini == '' || data.fechaini == undefined) {
            Swal({
                type: 'error',
                title: 'Oops...',
                text: 'La fecha inicial es requerida',
                timer: 4000
            })
        } else if (data.fechafin == '' || data.fechafin == undefined) {
            Swal({
                type: 'error',
                title: 'Oops...',
                text: 'La fecha final es requerida',
                timer: 4000
            })
        } else if (data.fechaini > data.fechafin) {
            Swal({
                type: 'error',
                title: 'Oops...',
                text: 'La fecha final no puede ser menor a la inicial',
                timer: 4000
            })
        } else {
            data = {'page': $scope.currentPage, 'size': $scope.pageSize, 'fecha': data}
            dataQuejasGoTerminado(data);
        }
    }

    $scope.csvQuejaGo = (data) => {
        var fechaini = new Date(data.fechaini);
        var fechafin = new Date(data.fechafin);
        var diffMs = (fechafin - fechaini);
        var diffDays = Math.round(diffMs / 86400000);

        if (data == '' || data == undefined) {
            Swal({
                type: 'error',
                title: 'Oops...',
                text: 'Seleccione un rango de fecha valido',
                timer: 4000
            })
        } else if (data.fechaini == '' || data.fechaini == undefined) {
            Swal({
                type: 'error',
                title: 'Oops...',
                text: 'La fecha inicial es requerida',
                timer: 4000
            })
        } else if (data.fechafin == '' || data.fechafin == undefined) {
            Swal({
                type: 'error',
                title: 'Oops...',
                text: 'La fecha final es requerida',
                timer: 4000
            })
        } else if (data.fechaini > data.fechafin) {
            Swal({
                type: 'error',
                title: 'Oops...',
                text: 'La fecha final no puede ser menor a la inicial',
                timer: 4000
            })
        } else {
            data = {'page': $scope.currentPage, 'size': $scope.pageSize, 'fecha': data}
            services.csvQuejaGo(data).then(
                function (datos) {
                    var data = datos.data.data;
                    var array = typeof data != 'object' ? JSON.parse(data) : data;
                    var str = '';

                    var column = `pedido|| cliente|| cedtecnico|| tecnico|| asesor|| region|| observacion|| fecha_marca|| fecha_gestion|| observacion_gestion|| movil_cliente|| doc_cliente|| direccion|| gestion_asesor \r\n`;
                    str += column;
                    for (var i = 0; i < array.length; i++) {
                        var line = '';
                        for (var index in array[i]) {
                            if (line != '') line += '||'
                            line += array[i][index];
                        }

                        str += line + '\r\n';
                    }
                    var dateCsv = new Date();
                    var yearCsv = dateCsv.getFullYear();
                    var monthCsv = (dateCsv.getMonth() + 1 <= 9) ? '0' + (dateCsv.getMonth() + 1) : (dateCsv.getMonth() + 1);
                    var dayCsv = (dateCsv.getDate() <= 9) ? '0' + dateCsv.getDate() : dateCsv.getDate();
                    var fullDateCsv = yearCsv + "-" + monthCsv + "-" + dayCsv;


                    var blob = new Blob([str]);
                    var elementToClick = window.document.createElement("a");
                    elementToClick.href = window.URL.createObjectURL(blob, {type: 'text/csv'});
                    elementToClick.download = "csvGestionQuejasGo-" + fullDateCsv + ".csv";
                    elementToClick.click();
                },

                function errorCallback(response) {
                    $scope.errorDatos = "No hay datos.";
                    $scope.csvPend = false;
                }
            )
        }
    }

    $scope.CopyPortaPapeles = function (data) {
        var copyTextTV = document.createElement("input");
        copyTextTV.value = data;
        document.body.appendChild(copyTextTV);
        copyTextTV.select();
        document.execCommand("copy");
        document.body.removeChild(copyTextTV);
        Swal({
            type: 'info',
            title: 'Aviso',
            text: "El texto seleccionado fue copiado",
            timer: 2000
        });
    }

});


app.controller("saraCtrl", function ($scope, $http, $rootScope, services) {
    $scope.rutaConsultaSara = "partial/consultaSara/consulSara.html";
    $scope.dataSara = {};
    $scope.horasTranscurridas = 0;
    $scope.minutosTranscurridos = 0;
    $scope.segundosTranscurridos = 0;

    $scope.buscarDataSara = function (datos) {
        var tareaSara = datos.tarea;
        $scope.urlServicio = "http://10.100.66.254:8080/SARA/Buscar1/" + tareaSara;

        $http.get($scope.urlServicio, {timeout: 8000}).then(
            function (data) {
                $scope.dataSara = data.data;

                if ($scope.dataSara.Error == "No hay datos para mostrar") {
                    $scope.horasTranscurridas = 0;
                    $scope.minutosTranscurridos = 0;
                    $scope.segundosTranscurridos = 0;

                    Swal({
                        type: "error",
                        title: "Oops...",
                        text: "Aún no se hace la solicitud a SARA",
                    });
                }

                $scope.indiceSara =
                    Object.keys($scope.dataSara.SolicitudesSara).length - 1;
                var tiempoSara =
                    $scope.dataSara.SolicitudesSara[$scope.indiceSara].TiempoRespuesta;
                $scope.horasTranscurridas = tiempoSara.substr(0, 2);
                $scope.minutosTranscurridos = tiempoSara.substr(3, 2);
                $scope.segundosTranscurridos = tiempoSara.substr(6, 2);
                return data.data;
            },

            function (Error) {
                Swal({
                    type: "error",
                    title: "Oops...",
                    text: "Se presentan problemas con el Web Service, reporta con el administrador",
                });
            }
        );
    };

    $scope.csvexportarRRHH = function () {
        services
            .getexpcsvRRHH($rootScope.galletainfo)
            .then((response) => {
                var data = response.data;
                var array = typeof data != "object" ? JSON.parse(data) : data;
                var str = "";
                var column =
                    "Cedula|| Login|| Nombre|| Telefono|| Region|| Distrito|| Tipo Tecnico|| Contratista|| Latitud|| Longitud|| Calendario|| No Disponibilidad|| Fecha Registro \r\n";
                str += column;
                for (var i = 0; i < array.length; i++) {
                    var line = "";
                    for (var index in array[i]) {
                        if (line != "") line += "||";
                        line += array[i][index];
                    }

                    str += line + "\r\n";
                }
                var dateCsv = new Date();
                var yearCsv = dateCsv.getFullYear();
                var monthCsv =
                    dateCsv.getMonth() + 1 <= 9
                        ? "0" + (dateCsv.getMonth() + 1)
                        : dateCsv.getMonth() + 1;
                var dayCsv =
                    dateCsv.getDate() <= 9 ? "0" + dateCsv.getDate() : dateCsv.getDate();
                var fullDateCsv = yearCsv + "-" + monthCsv + "-" + dayCsv;

                var blob = new Blob([str]);
                var elementToClick = window.document.createElement("a");
                elementToClick.href = window.URL.createObjectURL(blob, {
                    type: "text/csv",
                });
                elementToClick.download = "Disponibilidad-" + fullDateCsv + ".csv";
                elementToClick.click();
            })
            .catch((error) => console.log(error));
    };
});

app.controller(
    "registrosCtrl",
    function ($scope, $rootScope, services, cargaRegistros, $route) {
        $scope.listaRegistros = {};
        $scope.Registros = {};
        $scope.listadoAcciones = {};
        $scope.datosRegistros = {};
        $scope.verplantilla = false;

        $scope.currentPage = 1;
        $scope.totalItems = 0;
        $scope.pageSize = 15;
        $scope.searchText = "";

        if (
            $scope.Registros.fechaini == undefined ||
            $scope.Registros.fechafin == undefined
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

            $scope.fechaini = tiempo;
            $scope.fechafin = tiempo;
        }

        BuscarRegistros();

        $scope.pageChanged = function () {
            data = {page: $scope.currentPage, size: $scope.pageSize, fecha: $scope.Registros};
            console.log(data);
            BuscarRegistros(data);
        };
        $scope.pageSizeChanged = function () {
            console.log(data);
            data = {page: $scope.currentPage, size: $scope.pageSize, fecha: $scope.Registros};
            $scope.currentPage = 1;
            BuscarRegistros(data);
        };

        function BuscarRegistros(data) {
            if (data === "" || data === undefined) {
                $scope.currentPage = 1;
                $scope.totalItems = 0;
                $scope.pageSize = 15;
                $scope.searchText = "";
                data = {page: $scope.currentPage, size: $scope.pageSize};
            }
            services.registros(data).then(
                function (data) {
                    $scope.listaRegistros = data.data.data;
                    $scope.cantidad = data.data.data.length;
                    $scope.counter = data.data.counter;

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

        $scope.buscarRegistros = function (param) {
            if (param == undefined) {
                Swal({
                    type: "info",
                    title: "Oops...",
                    text: "Ingrese el pedido a buscar",
                    timer: 4000,
                });
            } else {
                data = {
                    page: $scope.currentPage,
                    size: $scope.pageSize,
                    param
                };
                BuscarRegistros(data);
            }
        };

        $scope.muestraNotas = function (datos) {
            $scope.pedido = datos.pedido;
            $scope.TituloModal = "Observaciones para el pedido:";
            $scope.observaciones = datos.observaciones;
        };

        $scope.calcularSubAcciones = function (proceso, accion) {
            $scope.listadoSubAcciones = {};
            $scope.validarsubaccion = true;

            services.getSubAcciones(proceso, accion).then(
                function (data) {
                    $scope.listadoSubAcciones = data.data.data;
                    $scope.validarsubaccion = true;
                },
                function errorCallback(response) {
                    $scope.validarsubaccion = false;
                }
            );
        };

        $scope.calcularAcciones = function (proceso) {
            if (proceso == "") {
                $scope.validaraccion = false;
                $scope.validarsubaccion = false;
            } else {
                services.getAcciones(proceso).then(function (data) {
                    $scope.listadoAcciones = data.data.data;
                    $scope.validaraccion = true;
                    $scope.validarsubaccion = false;
                });
            }
        };

        $scope.editarRegistros = function (datos) {
            $scope.datosRegistros = datos;
            if ($scope.datosRegistros.plantilla != "") {
                $scope.verplantilla = true;
            } else {
                $scope.verplantilla = false;
            }
            $scope.TituloModal = "Editar pedido:";
            $scope.pedido = datos.pedido;
            $scope.calcularAcciones($scope.datosRegistros.proceso);
            $scope.calcularSubAcciones(
                $scope.datosRegistros.proceso,
                $scope.datosRegistros.accion
            );
        };

        $scope.editRegistro = function (datos) {
            $scope.errorDatos = null;
            $scope.respuestaupdate = null;
            $scope.respuestadelete = null;

            services.editarRegistro(datos, $rootScope.galletainfo).then(
                function (data) {
                    if (data.data.state != 1) {
                        Swal({
                            type: 'error',
                            text: data.data.msj,
                            timer: 4000
                        })
                    } else {
                        Swal({
                            type: 'success',
                            text: data.data.msj,
                            timer: 4000
                        })
                        data = {
                            page: $scope.currentPage,
                            size: $scope.pageSize
                        };
                        BuscarRegistros(data);
                    }
                },
                function errorCallback(response) {
                }
            );
        };

        $scope.csvRegistros = function () {
            $scope.csvPend = false;
            if ($scope.Registros.fechaini > $scope.Registros.fechafin) {
                Swal({
                    type: 'error',
                    text: 'La fecha inicial no puede ser mayor a la final',
                    timer: 4000
                })
            } else {
                services.expCsvRegistros($scope.Registros, $rootScope.galletainfo).then(
                    function (datos) {
                        if (datos.data.state != 1) {
                            Swal({
                                type: 'error',
                                text: datos.data.msj,
                                timer: 4000
                            })
                        } else {
                            var data = datos.data.data;
                            var array = typeof data != 'object' ? JSON.parse(data) : data;
                            var str = '';
                            var column = `PEDIDO||ID_TECNICO|| EMPRESA|| LOGIN_ASESOR|| DESPACHO|| OBSERVACIONES|| ACCION|| SUB_ACCION|| FECHA|| PROCESO|| PRODUCTO|| DURACION_LLAMADA|| IDLLAMADA|| PRUEBA_INTEGRADA|| PRUEBASMNET|| UNESOURCESYSTEM|| PENDIENTE|| DIAGNOSTICO \r\n`;
                            str += column;
                            for (var i = 0; i < array.length; i++) {
                                var line = '';
                                for (var index in array[i]) {
                                    if (line != '') line += '||'
                                    line += array[i][index];
                                }

                                str += line + '\r\n';
                            }
                            var dateCsv = new Date();
                            var yearCsv = dateCsv.getFullYear();
                            var monthCsv = (dateCsv.getMonth() + 1 <= 9) ? '0' + (dateCsv.getMonth() + 1) : (dateCsv.getMonth() + 1);
                            var dayCsv = (dateCsv.getDate() <= 9) ? '0' + dateCsv.getDate() : dateCsv.getDate();
                            var fullDateCsv = yearCsv + "-" + monthCsv + "-" + dayCsv;


                            var blob = new Blob([str]);
                            var elementToClick = window.document.createElement("a");
                            elementToClick.href = window.URL.createObjectURL(blob, {type: 'text/csv'});
                            elementToClick.download = "csv-registros-" + fullDateCsv + ".csv";
                            elementToClick.click();
                        }

                    },

                    function errorCallback(response) {
                        console.log(response);
                    }
                );
            }
        };

        $scope.csvtecnico = function () {
            let date_1 = new Date($scope.Registros.fechaini);
            let date_2 = new Date($scope.Registros.fechafin);
            let diff = date_2 - date_1;

            let TotalDays = Math.ceil(diff / (1000 * 3600 * 24));
            if (TotalDays > 8) {
                swal({
                    type: "error",
                    text: "Para optimizacion de los reportes estos no pueden sobrepasar los 8 dias",
                });
            } else if ($scope.Registros.fechafin < $scope.Registros.fechafin) {
                Swal({
                    type: "error",
                    text: "La fecha final no puede ser menor que la inicial",
                });
            } else {
                services.expCsvtecnico($scope.Registros, $rootScope.galletainfo).then(
                    function (datos) {
                        if (datos.data.state != 1) {
                            Swal({
                                type: 'error',
                                text: datos.data.msj,
                                timer: 4000
                            })
                        } else {
                            var data = datos.data.data;
                            var array = typeof data != 'object' ? JSON.parse(data) : data;
                            var str = '';
                            var column = `PEDIDO|| TECNICO|| NOMBRE_TECNICO|| CIUDAD|| EMPRESA|| TIPO_PENDIENTE|| DIA|| MES|| ANO|| PRODUCTO|| MOTIVO|| MAC_SALE|| MAC_ENTRA|| PROCESO' \r\n`;
                            str += column;
                            for (var i = 0; i < array.length; i++) {
                                var line = '';
                                for (var index in array[i]) {
                                    if (line != '') line += '||'
                                    line += array[i][index];
                                }

                                str += line + '\r\n';
                            }
                            var dateCsv = new Date();
                            var yearCsv = dateCsv.getFullYear();
                            var monthCsv = (dateCsv.getMonth() + 1 <= 9) ? '0' + (dateCsv.getMonth() + 1) : (dateCsv.getMonth() + 1);
                            var dayCsv = (dateCsv.getDate() <= 9) ? '0' + dateCsv.getDate() : dateCsv.getDate();
                            var fullDateCsv = yearCsv + "-" + monthCsv + "-" + dayCsv;


                            var blob = new Blob([str]);
                            var elementToClick = window.document.createElement("a");
                            elementToClick.href = window.URL.createObjectURL(blob, {type: 'text/csv'});
                            elementToClick.download = "csv-registros-equipos" + fullDateCsv + ".csv";
                            elementToClick.click();
                        }

                    },

                    function errorCallback(response) {
                        console.log(response);
                    }
                );
            }
        };

        $scope.uploadFile = function () {
            $scope.carga_ok = true;
            var file = $scope.myFile;
            $scope.user = $rootScope.galletainfo.LOGIN;
            $scope.name = "";
            $scope.delete_ok = false;

            var uploadUrl = "services/cargaRegistros";
            cargaRegistros.uploadFileToUrl(file, uploadUrl, $scope.user);
            $scope.msg = "Se cargo el archivo: " + file.name;

            Swal("El Archivo fue cargado correctamente!", "Bien Hecho");
        };
    }
);

app.controller("registrosOfflineCtrl", function ($scope, services) {
    $scope.listaRegistrosOffline = {};
    RegistrosOffline();

    $scope.pageChanged = function () {
        data = {page: $scope.currentPage, size: $scope.pageSize};
        console.log(data);
        RegistrosOffline(data);
    };
    $scope.pageSizeChanged = function () {
        console.log(data);
        data = {page: $scope.currentPage, size: $scope.pageSize};
        $scope.currentPage = 1;
        RegistrosOffline(data);
    };

    function RegistrosOffline(data) {
        if (data === "" || data === undefined) {
            $scope.currentPage = 1;
            $scope.totalItems = 0;
            $scope.pageSize = 8;
            $scope.searchText = "";
            data = {page: $scope.currentPage, size: $scope.pageSize};
        }
        services.registrosOffline(data).then(
            function (data) {
                $scope.listaRegistrosOffline = data.data.data;
                $scope.cantidad = data.data.counter;
                $scope.counter = data.data.data;

                $scope.totalItems = data.data.counter;
                $scope.startItem = ($scope.currentPage - 1) * $scope.pageSize + 1;
                $scope.endItem = $scope.currentPage * $scope.pageSize;
                if ($scope.endItem > data.data.totalCount) {
                    $scope.endItem = data.data.totalCount;
                }
            },
            function errorCallback(response) {
                console.log(response);
            }
        );
    }
});

app.controller(
    "mesaofflineCtrl",
    function (
        $scope,
        $rootScope,
        services
    ) {
        $scope.validarproducto = false;
        $scope.validaractividad = false;

        $scope.calcularAccionOffline = function () {
            var producto = $scope.offline.PRODUCTO;
            $scope.validarproducto = true;
            services.getAccionesoffline(producto).then(function (data) {
                if (data.data.state != 1) {
                    Swal({
                        type: 'error',
                        text: data.data.msj,
                        timer: 4000
                    })
                } else {
                    $scope.listadoAcciones = data.data.data;
                }
            });
        };

        $scope.calcularActividad2offline = function () {
            if ($scope.offline.ACTIVIDAD == "Patinaje") {
                $scope.validaractividad = true;
                $scope.actividades2 = [
                    {ID: "Asesor reiterativo", ACTIVIDAD2: "Asesor reiterativo"},
                    {ID: "Asesor AHT alto", ACTIVIDAD2: "Asesor AHT alto"},
                    {
                        ID: "Requiere intervencion - Supervisor",
                        ACTIVIDAD2: "Requiere intervencion - Supervisor",
                    },
                    {
                        ID: "Requiere intervención – Formacion ",
                        ACTIVIDAD2: "Requiere intervención – Formacion ",
                    },
                ];
            } else $scope.validaractividad = false;
        };

        $scope.guardarPedidoOffline = function () {
            services.pedidoOffline($scope.offline, $rootScope.galletainfo).then(
                function (data) {
                    $scope.respuestaupdate = "Pedido creado.";
                    return data.data;
                },
                function errorCallback(response) {
                    $scope.errorDatos = "Pedido no fue creado.";
                }
            );
        };
    }
);

function fn_ValidarObsoleto() {
    var CMobsoleto = document.getElementById("CMobsoleto").value;
    var CMobsoleto2 = document.getElementById("CMobsoleto2").value;
    if (CMobsoleto == "Si" || CMobsoleto2 == "Si") {
        Swal("Se requiere cambiar el equipo");
        CMobsoleto = document.getElementById("CMobsoleto").reset();
        CMobsoleto2 = document.getElementById("CMobsoleto2").reset();
    }
}

function fn_popup1() {
    var opc1 = document.getElementById("idaccionTVHFCGPON").value;
    var action1 = "Corregir portafolio";
    var msg =
        "Esta opción es solo para hacer correcciones en portafolio o inventario";
    if (opc1 == action1) {
        alert(msg);
        opc1 = document.getElementById("idaccionTVHFCGPON").reset();
    }
}

function fn_popup2() {
    var opc2 = document.getElementById("idaccionTVCobre").value;
    var action2 = "Corregir portafolio";
    var msg =
        "Esta opción es solo para hacer correcciones en portafolio o inventario";
    if (opc2 == action2) {
        alert(msg);
        opc2 = document.getElementById("idaccionTVCobre").reset();
    }
}

function fn_popup3() {
    var opc3 = document.getElementById("idaccionTVDTH").value;
    var action3 = "Corregir portafolio";
    var msg =
        "Esta opción es solo para hacer correcciones en portafolio o inventario";
    if (opc3 == action3) {
        alert(msg);
        opc3 = document.getElementById("idaccionTVDTH").reset();
    }
}

function fn_popup4() {
    var opc4 = document.getElementById("idaccionINTTOIP").value;
    var action4 = "Corregir portafolio";
    var msg =
        "Esta opción es solo para hacer correcciones en portafolio o inventario";
    if (opc4 == action4) {
        alert(msg);
        opc4 = document.getElementById("idaccionINTTOIP").reset();
    }
}

function fn_popup5() {
    var opc5 = document.getElementById("idaccionTOIP").value;
    var action5 = "Corregir portafolio";
    var msg =
        "Esta opción es solo para hacer correcciones en portafolio o inventario";
    if (opc5 == action5) {
        alert(msg);
        opc5 = document.getElementById("idaccionTOIP").resest();
    }
}

app.controller(
    "nivelacionCtrl",
    function (
        $scope,
        $http,
        $rootScope,
        $location,
        $route,
        $cookies,
        services
    ) {
        $scope.nivelacion = {};
        $scope.nivelacion.ticket = "";
        $scope.nivelacion.newIdTecnic = "";
        $scope.visible = false;
        $scope.newTec = false;
        $scope.tec = false;

        en_genstion_nivelacion();

        function en_genstion_nivelacion() {
            services.en_genstion_nivelacion().then(complete).catch(failed);

            function complete(data) {
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
                    $scope.nivelacion.proceso_terminado = data.data.tarea;
                    if (data.data.gestion[0].total !== "undefined") {
                        $scope.nivelacion.pendienteTotal = data.data.gestion[0].total;
                    } else {
                        $scope.nivelacion.pendienteTotal = 0;
                    }

                    if (data.data.gestion[1].total !== "undefined") {
                        $scope.nivelacion.realizadoTotal = data.data.gestion[1].total;
                    } else {
                        $scope.nivelacion.realizadoTotal = 0;
                    }
                }
            }

            function failed(data) {
                console.log(data);
            }
        }

        $scope.buscarhistoricoNivelacion = function () {
            if (
                $scope.nivelacion.historico == "" ||
                $scope.nivelacion.historico == undefined
            ) {
                swal({
                    type: "error",
                    text: "Ingrese la tarea a buscar",
                });
            } else {
                services
                    .buscarhistoricoNivelacion($scope.nivelacion.historico)
                    .then(complete)
                    .catch(failed);

                function complete(data) {
                    $scope.nivelacion.databsucarPedido = data.data.data;
                    $("#modalHistoricoNivelacion").modal("show");
                    return data.data;
                }

                function failed(data) {
                    console.log(data);
                }
            }
        };

        $scope.searchTicket = function () {
            if (
                $scope.nivelacion.ticket === "" ||
                $scope.nivelacion.ticket === undefined
            ) {
                Swal({
                    type: "error",
                    title: "Ingrese una tarea",
                });
            } else {
                $scope.url =
                    "http://10.100.66.254:8080/HCHV_DEV/BuscarC/" +
                    $scope.nivelacion.ticket;
                $http.get($scope.url, {timeout: 2000}).then(
                    function (data) {
                        if (data.data.state != 0) {
                            Swal({
                                type: "error",
                                title: "No se encontraron datos",
                                timer: 4000
                            });
                        } else {
                            $scope.nivelacion.pedido = data.data[0].UNEpedido;
                            $scope.nivelacion.subZona = data.data[0].district;
                            $scope.nivelacion.nombreTecnico = data.data[0].EngineerName;
                            $scope.nivelacion.idTecnico = data.data[0].EngineerID;
                            $scope.nivelacion.proceso = data.data[0].tasktypecategory;
                            $scope.nivelacion.zona = data.data[0].region;
                            $scope.visible = true;

                            $scope.status = data.data[0].status;
                            $scope.fecha_res = data.data[0].unefechacita;
                            $scope.fecha_res = $scope.fecha_res.split(" ");
                            if ($scope.fecha_res[2]) {
                                $scope.fecha_res = $scope.fecha_res[0];
                                $scope.fecha_res = $scope.fecha_res.split("/");
                                $scope.fecha_res =
                                    $scope.fecha_res[2] +
                                    "-" +
                                    $scope.fecha_res[1] +
                                    "-" +
                                    $scope.fecha_res[0];
                            } else {
                                $scope.fecha_res = data.data[0].unefechacita;
                            }

                            $scope.searchIdTecnic = function () {
                                services
                                    .searchIdTecnic($scope.nivelacion.newIdTecnic)
                                    .then(complete)
                                    .catch(failed);

                                function complete(data) {
                                    if (data.data.state === 0) {
                                        Swal({
                                            type: "error",
                                            title: "No se encontraron datos",
                                            timer: 4000
                                        });
                                    } else {
                                        $scope.nivelacion.newTecName = data.data.data.nombre;
                                        $scope.newTec = true;
                                    }
                                }

                                function failed(data) {
                                    console.log(data);
                                }
                            };

                            $scope.saveNivelation = function () {
                                var today = new Date();
                                var day = today.getDate();
                                var month = today.getMonth() + 1;
                                var year = today.getFullYear();
                                var hoy = `${year}-${month}-${day}`;
                                $scope.case6 = 0;
                                $scope.case7 = 0;
                                //$scope.fecha_res = '2022-12-16';
                                if ($scope.nivelacion.motivo == 1) {
                                    if (
                                        $scope.nivelacion.motivo == 1 &&
                                        ($scope.status == "Abierto" || $scope.status == "Asignado")
                                    ) {
                                        Swal({
                                            type: "error",
                                            title: "La tarea esta en estado de asignacion automatica",
                                            timer: 4000,
                                        }).then(function () {
                                            $route.reload();
                                        });
                                    } else if (
                                        $scope.nivelacion.motivo == 1 &&
                                        ($scope.status == "Finalizada" ||
                                            $scope.status == "Suspendido" ||
                                            $scope.status == "Suspendido-Abierto" ||
                                            $scope.status == "Incompleto" ||
                                            $scope.status == "Pendiente" ||
                                            $scope.status == "Abierto" ||
                                            $scope.status == "Asignado")
                                    ) {
                                        Swal({
                                            type: "error",
                                            title: "La tarea esta en estado no valido",
                                            timer: 4000,
                                        }).then(function () {
                                            $route.reload();
                                        });
                                    } else {
                                        services
                                            .saveNivelation($scope.nivelacion, $rootScope.galletainfo)
                                            .then(complete)
                                            .catch(failed);

                                        function complete(data) {
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
                                            } else if (data.data.state === 0) {
                                                Swal({
                                                    type: "error",
                                                    title: data.data.msj,
                                                    timer: 4000,
                                                }).then(function () {
                                                    $route.reload();
                                                });
                                            } else {
                                                Swal({
                                                    type: "success",
                                                    title:
                                                        "La solicitud de nivelación se ha creado correctamente",
                                                    timer: 4000,
                                                }).then(function () {
                                                    $route.reload();
                                                });
                                            }
                                        }

                                        function failed(data) {
                                            console.log(data);
                                        }
                                    }
                                } else {
                                    if (
                                        $scope.nivelacion.submotivo == 6 ||
                                        $scope.nivelacion.submotivo == 7
                                    ) {
                                        if ($scope.nivelacion.submotivo == 6) {
                                            $scope.url =
                                                "http://10.100.66.254:8080/HCHV_DEV/BuscarF/" +
                                                $scope.nivelacion.ticket;
                                            $http
                                                .get($scope.url, {timeout: 2000})
                                                .then(function (data) {
                                                    if (data.data.state == 1) {
                                                        Swal({
                                                            type: "error",
                                                            title: data.data.data,
                                                            timer: 4000,
                                                        }).then(function () {
                                                            $route.reload();
                                                        });
                                                    } else if (data.data.state == 0) {
                                                        if (
                                                            $scope.nivelacion.submotivo == 6 &&
                                                            $scope.status != "Incompleto"
                                                        ) {
                                                            if (
                                                                $scope.nivelacion.submotivo == 6 &&
                                                                $scope.status != "Pendiente"
                                                            ) {
                                                                Swal({
                                                                    type: "error",
                                                                    title: "La tarea esta en estado no valido",
                                                                    timer: 4000,
                                                                }).then(function () {
                                                                    $route.reload();
                                                                });
                                                            } else if (
                                                                $scope.nivelacion.submotivo == 6 &&
                                                                $scope.fecha_res != hoy
                                                            ) {
                                                                Swal({
                                                                    type: "error",
                                                                    title:
                                                                        "La tarea tiene una fecha diferente a hoy",
                                                                    timer: 4000,
                                                                }).then(function () {
                                                                    $route.reload();
                                                                });
                                                            } else {
                                                                services
                                                                    .saveNivelation(
                                                                        $scope.nivelacion,
                                                                        $rootScope.galletainfo
                                                                    )
                                                                    .then(complete)
                                                                    .catch(failed);

                                                                function complete(data) {
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
                                                                    } else if (data.data.state === 0) {
                                                                        Swal({
                                                                            type: "error",
                                                                            title: data.data.msj,
                                                                            timer: 4000,
                                                                        }).then(function () {
                                                                            $route.reload();
                                                                        });
                                                                    } else {
                                                                        Swal({
                                                                            type: "success",
                                                                            title:
                                                                                "La solicitud de nivelación se ha creado correctamente",
                                                                            timer: 4000,
                                                                        }).then(function () {
                                                                            $route.reload();
                                                                        });
                                                                    }
                                                                }
                                                            }
                                                        } else if (
                                                            $scope.nivelacion.submotivo == 6 &&
                                                            $scope.fecha_res != hoy
                                                        ) {
                                                            Swal({
                                                                type: "error",
                                                                title:
                                                                    "La tarea tiene una fecha diferente a hoy",
                                                                timer: 4000,
                                                            }).then(function () {
                                                                $route.reload();
                                                            });
                                                        } else {
                                                            services
                                                                .saveNivelation(
                                                                    $scope.nivelacion,
                                                                    $rootScope.galletainfo
                                                                )
                                                                .then(complete)
                                                                .catch(failed);

                                                            function complete(data) {
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
                                                                } else if (data.data.state === 0) {
                                                                    Swal({
                                                                        type: "error",
                                                                        title: data.data.msj,
                                                                        timer: 4000,
                                                                    }).then(function () {
                                                                        $route.reload();
                                                                    });
                                                                } else {
                                                                    Swal({
                                                                        type: "success",
                                                                        title:
                                                                            "La solicitud de nivelación se ha creado correctamente",
                                                                        timer: 4000,
                                                                    }).then(function () {
                                                                        $route.reload();
                                                                    });
                                                                }
                                                            }
                                                        }

                                                        function failed(data) {
                                                            console.log(data);
                                                        }
                                                    }
                                                });
                                        } else if ($scope.nivelacion.submotivo == 7) {
                                            $scope.url =
                                                "http://10.100.66.254:8080/HCHV_DEV/BuscarF/" +
                                                $scope.nivelacion.ticket;
                                            $http
                                                .get($scope.url, {timeout: 2000})
                                                .then(function (data) {
                                                    if (data.data.state == 1) {
                                                        Swal({
                                                            type: "error",
                                                            title: data.data.data,
                                                            timer: 4000,
                                                        }).then(function () {
                                                            $route.reload();
                                                        });
                                                    } else if (data.data.state == 0) {
                                                        if (
                                                            $scope.nivelacion.submotivo == 7 &&
                                                            $scope.status != "Incompleto"
                                                        ) {
                                                            if (
                                                                $scope.nivelacion.submotivo == 7 &&
                                                                $scope.status != "Pendiente"
                                                            ) {
                                                                Swal({
                                                                    type: "error",
                                                                    title: "La tarea esta en estado no valido",
                                                                    timer: 4000,
                                                                }).then(function () {
                                                                    $route.reload();
                                                                });
                                                            } else if (
                                                                $scope.nivelacion.submotivo == 7 &&
                                                                $scope.fecha_res >= hoy
                                                            ) {
                                                                Swal({
                                                                    type: "error",
                                                                    title: "La tarea tiene una fecha mayor",
                                                                    timer: 4000,
                                                                }).then(function () {
                                                                    $route.reload();
                                                                });
                                                            } else {
                                                                services
                                                                    .saveNivelation(
                                                                        $scope.nivelacion,
                                                                        $rootScope.galletainfo
                                                                    )
                                                                    .then(complete)
                                                                    .catch(failed);

                                                                function complete(data) {
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
                                                                    } else if (data.data.state === 0) {
                                                                        Swal({
                                                                            type: "error",
                                                                            title: data.data.msj,
                                                                            timer: 4000,
                                                                        }).then(function () {
                                                                            $route.reload();
                                                                        });
                                                                    } else {
                                                                        Swal({
                                                                            type: "success",
                                                                            title:
                                                                                "La solicitud de nivelación se ha creado correctamente",
                                                                            timer: 4000,
                                                                        }).then(function () {
                                                                            $route.reload();
                                                                        });
                                                                    }
                                                                }
                                                            }
                                                        } else if (
                                                            $scope.nivelacion.submotivo == 7 &&
                                                            $scope.fecha_res >= hoy
                                                        ) {
                                                            Swal({
                                                                type: "error",
                                                                title: "La tarea tiene una fecha mayor",
                                                                timer: 4000,
                                                            }).then(function () {
                                                                $route.reload();
                                                            });
                                                        } else {
                                                            services
                                                                .saveNivelation(
                                                                    $scope.nivelacion,
                                                                    $rootScope.galletainfo
                                                                )
                                                                .then(complete)
                                                                .catch(failed);

                                                            function complete(data) {
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
                                                                } else if (data.data.state === 0) {
                                                                    Swal({
                                                                        type: "error",
                                                                        title: data.data.msj,
                                                                        timer: 4000,
                                                                    }).then(function () {
                                                                        $route.reload();
                                                                    });
                                                                } else {
                                                                    Swal({
                                                                        type: "success",
                                                                        title:
                                                                            "La solicitud de nivelación se ha creado correctamente",
                                                                        timer: 4000,
                                                                    }).then(function () {
                                                                        $route.reload();
                                                                    });
                                                                }
                                                            }
                                                        }

                                                        function failed(data) {
                                                            console.log(data);
                                                        }
                                                    }
                                                });
                                        }
                                    } else {
                                        services
                                            .saveNivelation($scope.nivelacion, $rootScope.galletainfo)
                                            .then(complete)
                                            .catch(failed);

                                        function complete(data) {
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
                                            } else if (data.data.state === 0) {
                                                Swal({
                                                    type: "error",
                                                    title: data.data.msj,
                                                    timer: 4000,
                                                }).then(function () {
                                                    $route.reload();
                                                });
                                            } else {
                                                Swal({
                                                    type: "success",
                                                    title:
                                                        "La solicitud de nivelación se ha creado correctamente",
                                                    timer: 4000,
                                                }).then(function () {
                                                    $route.reload();
                                                });
                                            }
                                        }

                                        function failed(data) {
                                            console.log(data);
                                        }
                                    }
                                }
                            };
                        }
                    },
                    function (failed) {
                        console.log(2, failed);
                    }
                );
            }
        };
    }
);

app.filter("mapNivelacion", function () {
    var genderHash = {
        SI: "SI",
        NO: "NO",
    };

    return function (input) {
        if (!input) {
            return "";
        } else {
            return genderHash[input];
        }
    };
});

app.controller("GestionNivelacionCtrl", [
    "$scope",
    "$rootScope",
    "$location",
    "$route",
    "$routeParams",
    "$cookies",
    "$cookieStore",
    "$timeout",
    "services",
    "i18nService",
    function (
        $scope,
        $rootScope,
        $location,
        $route,
        $cookies,
        services,
        i18nService
    ) {
        $scope.GestionNivelacion = {};
        $scope.Registros = {};
        $scope.nivelacion = {};
        i18nService.setCurrentLang("es");
        $scope.userLog = $rootScope.galletainfo.login;
        init();

        function init() {
            getGrid();
            registrosTecnicos();
        }

        function getGrid() {
            Date.prototype.addMins = function (m) {
                this.setTime(this.getTime() + m * 60 * 1000);
                return this;
            };

            var fechaI2 = new Date();

            var columnDefs = [
                {
                    name: "Marcar",
                    cellTemplate:
                        "<div style='text-align: center'><input ng-checked={{row.entity.en_gestion}} value='{{row.entity.en_gestion}}' ng-model='row.entity.en_gestion' type='checkbox' ng-click='grid.appScope.engestion(row)'></div>",
                    minWidth: 70,
                    width: "1%",
                    enableCellEdit: false,
                    enableFiltering: false,
                    enableRowHeaderSelection: true,
                },
                {
                    name: "Login",
                    field: "gestiona_por",
                    cellTemplate:
                        "<div style='text-align: center' ng-show='(row.entity.gestiona_por !== null)'>" +
                        "<span class='label label-primary label-xsmall' ng-if='(row.entity.gestiona_por ==  grid.appScope.userLog)' style='vertical-align: sub'>{{grid.appScope.userLog}}</span>" +
                        "<span class='label label-primary label-xsmall' ng-if='(row.entity.gestiona_por != grid.appScope.userLog)' style='vertical-align: sub'>En gestion</span>" +
                        "</div>",
                    minWidth: 80,
                    width: "3%",
                    enableCellEdit: false,
                },
                {
                    name: "Tarea",
                    field: "ticket_id",
                    cellTemplate:
                        '<div style="text-align: center;"><button type="button" style="padding: 0; border: none" className="btn btn-default btn-xs ng-binding" ng-click="grid.appScope.CopyPortaPapeles(row.entity.ticket_id)" tooltip="" title="" id="tv0" data-original-title="Copiar pedido">{{row.entity.ticket_id}}</button></div>',
                    minWidth: 120,
                    width: "3%",
                    enableCellEdit: false,
                },
                {
                    name: "Fecha ingreso",
                    field: "fecha_ingreso",
                    cellStyle: {"text-align": "center"},
                    minWidth: 70,
                    width: "10%",
                    enableCellEdit: false,
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var date = new Date(row.entity.fecha_ingreso);

                        date.addMins(15);
                        if (date <= fechaI2) {
                            return "blue";
                        }
                    },
                },
                {
                    name: "Proceso",
                    field: "proceso",
                    cellStyle: {"text-align": "center"},
                    minWidth: 70,
                    width: "10%",
                    enableCellEdit: false,
                    cellTooltip: function (row, col) {
                        return row.entity.proceso;
                    },
                },
                {
                    name: "Zona",
                    field: "zona",
                    cellStyle: {"text-align": "center"},
                    minWidth: 80,
                    width: "8%",
                    enableCellEdit: false,
                },
                {
                    name: "Sub zona",
                    field: "zubzona",
                    cellStyle: {"text-align": "center"},
                    minWidth: 70,
                    width: "8%",
                    enableCellEdit: false,
                },
                {
                    name: "Nombre técnico",
                    field: "nombre_tecnico",
                    cellStyle: {"text-align": "center"},
                    width: "11%",
                    enableCellEdit: false,
                },
                {
                    name: "cc técnico",
                    field: "cc_tecnico",
                    cellStyle: {"text-align": "center"},
                    minWidth: 70,
                    width: "6%",
                    cellFilter: 'currency:"":0',
                    enableCellEdit: false,
                },
                {
                    name: "Tipo solicitud",
                    field: "solicitud",
                    cellStyle: {"text-align": "center"},
                    width: "6%",
                    enableCellEdit: false,
                    cellTooltip: function (row, col) {
                        return row.entity.solicitud;
                    },
                },
                {
                    name: "Motivo",
                    field: "motivo",
                    cellStyle: {"text-align": "center"},
                    width: "9%",
                    enableCellEdit: false,
                },
                {
                    name: "Submotivo",
                    field: "submotivo",
                    cellStyle: {"text-align": "center"},
                    width: "6%",
                    enableCellEdit: false,
                },
                {
                    name: "N. nuevo técnico",
                    field: "nombre_nuevo_tecnico",
                    cellStyle: {"text-align": "center"},
                    width: "11%",
                    enableCellEdit: false,
                },
                {
                    name: "c. n. técnico",
                    field: "cc_nuevo_tecnico",
                    cellStyle: {"text-align": "center"},
                    minWidth: 70,
                    width: "6%",
                    suppressSizeToFit: true,
                    enableColumnResizing: true,
                    cellFilter: 'currency:"":0',
                },
                {
                    name: "nivelacion",
                    editType: "dropdown",
                    cellFilter: "mapNivelacion",
                    enableCellEdit: true,
                    cellTemplate:
                        "<div style='text-align: center'><select ng-model='row.entity.nivelacion' class='btn btn-default btn-xs grupo-select'>" +
                        "<option value=''>Selec</option>" +
                        "<option value='SI'>SI</option>" +
                        "<option value='NO'>NO</option>" +
                        "</select>" +
                        "</div>",
                    minWidth: 50,
                    width: "6%",
                    enableColumnResizing: true,
                },
                {
                    name: "Obs.",
                    cellTemplate: "partial/modals/template.html",
                    width: "3%",
                    enableFiltering: false,
                    enableCellEdit: false,
                    cellStyle: {"text-align": "center"},
                },
                {
                    name: "Acc.",
                    cellTemplate:
                        "<div style='text-align: center'>" +
                        '<button type="button" class="btn btn-default btn-xs" ng-click="grid.appScope.guardagestion(row)">' +
                        '<i class="fa fa-floppy-o" aria-hidden="true"> </i>' +
                        "</button>",
                    minWidth: 50,
                    width: "3%",
                    enableFiltering: false,
                },
            ];

            var paginationOptions = {
                sort: null,
            };

            $scope.gridOptions = {
                enableFiltering: false,
                enablePagination: true,
                pageSize: 200,
                enableHorizontalScrollbar: false,
                enablePaginationControls: true,
                columnDefs: columnDefs,
                paginationPageSizes: [200, 500, 1000],
                paginationPageSize: 200,
                enableRowHeaderSelection: true,

                exporterMenuPdf: false,
                enableGridMenu: false,

                useExternalPagination: true,
                useExternalSorting: true,
                enableRowSelection: true,

                exporterCsvFilename: "Registros.csv",

                exporterCsvLinkElement: angular.element(
                    document.querySelectorAll(".custom-csv-link-location")
                ),
                exporterExcelFilename: "Registros.xlsx",
                exporterExcelSheetName: "Sheet1",

                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged(
                        $scope,
                        function (grid, sortColumns) {
                            if (getPage) {
                                if (sortColumns.length > 0) {
                                    paginationOptions.sort = sortColumns[0].sort.direction;
                                } else {
                                    paginationOptions.sort = null;
                                }
                                getPage(
                                    grid.options.paginationCurrentPage,
                                    grid.options.paginationPageSize,
                                    paginationOptions.sort
                                );
                            }
                        }
                    );
                    gridApi.pagination.on.paginationChanged(
                        $scope,
                        function (newPage, pageSize) {
                            if (getPage) {
                                getPage(newPage, pageSize, paginationOptions.sort);
                            }
                        }
                    );
                },
            };

            var getPage = function (curPage, pageSize, sort) {
                services
                    .gestionarNivelacion(curPage, pageSize, sort)
                    .then(complete)
                    .catch(failed);

                function complete(data) {
                    var datos = data.data.data;
                    var counter = data.data.counter;

                    $scope.gridOptions.totalItems = counter;
                    var firstRow = (curPage - 1) * datos;
                    $scope.gridOptions.data = datos;
                }

                function failed(error) {
                    console.log(error);
                }
            };

            getPage(1, $scope.gridOptions.paginationPageSize, paginationOptions.sort);
        }

        function registrosTecnicos() {
            var columnDefs = [
                {
                    name: "Tarea",
                    field: "ticket_id",
                    minWidth: 80,
                    width: "5%",
                },
                {
                    name: "Proceso",
                    field: "proceso",
                    minWidth: 80,
                    width: "10%",
                },
                {
                    name: "Nombre Teçnico",
                    field: "nombre_tecnico",
                    minWidth: 70,
                    width: "15%",
                },
                {
                    name: "CC Técnico",
                    field: "cc_tecnico",
                    minWidth: 80,
                    width: "7%",
                },
                {
                    name: "Tipo Solicitud",
                    field: "solicitud",
                    minWidth: 70,
                    width: "8%",
                },
                {
                    name: "Motivo",
                    field: "motivo",
                    width: "13%",
                },
                {
                    name: "Sub Motivo",
                    field: "submotivo",
                    minWidth: 70,
                    width: "7%",
                },
                {
                    name: "CC Nuevo Téc.",
                    field: "cc_nuevo_tecnico",
                    minWidth: 70,
                    width: "8%",
                },
                {
                    name: "Nombre Nuevo Tec.",
                    field: "nombre_nuevo_tecnico",
                    minWidth: 70,
                    width: "12%",
                },
                {
                    name: "Nivelacion",
                    field: "se_realiza_nivelacion",
                    minWidth: 70,
                    width: "10%",
                },
                {
                    name: "Detalles",
                    cellTemplate:
                        "<div style='text-align: center'>" +
                        '<button type="button" class="btn btn-default btn-xs" ng-click="grid.appScope.DetalleTotal(row)">' +
                        '<i class="fa fa-info-circle" aria-hidden="true"> </i>' +
                        "</button>",
                    minWidth: 70,
                    width: "5%",
                    enableFiltering: false,
                },
            ];

            var paginationOptions = {
                sort: null,
            };

            $scope.gridOptionsRegistros = {
                enableFiltering: true,
                enablePagination: true,
                pageSize: 200,
                enableHorizontalScrollbar: false,
                enablePaginationControls: true,
                columnDefs: columnDefs,
                paginationPageSizes: [200, 500, 1000],
                paginationPageSize: 200,

                useExternalPagination: true,
                useExternalSorting: true,
                enableRowSelection: true,

                enableGridMenu: true,
                enableSelectAll: true,
                exporterCsvFilename: "Registros-nivelacion.csv",
                exporterMenuPdf: false,
                exporterCsvLinkElement: angular.element(
                    document.querySelectorAll(".custom-csv-link-location")
                ),
                exporterExcelFilename: "Registros-nivelacion.xlsx",
                exporterExcelSheetName: "Sheet1",
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged(
                        $scope,
                        function (grid, sortColumns) {
                            if (getPage) {
                                if (sortColumns.length > 0) {
                                    paginationOptions.sort = sortColumns[0].sort.direction;
                                } else {
                                    paginationOptions.sort = null;
                                }
                                getPage(
                                    grid.options.paginationCurrentPage,
                                    grid.options.paginationPageSize,
                                    $scope.Registros
                                );
                            }
                        }
                    );
                    gridApi.pagination.on.paginationChanged(
                        $scope,
                        function (newPage, pageSize) {
                            if (getPage) {
                                getPage(newPage, pageSize, $scope.Registros);
                            }
                        }
                    );
                },
            };

            var getPage = function (curPage, pageSize, sort) {
                services
                    .gestionarRegistrosNivelacion(curPage, pageSize, $scope.Registros)
                    .then(complete)
                    .catch(failed);

                function complete(data) {
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
                        var datos = data.data.data;
                        var counter = data.data.counter;

                        $scope.gridOptionsRegistros.totalItems = counter;
                        var firstRow = (curPage - 1) * datos;
                        $scope.gridOptionsRegistros.data = datos;
                    }
                }

                function failed(error) {
                    console.log(error);
                }
            };

            getPage(
                1,
                $scope.gridOptionsRegistros.paginationPageSize,
                paginationOptions.sort
            );
        }

        $scope.gestion_nivelacion = function () {
            getGrid();
        };

        $scope.registros_nivelacion = function () {
            window.setTimeout(function () {
                registrosTecnicos();
                $(window).resize();
                $(window).resize();
            }, 1000);
        };

        $scope.DetalleTotal = function (row) {
            services
                .buscarhistoricoNivelacion(row.entity.ticket_id)
                .then(complete)
                .catch(failed);

            function complete(data) {
                if (data.data.state === 0) {
                    Swal({
                        type: "error",
                        title: data.data.msj,
                    });
                } else {
                    $scope.nivelacion.databsucarPedido = data.data.data;
                    $("#modalHistoricoNivelacion").modal("show");
                    return data.data;
                }
            }

            function failed(data) {
                console.log(data);
            }
        };

        function js_yyyy_mm_dd_hh_mm_ss() {
            now = new Date();
            year = "" + now.getFullYear();
            month = "" + (now.getMonth() + 1);
            if (month.length == 1) {
                month = "0" + month;
            }
            day = "" + now.getDate();
            if (day.length == 1) {
                day = "0" + day;
            }
            hour = "" + now.getHours();
            if (hour.length == 1) {
                hour = "0" + hour;
            }
            minute = "" + now.getMinutes();
            if (minute.length == 1) {
                minute = "0" + minute;
            }
            second = "" + now.getSeconds();
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

        $scope.reloaddata = function () {
            getGrid();
        };

        $scope.delete = function (row) {
            console.log(row.entity);
        };

        $scope.engestion = function (row) {
            services
                .marcarEnGestionNivelacion(row.entity.id)
                .then(complete)
                .catch(failed);

            function complete(data) {
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
                    Swal({
                        type: "success",
                        title: data.data.msj,
                        timer: 4000,
                    });
                    $route.reload();
                }
            }

            function failed(error) {
                console.log(error);
            }
        };

        $scope.guardagestion = function (row) {
            if (!row.entity.nivelacion) {
                Swal("Selecciona el estado de nivelación");
                return;
            }
            $scope.GestionNivelacion.observacionesNivelacion = "";
            $scope.datos = row.entity;
            $("#editarModal").modal("show");
        };

        $scope.buscarhistoricoNivelacion = function () {
            services
                .buscarhistoricoNivelacion($scope.nivelacion.tarea)
                .then(complete)
                .catch(failed);

            function complete(data) {
                if (data.data.state === 0) {
                    Swal({
                        type: "error",
                        title: data.data.msj,
                    });
                } else {
                    $scope.nivelacion.databsucarPedido = data.data.data;
                    $("#modalHistoricoNivelacion").modal("show");
                    return data.data;
                }
            }

            function failed(data) {
                console.log(data);
            }
        };

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

        $scope.guardarGestionObsNivelacion = function (data) {
            if (!data.nivelacion) {
                Swal("Selecciona el estado de nivelación");
                return;
            }
            $scope.GestionNivelacion.observacionesNivelacion = "";
            $scope.datos = data;
            $("#editarModal").modal("show");
        };

        $scope.guardaNivelacion = function () {
            $scope.datos.observaciones =
                $scope.GestionNivelacion.observacionesNivelacion;
            services
                .guardaNivelacion($scope.datos, $rootScope.galletainfo)
                .then(complete)
                .catch(failed);

            function complete(data) {
                if (data.data.state != 1) {
                    Swal({
                        type: "error",
                        text: data.data.msj,
                        timer: 4000,
                    });
                } else {
                    Swal({
                        type: "success",
                        title: data.data.msj,
                        timer: 4000,
                    }).then(function () {
                        $route.reload();
                    });
                }
            }

            function failed(errs) {
                console.log(errs);
            }
        };

        $scope.registrosNivelacion = function () {
            var fechaini = new Date($scope.fechaini);
            var fechafin = new Date($scope.fechafin);
            var diffMs = fechafin - fechaini;
            var diffDays = Math.round(diffMs / 86400000);

            if (
                $scope.Registros.fechaini === "" ||
                $scope.Registros.fechaini === undefined
            ) {
                Swal({
                    type: "error",
                    text: "Ingrese la fecha inicial",
                });
            } else if (
                $scope.Registros.fechafin === "" ||
                $scope.Registros.fechafin === undefined
            ) {
                Swal({
                    type: "error",
                    text: "Ingrese la fecha final",
                });
            } else if ($scope.Registros.fechafin < $scope.Registros.fechaini) {
                Swal({
                    type: "error",
                    text: "La fecha final no puede ser menor que la inicial",
                });
            } else {
                services
                    .gestionarRegistrosNivelacion(1, 200, $scope.Registros)
                    .then(complete)
                    .catch(failed);

                function complete(data) {
                    console.log(data.data.counter);
                    var datos = data.data.data;
                    var counter = data.data.counter;

                    $scope.gridOptionsRegistros.totalItems = counter;
                    $scope.gridOptionsRegistros.data = datos;
                }

                function failed(error) {
                    console.log(error);
                }
            }
        };

        $scope.csvNivelacion = function () {
            var fechaini = new Date($scope.fechaini);
            var fechafin = new Date($scope.fechafin);
            var diffMs = fechafin - fechaini;
            var diffDays = Math.round(diffMs / 86400000);

            if (
                $scope.Registros.fechaini === "" ||
                $scope.Registros.fechaini === undefined
            ) {
                Swal({
                    type: "error",
                    text: "Ingrese la fecha inicial",
                });
            } else if (
                $scope.Registros.fechafin === "" ||
                $scope.Registros.fechafin === undefined
            ) {
                Swal({
                    type: "error",
                    text: "Ingrese la fecha final",
                });
            } else if ($scope.Registros.fechafin < $scope.Registros.fechaini) {
                Swal({
                    type: "error",
                    text: "La fecha final no puede ser menor que la inicial",
                });
            } else {
                services.csvNivelacion($scope.Registros).then(
                    function (datos) {
                        var data = datos.data[0];
                        var array = typeof data != "object" ? JSON.parse(data) : data;
                        var str = "";
                        var column = `ticket_id|| fecha_ingreso|| fecha_gestion|| fecha_respuesta|| nombre_tecnico|| cc_tecnico|| pedido|| proceso|| motivo|| submotivo|| zona|| subzona|| nombre_nuevo_tecnico|| cc_nuevo_tecnico|| creado_por|| gestiona_por||observaciones|| se_realiza_nivelacion \r\n`;
                        str += column;
                        for (var i = 0; i < array.length; i++) {
                            var line = "";
                            for (var index in array[i]) {
                                if (line != "") line += "||";
                                line += array[i][index];
                            }

                            str += line + "\r\n";
                        }
                        var dateCsv = new Date();
                        var yearCsv = dateCsv.getFullYear();
                        var monthCsv =
                            dateCsv.getMonth() + 1 <= 9
                                ? "0" + (dateCsv.getMonth() + 1)
                                : dateCsv.getMonth() + 1;
                        var dayCsv =
                            dateCsv.getDate() <= 9
                                ? "0" + dateCsv.getDate()
                                : dateCsv.getDate();
                        var fullDateCsv = yearCsv + "-" + monthCsv + "-" + dayCsv;

                        var blob = new Blob([str]);
                        var elementToClick = window.document.createElement("a");
                        elementToClick.href = window.URL.createObjectURL(blob, {
                            type: "text/csv",
                        });
                        elementToClick.download = "csvNivelacion-" + fullDateCsv + ".csv";
                        elementToClick.click();
                    },

                    function errorCallback(response) {
                        $scope.errorDatos = "No hay datos.";
                        $scope.csvPend = false;
                    }
                );
            }
        };

        $scope.reloadNivelacion = function () {
            getGrid();
        };
    },
]);

app.controller(
    "contingenciasCtrl",
    function ($scope, $rootScope, $timeout, services) {
        $scope.contingencias = {};
        $scope.pedidoexiste = false;
        $scope.pedidoguardado = false;
        $scope.haypedido = false;
        $scope.equiposEntran = [];
        $scope.equiposEntran.push({});
        $scope.equiposSalen = [];
        $scope.equiposSalen.push({});

        $scope.BuscarPedidoContingencia = function () {
            services
                .buscarPedidoSeguimiento(
                    $scope.contingencias.pedido,
                    $scope.contingencias.producto,
                    $scope.contingencias.remite
                )
                .then(
                    function (data) {
                        console.log("buscarPedidoSeguimiento: ", data);
                        console.log($scope.contingencias);
                        $scope.GuardarContingencia($scope.contingencias);
                        $scope.contingencias = {};
                    },
                    function errorCallback(response) {
                        $scope.pedidoexiste = true;
                        $scope.pedidoguardado = false;

                        console.log("status: ", response.status);

                        if (response.status == "401") {
                            $scope.mensaje =
                                "El pedido con el producto: " +
                                $scope.contingencias.producto +
                                ", se encuentra pendiente, no es posible gestionar nuevamente.";
                        } else {
                            $scope.mensaje =
                                "El pedido se encuentra sin gestión, no es posible guardar.";
                        }
                        return;
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
                        if (data.data.state != 1) {
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
                    console.log("guardarContingencia: ", services.guardarContingencia);
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
);

app.controller(
    "GestioncontingenciasCtrl",
    function (
        $scope,
        $rootScope,
        services,
        $http
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

        $scope.bb8 = function (pedido) {
            $scope.bb8Internet = 0;
            $scope.bb8Telefonia = 0;
            $scope.bb8Television = 0;

            $scope.url =
                "http://10.100.66.254:8080/BB8/contingencias/Buscar/GetClick/" + pedido;
            $http
                .get($scope.url, {timeout: 4000})
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
                    $scope.url =
                        "http://10.100.66.254:8080/BB8/contingencias/Buscar/GetPlanBaMSS/" +
                        pedido;
                    $http
                        .get($scope.url, {timeout: 4000})
                        .then(function (data) {
                            console.log(data, " internet ");
                            if (data.data.length > 0) {
                                $scope.bb8Internet = 1;
                                $scope.recorreinternet = data.data;
                            } else {
                                $scope.url =
                                    "http://10.100.66.254:8080/BB8/contingencias/Buscar/GetPlanBaMSS/" +
                                    $scope.clic.UNECodigoDireccionServicio;
                                $http.get($scope.url, {timeout: 4000}).then(function (data) {
                                    console.log(data, " internet2 ");
                                    if (data.data.length > 0) {
                                        $scope.bb8Internet = 1;
                                        $scope.recorreinternet = data.data;
                                    }
                                });
                            }
                            $scope.url =
                                "http://10.100.66.254:8080/BB8/contingencias/Buscar/GetPlanTOMSS/" +
                                pedido;
                            $http
                                .get($scope.url, {timeout: 4000})
                                .then(function (data) {
                                    console.log(data, " telefonia");
                                    if (data.data.length > 0) {
                                        $scope.bb8Telefonia = 1;
                                        $scope.recorretelefonia = data.data;
                                    } else {
                                        $scope.url =
                                            "http://10.100.66.254:8080/BB8/contingencias/Buscar/GetPlanTOMSS/" +
                                            $scope.clic.UNECodigoDireccionServicio;
                                        $http
                                            .get($scope.url, {timeout: 4000})
                                            .then(function (data) {
                                                console.log(data, " telefonia2");
                                                if (data.data.length > 0) {
                                                    $scope.bb8Telefonia = 1;
                                                    $scope.recorretelefonia = data.data;
                                                }
                                            });
                                    }
                                    $scope.url =
                                        "http://10.100.66.254:8080/BB8/contingencias/Buscar/GetPlanTVMSS/" +
                                        pedido;
                                    $http
                                        .get($scope.url, {timeout: 4000})
                                        .then(function (data) {
                                            console.log(data, " tv");
                                            if (data.data.length > 0) {
                                                $scope.bb8Television = 1;
                                                $scope.recore = data.data;
                                            } else {
                                                $scope.url =
                                                    "http://10.100.66.254:8080/BB8/contingencias/Buscar/GetPlanTVMSS/" +
                                                    $scope.clic.UNECodigoDireccionServicio;
                                                $http
                                                    .get($scope.url, {timeout: 4000})
                                                    .then(function (data) {
                                                        console.log(data, " tv2");
                                                        if (data.data.length > 0) {
                                                            $scope.bb8Television = 1;
                                                            $scope.recore = data.data;
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

        $scope.changeStatus = function (data) {
        };

        $scope.gestioncontingencias = () => {
            $scope.loadingData = true;

            services
                .datosgestioncontingencias()
                .then(function (data) {
                    $scope.loadingData = false;

                    $scope.contingenciasTV = $scope.contingenciesDataTV.concat(
                        data.data.data[0]
                    );
                    $scope.contingenciasOTROS =
                        $scope.contingenciesDataInternetToIP.concat(data.data.data[1]);

                    $scope.contingenciasPortafolio = data.data.data[2];

                    var TV = $scope.contingenciasTV.map((doc) => doc.horagestion);
                    var OTROS = $scope.contingenciasOTROS.map((doc) => doc.horagestion);
                    var CPORTAFOLIO = $scope.contingenciasPortafolio.map(
                        (doc) => doc.horagestion
                    );

                    function js_yyyy_mm_dd_hh_mm_ss() {
                        now = new Date();
                        year = "" + now.getFullYear();
                        month = "" + (now.getMonth() + 1);
                        if (month.length == 1) {
                            month = "0" + month;
                        }
                        day = "" + now.getDate();
                        if (day.length == 1) {
                            day = "0" + day;
                        }
                        hour = "" + now.getHours();
                        if (hour.length == 1) {
                            hour = "0" + hour;
                        }
                        minute = "" + now.getMinutes();
                        if (minute.length == 1) {
                            minute = "0" + minute;
                        }
                        second = "" + now.getSeconds();
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
                            $scope.quinceminutos = new Array();
                            $scope.quinceminutos[$scope.indice] = TV[$scope.indice];
                        }
                    });

                    OTROS.forEach(function (valor, indice) {
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
                    });

                    if ($scope.contingenciasTV.length !== 0) {
                        $scope.haypedidoTV = true;
                    } else {
                        $scope.haypedidoTV = false;
                        $scope.mensaje = "No hay pedidos para gestionar!!!";
                    }

                    if ($scope.contingenciasOTROS.length !== 0) {
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
                    }

                    return data.data;
                })
                .catch(function (err) {
                    console.log(err);
                    $scope.contingenciasTV = [];
                    $scope.contingenciasOTROS = [];
                    $scope.loadingData = false;
                });
        };

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
                var autocompleteQuery = await fetch(
                    "http://10.100.66.254:8080/HCHV_DEV/BuscarB/" + data.references
                );
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
                alert("Pedido guardado, recuerda actualizar!!");
                if (
                    data.id_terreno != null &&
                    data.id_terreno != undefined &&
                    data.id_terreno != ""
                ) {
                    var currentTimeDate = new Date().toLocaleString();
                    var statusContingencieField =
                        data.tipificacion == "Ok" ? "Aprobado" : "Rechazado";
                }
                services
                    .editarregistrocontingencia(data, $rootScope.galletainfo)
                    .then(function (data) {
                    })
                    .catch((err) => alert(err));
                $scope.gestioncontingencias();
            }
        };

        $scope.marcarEngestion = async (data) => {
            if (data._id != null && data._id != undefined) {
                try {
                    data.pedido = data.references;
                    data.producto = data.product;
                    await $scope.autocompletarContingencia(data);
                } catch (error) {
                    return swal({
                        title: "Aviso Importante: ",
                        html: "El pedido no fue desbloqueado.",
                        type: "error",
                    });
                }
            }

            services
                .marcarengestion(data, $rootScope.galletainfo)
                .then(function (data) {
                    if (data.data !== "") {
                        if (data.data[0] == "desbloqueado") {
                            $scope.respuestaMarca = data.data[0][0];
                            swal({
                                title: "Pedido Desbloqueado",
                                type: "success",
                                position: "center",
                                showConfirmButton: false,
                                timer: 3000,
                            });
                            $scope.gestioncontingencias();
                            return;
                        } else {
                            $scope.respuestaMarca = data.data[0][0];
                            swal({
                                title: "El pedido se encuentra bloqueado",
                                type: "warning",
                                position: "center",
                                showConfirmButton: false,
                                timer: 3000,
                            });
                            $scope.gestioncontingencias();
                            //$scope.gestioncontingenciasPrueba();
                            return;
                        }
                    } else if (data.data == "") {
                        $scope.respuestaMarca = "";
                        swal({
                            title: "Pedido Bloqueado",
                            type: "success",
                            position: "center",
                            showConfirmButton: false,
                            timer: 3000,
                        });
                        $scope.gestioncontingencias();
                        return;
                    }
                })
                .catch((err) => console.log(err));
        };

        $scope.guardarContingenciaPortafolio = function (data) {
            if (data.enGestionPortafolio == 0) {
                alert("Debes bloquear el pedido");
                return;
            } else if (data.tipificacionPortafolio == "") {
                alert("Recuerda seleccionar todas las opciones!!");
                return;
            } else {
                $scope.gestioncontinPortafilio = data;
                $("#editarModalPortafolio").modal("show");
                return data.data;
            }
        };

        $scope.guardarpedidoPortafolio = function (data) {
            if (!data.observContingenciaPortafolio) {
                alert("Debes ingresar las observaciones.");
                return;
            } else {
                alert("Pedido guardado, recuerda actualizar!!");
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
                            alert("Pedido desbloqueado!!");
                            $scope.gestioncontingencias();
                            return;
                        } else {
                            $scope.respuestaMarca = data.data[0][0];
                            if ($scope.respuestaMarca.logincontingencia) {
                                alert("El pedido se encuentra bloqueado.");
                            } else {
                                alert("El pedido se encuentra bloqueado.");
                            }

                            $scope.gestioncontingencias();
                            return;
                        }
                    } else if (data.data == "") {
                        $scope.respuestaMarca = "";
                        alert("Pedido bloqueado!!!");
                        $scope.gestioncontingencias();
                        return;
                    }
                });
        };

        $scope.buscarPedidoContingencia = function (pedido) {
            console.log("pedido: ", pedido);

            if (pedido == undefined || pedido == "") {
                alert("Debe ingresar un pedido");
                return;
            } else {
                services.getbuscarPedidoContingencia(pedido).then(
                    function (data) {
                        if (data.data.state != 1) {
                            Swal({
                                type: 'error',
                                text: data.data.msj,
                                timer: 4000
                            })
                        } else {
                            $scope.databsucarPedido = data.data.data;
                            $scope.sinPedido = true;
                        }

                    },
                    function errorCallback(response) {
                        console.log(response);
                    }
                );
            }
        };

        $scope.resumenContingencias = function (fechaInicial, fechafinal) {
            services.getresumenContingencias(fechaInicial, fechafinal).then(
                function (data) {
                    $scope.dataresumenContingencias = data.data[0];

                    $scope.dataresumenContingenciasCP = data.data[5];

                    $scope.dataresumenContingenciasTV = data.data[6];

                    $scope.dataresumenContingenciasInTo = data.data[7];

                    $scope.estados = data.data[1];

                    $scope.estadosCP = data.data[3];

                    $scope.dia = data.data[2];
                    $scope.diaCP = data.data[4];

                    var tam = $scope.dataresumenContingencias.length;
                    $scope.Totaltotal_pedidos_aceptados = 0;
                    $scope.Totaltotal_pedidos_pendientes = 0;
                    $scope.Totaltotal_pedidos_rechazados = 0;

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

                    var tam = $scope.dataresumenContingenciasCP.length;
                    $scope.Totaltotal_pedidos_aceptadosCP = 0;
                    $scope.Totaltotal_pedidos_pendientesCP = 0;
                    $scope.Totaltotal_pedidos_rechazadosCP = 0;
                    $scope.Total_Personas_GestionandoCP = 0;

                    for (var i = 0; i < tam; i++) {
                        if ($scope.dataresumenContingenciasCP[i].estado == "Acepta") {
                            $scope.Totaltotal_pedidos_aceptadosCP =
                                +$scope.Totaltotal_pedidos_aceptadosCP + 1;
                        }
                        if ($scope.dataresumenContingenciasCP[i].estado == "Rechaza") {
                            $scope.Totaltotal_pedidos_rechazadosCP =
                                +$scope.Totaltotal_pedidos_rechazadosCP + 1;
                        }
                        if ($scope.dataresumenContingenciasCP[i].estado == "Pendiente") {
                            $scope.Totaltotal_pedidos_pendientesCP =
                                +$scope.Totaltotal_pedidos_pendientesCP + 1;
                        }
                    }

                    for (var i = 0; i < tam; i++) {
                        if (
                            $scope.dataresumenContingenciasCP[i].estado == "Pendiente" &&
                            $scope.dataresumenContingenciasCP[i]
                                .loginContingenciaPortafolio !== null &&
                            $scope.dataresumenContingenciasCP[i].estado == "Pendiente" &&
                            $scope.dataresumenContingenciasCP[i]
                                .loginContingenciaPortafolio !== ""
                        ) {
                            $scope.Total_Personas_GestionandoCP =
                                +$scope.Total_Personas_GestionandoCP + 1;
                        }
                    }

                    return data.data;
                },
                function errorCallback(response) {
                }
            );
        };

        $scope.descargarContingencias = function (fechaInicial, fechafinal) {
            services
                .getexporteContingencias(
                    fechaInicial,
                    fechafinal,
                    $rootScope.galletainfo
                )
                .then(
                    function (datos) {
                        console.log(datos);
                        if (datos.data.state != 1) {
                            Swal({
                                type: 'error',
                                text: datos.datos.msj,
                                timer: 4000
                            })
                        } else {
                            var data = datos.data.data;
                            var array = typeof data != 'object' ? JSON.parse(data) : data;
                            var str = '';
                            var column = `ACCION|| CIUDAD|| CORREO|| MAC_ENTRA|| MAC_SALE || MOTIVO ||OBSERVACIONES ||PAQUETES ||PEDIDO ||PROCESO ||PRODUCTO ||REMITENTE ||TECNOLOGIA ||TIPO_EQUIPO ||UEN || CONTRATO || PERFIL ||LOGIN ||LOGIN_GESTION ||HORA_INGRESO ||HORA_GESTION ||OBSERVACIONES_GESTION|| ESTADO|| TIPIFICACION|| FECHACLICKMARCA|| LOGIN_PORTAFILO|| HORA_GESTION_PORTAFOLIO|| TIPIFICACION_PORTAFOLIO|| OBSERVACIONES_GESTION_PORTAFOLIO|| GENERAR_CR' \r\n`;
                            str += column;
                            for (var i = 0; i < array.length; i++) {
                                var line = '';
                                for (var index in array[i]) {
                                    if (line != '') line += '||'
                                    line += array[i][index];
                                }

                                str += line + '\r\n';
                            }
                            var dateCsv = new Date();
                            var yearCsv = dateCsv.getFullYear();
                            var monthCsv = (dateCsv.getMonth() + 1 <= 9) ? '0' + (dateCsv.getMonth() + 1) : (dateCsv.getMonth() + 1);
                            var dayCsv = (dateCsv.getDate() <= 9) ? '0' + dateCsv.getDate() : dateCsv.getDate();
                            var fullDateCsv = yearCsv + "-" + monthCsv + "-" + dayCsv;


                            var blob = new Blob([str]);
                            var elementToClick = window.document.createElement("a");
                            elementToClick.href = window.URL.createObjectURL(blob, {type: 'text/csv'});
                            elementToClick.download = "Contingencias-" + fullDateCsv + ".csv";
                            elementToClick.click();
                        }

                    },

                    function errorCallback(response) {
                        console.log(response);
                    }
                );
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
                text: "no prodrás revertir esto!",
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
        $scope.resumenContingencias(
            $scope.fechaupdateInical,
            $scope.fechaupdateFinal
        );
    }
);

app.controller("pendientesBrutalCtrl", function ($scope, $uibModal, services) {
    $scope.abrirModalPendientes = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            backdrop: "static",
            keyboard: false,
            size: "md",
            templateUrl: "partial/PendientesBrutal.html",
            controller: function ($scope, $uibModalInstance) {
                $scope.tituloModalPausa = "Pendientes Brutal force";
                services.pendientesBrutalForce().then(function (data) {
                    $scope.pendientesBrutal = data.data[0];
                    $scope.total = $scope.pendientesBrutal.length;
                    return data.data;
                });
                $scope.cerrar = function () {
                    $uibModalInstance.dismiss("cancel");
                };
            },
        });
    };
});

app.controller(
    "GestionsoportegponCtrl",
    function ($scope, $rootScope, services, $route) {
        $scope.isSoporteGponFromField = false;
        $scope.isSoporteGponFromIntranet = false;
        $scope.isLoadingData = true;
        $scope.dataSoporteGpon = [];
        $scope.dataContent = 'clic';


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

        $scope.ver_masss = (data) => {
            console.log(data);
            $scope.dataContent =
                "<div class='table-responsive' style='max-width: 380px;'><table class='table table-bordered table-hover table-condensed small style='max-width: 350px;'>" +
                "<tbody><tr><td style='min-width: 80px'>Pedido</td><td>" + data.unepedido + "</td></tr>" +
                "<tr><td style='min-width: 80px'>Categoría</td><td>" + data.tasktypecategory + "</td></tr>" +
                "<tr><td style='min-width: 80px'>Municipio</td><td>" + data.unemunicipio + "</td></tr>" +
                "<tr><td style='min-width: 80px'>Productos</td><td>" + data.uneproductos + "</td></tr>" +
                "<tr><td style='min-width: 80px'>Datos cola</td><td>" + data.datoscola + "</td></tr>" +
                "<tr><td style='min-width: 80px'>Mac</td><td>" + data.mac + "</td></tr>" +
                "<tr><td style='min-width: 80px'>Serial</td><td>" + data.serial.replace(/,/g, '\n') + "</td></tr>" +
                "<tr><td style='min-width: 80px'>Sistema</td><td>" + data.uneSourceSystem + "</td></tr>" +
                "<tr><td style='min-width: 80px'>Tipo equipo</td><td>" + data.tipo_equipo.replace(/,/g, '\n') + "</td></tr>" +
                "<tr><td style='min-width: 80px'>Velocidad navegación</td><td>" + data.velocidad_navegacion + "</td></tr>" +
                "<tr><td style='min-width: 80px'>Observación</td><td>" + data.observacion_terreno + "</td></tr>" +
                "<tr><td style='min-width: 80px'>Fecha solicitud</td><td>" + data.fecha_creado + "</td></tr>" +
                "</tbody></table></div>";
        }


        $scope.marcarEngestionGpon = async (data) => {
            services
                .marcarEngestionGpon(data, $rootScope.galletainfo)
                .then(function (data) {

                    if (data.data.state == 1) {
                        swal({
                            title: "muy Bien",
                            type: "success",
                            text: data.data.msj,
                            timer: 4000,
                        }).then(function () {
                            $route.reload();
                        })
                    } else if (data.data.state == 0) {
                        swal({
                            title: "Ops...",
                            type: "info",
                            text: data.data.msj,
                            timer: 4000,
                        }).then(function () {
                            $route.reload();
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
)
    .filter("replace", [
        function () {
            return function (input, from, to) {
                if (input === undefined) {
                    return;
                }

                var regex = new RegExp(from, "g");
                return input.replace(regex, to);
            };
        },
    ]);

app.controller(
    "registrossoportegponCtrl",
    function ($scope, $rootScope, services) {
        $scope.listaRegistros = {};
        $scope.RegistrosSoporteGpon = {};
        $scope.soportegpon = {};
        $scope.listadoAcciones = {};
        $scope.datosRegistros = {};
        $scope.verplantilla = false;

        $scope.currentPage = 1;
        $scope.totalItems = 0;
        $scope.pageSize = 10;
        $scope.searchText = "";

        BuscarRegistrosSoporteGpon();

        $scope.pageChanged = function () {
            data = {page: $scope.currentPage, size: $scope.pageSize, data: $scope.RegistrosSoporteGpon};
            BuscarRegistrosSoporteGpon(data);
        };
        $scope.pageSizeChanged = function () {
            data = {page: $scope.currentPage, size: $scope.pageSize, data: $scope.RegistrosSoporteGpon};
            $scope.currentPage = 1;
            BuscarRegistrosSoporteGpon(data);
        };

        if (
            $scope.RegistrosSoporteGpon.fechaini == undefined ||
            $scope.RegistrosSoporteGpon.fechafin == undefined
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

            $scope.fechaini = tiempo;
            $scope.fechafin = tiempo;
        }

        $scope.buscarRegistrosSoporteGpon = function (data) {
            let date_1 = new Date(data.fechaini);
            let date_2 = new Date(data.fechafin);
            let diff = date_2 - date_1;

            let TotalDays = Math.ceil(diff / (1000 * 3600 * 24));
            if (TotalDays > 8) {
                swal({
                    type: "error",
                    text: "Para optimizacion de los reportes estos no pueden sobrepasar los 8 dias",
                });
            } else if (data.fechafin == undefined) {
                Swal({
                    type: "error",
                    title: "Oops...",
                    text: "Ingrese la fecha final a consultar",
                    timer: 4000,
                });
            } else if (data.fechaini == undefined) {
                Swal({
                    type: "error",
                    title: "Oops...",
                    text: "Ingrese la fecha inicial a consultar",
                    timer: 4000,
                });
            } else if (data.fechaini > data.fechafin) {
                Swal({
                    type: "error",
                    title: "Oops...",
                    text: "La fecha inicial no puede ser mayor que la final",
                    timer: 4000,
                });
            } else {
                data = {page: $scope.currentPage, size: $scope.pageSize, data: data};
                BuscarRegistrosSoporteGpon(data);
            }
        };

        function BuscarRegistrosSoporteGpon(data) {
            $scope.listaRegistros = "";
            if (data === "" || data === undefined) {
                $scope.currentPage = 1;
                $scope.totalItems = 0;
                $scope.pageSize = 10;
                $scope.searchText = "";
                data = {page: $scope.currentPage, size: $scope.pageSize};
            }
            services.registrossoportegpon(data).then(
                function (data) {
                    $scope.listaRegistros = data.data.data;
                    $scope.cantidad = data.data.data.length;
                    $scope.counter = data.data.counter;

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

        $scope.buscarhistoricoSoporteGpon = function (param) {
            if (param) {
                data = {
                    page: $scope.currentPage,
                    size: $scope.pageSize,
                    pedido: param,
                };
                services.registrossoportegpon(data).then(complete).catch(failed);

                function complete(data) {
                    if (data.data.state == 1) {
                        $scope.historicoDatos = data.data.data;
                        $("#HistoricoModal").modal('show')
                    } else {
                        Swal({
                            type: "error",
                            title: "Oops...",
                            text: data.data.msj,
                            timer: 4000,
                        });
                    }
                }

                function failed(data) {
                    console.log(data);
                }
            } else {
                Swal({
                    type: "error",
                    title: "Oops...",
                    text: "Ingrese el pedido a consultar",
                    timer: 4000,
                });
            }
        };

        $scope.muestraNotas = function (datos) {
            $scope.TituloModal = "Detalle soporte gpon";
            $scope.pedido = datos.unepedido;
            $scope.tarea = datos.tarea;
            $scope.velocidadnavegacion = datos.velocidad_navegacion;
            $scope.arpon = datos.arpon;
            $scope.nap = datos.nap;
            $scope.hilo = datos.hilo;
            $scope.intenet1 = datos.port_internet_1 == "1" ? "X" : "";
            $scope.intenet2 = datos.port_internet_2 == "1" ? "X" : "";
            $scope.intenet3 = datos.port_internet_3 == "1" ? "X" : "";
            $scope.intenet4 = datos.port_internet_4 == "1" ? "X" : "";
            $scope.television1 = datos.port_television_1 == "1" ? "X" : "";
            $scope.television2 = datos.port_television_2 == "1" ? "X" : "";
            $scope.television3 = datos.port_television_3 == "1" ? "X" : "";
            $scope.television4 = datos.port_television_4 == "1" ? "X" : "";

            let listaseriales = datos.serial.split(",");
            let listamacs = datos.mac.split(",");

            $scope.listaSeriales = listaseriales;
            $scope.listaMacs = listamacs;
            console.log($scope.listaSeriales, $scope.listaMacs);
            $scope.observaciones = datos.observacion;
        };

        $scope.csvRegistros = function () {
            $scope.csvPend = false;
            if (
                $scope.RegistrosSoporteGpon.fechaini >
                $scope.RegistrosSoporteGpon.fechafin
            ) {
                alert("La fecha inicial debe ser menor que la inicial");
                return;
            } else {
                services
                    .expCsvRegistrosSoporteGpon(
                        $scope.RegistrosSoporteGpon,
                        $rootScope.galletainfo
                    )
                    .then(
                        function (datos) {
                            if (datos.data.state != 1) {
                                Swal({
                                    type: 'error',
                                    text: datos.data.msj,
                                    timer: 4000
                                })
                            } else {
                                var data = datos.data.data;
                                var array = typeof data != 'object' ? JSON.parse(data) : data;
                                var str = '';
                                var column = `TAREA|| ARPON|| NAP|| HILO|| PORT_INTERNET_1|| PORT_INTERNET_2|| PORT_INTERNET_3|| PORT_INTERNET_4|| PORT_TELEVISION_1|| PORT_TELEVISION_2|| PORT_TELEVISION_3|| PORT_TELEVISION_4|| NUMERO_CONTACTO|| NOMBRE_CONTACTO|| UNEPEDIDO|| TASKTYPECATEGORY|| UNEMUNICIPIO|| UNEPRODUCTOS|| DATOSCOLA|| ENGINEER_ID|| ENGINEER_NAME|| MOBILE_PHONE|| SERIAL|| MAC|| TIPO_EQUIPO|| VELOCIDAD_NAVEGACION|| USER_ID_FIREBASE|| REQUEST_ID_FIREBASE|| USER_IDENTIFICATION_FIREBASE|| STATUS_SOPORTE|| FECHA_SOLICITUD_FIREBASE|| FECHA_CREADO|| RESPUESTA_SOPORTE|| TIPIFICACION|| OBSERVACION|| OBSERVACION TERRENO|| LOGIN|| FECHA_RESPUESTA|| FECHA_MARCA \r\n`;
                                str += column;
                                for (var i = 0; i < array.length; i++) {
                                    var line = '';
                                    for (var index in array[i]) {
                                        if (line != '') line += '||'
                                        line += array[i][index];
                                    }

                                    str += line + '\r\n';
                                }
                                var dateCsv = new Date();
                                var yearCsv = dateCsv.getFullYear();
                                var monthCsv = (dateCsv.getMonth() + 1 <= 9) ? '0' + (dateCsv.getMonth() + 1) : (dateCsv.getMonth() + 1);
                                var dayCsv = (dateCsv.getDate() <= 9) ? '0' + dateCsv.getDate() : dateCsv.getDate();
                                var fullDateCsv = yearCsv + "-" + monthCsv + "-" + dayCsv;


                                var blob = new Blob([str]);
                                var elementToClick = window.document.createElement("a");
                                elementToClick.href = window.URL.createObjectURL(blob, {type: 'text/csv'});
                                elementToClick.download = "csv-registros-soportegpon" + fullDateCsv + ".csv";
                                elementToClick.click();
                            }

                        },

                        function errorCallback(response) {
                            console.log(response);
                        }
                    );
            }
        };
    }
);

app.controller(
    "GestioncodigoincompletoCtrl",
    function ($scope, $rootScope, services) {
        $scope.isSoporteGponFromField = false;
        $scope.isSoporteGponFromIntranet = false;
        $scope.isLoadingData = true;
        $scope.dataCodigoIncompleto = [];

        listarcodigoincompleto();

        function listarcodigoincompleto(data) {
            if (data === '' || data === undefined) {
                $scope.currentPage = 1;
                $scope.totalItems = 0;
                $scope.pageSize = 15;
                $scope.searchText = '';
                data = {'page': $scope.currentPage, 'size': $scope.pageSize}
            }
            services
                .getListaCodigoIncompleto(data)
                .then(function (data) {
                    $scope.dataCodigoIncompleto = data.data.data;

                    $scope.totalItems = data.data.counter;
                    $scope.startItem = ($scope.currentPage - 1) * $scope.pageSize + 1;
                    $scope.endItem = $scope.currentPage * $scope.pageSize;
                    if ($scope.endItem > data.data.counter) {
                        $scope.endItem = data.data.counter;
                    }
                })
                .catch((err) => {
                    $scope.isLoadingData = true;
                    console.log(err);
                });

            $scope.isLoadingData = false;
        };

        $scope.pageChanged = function () {
            data = {'page': $scope.currentPage, 'size': $scope.pageSize}
            console.log(data)
            listarcodigoincompleto(data);
        }
        $scope.pageSizeChanged = function () {
            console.log(data)
            data = {'page': $scope.currentPage, 'size': $scope.pageSize}
            $scope.currentPage = 1;
            listarcodigoincompleto(data);
        }

        $scope.gestionarCodigoIncompleto = async (id_codigo_incompleto) => {
            let tipificacion = $("#tipificacion" + id_codigo_incompleto).val();

            const {value: observacion} = await Swal({
                title: "Gestión Código Incompleto",
                input: "textarea",
                inputPlaceholder: "Gestion...",
                inputAttributes: {
                    "aria-label": "Gestion",
                },
                showCancelButton: true,
            });

            if (observacion) {
                Swal("Cargando...");

                if (tipificacion == "") {
                    Swal({
                        title: "Error",
                        text: "Debes de seleccionar una tipificación.",
                        type: "error",
                    });
                    return false;
                }

                services
                    .gestionarCodigoIncompleto(
                        id_codigo_incompleto,
                        tipificacion,
                        observacion,
                        $rootScope.galletainfo
                    )
                    .then(function (data) {
                        $scope.listarcodigoincompleto();
                        Swal({
                            title: "Excelente",
                            text: data.data.msg,
                            type: "success",
                        });
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
    }
);

app.controller(
    "registroscodigoincompletoCtrl",
    function ($scope, $rootScope, services) {
        $scope.listaRegistros = {};
        $scope.RegistrosCodigoIncompleto = {};
        $scope.listadoAcciones = {};
        $scope.datosRegistros = {};
        $scope.verplantilla = false;

        if (
            $scope.RegistrosCodigoIncompleto.fechaini == undefined ||
            $scope.RegistrosCodigoIncompleto.fechafin == undefined
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

            $scope.fechaini = tiempo;
            $scope.fechafin = tiempo;
        }

        BuscarRegistrosCodigoIncompleto();

        function BuscarRegistrosCodigoIncompleto(data) {
            if (data === '' || data === undefined) {
                $scope.currentPage = 1;
                $scope.totalItems = 0;
                $scope.pageSize = 15;
                $scope.searchText = '';
                data = {'page': $scope.currentPage, 'size': $scope.pageSize}
            }
            services
                .registroscodigoincompleto(data)
                .then(
                    function (data) {
                        console.log(data);
                        $scope.listaRegistros = data.data.data;
                        $scope.cantidad = data.data.totalItems;
                        $scope.counter = data.data.total_pages;

                        $scope.totalItems = data.data.totalItems;
                        $scope.startItem = ($scope.currentPage - 1) * $scope.pageSize + 1;
                        $scope.endItem = $scope.currentPage * $scope.pageSize;
                        if ($scope.endItem > data.data.totalItems) {
                            $scope.endItem = data.data.totalItems;
                        }
                    },

                    function errorCallback(response) {
                        console.log(response);
                    }
                );

        };

        $scope.recargaPage = () => {
            BuscarRegistrosCodigoIncompleto();
            $scope.tarea = '';
        }

        $scope.CopyPortaPapeles = function (data) {
            var copyTextTV = document.createElement("input");
            copyTextTV.value = data;
            document.body.appendChild(copyTextTV);
            copyTextTV.select();
            document.execCommand("copy");
            document.body.removeChild(copyTextTV);
            Swal({
                type: 'info',
                title: 'Aviso',
                text: "El texto seleccionado fue copiado",
                timer: 2000
            });
        }

        $scope.Buscartarea = (tarea) => {
            if (tarea == '' || tarea == undefined) {
                Swal({
                    type: 'info',
                    title: 'Aviso',
                    text: "Debes ingresar la tarea",
                    timer: 4000
                });
                return
            }
            data = {'page': $scope.currentPage, 'size': $scope.pageSize, 'data': $scope.RegistrosCodigoIncompleto, 'tarea': tarea}
            BuscarRegistrosCodigoIncompleto(data);
        }


        $scope.pageChanged = function (tarea) {
            data = {'page': $scope.currentPage, 'size': $scope.pageSize, 'data': $scope.RegistrosCodigoIncompleto}
            console.log(data)
            BuscarRegistrosCodigoIncompleto(data);
        }
        $scope.pageSizeChanged = function () {
            console.log(data)
            data = {'page': $scope.currentPage, 'size': $scope.pageSize, 'data': $scope.RegistrosCodigoIncompleto}
            $scope.currentPage = 1;
            BuscarRegistrosCodigoIncompleto(data);
        }

        $scope.muestraNotas = function (datos) {
            $scope.TituloModal = "Detalle código incompleto";
            $scope.pedido = datos.unepedido;
            $scope.observaciones = datos.observacion;
        };

        $scope.buscarRegistrosCodigoIncompleto = function (param) {
            if (param.fechaini == undefined) {
                Swal({
                    title: "Error",
                    text: "Ingresa la fecha inicial",
                    type: "error",
                });
            } else if (param.fechafin == undefined) {
                Swal({
                    title: "Error",
                    text: "Ingresa la fecha Final",
                    type: "error",
                });
            } else if (param.fechaini > param.fechafin) {
                Swal({
                    title: "Error",
                    text: "La fecha inicial no puede ser mayor que la final",
                    type: "error",
                });
            } else {
                data = {'page': $scope.currentPage, 'size': $scope.pageSize, data: param}
                BuscarRegistrosCodigoIncompleto(data)
            }

        }

        $scope.csvRegistros = function () {
            $scope.csvPend = false;
            if (
                $scope.RegistrosCodigoIncompleto.fechaini >
                $scope.RegistrosCodigoIncompleto.fechafin
            ) {
                Swal({
                    type: 'error',
                    text: 'La fecha inicial no puede ser mayor a la final',
                    timer: 4000
                })
            } else {
                services
                    .expCsvRegistrosCodigoIncompleto(
                        $scope.RegistrosCodigoIncompleto,
                        $rootScope.galletainfo
                    )
                    .then(
                        function (datos) {
                            var data = datos.data[0];
                            var array = typeof data != "object" ? JSON.parse(data) : data;
                            var str = "";
                            var column = `ID_CODIGO_INCOMPLETO|| TAREA|| NUMERO_CONTACTO|| NOMBRE_CONTACTO|| UNEPEDIDO|| TASKTYPECATEGORY|| UNEMUNICIPIO|| UNEPRODUCTOS|| ENGINEER_ID|| ENGINEER_NAME|| MOBILE_PHONE|| STATUS_SOPORTE|| FECHA_SOLICITUD_FIREBASE|| FECHA_CREADO|| RESPUESTA_GESTION|| OBSERVACION|| LOGIN|| FECHA_RESPUESTA \r\n`;
                            str += column;
                            for (var i = 0; i < array.length; i++) {
                                var line = "";
                                for (var index in array[i]) {
                                    if (line != "") line += "||";
                                    line += array[i][index];
                                }

                                str += line + "\r\n";
                            }
                            var dateCsv = new Date();
                            var yearCsv = dateCsv.getFullYear();
                            var monthCsv =
                                dateCsv.getMonth() + 1 <= 9
                                    ? "0" + (dateCsv.getMonth() + 1)
                                    : dateCsv.getMonth() + 1;
                            var dayCsv =
                                dateCsv.getDate() <= 9
                                    ? "0" + dateCsv.getDate()
                                    : dateCsv.getDate();
                            var fullDateCsv = yearCsv + "-" + monthCsv + "-" + dayCsv;

                            var blob = new Blob([str]);
                            var elementToClick = window.document.createElement("a");
                            elementToClick.href = window.URL.createObjectURL(blob, {
                                type: "text/csv",
                            });
                            elementToClick.download =
                                "RegistrosCodigoIncompleto-" + fullDateCsv + ".csv";
                            elementToClick.click();
                        },
                        function errorCallback(response) {
                            $scope.errorDatos = "No hay datos.";
                            $scope.csvPend = false;
                        }
                    );
            }
        };
    }
);

app.controller("brutalForceCtrl", function ($scope, $rootScope, services) {
    $scope.formularioBrutal = {};
    $scope.pedidoexiste = false;
    $scope.pedidoNoexiste = false;

    $scope.validaTrans = function () {
        if (
            $scope.formularioBrutal.tipoTrans == "Reconfigurar" &&
            $scope.formularioBrutal.accion == "Gestión AAA"
        ) {
            $scope.vernumSape = true;
        } else {
            $scope.vernumSape = false;
        }
    };

    $scope.buscarObservaciones = function () {
        services.Verobservacionasesor($scope.formularioBrutal.pedido).then(
            function (data) {
                if (data.data.state != 1) {
                    Swal({
                        type: 'error',
                        text: data.data.msj,
                        timer: 4000
                    })
                } else {
                    $scope.observacion = data.data.data;
                    if ($scope.observacion.ObservacionAsesor == "") {
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
                alert("No hay información del pedido");
                return;
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
                        fetch(`http://10.100.66.254:8080/HCHV/Buscar/${pedido}`)
                            .then((data) => data.json())
                            .then((response) => {
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
                                return fetch(`http://10.100.66.254:8080/HCHV/Buscar/${pedido}`)
                                    .then((response) => {
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
                    alert("Por favor reportar con el Administrador de la página");
                    return;
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
        emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
        celRegex = /^3[\d]{9}$/;
        var tiempo = new Date();
        var hora = tiempo.getHours();
        var dia = tiempo.getDay();

        var pedido = $scope.formularioBrutal.pedido;

        var filtersEx = [
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
            var prioridadBFQuery = await fetch(
                `http://10.100.66.254:8080/HCHV/Buscar/${pedido}`
            );
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
                    alert("El Número celular del técnico debe ser formato de celular");
                    return;
                }
            } else {
                alert("El correo debe tener el formato de E-mail: correo@dominio.com");
                return;
            }
        } else {
            Swal(
                "El ingreso de solicitudes solo esta disponible de lunes a sábado entre las 7 a.m. y las 7 p.m."
            );
            return;
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
});

app.controller("usuariosCtrl", function ($scope, $rootScope, services) {
    $scope.listaUsuarios = {};
    $scope.Usuarios = {};
    $scope.crearuser = {};

    $scope.currentPage = 1;
    $scope.totalItems = 0;
    $scope.pageSize = 15;
    $scope.searchText = "";

    listadoUsuarios();

    function listadoUsuarios(data) {
        if (data === "" || data === undefined) {
            $scope.currentPage = 1;
            $scope.totalItems = 0;
            $scope.pageSize = 15;
            $scope.searchText = "";
            data = {page: $scope.currentPage, size: $scope.pageSize};
        }
        services.listadoUsuarios(data).then(
            function (data) {
                $scope.listaUsuarios = data.data.data;
                $scope.cantidad = data.data.data.length;
                $scope.counter = data.data.counter;

                $scope.totalItems = data.data.counter;
                $scope.startItem = ($scope.currentPage - 1) * $scope.pageSize + 1;
                $scope.endItem = $scope.currentPage * $scope.pageSize;
                if ($scope.endItem > data.data.counter) {
                    $scope.endItem = data.data.counter;
                }
            },
            function errorCallback(response) {
                $scope.errorDatos = concepto + " " + usuario + " no existe.";
            }
        );
    }

    $scope.pageChanged = function () {
        data = {page: $scope.currentPage, size: $scope.pageSize};
        listadoUsuarios(data);
    };
    $scope.pageSizeChanged = function () {
        console.log(data);
        data = {page: $scope.currentPage, size: $scope.pageSize};
        $scope.currentPage = 1;
        listadoUsuarios(data);
    };

    $scope.buscarUsuario = function (concepto, usuario) {
        data = {concepto: concepto, usuario: usuario};
        listadoUsuarios(data);
    };

    $scope.editarModal = function (datos) {
        $rootScope.datos = datos;
        $scope.idUsuario = datos.ID;
        $scope.UsuarioNom = datos.NOMBRE;
        $rootScope.TituloModal = "Editar Usuario con el ID:";
    };

    $scope.createUser = function (concepto, tecnico) {
        $scope.errorDatos = null;
        $scope.respuestaupdate = null;
        $scope.respuestadelete = null;
        services.creaUsuario($scope.crearuser).then(
            function (data) {
                $scope.respuestaupdate = "Usuario creado.";
                return data.data;
            },
            function errorCallback(response) {
                $scope.errorDatos = "Usuario no fue creado.";
            }
        );
    };

    $scope.editUser = function (datos) {
        $scope.errorDatos = null;
        $scope.respuestaupdate = null;
        $scope.respuestadelete = null;
        if (datos.PASSWORD == "") {
            alert("Por favor ingrese la contraseña");
            return;
        } else {
            services.editarUsuario(datos).then(
                function (data) {
                    $scope.respuestaupdate =
                        "Usuario " + datos.LOGIN + " actualizado exitosamente";
                    return data.data;
                },
                function errorCallback(response) {
                }
            );
        }
    };

    $scope.borrarUsuario = function (id) {
        $scope.idBorrar = id;
        $scope.Usuarios = {};
        $scope.errorDatos = null;
        $scope.respuestaupdate = null;
        $scope.respuestadelete = null;
        swal({
            title: "Aviso",
            text: "Esta función ha sido deshabilitada, para eliminar usuarios de la plataforma debe comunicarse con desarrollo.",
            type: "error",
            confirmButtonClass: "btn-danger",
            confirmButtonText: "Aceptar",
            closeOnConfirm: false,
        });
    };
});
app.controller("turnosCtrl", function ($scope, $rootScope, services) {
    $scope.errorDatos = null;
    $scope.turnos = [
        {
            id: "1",
            fecha: "",
            horaInicio: "",
            horaFin: "",
            usuariocrea: $rootScope.galletainfo.login,
        },
    ];
    $scope.cumple = {};
    $scope.editar = false;
    var tiempo = new Date().getTime();
    var date1 = new Date();
    var year = date1.getFullYear();
    var month =
        date1.getMonth() + 1 <= 9
            ? "0" + (date1.getMonth() + 1)
            : date1.getMonth() + 1;
    var day = date1.getDate() <= 9 ? "0" + date1.getDate() : date1.getDate();

    $scope.fechaIni = year + "-" + month + "-" + day;
    $scope.fechaFin = year + "-" + month + "-" + day;
    $scope.cumple.fechaIni = year + "-" + month + "-" + day;

    $scope.ingresoTurnos = function () {
        services.getguardarTurnos($scope.turnos).then(function (data) {
            $scope.turnos = [
                {
                    id: "1",
                    fecha: "",
                    horaInicio: "",
                    horaFin: "",
                    usuariocrea: $rootScope.galletainfo.login,
                },
            ];
            $scope.obtenerlistaTurnos();
        });
    };

    $scope.obtenercumplmientoTurnos = function () {
        services.getcumplmientoTurnos($scope.cumple).then(
            function (data) {
                $scope.cumplimientoTurno = data.data[0];
                $scope.nohaycumplimiento = null;
                return data.data;
            },
            function errorCallback(response) {
                $scope.nohaycumplimiento = "No hay datos!!";
            }
        );
    };

    $scope.obtenerlistaTurnos = function () {
        services.getlistaTurnos($scope.fechaIni, $scope.fechaFin).then(
            function (data) {
                $scope.historicoturnos = data.data[0];
                $scope.errorDatos = null;
                return data.data;
            },
            function errorCallback(response) {
                $scope.errorDatos = "No hay datos!!";
                $scope.historicoturnos = {};
            }
        );
    };

    $scope.desacargarAdherencia = function () {
        services
            .csvAdherenciaTurnos(
                $scope.fechaIni,
                $scope.fechaFin,
                $rootScope.galletainfo
            )
            .then(function (data) {
                if (data.data[0] !== undefined) {
                    window.location.href = "tmp/" + data.data[0];
                    $scope.csvPend = true;
                    $scope.counter = "Se exportaron: " + data.data[1] + " Registros";
                    return data.data;
                } else {
                    $scope.counter = "No hay datos para exportar";
                }
            });
    };

    $scope.borrarTurno = function (idturno) {
        services.borrarTurno(idturno).then(function (data) {
            $scope.obtenerlistaTurnos();
        });
    };

    $scope.usuariosTurnosSeguimiento = function () {
        services.getusuariosTurnos().then(function (data) {
            $scope.usuarios = data.data[0];
            return data.data;
        });
    };

    $scope.addNuevaNovedad = function (usuario) {
        var newItemNo = $scope.turnos.length + 1;

        $scope.turnos.push({
            id: +newItemNo,
            fecha: "",
            horaIni: "",
            horaFin: "",
            usuariocrea: $rootScope.galletainfo.login,
        });
    };

    $scope.updateStatus = function (data) {
        services.updateTurnos(data).then(function (data) {
            $scope.obtenerlistaTurnos();
        });
    };

    $scope.statuses = [
        {value: "Turno", novedades: "Turno"},
        {value: "Vacaciones", novedades: "Vacaciones"},
        {value: "Licencia", novedades: "Licencia"},
        {value: "Incapacidad", novedades: "Incapacidad"},
    ];

    $scope.removeNuevaNovedad = function () {
        var lastItem = $scope.turnos.length - 1;
        if (lastItem != 0) {
            $scope.turnos.splice(lastItem);
        }
    };

    $scope.usuariosTurnosSeguimiento();
    $scope.obtenerlistaTurnos();
    $scope.obtenercumplmientoTurnos();
});

app.controller("AlarmasCtrl", function ($scope, services) {
    $scope.crearAlarma = {};
    $scope.listaAlarmas = {};

    $scope.listadoAlarmas = function () {
        services.listadoAlarmas().then(function (data) {
            $scope.listaAlarmas = data.data;
            return data.data;
        });
    };

    $scope.crearAlarma = function (info) {
        services.creaAlarma(info).then(
            function (data) {
                $scope.respuestaupdate = "Alarma creado.";
                services.listadoAlarmas().then(function (data) {
                    $scope.listaAlarmas = data.data;

                    return data.data;
                });
            },
            function errorCallback(response) {
                $scope.errorDatos = "Alarma no fue creada.";
            }
        );
        $scope.listadoAlarmas();
    };

    $scope.procesos = function () {
        $scope.validaraccion = false;
        $scope.validarsubaccion = false;
        services.getProcesos().then(function (data) {
            $scope.listadoProcesos = data.data[0];
            $scope.listadoAcciones = {};
        });
    };

    $scope.editarModal = function (datos) {
        $scope.datosAlarmas = datos;
    };

    $scope.EditarDatosAlarma = function () {
        $scope.errorDatos = null;
        $scope.respuestaupdate = null;
        $scope.respuestadelete = null;

        services.editAlarma($scope.datosAlarmas).then(
            function (data) {
                $scope.respuestaupdate =
                    "Alarma " +
                    $scope.datosAlarmas.nombre_alarma +
                    " actualizado exitosamente";
                services.listadoAlarmas().then(function (data) {
                    $scope.listaAlarmas = data.data;
                    return data.data;
                });
            },
            function errorCallback(response) {
            }
        );
    };

    $scope.borrarAlarma = function (id) {
        $scope.idBorrar = id;
        $scope.errorDatos = null;
        $scope.respuestaupdate = null;
        $scope.respuestadelete = null;
        services.deleteAlarma($scope.idBorrar).then(
            function (data) {
                $scope.respuestadelete = "Alarma eliminada exitosamente";
                services.listadoAlarmas().then(function (data) {
                    $scope.listaAlarmas = data.data;

                    return data.data;
                });
            },
            function errorCallback(response) {
                $scope.errorDatos = "No se borro";
            }
        );
    };

    $scope.calcularAcciones = function (proceso) {
        $scope.listadoAcciones = {};
        $scope.validarsubaccion = false;
        if (proceso == "") {
            $scope.validaraccion = false;
            $scope.validarsubaccion = false;
        } else {
            services.getAcciones(proceso).then(function (data) {
                $scope.listadoAcciones = data.data[0];
                $scope.validaraccion = true;
                $scope.validarsubaccion = false;
            });
        }
    };

    $scope.calcularSubAcciones = function (proceso, accion) {
        $scope.listadoSubAcciones = {};
        $scope.validarsubaccion = true;
        services.getSubAcciones(proceso, accion).then(
            function (data) {
                $scope.listadoSubAcciones = data.data[0];
                $scope.validarsubaccion = true;
            },
            function errorCallback(response) {
                $scope.validarsubaccion = false;
            }
        );
    };

    $scope.procesos();
    $scope.listadoAlarmas();
});

app.controller(
    "GraficosContingeciaCtrl",
    function ($scope, $http, $rootScope, $route, services) {
        init();
        $scope.listado_gestionUser = {};

        function init() {
            consultaContingenciaDiario();
            consultaContingenciaAgente();
            contigenciaHoraAgente();
            contigenciaHoraAgenteApoyo();
            contigenciaHoraAgenteTiempoCompleto();
            contigenciaHoraAgenteMmss();
            contigenciaHoraAgenteEmtelco()
        }

        function consultaContingenciaDiario(data) {
            services.contigenciaDiario(data).then(function (data) {
                $scope.datosContingenciaDiario = data.data.data;
                $scope.labels = [];
                $scope.acepta20 = [];
                $scope.acepta21 = [];
                $scope.colors = [];
                $scope.series = ["Internet+Toip", "TV"];
                angular.forEach($scope.datosContingenciaDiario, function (value, key) {
                    if (value.Internet) {
                        $scope.acepta20.push(value.Internet);
                        $scope.colors.push("#a34242");
                    }
                    if (value.TV) {
                        $scope.acepta21.push(value.TV);
                        $scope.colors.push("#b4c250");
                    }
                    $scope.labels.push(value.Fecha);
                });

                $scope.data = [$scope.acepta20, $scope.acepta21];
            });
        }

        function consultaContingenciaAgente(data) {
            services.contigenciaAgente(data).then(function (data) {
                $scope.contingenciaAgente = data.data.data;
                $scope.labels1 = [];
                $scope.aceptaInternet = [];
                $scope.aceptaTv = [];
                $scope.colors1 = [];
                $scope.series1 = ["Internet+Toip", "TV"];
                angular.forEach($scope.contingenciaAgente, function (value, key) {
                    if (value.Internet) {
                        $scope.aceptaInternet.push(value.Internet);
                        $scope.colors1.push("#803690");
                    }
                    if (value.TV) {
                        $scope.aceptaTv.push(value.TV);
                        $scope.colors1.push("#DCDCDC");
                    }

                    $scope.labels1.push(value.agente);
                });
                $scope.data1 = [$scope.aceptaInternet, $scope.aceptaTv];
            });
        }

        function contigenciaHoraAgente() {
            data = {
                estado: $scope.estadoTabla,
                producto: $scope.productoTabla,
                fecha: $scope.fecha_gestion,
            };
            services.contigenciaHoraAgente(data).then(function (data) {
                $scope.robin = data.data.data;

                $scope.listado_plazas = data.data[0];
                $scope.listado_plazas_bogota = data.data[1];
                $scope.listado_conceptosas = data.data[2];
                $scope.listado_conceptosasn = angular.copy(data.data[2]);
                $scope.listado_conceptosasnNUEVO = angular.copy(data.data[5]);
                $scope.listado_conceptosasnINGRESO = angular.copy(data.data[6]);
                $scope.listado_conceptosasnTIPO = angular.copy(data.data[7]);
                $scope.listado_gestionUser = angular.copy(data.data[5]);
                $scope.listado_conceptosin = data.data[3];
                $scope.listado_conceptosfc = data.data[4];
                $scope.totales = 0;
                $scope.total06 = 0;
                $scope.total06Inter = 0;
                $scope.total07 = 0;
                $scope.total07Inter = 0;
                $scope.total08 = 0;
                $scope.total08Inter = 0;
                $scope.total09 = 0;
                $scope.total09Inter = 0;
                $scope.total10 = 0;
                $scope.total10Inter = 0;
                $scope.total11 = 0;
                $scope.total11Inter = 0;
                $scope.total12 = 0;
                $scope.total12Inter = 0;
                $scope.total13 = 0;
                $scope.total13Inter = 0;
                $scope.total14 = 0;
                $scope.total14Inter = 0;
                $scope.total15 = 0;
                $scope.total15Inter = 0;
                $scope.total16 = 0;
                $scope.total16Inter = 0;
                $scope.total17 = 0;
                $scope.total17Inter = 0;
                $scope.total18 = 0;
                $scope.total18Inter = 0;
                $scope.total19 = 0;
                $scope.total19Inter = 0;
                $scope.total20 = 0;
                $scope.total20Inter = 0;
                $scope.total21 = 0;
                $scope.total21Inter = 0;
                $scope.total22 = 0;
                $scope.total22Inter = 0;

                $scope.total = function (n, x) {
                    if (n == "" || n == undefined) {
                        n = 0;
                    } else if (x == "" || x == undefined) {
                        x = 0;
                    }
                    return parseInt(n) + parseInt(x);
                };

                angular.forEach($scope.robin, function (value, key) {
                    $scope.totales = parseInt($scope.totales) + parseInt(value.CANTIDAD);
                    if (value.producto == "TV") {
                        $scope.total06 = parseInt($scope.total06) + parseInt(value.am06);
                        $scope.total07 = parseInt($scope.total07) + parseInt(value.am07);
                        $scope.total08 = parseInt($scope.total08) + parseInt(value.am08);
                        $scope.total09 = parseInt($scope.total09) + parseInt(value.am09);
                        $scope.total10 = parseInt($scope.total10) + parseInt(value.am10);
                        $scope.total11 = parseInt($scope.total11) + parseInt(value.am11);
                        $scope.total12 = parseInt($scope.total12) + parseInt(value.am12);
                        $scope.total13 = parseInt($scope.total13) + parseInt(value.pm01);
                        $scope.total14 = parseInt($scope.total14) + parseInt(value.pm02);
                        $scope.total15 = parseInt($scope.total15) + parseInt(value.pm03);
                        $scope.total16 = parseInt($scope.total16) + parseInt(value.pm04);
                        $scope.total17 = parseInt($scope.total17) + parseInt(value.pm05);
                        $scope.total18 = parseInt($scope.total18) + parseInt(value.pm06);
                        $scope.total19 = parseInt($scope.total19) + parseInt(value.pm07);
                        $scope.total20 = parseInt($scope.total20) + parseInt(value.pm08);
                        $scope.total21 = parseInt($scope.total21) + parseInt(value.pm09);
                        $scope.total22 = parseInt($scope.total22) + parseInt(value.Masde09);
                    } else if (value.producto == "Internet+Toip") {
                        $scope.total06Inter =
                            parseInt($scope.total06Inter) + parseInt(value.am06);
                        $scope.total07Inter =
                            parseInt($scope.total07Inter) + parseInt(value.am07);
                        $scope.total08Inter =
                            parseInt($scope.total08Inter) + parseInt(value.am08);
                        $scope.total09Inter =
                            parseInt($scope.total09Inter) + parseInt(value.am09);
                        $scope.total10Inter =
                            parseInt($scope.total10Inter) + parseInt(value.am10);
                        $scope.total11Inter =
                            parseInt($scope.total11Inter) + parseInt(value.am11);
                        $scope.total12Inter =
                            parseInt($scope.total12Inter) + parseInt(value.am12);
                        $scope.total13Inter =
                            parseInt($scope.total13Inter) + parseInt(value.pm01);
                        $scope.total14Inter =
                            parseInt($scope.total14Inter) + parseInt(value.pm02);
                        $scope.total15Inter =
                            parseInt($scope.total15Inter) + parseInt(value.pm03);
                        $scope.total16Inter =
                            parseInt($scope.total16Inter) + parseInt(value.pm04);
                        $scope.total17Inter =
                            parseInt($scope.total17Inter) + parseInt(value.pm05);
                        $scope.total18Inter =
                            parseInt($scope.total18Inter) + parseInt(value.pm06);
                        $scope.total19Inter =
                            parseInt($scope.total19Inter) + parseInt(value.pm07);
                        $scope.total20Inter =
                            parseInt($scope.total20Inter) + parseInt(value.pm08);
                        $scope.total21Inter =
                            parseInt($scope.total21Inter) + parseInt(value.pm09);
                        $scope.total22Inter =
                            parseInt($scope.total22Inter) + parseInt(value.Masde09);
                    }
                });
            });
        }

        $scope.consultaTabla = function () {
            contigenciaHoraAgente();
        };

        function contigenciaHoraAgenteApoyo(data) {
            services.contigenciaHoraAgenteApoyo(data).then(function (data) {
                $scope.apoyo = data.data.data;
                $scope.listado_plazasA = data.data[0];
                $scope.listado_plazas_bogotaA = data.data[1];
                $scope.listado_conceptosasA = data.data[2];
                $scope.listado_conceptosasnA = angular.copy(data.data[2]);
                $scope.listado_conceptosasnNUEVOA = angular.copy(data.data[5]);
                $scope.listado_conceptosasnINGRESOA = angular.copy(data.data[6]);
                $scope.listado_conceptosasnTIPOA = angular.copy(data.data[7]);
                $scope.listado_gestionUserA = angular.copy(data.data[5]);
                $scope.listado_conceptosinA = data.data[3];
                $scope.listado_conceptosfcA = data.data[4];
                $scope.totalesA = 0;
                $scope.total06A = 0;
                $scope.total07A = 0;
                $scope.total08A = 0;
                $scope.total09A = 0;
                $scope.total10A = 0;
                $scope.total11A = 0;
                $scope.total12A = 0;
                $scope.total13A = 0;
                $scope.total14A = 0;
                $scope.total15A = 0;
                $scope.total16A = 0;
                $scope.total17A = 0;
                $scope.total18A = 0;
                $scope.total19A = 0;
                $scope.total20A = 0;
                $scope.total21A = 0;
                $scope.total22A = 0;

                angular.forEach($scope.apoyo, function (value, key) {
                    $scope.totalesA =
                        parseInt($scope.totalesA) + parseInt(value.CANTIDAD);
                    $scope.total06A = parseInt($scope.total06A) + parseInt(value.am06);
                    $scope.total07A = parseInt($scope.total07A) + parseInt(value.am07);
                    $scope.total08A = parseInt($scope.total08A) + parseInt(value.am08);
                    $scope.total09A = parseInt($scope.total09A) + parseInt(value.am09);
                    $scope.total10A = parseInt($scope.total10A) + parseInt(value.am10);
                    $scope.total11A = parseInt($scope.total11A) + parseInt(value.am11);
                    $scope.total12A = parseInt($scope.total12A) + parseInt(value.am12);
                    $scope.total13A = parseInt($scope.total13A) + parseInt(value.pm01);
                    $scope.total14A = parseInt($scope.total14A) + parseInt(value.pm02);
                    $scope.total15A = parseInt($scope.total15A) + parseInt(value.pm03);
                    $scope.total16A = parseInt($scope.total16A) + parseInt(value.pm04);
                    $scope.total17A = parseInt($scope.total17A) + parseInt(value.pm05);
                    $scope.total18A = parseInt($scope.total18A) + parseInt(value.pm06);
                    $scope.total19A = parseInt($scope.total19A) + parseInt(value.pm07);
                    $scope.total20A = parseInt($scope.total20A) + parseInt(value.pm08);
                    $scope.total21A = parseInt($scope.total21A) + parseInt(value.pm09);
                    $scope.total22A = parseInt($scope.total22A) + parseInt(value.Masde09);
                });
            });
        }

        $scope.consultaTablaApoyo = function (fechaApoyo, estado, producto) {
            data = {fecha: fechaApoyo, estado: estado, producto: producto};
            contigenciaHoraAgenteApoyo(data);
        };

        function contigenciaHoraAgenteTiempoCompleto(data) {
            services.contigenciaHoraAgenteTiempoCompleto(data).then(function (data) {
                $scope.tiempoCompleto = data.data.data;
                $scope.listado_plazasT = data.data[0];
                $scope.listado_plazas_bogotaT = data.data[1];
                $scope.listado_conceptosasT = data.data[2];
                $scope.listado_conceptosasnT = angular.copy(data.data[2]);
                $scope.listado_conceptosasnNUEVOT = angular.copy(data.data[5]);
                $scope.listado_conceptosasnINGRESOT = angular.copy(data.data[6]);
                $scope.listado_conceptosasnTIPOT = angular.copy(data.data[7]);
                $scope.listado_gestionUserT = angular.copy(data.data[5]);
                $scope.listado_conceptosinT = data.data[3];
                $scope.listado_conceptosfcT = data.data[4];
                $scope.totalesT = 0;
                $scope.total06T = 0;
                $scope.total07T = 0;
                $scope.total08T = 0;
                $scope.total09T = 0;
                $scope.total10T = 0;
                $scope.total11T = 0;
                $scope.total12T = 0;
                $scope.total13T = 0;
                $scope.total14T = 0;
                $scope.total15T = 0;
                $scope.total16T = 0;
                $scope.total17T = 0;
                $scope.total18T = 0;
                $scope.total19T = 0;
                $scope.total20T = 0;
                $scope.total21T = 0;
                $scope.total22T = 0;

                angular.forEach($scope.tiempoCompleto, function (value, key) {
                    $scope.totalesT =
                        parseInt($scope.totalesT) + parseInt(value.CANTIDAD);
                    $scope.total06T = parseInt($scope.total06T) + parseInt(value.am06);
                    $scope.total07T = parseInt($scope.total07T) + parseInt(value.am07);
                    $scope.total08T = parseInt($scope.total08T) + parseInt(value.am08);
                    $scope.total09T = parseInt($scope.total09T) + parseInt(value.am09);
                    $scope.total10T = parseInt($scope.total10T) + parseInt(value.am10);
                    $scope.total11T = parseInt($scope.total11T) + parseInt(value.am11);
                    $scope.total12T = parseInt($scope.total12T) + parseInt(value.am12);
                    $scope.total13T = parseInt($scope.total13T) + parseInt(value.pm01);
                    $scope.total14T = parseInt($scope.total14T) + parseInt(value.pm02);
                    $scope.total15T = parseInt($scope.total15T) + parseInt(value.pm03);
                    $scope.total16T = parseInt($scope.total16T) + parseInt(value.pm04);
                    $scope.total17T = parseInt($scope.total17T) + parseInt(value.pm05);
                    $scope.total18T = parseInt($scope.total18T) + parseInt(value.pm06);
                    $scope.total19T = parseInt($scope.total19T) + parseInt(value.pm07);
                    $scope.total20T = parseInt($scope.total20T) + parseInt(value.pm08);
                    $scope.total21T = parseInt($scope.total21T) + parseInt(value.pm09);
                    $scope.total22T = parseInt($scope.total22T) + parseInt(value.Masde09);
                });
            });
        }

        $scope.consultaTablaTiempo = function (fechaTiempo, estado, producto) {
            data = {fecha: fechaTiempo, estado: estado, producto: producto};
            contigenciaHoraAgenteTiempoCompleto(data);
        };

        function contigenciaHoraAgenteMmss(data) {
            services.contigenciaHoraAgenteMmss(data).then(function (data) {
                $scope.mmss = data.data.data;
                $scope.listado_plazasM = data.data[0];
                $scope.listado_plazas_bogotaM = data.data[1];
                $scope.listado_conceptosasM = data.data[2];
                $scope.listado_conceptosasnM = angular.copy(data.data[2]);
                $scope.listado_conceptosasnNUEVOM = angular.copy(data.data[5]);
                $scope.listado_conceptosasnINGRESOM = angular.copy(data.data[6]);
                $scope.listado_conceptosasnTIPOM = angular.copy(data.data[7]);
                $scope.listado_gestionUserM = angular.copy(data.data[5]);
                $scope.listado_conceptosinM = data.data[3];
                $scope.listado_conceptosfcM = data.data[4];
                $scope.totalesM = 0;
                $scope.total06M = 0;
                $scope.total07M = 0;
                $scope.total08M = 0;
                $scope.total09M = 0;
                $scope.total10M = 0;
                $scope.total11M = 0;
                $scope.total12M = 0;
                $scope.total13M = 0;
                $scope.total14M = 0;
                $scope.total15M = 0;
                $scope.total16M = 0;
                $scope.total17M = 0;
                $scope.total18M = 0;
                $scope.total19M = 0;
                $scope.total20M = 0;
                $scope.total21M = 0;
                $scope.total22M = 0;

                angular.forEach($scope.mmss, function (value, key) {
                    $scope.totalesM =
                        parseInt($scope.totalesM) + parseInt(value.CANTIDAD);
                    $scope.total06M = parseInt($scope.total06M) + parseInt(value.am06);
                    $scope.total07M = parseInt($scope.total07M) + parseInt(value.am07);
                    $scope.total08M = parseInt($scope.total08M) + parseInt(value.am08);
                    $scope.total09M = parseInt($scope.total09M) + parseInt(value.am09);
                    $scope.total10M = parseInt($scope.total10M) + parseInt(value.am10);
                    $scope.total11M = parseInt($scope.total11M) + parseInt(value.am11);
                    $scope.total12M = parseInt($scope.total12M) + parseInt(value.am12);
                    $scope.total13M = parseInt($scope.total13M) + parseInt(value.pm01);
                    $scope.total14M = parseInt($scope.total14M) + parseInt(value.pm02);
                    $scope.total15M = parseInt($scope.total15M) + parseInt(value.pm03);
                    $scope.total16M = parseInt($scope.total16M) + parseInt(value.pm04);
                    $scope.total17M = parseInt($scope.total17M) + parseInt(value.pm05);
                    $scope.total18M = parseInt($scope.total18M) + parseInt(value.pm06);
                    $scope.total19M = parseInt($scope.total19M) + parseInt(value.pm07);
                    $scope.total20M = parseInt($scope.total20M) + parseInt(value.pm08);
                    $scope.total21M = parseInt($scope.total21M) + parseInt(value.pm09);
                    $scope.total22M = parseInt($scope.total22M) + parseInt(value.Masde09);
                });
            });
        }

        function contigenciaHoraAgenteEmtelco() {
            data = {'estado': $scope.estadoTabla, 'producto': $scope.productoTabla, 'fecha': $scope.fecha_gestion}
            services.contigenciaHoraAgenteEmtelco(data).then(function (data) {
                $scope.emtelco = data.data.data;
                $scope.totalesEm = 0;
                $scope.total06Em = 0;
                $scope.total07Em = 0;
                $scope.total08Em = 0;
                $scope.total09Em = 0;
                $scope.total10Em = 0;
                $scope.total11Em = 0;
                $scope.total12Em = 0;
                $scope.total13Em = 0;
                $scope.total14Em = 0;
                $scope.total15Em = 0;
                $scope.total16Em = 0;
                $scope.total17Em = 0;
                $scope.total18Em = 0;
                $scope.total19Em = 0;
                $scope.total20Em = 0;
                $scope.total21Em = 0;
                $scope.total22Em = 0;

                angular.forEach($scope.emtelco, function (value, key) {

                    $scope.totalesEm = parseInt($scope.totalesEm) + parseInt(value.CANTIDAD);
                    $scope.total06Em = parseInt($scope.total06Em) + parseInt(value.am06);
                    $scope.total07Em = parseInt($scope.total07Em) + parseInt(value.am07);
                    $scope.total08Em = parseInt($scope.total08Em) + parseInt(value.am08);
                    $scope.total09Em = parseInt($scope.total09Em) + parseInt(value.am09);
                    $scope.total10Em = parseInt($scope.total10Em) + parseInt(value.am10);
                    $scope.total11Em = parseInt($scope.total11Em) + parseInt(value.am11);
                    $scope.total12Em = parseInt($scope.total12Em) + parseInt(value.am12);
                    $scope.total13Em = parseInt($scope.total13Em) + parseInt(value.pm01);
                    $scope.total14Em = parseInt($scope.total14Em) + parseInt(value.pm02);
                    $scope.total15Em = parseInt($scope.total15Em) + parseInt(value.pm03);
                    $scope.total16Em = parseInt($scope.total16Em) + parseInt(value.pm04);
                    $scope.total17Em = parseInt($scope.total17Em) + parseInt(value.pm05);
                    $scope.total18Em = parseInt($scope.total18Em) + parseInt(value.pm06);
                    $scope.total19Em = parseInt($scope.total19Em) + parseInt(value.pm07);
                    $scope.total20Em = parseInt($scope.total20Em) + parseInt(value.pm08);
                    $scope.total21Em = parseInt($scope.total21Em) + parseInt(value.pm09);
                    $scope.total22Em = parseInt($scope.total22Em) + parseInt(value.Masde09);

                })
            })
        }

        $scope.mmssConsulta = function (fechamms, estado, producto) {
            data = {fecha: fechamms, estado: estado, producto: producto};
            contigenciaHoraAgenteMmss(data);
        };

        $scope.consultaproducto = function () {
            data = {estado: $scope.estadoDia, producto: $scope.productoDia};
            consultaContingenciaAgente(data);
        };

        $scope.cunsultaproducto20 = function () {
            console.log($scope.estado20, $scope.producto20);
            let data = {estado: $scope.estado20, producto: $scope.producto20};
            consultaContingenciaDiario(data);
        };
    }
);

app.controller(
    "gestionVentasInstaleTiendasCtrl",
    function ($scope, $http, $rootScope, $route, services) {
        $scope.ventaIstale = {};
        init();

        function init() {
            data();
            dataVentaTerminado();
        }

        function data() {
            services.datosVentas().then(function (data) {
                $scope.dataVentas = data.data.data;
            });
        }

        $scope.currentPage = 1;
        $scope.totalItems = 0;
        $scope.pageSize = 15;
        $scope.searchText = "";

        function dataVentaTerminado(data) {
            if (data === "" || data === undefined) {
                $scope.currentPage = 1;
                $scope.totalItems = 0;
                $scope.pageSize = 15;
                $scope.searchText = "";
                data = {page: $scope.currentPage, size: $scope.pageSize};
            }
            services.datosVentasInstaleTerminado(data).then(function (data) {
                $scope.dataVentasTerminado = data.data.data;

                $scope.activity = [];
                $scope.totalItems = data.data.totalCount;
                $scope.startItem = ($scope.currentPage - 1) * $scope.pageSize + 1;
                $scope.endItem = $scope.currentPage * $scope.pageSize;
                if ($scope.endItem > data.data.totalCount) {
                    $scope.endItem = data.data.totalCount;
                }
            });
        }

        $scope.pageChanged = function () {
            data = {page: $scope.currentPage, size: $scope.pageSize};
            console.log(data);
            dataVentaTerminado(data);
        };
        $scope.pageSizeChanged = function () {
            console.log(data);
            data = {page: $scope.currentPage, size: $scope.pageSize};
            $scope.currentPage = 1;
            dataVentaTerminado(data);
        };

        $scope.marcarEngestion = function (id) {
            data = {id: id, login_gestion: $rootScope.galletainfo.LOGIN};
            services.marcarEnGestionVentaInstale(data).then(function (data) {
                if (data.data.state == 1) {
                    Swal({
                        type: "success",
                        title: "Bien",
                        text: data.data.msj,
                        timer: 4000,
                    }).then(function () {
                        $route.reload();
                    });
                } else {
                    Swal({
                        type: "info",
                        title: "Oops...",
                        text: data.data.msj,
                        timer: 4000,
                    }).then(function () {
                        $route.reload();
                    });
                }
            });
        };

        $scope.recargaVentas = function () {
            init();
        };

        $scope.detalleVentaPedido = (pedido) => {
            if (pedido == "" || pedido == undefined) {
                Swal({
                    type: "error",
                    title: "Oops...",
                    text: "Debes ingresar un pedido",
                    timer: 4000,
                });
            } else {
                data = {pedido: pedido};
                services.detallePedidoVenta(data).then((data) => {
                    if (data.data.state == 1) {
                        $scope.detallePedidoVenta = data.data.data;
                        $("#detallePedidoVentaInstale").modal("show");
                    } else {
                        Swal({
                            type: "error",
                            title: "Oops...",
                            text: data.data.msj,
                            timer: 4000,
                        });
                    }
                });
            }
        };

        $scope.registrosVentaInstale = () => {
            if ($scope.ventaIstale.fechaini > $scope.ventaIstale.fechaFin) {
                Swal({
                    type: "error",
                    title: "Oops...",
                    text: "La fecha final no puede ser menor a la inicial",
                    timer: 4000,
                });
            } else if (
                $scope.ventaIstale.fechaini == "" ||
                $scope.ventaIstale.fechaini == undefined
            ) {
                Swal({
                    type: "error",
                    title: "Oops...",
                    text: "La fecha inicial es requerida",
                    timer: 4000,
                });
            } else {
                services.detalleVentaRagoFecha($scope.ventaIstale).then((data) => {
                    console.log(console.log(data));
                    if (data.data.state == 1) {
                        $scope.detallePedidoVenta = data.data.data;
                        $("#detallePedidoVentaInstale").modal("show");
                    } else {
                        Swal({
                            type: "error",
                            title: "Oops...",
                            text: data.data.msj,
                            timer: 4000,
                        });
                    }
                });
            }
        };

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

        $scope.csvVentaInstale = function () {
            console.log($scope.ventaIstale);
            var fechaini = new Date($scope.ventaIstale.fechaini);
            var fechafin = new Date($scope.ventaIstale.fechafin);
            var diffMs = fechafin - fechaini;
            var diffDays = Math.round(diffMs / 86400000);

            if ($scope.ventaIstale.fechaini > $scope.ventaIstale.fechaFin) {
                Swal({
                    type: "error",
                    title: "Oops...",
                    text: "La fecha final no puede ser menor a la inicial",
                    timer: 4000,
                });
            } else if (
                $scope.ventaIstale.fechaini == "" ||
                $scope.ventaIstale.fechaini == undefined
            ) {
                Swal({
                    type: "error",
                    title: "Oops...",
                    text: "La fecha inicial es requerida",
                    timer: 4000,
                });
            } else {
                services.csvVentaInstale($scope.ventaIstale).then(
                    function (datos) {
                        console.log(datos);
                        var data = datos.data.data;
                        var array = typeof data != "object" ? JSON.parse(data) : data;
                        var str = "";
                        var column = `pedido|| documento_cliente|| numero_contacto_cliente|| login_solicitud|| login_gestion|| regional|| tipificacion|| obs_tipificacion|| observacion_solicitud|| observacion_gestion|| jornada_atencion|| fecha_atencion||fecha_ingreso ||fecha_gestion|| documento_tecnico|| nombre_tecnico|| categoria  \r\n`;
                        str += column;
                        for (var i = 0; i < array.length; i++) {
                            var line = "";
                            for (var index in array[i]) {
                                if (line != "") line += "||";
                                line += array[i][index];
                            }

                            str += line + "\r\n";
                        }
                        var dateCsv = new Date();
                        var yearCsv = dateCsv.getFullYear();
                        var monthCsv =
                            dateCsv.getMonth() + 1 <= 9
                                ? "0" + (dateCsv.getMonth() + 1)
                                : dateCsv.getMonth() + 1;
                        var dayCsv =
                            dateCsv.getDate() <= 9
                                ? "0" + dateCsv.getDate()
                                : dateCsv.getDate();
                        var fullDateCsv = yearCsv + "-" + monthCsv + "-" + dayCsv;

                        var blob = new Blob([str]);
                        var elementToClick = window.document.createElement("a");
                        elementToClick.href = window.URL.createObjectURL(blob, {
                            type: "text/csv",
                        });
                        elementToClick.download = "csvVentaInstale-" + fullDateCsv + ".csv";
                        elementToClick.click();
                    },

                    function errorCallback(response) {
                        $scope.errorDatos = "No hay datos.";
                        $scope.csvPend = false;
                    }
                );
            }
        };

        $scope.observacionParaVenta = () => {
            $("#observacionParaVentaModal").modal("show");
        };

        $scope.guardaObservacionVentaInstale = (data) => {
            if (data == undefined) {
                Swal({
                    type: "error",
                    title: "Oops...",
                    text: "Dedes ingresar la observacion",
                    timer: 4000,
                });
            } else {
                data = {observacion: data, usuario: $rootScope.galletainfo.LOGIN};
                services.guardaObservacionParaVentaInstale(data).then(function (data) {
                    console.log(data.state);
                    if (data.data.state != 1) {
                        Swal({
                            type: "error",
                            title: "Oops...",
                            text: data.data.msj,
                            timer: 4000,
                        });
                    } else {
                        setTimeout(() => {
                            $("#observacionParaVentaModal").modal("hide");
                        }, 500);
                        Swal({
                            type: "success",
                            title: "Bien",
                            text: data.data.msj,
                            timer: 4000,
                        }).then(function () {
                            $route.reload();
                        });
                    }
                });
            }
        };

        $scope.verObservaciones = () => {
            services.observacionDetalleVentaModal().then(function (data) {
                if (data.data.state != 1) {
                    Swal({
                        type: "error",
                        title: "Oops...",
                        text: data.data.msj,
                        timer: 4000,
                    });
                } else {
                    $scope.datosVentaInstale = data.data.data;
                    $("#observacionDetalleVentaModal").modal("show");
                }
            });
        };

        $scope.EliminaObservacion = (data) => {
            services.eliminaObservacion(data).then(function (data) {
                if (data.data.state != 1) {
                    Swal({
                        type: "error",
                        title: "Oops...",
                        text: data.data.msj,
                        timer: 4000,
                    });
                } else {
                    setTimeout(() => {
                        $("#observacionDetalleVentaModal").modal("hide");
                    }, 500);

                    Swal({
                        type: "success",
                        title: "Bien",
                        text: data.data.msj,
                        timer: 3000,
                    }).then(function () {
                        $route.reload();
                    });
                }
            });
        };

        $scope.consolidadoZona = () => {
            services.consolidadoZona().then(function (data) {
                if (data.data.state == 1) {
                    $scope.apr = 0;
                    $scope.rech = 0;
                    $scope.pend = 0;
                    $scope.consolidadosZona = data.data.data;
                    angular.forEach($scope.consolidadosZona, function (value, key) {
                        console.log(value.aprobada);
                        if (value.aprobada) {
                            $scope.apr = parseInt($scope.apr) + parseInt(value.aprobada);
                        }
                        if (value.rechazada) {
                            $scope.rech = parseInt($scope.rech) + parseInt(value.rechazada);
                        }
                        if (value.pendiente) {
                            $scope.pend = parseInt($scope.pend) + parseInt(value.pendiente);
                        }
                    });
                    $("#consolidadoZona").modal("show");
                } else {
                    Swal({
                        type: "error",
                        title: "Oops...",
                        text: data.data.msj,
                        timer: 4000,
                    });
                }
            });
        };

        $scope.abreModal = function (data) {
            if (data.en_gestion != "1") {
                Swal({
                    type: "error",
                    title: "Oops...",
                    text: "Debes Marcar el pedido",
                    timer: 4000,
                });
            } else if (data.tipificacion == "" || data.tipificacion == undefined) {
                Swal({
                    type: "error",
                    title: "Oops...",
                    text: "Debes Seleccionar la tipificacion",
                    timer: 4000,
                });
            } else if (
                data.obs_tipificacion == "" ||
                data.obs_tipificacion == undefined
            ) {
                Swal({
                    type: "error",
                    title: "Oops...",
                    text: "Debes Seleccionar un detalle de la tipificacion",
                    timer: 4000,
                });
            } else if (data.tipificacion == "Ok" && data.obs_tipificacion != "Ok") {
                Swal({
                    type: "error",
                    title: "Oops...",
                    text: "Si la tipificacion es Ok el detalle debe ser Ok",
                    timer: 4000,
                });
            } else if (
                data.tipificacion == "Rechazada" &&
                data.obs_tipificacion == "Ok"
            ) {
                Swal({
                    type: "error",
                    title: "Oops...",
                    text: "Si la tipificacion es Rechazada el detalle no debe ser Ok",
                    timer: 4000,
                });
            } else {
                data = {
                    tipificacion: data.tipificacion,
                    obs_tipificacion: data.obs_tipificacion,
                    id: data.id,
                    login_gestion: $rootScope.galletainfo.LOGIN,
                };
                $("#modalVentaInstale").modal("show");

                $scope.guardaSolicitud = function (obs) {
                    if (obs == "" || obs == undefined) {
                        Swal({
                            type: "error",
                            title: "Oops...",
                            text: "Recuerda documentar observaciones",
                            timer: 4000,
                        });
                    } else {
                        data.observacion_seguimiento = obs.observacion_gestion;
                        services.guardaVentaInstale(data).then(function (data) {
                            console.log(data);
                            if (data.data.state == 1) {
                                setTimeout(() => {
                                    $("#modalVentaInstale").modal("hide");
                                }, 500);

                                Swal({
                                    type: "success",
                                    title: "Bien",
                                    text: data.data.msj,
                                    timer: 3000,
                                }).then(function () {
                                    $route.reload();
                                });
                            } else {
                                Swal({
                                    type: "error",
                                    title: "Oops...",
                                    text: data.data.msj,
                                    timer: 4000,
                                });
                            }
                        });
                    }
                };
            }
        };
    }
);

app.directive("cookie", function ($rootScope, $cookies) {
    return {
        link: function ($scope, el, attr, ctrl) {
            if ($cookies.get("usuarioseguimiento") !== undefined) {
                $scope.galletainfo = JSON.parse($cookies.get("usuarioseguimiento"));
                $rootScope.permiso = true;
            }
        },

        templateUrl: "partial/navbar.html",
    };
});

app.directive("popover", function () {
    return function (scope, elem) {
        elem.popover();
    };
});

app.directive("tooltip", function () {
    return function (scope, elem) {
        elem.tooltip();
    };
});

app.config([
    "$compileProvider",
    function ($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|sip):/);
    },
]);

app.config([
    "$httpProvider",
    function ($httpProvider) {
        $httpProvider.interceptors.push("LoadingInterceptor");
    },
]);

app.config([
    "$routeProvider",
    "$locationProvider",
    function ($routeProvider, $locationProvider) {
        $routeProvider
            .when("/", {
                title: "Login",
                templateUrl: "partial/login.html",
                controller: "loginCtrl",
            })

            .when("/actividades", {
                title: "Documentación de Pedidos",
                templateUrl: "partial/actividades.html",
                controller: "actividadesCtrl",
                authorize: true,
            })

            .when("/registros", {
                title: "Registros",
                templateUrl: "partial/registros.html",
                controller: "registrosCtrl",
                authorize: true,
            })

            .when("/registrossoportegpon", {
                title: "Registros Soporte GPON",
                templateUrl: "partial/registrossoportegpon.html",
                controller: "registrossoportegponCtrl",
                authorize: true,
            })

            .when("/registroscodigoincompleto", {
                title: "Registros Codigo incompleto",
                templateUrl: "partial/registroscodigoincompleto.html",
                controller: "registroscodigoincompletoCtrl",
                authorize: true,
            })

            .when("/usuarios", {
                title: "Usuarios",
                templateUrl: "partial/usuarios.html",
                controller: "usuariosCtrl",
                authorize: true,
            })

            .when("/tecnicos", {
                title: "Tecnicos",
                templateUrl: "partial/tecnicos.html",
                controller: "tecnicosCtrl",
                authorize: true,
            })

            .when("/listadoAlarmas", {
                title: "Alarmas",
                templateUrl: "partial/listadoAlarmas.html",
                controller: "AlarmasCtrl",
                authorize: true,
            })

            .when("/mesaoffline/mesaoffline", {
                title: "Mesa Offline",
                templateUrl: "partial/mesaoffline/mesaoffline.html",
                controller: "mesaofflineCtrl",
                authorize: true,
            })

            .when("/mesaoffline/registrosOffline", {
                title: "Registros Offline",
                templateUrl: "partial/mesaoffline/registrosOffline.html",
                controller: "registrosOfflineCtrl",
                authorize: true,
            })

            .when("/brutalForce", {
                title: "Brutal Force",
                templateUrl: "partial/brutalForce.html",
                controller: "brutalForceCtrl",
                authorize: true,
            })

            .when("/contingencias", {
                title: "Contingencias aprovisionamiento",
                templateUrl: "partial/contingencias.html",
                controller: "contingenciasCtrl",
                authorize: true,
            })
            .when("/nivelacion", {
                title: "Gestión Nivelación",
                templateUrl: "partial/nivelacion.html",
                controller: "nivelacionCtrl",
                authorize: true,
            })

            .when("/GestionNivelacion", {
                title: "Gestión Nivelación",
                templateUrl: "partial/GestionNivelacion.html",
                controller: "GestionNivelacionCtrl",
                authorize: true,
            })

            .when("/Gestioncontingencias", {
                title: "Gestión Contingencias",
                templateUrl: "partial/Gestioncontingencias.html",
                controller: "GestioncontingenciasCtrl",
                authorize: true,
            })

            .when("/gestionsoportegpon", {
                title: "Gestión Soporte Gpon",
                templateUrl: "partial/Gestionsoportegpon.html",
                controller: "GestionsoportegponCtrl",
                authorize: true,
            })

            .when("/gestioncodigoincompleto", {
                title: "Registros Código Incompleto",
                templateUrl: "partial/Gestioncodigoincompleto.html",
                controller: "GestioncodigoincompletoCtrl",
                authorize: true,
            })

            .when("/premisasInfraestructuras", {
                title: "Premisas Infraestructuras",
                templateUrl: "partial/premisasInfraestructuras.html",
                controller: "premisasInfraestructurasCtrl",
                authorize: true,
            })

            .when("/novedadesVisita", {
                title: "Novedades Visita",
                templateUrl: "partial/novedadesVisita.html",
                controller: "novedadesVisitaCtrl",
                authorize: true,
            })

            .when("/contrasenaClick", {
                title: "Contraseñas ClickSoftware",
                templateUrl: "partial/contrasenaClick.html",
                controller: "contrasenasClickCtrl",
                authorize: true,
            })

            .when("/turnos", {
                title: "Gestión turnos",
                templateUrl: "partial/turnos.html",
                controller: "turnosCtrl",
                authorize: true,
            })

            .when("/quejasGo", {
                title: "Quejas Gestión Operativa",
                templateUrl: "partial/quejasGo.html",
                controller: "quejasGoCtrl",
                authorize: true,
            })


            .when("/gestion-quejasGo", {
                title: "Gestión QuejasGo",
                templateUrl: "partial/gestionQuejasGo.html",
                controller: "quejasGoCtrl2",
                authorize: true,
            })

            .when("/consultaSara", {
                title: "Consulta SARA",
                templateUrl: "partial/consultaSara.html",
                controller: "saraCtrl",
                authorize: true,
            })

            .when("/KPI-Contingencia", {
                title: "KPI Contingecia",
                templateUrl: "partial/graficos-contingecia.html",
                controller: "GraficosContingeciaCtrl",
                authorize: true,
            })

            .when("/gestion-ventas-instaleTiendas", {
                title: "Gestion Ventas Instale",
                templateUrl: "partial/ventasInstale/VentasInstaleTiendas.html",
                controller: "gestionVentasInstaleTiendasCtrl",
                authorize: true,
            })

            .otherwise({
                redirectTo: "/",
            });

        $locationProvider
            .html5Mode({
                enabled: false,
                requireBase: true,
            })
            .hashPrefix(["!"]);
    },
]);

app.run(function ($rootScope, services, i18nService) {
    i18nService.setCurrentLang("es");
    $rootScope.fechaProceso = function () {
        var tiempo = new Date().getTime();
        var date1 = new Date();
        var year = date1.getFullYear();
        var month =
            date1.getMonth() + 1 <= 9
                ? "0" + (date1.getMonth() + 1)
                : date1.getMonth() + 1;
        var day = date1.getDate() <= 9 ? "0" + date1.getDate() : date1.getDate();
        var hour =
            date1.getHours() <= 9 ? "0" + date1.getHours() : date1.getHours();
        var minute =
            date1.getMinutes() <= 9 ? "0" + date1.getMinutes() : date1.getMinutes();
        var seconds =
            date1.getSeconds() <= 9 ? "0" + date1.getSeconds() : date1.getSeconds();

        tiempo =
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
            seconds;
        return tiempo;
    };
});

app.run([
    "$location",
    "$rootScope",
    "$route",
    "$cookies",
    "services",
    function ($location, $rootScope, $route, $cookies, services) {
        $rootScope.$on("$routeChangeStart", function (evt, to, from) {
            if ($cookies.get("usuarioseguimiento") == undefined) {
                $location.path("/");
            }
        });

        $rootScope.$on("$routeChangeSuccess", function (event, current, previous) {
            $rootScope.title = current.$$route.title;
            $rootScope.tituloPagina =
                "Seguimiento a pedidos - " + current.$$route.title;
        });

        $rootScope.$on("$routeChangeError", function (evt, to, from, error) {
        });

        $rootScope.executeCopy = function executeCopy(text) {
            var input = document.createElement("textarea");
            document.body.appendChild(input);
            input.value = text;
            input.select();
            document.execCommand("Copy");
            input.remove();
        };
    },
]);

app.run([
    "$rootScope",
    "services",
    function ($rootScope, services) {
        $rootScope.ciudades = function () {
            services.getCiudades().then(function (data) {
                if (data.data.state != 1) {
                    Swal({
                        type: 'error',
                        text: data.data.msj,
                        timer: 4000
                    })
                } else {
                    $rootScope.listadoCiudades = data.data.data[1];
                    $rootScope.listadoDepartamentos = data.data.data[0];
                }

            });
        };

        $rootScope.regionesTip = function () {
            services.getRegionesTip().then(function (data) {
                if (data.data.state != 1) {
                    Swal({
                        type: 'error',
                        text: data.data.msj,
                        timer: 4000
                    })
                } else {
                    $rootScope.listadoRegiones = data.data.data;
                }

            });
        };

        $rootScope.Listapreguntas = [
            {
                ID: 1,
                PREGUNTA: "1. ¿Estuvo con el técnico en el momento de la Instalación?",
            },
            {
                ID: 2,
                PREGUNTA:
                    "2. ¿Qué tan satisfecho te encuentras con la  Instalación Realizada?",
            },
            {
                ID: 3,
                PREGUNTA:
                    "3. ¿Qué tan fácil te pareció el proceso de Instalación de tu servicio o servicios?",
            },
            {
                ID: 4,
                PREGUNTA:
                    "4.  ¿Según tu experiencia en el proceso de instalación, recomendarías a UNE a otra persona?",
            },
            {
                ID: 5,
                PREGUNTA:
                    "5. ¿Como calificarías, el cumplimiento de la cita pactada para realizar tu instalación?",
            },
            {
                ID: 6,
                PREGUNTA:
                    "6. ¿Consideras que la oferta que se te ofreció en la venta, fué la misma que se te instaló?",
            },
            {
                ID: 7,
                PREGUNTA:
                    "7. ¿Después de realizada la instalación se te ha presentado algúna falla o inconveniente con el servicio de UNE?",
            },
            {
                ID: 8,
                PREGUNTA:
                    "8. ¿El tecnico te dio información sobre el funcionamiento de los servicios instalados?",
            },
        ];

        $rootScope.Listapreguntasrepa = [
            {
                ID: 1,
                PREGUNTA: "1. ¿Estuvo con el técnico en el momento de la reparación?",
            },
            {
                ID: 2,
                PREGUNTA:
                    "2. ¿Qué tan satisfecho te encuentras con la reparación Realizada?",
            },
            {
                ID: 3,
                PREGUNTA:
                    "3. ¿Qué tan fácil te pareció el proceso de reparación de tu servicio o servicios?",
            },
            {
                ID: 4,
                PREGUNTA:
                    "4. ¿Según tu experiencia en el proceso de reparación, recomendarías a UNE, a otra persona?",
            },
            {
                ID: 5,
                PREGUNTA:
                    "5. ¿Como calificarías, el cumplimiento de la cita pactada para realizar tu reparación?",
            },
            {
                ID: 6,
                PREGUNTA:
                    "6. ¿El técnico te demostró que los servicios quedaron funcionando correctamente?",
            },
            {
                ID: 7,
                PREGUNTA:
                    "7. ¿El técnico revisó el correcto funcionamiento de cada uno de los servicios instalados en el hogar?",
            },
            {
                ID: 8,
                PREGUNTA:
                    "8. ¿Después de realizada la reparación se te ha presentado algúna falla o inconveniente con el servicio de UNE?",
            },
        ];

        $rootScope.empresas = [
            {ID: 1, EMPRESA: "Une"},
            {ID: 0, EMPRESA: "Sin empresa"},
            {ID: 3, EMPRESA: "Redes y edificaciones"},
            {ID: 4, EMPRESA: "Energia integral andina"},
            {ID: 6, EMPRESA: "Eagle"},
            {ID: 7, EMPRESA: "Servtek"},
            {ID: 8, EMPRESA: "Furtelcom"},
            {ID: 9, EMPRESA: "Emtelco"},
            {ID: 10, EMPRESA: "Conavances"},
            {ID: 11, EMPRESA: "Techcom"},
        ];

        $rootScope.procesosoffline = [
            {ID: "Instalaciones", PROCESO: "Instalaciones"},
            {ID: "Reparaciones", PROCESO: "Reparaciones"},
        ];

        $rootScope.estadosComercial = [
            {ID: "Cobertura 3G", ESTADO: "Cobertura 3G"},
            {ID: "Decisión Usuario 42", ESTADO: "Decisión Usuario 42"},
            {ID: "Estudio Legal 82", ESTADO: "Estudio Legal 82"},
            {ID: "Oferta Economica", ESTADO: "Oferta Económica"},
            {ID: "PEREP", ESTADO: "PEREP"},
            {ID: "PETEC", ESTADO: "PETEC"},
            {ID: "PFACT", ESTADO: "PFACT"},
            {ID: "PORDE", ESTADO: "PORDE"},
        ];

        $rootScope.productos = [
            {ID: "ADSL-Internet", PRODUCTO: "ADSL-Internet"},
            {ID: "ADSL-IPTV", PRODUCTO: "ADSL-IPTV"},
            {ID: "ADSL-ToIP", PRODUCTO: "ADSL-ToIP"},
            {ID: "HFC-Internet", PRODUCTO: "HFC-Internet"},
            {ID: "HFC-ToIP", PRODUCTO: "HFC-ToIP"},
            {ID: "HFC-TV_Basica", PRODUCTO: "HFC-TV Basica"},
            {ID: "HFC-TV_Digital", PRODUCTO: "HFC-TV Digital"},
            {ID: "GPON", PRODUCTO: "GPON"},
            {ID: "Telefonia_Basica", PRODUCTO: "Telefonia Basica"},
            {ID: "DTH-Television", PRODUCTO: "DTH-Television"},
        ];

        $rootScope.conceptosRegistros = [
            {ID: "", CONCEPTO: "--Seleccione--"},
            {ID: "pedido", CONCEPTO: "Pedido"},
            {ID: "asesor", CONCEPTO: "Asesor"},
            {ID: "accion", CONCEPTO: "Accion"},
            {ID: "proceso", CONCEPTO: "Proceso"},
        ];

        $rootScope.conceptoVentaInstale = [
            {ID: "", CONCEPTO: "--Seleccione--"},
            {ID: "Gestionados", CONCEPTO: "Gestionados"},
            {ID: "Ok", CONCEPTO: "Aprobados"},
            {ID: "Rechazados", CONCEPTO: "Rechazados"},
        ];

        $rootScope.conceptosRegistrosComercial = [
            {ID: "", CONCEPTO: "--Seleccione--"},
            {ID: "pedido_actual", CONCEPTO: "Pedido"},
            {ID: "login_asesor", CONCEPTO: "Asesor"},
            {
                ID: "gestion",
                CONCEPTO: "Gestión",
            },
            {ID: "clasificacion", CONCEPTO: "Clasificación"},
            {ID: "ciudad", CONCEPTO: "Ciudad"},
            {ID: "estado", CONCEPTO: "Estado"},
        ];

        $rootScope.conceptosBuscar = [
            {ID: "", CONCEPTO: "--Seleccione--"},
            {ID: "nombre", CONCEPTO: "Nombre"},
            {ID: "login", CONCEPTO: "Login"},
        ];

        $rootScope.perfiles = [
            {ID: 1, PERFIL: "Supervisor"},
            {ID: 2, PERFIL: "Creador de Experiencia"},
            {ID: 3, PERFIL: "Perfil Regional"},
            {ID: 4, PERFIL: "Mesa Offline"},
            {ID: 5, PERFIL: "Creador de Experiencia Plus"},
            {ID: 6, PERFIL: "Premisas Infraestructuras"},
            {ID: 7, PERFIL: "Asesor VIP"},
            {ID: 8, PERFIL: "Registros"},
            {ID: 9, PERFIL: "Brutal Force"},
            {ID: 10, PERFIL: "Gestión Brutal"},
            {ID: 13, PERFIL: "Quejas GO"},
            {ID: 14, PERFIL: "Nivelacion"},
        ];

        $rootScope.conceptosBuscartecnico = [
            {ID: "", CONCEPTO: "--Seleccione--"},
            {ID: "nombre", CONCEPTO: "Nombre"},
            {ID: "identificacion", CONCEPTO: "Cedula"},
            {ID: "ciudad", CONCEPTO: "Ciudad"},
            {ID: "celuar", CONCEPTO: "Celuar"},
            {ID: 'login', CONCEPTO: 'login'}
        ];

        $rootScope.contrato = [
            {ID: "", CONCEPTO: "Seleccione"},
            {ID: "EMTELCO", CONCEPTO: "EMTELCO"},
            {ID: "RYE", CONCEPTO: "RYE"},
            {ID: "EIA", CONCEPTO: "EIA"},
            {ID: "ETP", CONCEPTO: "ETP"},
        ];

        $rootScope.tecnologia = [
            {ID: "", CONCEPTO: "Seleccione"},
            {ID: "HFC", CONCEPTO: "HFC"},
            {ID: "GPON", CONCEPTO: "GPON"},
            {ID: "COBRE", CONCEPTO: "COBRE"},
            {ID: "DTH", CONCEPTO: "DTH"},
        ];

        $rootScope.ciudadesContingencias = [
            {ID: "", CONCEPTO: "--Seleccione--"},
            {ID: "ARMENIA", CONCEPTO: "ARMENIA"},
            {ID: "BARRANCABERMEJA", CONCEPTO: "BARRANCABERMEJA"},
            {ID: "BARRANQUILLA", CONCEPTO: "BARRANQUILLA"},
            {ID: "BOGOTA", CONCEPTO: "BOGOTA"},
            {ID: "BUCARAMANGA", CONCEPTO: "BUCARAMANGA"},
            {ID: "BUGA", CONCEPTO: "BUGA"},
            {ID: "CALI", CONCEPTO: "CALI"},
            {ID: "CARTAGENA", CONCEPTO: "CARTAGENA"},
            {ID: "CUCUTA", CONCEPTO: "CUCUTA"},
            {ID: "IBAGUE", CONCEPTO: "IBAGUE"},
            {ID: "MANIZALES", CONCEPTO: "MANIZALES"},
            {ID: "MEDELLIN", CONCEPTO: "MEDELLIN"},
            {ID: "MONTERIA", CONCEPTO: "MONTERIA"},
            {ID: "PALMIRA", CONCEPTO: "PALMIRA"},
            {ID: "PEREIRA", CONCEPTO: "PEREIRA"},
            {ID: "POPAYAN", CONCEPTO: "POPAYAN"},
            {ID: "SANTA MARTA", CONCEPTO: "SANTA MARTA"},
            {ID: "SINCELEJO", CONCEPTO: "SINCELEJO"},
            {ID: "TUNJA", CONCEPTO: "TUNJA"},
            {ID: "VALLEDUPAR", CONCEPTO: "VALLEDUPAR"},
            {ID: "VILLAVICENCIO", CONCEPTO: "VILLAVICENCIO"},
        ];

        $rootScope.paquetescontingencias = [
            {ID: "N/A", CONCEPTO: "N/A"},
            {ID: "BasicoAXM", CONCEPTO: "BasicoAXM"},
            {ID: "BasicoBGA", CONCEPTO: "BasicoBGA"},
            {ID: "BasicoBOG", CONCEPTO: "BasicoBOG"},
            {ID: "BasicoBQA", CONCEPTO: "BasicoBQA"},
            {ID: "BasicoBUG", CONCEPTO: "BasicoBUG"},
            {ID: "BasicoCLO", CONCEPTO: "BasicoCLO"},
            {ID: "BasicoCTG", CONCEPTO: "BasicoCTG"},
            {ID: "BasicoCUC", CONCEPTO: "BasicoCUC"},
            {ID: "BasicoEJA", CONCEPTO: "BasicoEJA"},
            {ID: "BasicoIBE", CONCEPTO: "BasicoIBE"},
            {ID: "BasicoMED", CONCEPTO: "BasicoMED"},
            {ID: "BasicoMTR", CONCEPTO: "BasicoMTR"},
            {ID: "BasicoMTR", CONCEPTO: "BasicoMTR"},
            {ID: "BasicoMZL", CONCEPTO: "BasicoMZL"},
            {ID: "BasicoPEI", CONCEPTO: "BasicoPEI"},
            {ID: "BasicoPPN", CONCEPTO: "BasicoPPN"},
            {ID: "BasicoSIN", CONCEPTO: "BasicoSIN"},
            {ID: "BasicoSMR", CONCEPTO: "BasicoSMR"},
            {ID: "BasicoVUP", CONCEPTO: "BasicoVUP"},
            {ID: "BasicoVVC", CONCEPTO: "BasicoVVC"},
            {ID: "BasicoCLO", CONCEPTO: "BasicoCLO"},
            {ID: "BasicoHD", CONCEPTO: "BasicoHD"},
            {ID: "BLACK", CONCEPTO: "BLACK"},
            {ID: "BRONZE", CONCEPTO: "BRONZE"},
            {ID: "CO_CLASICAHD", CONCEPTO: "CO_CLASICAHD"},
            {ID: "CO_CLASICAHD_GP", CONCEPTO: "CO_CLASICAHD_GP"},
            {ID: "CO_CLAHDPLUSONE", CONCEPTO: "CO_CLAHDPLUSONE"},
            {ID: "CO_ESPECIAL_GP", CONCEPTO: "CO_ESPECIAL_GP"},
            {ID: "CO_ANDROIONE", CONCEPTO: "CO_ANDROIONE"},
            {ID: "WINPREM", CONCEPTO: "WINPREM"},
            {ID: "FOXMAS", CONCEPTO: "FOXMAS"},
            {ID: "GOLD", CONCEPTO: "GOLD"},
            {ID: "HBO-MAX", CONCEPTO: "HBO-MAX"},
            {ID: "HBOPACK", CONCEPTO: "HBOPACK"},
            {ID: "HD-NalAXM", CONCEPTO: "HD-NalAXM"},
            {ID: "HD-NalBGA", CONCEPTO: "HD-NalBGA"},
            {ID: "HD-NalBOG", CONCEPTO: "HD-NalBOG"},
            {ID: "HD-NalBUG", CONCEPTO: "HD-NalBUG"},
            {ID: "HD-NalCLO", CONCEPTO: "HD-NalCLO"},
            {ID: "HD-NalCTG", CONCEPTO: "HD-NalCTG"},
            {ID: "HD-NalCUC", CONCEPTO: "HD-NalCUC"},
            {ID: "HD-NalEJA", CONCEPTO: "HD-NalEJA"},
            {ID: "HD-NalMED", CONCEPTO: "HD-NalMED"},
            {ID: "HD-NalMZL", CONCEPTO: "HD-NalMZL"},
            {ID: "HD-NalPEI", CONCEPTO: "HD-NalPEI"},
            {ID: "HOTELES", CONCEPTO: "HOTELES"},
            {ID: "HOTPACK", CONCEPTO: "HOTPACK"},
            {ID: "LIFESTYLE", CONCEPTO: "LIFESTYLE"},
            {ID: "MINIPACK", CONCEPTO: "MINIPACK"},
            {ID: "MOVIECITY", CONCEPTO: "MOVIECITY"},
            {ID: "MUSIC", CONCEPTO: "MUSIC"},
            {ID: "PLAYBOY", CONCEPTO: "PLAYBOY"},
            {ID: "Premium", CONCEPTO: "Premium"},
            {ID: "PRIVATEGOLD", CONCEPTO: "PRIVATEGOLD"},
            {ID: "SILVER", CONCEPTO: "SILVER"},
            {ID: "SPORTS", CONCEPTO: "SPORTS"},
            {ID: "TVDIG-HDBAS", CONCEPTO: "TVDIG-HDBAS"},
            {ID: "TVDIG-HDPREM", CONCEPTO: "TVDIG-HDPREM"},
            {ID: "TVDIGITAL", CONCEPTO: "TVDIGITAL"},
            {ID: "UFC", CONCEPTO: "UFC"},
            {ID: "FOX-TEMP", CONCEPTO: "FOX-TEMP"},
            {ID: "ESCENCIAL", CONCEPTO: "ESCENCIAL"},
            {ID: "ESCENCIAL-PLUS", CONCEPTO: "ESCENCIAL-PLUS"},
            {ID: "IDEAL", CONCEPTO: "IDEAL"},
            {ID: "IDEAL-PLUS", CONCEPTO: "IDEAL-PLUS"},
            {ID: "ONE", CONCEPTO: "ONE"},
            {ID: "ONE PLUS", CONCEPTO: "ONE PLUS"},
            {ID: "ONE ELITE", CONCEPTO: "ONE ELITE"},
            {ID: "DTHCOL-BASICO", CONCEPTO: "DTHCOL-BASICO"},
            {ID: "DTHCOL-AVANZADO", CONCEPTO: "DTHCOL-AVANZADO"},
            {ID: "BASICO MIPYME", CONCEPTO: "BASICO MIPYME"},
        ];

        $rootScope.PendientesBrutalerrorDatos = true;

        $rootScope.pendientesBrutalIncial = function () {
            services.pendientesBrutalForce().then(function (data) {
                $rootScope.pendientesBrutal = data.data[0];
                $rootScope.total = $rootScope.pendientesBrutal.length;
                $rootScope.PendientesBrutalerrorDatos = false;
                return data.data;
            });
        };

        $rootScope.pendientesBrutalIncial();
        $rootScope.ciudades();
        $rootScope.regionesTip();
    },
]);

app.run([
    "$location",
    "$rootScope",
    "$cookies",
    "services",
    function ($location, $rootScope, $cookies, services) {
        $rootScope.logout = function () {
            services.cerrarsesion();
            $cookies.remove("usuarioseguimiento");
            $location.path("/");
            $rootScope.galletainfo = undefined;
            $rootScope.permiso = false;
        };
    },
]);
