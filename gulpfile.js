'use strict';

const bs = require('browser-sync').create(),
      cssmin = require('gulp-cssmin'),
      del = require('del'),
      imagemin = require('gulp-imagemin'),
      gulp = require('gulp'),
      notify = require('gulp-notify'),
      prefix = require('gulp-autoprefixer'),
      rename = require('gulp-rename'),
      sass = require('gulp-sass'),
      uncss = require('gulp-uncss');

gulp.task('html', function () {
    return gulp.src('./index.html')
        .pipe(gulp.dest('./build'));
});

gulp.task('sass', ['html'] ,function () {
    return gulp.src('./src/sass/styles.scss')
        .pipe(sass().on('error', notify.onError({title: 'sass'})))
        // .pipe(uncss({html: ['./build/index.html']}))
        .pipe(prefix({browsers: ['last 2 versions', 'safari 5', 'ie 10', 'opera 12.1', 'ios 6', 'android 4'], cascade: true}))
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./build'))
        .pipe(bs.stream());
});

gulp.task('server', function () {
    bs.init({
        server: {
            baseDir: ""
        }
    });
    gulp.watch('./build/index.html').on('change', bs.reload);
});

gulp.task('watch', function () {
    gulp.watch('./*.html', ['html']);
    gulp.watch('./src/sass/**/*.scss', ['sass']);
});

gulp.task('clean', function () {
    return del('./build/*');
});

gulp.task('image', function () {
    return gulp.src('./src/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./build/img'))
});

gulp.task('fonts', function () {
    return gulp.src('./src/fonts/*')
        .pipe(gulp.dest('./build/fonts'))
});

gulp.task('js', function () {
    return gulp.src('./src/js/*.js')
        .pipe(gulp.dest('./build/js'))
});

gulp.task('build', ['clean', 'html', 'sass', 'js', 'image', 'fonts']);

gulp.task('default', ['html', 'sass', 'js', 'server', 'watch']);
