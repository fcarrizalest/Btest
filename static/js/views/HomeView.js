/**
 * Created by fernando on 14/01/15.
 *
 * Filename:    HomeViews.js
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'mustache',
    'views/taskView',
    'collections/generalCollection',
    'models/generalModel',
     'text!templates/home.html'
    

], function($, _, Backbone , Mustache , taskView, generalCollection , generalModel , homeT ){

    //Views
    var HomeView = Backbone.View.extend({

        el: $("#page"),
        initialize: function(){

            
         
            this.collection.url = "task";
            _.bindAll(this, 'addOne', 'addAll');
            this.collection.bind('reset', this.addAll ,this.collection );
            this.collection.bind('remove', this.addAll , this.collection );
            this.collection.bind('add', this.addAll , this.collection );
            //this.collection.bind('sort', this.addAll , this.collection );
            this.collection.bind('change', this.addAll , this.collection );
            
             

        },
        onMessageNewTask: function( e ){ 
             console.log(" onMessage   ");
             console.log( e   );

             this.collection.add( { id:  e.id , name: e.name , order: e.order } );

        },

        onMessageUpdateTask: function( e ){ 
             console.log(" onMessage   ");
             console.log( e   );

             var model = this.collection.get( e.id );

             model.set( "name" , e.name);
             model.set( "order" , e.order);
            
             
             //this.collection.set( { id:  e.id , name: e.name , order: e.order } );

        },

        onMessageDeleteTask: function( e ){ 
             console.log(" onMessage   ");
             console.log( e   );

             this.collection.remove( { id:  e.id , name: e.name , order: e.order } );

        },
        
         addAll: function(){
           
           
        
            //recorremos por cada vista guardada
            _.each(this.iViews,
                function(opView) {
                    //removemos la vista
                    opView.remove();
                }
            );

            //create /update array view
            this.iViews = [];
           
            //send model the method addOne
            this.collection.each(this.addOne);
        },

        addOne: function(missue){

            // Instantiate the View
            var iView = new taskView({
                model: missue
            });

            //Add collection in view
            iView.collection = this.collection;
            iView.app_router =  this.app_router;
            iView.collectionSubtask = this.collectionSubtask;
            //Add view in array
            this.iViews.push(iView);

            //Add view in HomeView
            $(this.el).append(iView.el);
        },

        //Render
        render: function(){

            // Load the compiled HTML into the Backbone "el"
            
            $(this.el).html(Mustache.to_html( homeT ) );
            
            if( this.collection.length == 0 )
                this.collection.fetch({reset:true});
            else
                this.addAll();

            

            
        }

    });

    //Return View
    return HomeView;
});