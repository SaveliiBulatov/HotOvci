<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

use App\server\application\modules\Mailer\Mailer\Mailer;

class User
{
    private DB $db;
    private Mailer $mailer;

    function __construct($db)
    {
        $this->db = $db;
        $this->mailer = new Mailer();
    }

    private function genToken()
    {
        return md5(microtime() . 'salt' . rand());
    }

    public function getUserByToken($token)
    {
        return $this->db->getUserByToken($token);
    }

    public function getUserByLogin($login)
    {
        return $this->db->getUserByLogin($login);
    }

    public function login($login, $hash, $rnd)
    {
        $user = $this->db->getUserByLogin($login);
        if ($user) {
            $hashS = md5($user->password . $rnd);
            if ($hash === $hashS) {
                $token = $this->genToken();
                $this->db->updateToken($user->id, $token);
                return array(
                    'name' => $user->login,
                    'token' => $token,
                );
            }
            return ['error' => 1002];
        }
        return ['error' => 1004];
    }

    public function logout($token)
    {
        $user = $this->db->getUserByToken($token);
        if ($user) {
            $this->db->updateToken($user->id, '');
            return true;
        }
        return ['error' => 1004];
    }

    public function register($login, $hash, $name, $email)
    {
        $user = $this->db->getUserByLogin($login);
        if (!$user) {
            $this->db->addUser($login, $hash, $name, $email);
            return true;
        }
        return ['error' => 1003];
    }

    public function sendCodeToResetPassword($login, $user)
    {
        $randomNumber = random_int(10000, 99999);
        $email = $user->email;
        if ($this->mailer->sendEmail($email, 'verifCode', 'your Verificitaion code is ' . $randomNumber)) {
            $_SESSION['login'] = $login;
            $_SESSION['rndCode'] = $randomNumber;
            $_SESSION['e-mail'] = $email;
            $_SESSION['idUser'] = $user->id;
            return true;
        }
        return ['error' => 707];// could not send message
    }

    public function getCodeToResetPassword($code)
    {
        if (isset($_SESSION['idUser']) && isset($_SESSION['rndCode'])) {
            $id = $_SESSION['idUser'];
            if ($_SESSION['rndCode'] == $code) {
                $this->sendWarningOfAttemptResetPassword();
                return $this->db->setPassword($id, '');
            }
            return ['error' => 708]; // invalid code from e-mail;
        }
        return ['error' => 709]; //'709'=>'session did not start or you need use previous method',


    }

    public function setPasswordAfterReset($hash)
    {
        if (isset($_SESSION['idUser'])) {
            $id = $_SESSION['idUser'];
            $this->sendWarningOfReplacePassword();
            return $this->db->setPassword($id, $hash);
        }
        return ['error' => 709];// 709'=>'session did not start
        // or you need use previous method',



    }
    public function sendWarningOfAttemptResetPassword(){
        if (isset($_SESSION['idUser']) && isset($_SESSION['e-mail'])) {
            $email = $_SESSION['e-mail'];
            return $this->mailer->sendEmail($email, "Attempt to Replaced Password", "If you are not trying to change your password now, contact the support");
        }
        return ['error' => 709];
    }

    public function sendWarningOfReplacePassword()
    {
        if (isset($_SESSION['idUser']) && isset($_SESSION['e-mail'])) {
            $email = $_SESSION['e-mail'];
            return $this->mailer->sendEmail($email, "Replaced Password", "The Password was be replaced. You can login in your account.");
        }
        return ['error' => 709];
    }


}
