<?php
require_once 'conection.php';

class GestionQuejasGo
{
    private $_DB;

    public function __construct()
    {
        $this->_DB = new Conection();
    }

    public function datosQuejasGo()
    {
        try {
            //ini_set('memory_limit', '264M');

            //ini_set('memory_limit', '256M');
            //error_reporting(E_ALL);
            //ini_set('display_errors', 1);
            //ini_set('memory_limit', '1024M');
            //ini_set('session.gc_maxlifetime', 3600); // 1 hour
            //session_set_cookie_params(3600);
            //session_start();
            //var_dump($data);exit();
            /*if (!$_SESSION) {
                $response = ['state' => 99, 'title' => 'Su session ha caducado', 'text' => 'Inicia session nuevamente para continuar'];
            } else {*/
            /* $query = "SELECT *
                            FROM quejasgo
                            WHERE 1=1 and en_gestion != 2 ORDER BY fecha DESC"; */

            /*$stmt = $this->_DB->query("SELECT *
					FROM quejasgo
					WHERE 1=1 and en_gestion = '0' OR en_gestion = '1' ORDER BY fecha");*/

            $stmt = $this->_DB->query("SELECT
                                                    q.*,
                                                CASE
                                                        
                                                        WHEN (
                                                        SELECT
                                                            COUNT(*) 
                                                        FROM
                                                            quejasgo c1 
                                                        WHERE
                                                            q.pedido = c1.pedido 
                                                            AND c1.fecha >= DATE_SUB( CURDATE(), INTERVAL 10 DAY ) 
                                                            AND c1.en_gestion = '2' 
                                                            ) > 0 THEN
                                                            'TRUE' ELSE 'FALSE' 
                                                        END alerta 
                                                FROM
                                                    quejasgo q 
                                                WHERE
                                                    1 = 1 
                                                    AND en_gestion = '0' 
                                                    OR en_gestion = '1' 
                                                ORDER BY
                                                    q.fecha");


            $stmt->execute();


            //$stmt = $this->_DB->query($query);

            if ($stmt->rowCount() > 0) {
                $response = array('state' => 1, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC));
            } else {
                $response = array('state' => 0, 'msj' => "No se encontraron registros");
            }
            /*}*/

        } catch (PDOException $th) {
            var_dump($th->getMessage());
        }
        $this->_DB = '';
        echo json_encode($response);
    }

    public function datosQuejasGoTerminado($data)
    {
        try {
            /*ini_set('session.gc_maxlifetime', 3600); // 1 hour
            session_set_cookie_params(3600);
            session_start();*/
            $pagenum = $data['page'];
            $pagesize = $data['size'];
            $offset = ($pagenum - 1) * $pagesize;
            $search = $data['search'];
            $pedido = $data['pedido'];
            $fecha = $data['fecha'];

            $condicion = '';

            if (!empty($pedido)) {
                $condicion = " AND pedido = '$pedido' ";
            } elseif (!empty($fecha)) {
                $fechaIni = $fecha['fechaini'];
                $fechaFin = $fecha['fechafin'];
                $condicion = " AND fecha BETWEEN '$fechaIni 00:00:00' and '$fechaFin 23:59:59'  ";
            }

            $stmt = $this->_DB->query("SELECT * FROM quejasgo where en_gestion = 2");
            $stmt->execute();
            $count = $stmt->rowCount();

            $stmt = $this->_DB->query("SELECT * FROM quejasgo WHERE 1=1 AND en_gestion = 2 $condicion ORDER BY fecha DESC LIMIT $offset, $pagesize");
            $stmt->execute();
            if ($stmt->rowCount()) {
                $response = array('state' => 1, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC), 'totalCount' => $count);
            } else {
                $response = array('state' => 0, 'data' => 'No se encontraron datos');
            }
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_DB = '';
        echo json_encode($response);
    }

