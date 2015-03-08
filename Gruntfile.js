module.exports = function(grunt) {
  grunt.initConfig({

	remotePath: "/var/www/html/btest/",
	pkg: grunt.file.readJSON('package.json'),
	
	
	rsync: {
		dev: {
		  
		  options: {
			src: "../06/",
            dest: '<%= remotePath  %>',
            host: 'smartcycles@10.211.55.6',
            recursive: true,
			exclude: [ "package.json", "node_modules" , "vendor", "composer*", "Gruntfile.js"]
			
		  }
		},
		build:{

			options:{
				src: "../smartcycles/",
				dest: "~/Desktop/Builder/sources/proyectos/smartcycles/",
				recursive: true,
				exclude: [ "package.json", "vendor" , "node_modules" , "Gruntfile.js"]
			}
		}
	  },
	shell: {
		options: {
			stderr: false
		},
		test: {
			command: 'php <%= testDir %>bootstrap.php'
		},
		mountBuild:{

			command: 'sshfs fcarrizalest@104.131.54.26:/home/fcarrizalest/builds/ ~/Desktop/builds/',
		},
		mountBuild2:{
			command: 'sshfs fcarrizalest@104.131.54.26:/home/fcarrizalest/Builder ~/Desktop/Builder/'
		}
	  },
	watch: {
		
	  
		phpWatch: {
		  files: ['**/*.php', '**/*.js'],
		  tasks: [ 'rsync:dev' ] ,
		  options: {
			livereload: false,
			reload: true,
			interrupt: true,
			livereloadOnError:false,
			dateFormat: function(time) {
      					grunt.log.writeln('The watch finished in ' + time + 'ms at' + (new Date()).toString());
      					grunt.log.writeln('Waiting for more changes...');
    		}
		  }
		}
	}
	
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-rsync');
  grunt.loadNpmTasks('grunt-shell');
  
  grunt.registerTask('build', ['shell:mountBuild', 'shell:mountBuild2' , 'rsync:build' ]);
  grunt.registerTask('ver', [ 'watch:phpWatch']);
  
  grunt.registerTask('test', [ 'shell:test']);
  grunt.registerTask('default', [ 'rsync:dev']);
};