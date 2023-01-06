<?php
require_once '../class/conection.php';

class modelQuejasGo
{
    private $_DB;

    public function __construct()
    {
        $this->_DB = new Conection();
    }

    public function listaQuejasGoDia($data)
    {

        try {

            $fechaini = (!isset($data['curPage']['fechaini'])) ? date("Y-m-d") : $data['curPage']['fechaini']; //CORRECCION DE VALIDACION DE FECHA
            $fechafin = (!isset($data['curPage']['fechafin'])) ? date("Y-m-d") : $data['curPage']['fechafin']; //CORRECCION DE VALIDACION DE FECHA

            if ($fechaini == "" || $fechafin == "") {
                $fechaini = date('Y-m-d');
                $fechafin = date('Y-m-d');
            }

            $stmt = $this->_DB->query("select count(*) as total from quejasgo
								WHERE 1=1
								AND fecha BETWEEN ('$fechaini 00:00:00') AND ('$fechafin 23:59:59')");
            $stmt->execute();

            $resCount   = $stmt->fetch(PDO::FETCH_OBJ);
            $totalCount = $resCount->total;


            if (is_numeric($data['curPage'])) {
                $page_number = $data['curPage'];
            } else {
                $page_number = 1;
                $data['pageSize'] = 50;
            }

            $initial_page = ($page_number - 1) * $data['pageSize'];

            $total_pages = ceil($totalCount / $data['pageSize']);

            $pageSize = $data['pageSize'];


            $stmt = $this->_DB->query("SELECT id, pedido, cliente, cedtecnico, tecnico, accion, asesor, fecha, duracion, region, idllamada, observacion
                                                FROM quejasgo
                                                    WHERE 1=1
                                                    AND fecha BETWEEN ('$fechaini 00:00:00') AND ('$fechafin 23:59:59') 
                                                    ORDER BY fecha DESC limit $initial_page, $pageSize");
            $stmt->execute();

            if ($stmt->rowCount()){
                $result   = $stmt->fetchAll(PDO::FETCH_ASSOC);
                $response = ['state' => 1, 'data' => $result, 'total' => $total_pages, 'counter' => intval($totalCount)];
            } else {
                $response = ['state' => 0];
            }

        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_BD = null;

        echo json_encode($response);

    }

    public function csvQuejasGo($data)
    {
        try {
            $usuarioid       = $data['datoslogin'];
            $usuarioid       = $usuarioid['LOGIN'];
            $datos           = $data['datos'];
            $fechaini        = $datos['fechaini'];
            $fechafin        = $datos['fechafin'];
            $columnaBusqueda = $datos['columnaBusqueda'];
            $valorBusqueda   = $datos ['valorBusqueda'];


            if ($fechaini == "" && $fechafin == "") {
                $fechaini = date("Y") . "-" . date("m") . "-" . date("d");
                $fechafin = date("Y") . "-" . date("m") . "-" . date("d");
            }

            if ($fechaini == $fechafin) {
                $filename = "QuejasGo" . "_" . $fechaini . "_" . $usuarioid . ".csv";
            } else {
                $filename = "QuejasGo" . "_" . $fechaini . "_" . $fechafin . "_" . $usuarioid . ".csv";
            }


            if ($columnaBusqueda == "" || $valorBusqueda == "") {

                $stmt = $this->_DB->prepare("	SELECT g.id, g.pedido, g.cliente, g.cedtecnico, g.tecnico, g.accion, g.asesor, g.fecha, g.duracion, g.region, g.idllamada, g.observacion
								FROM quejasgo g
									WHERE 1=1
									AND g.fecha BETWEEN (:fechaini) AND (:fechafin)
						");
                $stmt->execute([
                    ':fechaini' => "$fechaini 00:00:00",
                    ':fechafin' => "$fechafin 23-59-59",
                ]);

            } else {

                $stmt = $this->_DB->prepare("	SELECT g.id, g.pedido, g.cliente, g.cedtecnico, g.tecnico, g.accion, g.asesor, g.fecha, g.duracion, g.region, g.idllamada, g.observacion
								FROM quejasgo g
									WHERE 1=1
									AND g.fecha BETWEEN (:fechaini) AND (:fechafin) AND :columnaBusqueda = :valorBusqueda
						");

                $stmt->execute([
                    ':fechaini'        => "$fechaini 00:00:00",
                    ':fechafin'        => "$fechafin 23-59-59",
                    ':columnaBusqueda' => $columnaBusqueda,
                    ':valorBusqueda'   => $valorBusqueda,
                ]);

            }

            if ($stmt->rowCount()) {
                $counter  = $stmt->rowCount();
                $fp       = fopen("../tmp/$filename", 'w');
                $columnas = [
                    'CONSECUTIVO',
                    'PEDIDO',
                    'CLIENTE',
                    'CEDULA_TECNICO',
                    'TECNICO',
                    'ACCION',
                    'ASESOR',
                    'FECHA',
                    'DURACION',
                    'CIUDAD',
                    'ID_LLAMADA',
                    'OBSERVACIONES',
                ];
                fputcsv($fp, $columnas);
                $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
                fputcsv($fp, $resultado);
                fclose($fp);
                $response = [$filename, $counter, 201];
            } else {
                $response = [0, 203];
            }

        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_BD = null;
        echo json_encode($response);
    }

    public function buscarTecnico($data)
    {
        try {
            $stmt = $this->_DB->prepare("SELECT a.nombre, a.ciudad FROM tecnicos a WHERE 1=1 AND a.identificacion = :cedula");

            $stmt->execute([
                ':cedula' => $data,
            ]);
            if ($stmt->rowCount()) {
                $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
                $response  = [$resultado, 201];
            } else {
                $response = 0;
            }
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_BD = null;
        echo json_encode($response);
    }

    public function crearTecnicoQuejasGo($data)
    {

        try {
            $identificacion = $data['cedtecnico'];
            $nombre         = $data['nombretecnico'];
            $ciudad         = $data['region'];
            $celular        = $data['celulartecnico'];
            $empresa        = $data['empresa'];
            $stmt           = $this->_DB->prepare(" INSERT INTO tecnicos (identificacion, nombre, ciudad, celular, empresa) values ( :identificacion, UPPER(:nombre), :ciudad,:celular, :empresa)");
            $stmt->execute([
                ':identificacion' => $identificacion,
                ':nombre'         => $nombre,
                ':ciudad'         => $ciudad,
                ':celular'        => $celular,
                ':empresa'        => $empresa,
            ]);
            $response = ['Usuario creado', 201];
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_BD = null;
        echo json_encode($response);
        //crea tecnico, activity feed
    }

    public function ciudadesQGo()
    {
        try {
            $stmt = $this->_DB->query(" 	SELECT DISTINCT ciudad 
					FROM ciudades
					ORDER BY ciudad ASC ");
            if ($stmt->rowCount()) {
                $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
                $response  = [$resultado, 201];
            } else {
                $response = 0;
            } // If no records "No Content" status
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_BD = null;
        echo json_encode($response);
    }

    public function guardarQuejaGo($data)
    {

        try {
            $datos       = $data['dataquejago'];
            $duracion    = $data['duracion'];
            $login       = $data['login'];
            $asesor      = $login['LOGIN'];
            $pedido      = $datos['pedido'];
            $cliente     = $datos['cliente'];
            $cedtecnico  = $datos['cedtecnico'];
            $tecnico     = $datos['tecnico'];
            $accion      = $datos['accion'];
            $region      = $datos['region'];
            $idllamada   = $datos['idllamada'];
            $observacion = utf8_decode($datos['observacion']);


            $stmt = $this->_DB->prepare("
					INSERT INTO quejasgo
						(pedido, cliente, cedtecnico, tecnico, accion, asesor, fecha, duracion, region, idllamada, observacion)
					VALUES
						(:pedido, UPPER(TRIM(:cliente)), :cedtecnico, :tecnico, :accion, :asesor, NOW(), :duracion, :region, :idllamada, :observacion)
				");
            $stmt->execute([
                ':pedido'      => $pedido,
                ':cliente'     => $cliente,
                ':cedtecnico'  => $cedtecnico,
                ':tecnico'     => $tecnico,
                ':accion'      => $accion,
                ':asesor'      => $asesor,
                ':duracion'    => $duracion,
                ':region'      => $region,
                ':idllamada'   => $idllamada,
                ':observacion' => $observacion,
            ]);


            if ($stmt->rowCount()) {
                $response = ['Queja guardada', 201];
            } else {
                $response = 0;
            }
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_BD = null;
        echo json_encode($response);
    }

    public function ActualizarObserQuejasGo($data)
    {
        try {
            $observaciones = $data['observacion'];
            $idqueja       = $data['idqueja'];

            $observacion = $observaciones['observacion'];

            $stmt = $this->_DB->prepare("UPDATE quejasgo SET observacion = :observaciones where id = :idqueja");

            $stmt->execute([':observaciones' => $observacion, ':idqueja' => $idqueja]);

            if ($stmt->rowCount()) {
                $response = ['type' => 'success', 'msj' => 'Observacion actualizada'];

            } else {
                $response = ['type' => 'error', 'msj' => 'Ah ocurrido un error intentalo nuevamente'];
            }
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_BD = null;
        echo json_encode($response);
    }
}
