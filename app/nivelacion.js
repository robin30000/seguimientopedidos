(function () {
    "use strict";
    angular.module("seguimientopedidos").controller("nivelacionCtrl", nivelacionCtrl);
    nivelacionCtrl.$inject = ["$scope", "$http", "$rootScope", "$location", "$route", "$cookies", "services"];

    function nivelacionCtrl(
        $scope,
        $http,
        $rootScope,
        $location,
        $route,
        $cookies,
        services
    ) {
        $scope.nivelacion = {};
        $scope.nivelacion.ticket = "";
        $scope.nivelacion.newIdTecnic = "";
        $scope.visible = false;
        $scope.newTec = false;
        $scope.tec = false;

        en_genstion_nivelacion();

        function en_genstion_nivelacion() {
            services.en_genstion_nivelacion().then(complete).catch(failed);

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
                    $scope.nivelacion.proceso_terminado = data.data.tarea;
                    if (data.data.gestion[0].total !== "undefined") {
                        $scope.nivelacion.pendienteTotal = data.data.gestion[0].total;
                    } else {
                        $scope.nivelacion.pendienteTotal = 0;
                    }

                    if (data.data.gestion[1].total !== "undefined") {
                        $scope.nivelacion.realizadoTotal = data.data.gestion[1].total;
                    } else {
                        $scope.nivelacion.realizadoTotal = 0;
                    }
                }
            }

            function failed(data) {
                console.log(data);
            }
        }

        $scope.buscarhistoricoNivelacion = function () {
            if (
                $scope.nivelacion.historico == "" ||
                $scope.nivelacion.historico == undefined
            ) {
                swal({
                    type: "error",
                    text: "Ingrese la tarea a buscar",
                });
            } else {
                services
                    .buscarhistoricoNivelacion($scope.nivelacion.historico)
                    .then(complete)
                    .catch(failed);

                function complete(data) {
                    $scope.nivelacion.databsucarPedido = data.data.data;
                    $("#modalHistoricoNivelacion").modal("show");
                    return data.data;
                }

                function failed(data) {
                    console.log(data);
                }
            }
        };

        $scope.searchTicket = function () {
            if (
                $scope.nivelacion.ticket === "" ||
                $scope.nivelacion.ticket === undefined
            ) {
                Swal({
                    type: "error",
                    title: "Ingrese una tarea",
                });
            } else {
                $scope.url =
                    "http://10.100.66.254:8080/HCHV_DEV/BuscarC/" +
                    $scope.nivelacion.ticket;
                $http.get($scope.url, {timeout: 2000}).then(
                    function (data) {
                        if (data.data.state != 0) {
                            Swal({
                                type: "error",
                                title: "No se encontraron datos",
                                timer: 4000
                            });
                        } else {
                            $scope.nivelacion.pedido = data.data[0].UNEpedido;
                            $scope.nivelacion.subZona = data.data[0].district;
                            $scope.nivelacion.nombreTecnico = data.data[0].EngineerName;
                            $scope.nivelacion.idTecnico = data.data[0].EngineerID;
                            $scope.nivelacion.proceso = data.data[0].tasktypecategory;
                            $scope.nivelacion.zona = data.data[0].region;
                            $scope.visible = true;

                            $scope.status = data.data[0].status;
                            $scope.fecha_res = data.data[0].unefechacita;
                            $scope.fecha_res = $scope.fecha_res.split(" ");
                            if ($scope.fecha_res[2]) {
                                $scope.fecha_res = $scope.fecha_res[0];
                                $scope.fecha_res = $scope.fecha_res.split("/");
                                $scope.fecha_res =
                                    $scope.fecha_res[2] +
                                    "-" +
                                    $scope.fecha_res[1] +
                                    "-" +
                                    $scope.fecha_res[0];
                            } else {
                                $scope.fecha_res = data.data[0].unefechacita;
                            }

                            $scope.searchIdTecnic = function () {
                                services
                                    .searchIdTecnic($scope.nivelacion.newIdTecnic)
                                    .then(complete)
                                    .catch(failed);

                                function complete(data) {
                                    if (data.data.state === 0) {
                                        Swal({
                                            type: "error",
                                            title: "No se encontraron datos",
                                            timer: 4000
                                        });
                                    } else {
                                        $scope.nivelacion.newTecName = data.data.data.nombre;
                                        $scope.newTec = true;
                                    }
                                }

                                function failed(data) {
                                    console.log(data);
                                }
                            };

                            $scope.saveNivelation = function () {
                                var today = new Date();
                                var day = today.getDate();
                                var month = today.getMonth() + 1;
                                var year = today.getFullYear();
                                var hoy = `${year}-${month}-${day}`;
                                $scope.case6 = 0;
                                $scope.case7 = 0;
                                //$scope.fecha_res = '2022-12-16';
                                if ($scope.nivelacion.motivo == 1) {
                                    if (
                                        $scope.nivelacion.motivo == 1 &&
                                        ($scope.status == "Abierto" || $scope.status == "Asignado")
                                    ) {
                                        Swal({
                                            type: "error",
                                            title: "La tarea esta en estado de asignacion automatica",
                                            timer: 4000,
                                        }).then(function () {
                                            $route.reload();
                                        });
                                    } else if (
                                        $scope.nivelacion.motivo == 1 &&
                                        ($scope.status == "Finalizada" ||
                                            $scope.status == "Suspendido" ||
                                            $scope.status == "Suspendido-Abierto" ||
                                            $scope.status == "Incompleto" ||
                                            $scope.status == "Pendiente" ||
                                            $scope.status == "Abierto" ||
                                            $scope.status == "Asignado")
                                    ) {
                                        Swal({
                                            type: "error",
                                            title: "La tarea esta en estado no valido",
                                            timer: 4000,
                                        }).then(function () {
                                            $route.reload();
                                        });
                                    } else {
                                        services
                                            .saveNivelation($scope.nivelacion, $rootScope.galletainfo)
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
                                            } else if (data.data.state === 0) {
                                                Swal({
                                                    type: "error",
                                                    title: data.data.msj,
                                                    timer: 4000,
                                                }).then(function () {
                                                    $route.reload();
                                                });
                                            } else {
                                                Swal({
                                                    type: "success",
                                                    title:
                                                        "La solicitud de nivelación se ha creado correctamente",
                                                    timer: 4000,
                                                }).then(function () {
                                                    $route.reload();
                                                });
                                            }
                                        }

                                        function failed(data) {
                                            console.log(data);
                                        }
                                    }
                                } else {
                                    if (
                                        $scope.nivelacion.submotivo == 6 ||
                                        $scope.nivelacion.submotivo == 7
                                    ) {
                                        if ($scope.nivelacion.submotivo == 6) {
                                            $scope.url =
                                                "http://10.100.66.254:8080/HCHV_DEV/BuscarF/" +
                                                $scope.nivelacion.ticket;
                                            $http
                                                .get($scope.url, {timeout: 2000})
                                                .then(function (data) {
                                                    if (data.data.state == 1) {
                                                        Swal({
                                                            type: "error",
                                                            title: data.data.data,
                                                            timer: 4000,
                                                        }).then(function () {
                                                            $route.reload();
                                                        });
                                                    } else if (data.data.state == 0) {
                                                        if (
                                                            $scope.nivelacion.submotivo == 6 &&
                                                            $scope.status != "Incompleto"
                                                        ) {
                                                            if (
                                                                $scope.nivelacion.submotivo == 6 &&
                                                                $scope.status != "Pendiente"
                                                            ) {
                                                                Swal({
                                                                    type: "error",
                                                                    title: "La tarea esta en estado no valido",
                                                                    timer: 4000,
                                                                }).then(function () {
                                                                    $route.reload();
                                                                });
                                                            } else if (
                                                                $scope.nivelacion.submotivo == 6 &&
                                                                $scope.fecha_res != hoy
                                                            ) {
                                                                Swal({
                                                                    type: "error",
                                                                    title:
                                                                        "La tarea tiene una fecha diferente a hoy",
                                                                    timer: 4000,
                                                                }).then(function () {
                                                                    $route.reload();
                                                                });
                                                            } else {
                                                                services
                                                                    .saveNivelation(
                                                                        $scope.nivelacion,
                                                                        $rootScope.galletainfo
                                                                    )
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
                                                                    } else if (data.data.state === 0) {
                                                                        Swal({
                                                                            type: "error",
                                                                            title: data.data.msj,
                                                                            timer: 4000,
                                                                        }).then(function () {
                                                                            $route.reload();
                                                                        });
                                                                    } else {
                                                                        Swal({
                                                                            type: "success",
                                                                            title:
                                                                                "La solicitud de nivelación se ha creado correctamente",
                                                                            timer: 4000,
                                                                        }).then(function () {
                                                                            $route.reload();
                                                                        });
                                                                    }
                                                                }
                                                            }
                                                        } else if (
                                                            $scope.nivelacion.submotivo == 6 &&
                                                            $scope.fecha_res != hoy
                                                        ) {
                                                            Swal({
                                                                type: "error",
                                                                title:
                                                                    "La tarea tiene una fecha diferente a hoy",
                                                                timer: 4000,
                                                            }).then(function () {
                                                                $route.reload();
                                                            });
                                                        } else {
                                                            services
                                                                .saveNivelation(
                                                                    $scope.nivelacion,
                                                                    $rootScope.galletainfo
                                                                )
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
                                                                } else if (data.data.state === 0) {
                                                                    Swal({
                                                                        type: "error",
                                                                        title: data.data.msj,
                                                                        timer: 4000,
                                                                    }).then(function () {
                                                                        $route.reload();
                                                                    });
                                                                } else {
                                                                    Swal({
                                                                        type: "success",
                                                                        title:
                                                                            "La solicitud de nivelación se ha creado correctamente",
                                                                        timer: 4000,
                                                                    }).then(function () {
                                                                        $route.reload();
                                                                    });
                                                                }
                                                            }
                                                        }

                                                        function failed(data) {
                                                            console.log(data);
                                                        }
                                                    }
                                                });
                                        } else if ($scope.nivelacion.submotivo == 7) {
                                            $scope.url =
                                                "http://10.100.66.254:8080/HCHV_DEV/BuscarF/" +
                                                $scope.nivelacion.ticket;
                                            $http
                                                .get($scope.url, {timeout: 2000})
                                                .then(function (data) {
                                                    if (data.data.state == 1) {
                                                        Swal({
                                                            type: "error",
                                                            title: data.data.data,
                                                            timer: 4000,
                                                        }).then(function () {
                                                            $route.reload();
                                                        });
                                                    } else if (data.data.state == 0) {
                                                        if (
                                                            $scope.nivelacion.submotivo == 7 &&
                                                            $scope.status != "Incompleto"
                                                        ) {
                                                            if (
                                                                $scope.nivelacion.submotivo == 7 &&
                                                                $scope.status != "Pendiente"
                                                            ) {
                                                                Swal({
                                                                    type: "error",
                                                                    title: "La tarea esta en estado no valido",
                                                                    timer: 4000,
                                                                }).then(function () {
                                                                    $route.reload();
                                                                });
                                                            } else if (
                                                                $scope.nivelacion.submotivo == 7 &&
                                                                $scope.fecha_res >= hoy
                                                            ) {
                                                                Swal({
                                                                    type: "error",
                                                                    title: "La tarea tiene una fecha mayor",
                                                                    timer: 4000,
                                                                }).then(function () {
                                                                    $route.reload();
                                                                });
                                                            } else {
                                                                services
                                                                    .saveNivelation(
                                                                        $scope.nivelacion,
                                                                        $rootScope.galletainfo
                                                                    )
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
                                                                    } else if (data.data.state === 0) {
                                                                        Swal({
                                                                            type: "error",
                                                                            title: data.data.msj,
                                                                            timer: 4000,
                                                                        }).then(function () {
                                                                            $route.reload();
                                                                        });
                                                                    } else {
                                                                        Swal({
                                                                            type: "success",
                                                                            title:
                                                                                "La solicitud de nivelación se ha creado correctamente",
                                                                            timer: 4000,
                                                                        }).then(function () {
                                                                            $route.reload();
                                                                        });
                                                                    }
                                                                }
                                                            }
                                                        } else if (
                                                            $scope.nivelacion.submotivo == 7 &&
                                                            $scope.fecha_res >= hoy
                                                        ) {
                                                            Swal({
                                                                type: "error",
                                                                title: "La tarea tiene una fecha mayor",
                                                                timer: 4000,
                                                            }).then(function () {
                                                                $route.reload();
                                                            });
                                                        } else {
                                                            services
                                                                .saveNivelation(
                                                                    $scope.nivelacion,
                                                                    $rootScope.galletainfo
                                                                )
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
                                                                } else if (data.data.state === 0) {
                                                                    Swal({
                                                                        type: "error",
                                                                        title: data.data.msj,
                                                                        timer: 4000,
                                                                    }).then(function () {
                                                                        $route.reload();
                                                                    });
                                                                } else {
                                                                    Swal({
                                                                        type: "success",
                                                                        title:
                                                                            "La solicitud de nivelación se ha creado correctamente",
                                                                        timer: 4000,
                                                                    }).then(function () {
                                                                        $route.reload();
                                                                    });
                                                                }
                                                            }
                                                        }

                                                        function failed(data) {
                                                            console.log(data);
                                                        }
                                                    }
                                                });
                                        }
                                    } else {
                                        services
                                            .saveNivelation($scope.nivelacion, $rootScope.galletainfo)
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
                                            } else if (data.data.state === 0) {
                                                Swal({
                                                    type: "error",
                                                    title: data.data.msj,
                                                    timer: 4000,
                                                }).then(function () {
                                                    $route.reload();
                                                });
                                            } else {
                                                Swal({
                                                    type: "success",
                                                    title:
                                                        "La solicitud de nivelación se ha creado correctamente",
                                                    timer: 4000,
                                                }).then(function () {
                                                    $route.reload();
                                                });
                                            }
                                        }

                                        function failed(data) {
                                            console.log(data);
                                        }
                                    }
                                }
                            };
                        }
                    },
                    function (failed) {
                        console.log(2, failed);
                    }
                );
            }
        };
    }
})();
