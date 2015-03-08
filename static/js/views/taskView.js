/**
 * Created by fernando on 14/01/15.
 *
 * Filename:    MissueView.js
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'mustache',
    'text!templates/task.html'

], function($, _, Backbone, Mustache, RowTemplate){

    //Views
    var TaskView = Backbone.View.extend({

        tagName: "tr",

        //Initialize
        initialize: function(){
            this.render();
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'sync', this.render);
            
        },

        setConn:function(conn){

            
            $self = this;
             conn.subscribe(  this.model.get("id") + 'statusTask', function(topic, data) {
                    // This is where you would add the new article to the DOM (beyond the scope of this tutorial)
                        

                         $self.onMessageStatusTask( data ); 
                        //console.log('New article published to category "' + topic + '" : ' + data.title);
            });

        },

        //Render
        render: function(){

          
            //Add model in view
            $(this.el).html(Mustache.to_html( RowTemplate , this.model.toJSON()));

           
        },
        taskEdit:function(){

            this.app_router.navigate("/task/"+ this.model.get("id")+"/edit",{trigger: true, replace: true});
            
        },
        taskDel:function(){
            
            this.model.destroy( );


        },
        onMessageStatusTask:function(e){

                        
            $progress = parseInt( e.progress  );
            
            console.log('#'+e.id + '_meter' );
            $('#'+ e.id + '_meter').css('width', $progress + "%" );
                        

        },
        
        taskRun:function(){

            var $self = this;
            var $jq = $;
           
            

            $.ajax({
                    url: 'task/'+ this.model.get("id") + "/run",
                    data: {} ,
                    success: function(){

                     
                        $jq('#'+$self.model.get("id") + '_meter').css('width', "100%" );
                        
                    },
  
            });
            

        },
        events:{
            "click .del"  : "taskDel",
            'click .edit' : "taskEdit",
            "click .run"  : "taskRun"
        },

    });

    //Return View
    return TaskView;
});
