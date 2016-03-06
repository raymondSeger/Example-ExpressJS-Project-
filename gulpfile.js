var gulp 	= require('gulp');
var minify 	= require('gulp-minify');
var concat 	= require('gulp-concat');

// concat then minify it https://www.npmjs.com/package/gulp-minify
gulp.task('concatThenMinify', function() {
  gulp.src('resources/js/*.js')
    .pipe(concat('all.js'))
    .pipe(minify())
    .pipe(gulp.dest('public/dist'))
});


gulp.task('default', ["concatThenMinify"], function() {
  // place code for your default task here
});