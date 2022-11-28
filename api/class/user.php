<?php

require_once '../model/modelAuth.php';
date_default_timezone_set('America/Bogota');

class user
{
    public $_model;

    public function __construct()
    {
        $this->_model = new Modelauthentication();
    }

    public function login($data)
    {

        $usuarioid = strtoupper(trim($data->username));
        $password  = trim($data->password);

        $usuarioid = htmlentities($usuarioid, ENT_QUOTES);
        $password  = htmlentities($password, ENT_QUOTES);

        $today      = date('Y-m-d');
        $fecha      = date('Y-m-d H:i:s');
        $usuarioIp  = $_SERVER['REMOTE_ADDR'];
        $usuarioPc  = gethostbyaddr($usuarioIp);
        $aplicacion = "Seguimiento";

        if (empty($usuarioid) || empty($password)) {
            $body = 'Error';
            http_response_code(406);
            header("Content-type: application/json; charset=utf-8");
            echo json_encode($body);
            die();
        }


        $reslogin = $this->_model->loginUser($usuarioid, $password);


        if (!$reslogin) {
            $body = 'Usuario No existe.';
            http_response_code(406);
            header("Content-type: application/json; charset=utf-8");
            echo json_encode($body);
            die();
        }

        $reslogin->fecha_ingreso = date('Y-m-d h:i:s');
        $reslogin->hora_ingreso  = date('Y-m-d h:i:s');;

        /*$resgetingresosalida = $this->_model->getIngresosalida($today, $usuarioid, $fecha);


        if (!$resgetingresosalida) {

            $rescreateingresosalida = $this->_model->createingresosalida($usuarioid, $fecha, $usuarioIp, $usuarioPc, $aplicacion);

            $resgetingresosalida = $this->_model->getingresosalida($today, $usuarioid, $fecha);

            if ($resgetingresosalida == 0) {
                $reslogin['fecha_ingreso'] = 'SinFecha';
                $reslogin['hora_ingreso']  = 'SinHora';
            } else {
                $reslogin['fecha_ingreso'] = $resgetingresosalida['fecha_ingreso'];
                $reslogin['hora_ingreso']  = $resgetingresosalida['hora_ingreso'];
            }

        } else {

            $idd                       = $reslogin['id'];
            $reslogin['fecha_ingreso'] = $resgetingresosalida['fecha_ingreso'];
            $reslogin['hora_ingreso']  = $resgetingresosalida['hora_ingreso'];

            $resupdateingresosalida = $this->_model->updateingreso($idd);

        }*/

        http_response_code(201);
        header("Content-type: application/json; charset=utf-8");
        echo json_encode($reslogin);
        die();
    }

    public function logout()
    {

        $usuarioid = strtoupper(trim($this->request->getPost('USUARIO_ID')));
        $perfil    = trim($this->request->getPost('PERFIl'));

        $usuarioid = htmlentities($usuarioid, ENT_QUOTES);
        $perfil    = htmlentities($perfil, ENT_QUOTES);

        $today = date('Y-m-d');
        $fecha = date('Y-m-d H:i:s');

        if (empty($usuarioid)) {
            $body = 'User do not exist!!!';
            http_response_code(406);
            header("Content-type: application/json; charset=utf-8");
            echo json_encode($body);
            die();
        }

        $resgetingresosalida = $this->modeloAuth->getingresosalida($today, $usuarioid, $fecha);

        if ($resgetingresosalida > 0) {

            $idd       = $resgetingresosalida['id'];
            $total_dia = $resgetingresosalida['total'];

            $hora     = substr($total_dia, 0, 2);
            $minutos  = substr($total_dia, 3, 2);
            $segundos = substr($total_dia, 6, 2);

            $totalminutos = round($hora * 60 + $minutos + $segundos / 60, 2);

            $resupdateingresosalida = $this->modeloAuth->updatesalida($idd, $fecha, $total_dia, $hora, $minutos, $segundos, $totalminutos);

            if ($resupdateingresosalida < 1) {
                $body = 'Error logged out';
                http_response_code(403);
                header("Content-type: application/json; charset=utf-8");
                echo json_encode($body);
                die();
            }

        }

        $body = 'logged out';
        http_response_code(201);
        header("Content-type: application/json; charset=utf-8");
        echo json_encode($body);
        die();
    }


}
