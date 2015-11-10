var gulp = require('gulp');
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var ddescribeIit = require('gulp-ddescribe-iit');
var del = require('del');
var merge = require('merge2');
var runSequence = require('run-sequence');
var gutil = require('gulp-util');

var PATHS = {
	src: 'src/**/*.ts', 
	specs: 'src/**/*.spec.ts'
};

// -------------
// Code Building
// -------------

var buildProject = ts.createProject('tsconfig.json', {
	declaration: true
});

gulp.task('clean:build', function() { 
	return del('dist/'); 
});

gulp.task('cjs', function() {
  var tsResult = gulp.src([PATHS.src, '!' + PATHS.specs]).pipe(ts(buildProject));

  return merge([tsResult.dts.pipe(gulp.dest('dist/cjs')), tsResult.js.pipe(gulp.dest('dist/cjs'))]);
});

gulp.task('umd', function(cb) {
  var webpack = require('webpack');
  webpack(
      {
        entry: './dist/cjs/angular2-ui-bootstrap.js',
        output: {
        	filename: 'dist/global/angular2-ui-bootstrap.js', 
        	library: 'ngb', 
        	libraryTarget: 'umd'
        },
        externals: {
          'angular2/angular2': {
          	root: 'ng', 
          	commonjs: 'angular2/angular2', 
          	commonjs2: 'angular2/angular2', 
          	amd: 'angular2/angular2'
          }
        }
      },
      function(err, stats) {
        if (err) {
        	throw new gutil.PluginError('webpack', err);
        }
        gutil.log("[webpack]", stats.toString());
        cb();
      });
});


// -------
// Testing
// -------

var testProject = ts.createProject('tsconfig.json');

gulp.task('clean:tests', function() { 
	return del('temp/'); 
});

gulp.task('build-tests', function() {
  var tsResult = gulp.src(PATHS.src)
  	.pipe(sourcemaps.init())
  	.pipe(ts(testProject));

  return tsResult.js
  	.pipe(sourcemaps.write('.'))
  	.pipe(gulp.dest('temp'));
});

gulp.task('ddescribe-iit', function() { 
	return gulp.src(PATHS.specs).pipe(ddescribeIit({
		allowDisabledTests: false
	})); 
});

gulp.task('test', function(done) {
  var karmaServer = require('karma').Server;
  var travis = process.env.TRAVIS;

  var config = {
  	configFile: __dirname + '/karma.conf.js', 
  	singleRun: true, 
  	autoWatch: false
  };

  if (travis) {
    config['reporters'] = ['dots'];
    config['browsers'] = ['Firefox'];
  }

  new karmaServer(config, done).start();
});

gulp.task('watch', ['clean:tests', 'build-tests'], function() { 
	gulp.watch(PATHS.src, ['build-tests']); 
});

// -----
// Tasks
// -----

gulp.task('build', function(done) {
  runSequence(
//      'enforce-format', 
      'ddescribe-iit', 
      'clean:tests', 
      'build-tests', 
      'test', 
      'clean:build', 
      'cjs', 
      'umd', 
      done);
});

gulp.task('default', function(done) {
  runSequence(
//  	'enforce-format', 
  	'ddescribe-iit', 
  	'clean:tests', 
  	'build-tests', 
  	'test', 
  	done);
});
