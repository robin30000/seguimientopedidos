<?php
require_once '../class/conection.php';

class modelQuejasGo
{
    private $_DB;

    public function __construct()
    {
        $this->_DB = new Conection();
    }

    public function listaQuejasGoDia($data)
    {

        try {
            $page            = $data->page;
            $datos           = $data->datos;
            $fechaini        = $datos['fechaini'];
            $fechafin        = $datos['fechafin'];
            $columnaBusqueda = $datos['columnaBusqueda'];
            $valorBusqueda   = $datos ['valorBusqueda'];


            if ($fechaini == "" || $fechafin == "") {
                $fechaini = date('Y-m-d');
                $fechafin = date('Y-m-d');
            }

            if ($page == "undefined") {
                $page = "0";
            } else {
                $page = $page - 1;
            }

            $page = $page * 100;

            if ($columnaBusqueda == "" || $valorBusqueda == "") {

                $stmt = $this->_DB->prepare("SELECT id, pedido, cliente, cedtecnico, tecnico, accion, asesor, fecha, duracion, region, idllamada, observacion
							FROM quejasgo
							WHERE 1=1
							AND fecha BETWEEN (:fechaini) AND (:fechafin) 
							ORDER BY fecha DESC
							limit 100");

                $stmt->execute([':fechaini' => "$fechaini 00:00:00", ':fechafin' => "$fechafin 23-59-59"]);

            } else {

                $stmt = $this->_DB->prepare("	SELECT id, pedido, cliente, cedtecnico, tecnico, accion, asesor, fecha, duracion, region, idllamada, observacion
								FROM quejasgo
									WHERE 1=1
									AND fecha BETWEEN (:fechaini) AND (:fechafin) AND :columnaBusqueda = :valorBusqueda
									ORDER BY fecha DESC
									limit 100 offset :page
						");
                $stmt->execute([
                    ':fechaini'        => "$fechaini 00:00:00",
                    ':fechafin'        => "$fechafin 23-59-59",
                    ':columnaBusqueda' => $columnaBusqueda,
                    ':valorBusqueda'   => $valorBusqueda,
                    ':page'            => $page,
                ]);

            }

            //Dado el total, contra el numumero de paginas
            if ($stmt->rowCount()) {

                $counter      = $stmt->rowCount();
                $totalPaginas = $counter / 100;
                $totalPaginas = ceil($totalPaginas); //redondear al siguiente

                $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);

                $response = ['data' => $resultado, 'contador' => $counter, 'totalPagina' => $totalPaginas, 201];

            } else {

                $response = 0;
            }

        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_BD = null;

        echo json_encode($response);

    }
}