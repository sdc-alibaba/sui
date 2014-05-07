/* jshint node: true */

var exec = require("child_process").exec;

module.exports = function(grunt) {
  'use strict';
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*dpl started*/',
    distRoot: 'build',
    docsRoot: 'docs',

    jshint: {
      options: {
        jshintrc: 'js/.jshintrc'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      src: {
        src: ['js/*.js']
      },
      test: {
        src: ['js/tests/unit/*.js']
      }
    },
    browserify: {
      build: {
        files: {
          '<%= distRoot %>/js/<%= pkg.name %>.js': ['js/<%= pkg.name %>.js'],
          '<%= distRoot %>/js/<%= pkg.name %>-extends.js': ['js/<%= pkg.name %>-extends.js'],
          '<%= distRoot %>/js/<%= pkg.name %>-all.js': ['js/<%= pkg.name %>-all.js']
        }
      }
    },

    uglify: {
      build: {
        options: {
          sourceMap: true
        },
        files: [{
          expand: true,
          cwd: '<%= distRoot %>/js/',
          src: ['**/*.js', '!*.min.js'],
          dest: '<%= distRoot %>/js/',
          ext: '.min.js'
        }]
      }
    },

    less: {
      options: {
        compile: true
      },
      sui: {
        src: ['less/<%= pkg.name %>.less'],
        dest: '<%= distRoot %>/css/<%= pkg.name %>.css'
      },
      suiMin: {
        options: {
          compress: true
        },
        src: ['less/<%= pkg.name %>.less'],
        dest: '<%= distRoot %>/css/<%= pkg.name %>.min.css'
      },
      reponsive: {
        src: ['less/responsive.less'],
        dest: '<%= distRoot %>/css/<%= pkg.name %>-responsive.css'
      },
      minresponsive: {
        options: {
          compress: true
        },
        src: ['less/responsive.less'],
        dest: '<%= distRoot %>/css/<%= pkg.name %>-responsive.min.css'
      },
      "extends": {
        src: ['less/sui-extends.less'],
        dest: '<%= distRoot %>/css/<%= pkg.name %>-extends.css'
      },
      extendsMin: {
        options: {
          compress: true
        },
        src: ['less/sui-extends.less'],
        dest: '<%= distRoot %>/css/<%= pkg.name %>-extends.min.css'
      },
      "all": {
        src: ['less/sui-all.less'],
        dest: '<%= distRoot %>/css/<%= pkg.name %>-all.css'
      },
      allMin: {
        options: {
          compress: true
        },
        src: ['less/sui-all.less'],
        dest: '<%= distRoot %>/css/<%= pkg.name %>-all.min.css'
      },
      docs: {
        files: [{
          expand: true,
          cwd: '<%= docsRoot %>/assets/less/',
          src: ['**/*.less'],
          dest: '<%= docsRoot %>/assets/css/',
          ext: '.css'
        }]
      }
    },
    jade: {
      docs: {
        options: {
          pretty: true
        },
        files: [
          {
          expand: true,
          cwd: '<%= docsRoot %>/templates',
          src: ['**/*.jade', '!base.jade', '!sidenav.jade', '!header.jade', '!com-*', '!*-com.jade'],
          dest: '<%= docsRoot %>',
          ext: '.html'
        },
        ],
      }
    },
    copy: {
      fonts: {
        files: [
          { expand: true, src: ['./fonts/*'], dest: '<%= distRoot %>/' },
        ]
      }
    },
    /*
    qunit: {
      options: {
        inject: 'js/tests/unit/phantom.js'
      },
      files: ['js/tests/*.html']
    },
    */

    connect: {
      server: {
        options: {
          port: 3000,
          base: '.'
        }
      }
    },

    watch: {
      options: {
        livereload: 3456
      },
      css: {
        files: 'less/*.less',
        tasks: ['less:sui', 'less:extends', 'less:all', 'newer:copy']
      },
      js: {
        files: 'js/*.js',
        tasks: ['browserify', 'newer:copy']
      },
      docs: {
        files: '<%= docsRoot %>/templates/**/*.jade',
        tasks: ['newer:jade:docs']
      },
      docsCss: {
        files: '<%= docsRoot %>/assets/less/**/*.less',
        tasks: ['newer:less:docs']
      }
    }
  });


  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-newer');
  // Test task.
  grunt.registerTask('test', ['jshint']);

  // JS distribution task.
  grunt.registerTask('dist-js', ['browserify', 'uglify']);

  // CSS distribution task.
  grunt.registerTask('dist-css', ['less']);

  // CSS distribution task.
  grunt.registerTask('dist-fonts', ['copy:fonts']);

  // Full distribution task.
  grunt.registerTask('dist', ['dist-css', 'dist-js', 'dist-fonts']);
  grunt.registerTask('docs', ['jade']); //必须先执行dist才能执行此任务

  // Default task.
  grunt.registerTask('default', ['test', 'dist', 'docs']);
  //local server and watch
  grunt.registerTask('local',['connect','watch']);
}
