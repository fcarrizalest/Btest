<?php
require './vendor/autoload.php';
require './Cache.php';
define('TMP_TASK', sys_get_temp_dir(). '/Task/');

if( !file_exists( TMP_TASK ) )
	mkdir(TMP_TASK);

$app = new \Slim\Slim();
$Cache = new Cache();
$delay = function(){

	sleep(1);
};

$app->get('/',$delay,function() use ($app, $Cache) {


	
	$app->render('home.php' );



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


	$Cache->store("task" , $task  );

	echo json_encode(array('id' => $id , 'name' => $jA->name , 'order' => $jA->order ) );
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
	sleep(2);
	echo json_encode(  array( "data" => $task ) );


});


$app->run();


?>