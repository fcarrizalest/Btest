/**
 * Created by fernando on 14/01/15.
 *
 * Filename:    router.js
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'views/HomeView',
    'collections/generalCollection',
    'views/newTaskView',
    'views/chatView',
    'views/newSubTaskView'

],function($, _, Backbone, HomeView , generalCollection , NewTaskView , chatView,newSubTaskView){



    //Routers
    var AppRouter = Backbone.Router.extend({

        routes:{
            'chat'                  :   'chat',
            'task/:id/addsubtask'   :   'subtaskadd',
            'task/:id/edit'         :   'taskEdit',
            'task/add'              :   'taskAdd', 
            "*actions"              :   "defaultRoute"      //Home (Backbone will try match the route above first)
        }
    });
    var collection = new generalCollection();
         
    collection.url = "task";
    collection.comparator = 'order';

    
    var collectionSubtask = new generalCollection();

    var collectionChat = new generalCollection();
    collectionChat.url = "chat";


    var $HomeView = new HomeView({collection:collection});
    $HomeView.collectionSubtask = collectionSubtask;
    var $newTask = new NewTaskView( {collection:collection  }  );
    
    $newTask.collectionSubtask = collectionSubtask;

    var $chatView = new chatView( { collection:collectionChat });

    var $newSubTaskView = new newSubTaskView({collection:collectionSubtask  });

    

    var conn = new ab.Session('ws://'+$datos.host()+':8080',
                    function() {
                    
                    $("#conectado").show();
                    $("#error").hide();
                     conn.subscribe('newTask', function(topic, data) {
                    // This is where you would add the new article to the DOM (beyond the scope of this tutorial)
                        
                         $HomeView.onMessageNewTask( data ); 
                        //console.log('New article published to category "' + topic + '" : ' + data.title);
                    });

                     conn.subscribe('updateTask', function(topic, data) {
                    // This is where you would add the new article to the DOM (beyond the scope of this tutorial)
                        
                         $HomeView.onMessageUpdateTask( data ); 
                        //console.log('New article published to category "' + topic + '" : ' + data.title);
                    });

                      conn.subscribe('deleteTask', function(topic, data) {
                    // This is where you would add the new article to the DOM (beyond the scope of this tutorial)
                        
                         $HomeView.onMessageDeleteTask( data ); 
                        //console.log('New article published to category "' + topic + '" : ' + data.title);
                    });

                      conn.subscribe('newChat', function(topic, data) {
                    // This is where you would add the new article to the DOM (beyond the scope of this tutorial)
                            
                         $chatView.onMessageNewChat( data ); 
                        //console.log('New article published to category "' + topic + '" : ' + data.title);
                    });

                      conn.subscribe('newUser', function(topic, data) {
                    // This is where you would add the new article to the DOM (beyond the scope of this tutorial)
                            
                        chatView.onMessageNewUser( data ); 
                        //console.log('New article published to category "' + topic + '" : ' + data.title);
                    });

                      $HomeView.conn = conn;
                      $HomeView.setConn( conn );
                     // $chatView.conn = conn ;
                },
                function() {
                    $("#conectado").hide();
                    $("#error").show();
                    console.warn('WebSocket connection closed');

                },
                {'skipSubprotocolCheck': true}
            );



    //Initialize
    var initialize = function(){

        // Instantiate the router, model, collection
        var app_router          =   new AppRouter;
        
        $( document ).ajaxStart(function() {
            $( ".loading" ).show();
        });

        $( document ).ajaxStop(function() {
            $( ".loading" ).hide();
        });
       
        //Route home
        app_router.on('route:defaultRoute', function(){
            
            $("#list_A").hide();
            $HomeView.app_router = app_router;
            $HomeView.render();

        });

         app_router.on('route:taskAdd', function(){
            $("#list_A").hide();
            $newTask.app_router = app_router;
            $newTask.$id = 0;
            $newTask.render();
            

         } );


         app_router.on('route:taskEdit', function($id){

            $("#list_A").show();
            $newTask.app_router = app_router;
            $newTask.$id = $id;
            $newTask.render();
            

         } );

         app_router.on('route:subtaskadd', function($id){

            
            console.log("New SubTaskAdd: " + $id  );
            $newSubTaskView.$id = $id;
            $newSubTaskView.render();

         } );


         app_router.on('route:chat' , function() {

            $chatView.render();

         });


        // Start Backbone history a necessary step for bookmarkable URL's
        Backbone.history.start();
    };

    return {
        initialize: initialize
    };
});

