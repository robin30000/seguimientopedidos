<?php
require_once 'conection.php';

class kpi
{

    private $_BD;

    public function __construct()
    {
        $this->_BD = new Conection();
    }


    public function contigenciaDiario($data)
    {

        $estado = $data['estado'];
        $producto = $data['producto'];

        $condicion = '';

        if (($estado == 'Acepta') && ($producto[0] == 'Internet+Toip') && ($producto[1] == 'TV')) {
            $condicion = " AND  acepta = 'acepta' ";
        } elseif (($estado == 'Rechaza') && ($producto[0] == 'Internet+Toip') && ($producto[1] == 'TV')) {
            $condicion = " AND  acepta = 'Rechaza' ";
        } elseif (($estado == 'Acepta') && ($producto[0] == 'Internet+Toip')) {
            $condicion = " AND  acepta = 'acepta' AND producto IN ('Internet', 'Internet+ToIP', 'ToIP')";
        } elseif (($estado == 'Acepta') && ($producto[0] == 'TV')) {
            $condicion = " AND  acepta = 'acepta' AND producto = 'TV'";
        } elseif (($estado == 'Rechaza') && ($producto[0] == 'Internet+Toip')) {
            $condicion = " AND  acepta = 'Rechaza' AND producto IN ('Internet', 'Internet+ToIP', 'ToIP')";
        } elseif (($estado == 'Rechaza') && ($producto[0] == 'TV')) {
            $condicion = " AND  acepta = 'Rechaza' AND producto = 'TV'";
        } else {
            $condicion = " AND  acepta = 'acepta' ";
        }

        $today = date("Y-m-d");
        $fecha_anterior = date("Y-m-d", strtotime($today . "- 15 days"));

        $stmt = $this->_BD->query("SELECT
											DATE_FORMAT(horagestion, '%Y-%m-%e') AS Fecha,
											SUM(
												CASE
												WHEN producto = 'TV' THEN
													1
												ELSE
													0
												END
											) AS 'TV',
											SUM(
												CASE
												WHEN producto IN ('Internet', 'Internet+ToIP', 'ToIP') THEN
													1
												ELSE
													0
												END
											) AS 'Internet',
											acepta
										FROM
											contingencias
										WHERE
											horagestion BETWEEN '$fecha_anterior 00:00:00'
										AND '$today 23:59:59' $condicion
										GROUP BY
											Fecha
										ORDER BY
											horagestion");
        $stmt->execute();
        if ($stmt->rowCount()) {
            $response = array('state' => 1, 'type' => 'chart-bar', 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC));
        } else {
            $response = array('state' => 0, 'msj' => 'No se encontraron datos');
        }

        echo json_encode($response);
    }

    public function contigenciaAgente($data)
    {

        $today = date("Y-m-d");
        $estado = $data['estado'];
        $producto = $data['producto'];

        $condicion = '';

        if (($estado == 'Acepta') && ($producto[0] == 'Internet+Toip') && ($producto[1] == 'TV')) {
            $condicion = " AND  acepta = 'acepta' ";
        } elseif (($estado == 'Rechaza') && ($producto[0] == 'Internet+Toip') && ($producto[1] == 'TV')) {
            $condicion = " AND  acepta = 'Rechaza' ";
        } elseif (($estado == 'Acepta') && ($producto[0] == 'Internet+Toip')) {
            $condicion = " AND  acepta = 'acepta' AND producto IN ('Internet', 'Internet+ToIP', 'ToIP')";
        } elseif (($estado == 'Acepta') && ($producto[0] == 'TV')) {
            $condicion = " AND  acepta = 'acepta' AND producto = 'TV'";
        } elseif (($estado == 'Rechaza') && ($producto[0] == 'Internet+Toip')) {
            $condicion = " AND  acepta = 'Rechaza' AND producto IN ('Internet', 'Internet+ToIP', 'ToIP')";
        } elseif (($estado == 'Rechaza') && ($producto[0] == 'TV')) {
            $condicion = " AND  acepta = 'Rechaza' AND producto = 'TV'";
        } else {
            $condicion = " AND  acepta = 'acepta' ";
        }


        $stmt = $this->_BD->query("SELECT
										c.logincontingencia agente,
										u.empresa,
										c.acepta,
										SUM(
											CASE
											WHEN producto = 'TV' THEN
												1
											ELSE
												0
											END
										) AS 'TV',
										SUM(
											CASE
											WHEN producto IN ('Internet', 'Internet+ToIP','ToIP') THEN
												1
											ELSE
												0
											END
										) AS 'Internet'
									FROM
										contingencias c
									INNER JOIN usuarios u ON u.login = c.logincontingencia
									WHERE
										c.horagestion BETWEEN '$today 00:00:00'
									AND '$today 23:59:59'
									$condicion
									GROUP BY
										c.logincontingencia,
										c.acepta
									order by Internet DESC");
        $stmt->execute();
        if ($stmt->rowCount()) {
            $response = array('state' => 1, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC));
        } else {
            $response = array('state' => 0, 'msj' => 'No se encontraron datos');
        }

        echo json_encode($response);
    }

