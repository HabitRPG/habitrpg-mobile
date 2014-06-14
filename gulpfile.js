var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var jade = require('gulp-jade');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var connect = require('gulp-connect');
var stylus = require('gulp-stylus');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');
var envT = require('habitrpg/src/i18n').enTranslations;

var paths = {
  sass:   ['./styles/**/*.scss'],
  stylus:   ['./styles/**/*.styl'],
  views:  ['./views/**/*.jade'],
  websiteViews: ['./node_modules/habitrpg/views/**/*.jade'],
  scripts: [ // TODO a **/* with excludes
    /* using custom build so we can use angular1.3+
      ionic.bundle.js = [ionic.js, angular.js, angular-animate.js, angular-sanitize.js, angular-ui-router.js, ionic-angular.js]*/
//    'bower_components/ionic/js/ionic.bundle.js',
    'bower_components/ionic/js/ionic.js',
    'bower_components/angular/angular.js',
    'bower_components/angular-animate/angular-animate.js',
    'bower_components/angular-sanitize/angular-sanitize.js',
    'bower_components/angular-ui-router/release/angular-ui-router.js',
    'bower_components/ionic/js/ionic-angular.js',

    'bower_components/angular-resource/angular-resource.js',
    'bower_components/habitrpg-shared/dist/habitrpg-shared.js',
    'bower_components/js-emoji/emoji.js',
    'bower_components/marked/lib/marked.js',

    'scripts/app.js',
    'bower_components/habitrpg-shared/script/userServices.js',
    'bower_components/habitrpg-shared/script/directives.js',
    'scripts/services/authServices.js',
    'scripts/services/notificationServices.js',
    'scripts/controllers/userAvatarCtrl.js',
    'scripts/controllers/rootCtrl.js',
    'scripts/controllers/settingsCtrl.js',
    'scripts/filters/filters.js',
    'scripts/controllers/authCtrl.js',
    'scripts/controllers/tasksCtrl.js',
    'scripts/controllers/chatCtrl.js'
  ],
  copy: [
    'config.xml',
    'bower_components/**/*',
    '!bower_components/habitrpg-shared/node_modules/**/*',
    '!bower_components/habitrpg-shared/img/unprocessed/**/*',
    '!bower_components/habitrpg-shared/img/emoji/**/*',
    '!bower_components/habitrpg-shared/img/project_files/**/*',
    '!bower_components/habitrpg-shared/.git/**/*', // I'm using symlink
    '!bower_components/angular/**/*',
    '!bower_components/angular-animate/**/*',
    '!bower_components/angular-sanitize/**/*',
    '!bower_components/angular-resource/**/*',
    '!bower_components/angular-ui-router/**/*'
  ]
};
var dist = './www';

gulp.task('clean', function(){
  return gulp.src('./www/bower_components/', {read: false})
    .pipe(clean())
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
  gulp.src('./views/index.jade')
    //.pipe(jade())
    // TODO: use actual env.t() function with translations
    .pipe(jade({locals:{env:{
      t:envT,
      Content:require('./node_modules/habitrpg/node_modules/habitrpg-shared').content},
      moment:require('./node_modules/habitrpg/node_modules/moment')
    }}))
    .pipe(gulp.dest(dist))
    .pipe(rename({extname: '.html'}))
    .pipe(connect.reload())
});

gulp.task('scripts', function() {
  gulp.src(paths.scripts)
//    .pipe(uglify())
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
