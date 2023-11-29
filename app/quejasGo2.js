(function () {
    "use strict";
    angular.module("seguimientopedidos").controller("quejasGoCtrl2", quejasGoCtrl2);
    quejasGoCtrl2.$inject = ["$interval", "$scope", "$http", "$rootScope", "$location", "$route", "$routeParams", "$cookies", "$timeout", "services"];

    function quejasGoCtrl2($interval, $scope, $http, $rootScope, $location, $route, $routeParams, $cookies, $timeout, services, cargaRegistros) {
        var tiempo = new Date().getTime();
        var date1 = new Date();
        var year = date1.getFullYear();
        var month =
            date1.getMonth() + 1 <= 9
                ? "0" + (date1.getMonth() + 1)
                : date1.getMonth() + 1;
        var day = date1.getDate() <= 9 ? "0" + date1.getDate() : date1.getDate();

        tiempo = year + "-" + month + "-" + day;
        init();

        function init() {
            dataQueja();
            dataQuejasGoTerminado();
        }

        function dataQueja() {
            $scope.listaQuejasGo = {};

            services.myService('', 'gestionQuejasGoCtrl.php', 'datosQuejasGo').then((data) => {
                if (data.data.state === 99) {
                    swal({
                        type: "error",
                        title: data.data.title,
                        text: data.data.text,
                        timer: 4000,
                    }).then(function () {
                        $cookies.remove("usuarioseguimiento");
                        $location.path("/");
                        $rootScope.galletainfo = undefined;
                        $rootScope.permiso = false;
                        $route.reload();
                    });
                } else if (data.data.state === 1) {
                    $scope.listaQuejasGo = data.data.data;
                }

            }).catch((e) => {
                console.log(e)
            })

        }

        $scope.currentPage = 1;
        $scope.totalItems = 0;
        $scope.pageSize = 10;
        $scope.searchText = '';

        function dataQuejasGoTerminado(data) {
            $scope.dataQuejasTerminados = '';
            if (data === '' || data === undefined) {
                $scope.currentPage = 1;
                $scope.totalItems = 0;
                $scope.pageSize = 10;
                $scope.searchText = '';
                data = {'page': $scope.currentPage, 'size': $scope.pageSize}
            }

            services.myService(data, 'gestionQuejasGoCtrl.php', 'datosQuejasGoTerminado').then((data) => {
                $scope.dataQuejasTerminados = data.data.data;

                $scope.activity = [];
                $scope.totalItems = data.data.totalCount;
                $scope.startItem = ($scope.currentPage - 1) * $scope.pageSize + 1;
                $scope.endItem = $scope.currentPage * $scope.pageSize;
                if ($scope.endItem > data.data.totalCount) {
                    $scope.endItem = data.data.totalCount;
                }

            }).catch((e) => {
                console.log(e)
            })
        }

        $scope.pageChanged = function () {
            let data = {'page': $scope.currentPage, 'size': $scope.pageSize}
            dataQuejasGoTerminado(data);
        }
        $scope.pageSizeChanged = function () {
            let data = {'page': $scope.currentPage, 'size': $scope.pageSize}
            dataQuejasGoTerminado(data);
        }

        function iniciarTiempo() {
            var segundos = 0;
            var minutos = 0;
            var horas = 0;
            //var tiempo = 0;

            $interval(function () {
                segundos++;
                if (segundos === 60) {
                    segundos = 0;
                    minutos++;
                }
                if (minutos === 60) {
                    minutos = 0;
                    horas++;
                }

                $scope.tiempo = pad(horas) + ":" + pad(minutos) + ":" + pad(segundos);
            }, 1000);
        }

        function pad(numero) {
            return numero < 10 ? "0" + numero : numero;
        }

        $scope.marcarEngestion = function (id) {
            let data = {'id': id, 'login_gestion': $rootScope.galletainfo.login}
            services.myService(data, 'gestionQuejasGoCtrl.php', 'marcarEnGestionQuejasGo').then((data) => {
                if (data.data.state === 99) {
                    swal({
                        type: "error",
                        title: data.data.title,
                        text: data.data.text,
                        timer: 4000,
                    }).then(function () {
                        $cookies.remove("usuarioseguimiento");
                        $location.path("/");
                        $rootScope.galletainfo = undefined;
                        $rootScope.permiso = false;
                        $route.reload();
                    });
                } else if (data.data.state === 1) {
                    Swal({
                        type: 'success',
                        title: 'Bien',
                        text: data.data.msj,
                        timer: 4000
                    }).then(function () {
                        dataQueja();
                        iniciarTiempo();
                    })
                } else {
                    Swal({
                        type: 'info',
                        title: 'Oops...',
                        text: data.data.msj,
                        timer: 4000
                    }).then(function () {
                        $route.reload();
                    })
                }
            }).catch((e) => {
                console.log(e)
            })
        }

        $scope.abreModal = function (data) {
            if (data.en_gestion !== '1') {
                Swal({
                    type: 'error',
                    title: 'Oops...',
                    text: 'Debes Marcar el pedido',
                    timer: 4000
                })
            } else if (data.accion === '' || data.accion === undefined) {
                Swal({
                    type: 'error',
                    title: 'Oops...',
                    text: 'Debes Seleccionar la accion',
                    timer: 4000
                })
            } else if (data.gestion === '' || data.gestion === undefined) {
                Swal({
                    type: 'error',
                    title: 'Oops...',
                    text: 'Debes Seleccionar la gestion',
                    timer: 4000
                })
            } else {
                data = {
                    'accion': data.accion,
                    'gestion': data.gestion,
                    'id': data.id,
                    'login_gestion': $rootScope.galletainfo.login
                }
                $('#modalQuejasGo').modal('show');

                $scope.guardaSolicitudQuejasGo = function (obs) {
                    if (obs === '' || obs === undefined) {
                        Swal({
                            type: 'error',
                            title: 'Oops...',
                            text: 'Recuerda documentar observaciones',
                            timer: 4000
                        })
                    } else {
                        data.observacion_seguimiento = obs.observacion_gestion;
                        data.tiempo = $scope.tiempo;
                        services.myService(data, 'gestionQuejasGoCtrl.php', 'guardaGestionQuejasGo').then((data) => {
                            if (data.data.state === 1) {
                                setTimeout(() => {
                                    $('#modalQuejasGo').modal('hide');
                                }, 500);

                                Swal({
                                    type: 'success',
                                    title: 'Bien',
                                    text: data.data.msj,
                                    timer: 3000
                                }).then(function () {
                                    $route.reload();
                                })
                            } else {
                                Swal({
                                    type: 'error',
                                    title: 'Oops...',
                                    text: data.data.msj,
                                    timer: 4000
                                })
                            }
                        }).catch((e) => {
                            console.log(e)
                        })
                    }
                }
            }

        }

        $scope.ver_mas = (data) => {
            $scope.observacionQuejas = data;
            $("#modalObservaciones").modal('show');
        }

        $scope.recargaPage = function () {
            $scope.quejago = {};
            $scope.pedido = '';
            init();
        }

        $scope.detallePedidoQuejaGo = (pedido) => {
            if (pedido === '' || pedido === undefined) {
                Swal({
                    type: 'error',
                    title: 'Oops...',
                    text: 'Debes ingresar un pedido',
                    timer: 4000
                })
            } else {
                let data = {'page': $scope.currentPage, 'size': $scope.pageSize, 'pedido': pedido}
                dataQuejasGoTerminado(data);
            }
        }

        $scope.registrosQuejasGo = (data) => {
            if (data === '' || data === undefined) {
                Swal({
                    type: 'error',
                    title: 'Oops...',
                    text: 'Seleccione un rango de fecha valido',
                    timer: 4000
                })
            } else if (data.fechaini === '' || data.fechaini === undefined) {
                Swal({
                    type: 'error',
                    title: 'Oops...',
                    text: 'La fecha inicial es requerida',
                    timer: 4000
                })
            } else if (data.fechafin === '' || data.fechafin === undefined) {
                Swal({
                    type: 'error',
                    title: 'Oops...',
                    text: 'La fecha final es requerida',
                    timer: 4000
                })
            } else if (data.fechaini > data.fechafin) {
                Swal({
                    type: 'error',
                    title: 'Oops...',
                    text: 'La fecha final no puede ser menor a la inicial',
                    timer: 4000
                })
            } else {
                data = {'page': $scope.currentPage, 'size': $scope.pageSize, 'fecha': data}
                dataQuejasGoTerminado(data);
            }
        }

        $scope.csvQuejaGo = (data) => {
            if (data === '' || data === undefined) {
                Swal({
                    type: 'error',
                    title: 'Oops...',
                    text: 'Seleccione un rango de fecha valido',
                    timer: 4000
                })
                return;
            }

            var fechaini = new Date(data.fechaini);
            var fechafin = new Date(data.fechafin);
            var diffMs = (fechafin - fechaini);
            var diffDays = Math.round(diffMs / 86400000);

            if (data.fechaini === '' || data.fechaini === undefined) {
                Swal({
                    type: 'error',
                    title: 'Oops...',
                    text: 'La fecha inicial es requerida',
                    timer: 4000
                })
            } else if (data.fechafin === '' || data.fechafin === undefined) {
                Swal({
                    type: 'error',
                    title: 'Oops...',
                    text: 'La fecha final es requerida',
                    timer: 4000
                })
            } else if (data.fechaini > data.fechafin) {
                Swal({
                    type: 'error',
                    title: 'Oops...',
                    text: 'La fecha final no puede ser menor a la inicial',
                    timer: 4000
                })
            } else {
                data = {'page': $scope.currentPage, 'size': $scope.pageSize, 'fecha': data}
                services.myService(data, 'gestionQuejasGoCtrl.php', 'csvQuejaGo')
                    .then((data) => {
                        if (data.data.state === 1) {
                            var wb = XLSX.utils.book_new();
                            var ws = XLSX.utils.json_to_sheet(data.data.data);
                            XLSX.utils.book_append_sheet(wb, ws, 'GestionQuejasGo');
                            XLSX.writeFile(wb, 'GestionQuejasGo_' + tiempo + '.xlsx'); // Descarga el a
                        } else {
                            Swal({
                                type: 'error',
                                text: data.data.msj,
                                timer: 4000
                            })
                        }
                    }).catch((error) => {
                        console.log(error);
                    })
            }
        }

        $scope.CopyPortaPapeles = function (data) {
            var copyTextTV = document.createElement("input");
            copyTextTV.value = data;
            document.body.appendChild(copyTextTV);
            copyTextTV.select();
            document.execCommand("copy");
            document.body.removeChild(copyTextTV);
            Swal({
                type: 'info',
                title: 'Aviso',
                text: "El texto seleccionado fue copiado",
                timer: 2000
            });
        }

    }
})();
