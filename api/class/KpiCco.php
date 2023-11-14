<?php
require_once 'conection.php';

class KpiCco
{
    private $_DB;

    public function __construct()
    {
        $this->_DB = new Conection();
    }

    public function chartContingencia($data)
    {
        try {
            if (!empty($data)) {
                $fecha = $data;
            }else{
                $fecha = date('Y-m-d');
            }
            $stmt = $this->_DB->prepare("SELECT
                                                    HOUR(horagestion) AS hora,
                                                    SEC_TO_TIME(AVG(TIME_TO_SEC(TIMEDIFF(fechaClickMarca, horagestion))) ) AS ASA,
                                                        SUBSTRING_INDEX(SEC_TO_TIME(AVG(TIME_TO_SEC(TIMEDIFF(horacontingencia, fechaClickMarca)))), '.', 1) AS AHT,
                                                        -- SUBSTRING_INDEX(SEC_TO_TIME(AVG(TIME_TO_SEC(TIMEDIFF(horagestion, horacontingencia)))), '.', 1) AS promedio3,
                                                        COUNT(producto) AS cantidad
                                                FROM
                                                    contingencias
                                                WHERE
                                                    1 = 1
                                                        AND horagestion BETWEEN '$fecha 00:00:00' AND '$fecha 23:59:59'
                                                    AND HOUR(horagestion) BETWEEN 7 AND 20
                                                GROUP BY
                                                    hora
                                                ORDER BY
                                                    hora ASC;");
            $stmt->execute();
            if ($stmt->rowCount()) {
                $response = ['status' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)];
            } else {
                $response = ['status' => true, 'data' => '0'];
            }
            $this->_DB = null;
            return $response;
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
    }

    public function chartToip($data)
    {
        try {
            if (!empty($data)) {
                $fecha = $data['fecha'];
            }else{
                $fecha = date('Y-m-d');
            }
            $stmt = $this->_DB->prepare("SELECT
                                                    HOUR(hora_ingreso) AS hora,
                                                    SEC_TO_TIME(AVG(TIME_TO_SEC(TIMEDIFF(hora_marca, hora_ingreso))) ) AS ASA,
                                                        SUBSTRING_INDEX(SEC_TO_TIME(AVG(TIME_TO_SEC(TIMEDIFF(hora_gestion, hora_marca)))), '.', 1) AS AHT,
                                                        -- SUBSTRING_INDEX(SEC_TO_TIME(AVG(TIME_TO_SEC(TIMEDIFF(hora_ingreso, hora_gestion)))), '.', 1) AS promedio3,
                                                        COUNT(tarea) AS cantidad
                                                FROM
                                                    activacion_toip
                                                WHERE
                                                    1 = 1
                                                        AND hora_ingreso BETWEEN '$fecha 00:00:00' AND '$fecha 23:59:59'
                                                    AND HOUR(hora_ingreso) BETWEEN 7 AND 20
                                                GROUP BY
                                                    hora
                                                ORDER BY
                                                    hora ASC;");
            $stmt->execute();
            if ($stmt->rowCount()) {
                $response = ['status' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)];
            } else {
                $response = ['status' => true, 'data' => '0'];
            }
            $this->_DB = null;
            return $response;
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
    }

    public function chartEtp($data)
    {
        try {
            if (!empty($data)) {
                $fecha = $data['fecha'];
            }else{
                $fecha = date('Y-m-d');
            }
            $stmt = $this->_DB->prepare("SELECT
                                                    HOUR(fecha_crea) AS hora,
                                                    SEC_TO_TIME(AVG(TIME_TO_SEC(TIMEDIFF(fecha_marca, fecha_crea))) ) AS ASA,
                                                        SUBSTRING_INDEX(SEC_TO_TIME(AVG(TIME_TO_SEC(TIMEDIFF(fecha_gestion, fecha_marca)))), '.', 1) AS AHT,
                                                        -- SUBSTRING_INDEX(SEC_TO_TIME(AVG(TIME_TO_SEC(TIMEDIFF(fecha_crea, fecha_gestion)))), '.', 1) AS promedio3,
                                                        COUNT(tarea) AS cantidad
                                                FROM
                                                    etp
                                                WHERE
                                                    1 = 1
                                                        AND fecha_crea BETWEEN '$fecha 00:00:00' AND '$fecha 23:59:59'
                                                    AND HOUR(fecha_crea) BETWEEN 7 AND 20
                                                GROUP BY
                                                    hora
                                                ORDER BY
                                                    hora ASC;");
            $stmt->execute();
            if ($stmt->rowCount()) {
                $response = ['status' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)];
            } else {
                $response = ['status' => true, 'data' => '0'];
            }
            $this->_DB = null;
            return $response;
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
    }

    public function chartGpon($data)
    {
        try {
            if (!empty($data)) {
                $fecha = $data['fecha'];
            }else{
                $fecha = date('Y-m-d');
            }
            $stmt = $this->_DB->prepare("SELECT
                                                    HOUR(fecha_creado) AS hora,
                                                    SEC_TO_TIME(AVG(TIME_TO_SEC(TIMEDIFF(fecha_marca, fecha_creado))) ) AS ASA,
                                                        SUBSTRING_INDEX(SEC_TO_TIME(AVG(TIME_TO_SEC(TIMEDIFF(fecha_respuesta, fecha_marca)))), '.', 1) AS AHT,
                                                        -- SUBSTRING_INDEX(SEC_TO_TIME(AVG(TIME_TO_SEC(TIMEDIFF(fecha_marca, fecha_respuesta)))), '.', 1) AS promedio3,
                                                        COUNT(tarea) AS cantidad
                                                FROM
                                                    soporte_gpon
                                                WHERE
                                                    1 = 1
                                                        AND fecha_creado BETWEEN '$fecha 00:00:00' AND '$fecha 23:59:59'
                                                    AND HOUR(fecha_creado) BETWEEN 7 AND 20
                                                GROUP BY
                                                    hora
                                                ORDER BY
                                                    hora ASC;");
            $stmt->execute();
            if ($stmt->rowCount()) {
                $response = ['status' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)];
            } else {
                $response = ['status' => true, 'data' => '0'];
            }
            $this->_DB = null;
            return $response;
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
    }

    public function chartValidacion($data)
    {
        try {
            if (!empty($data)) {
                $fecha = $data['fecha'];
            }else{
                $fecha = date('Y-m-d');
            }
            $stmt = $this->_DB->prepare("SELECT
                                                    HOUR(hora_ingreso) AS hora,
                                                    SEC_TO_TIME(AVG(TIME_TO_SEC(TIMEDIFF(hora_marca, hora_ingreso))) ) AS ASA,
                                                        SUBSTRING_INDEX(SEC_TO_TIME(AVG(TIME_TO_SEC(TIMEDIFF(hora_gestion, hora_marca)))), '.', 1) AS AHT,
                                                        -- SUBSTRING_INDEX(SEC_TO_TIME(AVG(TIME_TO_SEC(TIMEDIFF(fecha_marca, fecha_respuesta)))), '.', 1) AS promedio3,
                                                        COUNT(tarea) AS cantidad
                                                FROM
                                                    mesas_nacionales
                                                WHERE
                                                    1 = 1
                                                        AND hora_ingreso BETWEEN '$fecha 00:00:00' AND '$fecha 23:59:59'
                                                    AND HOUR(hora_ingreso) BETWEEN 7 AND 20
                                                AND mesa = 'Mesa 3'
                                                GROUP BY
                                                    hora
                                                ORDER BY
                                                    hora ASC;");
            $stmt->execute();
            if ($stmt->rowCount()) {
                $response = ['status' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)];
            } else {
                $response = ['status' => true, 'data' => '0'];
            }
            $this->_DB = null;
            return $response;
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
    }

    public function chartEmt($data)
    {
        try {
            if (!empty($data)) {
                $fecha = $data['fecha'];
            }else{
                $fecha = date('Y-m-d');
            }
            $stmt = $this->_DB->prepare("SELECT
                                                    HOUR(hora_ingreso) AS hora,
                                                    SEC_TO_TIME(AVG(TIME_TO_SEC(TIMEDIFF(hora_marca, hora_ingreso))) ) AS ASA,
                                                        SUBSTRING_INDEX(SEC_TO_TIME(AVG(TIME_TO_SEC(TIMEDIFF(hora_gestion, hora_marca)))), '.', 1) AS AHT,
                                                        -- SUBSTRING_INDEX(SEC_TO_TIME(AVG(TIME_TO_SEC(TIMEDIFF(fecha_marca, fecha_respuesta)))), '.', 1) AS promedio3,
                                                        COUNT(tarea) AS cantidad
                                                FROM
                                                    mesas_nacionales
                                                WHERE
                                                    1 = 1
                                                        AND hora_ingreso BETWEEN '$fecha 00:00:00' AND '$fecha 23:59:59'
                                                    AND HOUR(hora_ingreso) BETWEEN 7 AND 20
                                                AND mesa = 'Mesa 1'
                                                GROUP BY
                                                    hora
                                                ORDER BY
                                                    hora ASC;");
            $stmt->execute();
            if ($stmt->rowCount()) {
                $response = ['status' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)];
            } else {
                $response = ['status' => true, 'data' => '0'];
            }
            $this->_DB = null;
            return $response;
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
    }

}