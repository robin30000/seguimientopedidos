<?php
require_once '../class/conection.php';

/*error_reporting(E_ALL);
ini_set('display_errors', 1);*/

class novedadesTecnico
{
    private $_DB;

    public function __construct()
    {
        $this->_DB = new Conection();
    }

    public function novedadesTecnico($data)
    {
        try {

            if (empty($data['data']['fechaini']) && empty($data['data']['fechafin'])) {
                $fechaini = date('Y-m-d');
                $fechafin = date('Y-m-d');
            } else {
                $fechaini = $data['data']['fechaini'];
                $fechafin = $data['data']['fechafin'];
            }

            $stmt = $this->_DB->query("select * from NovedadesVisitas
								WHERE 1=1
								AND fecha BETWEEN '$fechaini 00:00:00' AND '$fechafin 23:59:59'");
            $stmt->execute();
            $counter = $stmt->rowCount();

            $pagenum = $data['page'];
            $pagesize = $data['size'];
            $offset = ($pagenum - 1) * $pagesize;
            $search = $data['search'];
            $total_pages = ceil($counter / $data['size']);

            $stmt = $this->_DB->query("SELECT id, cedulaTecnico, nombreTecnico, contracto, proceso, pedido, tiponovedad, municipio, situacion, 
                                horamarcaensitio, observaciones, idllamada, observacionCCO
						FROM NovedadesVisitas
							WHERE 1=1
							AND fecha BETWEEN ('$fechaini 00:00:00') AND ('$fechafin 23:59:59')
							ORDER BY fecha DESC
							limit $offset, $pagesize");
            $stmt->execute();
            if ($stmt->rowCount()) {
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
                $response = ['state' => true, 'data' => $result, 'total' => $total_pages, 'counter' => $counter];
            } else {
                $response = ['state' => false, 'msj' => 'No se encontraron registros'];
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

            $login = $data['login'];

            if (empty($login)) {
                $response = ['state' => false, 'text' => 'Inicia session nuevamente para continuar'];
            } else {
                $key = (isset($data['id'])) ? $data['id'] : '';
                $contracto = (isset($data['contracto'])) ? $data['contracto'] : '';
                $cedulaTecnico = (isset($data['cedulaTecnico2'])) ? $data['cedulaTecnico2'] : '';
                $nombreTecnico = (isset($data['nombreTecnico'])) ? $data['nombreTecnico'] : '';
                $region = (isset($data['region'])) ? $data['region'] : '';
                $municipio = (isset($data['municipio'])) ? $data['municipio'] : '';
                $situacion = (isset($data['situacion'])) ? $data['situacion'] : '';
                $detalle = (isset($data['detalle'])) ? $data['detalle'] : '';
                $observaciones = (isset($data['observaciones'])) ? $data['observaciones'] : '';
                $tiponovedad = (isset($data['tiponovedad'])) ? $data['tiponovedad'] : '';
                $pedido = (isset($data['pedido'])) ? $data['pedido'] : '';
                $proceso = (isset($data['proceso'])) ? $data['proceso'] : '';
                $situaciontriangulo = (isset($data['situaciontriangulo'])) ? $data['situaciontriangulo'] : '';
                $motivo = (isset($data['motivotriangulo'])) ? $data['motivotriangulo'] : '';
                if (isset($data['submotivotriangulo'])) {
                    $submotivo = $data['submotivotriangulo'];
                } else {
                    $submotivo = "";
                }
                $horamarcasitio = date('h:i A', strtotime($data['horamarcaensitio']));
                $idllamada = $data['idLlamada'];

                $contrato2 = $data['contrato2'];
                $cedulaTecnico2 = $data['cedulaTecnico2'];
                $nombreTecnico2 = $data['nombreTecnico2'];
                $proceso2 = $data['proceso2'];
                $municipio2 = $data['municipio2'];


                if ($tiponovedad == 'Cumplimiento de Agenda' and $cedulaTecnico == null) {

                    $stmt = $this->_DB->prepare("INSERT INTO NovedadesVisitas (fecha, usuario, tiponovedad, pedido, contracto, cedulaTecnico, nombreTecnico, proceso, region, municipio, situacion, horamarcaensitio, detalle, observaciones, idllamada, motivo, submotivo)
                    VALUES (NOW(), :login, :tiponovedad, :pedido, UPPER(:contrato2), TRIM(:cedulaTecnico2), TRIM(:nombreTecnico2), TRIM(:proceso2), LOWER(:region), LOWER(:municipio2), LOWER(:situaciontriangulo), :horamarcasitio, LOWER(:detalle), LOWER(TRIM(:observaciones)), TRIM(:idllamada), :motivo, :submotivo)");
                    $stmt->execute([
                        ':login' => $login,
                        ':tiponovedad' => $tiponovedad,
                        ':pedido' => $pedido,
                        ':contrato2' => $contrato2,
                        ':cedulaTecnico2' => $cedulaTecnico2,
                        ':nombreTecnico2' => $nombreTecnico2,
                        ':proceso2' => $proceso2,
                        ':region' => $region,
                        ':municipio2' => $municipio2,
                        ':situaciontriangulo' => $situaciontriangulo,
                        ':horamarcasitio' => $horamarcasitio,
                        ':detalle' => $detalle,
                        ':observaciones' => $observaciones,
                        ':idllamada' => $idllamada,
                        ':motivo' => $motivo,
                        ':submotivo' => $submotivo,
                    ]);

                    if ($stmt->rowCount() == 1) {
                        $response = ['state' => true, 'text' => 'Tu Novedad fue Guardada!'];
                    } else {
                        $response = ['state' => false, 'text' => 'Ha ocurrido un error inténtalo nuevamente'];
                    }
                } elseif ($tiponovedad == 'Cumplimiento de Agenda' and $region <> null) {

                    $stmt = $this->_DB->prepare("INSERT INTO NovedadesVisitas
                    (fecha, usuario, tiponovedad, pedido, contracto, cedulaTecnico, nombreTecnico, proceso, region, municipio, situacion, horamarcaensitio, detalle, observaciones, idllamada, motivo, submotivo)
                    VALUES (NOW(), :login, :tiponovedad, :pedido, :contracto, TRIM(:cedulaTecnico), UPPER(TRIM(:nombreTecnico)), TRIM(:proceso), LOWER(:region), LOWER(:municipio), LOWER(:situaciontriangulo), :horamarcasitio, LOWER(:detalle), LOWER(TRIM(:observaciones)), TRIM(:idllamada), :motivo, :submotivo)");

                    $stmt->execute([
                        ':login' => $login,
                        ':tiponovedad' => $tiponovedad,
                        ':pedido' => $pedido,
                        ':contracto' => $contrato2,
                        ':cedulaTecnico' => $cedulaTecnico2,
                        ':nombreTecnico' => $nombreTecnico2,
                        ':proceso' => $proceso2,
                        ':region' => $region,
                        ':municipio' => $municipio2,
                        ':situaciontriangulo' => $situaciontriangulo,
                        ':horamarcasitio' => $horamarcasitio,
                        ':detalle' => $detalle,
                        ':observaciones' => $observaciones,
                        ':idllamada' => $idllamada,
                        ':motivo' => $motivo,
                        ':submotivo' => $submotivo,
                    ]);

                    if ($stmt->rowCount() == 1) {
                        $response = ['state' => true, 'text' => 'Tu Novedad fue Guardada!'];
                    } else {
                        $response = ['state' => false, 'text' => 'Ha ocurrido un error inténtalo nuevamente'];
                    }
                } elseif ($tiponovedad == 'Triangulo de Producción' and $cedulaTecnico == null) {

                    $stmt = $this->_DB->prepare("INSERT INTO NovedadesVisitas (fecha, usuario, tiponovedad, pedido, contracto, cedulaTecnico, nombreTecnico, proceso, region, municipio, situacion, horamarcaensitio, observaciones, idllamada, motivo, submotivo)
                    VALUES (NOW(), :login, :tiponovedad, :pedido, UPPER(:contrato2), TRIM(:cedulaTecnico2), TRIM(:nombreTecnico2), LOWER(:proceso2), LOWER(:region), LOWER(:municipio2), LOWER(:situaciontriangulo), :horamarcasitio, LOWER(TRIM(:observaciones)), TRIM(:idllamada), :motivo, :submotivo)");

                    $stmt->execute([
                        ':login' => $login,
                        ':tiponovedad' => $tiponovedad,
                        ':pedido' => $pedido,
                        ':contrato2' => $contrato2,
                        ':cedulaTecnico2' => $cedulaTecnico2,
                        ':nombreTecnico2' => $nombreTecnico2,
                        ':proceso2' => $proceso2,
                        ':region' => $region,
                        ':municipio2' => $municipio2,
                        ':situaciontriangulo' => $situaciontriangulo,
                        ':horamarcasitio' => $horamarcasitio,
                        ':observaciones' => $observaciones,
                        ':idllamada' => $idllamada,
                        ':motivo' => $motivo,
                        ':submotivo' => $submotivo,
                    ]);

                    if ($stmt->rowCount() == 1) {
                        $response = ['state' => true, 'text' => 'Tu Novedad fue Guardada!'];
                    } else {
                        $response = ['state' => false, 'text' => 'Ha ocurrido un error inténtalo nuevamente'];
                    }
                } elseif ($tiponovedad == 'Triangulo de Produccion' and $region <> null) {

                    $sql = "INSERT INTO NovedadesVisitas (fecha, usuario, tiponovedad, pedido, contracto, cedulaTecnico, nombreTecnico, proceso, region, municipio, situacion, horamarcaensitio, observaciones, idllamada, motivo, submotivo)
                    VALUES (NOW(), :login, :tiponovedad, :pedido, :contracto, TRIM(:cedulaTecnico), UPPER(TRIM(:nombreTecnico)), TRIM(:proceso), LOWER(:region), LOWER(:municipio), LOWER(:situaciontriangulo), :horamarcasitio, LOWER(TRIM(:observaciones)), TRIM(:idllamada), :motivo, :submotivo)";

                    $stmt = $this->_DB->prepare($sql);

                    $stmt->execute([
                        ':login' => $login,
                        ':tiponovedad' => $tiponovedad,
                        ':pedido' => $pedido,
                        ':contracto' => $contrato2,
                        ':cedulaTecnico' => $cedulaTecnico2,
                        ':nombreTecnico' => $nombreTecnico2,
                        ':proceso' => $proceso2,
                        ':region' => $region,
                        ':municipio' => $municipio2,
                        ':situaciontriangulo' => $situaciontriangulo,
                        ':horamarcasitio' => $horamarcasitio,
                        ':observaciones' => $observaciones,
                        ':idllamada' => $idllamada,
                        ':motivo' => $motivo,
                        ':submotivo' => $submotivo,
                    ]);

                    if ($stmt->rowCount() == 1) {
                        $response = ['state' => true, 'text' => 'Datos guardados correctamente'];
                    } else {
                        $response = ['state' => false, 'text' => 'Ha ocurrido un error inténtalo nuevamente'];
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

            $observacionCCO = $data['observacion'];
            $pedido = $data['pedido'];

            $stmt = $this->_DB->prepare("UPDATE NovedadesVisitas SET observacionCCO = :observacionCCO WHERE pedido = :pedido");
            $stmt->execute([':observacionCCO' => $observacionCCO, ':pedido' => $pedido]);

            if ($stmt->rowCount() == 1) {
                $response = ['state' => 1, 'text' => 'Novedad actualizada'];
            } else {
                $response = ['state' => 0, 'text' => 'Error'];
            }

        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_DB = null;
        echo json_encode($response);
    }

    public function csvNovedadesTecnico($data)
    {

        if (empty($data['fechaini']) && empty($data['fechafin'])) {
            $fechaini = date('Y-m-d');
            $fechafin = date('Y-m-d');
        } else {
            $fechaini = $data['fechaini'];
            $fechafin = $data['fechafin'];
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
                                              AND n.fecha BETWEEN '$fechaini 00:00:00' AND '$fechafin 23-59-59'");
            $stmt->execute();

            if ($stmt->rowCount()) {
                $response = ['state' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC), 'counter' => $stmt->rowCount()];
            } else {
                $response = ['state' => false, 'msj' => 'No se encontraron registros'];
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
                $response = ['state' => 1, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)];
            } else {
                $response = ['state' => 0, 'msj' => 'No se encontraron registros'];
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
            $stmt = $this->_DB->prepare("SELECT m.municipio
                                            FROM municipios m
                                            INNER JOIN regiones r ON m.codigoRg=r.codigoRg
                                            WHERE r.region = ?
                                            ORDER BY m.municipio");
            $stmt->bindParam(1, $data, PDO::PARAM_STR);
            $stmt->execute();

            if ($stmt->rowCount()) {
                $response = ['state' => true, 'data' => $stmt->fetchAll(PDO::PARAM_STR)];
            } else {
                $response = ['state' => false, 'msj' => 'No se encontraron registros'];
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

                $response = ['state' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)];
            } else {
                $response = ['state' => false, 'msj' => 'No se encontraron registros'];
            }
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
					ORDER BY dnv.detalle");
            $stmt->bindParam(1, $data, PDO::PARAM_STR);
            $stmt->execute();

            if ($stmt->rowCount()) {
                $response = ['state' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)];
            } else {
                $response = ['state' => false, 'msj' => 'No se encontraron registros'];
            }
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_DB = null;
        echo json_encode($response);
    }

    public function BFobservaciones()
    {
        ini_set('session.gc_maxlifetime', 3600); // 1 hour
        session_set_cookie_params(3600);
        session_start();
        $login = $_SESSION['login'];
        $hoy = date("Y-m-d");
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
            $concepto = $data['concepto'];
            $buscar = $data['buscar'];
            $parametro = " and $concepto = '$buscar'";

            $stmt = $this->_DB->query("SELECT c.cedula, c.login, c.nombre, c.password, c.expiraCuenta, c.expirapsw FROM cuentasTecnicos c where 1=1 $parametro");

            $stmt->execute();
            if ($stmt->rowCount()) {
                $response = ['state' => 1, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)];
            } else {
                $response = ['state' => 0];
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
            $datos = $data['datosEdicion'];
            $cedula = $datos['cedula'];
            $pwd = $datos['newpwd'];

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
            /*ini_set('session.gc_maxlifetime', 3600); // 1 hour
            session_set_cookie_params(3600);
            session_start();*/
            $usuarioid = $_SESSION['login'];
            $filename = "ContrasenasTecnicosClick" . "_.csv";

            $stmt = $this->_DB->query("SELECT c.cedula, c.login, c.nombre, c.password, c.expiraCuenta, c.expirapsw
						FROM cuentasTecnicos c");
            $stmt->execute();

            if ($stmt->rowCount()) {
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
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
