/**
 * Created by fernando on 16/01/15.
 *
 * Filename:    generalModel.js
 */

define([
    'underscore',
    'backbone'

], function(_, Backbone) {

    //Model
    var missueModel = Backbone.Model.extend({

        //Parse
        parse: function(data) {
            return data.data;
        }

    });

    //Return model
    return missueModel;

});
