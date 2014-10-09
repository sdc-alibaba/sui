/* jshint node: true */

module.exports = function(grunt) {
  'use strict';
  require('load-grunt-tasks')(grunt);

  var generateRawFiles = require('./grunt/raw-files-generator.js');

  var concatPath = function(paths, base) {
    return paths.map(function(v) {
      return base + v;
    })
  }

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*dpl started*/',
    distRoot: grunt.option('target') || '.package',
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
        }
      }
    },

    uglify: {
      options: {
        sourceMap: false
      },
      build: {
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
      suiAppend: {
        src: ['less/<%= pkg.name %>-append.less'],
        dest: '<%= distRoot %>/css/<%= pkg.name %>-append.css'
      },
      suiAppendMin: {
        options: {
          compress: true
        },
        src: ['less/<%= pkg.name %>-append.less'],
        dest: '<%= distRoot %>/css/<%= pkg.name %>-append.min.css'
      },
      themes: {
        files: [{
          expand: true,
          cwd: 'less/',
          src: ['sui-themes-*.less'],
          dest: '<%= distRoot %>/css/',
          ext: '.css'
        }]
      },
      themesMin: {
        options: {
          compress: true
        },
        files: [{
          expand: true,
          cwd: 'less/',
          src: ['sui-themes-*.less'],
          dest: '<%= distRoot %>/css/',
          ext: '.min.css'
        }]
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
          src: ['**/*.jade', '!_*.jade'],
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
        tasks: ['less:sui', 'less:suiAppend', 'newer:copy']
      },
      themes: {
        files: 'less/themes/*.less',
        tasks: ['less:themes']
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
        tasks: ['less:docs']
      }
    }
  });


  //custom task
  grunt.registerTask('build-raw-files', 'Add scripts/less files to customizer.', function () {
    var banner = grunt.template.process('<%= banner %>');
    generateRawFiles(grunt, banner);
  });

  // Test task.
  grunt.registerTask('test', ['jshint']);

  // JS distribution task.
  grunt.registerTask('dist-js', ['browserify', 'uglify:build']);

  // CSS distribution task.
  grunt.registerTask('dist-css', ['less']);

  // CSS distribution task.
  grunt.registerTask('dist-fonts', ['copy:fonts']);

  // Full distribution task.
  grunt.registerTask('dist', ['dist-css', 'dist-js', 'dist-fonts']);
  grunt.registerTask('docs', ['jade']); //必须先执行dist才能执行此任务

  //custom page
  grunt.registerTask('custom', ['build-raw-files']);


  // Default task.
  grunt.registerTask('default', ['test', 'dist', 'docs', 'custom', 'copy']);
  //local server and watch
  grunt.registerTask('local',['connect','watch']);
}
