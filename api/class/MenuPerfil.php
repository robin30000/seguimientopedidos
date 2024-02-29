<?php

require_once 'conection.php';

class MenuPerfil
{
    private $_DB;

    public function __construct()
    {
        $this->_DB = new Conection();
    }

    public function getSubmenu()
    {
        /*ini_set('session.gc_maxlifetime', 3600); // 1 hour
        session_set_cookie_params(3600);
        session_start();*/
        try {

            $stmt = $this->_DB->prepare("SELECT
                                            submenu.id,
                                            submenu.estado,
                                            submenu.nombre,
                                            submenu.url,
                                            menu.nombre AS padre
                                        FROM
                                            submenu
                                        INNER JOIN menu ON submenu.menu_id = menu.id
                                        ORDER BY
                                            padre");
            $stmt->execute();
            if ($stmt->rowCount()) {
                $response = ['state' => 1, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)];
            } else {
                $response = ['state' => 0, 'msj' => 'No se encontraron registros'];
            }

        } catch (PDOException $th) {
            var_dump($th->getMessage());
        }
        $this->_DB = '';
        echo json_encode($response);
    }

    public function getMenu()
    {
        /*ini_set('session.gc_maxlifetime', 3600); // 1 hour
        session_set_cookie_params(3600);
        session_start();*/
        try {

            $stmt = $this->_DB->prepare("SELECT * FROM menu");
            $stmt->execute();

            if ($stmt->rowCount()) {
                $response = ['state' => 1, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)];
            } else {
                $response = ['state' => 0, 'msj' => 'No se encontraron registros'];
            }

        } catch (PDOException $th) {
            var_dump($th->getMessage());
        }
        $this->_DB = '';
        echo json_encode($response);
    }

    public function getPerfil()
    {
        /*ini_set('session.gc_maxlifetime', 3600); // 1 hour
        session_set_cookie_params(3600);
        session_start();*/
        try {
            $stmt = $this->_DB->prepare("SELECT * FROM perfiles");
            $stmt->execute();
            if ($stmt->rowCount()) {
                $response = ['state' => 1, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)];
            } else {
                $response = ['state' => 0, 'msj' => 'No se encontraron registros'];
            }

        } catch (PDOException $th) {
            var_dump($th->getMessage());
        }
        $this->_DB = '';
        echo json_encode($response);
    }

    public function verMenuPerfil($data)
    {
        /*ini_set('session.gc_maxlifetime', 3600); // 1 hour
        session_set_cookie_params(3600);
        session_start();*/
        try {
            $stmt = $this->_DB->prepare("SELECT
                            submenu.id,
                            submenu.estado,
                            submenu.nombre,
                            submenu.url,
                            menu.nombre AS padre
                        FROM
                            submenu
                        INNER JOIN menu ON submenu.menu_id = menu.id
                        INNER JOIN submenu_perfil s ON s.submenu_id = submenu.id
                        INNER JOIN perfiles p ON p.perfil = s.perfil_id
                        WHERE
                            p.perfil = :id
                        ORDER BY
                            padre");
            $stmt->execute([':id' => $data]);
            $stmt->execute();

            $response = ['state' => 1, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)];

            /*if ($stmt->rowCount()) {
                $response = ['state' => 1, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)];
            } else {
                $response = ['state' => 0, 'msj' => 'No se encontraron datos'];
            }*/
        } catch (PDOException $th) {
            var_dump($th->getMessage());
        }
        $this->_DB = '';
        echo json_encode($response);
    }

    public function cambioMenu($data)
    {
        /*ini_set('session.gc_maxlifetime', 3600); // 1 hour
        session_set_cookie_params(3600);
        session_start();*/
        try {
            $menu_id = $data['id'];
            $perfil = $data['perfil'];
            $estado = $data['estado'];

            if (!$estado) {
                $stmt = $this->_DB->prepare("INSERT INTO submenu_perfil (perfil_id, submenu_id) VALUES (:perfil, :id)");
                $stmt->execute([':id' => $menu_id, ':perfil' => $perfil]);
                if ($stmt->rowCount()) {
                    $response = ['state' => 1, 'msj' => 'El menu se ha agregado correctamente'];
                } else {
                    $response = ['state' => 0, 'msj' => 'Ha ocurrido un error interno inténtalo nuevamente en unos minutos'];
                }
            } elseif ($estado) {
                $stmt = $this->_DB->prepare("DELETE FROM submenu_perfil WHERE submenu_id = :id AND perfil_id = :perfil");
                $stmt->execute([':id' => $menu_id, ':perfil' => $perfil]);
                if ($stmt->rowCount()) {
                    $response = ['state' => 1, 'msj' => 'El menu se ha eliminado correctamente'];
                } else {
                    $response = ['state' => 0, 'msj' => 'Ha ocurrido un error interno inténtalo nuevamente en unos minutos'];
                }
            }


        } catch (PDOException $th) {
            var_dump($th->getMessage());
        }
        $this->_DB = '';
        echo json_encode($response);
    }

    public function cambiaEstadoSubmenu($data)
    {
        /*ini_set('session.gc_maxlifetime', 3600); // 1 hour
        session_set_cookie_params(3600);
        session_start();*/
        try {
            $id = $data['id'];
            $estado = $data['estado'];

            if ($estado == 'Activo') {
                $estado = 'Inactivo';
            } elseif ($estado == 'Inactivo') {
                $estado = 'Activo';
            }

            $stmt = $this->_DB->prepare("UPDATE submenu SET estado = :estado WHERE id = :id");
            $stmt->execute([':id' => $id, ':estado' => $estado]);
            if ($stmt->rowCount()) {
                $response = ['state' => 1, 'msj' => 'Estado cambiado correctamente'];
            } else {
                $response = ['state' => 0, 'msj' => 'Ha ocurrido un error interno inténtalo nuevamente en unos minutos'];
            }
        } catch (PDOException $th) {
            var_dump($th->getMessage());
        }
        $this->_DB = null;
        echo json_encode($response);
    }

    public function guardaNuevoSubmenu($data)
    {
        /*ini_set('session.gc_maxlifetime', 3600); // 1 hour
        session_set_cookie_params(3600);
        session_start();*/
        try {
            $padre = $data['padre'];
            $nombre = $data['nombre'];
            $url = $data['url'];
            $stmt = $this->_DB->prepare("INSERT INTO submenu (menu_id,nombre,estado,url,icon) VALUES(:menu_id, :nombre,'Activo',:url,'fa fa-list-alt')");
            $stmt->execute([':menu_id' => $padre, ':nombre' => $nombre, ':url' => $url]);
            if ($stmt->rowCount() == 1) {
                $response = ['state' => 1, 'msj' => 'Submenu creado correctamente'];
            } else {
                $response = ['state' => 0, 'msj' => 'Ha ocurrido un error interno inténtalo nuevamente en unos minutos'];
            }
        } catch (PDOException $th) {
            var_dump($th->getMessage());
        }
        $this->_DB = '';
        echo json_encode($response);
    }

    public function guardaPerfil($data)
    {
        $menu = strtoupper($data['perfil']);

        try {
            $stmt = $this->_DB->prepare("SELECT * FROM perfiles WHERE upper( nombre ) = :nombre");
            $stmt->execute([':nombre' => $menu]);
            if ($stmt->rowCount() > 0) {
                $response = ['state' => 0, 'msj' => 'Ya existe un perfil con ese nombre'];
            } else {
                $stmt = $this->_DB->prepare("INSERT INTO perfiles (nombre) VALUE (:nombre)");
                $stmt->execute([':nombre' => $menu]);
                if ($stmt->rowCount() == 1) {
                    $response = ['state' => 1, 'msj' => 'Nuevo perfil creado correctamente'];
                } else {
                    $response = ['state' => 0, 'msj' => 'Ha ocurrido un error interno inténtalo nuevamente en unos minutos'];
                }
            }
        } catch (PDOException $th) {
            var_dump($th->getMessage());
        }
        $this->_DB = '';
        echo json_encode($response);
    }

    public function exportePerfil()
    {
        try {
            $stmt = $this->_DB->prepare("SELECT
                                            p.nombre AS nombre_perfil,
                                            submenu.estado AS estado_submenu,
                                            submenu.nombre AS nombre_submenu
                                        FROM
                                            perfiles p
                                        LEFT JOIN
                                            submenu_perfil sp ON p.perfil = sp.perfil_id
                                        LEFT JOIN
                                            submenu ON sp.submenu_id = submenu.id
                                        LEFT JOIN
                                            menu ON submenu.menu_id = menu.id");
            $stmt->execute();

            if ($stmt->rowCount()) {
                $response = ['state' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)];
            } else {
                $response = ['state' => false, 'data' => 'No se encontraron datos'];
            }

            $this->_DB = '';

            return $response;
        } catch (PDOException $e) {
            var_dump($e->getMessage());
        }
    }

}
