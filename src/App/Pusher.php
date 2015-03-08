<?php
namespace App;
use Ratchet\ConnectionInterface;
use Ratchet\Wamp\WampServerInterface;

class Pusher implements WampServerInterface {

    protected $subscribedTopics = array();
    protected $users = array();
    public function onSubscribe(ConnectionInterface $conn, $topic) {

        $this->subscribedTopics[$topic->getId()] = $topic;
    }
    public function onUnSubscribe(ConnectionInterface $conn, $topic) {



    }
    public function onOpen(ConnectionInterface $conn) {


        echo "nueva Conexion";

      

    }
    public function onClose(ConnectionInterface $conn) {

        echo "conexion cerrada ";

    }
    public function onCall(ConnectionInterface $conn, $id, $topic, array $params) {
        // In this application if clients send data it's because the user hacked around in console
        $conn->callError($id, $topic, 'You are not allowed to make calls')->close();
    }
    public function onPublish(ConnectionInterface $conn, $topic, $event, array $exclude, array $eligible) {
        // In this application if clients send data it's because the user hacked around in console
        $conn->close();
       

        $topic->broadcast($event);

    }
    public function onError(ConnectionInterface $conn, \Exception $e) {
    }


   

     /**
     * @param string JSON'ified string we'll receive from ZeroMQ
     */
    public function onNotification($entry) {
        $entryData = json_decode($entry, true);

        // If the lookup topic object isn't set there is no one to publish to
        if (!array_key_exists($entryData['event'], $this->subscribedTopics)) {
            return;
        }

        $topic = $this->subscribedTopics[$entryData['event']];

        if( $topic->getId() == "newChat" ){
            // Es un Nuevo Mensaje
            $this->users[ $entryData['sid']] = $entryData['username'];
            


        }
        // re-send the data to all the clients subscribed to that category
        $topic->broadcast($entryData);

    }
    
}

?>