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

    angular.module("seguimientopedidos").filter("groupBy");
    function groupBy() {
        console.log('pepe')
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
