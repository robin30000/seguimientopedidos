<?php
require_once 'conection.php';
class Upload{

    private $_DB;

    public function __construct()
    {
        $this->_DB = new Conection();
    }


    public function cargaRegistros() {


        //ini_set('display_errors', '1');
        $target_dir = "../../uploads/";
        $target_file = $target_dir . basename($_FILES["fileUpload"]["name"]);
        //$name     = $_FILES['fileUpload']['name'];
        $tname = $_FILES['fileUpload']['tmp_name'];
        $type = $_FILES['fileUpload']['type'];

        $fecha = date("Y-m-d H:i:s");
        $tname1 = basename($_FILES["fileUpload"]["name"]);
        $guardar = "";

        //$target_file = basename($_FILES["fileUpload"]["name"]);
        $uploadOk = 1;
        // Check if $uploadOk is set to 0 by an error
        if ($uploadOk == 0) {
            echo "Lo sentimos , el archivo no se ha subido.";
            // if everything is ok, try to upload file
        } else {

            if (move_uploaded_file($_FILES["fileUpload"]["tmp_name"], $target_file)) {
                echo "El archivo " . basename($_FILES["fileUpload"]["name"]) . " se ha subido";

            } else {

                echo "Ha habido un error al subir el archivo.";

            }
        }

        $tname1 = basename($_FILES["fileUpload"]["name"]);

        if ($type == 'application/vnd.ms-excel') {
            // Extension excel 97
            $ext = 'xls';
        } else if ($type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            // Extension excel 2007 y 2010
            $ext = 'xlsx';
        } else {
            // Extension no valida
            echo -1;
            exit();
        }

        $xlsx = 'Excel2007';
        $xls = 'Excel5';

        $objPHPExcel2 = PHPExcel_IOFactory::load($target_file);
        $Total_Sheet = $objPHPExcel2->getSheetCount();
        $Sheet = $objPHPExcel2->getSheet(0)->toArray(null, true, true, true);

        foreach ($Sheet as $key => $value) {
            if ($key == 1) {
                continue;
            }

            $pedido = trim($value['A']);
            $id_tecnico = trim($value['B']);
            $empresa = trim($value['C']);
            $despacho = trim($value['D']);
            $observaciones = trim($value['E']);
            $accion = trim($value['F']);
            $sub_accion = trim($value['G']);
            $proceso = trim($value['H']);

            $sql = "INSERT INTO registros " .
                   "(pedido, id_tecnico, empresa, asesor, despacho, observaciones, " .
                   "accion, tipo_pendiente, fecha, proceso) " .
                   "VALUES " .
                   "('$pedido','$id_tecnico','$empresa','CARGAMASIVA', " .
                   "'$despacho','$observaciones','$accion', " .
                   "'$sub_accion', NOW(),'$proceso'); ";

            $rst = $this->_DB->query($sql);
            $rst->execute();
        }
        die();
    }
}
