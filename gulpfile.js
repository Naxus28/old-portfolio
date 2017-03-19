var gulp = require('gulp');
var $    = require('gulp-load-plugins')();

var sassPaths = [
  'bower_components/normalize.scss/sass',
  'bower_components/foundation-sites/scss',
  'bower_components/motion-ui/src'
];

gulp.task('sass', function() {
  return gulp.src('scss/app.scss')
    .pipe($.sass({
      includePaths: sassPaths,
      outputStyle: 'compressed' // if css compressed **file size**
    })
      .on('error', $.sass.logError))
    .pipe($.autoprefixer({
      browsers: ['last 2 versions', 'ie >= 9']
    }))
    .pipe(gulp.dest('css'));
});

gulp.task('scripts', function() {
  return gulp.src(['js-source/carousel.js', 'js-source/app.js', ])
    .pipe($.concat('script.js'))
    .pipe($.uglify())
      .on('error', function(error) {
         $.util.log(plugins.util.colors.red('Uglify error: ', error));
      })
    .pipe(gulp.dest('js'))
})

gulp.task('default', ['sass', 'scripts'], function() {
  gulp.watch(['scss/**/*.scss'], ['sass']);
  gulp.watch(['js-source/*.js'], ['scripts']);
});
