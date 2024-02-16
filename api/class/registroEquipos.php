<?php
require_once '../class/conection.php';

/*error_reporting(E_ALL);
ini_set('display_errors', 1);*/

class RegistroEquipos
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


            if (isset($data['fecha'])) {
                $fechaini = $data['fecha']['fechaini'];
                $fechafin = $data['fecha']['fechafin'];
            } else {
                $fechaini = date('Y-m-d');
                $fechafin = date('Y-m-d');
            }

            $condicion = '';
            $limit = " LIMIT $offset, $pagesize ";
            if (isset($data['buscar'])) {
                $buscar = $data['buscar'];
                $condicion = " and re.pedido = '$buscar' ";
                $limit = '';
            }

            $stmt = $this->_DB->query("SELECT
                                                    COUNT(*) counter
                                                FROM
                                                    (
                                                    SELECT
                                                        re.fecha_ingreso,
                                                        re.tecnico 
                                                    FROM
                                                        registro_equipo re 
                                                    WHERE
                                                        1 = 1 
                                                        AND re.fecha_ingreso BETWEEN '$fechaini 00:00:00' 
                                                        AND '$fechafin 23:59:59'  $condicion
                                                    GROUP BY
                                                        re.fecha_ingreso,
                                                    re.tecnico 
                                                    ) c");
            $stmt->execute();
            $res = $stmt->fetch(PDO::FETCH_OBJ);
            $count = $res->counter;

            $stmt = $this->_DB->query("SELECT
                                                        *
                                                    FROM (
                                                        SELECT
                                                            MAX(re.id) AS id,
                                                            MAX(re.pedido) AS pedido,
                                                            re.tecnico,
                                                            MAX(re.direccion) AS direccion,
                                                            MAX(re.municipio) AS municipio,
                                                            MAX(re.gis) AS gis,
                                                            GROUP_CONCAT(re.mac_entra SEPARATOR ' - ') AS mac_entra,
                                                            MAX(re.observacion) AS observacion,
                                                            MAX(re.cliente) AS cliente,
                                                            re.fecha_ingreso,
                                                            MAX(re.cc_tecnico) AS cc_tecnico
                                                        FROM
                                                            registro_equipo re
                                                        WHERE 1 = 1
                                                            AND re.fecha_ingreso BETWEEN '$fechaini 00:00:00' 
                                                            AND '$fechafin 23:59:59' $condicion
                                                        GROUP BY
                                                            re.fecha_ingreso,
                                                            re.tecnico
                                                    ) sub
                                                    ORDER BY
                                                        fecha_ingreso DESC $limit");


            //$stmt = $this->_DB->query("SELECT * FROM registro_equipo WHERE 1=1 $condicion ORDER BY fecha_ingreso DESC LIMIT $offset, $pagesize");
            $stmt->execute();
            if ($stmt->rowCount()) {
                $response = array('state' => 1, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC), 'counter' => $count);
            } else {
                $response = array('state' => 0, 'msj' => 'No se encontraron registros');
            }

            $this->_DB = '';
            return $response;
        } catch (PDOException $th) {
            var_dump($th->getMessage());
        }
    }

    public function csvRegistroEquipos($data)
    {
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
