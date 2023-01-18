<?php
require_once '../class/conection.php';

class modelNovedadesTecnico
{
    private $_DB;

    public function __construct()
    {
        $this->_DB = new Conection();
    }

    public function novedadesTecnico($data)
    {
        try {


            if (!empty($data['sort'])) {
                $fechaini = $data['sort']['fechaini'];
                $fechafin = $data['sort']['fechafin'];
            } else {
                $fechaini = date('Y-m-d');
                $fechafin = date('Y-m-d');
            }


            $stmt = $this->_DB->query("select count(*) as total from NovedadesVisitas
								WHERE 1=1
								AND fecha BETWEEN ('$fechaini 00:00:00') AND ('$fechafin 23:59:59')");
            $stmt->execute();

            $resCount   = $stmt->fetch(PDO::FETCH_OBJ);
            $totalCount = $resCount->total;


            if (is_numeric($data['curPage'])) {
                $page_number = $data['curPage'];
            } else {
                $page_number      = 1;
                $data['pageSize'] = 50;
            }

            $initial_page = ($page_number - 1) * $data['pageSize'];

            $total_pages = ceil($totalCount / $data['pageSize']);

            $pageSize = $data['pageSize'];

            $stmt = $this->_DB->query("SELECT id, cedulaTecnico, nombreTecnico, contracto, proceso, pedido, tiponovedad, municipio, situacion, 
                                horamarcaensitio, observaciones, idllamada, observacionCCO
						FROM NovedadesVisitas
							WHERE 1=1
							AND fecha BETWEEN ('$fechaini 00:00:00') AND ('$fechafin 23:59:59')
							ORDER BY fecha DESC
							limit $initial_page, $pageSize");
            $stmt->execute();
            if ($stmt->rowCount()) {
                $result   = $stmt->fetchAll(PDO::FETCH_ASSOC);
                $response = ['state' => 1, 'data' => $result, 'total' => $total_pages, 'counter' => intval($totalCount)];
            } else {
                $response = ['state' => 0];
            }

        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_DB = null;
        echo json_encode($response);
    }

    public function guardarNovedadesTecnico($data)
    {

        try {
            session_start();
            if (!$_SESSION) {
                $response = ['state' => 99, 'title' => 'Su session ha caducado', 'text' => 'Inicia session nuevamente para continuar'];
            } else {

                $login = $_SESSION['login'];
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
                $key                = (isset($data['id'])) ? $data['id'] : '';
                $contracto          = (isset($data['contracto'])) ? $data['contracto'] : '';
                $cedulaTecnico      = (isset($data['cedulaTecnico'])) ? $data['cedulaTecnico'] : '';
                $nombreTecnico      = (isset($data['nombreTecnico'])) ? utf8_decode($data['nombreTecnico']) : '';
                $region             = (isset($data['region'])) ? $data['region'] : '';
                $municipio          = (isset($data['municipio'])) ? utf8_decode($data['municipio']) : '';
                $situacion          = (isset($data['situacion'])) ? $data['situacion'] : '';
                $detalle            = (isset($data['detalle'])) ? $data['detalle'] : '';
                $observaciones      = (isset($data['observaciones'])) ? utf8_decode($data['observaciones']) : '';
                $tiponovedad        = (isset($data['tiponovedad'])) ? utf8_decode($data['tiponovedad']) : '';
                $pedido             = (isset($data['pedido'])) ? $data['pedido'] : '';
                $proceso            = (isset($data['proceso'])) ? $data['proceso'] : '';
                $situaciontriangulo = (isset($data['situaciontriangulo'])) ? utf8_decode($data['situaciontriangulo']) : '';
                $motivo             = (isset($data['motivotriangulo'])) ? utf8_decode($data['motivotriangulo']) : '';
                if (isset($data['submotivotriangulo'])) {
                    $submotivo = utf8_decode($data['submotivotriangulo']);
                } else {
                    $submotivo = "";
                }
                $horamarcasitio = date('h:i A', strtotime($data['horamarcaensitio']));
                $idllamada      = $data['idLlamada'];

                $contrato2      = $data['contrato2'];
                $cedulaTecnico2 = $data['cedulaTecnico2'];
                $nombreTecnico2 = utf8_decode($data['nombreTecnico2']);
                $proceso2       = $data['proceso2'];
                $municipio2     = utf8_decode($data['municipio2']);


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
                        $response = ['state' => 1, 'text' => 'Pedido actualizado'];
                    } else {
                        $response = ['state' => 0, 'text' => 'Ha ocurrido un error intentalo nuevamente'];
                    }

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
                        $response = ['state' => 1, 'text' => 'Pedido actualizado'];
                    } else {
                        $response = ['state' => 0, 'text' => 'Ha ocurrido un error intentalo nuevamente'];
                    }


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
                        $response = ['state' => 1, 'text' => 'Pedido actualizado'];
                    } else {
                        $response = ['state' => 0, 'text' => 'Ha ocurrido un error intentalo nuevamente'];
                    }

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
                        $response = ['state' => 1, 'text' => 'Pedido actualizado'];
                    } else {
                        $response = ['state' => 0, 'text' => 'Ha ocurrido un error intentalo nuevamente'];
                    }
                }
            }
        } catch (PDOException $exception) {
            var_dump($exception->getMessage());
        }

        $this->_DB = null;
        echo json_encode($response);
    }

    public function updateNovedadesTecnico($data)
    {
        try {
            session_start();
            if (!$_SESSION) {
                $response = ['state' => 99, 'title' => 'Su session ha caducado', 'text' => 'Inicia session nuevamente para continuar'];
            } elseif(!isset($data['observacionCCO']) || $data['observacionCCO'] == ''){
                $response = ['state' => 0, 'text' => 'Ingrese observaciones'];
            }else{
                $observacionCCO = $data['observacionCCO'];
                $pedido         = $data['pedido'];

                $stmt = $this->_DB->prepare("UPDATE NovedadesVisitas SET observacionCCO = :observacionCCO WHERE pedido = :pedido");
                $stmt->execute([':observacionCCO' => $observacionCCO, ':pedido' => $pedido]);

                if ($stmt->rowCount() == 1) {
                    $response = ['state' => 1, 'text' => 'Novedad actualizada'];
                } else {
                    $response = ['state' => 0, 'text' => 'Error'];
                }
            }
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_DB = null;
        echo json_encode($response);
    }

    public function csvNovedadesTecnico($data)
    {

        session_start();
        $usuarioid = $_SESSION['login'];
        if ($data) {
            $fechaini = $data['fechaini'];
            $fechafin = $data['fechafin'];
        }

        if ($fechaini == "" && $fechafin == "") {
            $fechaini = date('Y-m-d');
            $fechafin = date('Y-m-d');
        }

        try {
            $stmt = $this->_DB->query("SELECT n.fecha,
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
                                              AND n.fecha BETWEEN ('$fechaini 00:00:00') AND ('$fechafin 23-59-59')");
            $stmt->execute();

            if ($stmt->rowCount()) {
                $result   = $stmt->fetchAll(PDO::FETCH_ASSOC);
                $response = [$result, $stmt->rowCount()];

            } else {
                $response = ['', 400];
            }

        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }

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
        $this->_DB = null;
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
        $this->_DB = null;
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
        $this->_DB = null;
        echo json_encode($response);
    }

    public function BFobservaciones()
    {
        session_start();
        $login = $_SESSION['login'];
        $hoy   = date("Y-m-d");
        try {
            $stmt = $this->_DB->prepare("SELECT PedidoDespacho, observacionAsesor, pedidobloqueado, gestionAsesor, estado, AccionDespacho
						FROM BrutalForce
						WHERE loginDespacho = :login
						AND (FechaGestionDespacho BETWEEN (:fechaini) AND (:fechafin) OR fechagestionAsesor BETWEEN (:fechaini) AND (:fechafin))");
            $stmt->execute([':login' => $login, ':fechaini' => "$hoy 00:00:00", ':fechafin' => "$hoy 23:59:59"]);

            if ($stmt->rowCount()) {
                $response = [$stmt->fetchAll(PDO::FETCH_ASSOC), 201];
            } else {
                $response = ['No se encontraron datos', 400];
            }
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_DB = null;
        echo json_encode($response);

    }

    public function registrospwdTecnicos($data)
    {

        try {

            session_start();

            if (!$_SESSION) {
                $response = ['state' => 99, 'title' => 'Su session ha caducado', 'text' => 'Inicia session nuevamente para continuar'];

            } else {
                $concepto  = $data['concepto'];
                $buscar    = $data['buscar'];
                $parametro = " and $concepto = '$buscar'";

                $stmt = $this->_DB->query("SELECT c.cedula, c.login, c.nombre, c.password, c.expiraCuenta, c.expirapsw FROM cuentasTecnicos c where 1=1 $parametro");

                $stmt->execute();
                if ($stmt->rowCount()) {
                    $response = ['state' => 1, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)];
                } else {
                    $response = ['state' => 0];
                }
            }

        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_DB = null;
        echo json_encode($response);
    }

    public function editarPwdTecnicos($data)
    {
        try {
            $datos  = $data['datosEdicion'];
            $cedula = $datos['cedula'];
            $pwd    = $datos['newpwd'];

            $stmt = $this->_DB->prepare("update cuentasTecnicos set password = :password where cedula = :cedula");
            $stmt->execute([':password' => $pwd, ':cedula' => $cedula]);
            if ($stmt->rowCount()) {
                $response = ['state' => 1, 'data' => 'Contraseña actualizada correctamente'];
            } else {
                $response = ['state' => 0, 'data' => 'Ah ocurrido un error intentalo de nuevo'];
            }

        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }

        $this->_DB = null;
        echo json_encode($response);
    }

    public function csvContrasenasTecnicos()
    {
        try {
            $usuarioid = $_SESSION['login'];
            $filename  = "ContrasenasTecnicosClick" . "_" . $usuarioid . ".csv";

            $stmt = $this->_DB->query("SELECT c.cedula, c.login, c.nombre, c.password, c.expiraCuenta, c.expirapsw
						FROM cuentasTecnicos c");
            $stmt->execute();

            if ($stmt->rowCount()) {
                $result   = $stmt->fetchAll(PDO::FETCH_ASSOC);
                $response = [$result, 201];

            } else {
                $response = ['', 400];
            }
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_DB = null;
        echo json_encode($response);
    }

}
