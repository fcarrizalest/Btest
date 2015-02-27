define([
    'jquery',
    'underscore',
    'backbone',
    'mustache',
    'text!templates/subtasklist.html',
    'views/subtaskitemView',
    'collections/generalCollection',
   
    

], function($, _, Backbone , Mustache , homeT , subtaskitemView , generalCollection ){


	var HomeView = Backbone.View.extend({ 
		
		el: $('#list_A'),
		initialize: function(){ 
			var collectionSubTask = new generalCollection();
    		collectionSubTask.comparator = 'order';
    		this.collection = collectionSubTask;

			_.bindAll(this, 'addOne', 'addAll');
            this.collection.bind('reset', this.addAll ,this.collection );
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

        addOne: function(taskItem){

            // Instantiate the View
            var iView = new subtaskitemView({
                model: taskItem
            });

            //Add collection in view
            iView.collection = this.collection;
            //iView.app_router =  this.app_router;
            //Add view in array
            this.iViews.push(iView);

            //Add view in HomeView
            $(this.el).append(iView.el);
        },

        //Render
        render: function(){

            // Load the compiled HTML into the Backbone "el"
            
            $(this.el).html(Mustache.to_html( homeT ) );
           
            this.addAll();

            

            
        }

	});


	return HomeView;

});