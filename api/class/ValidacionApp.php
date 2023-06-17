<?php


require_once 'conection.php';


class ValidacionApp
{
    private $_DB;

    public function __construct()
    {
        $this->_DB = new Conection();
    }

    public function estadoActualValidacionApp()
    {

        ini_set('session.gc_maxlifetime', 3600); // 1 hour
        session_set_cookie_params(3600);
        session_start();
        try {
            $stmt = $this->_DB->query("SELECT valida, tipo from validaciones_apk");
            $stmt->execute();
            if ($stmt->rowCount()) {
                $response = array('state' => 1, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC));
            } else {
                $response = array('state' => 0, 'msj' => 'No se encontraron datos');
            }

        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_DB = '';
        echo json_encode($response);
    }

    public function cambiaValidacionApp($data)
    {
        ini_set('session.gc_maxlifetime', 3600); // 1 hour
        session_set_cookie_params(3600);
        session_start();
        $tipo = $data['tipo'];
        $valor = $data['valor'];

        if ($valor === 'activa') {
            $valor = 'inactiva';
        } elseif ($valor) {
            $valor = 'activa';
        }

        try {

            $stmt = $this->_DB->query("update validaciones_apk set valida = '$valor' where tipo = '$tipo'");
            if ($stmt->execute()) {
                $response = array('state' => 1, 'msj' => 'Cambio realizado correctamente.');
            } else {
                $response = array('state' => 0, 'msj' => 'No se encontraron datos');
            }

        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_DB = '';
        echo json_encode($response);
    }

}