<?php
use Ratchet\Server\IoServer;
use Server\Chat;

    require 'vendor/autoload.php';

    $server = IoServer::factory(
        new Chat(),
        8085
    );

    $server->run();