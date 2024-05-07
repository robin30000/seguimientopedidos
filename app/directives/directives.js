/*angular.module("seguimientopedidos").directive("cookie", function ($rootScope, $cookies) {
    return {
        link: function ($scope, el, attr, ctrl) {
            if ($cookies.get("usuarioseguimiento") !== undefined) {
                $scope.galletainfo = JSON.parse($cookies.get("usuarioseguimiento"));
                $rootScope.permiso = true;
            }
        },

        templateUrl: "partial/navbar.html",
    };
});*/

/*angular.module("seguimientopedidos").directive("fileModel", [
    "$parse",
    function($parse) {
        return {
            link: function ($scope, element, attrs) {
                element.on("change", function (event) {
                    var files = event.target.files;
                    $parse(attrs.fileInput).assign($scope, element[0].files);
                    $scope.$apply();
                });
            }
        }
    }
]);*/

angular.module("seguimientopedidos").directive("fileModel", function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function () {
                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
})

angular.module("seguimientopedidos").directive("fileModel", [
    "$parse",
    function ($parse) {
        return {
            restrict: "A",
            link: function (scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind("change", function () {
                    scope.$apply(function () {
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            },
        };
    },
]);
