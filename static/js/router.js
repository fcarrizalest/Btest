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

            'task/:id/edit'         :   'taskEdit',
            'task/add'              :   'taskAdd', 
            "*actions"              :   "defaultRoute"      //Home (Backbone will try match the route above first)
        }
    });
    var collection = new generalCollection();
         
    collection.url = "task";
    collection.comparator = 'order';
    
    var $HomeView = new HomeView({collection:collection});
    var $newTask = new NewTaskView( {collection:collection}  );
    

    //Initialize
    var initialize = function(){

        // Instantiate the router, model, collection
        var app_router          =   new AppRouter;
        
        $( document ).ajaxStart(function() {
            $( "#loading" ).show();
        });

        $( document ).ajaxStop(function() {
            $( "#loading" ).hide();
        });
       
        //Route home
        app_router.on('route:defaultRoute', function(){
            console.log("Default");
            $HomeView.app_router = app_router;
            $HomeView.render();

        });

         app_router.on('route:taskAdd', function(){

            $newTask.app_router = app_router;
            $newTask.$id = 0;
            $newTask.render();
            

         } );


         app_router.on('route:taskEdit', function($id){


            $newTask.app_router = app_router;
            $newTask.$id = $id;
            $newTask.render();
            

         } );


       

        // Start Backbone history a necessary step for bookmarkable URL's
        Backbone.history.start();
    };

    return {
        initialize: initialize
    };
});

