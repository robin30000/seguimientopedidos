(function () {
    "use strict";
    angular.module("seguimientopedidos").controller("GestioncodigoincompletoCtrl", GestioncodigoincompletoCtrl);
    GestioncodigoincompletoCtrl.$inject = ["$scope", "$rootScope", "services"];

    function GestioncodigoincompletoCtrl($scope, $rootScope, services) {
        $scope.isSoporteGponFromField = false;
        $scope.isSoporteGponFromIntranet = false;
        $scope.isLoadingData = true;
        $scope.dataCodigoIncompleto = [];

        listarcodigoincompleto();

        function listarcodigoincompleto(data) {
            if (data === '' || data === undefined) {
                $scope.currentPage = 1;
                $scope.totalItems = 0;
                $scope.pageSize = 15;
                $scope.searchText = '';
                data = {'page': $scope.currentPage, 'size': $scope.pageSize}
            }
            services
                .getListaCodigoIncompleto(data)
                .then(function (data) {
                    $scope.dataCodigoIncompleto = data.data.data;

                    $scope.totalItems = data.data.counter;
                    $scope.startItem = ($scope.currentPage - 1) * $scope.pageSize + 1;
                    $scope.endItem = $scope.currentPage * $scope.pageSize;
                    if ($scope.endItem > data.data.counter) {
                        $scope.endItem = data.data.counter;
                    }
                })
                .catch((err) => {
                    $scope.isLoadingData = true;
                    console.log(err);
                });

            $scope.isLoadingData = false;
        };

        $scope.pageChanged = function () {
            data = {'page': $scope.currentPage, 'size': $scope.pageSize}
            console.log(data)
            listarcodigoincompleto(data);
        }
        $scope.pageSizeChanged = function () {
            console.log(data)
            data = {'page': $scope.currentPage, 'size': $scope.pageSize}
            $scope.currentPage = 1;
            listarcodigoincompleto(data);
        }

        $scope.gestionarCodigoIncompleto = async (id_codigo_incompleto) => {
            let tipificacion = $("#tipificacion" + id_codigo_incompleto).val();

            const {value: observacion} = await Swal({
                title: "Gestión Código Incompleto",
                input: "textarea",
                inputPlaceholder: "Gestion...",
                inputAttributes: {
                    "aria-label": "Gestion",
                },
                showCancelButton: true,
            });

            if (observacion) {
                Swal("Cargando...");

                if (tipificacion == "") {
                    Swal({
                        title: "Error",
                        text: "Debes de seleccionar una tipificación.",
                        type: "error",
                    });
                    return false;
                }

                services
                    .gestionarCodigoIncompleto(
                        id_codigo_incompleto,
                        tipificacion,
                        observacion,
                        $rootScope.galletainfo
                    )
                    .then(function (data) {
                        $scope.listarcodigoincompleto();
                        Swal({
                            title: "Excelente",
                            text: data.data.msg,
                            type: "success",
                        });
                    })
                    .catch((err) => {
                        console.log("err", err);
                    });
            } else {
                Swal({
                    title: "Error",
                    text: "Debes ingresar una observacion.",
                    type: "error",
                });
                return false;
            }
        };
    }
})();

