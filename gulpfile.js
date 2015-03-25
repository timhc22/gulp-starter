var gulp            = require('gulp'),
    browserify      = require('browserify'),
    watchify        = require('watchify'),
    mergeStream     = require('merge-stream'),
    source          = require('vinyl-source-stream'),
    _               = require('lodash'),
    changed         = require('gulp-changed'),
    imagemin        = require('gulp-imagemin'),
    karma           = require('karma'),
    minifyCSS       = require('gulp-minify-css'),
    size            = require('gulp-filesize'),
    browserSync     = require('browser-sync'),
    sass            = require('gulp-sass'),
    sourcemaps      = require('gulp-sourcemaps'),
    autoprefixer    = require('gulp-autoprefixer'),
    uglify          = require('gulp-uglify'),
    gutil           = require('gulp-util'),
    prettyHrtime    = require('pretty-hrtime'),
    notify          = require("gulp-notify"),
    plumber         = require('gulp-plumber'), //Prevent pipe breaking caused by errors from gulp plugins
    startTime
;

var config          = require('./gulpconfig');

gulp.task('default', ['sass', 'images', 'markup', 'watch']);

gulp.task('sass', function () {
    return gulp.src(config.sass.src)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass(config.sass.settings))
        .on('error', handleErrors)
        .pipe(sourcemaps.write())
        .pipe(autoprefixer({ browsers: ['last 2 version'] }))
        .pipe(gulp.dest(config.sass.dest))
        .pipe(browserSync.reload({stream:true}));
});

// Run this to compress all the things!
gulp.task('production', ['karma'], function(){
    // This runs only if the karma tests pass
    gulp.start(['markup', 'images', 'minifyCss', 'uglifyJs'])
});

gulp.task('markup', function() {
    return gulp.src(config.markup.src)
        .pipe(gulp.dest(config.markup.dest))
        .pipe(browserSync.reload({stream:true}));
});

gulp.task('images', function() {
    return gulp.src(config.images.src)
        .pipe(changed(config.images.dest)) // Ignore unchanged files
        .pipe(imagemin()) // Optimize
        .pipe(gulp.dest(config.images.dest))
        .pipe(browserSync.reload({stream:true}));
});

gulp.task('minifyCss', ['sass'], function() {
    return gulp.src(config.production.cssSrc)
        .pipe(minifyCSS({keepBreaks:true}))
        .pipe(gulp.dest(config.production.dest))
        .pipe(size());
});

gulp.task('uglifyJs', ['browserify'], function() {
    return gulp.src(config.production.jsSrc)
        .pipe(uglify())
        .pipe(gulp.dest(config.production.dest))
        .pipe(size());
});

gulp.task('watch', ['watchify','browserSync'], function() {
    gulp.watch(config.sass.src,   ['sass']);
    gulp.watch(config.images.src, ['images']);
    gulp.watch(config.markup.src, ['markup']);
    // Watchify will watch and recompile our JS, so no need to gulp.watch it
});

gulp.task('browserSync', function() {
    browserSync(config.browserSync);
});

gulp.task('watchify', function() {
    // Start browserify task with devMode === true
    return browserifyTask(config.browserify, true);
});

gulp.task('browserify', function() {
    return browserifyTask(config.browserify, false)
});

gulp.task('karma', karmaTask);

var karmaTask = function(done) {
    karma.server.start({
        configFile: process.cwd() + '/karma.conf.js',
        singleRun: true
    }, done);
};

/*
Bundle javascripty things with browserify!
This task is set up to generate multiple separate bundles, from
different sources, and to use Watchify when run from the default task.
*/
var browserifyTask = function(config, devMode) {

    var browserifyThis = function(bundleConfig) {

        if(devMode) {
            // Add watchify args and debug (sourcemaps) option
            _.extend(bundleConfig, watchify.args, { debug: true });
            // A watchify require/external bug that prevents proper recompiling, so (for now) we'll ignore these
            // options during development. Running `gulp browserify` directly will properly require and externalize.
            bundleConfig = _.omit(bundleConfig, ['external', 'require']);
        }

        var b = browserify(bundleConfig);

        var bundle = function() {
            // Log when bundling starts
            bundleLogger.start(bundleConfig.outputName);

            return b
                .bundle()
                // Report compile errors
                .on('error', handleErrors)
                // Use vinyl-source-stream to make the stream gulp compatible. Specify the desired output filename here.
                .pipe(source(bundleConfig.outputName))
                // Specify the output destination
                .pipe(gulp.dest(bundleConfig.dest))
                .pipe(browserSync.reload({
                    stream: true
                }));
        };

        if(devMode) {
            // Wrap with watchify and rebundle on changes
            b = watchify(b);
            // Rebundle on update
            b.on('update', bundle);
            bundleLogger.watch(bundleConfig.outputName);
        } else {
            // Sort out shared dependencies. b.require exposes modules externally
            if(bundleConfig.require) b.require(bundleConfig.require);
            // b.external excludes modules from the bundle, and expects they'll be available externally
            if(bundleConfig.external) b.external(bundleConfig.external);
        }

        return bundle();
    };

    // Start bundling with Browserify for each bundleConfig specified
    return mergeStream.apply(gulp, _.map(config.bundleConfigs, browserifyThis));
};

//Gulp Style Logs
var bundleLogger = {
    start: function(filepath) {
        startTime = process.hrtime();
        gutil.log('Bundling', gutil.colors.green(filepath) + '...');
    },

    watch: function(bundleName) {
        gutil.log('Watching files required by', gutil.colors.yellow(bundleName));
    },

    end: function(filepath) {
        var taskTime = process.hrtime(startTime);
        var prettyTime = prettyHrtime(taskTime);
        gutil.log('Bundled', gutil.colors.green(filepath), 'in', gutil.colors.magenta(prettyTime));
    }
};

//Better Error message
var handleErrors = function() {
    var args = Array.prototype.slice.call(arguments);

    // Send error to notification center with gulp-notify
    notify.onError({
        title: "Compile Error",
        message: "<%= error %>"
    }).apply(this, args);

    // Keep gulp from hanging on this task
    this.emit('end');
};