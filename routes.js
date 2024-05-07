app.config(routesConfig).run(runConfig);

function routesConfig($routeProvider, $locationProvider, $compileProvider) {
    $locationProvider.html5Mode(true).hashPrefix('!');
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(whatsapp|http|https|itms):/);
    $routeProvider
        .when("/", {
            title: "Login",
            templateUrl: "./partial/login.html",
            controller: "loginCtrl",
        }).when("/actividades", {
        title: "Documentación de Pedidos",
        templateUrl: "./partial/actividades.html",
        controller: "actividadesCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/registros", {
        title: "Registros",
        templateUrl: "./partial/registros.html",
        controller: "registrosCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/registrossoportegpon", {
        title: "Registros Soporte GPON",
        templateUrl: "./partial/registrossoportegpon.html",
        controller: "registrossoportegponCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/registroscodigoincompleto", {
        title: "Registros Codigo incompleto",
        templateUrl: "./partial/registroscodigoincompleto.html",
        controller: "registroscodigoincompletoCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/usuarios", {
        title: "Usuarios",
        templateUrl: "./partial/usuarios.html",
        controller: "usuariosCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/tecnicos", {
        title: "Tecnicos",
        templateUrl: "./partial/tecnicos.html",
        controller: "tecnicosCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/mesaoffline/mesaoffline", {
        title: "Mesa Offline",
        templateUrl: "./partial/mesaoffline/mesaoffline.html",
        controller: "mesaofflineCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/mesaoffline/registrosOffline", {
        title: "Registros Offline",
        templateUrl: "./partial/mesaoffline/registrosOffline.html",
        controller: "registrosOfflineCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/brutalForce", {
        title: "Brutal Force",
        templateUrl: "./partial/brutalForce.html",
        controller: "brutalForceCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/contingencias", {
        title: "Contingencias aprovisionamiento",
        templateUrl: "./partial/contingencias.html",
        controller: "contingenciasCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/nivelacion", {
        title: "Gestión Nivelación",
        templateUrl: "./partial/nivelacion.html",
        controller: "nivelacionCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/GestionNivelacion", {
        title: "Gestión Nivelación",
        templateUrl: "./partial/GestionNivelacion.html",
        controller: "GestionNivelacionCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/Gestioncontingencias", {
        title: "Gestión Contingencias",
        templateUrl: "./partial/Gestioncontingencias.html",
        controller: "GestioncontingenciasCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/registros-contingencias", {
        title: "Registros Contingencias",
        templateUrl: "./partial/registros-contingencias.html",
        controller: "RegistroContingenciasCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/gestionsoportegpon", {
        title: "Gestión Soporte Gpon",
        templateUrl: "./partial/Gestionsoportegpon.html",
        controller: "GestionsoportegponCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/gestioncodigoincompleto", {
        title: "Registros Código Incompleto",
        templateUrl: "./partial/Gestioncodigoincompleto.html",
        controller: "GestioncodigoincompletoCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/premisasInfraestructuras", {
        title: "Premisas Infraestructuras",
        templateUrl: "./partial/premisasInfraestructuras.html",
        controller: "premisasInfraestructurasCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/novedadesVisita", {
        title: "Novedades Visita",
        templateUrl: "./partial/novedadesVisita.html",
        controller: "novedadesVisitaCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/contrasenaClick", {
        title: "Contraseñas ClickSoftware",
        templateUrl: "./partial/contrasenaClick.html",
        controller: "contrasenasClickCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/quejasGo", {
        title: "Quejas Gestión Operativa",
        templateUrl: "./partial/quejasGo.html",
        controller: "quejasGoCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/gestion-quejasGo", {
        title: "Gestión QuejasGo",
        templateUrl: "./partial/gestionQuejasGo.html",
        controller: "quejasGoCtrl2",
        resolve: {
            userData: loadUserData
        }
    }).when("/consultaSara", {
        title: "Consulta SARA",
        templateUrl: "./partial/consultaSara.html",
        controller: "saraCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/KPI-Contingencia", {
        title: "KPI Contingecia",
        templateUrl: "./partial/graficos/graficos-contingecia.html",
        controller: "GraficosContingeciaCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/gestion-ventas-instaleTiendas", {
        title: "Gestion Ventas Instale",
        templateUrl: "./partial/ventasInstale/VentasInstaleTiendas.html",
        controller: "gestionVentasInstaleTiendasCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/perfil-menu", {
        title: "Administracion menu - perfiles",
        templateUrl: "./partial/menu-perfil.html",
        controller: "MenuPerfilCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when('/validaciones-app', {
        title: 'Validaciones App',
        templateUrl: './partial/validaciones-app.html',
        controller: 'validacionesAppCtrl',
        resolve: {
            userData: loadUserData
        }
    }).when('/registro-equipos', {
        title: 'Registro equipos',
        templateUrl: './partial/registro_equipo.html',
        controller: 'registroEquipoCtrl',
        resolve: {
            userData: loadUserData
        }
    }).when("/tiempos", {
        title: "Graficos tiempos",
        templateUrl: "./partial/graficos/tiempos.html",
        controller: "tiemposCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/ruteo", {
        title: "Graficos ruteo",
        templateUrl: "./partial/graficos/ruteo.html",
        controller: "ruteoCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/consultas", {
        title: "Conteo consultas",
        templateUrl: "./partial/consultas.html",
        controller: "ConteoCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/activación-toip", {
        title: "Activación Toip",
        templateUrl: "./partial/activacion_toip.html",
        controller: "ActivacionToipCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/etp", {
        title: "Gestión ETP",
        templateUrl: "./partial/etp.html",
        controller: "etpCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/registros-etp", {
        title: "Registros ETP",
        templateUrl: "./partial/registros-etp.html",
        controller: "RegistrosEtpCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/kpi-toip", {
        title: "KPI Toip",
        templateUrl: "./partial/graficos/kpi-toip.html",
        controller: "GraficoToipCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/kpi-etp", {
        title: "KPI ETP",
        templateUrl: "./partial/graficos/kpi-etp.html",
        controller: "GraficoEtpCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/kpi-gpon", {
        title: "KPI GPON",
        templateUrl: "./partial/graficos/kpi-gpon.html",
        controller: "GraficoGponCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/kpi-mesas-nacionales", {
        title: "KPI MESAS NACIONALES",
        templateUrl: "./partial/graficos/kpi-mesas-nacionales.html",
        controller: "GraficoMnCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/kpi-quejasgo", {
        title: "KPI QuejasGo",
        templateUrl: "./partial/graficos/kpi-quejasgo.html",
        controller: "GraficoQuejasCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/mesas-nacionales", {
        title: "Mesas nacionales",
        templateUrl: "./partial/mesas-nacionales.html",
        controller: "MesasNacionalesCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/kpi-rgu", {
        title: "KPI-RGU",
        templateUrl: "./partial/graficos/kpi-rgus.html",
        controller: "RguCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/mesas-nacionales", {
        title: "Mesas nacionales",
        templateUrl: "./partial/mesas-nacionales.html",
        controller: "MesasNacionalesCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/kpi-cco", {
        title: "KPI CCO",
        templateUrl: "./partial/graficos/kpi-cco.html",
        controller: "kpiCcoCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/supervisor", {
        title: "Supervisor",
        templateUrl: "./partial/supervisor.html",
        controller: "SupervisorCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/registro-fallas", {
        title: "Registrar fallas",
        templateUrl: "./partial/falla-sistema/registro-fallas.html",
        controller: "registroFallasCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/mi-registro-falla", {
        title: "Mi Registro de Falla",
        templateUrl: "./partial/falla-sistema/mi-registro-fallas.html",
        controller: "miRegistroFallasCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/todos-registros-fallas", {
        title: "Registros Fallas",
        templateUrl: "./partial/falla-sistema/registros-fallas-sistema.html",
        controller: "registrosFallasCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/kpi-fallas-sistemas", {
        title: "KPI Fallas",
        templateUrl: "./partial/falla-sistema/kpi-fallas-sistemas.html",
        controller: "kpiFallasCtrl",
        resolve: {
            userData: loadUserData
        }
    }).when("/gestion-fallas", {
        title: "Gestión Fallas",
        templateUrl: "./partial/falla-sistema/gestion-fallas.html",
        controller: "gestionFallasCtrl",
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