<?php
error_reporting(0);
ini_set('display_errors', 0);
require_once 'conection.php';

class ETP
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

            $stmt = $this->_DB->query("SELECT * FROM etp where status_soporte != '2'");
            $stmt->execute();
            $count = $stmt->rowCount();

            $stmt = $this->_DB->query("SELECT
                                                e.*,
                                                CASE
                                                    
                                                    WHEN (
                                                    SELECT
                                                        COUNT(*) 
                                                    FROM
                                                        etp c1 
                                                    WHERE
                                                        c1.tarea = e.tarea 
                                                        AND c1.fecha_crea >= DATE_SUB( CURDATE(), INTERVAL 10 DAY ) 
                                                        AND c1.status_soporte = '2' 
                                                        ) > 0 THEN
                                                        'TRUE' ELSE 'FALSE' 
                                                    END alerta,
                                                    (SELECT
                                                        COUNT(*) 
                                                        FROM
                                                            etp c1 
                                                        WHERE
                                                            c1.tarea = e.tarea 
                                                            AND c1.fecha_crea >= DATE_SUB( CURDATE(), INTERVAL 10 DAY ) 
                                                            AND c1.status_soporte = '2' 
                                                    ) as counter
                                            FROM
                                                etp e
                                            WHERE
                                                e.status_soporte != '2' 
                                            ORDER BY
                                                e.fecha_crea");
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

            if (empty($user)) {
                $response = ['state' => false, 'msj' => 'Su session ha caducado. Inicia session nuevamente para continuar'];
            } else {

                $stmt = $this->_DB->query("SELECT login FROM usuarios WHERE perfil = '11'");
                $stmt->execute();
                $res1 = $stmt->fetchAll(PDO::FETCH_ASSOC);
                $usuarios_array = array_column($res1, 'login');

                $stmt = $this->_DB->prepare("SELECT status_soporte, login_gestion FROM etp WHERE id_soporte = :id");
                $stmt->execute([':id' => $id]);

                if ($stmt->rowCount()) {
                    $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
                    if ($res[0]['status_soporte'] == 0) {

                        $stmt = $this->_DB->prepare("UPDATE etp SET status_soporte = '1', login_gestion = :user, fecha_marca = :fecha WHERE id_soporte = :id");
                        $stmt->execute([':user' => $user, ':fecha' => date('Y-m-d H:i:s'), ':id' => $id]);
                        if ($stmt->rowCount()) {
                            $response = ['state' => true, 'msj' => 'Pedido bloqueado correctamente'];
                        } else {
                            $response = ['state' => false, 'msj' => 'Ha ocurrido un erro interno intentalo nuevamente en unos minutos'];
                        }
                    } elseif (($res[0]['status_soporte'] == '1') && ($res[0]['login_gestion'] == $user || in_array($user, $usuarios_array))) {
                        $stmt = $this->_DB->prepare("UPDATE etp SET status_soporte = '0', login_gestion = null WHERE id_soporte = :id");
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

    public function damePedidoetp($data)
    {
        try {
            $login = $data;

            if (!$login) {
                $data = ['state' => 99, 'title' => 'Su session ha expirado', 'text' => 'Inicia session nuevamente para continuar'];
                echo json_encode($data);
                exit();
            }

            $stmt = $this->_DB->query("SELECT
											c.id_soporte,
											c.tarea
										FROM
											seguimientopedidos.etp c 
										WHERE
											 c.tarea <> '' 
											AND login_gestion IS NULL 
										ORDER BY
											c.fecha_crea limit 1");
            $stmt->execute();

            if ($stmt->rowCount() === 1) {

                $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
                $id_soporte = $res[0]['id_soporte'];
                $tarea = $res[0]['tarea'];

                $stmt = $this->_DB->prepare("UPDATE etp SET status_soporte = '1', login_gestion = :login, fecha_marca = :fecha WHERE id_soporte = :id");
                $stmt->execute([':login' => $login, ':fecha' => date('Y-m-d H:i:s'), ':id' => $id_soporte]);

                if ($stmt->rowCount() == 1) {
                    $response = ['state' => true, 'title' => 'Bien', 'text' => 'Se le asigna la ' . $tarea . ' al asesor ' . $login];
                } else {
                    $response = ['state' => false, 'title' => 'Opss..', 'text' => 'Ha ocurrido un error interno intentalo nuevamente'];
                }
            } else {
                $response = ['state' => false, 'title' => 'Opss..', 'text' => 'No se encontrarón registros disponibles'];
            }

            $this->_DB = '';
            return $response;
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
    }

    public function guarda($data)
    {
        try {
            $id = $data['id_soporte'];
            $fecha = date('Y-m-d H:i:s');
            $tipificaciones = $data['tipificaciones'];
            $tipificaciones = implode(',', $tipificaciones);
            $tipificaciones2 = $data['tipificaciones2'];
            $observacion = $data['observacion'];
            $user = $data['login_gestion'];

            if (!$user) {
                $response = ['state' => false, 'msj' => 'Su session e expirado inicia session nuevamente para continuar'];
            } else {
                //echo $id.$tipificaciones.$tipificaciones2.$observacion.$user;exit();
                $stmt = $this->_DB->prepare("SELECT login_gestion FROM etp WHERE id_soporte = :id");
                $stmt->execute([':id' => $id]);
                if ($stmt->rowCount() == 1) {
                    $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
                    if ($res[0]['login_gestion'] == $user) {
                        $stmt = $this->_DB->prepare("UPDATE etp SET fecha_gestion = :fecha, tipificaciones = :tipificaciones, tipificaciones2 = :tipificaiones2, observacionesGestion = :observacion,  status_soporte = '2' WHERE id_soporte = :id");
                        $stmt->execute([':fecha' => $fecha, ':tipificaciones' => $tipificaciones, ':tipificaiones2' => $tipificaciones2, ':observacion' => $observacion, ':id' => $id]);
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
            }

            $this->_DB = null;
            return $response;

        } catch (PDOException $r) {
            var_dump($r->getMessage());
        }

    }

    public function datosTerminados($data)
    {
        try {

            $pagenum = $data['page'];
            $pagesize = $data['size'];
            $offset = ($pagenum - 1) * $pagesize;

            //$con = " and fecha_crea BETWEEN '$fechaini 00:00:00' AND '$fechafin 23:59:59' ORDER BY fecha_crea LIMIT $offset, $pagesize ";
            if (isset($data['data']['fechaini']) && isset($data['data']['fechafin'])) {
                $fechaini = $data['data']['fechaini'];
                $fechafin = $data['data']['fechafin'];

                $con = " and fecha_crea BETWEEN '$fechaini 00:00:00' AND '$fechafin 23:59:59' ORDER BY fecha_crea LIMIT $offset, $pagesize ";
            } else {
                $fechaini = date('Y-m-d');
                $fechafin = date('Y-m-d');
                $con = " and fecha_crea BETWEEN '$fechaini 00:00:00' AND '$fechafin 23:59:59' ORDER BY fecha_crea LIMIT $offset, $pagesize ";
            }

            if (isset($data['data']['pedido'])) {
                $pedido = $data['data']['pedido'];
                $con = " AND unepedido = '$pedido' ";
            }

            if (isset($data['export'])) {
                $fechaini = $data['data']['fechaini'];
                $fechafin = $data['data']['fechafin'];
                $count = 1;
                $stmt = $this->_DB->query("SELECT * FROM etp where 1=1 and fecha_crea BETWEEN '$fechaini 00:00:00' AND '$fechafin 23:59:59' ORDER BY fecha_crea");
                $stmt->execute();
            } else {
                //echo "SELECT count(*) as counter FROM etp where 1 = 1 $con";exit();
                $stmt = $this->_DB->query("SELECT count(*) as counter FROM etp where 1 = 1 $con");
                $stmt->execute();
                $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
                $count = $res[0]['counter'];

                $stmt = $this->_DB->query("SELECT * FROM etp where 1=1 $con");
                $stmt->execute();
            }


            if ($stmt->rowCount()) {
                $response = ['state' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC), 'counter' => $count];
            } else {
                $response = ['state' => false, 'msj' => 'No se encontraron registros'];
            }

            $this->_DB = null;

        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }

        return $response;

    }

    public function datosTerminadosRegistros($data)
    {
        try {

            $pagenum = $data['page'];
            $pagesize = $data['size'];
            $offset = ($pagenum - 1) * $pagesize;

            if (isset($data['data']['fechaini']) && isset($data['data']['fechafin'])) {
                $fechaini = $data['data']['fechaini'];
                $fechafin = $data['data']['fechafin'];

                $con = " and fecha_crea BETWEEN '$fechaini 00:00:00' AND '$fechafin 23:59:59' ";
            } else {
                $fechaini = date('Y-m-d');
                $fechafin = date('Y-m-d');
                $con = " and fecha_crea BETWEEN '$fechaini 00:00:00' AND '$fechafin 23:59:59' ";
            }

            if (isset($data['data']['pedido'])) {
                $pedido = $data['data']['pedido'];
                $con = " AND unepedido = '$pedido' ";
            }

            if (isset($data['export'])) {
                $count = 1;
                $stmt = $this->_DB->query("SELECT * FROM etp where 1=1 $con and status_soporte = '2' ORDER BY fecha_crea desc ");
                $stmt->execute();
            } else {
                $stmt = $this->_DB->query("SELECT * FROM etp where 1=1 $con and status_soporte = '2' ORDER BY fecha_crea");
                $stmt->execute();
                $count = $stmt->rowCount();

                $stmt = $this->_DB->query("SELECT * FROM etp where 1=1 $con AND status_soporte = '2' ORDER BY fecha_crea LIMIT $offset, $pagesize");
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

    public function graphic($data)
    {

        if (isset($data['fecha'])) {
            $fecha = $data['fecha'];
        } else {
            $fecha = date('Y-m-d');
        }

        try {
            $stmt = $this->_DB->prepare("SELECT
                                                    e.tipificaciones,
                                                    COUNT(*) AS count 
                                                FROM
                                                    etp e 
                                                WHERE 1 = 1
                                                    AND e.fecha_gestion BETWEEN '$fecha 00:00:00' 
                                                    AND '$fecha 23:59:59' 
                                                GROUP BY
                                                    tipificaciones
                                                ORDER BY count DESC");
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

    public function graphicDetails($data)
    {

        if (isset($data['fecha'])) {
            $fecha = $data['fecha'];
        } else {
            $fecha = date('Y-m-d');
        }

        try {
            $stmt = $this->_DB->prepare("SELECT
                                                CASE
                                                        e.tipificaciones2 
                                                        WHEN 'Finalizado' THEN
                                                        'Finalizado' 
                                                        WHEN 'Devuelto al técnico' THEN
                                                        'Devuelto al técnico' 
                                                        WHEN 'Incompleto' THEN 'Incompleto'
                                                        ELSE 'Sin gestión' 
                                                    END AS tipificacion,
                                                    COUNT(*) AS count 
                                                FROM
                                                    etp e 
                                                WHERE
                                                    e.fecha_crea BETWEEN '$fecha 00:00:00' 
                                                    AND '$fecha 23:59:59' 
                                                GROUP BY
                                                    tipificaciones2;");
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
                                                        p.login_gestion AS USUARIO, DATE_FORMAT(p.fecha_gestion, '%H') AS RANGO_PENDIENTE, 
                                                        p.tipificaciones AS prod
                                                FROM etp p
                                                WHERE 1=1 AND p.fecha_gestion BETWEEN '$fecha 00:00:00' AND '$fecha 23:59:59') C2
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

}
