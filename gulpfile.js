var gulp = require('gulp');
//var gutil = require('gulp-util');
//var concat = require('gulp-concat');
//var uglify = require('gulp-uglify');
//var del = require('del');
//var useref = require('gulp-useref');
//var gulpif = require('gulp-if');
//var webserver = require('gulp-webserver');
//var minifyCss = require('gulp-clean-css');
//var ghPages = require('gulp-gh-pages');
var rename = require("gulp-rename");
var csv2json = require('gulp-csv2json');
var run = require('gulp-run')

var csvParseOptions = {};

gulp.task('eeg', function () {
    return gulp.src('eeg_data/*.csv')
        .pipe(csv2json(csvParseOptions))
        .pipe(rename({extname: '.json'}))
        .pipe(gulp.dest('eeg_data'));
});

gulp.task("python-test", function(){
    return run("python ./test.py").exec();
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

gulp.task('serve', function() {
  gulp.src('app')
    .pipe(webserver({
      livereload: false,
      directoryListing: false,
      open: true
    }));
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


