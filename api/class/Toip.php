<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
require_once 'conection.php';

class Toip
{

    private $_DB;

    public function __construct()
    {
        $this->_DB = new Conection();
    }

    public function datos($data)
    {
        try {

            /*$pagenum  = $data['page'];
            $pagesize = $data['size'];
            $offset   = ($pagenum - 1) * $pagesize;*/

            $stmt = $this->_DB->query("SELECT * FROM activacion_toip where en_gestion != '2'");
            $stmt->execute();
            $count = $stmt->rowCount();

            $stmt = $this->_DB->query("SELECT * FROM activacion_toip where en_gestion != '2' ORDER BY hora_ingreso");
            $stmt->execute();

            if ($stmt->rowCount()) {
                $response = ['state' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC), 'counter' => $count];
            } else {
                $response = ['state' => false, 'msj' => 'No se encontraron registros'];
            }


        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }

        return $response;
        $this->_DB = null;
    }

    public function marca($data)
    {
        try {
            $user = $data['usuario'];
            $id = $data['id'];

            if (!$user) {
                $response = ['state' => false, 'msj' => 'Inicia session nuevamente para continuar'];
            } else {
                $stmt = $this->_DB->prepare("SELECT en_gestion, login_gestion FROM activacion_toip WHERE id = :id");
                $stmt->execute([':id' => $id]);

                $stmt = $this->_DB->query("SELECT login FROM usuarios WHERE perfil = '11'");
                $stmt->execute();
                $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
                $usuarios_array = array_column($res, 'login');

                if ($stmt->rowCount()) {
                    $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
                    if ($res[0]['en_gestion'] == 0) {
                        $stmt = $this->_DB->prepare("UPDATE activacion_toip SET en_gestion = '1', login_gestion = :user, hora_marca = :fecha WHERE id = :id");
                        $stmt->execute([':user' => $user, ':fecha' => date('Y-m-d H:i:s'), ':id' => $id]);
                        if ($stmt->rowCount()) {
                            $response = ['state' => true, 'msj' => 'Pedido bloqueado correctamente'];
                        } else {
                            $response = ['state' => false, 'msj' => 'Ha ocurrido un erro interno intentalo nuevamente en unos minutos'];
                        }
                    } elseif (($res[0]['en_gestion'] == 1) && ($res[0]['login_gestion'] == $user || in_array($user, $usuarios_array))) {
                        $stmt = $this->_DB->prepare("UPDATE activacion_toip SET en_gestion = '0', login_gestion = '' WHERE id = :id");
                        $stmt->execute([':id' => $id]);
                        if ($stmt->rowCount()) {
                            $response = ['state' => true, 'msj' => 'Pedido desbloqueado correctamente'];
                        } else {
                            $response = ['state' => false, 'msj' => 'Ha ocurrido un erro interno intentalo nuevamente en unos minutos'];
                        }
                    } else {
                        $response = ['state' => false, 'msj' => 'El pedido se encuentra bloqueado por otro agente'];
                    }
                } else {
                    $response = ['state' => false, 'msj' => 'El pedido no existe'];
                }
            }

            return $response;

        } catch (PDOException $t) {
            var_dump($t->getMessage());
        }

        $this->_DB = null;

    }

    public function guarda($data)
    {
        try {
            $id = $data['id'];
            $fecha = date('Y-m-d H:i:s');
            $tipificacion = $data['tipificacion'];
            $verifica_tono = $data['verifica_tono'];
            $observacion = $data['observacion'];
            $user = $data['login_gestion'];
            $subtipificacion = $data['subtipificacion'];
            $cerrado_gtc = $data['cerrado_gtc'];


            $stmt = $this->_DB->prepare("SELECT login_gestion FROM activacion_toip WHERE id = :id");
            $stmt->execute([':id' => $id]);
            if ($stmt->rowCount() == 1) {
                $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
                if ($res[0]['login_gestion'] == $user) {
                    $stmt = $this->_DB->prepare("UPDATE activacion_toip SET hora_gestion = :fecha, tipificacion = :tipifica, observacion = :obser, verifica_tono = :verifica, subtipificacion = :subtipificacion, cerrado_gtc = :cerrado_gtc, en_gestion = '2' WHERE id = :id");
                    $stmt->execute([
                        ':fecha' => $fecha,
                        ':tipifica' => $tipificacion,
                        ':obser' => $observacion,
                        ':verifica' => $verifica_tono,
                        ':id' => $id,
                        ':subtipificacion' => $subtipificacion,
                        ':cerrado_gtc' => $cerrado_gtc,
                    ]);
                    if ($stmt->rowCount() == 1) {
                        $response = ['state' => true, 'msj' => 'Pedido guardado correctamente'];
                    } else {
                        $response = ['state' => false, 'msj' => 'Ha ocurrido un erro interno intentalo nuevamente en unos minutos'];
                    }
                } else {
                    $response = ['state' => false, 'msj' => 'El pedido se encuentra en gestión por otro asesor'];

                }
            } else {
                $response = ['state' => false, 'msj' => 'Pedido no existe'];
            }


            return $response;

        } catch (PDOException $r) {
            var_dump($r->getMessage());
        }
        $this->_DB = null;
    }

    public function datosTerminados($data)
    {
        try {

            $pagenum = $data['page'];
            $pagesize = $data['size'];
            $offset = ($pagenum - 1) * $pagesize;

            $con = '';
            if (isset($data['data']['fechaini']) && isset($data['data']['fechafin'])) {
                if ($data['data']['fechaini'] == '' && $data['data']['fechafin'] == '') {
                    if (isset($data['data']['pedido'])) {
                        $con;
                    }
                } else {
                    if (isset($data['data']['pedido'])) {
                    } else {
                        $fechaini = $data['data']['fechaini'];
                        $fechafin = $data['data']['fechafin'];

                        $con = " and hora_ingreso BETWEEN '$fechaini 00:00:00' AND '$fechafin 23:59:59' ";
                    }
                }

            }

            if (isset($data['data']['pedido'])) {
                $pedido = $data['data']['pedido'];
                $con .= " AND pedido = '$pedido' OR tarea = '$pedido'";
            }

            if (isset($data['data']['filtro'])) {
                if ($data['data']['filtro'] == 'Gestionados') {
                    $con .= "AND en_gestion = 2 ";
                } elseif ($data['data']['filtro'] == 'Sin gestionar') {
                    $con .= "AND en_gestion IN (0,1)";
                } elseif ($data['data']['filtro'] == 'Todos') {

                }
            } else {
                $con .= "AND en_gestion = 2 ";
            }
            if (isset($data['export'])) {
                $count = 1;
                $stmt = $this->_DB->query("SELECT * FROM activacion_toip where 1=1 $con  ORDER BY hora_ingreso desc");
                $stmt->execute();
            } else {

                $stmt = $this->_DB->query("SELECT * FROM activacion_toip where 1=1 $con ORDER BY hora_ingreso desc");
                $stmt->execute();
                $count = $stmt->rowCount();

                $stmt = $this->_DB->query("SELECT * FROM activacion_toip where 1=1 $con  ORDER BY hora_ingreso desc LIMIT $offset, $pagesize");
                $stmt->execute();
            }


            if ($stmt->rowCount()) {
                $response = ['state' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC), 'counter' => $count];
            } else {
                $response = ['state' => false, 'msj' => 'No se encontraron registros'];
            }


        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }

        return $response;
        $this->_DB = null;
    }

    public function graficos($data)
    {
        $con = '';
        if (isset($data['accion'])) {
            if ($data['accion'] == 'no') {
                $con = " AND tipificacion = 'No funciono' ";
            } elseif ($data['accion'] == 'si') {
                $con = " AND tipificacion != 'No funciono' AND subtipificacion in ('Cm_offline','Garantía instalación','Se requiere reiniciar')";
            }
        } else {
            $con = " AND tipificacion != 'No funciono' ";
        }

        if (isset($data['fecha'])) {
            $fecha = $data['fecha'];
        } else {
            $fecha = date('Y-m-d');
        }

        try {
            $stmt = $this->_DB->prepare("SELECT
                                                    tipificacion,
                                                    COUNT(*) AS count 
                                                FROM
                                                    activacion_toip 
                                                WHERE
                                                    en_gestion = '2' 
                                                    AND hora_gestion BETWEEN '$fecha 00:00:00' 
                                                    AND '$fecha 23:59:59' 
                                                GROUP BY
                                                    tipificacion;");
            $stmt->execute();
            if ($stmt->rowCount()) {
                $response = ['state' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)];
            } else {
                $response = ['state' => false, 'msj' => 'No se encontraron datos'];
            }
            $this->_DB = '';

            return $response;
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
    }

    public function graficoTiempo($data)
    {
        try {
            if (isset($data['fecha'])) {
                $fecha = $data['fecha'];
            } else {
                $fecha = date('Y-m-d');
            }
            $stmt = $this->_DB->prepare("SELECT
                                                    subtipificacion,
                                                    COUNT(*) AS count 
                                                FROM
                                                    activacion_toip 
                                                WHERE
                                                    en_gestion = '2' 
                                                    AND hora_gestion BETWEEN '$fecha 00:00:00' 
                                                    AND '$fecha 23:59:59' AND tipificacion = 'Aprovisionado por contingencia' AND subtipificacion != ''
                                                GROUP BY
                                                    subtipificacion;");
            $stmt->execute();
            if ($stmt->rowCount()) {
                $response = ['state' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)];
            } else {
                $response = ['state' => false, 'msj' => 'No se encontraron datos'];
            }
            $this->_DB = '';

            return $response;
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
    }

    public function gestionPorHora($data)
    {
        try {
            if (isset($data['fecha'])) {
                $fecha = $data['fecha'];
            } else {
                $fecha = date('Y-m-d');
            }

            $con = '';
            if (isset($data['estado']) && ($data['estado'] == 'Aprovisionamiento automático')) {
                $con = " AND p.tipificacion = 'Aprovisionamiento automático' ";
            } elseif (isset($data['estado']) && ($data['estado'] == 'Aprovisionado por contingencia')) {
                $con = " AND p.tipificacion = 'Aprovisionado por contingencia' ";
            } elseif (isset($data['estado']) && ($data['estado'] == 'ALL')) {
                $con = " ";
            }
            $stmt = $this->_DB->prepare("SELECT 
                                                C2.USUARIO
                                                , COUNT(*) AS CANTIDAD
                                                , SUM(CASE WHEN (C2.RANGO_PENDIENTE) >= 0 AND (C2.RANGO_PENDIENTE) <= 6 THEN 1 ELSE 0 END) AS 'am06' 
                                                , SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 6 AND (C2.RANGO_PENDIENTE) <= 7 THEN 1 ELSE 0 END) AS 'am07' 
                                                , SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 7 AND (C2.RANGO_PENDIENTE) <= 8 THEN 1 ELSE 0 END) AS 'am08' 
                                                , SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 8 AND (C2.RANGO_PENDIENTE) <= 9 THEN 1 ELSE 0 END) AS 'am09' 
                                                , SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 9 AND (C2.RANGO_PENDIENTE) <= 10 THEN 1 ELSE 0 END) AS 'am10' 
                                                , SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 10 AND (C2.RANGO_PENDIENTE) <= 11 THEN 1 ELSE 0 END) AS 'am11' 
                                                , SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 11 AND (C2.RANGO_PENDIENTE) <= 12 THEN 1 ELSE 0 END) AS 'am12' 
                                                , SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 12 AND (C2.RANGO_PENDIENTE) <= 13 THEN 1 ELSE 0 END) AS 'pm01' 
                                                , SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 13 AND (C2.RANGO_PENDIENTE) <= 14 THEN 1 ELSE 0 END) AS 'pm02' 
                                                , SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 14 AND (C2.RANGO_PENDIENTE) <= 15 THEN 1 ELSE 0 END) AS 'pm03' 
                                                , SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 15 AND (C2.RANGO_PENDIENTE) <= 16 THEN 1 ELSE 0 END) AS 'pm04' 
                                                , SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 16 AND (C2.RANGO_PENDIENTE) <= 17 THEN 1 ELSE 0 END) AS 'pm05' 
                                                , SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 17 AND (C2.RANGO_PENDIENTE) <= 18 THEN 1 ELSE 0 END) AS 'pm06' 
                                                , SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 18 AND (C2.RANGO_PENDIENTE) <= 19 THEN 1 ELSE 0 END) AS 'pm07' 
                                                , SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 19 AND (C2.RANGO_PENDIENTE) <= 20 THEN 1 ELSE 0 END) AS 'pm08' 
                                                , SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 20 AND (C2.RANGO_PENDIENTE) <= 21 THEN 1 ELSE 0 END) AS 'pm09' 
                                                , SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 21 THEN 1 ELSE 0 END) AS 'Masde09'
                                                FROM(
                                                SELECT 
                                                        p.login_gestion AS USUARIO, DATE_FORMAT(p.hora_gestion, '%H') AS RANGO_PENDIENTE, 
                                                        p.tipificacion AS prod
                                                FROM activacion_toip p
                                                WHERE 1=1 AND p.hora_gestion BETWEEN '$fecha 00:00:00' AND '$fecha 23:59:59' $con) C2
                                                GROUP BY C2.USUARIO
                                                ORDER BY  CANTIDAD DESC");
            $stmt->execute();
            if ($stmt->rowCount()) {
                $response = ['state' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)];
            } else {
                $response = ['state' => false, 'msj' => 'No se encontraron datos'];
            }
            $this->_DB = '';

            return $response;
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
    }

    public function registro_15()
    {
        try {
            $stmt = $this->_DB->query("SELECT
                                                      DATE(hora_ingreso) AS fecha,
                                                      SUM(CASE WHEN TIMESTAMPDIFF(HOUR, hora_ingreso, hora_gestion) = 0 THEN 1 ELSE 0 END) AS '0',
                                                      SUM(CASE WHEN TIMESTAMPDIFF(HOUR, hora_ingreso, hora_gestion) = 1 THEN 1 ELSE 0 END) AS '1',
                                                      SUM(CASE WHEN TIMESTAMPDIFF(HOUR, hora_ingreso, hora_gestion) = 2 THEN 1 ELSE 0 END) AS '2',
                                                      SUM(CASE WHEN TIMESTAMPDIFF(HOUR, hora_ingreso, hora_gestion) = 3 THEN 1 ELSE 0 END) AS '3',
                                                      SUM(CASE WHEN TIMESTAMPDIFF(HOUR, hora_ingreso, hora_gestion) = 4 THEN 1 ELSE 0 END) AS '4',
                                                      SUM(CASE WHEN TIMESTAMPDIFF(HOUR, hora_ingreso, hora_gestion) = 5 THEN 1 ELSE 0 END) AS '5',
                                                      SUM(CASE WHEN TIMESTAMPDIFF(HOUR, hora_ingreso, hora_gestion) = 6 THEN 1 ELSE 0 END) AS '6',
                                                      SUM(CASE WHEN TIMESTAMPDIFF(HOUR, hora_ingreso, hora_gestion) = 7 THEN 1 ELSE 0 END) AS '7',
                                                      SUM(CASE WHEN TIMESTAMPDIFF(HOUR, hora_ingreso, hora_gestion) = 8 THEN 1 ELSE 0 END) AS '8',
                                                      SUM(CASE WHEN TIMESTAMPDIFF(HOUR, hora_ingreso, hora_gestion) = 9 THEN 1 ELSE 0 END) AS '9',
                                                      SUM(CASE WHEN TIMESTAMPDIFF(HOUR, hora_ingreso, hora_gestion) >= 10 THEN 1 ELSE 0 END) AS '10'
                                                    FROM activacion_toip
                                                    WHERE hora_ingreso BETWEEN DATE_SUB(NOW(), INTERVAL 15 DAY) AND NOW()
                                                    GROUP BY fecha
                                                    ORDER BY fecha;");

            $stmt->execute();
            if ($stmt->rowCount()) {
                $response = ['state' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)];
            } else {
                $response = ['state' => false, 'msj' => 'No se encontraron datos'];
            }
            $this->_DB = '';

            return $response;
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
    }

    public function consolidado($data)
    {


        try {

            if (isset($data['fecha'])) {
                $fecha = $data['fecha'];
            } else {
                $fecha = date('Y-m-d');
            }
            $stmt = $this->_DB->prepare("SELECT
                                                      DATE(hora_ingreso) AS fecha, tipificacion,
                                                      SUM(CASE WHEN TIMESTAMPDIFF(HOUR, hora_ingreso, hora_gestion) = 0 THEN 1 ELSE 0 END) AS '0',
                                                      SUM(CASE WHEN TIMESTAMPDIFF(HOUR, hora_ingreso, hora_gestion) = 1 THEN 1 ELSE 0 END) AS '1',
                                                      SUM(CASE WHEN TIMESTAMPDIFF(HOUR, hora_ingreso, hora_gestion) = 2 THEN 1 ELSE 0 END) AS '2',
                                                      SUM(CASE WHEN TIMESTAMPDIFF(HOUR, hora_ingreso, hora_gestion) = 3 THEN 1 ELSE 0 END) AS '3',
                                                      SUM(CASE WHEN TIMESTAMPDIFF(HOUR, hora_ingreso, hora_gestion) = 4 THEN 1 ELSE 0 END) AS '4',
                                                      SUM(CASE WHEN TIMESTAMPDIFF(HOUR, hora_ingreso, hora_gestion) = 5 THEN 1 ELSE 0 END) AS '5',
                                                      SUM(CASE WHEN TIMESTAMPDIFF(HOUR, hora_ingreso, hora_gestion) = 6 THEN 1 ELSE 0 END) AS '6',
                                                      SUM(CASE WHEN TIMESTAMPDIFF(HOUR, hora_ingreso, hora_gestion) = 7 THEN 1 ELSE 0 END) AS '7',
                                                      SUM(CASE WHEN TIMESTAMPDIFF(HOUR, hora_ingreso, hora_gestion) = 8 THEN 1 ELSE 0 END) AS '8',
                                                      SUM(CASE WHEN TIMESTAMPDIFF(HOUR, hora_ingreso, hora_gestion) = 9 THEN 1 ELSE 0 END) AS '9',
                                                      SUM(CASE WHEN TIMESTAMPDIFF(HOUR, hora_ingreso, hora_gestion) >= 10 THEN 1 ELSE 0 END) AS '10'
                                                    FROM activacion_toip
                                                    WHERE hora_ingreso BETWEEN '$fecha 00:00:00' AND '$fecha 23:59:59' AND tipificacion != ''
                                                    GROUP BY fecha, tipificacion
                                                    ORDER BY fecha, tipificacion;");

            $stmt->execute();
            if ($stmt->rowCount()) {
                $response = ['state' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)];
            } else {
                $response = ['state' => false, 'msj' => 'No se encontraron datos'];
            }
            $this->_DB = '';

            return $response;
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
    }

    public function detalles_contingencias($data)
    {
        try {
            if (isset($data['fecha'])) {
                $fecha = $data['fecha'];
            } else {
                $fecha = date('Y-m-d');
            }
            $stmt = $this->_DB->prepare("SELECT DATE
                                                    ( hora_ingreso ) AS fecha,
                                                    subtipificacion,
                                                    SUM( CASE WHEN TIMESTAMPDIFF( HOUR, hora_ingreso, hora_gestion ) = 0 THEN 1 ELSE 0 END ) AS '0',
                                                    SUM( CASE WHEN TIMESTAMPDIFF( HOUR, hora_ingreso, hora_gestion ) = 1 THEN 1 ELSE 0 END ) AS '1',
                                                    SUM( CASE WHEN TIMESTAMPDIFF( HOUR, hora_ingreso, hora_gestion ) = 2 THEN 1 ELSE 0 END ) AS '2',
                                                    SUM( CASE WHEN TIMESTAMPDIFF( HOUR, hora_ingreso, hora_gestion ) = 3 THEN 1 ELSE 0 END ) AS '3',
                                                    SUM( CASE WHEN TIMESTAMPDIFF( HOUR, hora_ingreso, hora_gestion ) = 4 THEN 1 ELSE 0 END ) AS '4',
                                                    SUM( CASE WHEN TIMESTAMPDIFF( HOUR, hora_ingreso, hora_gestion ) = 5 THEN 1 ELSE 0 END ) AS '5',
                                                    SUM( CASE WHEN TIMESTAMPDIFF( HOUR, hora_ingreso, hora_gestion ) = 6 THEN 1 ELSE 0 END ) AS '6',
                                                    SUM( CASE WHEN TIMESTAMPDIFF( HOUR, hora_ingreso, hora_gestion ) = 7 THEN 1 ELSE 0 END ) AS '7',
                                                    SUM( CASE WHEN TIMESTAMPDIFF( HOUR, hora_ingreso, hora_gestion ) = 8 THEN 1 ELSE 0 END ) AS '8',
                                                    SUM( CASE WHEN TIMESTAMPDIFF( HOUR, hora_ingreso, hora_gestion ) = 9 THEN 1 ELSE 0 END ) AS '9',
                                                    SUM( CASE WHEN TIMESTAMPDIFF( HOUR, hora_ingreso, hora_gestion ) >= 10 THEN 1 ELSE 0 END ) AS '10' 
                                                FROM
                                                    activacion_toip 
                                                WHERE
                                                    hora_ingreso BETWEEN '$fecha 00:00:00' 
                                                    AND '$fecha 23:59:59' 
                                                    AND subtipificacion != '' 
                                                GROUP BY
                                                    fecha,
                                                    subtipificacion 
                                                ORDER BY
                                                    fecha,
                                                    subtipificacion;");
            $stmt->execute();
            if ($stmt->rowCount()) {
                $response = ['state' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)];
            } else {
                $response = ['state' => false, 'msj' => 'No se encontraron datos'];
            }
            $this->_DB = '';

            return $response;
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
    }


}
