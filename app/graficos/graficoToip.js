(function () {
    "use strict";
    angular.module("seguimientopedidos").controller("GraficoToipCtrl", GraficoToipCtrl);
    GraficoToipCtrl.$inject = ["$scope", "$http", "$rootScope", "$route", "services", "$filter"];

    function GraficoToipCtrl($scope, $http, $rootScope, $route, services) {
        $scope.tiempo = {};

        init();

        function init() {
            graficos();
            graficoTiempo();
            gestionPorHora();
            registro_15();
            consolidado();
            detalles_contingencias();
        }

        $scope.formatearFecha = function (fecha) {
            var fechaDate = new Date(fecha);
            var mes = (fechaDate.getMonth() + 1).toString().padStart(2, '0');
            var dia = fechaDate.getDate().toString().padStart(2, '0');
            return mes + '-' + dia;
        };

        function registro_15(data) {
            $scope.loading = 1;

            let datos = '';
            if (!data) {
                datos = '';
            } else {
                datos = data;
            }
            services.myService(datos, 'toipCtrl.php', 'registro_15').then((data) => {
                $scope.registro_15 = data.data.data;
                let datos = data.data.data;
                var sumaHorasPorDia = {};

                for (var i = 0; i < datos.length; i++) {
                    var fecha = datos[i].fecha;
                    var horas = 0;


                    for (var j = 0; j <= 10; j++) {
                        horas += parseInt(datos[i][j] || 0);
                    }


                    if (sumaHorasPorDia[fecha]) {
                        sumaHorasPorDia[fecha] += horas;
                    } else {
                        sumaHorasPorDia[fecha] = horas;
                    }
                }

            }).catch(e => {
                console.log(e)
            })
        }

        function consolidado(data) {
            $scope.loading = 1;

            let datos = '';
            if (!data) {
                datos = '';
            } else {
                datos = data;
            }
            services.myService(datos, 'toipCtrl.php', 'consolidado').then((data) => {
                $scope.consolidado = data.data.data;

                let datos = data.data.data;

                var consolidadoPorDiaYColumna = {};
                for (var i = 0; i < datos.length; i++) {
                    var fecha = datos[i].fecha;
                    var tipificacion = datos[i].tipificacion;

                    for (var hora = 0; hora <= 10; hora++) {
                        var cantidadHoras = parseInt(datos[i][hora] || 0);

                        var clave = fecha + '-' + hora;

                        if (!consolidadoPorDiaYColumna[clave]) {
                            consolidadoPorDiaYColumna[clave] = 0;
                        }
                        consolidadoPorDiaYColumna[clave] += cantidadHoras;
                    }
                }
                $scope.consolidadoPorDiaYColumna = consolidadoPorDiaYColumna;

            }).catch(e => {
                console.log(e)
            })
        }

        function detalles_contingencias(data) {
            $scope.loading = 1;

            let datos = '';
            if (!data) {
                datos = '';
            } else {
                datos = data;
            }
            services.myService(datos, 'toipCtrl.php', 'detalles_contingencias').then((data) => {
                $scope.detalles_contingencias = data.data.data;

                let datos = data.data.data;

                var consolidadoPorDia = {};
                for (var i = 0; i < datos.length; i++) {
                    var fecha = datos[i].fecha;
                    var tipificacion = datos[i].tipificacion;

                    for (var hora = 0; hora <= 10; hora++) {
                        var cantidadHoras = parseInt(datos[i][hora] || 0);

                        var clave = fecha + '-' + hora;

                        if (!consolidadoPorDia[clave]) {
                            consolidadoPorDia[clave] = 0;
                        }

                        consolidadoPorDia[clave] += cantidadHoras;
                    }
                }
                $scope.consolidadoPorDia = consolidadoPorDia;
            }).catch(e => {
                console.log(e)
            })
        }

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

            graficos(data);
            graficoTiempo(data);
            gestionPorHora(data);
            consolidado(data);
            detalles_contingencias(data);
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
            $scope.loading = 1;

            let datos = '';
            if (!data) {
                datos = '';
            } else {
                datos = data;
            }
            services.myService(datos, 'toipCtrl.php', 'graficos')
                .then((respuestas) => {
                    if (respuestas.data.state) {
                        var chart = $scope.myChart;
                        if (chart) {
                            chart.destroy();
                        }
                        $scope.loading = 0;
                        let data = respuestas.data.data;

                        function asignarColor(tipificacion) {
                            switch (tipificacion) {
                                case "No funciono":
                                    return "rgb(55, 200, 70)"
                                case "Aprovisionamiento automático":
                                    return "rgb(0, 0, 85)"; // Color para "No funciono"
                                case "Aprovisionado por contingencia":
                                    return "rgb(0, 200, 255)"; // Color para "Aprovisionado por contingencia"
                                default:
                                    return "#000000"; // Color predeterminado en caso de coincidencia
                            }
                        }

                        const total = data.reduce((accumulator, item) => accumulator + parseInt(item.count), 0);

                        var labels = data.map(function (item) {
                            return item.tipificacion;
                        });

                        var counts = data.map(function (item) {
                            return parseInt(item.count);
                        });

                        data.forEach(item => {
                            item.color = asignarColor(item.tipificacion);
                        });

                        var colors = data.map(function (item) {
                            return item.color;
                        });

                        var ctx = document.getElementById('myChart').getContext('2d');
                        $scope.myChart = new Chart(ctx, {
                            type: 'doughnut',
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
                                    text: 'Grafico Toip (Consolidado: ' + total + ')',
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
                                            return value + ' : ' + ((value / total) * 100).toFixed(1) + '%';
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

        function graficoTiempo(data) {
            $scope.loading = 1;

            let datos = '';
            if (!data) {
                datos = '';
            } else {
                datos = data;
            }
            services.myService(datos, 'toipCtrl.php', 'graficoTiempo')
                .then((respuestas) => {
                    $scope.mensaje = 0
                    if (respuestas.data.state) {
                        var chart = $scope.myChart1;
                        if (chart) {
                            chart.destroy();
                        }
                        $scope.loading = 0;
                        let data = respuestas.data.data;
                        $scope.data = respuestas.data.data;
                        const total = data.reduce((accumulator, item) => accumulator + parseInt(item.count), 0);
                        var labels = data.map(function (item) {
                            return item.subtipificacion;
                        });

                        var counts = data.map(function (item) {
                            return parseInt(item.count);
                        });

                        var suma = data.reduce(function (a, b) {
                            return a + parseFloat(b);
                        }, 0);

                        function asignarColor(tipificacion) {
                            switch (tipificacion) {
                                case "Cm_offline":
                                    return "rgb(0, 0, 85)"; // Color para "No funciono"
                                case "Se requiere reiniciar":
                                    return "rgb(55, 200, 40)"; // Color para "Aprovisionamiento automático"
                                case "Garantía instalación":
                                    return "rgb(0, 200, 255)"; // Color para "Aprovisionado por contingencia"
                                case "Numero mal creado/No creado ims":
                                    return "rgb(240, 120, 30)";
                                case "Contingencia OK":
                                    return "rgb(0, 55, 123)"; // Color para "Aprovisionado por contingencia"
                                default:
                                    return "#000000"; // Color predeterminado en caso de coincidencia
                            }
                        }

                        data.forEach(item => {
                            item.color = asignarColor(item.subtipificacion);
                        });

                        var colors = data.map(function (item) {
                            return item.color;
                        });

                        var ctx = document.getElementById('myChartTiempo').getContext('2d');
                        $scope.myChart1 = new Chart(ctx, {
                            type: 'doughnut',
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
                                    text: 'Detalles no funciono (Consolidado: ' + total + ')',
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
                                            return value + ' : ' + ((value / total) * 100).toFixed(1) + '%';
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
                        })
                    } else {
                        $scope.mensaje = respuestas.data.msj
                    }

                }).catch((e) => {
                console.log(e)
            })

        }

        function gestionPorHora(data) {
            $scope.loading = 1;

            let datos = '';
            if (!data) {
                datos = '';
            } else {
                datos = data;
            }
            services.myService(datos, 'toipCtrl.php', 'gestionPorHora').then((data) => {
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

    }
})();
