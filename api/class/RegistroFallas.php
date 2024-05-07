<?php
ini_set('display_errors', 0);
error_reporting(0);
require_once 'conection.php';

class RegistroFallas
{

    private $_DB;

    public function __construct()
    {
        $this->_DB = new Conection();
    }

    public function insertarRegistroFallas($data)
    {

        try {
            $descripcion = isset($data['descripcion']) ? $data['descripcion'] : "";
            $plataforma = isset($data['plataforma']) ? $data['plataforma'] : "";
            $proceso = isset($data['proceso']) ? $data['proceso'] : "";
            $servicios = isset($data['servicios']) ? $data['servicios'] : "";
            $tecnologia = isset($data['tecnologia']) ? $data['tecnologia'] : "";
            $imagen = isset($data['imagen']) ? $data['imagen'] : "";
            $login_solicita = isset($data['login_solicita']) ? $data['login_solicita'] : "";

            $stmt = $this->_DB->prepare("INSERT INTO registro_fallas (descripcion, plataforma, proceso_afectado, servicio_impactado, tecnologia, imagen, fecha_ingreso, login_solicita) 
                                                    VALUES 
                                                (:descripcion, :plataforma, :proceso, :servicios, :tecnologia, :imagen, NOW(), :solicita)");
            $stmt->bindParam(':descripcion', $descripcion, PDO::PARAM_STR);
            $stmt->bindParam(':plataforma', $plataforma, PDO::PARAM_STR);
            $stmt->bindParam(':proceso', $proceso, PDO::PARAM_STR);
            $stmt->bindParam(':servicios', $servicios, PDO::PARAM_STR);
            $stmt->bindParam(':tecnologia', $tecnologia, PDO::PARAM_STR);
            $stmt->bindParam(':imagen', $imagen, PDO::PARAM_STR);
            $stmt->bindParam(':solicita', $login_solicita, PDO::PARAM_STR);
            $stmt->execute();

            if ($stmt->rowCount() == 1) {
                $response = array(
                    'status' => 1,
                    'msj' => 'Registro insertado correctamente'
                );
            } else {
                $response = array(
                    'status' => 0,
                    'msj' => 'Error al insertar el registro'
                );

            }

            return $response;

        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
    }

    public function miRegistroFallas($data)
    {
        try {
            $stmt = $this->_DB->prepare("select * from registro_fallas where login_solicita = :id");
            $stmt->bindParam(':id', $data, PDO::PARAM_STR);
            $stmt->execute();
            if ($stmt->rowCount() > 0) {
                $response = ['status' => 1, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)];
            } else {
                $response = ['status' => 0, 'data' => 'No hay registros'];
            }

            return $response;
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
    }

    public function listarRegistroFallas()
    {
        try {
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
    }

    public function listarTipificaciones()
    {
        try {
            $response = array();
            $stmt = $this->_DB->query("select id, valor from tipificaciones_registro_fallas where categoria = 'plataforma' order by valor");
            $stmt->execute();
            $response['plataforma'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $stmt = $this->_DB->query("select id, valor from tipificaciones_registro_fallas where categoria = 'plataforma_2'");
            $stmt->execute();
            $response['plataforma_2'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $stmt = $this->_DB->query("select id, valor from tipificaciones_registro_fallas where categoria = 'servicios_impactados'");
            $stmt->execute();
            $response['servicios_impactados'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $stmt = $this->_DB->query("select id, valor from tipificaciones_registro_fallas where categoria = 'tecnologia'");
            $stmt->execute();
            $response['tecnologia'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $stmt = $this->_DB->query("select id, valor from tipificaciones_registro_fallas where categoria = 'procesos_afectados'");
            $stmt->execute();
            $response['procesos_afectados'] = $stmt->fetchAll(PDO::FETCH_ASSOC);


            return $response;
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
    }

    public function listarRegistrosFallas($data)
    {
        try {

            $con = "";
            if (isset($data)) {
                $id = $data;
                $con = " and a.tt = '$id' || a.id = '$id' ";
            }

            $stmt = $this->_DB->prepare("SELECT count(*) as counter FROM registro_fallas a where a.estado != 'Finalizado' $con");
            $stmt->execute();
            $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $count = $res[0]['counter'];

            $stmt = $this->_DB->query("SELECT
                                                a.*,
                                                (
                                                SELECT
                                                    COUNT(*) 
                                                FROM
                                                    observacion_registro_falla b 
                                                WHERE
                                                    a.id = b.falla_id 
                                                    AND b.visto = 'No'
                                                ) AS visto
                                            FROM
                                                registro_fallas a 
                                            where estado != 'Finalizado' $con
                                            ORDER BY
                                                a.fecha_ingreso DESC");
            $stmt->execute();
            if ($stmt->rowCount() > 0) {
                $response = ['status' => 1, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC), 'counter' => $count];
            } else {
                $response = ['status' => 0, 'msj' => 'No hay registros'];
            }
            return $response;
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
    }

    public function listarImpactoFallas($data)
    {
        try {
            $today = date("Y-m-d");
            $fecha_anterior = date("Y-m-d", strtotime($today . "- 1 days"));

            //echo $fecha_anterior;die();
            //$con = " AND a.fecha_gestion <= '$fecha_anterior 00:00:00' ";
            $con = " AND a.fecha_gestion <= '$today 00:00:00' ";
            //$con = "";
            if (isset($data)) {
                $id = $data;
                $con = " and a.tt = '$id' || a.id = '$id' ";
            }

            $stmt = $this->_DB->prepare("SELECT count(*) as counter FROM registro_fallas a where a.estado = 'Finalizado' and criticidad IS NULL");
            $stmt->execute();
            $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $count = $res[0]['counter'];

            $stmt = $this->_DB->query("SELECT
                                                a.*,
                                                (
                                                SELECT
                                                    COUNT(*) 
                                                FROM
                                                    observacion_registro_falla b 
                                                WHERE
                                                    a.id = b.falla_id 
                                                    AND b.visto = 'No'
                                                ) AS visto
                                            FROM
                                                registro_fallas a 
                                            where estado = 'Finalizado' and criticidad IS NULL
                                            ORDER BY
                                                a.fecha_ingreso DESC");
            $stmt->execute();
            if ($stmt->rowCount() > 0) {
                $response = ['status' => 1, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC), 'counter' => $count];
            } else {
                $response = ['status' => 0, 'msj' => 'No hay registros'];
            }
            return $response;
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
    }

    public function registrosFallas($data)
    {
        try {


            $pagenum = $data['page'];
            $pagesize = $data['size'];
            $offset = ($pagenum - 1) * $pagesize;
            $con = "";
            if (isset($data['data']['concepto'])) {
                $id = $data['data']['buscar'];
                $concepto = $data['data']['concepto'];
                if ($concepto == 'tt') {
                    $con = " AND a.tt = '$id' ||  a.id = '$id' ";
                } else {
                    $con = " AND a.$concepto = '$id' ";
                }
            }


            if (isset($data['data']['fechaini']) && isset($data['data']['fechafin'])) {
                $fechaini = $data['data']['fechaini'];
                $fechafin = $data['data']['fechafin'];
                $con .= " AND a.fecha_ingreso BETWEEN '$fechaini 00:00:00' AND '$fechafin 23:59:59' ";

            }

            $stmt = $this->_DB->prepare("SELECT count(*) as counter FROM registro_fallas a where 1 = 1 $con");
            $stmt->execute();
            $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $count = $res[0]['counter'];

            $stmt = $this->_DB->query("SELECT
                                                a.*,
                                                (
                                                SELECT
                                                    COUNT(*) 
                                                FROM
                                                    observacion_registro_falla b 
                                                WHERE
                                                    a.id = b.falla_id 
                                                    AND b.visto = 'No'
                                                ) AS visto,
                                                CONCAT(
                                                    LPAD(FLOOR(TIMESTAMPDIFF(SECOND, a.fecha_ingreso, a.fecha_gestion) / 3600), 2, '0'), 
                                                    ':',
                                                    LPAD(MOD(FLOOR(TIMESTAMPDIFF(SECOND, a.fecha_ingreso, a.fecha_gestion) / 60), 60), 2, '0'),
                                                    ':',
                                                    LPAD(MOD(TIMESTAMPDIFF(SECOND, a.fecha_ingreso, a.fecha_gestion), 60), 2, '0')
                                                ) AS tiempo_diferencia
                                            FROM
                                                registro_fallas a 
                                            where 1 = 1 $con
                                            ORDER BY
                                                a.fecha_ingreso DESC LIMIT $offset, $pagesize");
            $stmt->execute();
            if ($stmt->rowCount() > 0) {
                $response = ['status' => 1, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC), 'counter' => $count];
            } else {
                $response = ['status' => 0, 'msj' => 'No hay registros'];
            }
            return $response;
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
    }

    public function ExportaRegistroFalla($data)
    {
        try {
            $con = "";
            if (isset($data['data']['fechaini']) && isset($data['data']['fechafin'])) {
                $fechaini = $data['data']['fechaini'];
                $fechafin = $data['data']['fechafin'];
                $con = " AND a.fecha_ingreso BETWEEN '$fechaini 00:00:00' AND '$fechafin 23:59:59' ";
            } else {
                $fechaini = date('Y-m-d');
                $fechafin = date('Y-m-d');
                $con = " AND a.fecha_ingreso BETWEEN '$fechaini 00:00:00' AND '$fechafin 23:59:59' ";
            }

            $stmt = $this->_DB->query("SELECT
                                                CASE
                                                    WHEN a.tt IS NULL THEN a.id 
                                                    ELSE a.tt 
                                                END AS tt,
                                                a.servicio_impactado AS servicio_impactado,
                                                a.plataforma,
                                                a.tecnologia,
                                                a.proceso_afectado,
                                                a.login_gestion AS asessor,
                                                a.login_solicita AS usuario_solicita,
                                                a.descripcion AS descipcion_falla,
                                                a.observacion_asesor,
                                                a.respuesta,
                                                a.fecha_ingreso,
                                                a.fecha_marca,
                                                a.fecha_gestion,
                                                CONCAT(
                                                    LPAD( FLOOR( TIMESTAMPDIFF( SECOND, a.fecha_ingreso, a.fecha_gestion ) / 3600 ), 2, '0' ),
                                                    ':',
                                                    LPAD( MOD ( FLOOR( TIMESTAMPDIFF( SECOND, a.fecha_ingreso, a.fecha_gestion ) / 60 ), 60 ), 2, '0' ),
                                                    ':',
                                                    LPAD( MOD ( TIMESTAMPDIFF( SECOND, a.fecha_ingreso, a.fecha_gestion ), 60 ), 2, '0' ) 
                                                ) AS tiempo_diferencia,
                                                a.criticidad,
                                                GROUP_CONCAT(b.fecha,' ', b.observacion SEPARATOR ' / ') AS avance
                                            FROM
                                                registro_fallas a
                                                INNER JOIN observacion_registro_falla b ON a.id = b.falla_id 
                                            WHERE
                                                a.estado = 'Finalizado' 
                                                $con
                                            GROUP BY
                                                a.id,
                                                a.tt,
                                                a.servicio_impactado,
                                                a.plataforma,
                                                a.tecnologia,
                                                a.proceso_afectado,
                                                a.login_gestion,
                                                a.login_solicita,
                                                a.descripcion,
                                                a.observacion_asesor,
                                                a.respuesta,
                                                a.fecha_ingreso,
                                                a.fecha_marca,
                                                a.fecha_gestion,
                                                tiempo_diferencia,
                                                a.criticidad
                                            ORDER BY
                                                a.fecha_ingreso DESC;
                                            ");
            $stmt->execute();
            if ($stmt->rowCount() > 0) {
                $response = ['status' => 1, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)];
            } else {
                $response = ['status' => 0, 'msj' => 'No hay registros'];
            }
            return $response;
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
    }

    public function miRegistrosFallas($data)
    {
        try {

            $pagenum = $data['page'];
            $pagesize = $data['size'];
            $offset = ($pagenum - 1) * $pagesize;
            $con = "";
            if (isset($data['data'])) {
                $id = $data['data'];
                $con = " and a.tt = '$id' || a.id = '$id' ";
            }

            $stmt = $this->_DB->prepare("SELECT count(*) as counter FROM registro_fallas a where a.login_solicita = :login $con");
            $stmt->bindParam(':login', $data['login'], PDO::PARAM_STR);
            $stmt->execute();
            $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $count = $res[0]['counter'];

            $stmt = $this->_DB->prepare("SELECT
                                                    a.id,
                                                    a.fecha_ingreso,
                                                    a.plataforma,
                                                    a.proceso_afectado,
                                                    a.servicio_impactado,
                                                    a.tecnologia,
                                                    a.descripcion,
                                                    a.estado,
                                                    a.imagen,
                                                    a.respuesta,
                                                    a.tt,
                                                    (
                                                    SELECT
                                                        COUNT(*) 
                                                    FROM
                                                        observacion_registro_falla b 
                                                    WHERE
                                                        a.id = b.falla_id 
                                                        AND b.visto = 'No'
                                                    ) AS visto
                                                FROM
                                                    registro_fallas a 
                                                WHERE
                                                    a.login_solicita = :login $con
                                                ORDER BY
                                                    a.fecha_ingreso DESC LIMIT $offset, $pagesize");
            $stmt->bindParam(':login', $data['login'], PDO::PARAM_STR);
            $stmt->execute();
            if ($stmt->rowCount() > 0) {
                $response = ['status' => 1, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC), 'counter' => $count];
            } else {
                $response = ['status' => 0, 'msj' => 'No hay registros'];
            }
            $this->_DB = null;
            return $response;
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
    }

    public function marca($data)
    {
        try {

            $stmt = $this->_DB->prepare("select estado, login_gestion from registro_fallas  where id = :id");
            $stmt->bindParam(':id', $data['id'], PDO::PARAM_STR);
            $stmt->execute();
            $estado = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($estado['estado'] == 'En Gestión') {
                if ($estado['login_gestion'] == $data['usuario']) {
                    $stmt = $this->_DB->prepare("update registro_fallas set estado = :estado, fecha_marca = null, login_gestion = '' where id = :id");
                    $stmt->bindValue(':estado', 'Sin Gestión', PDO::PARAM_STR);
                    $stmt->bindParam(':id', $data['id'], PDO::PARAM_STR);
                    $stmt->execute();
                    $response = ['status' => 1, 'msj' => 'El estado del registro ' . $data['id'] . ' se ha liberado'];
                } else {
                    $response = ['status' => 0, 'msj' => 'El estado del registro ' . $data['id'] . ' ya se encuentra en gestión'];
                }
            } else {
                $stmt = $this->_DB->prepare("update registro_fallas set estado = :estado, fecha_marca = now(), login_gestion = :login_gestion where id = :id");
                $stmt->bindValue(':estado', 'En Gestión', PDO::PARAM_STR);
                $stmt->bindParam(':id', $data['id'], PDO::PARAM_STR);
                $stmt->bindParam(':login_gestion', $data['usuario'], PDO::PARAM_STR);
                $stmt->execute();
                if ($stmt->rowCount() == 1) {
                    $response = ['status' => 1, 'msj' => 'El estado del registro ' . $data['id'] . ' se ha marcado en gestión'];
                } else {
                    $response = ['status' => 0, 'msj' => 'No hay registros'];
                }
            }
            $this->_DB = null;
            return $response;
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
    }

    public function ObservacioAvance($data)
    {
        try {

            if (isset($data['respuesta']) && $data['respuesta']) {

                $stmt = $this->_DB->prepare("update registro_fallas set respuesta = :respuesta where id = :id");
                $stmt->bindParam(':respuesta', $data['respuesta'], PDO::PARAM_STR);
                $stmt->bindParam(':id', $data['id'], PDO::PARAM_STR);
                $stmt->execute();

            }

            if (isset($data['tt']) && $data['tt']) {
                $stmt = $this->_DB->prepare("update registro_fallas set tt = :tt where id = :id");
                $stmt->bindParam(':tt', $data['tt'], PDO::PARAM_STR);
                $stmt->bindParam(':id', $data['id'], PDO::PARAM_STR);
                $stmt->execute();
            }

            $stmt = $this->_DB->prepare("insert into observacion_registro_falla (falla_id, observacion, usuario, fecha) values (:falla_id, :observacion, :usuario, now())");
            $stmt->bindParam(':usuario', $data['usuario'], PDO::PARAM_STR);
            $stmt->bindParam(':falla_id', $data['id'], PDO::PARAM_STR);
            $stmt->bindParam(':observacion', $data['observacion'], PDO::PARAM_STR);
            $stmt->execute();
            if ($stmt->rowCount() == 1) {
                $response = ['status' => 1, 'msj' => 'Avance guardado con éxito'];
            } else {
                $response = ['status' => 0, 'msj' => 'No hay registros'];
            }

            $this->_DB = null;
            return $response;
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
    }

    public function guardaImpactoFalla($data)
    {
        try {

            if (isset($data['respuesta']) && $data['respuesta']) {

                $stmt = $this->_DB->prepare("update registro_fallas set criticidad = :respuesta where id = :id");
                $stmt->bindParam(':respuesta', $data['cri'], PDO::PARAM_STR);
                $stmt->bindParam(':id', $data['id'], PDO::PARAM_STR);
                $stmt->execute();

            }

            if (isset($data['tt']) && $data['tt']) {
                $stmt = $this->_DB->prepare("update registro_fallas set tt = :tt where id = :id");
                $stmt->bindParam(':tt', $data['tt'], PDO::PARAM_STR);
                $stmt->bindParam(':id', $data['id'], PDO::PARAM_STR);
                $stmt->execute();
            }

            $stmt = $this->_DB->prepare("insert into observacion_registro_falla (falla_id, observacion, usuario, fecha) values (:falla_id, :observacion, :usuario, now())");
            $stmt->bindParam(':usuario', $data['usuario'], PDO::PARAM_STR);
            $stmt->bindParam(':falla_id', $data['id'], PDO::PARAM_STR);
            $stmt->bindParam(':observacion', $data['observacion'], PDO::PARAM_STR);
            $stmt->execute();
            if ($stmt->rowCount() == 1) {
                $response = ['status' => 1, 'msj' => 'Avance guardado con éxito'];
            } else {
                $response = ['status' => 0, 'msj' => 'No hay registros'];
            }

            $this->_DB = null;
            return $response;
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
    }

    public function verObservacioAvance($data)
    {
        try {

            $stmt = $this->_DB->prepare("update observacion_registro_falla set visto = 'Si' where falla_id = :falla_id and usuario != :usuario");
            $stmt->bindParam(':falla_id', $data['id'], PDO::PARAM_STR);
            $stmt->bindParam(':usuario', $data['login'], PDO::PARAM_STR);
            $stmt->execute();

            $stmt = $this->_DB->prepare("select observacion, usuario, fecha, visto from observacion_registro_falla where falla_id = :falla_id");
            $stmt->bindParam(':falla_id', $data['id'], PDO::PARAM_STR);
            $stmt->execute();
            if ($stmt->rowCount() > 0) {
                $response = ['status' => 1, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)];
            } else {
                $response = ['status' => 0, 'msj' => 'No hay registros'];
            }
            $this->_DB = null;
            return $response;
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
    }

    public function guardarFalla($data)
    {
        try {
            $stmt = $this->_DB->prepare("UPDATE registro_fallas SET observacion_asesor = :observacion_asesor, estado = :estado, fecha_gestion = now(), respuesta = :respuesta WHERE id = :id");
            $stmt->bindParam(':observacion_asesor', $data['observacion'], PDO::PARAM_STR);
            $stmt->bindValue(':estado', $data['estado'], PDO::PARAM_STR);
            $stmt->bindParam(':id', $data['id'], PDO::PARAM_STR);
            $stmt->bindParam(':respuesta', $data['respuesta'], PDO::PARAM_STR);
            $stmt->execute();
            if ($stmt->rowCount() == 1) {
                $response = ['status' => 1, 'msj' => 'Falla Cerrada con exito'];
            } else {
                $response = ['status' => 0, 'msj' => 'Ha ocurrido un error interno, intente nuevamente en unos minutos'];
            }

            $this->_DB = null;
            return $response;
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
    }

    public function ActualizaFallas($data)
    {
        try {
            $stmt = $this->_DB->prepare("UPDATE registro_fallas SET observacion_asesor = :observacion_asesor, criticidad = :criticidad WHERE id = :id");
            $stmt->bindParam(':observacion_asesor', $data['observacion'], PDO::PARAM_STR);
            $stmt->bindValue(':criticidad', $data['criticidad'], PDO::PARAM_STR);
            $stmt->bindParam(':id', $data['id'], PDO::PARAM_STR);
            $stmt->execute();
            if ($stmt->rowCount() == 1) {
                $response = ['status' => 1, 'msj' => 'Falla Cerrada con exito'];
            } else {
                $response = ['status' => 0, 'msj' => 'Ha ocurrido un error interno, intente nuevamente en unos minutos'];
            }

            $this->_DB = null;
            return $response;
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
    }

    public function conteoFallas()
    {
        try {
            $stmt = $this->_DB->query("SELECT 
                                                    estado,
                                                    COUNT(*) AS conteo
                                                    
                                                FROM 
                                                    registro_fallas 
                                                WHERE 
                                                    estado IN ('En Gestión', 'Finalizado', 'Sin gestión') 
                                                GROUP BY 
                                                    estado;");
            $stmt->execute();
            $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $condicion = '';
            /*if (!empty($data)) {
                $today = $data['fechafin'];
                $fecha_anterior = $data['fechaini'];
            } else {*/
            $today = date("Y-m-d");
            $fecha_anterior = date("Y-m-d", strtotime($today . "- 20 days"));
            //}

            $condicion = " AND fecha_gestion BETWEEN '$fecha_anterior 00:00:00' AND '$today 23:59:59' ";

            /*if (isset($data['producto'])) {
                switch ($data['producto']) {
                    case 'Internet+Toip':
                        $condicion .= " AND producto in ('Internet+Toip','ToIP','Internet')";
                        break;
                    case 'TV':
                        $condicion .= " AND producto = 'TV'";
                        break;
                    default:
                        $condicion .= " ";
                }
            }

            SELECT DATE(fecha_gestion) AS fecha,
            SUBSTRING_INDEX( SEC_TO_TIME( AVG( TIME_TO_SEC( TIMEDIFF( fecha_gestion, fecha_marca )))), '.', 1 ) AS promedio
            FROM registro_fallas
            WHERE 1 = 1 $condicion
            GROUP BY fecha ORDER BY fecha

            */


            $stmt1 = $this->_DB->query("SELECT DATE(fecha_ingreso) AS fecha,
                                                count(id) as conteo
                                                FROM registro_fallas
                                                WHERE 1 = 1 $condicion
                                                GROUP BY fecha ORDER BY fecha");
            $stmt1->execute();
            $tiempoCola = $stmt1->fetchAll(PDO::FETCH_ASSOC);

            $stmt2 = $this->_DB->query("SELECT DATE(fecha_marca) AS fecha,
                                                count(id) as conteo
                                                FROM registro_fallas
                                                WHERE 1 = 1 $condicion
                                                GROUP BY fecha ORDER BY fecha");
            $stmt2->execute();
            $tiempoAtencion = $stmt2->fetchAll(PDO::FETCH_ASSOC);

            $stmt3 = $this->_DB->query("SELECT DATE(fecha_gestion) AS fecha,
                                                count(id) as conteo
                                                FROM registro_fallas
                                                WHERE 1 = 1 $condicion
                                                GROUP BY fecha ORDER BY fecha");
            $stmt3->execute();
            $tiempoSistema = $stmt3->fetchAll(PDO::FETCH_ASSOC);

            $result = array();
            $result['tiempoCola'] = $tiempoCola;
            $result['tiempoAtencion'] = $tiempoAtencion;
            $result['tiempoSistema'] = $tiempoSistema;
            $result['conteo'] = $res;

            if ($stmt->rowCount() > 0) {

                $response = ['state' => true, 'data' => $result];
            } else {
                $response = ['state' => false, 'msj' => 'No hay registros'];
            }
            $this->_DB = null;
            return $response;
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
    }

    public function addCriticidad($data)
    {
        try {
            $stmt = $this->_DB->prepare("UPDATE registro_fallas SET criticidad = :criticidad WHERE id = :id");
            $stmt->bindParam(':criticidad', $data['criticidad'], PDO::PARAM_STR);
            $stmt->bindParam(':id', $data['id'], PDO::PARAM_STR);
            $stmt->execute();
            if ($stmt->rowCount() == 1) {
                $response = ['status' => 1, 'msj' => 'Criticidad Agregada con éxito'];
            } else {
                $response = ['status' => 0, 'msj' => 'Ha ocurrido un error interno, intente nuevamente en unos minutos'];
            }
            $this->_DB = null;
            return $response;
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
    }
}