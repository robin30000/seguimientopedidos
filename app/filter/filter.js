(function () {
    "use strict";
    angular.module("seguimientopedidos").filter("mapNivelacion");
    mapNivelacion.$inject = [];
    function mapNivelacion() {
        var genderHash = {
            SI: "SI",
            NO: "NO",
        };

        return function (input) {
            if (!input) {
                return "";
            } else {
                return genderHash[input];
            }
        };
    }

    angular.module("seguimientopedidos").filter("replace");
    replace.$inject = [];
    function replace() {
        return function (input, from, to) {
            if (input === undefined) {
                return;
            }

            var regex = new RegExp(from, "g");
            return input.replace(regex, to);
        };
    }

})();
