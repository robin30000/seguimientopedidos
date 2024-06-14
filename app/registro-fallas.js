(function () {
    "use strict";
    angular.module("seguimientopedidos").controller("registroFallasCtrl", registroFallasCtrl);
    registroFallasCtrl.$inject = ["$scope", "services", "$routeParams", "$route", "$http", "cargaRegistros", "$uibModal", "$rootScope", "$log"];

    function registroFallasCtrl($scope, services, $routeParams, $route, $http, cargaRegistros, $uibModal, $rootScope, $log) {
        $scope.falla = {};
        init();

        function init() {
            listarTipificaciones();
        }

        function listarTipificaciones() {
            try {
                services.myService('', 'RegistroFallasCtrl.php', 'listarTipificaciones').then((data) => {

                    $scope.plataforma_1 = data.data.plataforma;
                    $scope.plataforma_1.push({valor: 'OTRO'});
                    $scope.plataforma_2 = data.data.plataforma_2;
                    $scope.procesos_afectados = data.data.procesos_afectados;
                    $scope.servicios_impactados = data.data.servicios_impactados;
                    $scope.tecnologia = data.data.tecnologia;
                }).catch((e) => {
                    console.log(e);
                })

            } catch (e) {
                console.log(e);
            }
        }

        function uploadFile(data) {
            var file = data;
            var uploadUrl = "api/class/subeArchivo.php";

            cargaRegistros.uploadFileToUrl(file, uploadUrl)
        }

        $scope.guardar = (data) => {
            $scope.loading = 1;
            if ($scope.myFile) {
                uploadFile($scope.myFile);
                data.imagen = $scope.myFile.name;
            } else {
                data.imagen = '';
            }

            data.login_solicita = $rootScope.galletainfo.login
            services.myService(data, 'RegistroFallasCtrl.php', 'insertarRegistroFallas').then((data) => {
                $scope.loading = 0;
                if (data.data.status === 1) {
                    Swal({
                        type: 'success',
                        title: 'Bien',
                        text: data.data.msj,
                        timer: 4000
                    }).then(() => {
                        $route.reload();
                    })
                } else {
                    Swal({
                        type: 'error',
                        title: 'Ops...',
                        text: data.data.msj,
                        timer: 4000
                    })
                }
            }).catch((e) => {
                console.log(e);
            })

        }

        $scope.pageChanged = function () {
            let data = {'buscar': $scope.mn}
            //registros(data);
            $scope.registrosMnTiempo(data);
        }
        $scope.pageSizeChanged = function () {
            let data = $scope.mn
            //registros(data);
            $scope.registrosMnTiempo(data);
        }

    }

    angular.module("seguimientopedidos").controller("miRegistroFallasCtrl", miRegistroFallasCtrl);
    miRegistroFallasCtrl.$inject = ["$scope", "services", "$routeParams", "$route", "$http", "cargaRegistros", "$uibModal", "$rootScope", "$log"];

    function miRegistroFallasCtrl($scope, services, $routeParams, $route, $http, cargaRegistros, $uibModal, $rootScope, $log) {
        $scope.falla = {};
        $scope.noImg = 0
        init();

        function init() {
            miRegistrosFallas();
        }


        function miRegistrosFallas(data) {
            let datos = {};
            if (!data) {
                $scope.currentPage = 1;
                $scope.totalItems = 0;
                $scope.pageSize = 15;
                $scope.searchText = '';
                datos = {'page': $scope.currentPage, 'size': $scope.pageSize, 'login': $rootScope.galletainfo.login}
            } else {
                datos = data;
            }

            $scope.loading = 1;
            services.myService(datos, 'RegistroFallasCtrl.php', 'miRegistrosFallas').then((data) => {
                $scope.loading = 0;
                if (data.data.status === 1) {
                    $scope.totalItems = data.data.counter
                    $scope.miRegistrosFallas = data.data.data;

                    $scope.startItem = ($scope.currentPage - 1) * $scope.pageSize + 1;
                    $scope.endItem = $scope.currentPage * $scope.pageSize;
                    if ($scope.endItem > data.data.counter) {
                        $scope.endItem = data.data.counter;
                    }
                }else{
                    $scope.totalItems = 0
                    $scope.miRegistrosFallas = '';
                }
            }).catch((e) => {
                console.log(e);
            })
        }

        $scope.pageChanged = function () {
            let data = {
                'page': $scope.currentPage,
                'size': $scope.pageSize,
                'data': $scope.buscar,
                'login': $rootScope.galletainfo.login
            }
            miRegistrosFallas(data);
        }
        $scope.pageSizeChanged = function () {
            let data = {
                'page': $scope.currentPage,
                'size': $scope.pageSize,
                'data': $scope.buscar,
                'login': $rootScope.galletainfo.login
            }
            miRegistrosFallas(data);
        }

        $scope.ObservacioAvance = (dataFalla) => {
            let datos = {id: dataFalla.id, login: $rootScope.galletainfo.login}
            services.myService(datos, 'RegistroFallasCtrl.php', 'verObservacioAvance').then((data) => {
                if (data.data.status === 1) {
                    $scope.observaciones = data.data.data
                    $scope.data = dataFalla;
                    $('#observacionesModal').modal('show');
                    //miRegistrosFallas();
                } else {
                    Swal({
                        type: 'error',
                        title: 'Ops...',
                        text: data.data.msj,
                        timer: 4000
                    })
                }
            }).catch((e) => {
                console.log(e)
            })

        }

        $scope.guardarObservacion = (data) => {
            if (!data.observaciones) {
                Swal({
                    type: 'error',
                    title: 'Opps..',
                    text: 'Debes escribir una observación',
                    timer: 4000
                })
                return;
            }

            let datos = {id: data.id, observacion: data.observaciones, usuario: $rootScope.galletainfo.login}
            services.myService(datos, 'RegistroFallasCtrl.php', 'ObservacioAvance').then((data) => {
                if (data.data.status === 1) {
                    $('#observacionesModal').modal('hide');
                    Swal({
                        type: 'success',
                        title: 'Bien',
                        text: data.data.msj,
                        timer: 4000
                    }).then(() => {
                        miRegistrosFallas();
                    })

                } else {
                    Swal({
                        type: 'error',
                        title: 'Opps..',
                        text: data.data.msj,
                        timer: 4000
                    })
                }
            }).catch((e) => {
                console.log(e)
            });
        }

        $scope.mostrarImagen = (nombreArchivo) => {
            $scope.archivoUrl = '';
            if (nombreArchivo === '') {
                Swal({
                    type: 'error',
                    title: 'Opps..',
                    text: 'No hay Adjuntos para mostrar',
                    timer: 4000
                })
                return
            }

            let extension = nombreArchivo.split('.').pop().toLowerCase();
            if (extension === 'jpg' || extension === 'jpeg' || extension === 'png' || extension === 'gif') {
                $scope.noImg = 0
                document.getElementById("imagenModalContenido").src = './uploads/' + nombreArchivo;
                $('#imagenModal').modal('show');
            } else {
                $scope.noImg = true;
                $scope.archivoUrl = './uploads/' + nombreArchivo;
                $scope.descargarArchivo = function () {
                    window.location.href = $scope.archivoUrl;
                };
                Swal({
                    type: 'error',
                    title: 'Oops..',
                    text: 'No es una imagen. ¿Deseas descargar el archivo?',
                    showCancelButton: true,
                    confirmButtonText: 'Descargar',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.value) {
                        $scope.descargarArchivo();
                    }
                    $route.reload();
                });
            }
        };

        $scope.buscarTT = (data) => {
            if (!data) {
                Swal({
                    type: 'error',
                    title: 'Opps..',
                    text: 'Debes escribir el TT',
                    timer: 4000
                })
                return;
            }
            let datos = '';
            if (!data) {
                $scope.currentPage = 1;
                $scope.totalItems = 0;
                $scope.pageSize = 15;
                $scope.searchText = '';
                datos = {'page': $scope.currentPage, 'size': $scope.pageSize, 'data': ''}
            } else {
                datos = {'page': $scope.currentPage, 'size': $scope.pageSize, 'data': data, 'login': $rootScope.galletainfo.login};
            }

            miRegistrosFallas(datos);
        }

        $scope.recargar = () => {
            $scope.buscar = ''
            miRegistrosFallas();
        }
    }

    angular.module("seguimientopedidos").controller("registrosFallasCtrl", registrosFallasCtrl);
    registrosFallasCtrl.$inject = ["$scope", "services", "$routeParams", "$route", "$http", "cargaRegistros", "$uibModal", "$rootScope", "$log"];

    function registrosFallasCtrl($scope, services, $routeParams, $route, $http, cargaRegistros, $uibModal, $rootScope, $log) {
        var tiempo = new Date().getTime();
        var date1 = new Date();
        var year = date1.getFullYear();
        var month =
            date1.getMonth() + 1 <= 9
                ? "0" + (date1.getMonth() + 1)
                : date1.getMonth() + 1;
        var day = date1.getDate() <= 9 ? "0" + date1.getDate() : date1.getDate();

        tiempo = year + "-" + month + "-" + day;

        $scope.falla = {};
        init();
        $scope.f = {}

        function init() {
            registrosFallas();
        }

        function registrosFallas(data) {
            let datos = {};
            if (!data) {
                $scope.currentPage = 1;
                $scope.totalItems = 0;
                $scope.pageSize = 15;
                datos = {'page': $scope.currentPage, 'size': $scope.pageSize}

            } else {
                datos = data
            }

            $scope.loading = 1;

            services.myService(datos, 'RegistroFallasCtrl.php', 'registrosFallas').then((data) => {
                $scope.loading = 0;
                if (data.data.status === 1) {
                    $scope.fallas = data.data.data;

                    $scope.totalItems = data.data.counter;
                    $scope.startItem = ($scope.currentPage - 1) * $scope.pageSize + 1;
                    $scope.endItem = $scope.currentPage * $scope.pageSize;
                    if ($scope.endItem > data.data.counter) {
                        $scope.endItem = data.data.counter;
                    }
                } 

            }).catch((e) => {
                console.log(e);
            })
        }

        $scope.pageChanged = function () {
            let data = {'page': $scope.currentPage, 'size': $scope.pageSize, 'data': $scope.f}
            registrosFallas(data);
        }
        $scope.pageSizeChanged = function () {
            let data = {'page': $scope.currentPage, 'size': $scope.pageSize, 'data': $scope.f}
            registrosFallas(data);
        }

        $scope.mostrarImagen = (nombreArchivo) => {

            if (nombreArchivo === '') {
                Swal({
                    type: 'error',
                    title: 'Opps..',
                    text: 'No hay Adjuntos para mostrar',
                    timer: 4000
                })
                return
            }

            let extension = nombreArchivo.split('.').pop().toLowerCase();
            if (extension === 'jpg' || extension === 'jpeg' || extension === 'png' || extension === 'gif') {
                $scope.noImg = 0
                document.getElementById("imagenModalContenido").src = './uploads/' + nombreArchivo;
                $('#imagenModal').modal('show');
            } else {
                $scope.noImg = true;
                $scope.archivoUrl = './uploads/' + nombreArchivo;
                $scope.descargarArchivo = function () {
                    window.location.href = $scope.archivoUrl;
                };
                Swal({
                    type: 'error',
                    title: 'Oops..',
                    text: 'No es una imagen. ¿Deseas descargar el archivo?',
                    showCancelButton: true,
                    confirmButtonText: 'Descargar',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.value) {
                        $scope.descargarArchivo();
                    }
                    $route.reload();
                });
            }
        };

        $scope.ObservacioAvance = (dataFalla) => {

            let datos = {id: dataFalla.id, login: dataFalla.login_gestion}
            services.myService(datos, 'RegistroFallasCtrl.php', 'verObservacioAvance').then((data) => {
                if (data.data.status) {
                    $scope.observaciones = data.data.data
                    $scope.data = dataFalla;
                    $('#observacionesModal').modal('show');
                }

            }).catch((e) => {
                console.log(e)
            })

        }
        $scope.recarga = () => {
            $scope.f = {};
            registrosFallas();
        }

        $scope.buscaRegistrosFalla = (f) => {
            if (!f) {
                Swal({
                    type: 'error',
                    title: 'Oppss',
                    text: 'Debes seleccionar un rango de fecha / concepto',
                    timer: 4000
                })
                return;
            }

            if (f.buscar) {
                if (!f.concepto || f.concepto === '') {
                    Swal({
                        type: 'error',
                        title: 'Opps..',
                        text: 'Debes ingresar el concepto',
                        timer: 4000
                    });
                    return
                }
            }
            let data = {'page': $scope.currentPage, 'size': $scope.pageSize, 'data': f}
            registrosFallas(data);
        }

        $scope.csvFallas = (data) => {
            if (!data) {
                Swal({
                    type: 'error',
                    title: 'Oppss',
                    text: 'Debes seleccionar un rango de fecha'
                })
                return;
            }
            if (data.fechaini > data.fechafin) {
                Swal({
                    type: 'error',
                    title: 'Oppss',
                    text: 'La fecha inicial no puede ser mayor a la fecha final',
                    timer: 4000
                })
                return;
            }
            $scope.loading = 1;
            let datos = {'page': $scope.currentPage, 'size': $scope.pageSize, 'data': data, 'export': 1}
            services.myService(datos, 'RegistroFallasCtrl.php', 'ExportaRegistroFalla').then((data) => {
                $scope.loading = 0;
                if (data.data.status) {
                    var wb = XLSX.utils.book_new();
                    var ws = XLSX.utils.json_to_sheet(data.data.data);
                    XLSX.utils.book_append_sheet(wb, ws, 'fallas');
                    XLSX.writeFile(wb, 'fallas_' + tiempo + '.xlsx');
                } else {
                    Swal({
                        type: 'error',
                        title: 'Opps..',
                        text: data.data.msj,
                        timer: 4000
                    })
                }
            });
        }

        $scope.verFalla = (d) => {

            let datos = {id: d.id, login: d.login_gestion}
            services.myService(datos, 'RegistroFallasCtrl.php', 'verObservacioAvance').then((data) => {
                if (data.data.status) {
                    $scope.observaciones = data.data.data
                    $scope.data = d;
                    $scope.falla = d;
                    $('#verFallaModal').modal('show');
                }

            }).catch((e) => {
                console.log(e)
            })
        }

        $scope.descargaFalla = function (d) {
            html2canvas(document.getElementById('table-container')).then(function (canvas) {
                var link = document.createElement("a");
                link.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
                link.download = 'TT_' + d + '.png';
                link.click();
            });
        };
    }

    angular.module("seguimientopedidos").controller("kpiFallasCtrl", kpiFallasCtrl);
    kpiFallasCtrl.$inject = ["$scope", "services", "$routeParams", "$route", "$http", "cargaRegistros", "$uibModal", "$rootScope", "$log"];

    function kpiFallasCtrl($scope, services, $routeParams, $route, $http, cargaRegistros, $uibModal, $rootScope, $log) {
        $scope.falla = {};
        $scope.tiempo = {};
        init();

        function init() {
            graficos()
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
            let fechas1 = [];
            let fechas2 = [];
            let promedios = [];
            let promedios1 = [];
            let promedios2 = [];
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
            services.myService(datos, 'RegistroFallasCtrl.php', 'conteoFallas')
                .then((data) => {
                    $scope.fallas = data.data.data.conteo;
                    $scope.loading = 0;
                    response = data.data.data.tiempoCola;

                    response.forEach(function (item) {
                        fechas.push(item.fecha);
                        promedios.push(item.conteo);
                    });

                    $scope.chartOptions = {
                        type: 'bar',
                        data: {
                            labels: fechas,
                            datasets: [{
                                label: 'Ingresos',
                                data: promedios,
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
                                text: 'Ingresos de fallas',
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
                    response = data.data.data.tiempoAtencion;

                    response.forEach(function (item) {
                        fechas1.push(item.fecha);
                        promedios1.push(item.conteo);
                    });

                    $scope.chartOptions1 = {
                        type: 'bar',
                        data: {
                            labels: fechas1,
                            datasets: [{
                                label: 'Fallas marcadas',
                                data: promedios1,
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
                                text: 'Fallas marcados',
                                fontSize: 16, // Tamaño de fuente del título
                                fontColor: 'rgb(0, 0, 0)', // Color de fuente del título
                                //fontStyle: 'bold', // Estilo de fuente del título (normal, italic, bold, etc.)
                                padding: 5 // Espaciado del título respecto al gráfico
                            }, scales: {
                                yAxes: [{
                                    scaleLabel: {
                                        display: true,
                                        labelString: "Cantidad"
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
                    response = data.data.data.tiempoSistema;

                    response.forEach(function (item) {
                        fechas2.push(item.fecha);
                        promedios2.push(item.conteo);
                    });


                    $scope.chartOptions2 = {
                        type: 'bar',
                        data: {
                            labels: fechas2,
                            datasets: [
                                {
                                    label: 'Fallas Finalizados',
                                    data: promedios2,
                                    backgroundColor: 'rgba(192,75,75,0.2)',
                                    borderColor: 'rgb(192,75,93)',
                                    borderWidth: 1
                                },

                            ]
                        }

                        ,
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
                                text: 'Fallas Finalizadas',
                                fontSize: 16, // Tamaño de fuente del título
                                fontColor: 'rgb(0, 0, 0)', // Color de fuente del título
                                padding: 5 // Espaciado del título respecto al gráfico
                            }, scales: {
                                yAxes: [{
                                    scaleLabel: {
                                        display: true,
                                        labelString: "cantidad"
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
                                label: 'Ingresos',
                                data: promedios,
                                backgroundColor: 'rgba(192,75,75,0.2)',
                                borderColor: 'rgb(57,227,19)',
                                borderWidth: 3,
                                fill: false
                            }, {
                                label: 'Marcados',
                                data: promedios1,
                                backgroundColor: 'rgba(91,75,192,0.2)',
                                borderColor: 'rgb(0,36,255)',
                                borderWidth: 3,
                                fill: false
                            }, {
                                label: 'Finalizados',
                                data: promedios2,
                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                borderColor: 'rgb(255,0,42)',
                                borderWidth: 3,
                                fill: false
                            }]
                        },
                        series: ['Ingresos', 'Marcados', 'Finalizados'],
                        options: {
                            datalabels: {
                                align: 'end',
                                anchor: 'end',
                                color: 'rgb(255,0,42)',
                                font: {
                                    size: 12,
                                },

                            },
                            title: {
                                display: true,
                                text: 'Gráficos unificados',
                                fontSize: 16,
                                fontColor: 'rgb(0, 0, 0)',
                            }, scales: {
                                yAxes: [{
                                    scaleLabel: {
                                        display: true,
                                        labelString: "conteo"
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

    angular.module("seguimientopedidos").controller("gestionFallasCtrl", gestionFallasCtrl);
    gestionFallasCtrl.$inject = ["$scope", "services", "$routeParams", "$route", "$http", "cargaRegistros", "$uibModal", "$rootScope", "$log", "$window"];

    function gestionFallasCtrl($scope, services, $routeParams, $route, $http, cargaRegistros, $uibModal, $rootScope, $log, $window) {
        $scope.falla = {};
        init();

        /*var socket = io.connect('http://localhost:3000'); // Reemplaza 'localhost:3000' con la URL de tu servidor Socket.IO
        //var socket = io.connect('https://seguimientopedido.tigo.com.co:3000'); // Reemplaza 'localhost:3000' con la URL de tu servidor Socket.IO

        socket.on('connect', function () {
            console.log('Conectado al servidor Socket.IO');
        });

        socket.on('disconnect', function () {
            console.log('Desconectado del servidor Socket.IO');
        });

        $scope.sendMessage = function () {
            socket.emit('mensaje_desde_cliente', 'Hola, servidor!');
        };*/

        function init() {
            registrosFallas();
            impactoFallas();
        }

        $scope.marcarEngestion = (data) => {
            let user = $rootScope.galletainfo.login;
            let datos = {usuario: user, id: data.id, gestion: data.bloqueo}

            services.myService(datos, 'RegistroFallasCtrl.php', 'marca').then((data) => {
                if (data.data.status) {
                    Swal({
                        type: 'success',
                        title: 'Bien',
                        text: data.data.msj,
                        timer: 4000
                    }).then(() => {
                        registrosFallas();
                    })

                } else {
                    Swal({
                        type: 'error',
                        title: 'Opps..',
                        text: data.data.msj,
                        timer: 4000
                    })
                }
            }).catch((e) => {
                console.log(e)
            });
        }

        function registrosFallas(data) {
            if (data) {
                let datos = data;
            } else {
                let datos = '';
            }
            services.myService(data, 'RegistroFallasCtrl.php', 'listarRegistrosFallas').then((data) => {
                if (data.data.status === 1) {
                    $scope.totalItems = data.data.counter;
                    $scope.fallas = data.data.data;

                    /*$scope.startItem = ($scope.currentPage - 1) * $scope.pageSize + 1;
                    $scope.endItem = $scope.currentPage * $scope.pageSize;
                    if ($scope.endItem > data.data.counter) {
                        $scope.endItem = data.data.counter;
                    }*/
                }
            })
        }

        function impactoFallas(data) {
            if (data) {
                let datos = data;
            } else {
                let datos = '';
            }
            services.myService(data, 'RegistroFallasCtrl.php', 'listarImpactoFallas').then((data) => {
                if (data.data.status === 1) {
                    $scope.totalImpacto = data.data.counter;
                    $scope.fallasImpacto = data.data.data;

                    /*$scope.startItem = ($scope.currentPage - 1) * $scope.pageSize + 1;
                    $scope.endItem = $scope.currentPage * $scope.pageSize;
                    if ($scope.endItem > data.data.counter) {
                        $scope.endItem = data.data.counter;
                    }*/
                }
            })
        }

        $scope.mostrarImagen = (nombreArchivo) => {

            if (nombreArchivo === '') {
                Swal({
                    type: 'error',
                    title: 'Opps..',
                    text: 'No hay Adjuntos para mostrar',
                    timer: 4000
                })
                return
            }

            let extension = nombreArchivo.split('.').pop().toLowerCase();
            if (extension === 'jpg' || extension === 'jpeg' || extension === 'png' || extension === 'gif') {
                $scope.noImg = 0
                document.getElementById("imagenModalContenido").src = './uploads/' + nombreArchivo;
                $('#imagenModal').modal('show');
            } else {
                $scope.noImg = true;
                $scope.archivoUrl = './uploads/' + nombreArchivo;
                $scope.descargarArchivo = function () {
                    window.location.href = $scope.archivoUrl;
                };
                Swal({
                    type: 'error',
                    title: 'Oops..',
                    text: 'No es una imagen. ¿Deseas descargar el archivo?',
                    showCancelButton: true,
                    confirmButtonText: 'Descargar',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.value) {
                        $scope.descargarArchivo();
                    }
                    $route.reload();
                });
            }
        };

        $scope.ObservacioAvance = (dataFalla) => {
            if (dataFalla.estado !== 'En Gestión') {
                Swal({
                    type: 'error',
                    title: 'Opps..',
                    text: 'Debes marcar la tarea',
                    timer: 4000
                });
                return;
            }

            if (dataFalla.login_gestion !== $rootScope.galletainfo.login) {
                Swal({
                    type: 'error',
                    title: 'Opps..',
                    text: 'No eres el responsable de esta tarea',
                    timer: 4000
                });
                return;
            }
            let datos = {id: dataFalla.id, login: dataFalla.login_gestion}
            services.myService(datos, 'RegistroFallasCtrl.php', 'verObservacioAvance').then((data) => {

                $scope.observaciones = data.data.data
                $scope.data = dataFalla;
                $('#observacionesModal').modal('show');
                //registrosFallas();

            }).catch((e) => {
                console.log(e)
            })

        }

        $scope.ObservacioAvanceImpacto = (dataFalla) => {

            let datos = {id: dataFalla.id, login: dataFalla.login_gestion}
            services.myService(datos, 'RegistroFallasCtrl.php', 'verObservacioAvance').then((data) => {
                if (data.data.status === 0) {
                    Swal({
                        type: 'error',
                        title: 'Opps..',
                        text: 'No se ingresaron avances para esta tarea',
                        timer: 4000
                    })
                    return
                }
                $scope.noGuardado = 1;
                $scope.observaciones = data.data.data
                $scope.data = dataFalla;
                $('#observacionesModal').modal('show');

            }).catch((e) => {
                console.log(e)
            })

        }

        $scope.guardarObservacion = (data) => {
            if (!data.observaciones) {
                Swal({
                    type: 'error',
                    title: 'Opps..',
                    text: 'Debes escribir una observación',
                    timer: 4000
                })
                return;
            }

            if (!data.respuesta) {
                Swal({
                    type: 'error',
                    title: 'Opps..',
                    text: 'Debes seleccionar una respuesta',
                    timer: 4000
                })
                return;
            }

            let datos = {
                id: data.id,
                observacion: data.observaciones,
                usuario: $rootScope.galletainfo.login,
                respuesta: data.respuesta,
                tt: data.tt
            }
            services.myService(datos, 'RegistroFallasCtrl.php', 'ObservacioAvance').then((data) => {
                if (data.data.status === 1) {
                    $('#observacionesModal').modal('hide');
                    Swal({
                        type: 'success',
                        title: 'Bien',
                        text: data.data.msj,
                        timer: 4000
                    }).then(() => {
                        registrosFallas();
                    })

                } else {
                    Swal({
                        type: 'error',
                        title: 'Opps..',
                        text: data.data.msj,
                        timer: 4000
                    })
                }
            }).catch((e) => {
                console.log(e)
            });
        }

        $scope.guardaImpactoFalla = (data) => {
            $scope.guarda = 0;
            $scope.actualiza = 1;
            if (!data.criticidad) {
                Swal({
                    type: 'error',
                    title: 'Opps..',
                    text: 'Debes seleccionar un estado de criticidad',
                    timer: 4000
                })
                return;
            }
            $scope.data = data;
            $scope.data.observacionesFinal = data.observacion_asesor
            $('#observacionesGuardaModal').modal('show');

        }

        $scope.guardarObservacionFinal = (data) => {

            if (!data.estado) {
                Swal({
                    type: 'error',
                    title: 'Opps..',
                    text: 'Debes seleccionar un estado',
                    timer: 4000
                })
                return;
            }

            if (!data.respuesta) {
                Swal({
                    type: 'error',
                    title: 'Opps..',
                    text: 'Debes seleccionar una respuesta',
                    timer: 4000
                })
                return;
            }

            $scope.data = data
            $('#observacionesGuardaModal').modal('show');

        }

        $scope.guardaFallas = (data) => {
            $scope.guarda = 1;
            $scope.actualiza = 0;
            if (!data.observacionesFinal) {
                Swal({
                    type: 'error',
                    title: 'Opps..',
                    text: 'Debes escribir una observación',
                    timer: 4000
                })
                return;
            }
            let datos = {
                id: data.id,
                observacion: data.observacionesFinal,
                usuario: $rootScope.galletainfo.login,
                estado: data.estado,
                respuesta: data.respuesta
            }
            services.myService(datos, 'RegistroFallasCtrl.php', 'guardarFalla').then((data) => {
                if (data.data.status === 1) {

                    Swal({
                        type: 'success',
                        title: 'Bien',
                        text: data.data.msj,
                        timer: 4000
                    });
                    $('#observacionesGuardaModal').modal('hide');
                    registrosFallas();

                } else {
                    Swal({
                        type: 'error',
                        title: 'Opps..',
                        text: data.data.msj,
                        timer: 4000
                    })
                }
            })
        }

        $scope.ActualizaFallas = (data) => {
            $scope.guarda = 1;
            $scope.actualiza = 0;
            if (!data.observacionesFinal) {
                Swal({
                    type: 'error',
                    title: 'Opps..',
                    text: 'Debes escribir una observación',
                    timer: 4000
                })
                return;
            }
            let datos = {
                id: data.id,
                observacion: data.observacionesFinal,
                usuario: $rootScope.galletainfo.login,
                criticidad: data.criticidad
            }
            services.myService(datos, 'RegistroFallasCtrl.php', 'ActualizaFallas').then((data) => {
                if (data.data.status === 1) {

                    Swal({
                        type: 'success',
                        title: 'Bien',
                        text: data.data.msj,
                        timer: 4000
                    });
                    $('#observacionesGuardaModal').modal('hide');
                    impactoFallas();

                } else {
                    Swal({
                        type: 'error',
                        title: 'Opps..',
                        text: data.data.msj,
                        timer: 4000
                    })
                }
            })
        }

        $scope.downloadExcel = function (data) {
            let blob = new Blob(["\uFEFF" + "1,2,3\n4,5,6\n7,8,9"], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });

            let url = $window.URL || $window.webkitURL;
            let fileURL = url.createObjectURL(blob);
            let a = document.createElement('a');
            a.href = fileURL;
            a.download = data;
            document.body.appendChild(a);
            a.click();

            document.body.removeChild(a);
            url.revokeObjectURL(fileURL);
        };

        $scope.buscarTT = (data) => {
            if (!data) {
                Swal({
                    type: 'error',
                    title: 'Opps..',
                    text: 'Debes escribir el TT',
                    timer: 4000
                })
                return;
            }
            let datos = '';
            if (!data) {
                $scope.currentPage = 1;
                $scope.totalItems = 0;
                $scope.pageSize = 15;
                $scope.searchText = '';
                datos = {'page': $scope.currentPage, 'size': $scope.pageSize, 'data': $scope.buscar}
            } else {
                datos = data;
            }

            registrosFallas(datos);
        }

        $scope.buscarImpactoTT = (data) => {
            if (!data) {
                Swal({
                    type: 'error',
                    title: 'Opps..',
                    text: 'Debes escribir el TT',
                    timer: 4000
                })
                return;
            }
            let datos = '';
            if (!data) {
                $scope.currentPage = 1;
                $scope.totalItems = 0;
                $scope.pageSize = 15;
                $scope.searchText = '';
                datos = {'page': $scope.currentPage, 'size': $scope.pageSize, 'data': $scope.buscar}
            } else {
                datos = data;
            }

            impactoFallas(datos);
        }

        $scope.recargar = () => {
            $scope.buscar = '';
            registrosFallas();
        }

        $scope.recargarImpacto = () => {
            $scope.buscarImpacto = '';
            impactoFallas();
        }

        $scope.addCriticidad = (data) => {
            let datos = {};
            datos.criticidad = data.criticidad;
            datos.id = data.id;
            datos.login = $rootScope.galletainfo.login;
            services.myService(datos, 'RegistroFallasCtrl.php', 'addCriticidad').then((data) => {
                if (data.data.status === 1) {
                    Swal({
                        type: 'success',
                        title: 'Bien',
                        text: data.data.msj,
                        timer: 4000
                    });
                    impactoFallas();
                } else {
                    Swal({
                        type: 'error',
                        title: 'Opps..',
                        text: data.data.msj,
                        timer: 4000
                    })
                }
            })
        }

    }

})();
