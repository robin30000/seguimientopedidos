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
        ini_set('session.gc_maxlifetime', 3600); // 1 hour
        session_set_cookie_params(3600);
        session_start();
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
                $response = array('state' => 1, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC));
            } else {
                $response = array('state' => 0, 'msj' => 'No se encontraron registros');
            }

        } catch (PDOException $th) {
            var_dump($th->getMessage());
        }
        $this->_DB = '';
        echo json_encode($response);
    }

    public function getMenu()
    {
        ini_set('session.gc_maxlifetime', 3600); // 1 hour
        session_set_cookie_params(3600);
        session_start();
        try {

            $stmt = $this->_DB->prepare("SELECT * FROM menu");
            $stmt->execute();

            if ($stmt->rowCount()) {
                $response = array('state' => 1, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC));
            } else {
                $response = array('state' => 0, 'msj' => 'No se encontraron registros');
            }

        } catch (PDOException $th) {
            var_dump($th->getMessage());
        }
        $this->_DB = '';
        echo json_encode($response);
    }

    public function getPerfil()
    {
        ini_set('session.gc_maxlifetime', 3600); // 1 hour
        session_set_cookie_params(3600);
        session_start();
        try {
            $stmt = $this->_DB->prepare("SELECT * FROM perfiles");
            $stmt->execute();
            if ($stmt->rowCount()) {
                $response = array('state' => 1, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC));
            } else {
                $response = array('state' => 0, 'msj' => 'No se encontraron registros');
            }

        } catch (PDOException $th) {
            var_dump($th->getMessage());
        }
        $this->_DB = '';
        echo json_encode($response);
    }

    public function verMenuPerfil($data)
    {
        ini_set('session.gc_maxlifetime', 3600); // 1 hour
        session_set_cookie_params(3600);
        session_start();
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
            $stmt->execute(array(':id' => $data));
            $stmt->execute();

            if ($stmt->rowCount()) {
                $response = array('state' => 1, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC));
            } else {
                $response = array('state' => 0, 'msj' => 'No se encontraron datos');
            }
        } catch (PDOException $th) {
            var_dump($th->getMessage());
        }
        $this->_DB = '';
        echo json_encode($response);
    }

    public function cambioMenu($data)
    {
        ini_set('session.gc_maxlifetime', 3600); // 1 hour
        session_set_cookie_params(3600);
        session_start();
        try {
            $menu_id = $data['id'];
            $perfil = $data['perfil'];
            $estado = $data['estado'];

            if (!$estado) {
                $stmt = $this->_DB->prepare("INSERT INTO submenu_perfil (perfil_id, submenu_id) VALUES (:perfil, :id)");
                $stmt->execute(array(':id' => $menu_id, ':perfil' => $perfil));
                if ($stmt->rowCount()) {
                    $response = array('state' => 1, 'msj' => 'El menu se ha agregado correctamente');
                } else {
                    $response = array('state' => 0, 'msj' => 'Ha ocurrido un error interno inténtalo nuevamente en unos minutos');
                }
            } elseif ($estado) {
                $stmt = $this->_DB->prepare("DELETE FROM submenu_perfil WHERE submenu_id = :id AND perfil_id = :perfil");
                $stmt->execute(array(':id' => $menu_id, ':perfil' => $perfil));
                if ($stmt->rowCount()) {
                    $response = array('state' => 1, 'msj' => 'El menu se ha eliminado correctamente');
                } else {
                    $response = array('state' => 0, 'msj' => 'Ha ocurrido un error interno inténtalo nuevamente en unos minutos');
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
        ini_set('session.gc_maxlifetime', 3600); // 1 hour
        session_set_cookie_params(3600);
        session_start();
        try {
            $id = $data['id'];
            $estado = $data['estado'];

            if ($estado == 'Activo') {
                $estado = 'Inactivo';
            } elseif ($estado == 'Inactivo') {
                $estado = 'Activo';
            }

            $stmt = $this->_DB->prepare("UPDATE submenu SET estado = :estado WHERE id = :id");
            $stmt->execute(array(':id' => $id, ':estado' => $estado));
            if ($stmt->rowCount()) {
                $response = array('state' => 1, 'msj' => 'Estado cambiado correctamente');
            } else {
                $response = array('state' => 0, 'msj' => 'Ha ocurrido un error interno inténtalo nuevamente en unos minutos');
            }
        } catch (PDOException $th) {
            var_dump($th->getMessage());
        }
        $this->_DB = null;
        echo json_encode($response);
    }

    public function guardaNuevoSubmenu($data)
    {
        ini_set('session.gc_maxlifetime', 3600); // 1 hour
        session_set_cookie_params(3600);
        session_start();
        try {
            $padre = $data['padre'];
            $nombre = $data['nombre'];
            $url = $data['url'];
            $stmt = $this->_DB->prepare("INSERT INTO submenu (menu_id,nombre,estado,url,icon) VALUES(:menu_id, :nombre,'Activo',:url,'fa fa-list-alt')");
            $stmt->execute(array(':menu_id' => $padre, ':nombre' => $nombre, ':url' => '#/' . $url));
            if ($stmt->rowCount() == 1) {
                $response = array('state' => 1, 'msj' => 'Submenu creado correctamente');
            } else {
                $response = array('state' => 0, 'msj' => 'Ha ocurrido un error interno inténtalo nuevamente en unos minutos');
            }
        } catch (PDOException $th) {
            var_dump($th->getMessage());
        }
        $this->_DB = '';
        echo json_encode($response);
    }

    public function guardaPerfil($data)
    {
        ini_set('session.gc_maxlifetime', 3600); // 1 hour
        session_set_cookie_params(3600);
        session_start();
        try {
            $stmt = $this->_DB->prepare("SELECT * FROM perfiles WHERE nombre = :nombre");
            $stmt->execute(array(':nombre' => $data['nombre']));
            if ($stmt->rowCount() > 0) {
                $response = array('state' => 0, 'msj' => 'Ya existe un perfil con ese nombre');
            } else {
                $stmt = $this->_DB->prepare("INSERT INTO perfiles (nombre) VALUE (:nombre)");
                $stmt->execute(array(':nombre' => $data['nombre']));
                if ($stmt->rowCount() == 1) {
                    $response = array('state' => 1, 'msj' => 'Nuevo perfil creado correctamente');
                } else {
                    $response = array('state' => 0, 'msj' => 'Ha ocurrido un error interno inténtalo nuevamente en unos minutos');
                }
            }
        } catch (PDOException $th) {
            var_dump($th->getMessage());
        }
        $this->_DB = '';
        echo json_encode($response);
    }

}