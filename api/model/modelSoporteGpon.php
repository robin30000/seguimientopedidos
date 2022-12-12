<?php
require_once '../class/conection.php';

class modelSoporteGpon
{

    private $_DB;

    public function __construct()
    {
        $this->_DB = new Conection();
    }

    public function getSoporteGponByTask($data)
    {
        try {
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
        echo json_encode($response);
    }

    public function postPendientesSoporteGpon($params)
    {

        try {
            $task                 = $params['task'];
            $arpon                = $params['arpon'];
            $nap                  = $params['nap'];
            $hilo                 = $params['hilo'];
            $internet1            = $params['internet1'];
            $internet2            = $params['internet2'];
            $internet3            = $params['internet3'];
            $internet4            = $params['internet4'];
            $television1          = $params['television1'];
            $television2          = $params['television2'];
            $television3          = $params['television3'];
            $television4          = $params['television4'];
            $numeroContacto       = $params['numeroContacto'];
            $nombreContacto       = $params['nombreContacto'];
            $user_id              = $params['user_id'];
            $request_id           = $params['request_id'];
            $user_identification  = $params['user_identification'];
            $fecha_solicitud      = $params['fecha_solicitud'];
            $unepedido            = $params['unepedido'];
            $tasktypecategory     = $params['tasktypecategory'];
            $unemunicipio         = $params['unemunicipio'];
            $uneproductos         = $params['uneproductos'];
            $datoscola            = $params['datoscola'];
            $engineer_id          = $params['engineer_id'];
            $engineer_name        = $params['engineer_name'];
            $mobile_phone         = $params['mobile_phone'];
            $serial               = $params['serial'];
            $mac                  = $params['mac'];
            $tipo_equipo          = $params['tipo_equipo'];
            $velocidad_navegacion = $params['velocidad_navegacion'];
            $observacionTerreno   = $params['observacionTerreno'];

            $fecha_creado = date('Y-m-d H:i:s');
            $hoy          = date('Y-m-d');

            $stmt = $this->_DB->prepare("SELECT *
                                            FROM soporte_gpon
                                            WHERE tarea = :task
                                              AND fecha_creado BETWEEN :fechaini AND :fechafin
                                              AND status_soporte = '0'");
            $stmt->execute([
                ':task'     => $task,
                ':fechaini' => "$hoy 00:00:00",
                ':fechafin' => "$hoy 23:59:59",
            ]);

            if ($stmt->rowCount()) {

                $res       = $stmt->fetch(PDO::FETCH_OBJ);
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
                    ':unepedido'            => $unepedido,
                    ':tasktypecategory'     => $tasktypecategory,
                    ':unemunicipio'         => $unemunicipio,
                    ':uneproductos'         => $uneproductos,
                    ':datoscola'            => $datoscola,
                    ':engineer_id'          => $engineer_id,
                    ':engineer_name'        => $engineer_name,
                    ':mobile_phone'         => $mobile_phone,
                    ':serial'               => $serial,
                    ':mac'                  => $mac,
                    ':tipo_equipo'          => $tipo_equipo,
                    ':velocidad_navegacion' => $velocidad_navegacion,
                    ':observacionTerreno'   => $observacionTerreno,
                    ':idsupport'            => $idsupport,
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
                    ':task'                 => $task,
                    ':arpon'                => $arpon,
                    ':nap'                  => $nap,
                    ':hilo'                 => $hilo,
                    ':internet1'            => $internet1,
                    ':internet2'            => $internet2,
                    ':internet3'            => $internet3,
                    ':internet4'            => $internet4,
                    ':television1'          => $television1,
                    ':television2'          => $television2,
                    ':television3'          => $television3,
                    ':television4'          => $television4,
                    ':numeroContacto'       => $numeroContacto,
                    ':nombreContacto'       => $nombreContacto,
                    ':unepedido'            => $unepedido,
                    ':tasktypecategory'     => $tasktypecategory,
                    ':unemunicipio'         => $unemunicipio,
                    ':uneproductos'         => $uneproductos,
                    ':datoscola'            => $datoscola,
                    ':engineer_id'          => $engineer_id,
                    ':engineer_name'        => $engineer_name,
                    ':mobile_phone'         => $mobile_phone,
                    ':serial'               => $serial,
                    ':mac'                  => $mac,
                    ':tipo_equipo'          => $tipo_equipo,
                    ':velocidad_navegacion' => $velocidad_navegacion,
                    ':user_id'              => $user_id,
                    ':request_id'           => $request_id,
                    ':user_identification'  => $user_identification,
                    ':fecha_solicitud'      => $fecha_solicitud,
                    ':fecha_creado'         => $fecha_creado,
                    ':observacionTerreno'   => $observacionTerreno,
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
        echo json_encode($response);
    }

    public function getListaPendientesSoporteGpon()
    {
        $hoy = date("Y - m - d");

        $stmt = $this->_DB->prepare("SELECT * FROM soporte_gpon WHERE fecha_creado BETWEEN :fechaini and :fechafin and status_soporte = '0'");
        $stmt->execute([
            ':fechaini' => "$hoy 00:00:00",
            ':fechafin' => "$hoy 23:59:59",
        ]);

        if ($stmt->rowCount()) {
            $response = [$stmt->fetchAll(PDO::FETCH_ASSOC), 201];
        } else {
            $response = ['Error', 400];
        }
        $this->_DB = null;
        echo json_encode($response);

    }

    public function gestionarSoporteGpon($params)
    {

        try {
            $id_soporte   = $params['id_soporte'];
            $tipificacion = $params['tipificacion'];
            $observacion  = $params['observacion'];
            $login        = $_SESSION['login'];

            $fecha_respuesta = date('Y-m-d H:i:s');

            $stmt = $this->_DB->prepare("UPDATE soporte_gpon
                                            SET respuesta_soporte = :tipificacion,
                                                observacion       = :observacion,
                                                login             = :login,
                                                fecha_respuesta   = :fecha_respuesta,
                                                status_soporte    = '1'
                                            WHERE id_soporte = :id_soporte");
            $stmt->execute([
                ':$tipificacion'    => $tipificacion,
                ':$observacion'     => $observacion,
                ':$login'           => $login,
                ':$fecha_respuesta' => $fecha_respuesta,
                ':$id_soporte'      => $id_soporte,
            ]);

            if ($stmt->rowCount()) {
                $response = ['type' => 'success', 'msg' => 'OK', 201];
            } else {
                $response = ['type' => 'Error', 'msg' => '', 400];
            }
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_DB = null;
        echo json_encode($response);
    }

    public function registrossoportegpon($params)
    {

        try {
            $pagina = $params['page'];
            $datos  = $params['datos'];

            $fechaini = (!isset($datos['fechaini'])) ? date("Y-m-d") : $datos['fechaini']; //CORRECCION DE VALIDACION DE FECHA
            $fechafin = (!isset($datos['fechafin'])) ? date("Y-m-d") : $datos['fechafin']; //CORRECCION DE VALIDACION DE FECHA

            if ($fechaini == "" || $fechafin == "") {
                $fechaini = date("Y-m-d");
                $fechafin = date("Y-m-d");
            }

            if ($pagina == "undefined") {
                $pagina = "0";
            } else {
                $pagina = $pagina - 1;
            }

            $pagina = $pagina * 100;

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
                                               fecha_respuesta
                                        FROM soporte_gpon
                                        WHERE fecha_respuesta BETWEEN :fechaini AND :fechafin
                                          AND status_soporte = '1'
                                        ORDER BY fecha_creado DESC
                                        LIMIT 100");
            $stmt->execute([
                ':fechaini' => "$fechaini 00:00:00",
                ':fechafin' => "$fechafin 23:59:59",
            ]);

            if ($stmt->rowCount()) {
                $response = [$stmt->fetchAll(PDO::FETCH_ASSOC), $stmt->rowCount(), 201];
            } else {
                $response = ['', $stmt->rowCount(), 400];
            }
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }

        echo json_encode($response);
    }

    public function csvRegistrosSoporteGpon($data)
    {

        try {

            $datos     = $data['datos'];
            $fechaini  = $datos['fechaini'];
            $fechafin  = $datos['fechafin'];

            if ($fechaini == "" && $fechafin == "") {
                $fechaini = date("Y") . "-" . date("m") . "-" . date("d");
                $fechafin = date("Y") . "-" . date("m") . "-" . date("d");
            }

            if ($fechaini == $fechafin) {
                $filename = "Registros" . "_" . $fechaini . "_" . $concepto . "_" . $buscar . ".csv";
            } else {
                $filename = "Registros" . "_" . $fechaini . "_" . $fechafin . "_" . $concepto . "_" . $buscar . ".csv";
            }

            $stmt = $this->_DB->prepare("SELECT tarea,
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
                                                   fecha_respuesta
                                            FROM soporte_gpon
                                            WHERE fecha_creado BETWEEN :fechaini AND :fechafin
                                              AND status_soporte = '1'
                                            ORDER BY fecha_creado DESC");
            $stmt->execute([':fechaini' => "$fechaini 00:00:00", ':fechafin' => "$fechafin 23:59:59"]);

            if ($stmt->rowCount()) {
                $fp = fopen("../tmp/$filename", 'w');

                $columnas = [
                    'TAREA',
                    'ARPON',
                    'NAP',
                    'HILO',
                    'PORT_INTERNET_1',
                    'PORT_INTERNET_2',
                    'PORT_INTERNET_3',
                    'PORT_INTERNET_4',
                    'PORT_TELEVISION_1',
                    'PORT_TELEVISION_2',
                    'PORT_TELEVISION_3',
                    'PORT_TELEVISION_4',
                    'NUMERO_CONTACTO',
                    'NOMBRE_CONTACTO',
                    'UNEPEDIDO',
                    'TASKTYPECATEGORY',
                    'UNEMUNICIPIO',
                    'UNEPRODUCTOS',
                    'DATOSCOLA',
                    'ENGINEER_ID',
                    'ENGINEER_NAME',
                    'MOBILE_PHONE',
                    'SERIAL',
                    'MAC',
                    'TIPO_EQUIPO',
                    'VELOCIDAD_NAVEGACION',
                    'USER_ID_FIREBASE',
                    'REQUEST_ID_FIREBASE',
                    'USER_IDENTIFICATION_FIREBASE',
                    'STATUS_SOPORTE',
                    'FECHA_SOLICITUD_FIREBASE',
                    'FECHA_CREADO',
                    'RESPUESTA_SOPORTE',
                    'OBSERVACION',
                    'OBSERVACION TERRENO',
                    'LOGIN',
                    'FECHA_RESPUESTA',
                ];

                fputcsv($fp, $columnas);
                fputcsv($fp, $stmt->fetchAll(PDO::FETCH_ASSOC));
                fclose($fp);
                $response = [$filename, $stmt->rowCount()];
            } else {
                $response = ['', 203];
            }

        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }

        echo json_encode($response);
    }

    public function marcarEngestionGpon($data)
    {
        var_dump($data);
    }
}
