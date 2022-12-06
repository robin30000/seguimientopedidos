<?php
require_once '../class/conection.php';
class modelOtrosServicios
{
    private $_DB;

    public function __construct()
    {
        $this->_DB = new Conection();
    }


    public function DepartamentosContratos($data)
    {
        try{
            $mesenviado = $data;

            if ($mesenviado == "" || $mesenviado == undefined) {

                $query = $this->_DB->query("select max(fecha_instalacion) fecha from nps ");
                $fecha = date("Y-m-d");

                if ($query->rowCount()) {
                    if ($row = $query->fetchAll(PDO::FETCH_ASSOC)) {
                        $fecha = $row['fecha'];
                    }
                }

                $dia  = substr($fecha, 8, 2);
                $mes  = substr($fecha, 5, 2);
                $anio = substr($fecha, 0, 4);

                $nom_mes   = date('M', mktime(0, 0, 0, $mes, $dia, $anio));
                $semana    = "Semana " . date('W', mktime(0, 0, 0, $mes, $dia, $anio));
                $diaSemana = date("w", mktime(0, 0, 0, $mes, $dia, $anio));

            } else {
                $nom_mes   = $mesenviado;
                $semana    = "Semana " . date('W', mktime(0, 0, 0, $mes, $dia, $anio));
                $diaSemana = date("w", mktime(0, 0, 0, $mes, $dia, $anio));
            }

            $sql = $this->_DB->prepare("select gen.regional, round((select count(num_respuesta) 
                from nps  
                where num_respuesta = '5' and num_pregunta = '4' and contratista = 'EIA' 
                and regional = gen.regional and mes=gen.mes)/ 
                (select count(num_respuesta) from nps where num_respuesta = '5' and num_pregunta = '4'  
                and regional = gen.regional and mes=gen.mes)*100, 2)as EIA,  
                round((select count(num_respuesta) from nps 
                where num_respuesta = '5' and num_pregunta = '4' and contratista = 'Conavances' 
                and regional = gen.regional and mes=gen.mes)/ 
                (select count(num_respuesta) from nps where num_respuesta = '5' and num_pregunta = '4'  
                and regional = gen.regional and mes=gen.mes)*100, 2) as Conavances,  
                round((select count(num_respuesta) from nps  
                where num_respuesta = '5' and num_pregunta = '4' and contratista = 'EAGLE' 
                and regional = gen.regional and mes=gen.mes)/ 
                (select count(num_respuesta) from nps where num_respuesta = '5' and num_pregunta = '4' 
                and regional = gen.regional and mes=gen.mes)*100, 2) as EAGLE, 
                round((select count(num_respuesta) from nps 
                where num_respuesta = '5' and num_pregunta = '4' and contratista = 'EMT' 
                and regional = gen.regional and mes=gen.mes)/ 
                (select count(num_respuesta) from nps where num_respuesta = '5' and num_pregunta = '4'  
                and regional = gen.regional and mes=gen.mes)*100, 2) as EMT,  
                round((select count(num_respuesta) from nps  
                where num_respuesta = '5' and num_pregunta = '4' and contratista = 'RYE' 
                and regional = gen.regional and mes=gen.mes)/ 
                (select count(num_respuesta) from nps where num_respuesta = '5' and num_pregunta = '4' 
                and regional = gen.regional and mes=gen.mes)*100, 2) as RYE, 
                round((select count(num_respuesta) from nps 
                where num_respuesta = '5' and num_pregunta = '4' and contratista = 'SERVTEK' 
                and regional = gen.regional and mes=gen.mes)/ 
                (select count(num_respuesta) from nps where num_respuesta = '5' and num_pregunta = '4'  
                and regional = gen.regional and mes=gen.mes)*100, 2) as SERVTEK 
                from nps gen where  contratista = gen.contratista 
                and mes = :mes
                group by gen.regional order by regional desc ");
            $sql->execute([':mes'=>$nom_mes]);

            $resultadodptoContrato = [];

            if ($sql->rowCount()) {

                $dptos      = [];
                $eia        = [];
                $conavances = [];
                $eagle      = [];
                $emt        = [];
                $rye        = [];
                $servtek    = [];

                while ($row = $sql->fetchAll(PDO::FETCH_ASSOC)) {
                    $row['regional']         = utf8_encode($row['regional']);
                    $label                   = $row['regional'];
                    $resultadodptoContrato[] = $row;
                    $deptoeia                = $row['EIA'];
                    $deptocona               = $row['Conavances'];
                    $deptoeagle              = $row['EAGLE'];
                    $deptoemt                = $row['EMT'];
                    $deptorye                = $row['RYE'];
                    $deptoservt              = $row['SERVTEK'];

                    $dptos[]      = ["label" => "$label"];
                    $eia[]        = ["value" => "$deptoeia"];
                    $conavances[] = ["value" => "$deptocona"];
                    $eagle[]      = ["value" => "$deptoeagle"];
                    $emt[]        = ["value" => "$deptoemt"];
                    $rye[]        = ["value" => "$deptorye"];
                    $servtek[]    = ["value" => "$deptoservt"];
                }

                $query = $this->_DB->prepare("select gen.contratista contratista, 
                    round((select count(respuesta) 
                    from nps  
                    where num_respuesta = '5' and num_pregunta = '4'  and contratista = gen.contratista  
                    and mes=gen.mes)/  
                    (select count(pregunta)   
                    from nps where contratista = gen.contratista and num_pregunta = '4'  
                    and mes=gen.mes)*100, 2) as SI  
                    from nps gen  
                    where mes= :mes 
                    group by gen.contratista  order by  contratista");
                $query->execute([':mes'=>$nom_mes]);

                $contratos = [];

                while ($row = $query->fetchAll(PDO::FETCH_ASSOC)) {
                    $label       = utf8_encode($row['contratista']);
                    $rescontrato = $row['SI'];

                    $contratos[] = ["label" => "$label", "value" => "$rescontrato"];
                }

                $response=[$resultadodptoContrato, $dptos, $eia, $conavances, $eagle, $emt, $rye, $servtek, $contratos,201];

            } else {
                $response = [0,400];
            }
        }catch (PDOException $e){
            var_dump($e->getMessage());
        }
        echo json_encode($response);
    }

