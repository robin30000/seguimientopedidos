<?php
require_once '../class/conection.php';
//ini_set('error_reporting', 0);
ini_set('display_errors', 1);

date_default_timezone_set('America/Bogota');

class modelNivelacion
{
    private $_DB;

    public function __construct()
    {
        $this->_DB = new Conection();
    }

    public function saveTicket($data)
    {

        try {

            var_dump($data);
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }

    }

    public function searchIdTecnic($data)
    {
        try {

            $stmt = $this->_DB->prepare("select nombre from tecnicos where identificacion = :id");
            $stmt->execute([':id' => $data]);
            if ($stmt->rowCount()) {
                $result   = $stmt->fetch(PDO::FETCH_OBJ);
                $response = ['state' => 1, 'data' => $result];
            } else {
                $response = ['state' => 0, 'msj' => 'No se encontraron datos'];
            }
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_DB = null;
        echo json_encode($response);
    }

    public function saveNivelation($data)
    {
        session_start();
        $fecha = date('Y-m-d H:i:s');
        $solicitud = match ($data->solicitud) {
            '1' => 'Abrir',
            '2' => 'Asignar',
            '3' => 'Despachar',
            default => '',
        };

        $submot = $data->submotivo ?? '';

        $motivo = match ($data->motivo) {
            '1' => 'Cubrir Novedad',
            '2' => 'Ruta Atrasada',
            '3' => 'Desplazamiento Largo',
            '4' => 'Microzona errada',
            '5' => 'Trabajo Futuro',
            '6' => 'Retraso en la mesa de soporte',
            '7' => 'Pedido amarillo',
            '8' => 'Reabrir pedido',
            '9' => 'Pedido cancelado',
            '10' => 'Inicio despues de las 9:00am',
            '11' => 'Pedido Abierto',
            '12' => 'Técnico no es del proceso',
            '13' => 'Click no despacho',
            default => '',
        };

        if(isset($data->newTecName)  == '' || empty($data->newTecName) || !isset($data->newTecName)){
            $data->newTecName = 'No Aplica';
        }

        if (isset($data->newIdTecnic)  == '' || empty($data->newIdTecnic) || !isset($data->newTecName)){
            $data->newIdTecnic = 'No Aplica';
        }

        //$submotivo = isset($data->datos->submotivo) ? $data->datos->submotivo : '';

        $submotivo = match ($submot) {
            '1' => 'Contingencia',
            '2' => 'Auditoria NAP',
            '3' => 'Auditoria TAP',
            '4' => 'Soporte Gpon',
            '5' => 'Escalamiento infraestructura',
            '6' => 'Unidad residencial',
            '7' => 'Ejecución/Reinstalación',
            default => '',
        };

        try {

            $stmt = $this->_DB->prepare("SELECT * FROM nivelacion WHERE ticket_id = :id and estado = 0");
            $stmt->execute([':id' => $data->ticket]);

            if ($stmt->rowCount() > 0) {
                $response = ['state' => 0, 'msj' => 'Ya se encuentra en el sistema una tarea con este concecutivo sin gestionarse'];
            } else {
                $stmt = $this->_DB->prepare("INSERT INTO nivelacion (ticket_id, nombre_tecnico, cc_tecnico, pedido, proceso, zona, zubzona, cc_nuevo_tecnico,
                                                                        nombre_nuevo_tecnico, solicitud, motivo, submotivo, fecha_ingreso, creado_por, estado, observacionVeedor)
                                                VALUES (:ticket_id, :nombre_tecnico, :cc_tecnico, :pedido, :proceso, :zona, :zubzona, :cc_nuevo_tecnico,
                                                                        :nombre_nuevo_tecnico, :solicitud, :motivo, :submotivo, :fecha_ingreso, :creado_por, '0', :observacionVeedor)");
                $stmt->execute([
                    ':ticket_id'            => $data->ticket,
                    ':nombre_tecnico'       => $data->nombreTecnico,
                    ':cc_tecnico'           => $data->idTecnico,
                    ':pedido'               => $data->pedido,
                    ':proceso'              => $data->proceso,
                    ':zona'                 => $data->zona,
                    ':zubzona'              => $data->subZona,
                    ':cc_nuevo_tecnico'     => $data->newIdTecnic,
                    ':nombre_nuevo_tecnico' => $data->newTecName,
                    ':solicitud'            => $solicitud,
                    ':motivo'               => $motivo,
                    ':submotivo'            => $submotivo,
                    ':fecha_ingreso'        => $fecha,
                    ':creado_por'           => $_SESSION['login'],
                    ':observacionVeedor'    => $data->observacionVeedor,
                ]);

                if ($stmt->rowCount() == 1) {
                    $response = ['state' => 1, 'msj' => 'La solicitud de nivelación se ha creado correctamente'];
                } else {
                    $response = ['state' => 0, 'msj' => 'Ah ocurrido un error intentalo nuevamente'];
                }
            }


        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_DB = null;
        echo json_encode($response);
    }

    public function en_genstion_nivelacion()
    {
        try {
            session_start();
            $login = $_SESSION['login'];

            $stmt = $this->_DB->prepare("SELECT COUNT(*) AS total, CASE estado WHEN 1 THEN 'gestion' WHEN 2 THEN 'realizado' WHEN 0 THEN 'pendiente' END as estado
                                            FROM nivelacion 
                                            GROUP BY estado and creado_por = :login");
            $stmt->execute([':login' => $login]);

            $tarea = $this->_DB->prepare("SELECT ticket_id, observaciones
                                            FROM nivelacion
                                            where creado_por = :login and  estado = 2");

            $tarea->execute([':login' => $login]);

            if ($stmt->rowCount()) {
                $result    = $stmt->fetchAll(PDO::FETCH_ASSOC);
                $res_tarea = $tarea->fetchAll(PDO::FETCH_ASSOC);
                $response  = ['gestion' => $result, 'tarea' => $res_tarea];
            } else {
                $response = ['pendiente' => 0, 'realizado' => 0];
            }

        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_DB = null;
        echo json_encode($response);
    }


    public function buscarhistoricoNivelacion($data)
    {
        try {
            $stmt = $this->_DB->prepare("select * from nivelacion where ticket_id = :ticket");
            $stmt->execute([':ticket' => $data]);
            $stmt->execute();
            if ($stmt->rowCount()) {
                $result   = $stmt->fetchAll(PDO::FETCH_ASSOC);
                $response = ['state' => 1, 'data' => $result];
            } else {
                $response = ['state' => 0, 'msj' => 'No se encontraron datos'];
            }
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_DB = null;
        echo json_encode($response);
    }

    public function gestionarNivelacion($data)
    {
        try {

            $fecha = date('Y-m-d H:i:s');

            $stmt = $this->_DB->query("select count(*) as total from nivelacion where 
                                               estado != 2 order by fecha_ingreso and fecha_ingreso BETWEEN ('$fecha 00:00:00') AND ('$fecha 23:59:59')");
            $stmt->execute();

            $resCount   = $stmt->fetch(PDO::FETCH_OBJ);
            $totalCount = $resCount->total;
            

            if (isset($data->curPage)) {
                $page_number = $data->curPage;
            } else {
                $page_number = 1;
            }

            $initial_page = ($page_number - 1) * $data->pageSize;
            $total_pages  = ceil($totalCount / $data->pageSize);

            session_start();
            $user = $_SESSION['login'];

            $stmt = $this->_DB->query("select n.creado_por,
                                                       n.pedido,
                                                       n.ticket_id,
                                                       n.proceso,
                                                       n.zona,
                                                       n.zubzona,
                                                       n.nombre_tecnico,
                                                       n.cc_tecnico,
                                                       n.solicitud,
                                                       n.motivo,
                                                       n.submotivo,
                                                       n.cc_nuevo_tecnico,
                                                       n.nombre_nuevo_tecnico,
                                                       n.observaciones,
                                                       n.fecha_ingreso,
                                                       n.id,
                                                       n.gestiona_por,
                                                       n.creado_por,
                                                       n.observacionVeedor,
                                                       n.en_gestion
                                                from nivelacion n where n.estado != 2 order by n.fecha_ingreso and n.fecha_ingreso 
                                                    BETWEEN ('$fecha 00:00:00') AND ('$fecha 23:59:59') limit $initial_page, $data->pageSize");
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

    public function guardaNivelacion($data)
    {
        session_start();

        $mifecha = new DateTime();
        $mifecha->modify('+43 minute');
        $fecha = $mifecha->format('Y-m-d H:i:s');
        try {

            $stmt = $this->_DB->prepare("select en_gestion, gestiona_por from nivelacion where id = :id");
            $stmt->execute([':id' => $data->id]);
            $result = $stmt->fetch(PDO::FETCH_OBJ);
            if ($result->gestiona_por != $_SESSION['login']) {
                $response = ['state' => 0, 'msj' => "La tarea no se encuentra en gentión por el usuario actual"];

            } else {
                $stmt = $this->_DB->prepare("update nivelacion set se_realiza_nivelacion = :nivelacion, observaciones = :observaciones, fecha_respuesta = :fecha_respuesta, estado = '2' where id = :id");
                $stmt->execute([
                    ':nivelacion'      => $data->nivelacion,
                    ':observaciones'   => $data->observaciones,
                    ':id'              => $data->id,
                    ':fecha_respuesta' => $fecha,
                ]);
                if ($stmt->rowCount() == 1) {
                    $response = ['state' => 1, 'msj' => "Se a realizado el cambio de la tarea correctamente"];
                } else {
                    $response = ['state' => 0, 'msj' => "Ah ocurrido un error intentalo nuevamente"];
                }
            }


        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_DB = null;
        echo json_encode($response);
    }

    public function gestionarRegistrosNivelacion($data)
    {
        try {

            //curPage: 1, pageSize: 50, sort: null
            //echo $data->curPage;exit();
            $stmt = $this->_DB->query("select count(*) as total from nivelacion");
            $stmt->execute();

            $resCount   = $stmt->fetch(PDO::FETCH_OBJ);
            $totalCount = $resCount->total;

            if (isset($data->curPage)) {
                $page_number = $data->curPage;
            } else {
                $page_number = 1;
            }

            $initial_page = ($page_number - 1) * $data->pageSize;

            $total_pages = ceil($totalCount / $data->pageSize);
            //calculo el total de paginas

            //echo $total_pages;exit();
            $stmt = $this->_DB->query("select n.creado_por,
                                                       n.pedido,
                                                       n.ticket_id,
                                                       n.proceso,
                                                       n.zona,
                                                       n.zubzona,
                                                       n.nombre_tecnico,
                                                       n.cc_tecnico,
                                                       n.solicitud,
                                                       n.motivo,
                                                       n.submotivo,
                                                       n.cc_nuevo_tecnico,
                                                       n.nombre_nuevo_tecnico,
                                                       n.observaciones,
                                                       n.fecha_ingreso,
                                                       n.id,
                                                       n.se_realiza_nivelacion,
                                                       n.observacionVeedor
                                                from nivelacion n order by fecha_respuesta desc limit $initial_page, $data->pageSize");
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

    public function marcarEnGestionNivelacion($data)
    {
        try {
            session_start();

            $fecha = date('Y-m-d H:i:s');

            $stmt  = $this->_DB->prepare("select en_gestion, gestiona_por from nivelacion where id = :id");
            $stmt->execute([':id' => $data]);

            $resul = $stmt->fetch(PDO::FETCH_OBJ);

            if ($resul->gestiona_por == $_SESSION['login']) {

                $stmt = $this->_DB->prepare("update nivelacion set en_gestion = '', gestiona_por = '' where id = :id");
                if ($stmt->execute([':id' => $data])) {
                    $response = ['state' => 1, 'msj' => 'La tarea se encuentra desbloqueada'];
                } else {
                    $response = ['state' => 0, 'msj' => 'Ah ocurrido un error intentalo nuevamente'];
                }

            } elseif ($resul->en_gestion == '') {

                $stmt = $this->_DB->prepare("update nivelacion set gestiona_por = :gestion, estado = 1, fecha_gestion = :fecha_gestion, en_gestion = 1 where id = :id");
                $stmt->execute([':gestion' => $_SESSION['login'], ':id' => $data, ':fecha_gestion' => $fecha]);
                $response = ['state' => 1, 'msj' => 'La tarea se encuentra Bloqueada'];
            } elseif ($resul->en_gestion != $_SESSION['login']) {
                $response = ['state' => 1, 'msj' => 'La tarea se encuentra en gestión'];
            }

        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_DB = null;
        echo json_encode($response);
    }

    public function csvNivelacion($data)
    {
        $fechaini = $data->fechaini;
        $fechafin = $data->fechafin;


        $stmt = $this->_DB->query("select ticket_id,
                                           fecha_ingreso,
                                           fecha_gestion,
                                           nombre_tecnico,
                                           cc_tecnico,
                                           pedido,
                                           proceso,
                                           motivo,
                                           submotivo,
                                           zona,
                                           zubzona,
                                           nombre_nuevo_tecnico,
                                           cc_nuevo_tecnico,
                                           creado_por,
                                           gestiona_por,
                                           observaciones,
                                           se_realiza_nivelacion
                                    from nivelacion where 1=1 and fecha_ingreso BETWEEN ('$fechaini 00:00:00') AND ('$fechafin 23:59:59')");

        $stmt->execute();

        if ($stmt->rowCount()) {
            $result   = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $response = [$result];
        } else {
            $response = ['state' => 0, 'msj' => 'No se encontraron datos'];
        }
        $this->_DB = null;
        echo json_encode($response);

    }

}
