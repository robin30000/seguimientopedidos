<?php
require_once 'conection.php';
/*error_reporting(E_ALL);
ini_set('display_errors', 1);*/

class GraficoRgu
{
    private $_DB;

    public function __construct()
    {
        $this->_DB = new Conection();
    }

    public function datos($data)
    {
        if (!empty($data)) {
            $fecha = $data;
        } else {
            $fecha = date('Y-m-d');
        }

        try {
            $stmt = $this->_DB->prepare("SELECT
                    -- DATE_FORMAT( fecha, '%h:%i %p' ) AS hora,
                    DATE_FORMAT( fecha, '%m-%d' ) AS fecha,
                    -- meta,
                    ROUND(((nacional + andina + costa + bogota + sur) / total_proyeccion * 100)) AS nacional,
                    ROUND((andina + nacional) / (andina_proyeccion + nacional_proyeccion) * 100) AS andina,

                    ROUND((costa / costa_proyeccion * 100)) AS costa,
                    ROUND((bogota / bogota_proyeccion * 100)) AS bogota,
                    ROUND((sur / sur_proyeccion * 100)) AS sur
                FROM
                    informe_rgu 
                WHERE
                    categoria = 'HFC-COBRE & GPON' AND fecha BETWEEN '$fecha 00:00:00' AND '$fecha 23:59:59'");
            $stmt->execute();

            if ($stmt->rowCount()) {
                $response = ['state' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC), 'counter' => $stmt->rowCount()];
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
