<?php
require_once 'conection.php';
error_reporting(E_ALL);

//ini_set('display_errors', 1);
class Ruteo
{

    private $_DB;

    public function __construct()
    {
        $this->_DB = new Conection();
    }

    public function cargaData($data)
    {
        try {

            if (isset($data['anio'])) {
                $anio = $data['anio'];
                if ($anio === date('Y-m-d')) {
                    $primerDiaMesActual = date('Y-m-01', strtotime($anio));
                    $anioConsulta       = date('Y-m-d', strtotime('-1 month', strtotime($primerDiaMesActual)));
                    $ultimoDiaMes       = date('Y-m-t', strtotime($anioConsulta));
                } else {
                    $fecha        = DateTime::createFromFormat('Y-n-j', $anio);
                    $anio         = $fecha->format('Y-m-d');
                    $anio         = date('Y-m-d', strtotime('+1 month', strtotime($anio)));
                    $anioConsulta = date('Y-m-01', strtotime($anio));
                    $ultimoDiaMes = date('Y-m-t', strtotime($anioConsulta));
                }
            } else {
                $anio         = date('Y-m-d');
                $anioConsulta = date('Y-m-01', strtotime($anio));
                $anioConsulta = date('Y-m-d', strtotime('-1 month', strtotime($anioConsulta)));
                $ultimoDiaMes = date('Y-m-t', strtotime($anioConsulta));
            }

            if (isset($data['area'])) {
                $areas = $data['area'];

                $case = "CASE ";
                $con  = "";

                foreach ($areas as $area) {
                    $a .= "'$area', ";
                }
                $as  = rtrim($a, ', ');
                $con = " AND area IN ($as)";
            }

            $mes = $this->mesEspanol($anioConsulta);

            $stmt = $this->_DB->query("SELECT '$mes' as mes, '$anioConsulta' as fechaIni,
                                                    '$ultimoDiaMes' as fechaFin,area,
                                                    area,
                                                    SUM(asignados) AS total_asignados,
                                                    SUM(abiertas) AS total_abiertas,
                                                    SUM(asignados) + SUM(abiertas) AS total_asignados_y_abiertas FROM historico WHERE 1=1 $con 

                                                    AND fecha BETWEEN '$anioConsulta 00:00:00' AND '$ultimoDiaMes 23:59:59'
                                                    GROUP BY
                                                        area
                                                    ORDER BY
                                                        area;");


            /*if (isset($data['area'])) {
                $area = $data['area'];
                if ($area == 'Nacional') {
                    $case  = " area1 AS area, ";
                    $con   = " area1 = '$area' ";
                    $group = " GROUP BY
                                    mes
                                ORDER BY
                                    mes DESC,
                                area; ";
                } elseif ($area == 'Todos') {
                    $case  = " CASE
                        WHEN area IS NULL THEN 'Nacional'
                            ELSE area
                        END AS area, ";
                    $con   = " area IN ('Centro', 'Sur', 'Eje cafetero', 'Edatel', 'Norte', 'Oriente') ";
                    $group = " GROUP BY
                            mes,
                            area WITH ROLLUP
                        HAVING
                            (area IS NOT NULL OR mes IS NULL)
                        ORDER BY
                            mes DESC,
                            area; ";
                } else {
                    $case  = " area, ";
                    $con   = " area = '$area' ";
                    $group = " GROUP BY
                                    mes
                                ORDER BY
                                    mes DESC,
                                area; ";
                }
            } else {
                $case  = " CASE
                        WHEN area IS NULL THEN 'Nacional'
                            ELSE area
                        END AS area, ";
                $con   = " area IN ('Centro', 'Sur', 'Eje cafetero', 'Edatel', 'Norte', 'Oriente') ";
                $group = " GROUP BY
                            mes,
                            area WITH ROLLUP
                        HAVING
                            (area IS NOT NULL OR mes IS NULL)
                        ORDER BY
                            mes DESC,
                            area; ";
            }*/


            /*            $stmt = $this->_DB->query("SELECT
                                                                '$anioConsulta' as fechaIni,
                                                                '$ultimoDiaMes' as fechaFin,
                                                                $case
                                                                CASE
                                                                    WHEN mes IS NULL THEN '$mes'
                                                                    ELSE mes
                                                                END AS mes,
                                                                SUM(asignados) AS total_asignados,
                                                                SUM(abiertas) AS total_abiertas,
                                                                SUM(asignados) + SUM(abiertas) AS total_asignados_y_abiertas
                                                            FROM
                                                                historico
                                                            WHERE
                                                                $con
                                                                AND CAST(CONCAT(fecha, '-', LPAD(mes, 2, '0'), '-01') AS DATE) >= '$anioConsulta'
                                                                AND CAST(CONCAT(fecha, '-', LPAD(mes, 2, '0'), '-01') AS DATE) <= '$ultimoDiaMes'
                                                            $group");*/
            $stmt->execute();

            if ($stmt->rowCount()) {
                $response = ['state' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)];
            } else {
                $response = ['state' => false, 'msj' => 'No se encontraron datos'];
            }

            $this->_DB = null;

            return $response;
        } catch
        (PDOException $e) {
            var_dump($e->getMessage());
        }
    }