    public function insertData($data)
    {
        try {
            $datos = $data;
            $fecha = $datos['fecha'];
            $uen = $datos['uen'];
            $tipotrabajo = $datos['tipo_trabajo'];
            $ciudad = $datos['CIUDAD'];
            $mes = date("m", strtotime($fecha));
            $año = date("Y", strtotime($fecha));
            $sep = "";
            $ciudades = "";
            $bandera = 0;
            $bandera1 = 0;

            if ($ciudad == null) {
                $ciudad = "";
            } else {
                $total = count($ciudad);
                for ($i = 0; $i < $total; $i++) {

                    if ($valida = strpos($ciudad[$i], '_DEPA') !== false) {
                        $bandera = $bandera + 1;
                        $ciudades = $ciudades . $sep . "'" . str_replace("_DEPA", "", $ciudad[$i]) . "'";
                    } else {
                        $bandera1 = $bandera1 + 1;
                        $ciudades = $ciudades . $sep . "'" . $ciudad[$i] . "'";
                    }
                    $sep = ",";
                }
            }

            if ($bandera > 0 && $bandera1 == 0) {
                $ciudades = "and departamento in (" . $ciudades . ")";
            } elseif ($bandera == 0 && $bandera1 > 0) {
                $ciudades = "and ciudad in (" . $ciudades . ")";
            } else {
                $ciudades = "";
            }

            if ($fecha == "") {
                $fecha = date("Y") . "-" . date("m") . "-" . date("d");
            }

            if ($uen != "") {
                $uen = "and uen = '$uen'";
            } else {
                $uen = "";
            }
            if ($tipotrabajo != "") {
                $tipo_trabajo = "and tipo_trabajo = '$tipotrabajo'";
                $tipo_trabajo1 = "and (select tipo_trabajo from carga_click where pro.pedido_id = pedido_id limit 1) = '$tipotrabajo'";
            } else {
                $tipo_trabajo = "";
                $tipo_trabajo1 = "";
            }

            //truncate table
            $query = $this->_DB->query("TRUNCATE TABLE jornada_estados");

            //insert jornadaID
            $query = $this->_DB->query("INSERT INTO jornada_estados 
                (`id_jornada`) VALUES ('AM'),('PM'),('HF'),('TOTAL'),('DIFERENCIA'); ");

            //carga de agendados
            $sqlcarga = $this->_DB->prepare("select count(pro.jornada_cita) total_jornada, 
                (case 
                when pro.jornada_cita = 'AM' then 'AM' 
                when pro.jornada_cita = 'PM' then 'PM' 
                else 'HF' 
                end) jornada, (select count(pro.jornada_cita) from carga_agenda pro 
                where pro.fecha_cita BETWEEN (:fecha1) AND (:fecha2) 
                :uen :tipotrabajo1 :ciudades) TOTAL,
                (select count(pro.pedido_id) 
                from carga_agenda pro 
                where pro.fecha_cita BETWEEN (:fecha1) AND (:fecha2) 
                and pro.pedido_id not in (select pedido_id from carga_click 
                where fecha_cita BETWEEN (:fecha1) AND (:fecha2)) 
                :uen :tipotrabajo1 :ciudades) DIFERENCIA
                from carga_agenda pro 
                where pro.fecha_cita BETWEEN (:fecha1) AND (:fecha2)
                :uen :tipotrabajo1 :ciudades
                group by jornada");
            //echo $sqlcarga;
            $sqlcarga->execute([':uen' => $uen, ':tipotrabajo1' => $tipo_trabajo1, ':ciudades' => $ciudades, ':fecha1' => "$fecha 00:00:00", ':fecha2' => "$fecha 23:59:59"]);

            while ($row = $sqlcarga->fetchAll(PDO::FETCH_ASSOC)) {

                $total_jornada = $row['total_jornada'];
                $jornada = $row['jornada'];
                $diferencia = $row['DIFERENCIA'];
                $total_carga = $total_carga + $total_jornada;
                $sqlupdate = $this->_DB->prepare("UPDATE jornada_estados SET `agendados`=:total_jornada WHERE `id_jornada`=:jornada ");

                $sqlupdate->execute([':total_jornada' => $total_jornada, ':jornada' => $jornada]);
            }
            $sqlupdate = $this->_DB->prepare("UPDATE jornada_estados SET `agendados`=:total_carga WHERE `id_jornada`='TOTAL'");
            $sqlupdate->execute([':total_carga' => $total_carga]);

            $sqlupdate1 = $this->_DB->prepare("UPDATE jornada_estados SET `agendados`=:diferencia WHERE `id_jornada`='DIFERENCIA'");
            $sqlupdate1->execute([':diferencia' => $diferencia]);

            //carga de agendados y click
            $sqlvistaClik = $this->_DB->prepare("select count(pro.jornada_cita) total_jornada,   
                (case when pro.jornada_cita = 'AM' then 'AM' 
                when pro.jornada_cita = 'PM' then 'PM' 
                else 'HF' end) jornada, 
                (select count(pro.jornada_cita) total_jornada 
                from carga_click pro 
                where pro.fecha_cita BETWEEN (:fecha1) AND (:fecha2) 
                and pro.pedido_id in (select pedido_id from carga_agenda 
                where fecha_cita BETWEEN (:fecha1) AND (:fecha2)) 
                :uen :tipotrabajo :ciudades) TOTAL, 

                (select count(pro.pedido_id) 
                from carga_click pro 
                where pro.fecha_cita BETWEEN (:fecha1) AND (:fecha2) 
                and pro.pedido_id not in (select pedido_id from carga_agenda  
                where fecha_cita BETWEEN (:fecha1) AND (:fecha2)) :uen :tipotrabajo :ciudades) DIFERENCIA 

                from carga_click pro 
                where pro.fecha_cita BETWEEN (:fecha1) AND (:fecha2) 
                and pro.pedido_id in (select pedido_id from carga_agenda 
                where fecha_cita BETWEEN (:fecha1) AND (:fecha2)) 
                :uen :tipotrabajo :ciudades group by jornada");
            $sqlvistaClik->execute([':uen' => $uen, ':tipotrabajo' => $tipo_trabajo, ':ciudades' => $ciudades, ':fecha1' => "$fecha 00:00:00", ':fecha2' => "$fecha 23:59:59"]);
            //echo $sqlvistaClik;
            while ($row = $sqlvistaClik->fetchAll(PDO::FETCH_ASSOC)) {

                $total_jornada = $row['total_jornada'];
                $jornada = $row['jornada'];
                $diferencia = $row['DIFERENCIA'];
                $total_cargaclick = $total_cargaclick + $total_jornada;
                $sqlupdateclick = $this->_DB->prepare("UPDATE jornada_estados SET `vista_click`='$total_jornada' WHERE `id_jornada`=:jornada");
                $sqlupdateclick->execute([':jornada' => $jornada]);
            }
            $sqlupdateclicktotal = $this->_DB->query("UPDATE jornada_estados SET `vista_click`='$total_cargaclick' WHERE `id_jornada`='TOTAL'");
            $sqlupdatedif = $this->_DB->query("UPDATE jornada_estados SET `vista_click`='$diferencia' WHERE `id_jornada`='DIFERENCIA'");

            //carga de agendados y click confirmados
            $sqlconfirmados = $this->_DB->prepare("select sum(a.totales) as totales, a.jornada_cita,
                (select sum(b.totales) as totales from (select count(distinct reg.pedido) totales 
                from registros reg, carga_agenda pro   
                where pro.pedido_id in (select pedido_id from carga_click 
                where fecha_cita BETWEEN (:fecha1) AND (:fecha2)) 
                and pro.pedido_id = reg.pedido  
                and accion = 'Visita confirmada' 
                and reg.fecha BETWEEN (:fecha1) AND (:fecha2) 
                and pro.fecha_cita BETWEEN (:fecha1) AND (:fecha2) 
                :uen :tipotrabajo1 :ciudades)b ) 
                as TOTAL, 

                (select count(distinct pedido_id) 
                from carga_click pro 
                where pro.fecha_cita BETWEEN (:fecha1) AND (:fecha2) 
                and pro.pedido_id not in (select pedido_id from carga_agenda 
                where fecha_cita BETWEEN (:fecha1) AND (:fecha2)) 
                and pro.pedido_id in (select pedido from registros where 
                accion = 'Visita confirmada' 
                and fecha BETWEEN (:fecha1) AND (:fecha2)) 
                and pro.fecha_cita BETWEEN (:fecha1) AND (:fecha2) 
                :uen :tipotrabajo1 :ciudades) DIFERENCIA 

                from (select count(distinct reg.pedido) totales,
                (case when pro.jornada_cita = 'AM' then 'AM' 
                when pro.jornada_cita = 'PM' then 'PM' 
                else 'HF' 
                end) jornada_cita 
                from registros reg, carga_agenda pro  
                where pro.pedido_id in (select pedido_id from carga_click
                where fecha_cita BETWEEN (:fecha1) AND (:fecha2))
                and pro.pedido_id = reg.pedido  
                and accion = 'Visita confirmada' 
                and reg.fecha BETWEEN (:fecha1) AND (:fecha2) 
                and pro.fecha_cita BETWEEN (:fecha1) AND (:fecha2)
               :uen :tipotrabajo1 :ciudades
                group by jornada_cita) a 
                group by a.jornada_cita");

            $sqlconfirmados->execute([':uen' => $uen, ':tipotrabajo1' => $tipo_trabajo1, ':ciudades' => $ciudades, ':fecha1' => "$fecha 00:00:00", ':fecha2' => "$fecha 23:59:59"]);

            while ($row = $sqlconfirmados->fetchAll(PDO::FETCH_ASSOC)) {

                $total_jornada = $row['totales'];
                $jornada = $row['jornada_cita'];
                $diferencia = $row['DIFERENCIA'];
                $total_cargaconfirmados = $total_cargaconfirmados + $total_jornada;
                $sqlupdatecoonfirma = $this->_DB->prepare("UPDATE jornada_estados SET `confirmados`='$total_jornada' WHERE `id_jornada`=:jornada ");
                $sqlupdatecoonfirma->execute([':jornada']);
            }
            $sqlupdateconfirmatotal = $this->_DB->prepare("UPDATE jornada_estados SET `confirmados`='$total_cargaconfirmados' WHERE `id_jornada`='TOTAL' ");
            $sqlupdatedif = $this->_DB->prepare("UPDATE jornada_estados SET `confirmados`=:diferencia WHERE `id_jornada`='DIFERENCIA'");
            $sqlupdatedif->execute([':diferencia']);
            //sin gestionar
            $sqlnogestion =$this->_DB->prepare( "select count(pedido_id) pendientes, (case when jornada_cita = 'AM' then 'AM' 
                when jornada_cita = 'PM' then 'PM' 
                else 'HF' 
                end) jornada_cita, 
                (select count(pedido_id) pendientes 
                from carga_agenda  pro 
                where pedido_id not in (select pedido from registros where fecha BETWEEN (:fecha1) AND (:fecha2) ) 
                and fecha_cita  BETWEEN (:fecha1) AND (:fecha2) 
                and pedido_id in (select pedido_id from carga_click  
                where fecha_cita BETWEEN (:fecha1) AND (:fecha2) )  :uen :tipotrabajo1 :ciudades) TOTAL, 

                (select count(pedido_id) 
                from carga_click 
                where pedido_id not in (select pedido from registros 
                where fecha BETWEEN (:fecha1) AND (:fecha2) ) 
                and fecha_cita BETWEEN (:fecha1) AND (:fecha2)  
                and pedido_id not in (select pedido_id from carga_agenda 
                where fecha_cita BETWEEN (:fecha1) AND (:fecha2) )  :uen :tipotrabajo1 :ciudades) DIFERENCIA 

                from carga_agenda  pro 
                where pedido_id not in (select pedido from registros where fecha BETWEEN ('$fecha 00:00:00') AND ('$fecha 23:59:59')) 
                and fecha_cita BETWEEN (:fecha1) AND (:fecha2)  
                and pedido_id in (select pedido_id from carga_click  
                where fecha_cita  BETWEEN (:fecha1) AND (:fecha2) ) 
                :uen :tipotrabajo1 :ciudades 
                group by (case when jornada_cita = 'AM' then 'AM' 
                when jornada_cita = 'PM' then 'PM' 
                else 'HF' end) ");

            $sqlnogestion->execute([':uen' => $uen, ':tipotrabajo1' => $tipo_trabajo1, ':ciudades' => $ciudades, ':fecha1' => "$fecha 00:00:00", ':fecha2' => "$fecha 23:59:59"]);

            while ($row = $sqlnogestion->fetchAll(PDO::FETCH_ASSOC)) {

                $total_jornada        = $row['pendientes'];
                $jornada              = $row['jornada_cita'];
                $diferencia           = $row['DIFERENCIA'];
                $total_carganogestion = $total_carganogestion + $total_jornada;
                $sqlupdatenogestion   =$this->_DB->prepare( "UPDATE jornada_estados SET `no_gestionados`=:total_jornada WHERE `id_jornada`=:jornada ");
                $sqlupdatenogestion->execute([':total_jornada'=>$total_jornada,':jornada'=>$jornada]);
            }
            $sqlupdatenogestiontotal =$this->_DB->prepare( "UPDATE jornada_estados SET `no_gestionados`=:total_carganogestion WHERE `id_jornada`='TOTAL' ");
            $sqlupdatenogestiontotal->execute([':total_carganogestion'=>$total_carganogestion]);
            $sqlupdatedif            = $this->_DB->prepare("UPDATE jornada_estados 
                SET `no_gestionados`=:diferencia WHERE `id_jornada`='DIFERENCIA' ");
            $sqlupdatedif->execute([':diferencia'=>$diferencia]);

            //finalizados de click
            $sqlfinalizadosclick =$this->_DB->prepare( "select count(pro.jornada_cita) total_jornada, 
                (case when pro.jornada_cita = 'AM' then 'AM'  
                when pro.jornada_cita = 'PM' then 'PM'
                else 'HF' end) jornada,  
                ((select count(pro.jornada_cita) 
                from carga_click pro  
                where pro.fecha_cita BETWEEN (:fecha1) AND (:fecha2)
                and pedido_id in (select pedido_id from carga_agenda  
                where fecha_cita BETWEEN (:fecha1) AND (:fecha2)) 
                and estado_id = 'Finalizada') :uen :tipotrabajo :ciudades) TOTAL, 

                (select count(pedido_id) 
                from carga_click pro 
                where pro.fecha_cita BETWEEN (:fecha1) AND (:fecha2) 
                and pro.pedido_id not in (select pedido_id from carga_agenda 
                where fecha_cita BETWEEN (:fecha1) AND (:fecha2)) 
                and pro.estado_id = 'Finalizada' :uen :tipotrabajo :ciudades) DIFERENCIA 

                from carga_click pro  
                where pro.fecha_cita BETWEEN (:fecha1) AND (:fecha2) 
                and pedido_id in (select pedido_id from carga_agenda 
                where fecha_cita BETWEEN (:fecha1) AND (:fecha2)) 
                and estado_id = 'Finalizada' :uen :tipotrabajo :ciudades group by jornada 
                order by (case when pro.jornada_cita = 'AM' then 'AM' 
                when pro.jornada_cita = 'PM' then 'PM' else 'HF' end) ");
            $sqlfinalizadosclick->execute([':uen' => $uen, ':tipotrabajo' => $tipo_trabajo, ':ciudades' => $ciudades, ':fecha1' => "$fecha 00:00:00", ':fecha2' => "$fecha 23:59:59"]);

            while ($row = $sqlfinalizadosclick->fetchAll(PDO::FETCH_ASSOC)) {

                $total_jornada       = $row['total_jornada'];
                $jornada             = $row['jornada'];
                $diferencia          = $row['DIFERENCIA'];
                $total_cargafinclick = $total_cargafinclick + $total_jornada;
                $sqlupdatefinalclick = $this->_DB->prepare("UPDATE jornada_estados SET `finalizados_click`=:total_jornada WHERE `id_jornada`=:jornada");
                $sqlupdatefinalclick->execute([':total_jornada'=>$total_jornada,':jornada'=>$jornada]);
            }
            $sqlupdatefinalclicktotal =$this->_DB->prepare( "UPDATE jornada_estados SET `finalizados_click`=:total_cargafinclick WHERE `id_jornada`='TOTAL'");
            $sqlupdatefinalclicktotal->execute([':total_cargafinclick'=>$total_cargafinclick]);
            $sqlupdatedif             =$this->_DB->prepare( "UPDATE jornada_estados SET `finalizados_click`=:diferencia WHERE `id_jornada`='DIFERENCIA'");
            $sqlupdatedif->execute([':diferencia'=>$diferencia]);

            //Sin confirmar de click
            $sqlSinConfirmar =$this->_DB->prepare( "select count(pro.jornada_cita) total_jornada,   
                (case when pro.jornada_cita = 'AM' then 'AM'   
                when pro.jornada_cita = 'PM' then 'PM'  
                else 'HF' end) jornada,  
                (select count(pro.jornada_cita) total_jornada    
                from carga_click pro  
                where pro.fecha_cita BETWEEN (:fecha1) AND (:fecha2) 
                and pro.pedido_id in (select pedido_id from carga_agenda  
                where fecha_cita BETWEEN (:fecha1) AND (:fecha2) )  
                and pro.pedido_id not in  
                (select reg.pedido 
                from registros reg, carga_agenda pro  
                where pro.pedido_id in (select pedido_id from carga_click 
                where fecha_cita BETWEEN (:fecha1) AND (:fecha2) ) 
                and pro.pedido_id = reg.pedido  
                and accion = 'Visita confirmada' 
                and reg.fecha BETWEEN (:fecha1) AND (:fecha2)  
                and pro.fecha_cita BETWEEN (:fecha1) AND (:fecha2) )) 
                and pro.pedido_id not in 
                (select pedido_id	
                from carga_agenda 
                where pedido_id not in 
                (select pedido from registros where fecha BETWEEN (:fecha1) AND (:fecha2) ) 
                and fecha_cita BETWEEN (:fecha1) AND (:fecha2) 
                and pedido_id in (select pedido_id from carga_click 
                where fecha_cita BETWEEN (:fecha1) AND (:fecha2) )) :uen :tipotrabajo :ciudades) as TOTAL, 
                (select count(pro.pedido_id) 
                from carga_click pro  
                where pro.fecha_cita BETWEEN (:fecha1) AND (:fecha2) 
                and pro.pedido_id not in (select pedido_id from carga_agenda  
                where fecha_cita BETWEEN (:fecha1) AND (:fecha2) )  
                and pro.pedido_id not in 
                (select pedido_id 
                from carga_click pro  
                where pro.fecha_cita BETWEEN (:fecha1) AND (:fecha2)  
                and pro.pedido_id not in (select pedido_id from carga_agenda 
                where fecha_cita BETWEEN (:fecha1) AND (:fecha2) ) 
                and pro.pedido_id in (select pedido from registros where 
                accion = 'Visita confirmada' 
                and fecha BETWEEN (:fecha1) AND (:fecha2) ) 
                and pro.fecha_cita BETWEEN (:fecha1) AND (:fecha2) ) 
                and pro.pedido_id not in 
                (select pedido_id 
                from carga_click  
                where pedido_id not in (select pedido from registros  
                where fecha BETWEEN (:fecha1) AND (:fecha2) ) 
                and fecha_cita BETWEEN (:fecha1) AND (:fecha2)  
                and pedido_id not in (select pedido_id from carga_agenda 
                where fecha_cita BETWEEN (:fecha1) AND (:fecha2) )):uen :tipotrabajo :ciudades) as DIFERENCIA 
                from carga_click pro 
                where pro.fecha_cita BETWEEN (:fecha1) AND (:fecha2) 
                and pro.pedido_id in (select pedido_id from carga_agenda 
                where fecha_cita BETWEEN (:fecha1) AND (:fecha2) ) 
                and pro.pedido_id not in 
                (select reg.pedido 
                from registros reg, carga_agenda pro  
                where pro.pedido_id in (select pedido_id from carga_click 
                where fecha_cita BETWEEN (:fecha1) AND (:fecha2) ) 
                and pro.pedido_id = reg.pedido  
                and accion = 'Visita confirmada' 
                and reg.fecha BETWEEN (:fecha1) AND (:fecha2)  
                and pro.fecha_cita BETWEEN (:fecha1) AND (:fecha2) ) 
                and pro.pedido_id not in 
                (select pedido_id 
                from carga_agenda 
                where pedido_id not in 
                (select pedido from registros where fecha 
                BETWEEN (:fecha1) AND (:fecha2) ) 
                and fecha_cita BETWEEN (:fecha1) AND (:fecha2) 
                and pedido_id in (select pedido_id from carga_click 
                where fecha_cita BETWEEN (:fecha1) AND (:fecha2))) 
                :uen :tipotrabajo :ciudades group by jornada ");
            $sqlSinConfirmar->execute([':uen' => $uen, ':tipotrabajo' => $tipo_trabajo, ':ciudades' => $ciudades, ':fecha1' => "$fecha 00:00:00", ':fecha2' => "$fecha 23:59:59"]);



            while ($row = $sqlSinConfirmar->fetchAll(PDO::FETCH_ASSOC)) {

                $total_jornada         = $row['total_jornada'];
                $jornada               = $row['jornada'];
                $diferencia            = $row['DIFERENCIA'];
                $total_sinconfirmar    = $total_sinconfirmar + $total_jornada;
                $sqlupdatesinconfirmar =$this->_DB->prepare( "UPDATE jornada_estados SET `sin_confirmar`=:totaljornada WHERE `id_jornada`=:jornada ");
                $sqlupdatesinconfirmar->execute([':totaljornada'=>$total_jornada,':jornada'=>$jornada]);

            }
            $sqlupdatesinconfirmartotal = $this->_DB->prepare("UPDATE jornada_estados SET `sin_confirmar`=:total_sinconfirma  WHERE `id_jornada`='TOTAL' ");
            $sqlupdatesinconfirmartotal->execute([':total_sinconfirma'=>$total_sinconfirmar]);
            $sqlupdatedif               =$this->_DB->prepare( "UPDATE jornada_estados SET `sin_confirmar`=:diferencia WHERE `id_jornada`='DIFERENCIA' ");
            $sqlupdatedif->execute([':diferencia'=>$diferencia]);

            $query = $this->_DB->query("SELECT * FROM jornada_estados where id_jornada not in('TOTAL','DIFERENCIA')");

            $query2 =$this->_DB->query( "SELECT *, ROUND((confirmados/vista_click)*100,2) eficacia, 
                ROUND((finalizados_click/agendados)*100,2) efectividad 
                FROM jornada_estados where id_jornada in ('TOTAL') ");

            $resultado2 = [];

            while ($row = $query2->fetchAll(PDO::FETCH_ASSOC)) {
                $resultado2[] = $row;
            }

            $query3 =$this->_DB->query( "SELECT * FROM jornada_estados where id_jornada in ('DIFERENCIA') ");

            $resultado3 = [];

            while ($row = $query3->fetchAll(PDO::FETCH_ASSOC)) {
                $resultado3[] = $row;
            }

            $queryalarmados =$this->_DB->prepare( "SELECT count(pedido_id) total FROM alarmados where fecha_cita BETWEEN (:fecha1) AND (:fecha2) ");
            $queryalarmados->execute([':fecha1'=>"$fecha 00:00:00",':fecha2'=>"$fecha 23:59:59"]);

            $counter = 0;
            if ($queryalarmados->rowCount()) {
                $result = [];
                if ($row = $queryalarmados->fetchAll(PDO::FETCH_ASSOC)) {
                    $counter = $row['total'];
                }
            }
            //para las graficas

            $query4 = $this->_DB->prepare( "select a.final final_click, b.agenda agendados, a.fecha_cita fecha, c.click click from   

                (select count(pro.pedido_id) agenda, pro.fecha_cita  
                from carga_agenda pro 
                where pro.fecha_cita  BETWEEN (:fecha1) AND (:fecha2) 
                :tipotrabajo1 :uen :ciudades
                group by pro.fecha_cita) b, 

                (select count(jornada_cita) final, 
                fecha_cita from carga_click click 
                where fecha_cita BETWEEN (:fecha1) AND (:fecha2) 
               and pedido_id in (select pedido_id from carga_agenda   
               where fecha_cita = click.fecha_cita)  
                and estado_id='Finalizada' :tipotrabajo :uen :ciudades group by fecha_cita) a, 

                (select count(jornada_cita) click, pro.fecha_cita  
                from carga_click pro 
                where pro.fecha_cita BETWEEN (:fecha1) AND (:fecha2) 
                and pedido_id in (select pedido_id from carga_agenda  
                where fecha_cita = pro.fecha_cita) :tipotrabajo :uen :ciudades group by pro.fecha_cita) c  
                where a.fecha_cita = c.fecha_cita 
                and a.fecha_cita = b.fecha_cita 
                group by a.fecha_cita ");
            $query4->execute([':fecha1'=>"$año-$mes-01 00:00:00",':fecha2'=>"$año-$mes-31 23:59:59",':tipotrabajo'=>$tipo_trabajo,':uen'=>$uen,':ciudades'=>$ciudades,':tipotrabajo1'=>$tipo_trabajo1]);


            if ($query4->rowCount()) {
                $fecha       = [];
                $click       = [];
                $agendados   = [];
                $final_click = [];
                $i           = 1;
                while ($row = $query4->fetchAll(PDO::FETCH_ASSOC)) {

                    $date     = $row['fecha'];
                    $en_click = $row['click'];
                    $agenda   = $row['agendados'];
                    $finaliza = $row['final_click'];

                    $fecha[]       = ["label" => "$date"];
                    $click[]       = ["value" => "$en_click"];
                    $agendados[]   = ["value" => "$agenda"];
                    $final_click[] = ["value" => "$finaliza"];
                    $i++;
                }
            }
            //fin de la graficas

            if ($query->rowCount()) {

                $resultado = [];

                while ($row = $query->fetchAll(PDO::FETCH_ASSOC)) {

                    $resultado[] = $row;

                }

                $response=[$resultado, $resultado2, $resultado3, $fecha, $click, $agendados, $final_click, $counter,201];

            } else {
                $response = ['',400];

            }
        }catch (PDOException $e){
            var_dump($e->getMessage());
        }
        echo json_encode($response);
    }
}