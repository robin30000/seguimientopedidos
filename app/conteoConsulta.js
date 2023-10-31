(function () {
    "use strict";
    angular.module("seguimientopedidos").controller("ConteoCtrl", ConteoCtrl);
    ConteoCtrl.$inject = ["$scope", "$http", "$rootScope", "services"];

    function ConteoCtrl($scope, $http, $rootScope, services) {

        datos();

        function datos(d) {
            let data = {}
            if (d) {
                data = {fecha: d}
            }
            services.myService(data, 'ContadorCtrl.php', 'conteoDatos').then((data) => {
                if (data.state) {
                    var chart = $scope.myChart;
                    if (chart) {
                        chart.destroy();
                    }
                    $scope.contador = data.data
                    let modulo = [];
                    let fecha = [];
                    let cantidad = [];
                    $scope.contador.forEach(function (item) {
                        modulo.push(item.Modulo);
                        fecha.push(item.Fecha);
                        cantidad.push(item.Contador);
                    });

                    var ctx = document.getElementById('myChart').getContext('2d');
                    $scope.myChart = new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: modulo,
                            datasets: [{
                                label: '# Consultas',
                                data: cantidad,
                                backgroundColor: [
                                    'rgba(255, 99, 132, 0.2)',
                                    'rgba(54, 162, 235, 0.2)',
                                    'rgba(255, 206, 86, 0.2)',
                                    'rgba(75, 192, 192, 0.2)',
                                    'rgba(153, 102, 255, 0.2)',
                                    'rgba(255, 159, 64, 0.2)'
                                ],
                                borderColor: [
                                    'rgba(255, 99, 132, 1)',
                                    'rgba(54, 162, 235, 1)',
                                    'rgba(255, 206, 86, 1)',
                                    'rgba(75, 192, 192, 1)',
                                    'rgba(153, 102, 255, 1)',
                                    'rgba(255, 159, 64, 1)'
                                ],
                                borderWidth: 1
                            }]
                        },
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            }
                        }
                    })
                } else {
                    Swal({
                        type: 'error',
                        title: 'Oppss..',
                        text: data.msj,
                        timer: 4000
                    })
                }
            })
        }


        $scope.buscarRegistros = (data) => {
            if (!data) {
                Swal({
                    type: 'error',
                    title: 'Oppss..',
                    text: 'Seleccione una fecha',
                    timer: 4000
                })
                return;
            }

            datos(data);
        }
    }
})();
