<?php
header('Content-Type: application/json');

$url = "https://seguimientopedido.tigo.com.co/soportecomercial-dev/api/Class/connectionGestion.php";

$data = json_decode(file_get_contents($url), true);

var_dump($data);exit();

$url = "json";
$xml = file_get_contents($url);
$prueba = json_decode($xml, true);
print_r($prueba);
exit();

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
exit();

curl_close($ch);

$dataclick = json_decode($data, true);

echo 'pepe' . var_dump($dataclick);
exit();
