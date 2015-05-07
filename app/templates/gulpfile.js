'use strict';
// generated on <%= (new Date).toISOString().split('T')[0] %> using <%= pkg.name %> <%= pkg.version %>
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var reload = browserSync.reload;

gulp.task('styles', function() {
    return gulp.src('src/styles/*.scss')
        .pipe($.sourcemaps.init())
        .pipe($.sass({
            outputStyle: 'nested',
            includePaths: ['.'],
            onError: console.error.bind(console, 'Sass error:')
        }))
        .pipe($.postcss([
            require('autoprefixer-core')({
                browsers: ['last 5 version']
            })
        ]))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest('dist'))
        .pipe(reload({
            stream: true
        }));
});

gulp.task('styles-min', ['styles'], function() {
    return gulp.src('dist/*.css')
        .pipe($.csso())
        .pipe($.rename({
            suffix: ".min",
        }))
        .pipe($.size({
            title: 'styles'
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('js', function() {
    return gulp.src('src/scripts/*.js')
        .pipe(gulp.dest('dist'));
});

gulp.task('js-min', ['js'], function() {
    return gulp.src('dist/*.js')
        .pipe($.uglify())
        .pipe($.rename({
            suffix: ".min",
        }))
        .pipe($.size({
            title: 'scripts'
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('images', function() {
    return gulp.src('src/images/**/*')
        .pipe($.cache($.imagemin({
            progressive: true,
            interlaced: true,
            svgoPlugins: [{
                cleanupIDs: false
            }]
        })))
        .pipe($.size({
            title: 'images'
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('clean', require('del').bind(null, ['dist']));

gulp.task('serve', ['default'], function() {
    browserSync({
        notify: false,
        port: 9000,
        server: {
            baseDir: ['./','dist']
        }
    });

    gulp.watch([
        '*.html',
        'dist/**/*'
    ]).on('change', reload);

    gulp.watch('src/styles/**/*.scss', ['styles']);
    gulp.watch('src/scripts/**/*.js', ['js']);
    gulp.watch('src/images/**/*', ['images']);
});

gulp.task('default', ['styles', 'js', 'images'], function() {
    return gulp.src('dist/**/*').pipe($.size({
        title: 'default'
    }));
});

gulp.task('dist', ['styles-min', 'js-min', 'images'], function() {
    return gulp.src('dist/**/*').pipe($.size({
        title: 'dist'
    }));
});

gulp.task('build', ['clean'], function() {
    gulp.start('dist');
});

gulp.task('deploy', ['build'], function() {
    return gulp.src([
        'index.html',
        'mobile-detect.js',
        'dist/**/*'
        ])
        .pipe($.ghPages({
            message: "Deploy automático [timestamp]"
        }));
});
