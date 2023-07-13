<?php
require_once '../class/conection.php';


class codigoIncompleto
{
    private $_DB;

    public function __construct()
    {
        $this->_DB = new Conection();
    }

    public function getListaCodigoIncompleto($data)
    {

        try {
            /*ini_set('session.gc_maxlifetime', 60*60*24); // 1 day
            session_set_cookie_params(60*60*24);
            session_start();
            if (!$_SESSION) {
                $response = ['state' => 99, 'title' => 'Su session ha caducado', 'text' => 'Inicia session nuevamente para continuar'];
            } else {*/

                $pagenum = $data['page'];
                $pagesize = $data['size'];
                $offset = ($pagenum - 1) * $pagesize;
                $search = $data['search'];


                if (!empty($data['data']['fechaini'])) {
                    $fechaini = $data['data']['fechaini'];
                    $fechafin = $data['data']['fechafin'];
                } else {
                    $fechaini = date('Y-m-d');
                    $fechafin = date('Y-m-d');
                }


                $stmt = $this->_DB->query("select * from gestion_codigo_incompleto 
                                    WHERE fecha_creado BETWEEN '$fechaini 00:00:00' AND '$fechafin 23:59:59' and status_soporte = '0'");

                $stmt->execute();

                $totalCount = $stmt->rowCount();

                if (isset($data['page'])) {
                    $page_number = $data['page'];
                } else {
                    $page_number = 1;
                }


                $initial_page = ($page_number - 1) * $data['size'];

                $total_pages = ceil($totalCount / $data['size']);

                $limit_page = $data['size'];


                $stmt = $this->_DB->query("SELECT *
                                                FROM gestion_codigo_incompleto
                                                WHERE fecha_creado BETWEEN '$fechaini 00:00:00' AND '$fechafin 23:59:59' and status_soporte = '0' order by fecha_creado desc limit $initial_page, $limit_page");
                $stmt->execute();

                if ($stmt->rowCount()) {
                    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
                    $response = ['state' => 1, 'data' => $result, 'total' => $total_pages, 'counter' => intval($totalCount)];
                } else {
                    $response = ['Error', 400];
                }
            /*}*/
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_DB = null;
        echo json_encode($response);
    }

    public function gestionarCodigoIncompleto($data)
    {
        try {
            ini_set('session.gc_maxlifetime', 60*60*24); // 1 day
            session_set_cookie_params(60*60*24);
            session_start();
            if (!$_SESSION) {
                $response = ['state' => 99, 'title' => 'Su session ha caducado', 'text' => 'Inicia session nuevamente para continuar'];
            } else {

                $id_codigo_incompleto = $data['id_codigo_incompleto'];
                $tipificacion = $data['tipificacion'];
                $observacion = $data['observacion'];
                $fecha_respuesta = date('Y-m-d H:i:s');

                $stmt = $this->_DB->prepare("UPDATE gestion_codigo_incompleto
                                            SET status_soporte    = 1,
                                                respuesta_gestion = :tipificacion,
                                                observacion       = :observacion,
                                                login             = :login,
                                                fecha_respuesta   = :fecha_respuesta
                                            WHERE id_codigo_incompleto = :id_codigo_incompleto");
                $stmt->execute([
                    ':tipificacion' => $tipificacion,
                    ':observacion' => $observacion,
                    ':login' => $_SESSION['login'],
                    ':fecha_respuesta' => $fecha_respuesta,
                    ':id_codigo_incompleto' => $id_codigo_incompleto,
                ]);

                if ($stmt->rowCount()) {
                    $response = ['state' => 1, 'type' => 'success', 'text' => 'Datos guardados'];
                } else {
                    $response = ['state' => 0, 'type' => 'Error', 'text' => 'Ah ocurrido un error intentalo nuevamente'];
                }
            }
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_DB = null;
        echo json_encode($response);
    }

    public function registroscodigoincompleto($data)
    {
        try {
            /*ini_set('session.gc_maxlifetime', 60*60*24); // 1 day
            session_set_cookie_params(60*60*24);
            session_start();*/

            if (empty($data['data']['fechaini'])) {
                $fechaini = date("Y-m-d");
                $fechafin = date("Y-m-d");
            } else {
                $fechaini = $data['data']['fechaini'];
                $fechafin = $data['data']['fechafin'];
            }
            $condicion = '';
            if (!empty($data['tarea'])) {
                $tarea = $data['tarea'];
                $condicion = " AND tarea = '$tarea' ";
            }


            $stmt = $this->_DB->query("SELECT * FROM gestion_codigo_incompleto WHERE 1=1 $condicion AND status_soporte = 1 AND fecha_respuesta BETWEEN '$fechaini 00:00:00' AND '$fechafin 23:59:59'");
            $stmt->execute();
            $totalItems = $stmt->rowCount();

            $pagenum = $data['page'];
            $pagesize = $data['size'];
            $offset = ($pagenum - 1) * $pagesize;
            $search = $data['search'];

            $total_pages = ceil($totalItems / $pagesize);

            $stmt = $this->_DB->query("SELECT
                                        tarea,
                                        numero_contacto,
                                        nombre_contacto,
                                        unepedido,
                                        tasktypecategory,
                                        unemunicipio,
                                        uneproductos,
                                        engineer_id,
                                        engineer_name,
                                        mobile_phone,
                                        status_soporte,
                                        fecha_solicitud_firebase,
                                        fecha_creado,
                                        respuesta_gestion,
                                        observacion,
                                        login,
                                        fecha_respuesta,
                                    CASE WHEN respuesta_gestion = 'En Sitio' THEN
                                            codigo
                                        ELSE
                                            respuesta_gestion
                                        END AS codigo
                                    FROM
                                        gestion_codigo_incompleto
                                    WHERE 1=1 AND status_soporte = 1 AND fecha_respuesta BETWEEN '$fechaini 00:00:00' AND '$fechafin 23:59:59' $condicion
                                    ORDER BY fecha_creado DESC
                                    LIMIT $offset, $pagesize");


            $stmt->execute();

            if ($stmt->rowCount()) {
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
                $response = array('state' => 1, 'data' => $result, 'totalItems' => $totalItems, 'total_pages' => $total_pages);
            } else {
                $response = array('state' => 0, 'msj' => 'No se encontraron registros');
            }
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }

        $this->_DB = null;
        echo json_encode($response);
    }

    public function csvRegistrosCodigoIncompleto($params)
    {

        try {
            /*ini_set('session.gc_maxlifetime', 60*60*24); // 1 day
            session_set_cookie_params(60*60*24);
            session_start();
            $usuarioid = $_SESSION['login'];*/

            $fechaini = $params['fechaini'];
            $fechafin = $params['fechafin'];

            if ($fechaini == "" && $fechafin == "") {
                $fechaini = date('Y-m-d');
                $fechafin = date('Y-m-d');
            }

            $query = "SELECT id_codigo_incompleto, tarea, numero_contacto, nombre_contacto, unepedido, tasktypecategory, unemunicipio, uneproductos, engineer_id, engineer_name, mobile_phone, fecha_creado, fecha_respuesta, observacion, respuesta_gestion 
            FROM gestion_codigo_incompleto
            WHERE fecha_creado BETWEEN '$fechaini 00:00:00' AND '$fechafin 23:59:59'
            ORDER BY fecha_creado DESC";

            $resQuery = $this->_DB->query($query);
            if ($resQuery->rowCount()) {
                $result = $resQuery->fetchAll(PDO::FETCH_ASSOC);
                $response = array('state' => 1, 'data' => $result);
            } else {
                $response = array('state' => 1, 'msj' => 'No se encontraron registros');
            }
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_DB = null;
        echo json_encode($response);
    }
}
