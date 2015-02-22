/**
 * Created by fernando on 15/01/15.
 *
 * Filename:    generalCollection.js
 */

define([
    'underscore',
    'backbone',
    //'models/generalModel'

], function(_, Backbone/*, missue*/){

    //Collection
    var Collection = Backbone.Collection.extend({

        //model: missue,

        //Parse
        parse: function(data) {
            return data.data;
        }
    });

    //Return Collection
    return Collection;

});