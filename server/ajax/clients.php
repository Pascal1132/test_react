<?php

namespace Server\Ajax;

use Server\Socket;

class AjaxClients
{
    protected $socket;
    protected $from;
    protected $msg;
    function __construct(Socket $socket, $msg, $from)
    {
        $this->socket = $socket;
        $this->from = $from;
        $this->msg = $msg;
    }
    public function execute()
    {
        switch ($this->msg['method']) {
            case 'get':
                return $this->get();
                break;
            case 'add':
                return $this->add();
                break;
            default:
                break;
        }
    }

    private function get()
    {
        $data = get_object_vars($this->msg['data']);
        $room = $data['room'];
        $arr_return = array();
        foreach ($this->socket->getClients() as $id => $client) {
            if ($room === $client['room']) {
                $arr_return[$id] = $client;
            }
        }
        return ['clients'=>$arr_return];
    }
    private function add()
    {
        $data = get_object_vars($this->msg['data']);
        $clients = $this->socket->getClients();
        $clients[$this->from->resourceId] = [
            'connection' => $this->from,
            'room' => $data['room']
        ];
        $this->socket->setClients($clients);
    }
}
