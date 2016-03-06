var gulp 	= require('gulp');
var minify 	= require('gulp-minify');
var concat 	= require('gulp-concat');
var uglify 	= require('gulp-uglify');

// concat then minify it https://www.npmjs.com/package/gulp-minify
gulp.task('concatThenUglifyThenMinify', function() {
  gulp.src('resources/js/*.js')
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(minify())
    .pipe(gulp.dest('public/dist'))
});


gulp.task('default', ["concatThenUglifyThenMinify"], function() {
  // place code for your default task here
});