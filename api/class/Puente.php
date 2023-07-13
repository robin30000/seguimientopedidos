<?php

class Puente
{
    public function servidorWindows($datos)
    {

       /* if ($datos == 'api/exportrrhh') {
            $url  = "http://10.100.66.254:7771/api/exportrrhh";
            $curl = curl_init();
            curl_setopt($curl, CURLOPT_URL, $url);
            curl_setopt($curl, CURLOPT_HTTPGET, true);
            $data = curl_exec($curl);
            curl_close($curl);
        } else {*/
            $url = "http://10.100.66.254/$datos";
            $ch  = curl_init();
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

            curl_setopt($ch, CURLOPT_URL, "$url");
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HEADER, 0);
            $data = curl_exec($ch);
            curl_close($ch);

        /*}*/

        $dataclick = json_decode($data, true);
        echo json_encode($dataclick);

    }
}
