//TODO Swap out source compiles with handlebars setup

const gulp = require('gulp');

// Jekyll Tools
const child = require('child_process'); //?
const gutil = require('gulp-util');

//Source Tools
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const clean = require('gulp-clean');
const sourcemaps = require('gulp-sourcemaps');
const	autoprefixer = require('gulp-autoprefixer');
const	plumber = require('gulp-plumber');
const	cssnano = require('gulp-cssnano');
const	jshint = require('gulp-jshint');
const	stylish = require('jshint-stylish');
const ts = require('gulp-typescript');

// Image Tools
const	svgmin = require('gulp-svgmin');
const	svgstore = require('gulp-svgstore');
const	svgfallback = require('gulp-svgfallback');
const	imagemin = require('gulp-imagemin');
const	imageminPngquant = require('imagemin-pngquant');
const	imageminJpegcompress = require('imagemin-jpeg-recompress');

// Live Reload Tools
const browserSync = require('browser-sync').create();
const siteRoot = '_site';
// const cssFiles = '_css/**/*.?(s)css';

  basepaths = {
          src: 'source',
          dest: 'assets'
      },

    paths = {
        js: {
            src: basepaths.src + '/js',
            dest: basepaths.dest + '/js',
            node: 'node_modules'
            // bower: 'bower_components'
        },
        ts: {
		            src: basepaths.src + '/js/ts'
		        },
        css: {
            src: basepaths.src + '/sass',
            dest: basepaths.dest
        },
        images: {
            src: basepaths.src + '/img',
            dest: basepaths.dest + '/img'
        },
        svgs: {
            src: basepaths.src + '/svg',
            dest: basepaths.dest + '/svg'
        },
        templates: {
          includes: './_includes',
          layouts: './_layouts',
          posts: './_posts'
        },
    };

/*
 Styles - Clean
 */
gulp.task('clean-styles', function () {
    return gulp.src(['style.css', 'style.css.map'], {read: false})
        .pipe(clean());
});

/*
 Styles Task
 */
gulp.task('styles', ['clean-styles'], function() {
    gulp.src(paths.css.src + '/**/*.scss')
        .pipe(plumber({
            errorHandler: function(error) {
                console.log('Styles Error: ' + error.message);
                this.emit('end');
            }
        }))

        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer('last 2 version'))
        .pipe(cssnano())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.css.dest))
});

// gulp.task('styles', () => {
//   gulp.src(paths.css.src + '/**/*.scss')
//     .pipe(sass())
//     .pipe(concat('styles.css'))
//     .pipe(gulp.dest(paths.css.dest));
// });



/*
 Scripts - Clean
 */
gulp.task('clean-scripts', function () {
    return gulp.src(paths.js.dest + '/all.min.js', {read: false})
        .pipe(clean());
});

/*
 Scripts - Hint
 */
gulp.task('hint', ['clean-scripts'], function() {
    return gulp.src(paths.js.src + '/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});

/*
 * Scripts - copy vendor folder from source to public
 */
gulp.task('vendor', function () {
    return gulp.src(
        [
            paths.js.src + '/vendor/**/*.js',
            paths.js.src + '/vendor/**/*.swf'
        ])
        .pipe(plumber({
            errorHandler: function (error) {
                console.log('Scripts Error: ' + error.message);
                this.emit('end');
            }
        }))
        .pipe(gulp.dest(paths.js.dest));
});


/*
Scripts - Compile Typescript
*/

gulp.task('typescript', function () {
	// console.log(paths.ts.src + '/**/*.ts');
	// console.log(paths.ts.dest);
    gulp.src(paths.ts.src + '/**/*.ts')
        .pipe(ts({
            noImplicitAny: true
        }))

        .pipe(gulp.dest(paths.ts.src));
});


/*
 Scripts - Concat and Uglify
 */
gulp.task('scripts', ['hint','vendor'],  function() {
    gulp.src([
            paths.js.node + '/svg4everybody/dist/svg4everybody.min.js',
            paths.js.node + '/picturefill/dist/picturefill.min.js',
            paths.js.src + '/**/*.js',

            // the vendor directory is used for client code (code we shouldn't touch)
            '!' + paths.js.src + '/vendor/**/*.js'
        ])
        .pipe(plumber({
            errorHandler: function(error) {
                console.log('Scripts Error: ' + error.message);
                this.emit('end');
            }
        }))
				.pipe(sourcemaps.init())
        .pipe(uglify({ mangle: false }))
				.pipe(concat('all.min.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.js.dest))
});

// Images
gulp.task('images', function () {

  return gulp.src(paths.images.src + '/**/*.{png,jpeg,jpg,svg,gif}')
  .pipe(plumber(function (err) {
    console.log('Images Task Error');
    console.log(err);
    this.emit('end');
  }))
  .pipe(imagemin(
    [
      imagemin.gifsicle(),
      imagemin.jpegtran(),
      imagemin.optipng(),
      imagemin.svgo(),
      imageminPngquant(),
      imageminJpegcompress()
    ]
  ))
  .pipe(gulp.dest(paths.images.dest))
});


/*
 SVG - Sprite and Minify
 */
gulp.task('svg', function() {
    return gulp.src(paths.svgs.src + '/**/*.svg')
        .pipe(svgmin(function (file) {
            return {
                plugins: [{
                    cleanupIDs: {
                        minify: true
                    }
                }]
            }
        }))
        .pipe(svgstore())
        .pipe(gulp.dest(paths.svgs.dest))
});


/*
 Jekyll - Compile Jekyll
 */

gulp.task('jekyll', () => {
  const jekyll = child.spawn('bundle', ['exec', 'jekyll', 'build',
    // '--watch',
    // '--incremental',
    '--drafts'
  ]);

  const jekyllLogger = (buffer) => {
    buffer.toString()
      .split(/\n/)
      .forEach((message) => gutil.log('Jekyll: ' + message));
  };

  jekyll.stdout.on('data', jekyllLogger);
  jekyll.stderr.on('data', jekyllLogger);
});

gulp.task('serve', () => {
  browserSync.init({
    files: [siteRoot + '/**'],
    port: 4000,
    server: {
      baseDir: siteRoot
    }
  });

  gulp.watch(paths.css.src + '/**/*.scss', ['styles', 'jekyll']);
  gulp.watch(paths.templates.includes + '/**/*.html', ['jekyll']);
  gulp.watch(paths.templates.layouts + '/**/*.html', ['jekyll']);
  gulp.watch(paths.templates.posts + '/**/*.html', ['jekyll']);
});




gulp.task('default', ['styles', 'jekyll', 'serve']);

gulp.task("default", ['images', 'styles', 'typescript', 'hint', 'scripts', 'svg', 'jekyll', 'serve'], function() {

	console.log('starting watch task');
	gulp.watch(paths.css.src + '/**/*.scss', ['styles']);
	gulp.watch(paths.ts.src + '/**/*.ts', ['typescript']);
	gulp.watch(paths.js.src + '/**/*.js', ['hint']);
	gulp.watch(paths.js.src + '/**/*.js', ['scripts']);
	gulp.watch(paths.svgs.src + '/**/*.svg', ['svg']);
	gulp.watch(paths.images.src + '/**/*.{png,jpeg,jpg,svg,gif}', ['images']);
  gulp.watch(paths.templates.includes + '/**/*.html', ['jekyll']);
  gulp.watch(paths.templates.layouts + '/**/*.html', ['jekyll']);
  gulp.watch(paths.templates.posts + '/**/*.html', ['jekyll']);
});
