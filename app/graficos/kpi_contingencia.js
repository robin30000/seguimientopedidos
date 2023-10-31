(function () {
    "use strict";
    angular.module("seguimientopedidos").controller("GraficosContingeciaCtrl", GraficosContingeciaCtrl);
    GraficosContingeciaCtrl.$inject = ["$scope", "$http", "$rootScope", "$route", "services", "$uibModal", "$log"];

    function GraficosContingeciaCtrl($scope, $http, $rootScope, $route, services, $uibModal, $log) {
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
                        $scope.colors.push("#000055");
                    }
                    if (value.TV) {
                        $scope.acepta21.push(value.TV);
                        $scope.colors.push("#37c846");
                    }
                    $scope.labels.push(value.Fecha);
                });

                $scope.data = [$scope.acepta21, $scope.acepta20];
                $scope.options = {
                    scales: {
                        xAxes: [{
                            stacked: true
                        }],
                        yAxes: [{
                            stacked: true
                        }]
                    },
                    legend: {
                        display: true, // Mostrar la leyenda
                        onClick: function (e, legendItem) {
                            var index = legendItem.datasetIndex;
                            var meta = this.chart.getDatasetMeta(index);
                            meta.hidden = meta.hidden === null ? !this.chart.data.datasets[index].hidden : null;
                            this.chart.update();
                        }
                    },
                    elements: {
                        rectangle: {
                            backgroundColor: $scope.colors, // Colores de fondo de las barras
                            borderColor: 'black', // Color del borde de las barras
                            borderWidth: 1 // Ancho del borde de las barras
                        }
                    }
                }
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
                        $scope.colors1.push("#b6be74");
                    }
                    if (value.TV) {
                        $scope.aceptaTv.push(value.TV);
                        $scope.colors1.push("#218094");
                    }

                    $scope.labels1.push(value.agente);
                });

                var sumas = $scope.aceptaInternet.map((value, index) => parseInt(value) + parseInt($scope.aceptaTv[index]));
                var indicesOrdenados = sumas.map((_, i) => i).sort((a, b) => sumas[b] - sumas[a]);

                $scope.aceptaInternet = indicesOrdenados.map((index) => $scope.aceptaInternet[index]);
                $scope.aceptaTv = indicesOrdenados.map((index) => $scope.aceptaTv[index]);
                $scope.labels1 = indicesOrdenados.map((index) => $scope.labels1[index]);
                $scope.data1 = [$scope.aceptaInternet, $scope.aceptaTv];

                $scope.options1 = {
                    scales: {
                        xAxes: [{
                            stacked: true
                        }],
                        yAxes: [{
                            stacked: true
                        }]
                    },
                    legend: {
                        display: true, // Mostrar la leyenda
                        onClick: function (e, legendItem) {
                            var index = legendItem.datasetIndex;
                            var meta = this.chart.getDatasetMeta(index);
                            meta.hidden = meta.hidden === null ? !this.chart.data.datasets[index].hidden : null;
                            this.chart.update();
                        }
                    }
                }
            });
        }

        function contigenciaHoraAgente() {
            let data = {
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
                $scope.apoyouser = data.data.user;
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
            let data = {fecha: fechaApoyo, estado: estado, producto: producto};
            contigenciaHoraAgenteApoyo(data);
        };

        function contigenciaHoraAgenteTiempoCompleto(data) {
            services.contigenciaHoraAgenteTiempoCompleto(data).then(function (data) {
                $scope.tiempoCompleto = data.data.data;
                $scope.tiempoCompletouser = data.data.user;
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
            let data = {fecha: fechaTiempo, estado: estado, producto: producto};
            contigenciaHoraAgenteTiempoCompleto(data);
        };

        function contigenciaHoraAgenteMmss(data) {
            services.contigenciaHoraAgenteMmss(data).then(function (data) {
                $scope.mmss = data.data.data;
                $scope.mmssuser = data.data.user;
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
            let data = {'estado': $scope.estadoTabla, 'producto': $scope.productoTabla, 'fecha': $scope.fecha_gestion}
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

        $scope.consultaTablaEmtelco = function (fechamms, estado, producto) {
            let data = {fecha: fechamms, estado: estado};
            contigenciaHoraAgenteEmtelco(data);
        }

        $scope.mmssConsulta = function (fechamms, estado, producto) {
            let data = {fecha: fechamms, estado: estado, producto: producto};
            contigenciaHoraAgenteMmss(data);
        };

        $scope.consultaproducto = function () {
            let data = {estado: $scope.estadoDia, producto: $scope.productoDia};
            consultaContingenciaAgente(data);
        };

        $scope.cunsultaproducto20 = function () {
            let data = {estado: $scope.estado20, producto: $scope.producto20};
            consultaContingenciaDiario(data);
        };

        $scope.ModificarUsuarioTiempoCompleto = (data, tabla) => {
            $scope.datos = {data: data, tabla: tabla}
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'partial/modals/usuarioKpi.html',
                controller: 'ModalInstanceUsuarioKpiCtrl',
                controllerAs: '$ctrl',
                size: 'md',
                resolve: {
                    items: function () {
                        return $scope.datos;
                    }
                }
            });

            modalInstance.result.then(function () {
            }, function () {
                console.log($scope.datosMenu);
                $log.info('Modal dismissed at: ' + new Date());
            });
        }
    }
})();
