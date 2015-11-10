module.exports = function(config) {
  config.set({

  	// Base path, that will be used to resolve files and excludes
    basePath: '',
	// List of files or patterns to load in the browser
	// ------------------------------------------------
	// **/*.js:	 		All files with a 'js' extension in all subdirectories
	// **/!(jquery).js: Same as previous, but exludes 'jsuqry.js'
	// **/(foo|boo).js:	In all subdirectories, all 'foo.js' and 'boo.js' files

    files: [
      // For travis
      'node_modules/es6-shim/es6-shim.js',
      // paths loaded by Karma
      {pattern: 'node_modules/systemjs/dist/system.src.js', included: true, watched: true},
      {pattern: 'node_modules/angular2/bundles/angular2.js', included: true, watched: true},
      {pattern: 'node_modules/angular2/bundles/testing.js', included: true, watched: true},
      {pattern: 'karma-test-shim.js', included: true, watched: true},

      // paths loaded via module imports
      {pattern: 'temp/**/*.js', included: false, watched: true},

      // paths to support debugging with source maps in dev tools
      {pattern: 'src/**/*.ts', included: false, watched: false},
      {pattern: 'temp/**/*.js.map', included: false, watched: false}
    ],

    preprocessors: {'temp/**/*.js': ['sourcemap']},
	// Additional reporters, such as growl or coverage
    reporters: ['progress'],
    // Web server port
    port: 9876,
    // Enable or disable colors in the output (reporter and logs)
    colors: true,
    // Level of loggin: LOG_DISABLE | LOG_ERROR | LOG_WARN | LOG_INFO | LOG_DEBUG
    logLevel: config.LOG_INFO,
    // Watch after file changes
    autoWatch: true,
    // Watch mode
    singleRun: false,
    // Browesers Chrome | PhantomJS | Firefox
    browsers: ['Chrome'],
    // Testing framework to use
    frameworks: ['jasmine']
  });
};
