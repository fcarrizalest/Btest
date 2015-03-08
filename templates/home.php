<!doctype html>
<html class="no-js" lang="en">
<head>
	<meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script type="text/javascript">

    	
    	var Info = (function() { 


    		 var HTTP_HOST = "<?php echo $env['HTTP_HOST'] ?>";
    		 var uid = "<?php echo $sid  ?>";
    		 var username = "<?php echo $username ?>";
    		 
    		 function Info( ) {
    // Store the mileage property privately.
    			
  			}

  			Info.prototype.host = function() {
    			return HTTP_HOST;
  			}

  			Info.prototype.sid = function(){

  				return uid;
  			}

  			Info.prototype.username = function(){

  				return username ;
  			}

  			return Info;

    	}());

    	$datos = new Info();


    </script>
    <script src="static/js/libs/autobahn.min.js"></script>
	<script data-main="static/js/main" src="static/js/libs/require.js"></script>
	<link rel="stylesheet" href="static/css/normalize.css">
	<link rel="stylesheet" href="static/css/foundation.css" />
	<script src="static/js/libs/modernizr.js"></script>
	<style type="text/css">
		#con{
 
		 overflow-x:hidden;
		    overflow-y:visible;
		height:200px;
		}	
		.loading:after{
			content: " ";
		}
		.loading{
			content: " ";
			background-image: url("static/img/ajax-loader.gif");
			background-repeat: no-repeat;
		}
		.meter{

			-webkit-transition: width 2s; /* For Safari 3.1 to 6.0 */
    		transition: width 2s;
		}

		#conectado{
			display: none;
		}

		
	</style>
</head>
<body>
<div class="row">
	<div class="small-3 columns">
		<ul class="side-nav">
			<li> <a href="#"> Home </a> </li>
			<li> <a href="#task/add"> New </a> </li>
			
		</ul>
		
	</div>
	<div class="small-9 columns">
		<div class="loading">
			&nbsp;
		</div>
		<table role="grid"  id="page">

		</table>
		<table id="list_A" role="grid" >

		</table>
	</div>
</div>

<div class="row">
	<div class="small-2 columns">
		<div id="conectado">
			Conectado
		</div>
		<div id="error">
			Algo Esta Mal
		</div>
	</div>


	<div class="small-10 columns">
		
		<div  class="row" id="chat">

		</div>
	</div>
</div>

<div class="row">
	<div class="small-2 columns">
		.
	</div>


	<div class="small-10 columns" id="con">
		
		
	</div>
</div>



</body>
</html>