    public function contigenciaHoraAgente($data)
    {

        $estado = $data['estado'];
        $producto = $data['producto'];
        $fecha = $data['fecha'];
        $today = date("Y-m-d");

        //echo $fecha;exit();

        $condicion = " AND p.acepta = 'Acepta' ";
        if (($estado == 'Acepta') && (!empty($fecha))) {
            $today = $fecha;
            $condicion = " AND p.acepta = 'Acepta' ";
        } elseif ($estado == 'Acepta') {
            $condicion = " AND p.acepta = 'Acepta' ";
        } elseif (($estado == 'Rechaza') && (!empty($fecha))) {
            $today = $fecha;
            $condicion = " AND p.acepta = 'Rechaza' ";
        } elseif ($estado == 'Rechaza') {
            $condicion = " AND p.acepta = 'Rechaza' ";
        } elseif (($estado == 'Todos') && (!empty($fecha))) {
            $today = $fecha;
            $condicion = "";
        } elseif ($estado == 'Todos') {
            $condicion = "";
        } elseif (!empty($fecha)) {
            $today = $fecha;
        }

        $stmt = $this->_BD->query("SELECT 
		C2.USUARIO,
		C2.prod AS producto
		, COUNT(*) AS CANTIDAD
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) >= 0 AND (C2.RANGO_PENDIENTE) <= 6 THEN 1 ELSE 0 END) AS 'am06' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 6 AND (C2.RANGO_PENDIENTE) <= 7 THEN 1 ELSE 0 END) AS 'am07' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 7 AND (C2.RANGO_PENDIENTE) <= 8 THEN 1 ELSE 0 END) AS 'am08' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 8 AND (C2.RANGO_PENDIENTE) <= 9 THEN 1 ELSE 0 END) AS 'am09' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 9 AND (C2.RANGO_PENDIENTE) <= 10 THEN 1 ELSE 0 END) AS 'am10' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 10 AND (C2.RANGO_PENDIENTE) <= 11 THEN 1 ELSE 0 END) AS 'am11' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 11 AND (C2.RANGO_PENDIENTE) <= 12 THEN 1 ELSE 0 END) AS 'am12' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 12 AND (C2.RANGO_PENDIENTE) <= 13 THEN 1 ELSE 0 END) AS 'pm01' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 13 AND (C2.RANGO_PENDIENTE) <= 14 THEN 1 ELSE 0 END) AS 'pm02' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 14 AND (C2.RANGO_PENDIENTE) <= 15 THEN 1 ELSE 0 END) AS 'pm03' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 15 AND (C2.RANGO_PENDIENTE) <= 16 THEN 1 ELSE 0 END) AS 'pm04' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 16 AND (C2.RANGO_PENDIENTE) <= 17 THEN 1 ELSE 0 END) AS 'pm05' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 17 AND (C2.RANGO_PENDIENTE) <= 18 THEN 1 ELSE 0 END) AS 'pm06' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 18 AND (C2.RANGO_PENDIENTE) <= 19 THEN 1 ELSE 0 END) AS 'pm07' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 19 AND (C2.RANGO_PENDIENTE) <= 20 THEN 1 ELSE 0 END) AS 'pm08' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 20 AND (C2.RANGO_PENDIENTE) <= 21 THEN 1 ELSE 0 END) AS 'pm09' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 21 THEN 1 ELSE 0 END) AS 'Masde09'
		FROM(
		SELECT 
				p.logincontingencia AS USUARIO, DATE_FORMAT(p.horacontingencia, '%H') AS RANGO_PENDIENTE, 
				CASE WHEN (p.producto = 'Internet+ToIP' OR p.producto = 'Internet' OR p.producto = 'ToIP') THEN 'Internet+Toip' WHEN p.producto = 'TV' THEN 'TV' END AS prod
		FROM contingencias p
		WHERE 1=1 $condicion AND p.horacontingencia BETWEEN '$today 00:00:00' AND '$today 23:59:59') C2
		GROUP BY C2.USUARIO ORDER BY CANTIDAD DESC");


        $stmt->execute();
        if ($stmt->rowCount()) {
            $response = array('state' => 1, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC));
        } else {
            $response = array('state' => 0, 'msj' => 'No se encontraron datos');
        }

        echo json_encode($response);
    }

    public function contigenciaHoraAgenteApoyo($data)
    {

        $estado = $data['estado'];
        $producto = $data['producto'];
        $fecha = $data['fecha'];
        $today = date("Y-m-d");

        $condicion = '';
        if (($estado == 'Acepta') && ($producto == 'Internet+Toip') && (!empty($fecha))) {
            $today = $fecha;
            $condicion = " AND p.acepta = 'Acepta' AND p.producto IN ('Internet+ToIP', 'Internet', 'ToIP') ";
        } elseif (($estado == 'Acepta') && ($producto == 'Internet+Toip')) {
            $condicion = " AND p.acepta = 'Acepta' AND p.producto IN ('Internet+ToIP', 'Internet', 'ToIP') ";
        } elseif (($estado == 'Acepta') && ($producto == 'TV') && (!empty($fecha))) {
            $today = $fecha;
            $condicion = " AND p.acepta = 'Acepta' AND p.producto = 'TV' ";
        } elseif (($estado == 'Acepta') && ($producto == 'TV')) {
            $condicion = " AND p.acepta = 'Acepta' AND p.producto = 'TV' ";
        } elseif (($estado == 'Rechaza') && ($producto == 'Internet+Toip') && (!empty($fecha))) {
            $today = $fecha;
            $condicion = " AND p.acepta = 'Rechaza' AND p.producto IN ('Internet+ToIP', 'Internet', 'ToIP') ";
        } elseif (($estado == 'Rechaza') && ($producto == 'Internet+Toip')) {
            $condicion = " AND p.acepta = 'Rechaza' AND p.producto IN ('Internet+ToIP', 'Internet', 'ToIP') ";
        } elseif (($estado == 'Rechaza') && ($producto == 'TV') && (!empty($fecha))) {
            $today = $fecha;
            $condicion = " AND p.acepta = 'Rechaza' AND p.producto = 'TV' ";
        } elseif (($estado == 'Rechaza') && ($producto == 'TV')) {
            $condicion = " AND p.acepta = 'Rechaza' AND p.producto = 'TV' ";
        } elseif (($estado == 'Acepta') && (!empty($fecha))) {
            $today = $fecha;
            $condicion = " AND p.acepta = 'Acepta' ";
        } elseif ($estado == 'Acepta') {
            $condicion = " AND p.acepta = 'Acepta' ";
        } elseif (($estado == 'Rechaza') && (!empty($fecha))) {
            $today = $fecha;
            $condicion = " AND p.acepta = 'Rechaza' ";
        } elseif ($estado == 'Rechaza') {
            $condicion = " AND p.acepta = 'Rechaza' ";
        } elseif (($producto == 'Internet+Toip') && (!empty($fecha))) {
            $today = $fecha;
            $condicion = " AND p.producto IN ('Internet+ToIP', 'Internet', 'ToIP') ";
        } elseif ($producto == 'Internet+Toip') {
            $condicion = " AND p.producto IN ('Internet+ToIP', 'Internet', 'ToIP') ";
        } elseif (($producto == 'TV') && (!empty($fecha))) {
            $today = $fecha;
            $condicion = " AND p.producto = 'TV' ";
        } elseif ($producto == 'TV') {
            $condicion = " AND p.producto = 'TV' ";
        } elseif (!empty($fecha)) {
            $today = $fecha;
        } else {
            $condicion = " AND p.acepta = 'acepta' ";
        }

        $stmt = $this->_BD->query("SELECT 
		 C2.USUARIO 
		, COUNT(*) AS CANTIDAD
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) >= 0 AND (C2.RANGO_PENDIENTE) <= 6 THEN 1 ELSE 0 END) AS 'am06' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 6 AND (C2.RANGO_PENDIENTE) <= 7 THEN 1 ELSE 0 END) AS 'am07' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 7 AND (C2.RANGO_PENDIENTE) <= 8 THEN 1 ELSE 0 END) AS 'am08' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 8 AND (C2.RANGO_PENDIENTE) <= 9 THEN 1 ELSE 0 END) AS 'am09' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 9 AND (C2.RANGO_PENDIENTE) <= 10 THEN 1 ELSE 0 END) AS 'am10' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 10 AND (C2.RANGO_PENDIENTE) <= 11 THEN 1 ELSE 0 END) AS 'am11' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 11 AND (C2.RANGO_PENDIENTE) <= 12 THEN 1 ELSE 0 END) AS 'am12' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 12 AND (C2.RANGO_PENDIENTE) <= 13 THEN 1 ELSE 0 END) AS 'pm01' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 13 AND (C2.RANGO_PENDIENTE) <= 14 THEN 1 ELSE 0 END) AS 'pm02' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 14 AND (C2.RANGO_PENDIENTE) <= 15 THEN 1 ELSE 0 END) AS 'pm03' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 15 AND (C2.RANGO_PENDIENTE) <= 16 THEN 1 ELSE 0 END) AS 'pm04' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 16 AND (C2.RANGO_PENDIENTE) <= 17 THEN 1 ELSE 0 END) AS 'pm05' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 17 AND (C2.RANGO_PENDIENTE) <= 18 THEN 1 ELSE 0 END) AS 'pm06' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 18 AND (C2.RANGO_PENDIENTE) <= 19 THEN 1 ELSE 0 END) AS 'pm07' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 19 AND (C2.RANGO_PENDIENTE) <= 20 THEN 1 ELSE 0 END) AS 'pm08' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 20 AND (C2.RANGO_PENDIENTE) <= 21 
		    THEN 1 ELSE 0 END) AS 'pm09' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 21 THEN 1 ELSE 0 END) AS 'Masde09'
		FROM(
		SELECT 
				 p.pedido AS PEDIDO_ID, 
				 p.logincontingencia AS USUARIO, DATE_FORMAT(p.horacontingencia, '%H') AS RANGO_PENDIENTE
		FROM contingencias p
		WHERE p.logincontingencia in ('jechavs','caro','jalvarga','alondono','karroyar','jbetanmo','larrublg', 'cramiceb','jromang','cvasquor','garcila','gdbetancur','jcordoba') $condicion AND p.horacontingencia BETWEEN '$today 00:00:00' AND '$today 23:59:59') C2
		GROUP BY C2.USUARIO ORDER BY CANTIDAD DESC");

        $stmt->execute();
        if ($stmt->rowCount()) {
            $response = array('state' => 1, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC));
        } else {
            $response = array('state' => 0, 'msj' => 'No se encontraron datos');
        }

        echo json_encode($response);
    }

    public function contigenciaHoraAgenteTiempoCompleto($data)
    {
        $estado = $data['estado'];
        $producto = $data['producto'];
        $fecha = $data['fecha'];
        $today = date("Y-m-d");

        $condicion = '';
        if (($estado == 'Acepta') && ($producto == 'Internet+Toip') && (!empty($fecha))) {
            $today = $fecha;
            $condicion = " AND p.acepta = 'Acepta' AND p.producto IN ('Internet+ToIP', 'Internet', 'ToIP') ";
        } elseif (($estado == 'Acepta') && ($producto == 'Internet+Toip')) {
            $condicion = " AND p.acepta = 'Acepta' AND p.producto IN ('Internet+ToIP', 'Internet', 'ToIP') ";
        } elseif (($estado == 'Acepta') && ($producto == 'TV') && (!empty($fecha))) {
            $today = $fecha;
            $condicion = " AND p.acepta = 'Acepta' AND p.producto = 'TV' ";
        } elseif (($estado == 'Acepta') && ($producto == 'TV')) {
            $condicion = " AND p.acepta = 'Acepta' AND p.producto = 'TV' ";
        } elseif (($estado == 'Rechaza') && ($producto == 'Internet+Toip') && (!empty($fecha))) {
            $today = $fecha;
            $condicion = " AND p.acepta = 'Rechaza' AND p.producto IN ('Internet+ToIP', 'Internet', 'ToIP') ";
        } elseif (($estado == 'Rechaza') && ($producto == 'Internet+Toip')) {
            $condicion = " AND p.acepta = 'Rechaza' AND p.producto IN ('Internet+ToIP', 'Internet', 'ToIP') ";
        } elseif (($estado == 'Rechaza') && ($producto == 'TV') && (!empty($fecha))) {
            $today = $fecha;
            $condicion = " AND p.acepta = 'Rechaza' AND p.producto = 'TV' ";
        } elseif (($estado == 'Rechaza') && ($producto == 'TV')) {
            $condicion = " AND p.acepta = 'Rechaza' AND p.producto = 'TV' ";
        } elseif (($estado == 'Acepta') && (!empty($fecha))) {
            $today = $fecha;
            $condicion = " AND p.acepta = 'Acepta' ";
        }elseif (($estado == 'Todos') && ($producto == 'Internet+Toip') && (!empty($fecha))) {
            $today = $fecha;
            $condicion = " AND p.producto IN ('Internet+ToIP', 'Internet', 'ToIP') ";
        }elseif (($estado == 'Todos') && ($producto == 'TV') && (!empty($fecha))) {
            $condicion = " AND p.producto = 'TV' ";
        } elseif (($estado == 'Todos') && (!empty($fecha))) {
            $today = $fecha;
            $condicion = "";
        }elseif ($estado == 'Todos') {
            $condicion = "";
        } elseif ($estado == 'Acepta') {
            $condicion = " AND p.acepta = 'Acepta' ";
        } elseif (($estado == 'Rechaza') && (!empty($fecha))) {
            $today = $fecha;
            $condicion = " AND p.acepta = 'Rechaza' ";
        } elseif ($estado == 'Rechaza') {
            $condicion = " AND p.acepta = 'Rechaza' ";
        } elseif (($producto == 'Internet+Toip') && (!empty($fecha))) {
            $today = $fecha;
            $condicion = " AND p.producto IN ('Internet+ToIP', 'Internet', 'ToIP') ";
        } elseif ($producto == 'Internet+Toip') {
            $condicion = " AND p.producto IN ('Internet+ToIP', 'Internet', 'ToIP') ";
        } elseif (($producto == 'TV') && (!empty($fecha))) {
            $today = $fecha;
            $condicion = " AND p.producto = 'TV' ";
        } elseif ($producto == 'TV') {
            $condicion = " AND p.producto = 'TV' ";
        } elseif (!empty($fecha)) {
            $today = $fecha;
        } else {
            $condicion = " AND p.acepta = 'acepta' ";
        }


        $stmt = $this->_BD->query("SELECT 
		 C2.USUARIO 
		, COUNT(*) AS CANTIDAD
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) >= 0 AND (C2.RANGO_PENDIENTE) <= 6 THEN 1 ELSE 0 END) AS 'am06' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 6 AND (C2.RANGO_PENDIENTE) <= 7 THEN 1 ELSE 0 END) AS 'am07' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 7 AND (C2.RANGO_PENDIENTE) <= 8 THEN 1 ELSE 0 END) AS 'am08' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 8 AND (C2.RANGO_PENDIENTE) <= 9 THEN 1 ELSE 0 END) AS 'am09' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 9 AND (C2.RANGO_PENDIENTE) <= 10 THEN 1 ELSE 0 END) AS 'am10' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 10 AND (C2.RANGO_PENDIENTE) <= 11 THEN 1 ELSE 0 END) AS 'am11' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 11 AND (C2.RANGO_PENDIENTE) <= 12 THEN 1 ELSE 0 END) AS 'am12' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 12 AND (C2.RANGO_PENDIENTE) <= 13 THEN 1 ELSE 0 END) AS 'pm01' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 13 AND (C2.RANGO_PENDIENTE) <= 14 THEN 1 ELSE 0 END) AS 'pm02' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 14 AND (C2.RANGO_PENDIENTE) <= 15 THEN 1 ELSE 0 END) AS 'pm03' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 15 AND (C2.RANGO_PENDIENTE) <= 16 THEN 1 ELSE 0 END) AS 'pm04' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 16 AND (C2.RANGO_PENDIENTE) <= 17 THEN 1 ELSE 0 END) AS 'pm05' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 17 AND (C2.RANGO_PENDIENTE) <= 18 THEN 1 ELSE 0 END) AS 'pm06' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 18 AND (C2.RANGO_PENDIENTE) <= 19 THEN 1 ELSE 0 END) AS 'pm07' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 19 AND (C2.RANGO_PENDIENTE) <= 20 THEN 1 ELSE 0 END) AS 'pm08' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 20 AND (C2.RANGO_PENDIENTE) <= 21 
		    THEN 1 ELSE 0 END) AS 'pm09' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 21 THEN 1 ELSE 0 END) AS 'Masde09'
		FROM(
		SELECT 
				 p.pedido AS PEDIDO_ID, 
				 p.logincontingencia AS USUARIO, DATE_FORMAT(p.horacontingencia, '%H') AS RANGO_PENDIENTE
		FROM contingencias p
		WHERE p.logincontingencia in ('jricol','lgarzon','cbarrera','jaceveb','csepulve','jmiranda','jsanchza') $condicion AND p.horacontingencia BETWEEN '$today 00:00:00' AND '$today 23:59:59') C2
		GROUP BY C2.USUARIO ORDER BY CANTIDAD DESC");

        $stmt->execute();
        if ($stmt->rowCount()) {
            $response = array('state' => 1, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC));
        } else {
            $response = array('state' => 0, 'msj' => 'No se encontraron datos');
        }

        echo json_encode($response);
    }

    public function contigenciaHoraAgenteMmss($data)
    {

        $estado = $data['estado'];
        $producto = $data['producto'];
        $fecha = $data['fecha'];
        $today = date("Y-m-d");

        $condicion = '';
        if (($estado == 'Acepta') && ($producto == 'Internet+Toip') && (!empty($fecha))) {
            $today = $fecha;
            $condicion = " AND p.acepta = 'Acepta' AND p.producto IN ('Internet+ToIP', 'Internet', 'ToIP') ";
        } elseif (($estado == 'Acepta') && ($producto == 'Internet+Toip')) {
            $condicion = " AND p.acepta = 'Acepta' AND p.producto IN ('Internet+ToIP', 'Internet', 'ToIP') ";
        } elseif (($estado == 'Acepta') && ($producto == 'TV') && (!empty($fecha))) {
            $today = $fecha;
            $condicion = " AND p.acepta = 'Acepta' AND p.producto = 'TV' ";
        } elseif (($estado == 'Acepta') && ($producto == 'TV')) {
            $condicion = " AND p.acepta = 'Acepta' AND p.producto = 'TV' ";
        } elseif (($estado == 'Rechaza') && ($producto == 'Internet+Toip') && (!empty($fecha))) {
            $today = $fecha;
            $condicion = " AND p.acepta = 'Rechaza' AND p.producto IN ('Internet+ToIP', 'Internet', 'ToIP') ";
        } elseif (($estado == 'Rechaza') && ($producto == 'Internet+Toip')) {
            $condicion = " AND p.acepta = 'Rechaza' AND p.producto IN ('Internet+ToIP', 'Internet', 'ToIP') ";
        } elseif (($estado == 'Rechaza') && ($producto == 'TV') && (!empty($fecha))) {
            $today = $fecha;
            $condicion = " AND p.acepta = 'Rechaza' AND p.producto = 'TV' ";
        } elseif (($estado == 'Rechaza') && ($producto == 'TV')) {
            $condicion = " AND p.acepta = 'Rechaza' AND p.producto = 'TV' ";
        } elseif (($estado == 'Acepta') && (!empty($fecha))) {
            $today = $fecha;
            $condicion = " AND p.acepta = 'Acepta' ";
        } elseif ($estado == 'Acepta') {
            $condicion = " AND p.acepta = 'Acepta' ";
        } elseif (($estado == 'Rechaza') && (!empty($fecha))) {
            $today = $fecha;
            $condicion = " AND p.acepta = 'Rechaza' ";
        } elseif ($estado == 'Rechaza') {
            $condicion = " AND p.acepta = 'Rechaza' ";
        } elseif (($producto == 'Internet+Toip') && (!empty($fecha))) {
            $today = $fecha;
            $condicion = " AND p.producto IN ('Internet+ToIP', 'Internet', 'ToIP') ";
        } elseif ($producto == 'Internet+Toip') {
            $condicion = " AND p.producto IN ('Internet+ToIP', 'Internet', 'ToIP') ";
        } elseif (($producto == 'TV') && (!empty($fecha))) {
            $today = $fecha;
            $condicion = " AND p.producto = 'TV' ";
        } elseif ($producto == 'TV') {
            $condicion = " AND p.producto = 'TV' ";
        } elseif (!empty($fecha)) {
            $today = $fecha;
        } else {
            $condicion = " AND p.acepta = 'acepta' ";
        }

        $stmt = $this->_BD->query("SELECT 
		 C2.USUARIO 
		, COUNT(*) AS CANTIDAD
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) >= 0 AND (C2.RANGO_PENDIENTE) <= 6 THEN 1 ELSE 0 END) AS 'am06' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 6 AND (C2.RANGO_PENDIENTE) <= 7 THEN 1 ELSE 0 END) AS 'am07' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 7 AND (C2.RANGO_PENDIENTE) <= 8 THEN 1 ELSE 0 END) AS 'am08' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 8 AND (C2.RANGO_PENDIENTE) <= 9 THEN 1 ELSE 0 END) AS 'am09' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 9 AND (C2.RANGO_PENDIENTE) <= 10 THEN 1 ELSE 0 END) AS 'am10' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 10 AND (C2.RANGO_PENDIENTE) <= 11 THEN 1 ELSE 0 END) AS 'am11' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 11 AND (C2.RANGO_PENDIENTE) <= 12 THEN 1 ELSE 0 END) AS 'am12' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 12 AND (C2.RANGO_PENDIENTE) <= 13 THEN 1 ELSE 0 END) AS 'pm01' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 13 AND (C2.RANGO_PENDIENTE) <= 14 THEN 1 ELSE 0 END) AS 'pm02' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 14 AND (C2.RANGO_PENDIENTE) <= 15 THEN 1 ELSE 0 END) AS 'pm03' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 15 AND (C2.RANGO_PENDIENTE) <= 16 THEN 1 ELSE 0 END) AS 'pm04' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 16 AND (C2.RANGO_PENDIENTE) <= 17 THEN 1 ELSE 0 END) AS 'pm05' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 17 AND (C2.RANGO_PENDIENTE) <= 18 THEN 1 ELSE 0 END) AS 'pm06' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 18 AND (C2.RANGO_PENDIENTE) <= 19 THEN 1 ELSE 0 END) AS 'pm07' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 19 AND (C2.RANGO_PENDIENTE) <= 20 THEN 1 ELSE 0 END) AS 'pm08' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 20 AND (C2.RANGO_PENDIENTE) <= 21 
		    THEN 1 ELSE 0 END) AS 'pm09' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 21 THEN 1 ELSE 0 END) AS 'Masde09'
		FROM(
		SELECT 
				 p.pedido AS PEDIDO_ID, 
				 p.logincontingencia AS USUARIO, DATE_FORMAT(p.horacontingencia, '%H') AS RANGO_PENDIENTE
		FROM contingencias p WHERE p.logincontingencia in ('jbaenaa','sgarciar','nfmartinez','lfonnegr','agomezgm','sgiforon','cano') $condicion AND p.horacontingencia BETWEEN '$today 00:00:00' AND '$today 23:59:59') C2
		GROUP BY C2.USUARIO ORDER BY CANTIDAD DESC");

        $stmt->execute();
        if ($stmt->rowCount()) {
            $response = array('state' => 1, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC));
        } else {
            $response = array('state' => 0, 'msj' => 'No se encontraron datos');
        }

        echo json_encode($response);
    }

    public function AgenteEmtelco($data)
    {
        $data = json_decode(file_get_contents('php://input'), true);
        $estado = $data['estado'];
        $producto = $data['producto'];
        $fecha = $data['fecha'];
        $today = date("Y-m-d");

        $condicion = '';
        if (($estado == 'Acepta') && (!empty($fecha))) {
            $today = $fecha;
            $condicion = " AND p.acepta = 'Acepta' ";
        } elseif ($estado == 'Acepta') {
            $condicion = " AND p.acepta = 'Acepta' ";
        } elseif (($estado == 'Rechaza') && (!empty($fecha))) {
            $today = $fecha;
            $condicion = " AND p.acepta = 'Rechaza' ";
        } elseif ($estado == 'Rechaza') {
            $condicion = " AND p.acepta = 'Rechaza' ";
        } elseif (!empty($fecha)) {
            $today = $fecha;
        } else {
            $condicion = " AND p.acepta = 'Acepta' ";
        }

        $stmt = $this->_BD->query("SELECT 
		C2.USUARIO
		, COUNT(*) AS CANTIDAD
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) >= 0 AND (C2.RANGO_PENDIENTE) <= 6 THEN 1 ELSE 0 END) AS 'am06' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 6 AND (C2.RANGO_PENDIENTE) <= 7 THEN 1 ELSE 0 END) AS 'am07' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 7 AND (C2.RANGO_PENDIENTE) <= 8 THEN 1 ELSE 0 END) AS 'am08' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 8 AND (C2.RANGO_PENDIENTE) <= 9 THEN 1 ELSE 0 END) AS 'am09' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 9 AND (C2.RANGO_PENDIENTE) <= 10 THEN 1 ELSE 0 END) AS 'am10' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 10 AND (C2.RANGO_PENDIENTE) <= 11 THEN 1 ELSE 0 END) AS 'am11' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 11 AND (C2.RANGO_PENDIENTE) <= 12 THEN 1 ELSE 0 END) AS 'am12' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 12 AND (C2.RANGO_PENDIENTE) <= 13 THEN 1 ELSE 0 END) AS 'pm01' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 13 AND (C2.RANGO_PENDIENTE) <= 14 THEN 1 ELSE 0 END) AS 'pm02' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 14 AND (C2.RANGO_PENDIENTE) <= 15 THEN 1 ELSE 0 END) AS 'pm03' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 15 AND (C2.RANGO_PENDIENTE) <= 16 THEN 1 ELSE 0 END) AS 'pm04' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 16 AND (C2.RANGO_PENDIENTE) <= 17 THEN 1 ELSE 0 END) AS 'pm05' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 17 AND (C2.RANGO_PENDIENTE) <= 18 THEN 1 ELSE 0 END) AS 'pm06' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 18 AND (C2.RANGO_PENDIENTE) <= 19 THEN 1 ELSE 0 END) AS 'pm07' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 19 AND (C2.RANGO_PENDIENTE) <= 20 THEN 1 ELSE 0 END) AS 'pm08' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 20 AND (C2.RANGO_PENDIENTE) <= 21 THEN 1 ELSE 0 END) AS 'pm09' 
		, SUM(CASE WHEN (C2.RANGO_PENDIENTE) > 21 THEN 1 ELSE 0 END) AS 'Masde09'
		FROM(
		SELECT 
		p.pedido AS PEDIDO_ID, p.logincontingencia AS USUARIO, DATE_FORMAT(p.horacontingencia, '%H') AS RANGO_PENDIENTE
		FROM contingencias p
		WHERE 1=1 $condicion AND p.logincontingencia NOT IN (
                                                            'jsanchza',
                                                            'jmiranda',
                                                            'csepulve',
                                                            'caro',
															'jalvarga',
															'alondono',
															'karroyar',
															'jbetanmo',
															'larrublg', 
															'cramiceb',
															'jromang',
															'cvasquor',
															'garcila',
															'gdbetancur',
															'jcordoba', 
															'jricol',
															'lgarzon',
															'cbarrera',
															'jaceveb',
															'jechavs', 
															'jbaenaa',
															'sgarciar',
															'nfmartinez',
															'lfonnegr',
															'agomezgm',
															'')  AND p.horacontingencia BETWEEN '$today 00:00:00' AND '$today 23:59:59') C2

		GROUP BY C2.USUARIO ORDER BY CANTIDAD DESC");

        $stmt->execute();
        if ($stmt->rowCount()) {
            $response = array('state' => 1, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC));
        } else {
            $response = array('state' => 0, 'msj' => 'No se encontraron datos');
        }

        echo json_encode($response);
    }
}