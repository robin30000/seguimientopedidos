<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

//echo  date('Y-m-d H:i:s');exit();

require_once '../class/conection.php';

$conn = new Conection();

$stmt = $conn->prepare("SELECT HORA_INGRESO, HORA_GESTION,FECHACLICKMARCA,ID FROM c");
$stmt->execute();
/*echo "<pre>";
print_r($dataclick);
echo "</pre>";exit();*/

$datos = $stmt->fetchAll(PDO::FETCH_ASSOC);
$total = count($datos);
$count = 0;

try {
    $conn = new Conection();
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $selectStmt = $conn->query("SELECT * FROM c");
    $datos = $selectStmt->fetchAll(PDO::FETCH_ASSOC);

    $conn->beginTransaction();

    $updateStmt = $conn->prepare("UPDATE contingencias SET horacontingencia = :hora_gestion, horagestion = :hora_ingreso, fechaClickMarca = :fecha_marca WHERE id = :id");

    foreach ($datos as $dato) {
        $updateStmt->execute([
            ':hora_gestion' => $dato['HORA_GESTION'],
            ':hora_ingreso' => $dato['HORA_INGRESO'],
            ':fecha_marca' => $dato['FECHACLICKMARCA'],
            ':id' => $dato['id'],
        ]);
    }

    $conn->commit();

    echo 'Se ingresaron en la fecha ' . date('Y-m-d H:i:s') . ' ' . count($datos) . ' registros';
} catch (PDOException $e) {
    $conn->rollBack();
    echo 'Error: ' . $e->getMessage();
}

/*try {

    for ($i = 0; $i < $total; $i++) {
        var_dump($datos[$i]);
        exit();
        $tmt = $conn->prepare("update contingencias set horagestion=:horagestion, horacontingencia = :horacontingencia, fechaClickMarca = :fecha_m where id = :id");
        $stmt->execute(array(':horagestion' => $datos[$i]['HORA_INGRESO'], ':horacontingencia' => $datos[$i]['HORA_GESTION'], ':fecha_m' => $datos[$i]['FECHACLICKMARCA'], ':id' => $datos[$i]['id']));
    }
} catch (PDOException $e) {
    var_dump($e);
}

if ($count) {
    echo 'Se ingresaron en la fecha ' . date('Y-m-d H:i:s') . ' ' . $count . ' registros';
} else {
    echo 'No se ingresaron registros en bd sin gestionar fecha ' . date('Y-m-d H:i:s');
}*/



