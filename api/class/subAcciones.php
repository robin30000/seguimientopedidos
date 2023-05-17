<?php
require_once '../class/conection.php';

class subAcciones
{

    private $_BD;

    public function __construct()
    {
        $this->_BD = new Conection();
    }

    public function subacciones($data)
    {
        try {
            session_start();
            $proceso = $data['proceso'];
            $accion = $data['accion'];

            $stmt = $this->_BD->prepare("SELECT DISTINCT SUBACCION
                                                FROM procesos
                                                where proceso = :proceso
                                                  and accion = :accion
                                                  and subaccion <> ''
                                                ORDER BY SUBACCION");

            $stmt->execute([':accion' => $accion, ':proceso' => $proceso]);

            if ($stmt->rowCount()) {
                $response = array('state' => 1, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC));
            } else {
                $response = array('state' => 0, 'msj' => 'No se encontraron registros');
            }
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_BD = null;
        echo json_encode($response);
    }
}