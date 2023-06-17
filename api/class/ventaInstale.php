<?php
require_once 'conection.php';

class ventaInstale
{

	private $_BD;

	public function __construct()
	{
		$this->_BD = new Conection();
	}

	public function datosVentas()
	{
		ini_set('session.gc_maxlifetime', 3600); // 1 hour
        session_set_cookie_params(3600);
        session_start();
		try {
			$stmt = $this->_BD->query("SELECT * FROM ventasInstaleTiendas where en_gestion != 2");
			$stmt->execute();
			if ($stmt->rowCount()) {
				$response = array('state' => 1, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC));
			} else {
				$response = array('state' => 0, 'data' => 'No se encontraron datos');
			}
		} catch (PDOException $th) {
			var_dump($th->getMessage());
		}
		$this->_BD = '';
		echo json_encode($response);
	}
	public function datosVentasTerminado($data)
	{
		ini_set('session.gc_maxlifetime', 3600); // 1 hour
        session_set_cookie_params(3600);
        session_start();
		try {

			$pagenum = $data['page'];
			$pagesize = $data['size'];
			$offset = ($pagenum - 1) * $pagesize;
			$search = $data['search'];

			$stmt = $this->_BD->query("SELECT * FROM ventasInstaleTiendas");
			$stmt->execute();
			$count = $stmt->rowCount();

			$stmt = $this->_BD->query("SELECT * FROM ventasInstaleTiendas WHERE 1 = 1 ORDER BY fecha_gestion LIMIT $offset, $pagesize");
			$stmt->execute();
			if ($stmt->rowCount()) {
				$response = array('state' => 1, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC), 'totalCount' => $count);
			} else {
				$response = array('state' => 0, 'data' => 'No se encontraron datos');
			}
		} catch (PDOException $th) {
			var_dump($th->getMessage());
		}
		$this->_BD = '';
		echo json_encode($response);
	}
	public function marcarEnGestionVentaInstale($data)
	{
		ini_set('session.gc_maxlifetime', 3600); // 1 hour
        session_set_cookie_params(3600);
        session_start();
		try {

			//var_dump($data);exit();
			session_start();
			$login_gestion = $_SESSION['login'];

			//$login_gestion = $data['login_gestion'];
			$id = $data['data']['id'];

			$stmt = $this->_BD->prepare("SELECT en_gestion, pedido, login_gestion FROM ventasInstaleTiendas WHERE id = :id");
			$stmt->execute(array(':id' => $id));
			$response = $stmt->fetchAll(PDO::FETCH_ASSOC);
			//echo $response[0]['en_gestion'];exit();
			if ($response[0]['en_gestion'] == 0) {
				$stmt = $this->_BD->prepare("UPDATE ventasInstaleTiendas SET en_gestion = 1, login_gestion = :login_gestion WHERE id = :id");
				$stmt->execute(array(':id' => $id, ':login_gestion' => $login_gestion));
				if ($stmt->rowCount() == 1) {
					$res = array('state' => 1, 'msj' => 'Pedido ' . $response[0]['pedido'] . ' Ahora esta Bloqueado');
				}
			} elseif (($response[0]['en_gestion'] == 1) && ($response[0]['login_gestion'] == $login_gestion)) {
				$stmt = $this->_BD->prepare("UPDATE ventasInstaleTiendas SET en_gestion = 0, login_gestion = '' WHERE id = :id");
				$stmt->execute(array(':id' => $id));
				if ($stmt->rowCount() == 1) {
					$res = array('state' => 1, 'msj' => 'Pedido ' . $response[0]['pedido'] . ' Ahora esta Desbloqueado');
				}
			} else {
				$res = array('state' => 0, 'msj' => 'El pedido ' . $response[0]['pedido'] . ' se encuentra en gestion por otro agente');
			}
		} catch (PDOException $th) {
			var_dump($th->getMessage());
		}
		$this->_BD = '';
		echo json_encode($res);
	}
	public function guardaVentaInstale($data)
	{
		try {


			ini_set('session.gc_maxlifetime', 3600); // 1 hour
			session_set_cookie_params(3600);
			session_start();
			if (!$_SESSION) {
				$response = ['state' => 99, 'title' => 'Su session ha caducado', 'text' => 'Inicia session nuevamente para continuar'];
			} else {
				$data = $data['data'];
				$login_gestion = $_SESSION['login'];

				$tipificacion = $data['tipificacion'];
				//echo $tipificacion;exit();
				$obs_tipificacion = $data['obs_tipificacion'];
				$id = $data['id'];
				//$login_gestion = $data['login_gestion'];
				$observacion_seguimiento = $data['observacion_seguimiento'];
				$stmt = $this->_BD->prepare("SELECT login_gestion FROM ventasInstaleTiendas WHERE id = :id");
				$stmt->execute(array(':id' => $id));
				if ($stmt->rowCount() == 1) {
					$resLogin = $stmt->fetchAll(PDO::FETCH_ASSOC);
					$rlogin = $resLogin[0]['login_gestion'];

					if ($rlogin != $login_gestion) {
						$response = array('state' => 0, 'msj' => 'El pedido se encuentra en gestion por otro agente');
					} else {
						$stmt = $this->_BD->prepare("UPDATE ventasInstaleTiendas SET tipificacion = :tipificacion, 
													                                obs_tipificacion = :obs_tipificacion, 
													                                login_gestion = :login_gestion, 
													                                fecha_gestion = :fecha_gestion,
													                                observacion_gestion = :observacion_gestion,
													                                en_gestion = 2
										        WHERE id = :id");
						$stmt->execute(
							array(
								':id' => $id,
								':tipificacion' => $tipificacion,
								':obs_tipificacion' => $obs_tipificacion,
								':login_gestion' => $login_gestion,
								':fecha_gestion' => date('Y-m-d H:i:s'),
								':observacion_gestion' => $observacion_seguimiento
							)
						);
						if ($stmt->rowCount() == 1) {
							$response = array('state' => 1, 'msj' => 'La solicitud fue guardada correctamente');
						} else {
							$response = array('state' => 0, 'msj' => 'Ha ocurrido un error interno inténtalo nuevamente en unos minutos.');
						}
					}

				} else {
					$res = array('state' => 0, 'msj' => 'No se encontró un agente con el pedido en gestion');
				}
			}
		} catch (PDOException $th) {
			var_dump($th->getMessage());
		}
		$this->_BD = '';
		echo json_encode($response);
	}

	public function detallePedidoVenta($data)
	{
		ini_set('session.gc_maxlifetime', 3600); // 1 hour
        session_set_cookie_params(3600);
        session_start();
		try {

			$stmt = $this->_BD->prepare("SELECT * FROM ventasInstaleTiendas WHERE pedido = :pedido");
			$stmt->execute(array(':pedido' => $data['pedido']));
			if ($stmt->rowCount() > 0) {
				$res = array('state' => 1, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC));
			} else {
				$res = array('state' => 0, 'msj' => 'El pedido ingresado no existe');
			}
		} catch (PDOException $th) {
			var_dump($th->getMessage());
		}
		$this->_BD = '';
		echo json_encode($res);
	}

	public function detalleVentaRagoFecha($data)
	{
		ini_set('session.gc_maxlifetime', 3600); // 1 hour
        session_set_cookie_params(3600);
        session_start();
		try {

			$fechaIni = $data['fechaini'];
			$fechaFin = $data['fechafin'];
			$concepto = $data['concepto'];
			$condicion = '';
			if ((!empty($fechaIni)) && (!empty($fechaFin)) && (!empty($concepto))) {
				if ($concepto == 'sin') {
					$tip = " AND tipificacion IS NULL ";
				} elseif ($concepto == 'Gestionados') {
					$tip = " AND tipificacion IS NOT NULL ";
				} elseif ($concepto == 'Ok') {
					$tip = " AND tipificacion = 'Ok' ";
				} elseif ($concepto == 'Rechazados') {
					$tip = " AND tipificacion = 'Rechazada' ";
				} else {
					$tip = '';
				}

				$condicion = " $tip AND fecha_ingreso BETWEEN '$fechaIni 00:00:00' and '$fechaFin 23:59:59' ";
			} elseif (!empty($fechaIni) && (!empty($concepto))) {
				if ($concepto == 'sin') {
					$tip = " AND tipificacion IS NULL ";
				} elseif ($concepto == 'Gestionados') {
					$tip = " AND tipificacion IS NOT NULL ";
				} elseif ($concepto == 'Ok') {
					$tip = " AND tipificacion = 'Ok' ";
				} elseif ($concepto == 'Rechazados') {
					$tip = " AND tipificacion = 'Rechazada' ";
				} else {
					$tip = '';
				}
				$condicion = " $tip AND fecha_ingreso BETWEEN '$fechaIni 00:00:00' and '$fechaIni 23:59:59' ";
			} elseif (!empty($fechaIni)) {
				$condicion = " AND fecha_ingreso BETWEEN '$fechaIni 00:00:00' and '$fechaIni 23:59:59' ";
			}

			$stmt = $this->_BD->query("SELECT
											*
										FROM
											ventasInstaleTiendas
										WHERE
											1 = 1
										$condicion");
			$stmt->execute();
			if ($stmt->rowCount()) {
				$response = array('state' => 1, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC), 'count' => $stmt->rowCount());
			} else {
				$response = array('state' => 0, 'msj' => 'No se encontraron datos');
			}
		} catch (PDOException $e) {
			var_dump($e->getMessage());
		}

		$this->_BD = '';
		echo json_encode($response);
	}
	public function csvVentaInstale($data)
	{
		ini_set('session.gc_maxlifetime', 3600); // 1 hour
        session_set_cookie_params(3600);
        session_start();
		try {

			//var_dump($data['data']);exit();
			$dat = $data['data'];
			$data = $dat['data'];

			//echo $data['data']['fechaini'];exit();
			//$data = json_decode(file_get_contents('php://input'), true);
			$fechaIni = $data['fechaini'];
			$fechaFin = $data['fechafin'];
			$concepto = $data['concepto'];
			if ($fechaIni == '' && $fechaFin == '') {
				$fechaIni = date('Y-m-d');
				$fechaFin = date('Y-m-d');
			}

			$condicion = '';
			if ((!empty($fechaIni)) && (!empty($fechaFin)) && (!empty($concepto))) {
				if ($concepto == 'sin') {
					$tip = " AND tipificacion IS NULL ";
				} elseif ($concepto == 'Gestionados') {
					$tip = " AND tipificacion IS NOT NULL ";
				} elseif ($concepto == 'Ok') {
					$tip = " AND tipificacion = 'Ok' ";
				} elseif ($concepto == 'Rechazados') {
					$tip = " AND tipificacion = 'Rechazada' ";
				} else {
					$tip = '';
				}

				$condicion = " $tip AND fecha_ingreso BETWEEN '$fechaIni 00:00:00' and '$fechaFin 23:59:59' ";
			} elseif (!empty($fechaIni) && (!empty($concepto))) {
				if ($concepto == 'sin') {
					$tip = " AND tipificacion IS NULL ";
				} elseif ($concepto == 'Gestionados') {
					$tip = " AND tipificacion IS NOT NULL ";
				} elseif ($concepto == 'Ok') {
					$tip = " AND tipificacion = 'Ok' ";
				} elseif ($concepto == 'Rechazados') {
					$tip = " AND tipificacion = 'Rechazada' ";
				} else {
					$tip = '';
				}
				$condicion = " $tip AND fecha_ingreso BETWEEN '$fechaIni 00:00:00' and '$fechaFin 23:59:59' ";
			} elseif (!empty($fechaIni) && !empty($fechaFin)) {
				$condicion = " AND fecha_ingreso BETWEEN '$fechaIni 00:00:00' and '$fechaFin 23:59:59' ";
			}



			$stmt = $this->_BD->query("SELECT
											pedido,
											documento_cliente,
											numero_contacto_cliente,
											login_despacho,
											login_gestion,
											regional,
											tipificacion,
											obs_tipificacion,
											replace(observacion_canal,'\n',' ') as observacion_canal,
											replace(observacion_gestion,'\n',' ') as observacion_gestion,
											jornada_atencion,
											fecha_atencion,
											fecha_ingreso,
											fecha_gestion,
											documento_tecnico,
											nombre_tecnico,
											categoria
										FROM
											ventasInstaleTiendas
										WHERE
											1 = 1
										$condicion");
			$stmt->execute();
			if ($stmt->rowCount()) {
				$response = array('state' => 1, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC));
			} else {
				$response = array('state' => 0, 'msj' => 'No se encontraron datos');
			}
		} catch (PDOException $th) {
			var_dump($th->getMessage());
		}
		$this->_BD = '';
		echo json_encode($response);
	}
	public function guardaObservacionParaVentaInstale($data)
	{
		ini_set('session.gc_maxlifetime', 3600); // 1 hour
        session_set_cookie_params(3600);
        session_start();
		try {
			$data = json_decode(file_get_contents('php://input'), true);
			$usuario = $data['usuario'];
			$observacion = $data['observacion']['observacion_gestion'];

			if (empty($usuario)) {
				$response = array('state' => 0, 'msj' => 'No se encontro un usuario logueado inicia session nuevamente para continuar');
			} elseif (empty($observacion)) {
				$response = array('state' => 0, 'msj' => 'Debes ingresar una observacion');
			} else {
				$stmt = $this->_BD->prepare("INSERT INTO observacion_venta_instale_despacho(login,observacion) values(:login,:observacion)");
				$stmt->execute(array(':login' => $usuario, ':observacion' => $observacion));
				if ($stmt->rowCount() == 1) {
					$response = array('state' => 1, 'msj' => 'La Observacion se guardo correctamente.');
				} else {
					$response = array('state' => 0, 'msj' => 'Ha Ocurrido un error interno intentalo nuevamente en unos minutos.');
				}
			}

		} catch (PDOException $th) {
			var_dump($th->getMessage());
		}

		$this->_BD = '';
		echo json_encode($response);
	}
	public function observacionDetalleVentaModal()
	{
		ini_set('session.gc_maxlifetime', 3600); // 1 hour
        session_set_cookie_params(3600);
        session_start();
		$hora = date('Y-m-d');
		try {
			$stmt = $this->_BD->query("SELECT * FROM observacion_venta_instale_despacho WHERE hora BETWEEN '$hora 00:00:00' and '$hora 23:59:59'");
			$stmt->execute();
			if ($stmt->rowCount() > 0) {
				$response = array('state' => 1, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC));
			} else {
				$response = array('state' => 0, 'msj' => 'No se encontraron registros.');
			}
		} catch (PDOException $th) {
			var_dump($th->getMessage());
		}
		$this->_BD = '';
		echo json_encode($response);
	}
	public function eliminaObservacion($data)
	{
		ini_set('session.gc_maxlifetime', 3600); // 1 hour
        session_set_cookie_params(3600);
        session_start();
		try {
			$data = json_decode(file_get_contents('php://input'), true);
			$stmt = $this->_BD->prepare("DELETE FROM observacion_venta_instale_despacho WHERE id = :id");
			$stmt->execute(array(':id' => $data));
			if ($stmt->rowCount() == 1) {
				$response = array('state' => 1, 'msj' => 'Observacion eliminada');
			} else {
				$response = array('state' => 0, 'msj' => 'Ha ocurrido un error interno intentalo nuevamente en unos minutos');
			}

		} catch (PDOException $th) {
			var_dump($th->getMessage());
		}
		$this->_BD = null;
		echo json_encode($response);
	}

	public function consolidadoZona()
	{
		ini_set('session.gc_maxlifetime', 3600); // 1 hour
        session_set_cookie_params(3600);
        session_start();
		$hoy = date('Y-m-d');
		try {
			$stmt = $this->_BD->prepare("SELECT
													regional as zona,
													COUNT(CASE WHEN tipificacion = 'Ok' then 1 END) as 'aprobada',
													COUNT(CASE WHEN tipificacion = 'Rechazada' then 1 END) as 'rechazada',
													COUNT(CASE WHEN tipificacion is NULL then 1 END) as 'pendiente'
												FROM
													ventasInstaleTiendas
												WHERE
													fecha_atencion BETWEEN '$hoy 00:00:00'
												AND '$hoy 23:59:59'
												GROUP BY regional");
			$stmt->execute();
			if (!$stmt->rowCount()) {
				$response = array('state' => 0, 'msj' => 'No se encontraron datos');
			} else {
				$response = array('state' => 1, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC));
			}
		} catch (PDOException $th) {
			var_dump($th->getMessage());
		}

		$this->_BD = null;
		echo json_encode($response);
	}


}