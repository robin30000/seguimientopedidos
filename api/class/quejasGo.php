<?php
require_once '../class/conection.php';

class quejasGo
{
    private $_DB;

    public function __construct()
    {
        $this->_DB = new Conection();
    }

    public function listaQuejasGoDia($data)
    {

        try {
            ini_set('session.gc_maxlifetime', 3600); // 1 hour
            session_set_cookie_params(3600);
            session_start();
            //var_dump($data);exit();
            if (!$_SESSION) {
                $response = ['state' => 99, 'title' => 'Su session ha caducado', 'text' => 'Inicia session nuevamente para continuar'];
            } else {

                $condicion = "";
                if (empty($data['datos']['fechaini'])) {
                    $fechaini = date('Y-m-d');
                    $fechafin = date('Y-m-d');
                } else {
                    $fechaini = $data['datos']['fechaini'];
                    $fechafin = $data['datos']['fechafin'];
                }

                $condicion = " AND fecha BETWEEN '$fechaini 00:00:00' AND '$fechafin 23:59:59' ";


                if (!empty($data['datos']['columnaBusqueda'])) {
                    $columnaBusqueda = $data['datos']['columnaBusqueda'];
                    $valorBusqueda = $data['datos']['valorBusqueda'];
                    $condicion .= " AND $columnaBusqueda = '$valorBusqueda' ";
                }
                //echo "SELECT * FROM quejasgo WHERE 1=1  $condicion";exit();

                $stmt = $this->_DB->query("SELECT * FROM quejasgo WHERE 1=1  $condicion");
                $stmt->execute();

                $totalCount = $stmt->rowCount();



                $pagenum = $data['page'];
                $pagesize = $data['size'];
                $offset = ($pagenum - 1) * $pagesize;
                $search = $data['search'];

                $total_pages = ceil($totalCount / $data['size']);


                $stmt = $this->_DB->query("SELECT id, pedido, cliente, cedtecnico, tecnico, accion, asesor, fecha, duracion, region, idllamada, observacion
                                                FROM quejasgo
                                                    WHERE 1=1 
                                                    $condicion 
                                                    ORDER BY fecha DESC limit $offset, $pagesize");
                $stmt->execute();

                if ($stmt->rowCount()) {
                    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
                    $response = ['state' => 1, 'data' => $result, 'total' => $total_pages, 'counter' => $totalCount];
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

    public function csvQuejasGo($data)
    {
        ini_set('session.gc_maxlifetime', 3600); // 1 hour
        session_set_cookie_params(3600);
        session_start();
        try {
            $usuarioid = $data['datosLogin'];
            $usuarioid = $usuarioid['LOGIN'];
            $datos = $data['datos'];
            $fechaini = $datos['fechaini'];
            $fechafin = $datos['fechafin'];
            $columnaBusqueda = $datos['columnaBusqueda'];
            $valorBusqueda = $datos['valorBusqueda'];


            if ($fechaini == "" && $fechafin == "") {
                $fechaini = date("Y-m-d");
                $fechafin = date("Y-m-d");
            }


            if ($columnaBusqueda == "" || $valorBusqueda == "") {
                $query = "SELECT g.id, g.pedido, g.cliente, g.cedtecnico, g.tecnico, g.accion, g.asesor, g.fecha, g.duracion, g.region, g.idllamada, g.observacion
								FROM quejasgo g
									WHERE 1=1 AND g.fecha BETWEEN '$fechaini 00:00:00' AND '$fechafin 23:59:59'";
            } else {
                $query = "SELECT g.id, g.pedido, g.cliente, g.cedtecnico, g.tecnico, g.accion, g.asesor, g.fecha, g.duracion, g.region, g.idllamada, g.observacion
								FROM quejasgo g
									WHERE 1=1 AND g.fecha BETWEEN '$fechaini 00:00:00' AND '$fechafin 23:59:59' AND $columnaBusqueda = '$valorBusqueda'";
            }

            $stmt = $this->_DB->query($query);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                $response = array('state' => 1, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC));
            } else {
                $response = array('state' => 0, 'msj' => 'No se encontraron registros');
            }
        } catch (PDOException $th) {
            var_dump($th->getMessage());
        }
        $this->_DB = '';
        echo json_encode($response);
    }

    public function buscarTecnico($data)
    {
        try {
            ini_set('session.gc_maxlifetime', 3600); // 1 hour
            session_set_cookie_params(3600);
            session_start();
            if (!$_SESSION) {
                $response = ['state' => 99, 'title' => 'Su session ha caducado', 'text' => 'Inicia session nuevamente para continuar'];
            } elseif (!isset($data) || $data == '') {
                $response = ['state' => 0, 'text' => 'Debe ingresar la cédula del técnico'];
            } else {
                $stmt = $this->_DB->prepare("SELECT a.nombre, a.ciudad FROM tecnicos a WHERE 1=1 AND a.identificacion = :cedula");

                $stmt->execute([
                    ':cedula' => $data,
                ]);
                if ($stmt->rowCount()) {
                    $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
                    $response = array('state' => 1, 'data' => $resultado);
                } else {
                    $response = array('state' => 0, 'msj' => 'No se encontró el técnico');
                }
            }
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_DB = null;
        echo json_encode($response);
    }

    public function crearTecnicoQuejasGo($data)
    {

        try {
            ini_set('session.gc_maxlifetime', 3600); // 1 hour
            session_set_cookie_params(3600);
            session_start();
            $identificacion = $data['cedtecnico'];
            $nombre = $data['nombretecnico'];
            $ciudad = $data['region'];
            $celular = $data['celulartecnico'];
            $empresa = $data['empresa'];
            $stmt = $this->_DB->prepare(" INSERT INTO tecnicos (identificacion, nombre, ciudad, celular, empresa) values ( :identificacion, UPPER(:nombre), :ciudad,:celular, :empresa)");
            $stmt->execute([
                ':identificacion' => $identificacion,
                ':nombre' => $nombre,
                ':ciudad' => $ciudad,
                ':celular' => $celular,
                ':empresa' => $empresa,
            ]);
            $response = ['Usuario creado', 201];
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_DB = null;
        echo json_encode($response);
        //crea tecnico, activity feed
    }

    public function ciudadesQGo()
    {
        try {
            session_start();
            $stmt = $this->_DB->query(" 	SELECT DISTINCT ciudad 
					FROM ciudades
					ORDER BY ciudad ASC ");
            if ($stmt->rowCount()) {
                $response = array('state' => 1, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC));
            } else {
                $response = array('state' => 0, 'msj' => 'No se encontraron registros');
            }
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_DB = null;
        echo json_encode($response);
    }

    public function guardarQuejaGo($data)
    {

        try {
            ini_set('session.gc_maxlifetime', 3600); // 1 hour
            session_set_cookie_params(3600);
            session_start();
            if (!$_SESSION) {
                $response = ['state' => 99, 'title' => 'Su session ha caducado', 'text' => 'Inicia session nuevamente para continuar'];
            } else {
                $datos = $data['dataquejago'];
                $duracion = $data['duracion'];
                $login = $data['login'];
                $asesor = $login['LOGIN'];
                $pedido = $datos['pedido'];
                $cliente = $datos['cliente'];
                $cedtecnico = $datos['cedtecnico'];
                $tecnico = $datos['tecnico'];
                $accion = $datos['accion'];
                $region = $datos['region'];
                $idllamada = $datos['idllamada'];
                $observacion = $datos['observacion'];


                $stmt = $this->_DB->prepare("
					INSERT INTO quejasgo
						(pedido, cliente, cedtecnico, tecnico, accion, asesor, fecha, duracion, region, idllamada, observacion)
					VALUES
						(:pedido, UPPER(TRIM(:cliente)), :cedtecnico, :tecnico, :accion, :asesor, NOW(), :duracion, :region, :idllamada, :observacion)
				");
                $stmt->execute([
                    ':pedido' => $pedido,
                    ':cliente' => $cliente,
                    ':cedtecnico' => $cedtecnico,
                    ':tecnico' => $tecnico,
                    ':accion' => $accion,
                    ':asesor' => $asesor,
                    ':duracion' => $duracion,
                    ':region' => $region,
                    ':idllamada' => $idllamada,
                    ':observacion' => $observacion,
                ]);


                if ($stmt->rowCount()) {
                    $response = ['Queja guardada', 201];
                } else {
                    $response = 0;
                }
            }

        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_DB = null;
        echo json_encode($response);
    }

    public function ActualizarObserQuejasGo($data)
    {
        try {
            ini_set('session.gc_maxlifetime', 3600); // 1 hour
            session_set_cookie_params(3600);
            session_start();
            if (!$_SESSION) {
                $response = ['state' => 99, 'title' => 'Su session ha caducado', 'text' => 'Inicia session nuevamente para continuar'];
            } else {
                $observaciones = $data['observacion'];
                $observaciones = $observaciones['observacion'];
                $idqueja = $data['idqueja'];


                $stmt = $this->_DB->prepare("UPDATE quejasgo SET observacion = :observaciones where id = :idqueja");

                $stmt->execute([':observaciones' => $observaciones, ':idqueja' => $idqueja]);

                if ($stmt->rowCount()) {
                    $response = array('state' => 1, 'msj' => 'Observación actualizada');
                } else {
                    $response = array('state' => 0, 'msj' => 'Ha ocurrido un error interno inténtalo nuevamente en unos minutos');
                }
            }
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_DB = null;
        echo json_encode($response);
    }

    public function registrarQuejaGo($params)
    {
        try {
            ini_set('session.gc_maxlifetime', 3600); // 1 hour
            session_set_cookie_params(3600);
            session_start();
            $datos = $params['dataquejago'];

            if (!$_SESSION) {
                $response = ['state' => 99, 'title' => 'Su session ha caducado', 'text' => 'Inicia session nuevamente para continuar'];
            } elseif (!isset($params['duracion']) || $params['duracion'] == '') {
                $response = ['state' => 0, 'text' => 'El campo duración es requerido'];
            } elseif (!isset($datos['pedido']) || $datos['pedido'] == '') {
                $response = ['state' => 0, 'text' => 'El campo pedido es requerido'];
            } elseif (!isset($datos['cliente']) || $datos['cliente'] == '') {
                $response = ['state' => 0, 'text' => 'El campo cliente es requerido'];
            } elseif (!isset($datos['cedtecnico']) || $datos['cedtecnico'] == '') {
                $response = ['state' => 0, 'text' => 'El campo documento tecnico es requerido'];
            } elseif (!isset($datos['tecnico']) || $datos['tecnico'] == '') {
                $response = ['state' => 0, 'text' => 'El campo tecnico es requerido'];
            } elseif (!isset($datos['region']) || $datos['region'] == '') {
                $response = ['state' => 0, 'text' => 'El campo region es requerido'];
            } elseif (!isset($datos['idllamada']) || $datos['idllamada'] == '') {
                $response = ['state' => 0, 'text' => 'El campo id llamada es requerido'];
            } elseif (!isset($datos['observacion']) || $datos['observacion'] == '') {
                $response = ['state' => 0, 'text' => 'Ingrese alguna observacion'];
            } else {

                $duracion = $params['duracion'];
                $asesor = $_SESSION['login'];
                $pedido = $datos['pedido'];
                $cliente = $datos['cliente'];
                $cedtecnico = $datos['cedtecnico'];
                $tecnico = $datos['tecnico'];
                $accion = $datos['accion'];
                $region = $datos['region'];
                $idllamada = $datos['idllamada'];
                $observacion = $datos['observacion'];

                $stmt = $this->_DB->prepare("INSERT INTO quejasgo (pedido, cliente, cedtecnico, tecnico, accion, asesor, fecha, duracion, region, idllamada, observacion) VALUES
						(:pedido, UPPER(TRIM(:cliente)), :cedtecnico, :tecnico, :accion, :asesor, NOW(), :duracion, :region, :idllamada, :observacion)");

                $stmt->execute([
                    ':pedido' => $pedido,
                    ':cliente' => $cliente,
                    ':cedtecnico' => $cedtecnico,
                    ':tecnico' => $tecnico,
                    ':accion' => $accion,
                    ':asesor' => $asesor,
                    ':duracion' => $duracion,
                    ':region' => $region,
                    ':idllamada' => $idllamada,
                    ':observacion' => $observacion,
                ]);


                if ($stmt->rowCount() == 1) {
                    $response = ['state' => 1, 'text' => 'Datos guardados correctamente'];
                } else {
                    $response = ['state' => 0, 'text' => 'Ha ocurrido un error intento intentalo nuevamente'];
                }
            }
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_DB = null;
        echo json_encode($response);
    }
}