<?php
require_once '../class/conection.php';
class modelSubAccion
{

    private $_BD;

    public function __construct()
    {
        $this->_BD = new Conection();
    }

    public function subAccion($proceso,$accion)
    {
        try {
            $query = " SELECT DISTINCT SUBACCION" .
                " FROM procesos " .
                " where 1=1 and proceso=? and accion=? and subaccion <> ''" .
                " ORDER BY SUBACCION ASC ";
            $stmt = $this->_BD->query($query);

            $stmt->bindParam(1,$proceso,PDO::PARAM_STR);
            $stmt->bindParam(2,$accion,PDO::PARAM_STR);

            $stmt->execute();
            //echo $query;
            if ($stmt->fetchAll(PDO::FETCH_ASSOC)) {
                $resultado= $stmt->fetchAll(PDO::FETCH_ASSOC);

            } else {
                $error = array(
                    'status' => 400,
                    'msg' => 'Sin datos para listar',
                );
                $resultado= 0;
            } // If no records "No Content" status
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_BD=null;
         return $resultado;

    }
}