(function () {
    "use strict";
    angular.module("seguimientopedidos").controller("SupervisorCtrl", SupervisorCtrl);
    SupervisorCtrl.$inject = ["$scope", "$rootScope", "services", "$route", "$sce", "$cookies", "$location", "$uibModal", "$log", "$interval"];

    function SupervisorCtrl($scope, $rootScope, services, $route, $sce) {


        $scope.mn = {};

        init();

        function init() {
            mesa1();
            mesa2();
            mesa3();
            mesa4();
            gestionETP();
            gestionToip();
            listarsoportegpon();
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

        function gestionToip() {

            services.myService('', 'toipCtrl.php', 'datos').then((data) => {
                $scope.datosToip = data.data.data;
                $scope.ItemsToip = data.data.counter;
            }).catch((e) => {
                console.log(e)
            })

        }

        function gestionETP() {

            services.myService('', 'etpCtrl.php', 'datos').then((data) => {
                $scope.datosEtp = data.data.data;
                $scope.ItemsEtp = data.data.counter;
            }).catch((e) => {
                console.log(e)
            })

        }

        function listarsoportegpon() {
            services
                .getListaPendientesSoporteGpon()
                .then(function (data) {
                    console.log(data)
                    if (data.data.length > 0) {
                        $scope.dataSoporteGpon = data.data[0];
                        $scope.itemGpon = $scope.dataSoporteGpon.length
                        $scope.datacount = data.data[1];
                        $scope.datacoun2 = data.data[2];

                        $scope.finalizado = $scope.datacoun2[0]["Finalizado"];
                        $scope.devuelto = $scope.datacoun2[0]["Devuelto al tecnico"];
                        $scope.incompleto = $scope.datacoun2[0]["Incompleto"];
                        $scope.sinrespuesta = $scope.datacoun2[0]["sinrespuesta"];
                        $scope.isLoadingData = false;
                    } else {
                        $scope.flagOnlyPSData = true;
                    }

                    return data;
                })
                .catch((err) => {
                    console.log(err);
                });

            $scope.isLoadingData = false;
        }

        $scope.contadorGpon = () => {
            let counter = $scope.datacount;
            let finalizado = $scope.finalizado;
            let devuelto = $scope.devuelto;
            let incompleto = $scope.incompleto;
            let sinrespuesta = $scope.sinrespuesta;
            var tabla = '<table class="table table-striped small">' +
                '<thead>' +
                '<tr>' +
                '<th>Login Analista</th>' +
                '<th>Cantidad Marcadas</th>' +
                '</tr>' +
                '</thead>' +
                '<tbody>';

            for (var i = 0; i < counter.length; i++) {
                tabla += '<tr>' +
                    '<td class="filterable-cell"><i class="fa fa-user" aria-hidden="true"></i>  ' + counter[i]['login'] + '</td>' +
                    '<td class="filterable-cell">  ' + counter[i]['Conteo'] + '</td>' +
                    '</tr>';
            }
            tabla += '</tbody>' +
                '</table>' +
                '<div style="text-align: center"><b>Detalles hoy</b></div>' +
                '<ul style="list-style: none;">' +
                '<li>' +
                '<span class="label label-success">Finalizados: ' + finalizado + '</span>' +
                '</li>' +
                '<li>' +
                '<span class="label label-warning">Devueltos al técnico: ' + devuelto + '</span>' +
                '</li>' +
                '<li>' +
                '<span class="label label-danger">Incompletos: ' + incompleto + '</span>' +
                '</li>' +
                '<li>' +
                '<span class="label label-info">Sin respuesta: ' + sinrespuesta + '</span>' +
                '</li>' +
                '</ul>';
            $scope.contadorGpon = $sce.trustAsHtml(tabla);
        }

        $scope.ver_masGpon = (data) => {
            $scope.dataContent = $sce.trustAsHtml('<div class="table-responsive" style="max-width: 380px;"><table class="table table-bordered table-hover table-condensed small" style="max-width: 350px;">' +
                '<tbody><tr><td style="min-width: 80px">Pedido</td><td>' + data.unepedido + '</td></tr>' +
                '<tr><td style="min-width: 80px">Categoría</td><td>' + data.tasktypecategory + '</td></tr>' +
                '<tr><td style="min-width: 80px">Municipio</td><td>' + data.unemunicipio + '</td></tr>' +
                '<tr><td style="min-width: 80px">Productos</td><td>' + data.uneproductos + '</td></tr>' +
                '<tr><td style="min-width: 80px">Datos cola</td><td>' + data.datoscola + '</td></tr>' +
                '<tr><td style="min-width: 80px">Mac</td><td>' + data.mac + '</td></tr>' +
                '<tr><td style="min-width: 80px">Serial</td><td>' + data.serial.replace(/,/g, '\n') + '</td></tr>' +
                '<tr><td style="min-width: 80px">Sistema</td><td>' + data.uneSourceSystem + '</td></tr>' +
                '<tr><td style="min-width: 80px">Tipo equipo</td><td>' + data.tipo_equipo.replace(/,/g, '\n') + '</td></tr>' +
                '<tr><td style="min-width: 80px">Velocidad navegación</td><td>' + data.velocidad_navegacion + '</td></tr>' +
                '<tr><td style="min-width: 80px">Observación</td><td>' + data.observacion_terreno + '</td></tr>' +
                '<tr><td style="min-width: 80px">Fecha solicitud</td><td>' + data.fecha_creado + '</td></tr>' +
                '</tbody></table></div>');
        }

        $scope.ver_masToip = (data) => {
            $(".popover").css('display','none !importan');
            $scope.dataContent = $sce.trustAsHtml('<div class="table-responsive" style="max-width: 380px;"><table class="table table-bordered table-hover table-condensed small" style="max-width: 350px;">' +
                '<tbody><tr><td style="min-width: 80px">Hora cierre click</td><td>' + data.hora_cierre_click + '</td></tr>' +
                '<tbody><tr><td style="min-width: 80px">Respuesta aprov</td><td>' + data.respuesta_aprov + '</td></tr>' +
                '<tr><td style="min-width: 80px">Eq producto</td><td>' + data.eq_producto + '</td></tr>' +
                '<tr><td style="min-width: 80px">Categoría</td><td>' + data.categoria + '</td></tr>' +
                '<tr><td style="min-width: 80px">Task type</td><td>' + data.task_type + '</td></tr>' +
                '<tr><td style="min-width: 80px">Equipment id</td><td>' + data.equipment_id + '</td></tr>' +
                '<tr><td style="min-width: 80px">Tipo equipo</td><td>' + data.tipo_equipo + '</td></tr>' +
                '</tbody></table></div>');
        }

        $scope.ver_masEtp = (data) => {
            $scope.dataContent = $sce.trustAsHtml('<div class="table-responsive" style="max-width: 380px;"><table class="table table-bordered table-hover table-condensed small" style="max-width: 350px;">' +
                '<tbody><tr><td style="min-width: 80px">Pedido</td><td>' + data.unepedido + '</td></tr>' +
                '<tr><td style="min-width: 80px">Categoría</td><td>' + data.tasktypecategory + '</td></tr>' +
                '<tr><td style="min-width: 80px">Municipio</td><td>' + data.unemunicipio + '</td></tr>' +
                '<tr><td style="min-width: 80px">Productos</td><td>' + data.uneproductos + '</td></tr>' +
                '<tr><td style="min-width: 80px">Mac</td><td>' + data.mac + '</td></tr>' +
                '<tr><td style="min-width: 80px">Serial</td><td>' + data.serial.replace(/,/g, '\n') + '</td></tr>' +
                '<tr><td style="min-width: 80px">Sistema</td><td>' + data.uneSourceSystem + '</td></tr>' +
                '<tr><td style="min-width: 80px">Tecnología</td><td>' + data.UNETecnologias + '</td></tr>' +
                '<tr><td style="min-width: 80px">Observación</td><td>' + data.observacion_terreno + '</td></tr>' +
                '<tr><td style="min-width: 80px">Fecha solicitud</td><td>' + data.fecha_crea + '</td></tr>' +
                '</tbody></table></div>');
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
                case 5 :
                    registros();
                    $scope.mn = '';
                    break;
            }
        }

        $scope.recargaGpon = () => {
            listarsoportegpon();
        }

        $scope.recargaEtp = () => {
            gestionETP();
        }

        $scope.recargaToip = () => {
            gestionToip();
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
