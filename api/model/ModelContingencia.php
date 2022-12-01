<?php

require_once '../class/conection.php';

class ModelContingencia
{
    private $_DB;

    public function __construct()
    {
        $this->_DB = new Conection();
    }

    public function resultado($fechaIni, $fechaFin)
    {
        try {
            $stmt = $this->_DB->query("SELECT logindepacho, pedido, horagestion, logincontingencia, horacontingencia,
		(CASE 
			WHEN acepta IS NULL THEN 'Pendiente' 
			ELSE acepta 
		END) estado
		FROM contingencias
		WHERE horagestion BETWEEN ('$fechaIni 00:00:00') AND ('$fechaFin 23:59:59')
		AND accion IN ('Cambio de equipo', 'Contingencia', 'Refresh', 'Registros ToIP', 'Reenvio de registros')
		AND pedido <> ''
		ORDER BY horagestion DESC");

            $stmt->execute();
            if ($stmt->rowCount()) {
                $response = $stmt->fetchAll(PDO::FETCH_ASSOC);
            } else {
                $response = 0;
            }

        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }

        return $response;

    }

    public function queryTv($fechaIni, $fechaFin)
    {
        try {
            $stmt = $this->_DB->prepare("SELECT logindepacho, pedido, horagestion, logincontingencia, horacontingencia,
				(CASE
					WHEN acepta IS NULL THEN 'Pendiente'
				ELSE acepta END) estado
			FROM contingencias
			WHERE horagestion BETWEEN ('$fechaIni 00:00:00') AND ('$fechaFin 23:59:59')
			AND producto = 'TV'
			AND accion IN ('Cambio de equipo', 'Contingencia', 'Refresh', 'Registros ToIP', 'Reenvio de registros')
			AND pedido <> ''
			ORDER BY horagestion DESC");

            $stmt->execute();

            if ($stmt->rowCount()) {
                $response = $stmt->fetchAll(PDO::FETCH_ASSOC);
            } else {
                $response = 0;
            }

        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }

        return $response;

    }

    public function resultadoInTo($fechaIni, $fechaFin)
    {
        try {
            $stmt = $this->_DB->prepare("SELECT logindepacho, pedido, horagestion, logincontingencia, horacontingencia,
							(CASE
								WHEN acepta IS NULL THEN 'Pendiente'
							ELSE acepta END) estado
						FROM contingencias
						WHERE horagestion BETWEEN ('$fechaIni 00:00:00') AND ('$fechaFin 23:59:59')
						AND producto IN('ToIP', 'Internet+ToIP', 'Internet')
						AND accion IN ('Cambio de equipo', 'Contingencia', 'Refresh', 'Registros ToIP', 'Reenvio de registros')
						AND pedido <> ''
						ORDER BY horagestion DESC");

            $stmt->execute();
            if ($stmt->rowCount()) {
                $response = $stmt->fetchAll(PDO::FETCH_ASSOC);
            } else {
                $response = 0;
            }

        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }

        return $response;

    }

    public function resultadoCP($fechaIni, $fechaFin)
    {
        try {
            $stmt = $this->_DB->prepare("SELECT logindepacho, pedido, horagestion, loginContingenciaPortafolio, horaContingenciaPortafolio,
							(CASE
								WHEN aceptaPortafolio = 'Acepta' THEN 'Acepta'
								WHEN aceptaPortafolio = 'Rechaza' THEN 'Rechaza'
								WHEN aceptaPortafolio IS NULL THEN 'Pendiente'
							ELSE aceptaPortafolio = 'Acepta' END) estado
						FROM contingencias
						WHERE horagestion BETWEEN ('$fechaIni 00:00:00') AND ('$fechaFin 23:59:59')
						AND accion IN ('Corregir portafolio', 'mesaOffline')
						AND pedido <> ''
						ORDER BY horagestion DESC");

            $stmt->execute();
            if ($stmt->rowCount()) {
                $response = $stmt->fetchAll(PDO::FETCH_ASSOC);
            } else {
                $response = 0;
            }

        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }

        return $response;
    }

    public function querydiario($diaInicial, $diaFinal)
    {
        try {
            $stmt = $this->_DB->prepare("SELECT DATE_FORMAT(horagestion,'%Y-%m-%d') fecha, COUNT(*) total
		FROM contingencias
		WHERE horagestion BETWEEN (:diainicial) AND (:diafinal)
		AND accion IN ('Cambio de equipo', 'Contingencia', 'Refresh', 'Registros ToIP', 'Reenvio de registros')
		AND pedido <> ''
		GROUP BY fecha
		ORDER BY fecha DESC");

            $stmt->execute([':diainicial'=>"$diaInicial 00:00:00",':diafinal'=>"$diaFinal 00:00:00"]);
            $stmt->execute();
            if ($stmt->rowCount()) {
                $response = $stmt->fetchAll(PDO::FETCH_ASSOC);
            } else {
                $response = 0;
            }

        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }

        return $response;
    }

    public function resultadodiarioCP($diaInicial, $diaFinal)
    {
        try {
            $stmt = $this->_DB->prepare("SELECT date_format(horagestion,'%Y-%m-%d') fecha, COUNT(*) total
		FROM contingencias
		WHERE horagestion BETWEEN (:diainicial) AND (:diafinal)
		AND accion IN ('Corregir portafolio', 'mesaOffline')
		AND pedido <> ''
		GROUP BY fecha
		ORDER BY fecha DESC");

            $stmt->execute([':diainicial'=>"$diaInicial 00:00:00",':diafinal'=>"$diaFinal 00:00:00"]);
            if ($stmt->rowCount()) {
                $response = $stmt->fetchAll(PDO::FETCH_ASSOC);
            } else {
                $response = 0;
            }

        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }

        return $response;
    }

    public function resultadoestadosMes($diaInicial, $diaFinal)
    {
        try {
            $stmt = $this->_DB->query("SELECT (CASE 
		WHEN acepta IS NULL THEN 'Pendiente' 
		ELSE acepta 
		END) estado, 
		COUNT(*) total,
		(SELECT COUNT(*)
			FROM contingencias C2
			WHERE horagestion BETWEEN ('$diaInicial 00:00:00') AND ('$diaFinal 23:59:59')
			AND C2.accion IN ('Cambio de equipo', 'Contingencia', 'Refresh', 'Registros ToIP', 'Reenvio de registros')
		) totalestados
		FROM contingencias AS C1
		WHERE horagestion BETWEEN ('$diaInicial 00:00:00') AND ('$diaFinal 23:59:59')
		AND pedido <> ''
		AND C1.accion IN ('Cambio de equipo', 'Contingencia', 'Refresh', 'Registros ToIP', 'Reenvio de registros')
		GROUP BY estado
		ORDER BY total DESC");

            $stmt->execute();
            if ($stmt->rowCount()) {
                $response = $stmt->fetchAll(PDO::FETCH_ASSOC);
            } else {
                $response = 0;
            }

        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }

        return $response;
    }

    public function datoscontingencias()
    {
        try {
            $stmt = $this->_DB->query("SELECT c.pedido, c.macEntra, c.macSale, c.logincontingencia, c.paquetes, c.ciudad, c.proceso, c.accion, c.tipoEquipo, c.remite, c.observacion, 
					c.engestion, c.producto, c.grupo, c.horagestion, c.perfil, c.tipificacion, c.acepta, c.loginContingenciaPortafolio, c.aceptaPortafolio, 
					c.tipificacionPortafolio, c.enGestionPortafolio, c.fechaClickMarcaPortafolio, c.id_terreno, CASE WHEN (SELECT COUNT(*)
					FROM contingencias c1
					WHERE c1.pedido=c.pedido AND c1.horagestion >= DATE_SUB(CURDATE(), INTERVAL 10 DAY) AND c1.finalizado = 'OK') > 0 THEN 'TRUE' ELSE 'FALSE' END alerta
				FROM contingencias c
				WHERE c.finalizado IS NULL AND c.finalizadoPortafolio IS NULL AND c.pedido <> ''
				ORDER BY c.horagestion");
            $stmt->execute();

            if ($stmt->rowCount()) {
                $resultadoTV         = [];
                $resultadoOTROS      = [];
                $resultadoPORTAFOLIO = [];
                foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
                    if ($row['grupo'] == "TV") {
                        $resultadoTV[] = $row;
                    } elseif ($row['grupo'] == "INTER") {
                        $resultadoOTROS[] = $row;
                    } elseif ($row['grupo'] == "PORTAFOLIO") {
                        $resultadoOTROS[] = $row;
                    }
                }
                /*while ($row = $stmt->fetchAll(PDO::FETCH_ASSOC)) {

                    $row['pedido']                      = utf8_encode($row['pedido']);
                    $row['macEntra']                    = utf8_encode($row['macEntra']);
                    $row['macSale']                     = utf8_encode($row['macSale']);
                    $row['paquetes']                    = utf8_encode($row['paquetes']);
                    $row['ciudad']                      = utf8_encode($row['ciudad']);
                    $row['proceso']                     = utf8_encode($row['proceso']);
                    $row['accion']                      = utf8_encode($row['accion']);
                    $row['tipoEquipo']                  = utf8_encode($row['tipoEquipo']);
                    $row['remite']                      = utf8_encode($row['remite']);
                    $row['observacion']                 = utf8_encode($row['observacion']);
                    $row['engestion']                   = utf8_encode($row['engestion']);
                    $row['producto']                    = utf8_encode($row['producto']);
                    $row['grupo']                       = utf8_encode($row['grupo']);
                    $row['horagestion']                 = utf8_encode($row['horagestion']);
                    $row['perfil']                      = utf8_encode($row['perfil']);
                    $row['acepta']                      = utf8_encode($row['acepta']);
                    $row['loginContingenciaPortafolio'] = utf8_encode($row['loginContingenciaPortafolio']);
                    $row['aceptaPortafolio']            = utf8_encode($row['aceptaPortafolio']);
                    $row['tipificacionPortafolio']      = utf8_encode($row['tipificacionPortafolio']);
                    $row['enGestionPortafolio']         = utf8_encode($row['enGestionPortafolio']);
                    $row['fechaClickMarcaPortafolio']   = utf8_encode($row['fechaClickMarcaPortafolio']);
                    $row['alerta']                      = utf8_encode($row['alerta']);


                }*/
            }

        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }

        return [$resultadoTV, $resultadoOTROS, $resultadoPORTAFOLIO];
    }

    public function registrosOffline()
    {
        try {
            $stmt = $this->_DB->query("SELECT LOGIN_ASESOR_OFF,LOGIN_ASESOR, PEDIDO,PROCESO, PRODUCTO, ACCION, ACTIVIDAD, ACTIVIDAD2, OBSERVACIONES, FECHA_CARGA FROM registros_offline");
            $stmt->execute();

            if($stmt->rowCount()){
                $counter = $stmt->rowCount();
                $resultado= $stmt->fetchAll(PDO::FETCH_ASSOC);

                $response=[[$resultado,$counter],201];
            }else{
                $response = 0;
            }


        }catch (PDOException $e){
            var_dump($e->getMessage());
        }

        echo json_encode($response);
    }

    public function graficaDepartamento($data)
    {
        try{
            $mesenviado = $data;

            if ($mesenviado == "" || $mesenviado == undefined) {

                $stmt1 = $this->_DB->query("select max(fecha_instalacion) fecha from nps ");

                $stmt1->execute();

                $fecha = date("Y-m-d");

                if ($stmt1->rowCount()) {
                    $fecha=$stmt1->fetchAll(PDO::FETCH_ASSOC);
                }

                $dia  = substr($fecha, 8, 2);
                $mes  = substr($fecha, 5, 2);
                $anio = substr($fecha, 0, 4);

                $nom_mes   = date('M', mktime(0, 0, 0, $mes, $dia, $anio));
                $semana    = "Semana " . date('W', mktime(0, 0, 0, $mes, $dia, $anio));
                $diaSemana = date("w", mktime(0, 0, 0, $mes, $dia, $anio));

            } else {
                $nom_mes   = $mesenviado;
                $semana    = "Semana " . date('W', mktime(0, 0, 0, $mes, $dia, $anio));
                $diaSemana = date("w", mktime(0, 0, 0, $mes, $dia, $anio));

            }

            $stmt = $this->_DB->prepare("select gen.regional, round(((select count(respuesta)  
            from nps where num_respuesta = '5' and num_pregunta = '4' and mes = gen.mes and regional = gen.regional) 
            -(select count(respuesta) 
            from nps where num_respuesta = '1' and num_pregunta = '4' and mes = gen.mes and regional = gen.regional) 
            -(select count(respuesta) 
            from nps where num_respuesta = '2' and num_pregunta = '4' and mes = gen.mes and regional = gen.regional) 
            -(select count(respuesta) 
            from nps where num_respuesta = '3' and num_pregunta = '4' and mes = gen.mes and regional = gen.regional))/ 
            (select count(respuesta) 
            from nps where num_pregunta = '4' and mes = gen.mes and regional = gen.regional)*100,2) as NPS 
            from nps gen  
            where mes = :nomes  
            group by gen.regional order by regional ASC ");

            $stmt->execute([':nomes'=>$nom_mes]);


            if ($stmt->rowCount()) {
                $resulta = $stmt->fetchAll(PDO::FETCH_ASSOC);
                $label = $resulta['regional'];
                $ressi=$resulta['NPS'];
                $departamentos =["label" => "$label", "value" => "$ressi"];

                $response=[$departamentos,201];
            } else {
                $response=0;
            }
        }catch (PDOException $e){
            var_dump($e->getMessage());
        }

        echo json_encode($response);
    }

    public function marcaPortafolio($data)
    {
        try{
            $today = date("Y-m-d H:i:s");
            $datosguardar = $data->datos;
            $login        = $data->login;
            $login        = $login['LOGIN'];
            $pedido       = $datosguardar['pedido'];
            $gestion      = $datosguardar['bloqueo'];
            $producto     = $datosguardar['producto'];

            if ($gestion == true) {
                $gestion = 1;
            } else {
                $gestion = 0;
            }

            $stmt = $this->_DB->prepare("	SELECT id, loginContingenciaPortafolio
						FROM contingencias
						WHERE finalizadoPortafolio is null
						AND enGestionPortafolio = '1'
						AND pedido = :pedido AND producto = :producto
				");

            $stmt->execute([':pedido'=>$pedido,':producto'=>$producto]);


            if ($stmt->rowCount()) {

                $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);

                $logincontingencia=$resultado['loginContingenciaPortafolio'];

                $id=$resultado['id'];
                if ($login == $logincontingencia) {

                    $stmtupdate =$this->_DB->prepare("UPDATE contingencias SET enGestionPortafolio = '0', loginContingenciaPortafolio = '' , fechaClickMarcaPortafolio=:today WHERE id='$id' ") ;
                    $stmtupdate->execute([':today'=>$today]);
                    $response=[['Desbloqueado'],200];
                } else {
                    $response=[[$resultado],200];
                }

            } else {

                $stmt = $this->_DB->prepare("	SELECT id
							FROM contingencias
							WHERE finalizadoPortafolio is null
							AND pedido = :pedido
							AND producto = :producto
							AND accion IN('Corregir portafolio', 'mesaOffline', 'OC Telefonia')
					");

                $stmt->execute([':pedido'=>$pedido,':producto'=>$producto]);



                if ($stmt->rowCount()) {

                    $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
                    $id=$resultado['id'];

                    $stmtupdate = $this->_DB->prepare("UPDATE contingencias SET enGestionPortafolio = :gestion, loginContingenciaPortafolio = :login , fechaClickMarcaPortafolio=:today WHERE id=:id");
                    $stmtupdate->execute([':gestion'=>$gestion,':login'=>$login,':today'=>$today,':id'=>$id]);

                }
            }


        }catch (PDOException $e){
            var_dump($e->getMessage());
        }

        echo json_encode($response);

    }

    public function guardarpedidocontingencia($data)
    {
        try{
            $datosguardar         = $data->datos;
            $login                = $data->login;
            $login                = $login['LOGIN'];
            $pedido               = (isset($datosguardar['pedido'])) ? $datosguardar['pedido'] : '';
            $producto             = (isset($datosguardar['producto'])) ? $datosguardar['producto'] : '';
            $observacionesconting = (isset($datosguardar['observacionescontingencia'])) ? utf8_decode($datosguardar['observacionescontingencia']) : '';
            $ingresoClick         = (isset($datosguardar['ingresoClick'])) ? $datosguardar['ingresoClick'] : '';
            $tipificacion         = (isset($datosguardar['tipificacion'])) ? utf8_decode($datosguardar['tipificacion']) : '';
            $generarCr            = (isset($datosguardar['generarcr'])) ? $datosguardar['generarcr'] : '';
            $horacontingencia     = date("Y-m-d H:i:s");

            if ($tipificacion == 'Ok') {
                $acepta = 'Acepta';
            } else {
                $acepta = 'Rechaza';
            }

            $stmt = $this->_DB->prepare ("SELECT id
					FROM contingencias
					WHERE pedido = :pedido
					AND producto= :producto
					AND finalizado IS NULL
					AND accion IN('Contingencia', 'Reenvio de registros', 'Refresh', 'Cambio de equipo', 'Crear Espacio', 'crear cliente', 'Registros ToIP', 'mesaOffline', 'Cambio EID', 'Crear Linea IMS')
				");

            $stmt->execute([':pedido'=>$pedido,':producto'=>$producto]);


            if ($stmt->rowCount()) {

                $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
                $id=$resultado['id'];

                /*ESTE QUERY ME ACTULIZA LA INFORMACION QUE ANALISTA A GESTIONADO*/
                $stmtupdate = $this->_DB->prepare("UPDATE contingencias SET horacontingencia = :horacontingencia, 
                    observContingencia = :observacionesconting, 
                    ingresoEquipos = :ingresoClick, tipificacion=:tipificacion, 
                    acepta = :acepta, generarcr = :generarCr, finalizado = 'OK' 
                     WHERE id='$id'");

                $stmt->execute([':horacontingencia'=>$horacontingencia,':observacionesconting'=>$observacionesconting,':ingresoClick'=>$ingresoClick,':tipificacion'=>$tipificacion,':acepta'=>$acepta,':generarCr'=>$generarCr,':id'=>$id]);

                $response=['',200];
            }
        }catch (PDOException $e){ var_dump($e->getMessage());}

        echo json_encode($response);
    }

    public function guardarescalamiento($data)
    {
        try{
            $datosguardar              = $data->datos;
            $login                     = $data->login;
            $login                     = $login['LOGIN'];
            $pedido                    = $datosguardar['pedido'];
            $producto                  = $datosguardar['producto'];
            $observacionesescalamiento = utf8_decode($datosguardar['observacionesescalamiento']);
            $tipificacion              = utf8_decode($datosguardar['tipificacion']);
            $horaescalamiento          = date("Y-m-d H:i:s");

            $stmt=$this->_DB->prepare("SELECT id
					FROM escalamiento_infraestructura
					WHERE pedido = :pedido
					AND producto= :producto
				");
            $stmt->execute([':pedido'=>$pedido,':producto'=>$producto]);

            if ($stmt->rowCount()) {
                $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
                $id=$resultado['id'];

                /*ESTE QUERY ME ACTULIZA LA INFORMACION QUE ANALISTA A GESTIONADO*/

                if ($tipificacion == "Escalamiento ok nivel 2 Prioridad") {
                    $sqlupdate =$this->_DB-> prepare("UPDATE escalamiento_infraestructura SET fecha_respuesta = :horaescalamiento, 
                    login_gestion = '', 
                    tipificacion=:tipificacion, 
                    engestion='0', 
                    estado = '1' 
                     WHERE id= :id ");

                    $sqlupdate->execute([':horaescalamiento'=>$horaescalamiento,':tipificacion'=>$tipificacion,':id'=>$id]);
                } else {
                    if ($tipificacion == "Agendado" || $tipificacion == "No tecnicos disponibles" || $tipificacion == "ANS de mas de 20 horas" || $tipificacion == "No agendado") {
                        $sqlupdate = "UPDATE escalamiento_infraestructura SET fecha_respuesta = :horaescalamiento, 
                        observacion_respuesta = :obversacionesEscalamiento, 
                        tipificacion=:tipificacion, 
                        estado = '2' 
                         WHERE id=:id ";
                        $sqlupdate->execute([':horaescalamiento'=>$horaescalamiento,':obversacionesEscalamiento'=>$observacionesescalamiento,':tipificacion'=>$tipificacion,':id'=>$id]);
                    } else {
                        $sqlupdate = "UPDATE escalamiento_infraestructura SET fecha_respuesta = :horaescalamiento, 
                        observacion_respuesta = :obversacionesEscalamiento, 
                        tipificacion=:tipificacion, 
                        estado = '1' 
                        WHERE id=:id ";
                        $sqlupdate->execute([':horaescalamiento'=>$horaescalamiento,':obversacionesEscalamiento'=>$observacionesescalamiento,':tipificacion'=>$tipificacion,':id'=>$id]);
                    }
                }
                $response =[$id,200];
            }
        }catch (PDOException $e){
            var_dump($e->getMessage());
        }
        echo json_encode($response);

    }

    public function cerrarMasivamenteContingencias($data)
    {
        try{
            $datosCierreMasivo = $data->data;

            $today         = date("Y-m-d H:i:s");
            $tv            = $datosCierreMasivo['TV'];
            $internet      = $datosCierreMasivo['Internet'];
            $toip          = $datosCierreMasivo['ToIP'];
            $internettoip  = $datosCierreMasivo['InternetToIP'];
            $instalaciones = $datosCierreMasivo['Instalaciones'];
            $reparaciones  = $datosCierreMasivo['Reparaciones'];
            $aproequipo    = $datosCierreMasivo['AprovisionarContin'];
            $refresh       = $datosCierreMasivo['Refresh'];
            $cambioequipo  = $datosCierreMasivo['CambioEquipo'];
            $cambioeid     = $datosCierreMasivo["CambioEID"];
            $registrostoip = $datosCierreMasivo['RegistrosToIP'];
            $observaciones = $datosCierreMasivo['observaciones'];


            $sqlNroRegistrosEliminar = $this->_DB->prepare("SELECT COUNT(id) AS Cantidad FROM contingencias WHERE acepta IS NULL AND logincontingencia IS NULL AND producto IN (:tv,:internet,:toip,:internettoip) AND proceso IN (:instalaciones,:reparaciones ) AND accion IN (:aproequipo,:refresh,:cambioequipo,:cambioeid,:registrostoip)");
            $sqlNroRegistrosEliminar->execute([':tv'=>$tv,':internet'=>$internet,':toip'=>$toip,':internettoip'=>$internettoip,':instalaciones'=>$instalaciones,':reparaciones'=>$reparaciones,':aproequipo'=>$aproequipo,':refresh'=>$refresh,':cambioequipo'=>$cambioequipo,':cambioeid'=>$cambioeid,':registrostoip'=>$registrostoip]);

            $counter = 0;
            if($sqlNroRegistrosEliminar->rowCount()){
                $counter =$sqlNroRegistrosEliminar->rowCount();
            }


            /*ESTE QUERY CIERRA DE FORMA MASIVA LAS CONTINGENCIAS*/
            $sqlupdate = $this->_DB->prepare("UPDATE contingencias SET logincontingencia='cierremasivo', acepta='Rechaza', tipificacion='Error del sistema', engestion='1', finalizado='OK', fechaClickMarca=:today, horacontingencia = :today, observContingencia=:observaciones WHERE acepta IS NULL AND logincontingencia IS NULL AND producto IN (:tv,:internet,:toip,:internettoip) AND proceso IN (:instalaciones,:reparaciones ) AND accion IN (:aproequipo,:refresh,:cambioequipo,:cambioeid,:registrostoip)");
            $sqlupdate->execute([':today'=>$today,':observaciones'=>$observaciones,':tv'=>$tv,':internet'=>$internet,':toip'=>$toip,':internettoip'=>$internettoip,':instalaciones'=>$instalaciones,':reparaciones'=>$reparaciones,':aproequipo'=>$aproequipo,':refresh'=>$refresh,':cambioequipo'=>$cambioequipo,':cambioeid'=>$cambioeid,':registrostoip'=>$registrostoip]);
            $response=[$counter,200];
        }catch(PDOException $e){
            var_dump($e->getMessage());
        }

        echo json_encode($response);
    }




}
