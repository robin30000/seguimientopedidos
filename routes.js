angular.module('seguimientopedidos').config(routesConfig).run(runConfig);

function routesConfig($routeProvider, $locationProvider, $compileProvider) {
    $locationProvider.html5Mode(true).hashPrefix('!');
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(whatsapp|http|https|itms):/);
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
            //authorize: true,
            resolve: {
                userData: loadUserData
            }
        })

        .when("/registros", {
            title: "Registros",
            templateUrl: "partial/registros.html",
            controller: "registrosCtrl",
            //authorize: true,
            resolve: {
                userData: loadUserData
            }
        })

        .when("/registrossoportegpon", {
            title: "Registros Soporte GPON",
            templateUrl: "partial/registrossoportegpon.html",
            controller: "registrossoportegponCtrl",
            //authorize: true,
            resolve: {
                userData: loadUserData
            }
        })

        .when("/registroscodigoincompleto", {
            title: "Registros Codigo incompleto",
            templateUrl: "partial/registroscodigoincompleto.html",
            controller: "registroscodigoincompletoCtrl",
            //authorize: true,
            resolve: {
                userData: loadUserData
            }
        })

        .when("/usuarios", {
            title: "Usuarios",
            templateUrl: "partial/usuarios.html",
            controller: "usuariosCtrl",
            //authorize: true,
            resolve: {
                userData: loadUserData
            }
        })

        .when("/tecnicos", {
            title: "Tecnicos",
            templateUrl: "partial/tecnicos.html",
            controller: "tecnicosCtrl",
            //authorize: true,
            resolve: {
                userData: loadUserData
            }
        })

        .when("/listadoAlarmas", {
            title: "Alarmas",
            templateUrl: "partial/listadoAlarmas.html",
            controller: "AlarmasCtrl",
            //authorize: true,
            resolve: {
                userData: loadUserData
            }
        })

        .when("/mesaoffline/mesaoffline", {
            title: "Mesa Offline",
            templateUrl: "partial/mesaoffline/mesaoffline.html",
            controller: "mesaofflineCtrl",
            //authorize: true,
            resolve: {
                userData: loadUserData
            }
        })

        .when("/mesaoffline/registrosOffline", {
            title: "Registros Offline",
            templateUrl: "partial/mesaoffline/registrosOffline.html",
            controller: "registrosOfflineCtrl",
            //authorize: true,
            resolve: {
                userData: loadUserData
            }
        })

        .when("/brutalForce", {
            title: "Brutal Force",
            templateUrl: "partial/brutalForce.html",
            controller: "brutalForceCtrl",
            //authorize: true,
            resolve: {
                userData: loadUserData
            }
        })

        .when("/contingencias", {
            title: "Contingencias aprovisionamiento",
            templateUrl: "partial/contingencias.html",
            controller: "contingenciasCtrl",
            //authorize: true,
            resolve: {
                userData: loadUserData
            }
        })
        .when("/nivelacion", {
            title: "Gestión Nivelación",
            templateUrl: "partial/nivelacion.html",
            controller: "nivelacionCtrl",
            //authorize: true,
            resolve: {
                userData: loadUserData
            }
        })

        .when("/GestionNivelacion", {
            title: "Gestión Nivelación",
            templateUrl: "partial/GestionNivelacion.html",
            controller: "GestionNivelacionCtrl",
            //authorize: true,
            resolve: {
                userData: loadUserData
            }
        })

        .when("/Gestioncontingencias", {
            title: "Gestión Contingencias",
            templateUrl: "partial/Gestioncontingencias.html",
            controller: "GestioncontingenciasCtrl",
            //authorize: true,
            resolve: {
                userData: loadUserData
            }
        })

        .when("/gestionsoportegpon", {
            title: "Gestión Soporte Gpon",
            templateUrl: "partial/Gestionsoportegpon.html",
            controller: "GestionsoportegponCtrl",
            //authorize: true,
            resolve: {
                userData: loadUserData
            }
        })

        .when("/gestioncodigoincompleto", {
            title: "Registros Código Incompleto",
            templateUrl: "partial/Gestioncodigoincompleto.html",
            controller: "GestioncodigoincompletoCtrl",
            //authorize: true,
            resolve: {
                userData: loadUserData
            }
        })

        .when("/premisasInfraestructuras", {
            title: "Premisas Infraestructuras",
            templateUrl: "partial/premisasInfraestructuras.html",
            controller: "premisasInfraestructurasCtrl",
            //authorize: true,
            resolve: {
                userData: loadUserData
            }
        })

        .when("/novedadesVisita", {
            title: "Novedades Visita",
            templateUrl: "partial/novedadesVisita.html",
            controller: "novedadesVisitaCtrl",
            //authorize: true,
            resolve: {
                userData: loadUserData
            }
        })

        .when("/contrasenaClick", {
            title: "Contraseñas ClickSoftware",
            templateUrl: "partial/contrasenaClick.html",
            controller: "contrasenasClickCtrl",
            //authorize: true,
            resolve: {
                userData: loadUserData
            }
        })

        .when("/turnos", {
            title: "Gestión turnos",
            templateUrl: "partial/turnos.html",
            controller: "turnosCtrl",
            //authorize: true,
            resolve: {
                userData: loadUserData
            }
        })

        .when("/quejasGo", {
            title: "Quejas Gestión Operativa",
            templateUrl: "partial/quejasGo.html",
            controller: "quejasGoCtrl",
            //authorize: true,
            resolve: {
                userData: loadUserData
            }
        })


        .when("/gestion-quejasGo", {
            title: "Gestión QuejasGo",
            templateUrl: "partial/gestionQuejasGo.html",
            controller: "quejasGoCtrl2",
            //authorize: true,
            resolve: {
                userData: loadUserData
            }
        })

        .when("/consultaSara", {
            title: "Consulta SARA",
            templateUrl: "partial/consultaSara.html",
            controller: "saraCtrl",
            //authorize: true,
            resolve: {
                userData: loadUserData
            }
        })

        .when("/gestion-ventas-instaleTiendas", {
            title: "Gestion Ventas Instale",
            templateUrl: "partial/ventasInstale/VentasInstaleTiendas.html",
            controller: "gestionVentasInstaleTiendasCtrl",
            //authorize: true,
            resolve: {
                userData: loadUserData
            }
        })

        .when("/perfil-menu", {
            title: "Administracion menu - perfiles",
            templateUrl: "partial/menu-perfil.html",
            controller: "MenuPerfilCtrl",
            //authorize: true,
            resolve: {
                userData: loadUserData
            }
        })

        .when('/validaciones-app', {
            title: 'Validaciones App',
            templateUrl: 'partial/validaciones-app.html',
            controller: 'validacionesAppCtrl',
            //authorize: true,
            resolve: {
                userData: loadUserData
            },
        })

        .when('/registro-equipos', {
            title: 'Registro equipos',
            templateUrl: 'partial/registro_equipo.html',
            controller: 'registroEquipoCtrl',
            //authorize: true,
            resolve: {
                userData: loadUserData
            },
        })

        .when("/KPI-Contingencia", {
            title: "KPI Contingecia",
            templateUrl: "partial/graficos/graficos-contingecia.html",
            controller: "GraficosContingeciaCtrl",
            //authorize: true,
            resolve: {
                userData: loadUserData
            }
        })

        .when("/tiempos", {
            title: "Graficos tiempos",
            templateUrl: "partial/graficos/tiempos.html",
            controller: "tiemposCtrl",
            //authorize: true,
            resolve: {
                userData: loadUserData
            }
        })

        .when("/ruteo", {
            title: "Graficos ruteo",
            templateUrl: "partial/graficos/ruteo.html",
            controller: "ruteoCtrl",
            //authorize: true,
            resolve: {
                userData: loadUserData
            }
        })

        .when("/consultas", {
            title: "Conteo consultas",
            templateUrl: "partial/consultas.html",
            controller: "ConteoCtrl",
            //authorize: true,
            resolve: {
                userData: loadUserData
            }
        })
        .when("/activación-toip", {
            title: "Activación Toip",
            templateUrl: "partial/activacion_toip.html",
            controller: "ActivacionToipCtrl",
            //authorize: true,
            resolve: {
                userData: loadUserData
            }
        })

        .when("/etp", {
            title: "Gestión ETP",
            templateUrl: "partial/etp.html",
            controller: "etpCtrl",
            //authorize: true,
            resolve: {
                userData: loadUserData
            }
        })

        .when("/registros-etp", {
            title: "Registros ETP",
            templateUrl: "partial/registros-etp.html",
            controller: "RegistrosEtpCtrl",
            //authorize: true,
            resolve: {
                userData: loadUserData
            }
        })

        .when("/kpi-toip", {
            title: "KPI TOIP",
            templateUrl: "partial/graficos/kpi-toip.html",
            controller: "GraficoToipCtrl",
            //authorize: true,
            resolve: {
                userData: loadUserData
            }
        })

        .otherwise({
            redirectTo: "/",
        })

    /*$locationProvider
       .html5Mode({
           enabled: false,
           requireBase: true,
       })
       .hashPrefix([""]);*/
}

function loadUserData($rootScope, $q, $route, $location, services, $cookies) {
    return services.checkSession().then(complete, failed);

    function complete(data) {
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
        let today = new Date();
        $rootScope.year = today.getFullYear();
        $rootScope.nombre = data.data.nombre;
        $rootScope.login = data.data.login;
        $rootScope.perfil = data.data.perfil;
        $rootScope.identificacion = data.data.identificacion;
        $rootScope.menu = data.data.menu;
        $rootScope.authenticated = true;
        $rootScope.permiso = true;

        $cookies.put("usuarioseguimiento", JSON.stringify(data.data));
        $rootScope.galletainfo = JSON.parse($cookies.get("usuarioseguimiento"));

        return data;
    }

    function failed(reason) {
        $rootScope.authenticated = false;
        if ($route.current.loginRequired) {
            let error = {
                status: 401,
                message: "Unauthorized"
            };
            return $q.reject(error);
        }
    }
}

function runConfig($rootScope, $location) {
    $rootScope.$on('$routeChangeStart', function (e, curr, prev) {

    });
    $rootScope.$on('$routeChangeSuccess', function (e, curr, prev) {
        //console.log(e, curr, prev, ' routeChangeSuccess');
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
