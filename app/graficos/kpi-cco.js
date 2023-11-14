(function () {
    "use strict";
    angular.module("seguimientopedidos").controller("ccoCtrl", ccoCtrl);
    ccoCtrl.$inject = ["$scope", "$http", "$rootScope", "$route", "services"];


    function ccoCtrl($scope, $http, $rootScope, $route, services) {
        $scope.tiempo = {};
        chartContingencia();
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


        function chartContingencia() {
            services.myService('', 'tiemposCtrl.php', 'chartContingencia').then((d) => {
                let data = d.data.data;
                console.log(data)
                var hora = [];
                var tiemposEnMinutos1 = [];
                var tiemposEnMinutos2 = [];
                var tiemposEnMinutos3 = [];
                var cantidad = [];

                data.forEach(function (item) {
                    var horaAMPM;
                    var horaNumero = parseInt(item.hora);

                    if (horaNumero <= 12) {
                        horaAMPM = horaNumero + ' AM';
                    } else {
                        horaAMPM = (horaNumero - 12) + ' PM';
                    }

                    hora.push(horaAMPM);
                    cantidad.push(parseInt(item.cantidad));

                    var tiempo1 = item.promedio1.split(':');
                    let h = parseInt(tiempo1[0], 10);
                    let m = parseInt(tiempo1[1], 10);
                    let s = parseInt(tiempo1[2], 10);

                    if (s >= 60) {
                        m += Math.floor(s / 60);
                        s %= 60;
                    }

                    let totalSegundo = (h * 3600) + (m * 60) + s;
                    let totalMinuto = totalSegundo / 60;
                    totalMinuto = Math.round(totalMinuto); // Redondear los minutos
                    let segundosRedondeado = totalSegundo % 60; // Obtener los segundos restantes después de redondear los minutos
                    tiemposEnMinutos1.push(totalMinuto + '.' + segundosRedondeado.toString().padStart(2, '0'));
                    //tiemposEnMinutos1.push(parseInt(tiempo1[0]) * 60 + parseInt(tiempo1[1]));

                    var tiempo2 = item.promedio2.split(':');
                    let horas = parseInt(tiempo2[0], 10);
                    let minutos = parseInt(tiempo2[1], 10);
                    let segundos = parseInt(tiempo2[2], 10);

                    if (segundos >= 60) {
                        minutos += Math.floor(segundos / 60);
                        segundos %= 60;
                    }

                    let totalSegundos = (horas * 3600) + (minutos * 60) + segundos;
                    let totalMinutos = totalSegundos / 60;
                    totalMinutos = Math.round(totalMinutos); // Redondear los minutos
                    let segundosRedondeados = totalSegundos % 60; // Obtener los segundos restantes después de redondear los minutos
                    tiemposEnMinutos2.push(totalMinutos + '.' + segundosRedondeados.toString().padStart(2, '0'));

                });

                console.log(tiemposEnMinutos1, ' Cantidad')

                $scope.chartOptions4 = {
                    type: 'bar',
                    data: {
                        labels: hora,
                        datasets: [{
                            label: 'Cantidad ingresos',
                            data: cantidad,
                            backgroundColor: 'rgba(0,0,85,0.5)',
                            borderColor: 'rgb(0,0,85)',
                            borderWidth: 1,
                            datalabels: {
                                display: true, // Mostrar las etiquetas de datos para este dataset
                                align: 'top',
                                anchor: 'end',
                                borderRadius: 4,
                                color: 'rgb(0,0,85)',
                                offset: 2,
                                padding: 4,
                                textAlign: 'center',
                                /*backgroundColor: function (context) {
                                    return context.dataset.backgroundColor;
                                },*/
                            }
                        }, {
                            label: 'ASA',
                            data: tiemposEnMinutos2,
                            backgroundColor: 'rgba(0,200,255)',
                            borderColor: 'rgba(0,200,255)',
                            borderWidth: 1,
                            type: 'line',
                            fill: false,
                            datalabels: {
                                display: true, // Mostrar las etiquetas de datos para este dataset
                                align: 'left',
                                anchor: 'center',
                                borderRadius: 4,
                                color: 'white',
                                offset: 5,
                                padding: 4,
                                textAlign: 'center',
                                backgroundColor: function (context) {
                                    return context.dataset.backgroundColor;
                                },
                                /*formatter: function (value) {
                                    return value + ' m';
                                },*/
                            }
                        }, {
                            label: 'AHT',
                            data: tiemposEnMinutos1,
                            backgroundColor: 'rgba(255, 190, 0)',
                            borderColor: 'rgba(255, 190, 0)',
                            borderWidth: 2,
                            type: 'line',
                            fill: false,
                            datalabels: {
                                display: true, // Mostrar las etiquetas de datos para este dataset
                                align: 'left',
                                anchor: 'end',
                                borderRadius: 4,
                                color: 'white',
                                offset: 5,
                                padding: 4,
                                textAlign: 'center',
                                backgroundColor: function (context) {
                                    return context.dataset.backgroundColor;
                                },
                                /*formatter: function (value) {
                                    return value + ' m';
                                },*/
                                elements: {
                                    line: {
                                        fill: false,
                                        tension: 99.10
                                    }
                                },
                            }
                            /*datalabels: {
                                display: true, // Mostrar las etiquetas de datos para este dataset
                                align: 'top',
                                anchor: 'start'
                            }*/
                        }]
                    },
                    series: ['Tiempo en sistema', 'Tiempo atención', 'Tiempo en cola'],
                    options: {
                        responsive: true,

                        title: {
                            display: true,
                            text: 'Contingencias',
                            fontSize: 16, // Tamaño de fuente del título
                            fontColor: 'rgb(0, 0, 0)', // Color de fuente del título
                            //fontStyle: 'bold', // Estilo de fuente del título (normal, italic, bold, etc.)
                            padding: 10 // Espaciado del título respecto al gráfico
                        }, scales: {
                            yAxes: [{
                                scaleLabel: {
                                    display: true,
                                    labelString: "Cantidad contingencias"
                                }
                            }]
                        },
                        datalabels: {
                            display: false,
                            align: 'end',
                            anchor: 'end',
                            color: 'black',
                            font: {
                                size: 0,
                            },
                            backgroundColor: function (context) {
                                return context.dataset.backgroundColor;
                            },
                        },
                        legend: {
                            position: 'bottom',
                            display: true, // Mostrar la leyenda
                            padding: 100,
                            onClick: function (e, legendItem) {
                                var index = legendItem.datasetIndex;
                                var meta = this.chart.getDatasetMeta(index);
                                meta.hidden = meta.hidden === null ? !this.chart.data.datasets[index].hidden : null;
                                this.chart.update();
                            }
                        }
                    }
                };

                var ctx4 = document.getElementById('chartContingencia').getContext('2d');
                $scope.myChart4 = new Chart(ctx4, $scope.chartOptions4);

                $scope.toggleDataset = function (index) {
                    if (index >= 0 && index < $scope.chartOptions4.data.datasets.length) {
                        var dataset = $scope.chartOptions4.data.datasets[index];
                        dataset.hidden = !dataset.hidden;
                        $scope.chart.update();
                    }
                };
            }).catch((e) => {
                console.log(e);
            })
        }
    }
})();
