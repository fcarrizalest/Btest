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
        taskStatus:function(){


            var $jq = $;
            var $self = this;
            $.ajax({
                    url: 'task/'+ this.model.get("id") + "/status",
                    data: {} ,
                    success: function( data ){

                           
                        $con = parseInt(  $jq('#'+$self.model.get("id") +'_meter').css('width') );
                        
                        $progress = parseInt( data.progress  );
                        
                        $jq('#'+$self.model.get("id") + '_meter').css('width', $progress + "%" );
                        
                    },
                    dataType:"json"
  
            });
            
           
        },
        taskRun:function(){

            var $self = this;
            var $jq = $;
            var timerId =  setInterval(function(){

                $self.taskStatus();
            } , 2015);
            

            $.ajax({
                    url: 'task/'+ this.model.get("id") + "/run",
                    data: {} ,
                    success: function(){

                        clearTimeout(timerId);
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
