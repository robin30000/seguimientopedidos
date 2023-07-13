(function () {
    "use strict";
    angular.module("seguimientopedidos").controller("GestionNivelacionCtrl", GestionNivelacionCtrl);
    GestionNivelacionCtrl.$inject = ["$scope", "$rootScope", "$location", "$route", "$cookies", "services", "i18nService"];

    function GestionNivelacionCtrl($scope, $rootScope,$location,$route,$cookies,services,i18nService) {
        $scope.GestionNivelacion = {};
        $scope.Registros = {};
        $scope.nivelacion = {};
        i18nService.setCurrentLang("es");
        $scope.userLog = $rootScope.galletainfo.login;
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
            getGrid();
            registrosTecnicos();
        }

        function getGrid() {
            Date.prototype.addMins = function (m) {
                this.setTime(this.getTime() + m * 60 * 1000);
                return this;
            };

            var fechaI2 = new Date();

            var columnDefs = [
                {
                    name: "Marcar",
                    cellTemplate:
                        "<div style='text-align: center'><input ng-checked={{row.entity.en_gestion}} value='{{row.entity.en_gestion}}' ng-model='row.entity.en_gestion' type='checkbox' ng-click='grid.appScope.engestion(row)'></div>",
                    minWidth: 70,
                    width: "1%",
                    enableCellEdit: false,
                    enableFiltering: false,
                    enableRowHeaderSelection: true,
                },
                {
                    name: "Login",
                    field: "gestiona_por",
                    cellTemplate:
                        "<div style='text-align: center' ng-show='(row.entity.gestiona_por !== null)'>" +
                        "<span class='label label-primary label-xsmall' ng-if='(row.entity.gestiona_por ==  grid.appScope.userLog)' style='vertical-align: sub'>{{grid.appScope.userLog}}</span>" +
                        "<span class='label label-primary label-xsmall' ng-if='(row.entity.gestiona_por != grid.appScope.userLog)' style='vertical-align: sub'>En gestion</span>" +
                        "</div>",
                    minWidth: 80,
                    width: "3%",
                    enableCellEdit: false,
                },
                {
                    name: "Tarea",
                    field: "ticket_id",
                    cellTemplate:
                        '<div style="text-align: center;"><button type="button" style="padding: 0; border: none" className="btn btn-default btn-xs ng-binding" ng-click="grid.appScope.CopyPortaPapeles(row.entity.ticket_id)" tooltip="" title="" id="tv0" data-original-title="Copiar pedido">{{row.entity.ticket_id}}</button></div>',
                    minWidth: 120,
                    width: "3%",
                    enableCellEdit: false,
                },
                {
                    name: "Fecha ingreso",
                    field: "fecha_ingreso",
                    cellStyle: {"text-align": "center"},
                    minWidth: 70,
                    width: "10%",
                    enableCellEdit: false,
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var date = new Date(row.entity.fecha_ingreso);

                        date.addMins(15);
                        if (date <= fechaI2) {
                            return "blue";
                        }
                    },
                },
                {
                    name: "Proceso",
                    field: "proceso",
                    cellStyle: {"text-align": "center"},
                    minWidth: 70,
                    width: "10%",
                    enableCellEdit: false,
                    cellTooltip: function (row, col) {
                        return row.entity.proceso;
                    },
                },
                {
                    name: "Zona",
                    field: "zona",
                    cellStyle: {"text-align": "center"},
                    minWidth: 80,
                    width: "8%",
                    enableCellEdit: false,
                },
                {
                    name: "Sub zona",
                    field: "zubzona",
                    cellStyle: {"text-align": "center"},
                    minWidth: 70,
                    width: "8%",
                    enableCellEdit: false,
                },
                {
                    name: "Nombre técnico",
                    field: "nombre_tecnico",
                    cellStyle: {"text-align": "center"},
                    width: "11%",
                    enableCellEdit: false,
                },
                {
                    name: "cc técnico",
                    field: "cc_tecnico",
                    cellStyle: {"text-align": "center"},
                    minWidth: 70,
                    width: "6%",
                    cellFilter: 'currency:"":0',
                    enableCellEdit: false,
                },
                {
                    name: "Tipo solicitud",
                    field: "solicitud",
                    cellStyle: {"text-align": "center"},
                    width: "6%",
                    enableCellEdit: false,
                    cellTooltip: function (row, col) {
                        return row.entity.solicitud;
                    },
                },
                {
                    name: "Motivo",
                    field: "motivo",
                    cellStyle: {"text-align": "center"},
                    width: "9%",
                    enableCellEdit: false,
                },
                {
                    name: "Submotivo",
                    field: "submotivo",
                    cellStyle: {"text-align": "center"},
                    width: "6%",
                    enableCellEdit: false,
                },
                {
                    name: "N. nuevo técnico",
                    field: "nombre_nuevo_tecnico",
                    cellStyle: {"text-align": "center"},
                    width: "11%",
                    enableCellEdit: false,
                },
                {
                    name: "c. n. técnico",
                    field: "cc_nuevo_tecnico",
                    cellStyle: {"text-align": "center"},
                    minWidth: 70,
                    width: "6%",
                    suppressSizeToFit: true,
                    enableColumnResizing: true,
                    cellFilter: 'currency:"":0',
                },
                {
                    name: "nivelacion",
                    editType: "dropdown",
                    cellFilter: "mapNivelacion",
                    enableCellEdit: true,
                    cellTemplate:
                        "<div style='text-align: center'><select ng-model='row.entity.nivelacion' class='btn btn-default btn-xs grupo-select'>" +
                        "<option value=''>Selec</option>" +
                        "<option value='SI'>SI</option>" +
                        "<option value='NO'>NO</option>" +
                        "</select>" +
                        "</div>",
                    minWidth: 50,
                    width: "6%",
                    enableColumnResizing: true,
                },
                {
                    name: "Obs.",
                    cellTemplate: "partial/modals/template.html",
                    width: "3%",
                    enableFiltering: false,
                    enableCellEdit: false,
                    cellStyle: {"text-align": "center"},
                },
                {
                    name: "Acc.",
                    cellTemplate:
                        "<div style='text-align: center'>" +
                        '<button type="button" class="btn btn-default btn-xs" ng-click="grid.appScope.guardagestion(row)">' +
                        '<i class="fa fa-floppy-o" aria-hidden="true"> </i>' +
                        "</button>",
                    minWidth: 50,
                    width: "3%",
                    enableFiltering: false,
                },
            ];

            var paginationOptions = {
                sort: null,
            };

            $scope.gridOptions = {
                enableFiltering: false,
                enablePagination: true,
                pageSize: 200,
                enableHorizontalScrollbar: false,
                enablePaginationControls: true,
                columnDefs: columnDefs,
                paginationPageSizes: [200, 500, 1000],
                paginationPageSize: 200,
                enableRowHeaderSelection: true,

                exporterMenuPdf: false,
                enableGridMenu: false,

                useExternalPagination: true,
                useExternalSorting: true,
                enableRowSelection: true,

                exporterCsvFilename: "Registros.csv",

                exporterCsvLinkElement: angular.element(
                    document.querySelectorAll(".custom-csv-link-location")
                ),
                exporterExcelFilename: "Registros.xlsx",
                exporterExcelSheetName: "Sheet1",

                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged(
                        $scope,
                        function (grid, sortColumns) {
                            if (getPage) {
                                if (sortColumns.length > 0) {
                                    paginationOptions.sort = sortColumns[0].sort.direction;
                                } else {
                                    paginationOptions.sort = null;
                                }
                                getPage(
                                    grid.options.paginationCurrentPage,
                                    grid.options.paginationPageSize,
                                    paginationOptions.sort
                                );
                            }
                        }
                    );
                    gridApi.pagination.on.paginationChanged(
                        $scope,
                        function (newPage, pageSize) {
                            if (getPage) {
                                getPage(newPage, pageSize, paginationOptions.sort);
                            }
                        }
                    );
                },
            };

            var getPage = function (curPage, pageSize, sort) {
                services
                    .gestionarNivelacion(curPage, pageSize, sort)
                    .then(complete)
                    .catch(failed);

                function complete(data) {
                    var datos = data.data.data;
                    var counter = data.data.counter;

                    $scope.gridOptions.totalItems = counter;
                    var firstRow = (curPage - 1) * datos;
                    $scope.gridOptions.data = datos;
                }

                function failed(error) {
                    console.log(error);
                }
            };

            getPage(1, $scope.gridOptions.paginationPageSize, paginationOptions.sort);
        }

        function registrosTecnicos() {
            var columnDefs = [
                {
                    name: "Tarea",
                    field: "ticket_id",
                    minWidth: 80,
                    width: "5%",
                },
                {
                    name: "Proceso",
                    field: "proceso",
                    minWidth: 80,
                    width: "10%",
                },
                {
                    name: "Nombre Teçnico",
                    field: "nombre_tecnico",
                    minWidth: 70,
                    width: "15%",
                },
                {
                    name: "CC Técnico",
                    field: "cc_tecnico",
                    minWidth: 80,
                    width: "7%",
                },
                {
                    name: "Tipo Solicitud",
                    field: "solicitud",
                    minWidth: 70,
                    width: "8%",
                },
                {
                    name: "Motivo",
                    field: "motivo",
                    width: "13%",
                },
                {
                    name: "Sub Motivo",
                    field: "submotivo",
                    minWidth: 70,
                    width: "7%",
                },
                {
                    name: "CC Nuevo Téc.",
                    field: "cc_nuevo_tecnico",
                    minWidth: 70,
                    width: "8%",
                },
                {
                    name: "Nombre Nuevo Tec.",
                    field: "nombre_nuevo_tecnico",
                    minWidth: 70,
                    width: "12%",
                },
                {
                    name: "Nivelacion",
                    field: "se_realiza_nivelacion",
                    minWidth: 70,
                    width: "10%",
                },
                {
                    name: "Detalles",
                    cellTemplate:
                        "<div style='text-align: center'>" +
                        '<button type="button" class="btn btn-default btn-xs" ng-click="grid.appScope.DetalleTotal(row)">' +
                        '<i class="fa fa-info-circle" aria-hidden="true"> </i>' +
                        "</button>",
                    minWidth: 70,
                    width: "5%",
                    enableFiltering: false,
                },
            ];

            var paginationOptions = {
                sort: null,
            };

            $scope.gridOptionsRegistros = {
                enableFiltering: true,
                enablePagination: true,
                pageSize: 200,
                enableHorizontalScrollbar: false,
                enablePaginationControls: true,
                columnDefs: columnDefs,
                paginationPageSizes: [200, 500, 1000],
                paginationPageSize: 200,

                useExternalPagination: true,
                useExternalSorting: true,
                enableRowSelection: true,

                enableGridMenu: true,
                enableSelectAll: true,
                exporterCsvFilename: "Registros-nivelacion.csv",
                exporterMenuPdf: false,
                exporterCsvLinkElement: angular.element(
                    document.querySelectorAll(".custom-csv-link-location")
                ),
                exporterExcelFilename: "Registros-nivelacion.xlsx",
                exporterExcelSheetName: "Sheet1",
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged(
                        $scope,
                        function (grid, sortColumns) {
                            if (getPage) {
                                if (sortColumns.length > 0) {
                                    paginationOptions.sort = sortColumns[0].sort.direction;
                                } else {
                                    paginationOptions.sort = null;
                                }
                                getPage(
                                    grid.options.paginationCurrentPage,
                                    grid.options.paginationPageSize,
                                    $scope.Registros
                                );
                            }
                        }
                    );
                    gridApi.pagination.on.paginationChanged(
                        $scope,
                        function (newPage, pageSize) {
                            if (getPage) {
                                getPage(newPage, pageSize, $scope.Registros);
                            }
                        }
                    );
                },
            };

            var getPage = function (curPage, pageSize, sort) {
                services
                    .gestionarRegistrosNivelacion(curPage, pageSize, $scope.Registros)
                    .then(complete)
                    .catch(failed);

                function complete(data) {
                    if (data.data.state == 99) {
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
                    } else {
                        var datos = data.data.data;
                        var counter = data.data.counter;

                        $scope.gridOptionsRegistros.totalItems = counter;
                        var firstRow = (curPage - 1) * datos;
                        $scope.gridOptionsRegistros.data = datos;
                    }
                }

                function failed(error) {
                    console.log(error);
                }
            };

            getPage(
                1,
                $scope.gridOptionsRegistros.paginationPageSize,
                paginationOptions.sort
            );
        }

        $scope.gestion_nivelacion = function () {
            getGrid();
        };

        $scope.registros_nivelacion = function () {
            window.setTimeout(function () {
                registrosTecnicos();
                $(window).resize();
                $(window).resize();
            }, 1000);
        };

        $scope.DetalleTotal = function (row) {
            services
                .buscarhistoricoNivelacion(row.entity.ticket_id)
                .then(complete)
                .catch(failed);

            function complete(data) {
                if (data.data.state === 0) {
                    Swal({
                        type: "error",
                        title: data.data.msj,
                    });
                } else {
                    $scope.nivelacion.databsucarPedido = data.data.data;
                    $("#modalHistoricoNivelacion").modal("show");
                    return data.data;
                }
            }

            function failed(data) {
                console.log(data);
            }
        };

        function js_yyyy_mm_dd_hh_mm_ss() {
            now = new Date();
            year = "" + now.getFullYear();
            month = "" + (now.getMonth() + 1);
            if (month.length == 1) {
                month = "0" + month;
            }
            day = "" + now.getDate();
            if (day.length == 1) {
                day = "0" + day;
            }
            hour = "" + now.getHours();
            if (hour.length == 1) {
                hour = "0" + hour;
            }
            minute = "" + now.getMinutes();
            if (minute.length == 1) {
                minute = "0" + minute;
            }
            second = "" + now.getSeconds();
            if (second.length == 1) {
                second = "0" + second;
            }
            return (
                year +
                "-" +
                month +
                "-" +
                day +
                " " +
                hour +
                ":" +
                minute +
                ":" +
                second
            );
        }

        $scope.hora_sistema = js_yyyy_mm_dd_hh_mm_ss();

        $scope.reloaddata = function () {
            getGrid();
        };

        $scope.delete = function (row) {
            console.log(row.entity);
        };

        $scope.engestion = function (row) {
            services
                .marcarEnGestionNivelacion(row.entity.id)
                .then(complete)
                .catch(failed);

            function complete(data) {
                if (data.data.state == 99) {
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
                } else {
                    Swal({
                        type: "success",
                        title: data.data.msj,
                        timer: 4000,
                    });
                    $route.reload();
                }
            }

            function failed(error) {
                console.log(error);
            }
        };

        $scope.guardagestion = function (row) {
            if (!row.entity.nivelacion) {
                Swal("Selecciona el estado de nivelación");
                return;
            }
            $scope.GestionNivelacion.observacionesNivelacion = "";
            $scope.datos = row.entity;
            $("#editarModal").modal("show");
        };

        $scope.buscarhistoricoNivelacion = function () {
            services
                .buscarhistoricoNivelacion($scope.nivelacion.tarea)
                .then(complete)
                .catch(failed);

            function complete(data) {
                if (data.data.state === 0) {
                    Swal({
                        type: "error",
                        title: data.data.msj,
                    });
                } else {
                    $scope.nivelacion.databsucarPedido = data.data.data;
                    $("#modalHistoricoNivelacion").modal("show");
                    return data.data;
                }
            }

            function failed(data) {
                console.log(data);
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

        $scope.guardarGestionObsNivelacion = function (data) {
            if (!data.nivelacion) {
                Swal("Selecciona el estado de nivelación");
                return;
            }
            $scope.GestionNivelacion.observacionesNivelacion = "";
            $scope.datos = data;
            $("#editarModal").modal("show");
        };

        $scope.guardaNivelacion = function () {
            $scope.datos.observaciones =
                $scope.GestionNivelacion.observacionesNivelacion;
            services
                .guardaNivelacion($scope.datos, $rootScope.galletainfo)
                .then(complete)
                .catch(failed);

            function complete(data) {
                if (data.data.state != 1) {
                    Swal({
                        type: "error",
                        text: data.data.msj,
                        timer: 4000,
                    });
                } else {
                    Swal({
                        type: "success",
                        title: data.data.msj,
                        timer: 4000,
                    }).then(function () {
                        $route.reload();
                    });
                }
            }

            function failed(errs) {
                console.log(errs);
            }
        };

        $scope.registrosNivelacion = function () {
            var fechaini = new Date($scope.fechaini);
            var fechafin = new Date($scope.fechafin);
            var diffMs = fechafin - fechaini;
            var diffDays = Math.round(diffMs / 86400000);

            if (
                $scope.Registros.fechaini === "" ||
                $scope.Registros.fechaini === undefined
            ) {
                Swal({
                    type: "error",
                    text: "Ingrese la fecha inicial",
                });
            } else if (
                $scope.Registros.fechafin === "" ||
                $scope.Registros.fechafin === undefined
            ) {
                Swal({
                    type: "error",
                    text: "Ingrese la fecha final",
                });
            } else if ($scope.Registros.fechafin < $scope.Registros.fechaini) {
                Swal({
                    type: "error",
                    text: "La fecha final no puede ser menor que la inicial",
                });
            } else {
                services
                    .gestionarRegistrosNivelacion(1, 200, $scope.Registros)
                    .then(complete)
                    .catch(failed);

                function complete(data) {
                    console.log(data.data.counter);
                    var datos = data.data.data;
                    var counter = data.data.counter;

                    $scope.gridOptionsRegistros.totalItems = counter;
                    $scope.gridOptionsRegistros.data = datos;
                }

                function failed(error) {
                    console.log(error);
                }
            }
        };

        $scope.csvNivelacion = function () {
            var fechaini = new Date($scope.fechaini);
            var fechafin = new Date($scope.fechafin);
            var diffMs = fechafin - fechaini;
            var diffDays = Math.round(diffMs / 86400000);

            if (
                $scope.Registros.fechaini === "" ||
                $scope.Registros.fechaini === undefined
            ) {
                Swal({
                    type: "error",
                    text: "Ingrese la fecha inicial",
                });
            } else if (
                $scope.Registros.fechafin === "" ||
                $scope.Registros.fechafin === undefined
            ) {
                Swal({
                    type: "error",
                    text: "Ingrese la fecha final",
                });
            } else if ($scope.Registros.fechafin < $scope.Registros.fechaini) {
                Swal({
                    type: "error",
                    text: "La fecha final no puede ser menor que la inicial",
                });
            } else {
                services.csvNivelacion($scope.Registros).then((data) => {
                    if (data.data.state == 1) {
                        var wb = XLSX.utils.book_new();
                        var ws = XLSX.utils.json_to_sheet(data.data.data);
                        XLSX.utils.book_append_sheet(wb, ws, 'nivelacion');
                        XLSX.writeFile(wb, 'Nivelacion_' + tiempo + '.xlsx');
                    } else {
                        Swal({
                            type: 'error',
                            text: data.data.msj,
                            timer: 4000
                        })
                    }
                })
                    .catch((error) => {
                        console.log(error);
                    })

            }
        };

        $scope.reloadNivelacion = function () {
            getGrid();
        };
    }
})();
