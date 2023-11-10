(function () {
    "use strict";
    angular.module("seguimientopedidos").controller("tiemposCtrl", tiemposCtrl);
    tiemposCtrl.$inject = ["$scope", "$http", "$rootScope", "$route", "services"];


    function tiemposCtrl($scope, $http, $rootScope, $route, services) {
        $scope.tiempo = {};
        graficos();
        $scope.opciones = [
            {value: "", label: "Todos"},
            {value: "Internet+Toip", label: "Internet+Toip"},
            {value: "TV", label: "TV"}
        ];

        $scope.buscar = (data) => {
            if (!data.fechaini) {
                Swal({
                    type: 'error',
                    title: 'Opss...',
                    text: 'debes ingresar la fecha inicial',
                    timer: 4000
                })
                return;
            }

            if (!data.fechafin) {
                Swal({
                    type: 'error',
                    title: 'Opss...',
                    text: 'debes ingresar la fecha final',
                    timer: 4000
                })
                return;
            }

            if (data.fechaini > data.fechafin) {
                Swal({
                    type: 'error',
                    title: 'Opss...',
                    text: 'La fecha inicial no puede ser mayor a la final',
                    timer: 4000
                })
                return;
            }

            let date_1 = new Date(data.fechaini);
            let date_2 = new Date(data.fechafin);
            let diff = date_2 - date_1;

            let TotalDays = Math.ceil(diff / (1000 * 3600 * 24));

            if (TotalDays > 30) {
                Swal({
                    type: 'error',
                    title: 'Opss...',
                    text: 'por motivos de optimización el rango de búsqueda debe ser de 30 dias',
                    timer: 4000
                })
                return;
            }

            graficos(data);
        }

        function roundNumber(x) {
            // Convertir x a número si no es un número
            x = parseFloat(x);

            let minutos = Math.floor(x);
            let segundos = Math.round((x - minutos) * 100);

            if (segundos >= 60) {
                minutos += Math.floor(segundos / 60);
                segundos %= 60;
            }

            return minutos + ':' + segundos.toString().padStart(2, '0');
        }

        function graficos(data) {
            //$route.reload();
            $scope.loading = 1;
            let response = '';
            let response2 = '';
            let response3 = '';
            let fechas = [];
            let promedios = [];
            let promedios2 = [];
            let promedios3 = [];
            let tiemposEnMinutos = '';
            let tiemposEnMinutos2 = '';

            var chart = $scope.myChart;
            var chart1 = $scope.myChart1;
            var chart2 = $scope.myChart2;
            var chart3 = $scope.myChart3;
            if (chart) {
                chart.destroy();
                chart1.destroy();
                chart2.destroy();
                chart3.destroy();
            }

            let datos = '';
            if (!data) {
                datos = '';
            } else {
                datos = data;
            }
            services.myService(datos, 'tiemposCtrl.php', 'todosTiempos')
                .then((data) => {
                    var respuestas = data.data;
                    $scope.loading = 0;
                    response = respuestas[0];

                    response.forEach(function (item) {
                        fechas.push(item.fecha);
                        promedios.push(item.promedio);
                    });

                    tiemposEnMinutos = promedios.map(function (tiempo) {
                        let partes = tiempo.split(':');
                        let horas = parseInt(partes[0], 10);
                        let minutos = parseInt(partes[1], 10);
                        let segundos = parseInt(partes[2], 10);

                        if (segundos >= 60) {
                            minutos += Math.floor(segundos / 60);
                            segundos %= 60;
                        }

                        let totalSegundos = (horas * 3600) + (minutos * 60) + segundos;
                        let totalMinutos = totalSegundos / 60;
                        totalMinutos = Math.round(totalMinutos); // Redondear los minutos
                        let segundosRedondeados = totalSegundos % 60; // Obtener los segundos restantes después de redondear los minutos

                        return totalMinutos + '.' + segundosRedondeados.toString().padStart(2, '0');
                    });

                    var suma = tiemposEnMinutos.reduce(function (a, b) {
                        return a + parseFloat(b);
                    }, 0);

                    var promedio = suma / tiemposEnMinutos.length;
                    var promedioRound = roundNumber(promedio);

                    $scope.chartOptions = {
                        type: 'bar',
                        data: {
                            labels: fechas,
                            datasets: [{
                                label: 'Promedio Tiempo en cola',
                                data: tiemposEnMinutos,
                                backgroundColor: 'rgb(147,220,82)',
                                borderColor: 'rgb(83,192,75)',
                                //borderWidth: 1
                            }]
                        },
                        options: {
                            plugins: {
                                datalabels: {
                                    align: 'end', // Alinea el texto a la derecha del punto de anclaje
                                    anchor: 'end', // Ancla el texto en la parte derecha del punto de anclaje
                                    color: 'black',
                                    font: {
                                        size: 0, // Tamaño de la fuente
                                    },
                                    offset: 4, // Desplazamiento vertical desde el punto de anclaje
                                    /*formatter: function (value) {
                                        return value + ' ms';
                                    }*/
                                }
                            },
                            title: {
                                display: true,
                                text: 'Tiempo en cola: ' + promedioRound,
                                fontSize: 16, // Tamaño de fuente del título
                                fontColor: 'rgb(0, 0, 0)', // Color de fuente del título
                                //fontStyle: 'bold', // Estilo de fuente del título (normal, italic, bold, etc.)
                                padding: 5 // Espaciado del título respecto al gráfico
                            }, scales: {
                                yAxes: [{
                                    scaleLabel: {
                                        display: true,
                                        labelString: "Minutos"
                                    }
                                }]
                            }
                        }
                    };

                    var ctx = document.getElementById('myChart').getContext('2d');
                    $scope.myChart = new Chart(ctx, $scope.chartOptions);
                    /**
                     * grafico tiempoAtencion
                     */
                    response2 = respuestas[1];

                    response2.forEach(function (item) {
                        promedios2.push(item.promedio);
                    });

                    tiemposEnMinutos2 = promedios2.map(function (tiempo) {
                        let partes = tiempo.split(':');
                        let horas = parseInt(partes[0], 10);
                        let minutos = parseInt(partes[1], 10);
                        let segundos = parseInt(partes[2], 10);

                        if (segundos >= 60) {
                            minutos += Math.floor(segundos / 60);
                            segundos %= 60;
                        }

                        let totalSegundos = (horas * 3600) + (minutos * 60) + segundos;
                        let totalMinutos = totalSegundos / 60;
                        totalMinutos = Math.round(totalMinutos); // Redondear los minutos
                        let segundosRedondeados = totalSegundos % 60; // Obtener los segundos restantes después de redondear los minutos

                        return totalMinutos + '.' + segundosRedondeados.toString().padStart(2, '0');
                    });

                    // Convertir cada elemento en el array a número y sumarlos
                    var suma = tiemposEnMinutos2.reduce(function (a, b) {
                        return a + parseFloat(b);
                    }, 0);

                    var promedio = suma / tiemposEnMinutos2.length;
                    var promedioRound = roundNumber(promedio);
                    $scope.chartOptions1 = {
                        type: 'bar',
                        data: {
                            labels: fechas,
                            datasets: [{
                                label: 'Promedio Tiempo Atención',
                                data: tiemposEnMinutos2,
                                backgroundColor: 'rgba(91,75,192,0.2)',
                                borderColor: 'rgb(75,91,192)',
                                borderWidth: 1
                            }]
                        },
                        options: {
                            plugins: {
                                datalabels: {
                                    align: 'end', // Alinea el texto a la derecha del punto de anclaje
                                    anchor: 'end', // Ancla el texto en la parte derecha del punto de anclaje
                                    color: 'black',
                                    font: {
                                        size: 0, // Tamaño de la fuente
                                    },
                                    offset: 4, // Desplazamiento vertical desde el punto de anclaje
                                    /*formatter: function (value) {
                                        return value + 'x';
                                    }*/
                                }
                            },
                            title: {
                                display: true,
                                text: 'Tiempo en atención: ' + promedioRound,
                                fontSize: 16, // Tamaño de fuente del título
                                fontColor: 'rgb(0, 0, 0)', // Color de fuente del título
                                //fontStyle: 'bold', // Estilo de fuente del título (normal, italic, bold, etc.)
                                padding: 5 // Espaciado del título respecto al gráfico
                            }, scales: {
                                yAxes: [{
                                    scaleLabel: {
                                        display: true,
                                        labelString: "Minutos"
                                    }
                                }]
                            }
                        }
                    };

                    var ctx1 = document.getElementById('myChartAtencion').getContext('2d');
                    $scope.myChart1 = new Chart(ctx1, $scope.chartOptions1);
                    /**
                     * grafico tiempoSistema
                     */
                    response3 = respuestas[2];
                    response3.forEach(function (item) {
                        promedios3.push(item.promedio);
                    });

                    let tiemposEnMinutos3 = promedios3.map(function (tiempo) {
                        let partes = tiempo.split(':');
                        let horas = parseInt(partes[0], 10);
                        let minutos = parseInt(partes[1], 10);
                        let segundos = parseInt(partes[2], 10);

                        if (segundos >= 60) {
                            minutos += Math.floor(segundos / 60);
                            segundos %= 60;
                        }

                        let totalSegundos = (horas * 3600) + (minutos * 60) + segundos;
                        let totalMinutos = totalSegundos / 60;
                        totalMinutos = Math.round(totalMinutos); // Redondear los minutos
                        let segundosRedondeados = totalSegundos % 60; // Obtener los segundos restantes después de redondear los minutos

                        return totalMinutos + '.' + segundosRedondeados.toString().padStart(2, '0');
                    });

                    // Convertir cada elemento en el array a número y sumarlos
                    var suma = tiemposEnMinutos3.reduce(function (a, b) {
                        return a + parseFloat(b);
                    }, 0);
                    var promedio = suma / tiemposEnMinutos3.length;
                    var promedioRound = roundNumber(promedio);

                    $scope.chartOptions2 = {
                        type: 'bar',
                        data: {
                            labels: fechas,
                            datasets: [{
                                label: 'Tiempo en sistema',
                                data: tiemposEnMinutos3,
                                backgroundColor: 'rgba(192,75,75,0.2)',
                                borderColor: 'rgb(192,75,93)',
                                borderWidth: 1
                            }]
                        },
                        options: {
                            plugins: {
                                datalabels: {
                                    align: 'end', // Alinea el texto a la derecha del punto de anclaje
                                    anchor: 'end', // Ancla el texto en la parte derecha del punto de anclaje
                                    color: 'black',
                                    font: {
                                        size: 0, // Tamaño de la fuente
                                    },
                                    offset: 4, // Desplazamiento vertical desde el punto de anclaje
                                    formatter: function (value) {
                                        return value + ' m';
                                    }
                                }
                            },
                            title: {
                                display: true,
                                text: 'Promedio Tiempo en sistema: ' + promedioRound,
                                fontSize: 16, // Tamaño de fuente del título
                                fontColor: 'rgb(0, 0, 0)', // Color de fuente del título
                                padding: 5 // Espaciado del título respecto al gráfico
                            }, scales: {
                                yAxes: [{
                                    scaleLabel: {
                                        display: true,
                                        labelString: "Minutos"
                                    }
                                }]
                            }
                        }
                    };

                    var ctx2 = document.getElementById('myChartSistema').getContext('2d');
                    $scope.myChart2 = new Chart(ctx2, $scope.chartOptions2);
                    /**
                     * todos
                     */
                    $scope.chartOptions3 = {
                        type: 'line',
                        data: {
                            labels: fechas,
                            datasets: [{
                                label: 'Tiempo en sistema',
                                data: tiemposEnMinutos3,
                                backgroundColor: 'rgba(192,75,75,0.2)',
                                borderColor: 'rgb(255,0,42)',
                                borderWidth: 1,
                                series: 'fato'
                            }, {
                                label: 'Tiempo atención',
                                data: tiemposEnMinutos2,
                                backgroundColor: 'rgba(91,75,192,0.2)',
                                borderColor: 'rgb(0,36,255)',
                                borderWidth: 1,
                                series: 'pato'
                            }, {
                                label: 'Tiempo en cola',
                                data: tiemposEnMinutos,
                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                borderColor: 'rgb(57,227,19)',
                                borderWidth: 1,
                                fill: false
                            }]
                        },
                        series: ['Tiempo en sistema', 'Tiempo atención', 'Tiempo en cola'],
                        options: {
                            datalabels: {
                                align: 'end',
                                anchor: 'end',
                                color: 'black',
                                font: {
                                    size: 0,
                                },

                            },
                            title: {
                                display: true,
                                //padding: 5 // Espaciado del título respecto al gráfico
                                text: 'Gráficos unificados',
                                fontSize: 16, // Tamaño de fuente del título
                                fontColor: 'rgb(0, 0, 0)', // Color de fuente del título
                                //fontStyle: 'bold', // Estilo de fuente del título (normal, italic, bold, etc.)
                            }, scales: {
                                yAxes: [{
                                    scaleLabel: {
                                        display: true,
                                        labelString: "Minutos"
                                    }
                                }]
                            },
                            legend: {
                                position: 'bottom',
                                display: true, // Mostrar la leyenda
                                onClick: function (e, legendItem) {
                                    var index = legendItem.datasetIndex;
                                    var meta = this.chart.getDatasetMeta(index);
                                    meta.hidden = meta.hidden === null ? !this.chart.data.datasets[index].hidden : null;
                                    this.chart.update();
                                }
                            }
                        }
                    };

                    var ctx3 = document.getElementById('robChart').getContext('2d');
                    $scope.myChart3 = new Chart(ctx3, $scope.chartOptions3);

                    $scope.toggleDataset = function (index) {
                        if (index >= 0 && index < $scope.chartOptions3.data.datasets.length) {
                            var dataset = $scope.chartOptions3.data.datasets[index];
                            dataset.hidden = !dataset.hidden;
                            $scope.chart.update();
                        }
                    };
                })
                .catch(function (error) {
                    console.error('Error al realizar las peticiones:', error);
                });
        }
    }
})();
