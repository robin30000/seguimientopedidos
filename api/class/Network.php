<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
require_once 'conection.php';

class Network
{
    public function __construct()
    {
        $this->_DB = new Conection();
    }

    public function cierreMasivo($data)
    {
        try {
            $stmt = $this->_DB->query("SELECT COUNT(*) as counter FROM network where estado != 'Finalizado' and clasificador = 'cierre_masivo'");
            $stmt->execute();
            $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $counter = $res[0]['counter'];

            $stmt = $this->_DB->query("SELECT * FROM network where estado != 'Finalizado' and clasificador = 'cierre_masivo'");
            $stmt->execute();

            if ($stmt->rowCount()) {
                $response = ['state' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC), 'counter' => $counter];
            } else {
                $response = ['state' => false, 'msj' => 'No se encontraron registros'];
            }

            $this->_DB = null;

            return $response;

        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
    }

    public function cierreIndividual($data)
    {
        try {
            $stmt = $this->_DB->query("SELECT COUNT(*) as counter FROM network where estado != 'Finalizado' and clasificador = 'cierre_individual'");
            $stmt->execute();
            $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $counter = $res[0]['counter'];

            $stmt = $this->_DB->query("SELECT * FROM network where estado != 'Finalizado' and clasificador = 'cierre_individual'");
            $stmt->execute();

            if ($stmt->rowCount()) {
                $response = ['state' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC), 'counter' => $counter];
            } else {
                $response = ['state' => false, 'msj' => 'No se encontraron registros'];
            }

            $this->_DB = null;

            return $response;

        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
    }

    public function registros($data)
    {
        try {
            $stmt = $this->_DB->query("SELECT COUNT(*) as counter FROM network where estado = 'Finalizado'");
            $stmt->execute();
            $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $counter = $res[0]['counter'];

            $stmt = $this->_DB->query("SELECT * FROM network where estado = 'Finalizado'");
            $stmt->execute();

            if ($stmt->rowCount()) {
                $response = ['state' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC), 'counter' => $counter];
            } else {
                $response = ['state' => false, 'msj' => 'No se encontraron registros'];
            }

            $this->_DB = null;

            return $response;

        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
    }
}