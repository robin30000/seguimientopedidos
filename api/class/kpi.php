<?php
require_once 'conection.php';
/* error_reporting(E_ALL);
ini_set('display_errors', 1); */

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
        if (($estado == 'Acepta') && ($producto == 'Todos')) {
            $condicion = " AND  acepta = 'acepta' AND  producto IN ('TV', 'Internet', 'Internet+ToIP', 'ToIP') ";
        } elseif (($estado == 'Rechaza') && ($producto == 'Todos')) {
            $condicion = " AND  acepta = 'Rechaza' AND  producto IN ('TV', 'Internet', 'Internet+ToIP', 'ToIP') ";
        } elseif (($estado == 'Acepta') && ($producto == 'Internet+Toip')) {
            $condicion = " AND  acepta = 'acepta' AND producto IN ('Internet', 'Internet+ToIP', 'ToIP')";
        } elseif (($estado == 'Acepta') && ($producto == 'TV')) {
            $condicion = " AND  acepta = 'acepta' AND producto = 'TV'";
        } elseif (($estado == 'Rechaza') && ($producto == 'Internet+Toip')) {
            $condicion = " AND  acepta = 'Rechaza' AND producto IN ('Internet', 'Internet+ToIP', 'ToIP')";
        } elseif (($estado == 'Rechaza') && ($producto == 'TV')) {
            $condicion = " AND  acepta = 'Rechaza' AND producto = 'TV'";
        } else {
            $condicion = " AND  acepta = 'acepta' ";
        }

        $today = date("Y-m-d");
        $fecha_anterior = date("Y-m-d", strtotime($today . "- 15 days"));

        $stmt = $this->_BD->query("SELECT DATE_FORMAT(horagestion, '%Y-%m-%e') AS Fecha, 
        SUM(CASE WHEN producto = 'TV' THEN 1 ELSE 0 END ) AS 'TV',
        SUM(CASE WHEN producto IN ('Internet', 'Internet+ToIP', 'ToIP') THEN 1 ELSE 0 END ) AS 'Internet',
        acepta
        FROM contingencias
        WHERE horagestion BETWEEN '$fecha_anterior 00:00:00' AND '$today 23:59:59' $condicion
        GROUP BY Fecha
        ORDER BY Fecha;");
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

        /* ini_set('session.gc_maxlifetime', 3600); // 1 hour
        session_set_cookie_params(3600);
        session_start(); */
        $today = date("Y-m-d");
        $estado = $data['estado'];
        $producto = $data['producto'];

        $condicion = '';

        if (($estado == 'Acepta') && ($producto == 'Internet+Toip')) {
            $condicion = " AND  acepta = 'acepta' AND producto IN ('Internet', 'Internet+ToIP', 'ToIP') ";
        } elseif (($estado == 'Acepta') && ($producto == 'TV')) {
            $condicion = " AND  acepta = 'acepta' AND producto = 'TV' ";
        } elseif (($estado == 'Acepta') && ($producto == 'Todos')) {
            $condicion = " AND  acepta = 'acepta' AND  producto IN ('TV', 'Internet', 'Internet+ToIP', 'ToIP') ";
        } elseif (($estado == 'Rechaza') && ($producto == 'Internet+Toip')) {
            $condicion = " AND  acepta = 'Rechaza' AND producto IN ('Internet', 'Internet+ToIP', 'ToIP') ";
        } elseif (($estado == 'Rechaza') && ($producto == 'TV')) {
            $condicion = " AND  acepta = 'Rechaza' AND producto = 'TV' ";
        } elseif (($estado == 'Rechaza') && ($producto == 'Todos')) {
            $condicion = " AND  acepta = 'Rechaza' AND  producto IN ('TV', 'Internet', 'Internet+ToIP', 'ToIP') ";
        } else {
            $condicion = " AND  acepta = 'acepta' ";
        }


        $stmt = $this->_BD->query("SELECT c.logincontingencia agente, u.empresa, c.acepta,
        SUM(CASE WHEN producto = 'TV' THEN 1 ELSE 0 END) AS 'TV',
        SUM(CASE WHEN producto IN ('Internet', 'Internet+ToIP','ToIP') THEN 1 ELSE 0 END ) AS 'Internet'
        FROM contingencias c
        INNER JOIN usuarios u ON u.login = c.logincontingencia
        WHERE c.horagestion BETWEEN '$today 00:00:00' AND '$today 23:59:59' $condicion
        GROUP BY agente, u.empresa, c.acepta ORDER by Internet DESC;");
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
		GROUP BY C2.USUARIO, producto
        ORDER BY CANTIDAD DESC");


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

        /* ini_set('session.gc_maxlifetime', 3600); // 1 hour
        session_set_cookie_params(3600);
        session_start(); */
        $estado = $data['estado'];
        $producto = $data['producto'];
        $fecha = $data['fecha'];
        $today = date("Y-m-d");

        if (!empty($data['tabla'])) {

            $stmt = $this->_BD->prepare("SELECT * from usuarios WHERE login = :u");
            $stmt->execute(array(':u' => $data['usuario']));
            if ($stmt->rowCount() == 1) {
                $stmt = $this->_BD->prepare("INSERT INTO usuario_kpi (usuario, tabla) VALUES (:u, 'apoyo')");
                $stmt->execute(array(':u' => $data['usuario']));
                if ($stmt->rowCount() == 1) {
                    $response = array('state' => 1, 'msj' => 'Usuario agregado correctamente');
                } else {
                    $response = array('state' => 0, 'msj' => 'Ha ocurrido un error interno inténtalo nuevamente en unos minutos');
                }

            } else {
                $response = array('state' => 0, 'msj' => 'El usuario ingresado no se encuentra registrado');
            }

            echo json_encode($response);
            exit();
        }


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

        $stmt = $this->_BD->query("SELECT usuario FROM usuario_kpi WHERE tabla = 'apoyo'");
        $stmt->execute();
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $usuarios_array = array_column($res, 'usuario');
        $usuarios_cadena = "'" . implode("','", $usuarios_array) . "'";

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
		WHERE p.logincontingencia in ($usuarios_cadena) $condicion AND p.horacontingencia BETWEEN '$today 00:00:00' AND '$today 23:59:59') C2
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
        /* ini_set('session.gc_maxlifetime', 3600); // 1 hour
        session_set_cookie_params(3600);
        session_start(); */
        $estado = $data['estado'];
        $producto = $data['producto'];
        $fecha = $data['fecha'];
        $today = date("Y-m-d");

        if (!empty($data['tabla'])) {

            $stmt = $this->_BD->prepare("SELECT * from usuarios WHERE login = :u");
            $stmt->execute(array(':u' => $data['usuario']));
            if ($stmt->rowCount() == 1) {
                $stmt = $this->_BD->prepare("INSERT INTO usuario_kpi (usuario, tabla) VALUES (:u, 'tiempo_completo')");
                $stmt->execute(array(':u' => $data['usuario']));
                if ($stmt->rowCount() == 1) {
                    $response = array('state' => 1, 'msj' => 'Usuario agregado correctamente');
                } else {
                    $response = array('state' => 0, 'msj' => 'Ha ocurrido un error interno inténtalo nuevamente en unos minutos');
                }

            } else {
                $response = array('state' => 0, 'msj' => 'El usuario ingresado no se encuentra registrado');
            }
            echo json_encode($response);
            exit();
        }


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
        } elseif (($estado == 'Todos') && ($producto == 'Internet+Toip') && (!empty($fecha))) {
            $today = $fecha;
            $condicion = " AND p.producto IN ('Internet+ToIP', 'Internet', 'ToIP') ";
        } elseif (($estado == 'Todos') && ($producto == 'TV') && (!empty($fecha))) {
            $condicion = " AND p.producto = 'TV' ";
        } elseif (($estado == 'Todos') && (!empty($fecha))) {
            $today = $fecha;
            $condicion = "";
        } elseif ($estado == 'Todos') {
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

        $stmt = $this->_BD->query("SELECT usuario FROM usuario_kpi WHERE tabla = 'tiempo_completo'");
        $stmt->execute();
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $usuarios_array = array_column($res, 'usuario');
        $usuarios_cadena = "'" . implode("','", $usuarios_array) . "'";

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
		WHERE p.logincontingencia in ($usuarios_cadena) $condicion AND p.horacontingencia BETWEEN '$today 00:00:00' AND '$today 23:59:59') C2
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

        /* ini_set('session.gc_maxlifetime', 3600); // 1 hour
        session_set_cookie_params(3600);
        session_start(); */
        $estado = $data['estado'];
        $producto = $data['producto'];
        $fecha = $data['fecha'];
        $today = date("Y-m-d");

        if (!empty($data['tabla'])) {
            $stmt = $this->_BD->prepare("SELECT * from usuarios WHERE login = :u");
            $stmt->execute(array(':u' => $data['usuario']));
            if ($stmt->rowCount() == 1) {
                $stmt = $this->_BD->prepare("INSERT INTO usuario_kpi (usuario, tabla) VALUES (:u, 'mmss')");
                $stmt->execute(array(':u' => $data['usuario']));
                if ($stmt->rowCount() == 1) {
                    $response = array('state' => 1, 'msj' => 'Usuario agregado correctamente');
                } else {
                    $response = array('state' => 0, 'msj' => 'Ha ocurrido un error interno inténtalo nuevamente en unos minutos');
                }

            } else {
                $response = array('state' => 0, 'msj' => 'El usuario ingresado no se encuentra registrado');
            }
            echo json_encode($response);
            exit();
        }

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

        $stmt = $this->_BD->query("SELECT usuario FROM usuario_kpi WHERE tabla = 'mmss'");
        $stmt->execute();
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $usuarios_array = array_column($res, 'usuario');
        $usuarios_cadena = "'" . implode("','", $usuarios_array) . "'";

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
		FROM contingencias p WHERE p.logincontingencia in ($usuarios_cadena) $condicion AND p.horacontingencia BETWEEN '$today 00:00:00' AND '$today 23:59:59') C2
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
        /* ini_set('session.gc_maxlifetime', 3600); // 1 hour
        session_set_cookie_params(3600);
        session_start(); */
        $data = json_decode(file_get_contents('php://input'), true);
        $estado = $data['estado'];
        $producto = $data['producto'];
        $fecha = $data['fecha'];
        $today = date("Y-m-d");

        if (!empty($data['tabla'])) {
            $stmt = $this->_BD->prepare("SELECT * from usuarios WHERE login = :u");
            $stmt->execute(array(':u' => $data['usuario']));
            if ($stmt->rowCount() == 1) {
                $stmt = $this->_BD->prepare("INSERT INTO usuario_kpi (usuario, tabla) VALUES (:u, 'emtelco')");
                $stmt->execute(array(':u' => $data['usuario']));
                if ($stmt->rowCount() == 1) {
                    $response = array('state' => 1, 'msj' => 'Usuario agregado correctamente');
                } else {
                    $response = array('state' => 0, 'msj' => 'Ha ocurrido un error interno inténtalo nuevamente en unos minutos');
                }

            } else {
                $response = array('state' => 0, 'msj' => 'El usuario ingresado no se encuentra registrado');
            }
            echo json_encode($response);
            exit();
        }

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

        $stmt = $this->_BD->query("SELECT usuario FROM usuario_kpi WHERE tabla = 'emtelco'");
        $stmt->execute();
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $usuarios_array = array_column($res, 'usuario');
        $usuarios_cadena = "'" . implode("','", $usuarios_array) . "'";

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
		WHERE 1=1 $condicion AND p.logincontingencia NOT IN ($usuarios_cadena)  AND p.horacontingencia BETWEEN '$today 00:00:00' AND '$today 23:59:59') C2

		GROUP BY C2.USUARIO ORDER BY CANTIDAD DESC");

        $stmt->execute();
        if ($stmt->rowCount()) {
            $response = array('state' => 1, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC));
        } else {
            $response = array('state' => 0, 'msj' => 'No se encontraron datos');
        }

        echo json_encode($response);
    }

    public function quitarUsuarioKpi($data)
    {
        /* ini_set('session.gc_maxlifetime', 3600); // 1 hour
        session_set_cookie_params(3600);
        session_start(); */
        try {
            $usuario = $data['usuario'];

            if ($data['tabla'] == 'Tiempo completo') {
                $tabla = 'tiempo_completo';
            } else {
                $tabla = $data['tabla'];
            }

            $stmt = $this->_BD->prepare("DELETE FROM usuario_kpi WHERE usuario = :id AND tabla = :tabla");
            $stmt->execute(array(':id' => $usuario, ':tabla' => $tabla));
            if ($stmt->rowCount() == 1) {
                $response = array('state' => 1, 'msj' => 'Usuario retirado correctamente');
            } else {
                $response = array('state' => 0, 'msj' => 'Ha ocurrido un error interno inténtalo nuevamente en unos minutos');
            }
        } catch (PDOException $th) {
            var_dump($th->getMessage());
        }
        $this->_BD = '';
        echo json_encode($response);
    }
}