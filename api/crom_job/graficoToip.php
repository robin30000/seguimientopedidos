<?php


error_reporting(E_ALL);
ini_set('display_errors', 1);

//echo  date('Y-m-d H:i:s');exit();

require_once '../class/conection.php';

$conn = new Conection();

//$val = 123;
$url = "http://10.100.66.254/HCHV_DEV/graficoRgu.php/s";

//echo $url;exit();
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

echo "<pre>";
print_r($dataclick);
echo "</pre>";exit();

$datos = $dataclick;
$total = count($datos);
$count = 0;

try {

    $stmt = $conn->query("DELETE FROM tecnicos_copy1");
    $stmt->execute();

    for ($i = 0; $i < $total; $i++) {

        $UDC   = substr($datos[$i]['ID'], -4);
        $pass  = 'Colombia' . $UDC . '--++';
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

        $stmt = $conn->prepare("SELECT password FROM cuentasTecnicos where cedula = :identificacion");
        $stmt->execute([':identificacion' => $datos[$i]['ID']]);
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $stmt = $conn->prepare("INSERT INTO tecnicos_copy1 (identificacion, nombre, ciudad, celular, empresa,login_click,password,region,contrato,password_click,pass_apk, fecha_actualiza)
                                            values (:identificacion, :nombre, :ciudad, :celular, :empresa,:login_click,:pass,:region,:contrato,:password_click,:pass_apk, :fecha)");
        $stmt->execute(
            [
                ':identificacion' => $datos[$i]['ID'],
                ':nombre'         => $datos[$i]['nombre'],
                ':ciudad'         => $datos[$i]['ciudad'],
                ':celular'        => $datos[$i]['MobilePhone'],
                ':empresa'        => $empresa,
                ':login_click'    => $datos[$i]['login'],
                ':pass'           => $passM,
                ':region'         => $datos[$i]['region'],
                ':contrato'       => $datos[$i]['contrato'],
                ':password_click' => $result[0]['password'],
                ':pass_apk'       => $pass,
                ':fecha'          => date('Y-m-d H:i:s'),
            ]
        );

        if ($stmt->rowCount()) {
            $count++;
        }
    }

} catch (PDOException $th) {
    var_dump($th->getMessage());
}

if ($count) {

    $stmt = $conn->prepare("INSERT INTO tecnicos_copy1 (identificacion, nombre, ciudad, celular, empresa,login_click,password,region,contrato,password_click,pass_apk, fecha_actualiza)
                                            values (:identificacion, :nombre, :ciudad, :celular, :empresa,:login_click,:pass,:region,:contrato,:password_click,:pass_apk, :fecha)");
    $stmt->execute(
        [
            ':identificacion' => '71221973',
            ':nombre'         => 'RAMIREZ CEBALLOS CARLOS JULIO',
            ':ciudad'         => 'Antioquia Centro',
            ':celular'        => '3009999999',
            ':empresa'        => 'EMTELCO',
            ':login_click'    => 'cramiceb',
            ':pass'           => md5('Colombia1973--++'),
            ':region'         => 'Antioquia Centro',
            ':contrato'       => 'Emtelco',
            ':password_click' => '',
            ':pass_apk'       => 'Colombia1973--++',
            ':fecha'          => date('Y-m-d H:i:s'),
        ]
    );
    echo 'Se ingresaron en la fecha ' . date('Y-m-d H:i:s') . ' ' . $count + 1 . ' registros';
} else {
    echo 'No se ingresaron registros en bd sin gestionar fecha ' . date('Y-m-d H:i:s');
}




