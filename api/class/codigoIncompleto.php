<?php
require_once '../model/modelCodigoIncompleto.php';

class codigoIncompleto
{
    private $_model;

    public function __construct()
    {
        $this->_model = new modelCodigoIncompleto();
    }

    public function getListaCodigoIncompleto()
    {
        $this->_model->getListaCodigoIncompleto();
    }

    public function gestionarCodigoIncompleto($data)
    {
        $this->_model->gestionarCodigoIncompleto($data);
    }

    public function registroscodigoincompleto($data)
    {
        $this->_model->registroscodigoincompleto($data);
    }

    public function expCsvRegistrosCodigoIncompleto($data)
    {
        $this->_model->expCsvRegistrosCodigoIncompleto($data);
    }

}
