/* jshint node: true */

var join = require("path").join

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    requirejs = require('gulp-requirejs'),
    uglify = require('gulp-uglify'),
    rename = require("gulp-rename"),
    jshint = require('gulp-jshint'),
    less = require('gulp-less'),
    jade = require('gulp-jade'),
    qunit = require('gulp-qunit'),
    watch = require('gulp-watch'),
    livereload = require('gulp-livereload'),
    tinnylr = require('tiny-lr')

var server = tinnylr()

var exec = require("child_process").exec

var paths = {
  distRoot: './build',
  docsRoot: './docs',
  demosRoot: './docs/demos'
}

var pkg = {
  name: "bootstrap"
}

gulp.task('requirejs', function() {
  //目前requirejs还不支持gulp.src
  var jsDist = join(paths.distRoot, 'js')
  var requirejsConfig= {
    baseUrl: "js",
    name: "almond",
    optimize: "none",
    include: pkg.name,
    insertRequire: [pkg.name],
    mainConfigFile: "js/requirejs-config.js",
    out: pkg.name + '.js',
    wrap: true
  }
  requirejs(requirejsConfig)
    //uncompressed
    .pipe(gulp.dest(jsDist))
    //uglify
    .pipe(uglify({preserveComments: 'some'}))
    .pipe(rename(pkg.name + '.min.js'))
    .pipe(gulp.dest(jsDist))
    .pipe(livereload(server))
})

gulp.task('less', function() {
  var cssDist = join(paths.distRoot, 'css')

  var recess = function(input, output) {
    output = output || input
    gulp.src(join('less', input + '.less'))
      .pipe(less())
      .pipe(rename(output + '.css'))
      .pipe(gulp.dest(cssDist))
      .pipe(less({compress: true}))
      .pipe(rename(output + '.min.css'))
      .pipe(gulp.dest(cssDist))
      .pipe(livereload(server))
  }

  recess('bootstrap')
  recess('responsive', pkg.name + '-responsive')
})

// compile jade template
gulp.task('jade', function() {
  gulp.src(['**/*.jade', '!base.jade', '!com-*', '!*-com.jade'],  {cwd: join(paths.demosRoot, 'templates')})
    .pipe(jade({pretty: true}))
    .pipe(gulp.dest(paths.demosRoot))
    .pipe(livereload(server))
})

//compile mastache template
gulp.task('hogan', function(callback) {
  var child = exec('node docs/build', function(e) {
    callback()
  })
})

gulp.task('jshint', function() {
  var jsfiles = [
    'gulpfile.js',
    'js/*.js',
    'js/tests/unit/*.js'
  ]
  gulp.src(jsfiles)
    .pipe(jshint('js/.jshintrc'))
    .pipe(jshint.reporter('default'))
})

gulp.task('qunit', function(callback) {
  /*
  var config = {
    inject: 'js/tests/unit/bootstrap-phantom.js'
  }
  gulp.src('js/tests/*.html')
    .pipe(qunit(config));
  */
  //gulp-qunit 不好用，暂时自己实现
  var error = 0
  var serverCmd = 'node js/tests/server.js'
  var qunitCmd = 'node_modules/phantomjs/bin/phantomjs js/tests/phantom.js "http://localhost:3000/js/tests"'
  var runServer = exec(serverCmd)
  var runQunit = exec(qunitCmd, function(e) {
    runServer.kill()
    callback(error)
  }).stdout.on('data', function (data) {
    if (/tests failed/.test(data)) {
      error = 'qunit test failed!'
    } else {
      console.log(data)
    }
  })
})

// copy fonts to build
gulp.task('fonts', function() {
  gulp.src('./fonts/*')
    .pipe(gulp.dest(join(paths.distRoot, 'fonts')))
})

gulp.task('watch', function() {
  server.listen(3456)
  gulp.watch('js/**/*.js', ['requirejs'])
  gulp.watch('less/**/*.less', ['less'])
  gulp.watch(join(paths.docsRoot, 'templates/**/*.mustache'), ['hogan'])
  gulp.watch(join(paths.demosRoot, 'templates/**/*.jade'), ['jade'])
  gulp.watch('./fonts/*', ['jade'])
})

gulp.task('test', ['jshint', 'qunit'])

gulp.task('docs', ['fonts', 'jade', 'hogan'])

gulp.task('default', ['less', 'test', 'requirejs', 'docs'])
