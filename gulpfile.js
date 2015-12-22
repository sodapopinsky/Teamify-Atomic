var gulp = require('gulp')
var sass = require('gulp-ruby-sass')
var browserify = require('browserify')
var source = require('vinyl-source-stream')
var notify = require("gulp-notify");





gulp.task('sass', function() {
    return sass('app/sass/app.scss',{cacheLocation: './sass-cache',style: 'expanded', emitCompileError: true})
        .on('error', notify.onError(function (error) {
            return 'An error occurred while compiling sass.\nLook in the console for details.\n' + error;
        }))

        .pipe(gulp.dest('public/css'))
});


gulp.task('browserify', function() {
    return browserify({
        entries: [
            'app/js/app.js'
        ] })
        .bundle()
        .pipe(source('main.js'))
        // saves it the public/js/ directory
        .pipe(gulp.dest('./public/js/'));
})



gulp.task('watch', function() {
    gulp.watch('./app/sass/app.scss', ['sass'])
    gulp.watch('./app/js/**/*.js', ['browserify'])
})