/* jshint node: true */

module.exports = function(grunt) {
  'use strict';
  require('load-grunt-tasks')(grunt);

  var generateRawFiles = require('./grunt/raw-files-generator.js');
  var editorJS = [
    'editor.js',
    'core/browser.js',
    'core/utils.js',
    'core/EventBase.js',
    'core/dtd.js',
    'core/domUtils.js',
    'core/Range.js',
    'core/Selection.js',
    'core/Editor.js',
    'core/Editor.defaultoptions.js',
    'core/loadconfig.js',
    'core/ajax.js',
    'core/filterword.js',
    'core/node.js',
    'core/htmlparser.js',
    'core/filternode.js',
    'core/plugin.js',
    'core/keymap.js',
    'core/localstorage.js',
    'plugins/defaultfilter.js',
    'plugins/inserthtml.js',
    'plugins/autotypeset.js',
    'plugins/autosubmit.js',
    'plugins/background.js',
    'plugins/image.js',
    'plugins/justify.js',
    'plugins/font.js',
    'plugins/link.js',
    'plugins/iframe.js',
    'plugins/scrawl.js',
    'plugins/removeformat.js',
    'plugins/blockquote.js',
    'plugins/convertcase.js',
    'plugins/indent.js',
    'plugins/print.js',
    'plugins/preview.js',
    'plugins/selectall.js',
    'plugins/paragraph.js',
    'plugins/directionality.js',
    'plugins/horizontal.js',
    'plugins/time.js',
    'plugins/rowspacing.js',
    'plugins/lineheight.js',
    'plugins/insertcode.js',
    'plugins/cleardoc.js',
    'plugins/anchor.js',
    'plugins/wordcount.js',
    'plugins/pagebreak.js',
    'plugins/wordimage.js',
    'plugins/dragdrop.js',
    'plugins/undo.js',
    'plugins/copy.js',
    'plugins/paste.js',
    'plugins/puretxtpaste.js',
    'plugins/list.js',
    'plugins/source.js',
    'plugins/enterkey.js',
    'plugins/keystrokes.js',
    'plugins/fiximgclick.js',
    'plugins/autolink.js',
    'plugins/autoheight.js',
    'plugins/autofloat.js',
    'plugins/video.js',
    'plugins/table.core.js',
    'plugins/table.cmds.js',
    'plugins/table.action.js',
    'plugins/table.sort.js',
    'plugins/contextmenu.js',
    'plugins/shortcutmenu.js',
    'plugins/basestyle.js',
    'plugins/elementpath.js',
    'plugins/formatmatch.js',
    'plugins/searchreplace.js',
    'plugins/customstyle.js',
    'plugins/catchremoteimage.js',
    'plugins/snapscreen.js',
    'plugins/insertparagraph.js',
    'plugins/webapp.js',
    'plugins/template.js',
    'plugins/music.js',
    'plugins/autoupload.js',
    'plugins/autosave.js',
    'plugins/charts.js',
    'plugins/section.js',
    'plugins/simpleupload.js',
    'plugins/serverparam.js',
    'plugins/insertfile.js',
    'ui/ui.js',
    'ui/uiutils.js',
    'ui/uibase.js',
    'ui/separator.js',
    'ui/mask.js',
    'ui/popup.js',
    'ui/colorpicker.js',
    'ui/tablepicker.js',
    'ui/stateful.js',
    'ui/button.js',
    'ui/splitbutton.js',
    'ui/colorbutton.js',
    'ui/tablebutton.js',
    'ui/autotypesetpicker.js',
    'ui/autotypesetbutton.js',
    'ui/cellalignpicker.js',
    'ui/pastepicker.js',
    'ui/toolbar.js',
    'ui/menu.js',
    'ui/combox.js',
    'ui/dialog.js',
    'ui/menubutton.js',
    'ui/multiMenu.js',
    'ui/shortcutmenu.js',
    'ui/breakline.js',
    'ui/message.js',
    'adapter/editorui.js',
    'adapter/editor.js',
    'adapter/message.js',
    'adapter/autosave.js'
  ]
  var editorParseJS = [
    'parse.js',
    'insertcode.js',
    'table.js',
    'charts.js',
    'background.js',
    'list.js',
    'video.js'
  ];

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
      },
      editor: {
        src: ['less/editor/all.less'],
        dest: '<%= distRoot %>/editor/themes/default/css/editor.css'
      },
      editorDialog: {
        src: ['less/editor/dialogbase.less'],
        dest: '<%= distRoot %>/editor/themes/default/dialogbase.css'
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
      editorConfig: {
        files: [
          { expand: true, cwd: './js/editor/', src:["editor.config.js"], dest: '<%= distRoot %>/editor' },
        ]
      },
      editorLang: {
        files: [
          { expand: true, cwd: './js/editor/lang', src:["**/*"], dest: '<%= distRoot %>/editor/lang' },
        ]
      },
      editorDialog: {
        files: [
          { expand: true, cwd: './js/editor/dialogs', src:["**/*"], dest: '<%= distRoot %>/editor/dialogs' },
        ]
      },
      editorThird: {
        files: [
          { expand: true, cwd: './js/editor/third-party', src:["**/*"], dest: '<%= distRoot %>/editor/third-party' },
        ]
      },
      images: {
        files: [
          { expand: true, cwd: 'images/', src:["**/*"], dest: '<%= distRoot %>/editor/themes/default/images' },
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

    concat: {
      editorJS: {
        options: {
          banner: '(function(){\n\n',
          footer: '\n\n})();\n',
          process: function (src, s) {
            var filename = s.substr(s.indexOf('/') + 1);
            return '// ' + filename + '\n' + src.replace('/_css/', '/css/') + '\n';
          }
        },
        src: concatPath(editorJS, "./js/editor/_src/"),
        dest: '<%= distRoot %>/editor/editor.all.js'
      },
      editorParse: {
        options: {
          banner: '(function(){\n\n',
          footer: '\n\n})();\n'
        },
        src: concatPath(editorParseJS, "./js/editor/_parse/"),
        dest: '<%= distRoot %>/editor/editor.parse.js'
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
      editorJS: {
        files: 'js/editor/_src/*.js',
        tasks: ['concat:editorJS']
      },
      editorParse: {
        files: 'js/editor/_parse/*.js',
        tasks: ['concat:editorParse']
      },
      editorConfig: {
        files: 'js/editor/editor.config.js',
        tasks: ['copy:editorConfig']
      },
      editorCSS: {
        files: 'less/editor/*.less',
        tasks: ['less:editor']
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
  grunt.registerTask('dist-js', ['browserify', 'uglify']);

  // CSS distribution task.
  grunt.registerTask('dist-css', ['less']);

  // CSS distribution task.
  grunt.registerTask('dist-fonts', ['copy:fonts']);

  // Full distribution task.
  grunt.registerTask('dist', ['dist-css', 'dist-js', 'dist-fonts']);
  grunt.registerTask('docs', ['jade']); //必须先执行dist才能执行此任务

  //custom page
  grunt.registerTask('custom', ['build-raw-files']);


  grunt.registerTask('images', ['copy:images']);

  // Default task.
  grunt.registerTask('default', ['test', 'dist', 'docs', 'custom', 'images', 'concat', 'copy']);
  //local server and watch
  grunt.registerTask('local',['connect','watch']);
}
