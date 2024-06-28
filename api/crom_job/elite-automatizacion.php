<?php

require_once '../class/ConnectionGestionOperativa.php';
$_DBG = new ConnectionGestionOperativa();

try {


    $stmt = $_DBG->prepare("SELECT VENTA,COD_CLIENTE,COD_ABONADO as PEDIDO,CLIENTE,TELEFONO_CONTACTO,COD_CAUSA,DES_CAUSA,FECHA_ALTA_VENTA,COD_CAUSA1
,DES_CAUSA1,COD_VENDEDOR,NOMBRE_VNEDEDOR,DISTRITO,DIRECCION,TIPO_VENTA,PRODUCTO,ETAPA,DIRECCION_VIEJA,ACTUACION
,COD_ESTADO,IND_CLASETRASLADO,NUM_REGISTRO,FECHA_MODIFICACION,DES_OBSERVACION,PROCESO,FECHA_CARGA
FROM FacInstalaciones_Pendientes_Asignaciones_Elite");

    $stmt->execute();
    $res = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($res) {
        /*$url = "http://10.100.66.254/BB8/contingencias/Buscar/eliteAutomatizacion/dd";

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

        curl_setopt($ch, CURLOPT_URL, "$url");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HEADER, 0);

        curl_setopt($ch, CURLOPT_TIMEOUT, 60);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 60);
        $data = curl_exec($ch);

        var_dump($data);
        die();

        $dataclick = json_decode($data, true);
        $contador = 0;
        $count = count($dataclick);*/

        $json_data = json_encode($res);

        $url = "http://10.100.66.254/BB8/contingencias/Buscar/eliteAutomatizacion/dd";

        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $json_data);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json',
            'Content-Length: ' . strlen($json_data)
        ));
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($ch, CURLOPT_TIMEOUT, 60);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 60);

        $data = curl_exec($ch);

        if (curl_errno($ch)) {
            echo 'Error cURL: ' . curl_error($ch);
        }

        curl_close($ch);

        var_dump($data);
        die();

        $dataclick = json_decode($data, true);
        $contador = 0;
        $count = count($dataclick);
    }


} catch (PDOException $e) {
    var_dump($e->getMessage());
}