<?php
require_once '../class/conection.php';

class modelSubAccion
{

    private $_BD;

    public function __construct()
    {
        $this->_BD = new Conection();
    }

    public function subAccion($proceso, $accion)
    {
        try {
            $query = "SELECT DISTINCT SUBACCION
                 FROM procesos 
                 where 1=1 and proceso=? and accion=? and subaccion <> ''
                 ORDER BY SUBACCION";
            $stmt  = $this->_BD->query($query);

            $stmt->bindParam(1, $proceso, PDO::PARAM_STR);
            $stmt->bindParam(2, $accion, PDO::PARAM_STR);

            $stmt->execute();

            if ($stmt->rowCount()) {
                $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
                $response  = [$resultado, 201];
            } else {
                $response = [
                    'status' => 400,
                    'msg'    => 'Sin datos para listar',
                ];

            } // If no records "No Content" status
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_BD = null;

        echo json_encode($response);

    }
}
