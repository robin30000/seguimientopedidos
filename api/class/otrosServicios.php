<?php
require_once '../model/modelOtrosServicios.php';
require_once 'utils.php';
class otrosServicios
{
    public function __construct()
    {
        $this->_model = new modelOtrosServicios();
    }

    public function DepartamentosContratos($data)
    {
       $this->_model->DepartamentosContratos($data);
    }
    public function insertData($data){

    }
}