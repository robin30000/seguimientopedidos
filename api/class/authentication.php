<?php

require '../vendor/autoload.php';
require_once "constants.php";
require_once '../class/conection.php';
require_once 'Ldap.php';
error_reporting(0);
ini_set('display_errors', 0);

use Firebase\JWT\JWT;

class authentication
{
    private $_DB;

    public function __construct()
    {
        $this->_DB = new Conection();
    }

    public function loginUser($data)
    {

        $today = date('Y-m-d');
        $fecha = date('Y-m-d H:i:s');
        $usuarioIp = $_SERVER['REMOTE_ADDR'];
        $usuarioPc = gethostbyaddr($usuarioIp);
        $aplicacion = "Seguimiento";

        try {

            /*$stmt = $this->_DB->prepare("SELECT estado FROM usuarios WHERE login = ? AND password = ?");
            $stmt->bindParam(1, $data->username, PDO::PARAM_STR);
            $stmt->bindParam(2, $data->password, PDO::PARAM_STR);
            $stmt->execute();


            if ($stmt->rowCount() == 1) {
                $res = $stmt->fetch(PDO::FETCH_OBJ);

                if ($res->estado == 'Inactivo') {
                    $response =  array('state' => 0, 'msj' => 'Su cuenta se encuentra inactiva, comuníquese con el administrador');
                    echo json_encode($response);
                    die();
                }
            }*/

            $ldapAuthenticator = new LdapAuthenticator();
            $result = $ldapAuthenticator->authenticate($data->username, $data->password);
            if ($result != "Login exitoso.") {
                echo json_encode(['state' => 2, 'msj' => 'Usuario y/o contraseña incorrecta']);
                die();
            }

            $stmt = $this->_DB->prepare("SELECT id, login, nombre, identificacion, perfil FROM usuarios WHERE login = ?");
            $stmt->bindParam(1, $data->username, PDO::PARAM_STR);
            $stmt->execute();

            if (!($stmt->rowCount())) {
                echo json_encode(['state' => 3, 'msj' => 'Usuario no se encuentra registrado']);
                die();
            }

            $stmt = $this->_DB->prepare("SELECT id, login, nombre, identificacion, perfil FROM usuarios WHERE login = ? AND estado = 'Activo'");
            $stmt->bindParam(1, $data->username, PDO::PARAM_STR);
            $stmt->execute();

            if ($stmt->rowCount() == 1) {
                $resLogin = $stmt->fetch(PDO::FETCH_OBJ);

                $stmt = $this->_DB->prepare("SELECT id, nombre FROM menu where estado = 'Activo'");
                $stmt->execute();
                $menu = $stmt->fetchAll(PDO::FETCH_ASSOC);
                $menus = [];
                foreach ($menu as $key => $value) {
                    $stmt = $this->_DB->prepare("SELECT
                                                                                    nombre AS sub,
                                                                                    url,
                                                                                    icon
                                                                                FROM
                                                                                    submenu
                                                                                INNER JOIN submenu_perfil ON submenu.id = submenu_perfil.submenu_id
                                                                                WHERE
                                                                                    menu_id = :menu
                                                                                AND submenu_perfil.perfil_id = :id
                                                                                AND estado = 'Activo' ORDER BY sub");
                    $stmt->execute(array(':menu' => $value['id'], ':id' => $resLogin->perfil));
                    $sub = $stmt->fetchAll(PDO::FETCH_ASSOC);
                    $menus[$key]['tittle'] = $value['nombre'];
                    for ($i = 0; $i < count($sub); $i++) {
                        $menus[$key]['n']['sub'][$i] = $sub[$i]['sub'];
                        $menus[$key]['n']['url'][$i] = $sub[$i]['url'];
                        $menus[$key]['n']['icon'][$i] = $sub[$i]['icon'];
                        //$people[$i]['salt']
                    }
                }

                $key = SIGNATURE_JWT;
                $payload = [
                    'iss' => 'https://seguimientopedido.tigo.com.co',
                    'sub' => 'seguimientopedidos',
                    'exp' => time() + 1296000,
                    'iat' => strtotime(date('Y-m-d H:i:s')),
                    'iduser' => $resLogin->id,
                    'login' => $data->username,
                    'perfil' => $resLogin->perfil,
                ];

                $jwt = JWT::encode($payload, $key, 'HS256');
                $resLogin->menu = $menus;
                $response = array('state' => 1, 'data' => $resLogin, 'token' => $jwt);

                session_destroy();
                ini_set('session.gc_maxlifetime', 86400); // 1 day
                session_set_cookie_params(86400);
                session_start();

                $_SESSION["logueado"] = true;
                $_SESSION['timeOnline'] = time() * 1000;
                $_SESSION['online'] = date("H:i:s");
                $_SESSION["login"] = $data->username;
                $_SESSION['id'] = $resLogin->id;
                $_SESSION['token_session'] = uniqid();
                $_SESSION['fecha_ingreso'] = date('Y-m-d H:i:s');
                $_SESSION['perfil'] = $resLogin->perfil;

                $stmtIngreso = $this->_DB->prepare("SELECT id
                                                         , fecha_ingreso
                                                         , date_format(fecha_ingreso, '%H:%i:%s') as hora_ingreso
                                                    FROM registro_ingresoSeguimiento
                                                    WHERE fecha_ingreso between :fechaini
                                                        and :fechafin
                                                      and idusuario = :usuario_id");

                $stmtIngreso->execute([':fechaini' => "$today 00:00:00", ':fechafin' => "$today 23:59:59", ':usuario_id' => $resLogin->login]);

                if ($stmtIngreso->rowCount()) {
                    /*$resStmtIngreso = $stmtIngreso->fetch(PDO::FETCH_OBJ);
                    $stmt = $this->_DB->prepare("update registro_ingresoSeguimiento set status='logged in', ingresos=ingresos+1 where id=?");
                    $stmt->bindParam(1, $resLogin->id, PDO::PARAM_INT);
                    $stmt->execute();*/
                } else {

                    /*$otherStmt = $this->_DB->prepare("insert into registro_ingresoSeguimiento (idusuario,status,fecha_ingreso, ip, pc, aplicacion) " .
                        "values(:usuario_id,'logged in',:fechaIngreso, :ip, :usuarioPc, :aplicacion)");
                    $otherStmt->execute([
                        ':usuario_id' => $resLogin->login,
                        ':fechaIngreso' => date('Y-m-d H:i:s'),
                        ':ip' => $usuarioIp,
                        ':usuarioPc' => $usuarioPc,
                        ':aplicacion' => $aplicacion,
                    ]);*/
                }
            } else {
                $response = array('state' => 4, 'msj' => 'Usuario esta inactivo. comuníquese con el administrador al siguiente correo: soportefieldservice@tigo.com.co');
            }
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_DB = null;
        echo json_encode($response);
    }

    public function updatesalida()
    {

        /*        session_start();
                $today = date('Y-m-d');
                $stmt = $this->_DB->prepare("SELECT id, fecha_ingreso
                         , date_format(fecha_ingreso,'%H:%i:%s') as hora_ingreso, SEC_TO_TIME((TIMESTAMPDIFF(second, fecha_ingreso, ? ))) total FROM
                                            registro_ingresoSeguimiento
                         WHERE fecha_ingreso between ? and ?
                         and idusuario = ? limit 1");
                $stmt->bindParam(1, $_SESSION['fecha_ingreso']);
                $stmt->bindValue(2, "$today 00:00:00");
                $stmt->bindValue(3, "$today 23:59:59");
                $stmt->bindParam(4, $_SESSION['login']);

                $stmt->execute();

                $result = $stmt->fetch(PDO::FETCH_OBJ);

                $total_dia = $result->total;

                $hora = substr($total_dia, 0, 2);
                $minutos = substr($total_dia, 3, 2);
                $segundos = substr($total_dia, 6, 2);

                $totalminutos = round((($hora * 60) + $minutos + $segundos) / 60, 2);*/

        /*        $stmt = $this->_DB->prepare("update registro_ingresoSeguimiento
                                set status='logged off',
                                    fecha_salida = :fechaSal,
                                    salidas=salidas + 1,
                                    total_dia = :total_dia, hora = :hora, minutos = :minutos, segundos = :segundos, total_factura = :total_factura
                                where id= :id");
                $stmt->execute([
                    ':fechaSal' => date('Y-m-d H:i:s'),
                    ':total_dia' => $total_dia,
                    ':hora' => $hora,
                    ':minutos' => $minutos,
                    ':segundos' => $segundos,
                    ':total_factura' => $totalminutos,
                    ':id' => $result->id,
                ]);*/

        //if ($stmt->rowCount() == 1) {
        //session_start();
        if (isset($_COOKIE[session_name()])) {
            setcookie(session_name(), "", time() - 3600, "/");
        }
        session_start();
        $_SESSION = [];
        session_destroy();
        $response = ['state' => 1, 'msj' => 'Sesión finalizada'];
        /*} else {
            $response = ['Error', 400];
        }*/
        echo json_encode($response);
    }

    public function SuperB($data)
    {
        try {

            $this->_DB->beginTransaction();
            $response = [];

            $stmt = $this->_DB->prepare("select 'Contingencia' as modulo,
                                                               observacion,
                                                               logincontingencia,
                                                               horagestion as fecha_ingreso,
                                                               horacontingencia as fecha_fin,
                                                               observacion as observacion,
                                                               observContingencia as observacion_asesor,
                                                               CASE
                                                                    WHEN engestion = 1 AND Finalizado = 'ok' THEN 'Finalizado'
                                                                        WHEN engestion = 1 AND finalizado IS NULL THEN 'En Gestión'
                                                                    ELSE 'Sin gestión'
                                                                END AS gestion
                                                        from contingencias
                                                        where tarea = :tarea");
            $stmt->execute(array(':tarea' => $data));

            if ($stmt->rowCount() > 0) {
                array_push($response, $stmt->fetchAll(PDO::FETCH_ASSOC));
            }

            $stmt = $this->_DB->prepare("select 'ETP' as modulo,
                                                       login_gestion as logincontingencia,
                                                       fecha_crea as fecha_ingreso,
                                                       fecha_gestion as fecha_fin,
                                                       observacion_terreno as observacion,
                                                       observacionesGestion as observacion_asesor,
                                                       case status_soporte when '1' then 'En gestión' when '0' then 'Sin gestión' else 'Finalizado' end gestion
                                                from etp
                                                where tarea = :tarea");
            $stmt->execute(array(':tarea' => $data));

            if ($stmt->rowCount() > 0) {
                array_push($response, $stmt->fetchAll(PDO::FETCH_ASSOC));
            }

            $stmt = $this->_DB->prepare("select 'Soporte GPON' as modulo,
                                                       login as logincontingencia,
                                                       fecha_creado as fecha_ingreso,
                                                       fecha_respuesta as fecha_fin,
                                                       observacion_terreno as observacion,
                                                       observacion as observacion_asesor,
                                                       -- case status_soporte when '1' then 'En gestión' when '0' then 'Sin gestión' else 'Finalizado' end gestion
                                                       -- case status_soporte when '1' then 'Finalizado' WHEN '2' then 'En gestión' else  'Sin gestión' end gestion
                                                        case status_soporte when 1 then 'Finalizado' WHEN 2 then 'En gestión' else 'Sin gestión' end gestion
                                                from soporte_gpon
                                                where tarea = :tarea");
            $stmt->execute(array(':tarea' => $data));

            if ($stmt->rowCount() > 0) {
                array_push($response, $stmt->fetchAll(PDO::FETCH_ASSOC));
            }

            $stmt = $this->_DB->prepare("select 'TOIP' as modulo,
                                                                   login_gestion as logincontingencia,
                                                                   hora_ingreso as fecha_ingreso,
                                                                   hora_gestion as fecha_fin,
                                                                   'N/A' as observacion,
                                                                   observacion as observacion_asesor,
                                                                   case en_gestion when '1' then 'En gestión' when '0' then 'Sin gestión' else 'Finalizado' end gestion
                                                            from activacion_toip
                                                            where tarea = :tarea");
            $stmt->execute(array(':tarea' => $data));

            if ($stmt->rowCount() > 0) {
                array_push($response, $stmt->fetchAll(PDO::FETCH_ASSOC));
            }

            $stmt = $this->_DB->prepare("SELECT
                                                CONCAT(
                                                    'Mesas nacionales - ',
                                                CASE
                                                        mesa 
                                                        WHEN 'Mesa 1' THEN
                                                        'Siebel-Edatel-Elite' 
                                                        WHEN 'Mesa 2' THEN
                                                        'Edatel' 
                                                        WHEN 'Mesa 3' THEN
                                                        'Validacion' 
                                                        WHEN 'Mesa 4' THEN
                                                        'Premisas' 
                                                        WHEN 'Mesa 5' THEN
                                                        'd' 
                                                        WHEN 'Mesa 6' THEN
                                                        'Bsc' 
                                                    END 
                                                    ) AS modulo,
                                                    login_gestion AS logincontingencia,
                                                    hora_ingreso AS fecha_ingreso,
                                                    hora_gestion AS fecha_fin,
                                                    observacion_tecnico AS observacion,
                                                    observacion_gestion AS observacion_asesor,
                                                CASE
                                                        estado 
                                                        WHEN 'Gestionado' THEN
                                                        'Finalizado' ELSE estado 
                                                    END AS gestion 
                                                FROM
                                                    mesas_nacionales 
                                            WHERE
                                                tarea = :tarea");
            $stmt->execute(array(':tarea' => $data));

            if ($stmt->rowCount() > 0) {
                array_push($response, $stmt->fetchAll(PDO::FETCH_ASSOC));
            }

            $stmt = $this->_DB->prepare("select 'Código incompleto' as modulo,
                                                                   'N/A' as logincontingencia,
                                                                   fecha_creado as fecha_ingreso,
                                                                   fecha_respuesta as fecha_fin,
                                                                   observacion as observacion,
                                                                   codigo as observacion_asesor,
                                                                   case status_soporte when '1' then 'Finalizado' else 'En gestión' end gestion                                                            
                                                            from gestion_codigo_incompleto
                                                            where tarea = :tarea");
            $stmt->execute(array(':tarea' => $data));

            if ($stmt->rowCount() > 0) {
                array_push($response, $stmt->fetchAll(PDO::FETCH_ASSOC));
            }

            if ($response) {
                $res = array('state' => true, 'data' => $response);
            } else {
                $res = array('state' => false, 'msj' => 'No se encontraron registros');
            }

            return $res;
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
    }

    public function checkSession()
    {
        $session = $this->getActualSession();
        echo json_encode($session);
    }

    private function getActualSession()
    {
        if (!isset($_SESSION)) {
            ini_set('session.gc_maxlifetime', 86400); // 1 day
            session_set_cookie_params(86400);
            session_start();
        }
        $sess = array();
        if (isset($_SESSION['login'])) {
            $sess["logueado"] = $_SESSION["logueado"];
            $sess['timeOnline'] = $_SESSION["timeOnline"];
            $sess['online'] = $_SESSION["online"];
            $sess["login"] = $_SESSION["login"];
            $sess['id'] = $_SESSION["id"];
            $sess['token_session'] = $_SESSION["token_session"];
            $sess['fecha_ingreso'] = $_SESSION["fecha_ingreso"];
            $sess['perfil'] = $_SESSION["perfil"];
            $sess['menu'] = $this->getMenu($_SESSION["perfil"]);
        } else {
            $sess["logueado"] = '';
            $sess['timeOnline'] = '';
            $sess['online'] = '';
            $sess["login"] = '';
            $sess['id'] = '';
            $sess['token_session'] = '';
            $sess['fecha_ingreso'] = '';
            $sess['perfil'] = '';
            $sess['menu'] = '';
        }
        return $sess;
    }

    private function getMenu($perfil)
    {
        try {
            $stmt = $this->_DB->prepare("SELECT id, nombre FROM  menu");
            $stmt->execute();
            $menu = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $menus = [];
            foreach ($menu as $key => $value) {
                $stmt = $this->_DB->prepare("SELECT
                                                    nombre AS sub,
                                                    url,
                                                    icon
                                                FROM
                                                    submenu
                                                INNER JOIN submenu_perfil ON submenu.id = submenu_perfil.submenu_id
                                                WHERE
                                                    menu_id = :menu
                                                AND submenu_perfil.perfil_id = :id
                                                AND estado = 'Activo' ORDER BY sub");
                $stmt->execute(array(':menu' => $value['id'], ':id' => $perfil));
                $sub = $stmt->fetchAll(PDO::FETCH_ASSOC);
                $menus[$key]['tittle'] = $value['nombre'];
                for ($i = 0; $i < count($sub); $i++) {
                    $menus[$key]['n']['sub'][$i] = $sub[$i]['sub'];
                    $menus[$key]['n']['url'][$i] = $sub[$i]['url'];
                    $menus[$key]['n']['icon'][$i] = $sub[$i]['icon'];
                }
            }
        } catch (\Throwable $th) {
            //throw $th;
        }
        return $menus;
    }
}
