<?php
require_once '../model/modelSubAccion.php';
require_once '../class/utils.php';
class subAcciones
{

    public $_model;

    public $_utils;

    public function __construct()
    {
        $this->_model = new modelSubAccion();
        $this->_utils = new utils();
    }

    public function subacciones($data){
        $proceso=$data->proceso;
        $accion=$data->accion;
        $rst    = $this->_model->subAccion($proceso,$accion);
        $this->_utils->response($this->_utils->json($rst), 201);
    }
}