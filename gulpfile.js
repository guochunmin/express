var gulp = require('gulp');
var path = require('path');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var notify = require('gulp-notify');
var cache = require('gulp-cache');
var cached = require('gulp-cached');
var remember = require('gulp-remember');

var browserSync = require('browser-sync').create();
var nodemon = require('gulp-nodemon');
var livereload = require('gulp-livereload');

var del = require('del');

var miniHtml = require('gulp-htmlmin');

var less = require('gulp-less');
var cssBase64 = require('gulp-base64');
var miniCss = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');

var jshint = require('gulp-jshint');
var miniJs = require('gulp-uglify');

var miniImg = require('gulp-imagemin');

// 删除文件
gulp.task('clean', function(cb) {
    del(['dist/views/**/*','dist/css/**/*', 'dist/js/**/*', 'dist/images/**/*','dist/libs/**/*'], cb);
});
// 删除ejs文件
gulp.task('cleanejs', function(cb) {
    del(['dist/views/**/*'], cb);
});
// 删除css文件
gulp.task('cleanecss', function(cb) {
    del(['dist/css/**/*'], cb);
});
// 删除js文件
gulp.task('cleanejs', function(cb) {
    del(['dist/js/**/*'], cb);
});
// 删除images文件
gulp.task('cleaneimg', function(cb) {
    del(['dist/images/**/*'], cb);
});
// 删除libs文件
gulp.task('cleanlibs', function(cb) {
    del(['dist/libs/**/*'], cb);
});



// 压缩ejs
gulp.task('ejs',function() {
	return gulp
		.src('views/**/*.ejs')
		.pipe(miniHtml({
			collapseWhitespace: true
		}))
		.pipe(gulp.dest('dist/views/'))
});

//转化less，压缩合并css
gulp.task("less",["fonts"],function() {
	return gulp
		.src(['public/**/*.less'])
		.pipe(less({
			paths: [path.join(__dirname, 'less', 'includes')]
		}))
		.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(cssBase64())
		.pipe(miniCss())
		.pipe(gulp.dest('dist/css/'))
})

//打包字体文件
gulp.task('fonts', function() {
	return gulp
		.src(['public/less/fonts/**/*','!public/less/fonts/**/*.less'])
		.pipe(gulp.dest('dist/css/fonts/'))
});

//压缩合并js
gulp.task("js",function() {
	return gulp
		.src(['public/js/**/*.js'])
		.pipe(jshint.reporter('default'))
		.pipe(miniJs({
			compress: true
		}))
		.pipe(gulp.dest('dist/js/'))
});
//打包libs文件夹
gulp.task("libs",function(){
	return gulp
		.src('public/libs/**')
		.pipe(gulp.dest('dist/libs/'))
})

//压缩、打包图片
gulp.task('img',function() {
	return gulp
		.src('public/images/**/*')
		.pipe(miniImg({
			optimizationLevel: 3,
			progressive: true,
			interlaced: true
		}))
		.pipe(gulp.dest('dist/images/'))
});


//定义默认任务  
gulp.task('build',['ejs','less','js','img','libs']);

// 开启Express服务
gulp.task('nodemon',['build'],function(cb){
	var started = false;
	return nodemon({
			script: './bin/www'
		})
		.on("start",function(){
			if(!started){
				cb();
				started=true;
			}
		})
})

// 浏览器同步，用7000端口去代理Express的3000端口
gulp.task('browser-sync', ['nodemon'], function() {
 	browserSync.init(null, {
    	proxy: "http://localhost:3000",
        files: ["dist/views/*.*","dist/css/*.*","dist/js/*.*","dist/images/*.*","dist/libs/*.*"],
        browser: "chrome",
        port: 7000
 	});
	// 监听ejs
	gulp.watch('views/**/*', ['ejs']);
	// 监听所有css文档
	gulp.watch('public/less/**/*', ['less']);
	// 监听所有.js档
	gulp.watch('public/js/**/*', ['js']);
	// 监听所有图片档
	gulp.watch('public/images/**/*', ['img']);
	//监听所有引入的插件
	gulp.watch('public/libs/**/*', ['libs']);
	gulp.watch('dist/**/*').on('change',browserSync.reload);
});

//定义默认任务  
gulp.task('default',['browser-sync']);
