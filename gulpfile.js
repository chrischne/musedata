var gulp = require('gulp');
var stylish = require('jshint-stylish');
var jshint = require('gulp-jshint');
//var gutil = require('gulp-util');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var del = require('del');
//var useref = require('gulp-useref');
//var gulpif = require('gulp-if');
var webserver = require('gulp-webserver');
//var minifyCss = require('gulp-clean-css');
//var ghPages = require('gulp-gh-pages');
var rename = require("gulp-rename");
var csv2json = require('gulp-csv2json');
var run = require('gulp-run')
var prettify = require('gulp-jsbeautifier');

//converts raw csv file to exampledata.js 
//and copies exampledata.js to src
gulp.task('eeg', ['csv2js'],function () {
    return gulp.src('eeg/*.js')
        .pipe(rename('exampledata.js'))
        .pipe(gulp.dest('src'));
});
gulp.task("csv2js", ['convert'], function(){
     return gulp.src('eeg/*.js')
        .pipe(prettify())
        .pipe(gulp.dest('eeg'));
});
gulp.task("convert", function(){
    return run("python ./scripts/csv2js.py ./eeg/exampledata.csv").exec();
});

//---------------

//serves the development version
gulp.task('serve', function() {
  gulp.src('src')
    .pipe(webserver({
      livereload: false,
      directoryListing: false,
      open: true
    }));
});

//serves the test version
gulp.task('serve-test', ['build'], function() {
  gulp.src('test')
    .pipe(webserver({
      livereload: false,
      directoryListing: false,
      open: true
    }));
});

//------------
//build

//['src/musedata.dev.js','src/exampledata.js','socket.io-1.4.5.js']
gulp.task('build-pretty',function(){
  gulp.src('src/js/*.js')
    .pipe(prettify())
    .pipe(concat('musedata.js'))
    .pipe(gulp.dest('dist'))
    .pipe(gulp.dest('test'));
});

gulp.task('build-min',function(){
  gulp.src('src/js/*.js')
    .pipe(concat('musedata.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'))
    .pipe(gulp.dest('test'));
});

gulp.task('build',['clean'],function(){
  gulp.start('build2');
});

gulp.task('build2',['build-pretty','build-min'],function(){
  return 'built!!!';
});

gulp.task('clean',function(){
  del('dist/*');
});

//------------
//linting
gulp.task('lint', function() {
  return gulp.src('src/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(jshint.reporter('fail'));
});

//------------
//default
gulp.task('default',['serve-test']);


