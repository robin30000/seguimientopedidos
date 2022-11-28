<?php
require_once '../model/modelGestionEscalonamiento.php';
class gestionEscalonamiento
{
    public $_model;

    public function __construct()
    {
        $this->_model = new modelGestionEscalonamiento();
    }

    public function gestionEscalonamiento(){


        $response = $this->_model->gestionEscalonamiento();
    }

}
