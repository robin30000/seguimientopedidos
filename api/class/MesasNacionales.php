<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
require_once 'conection.php';

class MesasNacionales
{

    private $_DB;

    public function __construct()
    {
        $this->_DB = new Conection();
    }

    /**
     * @param $data
     * @return array|void
     * mesa Soporte Siebel-Edatel-Elite
     */
    public function mesa1($data)
    {
        try {

            //$stmt = $this->_DB->query("SELECT * FROM mesas_nacionales where estado != 'Gestionado' and mesa = 'Mesa 1' ORDER BY hora_ingreso");
            $stmt = $this->_DB->query("SELECT
                                                    m.*,
                                                CASE
                                                        
                                                        WHEN (
                                                        SELECT
                                                            COUNT(*) 
                                                        FROM
                                                            mesas_nacionales c1 
                                                        WHERE
                                                            m.tarea = c1.tarea 
                                                            AND c1.hora_ingreso >= DATE_SUB( CURDATE(), INTERVAL 10 DAY ) 
                                                            AND c1.estado = 'Gestionado' 
                                                            ) > 0 THEN
                                                            'TRUE' ELSE 'FALSE' 
                                                        END alerta,
                                                        (SELECT
                                                            COUNT(*) 
                                                        FROM
                                                            mesas_nacionales c1 
                                                        WHERE
                                                            m.tarea = c1.tarea 
                                                            AND c1.hora_ingreso >= DATE_SUB( CURDATE(), INTERVAL 10 DAY ) 
                                                            AND c1.estado = 'Gestionado') as counter
                                                FROM
                                                    mesas_nacionales m
                                                WHERE
                                                    m.estado != 'Gestionado' 
                                                    AND m.mesa = 'Mesa 1' 
                                                ORDER BY
                                                    hora_ingreso");
            $stmt->execute();

            if ($stmt->rowCount()) {
                $response = ['state' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC), 'counter' => $stmt->rowCount()];
            } else {
                $response = ['state' => false, 'msj' => 'No se encontraron registros'];
            }

            $this->_DB = null;

            return $response;


        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
    }

    /**
     * @param $data
     * @return array|void
     * mesa Edatel- Soporte LB- Cambios Pto
     */
    public function mesa2($data)
    {
        try {

            $stmt = $this->_DB->query("SELECT
                                                    m.*,
                                                CASE
                                                        
                                                        WHEN (
                                                        SELECT
                                                            COUNT(*) 
                                                        FROM
                                                            mesas_nacionales c1 
                                                        WHERE
                                                            m.tarea = c1.tarea 
                                                            AND c1.hora_ingreso >= DATE_SUB( CURDATE(), INTERVAL 10 DAY ) 
                                                            AND c1.estado = 'Gestionado' 
                                                            ) > 0 THEN
                                                            'TRUE' ELSE 'FALSE' 
                                                        END alerta,
                                                        (SELECT
                                                            COUNT(*) 
                                                        FROM
                                                            mesas_nacionales c1 
                                                        WHERE
                                                            m.tarea = c1.tarea 
                                                            AND c1.hora_ingreso >= DATE_SUB( CURDATE(), INTERVAL 10 DAY ) 
                                                            AND c1.estado = 'Gestionado') as counter
                                                FROM
                                                    mesas_nacionales m
                                                WHERE
                                                    m.estado != 'Gestionado' 
                                                    AND m.mesa = 'Mesa 2' 
                                                ORDER BY
                                                    hora_ingreso");
            $stmt->execute();

            if ($stmt->rowCount()) {
                $response = ['state' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC), 'counter' => $stmt->rowCount()];
            } else {
                $response = ['state' => false, 'msj' => 'No se encontraron registros'];
            }

            $this->_DB = null;

            return $response;


        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
    }

    /**
     * @param $data
     * @return array|void
     * mesa Mesa de Validaciones
     */
    public function mesa3($data)
    {
        try {

            $stmt = $this->_DB->query("SELECT
                                                    m.*,
                                                CASE
                                                        
                                                        WHEN (
                                                        SELECT
                                                            COUNT(*) 
                                                        FROM
                                                            mesas_nacionales c1 
                                                        WHERE
                                                            m.tarea = c1.tarea 
                                                            AND c1.hora_ingreso >= DATE_SUB( CURDATE(), INTERVAL 10 DAY ) 
                                                            AND c1.estado = 'Gestionado' 
                                                            ) > 0 THEN
                                                            'TRUE' ELSE 'FALSE' 
                                                        END alerta,
                                                        (SELECT
                                                            COUNT(*) 
                                                        FROM
                                                            mesas_nacionales c1 
                                                        WHERE
                                                            m.tarea = c1.tarea 
                                                            AND c1.hora_ingreso >= DATE_SUB( CURDATE(), INTERVAL 10 DAY ) 
                                                            AND c1.estado = 'Gestionado') as counter
                                                FROM
                                                    mesas_nacionales m
                                                WHERE
                                                    m.estado != 'Gestionado' 
                                                    AND m.mesa = 'Mesa 3' 
                                                ORDER BY
                                                    hora_ingreso");
            $stmt->execute();

            if ($stmt->rowCount()) {
                $response = ['state' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC), 'counter' => $stmt->rowCount()];
            } else {
                $response = ['state' => false, 'msj' => 'No se encontraron registros'];
            }

            $this->_DB = null;

            return $response;


        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
    }

    /**
     * @param $data
     * @return array|void
     * mesa Premisas extendidas
     */

    /**
     * mesa 5 Rescate Upgrades
     */
    /*public function mesa4($data)
    {
        try {

            $stmt = $this->_DB->query("SELECT
                                                    m.*,
                                                CASE
                                                        
                                                        WHEN (
                                                        SELECT
                                                            COUNT(*) 
                                                        FROM
                                                            mesas_nacionales c1 
                                                        WHERE
                                                            m.tarea = c1.tarea 
                                                            AND c1.hora_ingreso >= DATE_SUB( CURDATE(), INTERVAL 10 DAY ) 
                                                            AND c1.estado = 'Gestionado' 
                                                            ) > 0 THEN
                                                            'TRUE' ELSE 'FALSE' 
                                                        END alerta,
                                                        (SELECT
                                                            COUNT(*) 
                                                        FROM
                                                            mesas_nacionales c1 
                                                        WHERE
                                                            m.tarea = c1.tarea 
                                                            AND c1.hora_ingreso >= DATE_SUB( CURDATE(), INTERVAL 10 DAY ) 
                                                            AND c1.estado = 'Gestionado') as counter
                                                FROM
                                                    mesas_nacionales m
                                                WHERE
                                                    m.estado != 'Gestionado' 
                                                    AND m.mesa = 'Mesa 4' 
                                                ORDER BY
                                                    hora_ingreso");
            $stmt->execute();

            if ($stmt->rowCount()) {
                $response = ['state' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC), 'counter' => $stmt->rowCount()];
            } else {
                $response = ['state' => false, 'msj' => 'No se encontraron registros'];
            }

            $this->_DB = null;

            return $response;


        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
    }*/

    /**
     * @param $data
     * @return array|void
     * mesa BSC
     */
    public function mesa6($data)
    {
        try {

            $stmt = $this->_DB->query("SELECT
                                                    m.*,
                                                CASE
                                                        
                                                        WHEN (
                                                        SELECT
                                                            COUNT(*) 
                                                        FROM
                                                            mesas_nacionales c1 
                                                        WHERE
                                                            m.tarea = c1.tarea 
                                                            AND c1.hora_ingreso >= DATE_SUB( CURDATE(), INTERVAL 10 DAY ) 
                                                            AND c1.estado = 'Gestionado' 
                                                            ) > 0 THEN
                                                            'TRUE' ELSE 'FALSE' 
                                                        END alerta,
                                                        (SELECT
                                                            COUNT(*) 
                                                        FROM
                                                            mesas_nacionales c1 
                                                        WHERE
                                                            m.tarea = c1.tarea 
                                                            AND c1.hora_ingreso >= DATE_SUB( CURDATE(), INTERVAL 10 DAY ) 
                                                            AND c1.estado = 'Gestionado') as counter
                                                FROM
                                                    mesas_nacionales m
                                                WHERE
                                                    m.estado != 'Gestionado' 
                                                    AND m.mesa = 'Mesa 5' 
                                                ORDER BY
                                                    hora_ingreso");
            $stmt->execute();

            if ($stmt->rowCount()) {
                $response = ['state' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC), 'counter' => $stmt->rowCount()];
            } else {
                $response = ['state' => false, 'msj' => 'No se encontraron registros'];
            }

            $this->_DB = null;

            return $response;


        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
    }

    public function mesa7($data)
    {
        try {

            $stmt = $this->_DB->query("SELECT
                                                    m.*,
                                                CASE
                                                        
                                                        WHEN (
                                                        SELECT
                                                            COUNT(*) 
                                                        FROM
                                                            mesas_nacionales c1 
                                                        WHERE
                                                            m.tarea = c1.tarea 
                                                            AND c1.hora_ingreso >= DATE_SUB( CURDATE(), INTERVAL 10 DAY ) 
                                                            AND c1.estado = 'Gestionado' 
                                                            ) > 0 THEN
                                                            'TRUE' ELSE 'FALSE' 
                                                        END alerta,
                                                        (SELECT
                                                            COUNT(*) 
                                                        FROM
                                                            mesas_nacionales c1 
                                                        WHERE
                                                            m.tarea = c1.tarea 
                                                            AND c1.hora_ingreso >= DATE_SUB( CURDATE(), INTERVAL 10 DAY ) 
                                                            AND c1.estado = 'Gestionado') as counter
                                                FROM
                                                    mesas_nacionales m
                                                WHERE
                                                    m.estado != 'Gestionado' 
                                                    AND m.mesa = 'Mesa 6' 
                                                ORDER BY
                                                    hora_ingreso");
            $stmt->execute();

            if ($stmt->rowCount()) {
                $response = ['state' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC), 'counter' => $stmt->rowCount()];
            } else {
                $response = ['state' => false, 'msj' => 'No se encontraron registros'];
            }

            $this->_DB = null;

            return $response;


        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
    }

    public function registros($data)
    {
        try {

            $pagenum = $data['page'];
            $pagesize = $data['size'];
            $offset = ($pagenum - 1) * $pagesize;

            $con = '';
            if (isset($data['data']['fechaini']) && isset($data['data']['fechafin'])) {
                $fechaini = $data['data']['fechaini'];
                $fechafin = $data['data']['fechafin'];

                $con = " and hora_ingreso BETWEEN '$fechaini 00:00:00' AND '$fechafin 23:59:59' ";
            } else {
                $fechaini = date('Y-m-d');
                $fechafin = date('Y-m-d');

                $con = " and hora_ingreso BETWEEN '$fechaini 00:00:00' AND '$fechafin 23:59:59' ";
            }

            if (isset($data['data']['pedido'])) {
                $pedido = $data['data']['pedido'];
                $con .= " AND pedido = '$pedido' ";
            }

            if (isset($data['data']['data'])) {
                $mesa = $data['data']['data']['mesas'];
                $con .= " AND mesa = '$mesa' ";
            }

            $stmt = $this->_DB->query("SELECT count(*) as count FROM mesas_nacionales where 1=1 $con AND estado = 'Gestionado' ORDER BY hora_ingreso desc LIMIT $offset, $pagesize");
            $stmt->execute();
            $count = $stmt->fetch(PDO::FETCH_OBJ);
            $counter = $count->count;

            $stmt = $this->_DB->query("SELECT
                                                    hora_ingreso,
                                                    hora_marca,
                                                    hora_gestion,
                                                    estado,
                                                    login_gestion,
                                                    nombre_tecnico,
                                                    cc_tecnico,
                                                    num_contacto_tecnico,
                                                    tipificacion,
                                                    tipificacion_2,
                                                    observacion_tecnico,
                                                    observacion_gestion,
                                                    tarea,
                                                    pedido,
                                                    TaskTypeCategory,
                                                    UneSourceSystem,
                                                CASE
                                                        mesa 
                                                        WHEN 'Mesa 1' THEN
                                                        'Soporte Siebel-Edatel-Elite' 
                                                        WHEN 'Mesa 2' THEN
                                                        'Edatel- Soporte LB- Cambios Pto' 
                                                        WHEN 'Mesa 3' THEN
                                                        'Mesa de Validaciones' 
                                                        -- WHEN 'Mesa 4' THEN
                                                        -- 'P. ext.' 
                                                        WHEN 'Mesa 6' THEN
                                                        'BSC' 
                                                    END AS mesa,
                                                    accion_tecnico 
                                                FROM
                                                    mesas_nacionales WHERE 1=1 $con AND estado = 'Gestionado' ORDER BY hora_ingreso desc LIMIT $offset, $pagesize");
            $stmt->execute();

            if ($stmt->rowCount()) {
                $response = ['state' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC), 'counter' => $counter];
            } else {
                $response = ['state' => false, 'msj' => 'No se encontraron registros'];
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
            $user = $data['usuario'];
            $tarea = $data['tarea'];


            if (!$user) {
                $response = ['state' => 99, 'title' => 'Su session ha expirado', 'text' => 'Inicia session nuevamente para continuar'];
            } else {

                $stmt = $this->_DB->prepare("SELECT m.estado, m.login_gestion, CASE
                                                        WHEN (
                                                        SELECT
                                                            COUNT(*) 
                                                        FROM
                                                            mesas_nacionales c1 
                                                        WHERE
                                                            m.tarea = c1.tarea 
                                                            AND c1.hora_ingreso >= DATE_SUB( CURDATE(), INTERVAL 10 DAY ) 
                                                            AND c1.estado = 'Gestionado' 
                                                            ) > 0 THEN
                                                            TRUE ELSE FALSE 
                                                        END alerta   
                                                        FROM mesas_nacionales m WHERE m.id = :tarea");
                $stmt->execute([':tarea' => $tarea]);


                if ($stmt->rowCount()) {
                    $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
                    $alerta = $res[0]['alerta'];
                    $stmt = $this->_DB->query("SELECT login FROM usuarios WHERE perfil = '11'");
                    $stmt->execute();
                    $res1 = $stmt->fetchAll(PDO::FETCH_ASSOC);
                    $usuarios_array = array_column($res1, 'login');

                    if ($res[0]['estado'] == 'Sin gestión') {
                        $stmt = $this->_DB->prepare("UPDATE mesas_nacionales SET estado = 'En gestión', login_gestion = :user, hora_marca = :fecha WHERE id = :tarea");
                        $stmt->execute([':user' => $user, ':fecha' => date('Y-m-d H:i:s'), ':tarea' => $tarea]);
                        if ($stmt->rowCount()) {
                            $response = ['state' => true, 'msj' => 'tarea Bloqueada correctamente', 'alerta' => $alerta];
                        } else {
                            $response = ['state' => false, 'msj' => 'Ha ocurrido un erro interno intentalo nuevamente en unos minutos'];
                        }
                    } elseif (($res[0]['estado'] == 'En gestión') && ($res[0]['login_gestion'] == $user || in_array($user, $usuarios_array))) {
                        $stmt = $this->_DB->prepare("UPDATE mesas_nacionales SET estado = 'Sin gestión', login_gestion = '' WHERE id = :tarea");
                        $stmt->execute([':tarea' => $tarea]);
                        if ($stmt->rowCount()) {
                            $response = ['state' => true, 'msj' => 'tarea Desbloqueado correctamente'];
                        } else {
                            $response = ['state' => false, 'msj' => 'Ha ocurrido un erro interno intentalo nuevamente en unos minutos'];
                        }
                    } else {
                        $response = ['state' => false, 'msj' => 'La tarea se encuentra Bloqueado por otro agente'];
                    }
                } else {
                    $response = ['state' => false, 'msj' => 'La tarea no existe'];
                }
            }

            $this->_DB = null;

            return $response;

        } catch (PDOException $t) {
            var_dump($t->getMessage());
        }
    }

    public function guarda($data)
    {
        try {
            $id = $data['id'];
            $fecha = date('Y-m-d H:i:s');
            $tipificacion = $data['tipificacion'];
            $tipificacion2 = $data['tipificaciones2'];
            $observacion = $data['observacion'];
            $user = $data['usuario'];
            $usuario_gestion = $data['usuario_gestion'];

            $stmt = $this->_DB->prepare("SELECT login_gestion FROM mesas_nacionales WHERE id = :id");
            $stmt->execute([':id' => $id]);
            if ($stmt->rowCount() == 1) {
                $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
                if ($res[0]['login_gestion'] == $usuario_gestion) {
                    $stmt = $this->_DB->prepare("UPDATE mesas_nacionales SET hora_gestion = :fecha, tipificacion = :tipifica, observacion_gestion = :obser,  tipificacion_2 = :tipifica2,  estado = 'Gestionado' WHERE id = :id");

                    $stmt->execute([
                        ':fecha' => $fecha,
                        ':tipifica' => $tipificacion,
                        ':tipifica2' => $tipificacion2,
                        ':obser' => $observacion,
                        ':id' => $id,
                    ]);

                    if ($stmt->rowCount() == 1) {
                        $response = ['state' => true, 'msj' => 'La tarea se ha guardado correctamente'];
                    } else {
                        $response = ['state' => false, 'msj' => 'Ha ocurrido un erro interno intentalo nuevamente en unos minutos'];
                    }
                } else {
                    $response = ['state' => false, 'msj' => 'La tarea se encuentra en gestión por otro asesor'];

                }
            } else {
                $response = ['state' => false, 'msj' => 'Tarea no existe'];
            }


            return $response;

        } catch (PDOException $r) {
            var_dump($r->getMessage());
        }
        $this->_DB = null;
    }

    public function detalleMesa($data)
    {
        try {
            $pagenum = $data['page'];
            $pagesize = $data['size'];
            $offset = ($pagenum - 1) * $pagesize;

            $mesa = $data['buscar']['mesas'];
            if ($mesa == 'Todos') {
                if (isset($data['buscar']['fechaini'])) {
                    $fechaini = $data['buscar']['fechaini'];
                    $fechafin = $data['buscar']['fechafin'];
                    $f = " AND hora_ingreso BETWEEN '$fechaini 00:00:00' AND '$fechafin 23:59:59' ";
                } else {
                    $fechaini = date('Y-m-d');
                    $fechafin = date('Y-m-d');
                    $f = " AND hora_ingreso BETWEEN '$fechaini 00:00:00' AND '$fechafin 23:59:59' ";
                }
                if (isset($data['buscar']['concepto'])) {
                    $concepto = $data['buscar']['concepto'];
                    $buscar = $data['buscar']['buscar'];
                    $f .= " AND $concepto = '$buscar' ";
                }
                $con = "  $f  ORDER BY hora_ingreso desc LIMIT $offset, $pagesize ";
                $con1 = "  $f ORDER BY hora_ingreso desc";
                if (isset($data['buscar']['export'])) {
                    $fechaini = $data['buscar']['fechaini'];
                    $fechafin = $data['buscar']['fechafin'];
                    $con = " AND estado = 'Gestionado' AND hora_ingreso BETWEEN '$fechaini 00:00:00' AND '$fechafin 23:59:59' ORDER BY hora_ingreso desc ";
                    $con1 = " AND estado = 'Gestionado' AND hora_ingreso BETWEEN '$fechaini 00:00:00' AND '$fechafin 23:59:59' ORDER BY hora_ingreso desc ";
                }

            } else {

                if (isset($data['buscar']['fechaini'])) {
                    $fechaini = $data['buscar']['fechaini'];
                    $fechafin = $data['buscar']['fechafin'];
                    $f = " AND hora_ingreso BETWEEN '$fechaini 00:00:00' AND '$fechafin 23:59:59' ";
                } else {
                    $fechaini = date('Y-m-d');
                    $fechafin = date('Y-m-d');
                    $f = " AND hora_ingreso BETWEEN '$fechaini 00:00:00' AND '$fechafin 23:59:59' ";
                }
                if (isset($data['buscar']['concepto'])) {
                    $concepto = $data['buscar']['concepto'];
                    $buscar = $data['buscar']['buscar'];
                    $f .= " AND $concepto = '$buscar' ";
                }
                $con = " AND mesa = '$mesa' AND estado = 'Gestionado' $f ORDER BY hora_ingreso desc LIMIT $offset, $pagesize ";
                $con1 = " AND mesa = '$mesa' AND estado = 'Gestionado' $f ORDER BY hora_ingreso desc";
                if (isset($data['buscar']['export'])) {
                    $fechaini = $data['buscar']['fechaini'];
                    $fechafin = $data['buscar']['fechafin'];
                    $con = " AND mesa = '$mesa' AND estado = 'Gestionado' AND hora_ingreso BETWEEN '$fechaini 00:00:00' AND '$fechafin 23:59:59' ORDER BY hora_ingreso desc ";
                    $con1 = " AND mesa = '$mesa' AND estado = 'Gestionado' AND hora_ingreso BETWEEN '$fechaini 00:00:00' AND '$fechafin 23:59:59' ORDER BY hora_ingreso desc ";
                }
            }

            $stmt = $this->_DB->query("SELECT * FROM mesas_nacionales where 1=1 $con1");
            $stmt->execute();
            $count = $stmt->rowCount();

            /*echo "SELECT
                                                        hora_ingreso,
                                                        hora_marca,
                                                        hora_gestion,
                                                        estado,
                                                        login_gestion,
                                                        nombre_tecnico,
                                                        cc_tecnico,
                                                        num_contacto_tecnico,
                                                        tipificacion,
                                                        tipificacion_2,
                                                        observacion_tecnico,
                                                        observacion_gestion,
                                                        tarea,
                                                        pedido,
                                                        TaskTypeCategory,
                                                        UneSourceSystem,
                                                    CASE
                                                        mesa 
                                                       WHEN 'Mesa 1' THEN
                                                        'Soporte Siebel-Edatel-Elite' 
                                                        WHEN 'Mesa 2' THEN
                                                        'Edatel- Soporte LB- Cambios Pto' 
                                                        WHEN 'Mesa 3' THEN
                                                        'Mesa de Validaciones' 
                                                        WHEN 'Mesa 4' THEN
                                                        'P. ext.' 
                                                        WHEN 'Mesa 6' THEN
                                                        'BSC' 
                                                    END AS mesa,
                                                        accion_tecnico,
                                                        region,
                                                        area
                                                    FROM
                                                        mesas_nacionales WHERE 1=1 $con";
            exit();*/

            $stmt = $this->_DB->prepare("SELECT
                                                        hora_ingreso,
                                                        hora_marca,
                                                        hora_gestion,
                                                        estado,
                                                        login_gestion,
                                                        nombre_tecnico,
                                                        cc_tecnico,
                                                        num_contacto_tecnico,
                                                        tipificacion,
                                                        tipificacion_2,
                                                        observacion_tecnico,
                                                        observacion_gestion,
                                                        tarea,
                                                        pedido,
                                                        TaskTypeCategory,
                                                        UneSourceSystem,
                                                    CASE
                                                        mesa 
                                                       WHEN 'Mesa 1' THEN
                                                        'Soporte Siebel-Edatel-Elite' 
                                                        WHEN 'Mesa 2' THEN
                                                        'Edatel- Soporte LB- Cambios Pto' 
                                                        WHEN 'Mesa 3' THEN
                                                        'Mesa de Validaciones' 
                                                        WHEN 'Mesa 4' THEN
                                                        'P. ext.' 
                                                        WHEN 'Mesa 6' THEN
                                                        'BSC' 
                                                    END AS mesa,
                                                        accion_tecnico,
                                                        region,
                                                        area
                                                    FROM
                                                        mesas_nacionales WHERE 1=1 $con");


            $stmt->execute();
            if ($stmt->rowCount()) {
                $response = ['state' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC), 'counter' => $count];
            } else {
                $response = ['state' => false, 'msj' => 'No se encontraron registros'];
            }

            $this->_DB = null;

            return $response;
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
    }

    public function graphic($data)
    {
        $con = '';
        /*if (isset($data['accion'])) {
            if ($data['accion'] == 'no') {
                $con = " AND tipificacion = 'No funciono' ";
            } elseif ($data['accion'] == 'si') {
                $con = " AND tipificacion != 'No funciono' AND subtipificacion in ('Cm_offline','Garantía instalación','Se requiere reiniciar')";
            }
        } else {
            $con = " AND tipificaciones != 'No funciono' ";
        }*/

        $con = '';
        if (isset($data['mesa'])) {
            $mesa = $data['mesa'];
            if ($mesa !== 'Todas') {
                $con = " AND mesa = '$mesa' ";
            } else {
                $con = "  ";
            }
        } else {
            $con = " AND mesa = 'Mesa 1' ";
        }

        if (isset($data['fecha'])) {
            $fecha = $data['fecha'];
        } else {
            $fecha = date('Y-m-d');
        }

        try {
            $stmt = $this->_DB->prepare("SELECT
                                                    e.tipificacion,
                                                    COUNT(*) AS count 
                                                FROM
                                                    mesas_nacionales e 
                                                WHERE
                                                    1 = 1 
                                                    AND e.hora_gestion BETWEEN '$fecha 00:00:00' 
                                                    AND '$fecha 23:59:59' $con
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

    public function graphicDetails($data)
    {


        if (isset($data['mesa'])) {
            $mesa = $data['mesa'];
            if ($mesa !== 'Todas') {
                $con = " AND mesa = '$mesa' ";
            } else {
                $con = "  ";
            }
        } else {
            $con = " AND mesa = 'Mesa 1' ";
        }

        if (isset($data['fecha'])) {
            $fecha = $data['fecha'];
        } else {
            $fecha = date('Y-m-d');
        }

        try {
            $stmt = $this->_DB->prepare("SELECT
                                                CASE
                                                    tipificacion_2 
                                                    WHEN 'Finalizado' THEN
                                                    'Finalizado' 
                                                    WHEN 'Devuelto al técnico por mal ingreso' THEN
                                                    'Devuelto al técnico por mal ingreso' 
                                                    WHEN 'No finalizado con éxito' THEN
                                                    'No finalizado con éxito' ELSE 'Sin gestión' 
                                                END AS tipificacion,
                                                COUNT(*) AS count 
                                                FROM
                                                    mesas_nacionales 
                                                WHERE
                                                    hora_ingreso BETWEEN '$fecha 00:00:00' 
                                                    AND '$fecha 23:59:59' 
                                                    $con
                                                GROUP BY
                                                    tipificacion_2;");
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

            if (isset($data['mesa'])) {
                $mesa = $data['mesa'];
                if ($mesa !== 'Todas') {
                    $con = " AND mesa = '$mesa' ";
                } else {
                    $con = "  ";
                }
            } else {
                $con = " AND mesa = 'Mesa 1' ";
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
                                                FROM mesas_nacionales p
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

}
