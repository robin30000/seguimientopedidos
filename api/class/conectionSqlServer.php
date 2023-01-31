<?php

class ConectionSqlServer extends PDO
{

    private $pass = "6n`Vue8yYK7Os4D-y";
    private $user = "BI_Clicksoftware";
    private $bd = "Service Optimization";
    private $host = "NETV-PSQL09-05";

    public function __construct()
    {
        try {
            $base_de_datos = new PDO("sqlsrv:server=$this->host;database=$this->bd", $this->user, $this->pass);
            $base_de_datos->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (Exception $e) {
            echo "Ocurrió un error con la base de datos: " . $e->getMessage();
        }
    }


    /*private $tipo_de_base = 'mysql';
    private $host = '10.100.88.2';
    private $nombre_de_base = 'seguimientopedidos';
    private $usuario = 'root';
    private $contrasena = '7iCMKyRgksM39f3ofbehgk';

    private $opciones = array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8', PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    public function __construct()
    {
        try {
            parent::__construct($this->tipo_de_base . ':host=' . $this->host . ';dbname=' . $this->nombre_de_base, $this->usuario, $this->contrasena, $this->opciones);
        } catch (PDOException $e) {
            echo 'Ha surgido un error y no se puede conectar a la base de datos. Detalle: ' . $e->getMessage();
            exit;
        }
    }*/

}
