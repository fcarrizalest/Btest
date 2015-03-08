define([
    'jquery',
    'underscore',
    'backbone',
    'mustache',
    'models/generalModel',
    'views/chatItemView',
    'text!templates/chat.html'
    
    

], function($, _, Backbone , Mustache , generalModel , chatItemView ,chatT ){

    //Views
    var HomeView = Backbone.View.extend({

        el: $("#chat"),
        initialize: function(){
            this.collection.url = "chat";
            this.model = new generalModel();
            _.bindAll(this, 'addOne', 'addAll');
            this.collection.bind('reset', this.addAll ,this.collection );
            this.collection.bind('remove', this.addAll , this.collection );
            this.collection.bind('add', this.addAll , this.collection );
            //this.collection.bind('sort', this.addAll , this.collection );
            this.collection.bind('change', this.addAll , this.collection );

            this.render();
            this.model.url = "chat";

            this.collection.fetch({reset:true});
        },
        addAll: function(){
           
           
            
            console.log(this.collection);
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

        addOne: function(missue){

            // Instantiate the View
            var iView = new chatItemView({
                model: missue
            });


           

            //Add collection in view
            iView.collection = this.collection;
            iView.app_router =  this.app_router;
            iView.collectionSubtask = this.collectionSubtask;
            //Add view in array
            this.iViews.push(iView);

            //Add view in HomeView
            $("#con").append(iView.el);
        },
        send : function(){
            console.log("hola");
            var username = $("#username").val()
            if( username == "" ){


            }else{
                this.model.set("username",username);

                $("#username").hide();
                $("#msg").show()
                var txt = $("#msg").val();

                $("#msg").val(" ");
                var myTopic = "newChat";
                var myEvent = {  username:username, sid: $datos.sid() , event:"newChat" ,  Message: txt  };

                //console.log(this.conn);
                if( txt != ""){
                    //this.conn.publish(myTopic, myEvent);
                    this.model.set("Message", txt);
                    this.model.save();
                }
            }

        },
        keyPressEventHandler: function(){
             if(event.keyCode == 13){
                this.$("#send").click();
            }

        },
        onMessageNewChat:function(e){

            console.log("Nuevo Mensaje ");
            console.log(e);

            this.collection.add(e);
            console.log( $('#con').scrollHeight);
            $('#con').animate({ scrollTop: $('#con')[0].scrollHeight }, 1000 );
                 
        },
        onMessageNewUser:function(e){
            console.log("Nuevo Usuario Conectado ");
            console.log(e);

        },
        //Render
        render: function(){ 
            $(this.el).html(Mustache.to_html( chatT  ) );

            
            $("#username").val($datos.username());

            if( $datos.username() != "" ){
                $("#username").hide();
                $("#msg").show();

            }
                


        },events:{
            "click #send" : "send",
            "keyup #msg"  : "keyPressEventHandler",
            "keyup #username"  : "keyPressEventHandler"
            
        },

    });

    return HomeView;

});