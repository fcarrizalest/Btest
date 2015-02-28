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
    'views/newTaskView'

],function($, _, Backbone, HomeView , generalCollection , NewTaskView ){

    //Routers
    var AppRouter = Backbone.Router.extend({

        routes:{
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

    var $HomeView = new HomeView({collection:collection});
    $HomeView.collectionSubtask = collectionSubtask;
    var $newTask = new NewTaskView( {collection:collection  }  );
    
    $newTask.collectionSubtask = collectionSubtask;


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

            

         } );


         


       

        // Start Backbone history a necessary step for bookmarkable URL's
        Backbone.history.start();
    };

    return {
        initialize: initialize
    };
});

