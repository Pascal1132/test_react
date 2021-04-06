<?php

namespace Server\Ajax;

use PHP_CodeSniffer\Util\Standards;
use Server\Socket;

class AjaxClients
{
    protected $socket;
    protected $from;
    protected $msg;
    function __construct(Socket $socket = null, $msg = [], $from = null)
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
        $arr_return = $this->getClientsFromRoom($this->socket->getClients(), $room);
        return ['clients' => $arr_return];
    }
    private function add()
    {
        $data = get_object_vars($this->msg['data']);
        $clients = $this->socket->getClients();
        $role = 'standard';
        $id = $data['id'];
        $room = $data['room'];
        if (isset($clients[$id])) {
            $clients[$id]['connection']->send(json_encode(['disconnect'=> 'Une connexion à été faite en votre nom :| ']));
            $this->socket->getConnections()->detach($clients[$id]['connection']);
            unset($clients[$id]);

        }
        if (sizeof($this->getClientsFromRoom($clients ?? [], $data['room'])) === 0) {
            $role = 'admin';
        }
        $clients[$this->from->resourceId] = [
            'connection' => $this->from,
            'room' => $room,
            'role' => $role
        ];
        $id = $this->from->resourceId;

        $this->from->send(json_encode(['role' => $role, 'id' => $id, 'room' => $room]));
        $this->socket->setClients($clients);
        $this->refreshClients($clients, $data['room']);
    }

    private function getClientsFromRoom($clients, $room)
    {
        $arr_return = [];
        foreach ($clients ?? [] as $id => $client) {
            if ($room === $client['room']) {
                $arr_return[$id] = $client;
            }
        }
        return $arr_return;
    }

    public function refreshClients($clients, $room)
    {
        foreach ($clients as $client) {
            if ($client['room'] === $room) {
                $conn = $client['connection'];
                $conn->send(json_encode(['clients' => $this->getClientsFromRoom($clients, $room)]));
            }
        }
    }
}
