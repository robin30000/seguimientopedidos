<?php
error_reporting(E_ALL);
require_once '../class/conection.php';

class ModelFormaAsesores
{
    private $_DB;

    public function __construct()
    {
        $this->_DB = new Conection();
    }

    public function ciudades()
    {
        try {

            $ciudades = $this->_DB->query("SELECT DISTINCT ciudad  FROM ciudades ");
            $ciudades->execute();

            $stmt = $this->_DB->query("SELECT DISTINCT DEPARTAMENTO  FROM ciudades ORDER BY DEPARTAMENTO");
            $stmt->execute();

            $resCiudades = $ciudades->fetchAll(PDO::FETCH_ASSOC);
            $resStmt     = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $response = [$resStmt, $resCiudades];

        } catch (PDOException $e) {
            var_dump($e);
        }
        $this->_DB = null;
        echo json_encode($response);
    }

    public function rst()
    {
        try {


            $stmt = $this->_DB->query("SELECT DISTINCT lower(`DEPARTAMENTO`), lower(`CIUDAD`) 
                                       FROM ciudades 
                                      ORDER BY CIUDAD");
            $stmt->execute();
            if ($stmt->rowCount()) {
                $response = [$stmt->fetchAll(PDO::FETCH_ASSOC), 201];
            } else {
                $response = '';
            }


        } catch (PDOException $e) {

        }
        $this->_DB = null;
        echo json_encode($response);
    }

    public function rstdep()
    {
        try {


            $stmt = $this->_DB->query("SELECT DISTINCT DEPARTAMENTO 
                                       FROM ciudades 
                                       ORDER BY DEPARTAMENTO ASC");

            $stmt->execute();

            if ($stmt->rowCount()) {
                $response = [$stmt->fetchAll(PDO::FETCH_ASSOC), 201];
            } else {
                $response = '';
            }


        } catch (PDOException $e) {

        }
        $this->_DB = null;
        echo json_encode($response);
    }

    public function regionesTip()
    {
        try {
            $stmt = $this->_DB->query("SELECT DISTINCT region
                                      FROM regiones 
                                      ORDER BY region ASC");
            $stmt->execute();
            if ($stmt->rowCount()) {
                $response = $stmt->fetchAll(PDO::FETCH_ASSOC);
            } else {
                $response = '';
            }
        } catch (PDOException $e) {

        }
        $this->_DB = null;

        return $response;
    }

    public function procesos()
    {
        try {
            $stmt = $this->_DB->query("SELECT DISTINCT trim(PROCESO) proceso" .
                                      " FROM procesos " .
                                      " ORDER BY PROCESO ASC");
            $stmt->execute();
            if ($stmt->rowCount()) {
                $response = $stmt->fetchAll(PDO::FETCH_ASSOC);
            } else {
                $response = '';
            }
        } catch (PDOException $e) {

        }
        $this->_DB = null;

        return $response;

    }

    public function registros($data)
    {

        /*$fechaini = (!isset($datos['fechaini'])) ? date("Y-m-d") : $datos['fechaini']; //CORRECCION DE VALIDACION DE FECHA
        $fechafin = (!isset($datos['fechafin'])) ? date("Y-m-d") : $datos['fechafin']; //CORRECCION DE VALIDACION DE FECHA
        $concepto = (isset($datos['concepto'])) ? $datos['concepto'] : '';
        $buscar   = (isset($datos['buscar'])) ? $datos['buscar'] : '';

        if ($fechaini == "" || $fechafin == "") {
            $fechaini = date("Y-m-d");
            $fechafin = date("Y-m-d");
        }
        //$today = date("Y-m-d");

        if ($pagina == "undefined") {
            $pagina = "0";
        } else {
            $pagina = $pagina - 1;
        }

        $pagina = $pagina * 100;

        if ($concepto == "" || $buscar == "") {
            $parametro = "";
        } else {
            $parametro = " and $concepto = '$buscar'";
        }*/

        try {


            $stmt = $this->_DB->query("select count(*) as total from registros");
            $stmt->execute();

            $resCount   = $stmt->fetch(PDO::FETCH_OBJ);
            $totalCount = $resCount->total;

            if (isset($data['curPage'])) {
                $page_number = $data['curPage'];
            } else {
                $page_number = 1;
            }

            $initial_page = ($page_number - 1) * $data['pageSize'];

            $total_pages = ceil($totalCount / $data['pageSize']);

            $limit_page = $data['pageSize'];

            $parametro = '';


            $stmt = $this->_DB->query("SELECT a.id, a.pedido, 
                                       (select nombre from tecnicos where a.id_tecnico = identificacion limit 1) tecnico, 
                                      trim(a.accion) AS accion, 
                                      a.asesor, 
                                      a.fecha, a.duracion, a.proceso, 
                                      a.observaciones, a.llamada_id, a.id_tecnico, a.empresa, a.despacho, a.producto, 
                                      a.accion, trim(a.tipo_pendiente) as tipo_pendiente, (select ciudad from tecnicos 
                                      where a.id_tecnico = identificacion limit 1) ciudad, a.plantilla 
                                      FROM registros a where 1=1
                                      and asesor <> 'IVR' order by a.fecha DESC limit $initial_page, $limit_page ");

            $stmt->execute();
            if ($stmt->rowCount()) {
                $result   = $stmt->fetchAll(PDO::FETCH_ASSOC);
                $response = ['state' => 1, 'data' => $result, 'total' => $total_pages, 'counter' => intval($totalCount)];
            } else {
                $response = ['state' => 0];
            }
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_DB = null;
       echo json_encode($response);
    }
}
