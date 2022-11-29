<?php
require_once '../class/conection.php';

class modelSoporteGpon
{

    private $_DB;

    public function __construct()
    {
        $this->_DB = new Conection();
    }

    public function getListaPendientesSoporteGpon()
    {
        $hoy = date("Y-m-d");

        $stmt = $this->_DB->prepare("SELECT * FROM soporte_gpon WHERE fecha_creado BETWEEN :fechaini AND :fechafin AND status_soporte = '0'");
        $stmt->execute([':fechaini' => "$hoy 00:00:00", ':fechafin' => "$hoy 23:59:59"]);

        if ($stmt->rowCount()) {
            $response = [$stmt->fetchAll(PDO::FETCH_ASSOC), 201];
        } else {
            $response = ['Error', 400];
        }
        $this->_DB = null;
        echo json_encode($response);

    }
}
