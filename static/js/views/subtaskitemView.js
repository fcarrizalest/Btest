define([
    'jquery',
    'underscore',
    'backbone',
    'mustache',
    'text!templates/subtaskItem.html'

], function($, _, Backbone, Mustache, RowTemplate){

    //Views
    var TaskView = Backbone.View.extend({ 
    	tagName:"tr",
		initialize: function(){ 
			this.render();

		},
		render: function() {
			console.log("aabbbbaa");

			 $(this.el).html(Mustache.to_html( RowTemplate , this.model.toJSON()));

		}


    });

    return TaskView;

});