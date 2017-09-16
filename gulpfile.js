var gulp = require('gulp');
//var gutil = require('gulp-util');
//var concat = require('gulp-concat');
//var uglify = require('gulp-uglify');
//var del = require('del');
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

gulp.task('html-dist', function () {
    return gulp.src('app/index.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(gulp.dest('dist'));
});

gulp.task('images-dist',function(){
	 return gulp.src('app/img/*.png')
	 	.pipe(gulp.dest('dist/img'));
});

gulp.task('login-dist',function(){
	return gulp.src('app/login/*')
	 	.pipe(gulp.dest('dist/login'));
});

gulp.task('font-dist',function(){
  return gulp.src('app/vendor/fonts/*')
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('robots-dist',function(){
  return gulp.src('app/robots.txt')
    .pipe(gulp.dest('dist'));
});

gulp.task('app-capable',function(){
  return gulp.src(['app/apple-touch-icon.png','app/manifest.json'])
    .pipe(gulp.dest('dist'));
});

gulp.task('clean',function(){
	del('dist/*');
});

gulp.task('empty',['clean'],function(){
	 return gulp.src('assets/emptyindex.html')
    .pipe(rename('index.html'))
    .pipe(gulp.dest('dist'));
});


gulp.task('build',['clean'],function(){
	gulp.start('build2');
})

gulp.task('build2',['robots-dist','login-dist','images-dist','html-dist','font-dist','app-capable'],function(){
	console.log('built!!!');
});



gulp.task('serve-dist', function() {
  gulp.src('dist')
    .pipe(webserver({
      livereload: false,
      directoryListing: false,
      open: true
    }));
});


gulp.task('default',['serve']);

gulp.task('deploy', function() {
  return gulp.src('./dist/**/*')
    .pipe(ghPages());
});


