<?php

require_once '../class/conection.php';

class ModelContingencia
{
    private $_DB;

    public function __construct()
    {
        $this->_DB = new Conection();
    }

    public function resultado($fechaIni, $fechaFin)
    {
        try {
            $stmt = $this->_DB->query("SELECT logindepacho, pedido, horagestion, logincontingencia, horacontingencia,
		(CASE 
			WHEN acepta IS NULL THEN 'Pendiente' 
			ELSE acepta 
		END) estado
		FROM contingencias
		WHERE horagestion BETWEEN ('$fechaIni 00:00:00') AND ('$fechaFin 23:59:59')
		AND accion IN ('Cambio de equipo', 'Contingencia', 'Refresh', 'Registros ToIP', 'Reenvio de registros')
		AND pedido <> ''
		ORDER BY horagestion DESC");

            $stmt->execute();
            if ($stmt->rowCount()) {
                $response = $stmt->fetchAll(PDO::FETCH_ASSOC);
            } else {
                $response = 0;
            }

        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }

        return $response;

    }

    public function queryTv($fechaIni, $fechaFin)
    {
        try {
            $stmt = $this->_DB->prepare("SELECT logindepacho, pedido, horagestion, logincontingencia, horacontingencia,
				(CASE
					WHEN acepta IS NULL THEN 'Pendiente'
				ELSE acepta END) estado
			FROM contingencias
			WHERE horagestion BETWEEN ('$fechaIni 00:00:00') AND ('$fechaFin 23:59:59')
			AND producto = 'TV'
			AND accion IN ('Cambio de equipo', 'Contingencia', 'Refresh', 'Registros ToIP', 'Reenvio de registros')
			AND pedido <> ''
			ORDER BY horagestion DESC");

            $stmt->execute();

            if ($stmt->rowCount()) {
                $response = $stmt->fetchAll(PDO::FETCH_ASSOC);
            } else {
                $response = 0;
            }

        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }

        return $response;

    }

    public function resultadoInTo($fechaIni, $fechaFin)
    {
        try {
            $stmt = $this->_DB->prepare("SELECT logindepacho, pedido, horagestion, logincontingencia, horacontingencia,
							(CASE
								WHEN acepta IS NULL THEN 'Pendiente'
							ELSE acepta END) estado
						FROM contingencias
						WHERE horagestion BETWEEN ('$fechaIni 00:00:00') AND ('$fechaFin 23:59:59')
						AND producto IN('ToIP', 'Internet+ToIP', 'Internet')
						AND accion IN ('Cambio de equipo', 'Contingencia', 'Refresh', 'Registros ToIP', 'Reenvio de registros')
						AND pedido <> ''
						ORDER BY horagestion DESC");

            $stmt->execute();
            if ($stmt->rowCount()) {
                $response = $stmt->fetchAll(PDO::FETCH_ASSOC);
            } else {
                $response = 0;
            }

        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }

        return $response;

    }

    public function resultadoCP($fechaIni, $fechaFin)
    {
        try {
            $stmt = $this->_DB->prepare("SELECT logindepacho, pedido, horagestion, loginContingenciaPortafolio, horaContingenciaPortafolio,
							(CASE
								WHEN aceptaPortafolio = 'Acepta' THEN 'Acepta'
								WHEN aceptaPortafolio = 'Rechaza' THEN 'Rechaza'
								WHEN aceptaPortafolio IS NULL THEN 'Pendiente'
							ELSE aceptaPortafolio = 'Acepta' END) estado
						FROM contingencias
						WHERE horagestion BETWEEN ('$fechaIni 00:00:00') AND ('$fechaFin 23:59:59')
						AND accion IN ('Corregir portafolio', 'mesaOffline')
						AND pedido <> ''
						ORDER BY horagestion DESC");

            $stmt->execute();
            if ($stmt->rowCount()) {
                $response = $stmt->fetchAll(PDO::FETCH_ASSOC);
            } else {
                $response = 0;
            }

        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }

        return $response;
    }

    public function querydiario($diaInicial, $diaFinal)
    {
        try {
            $stmt = $this->_DB->prepare("SELECT DATE_FORMAT(horagestion,'%Y-%m-%d') fecha, COUNT(*) total
		FROM contingencias
		WHERE horagestion BETWEEN ('$diaInicial 00:00:00') AND ('$diaFinal 23:59:59')
		AND accion IN ('Cambio de equipo', 'Contingencia', 'Refresh', 'Registros ToIP', 'Reenvio de registros')
		AND pedido <> ''
		GROUP BY fecha
		ORDER BY fecha DESC");

            $stmt->execute();
            if ($stmt->rowCount()) {
                $response = $stmt->fetchAll(PDO::FETCH_ASSOC);
            } else {
                $response = 0;
            }

        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }

        return $response;
    }

    public function resultadodiarioCP($diaInicial, $diaFinal)
    {
        try {
            $stmt = $this->_DB->prepare("SELECT date_format(horagestion,'%Y-%m-%d') fecha, COUNT(*) total
		FROM contingencias
		WHERE horagestion BETWEEN ('$diaInicial 00:00:00') AND ('$diaFinal 23:59:59')
		AND accion IN ('Corregir portafolio', 'mesaOffline')
		AND pedido <> ''
		GROUP BY fecha
		ORDER BY fecha DESC");

            $stmt->execute();
            if ($stmt->rowCount()) {
                $response = $stmt->fetchAll(PDO::FETCH_ASSOC);
            } else {
                $response = 0;
            }

        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }

        return $response;
    }

    public function resultadoestadosMes($diaInicial, $diaFinal)
    {
        try {
            $stmt = $this->_DB->prepare("SELECT (CASE 
		WHEN acepta IS NULL THEN 'Pendiente' 
		ELSE acepta 
		END) estado, 
		COUNT(*) total,
		(SELECT COUNT(*)
			FROM contingencias C2
			WHERE horagestion BETWEEN ('$diaInicial 00:00:00') AND ('$diaFinal 23:59:59')
			AND C2.accion IN ('Cambio de equipo', 'Contingencia', 'Refresh', 'Registros ToIP', 'Reenvio de registros')
		) totalestados
		FROM contingencias AS C1
		WHERE horagestion BETWEEN ('$diaInicial 00:00:00') AND ('$diaFinal 23:59:59')
		AND pedido <> ''
		AND C1.accion IN ('Cambio de equipo', 'Contingencia', 'Refresh', 'Registros ToIP', 'Reenvio de registros')
		GROUP BY estado
		ORDER BY total DESC");

            $stmt->execute();
            if ($stmt->rowCount()) {
                $response = $stmt->fetchAll(PDO::FETCH_ASSOC);
            } else {
                $response = 0;
            }

        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }

        return $response;
    }

    public function datoscontingencias()
    {
        try {
            $stmt = $this->_DB->query("SELECT c.pedido, c.macEntra, c.macSale, c.logincontingencia, c.paquetes, c.ciudad, c.proceso, c.accion, c.tipoEquipo, c.remite, c.observacion, 
					c.engestion, c.producto, c.grupo, c.horagestion, c.perfil, c.tipificacion, c.acepta, c.loginContingenciaPortafolio, c.aceptaPortafolio, 
					c.tipificacionPortafolio, c.enGestionPortafolio, c.fechaClickMarcaPortafolio, c.id_terreno, CASE WHEN (SELECT COUNT(*)
					FROM contingencias c1
					WHERE c1.pedido=c.pedido AND c1.horagestion >= DATE_SUB(CURDATE(), INTERVAL 10 DAY) AND c1.finalizado = 'OK') > 0 THEN 'TRUE' ELSE 'FALSE' END alerta
				FROM contingencias c
				WHERE c.finalizado IS NULL AND c.finalizadoPortafolio IS NULL AND c.pedido <> ''
				ORDER BY c.horagestion");
            $stmt->execute();


            if ($stmt->rowCount()) {
                $resultadoTV         = [];
                $resultadoOTROS      = [];
                $resultadoPORTAFOLIO = [];
                while ($row = $stmt->fetchAll(PDO::FETCH_ASSOC)) {

                    echo $row['grupo'];exit();

                    $row['pedido']                      = utf8_encode($row['pedido']);
                    $row['macEntra']                    = utf8_encode($row['macEntra']);
                    $row['macSale']                     = utf8_encode($row['macSale']);
                    $row['paquetes']                    = utf8_encode($row['paquetes']);
                    $row['ciudad']                      = utf8_encode($row['ciudad']);
                    $row['proceso']                     = utf8_encode($row['proceso']);
                    $row['accion']                      = utf8_encode($row['accion']);
                    $row['tipoEquipo']                  = utf8_encode($row['tipoEquipo']);
                    $row['remite']                      = utf8_encode($row['remite']);
                    $row['observacion']                 = utf8_encode($row['observacion']);
                    $row['engestion']                   = utf8_encode($row['engestion']);
                    $row['producto']                    = utf8_encode($row['producto']);
                    $row['grupo']                       = utf8_encode($row['grupo']);
                    $row['horagestion']                 = utf8_encode($row['horagestion']);
                    $row['perfil']                      = utf8_encode($row['perfil']);
                    $row['acepta']                      = utf8_encode($row['acepta']);
                    $row['loginContingenciaPortafolio'] = utf8_encode($row['loginContingenciaPortafolio']);
                    $row['aceptaPortafolio']            = utf8_encode($row['aceptaPortafolio']);
                    $row['tipificacionPortafolio']      = utf8_encode($row['tipificacionPortafolio']);
                    $row['enGestionPortafolio']         = utf8_encode($row['enGestionPortafolio']);
                    $row['fechaClickMarcaPortafolio']   = utf8_encode($row['fechaClickMarcaPortafolio']);
                    $row['alerta']                      = utf8_encode($row['alerta']);

                    if ($row['grupo'] == "TV") {
                        $resultadoTV[] = $row;
                    } elseif ($row['grupo'] == "INTER") {
                        $resultadoOTROS[] = $row;
                    } elseif ($row['grupo'] == "PORTAFOLIO") {
                        $resultadoPORTAFOLIO[] = $row;
                    }
                }
            }

            var_dump($resultadoOTROS);
            exit();

        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }

        return [$resultadoTV, $resultadoOTROS, $resultadoPORTAFOLIO];
    }
}
