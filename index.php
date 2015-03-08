<?php
require __DIR__.'/vendor/autoload.php';
require __DIR__.'/Cache.php';
define('TMP_TASK', '/tmp/Task/');
session_cache_limiter(false);
session_start();


if( !file_exists( TMP_TASK ) )
	mkdir(TMP_TASK);

$app = new \Slim\Slim();
$Cache = new Cache();
$delay = function(){

	//echo $_SESSION['stemer_ticket'];
	$app = \Slim\Slim::getInstance();
	//echo "aahaha	ha";
	$env = $app->environment;

	
	

	$app->view->setData("sid", session_id() ) ;

	//sleep(2);
};

$app->add(new \Slim\Middleware\SessionCookie(array(
    'expires' => '60 minutes',
    'path' => '/',
    'domain' => null,
    'secure' => false,
    'httponly' => false,
    'name' => 'slim_session',
    'secret' => 'cha',
    'cipher' => MCRYPT_RIJNDAEL_256,
    'cipher_mode' => MCRYPT_MODE_CBC
)));

$app->get('/',$delay,function() use ($app, $Cache) {

	$app = \Slim\Slim::getInstance();
	//echo "aahaha	ha";
	$env = $app->environment;
	//Vemos si tenemos un Usuario
	if( $Cache->isCached("user" . session_id() ) ){
    	$username = $Cache->retrieve("user". session_id()    );
    }else{
    	$username = "";
    }
	$app->render('home.php' , array( "env" => $env , "username" => $username  ) );



});




$app->put('/task/:id',$delay,function($id) use ($app, $Cache) { 
	$body = $app->request->getBody();
	$jA = json_decode($body);
	$taskJ = array();
	if( $Cache->isCached("task") ){
		$task = $Cache->retrieve("task");

		foreach ($task as $key => $value) {
			if( $key = $id ){
				$task[$key]['name'] = $jA->name;
				$task[$key]['order'] = $jA->order;
				$taskJ = $task[$key]; 
			}	
		}

		 $Cache->store("task" , $task  );
	}else{

		$taskJ = array();
	}


 // This is our new stuff
    $context = new ZMQContext();
    $socket = $context->getSocket(ZMQ::SOCKET_PUSH, 'my pusher');
    $socket->connect("tcp://localhost:5555");
    $taskJ['event'] = "updateTask";
    $socket->send(json_encode( $taskJ ));

	
	echo json_encode( $taskJ );

 } );
$app->post('/task',$delay,function() use ($app, $Cache) { 

	 $body = $app->request->getBody();
	 $jA = json_decode($body);
	 $id =  time();
	 if( $Cache->isCached("task") ){
		$task = $Cache->retrieve("task");
		$contador = count( $task  ) + 1 ;
		
		$task[$id ] = array('id' => $id , 'name' => $jA->name , 'order' => $jA->order );


	}else{

		$task[$id] = array('id' => $id  ,  'name' => $jA->name , 'order' => $jA->order  );
	}


 // This is our new stuff
    $context = new ZMQContext();
    $socket = $context->getSocket(ZMQ::SOCKET_PUSH, 'my pusher');
    $socket->connect("tcp://localhost:5555");

    $socket->send(json_encode(array( 'event' =>  "newTask" , 'id' => $id , 'name' => $jA->name , 'order' => $jA->order )));


	$Cache->store("task" , $task  );

	echo json_encode(array('id' => $id , 'name' => $jA->name , 'order' => $jA->order ) );
});

$app->get('/chat',$delay,function() use ($app, $Cache) {

	if( $Cache->isCached("chat") ){
		$taskt = $Cache->retrieve("chat");
		$task = array();
		foreach ($taskt as $key => $value) {
			# code...
			$chat[] = $value;
		}
	}else{

		$chat = array();
	}


	
	echo json_encode(  array( "data" => $chat ) );
	 
	

});


