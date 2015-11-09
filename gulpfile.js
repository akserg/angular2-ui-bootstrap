var gulp = require('gulp');
var clean = require('gulp-clean');
var esLint = require('gulp-eslint');
var tslint = require('gulp-tslint');

// -------------------------------
// Here is where source path comes
// -------------------------------
gulp.paths = {
	tssrc: [
    	'**/*.ts',
	    '!node_modules/**/*',
	    '!dist/**/*',
	    '!typings/**/*',
	    '!**/*.{ts}.js'],
	jssrc: [
	    '*.js',
	    '!angular2-ui-bootstrap.js',
	    '!node_modules',
	    '!**/*.{ts}.js']
};

// ------------------
// Clean dist forlder
// ------------------
gulp.task('clean', function () {
	return gulp.src('dist', {read: false})
    	.pipe(clean());
});

// ----------
// Lint tasts
// ----------
gulp.task('eslint', function() {
 	return gulp.src(gulp.paths.jssrc)
    	.pipe(esLint({useEslintrc: true}))
    	.pipe(esLint.format())
    	.pipe(esLint.failOnError());
});

gulp.task('tslint', function() {
	return gulp.src(gulp.paths.tssrc)
    	.pipe(tslint())
    	.pipe(tslint.report('verbose', {
      		emitError: true,
      		reportLimit: 0
    	}));
});

gulp.task('lint', ['tslint', 'eslint']);

// ----------------
// Tests with Karma
// ----------------
gulp.task('test', function(done) {
	return gulp.src(gulp.paths)
		.pipe(karma({
			configFile: './karma.conf.js',
			action: 'run'
		}))
		.on('error', function(err) {
			throw err;
		});
});


// ------------------------
// This is our default task
//-------------------------
gulp.task('default', function () {
	gulp.start('lint');
});
