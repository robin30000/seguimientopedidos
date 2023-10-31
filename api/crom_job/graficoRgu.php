<?php


error_reporting(E_ALL);
ini_set('display_errors', 1);

//echo  date('Y-m-d H:i:s');exit();

require_once '../class/conection.php';

$conn = new Conection();

//$val = 123;

$url = "http://10.100.66.254/HCHV_DEV1/graficoRgu/s";

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
var_dump($data);exit();
curl_close($ch);

$dataclick = json_decode($data, true);

echo "<pre>";
print_r($dataclick);
echo "</pre>";


$datos = $dataclick;
$total = count($datos);
$count = 0;

try {

    /*$stmt = $conn->query("DELETE FROM tecnicos_copy1");
    $stmt->execute();*/
    $nacional = 0;
    $andina   = 0;
    $costa    = 0;
    $bogota   = 0;
    $sur      = 0;

    for ($i = 0; $i < $total; $i++) {
        switch ($datos[$i]['Regiones']) {
            case 'Antioquia Centro':
            case 'Antioquia Norte':
            case 'Antioquia Oriente':
            case 'Antioquia Sur':
            case 'Antioquia_Edatel':
                $nacional += $datos[$i]['Cumplidos'];
                break;
            case 'Boyaca':
            case 'Norte de Santander':
            case 'Santander':
            case 'Boyaca_Edatel':
            case 'Santander_Edatel':
                $andina += $datos[$i]['Cumplidos'];
                break;
            case 'Atlantico':
            case 'Bolivar':
            case 'Magdalena':
            case 'Cesar':
            case 'Cordoba':
            case 'Sucre':
            case 'Bolivar_Edatel':
            case 'Cesar_Edatel':
            case 'Cordoba_Edatel':
            case 'Guajira':
            case 'Sucre_Edatel':
                $costa += $datos[$i]['Cumplidos'];
                break;
            case 'Cundinamarca':
            case 'Bogota':
                $bogota += $datos[$i]['Cumplidos'];
                break;
            case 'Meta':
            case 'Valle':
            case 'Cauca':
            case 'Nariño':
            case 'Caldas':
            case 'Quindio':
            case 'Risaralda':
            case 'Valle Quindío':
            case 'Tolima':
                $sur += $datos[$i]['Cumplidos'];
                break;

        }

    }

    $cumplidos = ($nacional + $sur + $andina + $costa + $bogota);
    echo 'Nacional: ' . $nacional . ' sur ' . $sur . ' Andina ' . $andina . ' Costa ' . $costa . ' Bogota ' . $bogota . ' Cumplidos ' . $cumplidos;
    exit();

} catch (PDOException $th) {
    var_dump($th->getMessage());
}

if ($count) {

    echo 'Se ingresaron en la fecha ' . date('Y-m-d H:i:s') . ' ' . $count + 1 . ' registros';
} else {
    echo 'No se ingresaron registros en bd sin gestionar fecha ' . date('Y-m-d H:i:s');
}




