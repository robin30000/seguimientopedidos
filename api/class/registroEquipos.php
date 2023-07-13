<?php
require_once '../class/conection.php';

class registroEquipos
{
    private $_DB;

    public function __construct()
    {
        $this->_DB = new Conection();
    }

    public function registroEquipos($data)
    {

        try {

            $pagenum = $data['page'];
            $pagesize = $data['size'];
            $offset = ($pagenum - 1) * $pagesize;
            $search = $data['search'];

            $condicion = '';
            if (!empty($data['fecha'])) {
                $fechaini = $data['fecha']['fechaini'];
                $fechafin = $data['fecha']['fechafin'];
                $condicion = " AND fecha_ingreso BETWEEN '$fechaini 00:00:00' AND '$fechafin 23:59:59' ";
            } else {
                $fechaini = date('Y-m-d');
                $fechafin = date('Y-m-d');
                $condicion = " AND fecha_ingreso BETWEEN '$fechaini 00:00:00' AND '$fechafin 23:59:59' ";
            }

            if (!empty($data['buscar'])) {
                $buscar = $data['buscar'];
                $condicion .= " and pedido = '$buscar' ";
            }

            $stmt = $this->_DB->query("SELECT * FROM registro_equipo WHERE 1=1 $condicion");
            $stmt->execute();
            $count = $stmt->rowCount();

            $stmt = $this->_DB->query("SELECT * FROM registro_equipo WHERE 1=1 $condicion ORDER BY fecha_ingreso DESC LIMIT $offset, $pagesize");
            $stmt->execute();
            if ($stmt->rowCount()) {
                $response = array('state' => 1, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC), 'counter' => $count);
            } else {
                $response = array('state' => 0, 'msj' => 'No se encontraron registros');
            }
        } catch (PDOException $th) {
            var_dump($th->getMessage());
        }

        $this->_DB = '';
        echo json_encode($response);
    }

    public function csvRegistroEquipos($data){
        try {
            $condicion = '';

			if (!empty($data['fecha'])) {
				$fechaIni = $data['fecha']['fechaini'];
				$fechaFin = $data['fecha']['fechafin'];
				$condicion = " AND fecha_ingreso BETWEEN '$fechaIni 00:00:00' and '$fechaFin 23:59:59'  ";
			}

			$stmt = $this->_DB->query("SELECT
                                            tecnico,
                                            cc_tecnico,
                                            observacion,
                                            fecha_ingreso,
                                            mac_entra,
                                            pedido,
                                            cliente,
                                            municipio,
                                            gis,
                                            direccion
                                        FROM
                                            registro_equipo
                                        WHERE 1 = 1 $condicion 
                                        ORDER BY fecha_ingreso DESC");
			$stmt->execute();
			if ($stmt->rowCount()) {
				$response = array('state' => 1, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC));
			} else {
				$response = array('state' => 0, 'data' => 'No se encontraron datos');
			}
        } catch (PDOException $th) {
            var_dump($th->getMessage());
        }

        $this->_DB = '';
        echo json_encode($response);
    }

}
