(function () {
    "use strict";
    angular.module("seguimientopedidos").controller("GraficoRuteoCtrl", GraficoRuteoCtrl);
    GraficoRuteoCtrl.$inject = ["$scope", "$http", "$rootScope", "$route", "services", "$filter"];

    function GraficoRuteoCtrl($scope, $http, $rootScope, $route, services, $filter) {
        init();
        $rootScope.robcastro = 1;
        $scope.imprimirGrafico = () => {
            var chartDataUrls = [];
            var chartIds = ['barChart', 'barChart1', 'barChart2'];

            for (var i = 0; i < chartIds.length; i++) {
                var canvas = document.getElementById(chartIds[i]);
                chartDataUrls.push(canvas.toDataURL("image/png"));
            }

            var printWindow = window.open('', '_blank', 'width=920,height=300');

            var content = '<html><head><title>KPI RUTEO</title></head><body>';

            for (var i = 0; i < chartDataUrls.length; i++) {
                content += '<img src="' + chartDataUrls[i] + '" style="width: 600px; height: 200px; margin-right: 20px;">';
            }

            content += '</body></html>';
            printWindow.document.write(content);
            printWindow.document.close();
            printWindow.print();
        }

        function init() {
            data();
            dataCompara();
            dia();
        }

        $scope.buscarFechaCompara = (f) => {
            if (!f) {
                Swal({
                    type: 'error',
                    title: 'Oppss..',
                    text: 'debes ingresar una fecha',
                    timer: 4000
                })
                return;
            }
            var fecha = new Date(f);
            var anio = fecha.getFullYear();
            var mes = fecha.getMonth();
            var dia = fecha.getDay();
            let d = {anio: anio + '-' + mes + '-' + dia}
            dataCompara(d);
        }

        $scope.buscarFecha = (f) => {
            if (!f) {
                Swal({
                    type: 'error',
                    title: 'Oppss..',
                    text: 'debes ingresar una fecha',
                    timer: 4000
                })
                return;
            }
            var fecha = new Date(f);
            var anio = fecha.getFullYear();
            var mes = fecha.getMonth();
            var dia = fecha.getDay();
            let d = {anio: anio + '-' + mes + '-' + dia}
            data(d)
        }

        $scope.buscarDia = (f) => {
            if (!f) {
                Swal({
                    type: 'error',
                    title: 'Oppss..',
                    text: 'debes ingresar una fecha',
                    timer: 4000
                })
                return;
            }
            dia(f)
        }


        $scope.getNombreMes = function(fecha) {
            var mesesEnEspanol = [
                "enero", "febrero", "marzo", "abril", "mayo", "junio",
                "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
            ];

            var fechaObj = new Date(fecha);
            var mes = fechaObj.getMonth();

            return mesesEnEspanol[mes];
        };

        function getNombreMes(fecha) {
            var mesesEnEspanol = [
                "enero", "febrero", "marzo", "abril", "mayo", "junio",
                "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
            ];

            var fechaObj = new Date(fecha);
            var mes = fechaObj.getMonth();

            return mesesEnEspanol[mes];
        };

        function data(d) {
            $scope.loading = 1;
            services.myService(d, 'ruteoCtrl.php', 'cargaData').then((data) => {
                $scope.loading = 0;
                if (data.state) {



                    var chart = $scope.myChart;
                    if (chart) {
                        chart.destroy();
                    }

                    $scope.response = data.data;

                    $scope.response.sort(function(a, b) {
                        if (a.area === "Nacional") {
                            return 1; // Mover "Nacional" al final
                        } else if (b.area === "Nacional") {
                            return -1; // Mover "Nacional" al final
                        } else {
                            return 0;
                        }
                    });


                    for (var area in $scope.response) {
                        var totalAsignados = parseInt($scope.response[area].total_asignados);
                        var totalAbiertas = parseInt($scope.response[area].total_abiertas);
                        var totalAsignadosYAbiertas = parseInt($scope.response[area].total_asignados_y_abiertas);

                        var porcentajeAsignados = Math.round((totalAsignados / totalAsignadosYAbiertas) * 100);
                        var porcentajeAbiertas = Math.round((totalAbiertas / totalAsignadosYAbiertas) * 100);

                        $scope.response[area].porcentaje_asignados = porcentajeAsignados;
                        $scope.response[area].porcentaje_abiertas = porcentajeAbiertas;
                    }

                    var areas = Object.keys($scope.response);
                    var labels = areas.map(area => $scope.response[area].area);
                    var porcentajeAsignados = areas.map(area => parseFloat($scope.response[area].porcentaje_asignados));
                    var porcentajeAbiertas = areas.map(area => parseFloat($scope.response[area].porcentaje_abiertas));

                    $scope.mes = $filter('date')($scope.response[0].fechaIni, 'MMMM');

                    var ctx = document.getElementById('barChart').getContext('2d');
                    $scope.myChart = new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: labels,
                            datasets: [
                                {
                                    label: 'Asignados',
                                    data: porcentajeAsignados,
                                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                                    borderColor: 'rgba(153, 102, 255, 0.2)',
                                    borderWidth: 1
                                },
                                {
                                    label: 'Abiertas',
                                    data: porcentajeAbiertas,
                                    backgroundColor: 'rgba(255, 159, 64, 0.2)',
                                    borderColor: 'rgba(255, 159, 64, 0.2)',
                                    borderWidth: 1
                                }
                            ]
                        },

                        options: {
                            title: {
                                display: true,
                                text: 'Detalles ' + getNombreMes($scope.response[0].fechaFin),
                                position: 'top',
                            },
                            plugins: {
                                datalabels: {
                                    align: 'center',
                                    anchor: 'center',
                                    color: 'black',
                                    /*font: {
                                        weight: 'bold'
                                    },*/
                                    formatter: function (value) {
                                        return value + '%';
                                    }
                                }
                            },
                            scales: {
                                xAxes: [{
                                    stacked: true
                                }],
                                yAxes: [{
                                    stacked: true,
                                    ticks: {
                                        callback: function (value, index, values) {
                                            return value + ' %';
                                        }
                                    },
                                    scaleLabel: {
                                        display: true,
                                        labelString: "Porcentaje"
                                    }
                                }]
                            },
                            legend: {
                                display: true,
                                padding: {
                                    bottom: 20
                                }
                            }
                        }
                    });

                } else {
                    Swal({
                        type: 'error',
                        title: 'Opss...',
                        text: data.msj,
                        timer: 4000
                    })
                }

            }).catch((e) => {
                console.log(e)
            })
        }

        function dataCompara(d) {
            $scope.loading = 1;
            services.myService(d, 'ruteoCtrl.php', 'dataCompara').then((d) => {
                $scope.loading = 0;
                if (d.state) {
                    var chart = $scope.myChart1;
                    if (chart) {
                        chart.destroy();
                    }

                    $scope.responses = d.data;

                    $scope.responses.sort(function(a, b) {
                        if (a.area === "Nacional") {
                            return 1; // Mover "Nacional" al final
                        } else if (b.area === "Nacional") {
                            return -1; // Mover "Nacional" al final
                        } else {
                            return 0;
                        }
                    });

                    for (var area in $scope.responses) {
                        var totalAsignados = parseInt($scope.responses[area].total_asignados);
                        var totalAbiertas = parseInt($scope.responses[area].total_abiertas);
                        var totalAsignadosYAbiertas = parseInt($scope.responses[area].total_asignados_y_abiertas);

                        var porcentajeAsignados = Math.round((totalAsignados / totalAsignadosYAbiertas) * 100);
                        var porcentajeAbiertas = Math.round((totalAbiertas / totalAsignadosYAbiertas) * 100);

                        $scope.responses[area].porcentaje_asignados = porcentajeAsignados;
                        $scope.responses[area].porcentaje_abiertas = porcentajeAbiertas;
                    }


                    var areas = Object.keys($scope.responses);
                    var labels = areas.map(area => $scope.responses[area].area + ' - ' + $scope.responses[area].mes);

                    var porcentajeAsignados = areas.map(area => parseFloat($scope.responses[area].porcentaje_asignados));
                    var porcentajeAbiertas = areas.map(area => parseFloat($scope.responses[area].porcentaje_abiertas));

                    var ctx = document.getElementById('barChart1').getContext('2d');
                    $scope.myChart1 = new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: labels,
                            datasets: [
                                {
                                    label: 'Asignados',
                                    data: porcentajeAsignados,
                                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                    borderColor: 'rgba(75, 192, 192, 0.2)',
                                    borderWidth: 1
                                },
                                {
                                    label: 'Abiertas',
                                    data: porcentajeAbiertas,
                                    backgroundColor: 'rgba(255, 206, 86, 0.2)',
                                    borderColor: 'rgba(255, 206, 86, 0.2)',
                                    borderWidth: 1
                                }
                            ]
                        },

                        options: {

                            title: {
                                display: true,
                                text: 'Ruteo entre ' + getNombreMes($scope.responses[0].fechaIni) + ' y ' + getNombreMes($scope.responses[0].fechaFin),
                                position: 'top',
                            },
                            plugins: {
                                datalabels: {
                                    align: 'center',
                                    anchor: 'center',
                                    color: 'black',
                                    /*font: {
                                        weight: 'bold'
                                    },*/
                                    formatter: function (value) {
                                        return value + '%';
                                    }
                                }
                            },
                            scales: {
                                xAxes: [{
                                    stacked: true,
                                    /* ticks: {
                                         callback: function(value) {
                                             return value.split(' - ').join('\n');
                                         },
                                     }*/
                                }],
                                yAxes: [{
                                    stacked: true,
                                    ticks: {
                                        callback: function (value, index, values) {
                                            return value + ' %';
                                        }
                                    },
                                    scaleLabel: {
                                        display: true,
                                        labelString: "Porcentaje"
                                    }
                                }]
                            },
                            legend: {
                                display: true,
                            }
                        }
                    });
                }
            }).catch((e) => {
                console.log(e)
            })
        }

        function dia(d) {
            $scope.loading = 1;
            services.myService(d, 'ruteoCtrl.php', 'analisisDia').then((data) => {
                $scope.loading = 0;
                if (data.state) {
                    var chart = $scope.myChart2;
                    if (chart) {
                        chart.destroy();
                    }
                    $scope.responseDia = data.data;

                    $scope.responseDia.sort(function(a, b) {
                        if (a.area === "Nacional") {
                            return 1; // Mover "Nacional" al final
                        } else if (b.area === "Nacional") {
                            return -1; // Mover "Nacional" al final
                        } else {
                            return 0;
                        }
                    });


                    for (var area in $scope.responseDia) {
                        var totalAsignados = parseInt($scope.responseDia[area].total_asignados);
                        var totalAbiertas = parseInt($scope.responseDia[area].total_abiertas);
                        var totalAsignadosYAbiertas = parseInt($scope.responseDia[area].total_asignados_y_abiertas);

                        var porcentajeAsignados = Math.round((totalAsignados / totalAsignadosYAbiertas) * 100);
                        var porcentajeAbiertas = Math.round((totalAbiertas / totalAsignadosYAbiertas) * 100);

                        $scope.responseDia[area].porcentaje_asignados = porcentajeAsignados;
                        $scope.responseDia[area].porcentaje_abiertas = porcentajeAbiertas;
                    }

                    var areas = Object.keys($scope.responseDia);
                    var labels = areas.map(area => $scope.responseDia[area].area);
                    var porcentajeAsignados = areas.map(area => parseFloat($scope.responseDia[area].porcentaje_asignados));
                    var porcentajeAbiertas = areas.map(area => parseFloat($scope.responseDia[area].porcentaje_abiertas));

                    var ctx = document.getElementById('barChart2').getContext('2d');
                    $scope.myChart2 = new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: labels,
                            datasets: [
                                {
                                    label: 'Asignados',
                                    data: porcentajeAsignados,
                                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                                    borderColor: 'rgba(54, 162, 235, 0.2)',
                                    borderWidth: 1
                                },
                                {
                                    label: 'Abiertas',
                                    data: porcentajeAbiertas,
                                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                                    borderColor: 'rgba(255, 99, 132, 0.2)',
                                    borderWidth: 1
                                }
                            ]
                        },
                        options: {
                            title: {
                                display: true,
                                text: 'Ruteo día ' + $scope.responseDia[0].fecha,
                                position: 'top',
                            },
                            plugins: {
                                datalabels: {
                                    align: 'center',
                                    anchor: 'center',
                                    color: 'black',
                                    /*font: {
                                        weight: 'bold'
                                    },*/
                                    formatter: function (value) {
                                        return value + '%';
                                    }
                                }
                            },
                            scales: {
                                xAxes: [{
                                    stacked: true,
                                    ticks: {
                                        autoSkip: false // Muestra todas las etiquetas en el eje X sin omitir ninguna
                                    }
                                }],
                                yAxes: [{
                                    stacked: true,
                                    ticks: {
                                        callback: function (value, index, values) {
                                            return value + ' %'; // La etiqueta ya incluye el símbolo de porcentaje
                                        }
                                    },
                                    scaleLabel: {
                                        display: true,
                                        labelString: "Porcentaje"
                                    }
                                }]
                            },
                            legend: {
                                display: true,
                            },
                        }
                    });

                } else {
                    Swal({
                        type: 'error',
                        title: 'Opss...',
                        text: data.msj,
                        timer: 4000
                    })
                }
            }).catch((e) => {
                console.log(e)
            })
        }
    }
})();
