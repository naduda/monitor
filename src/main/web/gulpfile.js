var gulp = require('gulp'),
		wiredep = require('wiredep').stream,
		useref = require('gulp-useref'),
		gulpif = require('gulp-if'),
		uglify = require('gulp-uglify'),
		uncss = require('gulp-uncss'),
		minifyCss = require('gulp-clean-css'),
		rimraf = require('gulp-rimraf'),
		tsc = require('gulp-typescript'),
		fs = require('fs'),
		// server = require('gulp-express'),
		gls = require('gulp-live-server'),
		server = gls.new('testAPI.js');


gulp.task('bower', function () {
	gulp.src('./src/index.html')
		.pipe(wiredep({
			directory: 'src/bower_components'
		}))
		.pipe(gulp.dest('./src'))
		.on('end', function(){
			return gulp.src('./src/bower_components/components-font-awesome/fonts/*.*')
				.pipe(gulp.dest('src/fonts'));
		});
});

gulp.task('clean', function(){
	return gulp.src('dist', {read: false})
		.pipe(rimraf())
		.on('end', function(){
			return gulp.src([
					'src/**/*.*',
					'!src/bower_components/**/*.*',
					'!src/css/**/*.*',
					'!src/js/**/*.*',
					'!src/ts/**/*.*',
					'!src/typings/**/*.*',
					'!src/index.html'
				])
				.pipe(gulp.dest('dist'));
		});
});

gulp.task('build', ['clean', 'typescript'], function () {
		return gulp.src('src/*.*')
				.pipe(useref())
				.pipe(gulpif('*.js', uglify({mangle: false})))
				.pipe(gulpif('*.css', uncss({
					html: ['src/*.html', 'src/**/*.html'],
					ignore: [
							 '.fa',
							 /.fa+/g,
							 '.fa-fw',
							 '.fa-lg',
							 '.fa-spinner',
							 '.fa-stack',
							 '.fa-stack-2x','.fa-stack-1x',
							 '.fa-pulse',
							 '.fa-2x','.fa-5x',
							 '.fa-refresh', '.fa-spin',
							 '.fa-sort-amount-desc',
							 '.fa-sort-amount-asc',
							 '.fa-caret-left', '.fa-caret-right',
							 '.ng-invalid.ng-dirty',
							 '.ng-valid.ng-dirty',
							 '.bootstrap-datetimepicker-widget',
							 /.bootstrap-datetimepicker-widget+/,
							 /.bootstrap-datetimepicker-widget +/,
							 '.table-condensed',
							 /.table-condensed+/,
							 /.table-condensed +/,
							 '.sr-only', '.list-unstyled',
							 /.leftMenu/,
							 /.rightPanel/,
							 /.nav+/g,
							 /lang-directive/,
							 /user-additional +/g,
							 /user-main +/g,
							 /form-control/,
							 'form hr.col-xs-12'
					]
				})))
				.pipe(gulpif('*.css', minifyCss()))
				.pipe(gulp.dest('dist'));
});

gulp.task('change', function(){
	gulp.src(['./src/**/*.css',
						// './src/**/*.js',
						'./src/**/init.js',
						'./src/**/*.html'])
			.pipe(server.notify());
});

gulp.task('typescript', function(){
	return gulp.src('./src/ts/**/*.ts')
		.pipe(tsc({target: 'ES5'}))
		.pipe(gulp.dest('src/js'));
});

gulp.task('watch', function(){
	// server.run([
	// 	'testAPI.js'
	// ], {}, 35729);
	server.start();

	gulp.watch(['./src/**/*.css',
							// './src/**/*.js',
							'./src/**/init.js',
							'./src/**/*.html'], ['change']);
	gulp.watch('src/ts/**/*.ts', ['typescript']);
});

gulp.task('default', ['watch']);