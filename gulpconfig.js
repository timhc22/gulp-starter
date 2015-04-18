var SRC = "./src";
var DEST = "./build";

module.exports = {
    browserSync: {
        server: {
            // Serve up our build folder
            baseDir: DEST
        }
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
    //TODO CURRENTLY TEMPLATES ARE IN JS AND HTML FORMAT (WHEN USING JST)
    markup: {
        src: SRC + "/views/**",
        dest: DEST
    },
    //compiled js file with html templates
    //TODO CURRENTLY TEMPLATES ARE IN JS AND HTML FORMAT (WHEN USING JST)
    templates: {
        src: SRC + '/views/*.html',
        dest: SRC + "/javascript" //if needs to be added to functions.js for use with browserify
        //dest: DEST + "/templates" //if needs to be included separately
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
        //htmlSrc: DEST + '/templates/*.js', //todo needed?
        dest: DEST
    }
};