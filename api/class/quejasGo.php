<?php

require_once '../model/modelQuejasGo.php';
require_once 'utils.php';
class quejasGo
{

    public $_model;

    public $_utils;

    public function __construct()
    {
        $this->_utils = new utils();
        $this->_model = new modelQuejasGo();
    }

    public function listaQuejasGoDia($data)
    {
        $this->_model->listaQuejasGoDia($data);
    }


}