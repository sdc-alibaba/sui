/* jshint node: true */

var exec = require("child_process").exec;

module.exports = function(grunt) {
  'use strict';

  var fs = require("fs"),
    Util = {

        jsBasePath: 'js/wysiwyg/_src/',
        parseBasePath: 'js/wysiwyg/_parse/',
        cssBasePath: 'less/wysiwyg/themes/default/_css/',

        fetchScripts: function (readFile, basePath) {

            var sources = fs.readFileSync(readFile);
            sources = /\[([^\]]+\.js'[^\]]+)\]/.exec(sources);
            sources = sources[1].replace(/\/\/.*\n/g, '\n').replace(/'|"|\n|\t|\s/g, '');
            sources = sources.split(",");
            sources.forEach(function (filepath, index) {
                sources[ index ] = basePath + filepath;
            });

            return sources;
        },

        fetchStyles: function () {

            var sources = fs.readFileSync(this.cssBasePath + "ueditor.css"),
                filepath = null,
                pattern = /@import\s+([^;]+)*;/g,
                src = [];

            while (filepath = pattern.exec(sources)) {
                src.push(this.cssBasePath + filepath[ 1 ].replace(/'|"/g, ""));
            }

            return src;

        }

    };


  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*dpl started*/',
    distRoot: grunt.option('target') || '.package',
    docsRoot: 'docs',


    concat: {
        js: {
            options: {
                banner: '<%= banner %>(function(){\n\n',
                footer: '\n\n})();\n',
                process: function (src, s) {
                    var filename = s.substr(s.indexOf('/') + 1);
                    return '// ' + filename + '\n' + src.replace('/_css/', '/css/') + '\n';
                }
            },
            src: Util.fetchScripts("docs/examples/_examples/editor_api.js", Util.jsBasePath),
            dest: '<%=distRoot %>/wysiwyg/js/editor.all.js'
        },
        parse: {
            options: {
                banner: '<%= banner %>(function(){\n\n',
                footer: '\n\n})();\n'
            },
            src: Util.fetchScripts("js/wysiwyg/ueditor.parse.js", Util.parseBasePath),
            dest: '<%=distRoot %>/wysiwyg/js/editor.parse.js'
        },
        css: {
            src: Util.fetchStyles(),
            dest: '<%=distRoot %>/wysiwyg/css/ueditor.css'
        }
    },
    cssmin: {
        options: {
            banner: '<%= banner %>'
        },
        files: {
            expand: true,
            cwd: '<%=distRoot %>/wysiwyg/css/',
            src: ['ueditor.css'],
            dest: '<%=distRoot %>/wysiwyg/css/',
            ext: 'ueditor.min.css'
        }
    },
    closurecompiler: {
        dist: {
            src: '<%=distRoot %>/wysiwyg/js/editor.all.js',
            dest: '<%=distRoot %>/wysiwyg/js/editor.all.min.js'
        },
        parse: {
            src: '<%=distRoot %>/wysiwyg/js/editor.parse.js',
            dest: '<%=distRoot %>/wysiwyg/js/editor.parse.min.js'
        }
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
    browserify: {
      build: {
        files: {
          '<%= distRoot %>/js/<%= pkg.name %>.js': ['js/<%= pkg.name %>.js'],
        }
      }
    },

    uglify: {
      build: {
        options: {
          sourceMap: false
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
          src: ['**/*.jade', '!base.jade', '!sidenav.jade', '!header.jade', '!com-*', '!*-com.jade', '!discuss.jade', '!foot.jade', '!head.jade'],
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
      },
      wysiwyg: {
        files: [
            {
              src: [ '*.html' ],
              dest: '<%=distRoot %>/wysiwyg/'
            }
        ]
      },
      wysiwygcss: {
        files: [
            {
              expand: true,
              cwd: 'less/wysiwyg//themes/',
              src: [ 'iframe.css' ],
              dest: '<%=distRoot %>/wysiwyg/css'
            }
        ]
      },
      wysiwygimg: {
        files: [
            {
              expand: true,
              cwd: 'less/wysiwyg//themes/default/',
              src: [ 'images/**' ],
              dest: '<%=distRoot %>/wysiwyg'
            }
        ]
      },
      wysiwygjs: {
        files: [
            {
              expand: true,
              cwd: 'js/wysiwyg/',
              src: [ 'lang/**' ],
              dest: '<%=distRoot %>/wysiwyg/js'
            }
        ]
      },
      wysiwygthird: {
        files: [
            {
              expand: true,
              cwd: 'js/wysiwyg/',
              src: [ 'third-party/**' ],
              dest: '<%=distRoot %>/'
            }
        ]
      },
      img: {
        files: [
            {
              expand: true,
              cwd: 'less/wysiwyg/themes/default/images/',
              src: ['*.gif', '*.png'],
              dest:'<%=distRoot %>/images/'
            }
        ]
      },
      demo: {
        files: [
            {
                src: 'docs/examples/_examples/completeDemo.html',
                dest:'<%=distRoot %>/wysiwyg/index.html'
            }
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
        tasks: ['less:sui', 'newer:copy']
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
        tasks: ['newer:less:docs']
      }
    }
  });

  //wysiwyg
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-closurecompiler');

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
  grunt.registerTask('default', ['test', 'dist', 'docs','wysiwyg']);
  //local server and watch
  grunt.registerTask('local',['connect','watch']);
  //wysiwyg
  grunt.registerTask('wysiwyg','UEditor build', function () {

    var tasks = [ 'concat', 'cssmin', 'closurecompiler', 'copy'];

    grunt.task.run(tasks);

  });
}
