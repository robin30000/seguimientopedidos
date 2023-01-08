<?php

class bfObservacion
{
    public function BFobservaciones() {

        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }

        $params = json_decode(file_get_contents('php://input'), true);

        $login = $params['login'];
        $login = $login['LOGIN'];

        $this->dbSeguimientoConnect();

        $hoy = date("Y-m-d");

        $query = ("
					SELECT PedidoDespacho, observacionAsesor, pedidobloqueado, gestionAsesor, estado, AccionDespacho
						FROM BrutalForce
						WHERE loginDespacho = '$login'
						AND (FechaGestionDespacho BETWEEN ('$hoy 00:00:00') AND ('$hoy 23:59:59') OR fechagestionAsesor BETWEEN ('$hoy 00:00:00') AND ('$hoy 23:59:59'))
				");

        $rst = $this->connseguimiento->query(utf8_decode($query));

        if ($rst->num_rows > 0) {

            $resultado = array();

            while ($row = $rst->fetch_assoc()) {
                $row['observacionAsesor'] = utf8_encode($row['observacionAsesor']);
                $resultado[] = $row;
            }
            $this->response($this->json(array($resultado)), 201);
        } else {
            $error = array();

            $this->response($this->json($error), 400);
        }
    }

}
