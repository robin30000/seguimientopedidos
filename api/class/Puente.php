<?php
set_time_limit(180);
class Puente
{
    public function servidorWindows($datos)
    {
        $ch  = curl_init();

            $url = "http://10.100.66.254/$datos";
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

            curl_setopt($ch, CURLOPT_URL, "$url");
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HEADER, 0);
            $data = curl_exec($ch);
            curl_close($ch);

        $dataclick = json_decode($data, true);
        echo json_encode($dataclick);

    }
}
