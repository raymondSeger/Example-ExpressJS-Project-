var gulp 	= require('gulp');
var minify 	= require('gulp-minify');
var concat 	= require('gulp-concat');
var uglify 	= require('gulp-uglify');
var sass 	= require('gulp-sass');

// concat then minify it https://www.npmjs.com/package/gulp-minify
gulp.task('concatThenUglifyThenMinify', function() {
  gulp.src('resources/js/*.js')
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(minify())
    .pipe(gulp.dest('public/dist/js'))
});

gulp.task('processSass', function () {

	return gulp.src('./resources/sass/*.scss')
	    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
	    .pipe(gulp.dest('./public/dist/css'));
		
});

gulp.task('sass:watch', function () {
  gulp.watch('./resources/sass/*.scss', ['processSass']);
});

gulp.task('default', ["concatThenUglifyThenMinify", "processSass"], function() {
  // place code for your default task here
});