<?php
header('Content-Type: Application/json; charset = utf-8');
header('Access-Control-Allow-Origin: *');
require_once 'application/Answer.php';
require_once 'application/Application.php';

function result($params) {
    $method = $params['method'];
    if ($method) {
        $app = new Application();
        switch ($method) {
            case 'login': return $app->login($params); //Работает
            case 'logout': return $app->logout($params); //Работает
            case 'register': return $app->register($params);//Работает
            case 'selectTeam': return $app->selectTeam($params);
            case 'getTeamsInfo': return $app->getTeamsInfo($params);
            case 'getSkins': return $app->getSkins($params);
            case 'setSkin': return $app->setSkin($params);
            default: return [false, 102];
        }
    }
    return [false, 101];
}

echo json_encode(Answer::response(result($_GET)));