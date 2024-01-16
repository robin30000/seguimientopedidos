<?php


error_reporting(0);
ini_set('display_errors', 0);

//echo  date('Y-m-d H:i:s');exit();

require_once '../class/conection.php';

$conn = new Conection();

//$val = 123;
$url = "http://10.100.66.254/HCHV_DEV/tecnicos/s";

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

/*echo "<pre>";
print_r($dataclick);
echo "</pre>";exit();*/

$datos = $dataclick;
$total = count($datos);
$count = 0;

try {

    $stmt = $conn->query("DELETE FROM tecnicos");
    $stmt->execute();

    for ($i = 0; $i < $total; $i++) {

        $UDC = substr($datos[$i]['ID'], -4);
        $pass = 'Colombia' . $UDC . '--++';
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

        $stmt = $conn->prepare("INSERT INTO tecnicos (identificacion, nombre, ciudad, celular, empresa,login_click,password,region,contrato,password_click,pass_apk)
                                            values (:identificacion, :nombre, :ciudad, :celular, :empresa,:login_click,:pass,:region,:contrato,:password_click,:pass_apk)");
        $stmt->execute(
            [
                ':identificacion' => $datos[$i]['ID'],
                ':nombre' => $datos[$i]['nombre'],
                ':ciudad' => $datos[$i]['ciudad'],
                ':celular' => $datos[$i]['MobilePhone'],
                ':empresa' => $empresa,
                ':login_click' => $datos[$i]['login'],
                ':pass' => $passM,
                ':region' => $datos[$i]['region'],
                ':contrato' => $datos[$i]['contrato'],
                ':password_click' => $result[0]['password'] ?? 0,
                ':pass_apk' => $pass
            ]
        );

        if ($stmt->rowCount()) {
            $count++;
        }
    }

} catch (PDOException $th) {
    var_dump($th->getMessage());
}

if ($conn) {
    $stmt = $conn->prepare("INSERT INTO tecnicos (identificacion, nombre, ciudad, celular, empresa,login_click,password,region,contrato,password_click,pass_apk)
                                            values (:identificacion, :nombre, :ciudad, :celular, :empresa,:login_click,:pass,:region,:contrato,:password_click,:pass_apk)");
    $stmt->execute(
        [
            ':identificacion' => '98773738',
            ':nombre' => 'MONTES LOPEZ VICTOR HUGO',
            ':ciudad' => 'Antioquia Oriente',
            ':celular' => '30000000',
            ':empresa' => '4',
            ':login_click' => 'vmontesl',
            ':pass' => md5('Colombia3738--++'),
            ':region' => 'Antioquia Oriente',
            ':contrato' => 'Emtelco',
            ':password_click' =>  0,
            ':pass_apk' => 'Colombia3738--++'
        ]
    );

    $stmt = $conn->prepare("INSERT INTO tecnicos (identificacion, nombre, ciudad, celular, empresa,login_click,password,region,contrato,password_click,pass_apk)
                                            values (:identificacion, :nombre, :ciudad, :celular, :empresa,:login_click,:pass,:region,:contrato,:password_click,:pass_apk)");
    $stmt->execute(
        [
            ':identificacion' => '79609742',
            ':nombre' => 'ARÉVALO FRANCO JOSE GERMAN',
            ':ciudad' => 'Antioquia Oriente',
            ':celular' => '30000000',
            ':empresa' => '4',
            ':login_click' => 'Jarevafr',
            ':pass' => md5('Colombia9742--++'),
            ':region' => 'Antioquia Oriente',
            ':contrato' => 'Emtelco',
            ':password_click' =>  0,
            ':pass_apk' => 'Colombia9742--++'
        ]
    );

    $stmt = $conn->prepare("INSERT INTO tecnicos (identificacion, nombre, ciudad, celular, empresa,login_click,password,region,contrato,password_click,pass_apk)
                                            values (:identificacion, :nombre, :ciudad, :celular, :empresa,:login_click,:pass,:region,:contrato,:password_click,:pass_apk)");
    $stmt->execute(
        [
            ':identificacion' => '70728771',
            ':nombre' => 'ESTRADA JIMENEZ OSCAR ALBERTO',
            ':ciudad' => 'Antioquia Oriente',
            ':celular' => '30000000',
            ':empresa' => '4',
            ':login_click' => 'oestraji',
            ':pass' => md5('Colombia8771--++'),
            ':region' => 'Antioquia Oriente',
            ':contrato' => 'Emtelco',
            ':password_click' =>  0,
            ':pass_apk' => 'Colombia8771--++'
        ]
    );

    $stmt = $conn->prepare("INSERT INTO tecnicos (identificacion, nombre, ciudad, celular, empresa,login_click,password,region,contrato,password_click,pass_apk)
                                            values (:identificacion, :nombre, :ciudad, :celular, :empresa,:login_click,:pass,:region,:contrato,:password_click,:pass_apk)");
    $stmt->execute(
        [
            ':identificacion' => '1037570553',
            ':nombre' => 'RUIZ GIRALDO JUAN MANUEL',
            ':ciudad' => 'Antioquia Oriente',
            ':celular' => '30000000',
            ':empresa' => '4',
            ':login_click' => 'jruizgir',
            ':pass' => md5('Colombia0553--++'),
            ':region' => 'Antioquia Oriente',
            ':contrato' => 'Emtelco',
            ':password_click' =>  0,
            ':pass_apk' => 'Colombia0553--++'
        ]
    );
    $stmt = $conn->prepare("INSERT INTO tecnicos (identificacion, nombre, ciudad, celular, empresa,login_click,password,region,contrato,password_click,pass_apk)
                                            values (:identificacion, :nombre, :ciudad, :celular, :empresa,:login_click,:pass,:region,:contrato,:password_click,:pass_apk)");
    $stmt->execute(
        [
            ':identificacion' => '1128393345',
            ':nombre' => 'POSADA ARBOLEDA DIEGO LEON',
            ':ciudad' => 'Antioquia Oriente',
            ':celular' => '30000000',
            ':empresa' => '4',
            ':login_click' => 'dposadar',
            ':pass' => md5('Colombia3345--++'),
            ':region' => 'Antioquia Oriente',
            ':contrato' => 'Emtelco',
            ':password_click' =>  0,
            ':pass_apk' => 'Colombia3345--++'
        ]
    );

    $stmt = $conn->prepare("INSERT INTO tecnicos (identificacion, nombre, ciudad, celular, empresa,login_click,password,region,contrato,password_click,pass_apk)
                                            values (:identificacion, :nombre, :ciudad, :celular, :empresa,:login_click,:pass,:region,:contrato,:password_click,:pass_apk)");
    $stmt->execute(
        [
            ':identificacion' => '71317589',
            ':nombre' => 'URREGO TAMAYO PEDRO JULIO',
            ':ciudad' => 'Antioquia Oriente',
            ':celular' => '30000000',
            ':empresa' => '4',
            ':login_click' => 'purregta',
            ':pass' => md5('Colombia7589--++'),
            ':region' => 'Antioquia Oriente',
            ':contrato' => 'Emtelco',
            ':password_click' =>  0,
            ':pass_apk' => 'Colombia7589--++'
        ]
    );

    $stmt = $conn->prepare("INSERT INTO tecnicos (identificacion, nombre, ciudad, celular, empresa,login_click,password,region,contrato,password_click,pass_apk)
                                            values (:identificacion, :nombre, :ciudad, :celular, :empresa,:login_click,:pass,:region,:contrato,:password_click,:pass_apk)");
    $stmt->execute(
        [
            ':identificacion' => '71224337',
            ':nombre' => 'BETANCUR AGUDELO HERNAN DARIO',
            ':ciudad' => 'Antioquia Oriente',
            ':celular' => '30000000',
            ':empresa' => '4',
            ':login_click' => 'hbetanag',
            ':pass' => md5('Colombia4337--++'),
            ':region' => 'Antioquia Oriente',
            ':contrato' => 'Emtelco',
            ':password_click' =>  0,
            ':pass_apk' => 'Colombia4337--++'
        ]
    );

    $stmt = $conn->prepare("INSERT INTO tecnicos (identificacion, nombre, ciudad, celular, empresa,login_click,password,region,contrato,password_click,pass_apk)
                                            values (:identificacion, :nombre, :ciudad, :celular, :empresa,:login_click,:pass,:region,:contrato,:password_click,:pass_apk)");
    $stmt->execute(
        [
            ':identificacion' => '70434613',
            ':nombre' => 'TUBERQUIA URREGO WILLIAM ARBEY',
            ':ciudad' => 'Antioquia Oriente',
            ':celular' => '30000000',
            ':empresa' => '4',
            ':login_click' => 'wtubeurr',
            ':pass' => md5('Colombia4613--++'),
            ':region' => 'Antioquia Oriente',
            ':contrato' => 'Emtelco',
            ':password_click' =>  0,
            ':pass_apk' => 'Colombia4613--++'
        ]
    );

    $stmt = $conn->prepare("INSERT INTO tecnicos (identificacion, nombre, ciudad, celular, empresa,login_click,password,region,contrato,password_click,pass_apk)
                                            values (:identificacion, :nombre, :ciudad, :celular, :empresa,:login_click,:pass,:region,:contrato,:password_click,:pass_apk)");
    $stmt->execute(
        [
            ':identificacion' => '71220080',
            ':nombre' => 'GALLEGO DÍAZ JULIÁN ALBERTO',
            ':ciudad' => 'Antioquia Oriente',
            ':celular' => '30000000',
            ':empresa' => '4',
            ':login_click' => 'jalbegal',
            ':pass' => md5('Colombia0080--++'),
            ':region' => 'Antioquia Oriente',
            ':contrato' => 'Emtelco',
            ':password_click' =>  0,
            ':pass_apk' => 'Colombia0080--++'
        ]
    );

    $stmt = $conn->prepare("INSERT INTO tecnicos (identificacion, nombre, ciudad, celular, empresa,login_click,password,region,contrato,password_click,pass_apk)
                                            values (:identificacion, :nombre, :ciudad, :celular, :empresa,:login_click,:pass,:region,:contrato,:password_click,:pass_apk)");
    $stmt->execute(
        [
            ':identificacion' => '71385160',
            ':nombre' => 'BAENA HENAO HORACIO ALBERTO',
            ':ciudad' => 'Antioquia Oriente',
            ':celular' => '30000000',
            ':empresa' => '4',
            ':login_click' => 'hbaenahe',
            ':pass' => md5('Colombia5160--++'),
            ':region' => 'Antioquia Oriente',
            ':contrato' => 'Emtelco',
            ':password_click' =>  0,
            ':pass_apk' => 'Colombia5160--++'
        ]
    );

    $stmt = $conn->prepare("INSERT INTO tecnicos (identificacion, nombre, ciudad, celular, empresa,login_click,password,region,contrato,password_click,pass_apk)
                                            values (:identificacion, :nombre, :ciudad, :celular, :empresa,:login_click,:pass,:region,:contrato,:password_click,:pass_apk)");
    $stmt->execute(
        [
            ':identificacion' => '1128275292',
            ':nombre' => 'POSADA VELEZ JORGE ANDRES',
            ':ciudad' => 'Antioquia Oriente',
            ':celular' => '30000000',
            ':empresa' => '4',
            ':login_click' => 'jandres',
            ':pass' => md5('Colombia5292--++'),
            ':region' => 'Antioquia Oriente',
            ':contrato' => 'Emtelco',
            ':password_click' =>  0,
            ':pass_apk' => 'Colombia5292--++'
        ]
    );

    $stmt = $conn->prepare("INSERT INTO tecnicos (identificacion, nombre, ciudad, celular, empresa,login_click,password,region,contrato,password_click,pass_apk)
                                            values (:identificacion, :nombre, :ciudad, :celular, :empresa,:login_click,:pass,:region,:contrato,:password_click,:pass_apk)");
    $stmt->execute(
        [
            ':identificacion' => '98648583',
            ':nombre' => 'GUTIERREZ MAURICIO ALEJANDRO',
            ':ciudad' => 'Antioquia Oriente',
            ':celular' => '30000000',
            ':empresa' => '4',
            ':login_click' => 'mgutierz',
            ':pass' => md5('Colombia8583--++'),
            ':region' => 'Antioquia Oriente',
            ':contrato' => 'Emtelco',
            ':password_click' =>  0,
            ':pass_apk' => 'Colombia8583--++'
        ]
    );

    $stmt = $conn->prepare("INSERT INTO tecnicos (identificacion, nombre, ciudad, celular, empresa,login_click,password,region,contrato,password_click,pass_apk)
                                            values (:identificacion, :nombre, :ciudad, :celular, :empresa,:login_click,:pass,:region,:contrato,:password_click,:pass_apk)");
    $stmt->execute(
        [
            ':identificacion' => '71378092',
            ':nombre' => 'AGUDELO AMAYA NILSON OSWALDO',
            ':ciudad' => 'Antioquia Oriente',
            ':celular' => '30000000',
            ':empresa' => '4',
            ':login_click' => 'nagudeam',
            ':pass' => md5('Colombia8092--++'),
            ':region' => 'Antioquia Oriente',
            ':contrato' => 'Emtelco',
            ':password_click' =>  0,
            ':pass_apk' => 'Colombia8092--++'
        ]
    );

    $stmt = $conn->prepare("INSERT INTO tecnicos (identificacion, nombre, ciudad, celular, empresa,login_click,password,region,contrato,password_click,pass_apk)
                                            values (:identificacion, :nombre, :ciudad, :celular, :empresa,:login_click,:pass,:region,:contrato,:password_click,:pass_apk)");
    $stmt->execute(
        [
            ':identificacion' => '1037619359',
            ':nombre' => 'HÉCTOR ALONSO ROLDÁN GÁLLEGO',
            ':ciudad' => 'Antioquia Oriente',
            ':celular' => '30000000',
            ':empresa' => '4',
            ':login_click' => 'hroldaga',
            ':pass' => md5('Colombia9359--++'),
            ':region' => 'Antioquia Oriente',
            ':contrato' => 'Emtelco',
            ':password_click' =>  0,
            ':pass_apk' => 'Colombia9359--++'
        ]
    );

    $stmt = $conn->prepare("INSERT INTO tecnicos (identificacion, nombre, ciudad, celular, empresa,login_click,password,region,contrato,password_click,pass_apk)
                                            values (:identificacion, :nombre, :ciudad, :celular, :empresa,:login_click,:pass,:region,:contrato,:password_click,:pass_apk)");
    $stmt->execute(
        [
            ':identificacion' => '71678224',
            ':nombre' => 'HOLGUIN AMAYA BIBIANO DE JESUS',
            ':ciudad' => 'Antioquia Oriente',
            ':celular' => '30000000',
            ':empresa' => '4',
            ':login_click' => 'bholguam',
            ':pass' => md5('Colombia8224--++'),
            ':region' => 'Antioquia Oriente',
            ':contrato' => 'Emtelco',
            ':password_click' =>  0,
            ':pass_apk' => 'Colombia8224--++'
        ]
    );

    $stmt = $conn->prepare("INSERT INTO tecnicos (identificacion, nombre, ciudad, celular, empresa,login_click,password,region,contrato,password_click,pass_apk)
                                            values (:identificacion, :nombre, :ciudad, :celular, :empresa,:login_click,:pass,:region,:contrato,:password_click,:pass_apk)");
    $stmt->execute(
        [
            ':identificacion' => '98553736',
            ':nombre' => 'VERGARA NIETO GIANNI MANFREY',
            ':ciudad' => 'Antioquia Oriente',
            ':celular' => '30000000',
            ':empresa' => '4',
            ':login_click' => 'gvergnie',
            ':pass' => md5('Colombia3736--++'),
            ':region' => 'Antioquia Oriente',
            ':contrato' => 'Emtelco',
            ':password_click' =>  0,
            ':pass_apk' => 'Colombia3736--++'
        ]
    );

    $stmt = $conn->prepare("INSERT INTO tecnicos (identificacion, nombre, ciudad, celular, empresa,login_click,password,region,contrato,password_click,pass_apk)
                                            values (:identificacion, :nombre, :ciudad, :celular, :empresa,:login_click,:pass,:region,:contrato,:password_click,:pass_apk)");
    $stmt->execute(
        [
            ':identificacion' => '98643109',
            ':nombre' => 'PORRAS RIOS EDWING',
            ':ciudad' => 'Antioquia Oriente',
            ':celular' => '30000000',
            ':empresa' => '4',
            ':login_click' => 'eporrari',
            ':pass' => md5('Colombia3109--++'),
            ':region' => 'Antioquia Oriente',
            ':contrato' => 'Emtelco',
            ':password_click' =>  0,
            ':pass_apk' => 'Colombia3109--++'
        ]
    );

    $stmt = $conn->prepare("INSERT INTO tecnicos (identificacion, nombre, ciudad, celular, empresa,login_click,password,region,contrato,password_click,pass_apk)
                                            values (:identificacion, :nombre, :ciudad, :celular, :empresa,:login_click,:pass,:region,:contrato,:password_click,:pass_apk)");
    $stmt->execute(
        [
            ':identificacion' => '10287604',
            ':nombre' => 'ALZATE ROJAS JAMES WILSON',
            ':ciudad' => 'Antioquia Oriente',
            ':celular' => '30000000',
            ':empresa' => '4',
            ':login_click' => 'jalzatro',
            ':pass' => md5('Colombia7604--++'),
            ':region' => 'Antioquia Oriente',
            ':contrato' => 'Emtelco',
            ':password_click' =>  0,
            ':pass_apk' => 'Colombia7604--++'
        ]
    );

    $stmt = $conn->prepare("INSERT INTO tecnicos (identificacion, nombre, ciudad, celular, empresa,login_click,password,region,contrato,password_click,pass_apk)
                                            values (:identificacion, :nombre, :ciudad, :celular, :empresa,:login_click,:pass,:region,:contrato,:password_click,:pass_apk)");
    $stmt->execute(
        [
            ':identificacion' => '71742166',
            ':nombre' => 'SIERRA CASTRO MANUEL JOSE',
            ':ciudad' => 'Antioquia Oriente',
            ':celular' => '30000000',
            ':empresa' => '4',
            ':login_click' => 'masierra',
            ':pass' => md5('Colombia2166--++'),
            ':region' => 'Antioquia Oriente',
            ':contrato' => 'Emtelco',
            ':password_click' =>  0,
            ':pass_apk' => 'Colombia2166--++'
        ]
    );
	
	$stmt = $conn->prepare("INSERT INTO tecnicos (identificacion, nombre, ciudad, celular, empresa,login_click,password,region,contrato,password_click,pass_apk)
                                            values (:identificacion, :nombre, :ciudad, :celular, :empresa,:login_click,:pass,:region,:contrato,:password_click,:pass_apk)");
    $stmt->execute(
        [
            ':identificacion' => '1039465051',
            ':nombre' => 'FRANCO VASQUEZ SANTIAGO',
            ':ciudad' => 'Antioquia Oriente',
            ':celular' => '30000000',
            ':empresa' => '4',
            ':login_click' => 'sfrancva',
            ':pass' => md5('Colombia5051--++'),
            ':region' => 'Antioquia Oriente',
            ':contrato' => 'Emtelco',
            ':password_click' =>  0,
            ':pass_apk' => 'Colombia5051--++'
        ]
    );


    $stmt = $conn->prepare("INSERT INTO tecnicos (identificacion, nombre, ciudad, celular, empresa,login_click,password,region,contrato,password_click,pass_apk)
                                            values (:identificacion, :nombre, :ciudad, :celular, :empresa,:login_click,:pass,:region,:contrato,:password_click,:pass_apk)");
    $stmt->execute(
        [
            ':identificacion' => '98628264',
            ':nombre' => 'GIRALDO ARROYAVE JORGE ANDRES',
            ':ciudad' => 'Antioquia Oriente',
            ':celular' => '30000000',
            ':empresa' => '4',
            ':login_click' => 'jgiraldoar',
            ':pass' => md5('Colombia8264--++'),
            ':region' => 'Antioquia Oriente',
            ':contrato' => 'Emtelco',
            ':password_click' =>  0,
            ':pass_apk' => 'Colombia8264--++'
        ]
    );

    $stmt = $conn->prepare("INSERT INTO tecnicos (identificacion, nombre, ciudad, celular, empresa,login_click,password,region,contrato,password_click,pass_apk)
                                            values (:identificacion, :nombre, :ciudad, :celular, :empresa,:login_click,:pass,:region,:contrato,:password_click,:pass_apk)");
    $stmt->execute(
        [
            ':identificacion' => '80773427',
            ':nombre' => 'CRISTANCHO PINZON LUIS CARIOS',
            ':ciudad' => 'Bogota',
            ':celular' => '30000000',
            ':empresa' => '4',
            ':login_click' => 'lcristpi',
            ':pass' => md5('Colombia3427--++'),
            ':region' => 'Cundinamarca Sur',
            ':contrato' => 'Energia Integral Andina',
            ':password_click' =>  0,
            ':pass_apk' => 'Colombia3427--++'
        ]
    );

    echo 'Se ingresaron en la fecha ' . date('Y-m-d H:i:s') . ' ' . $count + 20 . ' registros';
} else {
    echo 'No se ingresaron registros en bd sin gestionar fecha ' . date('Y-m-d H:i:s');
}

/*if ($count) {

    $stmt = $conn->prepare("INSERT INTO tecnicos_copy1 (identificacion, nombre, ciudad, celular, empresa,login_click,password,region,contrato,password_click,pass_apk)
                                            values (:identificacion, :nombre, :ciudad, :celular, :empresa,:login_click,:pass,:region,:contrato,:password_click,:pass_apk)");
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
        ]
    );
    echo 'Se ingresaron en la fecha ' . date('Y-m-d H:i:s') . ' ' . $count + 1 . ' registros';
} else {
    echo 'No se ingresaron registros en bd sin gestionar fecha ' . date('Y-m-d H:i:s');
}*/




