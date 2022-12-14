<?php
require_once '../class/conection.php';
ini_set('error_reporting', E_ALL);
ini_set('display_errors', 1);

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
        $solicitud = match ($data->solicitud) {
            '1' => 'Abrir',
            '2' => 'Asignar',
            '3' => 'Despachar',
            default => '',
        };

        $motivo = match ($data->motivo) {
            '1' => 'Cubrir Novedad',
            '2' => 'Ruta Atrazada',
            '3' => 'Desplazamiento Largo',
            '4' => 'Microzona errada',
            '5' => 'Trabajo Futuro',
            '6' => 'Retrazo en la mesa de soporte',
            '7' => 'Pedido amarillo',
            '8' => 'Reabrir pedido',
            '9' => 'Pedido cancelado',
            '10' => 'Inicio despues de las 9:00am',
            default => '',
        };

        $submotivo = match ($data->submotivo) {
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
            $stmt = $this->_DB->prepare("INSERT INTO nivelacion (ticket_id, nombre_tecnico, cc_tecnico, pedido, proceso, zona, zubzona, cc_nuevo_tecnico,
                                                                        nombre_nuevo_tecnico, solicitud, motivo, submotivo, fecha_ingreso, creado_por, estado)
                                                VALUES (:ticket_id, :nombre_tecnico, :cc_tecnico, :pedido, :proceso, :zona, :zubzona, :cc_nuevo_tecnico,
                                                                        :nombre_nuevo_tecnico, :solicitud, :motivo, :submotivo, :fecha_ingreso, :creado_por, '0')");
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
                ':fecha_ingreso'        => date('Y-m-d h:i:s'),
                ':creado_por'           => $_SESSION['login'],
            ]);

            if ($stmt->rowCount() == 1) {
                $response = ['state' => 1, 'msj' => 'La solicitud de nivelación se ha creado correctamente'];
            } else {
                $response = ['state' => 0, 'msj' => 'Ah ocurrido un error intentalo nuevamente'];
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
            $stmt = $this->_DB->query("select count(*) as estado
                                                from nivelacion
                                                group by estado");
            $stmt->execute();

            if ($stmt->rowCount()) {
                $result    = $stmt->fetchAll(PDO::FETCH_ASSOC);
                $pendiente = $result[1]['estado'] ?? '';
                $realizado = $result[0]['estado'] ?? '';
                $response  = ['pendiente' => $pendiente, 'realizado' => $realizado];
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

    public function gestionarNivelacion()
    {
        try {
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
                                                       n.id
                                                from nivelacion n where n.estado = '0'");
            $stmt->execute();
            if ($stmt->rowCount()) {
                $result   = $stmt->fetchAll(PDO::FETCH_ASSOC);
                $response = ['state' => 1, 'data' => $result];
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
        try {
            $stmt = $this->_DB->prepare("update nivelacion set se_realiza_nivelacion = :nivelacion, observaciones = :observaciones, fecha_respuesta = :fecha, gestiona_por = :user, estado = '1' where id = :id");
            $stmt->execute([':nivelacion'    => $data->nivelacion,
                            ':observaciones' => $data->observaciones,
                            ':id'            => $data->id,
                            ':fecha'         => date('Y-m-d H:i:s'),
                            ':user'          => $_SESSION['login'],
            ]);
            if ($stmt->rowCount() == 1) {
                $response = ['state' => 1, 'msj' => "Se a realizado el cambio en el ticket $data->ticket_id correctamente"];
            } else {
                $response = ['state' => 0, 'msj' => "Ah ocurrido un error intentalo nuevamente"];
            }
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_DB = null;
        echo json_encode($response);
    }

}
