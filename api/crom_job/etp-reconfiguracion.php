<?php

require_once '../class/ConnectionGestionOperativa.php';
$_DBG = new ConnectionGestionOperativa();

try {

    if (!empty($data)) {
        $fecha = $data;
    } else {
        $fecha = date('Y-m-d');
    }

    $url = "http://10.100.66.254/BB8/contingencias/Buscar/ETPReconfiguraciones/" . $fecha;

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

    curl_setopt($ch, CURLOPT_URL, "$url");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, 0);

    curl_setopt($ch, CURLOPT_TIMEOUT, 60);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 60);
    $data = curl_exec($ch);

    $dataclick = json_decode($data, true);
    $contador = 0;
    $count = count($dataclick);

    for ($i = 0; $i < $count; $i++) {


        $stmt = $_DBG->prepare("SELECT MOTIVO
									FROM dbo.TmpETP_Gestion_Inconsistencias
                                    WHERE estado_orden='6'
                                        and MOTIVO = :pedido");
		//var_dump($dataclick,$res,$q);exit();	
        $stmt->execute(array(':pedido' => $dataclick[$i]['PEDIDO_ID']));
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
		
        if (!empty($res)) {
            if ($res[0]['PEDIDO_ID'] !== null) {
                $variable = $res[0]['PEDIDO_ID'] . '-' . $res[0]['MOTIVO'];
				
				
                $url = "http://10.100.66.254/BB8/contingencias/Buscar/ETPreconActualiza/" . $variable;
                $ch = curl_init();
                curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
                curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
                curl_setopt($ch, CURLOPT_URL, "$url");
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_HEADER, 0);
                curl_setopt($ch, CURLOPT_TIMEOUT, 60);
                curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 60);
                $data = curl_exec($ch);
				
			
				
                if ($data){
                    $contador++;
                }
            }
        }
    }

} catch (PDOException $e) {
    var_dump($e->getMessage());
}

if ($contador) {
    echo 'Se ingresaron en la fecha ' . date('Y-m-d H:i:s') . ' ' . $count . ' registros';
} else {
    echo 'No se ingresaron registros en bd sin gestionar fecha ' . date('Y-m-d H:i:s');
}
