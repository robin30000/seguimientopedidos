<?php
require_once 'conection.php';

class Contador
{
    private $_DB;

    public function __construct()
    {
        $this->_DB = new Conection();
    }

    public function Contador($data)
    {
        try {
            $fecha = date('Y-m-d');
            $stmt  = $this->_DB->prepare("SELECT * FROM Contador WHERE Fecha =:Fecha AND Modulo =:Modulo");
            $stmt->execute([':Fecha' => $fecha, ':Modulo' => $data]);

            if ($stmt->rowCount() > 0) {
                $stmt = $this->_DB->prepare("UPDATE Contador SET Contador = Contador+1 WHERE Fecha =:Fecha AND Modulo =:Modulo");
                $stmt->execute([':Fecha' => $fecha, ':Modulo' => $data]);
            } else {
                $stmt = $this->_DB->prepare("INSERT INTO Contador (Modulo,Fecha,Contador) VALUES (:Modulo,:Fecha,1)");
                $stmt->execute([':Fecha' => $fecha, ':Modulo' => $data]);
            }
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_BD = null;
    }

    public function conteoDatos($data)
    {
        try {

            if ($data['fecha']){
                $fecha = $data['fecha'];
            }else{
                $fecha = date('Y-m-d');
            }

            $stmt  = $this->_DB->prepare("SELECT Modulo, Fecha ,Contador FROM Contador WHERE Fecha = :fecha");
            $stmt->execute([':fecha' => $fecha]);

            if ($stmt->rowCount()) {
                $response = ['state' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)];
            } else {
                $response = ['state' => false, 'msj' => 'No se encontraron datos'];
            }

            return $response;
            $this->_DB = null;
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
    }
}
