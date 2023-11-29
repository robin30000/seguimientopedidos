<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

//echo  date('Y-m-d H:i:s');exit();

require_once '../class/conection.php';
$conn = new Conection();
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
try {

    $selectStmt = $conn->query("SELECT * FROM correccion");
    $datos = $selectStmt->fetchAll(PDO::FETCH_ASSOC);

    $conn->beginTransaction();

    $updateStmt = $conn->prepare("UPDATE contingencias SET horacontingencia = :hora_gestion, horagestion = :hora_ingreso, fechaClickMarca = :fecha_marca WHERE id = :id");

    foreach ($datos as $dato) {
        $updateStmt->execute([
            ':hora_gestion' => $dato['HORA_GESTION'],
            ':hora_ingreso' => $dato['HORA_INGRESO'],
            ':fecha_marca' => $dato['FECHACLICKMARCA'],
            ':id' => $dato['ID'],
        ]);
    }

    $conn->commit();

    echo 'Se ingresaron en la fecha ' . date('Y-m-d H:i:s') . ' ' . count($datos) . ' registros';
} catch (PDOException $e) {
    $conn->rollBack();
    echo 'Error: ' . $e->getMessage();
}