    public function dataCompara($data)
    {
        try {

            if (isset($data['anio'])) {
                $anio = $data['anio'];
                if ($anio === date('Y-m-d')) {
                    $primerDiaMesActual = date('Y-m-01', strtotime($anio));
                    $anioConsulta       = date('Y-m-d', strtotime('-1 month', strtotime($primerDiaMesActual)));
                    $ultimoDiaMes       = date('Y-m-t', strtotime($anioConsulta));
                } else {
                    $fecha             = DateTime::createFromFormat('Y-n-j', $anio);
                    $anio              = $fecha->format('Y-m-d');
                    $anio              = date('Y-m-d', strtotime('+1 month', strtotime($anio)));
                    $anioConsulta      = date('Y-m-01', strtotime($anio));
                    $primerFecha       = date('Y-m-d', strtotime('-1 month', strtotime($anioConsulta)));
                    $ultimoDiaMes      = date('Y-m-t', strtotime($anioConsulta));
                    $ultimoDiaFechaIni = date('Y-m-t', strtotime($primerFecha));

                    //echo $primerFecha.'-'.$ultimoDiaFechaIni.'-'.$anioConsulta.'-'.$ultimoDiaMes;exit();
                }
            } else {
                $anio              = date('Y-m-d');
                $anioConsulta      = date('Y-m-01', strtotime($anio));
                $primerFecha       = date('Y-m-d', strtotime('-2 month', strtotime($anioConsulta)));
                $anioConsulta      = date('Y-m-d', strtotime('-1 month', strtotime($anioConsulta)));
                $ultimoDiaMes      = date('Y-m-t', strtotime($anioConsulta));
                $ultimoDiaFechaIni = date('Y-m-t', strtotime($primerFecha));
            }

            /*echo $primerFecha . '-' . $ultimoDiaMes . '-' . $ultimoDiaFechaIni . '-' . $anioConsulta;
            exit();*/

            $mes       = $this->mesEspanol($anioConsulta);
            $mesPrimer = $this->mesEspanol($primerFecha);

            $stmt = $this->_DB->query("SELECT
                                                    '$primerFecha' as fechaIni,
                                                    '$ultimoDiaMes' as fechaFin,
                                                    area,
                                                    mes,
                                                    SUM(asignados) AS total_asignados,
                                                    SUM(abiertas) AS total_abiertas,
                                                    SUM(asignados) + SUM(abiertas) AS total_asignados_y_abiertas,
                                                    ROUND(SUM(asignados) / (SUM(asignados) + SUM(abiertas)) * 100) AS porcentaje_asignados,
                                                    ROUND(SUM(abiertas) / (SUM(asignados) + SUM(abiertas)) * 100) AS porcentaje_abiertas
                                                FROM
                                                    historico 
                                                WHERE
                                                    area IN ('Centro', 'Sur', 'Eje cafetero', 'Edatel', 'Norte', 'Oriente') 
                                                    AND (
                                                        (CAST(CONCAT(fecha, '-', LPAD(mes, 2, '0'), '-01') AS DATE) >= '$primerFecha' 
                                                        AND CAST(CONCAT(fecha, '-', LPAD(mes, 2, '0'), '-01') AS DATE) <= '$ultimoDiaMes')
                                                    )
                                                GROUP BY
                                                    area, mes
                                                
                                                UNION
                                                
                                                SELECT
                                                    '$primerFecha' as fechaIni,
                                                    '$ultimoDiaMes' as fechaFin,
                                                    'Nacional' AS area,
                                                    '$mes' AS mes,
                                                    SUM(asignados) AS total_asignados,
                                                    SUM(abiertas) AS total_abiertas,
                                                    SUM(asignados) + SUM(abiertas) AS total_asignados_y_abiertas,
                                                    ROUND(SUM(asignados) / (SUM(asignados) + SUM(abiertas)) * 100) AS porcentaje_asignados,
                                                    ROUND(SUM(abiertas) / (SUM(asignados) + SUM(abiertas)) * 100) AS porcentaje_abiertas
                                                FROM historico
                                                WHERE area IN ('Centro', 'Sur', 'Eje cafetero', 'Edatel', 'Norte', 'Oriente') 
                                                    AND CAST(CONCAT(fecha, '-', LPAD(mes, 2, '0'), '-01') AS DATE) >= '$anioConsulta'
                                                    AND CAST(CONCAT(fecha, '-', LPAD(mes, 2, '0'), '-01') AS DATE) <= '$ultimoDiaMes'
                                                
                                                UNION
                                                
                                                SELECT
                                                    '$primerFecha' as fechaIni,
                                                    '$ultimoDiaMes' as fechaFin,
                                                    'Nacional' AS area,
                                                    '$mesPrimer' AS mes,
                                                    SUM(asignados) AS total_asignados,
                                                    SUM(abiertas) AS total_abiertas,
                                                    SUM(asignados) + SUM(abiertas) AS total_asignados_y_abiertas,
                                                    ROUND(SUM(asignados) / (SUM(asignados) + SUM(abiertas)) * 100) AS porcentaje_asignados,
                                                    ROUND(SUM(abiertas) / (SUM(asignados) + SUM(abiertas)) * 100) AS porcentaje_abiertas
                                                FROM historico
                                                WHERE area IN ('Centro', 'Sur', 'Eje cafetero', 'Edatel', 'Norte', 'Oriente') 
                                                    AND CAST(CONCAT(fecha, '-', LPAD(mes, 2, '0'), '-01') AS DATE) >= '$primerFecha'
                                                    AND CAST(CONCAT(fecha, '-', LPAD(mes, 2, '0'), '-01') AS DATE) <= '$ultimoDiaFechaIni'
                                                
                                                ORDER BY
                                                    area, mes DESC;");
            $stmt->execute();

            if ($stmt->rowCount()) {
                $response = ['state' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)];
            } else {
                $response = ['state' => false, 'msj' => 'No se encontraron datos'];
            }

            $this->_DB = null;

            return $response;
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
    }

    public function analisisDia($data)
    {
        try {
            if (isset($data)) {
                $fecha = $data;
            } else {
                $fecha = date('Y-m-d');
            }
            $stmt = $this->_DB->prepare("SELECT 
                                                    area,
                                                    '$fecha' as fecha,
                                                    mes,
                                                    SUM(asignados) AS total_asignados,
                                                    SUM(abiertas) AS total_abiertas,
                                                    SUM(asignados) + SUM(abiertas) AS total_asignados_y_abiertas,
                                                    ROUND(SUM(asignados) / (SUM(asignados) + SUM(abiertas)) * 100) AS porcentaje_asignados,
                                                    ROUND(SUM(abiertas) / (SUM(asignados) + SUM(abiertas)) * 100) AS porcentaje_abiertas 
                                                FROM
                                                    historico
                                                WHERE
                                                    fecha = '$fecha'
                                                GROUP BY area, mes
                                                
                                                UNION
                                                
                                                SELECT 
                                                    'Nacional' AS area,
                                                    '$fecha' as fecha,
                                                    mes,
                                                    SUM(asignados) AS total_asignados,
                                                    SUM(abiertas) AS total_abiertas,
                                                    SUM(asignados) + SUM(abiertas) AS total_asignados_y_abiertas,
                                                    ROUND(SUM(asignados) / (SUM(asignados) + SUM(abiertas)) * 100) AS porcentaje_asignados,
                                                    ROUND(SUM(abiertas) / (SUM(asignados) + SUM(abiertas)) * 100) AS porcentaje_abiertas 
                                                FROM
                                                    historico
                                                WHERE
                                                    fecha = '$fecha'
                                                GROUP BY mes
                                                ORDER BY area, mes;");
            $stmt->execute();
            if ($stmt->rowCount()) {
                $response = ['state' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)];
            } else {
                $response = ['state' => false, 'msj' => 'No se encontraron registros'];
            }
            $this->_DB = '';

            return $response;
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
    }

    private function mesEspanol($fecha)
    {

        $fechaDateTime = new DateTime($fecha);

        $nombreMes = $fechaDateTime->format('F');

        $mesesEnEspanol = [
            'January'   => 'Enero',
            'February'  => 'Febrero',
            'March'     => 'Marzo',
            'April'     => 'Abril',
            'May'       => 'Mayo',
            'June'      => 'Junio',
            'July'      => 'Julio',
            'August'    => 'Agosto',
            'September' => 'Septiembre',
            'October'   => 'Octubre',
            'November'  => 'Noviembre',
            'December'  => 'Diciembre',
        ];

        $nombreMesEnEspanol = $mesesEnEspanol[$nombreMes];

        return $nombreMesEnEspanol;
    }

}
