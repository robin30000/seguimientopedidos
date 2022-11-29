<?php
require_once '../model/modelSoporteGpon.php';

class soporteGpon
{
    private $_model;

    public function __construct()
    {
        $this->_model = new modelSoporteGpon();
    }

    public function getListaPendientesSoporteGpon()
    {
        $this->_model->getListaPendientesSoporteGpon();
    }

}
