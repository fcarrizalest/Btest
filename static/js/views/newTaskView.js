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
     'text!templates/newTask.html'
    

], function($, _, Backbone , Mustache , taskView, generalCollection , generalModel , homeT ){

    //Views
    var HomeView = Backbone.View.extend({

        el: $("#page"),
        initialize: function(){

           
         
            
             

        },
        

        newTask:function(){

        	n = $('#newT').val();
            o = $('#orderT').val();

            $self = this;
        	if( this.$id == 0 ){
	            

	            $generalModel = new generalModel( {'name': n , 'order':o });
	            $generalModel.url= 'task';

	            
	           
	            
        	}else{
        		$generalModel = this.model;
        		$generalModel.set("name",n);
                $generalModel.set("order",o);



        	}

        	$generalModel.save(null, { wait:true, success:function(res,res2){
                
                if( $self.$id == 0 ){
                    

                    $self.collection.add( res2 );

                }else{

                    
                }


            }});


        	this.app_router.navigate("/", {trigger: true, replace: true});
        },
        //Render
        render: function(){

            // Load the compiled HTML into the Backbone "el"
            $self = this;
            $tm = homeT;
            if( this.collection.length == 0 ){
            	this.collection.fetch({reset:false , success:function(){

            		if( $self.$id == 0 ){
            			$( $self.el).html(Mustache.to_html( $tm ));
	            		
            		}else{
            			$self.model =  $self.collection.get(  $self.$id );
	            		$( $self.el).html(Mustache.to_html( $tm ,  $self.model.toJSON() ) );
            			
            		}

            	}});
            }else{

            	if( this.$id == 0 ){

            		$(this.el).html(Mustache.to_html( $tm ) );
           		}else{

           			this.model =  $self.collection.get(  $self.$id );
           			

	            	$( $self.el).html(Mustache.to_html( $tm ,  this.model.toJSON() ) );
	            	

           		}

            }

           
            //this.collection.fetch({reset:true});

            
        }, events:{
            "click .add" : "newTask"
        },

    });

    //Return View
    return HomeView;
});