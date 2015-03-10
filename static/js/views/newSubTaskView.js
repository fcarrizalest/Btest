/**
 * Created by fernando on 14/01/15.
 *
 * Filename:    HomeViews.js
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'mustache'

    

], function($, _, Backbone , Mustache ){ 


	var Model = Backbone.Model.extend({ });


	var HomeView = Backbone.View.extend({

		el: $("#page"),
        initialize: function(){
            
            //this.$subtasklistView = new subtasklistView( );


        },
        render:function(){

        	
        }


	});



	return HomeView;


});
