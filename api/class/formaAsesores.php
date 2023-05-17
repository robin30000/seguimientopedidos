<?php

require_once '../class/conection.php';

class formaAsesores
{
    private $_DB;

    public function __construct()
    {
        $this->_DB = new Conection();
    }

    public function ciudades()
    {
        try {
            session_start();
            $ciudades = $this->_DB->query("SELECT DISTINCT ciudad  FROM ciudades ");
            $ciudades->execute();

            $stmt = $this->_DB->query("SELECT DISTINCT DEPARTAMENTO  FROM ciudades ORDER BY DEPARTAMENTO");
            $stmt->execute();

            $resCiudades = $ciudades->fetchAll(PDO::FETCH_ASSOC);
            $resStmt = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $response = array('state' => 1, 'data' => array($resStmt, $resCiudades));

        } catch (PDOException $e) {
            var_dump($e);
        }
        $this->_DB = null;
        echo json_encode($response);
    }

    public function rst()
    {
        try {

            session_start();
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

            session_start();
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
            session_start();
            $stmt = $this->_DB->query("SELECT DISTINCT region
                                      FROM regiones 
                                      ORDER BY region ASC");
            $stmt->execute();
            if ($stmt->rowCount()) {
                $response = array('state' => 1, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC));
            } else {
                $response = array('state' => 0, 'msj' => 'No se encontraron datos');
            }
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_DB = null;

        echo json_encode($response);
    }

    public function procesos()
    {
        try {

            session_start();
            if (!$_SESSION) {
                $response = ['state' => 99, 'title' => 'Su session ha caducado', 'text' => 'Inicia session nuevamente para continuar'];
            } else {
                $stmt = $this->_DB->query("SELECT DISTINCT trim(PROCESO) proceso" .
                    " FROM procesos " .
                    " ORDER BY PROCESO ASC");
                $stmt->execute();

                if ($stmt->rowCount()) {

                    $response = array('state' => 1, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC));
                } else {
                    $response = array('state' => 0, 'msj' => 'No se encontraron registros');
                }
            }
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_DB = null;

        echo json_encode($response);

    }

    public function registros($data)
    {

        try {

            session_start();
            if (!$_SESSION) {
                $response = ['state' => 99, 'title' => 'Su session ha caducado', 'text' => 'Inicia session nuevamente para continuar'];
            } else {

                $pagenum = $data['page'];
                $pagesize = $data['size'];
                $offset = ($pagenum - 1) * $pagesize;
                $search = $data['search'];

                $condicion = '';
                if (!empty($data['param']['fechaini'])) {
                    $fechaini = $data['param']['fechaini'];
                    $fechafin = $data['param']['fechafin'];
                    $condicion = " AND a.fecha BETWEEN '$fechaini 00:00:00' AND '$fechafin 23:59:59' ";
                } else {
                    $fechaini = date('Y-m-d');
                    $fechafin = date('Y-m-d');
                    $condicion = " AND a.fecha BETWEEN '$fechaini 00:00:00' AND '$fechafin 23:59:59' ";
                }

                if ($data['param']['concepto']) {
                    $buscar = $data['param']['buscar'];
                    $concepto = $data['param']['concepto'];
                    $condicion = " and $concepto = '$buscar' ";
                }

                $stmt = $this->_DB->query("select * from registros a where 1=1 $condicion");
                $stmt->execute();
                $counter = $stmt->rowCount();

                $stmt = $this->_DB->query("SELECT a.id, a.pedido, 
                                       (select nombre from tecnicos where a.id_tecnico = identificacion limit 1) tecnico, 
                                      trim(a.accion) AS accion, 
                                      a.asesor, 
                                      a.fecha, a.duracion, a.proceso, 
                                      a.observaciones, a.llamada_id, a.id_tecnico, a.empresa, a.despacho, a.producto, 
                                      a.accion, trim(a.tipo_pendiente) as tipo_pendiente, (select ciudad from tecnicos 
                                      where a.id_tecnico = identificacion limit 1) ciudad, a.plantilla 
                                      FROM registros a where 1=1 $condicion
                                      and asesor <> 'IVR' order by a.fecha DESC limit $offset, $pagesize ");

                $stmt->execute();
                if ($stmt->rowCount()) {
                    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
                    $response = ['state' => 1, 'data' => $result, 'counter' => $counter];
                } else {
                    $response = ['state' => 0];
                }
            }
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_DB = null;
        echo json_encode($response);
    }

    public function registroscsv($data)
    {
        try {
            session_start();
            if (!empty($data['sort'])) {
                $sort = $data['sort'];
                $fechaini = $sort['fechaini']; //CORRECCION DE VALIDACION DE FECHA
                $fechafin = $sort['fechafin']; //CORRECCION DE VALIDACION DE FECHA
            } else {
                $fechaini = date("Y-m-d");
                $fechafin = date("Y-m-d");
            }

            $stmt = $this->_DB->query("select count(*) as total from registros where fecha BETWEEN ('$fechaini 00:00:00') AND ('$fechafin 23:59:59')");
            $stmt->execute();

            $resCount = $stmt->fetch(PDO::FETCH_OBJ);
            $totalCount = $resCount->total;

            $stmt = $this->_DB->query("SELECT a.id, a.pedido, 
                                       (select nombre from tecnicos where a.id_tecnico = identificacion limit 1) tecnico, 
                                      trim(a.accion) AS accion, 
                                      a.asesor, 
                                      a.fecha, a.duracion, a.proceso, 
                                      a.observaciones, a.llamada_id, a.id_tecnico, a.empresa, a.despacho, a.producto, 
                                      a.accion, trim(a.tipo_pendiente) as tipo_pendiente, (select ciudad from tecnicos 
                                      where a.id_tecnico = identificacion limit 1) ciudad, a.plantilla 
                                      FROM registros a where a.fecha BETWEEN ('$fechaini 00:00:00') AND ('$fechafin 23:59:59')
                                      and asesor <> 'IVR' order by a.fecha");
            $stmt->execute();
            if ($stmt->rowCount()) {
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
                $response = [$result, $totalCount];
            } else {
                $response = ['', 203];
            }
        } catch (PDOException $e) {
            var_dump($e);
        }
        $this->_DB = null;
        echo json_encode($response);
    }
}