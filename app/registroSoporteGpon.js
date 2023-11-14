(function () {
    "use strict";
    angular.module("seguimientopedidos").controller("registrossoportegponCtrl", registrossoportegponCtrl);
    registrossoportegponCtrl.$inject = ["$scope", "$rootScope", "services", "$cookies", "$location", "$route"];

    function registrossoportegponCtrl($scope, $rootScope, services, $cookies, $location, $route) {
        $scope.listaRegistros = {};
        $scope.RegistrosSoporteGpon = {};
        $scope.soportegpon = {};
        $scope.listadoAcciones = {};
        $scope.datosRegistros = {};
        $scope.verplantilla = false;

        $scope.currentPage = 1;
        $scope.totalItems = 0;
        $scope.pageSize = 10;
        $scope.searchText = "";

        BuscarRegistrosSoporteGpon();

        $scope.pageChanged = function () {
            data = {page: $scope.currentPage, size: $scope.pageSize, data: $scope.RegistrosSoporteGpon};
            BuscarRegistrosSoporteGpon(data);
        };
        $scope.pageSizeChanged = function () {
            data = {page: $scope.currentPage, size: $scope.pageSize, data: $scope.RegistrosSoporteGpon};
            $scope.currentPage = 1;
            BuscarRegistrosSoporteGpon(data);
        };

        if ($scope.RegistrosSoporteGpon.fechaini === undefined || $scope.RegistrosSoporteGpon.fechafin === undefined) {
            var tiempo = new Date().getTime();
            var date1 = new Date();
            var year = date1.getFullYear();
            var month =
                date1.getMonth() + 1 <= 9
                    ? "0" + (date1.getMonth() + 1)
                    : date1.getMonth() + 1;
            var day = date1.getDate() <= 9 ? "0" + date1.getDate() : date1.getDate();

            tiempo = year + "-" + month + "-" + day;

            $scope.fechaini = tiempo;
            $scope.fechafin = tiempo;
        }

        $scope.buscarRegistrosSoporteGpon = function (data) {
            let date_1 = new Date(data.fechaini);
            let date_2 = new Date(data.fechafin);
            let diff = date_2 - date_1;

            let TotalDays = Math.ceil(diff / (1000 * 3600 * 24));
            if (TotalDays > 31) {
                swal({
                    type: "error",
                    text: "Para optimización de los reportes estos no pueden sobrepasar los 8 dias",
                });
            } else if (data.fechafin === undefined) {
                Swal({
                    type: "error",
                    title: "Oops...",
                    text: "Ingrese la fecha final a consultar",
                    timer: 4000,
                });
            } else if (data.fechaini === undefined) {
                Swal({
                    type: "error",
                    title: "Oops...",
                    text: "Ingrese la fecha inicial a consultar",
                    timer: 4000,
                });
            } else if (data.fechaini > data.fechafin) {
                Swal({
                    type: "error",
                    title: "Oops...",
                    text: "La fecha inicial no puede ser mayor que la final",
                    timer: 4000,
                });
            } else {
                data = {page: $scope.currentPage, size: $scope.pageSize, data: data};
                BuscarRegistrosSoporteGpon(data);
            }
        };

        function BuscarRegistrosSoporteGpon(data) {
            $scope.listaRegistros = "";
            if (data === "" || data === undefined) {
                $scope.currentPage = 1;
                $scope.totalItems = 0;
                $scope.pageSize = 10;
                $scope.searchText = "";
                data = {page: $scope.currentPage, size: $scope.pageSize};
            }
            services.myService(data, 'soporteGponCtrl.php', 'registrossoportegpon').then((data) => {
                if (data.data.state === 99) {
                    swal({
                        type: "error",
                        title: data.data.title,
                        text: data.data.msg,
                        timer: 4000,
                    }).then(function () {
                        $cookies.remove("usuarioseguimiento");
                        $location.path("/");
                        $rootScope.galletainfo = undefined;
                        $rootScope.permiso = false;
                        $route.reload();
                    });
                } else {
                    $scope.listaRegistros = data.data.data;
                    $scope.cantidad = data.data.length;
                    $scope.counter = data.data.counter;

                    $scope.totalItems = data.data.counter;
                    $scope.startItem = ($scope.currentPage - 1) * $scope.pageSize + 1;
                    $scope.endItem = $scope.currentPage * $scope.pageSize;
                    if ($scope.endItem > data.data.counter) {
                        $scope.endItem = data.data.counter;
                    }
                }
            }).catch((e) => {
                console.log(e)
            });
        }

        $scope.buscarhistoricoSoporteGpon = function (param) {
            if (!param) {
                Swal({
                    type: 'error',
                    title: 'Opss...',
                    text: 'Ingrese la tarea a buscar',
                    timer: 4000
                })
                return;
            }
            let data = {
                page: $scope.currentPage,
                size: $scope.pageSize,
                pedido: param,
            };
            services.myService(data, 'soporteGponCtrl.php', 'registrossoportegpon').then((data) => {
                if (data.data.state === 1) {
                    $scope.historicoDatos = data.data.data;
                    $("#HistoricoModal").modal('show')
                } else {
                    Swal({
                        type: "error",
                        title: "Oops...",
                        text: data.data.msj,
                        timer: 4000,
                    });
                }
            }).catch((e) => {
                console.log(e)
            })
        };

        $scope.muestraNotas = function (datos) {
            $scope.TituloModal = "Detalle soporte gpon";
            $scope.pedido = datos.unepedido;
            $scope.tarea = datos.tarea;
            $scope.velocidadnavegacion = datos.velocidad_navegacion;
            $scope.arpon = datos.arpon;
            $scope.nap = datos.nap;
            $scope.hilo = datos.hilo;
            $scope.intenet1 = datos.port_internet_1 === "1" ? "X" : "";
            $scope.intenet2 = datos.port_internet_2 === "1" ? "X" : "";
            $scope.intenet3 = datos.port_internet_3 === "1" ? "X" : "";
            $scope.intenet4 = datos.port_internet_4 === "1" ? "X" : "";
            $scope.television1 = datos.port_television_1 === "1" ? "X" : "";
            $scope.television2 = datos.port_television_2 === "1" ? "X" : "";
            $scope.television3 = datos.port_television_3 === "1" ? "X" : "";
            $scope.television4 = datos.port_television_4 === "1" ? "X" : "";

            let listaseriales = datos.serial.split(",");
            let listamacs = datos.mac.split(",");

            $scope.listaSeriales = listaseriales;
            $scope.listaMacs = listamacs;
            $scope.observaciones = datos.observacion;
            $("#NotasModal").modal('show');
        };

        $scope.csvRegistros = function () {
            $scope.csvPend = false;
            if ($scope.RegistrosSoporteGpon.fechaini > $scope.RegistrosSoporteGpon.fechafin) {
                swal({
                    type: 'info',
                    title: 'Opsss...',
                    text: 'La fecha inicial debe ser menor que la inicial',
                    timer: 4000
                })
            } else {
                services
                    .myService($scope.RegistrosSoporteGpon, 'soporteGponCtrl.php', 'csvRegistrosSoporteGpon')
                    .then((data) => {
                        if (data.data.state === 1) {
                            var wb = XLSX.utils.book_new();
                            var ws = XLSX.utils.json_to_sheet(data.data.data);
                            XLSX.utils.book_append_sheet(wb, ws, 'soporte_gpon');
                            XLSX.writeFile(wb, 'Soporte_gpon_' + tiempo + '.xlsx'); // Descarga el a
                        } else {
                            Swal({
                                type: 'error',
                                text: data.data.msj,
                                timer: 4000
                            })
                        }
                    })
                    .catch((response) => {
                        console.log(response);
                    })

            }
        };

        $scope.CopyPortaPapeles = function (data) {
            var copyTextTV = document.createElement("input");
            copyTextTV.value = data;
            document.body.appendChild(copyTextTV);
            copyTextTV.select();
            document.execCommand("copy");
            document.body.removeChild(copyTextTV);
            Swal({
                type: "info",
                title: "Aviso",
                text: "El texto seleccionado fue copiado",
                timer: 2000,
            });
        };
    }
})();
