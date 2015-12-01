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
var i18n = require('habitrpg/website/src/libs/i18n');
var _ = require('habitrpg/node_modules/lodash');
var fs = require('fs');
var xml2js = require('xml2js');
var shared = require('habitrpg/common');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');

require("babel-core/register")({
  // This will override `node_modules` ignoring - you can alternatively pass
  // an array of strings to be explicitly matched or a regex / glob
  ignore: false
});

var paths = {
  sass:   ['./styles/**/*.scss'],
  stylus:   ['./styles/**/*.styl'],
  views:  ['./views/**/*.jade'],
  websiteViews: ['./node_modules/habitrpg/website/views/**/*.jade'],
  scripts: [
    'bower_components/collide/collide.js',
    'bower_components/ionic/release/js/ionic.js',
    'bower_components/angular/angular.js',
    'bower_components/angular-animate/angular-animate.js',
    'bower_components/angular-sanitize/angular-sanitize.js',
    'bower_components/angular-ui-router/release/angular-ui-router.js',
    'bower_components/ionic/release/js/ionic-angular.js',

    'bower_components/angular-resource/angular-resource.js',
    'node_modules/habitrpg/common/dist/scripts/habitrpg-shared.js',
    'bower_components/js-emoji/emoji.js',
    'bower_components/marked/lib/marked.js',
    'bower_components/hello/dist/hello.all.min.js',
    'node_modules/habitrpg/website/public/js/env.js',

    'bower_components/ngCordova/dist/ng-cordova.min.js',

    'scripts/app.js',
    'node_modules/habitrpg/common/script/public/config.js',
    'node_modules/habitrpg/common/script/public/userServices.js',
    'node_modules/habitrpg/website/public/js/services/analyticsServices.js',
    'node_modules/habitrpg/website/public/js/services/challengeServices.js',
    'node_modules/habitrpg/website/public/js/services/memberServices.js',
    'node_modules/habitrpg/website/public/js/services/sharedServices.js',
    'node_modules/habitrpg/website/public/js/services/groupServices.js',
    'node_modules/habitrpg/website/public/js/services/questServices.js',
    'node_modules/habitrpg/website/public/js/services/statServices.js',

    'node_modules/habitrpg/website/public/js/filters/money.js',
    'node_modules/habitrpg/website/public/js/filters/roundLargeNumbers.js',
    'node_modules/habitrpg/website/public/js/filters/taskOrdering.js',

    'node_modules/habitrpg/common/script/public/directives.js',
    'scripts/**/*.js'
  ],
  copy: [
    'config.xml',

    'bower_components/ionic/release/css/ionic.min.css',
    'bower_components/ionic/release/fonts/*',

    'bower_components/js-emoji/emoji.css'
  ],

  imageMin: [
    'node_modules/habitrpg/common/img/emoji/**/*'
  ],
  common: [
    'node_modules/habitrpg/common/locales/en/*',
    'node_modules/habitrpg/common/img/logo/*',
    'node_modules/habitrpg/common/img/sprites/backer-only/*',
    'node_modules/habitrpg/common/dist/**/**/*',
    'node_modules/habitrpg/common/img/sprites/npc_ian.gif'
  ],
  fonts: [
    'bower_components/bootstrap-sass/vendor/assets/fonts/bootstrap/*'
  ]
};
var dist = './www';
var emojiDist = './www/common/img/emoji';

gulp.task('clean', function(){
  return gulp.src('./www/bower_components/', {read: false})
    .pipe(rimraf())
});

gulp.task('minifyImages', ['clean'], function(){
  return gulp.src(paths.imageMin)
        .pipe(imagemin({
          progressive: true,
          use: [pngquant()]
        }))
        .pipe(gulp.dest(emojiDist));
});

gulp.task('copy', ['minifyImages'], function(){
  gulp.src(paths.copy,{ base: './' })
    .pipe(gulp.dest(dist));
  gulp.src(paths.common,{ base: 'node_modules/habitrpg/'})
    .pipe(gulp.dest(dist));
  gulp.src(paths.fonts,{ base: 'bower_components/bootstrap-sass/vendor/assets/fonts/bootstrap/' })
    .pipe(gulp.dest(dist+'/fonts'));
});

gulp.task('sass', function() {
  gulp.src('./styles/*.scss')
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

var Content = require('./content');
gulp.task('views', function(){
  var tavernQuest = require('./node_modules/habitrpg/website/src/models/group').tavernQuest;

  var locals = {locals:{
    env:{
      translations: i18n.translations['en'],
      language: _.find(i18n.avalaibleLanguages, {code: 'en'}),
      // TODO: use actual env.t() function with translations
      t: function(){ // stringName and vars are the allowed parameters
        var args = Array.prototype.slice.call(arguments, 0);
        args.push('en');
        return shared.i18n.t.apply(null, args);
      },
      Content: Content,
      _: _,
      worldDmg: (tavernQuest && tavernQuest.extra && tavernQuest.extra.worldDmg) || {},
    },
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
