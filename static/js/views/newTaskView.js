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
    'text!templates/newTask.html',
    'views/subtasklistView'

    

], function($, _, Backbone , Mustache , taskView, generalCollection , generalModel , homeT , subtasklistView  ){

    //Views
    var HomeView = Backbone.View.extend({

        el: $("#page"),
        initialize: function(){
            
            this.$subtasklistView = new subtasklistView( );


        },
        
        addSubTask:function(){
            if( this.$id != 0 ){
                this.app_router.navigate("/task/"+ this.$id + "/addsubtask", {trigger: true, replace: true}); 
            }
            
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
                $generalModel.set("update",true);
                //console.log($('#'+this.$id + "_u")  );

        	}

        	$generalModel.save(null, { wait:true, 

                success:function(res,res2){
                    console.log("guardar");
                    if( $self.$id == 0 ){
                        
                        $self.collection.add( res2 );

                    }else{
                         
                        $generalModel.set("update",false);
                        
                    }

                },
                error: function(){ 

                    alert("Ocurrio un error");
                } 

            });


        	this.app_router.navigate("/", {trigger: true, replace: true});
        },
        showHtml: function(  ){

            if( this.$id ) {
                

                $( this.el ).html ( Mustache.to_html(homeT  ,  this.model.toJSON() ) );
                
                this.$subtasklistView.collection.url = "task/" + this.$id +"/subtask";

                this.$subtasklistView.collection.fetch({reset:true});

            }else{

                $( this.el ) .html( Mustache.to_html(homeT )  ); 
            } 
           

        },
        //Render
        render: function(){

            // Load the compiled HTML into the Backbone "el"

            
           
            $self = this;
            $tm = homeT;
            if( this.collection.length == 0 ){
            	this.collection.fetch({reset:false , success:function(){

            		if( $self.$id == 0 ){
            			
	            		
                        //$self.showHtml( Mustache.to_html( $tm ) )
            		}else{
            			$self.model =  $self.collection.get(  $self.$id );
	            		
            			//$self.showHtml( Mustache.to_html( $tm ,  $self.model.toJSON() ) ) ;

            		}
                    $self.showHtml(  );

            	}});
            }else{

            	if( this.$id == 0 ){

                    
                    //$self.showHtml( Mustache.to_html( $tm ) )
           		}else{

           			this.model =  $self.collection.get(  $self.$id );
           			
                   
	            	//$self.showHtml( Mustache.to_html( $tm ,  this.model.toJSON() ) )

           		}
                 $self.showHtml(  );

            }

                 
        }, events:{
            "click .add" : "newTask",
            'click .addsubtask': "addSubTask"
        },

    });

    //Return View
    return HomeView;
});