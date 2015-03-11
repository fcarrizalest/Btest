define([
    'jquery',
    'underscore',
    'backbone',
    'mustache',
    'text!templates/chatItem.html',
    'aes'
    

], function($, _, Backbone , Mustache  , chatItem ,aes){

    //Views
    var HomeView = Backbone.View.extend({

        
        initialize: function(){

            console.log("inicial");
            console.log(this.model);

            this.render();
        },
        

        //Render
        render: function(){ 
        	
           
            
            console.log(this.model);
            var t = this.model.get("Message");
            //t = t.replace("/\s/g", '');
            //t = unescape(encodeURIComponent( t ) );
            console.log(t);
            if( t.length > 0){
            var d = Aes.Ctr.decrypt(t, "12345", 256);
            console.log(d);
            }else{
                d = " ";
            }
                
            this.model.set( "MessageDe", d , {silent: true})  ;
        	$(this.el).html(Mustache.to_html( chatItem , this.model.toJSON()));
            $(this.el).addClass("row");
            $(this.el).addClass("c"+ this.model.get("id"));

        }

    });

    return HomeView;

});