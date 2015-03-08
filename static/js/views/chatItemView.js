define([
    'jquery',
    'underscore',
    'backbone',
    'mustache',
    'text!templates/chatItem.html'
    

], function($, _, Backbone , Mustache  , chatItem ){

    //Views
    var HomeView = Backbone.View.extend({

        
        initialize: function(){

            this.render();
        },
        

        //Render
        render: function(){ 
        	
        	 $(this.el).html(Mustache.to_html( chatItem , this.model.toJSON()));
             $(this.el).addClass("row");
             $(this.el).addClass("c"+ this.model.get("id"));

        }

    });

    return HomeView;

});