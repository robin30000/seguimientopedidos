<?php
require_once '../model/modelNivelacion.php';
ini_set('session.gc_maxlifetime', 3600); // 1 hour
session_set_cookie_params(3600);
class nivelacion
{

    public $_model;

    public function __construct()
    {
        $this->_model = new modelNivelacion();
    }

    public function saveTicket($data)
    {
        $this->_model->saveTicket($data);
    }

    public function searchIdTecnic($data)
    {
        $this->_model->searchIdTecnic($data);
    }

    public function saveNivelation($data)
    {
        $this->_model->saveNivelation($data);
    }

    public function en_genstion_nivelacion()
    {
        $this->_model->en_genstion_nivelacion();
    }

    public function buscarhistoricoNivelacion($data)
    {
        $this->_model->buscarhistoricoNivelacion($data);
    }

    public function gestionarNivelacion($data)
    {
        $this->_model->gestionarNivelacion($data);
    }

    public function guardaNivelacion($data)
    {
        $this->_model->guardaNivelacion($data);
    }

    public function gestionarRegistrosNivelacion($data)
    {
        $this->_model->gestionarRegistrosNivelacion($data);
    }

    public function marcarEnGestionNivelacion($data)
    {
        $this->_model->marcarEnGestionNivelacion($data);
    }

    public function csvNivelacion($data){
        $this->_model->csvNivelacion($data);
    }

}
