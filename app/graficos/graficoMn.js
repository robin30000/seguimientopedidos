(function () {
    "use strict";
    angular.module("seguimientopedidos").controller("GraficoMnCtrl", GraficoMnCtrl);
    GraficoMnCtrl.$inject = ["$scope", "$http", "$rootScope", "$route", "services", "$filter"];

    function GraficoMnCtrl($scope, $http, $rootScope, $route, services) {

        $scope.tiempo = {};

        init();

        function init() {
            graphic();
            graphicDetails();
            gestionPorHora();
        }

        $scope.formatearFecha = function (fecha) {
            var fechaDate = new Date(fecha);
            var mes = (fechaDate.getMonth() + 1).toString().padStart(2, '0');
            var dia = fechaDate.getDate().toString().padStart(2, '0');
            return mes + '-' + dia;
        };

        $scope.buscar = (data) => {
            if (!data.fecha) {
                Swal({
                    type: 'error',
                    title: 'Opss...',
                    text: 'debes ingresar la fecha de busquedad',
                    timer: 4000
                })
                return;
            }

            graphic(data);
            graphicDetails(data);
            gestionPorHora(data);
        }

        $scope.buscarFecha = (data) => {
            if (!data.fecha) {
                Swal({
                    type: 'error',
                    title: 'Opss...',
                    text: 'debes ingresar la fecha de busquedad',
                    timer: 4000
                })
                return;
            }

            graficoTiempo(data);
        }

        $scope.consultaTabla = (data) => {
            if (data == '') {
                Swal({
                    type: 'error',
                    title: 'Opss...',
                    text: 'debes ingresar algún parámetro de búsqueda',
                    timer: 4000
                })
                return;
            }

            gestionPorHora(data);
        }

        function graphic(data) {
            $scope.loading = 1;

            let datos = '';
            if (!data) {
                datos = '';
            } else {
                datos = data;
            }
            services.myService(datos, 'mesasNacionalesCtrl.php', 'graphic')
                .then((respuestas) => {
                    if (respuestas.data.state) {
                        var chart = $scope.myChart;
                        if (chart) {
                            chart.destroy();
                        }
                        $scope.loading = 0;
                        let data = respuestas.data.data;

                        const total = data.reduce((accumulator, item) => accumulator + parseInt(item.count), 0);

                        var labels = data.map(function (item) {
                            return item.tipificacion;
                        });

                        var counts = data.map(function (item) {
                            return parseInt(item.count);
                        });

                        data.forEach(item => {
                            item.color = "rgb(0, 0, 85)";
                        });

                        var colors = data.map(function (item) {
                            return item.color;
                        });

                        var ctx = document.getElementById('myChart').getContext('2d');
                        $scope.myChart = new Chart(ctx, {
                            type: 'bar',
                            data: {
                                labels: labels, // Etiquetas en el gráfico
                                datasets: [{
                                    data: counts, // Valores en el gráfico
                                    backgroundColor: colors // Asigna los colores definidos
                                }]
                            },
                            options: {
                                title: {
                                    display: true,
                                    text: 'Grafico Mesas (Consolidado: ' + total + ')',
                                    position: 'top',
                                },
                                plugins: {
                                    datalabels: {
                                        align: 'center',
                                        anchor: 'middle',
                                        color: 'white',
                                        font: {
                                            weight: 'bold',
                                            size: 12
                                        },
                                        formatter: function (value) {
                                            return value;
                                        }
                                    }
                                },
                                //maxBarThickness: 50,
                                /*legend: {
                                    display: true,
                                    position: 'bottom',
                                    padding: {
                                        bottom: 200,
                                        top: 100
                                    }
                                }*/
                            }
                        });
                    } else {
                        Swal({
                            type: 'error',
                            title: 'Opss..',
                            text: respuestas.data.msj,
                            timer: 4000,
                        })
                    }
                })
                .catch(function (error) {
                    console.error('Error al realizar las peticiones:', error);
                });
        }

        function graphicDetails(data) {
            $scope.loading = 1;

            let datos = '';
            if (!data) {
                datos = '';
            } else {
                datos = data;
            }
            services.myService(datos, 'mesasNacionalesCtrl.php', 'graphicDetails')
                .then((respuestas) => {
                    if (respuestas.data.state) {
                        var chart = $scope.myChart1;
                        if (chart) {
                            chart.destroy();
                        }
                        $scope.loading = 0;
                        let datos = respuestas.data.data;

                        if (Array.isArray(datos)) {
                            var data = datos.reduce(function (acc, current) {
                                var tipificacion = current.tipificacion;

                                var existingItem = acc.find(item => item.tipificacion === tipificacion);

                                if (!existingItem) {
                                    acc.push(current);
                                } else {
                                    existingItem.count = String(parseInt(existingItem.count) + parseInt(current.count));
                                }

                                return acc;
                            }, []);
                        }

                        function asignarColor(tipificacion) {
                            switch (tipificacion) {
                                case "Finalizado":
                                    return "rgb(55, 200, 70)"
                                case "No finalizado con éxito":
                                    return "rgb(0, 0, 85)";
                                case "Sin gestión":
                                    return "rgb(240, 120, 30)";
                                case "Devuelto al técnico por mal ingreso":
                                    return "rgb(255, 190, 0)";
                                case "Cliente ilocalizado":
                                    return "rgb(0, 55, 123)";
                                case "Cliente acepta el cambio":
                                    return "rgb(0, 200, 255)";
                                case "Cliente no autoriza":
                                    return "rgb(0, 200, 150)";
                                default:
                                    return "#000000";
                            }
                        }

                        const total = data.reduce((accumulator, item) => accumulator + parseInt(item.count), 0);

                        //var labels = [...new Set(data.map(item => item.tipificacion))];


                        var labels = data.map(function (item) {
                            return item.tipificacion;
                        });

                        var counts = data.map(function (item) {
                            return parseInt(item.count);
                        });

                        data.forEach(item => {
                            item.color = asignarColor(item.tipificacion)
                        });

                        var colors = data.map(function (item) {
                            return item.color;
                        });

                        var ctx1 = document.getElementById('myChart1').getContext('2d');
                        $scope.myChart1 = new Chart(ctx1, {
                            type: 'pie',
                            data: {
                                labels: labels, // Etiquetas en el gráfico
                                datasets: [{
                                    data: counts, // Valores en el gráfico
                                    backgroundColor: colors // Asigna los colores definidos
                                }]
                            },
                            options: {
                                title: {
                                    display: true,
                                    text: 'Grafico ETP (Consolidado: ' + total + ')',
                                    position: 'top',
                                },
                                plugins: {
                                    datalabels: {
                                        align: 'center',
                                        anchor: 'middle',
                                        color: 'white',
                                        font: {
                                            weight: 'bold',
                                            size: 12
                                        },
                                        formatter: function (value) {
                                            return value;
                                        }
                                    }
                                },
                                legend: {
                                    display: true,
                                    position: 'bottom',
                                    padding: {
                                        bottom: 200,
                                        top: 100
                                    }
                                }
                            }
                        });

                        var labels1 = data.map(function (item) {
                            return item.tipificaciones2;
                        });

                        var counts1 = data.map(function (item) {
                            return parseInt(item.count);
                        });

                        data.forEach(item => {
                            item.color = "rgb(0, 0, 85)";
                        });

                        var colors1 = data.map(function (item) {
                            return item.color;
                        });
                    } else {
                        Swal({
                            type: 'error',
                            title: 'Opss..',
                            text: respuestas.data.msj,
                            timer: 4000,
                        })
                    }
                })
                .catch(function (error) {
                    console.error('Error al realizar las peticiones:', error);
                });
        }

        function gestionPorHora(data) {
            $scope.loading = 1;

            let datos = '';
            if (!data) {
                datos = '';
            } else {
                datos = data;
            }
            services.myService(datos, 'mesasNacionalesCtrl.php', 'gestionPorHora').then((data) => {
                $scope.loading = 0;
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
            }).catch((e) => {
                console.log(e)
            })
        }

        $scope.ChangeMn = (d) => {
            graphic(d);
            graphicDetails(d);
            gestionPorHora(d);
        }

    }
})();
