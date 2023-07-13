<?php
require_once '../class/conection.php';

class gestionAprovisionamiento
{

    private $_DB;

    public function __construct()
    {
        $this->_DB = new Conection();
    }

    public function updateEnGestionResponse()
    {
        try {

            /*ini_set('session.gc_maxlifetime', 3600); // 1 hour
            session_set_cookie_params(3600);
            session_start();

            if (!$_SESSION) {
                $response = ['state' => 99, 'title' => 'Su session ha caducado', 'text' => 'Inicia session nuevamente para continuar'];
            } else {*/

                $hoy = date('Y-m-d');

                $stmt = $this->_DB->prepare("SELECT id,
                                                   engestion,
                                                   pedido,
                                                   observContingencia,
                                                   observContingenciaPortafolio,
                                                   (case when acepta is null then 'Pendiente' else acepta end)                     AS acepta,
                                                   (case when aceptaPortafolio is null then 'Pendiente' else aceptaPortafolio end) AS aceptaPortafolio
                                            FROM contingencias
                                            WHERE logindepacho = :login
                                              AND horagestion BETWEEN (:fechaini) AND (:fechafin)");

                $stmt->execute([':login' => $_SESSION['login'], ':fechaini' => "$hoy 00-00-00", ':fechafin' => "$hoy 23-59-59"]);

                if ($stmt->rowCount()) {
                    $response = array('state' => 1, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC));
                } else {
                    $response = array('state' => 0, 'msj' => 'No se encontraron registros');
                }
           /* }*/

        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }

        $this->_DB = '';
        echo json_encode($response);
    }

    public function updateEnGestion($data)
    {
        try {
            ini_set('session.gc_maxlifetime', 3600); // 1 hour
            session_set_cookie_params(3600);
            session_start();
            if (!$_SESSION) {
                $response = ['state' => 99, 'title' => 'Su session ha caducado', 'text' => 'Inicia session nuevamente para continuar'];
            } else {
                $login = $_SESSION['login'];
                $hoy = date("Y-m-d");

                                /* $query = "SELECT  observContingencia, observContingenciaPortafolio
                    FROM contingencias
                    WHERE logindepacho = '$login'
                    AND horagestion BETWEEN '$hoy 00:00:00' AND '$hoy 23:59:59'"; */
                    $query = "SELECT id, engestion, pedido, observContingencia, observContingenciaPortafolio,
                    (case when acepta is null then 'Pendiente' else acepta end) acepta,
                    (case when aceptaPortafolio is null then 'Pendiente' else aceptaPortafolio end) aceptaPortafolio
                    FROM contingencias
                    WHERE logindepacho = '$login'
                    AND horagestion BETWEEN ('$hoy 00:00:00') AND ('$hoy 23:59:59')";

                $stmt = $this->_DB->query($query);

                if ($stmt->rowCount() > 0) {
                    $response = array('state' => 1, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC));
                } else {
                    $response = array('state' => 0, 'msj' => 'No se encontraron registros');

                }
            }
        } catch (PDOException $th) {
            var_dump($th->getMessage());
        }
        $this->_DB = '';
        echo json_encode($response);
    }
}