    public function marcarEnGestionQuejasGo($data)
    {
        try {

            //$data = json_decode(file_get_contents('php://input'), true);
            /*ini_set('session.gc_maxlifetime', 86400); // 1 day
            session_set_cookie_params(86400);
			session_start();*/
            $login_gestion = $data['login_gestion'];
            $id = $data['id'];
            if (!$login_gestion) {
                $res = ['state' => 99, 'title' => 'Su session ha caducado', 'text' => 'Inicia session nuevamente para continuar'];
            } else {

                $stmt = $this->_DB->prepare("SELECT q.en_gestion, q.asesor, q.pedido,
                                                    CASE
                                                    WHEN (
                                                    SELECT
                                                        COUNT(*) 
                                                    FROM
                                                        quejasgo c1 
                                                    WHERE
                                                        q.pedido = c1.pedido 
                                                        AND c1.fecha >= DATE_SUB( CURDATE(), INTERVAL 10 DAY ) 
                                                        AND c1.en_gestion = '2' 
                                                        ) > 0 THEN
                                                        true ELSE false
                                                    END alerta FROM quejasgo q WHERE q.id = :id");
                $stmt->execute(array(':id' => $id));
                $response = $stmt->fetchAll(PDO::FETCH_ASSOC);

                $stmt = $this->_DB->query("SELECT login FROM usuarios WHERE perfil = '11'");
                $stmt->execute();
                $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
                $usuarios_array = array_column($res, 'login');
                $alerta = $response[0]['alerta'];

                if ($response[0]['asesor'] == '' && $response[0]['en_gestion'] == 0) {
                    $stmt = $this->_DB->prepare("UPDATE quejasgo SET en_gestion = 1, asesor = :login_gestion, fecha_marca = :fecha_marca WHERE id = :id");
                    $stmt->execute(array(':id' => $id, ':login_gestion' => $login_gestion, ':fecha_marca' => date('Y-m-d H:i:s')));
                    if ($stmt->rowCount() == 1) {
                        $res = array('state' => 1, 'msj' => 'El pedido ' . $response[0]['pedido'] . ' Ahora esta bloqueado', 'alerta' => $alerta);
                    }
                } elseif (($response[0]['en_gestion'] == 1) && ($response[0]['asesor'] == $login_gestion || in_array($login_gestion, $usuarios_array))) {
                    $stmt = $this->_DB->prepare("UPDATE quejasgo SET en_gestion = 0, asesor = '' WHERE id = :id");
                    $stmt->execute(array(':id' => $id));
                    if ($stmt->rowCount() == 1) {
                        $res = array('state' => 1, 'msj' => 'El pedido ' . $response[0]['pedido'] . ' Ahora esta desbloqueado');
                    }
                } else {
                    $res = array('state' => 0, 'msj' => 'El pedido ' . $response[0]['pedido'] . ' se encuentra en gestión por otro agente');
                }
            }

        } catch (PDOException $th) {
            var_dump($th->getMessage());
        }
        $this->_DB = '';
        echo json_encode($res);
    }

    public function guardaGestionQuejasGo($data)
    {
        try {
            /*ini_set('session.gc_maxlifetime', 3600); // 1 hour
            session_set_cookie_params(3600);
            session_start();*/
            $accion = $data['accion'];
            $gestion = $data['gestion'];
            $id = $data['id'];
            $login_gestion = $data['login_gestion'];
            $observacion_seguimiento = $data['observacion_seguimiento'];
            $tiempo = $data['tiempo'];

            $stmt = $this->_DB->prepare("SELECT asesor FROM quejasgo WHERE id = :id");
            $stmt->execute(array(':id' => $id));
            if ($stmt->rowCount() == 1) {
                $resLogin = $stmt->fetchAll(PDO::FETCH_ASSOC);
                $rlogin = $resLogin[0]['asesor'];

                if ($rlogin != $login_gestion) {
                    $res = array('state' => 0, 'msj' => 'El pedido se encuentra en gestión por otro agente');
                } else {
                    $stmt = $this->_DB->prepare("UPDATE quejasgo SET accion = :accion, 
													                                gestion_asesor = :gestion, 
													                                fecha_gestion = :fecha_gestion,
													                                observacion_gestion = :observacion_gestion,
													                                en_gestion = 2,
													                                duracion =  :tiempo
										        WHERE id = :id");
                    $stmt->execute(
                        array(
                            ':id' => $id,
                            ':accion' => $accion,
                            ':gestion' => $gestion,
                            ':fecha_gestion' => date('Y-m-d H:i:s'),
                            ':observacion_gestion' => $observacion_seguimiento,
                            ':tiempo' => $tiempo
                        )
                    );
                    if ($stmt->rowCount() == 1) {
                        $res = array('state' => 1, 'msj' => 'La solicitud fue guardada correctamente');
                    } else {
                        $res = array('state' => 0, 'msj' => 'Ha ocurrido un error interno inténtalo nuevamente en unos minutos.');
                    }
                }
            } else {
                $res = array('state' => 0, 'msj' => 'No se encontró un agente con el pedido en gestion');
            }

            /* $tipificacion = $data['tipificacion'];
                                                         $obs_tipificacion = $data['obs_tipificacion'];
                                                         $id = $data['id'];
                                                         $login_gestion = $data['login_gestion'];
                                                         $observacion_seguimiento = $data['observacion_seguimiento'];

                                                         $stmt = $this->_DB->prepare("SELECT login_gestion FROM ventasInstaleTiendas WHERE id = :id");
                                                         $stmt->execute(array(':id' => $id));
                                                         if ($stmt->rowCount() == 1) {
                                                             $resLogin = $stmt->fetchAll(PDO::FETCH_ASSOC);
                                                             $rlogin = $resLogin[0]['login_gestion'];

                                                             if ($rlogin != $login_gestion) {
                                                                 $res = array('state' => 0, 'msj' => 'El pedido se encuentra en gestion por otro agente');
                                                             } else {
                                                                 $stmt = $this->_DB->prepare("UPDATE ventasInstaleTiendas SET tipificacion = :tipificacion,
                                                                                                                                 obs_tipificacion = :obs_tipificacion,
                                                                                                                                 login_gestion = :login_gestion,
                                                                                                                                 fecha_gestion = :fecha_gestion,
                                                                                                                                 observacion_gestion = :observacion_gestion,
                                                                                                                                 en_gestion = 2
                                                                                             WHERE id = :id");
                                                                 $stmt->execute(
                                                                     array(
                                                                         ':id' => $id,
                                                                         ':tipificacion' => $tipificacion,
                                                                         ':obs_tipificacion' => $obs_tipificacion,
                                                                         ':login_gestion' => $login_gestion,
                                                                         ':fecha_gestion' => date('Y-m-d H:i:s'),
                                                                         ':observacion_gestion' => $observacion_seguimiento
                                                                     )
                                                                 );
                                                                 if ($stmt->rowCount() == 1) {
                                                                     $res = array('state' => 1, 'msj' => 'La solicitud fue guardada correctamente');
                                                                 } else {
                                                                     $res = array('state' => 0, 'msj' => 'Ha ocurrido un error interno intentalo nuevamente en unos minutos.');
                                                                 }
                                                             }
                                                         } else {
                                                             $res = array('state' => 0, 'msj' => 'No se encontró un agente con el pedido en gestion');
                                                         } */

        } catch (PDOException $th) {
            var_dump($th->getMessage());
        }
        $this->_DB = '';
        echo json_encode($res);
    }

    public function csvQuejaGo($data)
    {
        try {
            /*ini_set('session.gc_maxlifetime', 3600); // 1 hour
            session_set_cookie_params(3600);
            session_start();*/
            $pagenum = $data['page'];
            $pagesize = $data['size'];
            $offset = ($pagenum - 1) * $pagesize;
            $search = $data['search'];
            $pedido = $data['pedido'];
            $fecha = $data['fecha'];

            $condicion = '';

            if (!empty($fecha)) {
                $fechaIni = $fecha['fechaini'];
                $fechaFin = $fecha['fechafin'];
                $condicion = " AND fecha BETWEEN '$fechaIni 00:00:00' and '$fechaFin 23:59:59'  ";
            }


            $stmt = $this->_DB->query("SELECT pedido,
												       cliente,
												       cedtecnico,
												       tecnico,
												       asesor,
												       region,
												       observacion,
													   fecha as fecha_ingreso,
												       fecha_marca,
												       fecha_gestion,
												       observacion_gestion,
												       movil_cliente,
												       doc_cliente,
												       direccion,
												       gestion_asesor
												FROM quejasgo
												WHERE 1 = 1 $condicion AND en_gestion IS NOT NULL
												ORDER BY fecha");
            $stmt->execute();
            if ($stmt->rowCount()) {
                $response = array('state' => 1, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC));
            } else {
                $response = array('state' => 0, 'data' => 'No se encontraron datos');
            }
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        echo json_encode($response);
    }
}
