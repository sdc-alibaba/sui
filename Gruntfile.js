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
    requirejs: {
      sui: {
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
      suiMin: {
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
      },
      "extends": {
        options: {
          baseUrl: "js",
          name: "almond",
          optimize: "none",
          include: 'sui-extends',
          insertRequire: ['sui-extends'],
          mainConfigFile: "js/requirejs-config.js",
          out: '<%= distRoot %>/js/sui-extends.js',
          wrap: true
        }
      },
      extendsMin: {
        options: {
          baseUrl: "js",
          name: "almond",
          include: 'sui-extends',
          insertRequire: ['sui-extends'],
          optimize: "uglify2",
          mainConfigFile: "js/requirejs-config.js",
          preserveLicenseComments: false, //这个不能和sourcemap同时使用
          generateSourceMaps: true,
          out: '<%= distRoot %>/js/sui-extends.min.js',
          wrap: true
        }
      },
      "all": {
        options: {
          baseUrl: "js",
          name: "almond",
          optimize: "none",
          include: 'sui-all',
          insertRequire: ['sui-all'],
          mainConfigFile: "js/requirejs-config.js",
          out: '<%= distRoot %>/js/sui-all.js',
          wrap: true
        }
      },
      allMin: {
        options: {
          baseUrl: "js",
          name: "almond",
          include: 'sui-all',
          insertRequire: ['sui-all'],
          optimize: "uglify2",
          mainConfigFile: "js/requirejs-config.js",
          preserveLicenseComments: false, //这个不能和sourcemap同时使用
          generateSourceMaps: true,
          out: '<%= distRoot %>/js/sui-all.min.js',
          wrap: true
        }
      }
    },

    recess: {
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
    qunit: {
      options: {
        inject: 'js/tests/unit/phantom.js'
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
        tasks: ['recess:sui', 'recess:extends', 'recess:all', 'copy']
      },
      js: {
        files: 'js/*.js',
        tasks: ['requirejs:sui', 'requirejs:extends', 'requirejs:all', 'copy']
      },
      docs: {
        files: '<%= docsRoot %>/templates/**/*.jade',
        tasks: ['jade:docs']
      },
      docsCss: {
        files: '<%= docsRoot %>/assets/less/**/*.less',
        tasks: ['recess:docs']
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
  //local server and watch
  grunt.registerTask('local',['connect','watch']);
}
