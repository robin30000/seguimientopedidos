<?php
require_once '../model/modelGestionAprovisionamiento.php';
require_once 'utils.php';

class gestionAprovisionamiento
{
    public $_model;

    public $_utils;

    public function __construct()
    {
        $this->_model = new modelGestionAprovisionamiento();
        $this->_utils = new utils();
    }

    public function updateEnGestion($data)
    {

        $login = $data;
        $hoy = date("Y-m-d");

        $response = $this->_model->updateEnGestionResponse($login, $hoy);
        $this->_utils->response($this->_utils->json([$response]), 201);

    }

}
