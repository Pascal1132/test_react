<?php

namespace Server;

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use Server\Ajax\AjaxClients;

class Socket implements MessageComponentInterface
{
    protected $clients;
    protected $connections;

    public function getConnections(){
        return $this->connections;
    }

    public function getClients(){
        return $this->clients;
    }
    public function setClients($clients){
        $this->clients = $clients;
    }
    public function __construct() {
        $this->connections = new \SplObjectStorage;
    }

    public function onOpen(ConnectionInterface $conn)
    {
        $this->connections->attach($conn);
    }

    public function onMessage(ConnectionInterface $from, $msg)
    {

        $data = get_object_vars(json_decode($msg));

        switch($data['action'] ?? ''){
        case 'clients':
            $ajax = new AjaxClients($this, $data, $from);
            break;
        default: 
            break;
        }
        $from->send(json_encode($ajax->execute()) ?? null);
        
    }

    public function onClose(ConnectionInterface $conn)
    {
        $clients = $this->getClients();

        if (array_key_exists($conn->resourceId ?? [], $clients ?? [])) {
            $room = $clients[$conn->resourceId]['room'];
            unset($clients[$conn->resourceId]);
            $this->setClients($clients);
            $ajax = new AjaxClients($this, null, $conn);
            $ajax->refreshClients($clients, $room);
        }
        $this->connections->detach($conn);
        
    }

    public function onError(ConnectionInterface $conn, \Exception $e)
    {
        $this->onClose($conn);
    }
}