$app->post('/chat',$delay,function() use ($app, $Cache) {
	$body = $app->request->getBody();
	$jA = json_decode($body,true);
	$id =  time();
    if( $Cache->isCached("chat") ){
        $chat = $Cache->retrieve("chat");



        $contador = count( $chat  ) + 1 ;
                
        $chat[$id ] = array('id' => $id , 'username' => $jA['username'] , 'Message' => $jA['Message'] );
        echo json_encode(   $chat[$id ] );
        $chat[$id ]['event'] = "newChat";
        $chat[$id]['sid'] =  session_id();
		$context = new ZMQContext();
	    $socket = $context->getSocket(ZMQ::SOCKET_PUSH, 'my pusher');
	    $socket->connect("tcp://localhost:5555");
	   
	    $socket->send(json_encode( $chat[$id ]  ));
        $chat = array_slice( array_reverse( $chat ), 0, 20, true);
        $chat = array_reverse( $chat );

    }else{

        $chat[$id ] = array('id' => $id , 'username' => $jA['username'] , 'Message' => $jA['Message'] );
        echo json_encode(   $chat[$id ] );
    }

    $Cache->store("chat" , $chat  );
	
    // Seteamos Nuestro Usuario.
    if( !$Cache->isCached("user" . session_id() ) ){
    	 $Cache->store("user". session_id()  , $jA['username']  );
    }

	
	
	 
	

});

$app->get('/task',$delay,function() use ($app, $Cache) {

	if( $Cache->isCached("task") ){
		$taskt = $Cache->retrieve("task");
		$task = array();
		foreach ($taskt as $key => $value) {
			# code...
			$task[] = $value;
		}
	}else{

		$task = array();
	}


	
	echo json_encode(  array( "data" => $task ) );
	 
	

});

$app->delete('/task/:id',$delay, function($id) use ($app, $Cache){

	if( $Cache->isCached("task") ){
		$task = $Cache->retrieve("task");

		foreach ($task as $key => $value) {
			if( $key = $id ){
				

				$context = new ZMQContext();
			    $socket = $context->getSocket(ZMQ::SOCKET_PUSH, 'my pusher');
			    $socket->connect("tcp://localhost:5555");
			   	$task[$key]['event'] = "deleteTask";
			    $socket->send(json_encode( $task[$key] ));

			    unset($task[$key]);
			}
		}

		 $Cache->store("task" , $task  );
	}else{

		$task = array();
	}

	

});

$app->get('/task/:id/run',$delay,function($id) use ($app, $Cache) {
	$taskInfo = array();
	if( $Cache->isCached("task") ){
		$task = $Cache->retrieve("task");

		foreach ($task as $key => $value) {
			if( $key = $id ){
				$taskInfo = $task[$key] ;
			}
		}

		 //$Cache->store("task" , $task  );
	}


	for ($i=0; $i < 101 ; $i++) { 
		
		file_put_contents( TMP_TASK.$id."_progres.json" , json_encode( array( "progress" => $i )));
		

		$context = new ZMQContext();
			    $socket = $context->getSocket(ZMQ::SOCKET_PUSH, 'my pusher');
			    $socket->connect("tcp://localhost:5555");
			   	$task[$key]['event'] = $id."statusTask";
			    $socket->send(json_encode( array( "id" => $id , "event" => $id."statusTask" ,  "progress" => $i) ));
		$t = rand ( 1 , 10 );

		if( $t > 6)
			sleep(1);

	}

	
	


 });


$app->get('/task/:id/status',$delay,function($id) use ($app, $Cache) {
	$taskInfo = array();
	


	echo @file_get_contents(TMP_TASK.$id."_progres.json");


 });

$app->get('/task/:id/subtask', $delay,function($id) use ($app,$Cache ) {

	if( $Cache->isCached($id."_sutask") ){
		$taskt = $Cache->retrieve($id."_sutask");
		$task = array();
		foreach ($taskt as $key => $value) {
			# code...
			$task[] = $value;
		}
	}else{

		$a = rand ( 1 , 5 );
		for ($i=0; $i < $a ; $i++) { 
			$task[] = array("id" => $i.time() , "parentId" => $id , "name" => $id."n".time() , "order" => $i);
		
		}
		$Cache->store($id."_sutask" , $task  );
	
	}


	// Para simular 	
	//sleep(2);
	echo json_encode(  array( "data" => $task ) );


});


$app->run();


?>