<?php
require_once '../class/conection.php';

class modelCodigoIncompleto
{
    private $_DB;

    public function __construct()
    {
        $this->_DB = new Conection();

    }

    public function getListaCodigoIncompleto()
    {

        try {
            $now  = date('Y-m-d');
            $stmt = $this->_DB->prepare("SELECT *
                                                FROM gestion_codigo_incompleto
                                                WHERE fecha_creado BETWEEN :fechaini AND :fechafin
                                                  AND status_soporte = '0'");
            $stmt->execute([
                ':fechaini' => "$now 00:00:00",
                ':fechafin' => "$now 23:59:59",
            ]);

            if ($stmt->rowCount()) {
                $response = [$stmt->fetchAll(PDO::FETCH_ASSOC), 201];
            } else {
                $response = ['Error', 400];
            }

        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_DB = null;

        echo json_encode($response);
    }

    public function gestionarCodigoIncompleto($data)
    {
        try {

            $id_codigo_incompleto = $data->id_codigo_incompleto;
            $tipificacion         = $data->tipificacion;
            $observacion          = $data->observacion;
            $fecha_respuesta      = date('Y-m-d H:i:s');

            $stmt = $this->_DB->prepare("UPDATE gestion_codigo_incompleto
                                            SET status_soporte    = 1,
                                                respuesta_gestion = :tipificacion,
                                                observacion       = :observacion,
                                                login             = :login,
                                                fecha_respuesta   = :fecha_respuesta
                                            WHERE id_codigo_incompleto = :id_codigo_incompleto");
            $stmt->execute([
                ':tipificacion'         => $tipificacion,
                ':observacion'          => $observacion,
                ':login'                => $_SESSION['login'],
                ':fecha_respuesta'      => $fecha_respuesta,
                ':id_codigo_incompleto' => $id_codigo_incompleto,
            ]);

            if ($stmt->rowCount()) {
                $response = [['type' => 'success', 'msg' => 'OK'], 201];
            } else {
                $response = [['type' => 'Error', 'msg' => 'Ah ocurrido un error intentalo nuevamente'], 400];
            }
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_DB = null;
        echo json_encode($response);
    }

    public function registroscodigoincompleto($data)
    {
        try {
            $pagina = $data->page;
            $datos  = $data->datos;

            $fechaini = (!isset($datos['fechaini'])) ? date("Y-m-d") : $datos['fechaini']; //CORRECCION DE VALIDACION DE FECHA
            $fechafin = (!isset($datos['fechafin'])) ? date("Y-m-d") : $datos['fechafin']; //CORRECCION DE VALIDACION DE FECHA

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

            $stmt = $this->_DB->prepare("SELECT id_codigo_incompleto,
                                               tarea,
                                               numero_contacto,
                                               nombre_contacto,
                                               unepedido,
                                               tasktypecategory,
                                               unemunicipio,
                                               uneproductos,
                                               engineer_id,
                                               engineer_name,
                                               mobile_phone,
                                               status_soporte,
                                               fecha_solicitud_firebase,
                                               fecha_creado,
                                               respuesta_gestion,
                                               observacion,
                                               login,
                                               fecha_respuesta
                                        FROM gestion_codigo_incompleto
                                        WHERE fecha_respuesta BETWEEN :fechaini AND :fechafin
                                          AND status_soporte = '1'
                                        ORDER BY fecha_creado DESC
                                        LIMIT 100 offset :pagina");
            $stmt->execute([
                ':fechaini' => "$fechaini 00:00:00",
                ':fechafin' => "$fechafin 23:59:59",
                ':pagina'   => $pagina,
            ]);

            if ($stmt->rowCount()) {
                $response = [$stmt->fetchAll(PDO::FETCH_ASSOC), $stmt->rowCount()];
            } else {
                $response = ['', 400];
            }
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }

        $this->_DB = null;
        echo json_encode($response);
    }

    public function csvRegistrosCodigoIncompleto($data)
    {

        try {

            $usuarioid = $_SESSION['login'];
            $datos     = $data->datos;
            $fechaini  = $datos['fechaini'];
            $fechafin  = $datos['fechafin'];

            if ($fechaini == "" && $fechafin == "") {
                $fechaini = date("Y") . "-" . date("m") . "-" . date("d");
                $fechafin = date("Y") . "-" . date("m") . "-" . date("d");
            }

            //echo "estos son los datos, usuario: ".$usuarioid." fechaini: ".$fechaini." y fechafin: ".$fechafin;
            //echo "estos son los otros concepto, buscar: ".$concepto." buscar: ".$buscar;
            if ($fechaini == $fechafin) {
                $filename = "Registros" . "_" . $fechaini . "_" . $concepto . "_" . $buscar . ".csv";
            } else {
                $filename = "Registros" . "_" . $fechaini . "_" . $fechafin . "_" . $concepto . "_" . $buscar . ".csv";
            }

            $stmt = $this->_DB->prepare("SELECT id_codigo_incompleto,
                                                   tarea,
                                                   numero_contacto,
                                                   nombre_contacto,
                                                   unepedido,
                                                   tasktypecategory,
                                                   unemunicipio,
                                                   uneproductos,
                                                   engineer_id,
                                                   engineer_name,
                                                   mobile_phone,
                                                   status_soporte,
                                                   fecha_solicitud_firebase,
                                                   fecha_creado,
                                                   respuesta_gestion,
                                                   observacion,
                                                   login,
                                                   fecha_respuesta
                                            FROM gestion_codigo_incompleto
                                            WHERE fecha_respuesta BETWEEN :fechaini AND :fechafin
                                              AND status_soporte = '1'
                                            ORDER BY fecha_creado DESC");
            $stmt->execute([
                ':fechaini' => "$fechaini 00:00:00",
                ':fechafin' => "$fechafin 23:59:59",
            ]);

            if ($stmt->rowCount()) {
                $fp     = fopen("../tmp/$filename", 'w');
                $columnas = [
                    'ID_CODIGO_INCOMPLETO',
                    'TAREA',
                    'NUMERO_CONTACTO',
                    'NOMBRE_CONTACTO',
                    'UNEPEDIDO',
                    'TASKTYPECATEGORY',
                    'UNEMUNICIPIO',
                    'UNEPRODUCTOS',
                    'ENGINEER_ID',
                    'ENGINEER_NAME',
                    'MOBILE_PHONE',
                    'STATUS_SOPORTE',
                    'FECHA_SOLICITUD_FIREBASE',
                    'FECHA_CREADO',
                    'RESPUESTA_GESTION',
                    'OBSERVACION',
                    'LOGIN',
                    'FECHA_RESPUESTA',
                ];

                fputcsv($fp, $columnas);
                fputcsv($fp, $stmt->fetchAll(PDO::FETCH_ASSOC));
                fclose($fp);

                $response = [$filename, $stmt->rowCount()];
            } else {
                $response = ['', 203];
            }
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        echo json_encode($response);
    }
}
