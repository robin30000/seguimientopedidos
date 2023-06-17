<?php
//error_reporting(E_ALL);
require_once 'conection.php';

class Modelauthentication
{
    private $_DB;

    public function __construct()
    {
        $this->_DB = new Conection();
        //$this->dbpgsql = \Config\Database::connect('pgsql');
        //$this->dbsqlsrv = \Config\Database::connect('sqlsrv');
    }

    public function loginUser($usuarioid, $password)
    {
        ini_set('session.gc_maxlifetime', 3600); // 1 hour
        session_set_cookie_params(3600);
        session_start();
        $res = '';
        try {
            $stmt = $this->_DB->prepare("SELECT id, login, nombre, identificacion, perfil, password FROM usuarios WHERE login = ? AND password = ?");
            $stmt->bindParam(1, $usuarioid, PDO::PARAM_STR);
            $stmt->bindParam(2, $password, PDO::PARAM_STR);
            $stmt->execute();
            if ($stmt->rowCount() == 1) {
                $res = $stmt->fetch(PDO::FETCH_OBJ);
            } else {
                $res = 0;
            }


        } catch (PDOException $e) {
            //$res = array('state' => 0, 'msg' => 'Error ' . $e->getMessage());
        }
        $this->_DB = null;

        return $res;
    }

    public function getIngresosalida($today, $usuarioid, $fecha)
    {
        ini_set('session.gc_maxlifetime', 3600); // 1 hour
        session_set_cookie_params(3600);
        session_start();
        try {
            $todayStart = $today . ' 00:00:00';
            $todayEnd   = $today . ' 23:59:59';
            $res        = 0;

            /*$stmt = $this->_DB->prepare("SELECT id, fecha_ingreso, date_format(fecha_ingreso,'%H:%i:%s') as hora_ingreso, SEC_TO_TIME((TIMESTAMPDIFF(second, fecha_ingreso, :fecha ))) total FROM registro_ingresoSeguimiento WHERE fecha_ingreso BETWEEN :todayStart AND :todayStart AND idusuario = :usuarioid LIMIT 1");
            $stmt->execute(array(':fecha' => $fecha, ':todayStart' => $todayStart, ':todayEnd' => $todayEnd, ':usuarioid' => $usuarioid));


            /*$stmt->bindParam(1, $fecha, PDO::PARAM_STR);
            $stmt->bindParam(2, $todayStart, PDO::PARAM_STR);
            $stmt->bindParam(3, $todayEnd, PDO::PARAM_STR);
            $stmt->bindParam(4, $usuarioid, PDO::PARAM_STR);*/
            //$stmt->execute();
            //var_dump($stmt->debugDumpParams());
            //var_dump( $stmt->queryString, $stmt->_debugQuery() );

            /*if ($stmt->rowCount() == 1) {
                $res = $stmt->fetch(PDO::FETCH_OBJ);
            } else {
                $res = 0;
            }*/

            return $res;
        } catch (PDOException $e) {
            //throw $th;
            die($e->getMessage());
        }
        $this->_DB = null;

        return $res;
    }

    public function createingresosalida($usuarioid, $fecha, $usuarioIp, $usuarioPc, $aplicacion)
    {
        ini_set('session.gc_maxlifetime', 3600); // 1 hour
        session_set_cookie_params(3600);
        session_start();
        //echo $usuarioid . $fecha . $usuarioIp . $usuarioPc . $aplicacion;

        //CRAMICEB 2022-11-27 12:54:30 10.183.120.43 10.183.120.43 Seguimiento
        try {
            $stmt = $this->_DB->prepare("INSERT INTO registro_ingresoSeguimiento (idusuario, status, fecha_ingreso, ip, pc, aplicacion) VALUES (?, 'logged in', ?, ?, ?, ?)");
            $stmt->bindParam(1, $usuarioid, PDO::PARAM_STR);
            $stmt->bindParam(2, $fecha, PDO::PARAM_STR);
            $stmt->bindParam(3, $usuarioIp, PDO::PARAM_STR);
            $stmt->bindParam(4, $usuarioPc, PDO::PARAM_STR);
            $stmt->bindParam(5, $aplicacion, PDO::PARAM_STR);
            $stmt->execute();
            if ($stmt->rowCount() == 1) {
                $res = $stmt->rowCount();
            } else {
                $res = 0;
            }


        } catch (\Exception $e) {
            //throw $th;
            //die($e->getMessage());
            return -1;
        }

        return $res;
    }

    public function updateingreso($idd)
    {
        ini_set('session.gc_maxlifetime', 3600); // 1 hour
        session_set_cookie_params(3600);
        session_start();
        try {
            $stmt = $this->_DB->prepare("UPDATE registro_ingresoSeguimiento SET status = 'logged in', ingresos = ingresos+1 WHERE id = ?");
            $stmt->bindParam(1, $idd, PDO::PARAM_STR);
            $stmt->execute();
            if ($stmt->rowCount()) {
                $res = $stmt->rowCount();
            } else {
                $res = 0;
            }

            return $res;
        } catch (\Exception $e) {
            //throw $th;
            //die($e->getMessage());
            return -1;
        }
    }

    public function updatesalida($idd, $fecha, $total_dia, $hora, $minutos, $segundos, $totalminutos)
    {

        ini_set('session.gc_maxlifetime', 3600); // 1 hour
        session_set_cookie_params(3600);
        session_start();
        try {
            $stmt = $this->_DB->prepare("UPDATE registro_ingresoSeguimiento SET status = 'logged off', fecha_salida = ?,salidas = salidas+1, total_dia = ?, hora = ?, minutos = ?, segundos = ?, total_factura = ? WHERE id = ?");
            $stmt->bindParam(1, $fecha, PDO::PARAM_STR);
            $stmt->bindParam(2, $total_dia, PDO::PARAM_STR);
            $stmt->bindParam(3, $hora, PDO::PARAM_STR);
            $stmt->bindParam(4, $minutos, PDO::PARAM_STR);
            $stmt->bindParam(5, $segundos, PDO::PARAM_STR);
            $stmt->bindParam(6, $totalminutos, PDO::PARAM_STR);
            $stmt->bindParam(7, $idd, PDO::PARAM_STR);
            $stmt->execute();
            if ($stmt->rowCount() == 1) {
                $res = $stmt->rowCount();
            } else {
                $res = 0;
            }

            return $res;
        } catch (\Exception $e) {
            //throw $th;
            //die($e->getMessage());
            return -1;
        }
    }
}
