<?php

class SQLServerConnection
{
    private $server;
    private $database;
    private $username;
    private $password;
    private $pdo;

    /**
     * Constructor para inicializar los datos de conexión.
     *
     * @param string $server Nombre o dirección IP del servidor SQL Server.
     * @param string $database Nombre de la base de datos.
     * @param string $username Nombre de usuario.
     * @param string $password Contraseña.
     */
    public function __construct($server, $database, $username, $password)
    {
        $this->server = $server;
        $this->database = $database;
        $this->username = $username;
        $this->password = $password;
    }

    /**
     * Método para establecer la conexión a la base de datos.
     *
     * @return void
     */
    public function connect()
    {
        // Data Source Name (DSN)
        $dsn = "sqlsrv:Server={$this->server};Database={$this->database}";

        try {
            $this->pdo = new PDO($dsn, $this->username, $this->password);
            $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            echo "Conexión establecida exitosamente.";
        } catch (PDOException $e) {
            die("Error al conectar a la base de datos: " . $e->getMessage());
        }
    }

    /**
     * Método para ejecutar una consulta SQL.
     *
     * @param string $query Consulta SQL a ejecutar.
     * @return array|false Resultados de la consulta o false en caso de error.
     */
    public function executeQuery($query)
    {
        if ($this->pdo === null) {
            echo "No hay conexión a la base de datos. Llame al método 'connect' primero.";
            return false;
        }

        try {
            $stmt = $this->pdo->query($query);
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $results;
        } catch (PDOException $e) {
            echo "Error al ejecutar la consulta: " . $e->getMessage();
            return false;
        }
    }

    /**
     * Método para cerrar la conexión a la base de datos.
     *
     * @return void
     */
    public function close()
    {
        $this->pdo = null;
        echo "Conexión cerrada exitosamente.";
    }
}

// Datos de conexión
$server = 'NETV-PSQL09-05';  // Cambia esto por tu servidor SQL Server
$database = 'Service Optimization';
$username = 'BI_Clicksoftware';  // Cambia esto por tu usuario
$password = '6n`Vue8yYK7Os4D-y|';

// Crear una instancia de la clase SQLServerConnection
$dbConnection = new SQLServerConnection($server, $database, $username, $password);

// Conectar a la base de datos
$dbConnection->connect();

// Ejecutar una consulta de ejemplo
$results = $dbConnection->executeQuery("SELECT TOP
	100 TK.UNEPedido,
	TK.UNETecnologias,
	TKS.Name 'Status',
	SERV.Infraestructura1,
	SS.Name AS sistema,
	TT.Name as 'TaskType',
	TK.CallID
FROM
	W6TASKS TK
	INNER JOIN W6TASK_STATUSES TKS ON TKS.W6Key = TK.Status
	INNER JOIN W6TASKS_UNESERVICES TKU ON TK.W6Key = TKU.W6Key
	INNER JOIN W6UNESERVICES SERV ON TKU.UNEService = SERV.W6Key
	INNER JOIN W6UNESOURCESYSTEMS SS ON TK.UNESourceSystem= SS.W6Key 
	INNER JOIN W6TASK_TYPES TT ON TK.TaskType = TT.W6Key
WHERE
	 --TK.CallID IN ( '41786630' ) 
	 TT.Name in ('Precableado')
ORDER BY
	TK.DispatchDate DESC");
if ($results !== false) {
    foreach ($results as $row) {
        print_r($row);
    }
}

// Cerrar la conexión
$dbConnection->close();

?>
