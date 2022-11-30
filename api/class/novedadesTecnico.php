<?php
require_once '../model/modelNovedadesTecnico.php';
require_once 'utils.php';

class novedadesTecnico
{
    public $_model;

    public $_utils;

    public function __construct()
    {
        $this->_utils = new utils();
        $this->_model = new modelNovedadesTecnico();
    }

    public function novedadesTecnico($data)
    {

        $pagina = $data->page;
        $datos  = $data->datos;

        $response = $this->_model->novedadesTecnico($pagina, $datos);

        $this->_utils->response($this->_utils->json([
            'data'         => $response[0],
            'contador'     => $response[1],
            'totalPaginas' => $response[2],

        ]), 201);
    }

    public function guardarNovedadesTecnico($data)
    {
        $this->_model->guardarNovedadesTecnico($data);
    }

    public function updateNovedadesTecnico($data)
    {
        $this->_model->updateNovedadesTecnico($data);
    }

    public function csvNovedadesTecnico($data)
    {
        $this->_model->csvNovedadesTecnico($data);
    }

    public function Regiones()
    {
        $this->_model->Regiones();
    }

    public function Municipios($data)
    {
        $this->_model->Municipios($data);
    }

    public function SituacionNovedadesVisitas()
    {
        $this->_model->SituacionNovedadesVisitas();
    }

    public function DetalleNovedadesVisitas($data)
    {
        $this->_model->DetalleNovedadesVisitas($data);
    }

    public function BFobservaciones()
    {
        $this->_model->BFobservaciones();
    }

    public function registrospwdTecnicos($data)
    {
        $this->_model->registrospwdTecnicos($data);
    }

    public function editarPwdTecnicos($data)
    {
        $this->_model->editarPwdTecnicos($data);
    }

    public function csvContrasenasTecnicos()
    {
        $this->_model->csvContrasenasTecnicos();
    }

}
