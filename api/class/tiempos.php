<?php

require_once 'conection.php';
error_reporting(E_ALL);
ini_set('display_errors', 1);

class tiempos
{
    private $_DB;

    public function __construct()
    {
        $this->_DB = new Conection();
    }

    public function todosTiempos($data)
    {
        try {

            $condicion = '';
            if (!empty($data)) {
                $today          = $data['fechafin'];
                $fecha_anterior = $data['fechaini'];
            } else {
                $today          = date("Y-m-d");
                $fecha_anterior = date("Y-m-d", strtotime($today . "- 30 days"));
            }

            $condicion = " AND horagestion BETWEEN '$fecha_anterior' AND '$today' ";

            if (isset($data['producto'])) {
                switch ($data['producto']) {
                    case 'Internet+Toip':
                        $condicion .= " AND producto in ('Internet+Toip','ToIP','Internet')";
                        break;
                    case 'TV':
                        $condicion .= " AND producto = 'TV'";
                        break;
                    default:
                        $condicion .= " ";
                }
            }

            $stmt1 = $this->_DB->query("SELECT DATE(horagestion) AS fecha,
                                                               SUBSTRING_INDEX(SEC_TO_TIME(AVG(TIME_TO_SEC(TIMEDIFF(fechaClickMarca, horagestion)))), '.', 1) AS promedio
                                                        FROM contingencias
                                                        WHERE 1 = 1 $condicion
                                                        GROUP BY fecha");
            $stmt1->execute();
            $tiempoCola = $stmt1->fetchAll(PDO::FETCH_ASSOC);

            $stmt2 = $this->_DB->query("SELECT DATE(horagestion) AS fecha,
                                                               SUBSTRING_INDEX(SEC_TO_TIME(AVG(TIME_TO_SEC(TIMEDIFF(fechaClickMarca, horacontingencia)))), '.', 1) AS promedio
                                                        FROM contingencias
                                                        WHERE 1 = 1 $condicion
                                                        GROUP BY fecha");
            $stmt2->execute();
            $tiempoAtencion = $stmt2->fetchAll(PDO::FETCH_ASSOC);

            $stmt3 = $this->_DB->query("SELECT DATE(horagestion) AS fecha,
                                                               SUBSTRING_INDEX(SEC_TO_TIME(AVG(TIME_TO_SEC(TIMEDIFF(horagestion, horacontingencia)))), '.', 1) AS promedio
                                                        FROM contingencias
                                                        WHERE 1 = 1 $condicion
                                                        GROUP BY fecha");
            $stmt3->execute();
            $tiempoSistema = $stmt3->fetchAll(PDO::FETCH_ASSOC);

            $response = [$tiempoCola, $tiempoAtencion, $tiempoSistema];

        } catch (PDOException $e) {
            var_dump($e);
        }
        $this->_DB = '';
        echo json_encode($response);
    }

    public function tiempoAtencion($data)
    {
        try {
            if (!empty($data)) {
                $today          = $data['fechafin'];
                $fecha_anterior = $data['fechaini'];
            } else {
                $today          = date("Y-m-d");
                $fecha_anterior = date("Y-m-d", strtotime($today . "- 30 days"));
            }

            $stmt = $this->_DB->query("SELECT DATE(horagestion) AS fecha,
                                                               SUBSTRING_INDEX(SEC_TO_TIME(AVG(TIME_TO_SEC(TIMEDIFF(fechaClickMarca, horacontingencia)))), '.', 1) AS promedio
                                                        FROM contingencias
                                                        WHERE horagestion BETWEEN '$fecha_anterior' AND '$today'
                                                        GROUP BY fecha");
            $stmt->execute();
            if ($stmt->rowCount()) {
                $response = ['status' => 1, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)];
            } else {
                $response = ['status' => 0, 'msj' => 'No se encontraron registros'];
            }
        } catch (PDOException $e) {
            var_dump($e);
        }
        $this->_DB = '';
        echo json_encode($response);
    }

    public function tiempoSistema($data)
    {
        try {
            if (!empty($data)) {
                $today          = $data['fechafin'];
                $fecha_anterior = $data['fechaini'];
            } else {
                $today          = date("Y-m-d");
                $fecha_anterior = date("Y-m-d", strtotime($today . "- 30 days"));
            }

            $stmt = $this->_DB->query("SELECT DATE(horagestion) AS fecha,
                                                               SUBSTRING_INDEX(SEC_TO_TIME(AVG(TIME_TO_SEC(TIMEDIFF(horagestion, horacontingencia)))), '.', 1) AS promedio
                                                        FROM contingencias
                                                        WHERE horagestion BETWEEN '$fecha_anterior' AND '$today'
                                                        GROUP BY fecha");
            $stmt->execute();
            if ($stmt->rowCount()) {
                $response = ['status' => 1, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)];
            } else {
                $response = ['status' => 0, 'msj' => 'No se encontraron registros'];
            }
        } catch (PDOException $e) {
            var_dump($e);
        }
        $this->_DB = '';
        echo json_encode($response);
    }
}
