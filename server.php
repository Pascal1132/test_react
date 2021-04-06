<?php
use Ratchet\Server\IoServer;
use Server\Socket;

    require 'vendor/autoload.php';

    use Ratchet\WebSocket\WsServer;
use Ratchet\Http\HttpServer;


    $ws = new WsServer(new Socket());

    // Make sure you're running this as root
    $server = IoServer::factory(new HttpServer($ws), '8085', '127.0.0.1');
    $server->run();