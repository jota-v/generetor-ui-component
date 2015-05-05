'use strict';
// generated on <%= (new Date).toISOString().split('T')[0] %> using <%= pkg.name %> <%= pkg.version %>
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var reload = browserSync.reload;

gulp.task('styles', function() { <%
    if (includeSass) { %>
    return gulp.src('src/styles/*.scss')
        .pipe($.sourcemaps.init())
        .pipe($.sass({
            outputStyle: 'nested',
            precision: 10,
            includePaths: ['.'],
            onError: console.error.bind(console, 'Sass error:')
        })) <%
    } else { %>
    return gulp.src('src/styles/*.css')
        .pipe($.sourcemaps.init()) <%
    } %>
        .pipe($.postcss([
            require('autoprefixer-core')({
                browsers: ['last 5 version']
            })
        ]))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest('.tmp/styles'))
        .pipe(reload({
            stream: true
        }));
});

gulp.task('html', ['styles'], function() {
    var assets = $.useref.assets({
        searchPath: ['.tmp', 'src', '.']
    });

    return gulp.src('src/*.html')
        .pipe(assets)
        .pipe($.if('*.js', $.uglify()))
        .pipe($.if('*.css', $.csso()))
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe($.if('*.html', $.minifyHtml({
            empty:true,
            conditionals: true
        })))
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
        .pipe(gulp.dest('dist/images'));
});

gulp.task('clean', require('del').bind(null, ['.tmp', 'dist', 'swift']));

gulp.task('serve', ['styles'], function() {
    browserSync({
        notify: false,
        port: 9000,
        server: {
            baseDir: ['.tmp', 'src'],
            routes: {
                '/bower_components': 'bower_components'
            }
        }
    });

    gulp.watch([
        'src/*.html',
        'src/scripts/**/*.js',
        'src/images/**/*'
    ]).on('change', reload);

    gulp.watch('src/styles/**/*.<%= includeSass ? 'scss' : 'css' %>', ['styles']);
});

gulp.task('serve:dist', function() {
    browserSync({
        notify: false,
        port: 9000,
        server: {
            baseDir: ['dist']
        }
    });
});

gulp.task('default', ['html', 'images'], function() {
    return gulp.src('dist/**/*').pipe($.size({
        title: 'default'
    }));
});

gulp.task('swift',['default'], function() {
    return gulp.src([
        'dist/*/**.min.*',
        'dist/*/**.jpg',
        'dist/*/**.png',
        'dist/*/**.gif',
        'dist/*/**.svg'
    ], {
        dot: true
    })
    .pipe($.size({
        title: 'swift'
    }))
    .pipe(gulp.dest('swift'));
});

gulp.task('build', ['clean'], function() {
    gulp.start('swift');
});

gulp.task('deploy', ['build'], function() {
    return gulp.src('dist/**/*')
        .pipe($.ghPages({
            message: "Deploy automático [timestamp]"
        }));
});
