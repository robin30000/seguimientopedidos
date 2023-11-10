<?php
require_once 'conection.php';

echo 100;exit;

class ApiGraficoCco
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
                                                        SUBSTRING_INDEX(SEC_TO_TIME(AVG(TIME_TO_SEC(TIMEDIFF(fechaClickMarca, horacontingencia)))), '.', 1) AS AHT,
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
                $response = ['status' => false, 'msj' => 'No se encontraron registros'];
            }
            $this->_DB = null;
            return $response;
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
    }

	public function activacionToip()
	{
		try {
			$fecha = date('Y-m-d');
			$stmt = $this->_DB->prepare("SELECT * FROM activacion_toip WHERE hora_ingreso BETWEEN '$fecha 00:00:00' AND '$fecha 23:59:59'");
			$stmt->execute();
			if ($stmt->rowCount()) {
				$response = array('state' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC));
			} else {
				$response = array('state' => false, 'msj' => 'No se encontraron datos');
			}
			$this->_DB = null;
			return $response;
		} catch (PDOException $e) {
			var_dump($e->getMessage());
		}
	}

	public function mesasNacionales($data)
	{
		try {
			$fecha = date('Y-m-d');
			$mesa = $data;
			$stmt = $this->_DB->prepare("SELECT * FROM mesas_nacionales WHERE hora_ingreso BETWEEN '$fecha 00:00:00' AND '$fecha 23:59:59' AND mesa = '$mesa'");
			$stmt->execute();
			if ($stmt->rowCount()) {
				$response = array('state' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC));
			} else {
				$response = array('state' => false, 'msj' => 'No se encontraron datos');
			}
			$this->_DB = null;
			return $response;
		}catch (PDOException $e){
			var_dump($e->getMessage());
		}
	}

	public function gestionEtp(){
		try {
			$fecha = date('Y-m-d');
			$stmt = $this->_DB->prepare("SELECT * FROM etp WHERE fecha_crea BETWEEN '$fecha 00:00:00' AND '$fecha 23:59:59'");
			$stmt->execute();
			if ($stmt->rowCount()) {
				$response = array('state' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC));
			} else {
				$response = array('state' => false, 'msj' => 'No se encontraron datos');
			}
			$this->_DB = null;
			return $response;
		}catch (PDOException $e){
			var_dump($e->getMessage());
		}
	}

	public function registroSoporteGpon(){
		try {
			$fecha = date('Y-m-d');
			$stmt = $this->_DB->prepare("SELECT *
                    FROM soporte_gpon 
                    WHERE fecha_creado BETWEEN '$fecha 00:00:00' AND '$fecha 23:59:59'
                    ORDER BY fecha_creado DESC;");
			$stmt->execute();
			if ($stmt->rowCount()) {
				$response = array('state' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC));
			} else {
				$response = array('state' => false, 'msj' => 'No se encontraron datos');
			}
			$this->_DB = null;
			return $response;
		}catch (PDOException $e){
			var_dump($e->getMessage());
		}
	}
}