<?php
require_once '../class/conection.php';
//error_reporting(E_ALL);
//ini_set('display_errors', 1);
class soporteGpon
{

    private $_DB;

    public function __construct()
    {
        $this->_DB = new Conection();
    }

    public function getSoporteGponByTask($data)
    {
        try {
            ini_set('session.gc_maxlifetime', 3600); // 1 hour
            session_set_cookie_params(3600);
            session_start();
            $task = $data;

            /*LOGICA QUE LLEVA LA INFORMACION A TV, INTERNET-ToIp Y CORREGIR PORTAFOLIO*/
            $stmt = $this->_DB->prepare("SELECT wt.UNEPedido,
                                                   wt2.Name 'categoria',
                                                   wt.UNEMunicipio,
                                                   wt.UNEProductos,
                                                   wt.EngineerID,
                                                   wt.EngineerName,
                                                   we.MobilePhone,
                                                   wu2.SerialNo,
                                                   wu2.MAC,
                                                   wu2.TipoEquipo,
                                                   wu3.VelocidadNavegacion,
                                                   wts.Name 'status',
                                                   wu.UNEPlanProducto
                                            FROM W6TASKS wt
                                                     INNER JOIN W6TASK_STATUSES wts ON wts.W6Key = wt.Status
                                                     LEFT JOIN W6TASKTYPECATEGORY wt2 ON wt2.W6Key = wt.TaskTypeCategory
                                                     LEFT JOIN W6UNESERVICES wu ON wu.ParentTaskCallID = wt.CallID
                                                     LEFT JOIN W6ENGINEERS we ON we.ID = wt.EngineerID
                                                     LEFT JOIN W6UNEEQUIPMENTUSED wu2 ON wu2.TaskCallID = wt.CallID
                                                     LEFT JOIN W6UNESERVICES wu3 ON wu3.ParentTaskCallID = wt.CallID
                                            WHERE wt.CallID = :task
                                              AND wts.Name = 'En Sitio'
                                              AND wu2.TipoEquipo IS NOT NULL
                                              AND wu3.VelocidadNavegacion IS NOT NULL
                                            GROUP BY wt.UNEPedido, 
                                                     wt2.Name, 
                                                     wt.UNEMunicipio, 
                                                     wt.UNEProductos, 
                                                     wt.EngineerID, 
                                                     wt.EngineerName, 
                                                     we.MobilePhone, 
                                                     wu2.SerialNo, 
                                                     wu2.MAC, 
                                                     wu2.TipoEquipo, 
                                                     wu3.VelocidadNavegacion,
                                                     wts.Name, 
                                                     wu.UNEPlanProducto");

            $stmt->execute([
                ':task' => $task,
            ]);

            if ($stmt->rowCount()) {

                $response = [$stmt->fetchAll(PDO::FETCH_ASSOC), 201];
            } else {
                $response = ['', 201];
            }
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_DB = null;
        echo json_encode($response);
    }

    public function validarLlenadoSoporteGpon($data)
    {
        try {
            ini_set('session.gc_maxlifetime', 3600); // 1 hour
            session_set_cookie_params(3600);
            session_start();
            $stmt = $this->_DB->prepare("SELECT id_soporte, tarea, unepedido FROM soporte_gpon WHERE tarea = :task ORDER BY fecha_creado DESC LIMIT 1;");
            $stmt->execute([
                ':task' => $data,
            ]);
            if ($stmt->rowCount()) {
                $response = [$stmt->fetchAll(PDO::FETCH_ASSOC), 201];
            } else {
                $response = ['', 400];
            }
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_DB = null;
        echo json_encode($response);
    }

    public function postPendientesSoporteGpon($params)
    {

        try {
            ini_set('session.gc_maxlifetime', 3600); // 1 hour
            session_set_cookie_params(3600);
            session_start();
            $task = $params['task'];
            $arpon = $params['arpon'];
            $nap = $params['nap'];
            $hilo = $params['hilo'];
            $internet1 = $params['internet1'];
            $internet2 = $params['internet2'];
            $internet3 = $params['internet3'];
            $internet4 = $params['internet4'];
            $television1 = $params['television1'];
            $television2 = $params['television2'];
            $television3 = $params['television3'];
            $television4 = $params['television4'];
            $numeroContacto = $params['numeroContacto'];
            $nombreContacto = $params['nombreContacto'];
            $user_id = $params['user_id'];
            $request_id = $params['request_id'];
            $user_identification = $params['user_identification'];
            $fecha_solicitud = $params['fecha_solicitud'];
            $unepedido = $params['unepedido'];
            $tasktypecategory = $params['tasktypecategory'];
            $unemunicipio = $params['unemunicipio'];
            $uneproductos = $params['uneproductos'];
            $datoscola = $params['datoscola'];
            $engineer_id = $params['engineer_id'];
            $engineer_name = $params['engineer_name'];
            $mobile_phone = $params['mobile_phone'];
            $serial = $params['serial'];
            $mac = $params['mac'];
            $tipo_equipo = $params['tipo_equipo'];
            $velocidad_navegacion = $params['velocidad_navegacion'];
            $observacionTerreno = $params['observacionTerreno'];

            $fecha_creado = date('Y-m-d H:i:s');
            $hoy = date('Y-m-d');

            $stmt = $this->_DB->prepare("SELECT *
                                            FROM soporte_gpon
                                            WHERE tarea = :task
                                              AND status_soporte = '0'");
            $stmt->execute([
                ':task' => $task
            ]);

            if ($stmt->rowCount()) {

                $res = $stmt->fetch(PDO::FETCH_OBJ);
                $idsupport = $res->id_soporte;

                $stmt1 = $this->_DB->prepare("UPDATE soporte_gpon
                                                    SET unepedido            = :unepedido,
                                                        tasktypecategory     = :tasktypecategory,
                                                        unemunicipio         = :unemunicipio,
                                                        uneproductos         = :uneproductos,
                                                        datoscola            = :datoscola,
                                                        engineer_id          = :engineer_id,
                                                        engineer_name        = :engineer_name,
                                                        mobile_phone         = :mobile_phone,
                                                        serial               = :serial,
                                                        mac                  = :mac,
                                                        tipo_equipo          = :tipo_equipo,
                                                        velocidad_navegacion = :velocidad_navegacion,
                                                        observacion_terreno  = :observacionTerreno
                                                    WHERE id_soporte = :idsupport");
                $stmt1->execute([
                    ':unepedido' => $unepedido,
                    ':tasktypecategory' => $tasktypecategory,
                    ':unemunicipio' => $unemunicipio,
                    ':uneproductos' => $uneproductos,
                    ':datoscola' => $datoscola,
                    ':engineer_id' => $engineer_id,
                    ':engineer_name' => $engineer_name,
                    ':mobile_phone' => $mobile_phone,
                    ':serial' => $serial,
                    ':mac' => $mac,
                    ':tipo_equipo' => $tipo_equipo,
                    ':velocidad_navegacion' => $velocidad_navegacion,
                    ':observacionTerreno' => $observacionTerreno,
                    ':idsupport' => $idsupport,
                ]);

                if ($stmt1->rowCount() == 1) {
                    $response = ['type' => 'success', 'msg' => 'OK', 201];
                } else {
                    $response = ['type' => 'Error', 'msg' => '', 400];
                }
            } else {
                $stmt2 = $this->_DB->prepare("INSERT INTO soporte_gpon (tarea, arpon, nap, hilo, port_internet_1, port_internet_2, port_internet_3, port_internet_4, port_television_1, port_television_2, port_television_3,
                          port_television_4, numero_contacto, nombre_contacto, unepedido, tasktypecategory, unemunicipio, uneproductos, datoscola, engineer_id, engineer_name,
                          mobile_phone, serial, mac, tipo_equipo, velocidad_navegacion, user_id_firebase, request_id_firebase, user_identification_firebase, status_soporte,
                          fecha_solicitud_firebase, fecha_creado, observacion_terreno)
                            VALUES (:task, :arpon, :nap, :hilo, :internet1, :internet2, :internet3, :internet4, :television1, :television2, :television3, :television4,
                                    :numeroContacto, :nombreContacto, :unepedido, :tasktypecategory, :unemunicipio, :uneproductos, :datoscola, :engineer_id, :engineer_name, :mobile_phone,
                                    :serial, :mac, :tipo_equipo, :velocidad_navegacion, :user_id, :request_id, :user_identification, '0', :fecha_solicitud, :fecha_creado,
                                    :observacionTerreno)");
                $stmt2->execute([
                    ':task' => $task,
                    ':arpon' => $arpon,
                    ':nap' => $nap,
                    ':hilo' => $hilo,
                    ':internet1' => $internet1,
                    ':internet2' => $internet2,
                    ':internet3' => $internet3,
                    ':internet4' => $internet4,
                    ':television1' => $television1,
                    ':television2' => $television2,
                    ':television3' => $television3,
                    ':television4' => $television4,
                    ':numeroContacto' => $numeroContacto,
                    ':nombreContacto' => $nombreContacto,
                    ':unepedido' => $unepedido,
                    ':tasktypecategory' => $tasktypecategory,
                    ':unemunicipio' => $unemunicipio,
                    ':uneproductos' => $uneproductos,
                    ':datoscola' => $datoscola,
                    ':engineer_id' => $engineer_id,
                    ':engineer_name' => $engineer_name,
                    ':mobile_phone' => $mobile_phone,
                    ':serial' => $serial,
                    ':mac' => $mac,
                    ':tipo_equipo' => $tipo_equipo,
                    ':velocidad_navegacion' => $velocidad_navegacion,
                    ':user_id' => $user_id,
                    ':request_id' => $request_id,
                    ':user_identification' => $user_identification,
                    ':fecha_solicitud' => $fecha_solicitud,
                    ':fecha_creado' => $fecha_creado,
                    ':observacionTerreno' => $observacionTerreno,
                ]);

                if ($stmt2->rowCount() == 1) {
                    $response = ['type' => 'success', 'msg' => 'OK', 201];
                } else {
                    $response = ['type' => 'Error', 'msg' => '', 400];
                }
            }
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_DB = null;
        echo json_encode($response);
    }

    public function getListaPendientesSoporteGpon()
    {

        $hoy = date("Y-m-d");

        /*LOGICA QUE LLEVA LA INFORMACION A TV, INTERNET-ToIp Y CORREGIR PORTAFOLIO*/
        //$query = "SELECT s.* FROM soporte_gpon s WHERE fecha_creado BETWEEN '$hoy 00:00:00' AND '$hoy 23:59:59' AND s.status_soporte != '1' ORDER BY s.fecha_creado asc";
        $query = "SELECT
                        s.*,
                    CASE
                            
                            WHEN (
                            SELECT
                                COUNT(*) 
                            FROM
                                soporte_gpon c1 
                            WHERE
                                s.tarea = c1.tarea 
                                AND c1.fecha_creado >= DATE_SUB( CURDATE(), INTERVAL 10 DAY ) 
                                AND c1.status_soporte = '1' 
                                ) > 0 THEN
                                'TRUE' ELSE 'FALSE' 
                            END alerta 
                    FROM
                        soporte_gpon s 
                    WHERE
                        fecha_creado BETWEEN '$hoy 00:00:00' 
                        AND '$hoy 23:59:59' 
                        AND s.status_soporte != '1' 
                    ORDER BY
                        s.fecha_creado ASC";

        $rst = $this->_DB->query($query);
        $rst->execute();
        $resultSoporteGpon = $rst->fetchAll(PDO::FETCH_ASSOC);

        $query2 = "SELECT login, COUNT(*) as 'Conteo' FROM soporte_gpon WHERE fecha_creado BETWEEN ('$hoy 00:00:00') AND ('$hoy 23:59:59') AND status_soporte = '2' GROUP BY login ";
        $rst2 = $this->_DB->query($query2);

        $resultCount = $rst2->fetchAll(PDO::FETCH_ASSOC);

        $query3 = "SELECT SUM(CASE WHEN respuesta_soporte = 'Finalizado' THEN 1 ELSE 0 END) AS 'Finalizado',
		SUM(CASE WHEN respuesta_soporte = 'Devuelto al tecnico' THEN 1 ELSE 0 END) AS 'Devuelto al tecnico', 
		SUM(CASE WHEN respuesta_soporte = 'Incompleto' THEN 1 ELSE 0 END) AS 'Incompleto', 
		SUM(CASE WHEN status_soporte = 0 THEN 1 WHEN status_soporte = 2 THEN 1 ELSE 0 END) AS 'sinrespuesta'
		FROM soporte_gpon WHERE fecha_creado BETWEEN ('$hoy 00:00:00') AND ('$hoy 23:59:59')";
        $rst3 = $this->_DB->query($query3);
        $rst3->execute();
        $resultCount2 = $rst3->fetchAll(PDO::FETCH_ASSOC);

        $data = array($resultSoporteGpon, $resultCount, $resultCount2);

        echo json_encode($data);


    }

    public function gestionarSoporteGpon($params)
    {

        try {
            ini_set('session.gc_maxlifetime', 3600); // 1 hour
            session_set_cookie_params(3600);
            session_start();
            if (!$_SESSION) {
                $response = ['state' => 99, 'title' => 'Su session ha caducado', 'text' => 'Inicia session nuevamente para continuar'];
            } else {
                $id_soporte = $params['id_soporte'];
                $tipificacion = $params['tipificacion'];
                $tipificaciones = $params['tipificaciones'];
                $observacion = $params['observacion'];
                $login = $_SESSION['login'];

                $tip = '';
                foreach ($tipificaciones as $key => $value) {
                    $tip .= $value . ', ';
                }

                $fecha_respuesta = date('Y-m-d H:i:s');

                $stmt = $this->_DB->prepare("SELECT login FROM soporte_gpon WHERE id_soporte = :id");
                $stmt->execute(array(':id' => $id_soporte));

                if ($stmt->rowCount() == 1) {
                    $res_soporte = $stmt->fetchAll(PDO::FETCH_ASSOC);
                    $login_gestion = $res_soporte[0]['login'];

                    if ($login != $login_gestion) {
                        $response = array('state' => 3, 'msg' => 'El pedido se encuentra en gestión por otro agente');
                    } else {
                        $stmt = $this->_DB->prepare("UPDATE soporte_gpon
                                                    SET respuesta_soporte = :tipificacion,
                                                        respuesta_tipificaciones = :respuesta_tipificaciones,
                                                        observacion       = :observacion,
                                                        login             = :login,
                                                        fecha_respuesta   = :fecha_respuesta,
                                                        status_soporte    = '1'
                                                    WHERE id_soporte = :id_soporte");
                        $stmt->execute([
                            ':tipificacion' => $tipificacion,
                            ':respuesta_tipificaciones' => $tip,
                            ':observacion' => $observacion,
                            ':login' => $login,
                            ':fecha_respuesta' => $fecha_respuesta,
                            ':id_soporte' => $id_soporte,
                        ]);

                        if ($stmt->rowCount()) {
                            $response = array('state' => 1, 'msg' => 'El registro se guardo exitosamente');
                        } else {
                            $response = array('state' => 0, 'msg' => 'Ha ocurrido un error interno inténtalo nuevamente en unos minutos');
                        }
                    }
                } else {
                    $response = array('state' => 3, 'msg' => 'El pedido no se encuentra en gestión');
                }

            }

        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_DB = null;
        echo json_encode($response);
    }

    public function registrossoportegpon($data)
    {

        try {

            $pagenum = $data['page'];
            $pagesize = $data['size'];
            $offset = ($pagenum - 1) * $pagesize;
            $search = $data['search'];

            $condicion = '';
            if (!empty($data['data']['fechaini'])) {
                $fechaini = $data['data']['fechaini'];
                $fechafin = $data['data']['fechafin'];
                $condicion = " AND fecha_respuesta BETWEEN '$fechaini 00:00:00' AND '$fechafin 23:59:59' ";
            } else {
                $fechaini = date('Y-m-d');
                $fechafin = date('Y-m-d');
                $condicion = " AND fecha_respuesta BETWEEN '$fechaini 00:00:00' AND '$fechafin 23:59:59' ";
            }

            if ($data['pedido']) {
                $pedido = $data['pedido'];
                $condicion = " AND  tarea = '$pedido' ";
            }


            $stmt = $this->_DB->query("select * from soporte_gpon where 1=1 $condicion AND status_soporte = '1'");
            $stmt->execute();
            $counter = $stmt->rowCount();

            $stmt = $this->_DB->prepare("SELECT id_soporte,
                                               tarea,
                                               arpon,
                                               nap,
                                               hilo,
                                               port_internet_1,
                                               port_internet_2,
                                               port_internet_3,
                                               port_internet_4,
                                               port_television_1,
                                               port_television_2,
                                               port_television_3,
                                               port_television_4,
                                               numero_contacto,
                                               nombre_contacto,
                                               unepedido,
                                               tasktypecategory,
                                               unemunicipio,
                                               uneproductos,
                                               datoscola,
                                               engineer_id,
                                               engineer_name,
                                               mobile_phone,
                                               serial,
                                               mac,
                                               tipo_equipo,
                                               velocidad_navegacion,
                                               user_id_firebase,
                                               request_id_firebase,
                                               user_identification_firebase,
                                               status_soporte,
                                               fecha_solicitud_firebase,
                                               fecha_creado,
                                               respuesta_soporte,
                                               observacion,
                                               observacion_terreno,
                                               login,
                                               fecha_respuesta,
                                               fecha_marca
                                        FROM soporte_gpon
                                        WHERE 1 = 1 $condicion 
                                        ORDER BY fecha_creado DESC
                                        limit $offset, $pagesize");
            $stmt->execute();
            if ($stmt->rowCount()) {
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
                $response = ['state' => 1, 'data' => $result, 'counter' => $counter];
            } else {
                $response = ['state' => 0, 'msj' => 'No se encontraron registros'];
            }

        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_DB = null;
        echo json_encode($response);
    }

    public function csvRegistrosSoporteGpon($params)
    {

        ini_set('memory_limit', '256M');

        try {
            //$datos = $params['datos'];
            $fechaini = $params['fechaini'];
            $fechafin = $params['fechafin'];

            if ($fechaini == "" && $fechafin == "") {
                $fechaini = date("Y-m-d");
                $fechafin = date("Y-m-d");
            }

            $query = "SELECT tarea, arpon, nap, hilo, port_internet_1, port_internet_2, port_internet_3, port_internet_4, port_television_1, port_television_2, port_television_3, 
                    port_television_4, numero_contacto, nombre_contacto, unepedido, tasktypecategory, unemunicipio, uneproductos, datoscola, engineer_id, engineer_name, mobile_phone, 
                    serial, mac, tipo_equipo, velocidad_navegacion, user_id_firebase, request_id_firebase, user_identification_firebase, status_soporte, fecha_solicitud_firebase, 
                    fecha_creado, respuesta_soporte, respuesta_tipificaciones, observacion, observacion_terreno, login, fecha_respuesta, fecha_marca, area, task_type, uneSourceSystem
                    FROM soporte_gpon 
                    WHERE fecha_creado BETWEEN '$fechaini 00:00:00' AND '$fechafin 23:59:59'
                    ORDER BY fecha_creado DESC;";

            $stmt = $this->_DB->query($query);
            $stmt->execute();

            if ($stmt->rowCount()) {
                $response = array('state' => 1, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC));
            } else {
                $response = array('state' => 0, 'msj' => 'No se econtraron registros');
            }

        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_DB = null;
        echo json_encode($response);
    }

    /*public function marcarEngestionGpon($params)
    {
        try {
            ini_set('session.gc_maxlifetime', 3600); // 1 hour
            session_set_cookie_params(3600);
            session_start();

            if (!$_SESSION) {
                $response = ['state' => 99, 'title' => 'Su session ha expirado', 'text' => 'Inicia session nuevamente para continuar'];
            } else {
                $login = $_SESSION['login'];
                $today = date("Y-m-d H:i:s");

                $datosguardar = $params['datos'];
                $id_soporte = $datosguardar['id_soporte'];
                $status_soporte = $datosguardar['status_soporte'];

                if ($status_soporte == '2') {
                    $gestion = 1;
                } else {
                    $gestion = 0;
                }

                $rst = $this->_DB->query("SELECT id_soporte, login FROM soporte_gpon WHERE id_soporte = '$id_soporte' AND status_soporte = 2");
                $rst->execute();

                $stmt = $this->_DB->query("SELECT login FROM usuarios WHERE perfil = '11'");
                $stmt->execute();
                $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
                $usuarios_array = array_column($res, 'login');

                if ($rst->rowCount() == 1) {
                    if ($login == $loginsoportegpon || in_array($login, $usuarios_array)) {
                        $stmt = $this->_DB->query("UPDATE soporte_gpon SET status_soporte = 0, login = NULL, fecha_marca = NULL WHERE id_soporte ='$id'");
                        $stmt->execute();
                        $response = ['state' => 1, 'msj' => 'El pedido se encuentra desbloqueado'];
                    } else {
                        $response = ['state' => 0, 'msj' => 'El pedido se encuentra en gestión por otro asesor'];
                    }
                } else {

                    $rst = $this->_DB->query("SELECT id_soporte, login FROM soporte_gpon WHERE id_soporte = '$id_soporte' AND status_soporte = 0");
                    $rst->execute();
                    if ($rst->rowCount() == 1) {
                        $row = $rst->fetchAll(PDO::FETCH_ASSOC);
                        $id = $row[0]['id_soporte'];
                        //echo "UPDATE soporte_gpon SET status_soporte = 2, login = '$login', fecha_marca = '$today' WHERE id_soporte = '$id'";exit();
                        $sqlupdate = $this->_DB->query("UPDATE soporte_gpon SET status_soporte = 2, login = '$login', fecha_marca = '$today' WHERE id_soporte = '$id'");
                        $sqlupdate->execute();

                        $response = ['state' => 1, 'msj' => 'El pedido se encuentra bloqueado', 'alerta' => $alerta];
                    }
                }
            }
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_DB = null;
        echo json_encode($response);
    }*/

    public function marcarEngestionGpon($params)
    {
        try {
            ini_set('session.gc_maxlifetime', 3600); // 1 hour
            session_set_cookie_params(3600);
            session_start();

            if (!$_SESSION) {
                $response = ['state' => 99, 'title' => 'Su session ha expirado', 'text' => 'Inicia session nuevamente para continuar'];
            } else {
                $login = $_SESSION['login'];
                $today = date("Y-m-d H:i:s");

                $datosguardar = $params['datos'];
                $id_soporte = $datosguardar['id_soporte'];
                $status_soporte = $datosguardar['status_soporte'];

                if ($status_soporte == '2') {
                    $gestion = 1;
                } else {
                    $gestion = 0;
                }

                $rst = $this->_DB->query("SELECT id_soporte, login FROM soporte_gpon WHERE id_soporte = '$id_soporte' AND status_soporte = 2");
                $rst->execute();

                $stmt = $this->_DB->query("SELECT login FROM usuarios WHERE perfil = '11'");
                $stmt->execute();
                $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
                $usuarios_array = array_column($res, 'login');

                if ($rst->rowCount() == 1) {
                    //echo 1;exit();
                    $row = $rst->fetchAll(PDO::FETCH_ASSOC);
                    $loginsoportegpon = $row[0]['login'];
                    $id = $row[0]['id_soporte'];

                    //echo $loginsoportegpon.''.$login;exit();

                    if ($login == $loginsoportegpon || in_array($login, $usuarios_array)) {
                        $stmt = $this->_DB->query("UPDATE soporte_gpon SET status_soporte = 0, login = NULL, fecha_marca = NULL WHERE id_soporte ='$id'");
                        $stmt->execute();
                        $response = ['state' => 1, 'msj' => 'El pedido se encuentra desbloqueado'];
                    } else {
                        $response = ['state' => 0, 'msj' => 'El pedido se encuentra en gestión por otro asesor'];
                    }
                } else {

                    $rst = $this->_DB->query("SELECT
                                                        s.id_soporte,
                                                        s.login,
                                                    CASE
                                                            
                                                            WHEN (
                                                            SELECT
                                                                COUNT(*) 
                                                            FROM
                                                                soporte_gpon c1 
                                                            WHERE
                                                                s.tarea = c1.tarea 
                                                                AND c1.fecha_creado >= DATE_SUB( CURDATE(), INTERVAL 10 DAY ) 
                                                                AND c1.status_soporte = '1' 
                                                                ) > 0 THEN
                                                                'TRUE' ELSE 'FALSE' 
                                                            END alerta 
                                                    FROM
                                                        soporte_gpon s
                                                    WHERE
                                                        s.id_soporte = '$id_soporte' 
                                                        AND s.status_soporte = 0");
                    $rst->execute();
                    if ($rst->rowCount() == 1) {
                        $row = $rst->fetchAll(PDO::FETCH_ASSOC);
                        $id = $row[0]['id_soporte'];
                        $alerta = $row[0]['alerta'];
                        //echo "UPDATE soporte_gpon SET status_soporte = 2, login = '$login', fecha_marca = '$today' WHERE id_soporte = '$id'";exit();
                        $sqlupdate = $this->_DB->query("UPDATE soporte_gpon SET status_soporte = 2, login = '$login', fecha_marca = '$today' WHERE id_soporte = '$id'");
                        $sqlupdate->execute();

                        $response = ['state' => 1, 'msj' => 'El pedido se encuentra bloqueado', 'alerta' => $alerta];
                    }
                }
            }
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_DB = null;
        echo json_encode($response);
    }

    public function BuscarSoporteGpon($pedido)
    {
        try {
            ini_set('session.gc_maxlifetime', 3600); // 1 hour
            session_set_cookie_params(3600);
            session_start();
            $pedido = $pedido['pedido'];
            if (!$_SESSION) {
                $response = ['state' => 99, 'title' => 'Su session ha caducado', 'text' => 'Inicia session nuevamente para continuar'];
            } else {
                if ($pedido != "") {
                    $stmt = $this->_DB->prepare("SELECT * FROM soporte_gpon WHERE tarea = :pedido");
                    $stmt->execute([':pedido' => $pedido]);
                    if ($stmt->rowCount() > 0) {
                        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
                        $response = ['state' => 1, 'data' => $result];
                    } else {
                        $response = ['state' => 0, 'text' => 'No se encontraron datos'];
                    }
                } else {
                    $response = ['state' => 0, 'text' => 'Ingrese un pedido'];
                }
            }
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }

        $this->_DB = null;
        echo json_encode($response);
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
                                                    respuesta_soporte tipificaciones,
                                                    COUNT(*) AS count 
                                                FROM
                                                    soporte_gpon 
                                                WHERE
                                                    fecha_creado BETWEEN '$fecha 00:00:00' 
                                                    AND '$fecha 23:59:59' 
                                                GROUP BY
                                                    tipificaciones;");
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
                                                        p.login AS USUARIO, DATE_FORMAT(p.fecha_respuesta, '%H') AS RANGO_PENDIENTE, 
                                                        p.respuesta_tipificaciones AS prod
                                                FROM soporte_gpon p
                                                WHERE 1=1 AND p.fecha_respuesta BETWEEN '$fecha 00:00:00' AND '$fecha 23:59:59') C2
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
