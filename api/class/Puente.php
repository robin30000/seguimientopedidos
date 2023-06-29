<?php
require_once '../class/conection.php';

class Puente
{


    public function servidorWindows($data)
    {

        //$link = $data['datos'];

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, "http://10.100.66.254/visitas-terreno/api/ventaPedido/1-65088576223326");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        $data = curl_exec($ch);
        curl_close($ch);

        $dataclick = json_decode($data, TRUE);

        echo json_encode($dataclick);


        /* $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, "http://10.100.66.254:8080/$link");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        $data = curl_exec($ch);
        curl_close($ch);
        $dataclick = json_decode($data, TRUE);
        echo json_encode($dataclick); */
    }
}