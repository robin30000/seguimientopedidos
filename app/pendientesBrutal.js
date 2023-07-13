(function () {
    "use strict";
    angular.module("seguimientopedidos").controller("pendientesBrutalCtrl", pendientesBrutalCtrl);
    pendientesBrutalCtrl.$inject = ["$scope", "$uibModal", "services"];

    function pendientesBrutalCtrl($scope, $uibModal, services) {
        $scope.abrirModalPendientes = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                size: "md",
                templateUrl: "partial/PendientesBrutal.html",
                controller: function ($scope, $uibModalInstance) {
                    $scope.tituloModalPausa = "Pendientes Brutal force";
                    services.pendientesBrutalForce().then(function (data) {
                        $scope.pendientesBrutal = data.data[0];
                        $scope.total = $scope.pendientesBrutal.length;
                        return data.data;
                    });
                    $scope.cerrar = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                },
            });
        };
    }
})();
