//include user configs
var config = require('./config');

var SRC = "./src";
var DEST = "./web";

module.exports = {
    browserSync: {
        proxy: config.SERVER //user parameter
        //TODO WHAT DOES THIS DO??
        //ghostMode: {
        //    clicks: false,
        //    location: false,
        //    forms: false,
        //    scroll: false
        //}
        //server: {
            // Serve up our build folder
            //baseDir: DEST
            //baseDir:'.'
        //}
    },
    sass: {
        src: SRC + "/sass/**/*.{sass,scss}",
        dest: DEST + '/css/',
        settings: {
            imagePath: 'images' // Used by the image-url helper
            //errorLogToConsole: true
            //outputStyle: 'compressed'
        }
    },
    images: {
        src: SRC + "/images/**",
        dest: DEST + "/images"
    },
    markup: {
        src: SRC + "/views/**",
        dest: DEST
    },
    iconFonts: {
        name: 'Gulp Starter Icons',
        src: SRC + '/icons/*.svg',
        dest: DEST + '/fonts',
        sassDest: SRC + '/sass',
        template: './src/sass/template.sass.swig',
        sassOutputName: '_AUTOGENicons.sass',
        fontPath: '../fonts',
        className: 'icon',
        options: {
            fontName: 'Post-Creator-Icons',
            appendCodepoints: true,
            normalize: false
        }
    },
    browserify: {
        // A separate bundle will be generated for each bundle config in the list below
        bundleConfigs: [
            //{
            //    //entries: SRC + '/javascript/global.coffee',
            //    dest: DEST,
            //    //outputName: 'global.js',
            //    // Additional file extentions to make optional
            //    //extensions: ['.coffee', '.hbs'],
            //    // list of modules to make require-able externally
            //    require: ['jquery', 'backbone/node_modules/underscore']
            //    // See https://github.com/greypants/gulp-starter/issues/87 for note about
            //    // why this is 'backbone/node_modules/underscore' and not 'underscore'
            //},
            {
                entries: SRC + '/javascript/functions.js',
                dest: DEST + '/js/',
                outputName: 'functions.js',
                // list of externally available modules to exclude from the bundle
                //external: ['jquery', 'underscore']
                // list of modules to make require-able externally
                //todo do i need backbone.localstorage in here?
                require: ['jquery', 'backbone/node_modules/underscore', 'backbone']
            }
        ]
    },
    production: {
        cssSrc: DEST + '/css/*.css',
        jsSrc: DEST + '/js/*.js',
        dest: DEST
    }
};