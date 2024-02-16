(function () {
    "use strict";
    angular.module("seguimientopedidos").controller("MesasNacionalesCtrl", MesasNacionalesCtrl);
    MesasNacionalesCtrl.$inject = ["$scope", "$rootScope", "services", "$route", "$sce", "$cookies", "$location", "$uibModal", "$log", "$interval", "$timeout"];

    function MesasNacionalesCtrl($scope, $rootScope, services, $route, $sce, $cookies, $location, $uibModal, $log, $interval, $timeout) {

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
            mesa2();
            mesa3();
            mesa4();
            mesa6();
            mesa7();
            registros();
        }

        function mesa1() {
            services.myService('', 'mesasNacionalesCtrl.php', 'mesa1').then((data) => {
                $scope.mesa1 = data.data.data;
                $scope.Items1 = data.data.counter;
            }).catch((e) => {
                console.log(e)
            })
        }

        function mesa2() {
            services.myService('', 'mesasNacionalesCtrl.php', 'mesa2').then((data) => {
                $scope.mesa2 = data.data.data;
                $scope.Items2 = data.data.counter;
            }).catch((e) => {
                console.log(e)
            })
        }

        function mesa3() {
            services.myService('', 'mesasNacionalesCtrl.php', 'mesa3').then((data) => {
                $scope.mesa3 = data.data.data;
                $scope.Items3 = data.data.counter;
            }).catch((e) => {
                console.log(e)
            })
        }

        function mesa4() {
            services.myService('', 'mesasNacionalesCtrl.php', 'mesa4').then((data) => {
                $scope.mesa4 = data.data.data;
                $scope.Items4 = data.data.counter;
            }).catch((e) => {
                console.log(e)
            })
        }

        function mesa6() {
            services.myService('', 'mesasNacionalesCtrl.php', 'mesa6').then((data) => {
                $scope.mesa6 = data.data.data;
                $scope.Items6 = data.data.counter;
            }).catch((e) => {
                console.log(e)
            })
        }

        function mesa7() {
            services.myService('', 'mesasNacionalesCtrl.php', 'mesa7').then((data) => {
                $scope.mesa7 = data.data.data;
                $scope.Items7 = data.data.counter;
            }).catch((e) => {
                console.log(e)
            })
        }

        function registros(data) {
            let datos = '';
            if (!data) {
                $scope.currentPage = 1;
                $scope.totalItems = 0;
                $scope.pageSize = 15;
                $scope.searchText = '';
                datos = {'page': $scope.currentPage, 'size': $scope.pageSize}
            } else {
                datos = data;
            }
            services.myService(datos, 'mesasNacionalesCtrl.php', 'registros').then((data) => {
                $scope.registros = data.data.data;
                $scope.Items5 = data.data.counter;

                $scope.totalItems = data.data.counter;
                $scope.startItem = ($scope.currentPage - 1) * $scope.pageSize + 1;
                $scope.endItem = $scope.currentPage * $scope.pageSize;
                if ($scope.endItem > data.data.counter) {
                    $scope.endItem = data.data.counter;
                }
            }).catch((e) => {
                console.log(e)
            })
        }

        $scope.pageChanged = function () {
            let data = $scope.mn
            //registros(data);
            $scope.registrosMnTiempo(data);
        }
        $scope.pageSizeChanged = function () {
            let data = $scope.mn
            //registros(data);
            $scope.registrosMnTiempo(data);
        }

        $scope.marcarEngestion = (data) => {
            let datos = {'tarea': data, 'usuario': $rootScope.login, 'id': data.id}
            services.myService(datos, 'mesasNacionalesCtrl.php', 'marca').then((data) => {
                if (data.data.state) {
                    let miIntervalo = setInterval(function () {
                        mostrarSweetAlert();
                    }, 100000);

                    if (data.data.alerta === '1') {
                        console.log(1);
                        if (data.data.msj === "tarea Bloqueada correctamente") {
                            swal({
                                type: "warning",
                                title: "Atención",
                                text: "esta tarea ha ingresado mas de una vez a este modulo, por favor validar la solicitud en detalle, observaciones, interacción(es) anterior(es) para evitar que ingrese de nuevo. si crees pertinente escala a tu supervisor",
                                showCancelButton: false,
                                confirmButtonText: "Aceptar",
                            }).then(() => {
                                Swal({
                                    type: 'success',
                                    title: 'Muy Bien',
                                    text: data.data.msj,
                                    timer: 4000
                                }).then(() => {
                                    setTimeout(() => {
                                        init();
                                    }, 400);
                                });
                            });
                        }
                    } else if (data.data.msj === "tarea Bloqueada correctamente") {
                        Swal({
                            type: 'success',
                            title: 'Muy Bien',
                            text: data.data.msj,
                            timer: 4000
                        }).then(() => {
                            setTimeout(() => {
                                init();
                            }, 400);
                        });
                    } else {
                        console.log(3);
                        clearInterval(miIntervalo);  // Cancelar el intervalo
                        Swal({
                            type: 'success',
                            title: 'Muy Bien',
                            text: data.data.msj,
                            timer: 4000
                        }).then(() => {
                            setTimeout(() => {
                                init();
                            }, 400);
                        });
                    }


                    /*if (data.data.alerta === '1') {
                        if (data.data.msj === "tarea Bloqueada correctamente") {
                            swal({
                                type: "warning",
                                title: "Atención",
                                text: "esta tarea ha ingresado mas de una vez a este modulo, por favor validar la solicitud en detalle, observaciones, interacción(es) anterior(es) para evitar que ingrese de nuevo. si crees pertinente escala a tu supervisor",
                                showCancelButton: false,
                                confirmButtonText: "Aceptar",
                            }).then(() => {
                                let miTimeout = $timeout(function () {
                                    mostrarSweetAlert();
                                }, 600000);
                                Swal({
                                    type: 'success',
                                    title: 'Muy Bien',
                                    text: data.data.msj,
                                    timer: 4000
                                }).then(() => {
                                    setTimeout(() => {
                                        init();
                                    }, 400);
                                })
                            })
                        }
                    } else if (data.data.msj === "tarea Bloqueada correctamente") {
                        let miTimeout = $timeout(function () {
                            mostrarSweetAlert();
                        }, 600000);
                        Swal({
                            type: 'success',
                            title: 'Muy Bien',
                            text: data.data.msj,
                            timer: 4000
                        }).then(() => {
                            setTimeout(() => {
                                init();
                            }, 400);
                        })
                    } else {
                        $timeout.cancel(miTimeout);
                        Swal({
                            type: 'success',
                            title: 'Muy Bien',
                            text: data.data.msj,
                            timer: 4000
                        }).then(() => {
                            setTimeout(() => {
                                init();
                            }, 400);
                        })
                    }*/
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
            })
        }

        $scope.GuardarMn = (data) => {
            if (data.estado == 'Sin gestión') {
                Swal({
                    type: 'error',
                    title: 'Opps..',
                    text: 'Debes marcar la tarea',
                    timer: 4000
                })
                return;
            }

            if (!data.tipificaciones) {
                Swal({
                    type: 'error',
                    title: 'Opps..',
                    text: 'Debes seleccionar tipificacion',
                    timer: 4000
                })
                return;
            }
            if (!data.tipificaciones2) {
                Swal({
                    type: 'error',
                    title: 'Opps..',
                    text: 'Debes seleccionar tipificacion 2',
                    timer: 4000
                })
                return;
            }
            let datos = {
                'tipificacion': data.tipificaciones,
                'tipificaciones2': data.tipificaciones2,
                'usuario': data.login_gestion,
                'id': data.id,
                'usuario_gestion': $rootScope.login
            }
            let mesa = data.mesa;

            swal({
                title: "Observaciones",
                input: "textarea",
                showCancelButton: true,
                cancelButtonText: 'Cancel',
                confirmButtonText: "Guardar ",
                inputValidator: function (value) {
                    return new Promise(function (resolve, reject) {
                        if (value != '' && value != null) {
                            datos.observacion = value;
                            services.myService(datos, 'mesasNacionalesCtrl.php', 'guarda').then((data) => {
                                if (data.data.state) {
                                    Swal({
                                        type: 'success',
                                        title: 'Bien',
                                        text: data.data.msj,
                                        timer: 4000
                                    }).then(() => {
                                        switch (mesa) {
                                            case 'Mesa 1' :
                                                mesa1();
                                                break;
                                            case 'Mesa 2' :
                                                mesa2();
                                                break;
                                            case 'Mesa 3' :
                                                mesa3();
                                                break;
                                            case 'Mesa 4' :
                                                mesa4();
                                                break;
                                            case 'Mesa 5' :
                                                mesa6();
                                                break;
                                            case 'Mesa 6' :
                                                mesa7();
                                                break;
                                        }
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
                            })
                        } else {
                            Swal({
                                type: 'error',
                                title: 'Opps..',
                                text: 'Debes ingresar observaciones',
                                timer: 4000
                            })
                        }
                    });
                }
            })
        }

        $scope.registrosMn = (data) => {
            if (!data) {
                Swal({
                    type: 'error',
                    title: 'Opps..',
                    text: 'Ingrese la tarea a consultar',
                    timer: 4000
                })
                return;
            }
            let datos = {'page': $scope.currentPage, 'size': $scope.pageSize, 'buscar': data, 'data': $scope.mn}
            //let datos = {'buscar': data}
            services.myService(datos, 'mesasNacionalesCtrl.php', 'detalleMesa').then((data) => {
                $scope.registros = data.data.data;
                $scope.Items5 = data.data.counter;

                $scope.totalItems = data.data.counter;
                $scope.startItem = ($scope.currentPage - 1) * $scope.pageSize + 1;
                $scope.endItem = $scope.currentPage * $scope.pageSize;
                if ($scope.endItem > data.data.counter) {
                    $scope.endItem = data.data.counter;
                }
            }).catch((e) => {
                console.log(e)
            })
        }

        $scope.CopyPortaPapeles = (data) => {
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

        $scope.recargaPageGestion = (n) => {
            switch (n) {
                case 1 :
                    mesa1();
                    break;
                case 2 :
                    mesa2();
                    break;
                case 3 :
                    mesa3();
                    break;
                case 4 :
                    mesa4();
                    break;
                case 6 :
                    mesa6();
                    break;
                case 7 :
                    mesa7();
                    break;
                case 5 :
                    registros();
                    $scope.mn = {};
                    $scope.mn.mesas = 'Mesa 1';
                    break;
            }
        }

        $scope.registrosMnTiempo = (data) => {
            if (!data.mesas) {
                data.mesas = "Mesa 1"
            }
            /*if (!data.mesas) {
                Swal({
                    type: 'error',
                    title: 'Opps..',
                    text: 'Seleccione un filtro de tipo mesa',
                    timer: 4000
                })
                return;
            }

            if (!data.fechaini) {
                Swal({
                    type: 'error',
                    title: 'Opps..',
                    text: 'Ingrese la fecha inicial',
                    timer: 4000
                })
                return;
            }

            if (!data.fechafin) {
                Swal({
                    type: 'error',
                    title: 'Opps..',
                    text: 'Ingrese la fecha final',
                    timer: 4000
                })
                return;
            }

            if (data.fechafin < data.fechaini) {
                Swal({
                    type: 'error',
                    title: 'Opps..',
                    text: 'La final final no puede ser menor que fecha inicial',
                    timer: 4000
                })
                return;
            }*/


            data.page = $scope.currentPage;
            data.size = $scope.pageSize;
            services.myService(data, 'mesasNacionalesCtrl.php', 'detalleMesa').then((data) => {
                $scope.registros = data.data.data;
                $scope.Items5 = data.data.counter;

                $scope.totalItems = data.data.counter;
                $scope.startItem = ($scope.currentPage - 1) * $scope.pageSize + 1;
                $scope.endItem = $scope.currentPage * $scope.pageSize;
                if ($scope.endItem > data.data.counter) {
                    $scope.endItem = data.data.counter;
                }
            }).catch((e) => {
                console.log(e)
            })
        }

        $scope.csvToip = (data) => {
            if (!data.mesas) {
                Swal({
                    type: 'error',
                    title: 'Opps..',
                    text: 'Seleccione un filtro de tipo mesa',
                    timer: 4000
                })
                return;
            }

            if (!data.fechaini) {
                Swal({
                    type: 'error',
                    title: 'Opps..',
                    text: 'Ingrese la fecha inicial',
                    timer: 4000
                })
                return;
            }

            if (!data.fechafin) {
                Swal({
                    type: 'error',
                    title: 'Opps..',
                    text: 'Ingrese la fecha final',
                    timer: 4000
                })
                return;
            }

            if (data.fechafin < data.fechaini) {
                Swal({
                    type: 'error',
                    title: 'Opps..',
                    text: 'La final final no puede ser menor que fecha inicial',
                    timer: 4000
                })
                return;
            }
            data.export = 1;
            data.page = $scope.currentPage;
            data.size = $scope.pageSize;
            services.myService(data, 'mesasNacionalesCtrl.php', 'detalleMesa').then((data) => {
                if (data.data.state) {
                    var wb = XLSX.utils.book_new();
                    var ws = XLSX.utils.json_to_sheet(data.data.data);
                    XLSX.utils.book_append_sheet(wb, ws, 'mesas_nacionales');
                    XLSX.writeFile(wb, 'mesas_nacionales_' + tiempo + '.xlsx');
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
            })
        }

        $scope.mn = {
            mesas: 'Mesa 1'
        };

        $scope.detalleMesa = (data) => {
            if (!data) {
                Swal({
                    type: 'error',
                    title: 'Opps..',
                    text: 'Selecciona un filtro valido',
                    timer: 4000
                })
                return;
            }
            $scope.mn.tarea = '';
            let datos = {'page': $scope.currentPage, 'size': $scope.pageSize, 'mesas': data};
            services.myService(datos, 'mesasNacionalesCtrl.php', 'detalleMesa').then((data) => {
                $scope.registros = data.data.data;
                $scope.Items5 = data.data.counter;

                $scope.totalItems = data.data.counter;
                $scope.startItem = ($scope.currentPage - 1) * $scope.pageSize + 1;
                $scope.endItem = $scope.currentPage * $scope.pageSize;
                if ($scope.endItem > data.data.counter) {
                    $scope.endItem = data.data.counter;
                }
            }).catch((e) => {
                console.log(e)
            })
        }
    }
})();
