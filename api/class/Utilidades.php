<?php

require_once '../vendor/autoload.php';
require_once 'Constants.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class Utilidades
{
    public function validarJWT()
    {
        try {
            $headers = apache_request_headers();
            $arrayToken = explode(' ', $headers['Authorization']);
            $jwt = $arrayToken[1];

            $decoded = JWT::decode($jwt, new Key(SIGNATURE_JWT, 'HS256'));
            // var_dump($decoded);exit();
            if (isset($decoded->data->perfil) && isset($decoded->data->id) && isset($decoded->data->menu) && isset($decoded->data->login))
                return ['state' => true, 'jwt' => $jwt];

        } catch (\Firebase\JWT\ExpiredException $e) {
            return ['state' => false, 'jwt' => 'Token expirado'];
        } catch (\Exception $e) {
            return ['state' => false, 'jwt' => 'Token no válido'];
        }
    }
}