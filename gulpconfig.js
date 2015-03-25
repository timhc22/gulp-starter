var DEST = "./build";
var SRC = "./src";

module.exports = {
    browserSync: {
        server: {
            // Serve up our build folder
            baseDir: DEST
        }
    },
    sass: {
        src: SRC + "/sass/**/*.{sass,scss}",
        dest: DEST,
        settings: {
            indentedSyntax: true, // Enable .sass syntax!
            imagePath: 'images' // Used by the image-url helper
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
                entries: SRC + '/javascript/page.js',
                dest: DEST,
                outputName: 'page.js',
                // list of externally available modules to exclude from the bundle
                external: ['jquery', 'underscore']
                // list of modules to make require-able externally
                //require: ['jquery', 'backbone/node_modules/underscore']
            }
        ]
    },
    production: {
        cssSrc: DEST + '/*.css',
        jsSrc: DEST + '/*.js',
        dest: DEST
    }
};