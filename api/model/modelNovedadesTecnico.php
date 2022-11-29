<?php
require_once '../class/conection.php';

class modelNovedadesTecnico
{
    private $_DB;

    public function __construct()
    {
        $this->_DB = new Conection();
    }

    public function novedadesTecnico($pagina, $datos)
    {
        $fechaini = (!isset($datos->fechaini)) ? date("Y-m-d") : $datos->fechaini; //CORRECCION DE VALIDACION DE FECHA
        $fechafin = (!isset($datos->fechafin)) ? date("Y-m-d") : $datos->fechafin; //CORRECCION DE VALIDACION DE FECHA

        if ($fechaini == "" || $fechafin == "") {
            $fechaini = date('Y-m-d');
            $fechafin = date('Y-m-d');
        }

        if ($pagina == "undefined") {
            $pagina = "0";
        } else {
            $pagina = $pagina - 1;
        }

        $pagina = $pagina * 100;

        try {
            $stmt = $this->_DB->prepare("SELECT id,
                                               cedulaTecnico,
                                               nombreTecnico,
                                               contracto,
                                               proceso,
                                               pedido,
                                               tiponovedad, /*region,*/
                                               municipio,
                                               situacion,
                                               horamarcaensitio,/*detalle, */observaciones,
                                               idllamada,
                                               observacionCCO
                                        FROM NovedadesVisitas
                                        WHERE 1 = 1
                                          AND fecha BETWEEN (?) AND (?)
                                        ORDER BY fecha DESC
                                        limit 100 offset ?");
            $stmt->bindValue(1, "$fechaini 00:00:00", PDO::PARAM_STR);
            $stmt->bindValue(2, "$fechafin 23:59:59", PDO::PARAM_STR);
            $stmt->bindParam(3, $pagina, PDO::PARAM_INT);
            $stmt->execute();

            if ($stmt->rowCount()) {
                $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
                $count     = $stmt->rowCount();

                $totalPaginas = $count / 100;
                $totalPaginas = ceil($totalPaginas); //redondear al siguiente

                $response = [$resultado, $count, $totalPaginas];
            } else {
                $response = 0;
            }
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_DB = null;

        return $response;
    }

    public function guardarNovedadesTecnico($data)
    {

        $datos = $data->datosEdicion;
        $login = $data->login;
        //$login  = $login['LOGIN'];
        /* $key = $datos['id'];
		$contracto = $datos['contracto'];
		$cedulaTecnico = $datos['cedulaTecnico'];
		$nombreTecnico = utf8_decode($datos['nombreTecnico']);
		$region = $datos['region'];
		$municipio = utf8_decode($datos['municipio']);
		$situacion = $datos['situacion'];
		$detalle = $datos['detalle'];
		$observaciones = utf8_decode($datos['observaciones']);
		$tiponovedad = utf8_decode($datos['tiponovedad']);
		$pedido = $datos['pedido'];
		$proceso = $datos['proceso']; */
        $key                = (isset($data->id)) ? $data->id : '';
        $contracto          = (isset($data->contracto)) ? $data->contracto : '';
        $cedulaTecnico      = (isset($data->cedulaTecnico)) ? $data->cedulaTecnico : '';
        $nombreTecnico      = (isset($data->nombreTecnico)) ? utf8_decode($data->nombreTecnico) : '';
        $region             = (isset($data->region)) ? $data->region : '';
        $municipio          = (isset($data->municipio)) ? utf8_decode($data->municipio) : '';
        $situacion          = (isset($data->situacion)) ? $data->situacion : '';
        $detalle            = (isset($data->detalle)) ? $data->detalle : '';
        $observaciones      = (isset($data->observaciones)) ? utf8_decode($data->observaciones) : '';
        $tiponovedad        = (isset($data->tiponovedad)) ? utf8_decode($data->tiponovedad) : '';
        $pedido             = (isset($data->pedido)) ? $data->pedido : '';
        $proceso            = (isset($data->proceso)) ? $data->proceso : '';
        $situaciontriangulo = (isset($data->situaciontriangulo)) ? utf8_decode($data->situaciontriangulo) : '';
        $motivo             = (isset($data->motivotriangulo)) ? utf8_decode($data->motivotriangulo) : '';
        if (isset($data->submotivotriangulo)) {
            $submotivo = utf8_decode($data->submotivotriangulo);
        } else {
            $submotivo = "";
        }
        $horamarcasitio = date('h:i A', strtotime($data->horamarcaensitio));
        $idllamada      = $data->idLlamada;

        $contrato2      = $data->contrato2;
        $cedulaTecnico2 = $data->cedulaTecnico2;
        $nombreTecnico2 = utf8_decode($data->nombreTecnico2);
        $proceso2       = $data->proceso2;
        $municipio2     = utf8_decode($data->municipio2);


        if ($tiponovedad == 'Cumplimiento de Agenda' and $cedulaTecnico == null) {

            $stmt = $this->_DB->prepare("INSERT INTO NovedadesVisitas
            (fecha, usuario, tiponovedad, pedido, contracto, cedulaTecnico, nombreTecnico, proceso, region, municipio, situacion, horamarcaensitio, detalle, observaciones, idllamada, motivo,
             submotivo)
            VALUES (NOW(), :login, :tiponovedad, :pedido, UPPER(:contrato2), TRIM(:cedulaTecnico2), TRIM(:nombreTecnico2), TRIM(:proceso2), LOWER(:region), LOWER(:municipio2),
                    LOWER(:situaciontriangulo), :horamarcasitio, LOWER(:detalle), LOWER(TRIM(:observaciones)), TRIM(:idllamada), :motivo, :submotivo)");
            $stmt->execute([
                ':login'              => $login,
                ':tiponovedad'        => $tiponovedad,
                ':pedido'             => $pedido,
                ':contrato2'          => $contrato2,
                ':cedulaTecnico2'     => $cedulaTecnico2,
                ':nombreTecnico2'     => $nombreTecnico2,
                ':proceso2'           => $proceso2,
                ':region'             => $region,
                ':municipio2'         => $municipio2,
                ':situaciontriangulo' => $situaciontriangulo,
                ':horamarcasitio'     => $horamarcasitio,
                ':detalle'            => $detalle,
                ':observaciones'      => $observaciones,
                ':idllamada'          => $idllamada,
                ':motivo'             => $motivo,
                ':submotivo'          => $submotivo,
            ]);

            if ($stmt->rowCount() == 1) {
                $response = ['Pedido actualizado' . 201];
            } else {
                $response = ['Error' . 400];
            }

            /*$sqlInsetar = ("
							INSERT INTO NovedadesVisitas
								(fecha, usuario, tiponovedad, pedido, contracto, cedulaTecnico, nombreTecnico, proceso, region, municipio, situacion, horamarcaensitio, detalle, observaciones, idllamada, motivo, submotivo)
							VALUES
								(NOW(), '$login', '$tiponovedad', '$pedido', UPPER('$contrato2'), TRIM($cedulaTecnico2), TRIM('$nombreTecnico2'), TRIM('$proceso2'), LOWER('$region'), LOWER('$municipio2'), LOWER('$situaciontriangulo'), '$horamarcasitio', LOWER('$detalle'), LOWER(TRIM('$observaciones')), TRIM('$idllamada'), '$motivo', '$submotivo')
						");

            $rst = $this->connseguimiento->query($sqlInsetar);

            /*==========OPCION 1=============
            if (is_numeric($rst) or $rst === true) {
                $this->response($this->json('Pedido actualizado'), 201);
            } else {
                $this->response($this->json("Error"), 400);
            }*/

        } elseif ($tiponovedad == 'Cumplimiento de Agenda' and $region <> null) {

            $stmt = $this->_DB->prepare("INSERT INTO NovedadesVisitas
            (fecha, usuario, tiponovedad, pedido, contracto, cedulaTecnico, nombreTecnico, proceso, region, municipio, situacion, horamarcaensitio, detalle, observaciones, idllamada, motivo,
             submotivo)
            VALUES (NOW(), :login, :tiponovedad, :pedido, :contracto, TRIM(:cedulaTecnico), UPPER(TRIM(:nombreTecnico)), TRIM(:proceso), LOWER(:region), LOWER(:municipio),
                    LOWER(:situaciontriangulo), :horamarcasitio, LOWER(:detalle), LOWER(TRIM(:observaciones)), TRIM(:idllamada), :motivo, :submotivo)");

            $stmt->execute([
                ':login'              => $login,
                ':tiponovedad'        => $tiponovedad,
                ':pedido'             => $pedido,
                ':contracto'          => $contracto,
                ':cedulaTecnico'      => $cedulaTecnico,
                ':nombreTecnico'      => $nombreTecnico,
                ':proceso'            => $proceso,
                ':region'             => $region,
                ':municipio'          => $municipio,
                ':situaciontriangulo' => $situaciontriangulo,
                ':horamarcasitio'     => $horamarcasitio,
                ':detalle'            => $detalle,
                ':observaciones'      => $observaciones,
                ':idllamada'          => $idllamada,
                ':motivo'             => $motivo,
                ':submotivo'          => $submotivo,
            ]);

            if ($stmt->rowCount() == 1) {
                $response = ['Pedido actualizado' . 201];
            } else {
                $response = ['Error' . 400];
            }

            /*$sqlInsetar = ("
							INSERT INTO NovedadesVisitas
								(fecha, usuario, tiponovedad, pedido, contracto, cedulaTecnico, nombreTecnico, proceso, region, municipio, situacion, horamarcaensitio, detalle, observaciones, idllamada, motivo, submotivo)
							VALUES
								(NOW(), '$login', '$tiponovedad', '$pedido', '$contracto', TRIM($cedulaTecnico), UPPER(TRIM('$nombreTecnico')), TRIM('$proceso'), LOWER('$region'), LOWER('$municipio'), LOWER('$situaciontriangulo'), '$horamarcasitio', LOWER('$detalle'), LOWER(TRIM('$observaciones')), TRIM('$idllamada'), '$motivo', '$submotivo')
						");

            $rst = $this->connseguimiento->query($sqlInsetar);

            /*==========OPCION 1=============
            if (is_numeric($rst) or $rst === true) {
                $this->response($this->json('Pedido actualizado'), 201);
            } else {
                $this->response($this->json("Error"), 400);
            }*/

        } elseif ($tiponovedad == 'Triangulo de Produccion' and $cedulaTecnico == null) {

            $stmt = $this->_DB->prepare("INSERT INTO NovedadesVisitas
            (fecha, usuario, tiponovedad, pedido, contracto, cedulaTecnico, nombreTecnico, proceso, region, municipio, situacion, horamarcaensitio, observaciones, idllamada, motivo, submotivo)
            VALUES (NOW(), :login, :tiponovedad, :pedido, UPPER(:contrato2), TRIM(:cedulaTecnico2), TRIM(:nombreTecnico2), LOWER(:proceso2), LOWER(:region), LOWER(:municipio2),
                    LOWER(:situaciontriangulo), :horamarcasitio, LOWER(TRIM(:observaciones)), TRIM(:idllamada), :motivo, :submotivo)");

            $stmt->execute([
                ':$login'             => $login,
                ':tiponovedad'        => $tiponovedad,
                ':pedido'             => $pedido,
                ':contrato2'          => $contrato2,
                ':cedulaTecnico2'     => $cedulaTecnico2,
                ':nombreTecnico2'     => $nombreTecnico2,
                ':proceso2'           => $proceso2,
                ':region'             => $region,
                ':municipio2'         => $municipio2,
                ':situaciontriangulo' => $situaciontriangulo,
                ':horamarcasitio'     => $horamarcasitio,
                ':observaciones'      => $observaciones,
                ':idllamada'          => $idllamada,
                ':motivo'             => $motivo,
                ':submotivo'          => $submotivo,
            ]);

            if ($stmt->rowCount() == 1) {
                $response = ['Pedido actualizado' . 201];
            } else {
                $response = ['Error' . 400];
            }

            /*$sqlInsetar = ("
							INSERT INTO NovedadesVisitas
								(fecha, usuario, tiponovedad, pedido, contracto, cedulaTecnico, nombreTecnico, proceso, region, municipio, situacion, horamarcaensitio, observaciones, idllamada, motivo, submotivo)
							VALUES
								(NOW(), '$login', '$tiponovedad', '$pedido', UPPER('$contrato2'), TRIM($cedulaTecnico2), TRIM('$nombreTecnico2'), LOWER('$proceso2'),LOWER('$region'), LOWER('$municipio2'), LOWER('$situaciontriangulo'), '$horamarcasitio', LOWER(TRIM('$observaciones')), TRIM('$idllamada'), '$motivo', '$submotivo')
						");

            $rst = $this->connseguimiento->query($sqlInsetar);

            /*==========OPCION 1=============
            if (is_numeric($rst) or $rst === true) {
                $this->response($this->json('Pedido actualizado'), 201);
            } else {
                $this->response($this->json("Error"), 400);
            }*/

        } elseif ($tiponovedad == 'Triangulo de Produccion' and $region <> null) {

            $stmt = $this->_DB->prepare("INSERT INTO NovedadesVisitas
            (fecha, usuario, tiponovedad, pedido, contracto, cedulaTecnico, nombreTecnico, proceso, region, municipio, situacion, horamarcaensitio, observaciones, idllamada, motivo, submotivo)
            VALUES (NOW(), '$login', '$tiponovedad', '$pedido', '$contracto', TRIM($cedulaTecnico), UPPER(TRIM('$nombreTecnico')), TRIM('$proceso'), LOWER('$region'), LOWER('$municipio'),
                    LOWER('$situaciontriangulo'), '$horamarcasitio', LOWER(TRIM('$observaciones')), TRIM('$idllamada'), '$motivo', '$submotivo')");

            $stmt->execute([
                ':login'              => $login,
                ':tiponovedad'        => $tiponovedad,
                ':pedido'             => $pedido,
                ':contracto'          => $contracto,
                ':cedulaTecnico'      => $cedulaTecnico,
                ':nombreTecnico'      => $nombreTecnico,
                ':proceso'            => $proceso,
                ':region'             => $region,
                ':municipio'          => $municipio,
                ':situaciontriangulo' => $situaciontriangulo,
                ':horamarcasitio'     => $horamarcasitio,
                ':observaciones'      => $observaciones,
                ':idllamada'          => $idllamada,
                ':motivo'             => $motivo,
                ':submotivo'          => $submotivo,
            ]);

            if ($stmt->rowCount() == 1) {
                $response = ['Pedido actualizado' . 201];
            } else {
                $response = ['Error' . 400];
            }

            /*$sqlInsetar = ("
							INSERT INTO NovedadesVisitas
								(fecha, usuario, tiponovedad, pedido, contracto, cedulaTecnico, nombreTecnico, proceso, region, municipio, situacion, horamarcaensitio, observaciones, idllamada, motivo, submotivo)
							VALUES
								(NOW(), '$login', '$tiponovedad', '$pedido', '$contracto', TRIM($cedulaTecnico), UPPER(TRIM('$nombreTecnico')), TRIM('$proceso'), LOWER('$region'), LOWER('$municipio'), LOWER('$situaciontriangulo'), '$horamarcasitio', LOWER(TRIM('$observaciones')), TRIM('$idllamada'), '$motivo', '$submotivo')
						");

            $rst = $this->connseguimiento->query($sqlInsetar);

            /*==========OPCION 1=============
            if (is_numeric($rst) or $rst === true) {
                $this->response($this->json('Pedido actualizado'), 201);
            } else {
                $this->response($this->json("Error"), 400);
            }*/

        }
        $this->_DB = null;
        echo json_encode($response);
    }

    public function updateNovedadesTecnico($data)
    {
        $observacionCCO = $data->datosEditar;
        $pedido         = $data->pedido;

        $stmt = $this->_DB->prepare("UPDATE NovedadesVisitas SET observacionCCO = :observacionCCO WHERE pedido = :pedido");
        $stmt->execute([':$observacionCCO' => $observacionCCO, ':$pedido' => $pedido]);

        if ($stmt->rowCount() == 1) {
            $response = ['Novedad actualizada' . 201];
        } else {
            $response = ['Error' . 400];
        }
        $this->_DB = null;
        echo json_encode($response);
    }

    public function csvNovedadesTecnico($data)
    {

        $usuarioid = $data->datosLogin;
        $usuarioid = $data->LOGIN;
        $datos     = $data->datos;
        $fechaini  = $data->fechaini;
        $fechafin  = $data->fechafin;

        if ($fechaini == "" && $fechafin == "") {
            $fechaini = date("Y") . "-" . date("m") . "-" . date("d");
            $fechafin = date("Y") . "-" . date("m") . "-" . date("d");
        }

        if ($fechaini == $fechafin) {
            $filename = "NovedadesTecnicos" . "_" . $fechaini . "_" . $usuarioid . ".csv";
        } else {
            $filename = "NovedadesTecnicos" . "_" . $fechaini . "_" . $fechafin . "_" . $usuarioid . ".csv";
        }

        try {
            $stmt = $this->_DB->prepare("SELECT n.fecha,
                                                   n.usuario,
                                                   n.municipio,
                                                   n.region,
                                                   n.proceso,
                                                   n.horamarcaensitio,
                                                   n.tiponovedad,
                                                   n.pedido,
                                                   n.cedulaTecnico,
                                                   n.nombreTecnico,
                                                   n.contracto,
                                                   n.situacion,
                                                   n.motivo,
                                                   n.submotivo,
                                                   n.observaciones,
                                                   n.observacionCCO,
                                                   n.idllamada
                                            FROM NovedadesVisitas n
                                            WHERE 1 = 1
                                              AND n.fecha BETWEEN (:fechaini) AND (:fechafin)");
            $stmt->execute([':fechaini' => "$fechaini 00:00:00", ':fechafin' => "$fechaini 23-59-59"]);

            if ($stmt->rowCount()) {
                $fp       = fopen("../tmp/$filename", 'w');
                $columnas = [
                    'Fecha',
                    'Despachador',
                    'Municipio',
                    'Region',
                    'Proceso',
                    'Hora marca en sitio',
                    'Tipo de Novedad',
                    'Pedido',
                    'Cedula del Tecnico',
                    'Nombre del Tecnico',
                    'Contrato',
                    'Situacion',
                    'Motivo',
                    'Submotivo',
                    'Observaciones',
                    'Observacion CCO',
                    'ID Llamada',
                ];

                fputcsv($fp, $columnas);
                fputcsv($fp, $stmt->fetchAll(PDO::FETCH_ASSOC));
                fclose($fp);

                $response = [[$filename, $stmt->rowCount()], 200];

            } else {
                $response = ['', 203];
            }

        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }

        /*$query = ("	SELECT n.fecha, n.usuario, n.municipio, n.region, n.proceso, n.horamarcaensitio, n.tiponovedad, n.pedido, n.cedulaTecnico, n.nombreTecnico, n.contracto, n.situacion, n.motivo, n.submotivo, n.observaciones, n.observacionCCO, n.idllamada
						FROM NovedadesVisitas n
						WHERE 1=1
						AND n.fecha BETWEEN ('$fechaini 00:00:00') AND ('$fechafin 23:59:59')
				");

        $queryCount = ("	SELECT COUNT(*) AS Cantidad FROM NovedadesVisitas n
								WHERE n.fecha BETWEEN ('$fechaini 00:00:00') AND ('$fechafin 23:59:59')

						");

        $rr      = $this->connseguimiento->query($queryCount);
        $counter = 0;
        if ($rr->num_rows > 0) {
            $result = [];
            if ($row = $rr->fetch_assoc()) {
                $counter = $row['Cantidad'];
            }
        }

        $rst = $this->connseguimiento->query($query) or die($this->connseguimiento->error . __LINE__);*/
        $this->_DB = null;
        echo json_encode($response);
    }

    public function Regiones()
    {
        try {
            $stmt = $this->_DB->query("SELECT region FROM regiones ORDER BY region");
            $stmt->execute();
            if ($stmt->rowCount()) {
                $response = [$stmt->fetchAll(PDO::FETCH_ASSOC), 200];
            } else {
                $response = ['Error', 400];
            }
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_DB = null;
        echo json_encode($response);
    }

    public function Municipios($data)
    {

        try {
            $stmt = $this->_DB->prepare("SELECT municipio
                                            FROM municipios m
                                            INNER JOIN regiones r ON m.codigoRg=r.codigoRg
                                            WHERE region = ?
                                            ORDER BY municipio");
            $stmt->bindParam(1, $data, PDO::PARAM_STR);
            $stmt->execute();

            if ($stmt->rowCount()) {
                $response = [$stmt->fetchAll(PDO::PARAM_STR), 201];
            } else {
                $response = ["error", 400];
            }
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        echo json_encode($response);
    }

    public function SituacionNovedadesVisitas()
    {
        try {
            $stmt = $this->_DB->query("SELECT situacion
					FROM SituacionNovedadesVisitas
					ORDER BY situacion");

            if ($stmt->rowCount()) {

                $response = [$stmt->fetchAll(PDO::FETCH_ASSOC), 201];

            } else {
                $response = ["error", 400];
            } // If no records "No Content" status
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }

        echo json_encode($response);
    }

    public function DetalleNovedadesVisitas($data)
    {
        try {
            $stmt = $this->_DB->prepare("SELECT dnv.detalle
					FROM DetalleNovedadesVisitas dnv
					INNER JOIN SituacionNovedadesVisitas snv ON dnv.situacionId=snv.situacionId
					WHERE snv.situacion = ?
					ORDER BY dnv.detalle ");
            $stmt->bindParam(1, $data, PDO::PARAM_STR);
            $stmt->execute();

            if ($stmt->rowCount()) {
                $response = [$stmt->fetchAll(PDO::FETCH_ASSOC), 201];
            } else {
                $response = ["error", 400];
            }
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        echo json_encode($response);
    }

    public function BFobservaciones()
    {
        session_start();
        $hoy = date("Y-m-d");
        try {
            $stmt = $this->_DB->prepare("SELECT PedidoDespacho, observacionAsesor, pedidobloqueado, gestionAsesor, estado, AccionDespacho
						FROM BrutalForce
						WHERE loginDespacho = :login
						AND (FechaGestionDespacho BETWEEN (:fechaini) AND (:fechafin) OR fechagestionAsesor BETWEEN (:fechaini) AND (:fechafin))");
            $stmt->execute([':login' => $_SESSION['login'], ':fechaini' => "$hoy 00:00:00", ':fechafin' => "$hoy 23:59:59"]);

            if ($stmt->rowCount()) {
                $response = [$stmt->fetchAll(PDO::FETCH_ASSOC), 201];
            } else {
                $response = ['Error', 400];
            }
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_DB = null;
        echo json_encode($response);

    }

}
