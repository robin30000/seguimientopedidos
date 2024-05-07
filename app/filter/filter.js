(function () {
    "use strict";

    angular.module("seguimientopedidos")
        .filter("mapNivelacion", mapNivelacion)
        .filter("groupBy", groupBy)
        .filter("replace", replace)
        .filter("padWithZeros", padWithZeros);

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

    function groupBy() {
        return function (data, key) {
            if (!(data && key)) return;
            var result = [];
            for (var i = 0; i < data.length; i++) {
                var value = data[i][key];
                var group = result.find(g => g.key === value);
                if (!group) {
                    group = {key: value, items: []};
                    result.push(group);
                }
                group.items.push(data[i]);
            }
            return result;
        };
    }

    function replace() {
        return function (input, from, to) {
            if (input === undefined) {
                return;
            }

            var regex = new RegExp(from, "g");
            return input.replace(regex, to);
        };
    }

    function padWithZeros() {
        return function (input) {
            return String(input).padStart(8, '0');
        };
    }

})();
