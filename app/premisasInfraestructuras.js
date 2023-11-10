(function () {
    "use strict";
    angular.module("seguimientopedidos").controller("premisasInfraestructurasCtrl", premisasInfraestructurasCtrl);
    premisasInfraestructurasCtrl.$inject = ["$scope", "$rootScope", "$location", "$route", "$cookies", "services"];

    function premisasInfraestructurasCtrl(
        $scope,
        $rootScope,
        $location,
        $route,
        $cookies,
        services
    ) {
        $scope.isInfraestructureFromField = false;
        $scope.isInfraestructureFromIntranet = false;
        $scope.isLoadingData = true;
        $scope.dataEscalamientoInfraestructura = [];
        $scope.dataEscalamientoInfraestructuraPrioridad2 = [];

        $scope.listarescalamientosinfraestructura = () => {
            database
                .collection("infraestructure")
                .where("status", "==", 0)
                .orderBy("dateCreated", "asc")
                .get()
                .then((querySnapshot) => {
                    $scope.isInfraestructureFromField = false;
                    $scope.listaEscalamientosInfraestructura = [];
                    querySnapshot.forEach((doc) => {
                        let dataQuerySnapshot = {};
                        dataQuerySnapshot = {
                            _id: doc.id,
                            addressTap: doc.data().addressTap,
                            observaciones: doc.data().comments,
                            dateCreated: doc.data().dateCreated,
                            correa_marcacion: doc.data().isMarkInstalledSif,
                            isPhoto: doc.data().isPhoto,
                            isSmnetTestSif: doc.data().isSmnetTestSif,
                            mac_real_cpe: doc.data().macRealCPE,
                            markTap: doc.data().markTap,
                            netType: doc.data().netType,
                            proceso: doc.data().process,
                            producto: doc.data().product,
                            motivo: doc.data().subject,
                            status: doc.data().status,
                            pedido: doc.data().task,
                            user_ID: doc.data().user_ID,
                            user_identification: doc.data().user_identification,
                            vTap: doc.data().vTap,
                            informacion_adicional: doc.data().concatData,
                        };

                        var date = dataQuerySnapshot.dateCreated.toDate();
                        var year = date.getFullYear();
                        var month = date.getMonth();
                        var day = "0" + date.getDate();
                        var hours = "0" + date.getHours();
                        var minutes = "0" + date.getMinutes();
                        var seconds = "0" + date.getSeconds();

                        var formattedTime =
                            year +
                            "-" +
                            (month + 1) +
                            "-" +
                            day.substr(-2) +
                            " " +
                            hours.substr(-2) +
                            ":" +
                            minutes.substr(-2) +
                            ":" +
                            seconds.substr(-2);

                        dataQuerySnapshot.fecha_solicitud = formattedTime;
                        $scope.listaEscalamientosInfraestructura.push(dataQuerySnapshot);
                    });

                    if ($scope.flagOnlyPSData) {
                        $scope.dataEscalamientoInfraestructura =
                            $scope.listaEscalamientosInfraestructura.concat(
                                $scope.dataGestionEscalamiento
                            );
                        $scope.isLoadingData = false;
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        };

        $scope.gestionescalamiento = () => {
            let isLoadingData = true;
            $scope.flagOnlyPSData = false;
            $scope.dataGestionEscalamiento = [];

            services
                .datosgestionescalamientos()
                .then(function (data) {
                    console.log(data);
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
                        $scope.listarescalamientosinfraestructura();
                        if (data.data.state != 1) {
                            Swal({
                                type: 'error',
                                text: data.data.msj,
                                timer: 4000
                            })
                        } else {
                            $scope.dataGestionEscalamiento = data.data.data;
                            if ($scope.listaEscalamientosInfraestructura) {
                                if ($scope.listaEscalamientosInfraestructura.length > 0) {
                                    $scope.dataEscalamientoInfraestructura =
                                        $scope.listaEscalamientosInfraestructura.concat(
                                            $scope.dataGestionEscalamiento
                                        );
                                    $scope.isLoadingData = false;
                                } else {
                                    $scope.flagOnlyPSData = true;
                                }
                            } else {
                                $scope.flagOnlyPSData = true;
                            }
                        }

                    }
                })
                .catch((err) => {
                    $scope.listarescalamientosinfraestructura();
                    console.log(err);
                });

            services
                .datosgestionescalamientosprioridad2()
                .then(function (data) {
                    if (data.data.state != 1) {
                        console.log(data.data.msj);
                    } else {
                        $scope.dataEscalamientoInfraestructuraPrioridad2 = data.data.data;
                    }

                })
                .catch((err) => {
                    console.log(err);
                });
        };

        $scope.exportarRegistros = () => {
            services.exportEscalamientos()
                .then(function (data) {
                    if (data.data.state == 1) {
                        var wb = XLSX.utils.book_new();
                        var ws = XLSX.utils.json_to_sheet(data.data.data);
                        XLSX.utils.book_append_sheet(wb, ws, 'nivedades_tecnico');
                        XLSX.writeFile(wb, 'Novedades_tecnico_' + tiempo + '.xlsx');
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
        };

        $scope.mostrarModalConcatenacion = (data) => {
            data = data.replaceAll("||", "<br>");
            Swal({
                type: "info",
                title: "Información Adicional",
                html:
                    '<div style="text-align:justify;font-size: 12px;">' + data + "</div>",
                footer: "Puedes copiar esta información si lo deseas",
            });
        };

        $scope.mostrarModalEscalamiento = function (data) {
            if (data.engestion == null || data.engestion == "0") {
                Swal({
                    type: 'info',
                    title: 'Opsss....',
                    text: 'Debes bloquear el pedido',
                    timer: 4000
                })
            } else if (data.tipificacion == undefined || data.tipificacion == "") {
                Swal({
                    type: 'info',
                    title: 'Opsss....',
                    text: 'Recuerda seleccionar todas las opciones!!',
                    timer: 4000
                })
            } else {
                $scope.gestionescala = data;
                $("#editarModal").modal("show");
                return data.data;
            }
        };

        $scope.marcarEngestionEscalamiento = async (data) => {
            if (data._id) {
                try {
                    await $scope.autocompletarEscalamiento(data);
                } catch (error) {
                    return swal({
                        title: "Aviso Importante: ",
                        html: "El pedido no fue desbloqueado.",
                        type: "error",
                    });
                }
            } else {
                services
                    .marcarengestionescalamiento(data, $rootScope.galletainfo)
                    .then(function (data) {
                        if (data.data.data != 1) {
                            Swal({
                                type: 'error',
                                text: data.data.msj,
                                timer: 4000
                            })
                        } else if (data.data == "") {
                            Swal({
                                type: 'success',
                                text: data.data.msj,
                                timer: 4000
                            })
                        }
                    })
                    .catch((err) => console.log(err));
            }
        };

        $scope.autocompletarEscalamiento = async (data) => {
            try {
                var autocompleteQuery = await fetch(
                    "http://10.100.66.254:8080/HCHV_DEV/Buscar/" + data.pedido
                );
                var autocompleteData = await autocompleteQuery.json();
                data.engineerID = autocompleteData.engineerID;
                data.engineer = autocompleteData.engineerName;
                data.dateCreated = data.dateCreated.toDate();
                data.area = autocompleteData.Area;
                data.taskType = autocompleteData.TaskType;
                data.region = autocompleteData.Region;
                data.task = autocompleteData.tAREA_ID;
                data.tech = autocompleteData.uNETecnologias;
                data.department = autocompleteData.uNEDepartamento;
                data.status = autocompleteData.Estado;
                data.crm = autocompleteData.Crm;
                data.ans = null;

                if (autocompleteData.TaskType == "Reparacion") {
                    var ansQuery = await fetch(
                        "http://10.100.66.254:7771/api/ans/" + data.pedido
                    );
                    var ansData = await ansQuery.json();
                    data.ans = ansData.horas;
                }

                if (
                    data.status == "" ||
                    data.status == undefined ||
                    data.status == null
                ) {
                    swal({
                        title: "El Pedido Debe Cancelarse: ",
                        html: `El pedido ${data.pedido} que ha seleccionado, no existe en click.`,
                        type: "warning",
                    });
                } else {
                    if (data.status != "En Sitio") {
                        swal({
                            title: "El Pedido Debe Cancelarse: ",
                            html: `El pedido ${data.pedido} que ha seleccionado, no se encuentra en sitio, proceda a cancelarlo.`,
                            type: "warning",
                        });
                    }

                    if (data.tech != "HFC") {
                        swal({
                            title: "El Pedido Debe Cancelarse: ",
                            html: `El pedido ${data.pedido} que ha seleccionado, no es de tecnología HFC.`,
                            type: "warning",
                        });
                    }
                }
                var queryIsAlreadyToken = database
                    .collection("infraestructure")
                    .doc(data._id);
                var querySnapshotAT = await queryIsAlreadyToken.get();
                if (querySnapshotAT.data().status == 1) {
                    swal({
                        title: "Este pedido ya ha sido tomado: ",
                        html: `El pedido ${data.pedido} que ha seleccionado, ya ha sido tomado.`,
                        type: "warning",
                    });
                } else {
                    await fetch(
                        "https://autogestionterreno.com.co/api/state-infraestructure/",
                        {
                            method: "PUT",
                            mode: "cors",
                            body: JSON.stringify({infraestructure_ID: data._id}),
                            headers: {"Content-type": "application/json;charset=UTF-8"},
                        }
                    );

                    var querySaveScale = await services.guardarEscalamiento(
                        data,
                        $rootScope.galletainfo
                    );
                    $scope.gestionescalamiento();
                }
            } catch (error) {
                swal({
                    title: "Información Pedido: ",
                    html: "No encontrado",
                    type: "warning",
                });
                console.log(error);
                return;
            }
        };

        $scope.guardarescalamiento = async function (data) {
            if (data.login_gestion == null) {
                Swal({
                    type: 'info',
                    title: 'Opsss....',
                    text: 'Debes de marcar la solicitud, antes de guardar!',
                    timer: 4000
                })
            } else {
                if (!data.observacionesescalamiento) {
                    Swal({
                        type: 'info',
                        title: 'Opsss....',
                        text: 'Debes ingresar las observaciones.',
                        timer: 4000
                    })
                } else {
                    try {
                        Swal({
                            type: 'success',
                            title: 'Muy bien',
                            text: 'Pedido guardado, recuerda actualizar!!',
                            timer: 4000
                        })
                        var currentTimeDate = new Date().toLocaleString();
                        var statusInfraestructure =
                            data.tipificacion == "Escalamiento realizado ok" ||
                            data.tipificacion == "Escalamiento ok nivel 2" ||
                            data.tipificacion == "Escalamiento ok nivel 2 Prioridad"
                                ? "Aprobado"
                                : "Rechazado";

                        await fetch(
                            "https://autogestionterreno.com.co/api/update-infraestructure/",
                            {
                                method: "PUT",
                                mode: "cors",
                                body: JSON.stringify({
                                    infraestructure_ID: data.id_terreno,
                                    infraestructure_Status: statusInfraestructure,
                                    dateAswered: currentTimeDate,
                                }),
                                headers: {"Content-type": "application/json;charset=UTF-8"},
                            }
                        );

                        services
                            .editarregistroescalamiento(data, $rootScope.galletainfo)
                            .then(function (data) {
                            })
                            .catch((err) => alert(err));
                        $scope.gestionescalamiento();
                    } catch (error) {
                        swal({
                            title: "Hay problemas al almacenar la gestión ",
                            html: "Consulte con desarrollo para más información",
                            type: "warning",
                        });
                    }
                }
            }
        };

        $scope.CopyPortaPapelesEscalamientoInfraestructura = (data) => {
            var copyTextEI = document.createElement("input");
            copyTextEI.value = data;
            document.body.appendChild(copyTextEI);
            copyTextEI.select();
            document.execCommand("copy");
            document.body.removeChild(copyTextEI);
            Swal({
                type: "info",
                title: "Aviso",
                text: "El texto seleccionado fue copiado",
            });
        };

        $scope.gestionescalamiento();
    }
})();
