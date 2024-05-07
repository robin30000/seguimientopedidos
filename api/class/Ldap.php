<?php

class LdapAuthenticator {
    private $ldapserver;
    private $ldaptree;
    private $groupDN;

    public function __construct() {
        $this->ldapserver = 'ldap://10.100.65.10:389';
        $this->ldaptree = 'dc=epmtelco,dc=com,dc=co';
        $this->groupDN = 'CN=GG-NOC-Analista,OU=Grupos,OU=E3,OU=Office365,OU=Usuarios,DC=epmtelco,DC=com,DC=co';
    }

    public function authenticate($username, $password) {
        $ldapconn = ldap_connect($this->ldapserver) or die("No se pudo conectar al servidor LDAP.");
        ldap_set_option($ldapconn, LDAP_OPT_PROTOCOL_VERSION, 3);
        ldap_set_option($ldapconn, LDAP_OPT_REFERRALS, 0);

        if ($ldapconn) {
            $ldapbind = @ldap_bind($ldapconn, $username . "@epmtelco.com.co", $password);

            if ($ldapbind) {
                //var_dump(ldap_unbind($ldapconn));exit();
                return "Login exitoso.";
            } else {
                return "Error al iniciar sesión es: " . ldap_error($ldapconn);
            }
        } else {
            return "No se pudo conectar al servidor LDAP.";
        }
    }
}


