<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
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

            $stmt = $this->_DB->query("SELECT * FROM etp where status_soporte != '2' ORDER BY fecha_crea");
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
            }else {

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
            } else{
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
            $tipificaciones = implode(',',$tipificaciones);
            $tipificaciones2 = $data['tipificaciones2'];
            $observacion = $data['observacion'];
            $user = $data['login_gestion'];

            if (!$user){
                $response = ['state' => false, 'msj' => 'Su session e expirado inicia session nuevamente para continuar'];
            }else{
                //echo $id.$tipificaciones.$tipificaciones2.$observacion.$user;exit();
                $stmt = $this->_DB->prepare("SELECT login_gestion FROM etp WHERE id_soporte = :id");
                $stmt->execute([':id' => $id]);
                if ($stmt->rowCount() == 1) {
                    $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
                    if ($res[0]['login_gestion'] == $user) {
                        $stmt = $this->_DB->prepare("UPDATE etp SET fecha_gestion = :fecha, tipificaciones = :tipificaciones, tipificaciones2 = :tipificaiones2, observacionesGestion = :observacion,  status_soporte = '2' WHERE id_soporte = :id");
                        $stmt->execute([':fecha' => $fecha, ':tipificaciones' => $tipificaciones,':tipificaiones2' => $tipificaciones2, ':observacion' => $observacion,':id'=>$id]);
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

            $con = '';
            if (isset($data['data']['fechaini']) && isset($data['data']['fechafin'])) {
                $fechaini = $data['data']['fechaini'];
                $fechafin = $data['data']['fechafin'];

                $con = " and fecha_crea BETWEEN '$fechaini 00:00:00' AND '$fechafin 23:59:59' ";
            }

            if (isset($data['data']['pedido'])) {
                $pedido = $data['data']['pedido'];
                $con .= " AND tarea = '$pedido' ";
            }

            if(isset($data['export'])){
                $count = 1;
                $stmt = $this->_DB->query("SELECT * FROM etp where 1=1 $con  ORDER BY fecha_crea desc");
                $stmt->execute();
            }else{
                $stmt = $this->_DB->query("SELECT count(*) as counter FROM etp  ORDER BY fecha_crea");
                $stmt->execute();
                $res = $stmt->fetch(PDO::FETCH_OBJ);
                $count = $res->counter;

                $stmt = $this->_DB->query("SELECT * FROM etp where 1=1 $con  ORDER BY fecha_crea LIMIT $offset, $pagesize");
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

    public function datosTerminadosRegistros($data){
        try {

            $pagenum = $data['page'];
            $pagesize = $data['size'];
            $offset = ($pagenum - 1) * $pagesize;

            $con = '';
            if (isset($data['data']['fechaini']) && isset($data['data']['fechafin'])) {
                $fechaini = $data['data']['fechaini'];
                $fechafin = $data['data']['fechafin'];

                $con = " and fecha_crea BETWEEN '$fechaini 00:00:00' AND '$fechafin 23:59:59' ";
            }

            if (isset($data['data']['pedido'])) {
                $pedido = $data['data']['pedido'];
                $con = " AND unepedido = '$pedido' ";
            }

            if(isset($data['export'])){
                $count = 1;
                $stmt = $this->_DB->query("SELECT * FROM etp where 1=1 $con and status_soporte = '2' ORDER BY fecha_crea desc ");
                $stmt->execute();
            }else{
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

}
