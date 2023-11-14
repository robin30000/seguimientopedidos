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
            /*ini_set('session.gc_maxlifetime', 3600); // 1 hour
            session_set_cookie_params(3600);
            session_start();*/
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
            /*ini_set('session.gc_maxlifetime', 3600); // 1 hour
            session_set_cookie_params(3600);
            session_start();*/
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
            /*ini_set('session.gc_maxlifetime', 3600); // 1 hour
            session_set_cookie_params(3600);
            session_start();*/
            $stmt = $this->_DB->query("SELECT DISTINCT DEPARTAMENTO 
                                       FROM ciudades 
                                       ORDER BY DEPARTAMENTO ASC");

            $stmt->execute();

            if ($stmt->rowCount()) {
                $response = array($stmt->fetchAll(PDO::FETCH_ASSOC), 201);
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
            /*ini_set('session.gc_maxlifetime', 3600); // 1 hour
            session_set_cookie_params(3600);
            session_start();*/
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
            /*ini_set('session.gc_maxlifetime', 3600); // 1 hour
            session_set_cookie_params(3600);
            session_start();*/
            /* if (!$_SESSION) {
                $response = ['state' => 99, 'title' => 'Su session ha caducado', 'text' => 'Inicia session nuevamente para continuar'];
            } else { */
            $stmt = $this->_DB->query("SELECT DISTINCT trim(PROCESO) proceso" .
                " FROM procesos " .
                " ORDER BY PROCESO ASC");
            $stmt->execute();

            if ($stmt->rowCount()) {

                $response = array('state' => 1, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC));
            } else {
                $response = array('state' => 0, 'msj' => 'No se encontraron registros');
            }
            /*  } */
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_DB = null;

        echo json_encode($response);
    }

    public function registros($data)
    {

        try {
            //var_dump($data);Exit();
            /*ini_set('session.gc_maxlifetime', 3600); // 1 hour
            session_set_cookie_params(3600);
            session_start();
            if (!$_SESSION) {
                $response = array('state' => 99, 'title' => 'Su session ha caducado', 'text' => 'Inicia session nuevamente para continuar');
            } else {*/

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

                if (!empty($data['param']['concepto'])) {
                    $buscar = $data['param']['buscar'];
                    $concepto = $data['param']['concepto'];
                    $condicion .= " and $concepto = '$buscar' ";
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
                    $response = array('state' => 1, 'data' => $result, 'counter' => $counter);
                } else {
                    $response = array('state' => 0);
                }
            /*}*/
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_DB = null;
        echo json_encode($response);
    }

    public function registroscsv($data)
    {
        try {
            /*ini_set('session.gc_maxlifetime', 3600); // 1 hour
            session_set_cookie_params(3600);
            session_start();*/
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
                $response = array($result, $totalCount);
            } else {
                $response = array('', 203);
            }
        } catch (PDOException $e) {
            var_dump($e);
        }
        $this->_DB = null;
        echo json_encode($response);
    }

    public function cargaRegistros($data)
    {

        ini_set('max_execution_time', 1000);

        //ini_set('display_errors', '1');
        $target_dir = "../uploads/";
        $target_file = $target_dir . basename($_FILES["fileUpload"]["name"]);
        //$name     = $_FILES['fileUpload']['name'];
        $tname = $_FILES['fileUpload']['tmp_name'];
        $type = $_FILES['fileUpload']['type'];

        //$login   = $this->_request['user'];
        $fecha = date("Y-m-d H:i:s");
        $tname1 = basename($_FILES["fileUpload"]["name"]);
        $guardar = "";

        //$target_file = basename($_FILES["fileUpload"]["name"]);
        $uploadOk = 1;
        // Check if $uploadOk is set to 0 by an error
        /*if ($uploadOk == 0) {
                  echo "<script>alert('El archivo no se ha subido intentalo de nuevo)')</script>";
                  die();
                  // if everything is ok, try to upload file
              } else {
                  if (move_uploaded_file($_FILES["fileUpload"]["tmp_name"], $target_file)) {
                      $c = 1;
                  } else {
                      $c = 0;
                  }
              }*/

        move_uploaded_file($_FILES["fileUpload"]["tmp_name"], $target_file);

        $tname1 = basename($_FILES["fileUpload"]["name"]);

        if ($type == 'application/vnd.ms-excel') {
            // Extension excel 97
            $ext = 'xls';
        } elseif ($type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            // Extension excel 2007 y 2010
            $ext = 'xlsx';
        } else {
            // Extension no valida
            echo -1;
            exit();
        }

        $xlsx = 'Excel2007';
        $xls = 'Excel5';

        $objPHPExcel2 = PHPExcel_IOFactory::load($target_file);
        $Total_Sheet = $objPHPExcel2->getSheetCount();
        $Sheet = $objPHPExcel2->getSheet(0)->toArray(null, true, true, true);

        foreach ($Sheet as $key => $value) {
            if ($key == 1) {
                continue;
            }

            $pedido = trim($value['A']);
            $id_tecnico = trim($value['B']);
            $empresa = trim($value['C']);
            $despacho = trim($value['D']);
            $observaciones = trim($value['E']);
            $accion = trim($value['F']);
            $sub_accion = trim($value['G']);
            $proceso = trim($value['H']);

            if ($pedido == '') {
                $data = array('state' => 0, 'msj' => 'El archivo tiene campos vacios (pedido)');
                echo json_encode($data);
                exit();
            } elseif ($id_tecnico == '') {
                $data = array('state' => 0, 'msj' => 'El archivo tiene campos vacios (doc tecnico)');
                echo json_encode($data);
                exit();
            } elseif ($empresa == '') {
                $data = array('state' => 0, 'msj' => 'El archivo tiene campos vacios (empresa)');
                echo json_encode($data);
                exit();
            } elseif ($despacho == '') {
                $data = array('state' => 0, 'msj' => 'El archivo tiene campos vacios (despacho)');
                echo json_encode($data);
                exit();
            } elseif ($observaciones == '') {
                $data = array('state' => 0, 'msj' => 'El archivo tiene campos vacios (observaciones)');
                echo json_encode($data);
                exit();
            } elseif ($accion == '') {
                $data = array('state' => 0, 'msj' => 'El archivo tiene campos vacios (accion)');
                echo json_encode($data);
                exit();
            } elseif ($sub_accion == '') {
                $data = array('state' => 0, 'msj' => 'El archivo tiene campos vacios (sub accion)');
                echo json_encode($data);
                exit();
            } elseif ($proceso == '') {
                $data = array('state' => 0, 'msj' => 'El archivo tiene campos vacios (proceso)');
                echo json_encode($data);
                exit();
            } else {
                $sql = "INSERT INTO registros " .
                    "(pedido, id_tecnico, empresa, asesor, despacho, observaciones, " .
                    "accion, tipo_pendiente, fecha, proceso) " .
                    "VALUES " .
                    "('$pedido','$id_tecnico','$empresa','CARGAMASIVA', " .
                    "'$despacho','$observaciones','$accion', " .
                    "'$sub_accion', NOW(),'$proceso'); ";

                $rst = $this->_DB->query($sql);
            }
        }
        if ($rst->rowCount() == 0) {
            $data = array('state' => 0, 'msj' => 'El archivo no a cargado correctamente');
            echo json_encode($data);

        } else {
            $data = array('state' => 1, 'msj' => 'Archivo cargado correctamente');
            echo json_encode($data);

        }

    }

}
