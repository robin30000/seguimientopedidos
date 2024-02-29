<?php

require_once '../class/conection.php';

error_reporting(0);
ini_set('display_errors', 0);

class user
{
    private $_DB;

    public function __construct()
    {
        $this->_DB = new Conection();
    }

    public function editarUsuario($data)
    {

        try {

            $stmt = $this->_DB->prepare("update usuarios
                                                set nombre         = :nombre,
                                                    identificacion = :identificacion,
                                                    login          = :login,
                                                    password       = :password,
                                                    perfil         = :perfil,
                                                    usuario_crea   = :usuario_crea,
                                                    fecha_crea     = :fecha_crea,
                                                    correo         = :correo
                                                where id = :id");
            $stmt->execute([
                ':nombre' => $data['NOMBRE'],
                ':identificacion' => $data['IDENTIFICACION'],
                ':login' => $data['LOGIN'],
                ':password' => $data['PASSWORD'],
                ':perfil' => $data['perfil'],
                ':usuario_crea' => $data['usuario_crea'],
                ':fecha_crea' => date('Y-m-d H:i:s'),
                ':correo' => $data['correo'],
                ':id' => $data['ID'],
            ]);

            if ($stmt->rowCount() == 1) {
                $response = ['state' => true, 'msj' => 'Usuario actualizado'];
            } else {
                $response = ['state' => false, 'msj' => 'Ah ocurrido un error inténtalo de nuevo en unos minutos'];
            }
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_DB = null;
        echo json_encode($response);
    }

    public function editarRegistro($data)
    {
        try {
            ini_set('session.gc_maxlifetime', 3600); // 1 hour
            session_set_cookie_params(3600);
            session_start();
            $user = $_SESSION['login'];
            $datos = $data['datosEdicion'];
            $accion = $datos['accion'];
            $tipo_pendiente = $datos['tipo_pendiente'];
            $observaciones = $datos['observaciones'];
            $id = $datos['id'];

            $stmt = $this->_DB->prepare("update registros
                                                set asesor         = :user,
                                                    accion         = :accion,
                                                    tipo_pendiente = :tipo_pendiente,
                                                    observaciones  = :observaciones
                                                where id = :id");
            $stmt->execute([
                ':user' => $user,
                ':accion' => $accion,
                ':tipo_pendiente' => $tipo_pendiente,
                ':observaciones' => $observaciones,
                ':id' => $id,
            ]);

            if ($stmt->rowCount() == 1) {
                $response = ['state' => 1, 'msj' => 'Pedido actualizado correctamente.'];
            } else {
                $response = ['state' => 0, 'msj' => 'Ha ocurrido un error interno inténtalo nuevamente en unos minutos'];
            }
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }

        $this->_DB = null;
        echo json_encode($response);
    }

    public function CrearpedidoComercial($data)
    {

        try {
            ini_set('session.gc_maxlifetime', 3600); // 1 hour
            session_set_cookie_params(3600);
            session_start();
            $user = $_SESSION['login'];
            $crearpedido = $data['datospedidoComercial'];
            $ciudad = $crearpedido['CIUDAD'];
            $estado = $crearpedido['ESTADO'];
            $gestion = $crearpedido['GESTION'];
            $observaciones = $crearpedido['OBSERVACIONES'];
            $pedido_actual = $crearpedido['PEDIDO_ACTUAL'];
            $pedido_nuevo = $crearpedido['PEDIDO_NUEVO'];
            $clasificacion = $crearpedido['CLASIFICACION'];

            $stmt = $this->_DB->prepare("INSERT INTO registros_comercial (LOGIN_ASESOR,
                                                 PEDIDO_ACTUAL,
                                                 PEDIDO_NUEVO,
                                                 CIUDAD,
                                                 GESTION, CLASIFICACION, ESTADO, OBSERVACIONES)
                                                values (:user,
                                                        :pedido_actual,
                                                        :pedido_nuevo,
                                                        :ciudad,
                                                        :gestion, :clasificacion, :estado, :observaciones)");

            $stmt->execute([
                ':user' => $user,
                ':pedido_actual' => $pedido_actual,
                ':pedido_nuevo' => $pedido_nuevo,
                ':ciudad' => $ciudad,
                ':gestion' => $gestion,
                ':clasificacion' => $clasificacion,
                ':estado' => $estado,
                ':observaciones' => $observaciones,
            ]);

            if ($stmt->rowCount() == 1) {
                $response = ['Usuario creado', 201];
            }
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_DB = null;
        echo json_encode($response);
    }

    public function guardarPlan($data)
    {

        try {
            ini_set('session.gc_maxlifetime', 3600); // 1 hour
            session_set_cookie_params(3600);
            session_start();
            $login = $_SESSION['login'];
            $user = $login['LOGIN'];
            $planNPS = $data;
            $responsable = $planNPS['responsable'];
            $regional = $planNPS['regional'];
            $plan = $planNPS['plan'];

            $stmt = $this->_DB->prepare("INSERT INTO npsPlanTrabajo (responsable,
                                                regional,
                                                observaciones, usuario_carga)
                                                values (:responsable,
                                                        :regional,
                                                        :plan,
                                                        :user)");
            $stmt->execute([
                ':responsable' => $responsable,
                ':regional' => $regional,
                ':plan' => $plan,
                ':user' => $user,
            ]);

            if ($stmt->rowCount() == 1) {
                $response = ['Usuario creado', 201];
            } else {
                $response = ['Ah ocurrido un error inténtalo de nuevo en unos minutos'];
            }
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }

        $this->_DB = null;
        echo json_encode($response);
    }

    public function CrearpedidoOffline($data)
    {
        try {

            ini_set('session.gc_maxlifetime', 3600); // 1 hour
            session_set_cookie_params(3600);
            session_start();
            if (!$_SESSION) {
                $response = ['state' => 99, 'title' => 'Su session ha caducado', 'text' => 'Inicia session nuevamente para continuar'];
            } elseif (!isset($data['PEDIDO']) || $data['PEDIDO'] == '') {
                $response = ['state' => 0, 'text' => 'El pedido es requerido'];
            } elseif (!isset($data['PROCESO']) || $data['PROCESO'] == '') {
                $response = ['state' => 0, 'text' => 'El proceso es requerido'];
            } elseif (!isset($data['PRODUCTO']) || $data['PRODUCTO'] == '') {
                $response = ['state' => 0, 'text' => 'El proceso es requerido'];
            } elseif (!isset($data['ACCION']) || $data['ACCION'] == '') {
                $response = ['state' => 0, 'text' => 'El proceso es requerido'];
            } elseif (!isset($data['ACTIVIDAD']) || $data['ACTIVIDAD'] == '') {
                $response = ['state' => 0, 'text' => 'El proceso es requerido'];
            } elseif (!isset($data['OBSERVACIONES']) || $data['OBSERVACIONES'] == '') {
                $response = ['state' => 0, 'text' => 'El proceso es requerido'];
            } else {
                $user = $_SESSION['login'];
                $login_asesor = $data['LOGIN_ASESOR'];
                $pedido = $data['PEDIDO'];
                $proceso = $data['PROCESO'];
                $producto = $data['PRODUCTO'];
                $accion = $data['ACCION'];
                $actividad = $data['ACTIVIDAD'];
                $actividad2 = $data['ACTIVIDAD2'] ?? "";
                $observaciones = $data['OBSERVACIONES'];
                $observaciones = str_replace("\n", "/", $observaciones);

                $stmt = $this->_DB->prepare("INSERT INTO registros_offline (LOGIN_ASESOR_OFF,
                                                   LOGIN_ASESOR,
                                                   PEDIDO,
                                                   PROCESO,
                                                   PRODUCTO, ACCION, ACTIVIDAD, ACTIVIDAD2, OBSERVACIONES)
                                                values (:user,
                                                        :login_asesor,
                                                        :pedido,
                                                        :proceso,
                                                        :producto, :accion, :actividad, :actividad2, :observaciones)");
                $stmt->execute([
                    ':user' => $user,
                    ':login_asesor' => $login_asesor,
                    ':pedido' => $pedido,
                    ':proceso' => $proceso,
                    ':producto' => $producto,
                    ':accion' => $accion,
                    ':actividad' => $actividad,
                    ':actividad2' => $actividad2,
                    ':observaciones' => $observaciones,
                ]);

                if ($stmt->rowCount() == 1) {
                    $response = ['state' => 1, 'text' => 'Pedido guardado correctamente'];
                } else {
                    $response = ['state' => 0, 'text' => 'Ah ocurrido un error intentalo nuevamente'];
                }
            }
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }

        $this->_DB = null;
        echo json_encode($response);
    }

    /*public function ingresarPedidoAsesor($params)
    {
        try {

            $idcambioequipo   = $params['idcambioequipo'];
            $duracion_llamada = $params['duracion_llamada'];
            $crearpedido      = $params['datospedido'];


            $plantilla       = (isset($params['plantilla'])) ? $params['plantilla'] : '';
            $datosClick      = (isset($params['datosClick'])) ? $params['datosClick'] : '';
            $user            = $datosClick['login'];
            $id_llamada      = (isset($crearpedido['id_llamada'])) ? $crearpedido['id_llamada'] : '';
            $proceso         = (isset($crearpedido['proceso'])) ? $crearpedido['proceso'] : '';
            $accion          = (isset($crearpedido['accion'])) ? $crearpedido['accion'] : '';
            $subaccion       = (isset($crearpedido['subAccion'])) ? $crearpedido['subAccion'] : '';
            $observaciones   = (isset($crearpedido['observaciones'])) ? $crearpedido['observaciones'] : '';
            $cod_familiar    = (isset($crearpedido['cod_familiar'])) ? $crearpedido['cod_familiar'] : '';
            $prueba_integra  = (isset($crearpedido['prueba_integra'])) ? $crearpedido['prueba_integra'] : '';
            $telefonia_tdm   = (isset($crearpedido['telefonia_tdm'])) ? $crearpedido['telefonia_tdm'] : '';
            $telev_hfc       = (isset($crearpedido['telev_hfc'])) ? $crearpedido['telev_hfc'] : '';
            $iptv            = (isset($crearpedido['iptv'])) ? $crearpedido['iptv'] : '';
            $internet        = (isset($crearpedido['internet'])) ? $crearpedido['internet'] : '';
            $toip            = (isset($crearpedido['toip'])) ? $crearpedido['toip'] : '';
            $smartPlay       = (isset($crearpedido['smartPlay'])) ? $crearpedido['smartPlay'] : '';
            $observaciones   = (isset($crearpedido['observaciones'])) ? $crearpedido['observaciones'] : '';
            $observaciones   = str_replace("\n", "/", $observaciones);
            $observaciones   = str_replace("'", " ", $observaciones);
            $pruebaSMNET     = (isset($crearpedido['pruebaSMNET'])) ? $crearpedido['pruebaSMNET'] : '';
            $UNESourceSystem = (isset($crearpedido['UNESourceSystem'])) ? $crearpedido['UNESourceSystem'] : '';
            $codigo          = (isset($crearpedido['pendiente'])) ? $crearpedido['pendiente'] : '';
            $tipointeraccion = (isset($crearpedido['interaccion'])) ? $crearpedido['interaccion'] : '';
            $diagnostico     = (isset($crearpedido['diagnostico'])) ? $crearpedido['diagnostico'] : '';

            $clienteContestaLlamada = (isset($crearpedido['clienteContestaLlamada'])) ? $crearpedido['clienteContestaLlamada'] : '';
            $razonNoInstalacion     = (isset($crearpedido['razonNoInstalacion'])) ? $crearpedido['razonNoInstalacion'] : '';
            $tecnicoVivienda        = (isset($crearpedido['tecnicoVivienda'])) ? $crearpedido['tecnicoVivienda'] : '';
            $conocimientoAgenda     = (isset($crearpedido['conocimientoAgenda'])) ? $crearpedido['conocimientoAgenda'] : '';

            if ($clienteContestaLlamada != '') {
                $observaciones = '¿Técnico esta en la vivienda?: ' . $tecnicoVivienda . '||¿Tenia conocimiento de la agenda?: ' . $conocimientoAgenda . '||¿cliente contesta la llamada?: ' . $clienteContestaLlamada . '||¿Nos podría indicar por que no se puede instalar los servicios?: ' . $razonNoInstalacion . '||' . $observaciones;
            }

            if ($tipointeraccion != 'llamada') {
                $id_llamada = '';
            }

            if ($datosClick['pEDIDO_UNE'] == "" || $datosClick['pEDIDO_UNE'] == "TIMEOUT") {

                $tecnico              = $crearpedido['tecnico'];
                $despacho             = $crearpedido['CIUDAD'];
                $producto             = $crearpedido['producto'];
                $pedido               = $params['pedido'];
                $nombre_de_la_empresa = $params['empresa'];
            } else {
                if ($datosClick['uNEProvisioner'] == "EMT") {
                    $nombre_de_la_empresa = "EMTELCO";
                } elseif ($datosClick['uNEProvisioner'] == "RYE") {
                    $nombre_de_la_empresa = "REDES Y EDIFICACIONES";
                } elseif ($datosClick['uNEProvisioner'] == "EIA") {
                    $nombre_de_la_empresa = "ENERGIA INTEGRAL ANDINA";
                } else {
                    $nombre_de_la_empresa = $datosClick['uNEProvisioner'];
                }
                $producto = $datosClick['uNETecnologias'];
                $tecnico  = $datosClick['engineerID'];
                $despacho = $datosClick['uNEMunicipio'];
                $pedido   = $datosClick['pEDIDO_UNE'];
            }

            if (
                ($proceso == 'Reparaciones' && $accion == 'Cambio Equipo') ||
                ($proceso == 'Instalaciones' && $accion == 'Aprovisionar') ||
                ($proceso == 'Instalaciones' && $accion == 'Contingencia') ||
                ($proceso == 'Reparaciones' && $accion == 'Aprovisionar') ||
                ($proceso == 'Reparaciones' && $accion == 'Contingencia')
            ) {
                $patron        = [",", ", "];
                $patronreplace = ["|", "|"];
                $macEntra      = str_replace($patron, $patronreplace, trim(strtoupper($crearpedido['macEntra'])));
                $macSale       = str_replace($patron, $patronreplace, trim(strtoupper($crearpedido['macSale'])));

                $stmt = $this->_DB->prepare("INSERT INTO cambio_equipos (pedido, hfc_equipo_sale, hfc_equipo_entra)
                                                    VALUES (:pedido, :macSale, :macEntra)");
                $stmt->execute([
                    ':pedido'   => $pedido,
                    ':macSale'  => $macSale,
                    ':macEntra' => $macEntra,
                ]);
                if (!$stmt->rowCount()) {
                    $response = ['state' => 0, 'msj' => 'Ah ocurrido un error intentalo de nuevo'];
                }
            }

            if ($proceso == 'Reparaciones') {
echo 1;exit();
                $stmt = $this->_DB->prepare("INSERT INTO registros (pedido, id_tecnico, empresa, asesor, observaciones,
                       accion, tipo_pendiente, proceso, producto, duracion, llamada_id,plantilla prueba_integrada, codigo_familiar,
                       smartplay, toip, inter, iptv, telev, totdm, despacho, id_cambio_equipo, pruebaSmnet,
                       UNESourceSystem, pendiente, diagnostico)
                        VALUES (:pedido, :tecnico, :nombre_de_la_empresa,
                                upper(:user), :observaciones, :accion, :subaccion, :proceso, :producto,
                                :duracion_llamada, :id_llamada,:plantilla, :prueba_integra, :cod_familiar, :smartPlay, :toip, :internet,
                                :iptv, :telev_hfc, :telefonia_tdm, :despacho, :idcambioequipo, :pruebaSMNET,
                                :UNESourceSystem, :codigo, :diagnostico)");

                $stmt->execute([
                    ':pedido'               => $pedido,
                    ':tecnico'              => $tecnico,
                    ':nombre_de_la_empresa' => $nombre_de_la_empresa,
                    ':user'                 => $user,
                    ':observaciones'        => $observaciones,
                    ':accion'               => $accion,
                    ':subaccion'            => $subaccion,
                    ':proceso'              => $proceso,
                    ':producto'             => $producto,
                    ':duracion_llamada'     => $duracion_llamada,
                    ':id_llamada'           => $id_llamada,
                    ':prueba_integra'       => $prueba_integra,
                    ':cod_familiar'         => $cod_familiar,
                    ':smartPlay'            => $smartPlay,
                    ':toip'                 => $toip,
                    ':internet'             => $internet,
                    ':iptv'                 => $iptv,
                    ':telev_hfc'            => $telev_hfc,
                    ':telefonia_tdm'        => $telefonia_tdm,
                    ':plantilla'            => $plantilla,
                    ':despacho'             => $despacho,
                    ':idcambioequipo'       => $idcambioequipo,
                    ':pruebaSMNET'          => $pruebaSMNET,
                    ':UNESourceSystem'      => $UNESourceSystem,
                    ':codigo'               => $codigo,
                    ':diagnostico'          => $diagnostico,
                ]);
                if ($stmt->rowCount() == 1) {
                    $response = ['state' => 1, 'msj' => 'Registro ingresado'];
                } else {
                    $response = ['state' => 0, 'msj' => 'Ah ocurrido un error intentalo de nuevo'];
                }
            } else {
                echo 2;exit();
                $stmt = $this->_DB->prepare("INSERT INTO registros (pedido, id_tecnico, empresa, asesor, observaciones, accion, tipo_pendiente, proceso, producto,
                       duracion, llamada_id, plantilla, despacho, pruebaSmnet,
                       UNESourceSystem, pendiente, diagnostico)
                        VALUES (:pedido, :tecnico, :nombre_de_la_empresa, upper(:user), :observaciones, :accion, :subaccion, :proceso, :producto,
                                :duracion_llamada, :id_llamada, :plantilla, :despacho, :pruebaSMNET,
                                :UNESourceSystem, :codigo, :diagnostico)");

                $stmt->execute([
                    ':pedido'               => $pedido,
                    ':tecnico'              => $tecnico,
                    ':nombre_de_la_empresa' => $nombre_de_la_empresa,
                    ':user'                 => $user,
                    ':observaciones'        => $observaciones,
                    ':accion'               => $accion,
                    ':subaccion'            => $subaccion,
                    ':proceso'              => $proceso,
                    ':producto'             => $producto,
                    ':duracion_llamada'     => $duracion_llamada,
                    ':id_llamada'           => $id_llamada,
                    ':plantilla'            => $plantilla,
                    ':despacho'             => $despacho,
                    ':pruebaSMNET'          => $pruebaSMNET,
                    ':UNESourceSystem'      => $UNESourceSystem,
                    ':codigo'               => $codigo,
                    ':diagnostico'          => $diagnostico,
                ]);

                if ($stmt->rowCount() == 1) {
                    $response = ['state' => 1, 'msj' => 'Registro ingresado'];
                } else {
                    $response = ['state' => 0, 'msj' => 'Ah ocurrido un error intentalo de nuevo'];
                }
            }

        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_DB = null;
        echo json_encode($response);
    }*/

    public function ingresarPedidoAsesor($params)
    {
        try {
            /*echo '<pre>';
            var_dump($params);
            echo '<pre>';
            exit();*/
            /*ini_set('session.gc_maxlifetime', 3600); // 1 hour
            session_set_cookie_params(3600);
            session_start();
            if (!$_SESSION) {
                $response = ['state' => 99, 'title' => 'Su session ha caducado', 'text' => 'Inicia session nuevamente para continuar'];
            } else {*/
            $idcambioequipo = $params['idcambioequipo'];
            $duracion_llamada = $params['duracion_llamada'];
            $crearpedido = $params['datospedido'];

            //taskType
            //Area
            $plantilla = (isset($params['plantilla'])) ? $params['plantilla'] : '';

            $datosClick = (isset($params['datosClick'])) ? $params['datosClick'] : '';
            $user = $datosClick['login'];
            $id_llamada = (isset($crearpedido['id_llamada'])) ? $crearpedido['id_llamada'] : '';
            $proceso = (isset($crearpedido['proceso'])) ? $crearpedido['proceso'] : '';
            $accion = (isset($crearpedido['accion'])) ? $crearpedido['accion'] : '';
            $subaccion = (isset($crearpedido['subAccion'])) ? $crearpedido['subAccion'] : '';
            $observaciones = (isset($crearpedido['observaciones'])) ? $crearpedido['observaciones'] : '';
            $cod_familiar = (isset($crearpedido['cod_familiar'])) ? $crearpedido['cod_familiar'] : '';
            $prueba_integra = (isset($crearpedido['prueba_integra'])) ? $crearpedido['prueba_integra'] : '';
            $telefonia_tdm = (isset($crearpedido['telefonia_tdm'])) ? $crearpedido['telefonia_tdm'] : '';
            $telev_hfc = (isset($crearpedido['telev_hfc'])) ? $crearpedido['telev_hfc'] : '';
            $iptv = (isset($crearpedido['iptv'])) ? $crearpedido['iptv'] : '';
            $internet = (isset($crearpedido['internet'])) ? $crearpedido['internet'] : '';
            $toip = (isset($crearpedido['toip'])) ? $crearpedido['toip'] : '';
            $smartPlay = (isset($crearpedido['smartPlay'])) ? $crearpedido['smartPlay'] : '';
            $observaciones = (isset($crearpedido['observaciones'])) ? $crearpedido['observaciones'] : '';
            $observaciones = str_replace("\n", "/", $observaciones);
            $observaciones = str_replace("'", " ", $observaciones);
            $pruebaSMNET = (isset($crearpedido['pruebaSMNET'])) ? $crearpedido['pruebaSMNET'] : '';
            //$UNESourceSystem = (isset($crearpedido['UNESourceSystem'])) ? $crearpedido['UNESourceSystem'] : '';
            $UNESourceSystem = $plantilla['sistema'];
            $area = $plantilla['Area'];
            $taskType = $plantilla['taskType'];
            $codigo = (isset($crearpedido['pendiente'])) ? $crearpedido['pendiente'] : '';
            $tipointeraccion = (isset($crearpedido['interaccion'])) ? $crearpedido['interaccion'] : '';
            $diagnostico = (isset($crearpedido['diagnostico'])) ? $crearpedido['diagnostico'] : '';

            $clienteContestaLlamada = (isset($crearpedido['clienteContestaLlamada'])) ? $crearpedido['clienteContestaLlamada'] : '';
            $razonNoInstalacion = (isset($crearpedido['razonNoInstalacion'])) ? $crearpedido['razonNoInstalacion'] : '';
            $tecnicoVivienda = (isset($crearpedido['tecnicoVivienda'])) ? $crearpedido['tecnicoVivienda'] : '';
            $conocimientoAgenda = (isset($crearpedido['conocimientoAgenda'])) ? $crearpedido['conocimientoAgenda'] : '';

            if ($clienteContestaLlamada != '') {
                $observaciones = '¿Técnico esta en la vivienda?: ' . $tecnicoVivienda . '||¿Tenia conocimiento de la agenda?: ' . $conocimientoAgenda . '||¿cliente contesta la llamada?: ' . $clienteContestaLlamada . '||¿Nos podría indicar por que no se puede instalar los servicios?: ' . $razonNoInstalacion . '||' . $observaciones;
            }

            if ($tipointeraccion != 'llamada') {
                $id_llamada = '';
            }

            if ($datosClick['pEDIDO_UNE'] == "" || $datosClick['pEDIDO_UNE'] == "TIMEOUT") {

                $tecnico = $crearpedido['tecnico'];
                $despacho = $crearpedido['CIUDAD'];
                $producto = $crearpedido['producto'];
                $pedido = $params['pedido'];
                $nombre_de_la_empresa = $params['empresa'];
            } else {
                if ($datosClick['uNEProvisioner'] == "EMT") {
                    $nombre_de_la_empresa = "EMTELCO";
                } elseif ($datosClick['uNEProvisioner'] == "RYE") {
                    $nombre_de_la_empresa = "REDES Y EDIFICACIONES";
                } elseif ($datosClick['uNEProvisioner'] == "EIA") {
                    $nombre_de_la_empresa = "ENERGIA INTEGRAL ANDINA";
                } else {
                    $nombre_de_la_empresa = $datosClick['uNEProvisioner'];
                }
                $producto = $datosClick['uNETecnologias'];
                $tecnico = $datosClick['engineerID'];
                $despacho = $datosClick['uNEMunicipio'];
                $pedido = $datosClick['pEDIDO_UNE'];
            }

            if (
                ($proceso == 'Reparaciones' && $accion == 'Cambio Equipo') ||
                ($proceso == 'Instalaciones' && $accion == 'Aprovisionar') ||
                ($proceso == 'Instalaciones' && $accion == 'Contingencia') ||
                ($proceso == 'Reparaciones' && $accion == 'Aprovisionar') ||
                ($proceso == 'Reparaciones' && $accion == 'Contingencia')
            ) {
                $patron = [",", ", "];
                $patronreplace = ["|", "|"];
                $macEntra = str_replace($patron, $patronreplace, trim(strtoupper($crearpedido['macEntra'])));
                $macSale = str_replace($patron, $patronreplace, trim(strtoupper($crearpedido['macSale'])));

                $stmt = $this->_DB->prepare("INSERT INTO cambio_equipos (pedido, hfc_equipo_sale, hfc_equipo_entra)
                                                    VALUES (:pedido, :macSale, :macEntra)");
                $stmt->execute([
                    ':pedido' => $pedido,
                    ':macSale' => $macSale,
                    ':macEntra' => $macEntra,
                ]);
                if (!$stmt->rowCount()) {
                    $response = ['state' => 0, 'msj' => 'Ah ocurrido un error intentalo de nuevo'];
                }
            }

            //echo $UNESourceSystem;exit();

            if ($proceso == 'Reparaciones') {

                $stmt = $this->_DB->prepare("INSERT INTO registros (pedido, id_tecnico, empresa, asesor, observaciones,
                       accion, tipo_pendiente, proceso, producto, duracion, llamada_id, prueba_integrada, codigo_familiar,
                       smartplay, toip, inter, iptv, telev, totdm, despacho, id_cambio_equipo, pruebaSmnet,
                       UNESourceSystem, pendiente, diagnostico, area, task_type)
                        VALUES (:pedido, :tecnico, :nombre_de_la_empresa,
                                upper(:user), :observaciones, :accion, :subaccion, :proceso, :producto,
                                :duracion_llamada, :id_llamada, :prueba_integra, :cod_familiar, :smartPlay, :toip, :internet,
                                :iptv, :telev_hfc, :telefonia_tdm, :despacho, :idcambioequipo, :pruebaSMNET,
                                :UNESourceSystem, :codigo, :diagnostico, :area, :task_type)");

                $stmt->execute([
                    ':pedido' => $pedido,
                    ':tecnico' => $tecnico,
                    ':nombre_de_la_empresa' => $nombre_de_la_empresa,
                    ':user' => $user,
                    ':observaciones' => $observaciones,
                    ':accion' => $accion,
                    ':subaccion' => $subaccion,
                    ':proceso' => $proceso,
                    ':producto' => $producto,
                    ':duracion_llamada' => $duracion_llamada,
                    ':id_llamada' => $id_llamada,
                    ':prueba_integra' => $prueba_integra,
                    ':cod_familiar' => $cod_familiar,
                    ':smartPlay' => $smartPlay,
                    ':toip' => $toip,
                    ':internet' => $internet,
                    ':iptv' => $iptv,
                    ':telev_hfc' => $telev_hfc,
                    ':telefonia_tdm' => $telefonia_tdm,
                    //':plantilla' => $plantilla,
                    ':despacho' => $despacho,
                    ':idcambioequipo' => $idcambioequipo,
                    ':pruebaSMNET' => $pruebaSMNET,
                    ':UNESourceSystem' => $UNESourceSystem,
                    ':codigo' => $codigo,
                    ':diagnostico' => $diagnostico,
                    ':area' => $area,
                    ':task_type' => $taskType,
                ]);
                if ($stmt->rowCount() == 1) {
                    $response = ['state' => 1, 'msj' => 'Registro ingresado'];
                } else {
                    $response = ['state' => 0, 'msj' => 'Ah ocurrido un error intentalo de nuevo'];
                }
            } else {

                $stmt = $this->_DB->prepare("INSERT INTO registros (pedido, id_tecnico, empresa, asesor, observaciones, accion, tipo_pendiente, proceso, producto,
                       duracion, llamada_id, despacho, pruebaSmnet,
                       UNESourceSystem, pendiente, diagnostico, area, task_type)
                        VALUES (:pedido, :tecnico, :nombre_de_la_empresa, upper(:user), :observaciones, :accion, :subaccion, :proceso, :producto,
                                :duracion_llamada, :id_llamada, :despacho, :pruebaSMNET,
                                :UNESourceSystem, :codigo, :diagnostico, :area, :task_type)");

                $stmt->execute([
                    ':pedido' => $pedido,
                    ':tecnico' => $tecnico,
                    ':nombre_de_la_empresa' => $nombre_de_la_empresa,
                    ':user' => $user,
                    ':observaciones' => $observaciones,
                    ':accion' => $accion,
                    ':subaccion' => $subaccion,
                    ':proceso' => $proceso,
                    ':producto' => $producto,
                    ':duracion_llamada' => $duracion_llamada,
                    ':id_llamada' => $id_llamada,
                    //':plantilla' => $plantilla,
                    ':despacho' => $despacho,
                    ':pruebaSMNET' => $pruebaSMNET,
                    ':UNESourceSystem' => $UNESourceSystem,
                    ':codigo' => $codigo,
                    ':diagnostico' => $diagnostico,
                    ':area' => $area,
                    ':task_type' => $taskType,
                ]);

                if ($stmt->rowCount() == 1) {
                    $response = ['state' => 1, 'msj' => 'Registro ingresado'];
                } else {
                    $response = ['state' => 0, 'msj' => 'Ah ocurrido un error intentalo de nuevo'];
                }
                /* }*/
            }
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_DB = null;
        echo json_encode($response);
    }

    public function creaUsuario($data)
    {
        try {

            $identificacion = $data['identificacion'];
            $nombre = $data['nombre'];
            $loginUser = $data['login'];
            $perfil = $data['perfil'];
            $password = $data['password'];
            $usuario_crea = $data['usuario_crea'];
            $correo = $data['correo'];

            $stmt = $this->_DB->prepare("SELECT * FROM usuarios where identificacion = :identificacion ");
            $stmt->execute([':identificacion' => $identificacion]);

            if ($stmt->rowCount() == 1) {
                $response = ['state' => false, 'msj' => 'El documento de identidad ingresado ya se encuentra registrado'];
            } else {
                $stmt = $this->_DB->prepare("insert into usuarios (login, nombre, password, identificacion, perfil, fecha_crea, usuario_crea, correo)
                                                values (:loginUser, :nombre, :password, :identificacion, :perfil, :fecha_crea, :usuario_crea, :correo)");
                $stmt->execute([
                    ':loginUser' => $loginUser,
                    ':nombre' => $nombre,
                    ':password' => $password,
                    ':identificacion' => $identificacion,
                    ':perfil' => $perfil,
                    ':fecha_crea' => date('Y-m-d H:i:s'),
                    ':usuario_crea' => $usuario_crea,
                    ':correo' => $correo,
                ]);

                if ($stmt->rowCount() == 1) {
                    $response = ['state' => true, 'msj' => 'Usuario creado'];
                } else {
                    $response = ['state' => false, 'msj' => 'Ah ocurrido un error intentalo nuevamente'];
                }
            }


        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_DB = null;
        echo json_encode($response);
    }

    public function creaTecnico($data)
    {
        try {

            ini_set('session.gc_maxlifetime', 3600); // 1 hour
            session_set_cookie_params(3600);
            session_start();

            if (!$_SESSION) {
                $response = ['state' => 99, 'title' => 'Su session ha caducado', 'text' => 'Inicia session nuevamente para continuar'];
            } else {
                $datos = $data['datosCrearTecnico'];
                if (!preg_match("/^[a-zA-Z áéíóúAÉÍÓÚÑñ]+$/", $datos['NOMBRE'])) {
                    $response = ['state' => 0, 'msj' => 'El nombre no es valido'];
                } elseif (!is_numeric($datos['CELULAR'])) {
                    $response = ['state' => 0, 'msj' => 'El número movil no es valido'];
                } elseif ($datos['CELULAR'][0] != 3) {
                    $response = ['state' => 0, 'msj' => 'El número movil debe iniciar por 3'];
                } elseif (strlen($datos['CELULAR']) != 10) {
                    $response = ['state' => 0, 'msj' => 'El número movil debe tener 10 digitos'];
                } elseif ($datos['IDENTIFICACION'][0] == '0' || $datos['IDENTIFICACION'][0] == 0) {
                    $response = ['state' => 0, 'msj' => 'El número de identificación no puede empezar por 0'];
                } elseif (strlen($datos['IDENTIFICACION']) < 5) {
                    $response = ['state' => 0, 'msj' => 'El número de identificación es muy corto'];
                } elseif (strlen($datos['IDENTIFICACION']) > 15) {
                    $response = ['state' => 0, 'msj' => 'El número de identificación es muy largo'];
                } elseif (!isset($datos['REGION']) || $datos['REGION'] == '') {
                    $response = ['state' => 0, 'msj' => 'Seleccione la region'];
                } elseif (!isset($datos['CIUDAD']) || $datos['CIUDAD'] == '') {
                    $response = ['state' => 0, 'msj' => 'Seleccione la ciudad'];
                } elseif (!isset($datos['LOGIN']) || $datos['LOGIN'] == '') {
                    $response = ['state' => 0, 'msj' => 'Ingrese el login'];
                } elseif (!isset($datos['NOMBRE']) || $datos['NOMBRE'] == '') {
                    $response = ['state' => 0, 'msj' => 'Ingrese el nombre'];
                } else {

                    $UDC = substr($datos['IDENTIFICACION'], -4);
                    $pass = 'Colombia' . $UDC . '--++';
                    $pass = md5($pass);
                    $contrato = match ($datos['empresa']) {
                        "1" => 'UNE',
                        "0" => 'SIN EMPRESA',
                        "3" => 'REDES Y EDIFICACIONES',
                        "4" => 'ENERGIA INTEGRAL ANDINA',
                        "6" => 'EAGLE',
                        "7" => 'SERVTEK',
                        "8" => 'FURTELCOM',
                        "9" => 'EMTELCO',
                        "10" => 'CONAVANCES',
                        "11" => 'TECHCOM'
                    };


                    $stmt = $this->_DB->prepare("INSERT INTO tecnicos (identificacion, nombre, ciudad, celular, empresa,login_click,password,region,contrato)
                                            values (:identificacion, :nombre, :ciudad, :celular, :empresa,:login_click,:pass,:region,:contrato)");

                    $stmt->execute([
                        ':identificacion' => $datos['IDENTIFICACION'],
                        ':nombre' => $datos['NOMBRE'],
                        ':ciudad' => $datos['CIUDAD'],
                        ':celular' => $datos['CELULAR'],
                        ':empresa' => $datos['empresa'],
                        ':login_click' => $datos['LOGIN'],
                        ':pass' => $pass,
                        ':region' => $datos['REGION'],
                        ':contrato' => $contrato,
                    ]);

                    if ($stmt->rowCount() == 1) {
                        $response = ['state' => 1, 'msj' => 'Técnico creado'];
                    } else {
                        $response = ['state' => 0, 'msj' => 'Ha ocurrido un error intentalo nuevamente'];
                    }
                }
            }
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_DB = null;
        echo json_encode($response);
    }

    public function listadoUsuarios($data)
    {

        try {
            /*ini_set('session.gc_maxlifetime', 3600); // 1 hour
            session_set_cookie_params(3600);
            session_start();
            if (!$_SESSION) {
                $response = ['state' => 99, 'title' => 'Su session ha caducado', 'text' => 'Inicia session nuevamente para continuar'];
            } else {*/

            if (!$data['page']) {
                $offset = 0;
                $pagesize = 1;
            } else {
                $pagenum = $data['page'];
                $pagesize = $data['size'];
                $offset = ($pagenum - 1) * $pagesize;
                $search = $data['search'];
            }

            $parametro = '';
            if ($data['concepto'] == 'identificacion') {
                $usuario = $data['usuario'];
                $parametro = " and a.identificacion = '$usuario' ";
            } elseif ($data['concepto'] == 'login') {
                $usuario = $data['usuario'];
                $parametro = " and a.login = '$usuario' ";
            }

            $stmt = $this->_DB->prepare("SELECT * FROM usuarios a where 1=1 $parametro");
            $stmt->execute();
            $counter = $stmt->rowCount();

            $stmt = $this->_DB->query("SELECT a.id AS ID,
                                                       a.nombre AS NOMBRE,
                                                       a.identificacion AS IDENTIFICACION,
                                                       a.login AS LOGIN,
                                                       a.perfil,
                                                       a.estado,
                                                       (select b.nombre from perfiles b where b.perfil = a.perfil) as PERFIL,
                                                       a.password AS PASSWORD,
                                                       a.correo
                                                FROM usuarios a
                                                where 1 = 1
                                                    $parametro LIMIT $offset, $pagesize");

            if ($stmt->rowCount()) {
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
                $response = ['state' => true, 'data' => $result, 'counter' => $counter];
            } else {
                $response = ['state' => false, 'msj' => 'No se encontraron registros'];
            }
            /*}*/
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }

        $this->_DB = null;
        echo json_encode($response);
    }

    public function borrarUsuario($data)
    {
        $cc = $data['identificacion'];
        try {
            $stmt = $this->_DB->prepare("UPDATE usuarios SET estado = 'Inactivo' WHERE identificacion = :id");
            $stmt->execute([':id' => $cc]);

            if ($stmt->rowCount() == 1) {
                $response = ['state' => true, 'msj' => 'Usuario eliminado correctamente'];
            } else {
                $response = ['state' => false, 'msj' => 'Ha ocurrido un error interno intentalo nuevamente en unos minutos'];
            }
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }

        $this->_DB = null;
        echo json_encode($response);
    }

    public function borrarTecnico($data)
    {
        try {
            /*ini_set('session.gc_maxlifetime', 3600); // 1 hour
            session_set_cookie_params(3600);
            session_start();*/
            $stmt = $this->_DB->prepare("DELETE FROM  tecnicos WHERE id = :id");
            $stmt->execute([':id' => $data]);

            if ($stmt->rowCount()) {
                $response = ['type' => 'success', 'msg' => 'Técnico eliminado'];
            } else {
                $response = ['type' => 'error', 'msg' => 'Ah ocurrido un error intentalo nuevamente'];
            }
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_DB = null;
        echo json_encode($response);
    }

    public function editarTecnico($login)
    {
        try {
            /*ini_set('session.gc_maxlifetime', 3600); // 1 hour
            session_set_cookie_params(3600);
            session_start();*/
            $identificacion = $login['IDENTIFICACION'];
            $nombre = $login['NOMBRE'];
            $ciudad = $login['CIUDAD'];
            $celular = $login['CELULAR'];
            $empresa = $login['empresa'];
            $id = $login['ID'];

            $stmt = $this->_DB->prepare("update tecnicos
                                                set nombre         = :nombre,
                                                    identificacion = :identificacion,
                                                    ciudad         = :ciudad,
                                                    celular        = :celular,
                                                    empresa        = :empresa
                                                where id = :id");
            $stmt->execute([
                ':nombre' => $nombre,
                ':identificacion' => $identificacion,
                ':ciudad' => $ciudad,
                ':celular' => $celular,
                ':empresa' => $empresa,
                ':id' => $id,
            ]);

            if ($stmt->rowCount() == 1) {
                $response = ['type' => 'success', 'msg' => 'Usuario actualizado'];
            } else {
                $response = ['type' => 'error', 'msg' => 'Ah ocurrido un error intentalo nuevamente'];
            }
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
        $this->_DB = null;
        echo json_encode($response);
    }

    public function acualizaTecnicos($data)
    {
        try {

            $datos = $data;
            $total = count($data);
            $count = 0;

            for ($i = 0; $i < $total; $i++) {

                $UDC = substr($datos[$i]['ID'], -4);
                $pass = 'Colombia' . $UDC . '--++';
                $passM = md5($pass);

                switch (strtoupper($datos[$i]['contrato'])) {
                    case "ENERGIA INTEGRAL ANDINA";
                        $empresa = 4;
                        break;
                    case "UNE";
                        $empresa = 1;
                        break;
                    case "SIN EMPRESA";
                        $empresa = 0;
                        break;
                    case "REDES Y EDIFICACIONES";
                        $empresa = 3;
                        break;
                    case "EAGLE";
                        $empresa = 6;
                        break;
                    case "SERVTEK";
                        $empresa = 7;
                        break;
                    case "FURTELCOM";
                        $empresa = 8;
                        break;
                    case "EMTELCO";
                        $empresa = 9;
                        break;
                    case "CONAVANCES";
                        $empresa = 10;
                        break;
                    case "TECHCOM";
                        $empresa = 11;
                        break;
                }

                $stmt = $this->_DB->prepare("SELECT password FROM cuentasTecnicos where cedula = :identificacion");
                $stmt->execute([':identificacion' => $datos[$i]['ID']]);
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

                $ver = $this->_DB->prepare("SELECT * FROM tecnicos where identificacion = :identificacion");
                $ver->execute([':identificacion' => $datos[$i]['ID']]);
                $actualiza = $ver->rowCount();
                if (!$actualiza) {

                    $stmt = $this->_DB->prepare("INSERT INTO tecnicos (identificacion, nombre, ciudad, celular, empresa,login_click,password,region,contrato,password_click,pass_apk)
                                            values (:identificacion, :nombre, :ciudad, :celular, :empresa,:login_click,:pass,:region,:contrato,:password_click,:pass_apk)");
                    $stmt->execute(
                        [
                            ':identificacion' => $datos[$i]['ID'],
                            ':nombre' => $datos[$i]['nombre'],
                            ':ciudad' => $datos[$i]['ciudad'],
                            ':celular' => $datos[$i]['MobilePhone'],
                            ':empresa' => $empresa,
                            ':login_click' => $datos[$i]['login'],
                            ':pass' => $passM,
                            ':region' => $datos[$i]['region'],
                            ':contrato' => $datos[$i]['contrato'],
                            ':password_click' => $result[0]['password'] ?? 0,
                            ':pass_apk' => $pass,
                        ]
                    );

                    if ($stmt->rowCount()) {
                        $count++;
                    }
                }
            }

            if ($count > 0) {
                $response = ['state' => 1, 'msj' => 'Se han actualizado ' . $count . ' registros'];
            } else {
                $response = ['state' => 0, 'msj' => 'no se actualizaron registros los datos están al dia'];
            }

        } catch (PDOException $th) {
            var_dump($th->getMessage());
        }
        $this->_DB = '';
        echo json_encode($response);
    }

    public function recuperaPassword($data)
    {
        try {
            /*$postdata = http_build_query(
                array(
                    'secret' => '6Lc6cF4pAAAAAFW6BBbWYd3Fb8xPb-DcnoBR6p8R',
                    'response' => $data['captcha'],
                    'remoteip' => $_SERVER['REMOTE_ADDR']
                )
            );

            $opts = array('http' =>
                array(
                    'method' => 'POST',
                    'header' => 'Content-type: application/x-www-form-urlencoded',
                    'content' => $postdata
                )
            );

            $context = stream_context_create($opts);
            $response = file_get_contents("https://www.google.com/recaptcha/api/siteverify", false, $context);
            $response = json_decode($response, true);

            if ($response["success"] === false) {
                $response = ['type' => 'error', 'msg' => 'Captcha no valida'];
                return $response;
            }*/

            $stmt = $this->_DB->prepare("SELECT id, cambio_login FROM usuarios where correo = :correo");
            $stmt->execute(array(':correo' => $data['email']));
            if ($stmt->rowCount() === 1) {
                $res = $stmt->fetch(PDO::FETCH_OBJ);
                if ($res->cambio_login === 'si') {
                    $response = ['state' => false, 'msg' => 'Ya tiene una solicitud activa para restablecer su contraseña'];
                } else {
                    if ($stmt->rowCount() == 1) {
                        $datos = ['correo' => $data['email'], 'id' => $res->id];
                        $id = json_encode($datos);
                        $url = "http://10.100.66.254/BB8/contingencias/Buscar/olvidoPass/$id";
                        $ch = curl_init();
                        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
                        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
                        curl_setopt($ch, CURLOPT_URL, "$url");
                        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                        curl_setopt($ch, CURLOPT_HEADER, 0);
                        curl_setopt($ch, CURLOPT_TIMEOUT, 60);
                        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 60);
                        $data = curl_exec($ch);

                        curl_close($ch);
                        $dataclick = json_decode($data, true);

                        $data = (object)$dataclick;

                        if ($data->state) {
                            $stmt1 = $this->_DB->prepare("UPDATE usuarios 
                                                    SET cambio_login = 'si',
                                                    fecha_cambio_login = NOW() 
                                                    WHERE
                                                        id = :id");
                            $stmt1->execute(array(':id' => $res->id));
                            $response = $data;
                        } else {
                            $response = $data;
                        }
                    }
                }
            } else {
                $response = ['state' => false, 'msg' => 'El correo ingresado no se encuentra registrado'];
            }
            $this->_DB = '';
            return $response;
        } catch
        (PDOException $e) {
            var_dump($e->getMessage());
        }
    }

    public function restauraPassword($data)
    {
        try {
            $stmt = $this->_DB->prepare("SELECT cambio_login, fecha_cambio_login FROM usuarios where id = :cc");
            $stmt->execute(array(':cc' => $data['id']));
            if ($stmt->rowCount() === 1) {
                $response = $stmt->fetch(PDO::FETCH_OBJ);

                $fecha1 = new DateTime($response->fecha_cambio_login);
                $fechaActual = new DateTime();
                $diferencia = $fechaActual->diff($fecha1);
                $horasDiferencia = $diferencia->h + ($diferencia->days * 24);

                if ($response->cambio_login !== 'si') {
                    $res = ['state' => false, 'msg' => 'No se encontró una solicitud para cambio de contraseña'];
                } /*elseif ($horasDiferencia > 2) {
                    $res = ['state' => false, 'msg' => 'Solicitud invalida ya pasaron mas de dos horas'];
                }*/ else {
                    $stmt = $this->_DB->prepare("UPDATE usuarios 
                                                    SET cambio_login = 'no',
                                                        password = :pass,
                                                        fecha_cambio_login = NOW() 
                                                    WHERE
                                                        id = :id");
                    $stmt->execute(array(':pass' => $data['login'], ':id' => $data['id']));
                    if ($stmt->rowCount() === 1) {
                        $res = ['state' => true, 'msg' => 'Contraseña actualizada correctamente'];
                    } else {
                        $res = ['state' => false, 'msg' => 'Ha ocurrido un error interno intentalo nuevamente en unos minutos'];
                    }
                }
            } else {
                $res = ['state' => false, 'msg' => 'Solicitud incorrecta no usuario valido'];
            }

            $this->_DB = '';
            return $res;

        } catch (PDOException $e) {
            var_dump($e);
        }
    }

    public function listaPerfil()
    {
        try {
            $stmt = $this->_DB->query("SELECT * FROM perfiles");
            $stmt->execute();
            $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $res;
        }catch (PDOException $e){
            var_dump($e->getMessage());
        }
    }
}
