var gulp 	= require('gulp');
var minify 	= require('gulp-minify');


// minify it https://www.npmjs.com/package/gulp-minify
gulp.task('compress', function() {
  gulp.src('resources/js/*.js')
    .pipe(minify({
        ignoreFiles: ['-min.js']
    }))
    .pipe(gulp.dest('public/dist'))
});

gulp.task('default', ["compress"], function() {
  // place code for your default task here
});