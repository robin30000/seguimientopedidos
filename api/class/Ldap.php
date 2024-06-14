<?php

class LdapAuthenticator
{
    private $ldapserver;
    private $ldaptree;
    private $groupDN;

    public function __construct()
    {
        $this->ldapserver = 'ldap://10.100.65.10:389';
        $this->ldaptree = 'dc=epmtelco,dc=com,dc=co';
        $this->groupDN = 'CN=GG-NOC-Analista,OU=Grupos,OU=E3,OU=Office365,OU=Usuarios,DC=epmtelco,DC=com,DC=co';
    }

    public function authenticate($username, $password)
    {
        $ldapconn = ldap_connect($this->ldapserver) or die("No se pudo conectar al servidor LDAP.");
        ldap_set_option($ldapconn, LDAP_OPT_PROTOCOL_VERSION, 3);
        ldap_set_option($ldapconn, LDAP_OPT_REFERRALS, 0);
        $varuser = "(samaccountname=$username)";
        $ldaptree = "OU=Usuarios,DC=epmtelco,DC=com,DC=co";
        if ($ldapconn) {
            $ldapbind = @ldap_bind($ldapconn, $username . "@epmtelco.com.co", $password);

            if ($ldapbind) {
                //var_dump(ldap_unbind($ldapconn));exit();
                /*$result = ldap_search($ldapconn, $ldaptree, $varuser) or die ("Error in search query: " . ldap_error($ldapconn));
                $data = ldap_get_entries($ldapconn, $result);
                $cantdata = ldap_count_entries($ldapconn, $result);
                $object = new StdClass();
                if ($cantdata > 0) {

                    for ($i = 0; $i < $data["count"]; $i++) {
                        $object->usuario_id = $data[$i]["samaccountname"][0];
                        $object->nombre = $data[$i]["displayname"][0];
                        $object->cargo = $data[$i]["title"][0];
                        $object->correo = $data[$i]["mail"][0];
                        //$object->dn = strtoupper($data[$i]["dn"]);
                    }
                }
                var_dump($object);
                die();*/
                return true;
            } else {
                //return "Error al iniciar sesión es: " . ldap_error($ldapconn);
                return false;
            }
        } else {
            return "No se pudo conectar al servidor LDAP.";
        }
    }
}


