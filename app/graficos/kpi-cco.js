(function () {
    "use strict";
    angular.module("seguimientopedidos").controller("kpiCcoCtrl", kpiCcoCtrl);
    kpiCcoCtrl.$inject = ["$scope", "$http", "$rootScope", "$route", "services"];


    function kpiCcoCtrl($scope, $http, $rootScope, $route, services) {
        $scope.tiempo = {};
        init();
        $scope.opciones = [
            {value: "", label: "Todos"},
            {value: "Internet+Toip", label: "Internet+Toip"},
            {value: "TV", label: "TV"}
        ];

        function init() {
            chartContingencia();
            chartToip();
            chartEtp();
            chartGpon();
            chartEmt();
            chartValidacion();
        }

        $scope.buscar = (data) => {
            if (!data.fecha) {
                Swal({
                    type: 'error',
                    title: 'Opss...',
                    text: 'debes ingresar la fecha',
                    timer: 4000
                })
                return;
            }

            var fechaActual = new Date();
            fechaActual.setTime(fechaActual.getTime() - (5 * 60 * 60 * 1000)); // Restar 5 horas para ajustar a la zona horaria de Colombia
            var fechaIngresada = new Date(data.fecha + 'T00:00:00-05:00'); // Suponiendo que la fecha ingresada es a las 00:00:00 en la zona horaria de Colombia

            if (fechaIngresada > fechaActual) {
                Swal({
                    type: 'error',
                    title: 'Opss...',
                    text: 'La fecha ingresada es mayor que la fecha actual',
                    timer: 4000
                });
                return;
            }

            chartContingencia(data);
            chartToip(data);
            chartEtp(data);
            chartGpon(data);
        }

        function chartContingencia(data) {
            let d = '';
            if (data) {
                d = data
            }
            services.myService(d, 'kpiCcoCtrl.php', 'chartContingencia').then((d) => {
                var chart = $scope.myChart;
                if (chart) {
                    chart.destroy();
                }
                let data = d.data.data;
                var hora = [];
                var tiemposEnMinutos1 = [];
                var tiemposEnMinutos2 = [];
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

                    var tiempo1 = item.ASA ? item.ASA.split(':') : [0, 0, 0];
                    let h = parseInt(tiempo1[0], 10);
                    let m = parseInt(tiempo1[1], 10);
                    let s = parseInt(tiempo1[2], 10);
                    tiemposEnMinutos1.push(m + '.' + s);

                    var tiempo2 = item.AHT ? item.AHT.split(':') : [0, 0, 0];
                    let horas = parseInt(tiempo2[0], 10);
                    let minutos = parseInt(tiempo2[1], 10);
                    let segundos = parseInt(tiempo2[2], 10);
                    tiemposEnMinutos2.push(minutos + '.' + segundos);

                });

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
                                display: true,
                                align: 'top',
                                anchor: 'end',
                                borderRadius: 4,
                                color: 'rgb(0,0,85)',
                                offset: -3,
                                padding: 4,
                                textAlign: 'center',
                                font: {
                                    size: 10,
                                    weight: 'bold'
                                },
                            }
                        }, {
                            label: 'AHT',
                            data: tiemposEnMinutos2,
                            backgroundColor: 'rgba(0,200,255)',
                            borderColor: 'rgba(0,200,255)',
                            borderWidth: 1,
                            type: 'line',
                            fill: false,
                            datalabels: {
                                display: true,
                                align: 'start',
                                anchor: 'center',
                                borderRadius: 4,
                                color: 'white',
                                offset: 5,
                                padding: 4,
                                textAlign: 'center',
                                backgroundColor: function (context) {
                                    return context.dataset.backgroundColor;
                                },
                                font: {
                                    size: 10,
                                },
                            }
                        }, {
                            label: 'ASA',
                            data: tiemposEnMinutos1,
                            backgroundColor: 'rgba(255, 190, 0)',
                            borderColor: 'rgba(255, 190, 0)',
                            borderWidth: 2,
                            type: 'line',
                            fill: false,
                            datalabels: {
                                display: true,
                                align: 'end',
                                anchor: 'end',
                                borderRadius: 4,
                                color: 'white',
                                offset: 5,
                                padding: 4,
                                textAlign: 'center',
                                backgroundColor: function (context) {
                                    return context.dataset.backgroundColor;
                                },
                                font: {
                                    size: 10,
                                },
                                elements: {
                                    line: {
                                        fill: false,
                                        tension: 99.10
                                    }
                                },
                            }
                        }]
                    },
                    series: ['Tiempo en sistema', 'Tiempo atención', 'Tiempo en cola'],
                    options: {
                        responsive: true,
                        title: {
                            display: true,
                            text: 'Contingencias',
                            fontSize: 14,
                            fontColor: 'rgb(0, 0, 0)',
                            padding: 10
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
                                size: 8,
                            },
                            backgroundColor: function (context) {
                                return context.dataset.backgroundColor;
                            },
                        },
                        legend: {
                            position: 'bottom',
                            display: true,
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
                $scope.myChart = new Chart(ctx4, $scope.chartOptions4);

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

        function chartToip(data) {
            let d = '';
            if (data) {
                d = data
            }
            services.myService(d, 'kpiCcoCtrl.php', 'chartToip').then((d) => {
                var chart = $scope.myChart2;
                if (chart) {
                    chart.destroy();
                }
                let data = d.data.data;
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

                    var tiempo1 = item.ASA ? item.ASA.split(':') : [0, 0, 0];
                    let h = parseInt(tiempo1[0], 10);
                    let m = parseInt(tiempo1[1], 10);
                    let s = parseInt(tiempo1[2], 10);


                    let totalSegundo = (h * 3600) + (m * 60) + s;
                    let totalMinuto = totalSegundo / 60;
                    totalMinuto = Math.round(totalMinuto); // Redondear los minutos
                    let segundosRedondeado = totalSegundo % 60; // Obtener los segundos restantes después de redondear los minutos
                    tiemposEnMinutos1.push(totalMinuto + '.' + segundosRedondeado.toString().padStart(2, '0'));

                    /*let total = h * 60 + m + s / 60; // Convertir a minutos
                    tiemposEnMinutos1.push(total);*/

                    var tiempo2 = item.AHT ? item.AHT.split(':') : [0, 0, 0];
                    let horas = parseInt(tiempo2[0], 10);
                    let minutos = parseInt(tiempo2[1], 10);
                    let segundos = parseInt(tiempo2[2], 10);
                    tiemposEnMinutos2.push(minutos + '.' + segundos);

                });

                $scope.chartOptions = {
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
                                display: true,
                                align: 'top',
                                anchor: 'end',
                                borderRadius: 4,
                                color: 'rgb(0,0,85)',
                                offset: -3,
                                padding: 4,
                                textAlign: 'center',
                                font: {
                                    size: 10,
                                    weight: 'bold'
                                },
                            }
                        }, {
                            label: 'AHT',
                            data: tiemposEnMinutos2,
                            backgroundColor: 'rgba(0,200,255)',
                            borderColor: 'rgba(0,200,255)',
                            borderWidth: 1,
                            type: 'line',
                            fill: false,
                            datalabels: {
                                display: true,
                                align: 'start',
                                anchor: 'center',
                                borderRadius: 4,
                                color: 'white',
                                offset: 5,
                                padding: 4,
                                textAlign: 'center',
                                backgroundColor: function (context) {
                                    return context.dataset.backgroundColor;
                                },
                                font: {
                                    size: 10,
                                },
                            }
                        }, {
                            label: 'ASA',
                            data: tiemposEnMinutos1,
                            backgroundColor: 'rgba(255, 190, 0)',
                            borderColor: 'rgba(255, 190, 0)',
                            borderWidth: 2,
                            type: 'line',
                            fill: false,
                            datalabels: {
                                display: true,
                                align: 'end',
                                anchor: 'end',
                                borderRadius: 4,
                                color: 'white',
                                offset: 5,
                                padding: 4,
                                textAlign: 'center',
                                backgroundColor: function (context) {
                                    return context.dataset.backgroundColor;
                                },
                                font: {
                                    size: 10,
                                },
                                elements: {
                                    line: {
                                        fill: false,
                                        tension: 99.10
                                    }
                                },
                            }
                        }]
                    },
                    series: ['Tiempo en sistema', 'Tiempo atención', 'Tiempo en cola'],
                    options: {
                        responsive: true,
                        title: {
                            display: true,
                            text: 'Toip',
                            fontSize: 14,
                            fontColor: 'rgb(0, 0, 0)',
                            padding: 10
                        }, scales: {
                            yAxes: [{
                                scaleLabel: {
                                    display: true,
                                    labelString: "Cantidad toip"
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
                            display: true,
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

                var ctx4 = document.getElementById('chartToip').getContext('2d');
                $scope.myChart2 = new Chart(ctx4, $scope.chartOptions);

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

        function chartEtp(data) {
            let d = '';
            if (data) {
                d = data
            }
            services.myService(d, 'kpiCcoCtrl.php', 'chartEtp').then((d) => {
                var chart = $scope.myChart3;
                if (chart) {
                    chart.destroy();
                }
                let data = d.data.data;
                var hora = [];
                var tiemposEnMinutos1 = [];
                var tiemposEnMinutos2 = [];
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

                    var tiempo1 = item.ASA ? item.ASA.split(':') : [0, 0, 0];
                    let h = parseInt(tiempo1[0], 10);
                    let m = parseInt(tiempo1[1], 10);
                    let s = parseInt(tiempo1[2], 10);
                    tiemposEnMinutos1.push(m + '.' + s);

                    var tiempo2 = item.AHT ? item.AHT.split(':') : [0, 0, 0];
                    let horas = parseInt(tiempo2[0], 10);
                    let minutos = parseInt(tiempo2[1], 10);
                    let segundos = parseInt(tiempo2[2], 10);
                    tiemposEnMinutos2.push(minutos + '.' + segundos);

                });

                $scope.chartOptions = {
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
                                offset: -3,
                                padding: 4,
                                textAlign: 'center',
                                font: {
                                    size: 10,
                                    weight: 'bold'
                                },
                            }
                        }, {
                            label: 'AHT',
                            data: tiemposEnMinutos2,
                            backgroundColor: 'rgba(0,200,255)',
                            borderColor: 'rgba(0,200,255)',
                            borderWidth: 1,
                            type: 'line',
                            fill: false,
                            datalabels: {
                                display: true, // Mostrar las etiquetas de datos para este dataset
                                align: 'start',
                                anchor: 'center',
                                borderRadius: 4,
                                color: 'white',
                                offset: 5,
                                padding: 4,
                                textAlign: 'center',
                                backgroundColor: function (context) {
                                    return context.dataset.backgroundColor;
                                },
                                font: {
                                    size: 10,
                                },
                            }
                        }, {
                            label: 'ASA',
                            data: tiemposEnMinutos1,
                            backgroundColor: 'rgba(255, 190, 0)',
                            borderColor: 'rgba(255, 190, 0)',
                            borderWidth: 2,
                            type: 'line',
                            fill: false,
                            datalabels: {
                                display: true,
                                align: 'end',
                                anchor: 'end',
                                borderRadius: 4,
                                color: 'white',
                                offset: 5,
                                padding: 4,
                                textAlign: 'center',
                                backgroundColor: function (context) {
                                    return context.dataset.backgroundColor;
                                },
                                font: {
                                    size: 10,
                                },
                                elements: {
                                    line: {
                                        fill: false,
                                        tension: 99.10
                                    }
                                },
                            }
                        }]
                    },
                    series: ['Tiempo en sistema', 'Tiempo atención', 'Tiempo en cola'],
                    options: {
                        responsive: true,
                        title: {
                            display: true,
                            text: 'ETP',
                            fontSize: 14,
                            fontColor: 'rgb(0, 0, 0)',
                            padding: 10
                        }, scales: {
                            yAxes: [{
                                scaleLabel: {
                                    display: true,
                                    labelString: "Cantidad toip"
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
                            display: true,
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

                var ctx4 = document.getElementById('chartEtp').getContext('2d');
                $scope.myChart3 = new Chart(ctx4, $scope.chartOptions);

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

        function chartGpon(data) {
            let d = '';
            if (data) {
                d = data
            }
            services.myService(d, 'kpiCcoCtrl.php', 'chartGpon').then((d) => {
                var chart = $scope.myChart4;
                if (chart) {
                    chart.destroy();
                }
                let data = d.data.data;
                var hora = [];
                var tiemposEnMinutos1 = [];
                var tiemposEnMinutos2 = [];
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

                    var tiempo1 = item.ASA ? item.ASA.split(':') : [0, 0, 0];
                    let h = parseInt(tiempo1[0], 10);
                    let m = parseInt(tiempo1[1], 10);
                    let s = parseInt(tiempo1[2], 10);
                    tiemposEnMinutos1.push(m + '.' + s);

                    var tiempo2 = item.AHT ? item.AHT.split(':') : [0, 0, 0];
                    let horas = parseInt(tiempo2[0], 10);
                    let minutos = parseInt(tiempo2[1], 10);
                    let segundos = parseInt(tiempo2[2], 10);
                    tiemposEnMinutos2.push(minutos + '.' + segundos);

                });

                $scope.chartOptions = {
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
                                display: true,
                                align: 'top',
                                anchor: 'end',
                                borderRadius: 4,
                                color: 'rgb(0,0,85)',
                                offset: -3,
                                padding: 4,
                                textAlign: 'center',
                                font: {
                                    size: 10,
                                    weight: 'bold'
                                },

                            }
                        }, {
                            label: 'AHT',
                            data: tiemposEnMinutos2,
                            backgroundColor: 'rgba(0,200,255)',
                            borderColor: 'rgba(0,200,255)',
                            borderWidth: 1,
                            type: 'line',
                            fill: false,
                            datalabels: {
                                display: true,
                                align: 'start',
                                anchor: 'center',
                                borderRadius: 4,
                                color: 'white',
                                offset: 5,
                                padding: 4,
                                textAlign: 'center',
                                backgroundColor: function (context) {
                                    return context.dataset.backgroundColor;
                                },
                                font: {
                                    size: 10,
                                },
                            }
                        }, {
                            label: 'ASA',
                            data: tiemposEnMinutos1,
                            backgroundColor: 'rgba(255, 190, 0)',
                            borderColor: 'rgba(255, 190, 0)',
                            borderWidth: 2,
                            type: 'line',
                            fill: false,
                            datalabels: {
                                display: true,
                                align: 'end',
                                anchor: 'end',
                                borderRadius: 4,
                                color: 'white',
                                offset: 5,
                                padding: 4,
                                textAlign: 'center',
                                backgroundColor: function (context) {
                                    return context.dataset.backgroundColor;
                                },
                                font: {
                                    size: 10,
                                },
                                elements: {
                                    line: {
                                        fill: false,
                                        tension: 99.10
                                    }
                                },
                            }

                        }]
                    },
                    series: ['Tiempo en sistema', 'Tiempo atención', 'Tiempo en cola'],
                    options: {
                        responsive: true,
                        title: {
                            display: true,
                            text: 'Soporte GPON',
                            fontSize: 14,
                            fontColor: 'rgb(0, 0, 0)',
                            padding: 10
                        }, scales: {
                            yAxes: [{
                                scaleLabel: {
                                    display: true,
                                    labelString: "Cantidad etp"
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
                            display: true,
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

                var ctx4 = document.getElementById('chartGpon').getContext('2d');
                $scope.myChart4 = new Chart(ctx4, $scope.chartOptions);

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

        function chartValidacion(data) {
            let d = '';
            if (data) {
                d = data
            }
            services.myService(d, 'kpiCcoCtrl.php', 'chartValidacion').then((d) => {
                var chart = $scope.myChart5;
                if (chart) {
                    chart.destroy();
                }
                let data = d.data.data;
                var hora = [];
                var tiemposEnMinutos1 = [];
                var tiemposEnMinutos2 = [];
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

                    var tiempo1 = item.ASA ? item.ASA.split(':') : [0, 0, 0];
                    let h = parseInt(tiempo1[0], 10);
                    let m = parseInt(tiempo1[1], 10);
                    let s = parseInt(tiempo1[2], 10);
                    tiemposEnMinutos1.push(m + '.' + s);

                    var tiempo2 = item.AHT ? item.AHT.split(':') : [0, 0, 0];
                    let horas = parseInt(tiempo2[0], 10);
                    let minutos = parseInt(tiempo2[1], 10);
                    let segundos = parseInt(tiempo2[2], 10);
                    tiemposEnMinutos2.push(minutos + '.' + segundos);

                });

                $scope.chartOptions5 = {
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
                                display: true,
                                align: 'top',
                                anchor: 'end',
                                borderRadius: 4,
                                color: 'rgb(0,0,85)',
                                offset: -3,
                                padding: 4,
                                textAlign: 'center',
                                font: {
                                    size: 10,
                                    weight: 'bold'
                                },

                            }
                        }, {
                            label: 'AHT',
                            data: tiemposEnMinutos2,
                            backgroundColor: 'rgba(0,200,255)',
                            borderColor: 'rgba(0,200,255)',
                            borderWidth: 1,
                            type: 'line',
                            fill: false,
                            datalabels: {
                                display: true,
                                align: 'start',
                                anchor: 'center',
                                borderRadius: 4,
                                color: 'white',
                                offset: 5,
                                padding: 4,
                                textAlign: 'center',
                                backgroundColor: function (context) {
                                    return context.dataset.backgroundColor;
                                },
                                font: {
                                    size: 10,
                                },
                            }
                        }, {
                            label: 'ASA',
                            data: tiemposEnMinutos1,
                            backgroundColor: 'rgba(255, 190, 0)',
                            borderColor: 'rgba(255, 190, 0)',
                            borderWidth: 2,
                            type: 'line',
                            fill: false,
                            datalabels: {
                                display: true,
                                align: 'end',
                                anchor: 'end',
                                borderRadius: 4,
                                color: 'white',
                                offset: 5,
                                padding: 4,
                                textAlign: 'center',
                                backgroundColor: function (context) {
                                    return context.dataset.backgroundColor;
                                },
                                font: {
                                    size: 10,
                                },
                                elements: {
                                    line: {
                                        fill: false,
                                        tension: 99.10
                                    }
                                },
                            }

                        }]
                    },
                    series: ['Tiempo en sistema', 'Tiempo atención', 'Tiempo en cola'],
                    options: {
                        responsive: true,
                        title: {
                            display: true,
                            text: 'Grafico Validación',
                            fontSize: 14,
                            fontColor: 'rgb(0, 0, 0)',
                            padding: 10
                        }, scales: {
                            yAxes: [{
                                scaleLabel: {
                                    display: true,
                                    labelString: "Cantidad"
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
                            display: true,
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

                var ctx5 = document.getElementById('chartValidacion').getContext('2d');
                $scope.myChart5 = new Chart(ctx5, $scope.chartOptions5);

                $scope.toggleDataset = function (index) {
                    if (index >= 0 && index < $scope.chartOptions5.data.datasets.length) {
                        var dataset = $scope.chartOptions5.data.datasets[index];
                        dataset.hidden = !dataset.hidden;
                        $scope.chart.update();
                    }
                };
            }).catch((e) => {
                console.log(e);
            })
        }

        function chartEmt(data) {
            let d = '';
            if (data) {
                d = data
            }
            services.myService(d, 'kpiCcoCtrl.php', 'chartEmt').then((d) => {
                var chart = $scope.myChart6;
                if (chart) {
                    chart.destroy();
                }
                let data = d.data.data;
                var hora = [];
                var tiemposEnMinutos1 = [];
                var tiemposEnMinutos2 = [];
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

                    var tiempo1 = item.ASA ? item.ASA.split(':') : [0, 0, 0];
                    let h = parseInt(tiempo1[0], 10);
                    let m = parseInt(tiempo1[1], 10);
                    let s = parseInt(tiempo1[2], 10);
                    tiemposEnMinutos1.push(m + '.' + s);

                    var tiempo2 = item.AHT ? item.AHT.split(':') : [0, 0, 0];
                    let horas = parseInt(tiempo2[0], 10);
                    let minutos = parseInt(tiempo2[1], 10);
                    let segundos = parseInt(tiempo2[2], 10);
                    tiemposEnMinutos2.push(minutos + '.' + segundos);

                });

                $scope.chartOptions6 = {
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
                                display: true,
                                align: 'top',
                                anchor: 'end',
                                borderRadius: 4,
                                color: 'rgb(0,0,85)',
                                offset: -3,
                                padding: 4,
                                textAlign: 'center',
                                font: {
                                    size: 10,
                                    weight: 'bold'
                                },
                            }
                        }, {
                            label: 'AHT',
                            data: tiemposEnMinutos2,
                            backgroundColor: 'rgba(0,200,255)',
                            borderColor: 'rgba(0,200,255)',
                            borderWidth: 1,
                            type: 'line',
                            fill: false,
                            datalabels: {
                                display: true,
                                align: 'start',
                                anchor: 'center',
                                borderRadius: 4,
                                color: 'white',
                                offset: 5,
                                padding: 4,
                                textAlign: 'center',
                                backgroundColor: function (context) {
                                    return context.dataset.backgroundColor;
                                },
                                font: {
                                    size: 10,
                                },
                            }
                        }, {
                            label: 'ASA',
                            data: tiemposEnMinutos1,
                            backgroundColor: 'rgba(255, 190, 0)',
                            borderColor: 'rgba(255, 190, 0)',
                            borderWidth: 2,
                            type: 'line',
                            fill: false,
                            datalabels: {
                                display: true,
                                align: 'end',
                                anchor: 'end',
                                borderRadius: 4,
                                color: 'white',
                                offset: 5,
                                padding: 4,
                                textAlign: 'center',
                                backgroundColor: function (context) {
                                    return context.dataset.backgroundColor;
                                },
                                font: {
                                    size: 10,
                                },
                                elements: {
                                    line: {
                                        fill: false,
                                        tension: 99.10
                                    }
                                },
                            }

                        }]
                    },
                    series: ['Tiempo en sistema', 'Tiempo atención', 'Tiempo en cola'],
                    options: {
                        responsive: true,
                        title: {
                            display: true,
                            text: 'Grafico emtelco',
                            fontSize: 14,
                            fontColor: 'rgb(0, 0, 0)',
                            padding: 10
                        }, scales: {
                            yAxes: [{
                                scaleLabel: {
                                    display: true,
                                    labelString: "Cantidad"
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
                            display: true,
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

                var ctx6 = document.getElementById('chartEmt').getContext('2d');
                $scope.myChart6 = new Chart(ctx6, $scope.chartOptions6);

                $scope.toggleDataset = function (index) {
                    if (index >= 0 && index < $scope.chartOptions6.data.datasets.length) {
                        var dataset = $scope.chartOptions6.data.datasets[index];
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
