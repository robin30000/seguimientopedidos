<?php
error_reporting(E_ALL);
require_once '../class/conection.php';

class ModelUtils
{
    private $_DB;

    public function __construct()
    {
        $this->_DB = new Conection();
    }

    public function rst()
    {
        try {
            session_start();
            $stmt = $this->_DB->query("SELECT DISTINCT DEPARTAMENTO, CIUDAD " .
                                      " FROM ciudades " .
                                      " ORDER BY CIUDAD ASC");
            $stmt->execute();
            if ($stmt->rowCount()) {
                $response = $stmt->fetchAll(PDO::FETCH_ASSOC);
            } else {
                $response = '';
            }


        } catch (PDOException $e) {

        }

        return $response;
    }

    public function rstdep()
    {
        try {
            session_start();
            $stmt = $this->_DB->query("SELECT DISTINCT DEPARTAMENTO " .
                                      " FROM ciudades " .
                                      " ORDER BY DEPARTAMENTO ASC");
            $stmt->execute();
            if ($stmt->rowCount()) {
                $response = $stmt->fetchAll(PDO::FETCH_ASSOC);
            } else {
                $response = '';
            }


        } catch (PDOException $e) {

        }

        return $response;
    }

    public function regionesTip()
    {
        try {
            session_start();
            $stmt = $this->_DB->query("SELECT DISTINCT region" .
                                      " FROM regiones " .
                                      " ORDER BY region ASC");
            $stmt->execute();
            if ($stmt->rowCount()) {
                $response = $stmt->fetchAll(PDO::FETCH_ASSOC);
            } else {
                $response = '';
            }
        } catch (PDOException $e) {

        }

        return $response;
    }

    private function cargaRegistros()
    {

        require_once('../../spreadsheet/php-excel-reader/excel_reader2.php');
        require_once('../../spreadsheet/SpreadsheetReader.php');

        ini_set('max_execution_time', 2000);

        //ini_set('display_errors', '1');
        $target_dir  = "../uploads/";
        $target_file = $target_dir . basename($_FILES["fileUpload"]["name"]);
        //$name     = $_FILES['fileUpload']['name'];
        $tname = $_FILES['fileUpload']['tmp_name'];
        $type  = $_FILES['fileUpload']['type'];
        $tam   = $_FILES['fileUpload']['size'];

        //$login   = $this->_request['user'];
        $fecha   = date("Y-m-d H:i:s");
        $tname1  = basename($_FILES["fileUpload"]["name"]);
        $guardar = "";

        //$target_file = basename($_FILES["fileUpload"]["name"]);
        $uploadOk = 1;
        // Check if $uploadOk is set to 0 by an error
        /*if ($uploadOk == 0) {
			echo "Lo sentimos , el archivo no se ha subido.";
			// if everything is ok, try to upload file
		} else {

			if (move_uploaded_file($_FILES["fileUpload"]["tmp_name"], $target_file)) {
				echo "El archivo " . basename($_FILES["fileUpload"]["name"]) . " se ha subido";

			} else {

				echo "Ha habido un error al subir el archivo.";

			}
		}*/

        $allowedFileType = ['application/vnd.ms-excel', 'text/xls', 'text/xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];


        if (in_array($type, $allowedFileType)) {

            $target_dir  = "../uploads/";
            $target_file = $target_dir . basename($_FILES["fileUpload"]["name"]);
            move_uploaded_file($_FILES["fileUpload"]["tmp_name"], $target_file);

            $Reader = new SpreadsheetReader($target_file);

            $sheetCount = count($Reader->sheets());
            error_reporting(E_ALL ^ E_NOTICE); //this hides all notices that php displays on the page
            for ($i = 0; $i < $sheetCount; $i++) {
                $Reader->ChangeSheet($i);

                foreach ($Reader as $Row) {

                    $pedido        = $Row[0];
                    $id_tecnico    = $Row[1];
                    $empresa       = $Row[2];
                    $despacho      = $Row[3];
                    $observaciones = $Row[4];
                    $accion        = $Row[5];
                    $sub_accion    = $Row[6];
                    $proceso       = $Row[7];

                    //echo $pedido .' - '. $id_tecnico .' - '. $empresa .' - '. $despacho .' - '. $observaciones .' - '. $accion .' - '. $proceso .' - '. $sub_accion;exit();
                    /*echo $sub_accion;

                                        if ($pedido == '') {
                                            echo 'El archivo no puede venir con datos incompletos (pedido)';
                                            exit();
                                        } elseif ($id_tecnico == '') {
                                            echo 'El archivo no puede venir con datos incompletos (cc tecnico)';
                                            exit();
                                        } elseif ($empresa == '') {
                                            echo 'El archivo no puede venir con datos incompletos (empresa)';
                                            exit();
                                        } elseif ($despacho == '') {
                                            echo 'El archivo no puede venir con datos incompletos (despacho)';
                                            exit();
                                        } elseif ($observaciones == '') {
                                            echo 'El archivo no puede venir con datos incompletos (observaciones)';
                                            exit();
                                        } elseif ($accion == '') {
                                            echo 'El archivo no puede venir con datos incompletos (accion)';
                                            exit();
                                        } elseif ($sub_accion) {
                                            echo 'El archivo no puede venir con datos incompletos (sub_accion)';
                                            exit();
                                        }elseif ($proceso) {
                                            echo 'El archivo no puede venir con datos incompletos (proceso)';
                                            exit();
                                        }*/


                    $sql = $this->_DB->query("INSERT INTO registros (pedido, id_tecnico, empresa, asesor, despacho, observaciones, accion, tipo_pendiente, fecha, proceso) 
VALUES ('$pedido','$id_tecnico','$empresa','CARGAMASIVA', '$despacho','$observaciones','$accion', '$sub_accion', NOW(),'$proceso')");

                    $sql->execute($sql);

                    echo $sql->rowCount();

                }
                echo 'ok';
            }
        }
    }

}
