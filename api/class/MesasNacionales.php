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

    public function mesa1($data)
    {
        try {

            $stmt = $this->_DB->query("SELECT * FROM mesas_nacionales where estado != 'Gestionado' and mesa = 'Mesa 1' ORDER BY hora_ingreso");
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

    public function mesa2($data)
    {
        try {

            $stmt = $this->_DB->query("SELECT * FROM mesas_nacionales where estado != 'Gestionado' and mesa = 'Mesa 2' ORDER BY hora_ingreso");
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

    public function mesa3($data)
    {
        try {

            $stmt = $this->_DB->query("SELECT * FROM mesas_nacionales where estado != 'Gestionado' and mesa = 'Mesa 3' ORDER BY hora_ingreso");
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

    public function mesa4($data)
    {
        try {

            $stmt = $this->_DB->query("SELECT * FROM mesas_nacionales where estado != 'Gestionado' and mesa = 'Mesa 4' ORDER BY hora_ingreso");
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

    public function mesa6($data)
    {
        try {

            $stmt = $this->_DB->query("SELECT * FROM mesas_nacionales where estado != 'Gestionado' and mesa = 'Mesa 5' ORDER BY hora_ingreso");
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

            $stmt = $this->_DB->query("SELECT * FROM mesas_nacionales where estado != 'Gestionado' and mesa = 'Mesa 6' ORDER BY hora_ingreso");
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
                                                        '8.1' 
                                                        WHEN 'Mesa 2' THEN
                                                        '8.3' 
                                                        WHEN 'Mesa 3' THEN
                                                        '8.9' 
                                                        WHEN 'Mesa 4' THEN
                                                        'P. ext.' 
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

                $stmt = $this->_DB->prepare("SELECT estado, login_gestion FROM mesas_nacionales WHERE id = :tarea");
                $stmt->execute([':tarea' => $tarea]);


                if ($stmt->rowCount()) {
                    $res = $stmt->fetchAll(PDO::FETCH_ASSOC);

                    $stmt = $this->_DB->query("SELECT login FROM usuarios WHERE perfil = '11'");
                    $stmt->execute();
                    $res1 = $stmt->fetchAll(PDO::FETCH_ASSOC);
                    $usuarios_array = array_column($res1, 'login');

                    if ($res[0]['estado'] == 'Sin gestión') {
                        $stmt = $this->_DB->prepare("UPDATE mesas_nacionales SET estado = 'En gestión', login_gestion = :user, hora_marca = :fecha WHERE id = :tarea");
                        $stmt->execute([':user' => $user, ':fecha' => date('Y-m-d H:i:s'), ':tarea' => $tarea]);
                        if ($stmt->rowCount()) {
                            $response = ['state' => true, 'msj' => 'tarea Bloqueada correctamente'];
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
            $con = '';
            $pagenum = $data['page'];
            $pagesize = $data['size'];
            $offset = ($pagenum - 1) * $pagesize;
            $count = '';
            if (isset($data['mesas'])) {
                $mesa = $data['mesas'];
                if ($mesa == 'Todos') {
                    $f = '';
                    if (isset($data['fechaini'])) {
                        $fechaini = $data['fechaini'];
                        $fechafin = $data['fechafin'];
                        $f = " AND hora_ingreso BETWEEN '$fechaini 00:00:00' AND '$fechafin 23:00:00' ";
                    }
                    $con = " AND estado = 'Gestionado' $f  ORDER BY hora_ingreso desc LIMIT $offset, $pagesize ";
                    $con1 = " AND estado = 'Gestionado' $f ORDER BY hora_ingreso desc";
                    if (isset($data['export'])) {
                        $fechaini = $data['fechaini'];
                        $fechafin = $data['fechafin'];
                        $con = " AND estado = 'Gestionado' AND hora_ingreso BETWEEN '$fechaini 00:00:00' AND '$fechafin 23:59:59' ";
                        $con1 = " AND estado = 'Gestionado' AND hora_ingreso BETWEEN '$fechaini 00:00:00' AND '$fechafin 23:59:59' ";
                    }
                } else {
                    $f = '';
                    if (isset($data['fechaini'])) {
                        $fechaini = $data['fechaini'];
                        $fechafin = $data['fechafin'];
                        $f = " AND hora_ingreso BETWEEN '$fechaini 00:00:00' AND '$fechafin 23:59:59' ";
                    }
                    $con = " AND mesa = '$mesa' AND estado = 'Gestionado' $f ORDER BY hora_ingreso desc LIMIT $offset, $pagesize ";
                    $con1 = " AND mesa = '$mesa' AND estado = 'Gestionado' $f ORDER BY hora_ingreso desc";
                    if (isset($data['export'])) {
                        $fechaini = $data['fechaini'];
                        $fechafin = $data['fechafin'];
                        $con = " AND mesa = '$mesa' AND estado = 'Gestionado' AND hora_ingreso BETWEEN '$fechaini 00:00:00' AND '$fechafin 23:59:59' ORDER BY hora_ingreso desc ";
                        $con1 = " AND mesa = '$mesa' AND estado = 'Gestionado' AND hora_ingreso BETWEEN '$fechaini 00:00:00' AND '$fechafin 23:59:59' ORDER BY hora_ingreso desc ";
                    }
                }

                $stmt = $this->_DB->query("SELECT * FROM mesas_nacionales where 1=1 $con1");
                $stmt->execute();
                $count = $stmt->rowCount();

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
                                                        '8.1' 
                                                        WHEN 'Mesa 2' THEN
                                                        '8.3' 
                                                        WHEN 'Mesa 3' THEN
                                                        '8.9' 
                                                        WHEN 'Mesa 4' THEN
                                                        'P. ext.' 
                                                    END AS mesa,
                                                        accion_tecnico,
                                                        region,
                                                        area
                                                    FROM
                                                        mesas_nacionales WHERE 1=1 $con");
            } elseif (isset($data['buscar'])) {
                $tarea = $data['buscar'];
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
                                                        '8.1' 
                                                        WHEN 'Mesa 2' THEN
                                                        '8.3' 
                                                        WHEN 'Mesa 3' THEN
                                                        '8.9' 
                                                        WHEN 'Mesa 4' THEN
                                                        'P. ext.' 
                                                    END AS mesa,
                                                        accion_tecnico,
                                                        region,
                                                        area
                                                    FROM
                                                        mesas_nacionales WHERE 1=1 AND tarea = '$tarea'");
            }

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

    /*    public function buscar($data){
            try {

            }catch (PDOException $e){
                var_dump($e->getMessage());
            }
        }*/

}
