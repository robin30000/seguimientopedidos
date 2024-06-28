(function () {
    "use strict";
    angular.module("seguimientopedidos").controller("ClasificadorGeco", ClasificadorGeco);
    ClasificadorGeco.$inject = ["$scope", "$rootScope", "services", "$route", "$sce", "$cookies", "$location", "$uibModal", "$log", "$interval", "$timeout"];

    function ClasificadorGeco($scope, $rootScope, services, $route, $sce, $cookies, $location, $uibModal, $log, $interval, $timeout) {

        var tiempo = new Date().getTime();
        var date1 = new Date();
        var year = date1.getFullYear();
        var month = date1.getMonth() + 1 <= 9 ? "0" + (date1.getMonth() + 1) : date1.getMonth() + 1;
        var day = date1.getDate() <= 9 ? "0" + date1.getDate() : date1.getDate();

        tiempo = year + "-" + month + "-" + day;
        $scope.Geco = {};
        init();

        function init() {

            nuevo();
        }


        function nuevo() {
            services.myService('', 'ClasificadorGecoCtrl.php', 'ClasificadorGeco').then((data) => {
                $scope.empresas = data.data.data;

                let datos = data.data.data1;

                $scope.datosAgrupados = [];
                $scope.totalConsolidado = 0;
                $scope.regionVisibility = {}; // Añadir un objeto para controlar la visibilidad de cada región

                function agruparDatos(datos) {
                    let agrupados = {};
                    let totalConsolidadoGlobal = 0;

                    datos.forEach(function (dato) {
                        let keyRegion = `${dato.REGION_TECNICO}`;
                        let key = `${dato.REGION_TECNICO}|${dato.ZONA_TECNICO}|${dato.COD_FUNCIONARIO}|${dato.PEDIDO_ID}|${dato.HABILIDADES_TECNICO}|${dato.ACTIVIDAD}|${dato.TECNICO}|${dato.ACTIVIDAD_TRABAJO}|${dato.MICROZONA_TAREA}`;

                        if (!agrupados[keyRegion]) {
                            agrupados[keyRegion] = {
                                datos: {},
                                totalRegion: 0
                            };
                            $scope.regionVisibility[keyRegion] = true;
                        }

                        if (!agrupados[keyRegion].datos[key]) {
                            agrupados[keyRegion].datos[key] = {
                                REGION_TECNICO: dato.REGION_TECNICO,
                                ZONA_TECNICO: dato.ZONA_TECNICO,
                                COD_FUNCIONARIO: dato.COD_FUNCIONARIO,
                                PEDIDO_ID: dato.PEDIDO_ID,
                                HABILIDADES_TECNICO: dato.HABILIDADES_TECNICO,
                                ACTIVIDAD: dato.ACTIVIDAD,
                                TECNICO: dato.TECNICO,
                                ACTIVIDAD_TRABAJO: dato.ACTIVIDAD_TRABAJO,
                                MICROZONA_TAREA: dato.MICROZONA_TAREA,
                                Total: 0
                            };
                        }

                        agrupados[keyRegion].datos[key].Total += 1;
                        agrupados[keyRegion].totalRegion += 1;
                        totalConsolidadoGlobal += 1;
                    });

                    $scope.totalConsolidado = totalConsolidadoGlobal;

                    let result = [];
                    for (let region in agrupados) {
                        result.push({
                            region: region,
                            totalRegion: agrupados[region].totalRegion,
                            datos: Object.values(agrupados[region].datos)
                        });
                    }

                    return result;
                }

                $scope.datosAgrupados = agruparDatos(datos);

                $scope.searchQuery = '';

                $scope.filterBySearchQuery = function (regionData) {
                    if (!$scope.searchQuery) {
                        return true;
                    }

                    let query = $scope.searchQuery.toLowerCase();
                    let matchFound = false;

                    regionData.datos.forEach(function (data) {
                        if (
                            data.ZONA_TECNICO.toLowerCase().includes(query) ||
                            data.LOGIN_TECNICO.toLowerCase().includes(query) ||
                            (data.PEDIDO_ID && data.PEDIDO_ID.toLowerCase().includes(query)) ||
                            data.HABILIDADES_TECNICO.toLowerCase().includes(query) ||
                            data.ACTIVIDAD.toLowerCase().includes(query) ||
                            data.TECNICO.toLowerCase().includes(query)
                        ) {
                            matchFound = true;
                        }
                    });

                    return matchFound;
                };

                $scope.toggleRegionVisibility = function (region) {
                    $scope.regionVisibility[region] = !$scope.regionVisibility[region];
                };


                $scope.highlightFilter = 'all';

                $scope.isHighlighted = function (data) {
                    return (data.ACTIVIDAD === 'MASIVA' && (data.TECNICO === 'LIGERO' || data.TECNICO === 'AJUSTADO')) ||
                        (data.ACTIVIDAD === 'LIGERA' && data.TECNICO === 'MASIVO') ||
                        (data.ACTIVIDAD === 'AJUSTADA' && data.TECNICO === 'MASIVO') ||
                        (data.ACTIVIDAD === 'AJUSTADA' && data.TECNICO === 'LIGERA');
                };

                $scope.applyHighlightFilter = function () {
                    $scope.highlightedFilter = function (data) {
                        switch ($scope.highlightFilter) {
                            case 'highlighted':
                                return $scope.isHighlighted(data);
                            case 'notHighlighted':
                                return !$scope.isHighlighted(data);
                            case 'all':
                            default:
                                return true;
                        }
                    };
                };

                $scope.applyHighlightFilter();

            }).catch((e) => {
                console.log(e)
            })
        }

        $scope.exporte = () => {
            $scope.loading = true;
            services.myService('', 'ClasificadorGecoCtrl.php', 'ClasificadorGeco').then((data) => {
                $scope.loading = false;
                if (data.data.state) {

                    var wb = XLSX.utils.book_new();
                    var ws = XLSX.utils.json_to_sheet(data.data.data1);
                    XLSX.utils.book_append_sheet(wb, ws, 'clasificador-geco');
                    XLSX.writeFile(wb, 'ClasificadorGeco_' + tiempo + '.xlsx');
                }

            }).catch((error) => {
                console.log(error);
            })
        }
    }
})();
