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

            $arrayToken = explode(' ', $_SERVER["HTTP_AUTHORIZATION"]);
            $jwt = $arrayToken[1];

            $decoded = JWT::decode($jwt, new Key(SIGNATURE_JWT, 'HS256'));
            $decoded->exp = time() + 60;
            if (isset($decoded->data->perfil) && isset($decoded->data->id) && isset($decoded->data->login))
                return ['state' => true, 'jwt' => $jwt];

        } catch (\Firebase\JWT\ExpiredException $e) {
            return ['state' => false, 'jwt' => 'Token expirado'];
        } catch (\Exception $e) {
            return ['state' => false, 'jwt' => 'Token no válido'];
        }
    }
}