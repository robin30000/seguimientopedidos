<?php
require_once '../model/modelGeneracionTt.php';
ini_set('session.gc_maxlifetime', 3600); // 1 hour
session_set_cookie_params(3600);

class generacionTt
{
    public $_model;

    public function __construct()
    {
        $this->_model = new modelGeneracionTt();
    }

    public function premisasInfraestructuras($data)
    {
        $this->_model->premisasInfraestructuras($data);
    }

    public function guardarGeneracionTT($data)
    {
        $this->_model->guardarGeneracionTT($data);
    }

    public function csvGeneracionTT($data)
    {
        $this->_model->csvGeneracionTT($data);
    }
}
