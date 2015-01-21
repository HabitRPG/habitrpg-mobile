var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var jade = require('gulp-jade');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var connect = require('gulp-connect');
var stylus = require('gulp-stylus');
var uglify = require('gulp-uglify');
var rimraf = require('gulp-rimraf');
var i18n = require('habitrpg/src/i18n');
var _ = require('habitrpg/node_modules/lodash');
var fs = require('fs');
var xml2js = require('xml2js');
var shared = require('habitrpg/node_modules/habitrpg-shared');

var paths = {
  sass:   ['./styles/**/*.scss'],
  stylus:   ['./styles/**/*.styl'],
  views:  ['./views/**/*.jade'],
  websiteViews: ['./node_modules/habitrpg/views/**/*.jade'],
  scripts: [ // TODO a **/* with excludes
    /* using custom build so we can use angular1.3+
      ionic.bundle.js = [ionic.js, angular.js, angular-animate.js, angular-sanitize.js, angular-ui-router.js, ionic-angular.js]*/
//    'bower_components/ionic/js/ionic.bundle.js',
    'bower_components/ionic/release/js/ionic.js',
    'bower_components/angular/angular.js',
    'bower_components/angular-animate/angular-animate.js',
    'bower_components/angular-sanitize/angular-sanitize.js',
    'bower_components/angular-ui-router/release/angular-ui-router.js',
    'bower_components/ionic/release/js/ionic-angular.js',

    'bower_components/angular-resource/angular-resource.js',
    'bower_components/habitrpg-shared/dist/habitrpg-shared.js',
    'bower_components/js-emoji/emoji.js',
    'bower_components/marked/lib/marked.js',
    "bower_components/hello/dist/hello.all.min.js",

    'node_modules/habitrpg/public/js/env.js',
    'scripts/app.js',
    'bower_components/habitrpg-shared/script/config.js',
    'bower_components/habitrpg-shared/script/userServices.js',
    'node_modules/habitrpg/public/js/services/challengeServices.js',
    'node_modules/habitrpg/public/js/services/memberServices.js',
    'node_modules/habitrpg/public/js/services/sharedServices.js',
    'node_modules/habitrpg/public/js/services/groupServices.js',
    'bower_components/habitrpg-shared/script/directives.js',
    'scripts/**/*.js'
  ],
  copy: [
    'config.xml',
    'bower_components/**/**/*',
    '!bower_components/habitrpg-shared/node_modules/**/**/*',
    '!bower_components/habitrpg-shared/img/unprocessed/**/**/*',
    //'!bower_components/habitrpg-shared/img/emoji/**/*',
    '!bower_components/habitrpg-shared/img/project_files/**/**/*',
    '!bower_components/habitrpg-shared/.git/**/**/*', // I'm using symlink
    '!bower_components/angular/**/**/*',
    '!bower_components/angular-animate/**/**/*',
    '!bower_components/angular-sanitize/**/**/*',
    '!bower_components/angular-resource/**/**/*',
    '!bower_components/angular-ui-router/**/**/*'
  ]
};
var dist = './www';

gulp.task('clean', function(){
  return gulp.src('./www/bower_components/', {read: false})
    .pipe(rimraf())
})

gulp.task('copy', ['clean'], function(){
  gulp.src(paths.copy,{ base: './' })
    .pipe(gulp.dest(dist))
});

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
  var locals = {locals:{env:{
    translations: i18n.translations['en'],
    language: _.find(i18n.avalaibleLanguages, {code: 'en'}),
    // TODO: use actual env.t() function with translations
    t: function(){ // stringName and vars are the allowed parameters
      var args = Array.prototype.slice.call(arguments, 0);
      args.push('en');
      return shared.i18n.t.apply(null, args);
    },
    Content:require('./node_modules/habitrpg/node_modules/habitrpg-shared').content},
    moment:require('./node_modules/habitrpg/node_modules/moment')
  }};
  // can't xml-parse synchronously, hence all this hubub
  new xml2js.Parser().parseString(fs.readFileSync(__dirname + '/config.xml'), function(err,res){
    locals.locals.env.appVersion = res.widget['$'].version;

    gulp.src('./views/index.jade')
      .pipe(jade(locals))
      .pipe(gulp.dest(dist))
      .pipe(rename({extname: '.html'}))
      .pipe(connect.reload())
  });
});

gulp.task('scripts', function() {
  gulp.src(paths.scripts)
    .pipe(uglify())
    .pipe(concat('app.min.js'))
    .pipe(gulp.dest(dist+'/js'));
    connect.reload()
});

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
  gulp.watch([paths.views,paths.websiteViews], ['views']);
  gulp.watch(paths.scripts, ['scripts']);
});

gulp.task('default', ['copy','sass','stylus','views','scripts','connect','watch']);
