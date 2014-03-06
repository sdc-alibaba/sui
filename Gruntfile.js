/* jshint node: true */

var exec = require("child_process").exec;

module.exports = function(grunt) {
  'use strict';
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*dpl started*/',
    distRoot: 'build',
    docsRoot: 'docs',
    demosRoot: '<%= docsRoot %>/demos',

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
    requirejs: {
      development: {
        options: {
          baseUrl: "js",
          name: "almond",
          optimize: "none",
          include: '<%= pkg.name %>',
          insertRequire: ['<%= pkg.name %>'],
          mainConfigFile: "js/requirejs-config.js",
          out: '<%= distRoot %>/js/<%= pkg.name %>.js',
          wrap: true
        }
      },
      production: {
        options: {
          baseUrl: "js",
          name: "almond",
          include: '<%= pkg.name %>',
          insertRequire: ['<%= pkg.name %>'],
          optimize: "uglify2",
          mainConfigFile: "js/requirejs-config.js",
          preserveLicenseComments: false, //这个不能和sourcemap同时使用
          generateSourceMaps: true,
          out: '<%= distRoot %>/js/<%= pkg.name %>.min.js',
          wrap: true
        }
      }
    },

    recess: {
      options: {
        compile: true
      },
      bootstrap: {
        src: ['less/<%= pkg.name %>.less'],
        dest: '<%= distRoot %>/css/<%= pkg.name %>.css'
      },
      min: {
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
      }
    },
    jade: {
      demos: {
        options: {
          pretty: true
        },
        files: [
          {
          expand: true,
          cwd: '<%= demosRoot %>/templates',
          src: ['**/*.jade', '!base.jade', '!sidenav.jade', '!header.jade', '!com-*', '!*-com.jade'],
          dest: '<%= demosRoot %>',
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
    qunit: {
      options: {
        inject: 'js/tests/unit/bootstrap-phantom.js'
      },
      files: ['js/tests/*.html']
    },

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
        tasks: ['recess', 'copy']
      },
      js: {
        files: 'js/*.js',
        tasks: ['dist-js', 'copy']
      },
      demos: {
        files: 'docs/demos/templates/**/*.jade',
        tasks: ['jade:demos']
      }
    }
  });


  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-recess');
  // Test task.
  grunt.registerTask('test', ['jshint', 'qunit']);

  // JS distribution task.
  grunt.registerTask('dist-js', ['requirejs']);

  // CSS distribution task.
  grunt.registerTask('dist-css', ['recess']);

  // CSS distribution task.
  grunt.registerTask('dist-fonts', ['copy:fonts']);

  // Full distribution task.
  grunt.registerTask('dist', ['dist-css', 'dist-js', 'dist-fonts']);
  grunt.registerTask('docs', ['jade']); //必须先执行dist才能执行此任务

  // Default task.
  grunt.registerTask('default', ['test', 'dist', 'docs']);
}
