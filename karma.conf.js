module.exports = function(config) {
	config.set({
		// List of files or patterns to load in the browser
		// ------------------------------------------------
		// **/*.js:	 		All files with a 'js' extension in all subdirectories
		// **/!(jquery).js: Same as previous, but exludes 'jsuqry.js'
		// **/(foo|boo).js:	In all subdirectories, all 'foo.js' and 'boo.js' files

		files: [
			'src/**/*.ts',
			'test/unit/**/*.ts'
		],

		browsers: [
			'PhantomJS'
		],

		// Level of loggin: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
		logLevel: config.LOG_WARN,

		// Base path, that will be used to resolve files and excludes
		basePath: '.',

		// Web server port
		port: 7676,

		// Testing framework to use
		framework: ['jasmine'],

		// Additional reporters, such as growl or coverage
		reporters: ['progress'],

		// Enable or disable colors in the output (reporter and logs)
		colors: true
	});
};