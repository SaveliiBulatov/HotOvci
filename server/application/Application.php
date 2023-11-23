<?php
require_once 'modules/User/User.php';
require_once 'modules/Game/Game.php';
require_once 'modules/DB/DB.php';
require_once 'modules/Lobby/Lobby.php';
require_once 'modules/Chat/Chat.php';


class Application
{
    private $user;
    private $chat;
    private $game;
    private $lobby;

    public function __construct()
    {
        $db = new DB();
        $this->user = new User($db);
        $this->lobby = new Lobby($db);
        $this->chat = new Chat($db);
        $this->game = new Game($db);
    }





    /*************************/
    /* НЕПОВТОРИМЫЙ ОРИГИНАЛ */
    /*************************/
    function register($params)
    {
        $login = $params['login'];
        $name = $params ['name'];
        $email = $params['email'];
        $hash = $params['hash'];
        if ($login && $hash && $name && $email) {
            return $this->user->register($login, $hash, $name, $email);
        }
        return ['error' => 242];
    }

    function login($params)
    {
        $login = $params['login'];
        $hash = $params['hash'];
        $rnd = $params['rnd'];
        if ($login && $hash && $rnd) {
            return $this->user->login($login, $hash, $rnd);
        }
        return ['error' => 1001];
    }

    function logout($params)
    {
        $token = $params['token'];
        if ($token) {
            return $this->user->logout($token);
        }
        return ['error' => 242];
    }


    function getMessages($params)
    {
        $token = $params['token'];
        $hash = $params['hash'];
        if ($token && $hash) {
            $user = $this->user->getUserByToken($token);
            if ($user) {
                return $this->chat->getMessage($hash);
            }
            return ['error' => 1002];
        }
        return ['error' => 242];
    }

    function sendMessage($params)
    {
        $token = $params['token'];
        $message = $params['message'];
        if ($token && $message) {
            $user = $this->user->getUserByToken($token);
            if ($user) {
                return $this->chat->sendMessage($user->id, $message);
            }
            return ['error' => 1002];
        }
        return ['error' => 242];
    }


    function selectTeam($params)
    {
        $token = $params['token'];
        $teamId = $params['teamId'];
        if ($token && $teamId) {
            $user = $this->user->getUserByToken($token);
            if ($user) {
                return $this->lobby->selectTeam($user->id, $teamId);
            }
            return ['error' => 1002];
        }
        return ['error' => 242];
    }

    function getPlayers($params)
    {
        $token = $params['token'];
        if ($token) {
            $user = $this->user->getUserByToken($token);
            if ($user) {
                return $this->game->getPlayers();
            }
            return ['error' => 1002];
        }
        return ['error' => 242];
    }

    function setPlayer($params)
    {
        $token = $params['token'];
        $x = $params['x'];
        $y = $params['y'];
        $vx = $params['vx'];
        $vy = $params['vy'];
        if ($token && ($x || $x == 0) && ($y || $y == 0) && ($vx || $vx == 0) && ($vy || $vy == 0)) {
            $user = $this->user->getUserByToken($token);
            if ($user) {
                return $this->game->setPlayer($user->id, $x, $y, $vx, $vy);
            }
            return ['error' => 1002];
        }
        return ['error' => 242];


    }




    /******************/
    /* ЖАЛКАЯ ПАРОДИЯ */
    /******************/

//..

    function getTeamsInfo($params)
    {
        $token = $params['token'];
        if ($token) {

            $user = $this->user->getUserByToken($token);
            if ($user) {
                return $this->lobby->getTeamsInfo();
            }
            return ['error' => 1002];

        }
        return ['error' => 242];

    }

    function getSkins($params)
    {
        $token = $params['token'];
        if ($token) {

            $user = $this->user->getUserByToken($token);
            if ($user) {
                return $this->lobby->getSkins();
            }
            return ['error' => 1002];
        }
        return ['error' => 242];

    }

    function setSkin($params)
    {
        $token = $params['token'];
        $skinId = $params['skinId'];
        if ($token && $skinId) {

            $user = $this->user->getUserByToken($token);
            if ($user) {
                return $this->lobby->setSkin($user->id, $skinId);

            }
            return ['error' => 1002];

        }
        return ['error' => 242];

    }

    function sendCodeToResetPassword($params)
    {
        $login = $params['login'];
        if ($login) {
            $user = $this->user->getUserByLogin($login);
            if ($user) {
                return $this->user->sendCodeToResetPassword($login, $user);
            }
            return ['error' => 1002];

        }
        return ['error' => 242];

    }

    function getCodeToResetPassword($params)
    {
        $code = $params['code'];
        if ($code) {
            return $this->user->getCodeToResetPassword($code);

        }
        return ['error' => 242];
    }

    function setPasswordAfterReset($params)
    {
        $hash = $params['hash'];
        if ($hash) {
            return $this->user->setPasswordAfterReset($hash);
        }
        return ['error' => 242];
    }

    function setBullet($params) {
        $token = $params['token'];
        $bulletId = $params['bulletId'];
        $x = $params['x'];
        $y = $params['y'];
        $vx = $params['vx'];
        $vy = $params['vy'];
        if ($token && ($x || $x == 0) && ($y || $y == 0) && ($vx || $vx == 0) && ($vy || $vy == 0)) {
            $user = $this->user->getUserByToken($token);
            if ($user) {
                return $this->game->setBullet($user->id, $x, $y, $vx, $vy);
            }
            return ['error' => 1002];
        }
        return ['error' => 242];
    }


}