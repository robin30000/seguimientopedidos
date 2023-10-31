(function () {
    "use strict";
    angular.module("seguimientopedidos").controller("RguCtrl", RguCtrl);
    RguCtrl.$inject = ["$scope", "$http", "$rootScope", "$route", "services", "$filter"];

    function RguCtrl($scope, $http, $rootScope, $route, services) {
        var tiempo = new Date().getTime();
        var date1 = new Date();
        var year = date1.getFullYear();
        var month =
            date1.getMonth() + 1 <= 9
                ? "0" + (date1.getMonth() + 1)
                : date1.getMonth() + 1;
        var day = date1.getDate() <= 9 ? "0" + date1.getDate() : date1.getDate();

        tiempo = year + "-" + month + "-" + day;
        $scope.mn = {};

        init();

        function init() {
            mesa1();
        }

        $scope.buscar = (data) => {
            if (!data) {
                Swal({
                    type: 'error',
                    title: 'Oppss..',
                    text: 'debes ingresar una fecha',
                    timer: 4000
                })
                return;
            }
            mesa1(data);
        }

        function mesa1(data) {

            services.myService(data, 'graficoRguCtrl.php', 'datos').then((res) => {
                console.log(res);
                $scope.rgu = res.data.data;
                $scope.fecha = res.data.data[0].fecha;

                var chart = $scope.myChart;
                if (chart) {
                    chart.destroy();
                }
                $scope.loading = 0;

                let f = [
                    {hora: "10:00 AM", meta: "15"},
                    {hora: "11:00 AM", meta: "27"},
                    {hora: "12:00 PM", meta: "39"},
                    {hora: "1:00 PM", meta: "50"},
                    {hora: "2:00 PM", meta: "60"},
                    {hora: "3:00 PM", meta: "69"},
                    {hora: "4:00 PM", meta: "79"},
                    {hora: "5:00 PM", meta: "92"},
                    {hora: "6:00 PM", meta: "100"},
                    {hora: "7:00 PM", meta: "100"},
                    {hora: "8:00 PM", meta: "100"}
                ];
                let datos = res.data.data;
                let arregloConHorasYMetas = datos.map((obj, index) => {
                    return {
                        ...obj,
                        ...f[index]
                    };
                });

                $scope.rgu = arregloConHorasYMetas;
                /*var meta = datos.map(function (dato) {
                    return parseFloat(dato.meta);
                });*/

                var nacional = datos.map(function (dato) {
                    return parseFloat(dato.nacional);
                });

                var andina = datos.map(function (dato) {
                    return parseFloat(dato.andina);
                });

                var costa = datos.map(function (dato) {
                    return parseFloat(dato.costa);
                });

                var bogota = datos.map(function (dato) {
                    return parseFloat(dato.bogota);
                });

                var sur = datos.map(function (dato) {
                    return parseFloat(dato.sur);
                });

                var hora = datos.map(function (dato) {
                    return parseFloat(dato.hora);
                });


                const horas = f.map((dato) => dato.hora);
                const metas = f.map((dato) => parseInt(dato.meta));

                const horasFormateadas = datos.map((item) => {
                    // Formato de cadena de hora válido: "HH:MM AM/PM"
                    const horaDate = new Date(`2023-10-04 ${item.hora}`);
                    const horas = horaDate.getHours();
                    const minutos = horaDate.getMinutes();
                    const ampm = horas >= 12 ? "PM" : "AM";
                    const horaFormateada = `${horas % 12 || 12}:${minutos < 10 ? "0" : ""}${minutos} ${ampm}`;
                    return horaFormateada;
                });

                let bottom = function(items) {
                    const pos = components.Tooltip.positioners.average(items);

                    // Happens when nothing is found
                    if (pos === false) {
                        return false;
                    }

                    const chart = this._chart;

                    return {
                        x: pos.x,
                        y: chart.chartArea.bottom,
                    };
                };

                var ctx = document.getElementById('lineChart').getContext('2d');
                var delayed;
                $scope.myChart = new Chart(ctx, {
                    type: 'line',

                    data: {
                        labels: horas,
                        datasets: [
                            {
                                label: 'Meta',
                                borderColor: 'rgb(162,154,154)',
                                backgroundColor: 'rgb(162,154,154)',
                                data: metas,
                                fill: false,
                                datalabels: {
                                    display: true, // Mostrar las etiquetas de datos para este dataset
                                    align: 'top',
                                    anchor: 'start'
                                }
                                /*datalabels: {
                                    align: function (context) {
                                        return context.active ? 'start' : 'center';
                                    }
                                }*/
                            },
                            {
                                label: 'Nacional',
                                borderColor: 'rgb(55, 200, 70)',
                                backgroundColor: 'rgb(55, 200, 70)',
                                data: nacional,
                                fill: false,
                                borderDash: [5, 5],
                                datalabels: {
                                    display: true, // Mostrar las etiquetas de datos para este dataset
                                    align: 'bottom',
                                    anchor: 'start'
                                }
                            },
                            {
                                label: 'Andina',
                                borderColor: 'rgb(0, 200, 255)',
                                backgroundColor: 'rgb(0, 200, 255)',
                                data: andina,
                                fill: false,
                                borderDash: [5, 5],
                                datalabels: {
                                    align: 'bottom',
                                    anchor: 'center'
                                }
                            },
                            {
                                label: 'Costa',
                                borderColor: 'rgb(240, 120, 30)',
                                backgroundColor: 'rgb(240, 120, 30)',
                                data: costa,
                                fill: false,
                                borderDash: [5, 5],
                                datalabels: {
                                    align: 'right',
                                    anchor: 'center'
                                },
                                display: 'auto'
                            },
                            {
                                label: 'Bogotá',
                                borderColor: 'rgb(255, 190, 0)',
                                backgroundColor: 'rgb(255, 190, 0)',
                                data: bogota,
                                fill: false,
                                borderDash: [5, 5],
                                datalabels: {
                                    align: 'bottom',
                                    anchor: 'center'
                                }
                            },
                            {
                                label: 'Sur',
                                borderColor: 'rgb(0, 0, 85)',
                                backgroundColor: 'rgb(0, 0, 85)',
                                data: sur,
                                fill: false,
                                borderDash: [5, 5],
                                datalabels: {
                                    align: 'right',
                                    anchor: 'center'
                                }
                            }
                        ]
                    },
                    options: {
                        tooltip:{
                            position : bottom
                        },
                        interaction: {
                            intersect: false,
                            mode: 'index',
                        },
                        animation: {
                            onComplete: () => {
                                delayed = true;
                            },
                            delay: (context) => {
                                let delay = 0;
                                if (context.type === 'data' && context.mode === 'default' && !delayed) {
                                    delay = context.dataIndex * 300 + context.datasetIndex * 100;
                                }
                                return delay;
                            },
                        },
                        hoverRadius: 12,
                        hoverBackgroundColor: 'yellow',

                        responsive: true,
                        title: {
                            display: true,
                            text: 'Meta v Cumplimiento',
                            position: 'top',
                        },
                        plugins: {

                            datalabels: {
                                display: false,
                                backgroundColor: function (context) {
                                    return context.dataset.backgroundColor;
                                },
                                /*backgroundColor: function(context) {
                                    return context.active ? context.dataset.backgroundColor : 'white';
                                },
                                borderColor: function(context) {
                                    return context.dataset.backgroundColor;
                                },
                                borderRadius: function(context) {
                                    return context.active ? 0 : 32;
                                },
                                borderWidth: 3,
                                color: function(context) {
                                    return context.active ? 'white' : context.dataset.backgroundColor;
                                },
                                font: {
                                    weight: 'bold'
                                },
                                formatter: function(value, context) {
                                    value = Math.round(value * 100) / 100;
                                    return context.active
                                        ? context.dataset.label + '\n' + value + '%'
                                        : Math.round(value);
                                },*/
                                font: {
                                    size: 12,
                                    weight: 'bold'
                                },
                                formatter: function (value) {
                                    return value + ' %';
                                },
                                borderRadius: 4,
                                color: 'white',
                                offset: 10,
                                padding: 3,
                                textAlign: 'center'
                            },

                        },

                        // Core options
                        aspectRatio: 5 / 3,
                        layout: {
                            padding: {
                                top: 32,
                                right: 16,
                                bottom: 16,
                                left: 8
                            }
                        },
                        elements: {
                            line: {
                                fill: false,
                                tension: 0.10
                            }
                        },
                        scales: {
                            y: {
                                stacked: false
                            }
                        },
                        hover: {
                            mode: 'index',
                            intersect: true
                        },
                        legend: {
                            display: true,
                            position: 'top',
                            padding: {
                                bottom: 200,
                                top: 100
                            }
                        }
                    }


                    /*options: {
                        responsive: true,
                        title: {
                            display: true,
                            text: 'Meta v Cumplimiento',
                            position: 'top',
                        },
                        plugins: {
                            datalabels: {
                                align: 'start',
                                anchor: 'start'
                            },
                            borderRadius: 4,
                            color: 'white',
                            font: {
                                weight: 'bold'
                            },
                            formatter: Math.round,
                            padding: 6
                        },
                        aspectRatio: 5 / 3,
                        layout: {
                            padding: {
                                top: 32,
                                right: 16,
                                bottom: 16,
                                left: 8
                            }
                        },
                        elements: {
                            line: {
                                fill: false,
                                tension: 0.4
                            }
                        },
                        scales: {
                            y: {
                                stacked: true
                            }
                        },

                        legend: {
                            display: true,
                            position: 'top',
                            padding: {
                                bottom: 200,
                                top: 100
                            }
                        }
                    }*/
                });
            }).catch((e) => {
                console.log(e)
            })
        }

    }
})();
