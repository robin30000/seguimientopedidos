var app = angular.module("seguimientopedidos", [
    "ngRoute",
    "ngCookies",
    "ngTouch",
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
    "ui.bootstrap",
    "ui.select2"
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
            var deffered = $q.defer();
            var fd = new FormData();
            var user = login;
            file["user"] = user + "6666666";

            fd.append("user", user);
            fd.append("fileUpload", file);

            $http.post("api/class/subeArchivo.php", fd, {
                withCredentials: false,
                transformRequest: angular.identity,
                headers: {"Content-Type": undefined},
                params: {user: user},
                //responseType: "arraybuffer",
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
    function ($http, $q) {
        var serviceBase = "services/";
        var serviceBase1 =
            "api/controller/";
        var obj = {};

        obj.myService = function (datos, controller, method) {
            let data = {
                method: method,
                data: datos,
            };
            return $http.post(serviceBase1 + controller, data);

        };

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

        obj.getexporteContingencias = function (datos) {
            var data = {
                method: "csvContingencias",
                data: datos,
                responseType: 'blob'
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

        obj.guardarQuejaGo = function (dataquejago, duracion, login) {
            var data = {
                method: "registrarQuejaGo",
                data: {
                    dataquejago: dataquejago,
                    duracion: duracion,
                    login: login
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

        obj.getresumenContingencias = function (datos) {
            var data = {
                method: "resumenContingencias",
                data: datos
            }
            return $http.post(serviceBase1 + "contingenciaCtrl.php", data);
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

        obj.quitarUsuarioKpi = function (datos) {
            var data = {method: 'quitarUsuarioKpi', data: datos}
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

        /**
         * admin menu - perfil
         */

        obj.getMenu = function (datos) {
            data = {method: 'getMenu'}
            return $http.post(serviceBase1 + 'MenuPerfilCtrl.php', data);
        }

        obj.getSubmenu = function (datos) {
            data = {method: 'getSubmenu'}
            return $http.post(serviceBase1 + 'MenuPerfilCtrl.php', data);
        }

        obj.getPerfil = function (datos) {
            data = {method: 'getPerfil'}
            return $http.post(serviceBase1 + 'MenuPerfilCtrl.php', data);
        }

        obj.verMenuPerfil = function (datos) {
            data = {method: 'verMenuPerfil', data: datos}
            return $http.post(serviceBase1 + 'MenuPerfilCtrl.php', data);
        }

        obj.cambioMenu = function (datos) {
            data = {method: 'cambioMenu', data: datos}
            return $http.post(serviceBase1 + 'MenuPerfilCtrl.php', data);
        }

        obj.cambiaEstadoSubmenu = function (datos) {
            data = {method: 'cambiaEstadoSubmenu', data: datos}
            return $http.post(serviceBase1 + 'MenuPerfilCtrl.php', data);
        }

        obj.guardaNuevoSubmenu = function (datos) {
            data = {method: 'guardaNuevoSubmenu', data: datos}
            return $http.post(serviceBase1 + 'MenuPerfilCtrl.php', data);
        }

        obj.guardaPerfil = function (datos) {
            data = {method: 'guardaPerfil', data: datos}
            return $http.post(serviceBase1 + 'MenuPerfilCtrl.php', data);
        }

        obj.checkSession = function () {
            let data = {
                method: 'checkSession',
            }
            return $http.post(serviceBase1 + 'authenticationCtrl.php', data);
        }

        obj.windowsBridge = function (datos) {
            let data = {
                method: 'Puente',
                data: datos
            }
            return $http.post(serviceBase1 + 'PuenteCtrl.php', data);
        }

        /**
         * registroEquipos
         */

        obj.registroEquipos = function (datos) {
            let data = {
                method: 'registroEquipos',
                data: datos
            }
            return $http.post(serviceBase1 + 'registroEquiposCtrl.php', data);
        }

        obj.csvRegistroEquipos = function (datos) {
            let data = {
                method: 'csvRegistroEquipos',
                data: datos
            }
            return $http.post(serviceBase1 + 'registroEquiposCtrl.php', data);
        }

        obj.acualizaTecnicos = function (datos) {
            let data = {
                method: 'acualizaTecnicos',
                data: datos
            }
            return $http.post(serviceBase1 + 'userCtrl.php', data);
        };

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
        Swal({
            type: 'info',
            title: 'Opss...',
            text: msg,
            timer: 4000
        })
        opc1 = document.getElementById("idaccionTVHFCGPON").reset();
    }
}

function fn_popup2() {
    var opc2 = document.getElementById("idaccionTVCobre").value;
    var action2 = "Corregir portafolio";
    var msg =
        "Esta opción es solo para hacer correcciones en portafolio o inventario";
    if (opc2 == action2) {
        Swal({
            type: 'info',
            title: 'Opss...',
            text: msg,
            timer: 4000
        })
        opc2 = document.getElementById("idaccionTVCobre").reset();
    }
}

function fn_popup3() {
    var opc3 = document.getElementById("idaccionTVDTH").value;
    var action3 = "Corregir portafolio";
    var msg =
        "Esta opción es solo para hacer correcciones en portafolio o inventario";
    if (opc3 == action3) {
        Swal({
            type: 'info',
            title: 'Opss...',
            text: msg,
            timer: 4000
        })
        opc3 = document.getElementById("idaccionTVDTH").reset();
    }
}

function fn_popup4() {
    var opc4 = document.getElementById("idaccionINTTOIP").value;
    var action4 = "Corregir portafolio";
    var msg =
        "Esta opción es solo para hacer correcciones en portafolio o inventario";
    if (opc4 == action4) {
        Swal({
            type: 'info',
            title: 'Opss...',
            text: msg,
            timer: 4000
        })
        opc4 = document.getElementById("idaccionINTTOIP").reset();
    }
}

function fn_popup5() {
    var opc5 = document.getElementById("idaccionTOIP").value;
    var action5 = "Corregir portafolio";
    var msg =
        "Esta opción es solo para hacer correcciones en portafolio o inventario";
    if (opc5 == action5) {
        Swal({
            type: 'info',
            title: 'Opss...',
            text: msg,
            timer: 4000
        })
        opc5 = document.getElementById("idaccionTOIP").resest();
    }
}

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
app.config(routesConfig).run(runConfig);

function routesConfig($routeProvider, $locationProvider, $compileProvider) {
    $locationProvider.html5Mode(true).hashPrefix('!');
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(whatsapp|http|https|itms):/);
    $routeProvider
        .when("/", {
            title: "Login",
            templateUrl: "partial/login.html",
            controller: "loginCtrl",
        }).when("/actividades", {
        title: "Documentación de Pedidos",
        templateUrl: "partial/actividades.html",
        controller: "actividadesCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/registros", {
        title: "Registros",
        templateUrl: "partial/registros.html",
        controller: "registrosCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/registrossoportegpon", {
        title: "Registros Soporte GPON",
        templateUrl: "partial/registrossoportegpon.html",
        controller: "registrossoportegponCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/registroscodigoincompleto", {
        title: "Registros Codigo incompleto",
        templateUrl: "partial/registroscodigoincompleto.html",
        controller: "registroscodigoincompletoCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/usuarios", {
        title: "Usuarios",
        templateUrl: "partial/usuarios.html",
        controller: "usuariosCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/tecnicos", {
        title: "Tecnicos",
        templateUrl: "partial/tecnicos.html",
        controller: "tecnicosCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/mesaoffline/mesaoffline", {
        title: "Mesa Offline",
        templateUrl: "partial/mesaoffline/mesaoffline.html",
        controller: "mesaofflineCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/mesaoffline/registrosOffline", {
        title: "Registros Offline",
        templateUrl: "partial/mesaoffline/registrosOffline.html",
        controller: "registrosOfflineCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/brutalForce", {
        title: "Brutal Force",
        templateUrl: "partial/brutalForce.html",
        controller: "brutalForceCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/contingencias", {
        title: "Contingencias aprovisionamiento",
        templateUrl: "partial/contingencias.html",
        controller: "contingenciasCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/nivelacion", {
        title: "Gestión Nivelación",
        templateUrl: "partial/nivelacion.html",
        controller: "nivelacionCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/GestionNivelacion", {
        title: "Gestión Nivelación",
        templateUrl: "partial/GestionNivelacion.html",
        controller: "GestionNivelacionCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/Gestioncontingencias", {
        title: "Gestión Contingencias",
        templateUrl: "partial/Gestioncontingencias.html",
        controller: "GestioncontingenciasCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/gestionsoportegpon", {
        title: "Gestión Soporte Gpon",
        templateUrl: "partial/Gestionsoportegpon.html",
        controller: "GestionsoportegponCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/gestioncodigoincompleto", {
        title: "Registros Código Incompleto",
        templateUrl: "partial/Gestioncodigoincompleto.html",
        controller: "GestioncodigoincompletoCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/premisasInfraestructuras", {
        title: "Premisas Infraestructuras",
        templateUrl: "partial/premisasInfraestructuras.html",
        controller: "premisasInfraestructurasCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/novedadesVisita", {
        title: "Novedades Visita",
        templateUrl: "partial/novedadesVisita.html",
        controller: "novedadesVisitaCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/contrasenaClick", {
        title: "Contraseñas ClickSoftware",
        templateUrl: "partial/contrasenaClick.html",
        controller: "contrasenasClickCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/quejasGo", {
        title: "Quejas Gestión Operativa",
        templateUrl: "partial/quejasGo.html",
        controller: "quejasGoCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/gestion-quejasGo", {
        title: "Gestión QuejasGo",
        templateUrl: "partial/gestionQuejasGo.html",
        controller: "quejasGoCtrl2",
        resolve: {
            userData: loadUserData
        }
    }).when("/consultaSara", {
        title: "Consulta SARA",
        templateUrl: "partial/consultaSara.html",
        controller: "saraCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/KPI-Contingencia", {
        title: "KPI Contingecia",
        templateUrl: "partial/graficos-contingecia.html",
        controller: "GraficosContingeciaCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/gestion-ventas-instaleTiendas", {
        title: "Gestion Ventas Instale",
        templateUrl: "partial/ventasInstale/VentasInstaleTiendas.html",
        controller: "gestionVentasInstaleTiendasCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/perfil-menu", {
        title: "Administracion menu - perfiles",
        templateUrl: "partial/menu-perfil.html",
        controller: "MenuPerfilCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when('/validaciones-app', {
        title: 'Validaciones App',
        templateUrl: 'partial/validaciones-app.html',
        controller: 'validacionesAppCtrl',
        resolve: {
            userData: loadUserData
        }
    }).when('/registro-equipos', {
        title: 'Registro equipos',
        templateUrl: 'partial/registro_equipo.html',
        controller: 'registroEquipoCtrl',
        resolve: {
            userData: loadUserData
        }
    }).when("/tiempos", {
        title: "Graficos tiempos",
        templateUrl: "partial/graficos/tiempos.html",
        controller: "tiemposCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/ruteo", {
        title: "Graficos ruteo",
        templateUrl: "partial/graficos/ruteo.html",
        controller: "ruteoCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/consultas", {
        title: "Conteo consultas",
        templateUrl: "partial/consultas.html",
        controller: "ConteoCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/activación-toip", {
        title: "Activación Toip",
        templateUrl: "partial/activacion_toip.html",
        controller: "ActivacionToipCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/etp", {
        title: "Gestión ETP",
        templateUrl: "partial/etp.html",
        controller: "etpCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/registros-etp", {
        title: "Registros ETP",
        templateUrl: "partial/registros-etp.html",
        controller: "RegistrosETPCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/kpi-toip", {
        title: "KPI Toip",
        templateUrl: "partial/graficos/kpi-toip.html",
        controller: "GraficoToipCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/mesas-nacionales", {
        title: "Mesas nacionales",
        templateUrl: "partial/mesas-nacionales.html",
        controller: "MesasNacionalesCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/kpi-rgu", {
        title: "KPI-RGU",
        templateUrl: "partial/graficos/kpi-rgus.html",
        controller: "RguCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/mesas-nacionales", {
        title: "Mesas nacionales",
        templateUrl: "partial/mesas-nacionales.html",
        controller: "MesasNacionalesCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/kpi-cco", {
        title: "KPI CCO",
        templateUrl: "partial/graficos/kpi-cco.html",
        controller: "kpiCcoCtrl",
        resolve: {
            userData: loadUserData
        }
    }).otherwise({
        redirectTo: "/",
    });
}

function loadUserData($rootScope, $q, $route, $location, services, $cookies) {
    return services.checkSession().then((data) => {
        if (!data.data.login) {
            swal({
                type: "error",
                title: 'Su session ha caducado',
                text: 'Inicia session nuevamente para continuar',
                timer: 4000,
            }).then(function () {
                $cookies.remove("usuarioseguimiento");
                $location.path("/");
                $rootScope.galletainfo = undefined;
                $rootScope.permiso = false;
                $route.reload();
            });
        }
        var today = new Date();
        $rootScope.year = today.getFullYear();
        $rootScope.nombre = data.data.nombre;
        $rootScope.login = data.data.login;
        $rootScope.perfil = data.data.perfil;
        $rootScope.identificacion = data.data.identificacion;
        $rootScope.menu = data.data.menu;
        $rootScope.authenticated = true;
        $rootScope.permiso = true;

        $cookies.put("usuarioseguimiento", JSON.stringify(data.data));
        var galleta = JSON.parse($cookies.get("usuarioseguimiento"));
        $rootScope.galletainfo = galleta;

        return data;
    }).catch((e) => {
        console.log(e)
    })

    function failed(reason) {
        $rootScope.authenticated = false;
        if ($route.current.loginRequired) {
            var error = {
                status: 401,
                message: "Unauthorized"
            };
            return $q.reject(error);
        }
    }
}

function runConfig($rootScope, $location, services, $cookies, $q, $route) {
    $rootScope.$on('$routeChangeStart', function (e, curr, prev) {
    });
    $rootScope.$on('$routeChangeSuccess', function (e, curr, prev) {
        $rootScope.title = curr.$$route.title;
        $rootScope.tituloPagina =
            "Seguimiento a pedidos - " + curr.$$route.title;
    });
    $rootScope.$on('$routeChangeError', function (arg1, arg2, arg3, arg4) {

        if (arg4.status == 404) {
            $location.url('/');
        }
        if (arg4.status == 401) {
            $location.url('/');
        }
    });
}

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
            {ID: "identificacion", CONCEPTO: "identificacion"},
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
            {ID: 15, PERFIL: "Venta Instale"},
        ];

        $rootScope.conceptosBuscartecnico = [
            {ID: "", CONCEPTO: "--Seleccione--"},
            {ID: "nombre", CONCEPTO: "Nombre"},
            {ID: "identificacion", CONCEPTO: "Cedula"},
            {ID: "ciudad", CONCEPTO: "Ciudad"},
            {ID: "celular", CONCEPTO: "celular"},
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

        $rootScope.productoGrafico = [
            {id: 'Internet+Toip', concepto: 'Internet+Toip'},
            {id: 'TV', concepto: 'TV'},
            {id: 'Todos', concepto: 'Todos'}
        ];

        $rootScope.estadoGrafico = [
            {id: 'Acepta', concepto: 'Acepta'},
            {id: 'Rechaza', concepto: 'Rechaza'}
        ];

        $rootScope.empresaGrafico = [
            {
                id: 'Tigo', concepto: 'Tigo'
            }, {
                id: 'Emtelco', concepto: 'Emtelco'
            }
        ]

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
