<?php
error_reporting(E_ALL);
require_once 'utils.php';
require_once '../model/ModelContingencia.php';

class contingencia
{
    public $_model;

    public $_utils;

    public function __construct()
    {
        $this->_model = new ModelContingencia();
        $this->_utils = new utils();
    }

    public function resumencontingencias($data)
    {

        //$fechaIni = $data->fechaini;
        //$fechaFin = $data->fechafin;

        $fechaIni = "2021-11-27";
        $fechaFin = "2021-11-27";


        $month = date('m', strtotime($fechaIni));
        $year  = date('Y', strtotime($fechaIni));
        $day   = date("d", mktime(0, 0, 0, $month + 1, 0, $year));

        $diaFinal   = date('Y-m-d', mktime(0, 0, 0, $month, $day, $year));
        $diaInicial = date('Y-m-d', mktime(0, 0, 0, $month, 1, $year));


        $resultado           = $this->_model->resultado($fechaIni, $fechaFin);
        $resultadoTV         = $this->_model->queryTv($fechaIni, $fechaFin);
        $resultadoInTo       = $this->_model->resultadoInTo($fechaIni, $fechaFin);
        $resultadoCP         = $this->_model->resultadoCP($fechaIni, $fechaFin);
        $resultadodiario     = $this->_model->querydiario($diaFinal, $diaFinal);
        $resultadodiarioCP   = $this->_model->resultadodiarioCP($diaInicial, $diaFinal);
        $resultadoestadosMes = $this->_model->resultadoestadosMes($diaInicial, $diaFinal);

        if (1 > 0) {

            $resultadoestadosMesCP = [
                [
                    "estado"       => "Acepta",
                    "total"        => "0",
                    "totalestados" => "0",
                ],
                [
                    "estado"       => "Rechaza",
                    "total"        => "0",
                    "totalestados" => "0",
                ],
                [
                    "estado"       => "Pendiente",
                    "total"        => "0",
                    "totalestados" => "0",
                ],
            ];

            /*$data = array(
                $resultado,
                $resultadoestadosMes,
                $resultadodiario,
                $resultadoestadosMesCP,
                $resultadodiarioCP,
                $resultadoCP,
                $resultadoTV,
                $resultadoInTo
            );*/

            $this->_utils->response($this->_utils->json([
                $resultado,
                $resultadoestadosMes,
                $resultadodiario,
                $resultadoestadosMesCP,
                $resultadodiarioCP,
                $resultadoCP,
                $resultadoTV,
                $resultadoInTo,
            ]), 201);
        } else {
            $this->_utils->response($this->_utils->json('$error'), 400);
        }


        /*$this->_utils->json_response($data, 201);

    } else {
        $this->_utils->json_response('', 400);
    }*/
    }

    public function datoscontingencias()
    {

        $response = $this->_model->datoscontingencias();
        $this->_utils->response($this->_utils->json([$response[0], $response[1], $response[2]]), 201);

    }
}
