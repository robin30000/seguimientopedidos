(function () {
    "use strict";
    angular.module("seguimientopedidos").controller("ruteoCtrl", ruteoCtrl);
    ruteoCtrl.$inject = ["$scope", "$http", "$rootScope", "$route", "services", "$filter"];

    function ruteoCtrl($scope, $http, $rootScope, $route, services, $filter) {
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

        $scope.imprimirArea = (d) => {
            if (!d) {
                Swal({
                    type: 'error',
                    title: 'Opps..',
                    text: 'Selecciones el area o las areas para mostrar',
                    timer: 4000
                })
                return;
            }

            data(d);
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
            console.log(f)
            if (!f) {
                Swal({
                    type: 'error',
                    title: 'Oppss..',
                    text: 'debes ingresar una fecha',
                    timer: 4000
                })
                return;
            }
            var fecha = new Date(f.fecha);
            var anio = fecha.getFullYear();
            var mes = fecha.getMonth();
            var dia = fecha.getDay();
            let d = {anio: anio + '-' + mes + '-' + dia, area: f.area}
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


        $scope.getNombreMes = function (fecha) {
            var mesesEnEspanol = [
                "enero", "febrero", "marzo", "abril", "mayo", "junio",
                "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
            ];

            var partesFecha = fecha.split('-');
            var mes = parseInt(partesFecha[1]) - 1;

            return mesesEnEspanol[mes];
        };

        function getNombreMes(fecha) {
            var mesesEnEspanol = [
                "enero", "febrero", "marzo", "abril", "mayo", "junio",
                "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
            ];

           var partesFecha = fecha.split('-');
            var mes = parseInt(partesFecha[1]) - 1; // Restamos 1 para ajustar al índice del mes

            return mesesEnEspanol[mes];
        };

        function data(d) {
            $scope.areasBusca = d;
            $scope.loading = 1;
            services.myService(d, 'ruteoCtrl.php', 'cargaData').then((data) => {
                $scope.loading = 0;
                if (data.data.state) {

                    var chart = $scope.myChart;
                    if (chart) {
                        chart.destroy();
                    }

                    $scope.response = data.data.data;
                    var suma_asignados = 0;
                    var suma_abiertas = 0;
                    var suma_total = 0;

                    angular.forEach($scope.response, function (obj) {
                        suma_asignados += parseInt(obj.total_asignados);
                        suma_abiertas += parseInt(obj.total_abiertas);
                        suma_total += parseInt(obj.total_asignados_y_abiertas);
                    });

                    var newObject = {
                        mes: $scope.response[0]['mes'],
                        fechaIni: $scope.response[0]['fechaIni'],
                        fechaFin: $scope.response[0]['fechaFin'],
                        area: "Nacional",
                        total_asignados: suma_asignados.toString(),
                        total_abiertas: suma_abiertas.toString(),
                        total_asignados_y_abiertas: suma_total.toString()
                    };

                    $scope.response.push(newObject);

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
                                    backgroundColor: 'rgba(55, 200, 70,0.3)',
                                    borderColor: 'rgba(55, 200, 70,0.3)',
                                    borderWidth: 1
                                },
                                {
                                    label: 'Abiertas',
                                    data: porcentajeAbiertas,
                                    backgroundColor: 'rgba(240, 120, 30,0.5)',
                                    borderColor: 'rgba(240, 120, 30,0.5)',
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
                        text: data.data.msj,
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
                if (d.data.state) {
                    var chart = $scope.myChart1;
                    if (chart) {
                        chart.destroy();
                    }

                    $scope.responses = d.data.data;

                    $scope.responses.sort(function (a, b) {
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
                                    backgroundColor: 'rgba(0, 0, 85, 0.4)',
                                    borderColor: 'rgba(0, 0, 85, 0.4)',
                                    borderWidth: 1
                                },
                                {
                                    label: 'Abiertas',
                                    data: porcentajeAbiertas,
                                    backgroundColor: 'rgba(240, 120, 30,0.5)',
                                    borderColor: 'rgba(240, 120, 30,0.5)',
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
                if (data.data.state) {
                    var chart = $scope.myChart2;
                    if (chart) {
                        chart.destroy();
                    }
                    $scope.responseDia = data.data.data;

                    $scope.responseDia.sort(function (a, b) {
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
                                    backgroundColor: 'rgba(0, 200, 255,0.5)',
                                    borderColor: 'rgba(0, 200, 255,0.5)',
                                    borderWidth: 1
                                },
                                {
                                    label: 'Abiertas',
                                    data: porcentajeAbiertas,
                                    backgroundColor: 'rgba(240, 120, 30,0.5)',
                                    borderColor: 'rgba(240, 120, 30,0.5)',
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
