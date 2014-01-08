/* jshint node: true */

exec = require("child_process").exec;

module.exports = function(grunt) {
  'use strict';
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*dpl started*/',
    distRoot: 'build',
    docsRoot: 'docs',

    clean: {
      dist: ['<%= distRoot %>']
    },

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
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: false
      },
      bootstrap: {
        src: [
          'js/bootstrap-transition.js',
          'js/bootstrap-alert.js',
          'js/bootstrap-button.js',
          'js/bootstrap-carousel.js',
          'js/bootstrap-collapse.js',
          'js/bootstrap-dropdown.js',
          'js/bootstrap-modal.js',
          'js/bootstrap-tooltip.js',
          'js/bootstrap-popover.js',
          'js/bootstrap-scrollspy.js',
          'js/bootstrap-tab.js',
          'js/bootstrap-affix.js'
        ],
        dest: '<%= distRoot %>/js/<%= pkg.name %>.js'
      },
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      bootstrap: {
        src: ['<%= concat.bootstrap.dest %>'],
        dest: '<%= distRoot %>/js/<%= pkg.name %>.min.js'
      }
    },
    recess: {
      options: {
        compile: true
      },
      bootstrap: {
        src: ['less/bootstrap.less'],
        dest: '<%= distRoot %>/css/<%= pkg.name %>.css'
      },
      min: {
        options: {
          compress: true
        },
        src: ['less/bootstrap.less'],
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
    copy: {
      docs: { //doc 必须依赖于bootstap.min.js
        files: [
          { expand: true, src: ['img/*'], dest: '<%= docsRoot %>/assets/' },
          { expand: true, src: ['js/*.js'], dest: '<%= docsRoot %>/assets/' },
          { expand: true, src: ['fonts/*'], dest: '<%= docsRoot %>/assets/' },
          { expand: true, cwd: 'js/test/vendor/', src:['jquery.js'], dest: '<%= docsRoot %>/assets/js/' },
          { expand: true, cwd: '<%= distRoot %>/js/', src: ['*.js'], dest: '<%= docsRoot %>/assets/js/' },
          { expand: true, cwd: '<%= distRoot %>/css/', src: ['*.css'], dest: '<%= docsRoot %>/assets/css/' }
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
      }
    }
  });


  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-html-validation');
  grunt.loadNpmTasks('grunt-jekyll');
  grunt.loadNpmTasks('grunt-recess');
  grunt.loadNpmTasks('browserstack-runner');
  // Test task.
  var testSubtasks = ['dist-css', 'jshint'];
  grunt.registerTask('test', testSubtasks);

  grunt.registerTask('hogan', 'compile mustache template', function() {
    var done = this.async();
    var child = exec('node docs/build', function(e) { done(); })
  });

  // JS distribution task.
  grunt.registerTask('dist-js', ['concat', 'uglify']);

  // CSS distribution task.
  grunt.registerTask('dist-css', ['recess']);

  // Full distribution task.
  grunt.registerTask('dist', ['clean', 'dist-css', 'dist-js']);
  grunt.registerTask('docs', ['dist', 'hogan', 'copy']);

  // Default task.
  grunt.registerTask('default', ['test', 'dist']);
}
