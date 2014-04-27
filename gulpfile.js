var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var jade = require('gulp-jade');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var connect = require('gulp-connect');
var stylus = require('gulp-stylus');
var envT = require('habitrpg/src/middleware').enTranslations;

var paths = {
  sass:   ['./styles/**/*.scss'],
  stylus:   ['./styles/**/*.styl'],
  views:  ['./views/**/*.jade'],
  js:     ['./www/js/**/*.js']
};
var dist = './www';

gulp.task('sass', function() {
  gulp.src('./styles/ionic.app.scss')
    .pipe(sass())
    .pipe(gulp.dest(dist+'/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest(dist+'/css/'))
    .pipe(connect.reload())
});

gulp.task('stylus', function () {
  gulp.src('./styles/app.styl')
    .pipe(stylus({errors: true}))
    .pipe(gulp.dest(dist+'/css/'))
    .pipe(connect.reload())
});

gulp.task('views', function(){
  gulp.src('./views/index.jade')
    //.pipe(jade())
    // TODO: use actual env.t() function with translations
    .pipe(jade({locals:{env:{t:envT}}}))
    .pipe(gulp.dest(dist))
    .pipe(rename({extname: '.html'}))
    .pipe(connect.reload())
});

// TODO: min/cat, move bower_components up & min/cat
gulp.task('js', function(){
  connect.reload()
})

gulp.task('connect', function() {
  connect.server({
    root: dist,
    livereload: true,
    port: 9000
  });
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.stylus, ['stylus']);
  gulp.watch(paths.views, ['views']);
  gulp.watch(paths.js, ['js']);
});

gulp.task('default', ['sass','stylus','views','js','connect','watch']);