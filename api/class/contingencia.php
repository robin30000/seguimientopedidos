<?php

require_once '../class/conection.php';
ini_set('display_errors', 0);
/* ini_set('session.gc_maxlifetime', 3600); // 1 hour
session_set_cookie_params(3600); */

class Contingencia
{
    private $_DB;

    public function __construct()
    {
        $this->_DB = new Conection();
    }

    public function resumencontingencias($data)
    {
        try {

            ini_set('session.gc_maxlifetime', 3600); // 1 hour
            session_set_cookie_params(3600);
            session_start();

            $pagenum = $data['page'];
            $pagesize = $data['size'];
            $offset = ($pagenum - 1) * $pagesize;
            $search = $data['search'];
            if (!empty($data['fecha'])) {
                $fechaIni = $data['fecha']['fechaini'];
                $fechaFin = $data['fecha']['fechafin'];
            } else {
                $fechaIni = date('Y-m-d');
                $fechaFin = date('Y-m-d');
            }


            $month = date('m', strtotime($fechaIni));
            $year = date('Y', strtotime($fechaIni));
            $day = date("d", mktime(0, 0, 0, $month + 1, 0, $year));

            $diaFinal = date('Y-m-d', mktime(0, 0, 0, $month, $day, $year));
            $diaInicial = date('Y-m-d', mktime(0, 0, 0, $month, 1, $year));

            $stmt = $this->_DB->prepare("SELECT count(*) counter
            FROM contingencias
            WHERE horagestion BETWEEN ('2023-06-07 00:00:00') AND ('2023-06-07 23:59:59')
            AND accion IN ('Cambio de equipo', 'Contingencia', 'Refresh', 'Registros ToIP', 'Reenvio de registros')
            AND pedido <> ''
            ORDER BY horagestion DESC");
            $stmt->execute();
            $counter = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $query = "SELECT logindepacho, pedido, horagestion, logincontingencia, horacontingencia,
		(CASE 
			WHEN acepta IS NULL THEN 'Pendiente' 
			ELSE acepta 
		END) estado
		FROM contingencias
		WHERE horagestion BETWEEN ('$fechaIni 00:00:00') AND ('$fechaFin 23:59:59')
		AND accion IN ('Cambio de equipo', 'Contingencia', 'Refresh', 'Registros ToIP', 'Reenvio de registros')
		AND pedido <> ''
		ORDER BY horagestion DESC limit $offset, $pagesize;";

            $rst = $this->_DB->query($query);
            $rst->execute();

            if ($rst->rowCount() > 0) {
                $resultado = $rst->fetchAll(PDO::FETCH_ASSOC);
            }

            $queryTV = ("SELECT logindepacho, pedido, horagestion, logincontingencia, horacontingencia,
				(CASE
					WHEN acepta IS NULL THEN 'Pendiente'
				ELSE acepta END) estado
			FROM contingencias
			WHERE horagestion BETWEEN ('$fechaIni 00:00:00') AND ('$fechaFin 23:59:59')
			AND producto = 'TV'
			AND accion IN ('Cambio de equipo', 'Contingencia', 'Refresh', 'Registros ToIP', 'Reenvio de registros')
			AND pedido <> ''
			ORDER BY horagestion DESC;
		");

            $rstTV = $this->_DB->query($queryTV);
            $rstTV->execute();

            if ($rstTV->rowCount() > 0) {
                $resultadoTV = $rstTV->fetchAll(PDO::FETCH_ASSOC);
            }

            $queryInTo = ("SELECT logindepacho, pedido, horagestion, logincontingencia, horacontingencia,
							(CASE
								WHEN acepta IS NULL THEN 'Pendiente'
							ELSE acepta END) estado
						FROM contingencias
						WHERE horagestion BETWEEN ('$fechaIni 00:00:00') AND ('$fechaFin 23:59:59')
						AND producto IN('ToIP', 'Internet+ToIP', 'Internet')
						AND accion IN ('Cambio de equipo', 'Contingencia', 'Refresh', 'Registros ToIP', 'Reenvio de registros')
						AND pedido <> ''
						ORDER BY horagestion DESC
					");

            $rstInTo = $this->_DB->query($queryInTo);
            $rstInTo->execute();
            if ($rstInTo->rowCount() > 0) {
                $resultadoInTo = $rstInTo->fetchAll(PDO::FETCH_ASSOC);
            }

            $queryCP = ("SELECT logindepacho, pedido, horagestion, loginContingenciaPortafolio, horaContingenciaPortafolio,
							(CASE
								WHEN aceptaPortafolio = 'Acepta' THEN 'Acepta'
								WHEN aceptaPortafolio = 'Rechaza' THEN 'Rechaza'
								WHEN aceptaPortafolio IS NULL THEN 'Pendiente'
							ELSE aceptaPortafolio = 'Acepta' END) estado
						FROM contingencias
						WHERE horagestion BETWEEN ('$fechaIni 00:00:00') AND ('$fechaFin 23:59:59')
						AND accion IN ('Corregir portafolio', 'mesaOffline')
						AND pedido <> ''
						ORDER BY horagestion DESC
					");

            $rstCP = $this->_DB->query($queryCP);
            $rstCP->execute();
            if ($rstCP->rowCount() > 0) {
                $resultadoCP = $rstCP->fetchAll(PDO::FETCH_ASSOC);
            }

            /* $querydiario = "select date_format(horagestion,'%Y-%m-%d') fecha, count(*) total " .
                "from contingencias " .
                "where horagestion between ('$diaInicial 00:00:00')   " .
                "and ('$diaFinal 23:59:59') " .
                "AND accion IN ('Cambio de equipo', 'Contingencia', 'Refresh', 'Registros ToIP', 'Reenvio de registros') " .
                "and pedido <> '' " .
                "group by fecha order by fecha DESC "; */

            $querydiario = "SELECT DATE_FORMAT(horagestion,'%Y-%m-%d') fecha, COUNT(*) total
		FROM contingencias
		WHERE horagestion BETWEEN ('$diaInicial 00:00:00') AND ('$diaFinal 23:59:59')
		AND accion IN ('Cambio de equipo', 'Contingencia', 'Refresh', 'Registros ToIP', 'Reenvio de registros')
		AND pedido <> ''
		GROUP BY fecha
		ORDER BY fecha DESC;";

            $rstdiario = $this->_DB->query($querydiario);
            $rstdiario->execute();
            if ($rstdiario->rowCount()) {
                $resultadodiario = $rstdiario->fetchAll(PDO::FETCH_ASSOC);
            }


            /* $querydiarioCP = "select date_format(horagestion,'%Y-%m-%d') fecha, count(*) total " .
                "from contingencias " .
                "where horagestion between ('$diaInicial 00:00:00')   " .
                "and ('$diaFinal 23:59:59') " .
                "AND accion IN ('Corregir portafolio', 'mesaOffline') " .
                "and pedido <> '' " .
                "group by fecha order by fecha DESC "; */

            $querydiarioCP = "SELECT date_format(horagestion,'%Y-%m-%d') fecha, COUNT(*) total
            FROM contingencias
            WHERE horagestion BETWEEN ('$diaInicial 00:00:00') AND ('$diaFinal 23:59:59')
            AND accion IN ('Corregir portafolio', 'mesaOffline')
            AND pedido <> ''
            GROUP BY fecha
            ORDER BY fecha DESC;";

            $rstdiarioCP = $this->_DB->query($querydiarioCP);
            $rstdiarioCP->execute();
            if ($rstdiarioCP->rowCount()) {
                $resultadodiarioCP = $rstdiarioCP->fetchAll(PDO::FETCH_ASSOC);
            }

            /*QUERY PARA EL CONTADOR DE TV Y INTERET*/
            $queryestadosMes = ("SELECT (CASE 
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
            ORDER BY total DESC;");

            $rstestadosMes = $this->_DB->query($queryestadosMes);
            $rstestadosMes->execute();
            if ($rstestadosMes->rowCount() > 0) {
                $resultadoestadosMes = $rstestadosMes->fetchAll(PDO::FETCH_ASSOC);
            }

            /*QUERY PARA EL CONTADOR DE CORREGOR PORTAFOLIO*/
            $queryestadosMesCP = ("SELECT (CASE
										WHEN C1.aceptaPortafolio = 'Acepta' THEN 'Acepta'
										WHEN C1.aceptaPortafolio = 'Rechaza' THEN 'Rechaza'
										WHEN C1.aceptaPortafolio IS NULL THEN 'Pendiente'
										ELSE C1.aceptaPortafolio = 'Acepta'
									END) estado, COUNT(*) total,
									(SELECT COUNT(*)
										FROM contingencias C2
										WHERE C2.horagestion BETWEEN ('$diaInicial 00:00:00') AND ('$diaFinal 23:59:59')
										AND C2.accion IN ('Corregir portafolio', 'mesaOffline')
										OR C2.horaContingenciaPortafolio BETWEEN ('$diaInicial 00:00:00') AND ('$diaFinal 23:59:59')
										AND C2.accion IN ('Corregir portafolio', 'mesaOffline')
									)totalestados
								FROM contingencias AS C1
								WHERE C1.horagestion BETWEEN ('$diaInicial 00:00:00') AND ('$diaFinal 23:59:59')
								AND C1.accion IN ('Corregir portafolio', 'mesaOffline')
								OR C1.horaContingenciaPortafolio BETWEEN ('$diaInicial 00:00:00') AND ('$diaFinal 23:59:59')
								AND C1.accion IN ('Corregir portafolio', 'mesaOffline')
								AND pedido <> ''
								GROUP BY estado
								ORDER BY total DESC
							");

            if (1 > 0) {

                $resultadoestadosMesCP = [
                    [
                        "estado" => "Acepta",
                        "total" => "0",
                        "totalestados" => "0",
                    ],
                    [
                        "estado" => "Rechaza",
                        "total" => "0",
                        "totalestados" => "0",
                    ],
                    [
                        "estado" => "Pendiente",
                        "total" => "0",
                        "totalestados" => "0",
                    ],
                ];

                $response = [$resultado, $resultadoestadosMes, $resultadodiario, $resultadoestadosMesCP, $resultadodiarioCP, $resultadoCP, $resultadoTV, $resultadoInTo, $counter[0]['counter']];
            } else {
                $response = ['No se encontraron datos'];
            }
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_DB = null;
        echo json_encode($response);
    }

    public function resultado($fechaIni, $fechaFin)
    {
        try {

            ini_set('session.gc_maxlifetime', 3600); // 1 hour
            session_set_cookie_params(3600);
            session_start();
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
        $this->_DB = null;

        return $response;
    }

    public function queryTv($fechaIni, $fechafin)
    {
        try {
            ini_set('session.gc_maxlifetime', 3600); // 1 hour
            session_set_cookie_params(3600);
            session_start();
            $stmt = $this->_DB->query("SELECT logindepacho, pedido, horagestion, logincontingencia, horacontingencia,
				(CASE
					WHEN acepta IS NULL THEN 'Pendiente'
				ELSE acepta END) estado
			FROM contingencias
			WHERE horagestion BETWEEN ('$fechaIni 00:00:00') AND ('$fechafin 23:59:59')
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
        $this->_DB = null;

        return $response;
    }

    public function resultadoInTo($fechaIni, $fechaFin)
    {
        try {
            ini_set('session.gc_maxlifetime', 3600); // 1 hour
            session_set_cookie_params(3600);
            session_start();
            $stmt = $this->_DB->query("SELECT logindepacho, pedido, horagestion, logincontingencia, horacontingencia,
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

        $this->_DB = null;

        return $response;
    }

    public function resultadoCP($fechaIni, $fechaFin)
    {
        try {
            ini_set('session.gc_maxlifetime', 3600); // 1 hour
            session_set_cookie_params(3600);
            session_start();
            $stmt = $this->_DB->query("SELECT logindepacho, pedido, horagestion, loginContingenciaPortafolio, horaContingenciaPortafolio,
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
        $this->_DB = null;

        return $response;
    }

    public function querydiario($diaInicial, $diaFinal)
    {
        try {
            ini_set('session.gc_maxlifetime', 3600); // 1 hour
            session_set_cookie_params(3600);
            session_start();
            $stmt = $this->_DB->prepare("SELECT DATE_FORMAT(horagestion,'%Y-%m-%d') fecha, COUNT(*) total
		FROM contingencias
		WHERE horagestion BETWEEN (:diainicial) AND (:diafinal)
		AND accion IN ('Cambio de equipo', 'Contingencia', 'Refresh', 'Registros ToIP', 'Reenvio de registros')
		AND pedido <> ''
		GROUP BY fecha
		ORDER BY fecha DESC");

            $stmt->execute([':diainicial' => "$diaInicial 00:00:00", ':diafinal' => "$diaFinal 00:00:00"]);
            $stmt->execute();
            if ($stmt->rowCount()) {
                $response = $stmt->fetchAll(PDO::FETCH_ASSOC);
            } else {
                $response = 0;
            }
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_DB = null;

        return $response;
    }

    public function resultadodiarioCP($diaInicial, $diaFinal)
    {
        try {
            ini_set('session.gc_maxlifetime', 3600); // 1 hour
            session_set_cookie_params(3600);
            session_start();
            $stmt = $this->_DB->prepare("SELECT date_format(horagestion,'%Y-%m-%d') fecha, COUNT(*) total
		FROM contingencias
		WHERE horagestion BETWEEN (:diainicial) AND (:diafinal)
		AND accion IN ('Corregir portafolio', 'mesaOffline')
		AND pedido <> ''
		GROUP BY fecha
		ORDER BY fecha DESC");

            $stmt->execute([':diainicial' => "$diaInicial 00:00:00", ':diafinal' => "$diaFinal 00:00:00"]);
            if ($stmt->rowCount()) {
                $response = $stmt->fetchAll(PDO::FETCH_ASSOC);
            } else {
                $response = 0;
            }
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_DB = null;

        return $response;
    }

    public function resultadoestadosMes($diaInicial, $diaFinal)
    {
        try {
            ini_set('session.gc_maxlifetime', 3600); // 1 hour
            session_set_cookie_params(3600);
            session_start();
            $stmt = $this->_DB->query("SELECT (CASE 
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
        $this->_DB = null;

        return $response;
    }

    public function datoscontingencias()
    {
        try {
            ini_set('session.gc_maxlifetime', 3600); // 1 hour
            session_set_cookie_params(3600);
            session_start();
            if (!$_SESSION) {
                $response = ['state' => 99, 'title' => 'Su session ha caducado', 'text' => 'Inicia session nuevamente para continuar'];
            } else {

                $stmt = $this->_DB->query("SELECT c.pedido,  REPLACE (c.macEntra,CHAR(45),CONCAT(CHAR(10),CHAR(10),CHAR(10)))AS macEntra, REPLACE (c.macSale,CHAR(45),CONCAT(CHAR(10),CHAR(10),CHAR(10))) AS macSale, c.logincontingencia, REPLACE (c.paquetes,CHAR(47),CONCAT(CHAR(10),CHAR(10),CHAR(10)))AS paquetes, c.ciudad, c.proceso, c.accion, c.tipoEquipo, c.remite, c.observacion, 
					c.engestion, c.producto, c.grupo, c.horagestion, c.perfil, c.tipificacion, c.acepta, c.loginContingenciaPortafolio, c.aceptaPortafolio, 
					c.tipificacionPortafolio, c.enGestionPortafolio, c.fechaClickMarcaPortafolio, c.id_terreno, CASE WHEN (SELECT COUNT(*)
					FROM contingencias c1
					WHERE c1.pedido=c.pedido AND c1.horagestion >= DATE_SUB(CURDATE(), INTERVAL 10 DAY) AND c1.finalizado = 'OK') > 0 THEN 'TRUE' ELSE 'FALSE' END alerta
				FROM contingencias c
				WHERE c.finalizado IS NULL AND c.finalizadoPortafolio IS NULL AND c.pedido <> ''
				ORDER BY c.horagestion");
                $stmt->execute();

                if ($stmt->rowCount()) {
                    $resultadoTV = [];
                    $resultadoOTROS = [];
                    $resultadoPORTAFOLIO = [];
                    foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {

                        if ($row['grupo'] == "TV") {
                            $resultadoTV[] = $row;
                        } elseif ($row['grupo'] == "INTER") {
                            $resultadoOTROS[] = $row;
                        } elseif ($row['grupo'] == "PORTAFOLIO") {
                            $resultadoPORTAFOLIO[] = $row;
                        }
                    }
                }

                $response = array('state' => 1, 'data' => array($resultadoTV, $resultadoOTROS, $resultadoPORTAFOLIO));
            }
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_DB = null;
        echo json_encode($response);
    }

    public function registrosOffline($data)
    {
        try {
            ini_set('session.gc_maxlifetime', 3600); // 1 hour
            session_set_cookie_params(3600);
            session_start();
            if (!$_SESSION) {
                $response = ['state' => 99, 'title' => 'Su session ha caducado', 'text' => 'Inicia session nuevamente para continuar'];
            } else {

                $pagenum = $data['page'];
                $pagesize = $data['size'];
                $offset = ($pagenum - 1) * $pagesize;
                $search = $data['search'];

                $stmt = $this->_DB->query("select * from registros_offline");
                $stmt->execute();
                $counter = $stmt->rowCount();


                $stmt = $this->_DB->query("SELECT LOGIN_ASESOR_OFF,LOGIN_ASESOR, PEDIDO,PROCESO, PRODUCTO, ACCION, ACTIVIDAD, ACTIVIDAD2, OBSERVACIONES, FECHA_CARGA 
                                            FROM registros_offline order by FECHA_CARGA desc limit $offset, $pagesize");
                $stmt->execute();

                if ($stmt->rowCount()) {

                    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
                    $response = ['state' => 1, 'data' => $result, 'counter' => $counter];
                } else {
                    $response = 0;
                }
            }
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_DB = null;
        echo json_encode($response);
    }

    public function graficaDepartamento($data)
    {
        try {
            ini_set('session.gc_maxlifetime', 3600); // 1 hour
            session_set_cookie_params(3600);
            session_start();
            $mesenviado = $data;

            if ($mesenviado == "") {

                $stmt1 = $this->_DB->query("select max(fecha_instalacion) as fecha from nps ");

                $stmt1->execute();

                $fecha = date("Y-m-d");

                if ($stmt1->rowCount()) {
                    $fecha = $stmt1->fetchAll(PDO::FETCH_ASSOC);
                }

                $dia = substr($fecha, 8, 2);
                $mes = substr($fecha, 5, 2);
                $anio = substr($fecha, 0, 4);

                $nom_mes = date('M', mktime(0, 0, 0, $mes, $dia, $anio));
                $semana = "Semana " . date('W', mktime(0, 0, 0, $mes, $dia, $anio));
                $diaSemana = date("w", mktime(0, 0, 0, $mes, $dia, $anio));
            } else {
                $nom_mes = $mesenviado;
                /* $semana    = "Semana " . date('W', mktime(0, 0, 0, $mes, $dia, $anio));
                $diaSemana = date("w", mktime(0, 0, 0, $mes, $dia, $anio)); */
            }

            $stmt = $this->_DB->prepare("select gen.regional, round(((select count(respuesta)  
            from nps where num_respuesta = '5' and num_pregunta = '4' and mes = gen.mes and regional = gen.regional) 
            -(select count(respuesta) 
            from nps where num_respuesta = '1' and num_pregunta = '4' and mes = gen.mes and regional = gen.regional) 
            -(select count(respuesta) 
            from nps where num_respuesta = '2' and num_pregunta = '4' and mes = gen.mes and regional = gen.regional) 
            -(select count(respuesta) 
            from nps where num_respuesta = '3' and num_pregunta = '4' and mes = gen.mes and regional = gen.regional))/ 
            (select count(respuesta) 
            from nps where num_pregunta = '4' and mes = gen.mes and regional = gen.regional)*100,2) as NPS 
            from nps gen  
            where mes = :nomes  
            group by gen.regional order by regional");

            $stmt->execute([':nomes' => $nom_mes]);


            if ($stmt->rowCount()) {
                $resulta = $stmt->fetchAll(PDO::FETCH_ASSOC);
                $label = $resulta['regional'];
                $ressi = $resulta['NPS'];
                $departamentos = ["label" => "$label", "value" => "$ressi"];

                $response = [$departamentos, 201];
            } else {
                $response = 0;
            }
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_DB = null;
        echo json_encode($response);
    }

    public function marcaPortafolio($datosguardar)
    {
        try {
            ini_set('session.gc_maxlifetime', 3600); // 1 hour
            session_set_cookie_params(3600);
            session_start();
            $today = date("Y-m-d H:i:s");
            $login = $_SESSION['login'];
            $pedido = $datosguardar['pedido'];
            $gestion = $datosguardar['bloqueo'];
            $producto = $datosguardar['producto'];

            if ($gestion == true) {
                $gestion = 1;
            } else {
                $gestion = 0;
            }

            $stmt = $this->_DB->prepare("	SELECT id, loginContingenciaPortafolio
						FROM contingencias
						WHERE finalizadoPortafolio is null
						AND enGestionPortafolio = '1'
						AND pedido = :pedido AND producto = :producto");

            $stmt->execute([':pedido' => $pedido, ':producto' => $producto]);

            if ($stmt->rowCount()) {

                $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);

                $logincontingencia = $resultado[0]['loginContingenciaPortafolio'];

                $id = $resultado['id'];
                if ($login == $logincontingencia) {

                    $stmtupdate = $this->_DB->prepare("UPDATE contingencias SET enGestionPortafolio = '0', loginContingenciaPortafolio = '' , fechaClickMarcaPortafolio=:today WHERE id='$id' ");
                    $stmtupdate->execute([':today' => $today]);
                    $response = [['Desbloqueado'], 201];
                } else {
                    $response = [[$resultado], 400];
                }
            } else {

                $stmt = $this->_DB->prepare("	SELECT id
							FROM contingencias
							WHERE finalizadoPortafolio is null
							AND pedido = :pedido
							AND producto = :producto
							AND accion IN('Corregir portafolio', 'mesaOffline', 'OC Telefonia')");

                $stmt->execute([':pedido' => $pedido, ':producto' => $producto]);

                if ($stmt->rowCount()) {

                    $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
                    $id = $resultado['id'];

                    $stmtupdate = $this->_DB->prepare("UPDATE contingencias SET enGestionPortafolio = :gestion, loginContingenciaPortafolio = :login , fechaClickMarcaPortafolio=:today WHERE id=:id");
                    $stmtupdate->execute([':gestion' => $gestion, ':login' => $login, ':today' => $today, ':id' => $id]);

                    $response = ['Desbloqueado', 201];
                } else {
                    $response = ['Ah ocurrido un error intentanlo nuevamente', 400];
                }
            }
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_DB = null;

        echo json_encode($response);
    }

    public function guardarpedidocontingencia($datosguardar)
    {

        try {
            ini_set('session.gc_maxlifetime', 3600); // 1 hour
            session_set_cookie_params(3600);
            session_start();
            if (!$_SESSION) {
                $response = ['state' => 99, 'title' => 'Su session ha caducado', 'text' => 'Inicia session nuevamente para continuar'];
            } else {
                $login = $_SESSION['login'];
                $pedido = (isset($datosguardar['pedido'])) ? $datosguardar['pedido'] : '';
                $producto = (isset($datosguardar['producto'])) ? $datosguardar['producto'] : '';
                $observacionesconting = (isset($datosguardar['observacionescontingencia'])) ? $datosguardar['observacionescontingencia'] : '';
                $ingresoClick = (isset($datosguardar['ingresoClick'])) ? $datosguardar['ingresoClick'] : '';
                $tipificacion = (isset($datosguardar['tipificacion'])) ? $datosguardar['tipificacion'] : '';
                $generarCr = (isset($datosguardar['generarcr'])) ? $datosguardar['generarcr'] : 0;
                $horacontingencia = date("Y-m-d H:i:s");

                if ($tipificacion == 'Ok') {
                    $acepta = 'Acepta';
                } else {
                    $acepta = 'Rechaza';
                }

                $stmt = $this->_DB->prepare("SELECT id, logincontingencia
					FROM contingencias
					WHERE pedido = :pedido
					AND producto= :producto
					AND finalizado IS NULL");

                $stmt->execute([':pedido' => $pedido, ':producto' => $producto]);

                if ($stmt->rowCount()) {

                    $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
                    $id = $resultado[0]['id'];
                    $logincontingencia = $resultado[0]['logincontingencia'];

                    if ($login != $logincontingencia) {
                        $response = ['state' => 3, 'text' => 'El pedido se encuentra en gestión por otro agente'];
                    } else {
                        /*ESTE QUERY ME ACTULIZA LA INFORMACION QUE ANALISTA A GESTIONADO*/
                        $stmtupdate = $this->_DB->prepare("UPDATE contingencias SET horacontingencia = :horacontingencia, 
                    observContingencia = :observacionesconting, 
                    ingresoEquipos = :ingresoClick, tipificacion = :tipificacion, 
                    acepta = :acepta, generarcr = :generarCr, finalizado = 'OK' 
                     WHERE id = :id");

                        $stmtupdate->execute([
                            ':horacontingencia' => $horacontingencia,
                            ':observacionesconting' => $observacionesconting,
                            ':ingresoClick' => $ingresoClick,
                            ':tipificacion' => $tipificacion,
                            ':acepta' => $acepta,
                            ':generarCr' => $generarCr,
                            ':id' => $id,
                        ]);

                        if ($stmtupdate->rowCount() == 1) {
                            $response = ['state' => 1, 'text' => 'Contingencia actualizada'];
                        } else {
                            $response = ['state' => 0, 'text' => 'Ha ocurrido un error intentalo nuevamente'];
                        }
                    }
                } else {
                    $response = ['state' => 0, 'text' => 'No se encontraron datos'];
                }
            }
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_DB = null;
        echo json_encode($response);
    }

    public function guardarescalamiento($datosguardar)
    {
        try {
            ini_set('session.gc_maxlifetime', 3600); // 1 hour
            session_set_cookie_params(3600);
            session_start();
            $login = $_SESSION['login'];
            $pedido = $datosguardar['pedido'];
            $producto = $datosguardar['producto'];
            $observacionesescalamiento = $datosguardar['observacionesescalamiento'];
            $tipificacion = $datosguardar['tipificacion'];
            $horaescalamiento = date("Y-m-d H:i:s");

            $stmt = $this->_DB->prepare("SELECT id
					FROM escalamiento_infraestructura
					WHERE pedido = :pedido
					AND producto= :producto
				");
            $stmt->execute([':pedido' => $pedido, ':producto' => $producto]);

            if ($stmt->rowCount()) {
                $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
                $id = $resultado['id'];

                /*ESTE QUERY ME ACTULIZA LA INFORMACION QUE ANALISTA A GESTIONADO*/

                if ($tipificacion == "Escalamiento ok nivel 2 Prioridad") {
                    $sqlupdate = $this->_DB->prepare("UPDATE escalamiento_infraestructura SET fecha_respuesta = :horaescalamiento, 
                    login_gestion = '', 
                    tipificacion=:tipificacion, 
                    engestion='0', 
                    estado = '1' 
                     WHERE id= :id ");

                    $sqlupdate->execute([':horaescalamiento' => $horaescalamiento, ':tipificacion' => $tipificacion, ':id' => $id]);
                } else {
                    if ($tipificacion == "Agendado" || $tipificacion == "No tecnicos disponibles" || $tipificacion == "ANS de mas de 20 horas" || $tipificacion == "No agendado") {
                        $sqlupdate = $this->_DB->prepare("UPDATE escalamiento_infraestructura SET fecha_respuesta = :horaescalamiento, 
                        observacion_respuesta = :obversacionesEscalamiento, 
                        tipificacion=:tipificacion, 
                        estado = '2' 
                         WHERE id=:id ");
                        $sqlupdate->execute([
                            ':horaescalamiento' => $horaescalamiento,
                            ':obversacionesEscalamiento' => $observacionesescalamiento,
                            ':tipificacion' => $tipificacion,
                            ':id' => $id,
                        ]);
                    } else {
                        $sqlupdate = $this->_DB->prepare("UPDATE escalamiento_infraestructura SET fecha_respuesta = :horaescalamiento, 
                        observacion_respuesta = :obversacionesEscalamiento, 
                        tipificacion=:tipificacion, 
                        estado = '1' 
                        WHERE id=:id ");
                        $sqlupdate->execute([
                            ':horaescalamiento' => $horaescalamiento,
                            ':obversacionesEscalamiento' => $observacionesescalamiento,
                            ':tipificacion' => $tipificacion,
                            ':id' => $id,
                        ]);
                    }
                }
                $response = [$id, 200];
            } else {
                $response = ['No se encotnraron datos', 400];
            }
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_DB = null;
        echo json_encode($response);
    }

    public function cerrarMasivamenteContingencias($datosCierreMasivo)
    {
        try {

            ini_set('session.gc_maxlifetime', 3600); // 1 hour
            session_set_cookie_params(3600);
            session_start();

            $today = date("Y-m-d H:i:s");
            $tv = $datosCierreMasivo['TV'];
            $internet = $datosCierreMasivo['Internet'];
            $toip = $datosCierreMasivo['ToIP'];
            $internettoip = $datosCierreMasivo['InternetToIP'];
            $instalaciones = $datosCierreMasivo['Instalaciones'];
            $reparaciones = $datosCierreMasivo['Reparaciones'];
            $aproequipo = $datosCierreMasivo['AprovisionarContin'];
            $refresh = $datosCierreMasivo['Refresh'];
            $cambioequipo = $datosCierreMasivo['CambioEquipo'];
            $cambioeid = $datosCierreMasivo["CambioEID"];
            $registrostoip = $datosCierreMasivo['RegistrosToIP'];
            $observaciones = $datosCierreMasivo['observaciones'];


            $sqlNroRegistrosEliminar = $this->_DB->prepare("SELECT COUNT(id) AS Cantidad
                                                                    FROM contingencias
                                                                    WHERE acepta IS NULL
                                                                      AND logincontingencia IS NULL
                                                                      AND producto IN (:tv, :internet, :toip, :internettoip)
                                                                      AND proceso IN (:instalaciones, :reparaciones)
                                                                      AND accion IN (:aproequipo, :refresh, :cambioequipo, :cambioeid, :registrostoip)");
            $sqlNroRegistrosEliminar->execute([
                ':tv' => $tv,
                ':internet' => $internet,
                ':toip' => $toip,
                ':internettoip' => $internettoip,
                ':instalaciones' => $instalaciones,
                ':reparaciones' => $reparaciones,
                ':aproequipo' => $aproequipo,
                ':refresh' => $refresh,
                ':cambioequipo' => $cambioequipo,
                ':cambioeid' => $cambioeid,
                ':registrostoip' => $registrostoip,
            ]);

            $counter = 0;
            if ($sqlNroRegistrosEliminar->rowCount()) {
                $counter = $sqlNroRegistrosEliminar->rowCount();
            }

            /*ESTE QUERY CIERRA DE FORMA MASIVA LAS CONTINGENCIAS*/
            $sqlupdate = $this->_DB->prepare("UPDATE contingencias
                                                    SET logincontingencia='cierremasivo',
                                                        acepta='Rechaza',
                                                        tipificacion='Error del sistema',
                                                        engestion='1',
                                                        finalizado='OK',
                                                        fechaClickMarca=:today,
                                                        horacontingencia = :today,
                                                        observContingencia=:observaciones
                                                    WHERE acepta IS NULL
                                                      AND logincontingencia IS NULL
                                                      AND producto IN (:tv, :internet, :toip, :internettoip)
                                                      AND proceso IN (:instalaciones, :reparaciones)
                                                      AND accion IN (:aproequipo, :refresh, :cambioequipo, :cambioeid, :registrostoip)");
            $sqlupdate->execute([
                ':today' => $today,
                ':observaciones' => $observaciones,
                ':tv' => $tv,
                ':internet' => $internet,
                ':toip' => $toip,
                ':internettoip' => $internettoip,
                ':instalaciones' => $instalaciones,
                ':reparaciones' => $reparaciones,
                ':aproequipo' => $aproequipo,
                ':refresh' => $refresh,
                ':cambioequipo' => $cambioequipo,
                ':cambioeid' => $cambioeid,
                ':registrostoip' => $registrostoip,
            ]);
            $response = [$counter, 200];
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_DB = null;
        echo json_encode($response);
    }

    public function guardarPedidoContingenciaPortafolio($datosguardar)
    {
        try {
            ini_set('session.gc_maxlifetime', 3600); // 1 hour
            session_set_cookie_params(3600);
            session_start();
            $login = $_SESSION['login'];
            $pedido = $datosguardar['pedido'];
            $producto = $datosguardar['producto'];
            $observContingenciaPortafolio = $datosguardar['observContingenciaPortafolio'];
            $ingresoClick = $datosguardar['ingresoClick'];
            $tipificacionPortafolio = $datosguardar['tipificacionPortafolio'];
            $horaContingenciaPortafolio = date("Y-m-d H:i:s");

            /*ORGANIZAR LO QUE SE RECHAZA DESDE CORREGIR PORTAFOLIO*/
            if ($tipificacionPortafolio == 'Ok') {
                $aceptaPortafolio = 'Acepta';
            } else {
                $aceptaPortafolio = 'Rechaza';
            }

            $stmt = $this->_DB->prepare("SELECT id
                                                FROM contingencias
                                                WHERE pedido = :pedido
                                                  AND producto = :producto
                                                  AND finalizadoPortafolio IS NULL
                                                  AND accion IN ('Corregir portafolio', 'mesaOffline', 'OC Telefonia')");
            $stmt->execute([':pedido' => $pedido, ':producto' => $producto]);

            if ($stmt->rowCount()) {

                $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
                $id = $resultado['id'];

                /*ESTE QUERY ME ACTULIZA LA INFORMACION QUE ANALISTA A GESTIONADO*/
                $sqlupdate = $this->_DB->prepare("UPDATE contingencias
                                                        SET horaContingenciaPortafolio   = :horaContingenciaPortafolio,
                                                            observContingenciaPortafolio = :observContingenciaPortafolio,
                                                            ingresoEquipos               = :ingresoClick,
                                                            tipificacionPortafolio       = :tipificacionPortafolio,
                                                            aceptaPortafolio             = :aceptaPortafolio,
                                                            finalizadoPortafolio         = 'OK'
                                                        WHERE id = :id");
                $sqlupdate->execute([
                    ':horaContingenciaPortafolio' => $horaContingenciaPortafolio,
                    ':observContingenciaPortafolio' => $observContingenciaPortafolio,
                    ':ingresoClick' => $ingresoClick,
                    ':tipificacionPortafolio' => $tipificacionPortafolio,
                    ':aceptaPortafolio' => $aceptaPortafolio,
                    ':id' => $id,
                ]);

                $response = ['Datos actualizados', 201];
            } else {
                $response = 0;
            }
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_DB = null;
        echo json_encode($response);
    }

    public function garantiasInstalaciones($data)
    {

        try {
            ini_set('session.gc_maxlifetime', 3600); // 1 hour
            session_set_cookie_params(3600);
            session_start();
            $mes = $data;

            $sqlDeparGarantias = $this->_DB->prepare("select Insta.departamento_dane,
                                                                   count(Insta.departamento_dane)                                                                            as Total,
                                                                   round((select count(departamento_dane) where departamento_dane = Insta.departamento_dane and mesInsta = Insta.mesInsta) /
                                                                         (select count(departamento_dane) from garantias_insta where mesInsta = Insta.mesInsta) * 100, 1) as porcentaje
                                                            from garantias_insta Insta
                                                            where mesInsta = :mes
                                                            group by Insta.departamento_dane
                                                            order by Insta.departamento_dane");

            $sqlDeparGarantias->execute([':mes' => $mes]);

            $sqlTecnicos = $this->_DB->prepare("select cod_funcionario,
                                                           (case
                                                                when count(cod_funcionario) >= '30' then 'Mayores a 30'
                                                                when count(cod_funcionario) >= '20' and count(cod_funcionario) < '30' then 'Entre 20-29'
                                                                when count(cod_funcionario) >= '15' and count(cod_funcionario) < '20' then 'Entre 15-19'
                                                                when count(cod_funcionario) >= '10' and count(cod_funcionario) < '15' then 'Entre 10-14'
                                                                when count(cod_funcionario) >= '0' and count(cod_funcionario) < '10' then 'Entre 0-10' end) Totalfrom garantias_insta
                                                    where mesInsta = :mes
                                                    group by cod_funcionario
                                                    order by count(cod_funcionario) DESC");

            $sqlTecnicos->execute([':mes' => $mes]);

            $sqlCausa = $this->_DB->prepare("select causa_falla, count(*) Total 
            from garantias_insta 
            where mesInsta = :mes
            group by causa_falla 
            order by count(*) DESC");

            $sqlCausa->execute([':mes' => $mes]);

            if ($sqlDeparGarantias->rowCount()) {

                $resultado = $sqlDeparGarantias->fetchAll(PDO::FETCH_ASSOC);
                $Rangostecnicos = [];
                $RangosCausas = [];
                $May30 = 0;
                $Entre20_29 = 0;
                $Entre15_19 = 0;
                $Entre10_14 = 0;
                $Entre0_10 = 0;

                if ($sqlTecnicos->rowCount()) {

                    while ($sqlTecnicos->fetchAll(PDO::FETCH_ASSOC)) {

                        /* if ($sqlTecnicos['Total'] == 'Mayores a 30') {
                            $May30 = $May30 + 1;
                        } elseif ($sqlTecnicos['Total'] == 'Entre 20-29') {
                            $Entre20_29 = $Entre20_29 + 1;
                        } elseif ($sqlTecnicos['Total'] == 'Entre 15-19') {
                            $Entre15_19 = $Entre15_19 + 1;
                        } elseif ($sqlTecnicos['Total'] == 'Entre 10-14') {
                            $Entre10_14 = $Entre10_14 + 1;
                        } else {
                            $Entre0_10 = $Entre0_10 + 1;
                        } */
                    }
                    $Rangostecnicos[] = ["rango" => "Mayor 30", "total" => "$May30"];
                    $Rangostecnicos[] = ["rango" => "Entre 20-29", "total" => "$Entre20_29"];
                    $Rangostecnicos[] = ["rango" => "Entre 15-19", "total" => "$Entre15_19"];
                    $Rangostecnicos[] = ["rango" => "Entre 10-14", "total" => "$Entre10_14"];
                    $Rangostecnicos[] = ["rango" => "Entre 0-9", "total" => "$Entre0_10"];
                }

                /* if ($sqlCausa->rowCount()) {

                    while ($sqlCausa->fetchAll([PDO::FETCH_ASSOC])) {

                        if ($sqlCausa['Total'] >= '30') {
                            $RangosCausas[] = $sqlCausa;
                        }
                    }
                } */

                $response = [$resultado, $Rangostecnicos, $RangosCausas, 201];
            } else {
                $response = 0;
            }
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_DB = null;
        echo json_encode($response);
    }

    public function graficaAcumulados($datos)
    {
        try {
            ini_set('session.gc_maxlifetime', 3600); // 1 hour
            session_set_cookie_params(3600);
            session_start();
            $pregunta = $datos['pregunta'];
            $mesenviado = $datos['mes'];

            if ($mesenviado == "") {

                $query = $this->_DB->query("select max(fecha_instalacion) as fecha from nps ");


                $fecha = date("Y-m-d");

                if ($query->rowCount()) {
                    $result = [];

                    $query->fetchAll(PDO::FETCH_ASSOC);
                    //$fecha = $query['fecha'];
                }

                $dia = substr($fecha, 8, 2);
                $mes = substr($fecha, 5, 2);
                $anio = substr($fecha, 0, 4);

                $nom_mes = date('M', mktime(0, 0, 0, $mes, $dia, $anio));
                $semana = "Semana " . date('W', mktime(0, 0, 0, $mes, $dia, $anio));
                $diaSemana = date("w", mktime(0, 0, 0, $mes, $dia, $anio));
            } /* else {
       $nom_mes   = $mesenviado;
       $semana    = "Semana " . date('W', mktime(0, 0, 0, $mes, $dia, $anio));
       $diaSemana = date("w", mktime(0, 0, 0, $mes, $dia, $anio));
   } */

            $query = $this->_DB->prepare("select gen.respuesta,
                                                       count(gen.respuesta)                                                                                                                       total,
                                                       round((count(gen.respuesta) / (select count(num_pregunta) from nps where num_pregunta = :pregunta and mes = gen.mes limit 1)) * 100, 2) as porcentaje
                                                from nps gen
                                                where gen.num_pregunta = :pregunta
                                                  and mes = :mes
                                                group by gen.respuesta");
            $query->execute([':pregunta' => $pregunta, ':mes' => $nom_mes]);

            //echo $this->mysqli->query($sqlLogin);
            //
            if ($query->rowCount()) {
                $categorias = [];
                $resultado = [];
                $total = [];
                $porcentaje = [];


                while ($row = $query->fetchAll(PDO::FETCH_ASSOC)) {
                    $resultado[] = $row;
                    $label = $row['respuesta'];
                    $totales = $row['total'];
                    $porcentajes = $row['porcentaje'];

                    $categorias[] = ["label" => "$label"];
                    $total[] = ["value" => "$totales"];
                    $porcentaje[] = ["value" => "$porcentajes"];
                }
            }

            $acumulado = [];
            $mes = [];
            $meta = [];

            if ($pregunta == "4") {

                $acumulado[] = ["value" => "38.7"];
                $acumulado[] = ["value" => "37.9"];

                $mes[] = ["label" => "Mar"];
                $mes[] = ["label" => "Abr"];
                $mes[] = ["label" => "May"];
                $mes[] = ["label" => "Jun"];
                $mes[] = ["label" => "Jul"];
                $mes[] = ["label" => "Ago"];
                $mes[] = ["label" => "Sep"];
                $mes[] = ["label" => "Oct"];
                $mes[] = ["label" => "Nov"];
                $mes[] = ["label" => "Dic"];

                $meta[] = ["value" => "38.70"];
                $meta[] = ["value" => "37.90"];
                $meta[] = ["value" => "38.50"];
                $meta[] = ["value" => "41.00"];
                $meta[] = ["value" => "42.00"];
                $meta[] = ["value" => "49.00"];
                $meta[] = ["value" => "53.00"];
                $meta[] = ["value" => "57.00"];
                $meta[] = ["value" => "61.00"];
                $meta[] = ["value" => "65.00"];
            }

            $Sqlmeses = $this->_DB->query("select distinct mes from nps");


            if ($Sqlmeses->rowCount()) {

                while ($row = $Sqlmeses->fetchAll(PDO::FETCH_ASSOC)) {
                    $nom_mes = $row['mes'];

                    if ($pregunta == "2") {
                        $SqlAcumulado = $this->_DB->prepare("select mes, round(((select count(respuesta) 
                            from nps where num_pregunta = '2' and num_respuesta = '5' 
                            and mes = :mes)+ 
                            (select count(respuesta)  
                            from nps where num_pregunta = '2' and num_respuesta = '4' 
                            and mes = :mes)- 
                            (select count(respuesta)  
                            from nps where num_pregunta = '2' and num_respuesta = '1'  
                            and mes = :mes))/ 
                            (select count(respuesta)  
                            from nps where num_pregunta = '2' and mes = :mes 
                            )*100, 2) as NPS 
                            from nps 
                            where mes = :mes 
                            group by  mes ");

                        $SqlAcumulado->execute([':mes' => $nom_mes]);
                    } elseif ($pregunta == "3") {
                        $SqlAcumulado = $this->_DB->prepare("select mes, round(((select count(respuesta) 
                            from nps where num_pregunta = '3' and num_respuesta = '1' 
                            and mes = :mes)+ 
                            (select count(respuesta)  
                            from nps where num_pregunta = '3' and num_respuesta = '2' 
                            and mes = :mes)- 
                            (select count(respuesta)  
                            from nps where num_pregunta = '3' and num_respuesta = '5'  
                            and mes = :mes))/ 
                            (select count(respuesta)  
                            from nps where num_pregunta = '3' and mes = :mes 
                            )*100, 2) as NPS 
                            from nps 
                            where mes = :mes
                            group by  mes ");
                        $SqlAcumulado->execute([':mes' => $nom_mes]);
                    } else {

                        $SqlAcumulado = $this->_DB->prepare("select mes, round(((select count(num_respuesta) 
                            from nps where num_pregunta = :pregunta and num_respuesta = '5' 
                            and mes = :mes)-(select count(num_respuesta) 
                            from nps where num_pregunta = :pregunta and num_respuesta = '3'  
                            and mes = :mes)-(select count(num_respuesta) 
                            from nps where num_pregunta = :pregunta and num_respuesta = '2'  
                            and mes = :mes)-(select count(num_respuesta)  
                           from nps where num_pregunta = :pregunta and num_respuesta = '1'  
                            and mes = :mes))/(select count(num_respuesta)   
                            from nps where num_pregunta = :pregunta and mes = :mes 
                            )*100, 2)  as NPS 
                            from nps 
                            where mes = :mes 
                            group by  mes ");

                        $SqlAcumulado->execute([':pregunta' => $pregunta, ':mes' => $nom_mes]);
                    }


                    //echo $this->mysqli->query($sqlLogin);
                    //
                    if ($SqlAcumulado->rowCount()) {

                        if ($pregunta == "4") {
                            while ($row = $SqlAcumulado->fetchAll(PDO::FETCH_ASSOC)) {
                                $nps = $row['NPS'];
                                $acumulado[] = ["value" => "$nps"];
                                //$mes[]=array("label"=>"$meses");
                            }
                        } else {
                            while ($row = $SqlAcumulado->fetchAll(PDO::FETCH_ASSOC)) {
                                $meses = $row['mes'];
                                $nps = $row['NPS'];
                                $acumulado[] = ["value" => "$nps"];
                                $mes[] = ["label" => "$meses"];
                            }
                        }
                    }
                }
                $response = [$categorias, $total, $porcentaje, $acumulado, $mes, $meta, 201];
            } else {
                $response = 0;
            }
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_DB = null;
        echo json_encode($response);
    }

    public function graficaAcumuladosrepa($datos)
    {
        try {
            ini_set('session.gc_maxlifetime', 3600); // 1 hour
            session_set_cookie_params(3600);
            session_start();
            $pregunta = $datos['pregunta'];
            $mesenviado = $datos['mes'];

            if ($mesenviado == "") {

                $query = $this->_DB->query("select max(FECHA_2) fecha from npsreparaciones ");


                $fecha = date("Y-m-d");

                if ($query->rowCount()) {
                    if ($row = $query->fetchAll(PDO::FETCH_ASSOC)) {
                        $fecha = $row['fecha'];
                    }
                }

                $dia = substr($fecha, 8, 2);
                $mes = substr($fecha, 5, 2);
                $anio = substr($fecha, 0, 4);

                $nom_mes = date('M', mktime(0, 0, 0, $mes, $dia, $anio));
                $semana = "Semana " . date('W', mktime(0, 0, 0, $mes, $dia, $anio));
                $diaSemana = date("w", mktime(0, 0, 0, $mes, $dia, $anio));
            } /* else {
       $nom_mes   = $mesenviado;
       $semana    = "Semana " . date('W', mktime(0, 0, 0, $mes, $dia, $anio));
       $diaSemana = date("w", mktime(0, 0, 0, $mes, $dia, $anio));
   }
*/
            $query = $this->_DB->prepare("select gen.respuesta, count(gen.respuesta) total, 
                round((count(gen.respuesta)/(select count(pregunta)  
                from npsreparaciones where num_pregunta = :pregunta and mes = gen.mes limit 1 )) *100, 2) as porcentaje 
                from npsreparaciones gen  
                where gen.num_pregunta = :pregunta  
                and mes = :mes 
                group by gen.respuesta ");
            $query->execute([':pregunta' => $pregunta, ':mes' => $nom_mes]);
            //
            if ($query->rowCount()) {
                $categorias = [];
                $resultado = [];

                $total = [];
                $porcentaje = [];

                while ($row = $query->fetchAll(PDO::FETCH_ASSOC)) {
                    $resultado[] = $row;
                    $label = $row['respuesta'];
                    $totales = $row['total'];
                    $porcentajes = $row['porcentaje'];

                    $categorias[] = ["label" => "$label"];
                    $total[] = ["value" => "$totales"];
                    $porcentaje[] = ["value" => "$porcentajes"];
                }
            }

            $acumulado = [];
            $mes = [];
            $meta = [];

            if ($pregunta == "4") {

                $acumulado[] = ["value" => "12.5"];
                $acumulado[] = ["value" => "7.00"];

                $mes[] = ["label" => "Mar"];
                $mes[] = ["label" => "Abr"];
                $mes[] = ["label" => "May"];
                $mes[] = ["label" => "Jun"];
                $mes[] = ["label" => "Jul"];
                $mes[] = ["label" => "Ago"];
                $mes[] = ["label" => "Sep"];
                $mes[] = ["label" => "Oct"];
                $mes[] = ["label" => "Nov"];
                $mes[] = ["label" => "Dic"];

                $meta[] = ["value" => "12.50"];
                $meta[] = ["value" => "7.00"];
                $meta[] = ["value" => "13.50"];
                $meta[] = ["value" => "19.60"];
                $meta[] = ["value" => "20.50"];
                $meta[] = ["value" => "21.40"];
                $meta[] = ["value" => "22.30"];
                $meta[] = ["value" => "23.20"];
                $meta[] = ["value" => "24.10"];
                $meta[] = ["value" => "25.00"];
            }

            $Sqlmeses = $this->_DB->query("select distinct mes from npsreparaciones");


            if ($Sqlmeses->rowCount()) {

                while ($row = $Sqlmeses->fetchAll(PDO::FETCH_ASSOC)) {
                    $nom_mes = $row['mes'];

                    if ($pregunta == "2") {
                        $SqlAcumulado = $this->_DB->prepare("select mes, round(((select count(respuesta) 
                            from npsreparaciones where num_pregunta = '2' and num_respuesta = '5' 
                            and mes = :mes)+ 
                            (select count(respuesta)  
                            from npsreparaciones where num_pregunta = '2' and num_respuesta = '4' 
                            and mes = :mes)- 
                            (select count(respuesta) 
                            from npsreparaciones where num_pregunta = '2' and num_respuesta = '1'  
                            and mes = :mes))/ 
                            (select count(respuesta)  
                            from npsreparaciones where num_pregunta = '2' and mes = :mes 
                            )*100, 2) as NPS 
                            from npsreparaciones 
                            where mes = :mes 
                            group by  mes");
                        $SqlAcumulado->execute([':mes' => $nom_mes]);
                    } elseif ($pregunta == "3") {
                        $SqlAcumulado = $this->_DB->prepare("select mes, round(((select count(respuesta)
                            from npsreparaciones where num_pregunta = '3' and num_respuesta = '1'
                            and mes = :mes)+ 
                            (select count(respuesta)
                            from npsreparaciones where num_pregunta = '3' and num_respuesta = '2' 
                            and mes = :mes)-
                            (select count(respuesta)  
                            from npsreparaciones where num_pregunta = '3' and num_respuesta = '5'
                            and mes = :mes))/ 
                            (select count(respuesta)
                            from npsreparaciones where num_pregunta = '3' and mes = :mes
                            )*100, 2) as NPS
                            from npsreparaciones 
                            where mes = :mes
                            group by  mes");

                        $SqlAcumulado->execute([':mes' => $nom_mes]);
                    } else {

                        $SqlAcumulado = $this->_DB->prepare("select mes, round(((select count(respuesta)
                            from npsreparaciones where num_pregunta = :pregunta and num_respuesta = '5' 
                            and mes = :mes)-(select count(respuesta) 
                            from npsreparaciones where num_pregunta = :pregunta and num_respuesta = '3'  
                            and mes = :mes)-(select count(respuesta)  
                            from npsreparaciones where num_pregunta = :pregunta and num_respuesta = '2'  
                            and mes = :mes)-(select count(respuesta)  
                            from npsreparaciones where num_pregunta = :pregunta and num_respuesta = '1'  
                            and mes = :mes))/(select count(respuesta)   
                            from npsreparaciones where num_pregunta = :pregunta and mes = :mes
                            )*100, 2)  as NPS 
                            from npsreparaciones 
                            where mes = :mes 
                            group by  mes ");

                        $SqlAcumulado->execute([':pregunta' => $pregunta, ':mes' => $nom_mes]);
                    }
                    //echo $this->mysqli->query($sqlLogin);
                    //
                    if ($SqlAcumulado->rowCount()) {

                        if ($pregunta == "4") {
                            while ($row = $SqlAcumulado->fetchAll(PDO::FETCH_ASSOC)) {
                                //	$meses=$row['mes'];
                                $nps = $row['NPS'];
                                $acumulado[] = ["value" => "$nps"];
                                //$mes[]=array("label"=>"$meses");
                            }
                        } else {
                            while ($row = $SqlAcumulado->fetchAll(PDO::FETCH_ASSOC)) {
                                $meses = $row['mes'];
                                $nps = $row['NPS'];
                                $acumulado[] = ["value" => "$nps"];
                                $mes[] = ["label" => "$meses"];
                            }
                        }
                    }
                }
                $response = [$categorias, $total, $porcentaje, $acumulado, $mes, $meta, 201];
            } else {
                $response = 0;
            }
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_DB = null;
        echo json_encode($response);
    }

    /*public function marcarengestion($params)
    {

        try {

            session_start();
            if (!$_SESSION) {
                $response = ['state' => 99, 'title' => 'Su session ha expirado', 'text' => 'Inicia session nuevamente para continuar'];
            } else {

                $today = date("Y-m-d H:i:s");

                $datosguardar = $params['datos'];
                $login        = $_SESSION['login'];
                $pedido       = $datosguardar['pedido'];
                $gestion      = $datosguardar['bloqueo'];
                $producto     = $datosguardar['producto'];

                if ($gestion == true) {
                    $gestion = 1;
                } else {
                    $gestion = 0;
                }

                $query = "SELECT id, logincontingencia FROM contingencias where engestion = '1' and finalizado is null and pedido = '$pedido' and producto = '$producto' ";

                $rst = $this->_DB->query($query);
                $rst->execute();
                $row               = $rst->fetch(PDO::FETCH_OBJ);
                $logincontingencia = $row->logincontingencia;
                $id                = $row->id;

                if ($rst->rowCount() == 1) {

                    if ($login == $logincontingencia) {
                        $sqlupdate = "UPDATE contingencias SET engestion = '0', logincontingencia = '', fechaClickMarca='$today' WHERE id = '$id'";

                        $this->_DB->query($sqlupdate);
                        $response = ['state' => 1, 'title' => 'Desbloqueado', 'text' => 'El pedido se encuentra desbloqueado'];
                    } else {
                        $response = ['state' => 2, 'title' => 'Bloqueado', 'text' => 'El pedido se encuentra en gestión'];
                    }
                } else {

                    $stmt = $this->_DB->query("SELECT id FROM contingencias where pedido = '$pedido' and producto = '$producto'");
                    $stmt->execute();
                    $result = $stmt->fetch(PDO::FETCH_OBJ);
                    $id     = $result->id;

                    $stmt = $this->_DB->query("UPDATE contingencias SET engestion = '1', logincontingencia = '$login', fechaClickMarca='$today' WHERE id='$id'");
                    $stmt->execute();
                    $response = ['state' => 1, 'title' => 'Bloqueado', 'text' => 'El pedido se encuentra bloqueado'];
                }
            }

        } catch (PDOException $e) {
            var_dump($e);
        }
        $this->_DB = null;
        echo json_encode($response);
    }*/

    public function marcarengestion($params)
    {
        try {
            ini_set('session.gc_maxlifetime', 3600); // 1 hour
            session_set_cookie_params(3600);
            session_start();
            if (!$_SESSION) {
                $response = ['state' => 99, 'title' => 'Su session ha expirado', 'text' => 'Inicia session nuevamente para continuar'];
            } else {

                $today = date("Y-m-d H:i:s");

                $datosguardar = $params['datos'];
                $login = $_SESSION['login'];
                $pedido = $datosguardar['pedido'];
                $gestion = $datosguardar['bloqueo'];
                $producto = $datosguardar['producto'];

                if ($gestion == true) {
                    $gestion = 1;
                } else {
                    $gestion = 0;
                }

                $query = "SELECT id FROM contingencias where engestion = 0 and finalizado is null and pedido = '$pedido' and producto = '$producto' ";

                $rst = $this->_DB->query($query);
                $rst->execute();
                $row = $rst->fetch(PDO::FETCH_OBJ);
                $id = $row->id;

                if ($rst->rowCount() == 1) {

                    $stmt = $this->_DB->prepare("UPDATE contingencias SET engestion = 1, logincontingencia = :login, fechaClickMarca = :today WHERE id = :id");
                    $stmt->execute([':login' => $login, ':today' => $today, ':id' => $id]);

                    if ($stmt->rowCount() == 1) {
                        $response = ['state' => 1, 'title' => 'Bloqueado', 'text' => 'El pedido se encuentra bloqueado'];
                    } else {
                        $response = ['state' => 2, 'title' => 'Error', 'text' => 'Ha ocurrido un error interno intentalo nuevamente'];
                    }
                } else {
                    $query = "SELECT id, logincontingencia FROM contingencias where engestion = 1 and finalizado is null and pedido = '$pedido' and producto = '$producto' ";

                    $rst = $this->_DB->query($query);
                    $rst->execute();
                    $row = $rst->fetch(PDO::FETCH_OBJ);
                    $logincontingencia = $row->logincontingencia ?? "";
                    $id = $row->id;

                    if ($login == $logincontingencia) {

                        $stmt = $this->_DB->prepare("UPDATE contingencias SET engestion = 0, logincontingencia = '', fechaClickMarca = '' WHERE id = :id");
                        $stmt->execute([':id' => $id]);

                        if ($stmt->rowCount() == 1) {
                            $response = ['state' => 1, 'title' => 'Desbloqueado', 'text' => 'El pedido se encuentra Desbloqueado'];
                        } else {
                            $response = ['state' => 2, 'title' => 'Error', 'text' => 'Ha ocurrido un error interno intentalo nuevamente'];
                        }
                    } else {
                        $response = ['state' => 2, 'title' => 'Bloqueado', 'text' => 'El pedido se encuentra en gestión por otro agente'];
                    }
                }
            }
        } catch (PDOException $e) {
            var_dump($e);
        }
        $this->_DB = null;
        echo json_encode($response);
    }


    public function csvContingencias($params)
    {
        try {
            ini_set('session.gc_maxlifetime', 3600); // 1 hour
            session_set_cookie_params(3600);
            session_start();
            $fechaIni = $params['fechaIni'];
            $fechafin = $params['fechafin'];

            $query = ("SELECT C.accion, C.ciudad, C.macEntra, C.macSale, C.motivo, C.observacion,
					C.paquetes, C.pedido, C.proceso, C.producto, C.remite, C.tecnologia, C.tipoEquipo, C.uen,
					C.contrato, C.perfil, C.logindepacho, C.logincontingencia, C.horagestion, C.horacontingencia,
					C.observContingencia, C.acepta, C.tipificacion, C.fechaClickMarca, C.loginContingenciaPortafolio,
					C.horaContingenciaPortafolio, C.tipificacionPortafolio, REPLACE(C.observContingenciaPortafolio, Char(10), '') as observContingenciaPortafolio, C.generarcr
					FROM contingencias AS C
				WHERE C.horagestion BETWEEN ('$fechaIni 00:00:00') AND ('$fechafin 23:59:59')
				AND C.accion IN ('Cambio de equipo', 'Contingencia', 'Refresh', 'Registros ToIP', 'Reenvio de registros')");

            $rst = $this->_DB->query($query);

            if ($rst->rowCount()) {
                $result = $rst->fetchAll(PDO::FETCH_ASSOC);

                $response = [$result, 200];
            } else {
                $response = ['state' => 0];
            }
        } catch (PDOException $e) {
            var_dump($e);
        }

        echo json_encode($response);
    }
}