<?php

namespace Server;

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use Server\Ajax\AjaxClients;

class Socket implements MessageComponentInterface
{
    protected $clients;

    public function getClients(){
        return $this->clients;
    }
    public function setClients($clients){
        $this->clients = $clients;
    }

    public function onOpen(ConnectionInterface $conn)
    {
        
    }

    public function onMessage(ConnectionInterface $from, $msg)
    {
        $data = get_object_vars(json_decode($msg));

        $return = null;
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
        unset($clients[$conn->resourceId]);
        $this->setClients($clients);
    }

    public function onError(ConnectionInterface $conn, \Exception $e)
    {
    }
}
