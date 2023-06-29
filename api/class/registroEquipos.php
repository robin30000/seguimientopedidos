<?php
require_once '../class/conection.php';

class registroEquipos
{
    private $_DB;

    public function __construct()
    {
        $this->_DB = new Conection();
    }

    public function registroEquipos()
    {
        $fecha = date('Y-m-d');
        try {
            $stmt = $this->_DB->query("SELECT * FROM registro_equipo WHERE fecha_ingreso BETWEEN '$fecha 00:00:00' AND '$fecha 23:59:59'");
            $stmt->execute();
            if ($stmt->rowCount()) {
                $response = array('state' => 1, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC));
            }else {
                $response = array('state' => 0, 'msj' => 'No se encontraron registros');
            }
        } catch (PDOException $th) {
            var_dump($th->getMessage());
        }

        $this->_DB = '';
        echo json_encode($response);
    }
}