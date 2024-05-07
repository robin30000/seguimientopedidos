(function () {
    "use strict";

    angular.module("seguimientopedidos").factory("services", services);
    services.$inject = ["$http", "$q"];

    function services($http, $q) {
        let serviceBase = "api/controller/";
        let obj = {};

        obj.myService = function (datos, controller, method) {
            let data = {
                method: method,
                data: datos,
            };
            return $http.post(serviceBase + controller, data).then(complete).catch(failed);

            function complete(response) {
                return $q.when(response.data)
            }

            function failed(response) {
                return $q.reject(response.data)
            }
        };
        obj.myServiceImagen = function (datos, controller, method) {
            let data = {
                method: method,
                data: datos,
            }
            $http({
                method: 'POST',
                url: serviceBase + controller,
                data: data,
                headers: {
                    'Content-Type': undefined
                },
                transformRequest: angular.identity
            })
                .then(function (response) {
                    console.log(response.data);
                })
                .catch(function (error) {
                    console.error(error);
                });
        }

        /**
         * authentication
         */

        obj.loginUser = function (datosAutenticacion) {
            let data = {
                method: "login",
                data: datosAutenticacion,
            };
            return $http.post(serviceBase + "authenticationCtrl.php", data);
        };

        obj.cerrarsesion = function () {
            let data = {
                method: "logout",
            };
            return $http.post(serviceBase + "authenticationCtrl.php", data);
        };

        /**
         * Alarma
         */

        obj.creaAlarma = function (datosCrearAlarma) {
            let data = {
                method: "nuevaAlarma",
                data: datosCrearAlarma,
            };
            return $http.post(serviceBase + "alarmaCtrl.php", data);
        };

        obj.editAlarma = function (datosAlarma) {
            let data = {
                method: "editAlarma",
                data: datosAlarma,
            };
            return $http.post(serviceBase + "alarmaCtrl.php", data);
        };

        obj.listadoAlarmas = function () {
            let data = {
                method: "listadoAlarmas",
            };
            return $http.post(serviceBase + "alarmaCtrl.php", data);
        };

        obj.deleteAlarma = function (id) {
            let data = {
                method: "deleteAlarma",
                data: id,
            };
            return $http.post(serviceBase + "alarmaCtrl.php", data);
        };

        /**
         * usuario
         */

        obj.editarUsuario = function (datosEdicion) {
            let data = {
                method: "editarUsuario",
                data: datosEdicion,
            };
            return $http.post(serviceBase + "userCtrl.php", data);
        };

        obj.editarRegistro = function (datosEdicion) {
            let data = {
                method: "editarRegistro",
                data: {
                    datosEdicion: datosEdicion,
                },
            };
            return $http.post(serviceBase + "userCtrl.php", data);
        };

        obj.pedidoComercial = function (datospedidoComercial) {
            let data = {
                method: "CrearpedidoComercial",
                data: {
                    datospedidoComercial: datospedidoComercial,
                },
            };
            return $http.post(serviceBase + "userCtrl.php", data);
        };

        obj.getGuardarPlan = function (datosPlan) {
            let data = {
                method: "guardarPlan",
                data: datosPlan,
            };
            return $http.post(serviceBase + "userCtrl.php", data);
        };

        obj.pedidoOffline = function (datospedidoOffline) {
            let data = {
                method: "CrearpedidoOffline",
                data: datospedidoOffline,
            };
            return $http.post(serviceBase + "userCtrl.php", data);
        };

        obj.ingresarPedidoAsesor = function (
            datospedido,
            pedido,
            empresa,
            duracion_llamada,
            datosClick,
            plantilla,
            idcambioequipo,
            login
        ) {
            let data = {
                method: "ingresarPedidoAsesor",
                data: {
                    datospedido: datospedido,
                    pedido: pedido,
                    empresa: empresa,
                    duracion_llamada: duracion_llamada,
                    datosClick: datosClick,
                    plantilla: plantilla,
                    idcambioequipo: idcambioequipo,
                    login: login
                },
            };
            return $http.post(serviceBase + "userCtrl.php", data);
        };

        obj.creaUsuario = function (datosCrearUsuario) {
            let data = {
                method: "creaUsuario",
                data: datosCrearUsuario,
            };
            return $http.post(serviceBase + "userCtrl.php", data);
        };

        obj.creaTecnico = function (datosCrearTecnico, id_tecnico) {
            let data = {
                method: "creaTecnico",
                data: {
                    datosCrearTecnico: datosCrearTecnico,
                    id_tecnico: id_tecnico,
                },
            };
            return $http.post(serviceBase + "userCtrl.php", data);
        };

        obj.listadoUsuarios = function (datos) {
            let data = {
                method: "listadoUsuarios",
                data: datos,
            };
            return $http.post(serviceBase + "userCtrl.php", data);
        };

        obj.deleteUsuario = function (id) {
            let data = {
                method: "borrarUsuario",
                data: id,
            };
            return $http.post(serviceBase + "userCtrl.php", data);
        };

        obj.deleteTecnico = function (id) {
            let data = {
                method: "borrarTecnico",
                data: id,
            };
            return $http.post(serviceBase + "userCtrl.php", data);
        };

        obj.editarTecnico = function (datosTecnico) {
            let data = {
                method: "editarTecnico",
                data: datosTecnico,
            };
            return $http.post(serviceBase + "userCtrl.php", data);
        };

        /**
         * services por organizar
         */

        obj.insertarCambioEquipo = function (tecnologia, datoscambio, pedido) {
            let data = {
                method: "insertarCambioEquipo",
                data: {
                    tecnologia: tecnologia,
                    datoscambio: datoscambio,
                    pedido: pedido,
                },
            };
            return $http.post(serviceBase + "otherServicesCtrl.php", data);
        };

        obj.getGuardarPedidoEncuesta = function (
            infoPedidoEncuesta,
            gestionDolores,
            counter,
            fechaInicial,
            fechaFinal
        ) {
            let data = {
                method: "GuardarPedidoEncuesta",
                data: {
                    infoPedidoEncuesta: infoPedidoEncuesta,
                    gestionDolores: gestionDolores,
                    counter: counter,
                    fechaInicial: fechaInicial,
                    fechaFinal: fechaFinal,
                },
            };
            return $http.post(serviceBase + "otherServicesCtrl.php", data);
        };

        obj.getGuardargestiodespachoBrutal = function (datosguardar) {
            let data = {
                method: "gestiodespachoBrutal",
                data: datosguardar,
            };
            return $http.post(serviceBase + "otherServicesCtrl.php", data);
        };

        obj.datosGestionFinal = function () {
            let data = {
                method: "gestionFinal",
            };
            return $http.post(serviceBase + "otherServicesCtrl.php", data);
        };

        obj.getDashBoard = function () {
            let data = {
                method: "DashBoard",
            };
            return $http.post(serviceBase + "otherServicesCtrl.php", data);
        };

        obj.getGuardargestioAsesor = function (datosguardar, datosDespacho) {
            let data = {
                method: "gestionAsesorBrutal",
                data: {
                    datosguardar: datosguardar,
                    datosDespacho: datosDespacho,
                },
            };
            return $http.post(serviceBase + "otherServicesCtrl.php", data);
        };

        obj.guardarContingencia = function (datosguardar) {
            let data = {
                method: "savecontingencia",
                data: datosguardar,
            };
            return $http.post(serviceBase + "otherServicesCtrl.php", data);
        };

        obj.CancelContingencia = function (datoscancelar) {
            let data = {
                method: "CancelarContingencias",
                data: datoscancelar,
            };
            return $http.post(serviceBase + "otherServicesCtrl.php", data);
        };

        obj.getguardarEscalar = function (gestionescalado) {
            let data = {
                method: "guardarEscalar",
                data: gestionescalado,
            };
            return $http.post(serviceBase + "otherServicesCtrl.php", data);
        };

        obj.getGuardargestionFinal = function (datosFinal) {
            let data = {
                method: "gestionAsesorFinal",
                data: datosFinal,
            };
            return $http.post(serviceBase + "otherServicesCtrl.php", data);
        };

        obj.getpedidosPendientes = function () {
            let data = {
                method: "gestionPendientes",
            };
            return $http.post(serviceBase + "otherServicesCtrl.php", data);
        };

        obj.pedidopendientes = function (datos) {
            let data = {
                method: "Pendientesxestado",
                data: datos,
            };
            return $http.post(serviceBase + "otherServicesCtrl.php", data);
        };

        /**
         * otherServicesDos
         */

        obj.getBorrarRegistros = function (datosBorrar) {
            let data = {
                method: "gestionBorrar",
                data: datosBorrar,
            };
            return $http.post(serviceBase + "otherServicesDosCtrl.php", data);
        };

        obj.getDesbloquear = function (datos) {
            let data = {
                method: "desbloquear",
                data: datos,
            };
            return $http.post(serviceBase + "otherServicesDosCtrl.php", data);
        };

        obj.expCsvdatos = function (valor, datos) {
            let data = {
                method: "csvPreagen",
                data: {
                    valor: valor,
                    datos: datos,
                },
            };
            return $http.post(serviceBase + "otherServicesDosCtrl.php", data);
        };

        obj.getexporteContingencias = function (datos) {
            let data = {
                method: "csvContingencias",
                data: datos,
                responseType: 'blob'
            };
            return $http.post(serviceBase + "otherServicesDosCtrl.php", data);
        };

        obj.expCsvestados = function (datos) {
            let data = {
                method: "csvEstadosClick",
                data: datos,
            };
            return $http.post(serviceBase + "otherServicesDosCtrl.php", data);
        };

        obj.expCsvpeniInsta = function (regional) {
            let data = {
                method: "CsvpeniInsta",
                data: regional,
            };
            return $http.post(serviceBase + "otherServicesDosCtrl.php", data);
        };

        obj.getexpcsvRRHH = function () {
            return $http.get("http://10.100.66.254:7771/api/exportrrhh");
        };

        obj.expNpsSemana = function (semana) {
            let data = {
                method: "CsvNpsSemana",
                data: semana,
            };
            return $http.post(serviceBase + "otherServicesDosCtrl.php", data);
        };

        obj.buscarPedido = function (url, pedidos) {
            let data = {
                method: "buscarPedido",
                data: {
                    url: url,
                    pedidos: pedidos,
                },
            };
            return $http.post(serviceBase + "otherServicesDosCtrl.php", data);
        };

        obj.buscarPedidoSeguimiento = function (pedido, producto, remite) {
            let data = {
                method: "buscarPedidoSegui",
                data: {
                    pedido: pedido,
                    producto: producto,
                    remite: remite,
                },
            };
            return $http.post(serviceBase + "otherServicesDosCtrl.php", data);
        };

        obj.expCsvRegistros = function (datos) {
            let data = {
                method: "csvRegistros",
                data: datos,
            };
            return $http.post(serviceBase + "otherServicesDosCtrl.php", data);
        };

        obj.expBrutalForce = function (fechas) {
            let data = {
                method: "expBrutal",
                data: fechas,
            };
            return $http.post(serviceBase + "otherServicesDosCtrl.php", data);
        };

        obj.expCsvtecnico = function (datos) {
            let data = {
                method: "Csvtecnico",
                data: datos,
            };
            return $http.post(serviceBase + "otherServicesDosCtrl.php", data);
        };

        obj.getDiferenciasClick = function (fecha) {
            let data = {
                method: "diferenciasClick",
                data: fecha,
            };
            return $http.post(serviceBase + "otherServicesDosCtrl.php", data);
        };

        obj.Verobservacionasesor = function (pedido) {
            let data = {
                method: "observacionAsesor",
                data: pedido,
            };
            return $http.post(serviceBase + "otherServicesDosCtrl.php", data);
        };

        obj.contadorPendientesBrutalForce = function () {
            let data = {
                method: "contadorpedientesBF",
            };
            return $http.post(serviceBase + "otherServicesDosCtrl.php", data);
        };

        obj.getseguimientoClick = function (fecha) {
            let data = {
                method: "seguimientoClick",
                data: fecha,
            };
            return $http.post(serviceBase + "otherServicesDosCtrl.php", data);
        };

        obj.registrosComercial = function (page, concepto, dato, inicial, final) {
            let data = {
                method: "registrosComercial",
                data: {
                    page: page,
                    concepto: concepto,
                    dato: dato,
                    inicial: inicial,
                    final: final,
                },
            };
            return $http.post(serviceBase + "otherServicesDosCtrl.php", data);
        };

        /*
        infraestructura
        */
        obj.premisasInfraestructuras = function (page, datos) {
            let data = {
                method: "premisasInfraestructuras",
                data: {
                    page: page,
                    datos: datos,
                },
            };
            return $http.post(serviceBase + "generacionTtCtrl.php", data);
        };

        obj.guardar = function (registrostt) {
            let data = {
                method: "guardarGeneracionTT",
                data: registrostt,
            };
            return $http.post(serviceBase + "generacionTtCtrl.php", data);
        };

        obj.expCsvGeneracionTT = function (datos) {
            let data = {
                method: "csvGeneracionTT",
                data: {
                    datos,
                },
            };
            return $http.post(serviceBase + "generacionTtCtrl.php", data);
        };

        /*****SERVICIOS PARA EL MODULO DE ESCALAMIENTO*****/

        obj.premisasInfraestructurasEscalmiento = function (page, datos) {
            let data = {
                method: "escalamientoInfraestructura",
                data: {
                    page: page,
                    datos: datos,
                },
            };
            return $http.post(serviceBase + "escalamientoCtrl.php", data);
        };

        // SERVICIO PARA LLAMAR LA INFORMACION DE GRUPO COLA
        obj.getGrupoCola = function () {
            let data = {
                method: "GrupoCola",
            };
            return $http.post(serviceBase + "escalamientoCtrl.php", data);
        };

        // SERVICIO PARA LLAMAR LA INFORMACION DE GESTION DE ESCALAMIENTO
        obj.getGestion = function () {
            let data = {
                method: "gestionEscalimiento",
            };
            return $http.post(serviceBase + "escalamientoCtrl.php", data);
        };

        // SERVICIO PARA LLAMAR LA INFORMACION DE OBSERVACION DE ESCALAMIENTO
        obj.getObservacionesEscalamiento = function (gestion) {
            let data = {
                method: "observacionEscalimiento",
                data: gestion,
            };
            return $http.post(serviceBase + "escalamientoCtrl.php", data);
        };

        // SERVICIO PARA LLAMAR LA INFORMACION DE NOTAS DE ESCALAMIENTO
        obj.getNotasEscalamiento = function (observacion) {
            let data = {
                method: "notasEscalamiento",
                data: observacion,
            };
            return $http.post(serviceBase + "escalamientoCtrl.php", data);
        };

        obj.guardarFormEscalamiento = function (escalamiento) {
            let data = {
                method: "infoEscalamiento",
                data: escalamiento,
            };
            return $http.post(serviceBase + "escalamientoCtrl.php", data);
        };

        obj.expCsvEscalamiento = function (datos) {
            let data = {
                method: "csvEscalamientoExp",
                data: datos,
            };
            return $http.post(serviceBase + "escalamientoCtrl.php", data);
        };

        obj.guardarEscalamiento = function (datosguardar) {
            let data = {
                method: "saveescalamiento",
                data: datosguardar,
            };
            return $http.post(serviceBase + "escalamientoCtrl.php", data);
        };

        obj.exportEscalamientos = function () {
            let data = {
                method: "exportEscalamientos",
            };
            return $http.post(serviceBase + "escalamientoCtrl.php", data);
        };

        /*------>SERVICIOS PARA EL MODULO DE VISITAS EN CONJUNTO<------*/

        //Servivio para subir la informacion de la tabla a la vista
        obj.premisasVisitasEnConjunto = function (page, datos) {
            let data = {
                method: "visitasEnConjunto",
                data: {
                    page: page,
                    datos: datos,
                },
            };
            return $http.post(serviceBase + "visitasEnConjuntoCtrl.php", data);
        };

        // Servicio para llamar la informacion de grupo en las visitas en conjunto
        obj.getGrupoVisitasEnConjunto = function () {
            let data = {
                method: "GrupoVisitasEnConjunto",
            };
            return $http.post(serviceBase + "visitasEnConjuntoCtrl.php", data);
        };

        //servicio para guardar la información de visitas en conjunto
        obj.guardarFormVisitasEnConjunto = function (visitasEnConjunto) {
            let data = {
                method: "infoVisitasEnConjunto",
                data: visitasEnConjunto,
            };
            return $http.post(serviceBase + "visitasEnConjuntoCtrl.php", data);
        };

        //Servicio para exportar la información de las vistas en conjunto
        obj.expCsvVisitasEnConjunto = function (datos) {
            let data = {
                method: "csvVisitasEnConjuntoExp",
                data: datos,
            };
            return $http.post(serviceBase + "visitasEnConjuntoCtrl.php", data);
        };

        // Servicio para llamar las Regiones en visitas en conjunto
        obj.RegionesVisConj = function () {
            let data = {
                method: "RegionesVisConjunto",
            };
            return $http.post(serviceBase + "visitasEnConjuntoCtrl.php", data);
        };

        // Servicio para llamar las ciudades en vistas en conjunto, frm registro nuevo
        obj.MunicipiosVisConj = function (region) {
            let data = {
                method: "MunicipiosVisConjunto",
                data: region,
            };
            return $http.post(serviceBase + "visitasEnConjuntoCtrl.php", data);
        };

        // Servicio para llamar la ciudad en vistas en conjunto, frm update
        obj.municipiovisconjupdate = function (idregistro) {
            let data = {
                method: "MunicipioVisConjuntoUpdate",
                data: idregistro,
            };
            return $http.post(serviceBase + "visitasEnConjuntoCtrl.php", data);
        };

        /*===========================================================*/
        //INICIO SERVICIOS PARA CONTRASEÑAS TECNICOS
        /*===========================================================*/

        obj.registrosContrasenasTecnicos = function (datos) {
            let data = {
                method: "registrospwdTecnicos",
                data: datos,
            };
            return $http.post(serviceBase + "novedadesTecnicoCtrl.php", data);
        };

        obj.editarPasswordTecnicos = function (datosEdicion) {
            let data = {
                method: "editarPwdTecnicos",
                data: datosEdicion,
            };
            return $http.post(serviceBase + "novedadesTecnicoCtrl.php", data);
        };

        obj.expCsvContrasenasTecnicos = function () {
            let data = {
                method: "csvContrasenasTecnicos",
            };
            return $http.post(serviceBase + "novedadesTecnicoCtrl.php", data);
        };

        obj.novedadesTecnicoService = function (datos) {
            let data = {
                method: "novedadesTecnico",
                data: datos
            };
            return $http.post(serviceBase + "novedadesTecnicoCtrl.php", data);
        };

        obj.guardarNovedadesTecnico = function (registrosTenicos) {
            let data = {
                method: "guardarNovedadesTecnico",
                data: registrosTenicos,
            };
            return $http.post(serviceBase + "novedadesTecnicoCtrl.php", data);
        };

        obj.updateNovedadesTecnico = (observacionCCO, pedido) => {
            let data = {
                method: "updateNovedadesTecnico",
                data: {
                    observacionCCO: observacionCCO,
                    pedido: pedido,
                },
            };
            return $http.post(serviceBase + "novedadesTecnicoCtrl.php", data);
        };

        obj.expCsvNovedadesTecnico = function (datos) {
            let data = {
                method: "csvNovedadesTecnico",
                data: datos,
            };
            return $http.post(serviceBase + "novedadesTecnicoCtrl.php", data);
        };

        obj.getRegiones = function () {
            let data = {
                method: "Regiones",
            };
            return $http.post(serviceBase + "novedadesTecnicoCtrl.php", data);
        };

        obj.getMunicipios = function (region) {
            let data = {
                method: "Municipios",
                data: region,
            };
            return $http.post(serviceBase + "novedadesTecnicoCtrl.php", data);
        };

        obj.getSituacion = function () {
            let data = {
                method: "SituacionNovedadesVisitas",
            };
            return $http.post(serviceBase + "novedadesTecnicoCtrl.php", data);
        };

        obj.getDetalle = function (situacion) {
            let data = {
                method: "DetalleNovedadesVisitas",
                data: situacion,
            };
            return $http.post(serviceBase + "novedadesTecnicoCtrl.php" + data);
        };

        /*------------->INICIO SERVICIOS PARA QUEJASGO<------------*/

        obj.extraeQuejasGoDia = function (datos) {
            let data = {
                method: "extraeQuejasGoDia",
                data: datos

            };
            return $http.post(serviceBase + "quejasGoCtrl.php", data);
        };

        obj.expCsvQuejasGo = function (datos) {
            let data = {
                method: "csvQuejasGo",
                data: datos,
            };
            return $http.post(serviceBase + "quejasGoCtrl.php", data);
        };

        obj.traerTecnico = function (cedula) {
            let data = {
                method: "traerTecnico",
                data: cedula,
            };
            return $http.post(serviceBase + "quejasGoCtrl.php", data);
        };

        obj.creaTecnicoQuejasGo = function (crearTecnicoquejasGoSel) {
            let data = {
                method: "creaTecnicoQuejasGo",
                data: crearTecnicoquejasGoSel,
            };
            return $http.post(serviceBase + "quejasGoCtrl.php", data);
        };

        obj.getCiudadesQuejasGo = function () {
            let data = {
                method: "ciudadesQGo",
            };
            return $http.post(serviceBase + "quejasGoCtrl.php", data);
        };

        obj.guardarQuejaGo = function (dataquejago, duracion, login) {
            let data = {
                method: "registrarQuejaGo",
                data: {
                    dataquejago: dataquejago,
                    duracion: duracion,
                    login: login
                },
            };
            return $http.post(serviceBase + "quejasGoCtrl.php", data);
        };

        obj.modiObserQuejasGo = function (observacion, idqueja) {
            let data = {
                method: "ActualizarObserQuejasGo",
                data: {
                    observacion: observacion,
                    idqueja: idqueja,
                },
            };
            return $http.post(serviceBase + "quejasGoCtrl.php", data);
        };

        // /*RETORNO DE LA INFORMACION DEL APPI DE LA FUNCION datoscontingencias*/
        obj.datosgestioncontingencias = function () {
            let data = {
                method: "datoscontingencias",
            };
            return $http.post(serviceBase + "contingenciaCtrl.php", data);
        };

        obj.datosgestioncontingenciasTv = function (curPage, pageSize, sort) {
            let data = {
                method: "datosgestioncontingenciasTv",
                data: {
                    curPage: curPage,
                    pageSize: pageSize,
                    sort: sort,
                },
            };
            return $http.post(serviceBase + "contingenciaCtrl.php", data);
        };

        obj.datosgestioncontingenciasInternet = function (curPage, pageSize, sort) {
            let data = {
                method: "datosgestioncontingenciasInternet",
                data: {
                    curPage: curPage,
                    pageSize: pageSize,
                    sort: sort,
                },
            };
            return $http.post(serviceBase + "contingenciaCtrl.php", data);
        };

        obj.datosgestioncontingenciasPortafolio = function (
            curPage,
            pageSize,
            sort
        ) {
            let data = {
                method: "datosgestioncontingenciasPortafolio",
                data: {
                    curPage: curPage,
                    pageSize: pageSize,
                    sort: sort,
                },
            };
            return $http.post(serviceBase + "contingenciaCtrl.php", data);
        };

        obj.registrosContingenciasCsv = function (datos, param) {
            let data = {
                method: "registrosContingenciasCsv",
                data: {
                    datos: datos,
                    param: param,
                },
            };
            return $http.post(serviceBase + "contingenciaCtrl.php", data);
        };

        obj.datosgestionescalamientos = function () {
            let data = {
                method: "datosescalamientos",
            };
            return $http.post(serviceBase + "gestionEscalonamientoCtrl.php", data);
        };

        obj.datosgestionescalamientosprioridad2 = function () {
            let data = {
                method: "datosescalamientosprioridad2",
            };
            return $http.post(serviceBase + "gestionEscalonamientoCtrl.php", data);
        };

        obj.UpdatePedidosEngestion = function () {
            let data = {
                method: "updateEnGestion",
            };
            return $http.post(
                serviceBase + "gestionAprovisionamientoCtrl.php",
                data
            );
        };

        /*Servicio para traer el estado y las observaciones de los pedidos en BrutalForce*/
        obj.ObsPedidosBF = function () {
            let data = {
                method: "BFobservaciones",
            };
            return $http.post(serviceBase + "novedadesTecnicoCtrl.php", data);
        };

        obj.registrosOffline = function (datos) {
            let data = {
                method: "registrosOffline",
                data: datos,
            };
            return $http.post(serviceBase + "contingenciaCtrl.php", data);
        };

        obj.getgraficaDepartamento = function (mes) {
            let data = {
                method: "graficaDepartamento",
                data: mes,
            };
            return $http.post(serviceBase + "contingenciaCtrl.php", data);
        };

        obj.marcarengestion = function (datos, login) {
            let data = {
                method: "marcarengestion",
                data: {datos, login},
            };
            return $http.post(serviceBase + "contingenciaCtrl.php", data);
        };

        obj.marcarengestionescalamiento = function (datos, login) {
            return $http.post(serviceBase + "marcaescalamiento", {
                datos: datos,
                login: login,
            });
        };

        /*********NUEVO CONECTOR PARA LA APPI marcarEnGestionPorta*********/
        obj.marcarEnGestionPorta = function (datos) {
            let data = {
                method: "marcaPortafolio",
                data: datos,
            };
            return $http.post(serviceBase + "contingenciaCtrl.php", data);
        };

        obj.editarregistrocontingencia = function (datos) {
            let data = {
                method: "guardarpedidocontingencia",
                data: datos,
            };
            return $http.post(serviceBase + "contingenciaCtrl.php", data);
        };

        obj.editarregistroescalamiento = function (datos, login) {
            let data = {
                method: "guardarescalamiento",
                data: datos,
            };
            return $http.post(serviceBase + "contingenciaCtrl.php", data);
        };

        /*PARA CERRAR MASIVAMENTE LAS CONTINGENCIAS*/
        obj.cierreMasivoContingencia = function (dataCierreMasivoContin) {
            let data = {
                method: "cerrarMasivamenteContingencias",
                data: dataCierreMasivoContin,
            };
            return $http.post(serviceBase + "contingenciaCtrl.php", data);
        };

        /*********NUEVO CONECTOR PARA LA APPI editarRegistroContingenciaPortafolio*********/
        obj.editarRegistroContingenciaPortafolio = function (datos, login) {
            let data = {
                method: "guardarPedidoContingenciaPortafolio",
                data: datos,
            };
            return $http.post(serviceBase + "contingenciaCtrl.php", data);
        };

        obj.getgarantiasInstalaciones = function (mes) {
            let data = {
                method: "garantiasInstalaciones",
                data: mes,
            };
            return $http.post(serviceBase + "contingenciaCtrl.php", data);
        };

        obj.getgraficaAcumulados = function (pregunta, mes) {
            let data = {
                method: "graficaAcumulados",
                data: {
                    pregunta: pregunta,
                    mes: mes,
                },
            };
            return $http.post(serviceBase + "contingenciaCtrl.php", data);
        };

        //------------------reparacion----
        obj.getgraficaAcumuladosrepa = function (pregunta, mes) {
            let data = {
                method: "graficaAcumuladosrepa",
                data: {
                    pregunta: pregunta,
                    mes: mes,
                },
            };
            return $http.post(serviceBase + "contingenciaCtrl.php", data);
        };

        //-------------fin reparacion

        obj.getDepartamentosContratos = function (mes) {
            let data = {
                method: "DepartamentosContratos",
                data: mes,
            };
            return $http.post(serviceBase + "otrosServiciosCtrl.php", data);
        };

        obj.insertData = function (lista) {
            let data = {
                method: "insertData",
                data: lista,
            };
            return $http.post(serviceBase + "otrosServiciosCtrl.php", data);
        };

        obj.getRegistrosCarga = function () {
            let data = {
                method: "getRegistrosCarga",
            };
            return $http.post(serviceBase + "otrosServiciosCtrl.php", data);
        };

        obj.getDemePedidoEncuesta = function () {
            let data = {
                method: "getDemePedidoEncuesta",
            };
            return $http.post(serviceBase + "otrosServiciosCtrl.php", data);
        };

        obj.getresumenSemanas = function (pregunta, mes) {
            let data = {
                method: "resumenSemanas",
                data: {
                    pregunta: pregunta,
                    mes: mes,
                },
            };
            return $http.post(serviceBase + "otrosServiciosCtrl.php", data);
        };

        obj.listadoTecnicos = function (datos) {
            let data = {
                method: "listadoTecnicos",
                data: datos,
            };
            return $http.post(serviceBase + "otrosServiciosCtrl.php", data);
        };

        obj.getresumenContingencias = function (datos) {
            let data = {
                method: "resumenContingencias",
                data: datos
            }
            return $http.post(serviceBase + "contingenciaCtrl.php", data);
        };

        obj.getbuscarPedidoContingencia = function (pedido) {
            let data = {
                method: "buscarPedidoContingencias",
                data: pedido,
            };
            return $http.post(serviceBase + "otrosServiciosCtrl.php", data);
        };

        obj.getCiudades = function () {
            let data = {
                method: "ciudades",
            };
            return $http.post(serviceBase + "formaAsesoresCtrl.php", data);
        };

        obj.getRegionesTip = function () {
            let data = {
                method: "regionesTip",
            };
            return $http.post(serviceBase + "formaAsesoresCtrl.php", data);
        };

        obj.getProcesos = function () {
            let data = {
                method: "procesos",
            };
            return $http.post(serviceBase + "formaAsesoresCtrl.php", data);
        };

        obj.registros = function (datos) {
            let data = {
                method: "registros",
                data: datos,
            };
            return $http.post(serviceBase + "formaAsesoresCtrl.php", data);
        };

        obj.registroscsv = function (sort) {
            let data = {
                method: "registroscsv",
                data: {
                    sort: sort,
                },
            };
            return $http.post(serviceBase + "formaAsesoresCtrl.php", data);
        };

        /**
         * otherServicesThree
         */

        obj.getpedidosGestionBrutal = function (accion) {
            let data = {
                method: "gestionBrutal",
                data: accion,
            };
            return $http.post(serviceBase + "otherServicesThreeCtrl.php", data);
        };

        obj.getBuscarPedidoBrutal = function (pedido) {
            let data = {
                method: "BuscarPedidoBrutal",
                data: pedido,
            };
            return $http.post(serviceBase + "otherServicesThreeCtrl.php", data);
        };

        obj.getCalcularMeses = function () {
            let data = {
                method: "meses",
            };
            return $http.post(serviceBase + "otherServicesThreeCtrl.php", data);
        };
        obj.getCalcularMesesrepa = function () {
            let data = {
                method: "mesesrepa",
            };
            return $http.post(serviceBase + "otherServicesThreeCtrl.php", data);
        };
        /**
         * TODO no existe
         * @returns {*}
         */
        obj.getactualizarregion = function () {
            let data = {
                method: "actualizarregion",
            };
            return $http.post(serviceBase + "otherServicesThreeCtrl.php", data);
        };

        obj.getdepartamentos = function () {
            let data = {
                method: "departamentos",
            };
            return $http.post(serviceBase + "otherServicesThreeCtrl.php", data);
        };

        obj.getConceptosPendientes = function (interfaz) {
            let data = {
                method: "conceptospendientes",
                data: interfaz,
            };
            return $http.post(serviceBase + "otherServicesThreeCtrl.php", data);
        };

        obj.getConceptosTotales = function (regional, interfaz) {
            let data = {
                method: "getConceptosTotales",
                data: {
                    regional: regional,
                    interfaz: interfaz,
                },
            };
            return $http.post(serviceBase + "otherServicesThreeCtrl.php", data);
        };

        obj.getResumenInsta = function (departamento) {
            let data = {
                method: "ResumenInsta",
                data: departamento,
            };
            return $http.post(serviceBase + "otherServicesThreeCtrl.php", data);
        };

        obj.gettipo_trabajoclick = function () {
            let data = {
                method: "tipo_trabajoclick",
            };
            return $http.post(serviceBase + "otherServicesThreeCtrl.php", data);
        };

        /**
         * otherServicesFour
         */

        obj.getUenCargada = function () {
            let data = {
                method: "UenCargada",
            };
            return $http.post(serviceBase + "otherServicesFourCtrl.php", data);
        };

        obj.getgestionComercial = function () {
            let data = {
                method: "gestionComercial",
            };
            return $http.post(serviceBase + "otherServicesFourCtrl.php", data);
        };
        /**
         * TODO service no existe
         */
        obj.getcausaRaiz = function () {
            let data = {
                method: "causaRaiz",
            };
            return $http.post(serviceBase + "otherServicesFourCtrl.php", data);
        };

        /**
         * TODO service no existe
         */

        obj.getResponsablePendiente = function (causaraiz) {
            let data = {
                method: "ResponsablePendiente",
                data: causaraiz,
            };
            return $http.post(serviceBase + "otherServicesFourCtrl.php", data);
        };

        /**
         * TODO service no existe
         */

        obj.getlistarPendientesCausaRaiz = function (causaRaiz, fecha) {
            let data = {
                method: "listaCausaRaiz",
                data: {
                    causaRaiz: causaRaiz,
                    fecha: fecha,
                },
            };
            return $http.post(serviceBase + "otherServicesFourCtrl.php", data);
        };

        /**
         * TODO service no existe
         */

        obj.getCausasraizinconsitencias = function () {
            let data = {
                method: "Causasraizinconsitencias",
            };
            return $http.post(serviceBase + "otherServicesFourCtrl.php", data);
        };

        obj.pendientesBrutalForce = function () {
            let data = {
                method: "pendiBrutal",
            };
            return $http.post(serviceBase + "otherServicesFourCtrl.php", data);
        };

        obj.getclasificacionComercial = function (gestion) {
            let data = {
                method: "clasificacionComercial",
                data: gestion,
            };
            return $http.post(serviceBase + "otherServicesFourCtrl.php", data);
        };

        obj.getbuscarpedidoRegistros = function (pedido, fecha) {
            let data = {
                method: "buscaregistros",
                data: {
                    pedido: pedido,
                    fecha: fecha,
                },
            };
            return $http.post(serviceBase + "otherServicesFourCtrl.php", data);
        };

        obj.recogidaEquipos = function (equiposRecoger) {
            let data = {
                method: "guardarRecogerEquipos",
                data: equiposRecoger,
            };
            return $http.post(serviceBase + "otherServicesFourCtrl.php", data);
        };

        obj.listadoEstadosClick = function (listaClick) {
            let data = {
                method: "listadoEstadosClick",
                data: listaClick,
            };
            return $http.post(serviceBase + "otrosServiciosDosCtrl.php", data);
        };

        obj.getGuardarPedidoPendiInsta = function (
            pedido,
            datosdelpedido,
            info,
            user
        ) {
            let data = {
                method: "GuardarPedidoPendiInsta",
                data: {
                    pedido: pedido,
                    datosdelpedido: datosdelpedido,
                    info: info,
                    user: user,
                },
            };
            return $http.post(serviceBase + "otrosServiciosDosCtrl.php", data);
        };

        obj.deleteregistrosCarga = function (idCarga) {
            let data = {
                method: "deleteregistrosCarga",
                data: idCarga,
            };
            return $http.post(serviceBase + "otrosServiciosDosCtrl.php", data);
        };

        obj.getAccionesoffline = function (producto) {
            let data = {
                method: "Accionesoffline",
                data: producto,
            };
            return $http.post(serviceBase + "otrosServiciosDosCtrl.php", data);
        };

        obj.getAcciones = function (proceso) {
            let data = {
                method: "acciones",
                data: proceso,
            };
            return $http.post(serviceBase + "otrosServiciosDosCtrl.php", data);
        };

        obj.getSubAcciones = function (proceso, accion) {
            let data = {
                method: "SubAcciones",
                data: {
                    proceso: proceso,
                    accion: accion,
                },
            };
            return $http.post(serviceBase + "subAccionesCtrl.php", data);
        };

        obj.getCodigos = function (proceso, UNESourceSystem) {
            let data = {
                method: "Codigos",
                data: {
                    proceso: proceso,
                    UNESourceSystem: UNESourceSystem,
                },
            };
            return $http.post(serviceBase + "otrosServiciosDosCtrl.php", data);
        };

        obj.getDiagnosticos = function (producto, accion) {
            let data = {
                method: "Diagnosticos",
                data: {
                    producto: producto,
                    accion: accion,
                },
            };
            return $http.post(serviceBase + "otrosServiciosDosCtrl.php", data);
        };

        //Turnos
        obj.getusuariosTurnos = function () {
            let data = {
                method: "usuariosTurnos",
            };
            return $http.post(serviceBase + "turnosCtrl.php", data);
        };

        obj.getlistaTurnos = function (fechaini, fechafin) {
            let data = {
                method: "listaTurnos",
                data: {
                    fechaini: fechaini,
                    fechafin: fechafin,
                },
            };
            return $http.post(serviceBase + "turnosCtrl.php", data);
        };

        obj.getcumplmientoTurnos = function (datos) {
            let data = {
                method: "cumpleTurnos",
                data: datos,
            };
            return $http.post(serviceBase + "turnosCtrl.php", data);
        };

        obj.getguardarTurnos = function (datosTurnos) {
            let data = {
                method: "guardarTurnos",
                data: datosTurnos,
            };
            return $http.post(serviceBase + "turnosCtrl.php", data);
        };

        obj.updateTurnos = function (datos) {
            let data = {
                method: "updateTurno",
                data: {
                    datos: datos,
                },
            };
            return $http.post(serviceBase + "updateTurno.php", data);
        };

        obj.csvAdherenciaTurnos = function (fechaIni, fechaFin) {
            let data = {
                method: "CsvExporteAdherencia",
                data: {
                    fechaIni: fechaIni,
                    fechaFin: fechaFin,
                },
            };
            return $http.post(serviceBase + "turnosCtrl.php", data);
        };

        obj.borrarTurno = function (idTurno) {
            let data = {
                method: "deleteTurno",
                data: idTurno,
            };
            return $http.post(serviceBase + "turnosCtrl.php", data);
        };

        /* -------------------------------- SOPORTE GPON -------------------------------- */

        obj.getPendientesSoporteGpon = function (task) {
            let data = {
                method: "getSoporteGponByTask",
                data: task,
            };
            return $http.post(serviceBase + "soporteGponCtrl.php", data);
        };

        obj.validarLlenadoSoporteGpon = function (task) {
            let data = {
                method: "validarLlenadoSoporteGpon",
                data: task,
            };
            return $http.post(serviceBase + "soporteGponCtrl.php", data);
        };

        obj.BuscarSoporteGpon = function (pedido) {
            let data = {
                method: "BuscarSoporteGpon",
                data: {pedido: pedido},
            };
            return $http.post(serviceBase + "soporteGponCtrl.php", data);
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
            let data = {
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
            return $http.post(serviceBase + "soporteGponCtrl.php", data);
        };

        obj.getListaPendientesSoporteGpon = function () {
            let data = {
                method: "getListaPendientesSoporteGpon",
            };
            return $http.post(serviceBase + "soporteGponCtrl.php", data);
        };

        obj.gestionarSoporteGpon = function (
            id_soporte,
            tipificacion,
            tipificaciones,
            observacion,
        ) {
            let data = {
                method: "gestionarSoporteGpon",
                data: {
                    id_soporte: id_soporte,
                    tipificacion: tipificacion,
                    tipificaciones: tipificaciones,
                    observacion: observacion,
                },
            };
            return $http.post(serviceBase + "soporteGponCtrl.php", data);
        };

        obj.registrossoportegpon = function (datos) {
            let data = {
                method: "registrossoportegpon",
                data: datos,
            };
            return $http.post(serviceBase + "soporteGponCtrl.php", data);
        };

        obj.expCsvRegistrosSoporteGpon = function (datos) {
            let data = {
                method: "csvRegistrosSoporteGpon",
                data: {
                    datos,
                },
            };
            return $http.post(serviceBase + "soporteGponCtrl.php", data);
        };

        obj.buscarhistoricoSoporteGpon = function (datos) {
            let data = {
                method: "buscarhistoricoSoporteGpon",
                data: datos,
            };
            return $http.post(serviceBase + "soporteGponCtrl.php", data);
        };

        /**
         * TODO no existe
         */

        obj.marcarEngestionGpon = function (datos, login) {
            let data = {
                method: "marcarEngestionGpon",
                data: {
                    datos: datos,
                    login: login,
                },
            };
            return $http.post(serviceBase + "soporteGponCtrl.php", data);
        };

        /* --------------- CODIGO INCOMPLETO ---------------- */

        obj.getListaCodigoIncompleto = function (datos) {
            let data = {
                method: "getListaCodigoIncompleto",
                data: datos,
            };
            return $http.post(serviceBase + "codigoIncompletoCtrl.php", data);
        };

        obj.gestionarCodigoIncompleto = function (
            id_codigo_incompleto,
            tipificacion,
            observacion
        ) {
            let data = {
                method: "gestionarCodigoIncompleto",
                data: {
                    id_codigo_incompleto: id_codigo_incompleto,
                    tipificacion: tipificacion,
                    observacion: observacion,
                },
            };
            return $http.post(serviceBase + "codigoIncompletoCtrl.php", data);
        };

        obj.registroscodigoincompleto = function (datos) {
            let data = {
                method: "registroscodigoincompleto",
                data: datos
            };
            return $http.post(serviceBase + "codigoIncompletoCtrl.php", data);
        };

        obj.expCsvRegistrosCodigoIncompleto = function (datos) {
            let data = {
                method: "csvRegistrosCodigoIncompleto",
                data: datos,
            };
            return $http.post(serviceBase + "codigoIncompletoCtrl.php", data);
        };

        /**
         * services nivelacion
         */

        obj.searchTicket = function (datos) {
            let data = {
                method: "saveTicket",
                data: datos,
            };
            return $http.post(serviceBase + "nivelacionCtrl.php", data);
        };

        obj.searchIdTecnic = function (datos) {
            let data = {
                method: "searchIdTecnic",
                data: datos,
            };
            return $http.post(serviceBase + "nivelacionCtrl.php", data);
        };

        obj.saveNivelation = function (datos) {
            let data = {
                method: "saveNivelation",
                data: datos,
            };
            return $http.post(serviceBase + "nivelacionCtrl.php", data);
        };

        obj.en_genstion_nivelacion = function () {
            let data = {
                method: "en_genstion_nivelacion",
            };
            return $http.post(serviceBase + "nivelacionCtrl.php", data);
        };

        obj.buscarhistoricoNivelacion = function (datos) {
            let data = {
                method: "buscarhistoricoNivelacion",
                data: datos,
            };
            return $http.post(serviceBase + "nivelacionCtrl.php", data);
        };

        obj.gestionarNivelacion = function (curPage, pageSize, sort) {
            let data = {
                method: "gestionarNivelacion",
                data: {
                    curPage: curPage,
                    pageSize: pageSize,
                    sort: sort,
                },
            };
            return $http.post(serviceBase + "nivelacionCtrl.php", data);
        };

        obj.gestionarRegistrosNivelacion = function (curPage, pageSize, sort) {
            let data = {
                method: "gestionarRegistrosNivelacion",
                data: {
                    curPage: curPage,
                    pageSize: pageSize,
                    sort: sort,
                },
            };
            return $http.post(serviceBase + "nivelacionCtrl.php", data);
        };

        obj.guardaNivelacion = function (datos) {
            let data = {
                method: "guardaNivelacion",
                data: datos,
            };
            return $http.post(serviceBase + "nivelacionCtrl.php", data);
        };

        obj.marcarEnGestionNivelacion = function (datos) {
            let data = {
                method: "marcarEnGestionNivelacion",
                data: datos,
            };
            return $http.post(serviceBase + "nivelacionCtrl.php", data);
        };

        obj.csvNivelacion = function (datos) {
            let data = {
                method: "csvNivelacion",
                data: {
                    datos: datos,
                },
            };
            return $http.post(serviceBase + "nivelacionCtrl.php", data);
        };

        /*
        kpi
        */

        obj.contigenciaDiario = function (datos) {
            let data = {
                method: "contigenciaDiario",
                data: datos,
            };
            return $http.post(serviceBase + "kpiCtrl.php", data);
        };

        obj.contigenciaAgente = function (datos) {
            let data = {
                method: "contigenciaAgente",
                data: datos,
            };
            return $http.post(serviceBase + "kpiCtrl.php", data);
        };

        obj.contigenciaHoraAgente = function (datos) {
            let data = {
                method: "contigenciaHoraAgente",
                data: datos,
            };
            return $http.post(serviceBase + "kpiCtrl.php", data);
        };

        obj.contigenciaHoraAgenteApoyo = function (datos) {
            let data = {
                method: "contigenciaHoraAgenteApoyo",
                data: datos,
            };
            return $http.post(serviceBase + "kpiCtrl.php", data);
        };

        obj.contigenciaHoraAgenteTiempoCompleto = function (datos) {
            let data = {
                method: "contigenciaHoraAgenteTiempoCompleto",
                data: datos,
            };
            return $http.post(serviceBase + "kpiCtrl.php", data);
        };

        obj.contigenciaHoraAgenteMmss = function (datos) {
            let data = {
                method: "contigenciaHoraAgenteMmss",
                data: datos,
            };
            return $http.post(serviceBase + "kpiCtrl.php", data);
        };

        obj.contigenciaHoraAgenteEmtelco = function (datos) {
            let data = {method: 'AgenteEmtelco', data: datos}
            return $http.post(serviceBase + 'kpiCtrl.php', data);

        }

        obj.quitarUsuarioKpi = function (datos) {
            let data = {method: 'quitarUsuarioKpi', data: datos}
            return $http.post(serviceBase + 'kpiCtrl.php', data);

        }


        /**
         * services ventas instale
         */

        obj.datosVentas = function () {
            let data = {
                method: "datosVentas",
            };
            return $http.post(serviceBase + "ventaInstaleCtrl.php", data);
        };

        obj.datosVentasInstaleTerminado = function (datos) {
            let data = {
                method: "datosVentasTerminado",
                data: datos,
            };
            return $http.post(serviceBase + "ventaInstaleCtrl.php", data);
        };

        obj.marcarEnGestionVentaInstale = function (datos) {
            let data = {
                method: "marcarEnGestionVentaInstale",
                data: {
                    data: datos,
                },
            };
            return $http.post(serviceBase + "ventaInstaleCtrl.php", data);
        };

        obj.guardaVentaInstale = function (datos) {
            let data = {
                method: "guardaVentaInstale",
                data: {
                    data: datos,
                },
            };
            return $http.post(serviceBase + "ventaInstaleCtrl.php", data);
        };

        obj.detallePedidoVenta = function (datos) {
            let data = {
                method: "detallePedidoVenta",
                data: datos,
            };
            return $http.post(serviceBase + "ventaInstaleCtrl.php", data);
        };

        obj.detalleVentaRagoFecha = function (datos) {
            let data = {
                method: "detalleVentaRagoFecha",
                data: datos,
            };
            return $http.post(serviceBase + "ventaInstaleCtrl.php", data);
        };

        obj.csvVentaInstale = function (datos) {
            let data = {
                method: "csvVentaInstale",
                data: {
                    data: datos,
                },
            };
            return $http.post(serviceBase + "ventaInstaleCtrl.php", data);
        };

        obj.guardaObservacionParaVentaInstale = function (datos) {
            let data = {
                method: "guardaObservacionParaVentaInstale",
                data: {
                    data: datos,
                },
            };
            return $http.post(serviceBase + "ventaInstaleCtrl.php", data);
        };

        obj.observacionDetalleVentaModal = function (datos) {
            let data = {
                method: "observacionDetalleVentaModal",
            };
            return $http.post(serviceBase + "ventaInstaleCtrl.php", data);
        };

        obj.eliminaObservacion = function (datos) {
            let data = {
                method: "eliminaObservacion",
                data: {
                    data: datos,
                },
            };
            return $http.post(serviceBase + "ventaInstaleCtrl.php", data);
        };

        obj.consolidadoZona = function (datos) {
            let data = {
                method: "consolidadoZona",
                data: datos,
            };
            return $http.post(serviceBase + "ventaInstaleCtrl.php", data);
        };

        /**
         * !nuevo quejas go
         */

        obj.datosQuejasGo = function () {
            let data = {method: 'datosQuejasGo'}
            return $http.post(serviceBase + 'gestionQuejasGoCtrl.php', data);
        }

        obj.datosQuejasGoTerminado = function (datos) {
            let data = {method: 'datosQuejasGoTerminado', data: datos}
            return $http.post(serviceBase + 'gestionQuejasGoCtrl.php', data);
        }

        obj.marcarEnGestionQuejasGo = function (datos) {
            let data = {method: 'marcarEnGestionQuejasGo', data: datos}
            return $http.post(serviceBase + 'gestionQuejasGoCtrl.php', data);
        }

        obj.guardaGestionQuejasGo = function (datos) {
            let data = {method: 'guardaGestionQuejasGo', data: datos}
            return $http.post(serviceBase + 'gestionQuejasGoCtrl.php', data);
        }

        obj.detalleNumeroQuejaGo = function (datos) {
            let data = {method: 'detalleNumeroQuejaGo', data: datos}
            return $http.post(serviceBase + 'gestionQuejasGoCtrl.php', data);
        }

        obj.csvQuejaGo = function (datos) {
            let data = {method: 'csvQuejaGo', data: datos}
            return $http.post(serviceBase + 'gestionQuejasGoCtrl.php', data);
        }

        /**
         * admin menu - perfil
         */

        obj.getMenu = function (datos) {
            let data = {method: 'getMenu'}
            return $http.post(serviceBase + 'MenuPerfilCtrl.php', data);
        }

        obj.getSubmenu = function (datos) {
            let data = {method: 'getSubmenu'}
            return $http.post(serviceBase + 'MenuPerfilCtrl.php', data);
        }

        obj.getPerfil = function (datos) {
            let data = {method: 'getPerfil'}
            return $http.post(serviceBase + 'MenuPerfilCtrl.php', data);
        }

        obj.verMenuPerfil = function (datos) {
            let data = {method: 'verMenuPerfil', data: datos}
            return $http.post(serviceBase + 'MenuPerfilCtrl.php', data);
        }

        obj.cambioMenu = function (datos) {
            let data = {method: 'cambioMenu', data: datos}
            return $http.post(serviceBase + 'MenuPerfilCtrl.php', data);
        }

        obj.cambiaEstadoSubmenu = function (datos) {
            let data = {method: 'cambiaEstadoSubmenu', data: datos}
            return $http.post(serviceBase + 'MenuPerfilCtrl.php', data);
        }

        obj.guardaNuevoSubmenu = function (datos) {
            let data = {method: 'guardaNuevoSubmenu', data: datos}
            return $http.post(serviceBase + 'MenuPerfilCtrl.php', data);
        }

        obj.guardaPerfil = function (datos) {
            let data = {method: 'guardaPerfil', data: datos}
            return $http.post(serviceBase + 'MenuPerfilCtrl.php', data);
        }

        /**
         * Validaciones app
         */

        obj.estadoActualValidacionApp = function () {
            let data = {
                method: 'estadoActualValidacionApp'
            }
            return $http.post(serviceBase + 'validacionesAppCtrl.php', data);
        }

        obj.cambiaValidacionApp = function (datos) {
            let data = {
                method: 'cambiaValidacionApp',
                data: datos
            }
            return $http.post(serviceBase + 'validacionesAppCtrl.php', data);
        }

        obj.checkSession = function () {
            let data = {
                method: 'checkSession',
            }
            return $http.post(serviceBase + 'authenticationCtrl.php', data);
        }

        obj.windowsBridge = function (datos) {
            let data = {
                method: 'Puente',
                data: datos
            }
            return $http.post(serviceBase + 'PuenteCtrl.php', data);
        }

        /**
         * registroEquipos
         */

        obj.registroEquipos = function (datos) {
            let data = {
                method: 'registroEquipos',
                data: datos
            }
            return $http.post(serviceBase + 'registroEquiposCtrl.php', data);
        }

        obj.acualizaTecnicos = function (datos) {
            let data = {
                method: 'acualizaTecnicos',
                data: datos
            }
            return $http.post(serviceBase + 'userCtrl.php', data);
        };

        return obj;
    }

})();

